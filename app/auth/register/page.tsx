'use client';

import { useState } from 'react';
import Link from 'next/link';
import { registerAction } from '@/app/actions/auth';

export default function RegisterPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const formData = new FormData(e.currentTarget);

    if (formData.get('password') !== formData.get('confirm_password')) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    const result = await registerAction(formData);
    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setSuccess(result.success);
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem',
      background: 'radial-gradient(ellipse at center, rgba(255,200,0,0.05) 0%, transparent 70%), var(--wy-canvas)',
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', letterSpacing: '0.12em', color: 'var(--wy-text)' }}>
            WEAR <span style={{ color: 'var(--wy-yellow)' }}>YUNG</span>
          </Link>
          <p style={{ color: 'var(--wy-muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Create your account
          </p>
        </div>

        <div style={{
          padding: '2rem',
          background: 'var(--wy-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--wy-border)',
        }}>
          {success ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(34,197,94,0.15)',
                border: '2px solid var(--wy-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--wy-success)" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <p style={{ color: 'var(--wy-text)', fontWeight: 600, marginBottom: '0.5rem' }}>{success}</p>
              <Link href="/auth/login" style={{ color: 'var(--wy-yellow)', fontSize: '0.875rem', fontWeight: 600 }}>
                Go to Login →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label htmlFor="full_name" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--wy-muted)', marginBottom: '0.4rem' }}>
                  Full Name
                </label>
                <input id="full_name" name="full_name" type="text" required placeholder="John Doe" className="input-wy" />
              </div>

              <div>
                <label htmlFor="email" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--wy-muted)', marginBottom: '0.4rem' }}>
                  Email
                </label>
                <input id="email" name="email" type="email" required placeholder="you@example.com" className="input-wy" autoComplete="email" />
              </div>

              <div>
                <label htmlFor="password" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--wy-muted)', marginBottom: '0.4rem' }}>
                  Password
                </label>
                <input id="password" name="password" type="password" required placeholder="Min 6 characters" className="input-wy" autoComplete="new-password" minLength={6} />
              </div>

              <div>
                <label htmlFor="confirm_password" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--wy-muted)', marginBottom: '0.4rem' }}>
                  Confirm Password
                </label>
                <input id="confirm_password" name="confirm_password" type="password" required placeholder="Repeat password" className="input-wy" autoComplete="new-password" />
              </div>

              {error && (
                <div style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 1rem',
                  color: 'var(--wy-danger)',
                  fontSize: '0.875rem',
                }}>
                  {error}
                </div>
              )}

              <button
                id="register-submit-btn"
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}

          {!success && (
            <p style={{ textAlign: 'center', color: 'var(--wy-muted)', fontSize: '0.875rem', marginTop: '1.5rem' }}>
              Already have an account?{' '}
              <Link href="/auth/login" style={{ color: 'var(--wy-yellow)', fontWeight: 600 }}>
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
