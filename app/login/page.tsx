'use client';

import { Suspense, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, Phone, CheckCircle2, AlertCircle } from 'lucide-react';
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
          setSuccess('Account created! Please check your email for the confirmation link.');
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
    <div className="min-h-[calc(100dvh-72px)] w-full grid grid-cols-1 lg:grid-cols-2 lg:h-[calc(100dvh-72px)] lg:overflow-hidden bg-[#070709] relative">
      {/* Ambient background glow accents */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-amber-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* ─── Left: Brand Panel (Desktop Dual Image Left Column) ─── */}
      <div className="hidden lg:flex relative flex-col justify-end p-6 xl:p-8 bg-[#070709] overflow-hidden h-full">
        {/* 2-column dual image grid */}
        <div
          style={{
            position: 'absolute',
            inset: '1.25rem',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {['/sign-in-image.jpg', '/sign-in-image2.jpg'].map((src, i) => (
            <div
              key={src}
              style={{
                position: 'relative',
                borderRadius: i === 0 ? '18px 0 0 18px' : '0 18px 18px 0',
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

          {/* Gradient overlay across both images */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 35%, rgba(7,7,9,0.85) 75%, rgba(7,7,9,0.98) 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Brand text overlay */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            padding: '2rem 1.75rem 1.75rem',
            marginBottom: '0.5rem',
          }}
        >
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem', textDecoration: 'none' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.3rem',
                color: '#FFC800',
                letterSpacing: '0.12em',
              }}
            >
              WEAR YUNG
            </span>
          </Link>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.9rem, 3.4vw, 2.75rem)',
              color: '#FFFFFF',
              lineHeight: 1.1,
              letterSpacing: '0.04em',
              margin: '0 0 0.5rem 0',
              textTransform: 'uppercase',
            }}
          >
            DRESS LIKE<br />
            <span style={{ color: '#FFC800' }}>YOU MEAN IT.</span>
          </h2>
          <p style={{ color: '#A1A1AA', fontSize: '0.9rem', lineHeight: 1.5, margin: 0, maxWidth: '440px' }}>
            Premium streetwear curated for those who move different.
          </p>
        </div>
      </div>

      {/* ─── Right: Auth Form Stage (Desktop Right Column / Mobile Full Width) ─── */}
      <div className="relative flex flex-col justify-center items-center p-4 py-10 pb-24 sm:p-6 lg:p-12 lg:overflow-y-auto h-full w-full">
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
          <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', opacity: 0.2, filter: 'contrast(1.15) brightness(0.55)' }}>
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
                linear-gradient(180deg, rgba(7, 7, 9, 0.7) 0%, rgba(7, 7, 9, 0.92) 40%, rgba(7, 7, 9, 0.99) 100%),
                radial-gradient(circle at 50% 20%, rgba(255, 200, 0, 0.1) 0%, transparent 60%)
              `,
            }}
          />
        </div>

        {/* Form Container Card: Spacious Ultra-Glassmorphic Floating Panel */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            background: 'rgba(18, 18, 22, 0.65)',
            backdropFilter: 'blur(28px) saturate(190%)',
            WebkitBackdropFilter: 'blur(28px) saturate(190%)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '24px',
            boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.9), 0 0 35px rgba(255, 200, 0, 0.03), inset 0 1px 0 0 rgba(255, 255, 255, 0.12)',
          }}
          className="max-w-[450px] p-6 sm:max-w-[500px] sm:p-10 md:p-11"
        >
          {/* Top Bar: Back Button & Glassy Tab Switcher */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              marginBottom: '2rem',
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
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                width: '46px',
                height: '46px',
                color: '#D4D4D8',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255, 200, 0, 0.4)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
            >
              <ArrowLeft size={17} />
            </button>

            {/* Glassy Tabs Switcher */}
            <div
              style={{
                display: 'flex',
                flex: 1,
                background: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '12px',
                padding: '4px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                height: '46px',
              }}
            >
              {(['sign-in', 'sign-up'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => switchView(tab)}
                  style={{
                    flex: 1,
                    borderRadius: '9px',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                    transition: 'all 0.25s ease',
                    background: view === tab ? '#FFC800' : 'transparent',
                    color: view === tab ? '#000000' : '#A1A1AA',
                    boxShadow: view === tab ? '0 2px 10px rgba(255, 200, 0, 0.3)' : 'none',
                  }}
                >
                  {tab === 'sign-in' ? 'Sign In' : 'Create Account'}
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
              <div style={{ marginBottom: '1.75rem' }}>
                <h1
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.8rem, 4vw, 2.35rem)',
                    color: '#FFFFFF',
                    letterSpacing: '0.04em',
                    lineHeight: 1.15,
                    margin: '0 0 0.5rem',
                  }}
                >
                  {view === 'sign-in' ? 'WELCOME BACK' : 'JOIN WEAR YUNG'}
                </h1>
                <p
                  style={{
                    color: '#A1A1AA',
                    fontSize: '0.88rem',
                    margin: 0,
                    lineHeight: 1.5,
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
                    padding: '0.9rem 1.1rem',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    borderRadius: '12px',
                    color: '#FCA5A5',
                    fontSize: '0.84rem',
                    marginBottom: '1.5rem',
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
                    padding: '0.9rem 1.1rem',
                    background: 'rgba(34, 197, 94, 0.15)',
                    border: '1px solid rgba(34, 197, 94, 0.35)',
                    borderRadius: '12px',
                    color: '#86EFAC',
                    fontSize: '0.84rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{success}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {view === 'sign-up' && (
                  <>
                    {/* Full Name */}
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          color: '#E4E4E7',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          marginBottom: '0.5rem',
                        }}
                      >
                        Full Name
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          required
                          placeholder="Kwame Mensah"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          style={{
                            width: '100%',
                            height: '50px',
                            padding: '0 1.25rem 0 2.9rem',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            color: '#FFFFFF',
                            fontSize: '0.92rem',
                            outline: 'none',
                            transition: 'all 0.2s ease',
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#FFC800';
                            e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                            e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                          }}
                        />
                        <User size={17} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#A1A1AA' }} />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          color: '#E4E4E7',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          marginBottom: '0.5rem',
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
                            height: '50px',
                            padding: '0 1.25rem 0 2.9rem',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            color: '#FFFFFF',
                            fontSize: '0.92rem',
                            outline: 'none',
                            transition: 'all 0.2s ease',
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#FFC800';
                            e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                            e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                          }}
                        />
                        <Phone size={17} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#A1A1AA' }} />
                      </div>
                    </div>
                  </>
                )}

                {/* Email Address */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      color: '#E4E4E7',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        height: '50px',
                        padding: '0 1.25rem 0 2.9rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#FFFFFF',
                        fontSize: '0.92rem',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#FFC800';
                        e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                        e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                      }}
                    />
                    <Mail size={17} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#A1A1AA' }} />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        color: '#E4E4E7',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                      }}
                    >
                      Password
                    </label>
                    {view === 'sign-in' && (
                      <Link
                        href="/login"
                        onClick={(e) => {
                          e.preventDefault();
                          alert('Please contact support or email concierge@wearyung.com to reset your password.');
                        }}
                        style={{ fontSize: '0.78rem', color: '#FFC800', fontWeight: 600, textDecoration: 'none' }}
                      >
                        Forgot?
                      </Link>
                    )}
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
                        height: '50px',
                        padding: '0 2.9rem 0 2.9rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#FFFFFF',
                        fontSize: '0.92rem',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#FFC800';
                        e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                        e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                      }}
                    />
                    <Lock size={17} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#A1A1AA' }} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#A1A1AA',
                        cursor: 'pointer',
                        display: 'flex',
                      }}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    height: '52px',
                    marginTop: '0.5rem',
                    borderRadius: '12px',
                    background: '#FFC800',
                    border: 'none',
                    color: '#000000',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.94rem',
                    fontWeight: 700,
                    letterSpacing: '0.03em',
                    textTransform: 'uppercase',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    boxShadow: '0 4px 24px rgba(255, 200, 0, 0.3)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#e6b400'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#FFC800'}
                >
                  {loading ? 'Processing...' : view === 'sign-in' ? 'Sign In →' : 'Create Account →'}
                </button>
              </form>

              {/* Bottom Switcher Link */}
              <div style={{ textAlign: 'center', marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <p style={{ color: '#A1A1AA', fontSize: '0.86rem', margin: 0 }}>
                  {view === 'sign-in' ? "Don't have an account yet?" : 'Already have an account?'}{' '}
                  <button
                    type="button"
                    onClick={() => switchView(view === 'sign-in' ? 'sign-up' : 'sign-in')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#FFC800',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '0.86rem',
                      marginLeft: '0.25rem',
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
    <Suspense fallback={<div style={{ minHeight: '80vh', background: '#070709' }} />}>
      <LoginForm />
    </Suspense>
  );
}
