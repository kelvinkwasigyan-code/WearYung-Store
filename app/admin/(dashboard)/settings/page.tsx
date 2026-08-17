'use client';

export const runtime = 'edge';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Lock,
  Shield,
  Key,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  Store,
  RefreshCw,
  Phone,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminSettingsPage() {
  const supabase = createClient();

  // User & Profile state
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentProfile, setCurrentProfile] = useState<any>(null);

  // Profile Form state
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Email Update state
  const [newEmail, setNewEmail] = useState('');
  const [updatingEmail, setUpdatingEmail] = useState(false);

  // Password Update state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Fetch current user and profile
  const loadUserData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCurrentUser(user);
      setNewEmail(user.email || '');

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profile) {
        setCurrentProfile(profile);
        setFullName(profile.full_name || user.user_metadata?.full_name || '');
        setPhoneNumber(profile.phone_number || '');
      } else {
        setFullName(user.user_metadata?.full_name || '');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUserData();
  }, []);

  // 1. Update Profile (Name, Phone)
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSavingProfile(true);

    try {
      // Update Supabase Auth user metadata
      await supabase.auth.updateUser({
        data: { full_name: fullName.trim() },
      });

      // Update profiles table
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: currentUser.id,
          full_name: fullName.trim(),
          phone_number: phoneNumber.trim(),
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      showToast('Admin profile updated successfully!', 'success');
      loadUserData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  // 2. Update Email Address
  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newEmail.trim()) return;

    if (newEmail.trim().toLowerCase() === currentUser.email?.toLowerCase()) {
      showToast('New email matches your current email address.', 'info');
      return;
    }

    setUpdatingEmail(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail.trim().toLowerCase(),
      });

      if (error) throw error;

      showToast(
        'Confirmation links sent! Please verify the confirmation email sent to your new email address to complete the change.',
        'info'
      );
    } catch (err: any) {
      showToast(err.message || 'Failed to update email address', 'error');
    } finally {
      setUpdatingEmail(false);
    }
  };

  // 3. Update Password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;

    if (newPassword.length < 8) {
      showToast('Password must be at least 8 characters long for security.', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match. Please re-enter.', 'error');
      return;
    }

    setUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setNewPassword('');
      setConfirmPassword('');
      showToast('Password changed successfully! Keep your new credentials safe.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to change password', 'error');
    } finally {
      setUpdatingPassword(false);
    }
  };

  // Reusable styling tokens
  const CARD: React.CSSProperties = {
    background: '#141416',
    border: '1px solid #27272A',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
  };

  const INPUT: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    background: '#1A1A1E',
    border: '1px solid #27272A',
    borderRadius: '10px',
    color: '#FFFFFF',
    fontSize: '0.85rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const LABEL: React.CSSProperties = {
    display: 'block',
    fontSize: '0.72rem',
    color: '#A1A1AA',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: 700,
    marginBottom: '0.45rem',
  };

  const PRIMARY_BTN: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    background: '#FFC800',
    color: '#000000',
    border: 'none',
    borderRadius: '10px',
    fontSize: '0.78rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

      {/* Toast Notification */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          style={{
            position: 'fixed',
            top: '1.5rem',
            right: '1.5rem',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            background: toast.type === 'error' ? '#EF4444' : toast.type === 'info' ? '#3B82F6' : '#10B981',
            color: '#FFFFFF',
            fontWeight: 600,
            fontSize: '0.85rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          }}
        >
          {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toast.message}</span>
        </motion.div>
      )}

      {/* Page Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FFC800' }} />
          <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#FFC800' }}>
            CREDENTIALS & PROFILE
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              color: '#FFFFFF',
              letterSpacing: '0.04em',
            }}>
              ADMIN SETTINGS
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#71717A', marginTop: '0.25rem' }}>
              Manage your administrator credentials, security keys, and store preferences.
            </p>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'rgba(255, 200, 0, 0.1)',
            borderRadius: '10px',
            border: '1px solid rgba(255, 200, 0, 0.25)',
          }}>
            <ShieldCheck size={16} color="#FFC800" />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#FFC800', letterSpacing: '0.08em' }}>
              ADMINISTRATOR (SUPERUSER)
            </span>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#71717A' }}>
          <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 1rem' }} />
          <p>Loading admin profile data...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '2rem' }}>

          {/* ========================================================================= */}
          {/* Card 1: Admin Profile Details */}
          {/* ========================================================================= */}
          <div style={CARD}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #27272A' }}>
              <User size={20} color="#FFC800" />
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#FFFFFF', letterSpacing: '0.04em' }}>
                  ADMIN PROFILE
                </h2>
                <p style={{ fontSize: '0.75rem', color: '#71717A' }}>Your public display and administrator identity</p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={LABEL}>Administrator Display Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Isaac Admin"
                  style={INPUT}
                  onFocus={(e) => e.target.style.borderColor = '#FFC800'}
                  onBlur={(e) => e.target.style.borderColor = '#27272A'}
                  required
                />
              </div>

              <div>
                <label style={LABEL}>Contact / Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+233 55 000 0000"
                  style={INPUT}
                  onFocus={(e) => e.target.style.borderColor = '#FFC800'}
                  onBlur={(e) => e.target.style.borderColor = '#27272A'}
                />
              </div>

              <div style={{
                padding: '0.85rem 1rem',
                background: '#1A1A1E',
                borderRadius: '10px',
                border: '1px solid #27272A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#E4E4E7', fontWeight: 600 }}>
                    Account Role
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#71717A' }}>
                    Full platform permissions and database access
                  </span>
                </div>
                <span style={{
                  padding: '0.25rem 0.65rem',
                  borderRadius: '6px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10B981',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}>
                  ACTIVE ADMIN
                </span>
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                style={{ ...PRIMARY_BTN, alignSelf: 'flex-start', marginTop: '0.5rem' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#e6b400'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#FFC800'}
              >
                <Save size={15} />
                <span>{savingProfile ? 'Saving...' : 'Save Profile Details'}</span>
              </button>
            </form>
          </div>

          {/* ========================================================================= */}
          {/* Card 2: Email & Login Credential */}
          {/* ========================================================================= */}
          <div style={CARD}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #27272A' }}>
              <Mail size={20} color="#FFC800" />
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#FFFFFF', letterSpacing: '0.04em' }}>
                  ADMIN LOGIN EMAIL
                </h2>
                <p style={{ fontSize: '0.75rem', color: '#71717A' }}>Update your primary login and notification email</p>
              </div>
            </div>

            <form onSubmit={handleUpdateEmail} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={LABEL}>Current Active Email</label>
                <input
                  type="email"
                  value={currentUser?.email || ''}
                  disabled
                  style={{ ...INPUT, opacity: 0.6, cursor: 'not-allowed', color: '#A1A1AA' }}
                />
              </div>

              <div>
                <label style={LABEL}>New Email Address</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email address"
                  style={INPUT}
                  onFocus={(e) => e.target.style.borderColor = '#FFC800'}
                  onBlur={(e) => e.target.style.borderColor = '#27272A'}
                  required
                />
                <span style={{ display: 'block', fontSize: '0.7rem', color: '#71717A', marginTop: '0.4rem', lineHeight: 1.4 }}>
                  ⚠️ Changing email requires confirmation from both old and new email inboxes.
                </span>
              </div>

              <button
                type="submit"
                disabled={updatingEmail}
                style={{ ...PRIMARY_BTN, alignSelf: 'flex-start', marginTop: '0.5rem' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#e6b400'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#FFC800'}
              >
                <RefreshCw size={14} className={updatingEmail ? 'animate-spin' : ''} />
                <span>{updatingEmail ? 'Sending Confirmation...' : 'Update Login Email'}</span>
              </button>
            </form>
          </div>

          {/* ========================================================================= */}
          {/* Card 3: Password & Security */}
          {/* ========================================================================= */}
          <div style={CARD}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #27272A' }}>
              <Lock size={20} color="#FFC800" />
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#FFFFFF', letterSpacing: '0.04em' }}>
                  CHANGE PASSWORD
                </h2>
                <p style={{ fontSize: '0.75rem', color: '#71717A' }}>Update your administrator secret password</p>
              </div>
            </div>

            <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={LABEL}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 8 characters)"
                    style={{ ...INPUT, paddingRight: '2.5rem' }}
                    onFocus={(e) => e.target.style.borderColor = '#FFC800'}
                    onBlur={(e) => e.target.style.borderColor = '#27272A'}
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
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={LABEL}>Confirm New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  style={INPUT}
                  onFocus={(e) => e.target.style.borderColor = '#FFC800'}
                  onBlur={(e) => e.target.style.borderColor = '#27272A'}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={updatingPassword}
                style={{ ...PRIMARY_BTN, alignSelf: 'flex-start', marginTop: '0.5rem' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#e6b400'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#FFC800'}
              >
                <Key size={14} />
                <span>{updatingPassword ? 'Updating Password...' : 'Update Password'}</span>
              </button>
            </form>
          </div>

          {/* ========================================================================= */}
          {/* Card 4: Store & Brand Preferences */}
          {/* ========================================================================= */}
          <div style={CARD}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #27272A' }}>
              <Store size={20} color="#FFC800" />
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#FFFFFF', letterSpacing: '0.04em' }}>
                  BRAND & STORE CONFIG
                </h2>
                <p style={{ fontSize: '0.75rem', color: '#71717A' }}>Global brand information and store parameters</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 1rem', background: '#1A1A1E', borderRadius: '10px', border: '1px solid #27272A' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.72rem', color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Brand Name
                  </span>
                  <span style={{ fontSize: '0.9rem', color: '#FFFFFF', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                    WEAR YUNG
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#FFC800', fontWeight: 700 }}>2026 EDITION</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 1rem', background: '#1A1A1E', borderRadius: '10px', border: '1px solid #27272A' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.72rem', color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Store Base Currency
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 600 }}>
                    Ghanaian Cedi (GH₵)
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700 }}>LIVE</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 1rem', background: '#1A1A1E', borderRadius: '10px', border: '1px solid #27272A' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.72rem', color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Concierge Support Contact
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 600 }}>
                    WhatsApp & MoMo Verified
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#A1A1AA' }}>Accra, Ghana</span>
              </div>

              <div style={{ padding: '0.85rem 1rem', background: '#18181A', borderRadius: '10px', border: '1px solid #27272A' }}>
                <span style={{ display: 'block', fontSize: '0.72rem', color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
                  Admin User UUID
                </span>
                <span style={{ fontSize: '0.75rem', color: '#A1A1AA', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  {currentUser?.id || '—'}
                </span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
