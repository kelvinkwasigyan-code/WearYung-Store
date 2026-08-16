'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { sendNewUserAdminAlert } from '@/lib/email';

export async function loginAction(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  redirect('/admin');
}

export async function registerAction(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const full_name = formData.get('full_name') as string;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name } },
  });

  if (error) return { error: error.message };

  if (data?.user) {
    try {
      await sendNewUserAdminAlert({
        email: data.user.email || email,
        name: data.user.user_metadata?.full_name || full_name || 'Anonymous User',
        userId: data.user.id,
      });
    } catch (err) {
      console.error('Failed to dispatch new user alert email:', err);
    }
  }

  return { success: 'Account created! Check your email to verify.' };
}

export async function notifyNewUserAction({ email, name, userId }: { email: string; name?: string | null; userId: string }) {
  try {
    await sendNewUserAdminAlert({
      email,
      name: name || 'Anonymous User',
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
