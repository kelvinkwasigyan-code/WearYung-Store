import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyPaystackWebhookSignature } from '@/lib/payments/paystack';
import { sendSaleAdminAlert } from '@/lib/email';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-paystack-signature');

    // Verify webhook authenticity
    const isValid = verifyPaystackWebhookSignature(rawBody, signature);
    if (!isValid && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    // Handle successful charge
    if (event.event === 'charge.success') {
      const data = event.data;
      const reference = data.reference;
      const orderId = data.metadata?.order_id;
      const amountInGHS = data.amount / 100;
      const channel = data.channel; // 'card', 'mobile_money', etc.

      const supabase = await createClient();

      // Find order by ID or reference
      let query = supabase.from('orders').update({
        payment_status: 'paid',
        status: 'processing',
        payment_reference: reference,
        updated_at: new Date().toISOString(),
      });

      if (orderId) {
        query = query.eq('id', orderId);
      } else {
        query = query.eq('payment_reference', reference);
      }

      const { error } = await query;

      if (error) {
        console.error('[Paystack Webhook] Failed to update order:', error);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }

      console.log(`[Paystack Webhook] Order ${orderId || reference} marked as PAID via ${channel} (GH₵ ${amountInGHS})`);

      // Determine order items for the sale alert
      let orderItems: Array<{ title: string; quantity: number; price: number; sku?: string }> = data.metadata?.custom_fields || [];

      if (!orderItems.length && orderId) {
        const { data: dbItems } = await supabase
          .from('order_items')
          .select('quantity, unit_price, product_title, sku')
          .eq('order_id', orderId);

        if (dbItems && dbItems.length > 0) {
          orderItems = dbItems.map((item: any) => ({
            title: item.product_title || 'Item',
            quantity: item.quantity,
            price: item.unit_price,
            sku: item.sku,
          }));
        }
      }

      // Send Sale Alert to Admin via Resend
      try {
        await sendSaleAdminAlert({
          orderId: data.reference,
          amount: amountInGHS,
          customerEmail: data.customer?.email || 'Customer',
          items: orderItems,
        });
      } catch (emailError) {
        console.error('[Paystack Webhook] Error sending sale alert email:', emailError);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('[Paystack Webhook Error]:', error);
    return NextResponse.json({ error: error.message || 'Webhook handler error' }, { status: 500 });
  }
}

