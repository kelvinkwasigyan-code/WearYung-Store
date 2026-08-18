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

  // If no profile exists yet, assign 'admin' ONLY if email matches authorized admin emails
  if (!profile) {
    const defaultRole = isAdminByEmail ? 'admin' : 'customer';
    const { data: newProfile } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        role: defaultRole,
        full_name: user.user_metadata?.full_name || (isAdminByEmail ? 'Admin' : 'Customer'),
      })
      .select('role')
      .maybeSingle();
    profile = newProfile;
  }

  // Strict Admin check: role-based OR verified admin email
  const isAdmin = profile?.role === 'admin' || isAdminByEmail;

  if (!isAdmin) {
    redirect('/admin/login');
  }

  // Auto-sync: if authorized admin by email but role in DB is still 'customer', update to 'admin'
  if (profile && profile.role !== 'admin' && isAdminByEmail) {
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
