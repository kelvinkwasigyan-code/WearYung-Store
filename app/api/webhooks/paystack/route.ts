import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyPaystackWebhookSignature } from '@/lib/payments/paystack';
import { sendSaleAdminAlert } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-paystack-signature');

    // 1. Verify webhook authenticity
    const isValid = await verifyPaystackWebhookSignature(rawBody, signature);
    if (!isValid && process.env.NODE_ENV === 'production') {
      console.warn('[Paystack Webhook] Signature verification failed');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    // 2. Handle successful charge
    if (event.event === 'charge.success') {
      const data = event.data;
      const reference = data.reference;
      const orderId = data.metadata?.order_id;
      const amountInGHS = Number(data.amount) / 100;
      const channel = data.channel; // 'card', 'mobile_money', etc.

      const supabase = createAdminClient();

      // Find existing order
      let orderQuery = supabase
        .from('orders')
        .select('id, payment_status, status, user_id, guest_email');

      if (orderId && !orderId.startsWith('temp_')) {
        orderQuery = orderQuery.eq('id', orderId);
      } else {
        orderQuery = orderQuery.eq('payment_reference', reference);
      }

      const { data: existingOrder, error: orderFetchError } = await orderQuery.maybeSingle();

      if (orderFetchError) {
        console.error('[Paystack Webhook] Error finding order:', orderFetchError);
      }

      // Check if order was already marked paid (Idempotency)
      const isAlreadyPaid = existingOrder?.payment_status === 'paid';

      if (existingOrder && !isAlreadyPaid) {
        // Update order status to paid
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            payment_status: 'paid',
            status: 'processing',
            payment_reference: reference,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingOrder.id);

        if (updateError) {
          console.error('[Paystack Webhook] Failed to update order status:', updateError);
          return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
        }

        console.log(`[Paystack Webhook] Order ${existingOrder.id} marked as PAID via ${channel} (GH₵ ${amountInGHS})`);
      }

      // 3. Fetch order items for the sale alert email
      const targetOrderId = existingOrder?.id || orderId;
      let orderItems: Array<{ title: string; quantity: number; price: number; sku?: string }> = [];

      if (targetOrderId) {
        const { data: dbItems } = await supabase
          .from('order_items')
          .select('quantity, unit_price, variant_id, product_variants:variant_id(sku, product:products(title))')
          .eq('order_id', targetOrderId);

        if (dbItems && dbItems.length > 0) {
          orderItems = dbItems.map((item: any) => ({
            title: item.product_variants?.product?.title || 'Wear Yung Apparel',
            quantity: item.quantity,
            price: Number(item.unit_price) || 0,
            sku: item.product_variants?.sku || '',
          }));
        }
      }

      // Fallback items from metadata if DB items were empty
      if (!orderItems.length && Array.isArray(data.metadata?.custom_fields)) {
        orderItems = data.metadata.custom_fields.map((it: any) => ({
          title: it.productTitle || it.title || 'Item',
          quantity: it.quantity || 1,
          price: Number(it.price) || 0,
          sku: it.sku || '',
        }));
      }

      // 4. Send Sale Alert Email to Admin (only on first confirmation)
      if (!isAlreadyPaid) {
        try {
          await sendSaleAdminAlert({
            orderId: reference,
            amount: amountInGHS,
            customerEmail: data.customer?.email || existingOrder?.guest_email || 'Customer',
            items: orderItems,
          });
        } catch (emailError) {
          console.error('[Paystack Webhook] Non-fatal email alert error:', emailError);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('[Paystack Webhook Error]:', error);
    return NextResponse.json({ error: error.message || 'Webhook handler error' }, { status: 500 });
  }
}
