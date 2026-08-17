import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import CustomerDashboard from '@/components/account/CustomerDashboard';

export const runtime = 'edge';

export const metadata = {
  title: 'Customer Account | WEAR YUNG',
  description: 'Manage your WEAR YUNG profile, orders, and VIP drop access.',
};

export default async function AccountPage() {
  const supabase = await createClient();

  // 1. Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login?redirect=/account');
  }

  // 2. Fetch User Profile from profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  // Admin check: role-based OR email-based (admin@wearyung.com)
  const isAdmin = profile?.role === 'admin' || user.email === 'admin@wearyung.com';

  // If user is an Admin, redirect to the Admin Dashboard (admins do not have customer account)
  if (isAdmin) {
    // Auto-fix: ensure admin role is set in the database
    if (profile && profile.role !== 'admin') {
      await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', user.id);
    }
    redirect('/admin');
  }

  // 3. Fetch Orders History
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      id,
      total_amount,
      status,
      payment_status,
      created_at,
      shipping_address,
      order_items (
        id,
        quantity,
        unit_price,
        product_variants (
          id,
          sku,
          attributes,
          products (
            title,
            images
          )
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <CustomerDashboard
      initialUser={{
        id: user.id,
        email: user.email || '',
        created_at: user.created_at,
      }}
      initialProfile={profile}
      initialOrders={orders || []}
    />
  );
}
