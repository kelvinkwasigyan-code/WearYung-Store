'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isAdminEmail } from '@/lib/constants';
import { revalidatePath } from 'next/cache';

async function verifyStaff() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized. Please sign in.');
  }

  const isEmailAdmin = isAdminEmail(user.email);
  let userRole = isEmailAdmin ? 'admin' : 'customer';

  if (!isEmailAdmin) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    userRole = profile?.role || 'customer';
  }

  if (userRole !== 'admin' && userRole !== 'manager') {
    throw new Error('Forbidden. Staff privileges required.');
  }

  // Ensure role is admin in profile if authorized by email
  if (isEmailAdmin) {
    await supabase.from('profiles').upsert({
      id: user.id,
      role: 'admin',
      full_name: user.user_metadata?.full_name || 'Admin',
    });
  }

  let db = supabase;
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      db = createAdminClient();
    } catch (err) {
      db = supabase;
    }
  }

  return { user, db, supabase, role: userRole };
}

export interface SaveProductInput {
  id?: string;
  productPayload: {
    title: string;
    slug: string;
    category: any;
    description: string | null;
    images: string[];
    is_published: boolean;
  };
  variantPayload?: {
    id?: string;
    price: number;
    stock_quantity: number;
    sku: string;
    attributes: Record<string, any>;
  };
}

export async function fetchAdminProductsAction() {
  try {
    const { db } = await verifyStaff();

    const { data: products, error } = await db
      .from('products')
      .select('*, product_variants(id, sku, price, stock_quantity, attributes)')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return { success: true, products: products || [] };
  } catch (error: any) {
    console.error('[fetchAdminProductsAction error]:', error);
    return { success: false, error: error.message || 'Failed to load products', products: [] };
  }
}

export async function saveProductAction(input: SaveProductInput) {
  try {
    const { db } = await verifyStaff();
    const { id, productPayload, variantPayload } = input;

    if (id) {
      // Update existing product
      const { error: prodErr } = await db
        .from('products')
        .update(productPayload)
        .eq('id', id);

      if (prodErr) throw new Error(prodErr.message);

      if (variantPayload) {
        if (variantPayload.id) {
          const { error: varErr } = await db
            .from('product_variants')
            .update({
              price: variantPayload.price,
              stock_quantity: variantPayload.stock_quantity,
              sku: variantPayload.sku,
              attributes: variantPayload.attributes,
            })
            .eq('id', variantPayload.id);

          if (varErr) throw new Error(varErr.message);
        } else {
          const { error: varErr } = await db
            .from('product_variants')
            .insert({
              product_id: id,
              price: variantPayload.price,
              stock_quantity: variantPayload.stock_quantity,
              sku: variantPayload.sku,
              attributes: variantPayload.attributes,
            });

          if (varErr) throw new Error(varErr.message);
        }
      }

      revalidatePath('/admin/products');
      revalidatePath('/shop');
      revalidatePath(`/products/${productPayload.slug}`);

      return { success: true, message: `"${productPayload.title}" updated successfully!` };
    } else {
      // Create new product
      const { data: newProduct, error: prodErr } = await db
        .from('products')
        .insert(productPayload)
        .select()
        .single();

      if (prodErr) throw new Error(prodErr.message);

      if (newProduct && variantPayload) {
        const { error: varErr } = await db
          .from('product_variants')
          .insert({
            product_id: newProduct.id,
            price: variantPayload.price,
            stock_quantity: variantPayload.stock_quantity,
            sku: variantPayload.sku,
            attributes: variantPayload.attributes,
          });

        if (varErr) throw new Error(varErr.message);
      }

      revalidatePath('/admin/products');
      revalidatePath('/shop');

      return { success: true, message: `"${productPayload.title}" created successfully!` };
    }
  } catch (error: any) {
    console.error('[saveProductAction error]:', error);
    return { success: false, error: error.message || 'Failed to save product' };
  }
}

export async function deleteProductAction(id: string) {
  try {
    const { db } = await verifyStaff();

    // 1. Delete associated variants
    await db.from('product_variants').delete().eq('product_id', id);

    // 2. Delete product
    const { error } = await db.from('products').delete().eq('id', id);
    if (error) throw new Error(error.message);

    revalidatePath('/admin/products');
    revalidatePath('/shop');
    return { success: true };
  } catch (error: any) {
    console.error('[deleteProductAction error]:', error);
    return { success: false, error: error.message || 'Failed to delete product' };
  }
}

export async function togglePublishProductAction(id: string, is_published: boolean) {
  try {
    const { db } = await verifyStaff();
    const { error } = await db
      .from('products')
      .update({ is_published })
      .eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/products');
    revalidatePath('/shop');
    return { success: true };
  } catch (error: any) {
    console.error('[togglePublishProductAction error]:', error);
    return { success: false, error: error.message || 'Failed to toggle product status' };
  }
}
