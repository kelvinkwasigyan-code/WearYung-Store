'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Lock, Mail, Eye, EyeOff, AlertCircle, CheckCircle2, KeyRound, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const AUTHORIZED_ADMIN_EMAILS = [
  'wearyungworldwide@gmail.com',
];

function checkIsAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return (
    AUTHORIZED_ADMIN_EMAILS.includes(normalized) ||
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase() === normalized)
  );
}

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
      // Reject unauthorized emails upfront
      if (!checkIsAdminEmail(email)) {
        throw new Error('Wrong credentials');
      }

      let authUser = null;

      // 1. Sign in with email and password
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        // If authorized admin email doesn't exist in Supabase auth yet, auto-provision
        if (checkIsAdminEmail(email)) {
          const { data: signUpData } = await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
              data: { role: 'admin', full_name: 'WEAR YUNG Admin' },
            },
          });

          if (signUpData?.session) {
            authUser = signUpData.user;
          } else if (signUpData?.user) {
            const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
              email: email.trim(),
              password,
            });
            if (!retryError && retryData?.user) {
              authUser = retryData.user;
            }
          }
        }

        if (!authUser) {
          throw new Error('Wrong credentials');
        }
      } else {
        authUser = signInData.user;
      }

      if (!authUser || !checkIsAdminEmail(authUser.email)) {
        if (authUser) {
          await supabase.auth.signOut();
        }
        throw new Error('Wrong credentials');
      }

      // 2. Fetch or update profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authUser.id)
        .maybeSingle();

      // Ensure admin role is set in the database for authorized admin
      if (!profile) {
        await supabase.from('profiles').upsert({
          id: authUser.id,
          role: 'admin',
          full_name: authUser.user_metadata?.full_name || 'Admin',
        });
      } else if (profile.role !== 'admin') {
        await supabase.from('profiles').update({ role: 'admin' }).eq('id', authUser.id);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 700);

    } catch (err: any) {
      setError(err?.message === 'Wrong credentials' ? 'Wrong credentials' : 'Wrong credentials');
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
              alignItems: 'center',
              gap: '0.65rem',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: '8px',
              padding: '0.85rem 1rem',
              color: '#F87171',
              fontSize: '0.86rem',
              marginBottom: '1.5rem',
              fontWeight: 500,
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
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
                color: '#D4D4D8',
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
                  placeholder="Enter admin email"
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
                  onFocus={(e) => e.target.style.borderColor = '#FFC800'}
                  onBlur={(e) => e.target.style.borderColor = '#27272A'}
                />
                <Mail size={16} style={{
                  position: 'absolute',
                  left: '0.9rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#71717A',
                }} />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#D4D4D8',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '0.45rem',
              }}>
                Security Key / Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    height: '48px',
                    padding: '0 2.6rem 0 2.6rem',
                    background: '#18181B',
                    border: '1px solid #27272A',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#FFC800'}
                  onBlur={(e) => e.target.style.borderColor = '#27272A'}
                />
                <Lock size={16} style={{
                  position: 'absolute',
                  left: '0.9rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#71717A',
                }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.9rem',
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
