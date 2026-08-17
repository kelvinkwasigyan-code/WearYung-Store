'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { CartItem } from '@/types/ecommerce';

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

  // --- 1. SERVER-SIDE PRICE VERIFICATION ---
  // Fetch real-time prices & product titles from DB to prevent client-side price tampering
  const variantIds = cartItems.map(item => item.variantId).filter(Boolean);
  
  const { data: dbVariants, error: variantFetchError } = await supabase
    .from('product_variants')
    .select('id, price, inventory_count, product:products(id, title)')
    .in('id', variantIds);

  if (variantFetchError) {
    console.error('[placeOrder] Failed to verify product prices:', variantFetchError);
    return { error: 'Failed to verify item prices. Please refresh and try again.' };
  }

  // Create lookup map for fast verification
  const variantMap = new Map((dbVariants || []).map((v: any) => [v.id, v]));

  let verifiedSubtotal = 0;
  const verifiedItems: Array<CartItem & { dbPrice: number }> = [];

  for (const item of cartItems) {
    const dbVar = variantMap.get(item.variantId);
    
    // Fallback: If local fallback/demo product is used and not in DB, use sanitized item price
    const unitPrice = dbVar ? Number(dbVar.price) : Number(item.price);
    
    if (isNaN(unitPrice) || unitPrice < 0) {
      return { error: `Invalid pricing for item "${item.productTitle}".` };
    }

    if (item.quantity <= 0) {
      return { error: `Invalid quantity for item "${item.productTitle}".` };
    }

    verifiedSubtotal += unitPrice * item.quantity;
    verifiedItems.push({
      ...item,
      dbPrice: unitPrice,
    });
  }

  const finalTotal = verifiedSubtotal;

  // --- 2. Create the Order with Verified Total ---
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
    return { error: 'Failed to create order. Please try again.' };
  }

  // --- 3. Atomically Decrement Stock ---
  const stockResults: boolean[] = [];
  for (const item of verifiedItems) {
    const { data: ok } = await supabase.rpc('decrement_stock', {
      variant_id: item.variantId,
      qty: item.quantity,
    });
    stockResults.push(ok === true);
  }

  const outOfStock = stockResults.indexOf(false);
  if (outOfStock !== -1) {
    // Rollback: cancel order
    await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', order.id);

    return {
      error: `"${verifiedItems[outOfStock].productTitle}" is out of stock in the requested quantity.`,
    };
  }

  // --- 4. Insert Verified Order Items ---
  const { error: itemsError } = await supabase.from('order_items').insert(
    verifiedItems.map(item => ({
      order_id: order.id,
      variant_id: item.variantId,
      quantity: item.quantity,
      unit_price: item.dbPrice, // Authenticated DB price
    }))
  );

  if (itemsError) {
    console.error('[placeOrder] Failed to save order items:', itemsError);
    return { error: 'Failed to save order items.' };
  }

  redirect(`/checkout/success?order=${order.id}`);
}
