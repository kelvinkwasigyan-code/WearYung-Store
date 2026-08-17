'use client';

export const runtime = 'edge';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: '#fff', letterSpacing: '0.04em' }}>
          ORDERS
        </h1>
        <p style={{ color: '#555', fontSize: '0.875rem' }}>{orders.length} orders total</p>
      </div>

      <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '12px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#444' }}>Loading...</div>
        ) : orders.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#444' }}>No orders have been placed yet.</div>
        ) : (
          <div>
            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.5fr 1.5fr 1fr 1.5fr 1.2fr 40px',
              gap: '1rem',
              padding: '0.75rem 1.5rem',
              borderBottom: '1px solid #1a1a1a',
            }}>
              {['Order ID', 'Customer', 'Amount', 'Status', 'Date', ''].map(h => (
                <span key={h} style={{ fontSize: '0.72rem', color: '#444', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>
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
                    borderBottom: '1px solid #111',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#888' }}>
                    #{order.id.slice(0, 8)}
                  </span>
                  <span style={{ color: '#ccc', fontSize: '0.875rem' }}>
                    {order.profiles?.full_name || order.guest_email || 'Guest'}
                  </span>
                  <span style={{ color: '#FFC800', fontWeight: 600 }}>
                    GH₵ {order.total_amount}
                  </span>
                  <select
                    value={order.status}
                    onChange={e => { e.stopPropagation(); updateStatus(order.id, e.target.value); }}
                    disabled={updatingStatus === order.id}
                    onClick={e => e.stopPropagation()}
                    style={{
                      background: `${statusColors[order.status] ?? '#555'}18`,
                      color: statusColors[order.status] ?? '#888',
                      border: `1px solid ${statusColors[order.status] ?? '#555'}44`,
                      borderRadius: '6px',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {ORDER_STATUSES.map(s => (
                      <option key={s} value={s} style={{ background: '#0d0d0d', color: '#fff' }}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <span style={{ color: '#555', fontSize: '0.8rem' }}>
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                  <span style={{ color: '#555' }}>
                    {expandedOrder === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                </div>

                {/* Expanded order items */}
                {expandedOrder === order.id && (
                  <div style={{ background: '#080808', padding: '1.25rem 1.5rem', borderBottom: '1px solid #111' }}>
                    <p style={{ fontSize: '0.72rem', color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
                      Order Items
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {order.order_items?.map((item: any) => (
                        <div key={item.id} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '0.6rem 0.875rem',
                          background: '#0d0d0d',
                          borderRadius: '6px',
                          border: '1px solid #1a1a1a',
                          fontSize: '0.875rem',
                        }}>
                          <span style={{ color: '#ccc' }}>
                            {item.product_variants?.products?.title || 'Unknown Product'}
                          </span>
                          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <span style={{ color: '#555' }}>×{item.quantity}</span>
                            <span style={{ color: '#FFC800' }}>GH₵ {item.unit_price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {order.shipping_address && Object.keys(order.shipping_address).length > 0 && (
                      <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#0d0d0d', borderRadius: '6px', border: '1px solid #1a1a1a', fontSize: '0.8rem', color: '#666' }}>
                        <p style={{ marginBottom: '0.25rem', color: '#444', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Shipping</p>
                        <pre style={{ fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>
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
