'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ChevronDown, ChevronUp, ShoppingBag, Loader2 } from 'lucide-react';

const statusColors: Record<string, string> = {
  pending: '#f59e0b',
  processing: '#3b82f6',
  shipped: '#8b5cf6',
  delivered: '#10b981',
  cancelled: '#ef4444',
};

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const supabase = createClient();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select(`
        *,
        profiles(full_name),
        order_items(*, product_variants(*, products(*)))
      `)
      .order('created_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId);
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    await fetchOrders();
    setUpdatingStatus(null);
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: '#FFFFFF', letterSpacing: '0.04em' }}>
          ORDERS
        </h1>
        <p style={{ color: '#A1A1AA', fontSize: '0.875rem' }}>{orders.length} orders total</p>
      </div>

      <div style={{ background: '#0d0d0d', border: '1px solid #27272A', borderRadius: '12px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#A1A1AA', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite', color: '#FFC800' }} />
            <span>Loading orders...</span>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#A1A1AA' }}>
            <ShoppingBag size={36} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
            <p>No orders have been placed yet.</p>
          </div>
        ) : (
          <div>
            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.5fr 1.5fr 1fr 1.5fr 1.2fr 40px',
              gap: '1rem',
              padding: '0.85rem 1.5rem',
              background: '#111113',
              borderBottom: '1px solid #27272A',
            }}>
              {['Order ID', 'Customer', 'Amount', 'Status', 'Date', ''].map(h => (
                <span key={h} style={{ fontSize: '0.75rem', color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                  {h}
                </span>
              ))}
            </div>

            {orders.map(order => (
              <div key={order.id}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.5fr 1.5fr 1fr 1.5fr 1.2fr 40px',
                    gap: '1rem',
                    padding: '1rem 1.5rem',
                    borderBottom: '1px solid #1E1E24',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  onMouseEnter={e => e.currentTarget.style.background = '#141417'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#E4E4E7' }}>
                    #{order.id.slice(0, 8)}
                  </span>
                  <span style={{ color: '#FFFFFF', fontSize: '0.875rem', fontWeight: 500 }}>
                    {order.profiles?.full_name || order.guest_email || 'Guest'}
                  </span>
                  <span style={{ color: '#FFC800', fontWeight: 700 }}>
                    GH₵ {order.total_amount}
                  </span>
                  <select
                    value={order.status}
                    onChange={e => { e.stopPropagation(); updateStatus(order.id, e.target.value); }}
                    disabled={updatingStatus === order.id}
                    onClick={e => e.stopPropagation()}
                    style={{
                      background: `${statusColors[order.status] ?? '#555'}22`,
                      color: statusColors[order.status] ?? '#A1A1AA',
                      border: `1px solid ${statusColors[order.status] ?? '#555'}55`,
                      borderRadius: '6px',
                      padding: '0.35rem 0.6rem',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {ORDER_STATUSES.map(s => (
                      <option key={s} value={s} style={{ background: '#18181B', color: '#FFFFFF' }}>
                        {s.toUpperCase()}
                      </option>
                    ))}
                  </select>
                  <span style={{ color: '#A1A1AA', fontSize: '0.8rem' }}>
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                  <span style={{ color: '#A1A1AA' }}>
                    {expandedOrder === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                </div>

                {/* Expanded order items */}
                {expandedOrder === order.id && (
                  <div style={{ background: '#111113', padding: '1.25rem 1.5rem', borderBottom: '1px solid #27272A' }}>
                    <p style={{ fontSize: '0.75rem', color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', fontWeight: 700 }}>
                      Order Items
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {order.order_items?.map((item: any) => (
                        <div key={item.id} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '0.75rem 1rem',
                          background: '#18181B',
                          borderRadius: '8px',
                          border: '1px solid #27272A',
                          fontSize: '0.875rem',
                        }}>
                          <span style={{ color: '#FFFFFF', fontWeight: 500 }}>
                            {item.product_variants?.products?.title || 'Unknown Product'}
                          </span>
                          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <span style={{ color: '#A1A1AA', fontWeight: 600 }}>×{item.quantity}</span>
                            <span style={{ color: '#FFC800', fontWeight: 700 }}>GH₵ {item.unit_price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {order.shipping_address && Object.keys(order.shipping_address).length > 0 && (
                      <div style={{ marginTop: '0.85rem', padding: '1rem', background: '#18181B', borderRadius: '8px', border: '1px solid #27272A', fontSize: '0.8rem', color: '#E4E4E7' }}>
                        <p style={{ marginBottom: '0.35rem', color: '#A1A1AA', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
                          Shipping Details
                        </p>
                        <pre style={{ fontFamily: 'inherit', whiteSpace: 'pre-wrap', color: '#D4D4D8', margin: 0 }}>
                          {JSON.stringify(order.shipping_address, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
