import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { ADMIN_EMAILS, AppRole } from '@/lib/constants';

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

  const isManager = profile?.role === 'manager';
  const isAdmin = isAdminByEmail || profile?.role === 'admin';

  // Strict check: ONLY authorized admin or manager can access staff portal
  if (!isAdmin && !isManager) {
    redirect('/admin/login');
  }

  // Ensure authorized owner has 'admin' role in profiles table
  if (isAdminByEmail) {
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
  }

  const effectiveRole: AppRole = isAdmin ? 'admin' : 'manager';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: '#080808',
      width: '100%',
      overflowX: 'hidden',
    }}>
      <AdminSidebar userRole={effectiveRole} />
      <main className="admin-layout-main">
        {children}
      </main>
    </div>
  );
}
