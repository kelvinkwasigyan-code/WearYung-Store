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

export interface SaveLookbookInput {
  id?: string;
  payload: {
    title: string;
    season: string;
    category: string;
    description: string | null;
    image_url: string;
    aspect_ratio: string;
    is_published: boolean;
    tagged_items: any[];
  };
}

export async function saveLookbookAction(input: SaveLookbookInput) {
  try {
    const { db } = await verifyStaff();
    const { id, payload } = input;

    if (id) {
      const { error } = await db
        .from('lookbooks')
        .update(payload)
        .eq('id', id);

      if (error) throw new Error(error.message);

      revalidatePath('/admin/lookbook');
      revalidatePath('/lookbook');
      return { success: true, message: 'Lookbook updated successfully!' };
    } else {
      const { error } = await db
        .from('lookbooks')
        .insert(payload);

      if (error) throw new Error(error.message);

      revalidatePath('/admin/lookbook');
      revalidatePath('/lookbook');
      return { success: true, message: 'Lookbook created successfully!' };
    }
  } catch (error: any) {
    console.error('[saveLookbookAction error]:', error);
    return { success: false, error: error.message || 'Failed to save lookbook' };
  }
}

export async function deleteLookbookAction(id: string) {
  try {
    const { db } = await verifyStaff();
    const { error } = await db.from('lookbooks').delete().eq('id', id);
    if (error) throw new Error(error.message);

    revalidatePath('/admin/lookbook');
    revalidatePath('/lookbook');
    return { success: true };
  } catch (error: any) {
    console.error('[deleteLookbookAction error]:', error);
    return { success: false, error: error.message || 'Failed to delete lookbook' };
  }
}

export async function togglePublishLookbookAction(id: string, is_published: boolean) {
  try {
    const { db } = await verifyStaff();
    const { error } = await db
      .from('lookbooks')
      .update({ is_published })
      .eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/lookbook');
    revalidatePath('/lookbook');
    return { success: true };
  } catch (error: any) {
    console.error('[togglePublishLookbookAction error]:', error);
    return { success: false, error: error.message || 'Failed to toggle lookbook status' };
  }
}
