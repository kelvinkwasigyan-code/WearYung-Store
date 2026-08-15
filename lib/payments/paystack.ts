import crypto from 'crypto';

interface InitializePaystackParams {
  email: string;
  amountInGHS: number; // in GH₵
  orderId: string;
  callbackUrl: string;
  metadata?: Record<string, any>;
  channels?: string[]; // ['card', 'mobile_money']
}

interface PaystackInitResponse {
  success: boolean;
  authorizationUrl?: string;
  accessCode?: string;
  reference?: string;
  error?: string;
}

interface PaystackVerifyResponse {
  success: boolean;
  status?: string; // 'success' | 'failed' | 'abandoned'
  amount?: number;
  currency?: string;
  reference?: string;
  channel?: string;
  paidAt?: string;
  customer?: { email: string };
  error?: string;
}

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function initializePaystackTransaction({
  email,
  amountInGHS,
  orderId,
  callbackUrl,
  metadata = {},
  channels = ['card', 'mobile_money'],
}: InitializePaystackParams): Promise<PaystackInitResponse> {
  const reference = `WY-${orderId.slice(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

  // If secret key is not provided, use simulated test checkout mode
  if (!PAYSTACK_SECRET_KEY || PAYSTACK_SECRET_KEY.includes('placeholder')) {
    console.warn('[Paystack] PAYSTACK_SECRET_KEY not found in environment. Using Sandbox Test Mode.');
    const sandboxUrl = `${callbackUrl}?order=${orderId}&reference=${reference}&status=success&sandbox=true`;
    return {
      success: true,
      authorizationUrl: sandboxUrl,
      accessCode: `sandbox_${Date.now()}`,
      reference,
    };
  }

  try {
    const amountInPesewas = Math.round(amountInGHS * 100);

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amountInPesewas,
        currency: 'GHS',
        reference,
        callback_url: callbackUrl,
        channels,
        metadata: {
          order_id: orderId,
          custom_fields: [
            {
              display_name: 'Store',
              variable_name: 'store',
              value: 'WEAR YUNG',
            },
            {
              display_name: 'Order ID',
              variable_name: 'order_id',
              value: orderId,
            },
          ],
          ...metadata,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.status) {
      return {
        success: false,
        error: data.message || 'Failed to initialize Paystack transaction',
      };
    }

    return {
      success: true,
      authorizationUrl: data.data.authorization_url,
      accessCode: data.data.access_code,
      reference: data.data.reference,
    };
  } catch (err: any) {
    console.error('[Paystack Init Error]:', err);
    return {
      success: false,
      error: err.message || 'Network error connecting to payment gateway',
    };
  }
}

export async function verifyPaystackTransaction(
  reference: string
): Promise<PaystackVerifyResponse> {
  // Sandbox verification
  if (reference.includes('WY-') && (!PAYSTACK_SECRET_KEY || PAYSTACK_SECRET_KEY.includes('placeholder'))) {
    return {
      success: true,
      status: 'success',
      amount: 0,
      currency: 'GHS',
      reference,
      channel: 'mobile_money',
      paidAt: new Date().toISOString(),
    };
  }

  if (!PAYSTACK_SECRET_KEY) {
    return { success: false, error: 'PAYSTACK_SECRET_KEY not configured' };
  }

  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = await response.json();

    if (!response.ok || !data.status) {
      return {
        success: false,
        error: data.message || 'Failed to verify transaction with Paystack',
      };
    }

    const tx = data.data;
    return {
      success: tx.status === 'success',
      status: tx.status,
      amount: tx.amount / 100, // convert pesewas back to GH₵
      currency: tx.currency,
      reference: tx.reference,
      channel: tx.channel,
      paidAt: tx.paid_at,
      customer: {
        email: tx.customer?.email,
      },
    };
  } catch (err: any) {
    console.error('[Paystack Verify Error]:', err);
    return {
      success: false,
      error: err.message || 'Error communicating with Paystack verification API',
    };
  }
}

export function verifyPaystackWebhookSignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  if (!PAYSTACK_SECRET_KEY || !signatureHeader) return false;
  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest('hex');
  return hash === signatureHeader;
}
