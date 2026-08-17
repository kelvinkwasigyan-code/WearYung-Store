'use client';

import { Suspense, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Eye, EyeOff, ArrowRight, ArrowLeft, Mail, Lock, User, Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { notifyNewUserAction } from '@/app/actions/auth';

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/account';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [view, setView] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (view === 'sign-up') {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: fullName, phone_number: phone },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTarget)}`,
        },
      });

      if (error) {
        setError(error.message);
      } else {
        if (data?.user) {
          notifyNewUserAction({
            email: data.user.email || email,
            name: fullName || data.user.user_metadata?.full_name || 'Anonymous User',
            userId: data.user.id,
          }).catch(console.error);
        }

        if (data.session) {
          router.push(redirectTarget);
          router.refresh();
        } else {
          setSuccess('Check your email for the confirmation link.');
        }
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        router.push(redirectTarget);
        router.refresh();
      }
    }
    setLoading(false);
  };

  const switchView = (newView: 'sign-in' | 'sign-up') => {
    setView(newView);
    setError(null);
    setSuccess(null);
    setEmail('');
    setPassword('');
    setFullName('');
    setPhone('');
    setShowPassword(false);
  };

  return (
    <div className="min-h-[calc(100dvh-72px)] w-full grid grid-cols-1 lg:grid-cols-2 lg:h-[calc(100dvh-72px)] lg:overflow-hidden bg-[#09090B]">
      {/* ─── Left: Brand Panel (Desktop Dual Image Left Column) ─── */}
      <div className="hidden lg:flex relative flex-col justify-end p-6 xl:p-8 bg-[#0a0a0a] overflow-hidden h-full">
        {/* 2-column dual image grid */}
        <div
          style={{
            position: 'absolute',
            inset: '1.25rem',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid #1E1E24',
          }}
        >
          {['/sign-in-image.jpg', '/sign-in-image2.jpg'].map((src, i) => (
            <div
              key={src}
              style={{
                position: 'relative',
                borderRadius: i === 0 ? '14px 0 0 14px' : '0 14px 14px 0',
                overflow: 'hidden',
                background: '#111',
              }}
            >
              <img
                src={src}
                alt="WEAR YUNG"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center 15%',
                  display: 'block',
                }}
              />
            </div>
          ))}

          {/* Gradient overlay across both images for crisp text readability */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.2) 35%, rgba(0,0,0,0.85) 75%, rgba(0,0,0,0.98) 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Brand text overlay */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            padding: '1.25rem 1rem 1rem 1rem',
            marginBottom: '0.5rem',
          }}
        >
          <Link href="/" style={{ display: 'inline-block', marginBottom: '0.65rem', textDecoration: 'none' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.15rem',
                color: '#FFC800',
                letterSpacing: '0.1em',
              }}
            >
              WEAR YUNG
            </span>
          </Link>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              color: '#FFFFFF',
              lineHeight: 1.1,
              letterSpacing: '0.03em',
              margin: '0 0 0.4rem 0',
              textTransform: 'uppercase',
            }}
          >
            DRESS LIKE<br />
            <span style={{ color: '#FFC800' }}>YOU MEAN IT.</span>
          </h2>
          <p style={{ color: '#A1A1AA', fontSize: '0.85rem', lineHeight: 1.45, margin: 0, maxWidth: '420px' }}>
            Premium streetwear curated for those who move different.
          </p>
        </div>
      </div>

      {/* ─── Right: Auth Form Stage (Desktop Right Column / Mobile Full Width) ─── */}
      <div className="relative flex flex-col justify-center items-center p-4 py-10 pb-24 lg:p-8 lg:overflow-y-auto bg-[#0a0a0a] h-full w-full">
        {/* Mobile Background Dual Image Layer (Mobile Only < 1024px) */}
        <div
          className="lg:hidden"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', opacity: 0.28, filter: 'contrast(1.15) brightness(0.6)' }}>
            <div style={{ position: 'relative', height: '100%', width: '100%' }}>
              <img
                src="/sign-in-image.jpg"
                alt="Wear Yung Background 1"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }}
              />
            </div>
            <div style={{ position: 'relative', height: '100%', width: '100%' }}>
              <img
                src="/sign-in-image2.jpg"
                alt="Wear Yung Background 2"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }}
              />
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `
                linear-gradient(180deg, rgba(9, 9, 11, 0.7) 0%, rgba(9, 9, 11, 0.88) 40%, rgba(9, 9, 11, 0.98) 100%),
                radial-gradient(circle at 50% 20%, rgba(255, 200, 0, 0.1) 0%, transparent 60%)
              `,
            }}
          />
        </div>

        {/* Form Container Card: Matches Original Card Design Exactly */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            background: '#121214',
            border: '1px solid #27272A',
            borderRadius: '18px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
          }}
          className="max-w-[380px] p-4 sm:max-w-[440px] sm:p-6"
        >
          {/* Top Bar: Back Button & Tab Pills */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              marginBottom: '1.5rem',
            }}
          >
            {/* Back Button */}
            <button
              type="button"
              onClick={() => router.back()}
              title="Go back"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#1A1A1E',
                border: '1px solid #27272A',
                borderRadius: '10px',
                width: '42px',
                height: '42px',
                color: '#D4D4D8',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <ArrowLeft size={16} />
            </button>

            {/* Tabs Switcher */}
            <div
              style={{
                display: 'flex',
                flex: 1,
                background: '#1A1A1E',
                borderRadius: '10px',
                padding: '4px',
                border: '1px solid #27272A',
                height: '42px',
              }}
            >
              {(['sign-in', 'sign-up'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => switchView(tab)}
                  style={{
                    flex: 1,
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    transition: 'all 0.2s ease',
                    background: view === tab ? '#FFC800' : 'transparent',
                    color: view === tab ? '#000000' : '#71717A',
                  }}
                >
                  {tab === 'sign-in' ? 'SIGN IN' : 'CREATE ACCOUNT'}
                </button>
              ))}
            </div>
          </div>

          {/* Form Header */}
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <div style={{ marginBottom: '1.25rem' }}>
                <h1
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.65rem, 4vw, 2.15rem)',
                    color: '#FFFFFF',
                    letterSpacing: '0.04em',
                    lineHeight: 1.1,
                    margin: '0 0 0.35rem',
                  }}
                >
                  {view === 'sign-in' ? 'WELCOME BACK' : 'JOIN THE CREW'}
                </h1>
                <p
                  style={{
                    color: '#A1A1AA',
                    fontSize: '0.82rem',
                    margin: 0,
                    lineHeight: 1.35,
                  }}
                >
                  {view === 'sign-in'
                    ? 'Sign in to access your orders, saved grails & wishlist.'
                    : 'Create your account to unlock exclusive perks.'}
                </p>
              </div>

              {/* Alerts */}
              {error && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    padding: '0.75rem 1rem',
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    borderRadius: '10px',
                    color: '#EF4444',
                    fontSize: '0.82rem',
                    marginBottom: '1.25rem',
                  }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    padding: '0.75rem 1rem',
                    background: 'rgba(34, 197, 94, 0.12)',
                    border: '1px solid rgba(34, 197, 94, 0.35)',
                    borderRadius: '10px',
                    color: '#22C55E',
                    fontSize: '0.82rem',
                    marginBottom: '1.25rem',
                  }}
                >
                  <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{success}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
                {view === 'sign-up' && (
                  <>
                    {/* Full Name */}
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          color: '#A1A1AA',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          marginBottom: '0.4rem',
                        }}
                      >
                        Full Name
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Kwame Mensah"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          style={{
                            width: '100%',
                            height: '46px',
                            padding: '0 1rem 0 2.6rem',
                            background: '#E8EDFB',
                            borderRadius: '10px',
                            border: 'none',
                            color: '#000000',
                            fontSize: '0.92rem',
                            outline: 'none',
                          }}
                        />
                        <User size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#4B5563' }} />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          color: '#A1A1AA',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          marginBottom: '0.4rem',
                        }}
                      >
                        Phone Number
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="tel"
                          placeholder="+233 55 000 0000"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          style={{
                            width: '100%',
                            height: '46px',
                            padding: '0 1rem 0 2.6rem',
                            background: '#E8EDFB',
                            borderRadius: '10px',
                            border: 'none',
                            color: '#000000',
                            fontSize: '0.92rem',
                            outline: 'none',
                          }}
                        />
                        <Phone size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#4B5563' }} />
                      </div>
                    </div>
                  </>
                )}

                {/* Email Address */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: '#A1A1AA',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      marginBottom: '0.4rem',
                    }}
                  >
                    Email Address
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
                        height: '46px',
                        padding: '0 1rem 0 2.6rem',
                        background: '#E8EDFB',
                        borderRadius: '10px',
                        border: 'none',
                        color: '#000000',
                        fontSize: '0.92rem',
                        outline: 'none',
                      }}
                    />
                    <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#4B5563' }} />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <label
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: '#A1A1AA',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                      }}
                    >
                      Password
                    </label>
                    {view === 'sign-in' && (
                      <span style={{ fontSize: '0.75rem', color: '#FFC800', fontWeight: 700, cursor: 'pointer' }}>
                        Forgot?
                      </span>
                    )}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        width: '100%',
                        height: '46px',
                        padding: '0 2.6rem 0 2.6rem',
                        background: '#E8EDFB',
                        borderRadius: '10px',
                        border: 'none',
                        color: '#000000',
                        fontSize: '0.92rem',
                        outline: 'none',
                      }}
                    />
                    <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#4B5563' }} />
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
                        color: '#4B5563',
                        cursor: 'pointer',
                        display: 'flex',
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    height: '48px',
                    marginTop: '0.45rem',
                    borderRadius: '10px',
                    background: '#FFC800',
                    border: 'none',
                    color: '#000000',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.95rem',
                    fontWeight: 900,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    boxShadow: '0 4px 18px rgba(255, 200, 0, 0.3)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {loading ? 'PROCESSING...' : view === 'sign-in' ? 'SIGN IN →' : 'CREATE ACCOUNT →'}
                </button>
              </form>

              {/* Bottom Switcher Link */}
              <div style={{ textAlign: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #1E1E24' }}>
                <p style={{ color: '#A1A1AA', fontSize: '0.8rem', margin: 0 }}>
                  {view === 'sign-in' ? "Don't have an account yet?" : 'Already have an account?'}{' '}
                  <button
                    type="button"
                    onClick={() => switchView(view === 'sign-in' ? 'sign-up' : 'sign-in')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#FFC800',
                      fontWeight: 800,
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                    }}
                  >
                    {view === 'sign-in' ? 'Create VIP Account' : 'Sign In Here'}
                  </button>
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '80vh', background: '#0a0a0a' }} />}>
      <LoginForm />
    </Suspense>
  );
}
