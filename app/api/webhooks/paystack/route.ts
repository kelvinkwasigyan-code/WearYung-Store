import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyPaystackWebhookSignature } from '@/lib/payments/paystack';

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
      const amountPaid = data.amount / 100;
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

      console.log(`[Paystack Webhook] Order ${orderId || reference} marked as PAID via ${channel} (GH₵ ${amountPaid})`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('[Paystack Webhook Error]:', error);
    return NextResponse.json({ error: error.message || 'Webhook handler error' }, { status: 500 });
  }
}
