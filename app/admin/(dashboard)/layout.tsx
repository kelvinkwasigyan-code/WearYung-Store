import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { ADMIN_EMAILS } from '@/lib/constants';

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const userEmail = (user.email || '').toLowerCase();
  const isAdminByEmail = ADMIN_EMAILS.includes(userEmail);

  let { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  // Strict check: ONLY authorized admin emails are granted access
  if (!isAdminByEmail) {
    // Revoke 'admin' role from any unauthorized email in database
    if (profile?.role === 'admin') {
      await supabase
        .from('profiles')
        .update({ role: 'customer' })
        .eq('id', user.id);
    }
    redirect('/admin/login');
  }

  // Ensure authorized admin has 'admin' role in profiles table
  if (!profile) {
    await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        role: 'admin',
        full_name: user.user_metadata?.full_name || 'Admin',
      });
  } else if (profile.role !== 'admin') {
    await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', user.id);
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: '#080808',
      width: '100%',
      overflowX: 'hidden',
    }}>
      <AdminSidebar />
      <main className="admin-layout-main">
        {children}
      </main>
    </div>
  );
}
