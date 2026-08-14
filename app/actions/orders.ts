'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { CartItem } from '@/types/ecommerce';

export async function placeOrder(formData: FormData, cartItems: CartItem[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const full_name = formData.get('full_name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const line1 = formData.get('line1') as string;
  const city = formData.get('city') as string;
  const state = formData.get('state') as string;
  const postal_code = formData.get('postal_code') as string;

  if (!cartItems.length) {
    return { error: 'Your cart is empty.' };
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 1. Create the order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user?.id ?? null,
      guest_email: user ? null : email,
      total_amount: total,
      status: 'pending',
      payment_status: 'unpaid',
      shipping_address: { full_name, line1, city, state, postal_code, phone },
    })
    .select()
    .single();

  if (orderError || !order) {
    return { error: 'Failed to create order. Please try again.' };
  }

  // 2. Atomically decrement stock & insert order items
  const stockResults: boolean[] = [];
  for (const item of cartItems) {
    // Call the decrement_stock RPC — NEVER direct UPDATE (per .antigravityrules)
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
      error: `"${cartItems[outOfStock].productTitle}" is out of stock in the requested quantity.`,
    };
  }

  // 3. Insert order items
  const { error: itemsError } = await supabase.from('order_items').insert(
    cartItems.map(item => ({
      order_id: order.id,
      variant_id: item.variantId,
      quantity: item.quantity,
      unit_price: item.price,
    }))
  );

  if (itemsError) {
    return { error: 'Failed to save order items.' };
  }

  redirect(`/checkout/success?order=${order.id}`);
}
