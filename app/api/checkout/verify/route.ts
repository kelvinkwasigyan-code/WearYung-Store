import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyPaystackTransaction } from '@/lib/payments/paystack';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get('reference');
  const orderId = searchParams.get('order');

  if (!reference && !orderId) {
    return NextResponse.json({ error: 'Missing reference or order ID' }, { status: 400 });
  }

  const supabase = await createClient();

  // If reference provided, verify with Paystack
  if (reference) {
    const result = await verifyPaystackTransaction(reference);

    if (result.success && result.status === 'success') {
      // Update order in database
      const updateData: Record<string, any> = {
        payment_status: 'paid',
        status: 'processing',
        payment_reference: reference,
        updated_at: new Date().toISOString(),
      };

      let query = supabase.from('orders').update(updateData);
      if (orderId) {
        query = query.eq('id', orderId);
      } else {
        query = query.eq('payment_reference', reference);
      }

      await query;

      return NextResponse.json({
        success: true,
        status: 'paid',
        reference,
        amount: result.amount,
        channel: result.channel,
      });
    }
  }

  // Fallback: Check existing order in database
  if (orderId) {
    const { data: order } = await supabase
      .from('orders')
      .select('id, payment_status, status, total_amount, payment_reference')
      .eq('id', orderId)
      .single();

    if (order) {
      return NextResponse.json({
        success: true,
        status: order.payment_status,
        orderStatus: order.status,
        amount: order.total_amount,
        reference: order.payment_reference,
      });
    }
  }

  return NextResponse.json({ success: false, status: 'unverified' });
}
