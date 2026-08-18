import { createClient } from '@/lib/supabase/server';
import StatsCard from '@/components/admin/StatsCard';
import { Package, ShoppingBag, Users, TrendingUp } from 'lucide-react';

export const metadata = { title: 'Admin Dashboard | WEAR YUNG' };

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: productCount },
    { count: orderCount },
    { count: customerCount },
    { data: recentOrders },
    { data: revenueData },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('orders')
      .select('id, total_amount, status, payment_status, created_at, guest_email, profiles(full_name)')
      .order('created_at', { ascending: false })
      .limit(8),
    supabase.from('orders').select('total_amount').eq('payment_status', 'paid'),
  ]);

  const totalRevenue = revenueData?.reduce((sum, o) => sum + Number(o.total_amount), 0) ?? 0;

  const statusColors: Record<string, string> = {
    pending: '#f59e0b',
    processing: '#3b82f6',
    shipped: '#8b5cf6',
    delivered: '#10b981',
    cancelled: '#ef4444',
  };

  const hour = new Date().getHours();
  let greeting = 'GOOD EVENING';
  if (hour < 12) greeting = 'GOOD MORNING';
  else if (hour < 18) greeting = 'GOOD AFTERNOON';

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 4vw, 2.75rem)',
          color: '#FFFFFF',
          letterSpacing: '0.04em',
          marginBottom: '0.25rem',
        }}>
          {greeting}, DANI
        </h1>
        <p style={{ color: '#A1A1AA', fontSize: '0.875rem' }}>
          Live overview of your WEAR YUNG store
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '2.5rem',
      }}>
        <StatsCard
          title="Total Products"
          value={productCount ?? 0}
          subtitle="Published in store"
          icon={<Package size={20} />}
          accent="#FFC800"
        />
        <StatsCard
          title="Total Orders"
          value={orderCount ?? 0}
          subtitle="All time"
          icon={<ShoppingBag size={20} />}
          accent="#3b82f6"
        />
        <StatsCard
          title="Revenue"
          value={`GH₵ ${totalRevenue.toFixed(2)}`}
          subtitle="From paid orders"
          icon={<TrendingUp size={20} />}
          accent="#10b981"
        />
        <StatsCard
          title="Customers"
          value={customerCount ?? 0}
          subtitle="Registered accounts"
          icon={<Users size={20} />}
          accent="#8b5cf6"
        />
      </div>

      {/* Recent Orders */}
      <div style={{
        background: '#0d0d0d',
        border: '1px solid #27272A',
        borderRadius: '12px',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #27272A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.1rem',
            color: '#FFFFFF',
            letterSpacing: '0.05em',
          }}>
            RECENT ORDERS
          </h2>
          <a href="/admin/orders" style={{ fontSize: '0.8rem', color: '#FFC800', textDecoration: 'none', fontWeight: 600 }}>
            View all →
          </a>
        </div>

        {!recentOrders || recentOrders.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#A1A1AA' }}>
            <ShoppingBag size={36} style={{ margin: '0 auto 1rem', opacity: 0.5, color: '#A1A1AA' }} />
            <p>No orders yet</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #27272A', background: '#111113' }}>
                  {['Order ID', 'Customer', 'Amount', 'Status', 'Date'].map((h) => (
                    <th key={h} style={{
                      padding: '0.85rem 1.5rem',
                      textAlign: 'left',
                      color: '#A1A1AA',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #1E1E24' }}>
                    <td style={{ padding: '0.875rem 1.5rem', color: '#E4E4E7', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      #{order.id.slice(0, 8)}
                    </td>
                    <td style={{ padding: '0.875rem 1.5rem', color: '#FFFFFF', fontWeight: 500 }}>
                      {(order.profiles as any)?.full_name || order.guest_email || 'Guest'}
                    </td>
                    <td style={{ padding: '0.875rem 1.5rem', color: '#FFC800', fontWeight: 700 }}>
                      GH₵ {order.total_amount}
                    </td>
                    <td style={{ padding: '0.875rem 1.5rem' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        background: `${statusColors[order.status] ?? '#555'}22`,
                        color: statusColors[order.status] ?? '#A1A1AA',
                        border: `1px solid ${statusColors[order.status] ?? '#555'}55`,
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1.5rem', color: '#A1A1AA', fontSize: '0.8rem' }}>
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
