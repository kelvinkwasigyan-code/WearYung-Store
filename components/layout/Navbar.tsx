'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { useCart } from '@/lib/cart';

interface NavbarProps {
  cartCount?: number;
}

export default function Navbar({ cartCount }: NavbarProps) {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cart = useCart();
  const displayCartCount = cartCount ?? cart.itemCount;

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Shop', href: '/shop' },
    { label: 'Clothing', href: '/shop?category=clothing' },
    { label: 'Sneakers', href: '/shop?category=sneakers' },
    { label: 'Watches', href: '/shop?category=watches' },
  ];

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(13,13,13,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--wy-border)' : 'none',
        }}
      >
        <div className="container-wy" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
          {/* Logo */}
          <Link
            href="/"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.75rem',
              letterSpacing: '0.12em',
              color: 'var(--wy-text)',
              textTransform: 'uppercase',
            }}
          >
            WEAR<span style={{ color: 'var(--wy-yellow)' }}>YUNG</span>
          </Link>

          {/* Desktop Nav Links */}
          <ul
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2rem',
              listStyle: 'none',
            }}
            className="hidden md:flex"
          >
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--wy-muted)',
                    transition: 'color 150ms ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--wy-text)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--wy-muted)')}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Cart */}
            <Link
              href="/cart"
              id="nav-cart-btn"
              style={{ position: 'relative', color: 'var(--wy-text)', display: 'flex', alignItems: 'center' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {displayCartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: 'var(--wy-yellow)',
                  color: 'var(--wy-canvas)',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {displayCartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <Link href="/account" id="nav-account-btn" className="btn btn-ghost btn-sm hidden md:inline-flex">
                Account
              </Link>
            ) : (
              <Link href="/auth/login" id="nav-login-btn" className="btn btn-outline btn-sm hidden md:inline-flex">
                Sign In
              </Link>
            )}

            {/* Mobile Hamburger */}
            <button
              id="nav-menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: 'none', border: 'none', color: 'var(--wy-text)', cursor: 'pointer', display: 'flex' }}
              className="md:hidden"
              aria-label="Toggle menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {menuOpen
                  ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                  : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            style={{
              background: 'var(--wy-surface)',
              borderTop: '1px solid var(--wy-border)',
              padding: '1rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
            className="md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--wy-muted)',
                  paddingBottom: '0.75rem',
                  borderBottom: '1px solid var(--wy-border)',
                }}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <Link href="/account" onClick={() => setMenuOpen(false)} className="btn btn-ghost btn-sm" style={{ width: 'fit-content' }}>Account</Link>
            ) : (
              <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="btn btn-outline btn-sm" style={{ width: 'fit-content' }}>Sign In</Link>
            )}
          </div>
        )}
      </nav>

      {/* Spacer */}
      <div style={{ height: '72px' }} />
    </>
  );
}
