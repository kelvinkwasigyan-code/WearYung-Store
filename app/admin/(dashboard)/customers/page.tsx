'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Shield, User } from 'lucide-react';

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
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: '#fff', letterSpacing: '0.04em' }}>
          CUSTOMERS
        </h1>
        <p style={{ color: '#555', fontSize: '0.875rem' }}>{customers.length} registered accounts</p>
      </div>

      <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '12px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#444' }}>Loading...</div>
        ) : customers.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#444' }}>No registered users yet.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                  {['User', 'Role', 'Joined', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1.5rem', textAlign: 'left', color: '#444', fontWeight: 500, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #111' }}>
                    <td style={{ padding: '0.875rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '36px', height: '36px',
                          borderRadius: '50%',
                          background: c.role === 'admin' ? 'rgba(255,200,0,0.15)' : '#1a1a1a',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          {c.role === 'admin'
                            ? <Shield size={16} color="#FFC800" />
                            : <User size={16} color="#555" />
                          }
                        </div>
                        <div>
                          <p style={{ color: '#e0e0e0', fontWeight: 500 }}>{c.full_name || 'No name'}</p>
                          <p style={{ color: '#444', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                            {c.id.slice(0, 16)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.875rem 1.5rem' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        background: c.role === 'admin' ? 'rgba(255,200,0,0.1)' : '#1a1a1a',
                        color: c.role === 'admin' ? '#FFC800' : '#666',
                        border: c.role === 'admin' ? '1px solid rgba(255,200,0,0.2)' : '1px solid #222',
                      }}>
                        {c.role}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1.5rem', color: '#555', fontSize: '0.8rem' }}>
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '0.875rem 1.5rem' }}>
                      <button
                        onClick={() => toggleRole(c.id, c.role)}
                        disabled={promoting === c.id}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.4rem',
                          padding: '0.35rem 0.75rem',
                          background: c.role === 'admin' ? '#1a1a1a' : 'rgba(255,200,0,0.08)',
                          color: c.role === 'admin' ? '#ef4444' : '#FFC800',
                          border: `1px solid ${c.role === 'admin' ? '#333' : 'rgba(255,200,0,0.2)'}`,
                          borderRadius: '6px',
                          fontSize: '0.75rem',
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
