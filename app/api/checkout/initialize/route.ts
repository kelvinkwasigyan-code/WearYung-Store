import { NextRequest, NextResponse } from 'next/server';
import { initializePaystackTransaction } from '@/lib/payments/paystack';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, amount, amountInPesewas, orderId, items, callbackUrl } = body;

    if (!email) {
      return NextResponse.json({ error: 'Missing customer email' }, { status: 400 });
    }

    const finalAmountInGHS = amount || (amountInPesewas ? amountInPesewas / 100 : 0);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wearyung.com';
    const dynamicCallbackUrl = callbackUrl || `${siteUrl}/checkout/success`;

    const result = await initializePaystackTransaction({
      email,
      amountInGHS: finalAmountInGHS,
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
