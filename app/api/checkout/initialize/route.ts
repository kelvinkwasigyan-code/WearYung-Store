import { NextRequest, NextResponse } from 'next/server';
import { initializePaystackTransaction } from '@/lib/payments/paystack';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, amount, amountInPesewas, orderId, items, callbackUrl } = body;

    if (!email) {
      return NextResponse.json({ error: 'Missing customer email' }, { status: 400 });
    }

    const supabase = await createClient();
    let verifiedAmountInGHS: number | null = null;

    // 1. If an orderId is provided, look up the authentic total_amount from the database
    if (orderId && typeof orderId === 'string' && !orderId.startsWith('temp_')) {
      const { data: dbOrder } = await supabase
        .from('orders')
        .select('total_amount, status, payment_status')
        .eq('id', orderId)
        .maybeSingle();

      if (dbOrder && typeof dbOrder.total_amount === 'number' && dbOrder.total_amount > 0) {
        verifiedAmountInGHS = dbOrder.total_amount;
      }
    }

    // 2. If raw cart items are provided, calculate total using authentic DB prices
    if (verifiedAmountInGHS === null && Array.isArray(items) && items.length > 0) {
      const variantIds = items.map((it: any) => it.variantId || it.variant_id).filter(Boolean);

      if (variantIds.length > 0) {
        const { data: dbVariants } = await supabase
          .from('product_variants')
          .select('id, price')
          .in('id', variantIds);

        if (dbVariants && dbVariants.length > 0) {
          const priceMap = new Map(dbVariants.map((v: any) => [v.id, Number(v.price)]));
          let subtotal = 0;

          for (const it of items) {
            const varId = it.variantId || it.variant_id;
            const unitPrice = priceMap.get(varId) ?? (Number(it.price) || 0);
            const qty = Math.max(1, Number(it.quantity) || 1);
            subtotal += unitPrice * qty;
          }

          if (subtotal > 0) {
            verifiedAmountInGHS = subtotal;
          }
        }
      }
    }

    // 3. Fallback to client-provided amount only if DB verification wasn't applicable
    if (verifiedAmountInGHS === null || isNaN(verifiedAmountInGHS) || verifiedAmountInGHS <= 0) {
      const candidateAmount = amount || (amountInPesewas ? amountInPesewas / 100 : 0);
      if (!candidateAmount || candidateAmount <= 0) {
        return NextResponse.json({ error: 'Invalid checkout amount' }, { status: 400 });
      }
      verifiedAmountInGHS = Number(candidateAmount);
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wearyung.com';
    const dynamicCallbackUrl = callbackUrl || `${siteUrl}/checkout/success`;

    const result = await initializePaystackTransaction({
      email,
      amountInGHS: verifiedAmountInGHS,
      orderId: orderId || `order_${Date.now()}`,
      callbackUrl: dynamicCallbackUrl,
      metadata: {
        custom_fields: items || [],
      },
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to initialize payment' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      authorizationUrl: result.authorizationUrl,
      accessCode: result.accessCode,
      reference: result.reference,
    });
  } catch (error: any) {
    console.error('[Checkout Init API Error]:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
