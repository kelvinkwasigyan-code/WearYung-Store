'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendNewUserAdminAlert } from '@/lib/email';

export async function loginAction(formData: FormData) {
  const supabase = await createClient();
  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: 'Wrong credentials' };

  if (data?.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .maybeSingle();

    if (profile?.role === 'admin') {
      redirect('/admin');
    }
  }

  redirect('/account');
}

export async function registerAction(formData: FormData) {
  const supabase = await createClient();
  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;
  const full_name = (formData.get('full_name') as string)?.trim();
  const phone_number = (formData.get('phone_number') as string)?.trim() || '';

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wearyung.com';

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name, phone_number },
      emailRedirectTo: `${siteUrl}/auth/callback?next=/account`,
    },
  });

  if (error) return { error: error.message };

  if (data?.user) {
    // 1. Immediately guarantee profile record in database
    try {
      let db = supabase;
      if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
        try {
          db = createAdminClient();
        } catch (e) {}
      }
      await db.from('profiles').upsert({
        id: data.user.id,
        full_name: full_name || 'Customer',
        phone_number: phone_number || '',
        role: 'customer',
      });
    } catch (dbErr) {
      console.warn('[registerAction] Profile upsert warning:', dbErr);
    }

    // 2. Send email notification to admin
    try {
      await sendNewUserAdminAlert({
        email: data.user.email || email,
        name: data.user.user_metadata?.full_name || full_name || 'Customer',
        userId: data.user.id,
      });
    } catch (err) {
      console.error('Failed to dispatch new user alert email:', err);
    }
  }

  return { success: 'Account created! Check your email to verify.' };
}

export async function notifyNewUserAction({
  email,
  name,
  userId,
  phone,
}: {
  email: string;
  name?: string | null;
  userId: string;
  phone?: string | null;
}) {
  try {
    const supabase = await createClient();

    // 1. Immediately guarantee profile row in database
    try {
      let db = supabase;
      if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
        try {
          db = createAdminClient();
        } catch (e) {}
      }
      await db.from('profiles').upsert({
        id: userId,
        full_name: name || 'Customer',
        phone_number: phone || '',
        role: 'customer',
      });
    } catch (dbErr) {
      console.warn('[notifyNewUserAction] Profile upsert warning:', dbErr);
    }

    // 2. Dispatch admin email
    await sendNewUserAdminAlert({
      email,
      name: name || 'Customer',
      userId,
    });
    return { success: true };
  } catch (err) {
    console.error('Failed to dispatch new user alert:', err);
    return { success: false, error: err };
  }
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}
