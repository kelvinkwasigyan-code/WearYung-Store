'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  fetchAdminCustomersAction,
  syncExistingCustomersAction,
  updateCustomerRoleAction,
  AdminCustomer,
} from '@/app/actions/admin-customers';
import {
  Shield,
  User,
  Loader2,
  Search,
  RefreshCw,
  ShoppingBag,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Users,
  CheckCircle2,
  Briefcase,
  UserCheck,
  UserX,
  ChevronDown,
} from 'lucide-react';

export default function AdminCustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'customer' | 'manager' | 'admin'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadCustomers = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      syncExistingCustomersAction().catch(() => {});
      const res = await fetchAdminCustomersAction();
      if (res.success && res.customers) {
        setCustomers(res.customers);
      } else {
        if (res.error?.includes('Forbidden') || res.error?.includes('Unauthorized')) {
          router.replace('/admin/products');
          return;
        }
        showToast(res.error || 'Failed to fetch registered customers');
      }
    } catch (err: any) {
      showToast(err?.message || 'Error loading customers');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleSetRole = async (customer: AdminCustomer, targetRole: 'manager' | 'customer') => {
    const actionLabel = targetRole === 'customer' ? 'Demote to Customer' : 'Promote to Store Manager';
    const name = customer.full_name || customer.email;

    if (!confirm(`${actionLabel} for "${name}"?`)) return;

    setUpdatingId(customer.id);
    // Optimistic update
    setCustomers((prev) =>
      prev.map((c) => (c.id === customer.id ? { ...c, role: targetRole } : c))
    );

    try {
      const res = await updateCustomerRoleAction(customer.id, targetRole);
      if (res.success) {
        showToast(res.message || `Updated role to ${targetRole.toUpperCase()}`);
        await loadCustomers(true);
      } else {
        // Revert on error
        setCustomers((prev) =>
          prev.map((c) => (c.id === customer.id ? { ...c, role: customer.role } : c))
        );
        showToast(res.error || 'Failed to update role');
      }
    } catch (err: any) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === customer.id ? { ...c, role: customer.role } : c))
      );
      showToast(err?.message || 'Role update error');
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtered list
  const filteredCustomers = customers.filter((c) => {
    const query = searchQuery.toLowerCase().trim();
    const matchQuery =
      !query ||
      c.full_name?.toLowerCase().includes(query) ||
      c.email?.toLowerCase().includes(query) ||
      c.phone_number?.toLowerCase().includes(query) ||
      c.id?.toLowerCase().includes(query);

    const matchRole = roleFilter === 'all' || c.role === roleFilter;
    return matchQuery && matchRole;
  });

  const totalRegistered = customers.length;
  const totalManagers = customers.filter((c) => c.role === 'manager').length;
  const activeBuyers = customers.filter((c) => c.orders_count > 0).length;
  const totalCustomerRevenue = customers.reduce((sum, c) => sum + (c.total_spent || 0), 0);

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: '#18181B',
          border: '1px solid #FFC800',
          color: '#FFFFFF',
          padding: '0.85rem 1.35rem',
          borderRadius: '10px',
          zIndex: 9999,
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
        }}>
          <CheckCircle2 size={16} color="#FFC800" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            color: '#FFFFFF',
            letterSpacing: '0.04em',
            lineHeight: 1.1,
          }}>
            CUSTOMERS DIRECTORY
          </h1>
          <p style={{ color: '#A1A1AA', fontSize: '0.875rem', marginTop: '0.35rem' }}>
            Unified directory of registered customer profiles, staff managers, and purchase metrics.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          {/* Quick Refresh */}
          <button
            onClick={() => loadCustomers(true)}
            disabled={refreshing || loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: '#18181B',
              border: '1px solid #27272A',
              color: '#FFFFFF',
              padding: '0.65rem 1.1rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: refreshing || loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#FFC800')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#27272A')}
          >
            <RefreshCw size={14} className={refreshing ? 'spin' : ''} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <div style={{
          background: '#0F0F12',
          border: '1px solid #27272A',
          borderRadius: '12px',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '10px',
            background: 'rgba(255, 200, 0, 0.1)',
            border: '1px solid rgba(255, 200, 0, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFC800',
          }}>
            <Users size={22} />
          </div>
          <div>
            <p style={{ color: '#71717A', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Total Accounts
            </p>
            <p style={{ color: '#FFFFFF', fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-display)', marginTop: '0.15rem' }}>
              {totalRegistered}
            </p>
          </div>
        </div>

        <div style={{
          background: '#0F0F12',
          border: '1px solid #27272A',
          borderRadius: '12px',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '10px',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#60A5FA',
          }}>
            <Briefcase size={22} />
          </div>
          <div>
            <p style={{ color: '#71717A', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Staff Managers
            </p>
            <p style={{ color: '#FFFFFF', fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-display)', marginTop: '0.15rem' }}>
              {totalManagers}
            </p>
          </div>
        </div>

        <div style={{
          background: '#0F0F12',
          border: '1px solid #27272A',
          borderRadius: '12px',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#34D399',
          }}>
            <ShoppingBag size={22} />
          </div>
          <div>
            <p style={{ color: '#71717A', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Active Buyers
            </p>
            <p style={{ color: '#FFFFFF', fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-display)', marginTop: '0.15rem' }}>
              {activeBuyers}
            </p>
          </div>
        </div>

        <div style={{
          background: '#0F0F12',
          border: '1px solid #27272A',
          borderRadius: '12px',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '10px',
            background: 'rgba(255, 200, 0, 0.1)',
            border: '1px solid rgba(255, 200, 0, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFC800',
          }}>
            <DollarSign size={22} />
          </div>
          <div>
            <p style={{ color: '#71717A', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Customer Revenue
            </p>
            <p style={{ color: '#FFFFFF', fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-display)', marginTop: '0.15rem' }}>
              GH₵ {totalCustomerRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '1.25rem',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', minWidth: '280px', flex: 1, maxWidth: '450px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#71717A' }} />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem 0.65rem 2.4rem',
              background: '#121214',
              border: '1px solid #27272A',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontSize: '0.85rem',
              outline: 'none',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#FFC800')}
            onBlur={(e) => (e.target.style.borderColor = '#27272A')}
          />
        </div>

        {/* Role Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', background: '#121214', padding: '4px', borderRadius: '8px', border: '1px solid #27272A' }}>
          {([
            { key: 'all', label: `All (${customers.length})` },
            { key: 'customer', label: 'Customers' },
            { key: 'manager', label: `Managers (${totalManagers})` },
            { key: 'admin', label: 'Admins' },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setRoleFilter(tab.key)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '6px',
                border: 'none',
                background: roleFilter === tab.key ? '#FFC800' : 'transparent',
                color: roleFilter === tab.key ? '#000000' : '#A1A1AA',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      <div style={{
        background: '#0D0D10',
        border: '1px solid #27272A',
        borderRadius: '12px',
        overflow: 'hidden',
      }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#A1A1AA', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: '#FFC800' }} />
            <span style={{ fontSize: '0.85rem' }}>Loading customers directory...</span>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#71717A' }}>
            <Users size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
            <p style={{ fontSize: '0.9rem', color: '#FFFFFF', fontWeight: 600 }}>No customer records found</p>
            <p style={{ fontSize: '0.78rem', color: '#71717A', marginTop: '0.25rem' }}>
              {searchQuery ? 'Try clearing your search query.' : 'New customer registrations and order accounts will appear here automatically.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #27272A', background: '#111114' }}>
                  <th style={{ padding: '0.9rem 1.25rem', textAlign: 'left', color: '#71717A', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Customer / Staff
                  </th>
                  <th style={{ padding: '0.9rem 1.25rem', textAlign: 'left', color: '#71717A', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Contact
                  </th>
                  <th style={{ padding: '0.9rem 1.25rem', textAlign: 'left', color: '#71717A', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Orders & Spend
                  </th>
                  <th style={{ padding: '0.9rem 1.25rem', textAlign: 'left', color: '#71717A', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Role & Access
                  </th>
                  <th style={{ padding: '0.9rem 1.25rem', textAlign: 'left', color: '#71717A', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Joined
                  </th>
                  <th style={{ padding: '0.9rem 1.25rem', textAlign: 'right', color: '#71717A', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Manage Role
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((c) => {
                  const isAdm = c.role === 'admin';
                  const isMgr = c.role === 'manager';
                  const isBusy = updatingId === c.id;

                  return (
                    <tr
                      key={c.id}
                      style={{
                        borderBottom: '1px solid #1A1A1E',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#141418')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      {/* Customer info */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: isAdm ? 'rgba(255,200,0,0.15)' : (isMgr ? 'rgba(59,130,246,0.15)' : '#1A1A20'),
                            border: `1px solid ${isAdm ? 'rgba(255,200,0,0.35)' : (isMgr ? 'rgba(59,130,246,0.35)' : '#27272A')}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            {isAdm ? (
                              <Shield size={18} color="#FFC800" />
                            ) : isMgr ? (
                              <Briefcase size={18} color="#60A5FA" />
                            ) : (
                              <User size={18} color="#A1A1AA" />
                            )}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <p style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.2 }}>
                                {c.full_name || 'Customer'}
                              </p>
                              {c.source === 'order_guest' && (
                                <span style={{ fontSize: '0.62rem', background: '#27272A', color: '#A1A1AA', padding: '1px 5px', borderRadius: '3px' }}>
                                  Guest Buyer
                                </span>
                              )}
                            </div>
                            <p style={{ color: '#A1A1AA', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                              <Mail size={12} style={{ color: '#71717A' }} />
                              <span>{c.email}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        {c.phone_number ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#E4E4E7', fontSize: '0.82rem' }}>
                            <Phone size={12} style={{ color: '#FFC800' }} />
                            <span>{c.phone_number}</span>
                          </div>
                        ) : (
                          <span style={{ color: '#52525B', fontSize: '0.78rem' }}>No phone recorded</span>
                        )}
                      </td>

                      {/* Orders & Spend */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span style={{
                              padding: '2px 7px',
                              borderRadius: '4px',
                              background: c.orders_count > 0 ? 'rgba(16, 185, 129, 0.15)' : '#18181B',
                              color: c.orders_count > 0 ? '#34D399' : '#71717A',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                            }}>
                              {c.orders_count} {c.orders_count === 1 ? 'order' : 'orders'}
                            </span>
                          </div>
                          {c.total_spent > 0 && (
                            <span style={{ color: '#FFC800', fontSize: '0.78rem', fontWeight: 600 }}>
                              GH₵ {c.total_spent.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Role & Access Badge */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.25rem 0.6rem',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            width: 'fit-content',
                            background: isAdm ? 'rgba(255, 200, 0, 0.15)' : (isMgr ? 'rgba(59, 130, 246, 0.15)' : '#18181B'),
                            color: isAdm ? '#FFC800' : (isMgr ? '#60A5FA' : '#A1A1AA'),
                            border: isAdm ? '1px solid rgba(255, 200, 0, 0.35)' : (isMgr ? '1px solid rgba(59, 130, 246, 0.35)' : '1px solid #27272A'),
                          }}>
                            {isAdm && <Shield size={11} />}
                            {isMgr && <Briefcase size={11} />}
                            <span>{c.role}</span>
                          </span>

                          <span style={{ fontSize: '0.68rem', color: '#71717A' }}>
                            {isAdm ? 'Full Access' : isMgr ? 'Products & Orders (No Revenue)' : 'Storefront Customer'}
                          </span>
                        </div>
                      </td>

                      {/* Joined Date */}
                      <td style={{ padding: '1rem 1.25rem', color: '#A1A1AA', fontSize: '0.78rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Calendar size={12} style={{ color: '#71717A' }} />
                          <span>{new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </td>

                      {/* Role Actions */}
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        {c.source === 'order_guest' ? (
                          <span style={{ fontSize: '0.72rem', color: '#52525B' }}>Guest (Unregistered)</span>
                        ) : isAdm ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.72rem',
                            color: '#FFC800',
                            fontWeight: 700,
                            background: 'rgba(255, 200, 0, 0.08)',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            border: '1px solid rgba(255, 200, 0, 0.25)',
                          }}>
                            <Shield size={11} />
                            <span>Master Admin</span>
                          </span>
                        ) : (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                            {/* If Customer: Option to Make Manager */}
                            {!isMgr && (
                              <button
                                onClick={() => handleSetRole(c, 'manager')}
                                disabled={isBusy}
                                title="Grant staff access to upload/edit products and manage orders (revenue & customers hidden)"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  padding: '0.4rem 0.8rem',
                                  background: 'rgba(59, 130, 246, 0.12)',
                                  color: '#60A5FA',
                                  border: '1px solid rgba(59, 130, 246, 0.35)',
                                  borderRadius: '6px',
                                  fontSize: '0.74rem',
                                  fontWeight: 700,
                                  cursor: isBusy ? 'not-allowed' : 'pointer',
                                  opacity: isBusy ? 0.5 : 1,
                                  transition: 'all 0.15s',
                                }}
                              >
                                <Briefcase size={12} />
                                <span>Make Manager</span>
                              </button>
                            )}

                            {/* If Manager: Option to Demote to Customer */}
                            {isMgr && (
                              <button
                                onClick={() => handleSetRole(c, 'customer')}
                                disabled={isBusy}
                                title="Revoke staff privileges and return to regular customer"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  padding: '0.4rem 0.8rem',
                                  background: 'rgba(239, 68, 68, 0.1)',
                                  color: '#EF4444',
                                  border: '1px solid rgba(239, 68, 68, 0.3)',
                                  borderRadius: '6px',
                                  fontSize: '0.74rem',
                                  fontWeight: 700,
                                  cursor: isBusy ? 'not-allowed' : 'pointer',
                                  opacity: isBusy ? 0.5 : 1,
                                  transition: 'all 0.15s',
                                }}
                              >
                                <UserX size={12} />
                                <span>Demote to Customer</span>
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
