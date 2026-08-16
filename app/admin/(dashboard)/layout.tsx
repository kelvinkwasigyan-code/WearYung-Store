import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  let { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile) {
    const { data: newProfile } = await supabase
      .from('profiles')
      .upsert({ id: user.id, role: 'admin', full_name: user.user_metadata?.full_name || 'Admin' })
      .select('role')
      .maybeSingle();
    profile = newProfile;
  }

  // Admin check: role-based OR email-based
  const isAdmin = profile?.role === 'admin' || user.email === 'admin@wearyung.com';

  if (!isAdmin) {
    redirect('/admin/login');
  }

  // Auto-fix: if admin by email but role in DB is still 'customer', update it
  if (profile && profile.role !== 'admin' && user.email === 'admin@wearyung.com') {
    await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', user.id);
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#080808',
    }}>
      <AdminSidebar />
      <main style={{
        flex: 1,
        marginLeft: '260px',
        padding: '2rem',
        overflowY: 'auto',
        minHeight: '100vh',
      }}>
        {children}
      </main>
    </div>
  );
}
