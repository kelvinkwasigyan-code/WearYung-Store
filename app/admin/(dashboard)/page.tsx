import { createClient } from '@/lib/supabase/server';
import StatsCard from '@/components/admin/StatsCard';
import { Package, ShoppingBag, Users, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { isAdminEmail } from '@/lib/constants';

export const metadata = { title: 'Admin Dashboard | WEAR YUNG' };

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const isOwner = isAdminEmail(user?.email);

  let userRole = isOwner ? 'admin' : 'customer';
  let userName = 'Admin';

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .maybeSingle();
    
    if (isOwner) {
      userRole = 'admin';
    } else {
      userRole = profile?.role || 'customer';
    }
    userName = profile?.full_name || (isOwner ? 'Dani' : 'Manager');
  }

  const isManager = userRole === 'manager';

  // Fetch metrics based on role permissions
  const [
    { count: productCount },
    { count: orderCount },
    { count: pendingOrderCount },
    { count: customerCount },
    { data: recentOrders },
    { data: revenueData },
    { data: lowStockVariants },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).in('status', ['pending', 'processing']),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('orders')
      .select('id, total_amount, status, payment_status, created_at, guest_email, customer_name, profiles(full_name)')
      .order('created_at', { ascending: false })
      .limit(8),
    !isManager ? supabase.from('orders').select('total_amount').eq('payment_status', 'paid') : Promise.resolve({ data: null }),
    supabase.from('product_variants').select('id, stock_quantity').lte('stock_quantity', 2),
  ]);

  const totalRevenue = revenueData?.reduce((sum, o) => sum + Number(o.total_amount), 0) ?? 0;
  const lowStockCount = lowStockVariants?.length ?? 0;

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            color: '#FFFFFF',
            letterSpacing: '0.04em',
            lineHeight: 1.1,
          }}>
            {greeting}, {userName.toUpperCase()}
          </h1>
          <span style={{
            fontSize: '0.65rem',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: '4px',
            background: isManager ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 200, 0, 0.15)',
            color: isManager ? '#60A5FA' : '#FFC800',
            border: isManager ? '1px solid rgba(59, 130, 246, 0.35)' : '1px solid rgba(255, 200, 0, 0.3)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            {isManager ? 'STORE MANAGER' : 'MASTER ADMIN'}
          </span>
        </div>
        <p style={{ color: '#A1A1AA', fontSize: '0.875rem', marginTop: '0.35rem' }}>
          {isManager
            ? 'Store management and live catalog operations overview.'
            : 'Live business overview and master controls of your WEAR YUNG store.'
          }
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
          subtitle="In product catalog"
          icon={<Package size={20} />}
          accent="#FFC800"
        />
        <StatsCard
          title="Total Orders"
          value={orderCount ?? 0}
          subtitle="Processed orders"
          icon={<ShoppingBag size={20} />}
          accent="#3b82f6"
        />

        {/* Manager View: Operational metrics only (Revenue & Customers are hidden) */}
        {isManager ? (
          <>
            <StatsCard
              title="Active / Pending Orders"
              value={pendingOrderCount ?? 0}
              subtitle="Requires fulfillment"
              icon={<Clock size={20} />}
              accent="#f59e0b"
            />
            <StatsCard
              title="Low Stock Alerts"
              value={lowStockCount}
              subtitle="Items with ≤ 2 stock"
              icon={<AlertTriangle size={20} />}
              accent="#ef4444"
            />
          </>
        ) : (
          /* Admin View: Full financial revenue & customer growth */
          <>
            <StatsCard
              title="Sales Revenue"
              value={`GH₵ ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` }
              subtitle="From completed payments"
              icon={<TrendingUp size={20} />}
              accent="#10b981"
            />
            <StatsCard
              title="Customers"
              value={customerCount ?? 0}
              subtitle="Registered user accounts"
              icon={<Users size={20} />}
              accent="#8b5cf6"
            />
          </>
        )}
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
                  {['Order ID', 'Customer', 'Items/Amount', 'Status', 'Date'].map((h) => (
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
                      {(order.profiles as any)?.full_name || order.customer_name || order.guest_email || 'Customer'}
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
