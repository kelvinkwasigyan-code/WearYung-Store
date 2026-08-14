import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Order, Profile } from '@/types/ecommerce';
import { logoutAction } from '@/app/actions/auth';

export const metadata: Metadata = {
  title: 'My Account',
  description: 'Manage your WEAR YUNG profile and view your order history.',
};

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const [{ data: profile }, { data: orders }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  const p = profile as Profile | null;
  const o = (orders ?? []) as Order[];

  const statusColors: Record<string, string> = {
    pending: '#f59e0b',
    processing: '#3b82f6',
    shipped: '#8b5cf6',
    delivered: '#22c55e',
    cancelled: '#ef4444',
  };

  return (
    <div style={{ background: 'var(--wy-canvas)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'var(--wy-surface)', borderBottom: '1px solid var(--wy-border)', padding: '2.5rem 0' }}>
        <div className="container-wy" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--wy-text)', marginBottom: '0.25rem' }}>
              My Account
            </h1>
            <p style={{ color: 'var(--wy-muted)', fontSize: '0.875rem' }}>{user.email}</p>
          </div>
          <form action={logoutAction}>
            <button type="submit" id="logout-btn" className="btn btn-ghost btn-sm">
              Sign Out
            </button>
          </form>
        </div>
      </div>

      <div className="container-wy" style={{ padding: '2.5rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'start' }}>
          {/* Profile Card */}
          <div style={{ padding: '1.5rem', background: 'var(--wy-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--wy-border)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', letterSpacing: '0.08em', marginBottom: '1.25rem', color: 'var(--wy-text)' }}>
              PROFILE
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Name', value: p?.full_name || '—' },
                { label: 'Email', value: user.email },
                { label: 'Phone', value: p?.phone_number || '—' },
                { label: 'Role', value: p?.role || 'customer' },
                { label: 'Member Since', value: p ? new Date(p.created_at).toLocaleDateString('en-NG', { year: 'numeric', month: 'long' }) : '—' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--wy-border)', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--wy-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.75rem' }}>{row.label}</span>
                  <span style={{ color: 'var(--wy-text)' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Orders */}
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', letterSpacing: '0.08em', marginBottom: '1.25rem', color: 'var(--wy-text)' }}>
              ORDER HISTORY
            </h2>

            {o.length === 0 ? (
              <div style={{ padding: '3rem', background: 'var(--wy-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--wy-border)', textAlign: 'center' }}>
                <p style={{ color: 'var(--wy-muted)', marginBottom: '1rem' }}>No orders yet.</p>
                <Link href="/shop" className="btn btn-primary btn-sm">Start Shopping</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {o.map(order => (
                  <div key={order.id} style={{
                    padding: '1.25rem',
                    background: 'var(--wy-surface)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--wy-border)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--wy-muted-dim)' }}>#{order.id.slice(0, 8).toUpperCase()}</span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.2rem 0.6rem', borderRadius: '2px', background: `${statusColors[order.status]}20`, color: statusColors[order.status] }}>
                        {order.status}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <p style={{ color: 'var(--wy-muted)', fontSize: '0.8rem' }}>
                          {new Date(order.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })} · {(order.order_items as unknown[])?.length ?? 0} item(s)
                        </p>
                      </div>
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--wy-yellow)' }}>
                        ₦{order.total_amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
