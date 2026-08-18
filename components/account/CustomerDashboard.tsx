'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { STORE_LOCATION, isAdminEmail } from '@/lib/constants';
import { updateCustomerProfile } from '@/app/actions/profile';
import {
  User,
  ShoppingBag,
  MapPin,
  CreditCard,
  HelpCircle,
  MessageCircle,
  Bell,
  ShieldCheck,
  ChevronRight,
  LogOut,
  Edit3,
  X,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Lock,
  Key,
  Eye,
  EyeOff,
  Mail,
  Shield,
} from 'lucide-react';

interface CustomerDashboardProps {
  initialUser: {
    id: string;
    email: string;
    created_at: string;
  };
  initialProfile: {
    id: string;
    full_name: string | null;
    phone_number: string | null;
    address: any;
    role: string;
    created_at: string;
  } | null;
  initialOrders: any[];
}

export default function CustomerDashboard({
  initialUser,
  initialProfile,
  initialOrders,
}: CustomerDashboardProps) {
  const router = useRouter();
  const supabase = createClient();

  // ADMIN GUARD: admins must never see the customer dashboard
  const isAdmin = initialProfile?.role === 'admin' || isAdminEmail(initialUser.email);
  if (isAdmin) {
    router.replace('/admin');
    return (
      <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFC800', fontFamily: 'var(--font-display)', fontSize: '1.2rem', letterSpacing: '0.08em' }}>
        Redirecting to Admin Dashboard...
      </div>
    );
  }

  const [profile, setProfile] = useState(initialProfile);
  const [orders] = useState(initialOrders || []);

  // Modal states
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileActiveTab, setProfileActiveTab] = useState<'profile' | 'credentials'>('profile');
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [isMomoModalOpen, setIsMomoModalOpen] = useState(false);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [isReleaseNotesOpen, setIsReleaseNotesOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);

  // Profile form state
  const [fullNameInput, setFullNameInput] = useState(profile?.full_name || '');
  const [phoneInput, setPhoneInput] = useState(profile?.phone_number || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Email update state
  const [newEmailInput, setNewEmailInput] = useState(initialUser.email || '');
  const [savingEmail, setSavingEmail] = useState(false);

  // Password update state
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Feedback notification
  const [accountFeedback, setAccountFeedback] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Address form state
  const currentAddress = profile?.address || {};
  const [streetInput, setStreetInput] = useState(currentAddress.street || '');
  const [cityInput, setCityInput] = useState(currentAddress.city || '');
  const [regionInput, setRegionInput] = useState(currentAddress.region || 'Greater Accra');
  const [postalCodeInput, setPostalCodeInput] = useState(currentAddress.postal_code || '');
  const [digitalAddressInput, setDigitalAddressInput] = useState(currentAddress.digital_address || '');
  const [savingAddress, setSavingAddress] = useState(false);

  // Notification toggle
  const [dropAlerts, setDropAlerts] = useState(true);

  // Date formatting
  const memberYear = new Date(initialUser.created_at || profile?.created_at || Date.now()).getFullYear();

  // Order stats
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'pending' || o.status === 'processing'
  ).length;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setAccountFeedback(null);

    const result = await updateCustomerProfile({
      full_name: fullNameInput.trim(),
      phone_number: phoneInput.trim(),
    });

    if (result.success && result.profile) {
      setProfile((prev: any) => ({ ...prev, ...result.profile }));
      setAccountFeedback({ text: 'Profile details saved successfully!', type: 'success' });
      setTimeout(() => setIsEditProfileOpen(false), 1200);
    } else {
      setAccountFeedback({ text: result.error || 'Failed to save profile', type: 'error' });
    }
    setSavingProfile(false);
  };

  const handleSaveEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmailInput.trim()) return;
    if (newEmailInput.trim().toLowerCase() === initialUser.email.toLowerCase()) {
      setAccountFeedback({ text: 'New email matches your current email.', type: 'info' });
      return;
    }
    setSavingEmail(true);
    setAccountFeedback(null);
    try {
      const { error } = await supabase.auth.updateUser(
        { email: newEmailInput.trim().toLowerCase() },
        { emailRedirectTo: `${window.location.origin}/account` }
      );
      if (error) throw error;
      setAccountFeedback({
        text: 'Confirmation email sent! Please check your email inbox to verify the new address.',
        type: 'success',
      });
    } catch (err: any) {
      setAccountFeedback({ text: err.message || 'Failed to update email address', type: 'error' });
    } finally {
      setSavingEmail(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasswordInput) return;
    if (newPasswordInput.length < 6) {
      setAccountFeedback({ text: 'Password must be at least 6 characters long.', type: 'error' });
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setAccountFeedback({ text: 'Passwords do not match. Please check and try again.', type: 'error' });
      return;
    }
    setSavingPassword(true);
    setAccountFeedback(null);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPasswordInput,
      });
      if (error) throw error;
      setNewPasswordInput('');
      setConfirmPasswordInput('');
      setAccountFeedback({ text: 'Password changed successfully! Your new password is now active.', type: 'success' });
    } catch (err: any) {
      setAccountFeedback({ text: err.message || 'Failed to change password', type: 'error' });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);

    const updatedAddress = {
      street: streetInput.trim(),
      city: cityInput.trim(),
      region: regionInput.trim(),
      postal_code: postalCodeInput.trim(),
      digital_address: digitalAddressInput.trim(),
    };

    const result = await updateCustomerProfile({
      address: updatedAddress,
    });

    if (result.success && result.profile) {
      setProfile((prev: any) => ({ ...prev, ...result.profile }));
      setIsEditAddressOpen(false);
    } else if (result.error) {
      alert(result.error);
    }
    setSavingAddress(false);
  };

  // Avatar initials
  const initials = (profile?.full_name || initialUser.email)
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0B0B0C',
      color: '#FFFFFF',
      paddingTop: '6.5rem',
      paddingBottom: '5rem',
      fontFamily: 'var(--font-body)',
    }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Top Bar / Breadcrumbs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#71717A' }}>
            <Link href="/" style={{ color: '#A1A1AA', transition: 'color 0.2s' }}>
              Home
            </Link>
            <span>/</span>
            <span style={{ color: '#FFFFFF', fontWeight: 600 }}>Account</span>
          </div>

          <button
            onClick={handleSignOut}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#141416',
              border: '1px solid #27272A',
              color: '#A1A1AA',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
              e.currentTarget.style.color = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#27272A';
              e.currentTarget.style.color = '#A1A1AA';
            }}
          >
            <LogOut size={13} />
            <span>Log Out</span>
          </button>
        </div>

        {/* Profile Header Card */}
        <div style={{
          background: '#141416',
          border: '1px solid #27272A',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        }}>
          {/* Ambient Glow */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(255, 200, 0, 0.07) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            position: 'relative',
            zIndex: 1,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              {/* Avatar with Electric Yellow Ring */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '76px',
                  height: '76px',
                  borderRadius: '50%',
                  background: '#0D0D0D',
                  border: '2px solid #FFC800',
                  boxShadow: '0 0 16px rgba(255, 200, 0, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  fontWeight: 'bold',
                  fontFamily: 'monospace',
                  color: '#FFC800',
                }}>
                  {initials || 'WY'}
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: 2,
                  right: 2,
                  width: '14px',
                  height: '14px',
                  background: '#10b981',
                  border: '2px solid #141416',
                  borderRadius: '50%',
                }} />
              </div>

              {/* User details */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                  <h1 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.75rem, 3.5vw, 2.35rem)',
                    color: '#FFFFFF',
                    letterSpacing: '0.04em',
                    lineHeight: 1,
                  }}>
                    {profile?.full_name || 'WEAR YUNG MEMBER'}
                  </h1>
                  {profile?.role === 'admin' && (
                    <span style={{
                      background: 'rgba(255, 200, 0, 0.12)',
                      border: '1px solid rgba(255, 200, 0, 0.35)',
                      color: '#FFC800',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '4px',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}>
                      ADMIN
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.8rem', color: '#A1A1AA', flexWrap: 'wrap' }}>
                  <span>{initialUser.email}</span>
                  <span style={{ color: '#52525B' }}>•</span>
                  <span style={{ color: '#71717A' }}>Member since {memberYear}</span>
                  {profile?.phone_number && (
                    <>
                      <span style={{ color: '#52525B' }}>•</span>
                      <span style={{ color: '#A1A1AA' }}>{profile.phone_number}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              {profile?.role === 'admin' && (
                <Link
                  href="/admin"
                  id="account-admin-portal-btn"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.65rem 1.15rem',
                    borderRadius: '10px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    background: '#FFC800',
                    border: '1px solid #FFC800',
                    color: '#000000',
                    textDecoration: 'none',
                    boxShadow: '0 4px 16px rgba(255, 200, 0, 0.25)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#FFFFFF';
                    e.currentTarget.style.borderColor = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#FFC800';
                    e.currentTarget.style.borderColor = '#FFC800';
                  }}
                >
                  <ShieldCheck size={14} />
                  <span>Admin Portal</span>
                </Link>
              )}

              <button
                onClick={() => {
                  setProfileActiveTab('profile');
                  setAccountFeedback(null);
                  setIsEditProfileOpen(true);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.65rem 1.15rem',
                  borderRadius: '10px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  background: '#1A1A1E',
                  border: '1px solid #3F3F46',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#FFC800';
                  e.currentTarget.style.background = '#222226';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#3F3F46';
                  e.currentTarget.style.background = '#1A1A1E';
                }}
              >
                <Edit3 size={13} />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={() => {
                  setProfileActiveTab('credentials');
                  setAccountFeedback(null);
                  setIsEditProfileOpen(true);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.65rem 1.15rem',
                  borderRadius: '10px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  background: 'rgba(255, 200, 0, 0.1)',
                  border: '1px solid rgba(255, 200, 0, 0.35)',
                  color: '#FFC800',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#FFC800';
                  e.currentTarget.style.color = '#000000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 200, 0, 0.1)';
                  e.currentTarget.style.color = '#FFC800';
                }}
              >
                <Lock size={13} />
                <span>Credentials & Security</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Metric Cards (2-Column Grid on Web) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}>

          {/* My Orders Card */}
          <div style={{
            background: '#141416',
            border: '1px solid #27272A',
            borderRadius: '16px',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', color: '#A1A1AA', textTransform: 'uppercase' }}>
                  My Orders
                </span>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: '#0D0D0D',
                  border: '1px solid #27272A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFC800',
                }}>
                  <ShoppingBag size={18} />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.75rem', color: '#FFFFFF', lineHeight: 1 }}>
                  {totalOrdersCount}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Total Orders Placed
                </span>
              </div>

              <p style={{ fontSize: '0.8rem', color: '#A1A1AA', lineHeight: 1.5 }}>
                {pendingOrdersCount > 0 ? (
                  <span style={{ color: '#FFC800', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Clock size={13} /> {pendingOrdersCount} order{pendingOrdersCount > 1 ? 's' : ''} currently in fulfillment
                  </span>
                ) : (
                  'All shipments completed & delivered.'
                )}
              </p>
            </div>

            <button
              onClick={() => setIsOrdersModalOpen(true)}
              style={{
                marginTop: '1.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid #27272A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#FFC800',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                background: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                borderBottom: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span>View Order History</span>
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Saved Addresses Card */}
          <div style={{
            background: '#141416',
            border: '1px solid #27272A',
            borderRadius: '16px',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', color: '#A1A1AA', textTransform: 'uppercase' }}>
                  Saved Delivery Address
                </span>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: '#0D0D0D',
                  border: '1px solid #27272A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFC800',
                }}>
                  <MapPin size={18} />
                </div>
              </div>

              {currentAddress.street ? (
                <div>
                  <p style={{ fontSize: '0.92rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '0.25rem' }}>
                    {currentAddress.street}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#A1A1AA' }}>
                    {currentAddress.city}, {currentAddress.region}{' '}
                    {currentAddress.postal_code && `(${currentAddress.postal_code})`}
                  </p>
                  {currentAddress.digital_address && (
                    <p style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#71717A', marginTop: '0.35rem' }}>
                      GPS: {currentAddress.digital_address}
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '0.9rem', color: '#E4E4E7', fontWeight: 600, marginBottom: '0.25rem' }}>
                    No primary address saved
                  </p>
                  <p style={{ fontSize: '0.78rem', color: '#71717A', lineHeight: 1.5 }}>
                    Add your shipping address for one-click checkout on exclusive drops.
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsEditAddressOpen(true)}
              style={{
                marginTop: '1.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid #27272A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#FFC800',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                background: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                borderBottom: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span>{currentAddress.street ? 'Edit Address' : 'Add Address'}</span>
              <ChevronRight size={15} />
            </button>
          </div>

        </div>

        {/* Streetwear Exclusive Banner (WEAR YUNG DROP PASS) */}
        <div style={{
          background: 'linear-gradient(135deg, #18181B 0%, #141416 50%, #18181B 100%)',
          border: '1px solid rgba(255, 200, 0, 0.3)',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '240px',
            height: '100%',
            background: 'radial-gradient(circle, rgba(255, 200, 0, 0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            position: 'relative',
            zIndex: 1,
          }}>
            <div style={{ maxWidth: '620px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FFC800' }} />
                <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#FFC800' }}>
                  ACTIVE MEMBERSHIP
                </span>
              </div>

              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                color: '#FFFFFF',
                letterSpacing: '0.04em',
                marginBottom: '0.5rem',
              }}>
                WEAR YUNG DROP PASS — 2026 TIER
              </h2>

              <p style={{ fontSize: '0.82rem', color: '#A1A1AA', lineHeight: 1.6 }}>
                Enjoy 15-minute early access to all Friday capsule drops, free priority Accra/Kumasi courier dispatch, and private archive restocks.
              </p>
            </div>

            <Link
              href="/shop"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 1.4rem',
                borderRadius: '10px',
                background: '#FFC800',
                color: '#000000',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#e6b400'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#FFC800'}
            >
              <Package size={15} />
              <span>Explore Latest Drops</span>
            </Link>
          </div>
        </div>

        {/* Settings & Utility Grid (3 Columns) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}>

          {/* Column 1: Payment & Billing */}
          <div style={{
            background: '#141416',
            border: '1px solid #27272A',
            borderRadius: '16px',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #27272A' }}>
                <CreditCard size={17} color="#FFC800" />
                <h3 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#E4E4E7' }}>
                  Payment & Billing
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  onClick={() => setIsMomoModalOpen(true)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    background: '#1A1A1E',
                    border: '1px solid #27272A',
                    color: '#E4E4E7',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#3F3F46';
                    e.currentTarget.style.background = '#222226';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#27272A';
                    e.currentTarget.style.background = '#1A1A1E';
                  }}
                >
                  <span>MoMo & Card Receipts</span>
                  <ChevronRight size={14} color="#71717A" />
                </button>
              </div>
            </div>
            <p style={{ fontSize: '0.72rem', color: '#71717A', marginTop: '1.5rem' }}>
              Receipts are issued instantly upon payment confirmation.
            </p>
          </div>

          {/* Column 2: Concierge & Support */}
          <div style={{
            background: '#141416',
            border: '1px solid #27272A',
            borderRadius: '16px',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #27272A' }}>
                <HelpCircle size={17} color="#FFC800" />
                <h3 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#E4E4E7' }}>
                  Concierge & Support
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  onClick={() => setIsFaqModalOpen(true)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    background: '#1A1A1E',
                    border: '1px solid #27272A',
                    color: '#E4E4E7',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#3F3F46';
                    e.currentTarget.style.background = '#222226';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#27272A';
                    e.currentTarget.style.background = '#1A1A1E';
                  }}
                >
                  <span>Help Center & Sizing FAQs</span>
                  <ChevronRight size={14} color="#71717A" />
                </button>

                <a
                  href="https://wa.me/WEAR_YUNG?text=Hello%20WEAR%20YUNG%20Concierge,%20I%20need%20assistance"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    background: '#1A1A1E',
                    border: '1px solid #27272A',
                    color: '#E4E4E7',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#3F3F46';
                    e.currentTarget.style.background = '#222226';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#27272A';
                    e.currentTarget.style.background = '#1A1A1E';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MessageCircle size={14} color="#10b981" />
                    <span>WhatsApp VIP (@WEAR_YUNG)</span>
                  </div>
                  <ExternalLink size={13} color="#71717A" />
                </a>

                {/* Get Directions Link */}
                <a
                  href={STORE_LOCATION.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    background: '#1A1A1E',
                    border: '1px solid #27272A',
                    color: '#E4E4E7',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#FFC800';
                    e.currentTarget.style.background = '#222226';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#27272A';
                    e.currentTarget.style.background = '#1A1A1E';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={14} color="#FFC800" />
                    <span>Store: Koforidua, Behind B Foster Bakery</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#FFC800', fontWeight: 700, textTransform: 'uppercase' }}>Directions ↗</span>
                </a>

                {/* Drop Alerts Switch */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  background: '#1A1A1E',
                  border: '1px solid #27272A',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Bell size={14} color="#FFC800" />
                    <span style={{ fontSize: '0.8rem', color: '#E4E4E7', fontWeight: 500 }}>
                      Drop Push Alerts
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDropAlerts(!dropAlerts)}
                    style={{
                      width: '38px',
                      height: '22px',
                      borderRadius: '999px',
                      background: dropAlerts ? '#FFC800' : '#27272A',
                      border: 'none',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                      padding: '2px',
                    }}
                  >
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: '#000000',
                      transform: dropAlerts ? 'translateX(16px)' : 'translateX(0)',
                      transition: 'transform 0.2s',
                    }} />
                  </button>
                </div>
              </div>
            </div>
            <p style={{ fontSize: '0.72rem', color: '#71717A', marginTop: '1.5rem' }}>
              VIP Concierge response time: &lt; 15 mins.
            </p>
          </div>

          {/* Column 3: Brand & Legal */}
          <div style={{
            background: '#141416',
            border: '1px solid #27272A',
            borderRadius: '16px',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #27272A' }}>
                <ShieldCheck size={17} color="#FFC800" />
                <h3 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#E4E4E7' }}>
                  Brand & Legal
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  onClick={() => setIsReleaseNotesOpen(true)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    background: '#1A1A1E',
                    border: '1px solid #27272A',
                    color: '#E4E4E7',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#3F3F46';
                    e.currentTarget.style.background = '#222226';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#27272A';
                    e.currentTarget.style.background = '#1A1A1E';
                  }}
                >
                  <span>Release Notes & What&apos;s New</span>
                  <ChevronRight size={14} color="#71717A" />
                </button>

                <button
                  onClick={() => setIsLegalModalOpen(true)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    background: '#1A1A1E',
                    border: '1px solid #27272A',
                    color: '#E4E4E7',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#3F3F46';
                    e.currentTarget.style.background = '#222226';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#27272A';
                    e.currentTarget.style.background = '#1A1A1E';
                  }}
                >
                  <span>Terms & Privacy Policy</span>
                  <ChevronRight size={14} color="#71717A" />
                </button>
              </div>
            </div>

            <p style={{ fontSize: '0.72rem', color: '#71717A', marginTop: '1.5rem' }}>
              © {new Date().getFullYear()} WEAR YUNG LLC.
            </p>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* Edit Profile & Credentials Settings Modal */}
      <AnimatePresence>
        {isEditProfileOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                background: '#141416',
                border: '1px solid #27272A',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '520px',
                padding: '1.75rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #27272A' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Shield size={18} color="#FFC800" />
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: '#FFFFFF', letterSpacing: '0.04em' }}>
                    Account Settings & Credentials
                  </h3>
                </div>
                <button
                  onClick={() => setIsEditProfileOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#71717A', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Tab Navigation */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', background: '#0D0D0E', padding: '4px', borderRadius: '10px', border: '1px solid #27272A' }}>
                <button
                  type="button"
                  onClick={() => {
                    setProfileActiveTab('profile');
                    setAccountFeedback(null);
                  }}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    padding: '0.55rem',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    background: profileActiveTab === 'profile' ? '#FFC800' : 'transparent',
                    color: profileActiveTab === 'profile' ? '#000000' : '#A1A1AA',
                    border: 'none',
                  }}
                >
                  <User size={14} />
                  <span>Profile Info</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProfileActiveTab('credentials');
                    setAccountFeedback(null);
                  }}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    padding: '0.55rem',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    background: profileActiveTab === 'credentials' ? '#FFC800' : 'transparent',
                    color: profileActiveTab === 'credentials' ? '#000000' : '#A1A1AA',
                    border: 'none',
                  }}
                >
                  <Key size={14} />
                  <span>Credentials & Security</span>
                </button>
              </div>

              {/* Feedback Banner */}
              {accountFeedback && (
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  background: accountFeedback.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : accountFeedback.type === 'info' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  border: accountFeedback.type === 'error' ? '1px solid rgba(239, 68, 68, 0.3)' : accountFeedback.type === 'info' ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                  color: accountFeedback.type === 'error' ? '#FCA5A5' : accountFeedback.type === 'info' ? '#93C5FD' : '#6EE7B7',
                }}>
                  {accountFeedback.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                  <span>{accountFeedback.text}</span>
                </div>
              )}

              {/* TAB 1: Profile Details */}
              {profileActiveTab === 'profile' && (
                <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem', fontWeight: 700 }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullNameInput}
                      onChange={(e) => setFullNameInput(e.target.value)}
                      placeholder="Enter your full name"
                      className="input-wy"
                      style={{ width: '100%' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem', fontWeight: 700 }}>
                      Phone / Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="+233 55 000 0000"
                      className="input-wy"
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem', fontWeight: 700 }}>
                      Active Login Email
                    </label>
                    <input
                      type="email"
                      value={initialUser.email}
                      disabled
                      className="input-wy"
                      style={{ width: '100%', opacity: 0.6, cursor: 'not-allowed' }}
                    />
                    <span style={{ display: 'block', fontSize: '0.7rem', color: '#71717A', marginTop: '0.35rem' }}>
                      To update your login email or password, switch to the <strong>Credentials & Security</strong> tab above.
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setIsEditProfileOpen(false)}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        borderRadius: '10px',
                        background: '#1A1A1E',
                        color: '#A1A1AA',
                        border: '1px solid #27272A',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingProfile}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        borderRadius: '10px',
                        background: '#FFC800',
                        color: '#000000',
                        border: 'none',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                      }}
                    >
                      {savingProfile ? 'Saving...' : 'Save Profile'}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: Credentials & Security */}
              {profileActiveTab === 'credentials' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Email Update Form */}
                  <form onSubmit={handleSaveEmail} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', background: '#1A1A1E', borderRadius: '12px', border: '1px solid #27272A' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#FFC800', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      <Mail size={14} />
                      <span>Change Login Email</span>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
                        New Email Address
                      </label>
                      <input
                        type="email"
                        value={newEmailInput}
                        onChange={(e) => setNewEmailInput(e.target.value)}
                        placeholder="Enter new email address"
                        className="input-wy"
                        style={{ width: '100%' }}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={savingEmail}
                      style={{
                        padding: '0.6rem 1rem',
                        borderRadius: '8px',
                        background: '#FFC800',
                        color: '#000000',
                        border: 'none',
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        alignSelf: 'flex-start',
                      }}
                    >
                      {savingEmail ? 'Sending Link...' : 'Update Email Address'}
                    </button>
                  </form>

                  {/* Password Change Form */}
                  <form onSubmit={handleSavePassword} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', background: '#1A1A1E', borderRadius: '12px', border: '1px solid #27272A' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#FFC800', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      <Lock size={14} />
                      <span>Change Password</span>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
                        New Password (min 6 characters)
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={newPasswordInput}
                          onChange={(e) => setNewPasswordInput(e.target.value)}
                          placeholder="Enter new password"
                          className="input-wy"
                          style={{ width: '100%', paddingRight: '2.5rem' }}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: 'absolute',
                            right: '0.75rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: '#71717A',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
                        Confirm New Password
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPasswordInput}
                        onChange={(e) => setConfirmPasswordInput(e.target.value)}
                        placeholder="Re-enter new password"
                        className="input-wy"
                        style={{ width: '100%' }}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={savingPassword}
                      style={{
                        padding: '0.6rem 1rem',
                        borderRadius: '8px',
                        background: '#FFC800',
                        color: '#000000',
                        border: 'none',
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        alignSelf: 'flex-start',
                      }}
                    >
                      {savingPassword ? 'Updating Password...' : 'Save New Password'}
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Address Modal */}
      <AnimatePresence>
        {isEditAddressOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                background: '#141416',
                border: '1px solid #27272A',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '460px',
                padding: '1.75rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid #27272A' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#FFFFFF', letterSpacing: '0.04em' }}>
                  Update Delivery Address
                </h3>
                <button
                  onClick={() => setIsEditAddressOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#71717A', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveAddress} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
                    Street / House / Landmark
                  </label>
                  <input
                    type="text"
                    value={streetInput}
                    onChange={(e) => setStreetInput(e.target.value)}
                    placeholder="e.g. 14 Boundary Road, East Legon"
                    className="input-wy"
                    style={{ width: '100%' }}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
                      City / Town
                    </label>
                    <input
                      type="text"
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                      placeholder="Accra"
                      className="input-wy"
                      style={{ width: '100%' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
                      Region
                    </label>
                    <select
                      value={regionInput}
                      onChange={(e) => setRegionInput(e.target.value)}
                      className="input-wy"
                      style={{ width: '100%' }}
                    >
                      <option value="Greater Accra">Greater Accra</option>
                      <option value="Ashanti">Ashanti</option>
                      <option value="Western">Western</option>
                      <option value="Central">Central</option>
                      <option value="Eastern">Eastern</option>
                      <option value="Volta">Volta</option>
                      <option value="Northern">Northern</option>
                      <option value="Other">Other Region</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
                      Ghana Post GPS
                    </label>
                    <input
                      type="text"
                      value={digitalAddressInput}
                      onChange={(e) => setDigitalAddressInput(e.target.value)}
                      placeholder="e.g. GA-183-9021"
                      className="input-wy"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={postalCodeInput}
                      onChange={(e) => setPostalCodeInput(e.target.value)}
                      placeholder="00233"
                      className="input-wy"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsEditAddressOpen(false)}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      borderRadius: '10px',
                      background: '#1A1A1E',
                      color: '#A1A1AA',
                      border: '1px solid #27272A',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingAddress}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      borderRadius: '10px',
                      background: '#FFC800',
                      color: '#000000',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                    }}
                  >
                    {savingAddress ? 'Saving...' : 'Save Address'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Orders Modal */}
      <AnimatePresence>
        {isOrdersModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                background: '#141416',
                border: '1px solid #27272A',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '600px',
                maxHeight: '85vh',
                padding: '1.75rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #27272A' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#FFFFFF', letterSpacing: '0.04em' }}>
                    Order History & Dispatches
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#71717A', marginTop: '0.2rem' }}>
                    {orders.length} order{orders.length === 1 ? '' : 's'} placed under this account
                  </p>
                </div>
                <button
                  onClick={() => setIsOrdersModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#71717A', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <ShoppingBag size={36} color="#52525B" style={{ margin: '0 auto 0.75rem' }} />
                    <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#E4E4E7' }}>No orders found</p>
                    <p style={{ fontSize: '0.75rem', color: '#71717A', marginTop: '0.25rem' }}>
                      Explore our catalog to place your first streetwear order.
                    </p>
                    <Link
                      href="/shop"
                      onClick={() => setIsOrdersModalOpen(false)}
                      style={{
                        display: 'inline-block',
                        marginTop: '1rem',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        background: '#FFC800',
                        color: '#000',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                      }}
                    >
                      Go to Shop
                    </Link>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order.id}
                      style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        background: '#1A1A1E',
                        border: '1px solid #27272A',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#71717A', display: 'block' }}>
                            ORDER #{order.id.slice(0, 8)}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#A1A1AA' }}>
                            {new Date(order.created_at).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFC800', display: 'block' }}>
                            GH₵ {order.total_amount}
                          </span>
                          <span style={{
                            display: 'inline-block',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            background: '#27272A',
                            color: '#E4E4E7',
                          }}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {order.order_items && order.order_items.length > 0 && (
                        <div style={{ paddingTop: '0.5rem', borderTop: '1px solid #27272A', fontSize: '0.75rem', color: '#A1A1AA', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          {order.order_items.map((item: any) => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>
                                {item.product_variants?.products?.title || 'Item'} × {item.quantity}
                              </span>
                              <span style={{ color: '#E4E4E7', fontFamily: 'monospace' }}>
                                GH₵ {item.unit_price}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MoMo & Receipts Modal */}
      <AnimatePresence>
        {isMomoModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                background: '#141416',
                border: '1px solid #27272A',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '460px',
                padding: '1.75rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #27272A' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#FFFFFF', letterSpacing: '0.04em' }}>
                  Billing & MoMo Receipts
                </h3>
                <button
                  onClick={() => setIsMomoModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#71717A', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ fontSize: '0.8rem', color: '#A1A1AA', display: 'flex', flexDirection: 'column', gap: '1rem', lineHeight: 1.6 }}>
                <p>
                  All digital receipts and Mobile Money confirmations for purchases made through Paystack or Stripe are emailed directly to:
                </p>
                <div style={{ padding: '0.75rem 1rem', background: '#0D0D0D', border: '1px solid #27272A', borderRadius: '10px', fontFamily: 'monospace', color: '#FFC800' }}>
                  {initialUser.email}
                </div>
                <p>
                  Need an official VAT invoice or custom corporate receipt? Please message the concierge team via WhatsApp with your Order ID.
                </p>
              </div>

              <button
                onClick={() => setIsMomoModalOpen(false)}
                style={{
                  width: '100%',
                  marginTop: '1.5rem',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  background: '#1A1A1E',
                  color: '#FFFFFF',
                  border: '1px solid #27272A',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FAQs Modal */}
      <AnimatePresence>
        {isFaqModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                background: '#141416',
                border: '1px solid #27272A',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '520px',
                padding: '1.75rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #27272A' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#FFFFFF', letterSpacing: '0.04em' }}>
                  Concierge FAQ & Sizing
                </h3>
                <button
                  onClick={() => setIsFaqModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#71717A', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ fontSize: '0.8rem', color: '#E4E4E7', display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '350px', overflowY: 'auto' }}>
                <div>
                  <p style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '0.25rem' }}>How do Friday Capsule Drops work?</p>
                  <p style={{ color: '#A1A1AA', lineHeight: 1.6 }}>
                    Drops occur every Friday at 6:00 PM GMT. VIP members get instant priority checkout 15 minutes before public unlock.
                  </p>
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '0.25rem' }}>What are the delivery timelines?</p>
                  <p style={{ color: '#A1A1AA', lineHeight: 1.6 }}>
                    Same-day delivery in Greater Accra for orders before 2:00 PM. Nationwide deliveries across Ghana take 24–48 hours.
                  </p>
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '0.25rem' }}>How do WEAR YUNG hoodies fit?</p>
                  <p style={{ color: '#A1A1AA', lineHeight: 1.6 }}>
                    Our silhouettes feature a heavy-weight, dropped-shoulder boxy cut. True to size for a streetwear drape, or size down for tailored fit.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsFaqModalOpen(false)}
                style={{
                  width: '100%',
                  marginTop: '1.5rem',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  background: '#1A1A1E',
                  color: '#FFFFFF',
                  border: '1px solid #27272A',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Release Notes Modal */}
      <AnimatePresence>
        {isReleaseNotesOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                background: '#141416',
                border: '1px solid #27272A',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '460px',
                padding: '1.75rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #27272A' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#FFFFFF', letterSpacing: '0.04em' }}>
                  Release Notes — v2.4
                </h3>
                <button
                  onClick={() => setIsReleaseNotesOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#71717A', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ fontSize: '0.8rem', color: '#A1A1AA', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} color="#FFC800" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Real-time Supabase Auth & Account Sync integration.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} color="#FFC800" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>VIP Drop Pass tier access enabled for 2026 registered accounts.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} color="#FFC800" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Enhanced delivery address book with Ghana Post GPS support.</span>
                </div>
              </div>

              <button
                onClick={() => setIsReleaseNotesOpen(false)}
                style={{
                  width: '100%',
                  marginTop: '1.5rem',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  background: '#1A1A1E',
                  color: '#FFFFFF',
                  border: '1px solid #27272A',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Legal & Privacy Modal */}
      <AnimatePresence>
        {isLegalModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                background: '#141416',
                border: '1px solid #27272A',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '460px',
                padding: '1.75rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #27272A' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#FFFFFF', letterSpacing: '0.04em' }}>
                  Terms & Privacy
                </h3>
                <button
                  onClick={() => setIsLegalModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#71717A', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ fontSize: '0.8rem', color: '#A1A1AA', display: 'flex', flexDirection: 'column', gap: '0.75rem', lineHeight: 1.6 }}>
                <p>
                  WEAR YUNG respects your privacy. All customer data is secured with enterprise Row Level Security (RLS) policies.
                </p>
                <p>
                  Orders placed during exclusive drop windows are final sale due to limited inventory allocation.
                </p>
              </div>

              <button
                onClick={() => setIsLegalModalOpen(false)}
                style={{
                  width: '100%',
                  marginTop: '1.5rem',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  background: '#1A1A1E',
                  color: '#FFFFFF',
                  border: '1px solid #27272A',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                I Understand
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
