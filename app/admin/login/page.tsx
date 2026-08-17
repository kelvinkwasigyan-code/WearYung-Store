'use client';

export const runtime = 'edge';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();

    try {
      // 1. Sign in with email and password
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        throw new Error(signInError.message || 'Invalid administrator credentials');
      }

      if (!data.user) {
        throw new Error('Authentication failed: No user found');
      }

      // 2. Verify admin role in profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle();

      // Admin check: role-based OR email-based
      const isAdminUser = profile?.role === 'admin' || data.user.email === 'admin@wearyung.com';

      // If profile exists and user is not admin, deny access
      if (profile && !isAdminUser) {
        await supabase.auth.signOut();
        throw new Error('Access Denied: Your account does not have administrative privileges.');
      }

      // Auto-fix: ensure admin role is set in the database
      if (profile && profile.role !== 'admin' && isAdminUser) {
        await supabase.from('profiles').update({ role: 'admin' }).eq('id', data.user.id);
      }

      // If no profile yet, create one with admin role
      if (!profile && isAdminUser) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          role: 'admin',
          full_name: data.user.user_metadata?.full_name || 'Admin',
        });
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 700);

    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080808',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      position: 'relative',
    }}>
      {/* Subtle Grid background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(#1A1A1E 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        opacity: 0.5,
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%',
        maxWidth: '440px',
        position: 'relative',
        zIndex: 10,
      }}>
        {/* Security Badge Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem',
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'rgba(255, 200, 0, 0.1)',
            border: '1px solid rgba(255, 200, 0, 0.25)',
            color: '#FFC800',
            marginBottom: '1rem',
          }}>
            <Shield size={28} />
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            color: '#FFFFFF',
            letterSpacing: '0.06em',
            lineHeight: 1.1,
          }}>
            WEAR YUNG // ADMIN PORTAL
          </h1>
          <p style={{
            fontSize: '0.75rem',
            color: '#A1A1AA',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginTop: '0.35rem',
            fontWeight: 600,
          }}>
            Restricted Access • Authorized Personnel Only
          </p>
        </div>

        {/* Form Card */}
        <div style={{
          background: '#121214',
          border: '1px solid #27272A',
          borderRadius: '16px',
          padding: 'clamp(1.5rem, 4vw, 2.25rem) clamp(1.2rem, 3.5vw, 2rem)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
        }}>
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.65rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '0.85rem 1rem',
              color: '#F87171',
              fontSize: '0.82rem',
              marginBottom: '1.5rem',
              lineHeight: 1.4,
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '8px',
              padding: '0.85rem 1rem',
              color: '#34D399',
              fontSize: '0.82rem',
              marginBottom: '1.5rem',
            }}>
              <CheckCircle2 size={16} />
              <span>Access Granted. Redirecting to Dashboard...</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Email Field */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#A1A1AA',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '0.45rem',
              }}>
                Administrator Email
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  placeholder="admin@wearyung.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    height: '48px',
                    padding: '0 1rem 0 2.6rem',
                    background: '#18181B',
                    border: '1px solid #27272A',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#FFC800'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#27272A'}
                />
                <Mail
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#71717A',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                <label style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#A1A1AA',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}>
                  Security Key / Password
                </label>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    height: '48px',
                    padding: '0 2.75rem 0 2.6rem',
                    background: '#18181B',
                    border: '1px solid #27272A',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#FFC800'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#27272A'}
                />
                <Lock
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#71717A',
                    pointerEvents: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#71717A',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success}
              style={{
                width: '100%',
                padding: '0.9rem',
                borderRadius: '8px',
                background: '#FFC800',
                color: '#000000',
                border: 'none',
                fontFamily: 'var(--font-display)',
                fontSize: '1rem',
                letterSpacing: '0.08em',
                fontWeight: 700,
                cursor: loading || success ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '0.5rem',
                transition: 'background 0.2s, transform 0.1s',
                opacity: loading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading && !success) e.currentTarget.style.background = '#e6b400';
              }}
              onMouseLeave={(e) => {
                if (!loading && !success) e.currentTarget.style.background = '#FFC800';
              }}
            >
              <KeyRound size={16} />
              <span>{loading ? 'AUTHENTICATING...' : 'AUTHENTICATE & ENTER'}</span>
            </button>
          </form>
        </div>

        {/* Back to store link */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#71717A',
              fontSize: '0.8rem',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#FFC800'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#71717A'}
          >
            <ArrowLeft size={14} />
            <span>Return to WEAR YUNG Storefront</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
