'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Shield, User, Loader2 } from 'lucide-react';

export default function AdminCustomersPage() {
  const supabase = createClient();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [promoting, setPromoting] = useState<string | null>(null);

  const fetchCustomers = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    setCustomers(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchCustomers(); }, []);

  const toggleRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    if (!confirm(`${newRole === 'admin' ? 'Promote' : 'Demote'} this user to ${newRole}?`)) return;
    setPromoting(id);
    await supabase.from('profiles').update({ role: newRole }).eq('id', id);
    await fetchCustomers();
    setPromoting(null);
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: '#FFFFFF', letterSpacing: '0.04em' }}>
          CUSTOMERS
        </h1>
        <p style={{ color: '#A1A1AA', fontSize: '0.875rem' }}>{customers.length} registered accounts</p>
      </div>

      <div style={{ background: '#0d0d0d', border: '1px solid #27272A', borderRadius: '12px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#A1A1AA', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite', color: '#FFC800' }} />
            <span>Loading accounts...</span>
          </div>
        ) : customers.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#A1A1AA' }}>No registered users yet.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #27272A', background: '#111113' }}>
                  {['User', 'Role', 'Joined', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '0.85rem 1.5rem', textAlign: 'left', color: '#A1A1AA', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #1E1E24' }}>
                    <td style={{ padding: '0.875rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '38px', height: '38px',
                          borderRadius: '50%',
                          background: c.role === 'admin' ? 'rgba(255,200,0,0.15)' : '#1E1E24',
                          border: `1px solid ${c.role === 'admin' ? 'rgba(255,200,0,0.3)' : '#27272A'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          {c.role === 'admin'
                            ? <Shield size={16} color="#FFC800" />
                            : <User size={16} color="#A1A1AA" />
                          }
                        </div>
                        <div>
                          <p style={{ color: '#FFFFFF', fontWeight: 600 }}>{c.full_name || 'Anonymous User'}</p>
                          <p style={{ color: '#A1A1AA', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                            {c.id.slice(0, 16)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.875rem 1.5rem' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        background: c.role === 'admin' ? 'rgba(255,200,0,0.15)' : '#1E1E24',
                        color: c.role === 'admin' ? '#FFC800' : '#E4E4E7',
                        border: c.role === 'admin' ? '1px solid rgba(255,200,0,0.35)' : '1px solid #27272A',
                      }}>
                        {c.role}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1.5rem', color: '#A1A1AA', fontSize: '0.8rem' }}>
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '0.875rem 1.5rem' }}>
                      <button
                        onClick={() => toggleRole(c.id, c.role)}
                        disabled={promoting === c.id}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.4rem',
                          padding: '0.4rem 0.85rem',
                          background: c.role === 'admin' ? '#18181B' : 'rgba(255,200,0,0.1)',
                          color: c.role === 'admin' ? '#EF4444' : '#FFC800',
                          border: `1px solid ${c.role === 'admin' ? '#27272A' : 'rgba(255,200,0,0.3)'}`,
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: promoting === c.id ? 'not-allowed' : 'pointer',
                          opacity: promoting === c.id ? 0.5 : 1,
                        }}
                      >
                        <Shield size={12} />
                        {c.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                      </button>
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
