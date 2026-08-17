'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { initializePaystackTransaction } from '@/lib/payments/paystack';
import type { CartItem } from '@/types/ecommerce';

const isUuid = (id?: string) =>
  typeof id === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

export async function placeOrder(formData: FormData, cartItems: CartItem[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const full_name = (formData.get('full_name') as string)?.trim();
  const email = (formData.get('email') as string)?.trim();
  const phone = (formData.get('phone') as string)?.trim();
  const line1 = (formData.get('line1') as string)?.trim();
  const city = (formData.get('city') as string)?.trim();
  const state = (formData.get('state') as string)?.trim();
  const postal_code = (formData.get('postal_code') as string)?.trim();

  if (!cartItems || !cartItems.length) {
    return { error: 'Your cart is empty.' };
  }

  if (!email && !user) {
    return { error: 'Please provide a valid contact email.' };
  }

  // --- 1. SERVER-SIDE PRICE & VARIANT VERIFICATION ---
  const validVariantIds = cartItems.map(item => item.variantId).filter(isUuid);
  let variantMap = new Map<string, { id: string; price: number; stock_quantity?: number }>();

  if (validVariantIds.length > 0) {
    try {
      const { data: dbVariants, error: variantFetchError } = await supabase
        .from('product_variants')
        .select('id, price, stock_quantity')
        .in('id', validVariantIds);

      if (!variantFetchError && dbVariants) {
        variantMap = new Map(dbVariants.map((v: any) => [v.id, v]));
      } else if (variantFetchError) {
        console.warn('[placeOrder] DB variant lookup error:', variantFetchError.message);
      }
    } catch (err) {
      console.warn('[placeOrder] Variant query error:', err);
    }
  }

  let verifiedSubtotal = 0;
  const verifiedItems: Array<CartItem & { dbPrice: number }> = [];

  for (const item of cartItems) {
    const dbVar = variantMap.get(item.variantId);
    
    // Use authentic DB price if available, otherwise sanitized cart price
    const unitPrice = dbVar && !isNaN(Number(dbVar.price))
      ? Number(dbVar.price)
      : Number(item.price);

    if (isNaN(unitPrice) || unitPrice < 0) {
      return { error: `Invalid pricing for item "${item.productTitle}".` };
    }

    if (!item.quantity || item.quantity <= 0) {
      return { error: `Invalid quantity for item "${item.productTitle}".` };
    }

    verifiedSubtotal += unitPrice * item.quantity;
    verifiedItems.push({
      ...item,
      dbPrice: unitPrice,
    });
  }

  const finalTotal = verifiedSubtotal;

  // --- 2. CREATE THE ORDER ---
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user?.id ?? null,
      guest_email: user ? null : email,
      total_amount: finalTotal,
      status: 'pending',
      payment_status: 'unpaid',
      shipping_address: { full_name, line1, city, state, postal_code, phone },
    })
    .select()
    .single();

  if (orderError || !order) {
    console.error('[placeOrder] Order insertion error:', orderError);
    return { error: 'Failed to create order. Please check your details and try again.' };
  }

  // --- 3. ATOMICALLY DECREMENT STOCK (if variants exist in DB) ---
  for (const item of verifiedItems) {
    if (isUuid(item.variantId) && variantMap.has(item.variantId)) {
      try {
        await supabase.rpc('decrement_stock', {
          variant_id: item.variantId,
          qty: item.quantity,
        });
      } catch (stockErr) {
        console.warn('[placeOrder] Stock decrement RPC warning:', stockErr);
      }
    }
  }

  // --- 4. INSERT ORDER ITEMS ---
  const orderItemsToInsert = verifiedItems.map(item => ({
    order_id: order.id,
    variant_id: isUuid(item.variantId) && variantMap.has(item.variantId) ? item.variantId : null,
    quantity: item.quantity,
    unit_price: item.dbPrice,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsToInsert);

  if (itemsError) {
    console.error('[placeOrder] Failed to save order items:', itemsError);
  }

  // --- 5. INITIALIZE PAYSTACK OR REDIRECT ---
  let redirectUrl = `/checkout/success?order=${order.id}`;

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wearyung.com';
    const callbackUrl = `${siteUrl}/checkout/success`;

    const paystackResult = await initializePaystackTransaction({
      email: email || user?.email || 'customer@wearyung.com',
      amountInGHS: finalTotal,
      orderId: order.id,
      callbackUrl,
      metadata: {
        order_id: order.id,
        full_name,
        phone,
      },
    });

    if (paystackResult.success && paystackResult.authorizationUrl) {
      if (paystackResult.reference) {
        await supabase
          .from('orders')
          .update({ payment_reference: paystackResult.reference })
          .eq('id', order.id);
      }
      redirectUrl = paystackResult.authorizationUrl;
    }
  } catch (paystackErr: any) {
    if (paystackErr?.digest?.startsWith('NEXT_REDIRECT') || paystackErr?.message === 'NEXT_REDIRECT') {
      throw paystackErr;
    }
    console.warn('[placeOrder] Paystack initialization fallback:', paystackErr);
  }

  redirect(redirectUrl);
}
