'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Eye, EyeOff, ArrowRight, ArrowLeft, Mail } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
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
        email,
        password,
        options: {
          data: { full_name: fullName, phone_number: phone },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        setError(error.message);
      } else if (data.session) {
        // If session exists, email confirmation is off. Auto-login successful!
        router.push('/account');
        router.refresh();
      } else {
        setSuccess('Check your email for the confirmation link.');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else {
        router.push('/account');
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
    <div style={{
      height: 'calc(100dvh - 72px)',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      background: 'var(--wy-canvas)',
      overflow: 'hidden',
    }} className="max-lg:grid-cols-1">

      {/* Left: Brand Panel */}
      <div
        className="hidden lg:flex"
        style={{
          position: 'relative',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '1.25rem',
          background: '#0a0a0a',
          overflow: 'hidden',
          gap: '0',
        }}
      >
        {/* 2-column image grid */}
        <div style={{
          position: 'absolute',
          inset: '1.25rem',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.75rem',
          borderRadius: '16px',
          overflow: 'hidden',
        }}>
          {['/sign-in-image.jpg', '/sign-in-image2.jpg'].map((src, i) => (
            <div key={src} style={{
              position: 'relative',
              borderRadius: i === 0 ? '14px 0 0 14px' : '0 14px 14px 0',
              overflow: 'hidden',
              background: '#111',
            }}>
              <img
                src={src}
                alt="WEAR YUNG"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  display: 'block',
                }}
              />
            </div>
          ))}

          {/* Gradient overlay across both images */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.05) 100%)',
            pointerEvents: 'none',
          }} />
        </div>

        {/* Brand text overlay */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <Link href="/" style={{ display: 'inline-block', marginBottom: '0.75rem' }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem',
              color: '#FFC800',
              letterSpacing: '0.1em',
            }}>
              WEAR YUNG
            </span>
          </Link>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
            color: 'var(--wy-text)',
            lineHeight: 1.15,
            letterSpacing: '0.03em',
            marginBottom: '0.4rem',
          }}>
            DRESS LIKE<br />
            <span style={{ color: '#FFC800' }}>YOU MEAN IT.</span>
          </p>
          <p style={{ color: 'var(--wy-muted)', fontSize: '0.82rem', lineHeight: 1.5 }}>
            Premium streetwear curated for those who move different.
          </p>
        </div>
      </div>

      {/* Right: Auth Form */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1.5rem 2rem',
        background: '#0a0a0a',
        overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>

          {/* Tab switcher with integrated back button */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem',
          }}>
            {/* Back icon */}
            <button
              onClick={() => router.back()}
              title="Go back"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'transparent',
                border: '1px solid #333',
                borderRadius: '8px',
                width: '40px', height: '40px',
                color: 'var(--wy-muted)',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'border-color 0.2s, color 0.2s, background 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#555'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--wy-text)'; (e.currentTarget as HTMLButtonElement).style.background = '#1a1a1a'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#333'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--wy-muted)'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              <ArrowLeft size={16} />
            </button>

            {/* Tabs */}
            <div style={{
              display: 'flex',
              flex: 1,
              background: '#111',
              borderRadius: '8px',
              padding: '4px',
              border: '1px solid #222',
              height: '40px',
            }}>
              {(['sign-in', 'sign-up'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => switchView(tab)}
                  style={{
                    flex: 1,
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.85rem',
                    letterSpacing: '0.08em',
                    transition: 'all 0.2s',
                    background: view === tab ? '#FFC800' : 'transparent',
                    color: view === tab ? '#000' : 'var(--wy-muted)',
                  }}
                >
                  {tab === 'sign-in' ? 'SIGN IN' : 'SIGN UP'}
                </button>
              ))}
            </div>
          </div>

          {/* Form header */}
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
                color: 'var(--wy-text)',
                letterSpacing: '0.04em',
                marginBottom: '0.25rem',
              }}>
                {view === 'sign-in' ? 'WELCOME BACK' : 'JOIN THE CREW'}
              </h1>
              <p style={{ color: 'var(--wy-muted)', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
                {view === 'sign-in'
                  ? 'Sign in to access your orders and wishlist.'
                  : 'Create an account to unlock exclusive perks.'}
              </p>

              {/* Form */}
              <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                {view === 'sign-up' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                  >
                    <input
                      type="text"
                      placeholder="Full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="input-wy"
                      style={{ width: '100%' }}
                    />
                    <input
                      type="tel"
                      placeholder="Phone number (e.g. +233 55 000 0000)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input-wy"
                      style={{ width: '100%' }}
                    />
                  </motion.div>
                )}

                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-wy"
                  required
                />

                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-wy"
                    required
                    style={{ width: '100%', paddingRight: '3rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: '1rem', top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--wy-muted)', display: 'flex',
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Error/Success Messages */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      style={{
                        padding: '0.75rem 1rem',
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '6px',
                        color: '#f87171',
                        fontSize: '0.85rem',
                      }}
                    >
                      {error}
                    </motion.div>
                  )}
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      style={{
                        padding: '0.75rem 1rem',
                        background: 'rgba(255,200,0,0.08)',
                        border: '1px solid rgba(255,200,0,0.3)',
                        borderRadius: '6px',
                        color: '#FFC800',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <Mail size={14} />
                      {success}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.9rem 1.5rem',
                    background: loading ? '#888' : '#FFC800',
                    color: '#000',
                    border: 'none',
                    borderRadius: '6px',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1rem',
                    letterSpacing: '0.08em',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'background 0.2s, transform 0.1s',
                  }}
                >
                  {loading ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                        style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid #000', borderTopColor: 'transparent', borderRadius: '50%' }}
                      />
                      PROCESSING...
                    </>
                  ) : (
                    <>
                      {view === 'sign-in' ? 'SIGN IN' : 'CREATE ACCOUNT'}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <p style={{ textAlign: 'center', color: 'var(--wy-muted)', fontSize: '0.78rem', marginTop: '1rem' }}>
                {view === 'sign-in' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  onClick={() => switchView(view === 'sign-in' ? 'sign-up' : 'sign-in')}
                  style={{
                    background: 'none', border: 'none',
                    color: '#FFC800', cursor: 'pointer',
                    fontSize: '0.8rem', textDecoration: 'underline',
                  }}
                >
                  {view === 'sign-in' ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
