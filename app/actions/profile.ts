'use server';

import { createClient } from '@/lib/supabase/server';

export async function updateCustomerProfile(data: {
  full_name?: string;
  phone_number?: string;
  address?: Record<string, any>;
}) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'You must be logged in to update your profile.' };
    }

    // 1. Try updating existing profile row
    const { data: updated, error: updateError } = await supabase
      .from('profiles')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .maybeSingle();

    if (!updateError && updated) {
      return { success: true, profile: updated };
    }

    // 2. If row did not exist yet, insert new profile
    const { data: inserted, error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        full_name: data.full_name || '',
        phone_number: data.phone_number || '',
        address: data.address || {},
        role: 'customer',
      })
      .select()
      .single();

    if (insertError) {
      console.error('[updateCustomerProfile] Insert fallback error:', insertError);
      return { error: insertError.message || 'Failed to save profile details.' };
    }

    return { success: true, profile: inserted };
  } catch (err: any) {
    console.error('[updateCustomerProfile] Unexpected error:', err);
    return { error: err?.message || 'An unexpected error occurred while saving profile.' };
  }
}
