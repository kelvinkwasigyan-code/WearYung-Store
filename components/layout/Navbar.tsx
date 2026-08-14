'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { useCartContext } from '@/context/CartContext';
import { Search, Heart, ShoppingBag, Menu, X, User as UserIcon } from 'lucide-react';
import { ALL_CATEGORIES, CATEGORY_LABELS, type ProductCategory } from '@/types/ecommerce';

interface NavbarProps {
  cartCount?: number;
}

export default function Navbar({ cartCount }: NavbarProps) {
  const [user, setUser] = useState<User | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { itemCount, toggleCart } = useCartContext();
  const displayCartCount = cartCount ?? itemCount;

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

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [drawerOpen]);

  const mainHeaderLinks = [
    { label: 'SHOP', href: '/shop' },
    { label: 'JUST IN', href: '/?filter=just-in' },
    { label: 'LOOKBOOK', href: '/lookbook' },
    { label: 'ABOUT', href: '/about' },
    { label: 'CONTACT SUPPORT', href: '/contact' },
  ];

  const supportUtilities = [
    { label: 'TRACK ORDER', href: '/track-order' },
    { label: 'LOOKBOOK', href: '/lookbook' },
    { label: 'SIZE GUIDE', href: '/size-guide' },
    { label: 'FAQ', href: '/faq' },
  ];

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(13,13,13,0.96)' : 'rgba(13,13,13,0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--wy-border)',
        }}
      >
        <div
          className="container-wy"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '72px',
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{ display: 'flex', alignItems: 'center' }}
            id="nav-brand-logo"
          >
            <Image
              src="/logo.jpeg"
              alt="WEAR YUNG"
              width={200}
              height={60}
              style={{ objectFit: 'contain', maxHeight: '56px', width: 'auto' }}
              priority
            />
          </Link>

          {/* Desktop Main Header Navigation */}
          <ul
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2.25rem',
              listStyle: 'none',
            }}
            className="hidden lg:flex"
          >
            {mainHeaderLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors duration-200 hover:text-[#FFC800]"
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--wy-text)',
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right-Side Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Search Icon */}
            <Link
              href="/shop"
              id="nav-search-btn"
              aria-label="Search"
              className="transition-colors duration-200 text-white hover:text-[#FFC800] p-2"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <Search size={20} strokeWidth={2} />
            </Link>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              id="nav-wishlist-btn"
              aria-label="Wishlist"
              className="transition-colors duration-200 text-white hover:text-[#FFC800] p-2"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <Heart size={20} strokeWidth={2} />
            </Link>

            {/* Cart Button */}
            <button
              type="button"
              onClick={toggleCart}
              id="nav-cart-btn"
              aria-label="Open Cart"
              className="transition-colors duration-200 text-white hover:text-[#FFC800] p-2"
              style={{
                position: 'relative',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ShoppingBag size={20} strokeWidth={2} />
              {displayCartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
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
                  }}
                >
                  {displayCartCount}
                </span>
              )}
            </button>

            {/* Account / Auth */}
            {user ? (
              <Link
                href="/account"
                id="nav-account-btn"
                aria-label="Account"
                className="btn btn-ghost btn-sm hidden md:inline-flex"
                style={{ gap: '0.35rem' }}
              >
                <UserIcon size={14} />
                <span>Account</span>
              </Link>
            ) : (
              <Link
                href="/auth/login"
                id="nav-login-btn"
                className="btn btn-outline btn-sm hidden md:inline-flex"
              >
                Sign In
              </Link>
            )}

            {/* Hamburger Menu Toggle (Drawer Sheet Trigger) */}
            <button
              id="nav-drawer-toggle"
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation drawer"
              className="transition-colors duration-200 text-white hover:text-[#FFC800] p-2"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Menu size={24} strokeWidth={2} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hamburger Slide-Out Drawer (Sheet) */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          style={{ background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(6px)' }}
          onClick={() => setDrawerOpen(false)}
        >
          <div
            className="w-full max-w-sm h-full flex flex-col justify-between"
            style={{
              background: '#0D0D0D',
              borderLeft: '1px solid var(--wy-border)',
              padding: '1.75rem',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Drawer Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '1.25rem',
                  borderBottom: '1px solid var(--wy-border)',
                  marginBottom: '1.5rem',
                }}
              >
                <Image
                  src="/logo.jpeg"
                  alt="WEAR YUNG"
                  width={150}
                  height={45}
                  style={{ objectFit: 'contain', maxHeight: '42px', width: 'auto' }}
                />
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close navigation drawer"
                  className="transition-colors duration-200 text-white hover:text-[#FFC800] p-2"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <X size={24} strokeWidth={2} />
                </button>
              </div>

              {/* Main Visible Header Navigation (for Mobile / quick access) */}
              <div style={{ marginBottom: '1.75rem' }}>
                <p
                  style={{
                    fontSize: '0.7rem',
                    letterSpacing: '0.15em',
                    color: 'var(--wy-muted)',
                    textTransform: 'uppercase',
                    marginBottom: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  NAVIGATION
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {mainHeaderLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setDrawerOpen(false)}
                      className="transition-colors duration-200 text-white hover:text-[#FFC800]"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.25rem',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Category Links */}
              <div style={{ marginBottom: '1.75rem' }}>
                <p
                  style={{
                    fontSize: '0.7rem',
                    letterSpacing: '0.15em',
                    color: 'var(--wy-muted)',
                    textTransform: 'uppercase',
                    marginBottom: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  CATEGORIES
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {ALL_CATEGORIES.map((cat) => (
                    <Link
                      key={cat}
                      href={`/shop?category=${cat}`}
                      onClick={() => setDrawerOpen(false)}
                      className="transition-colors duration-200 text-zinc-300 hover:text-[#FFC800]"
                      style={{
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {CATEGORY_LABELS[cat as ProductCategory]}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Support Utilities */}
              <div style={{ marginBottom: '1.5rem' }}>
                <p
                  style={{
                    fontSize: '0.7rem',
                    letterSpacing: '0.15em',
                    color: 'var(--wy-muted)',
                    textTransform: 'uppercase',
                    marginBottom: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  CUSTOMER CARE & UTILITIES
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {supportUtilities.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setDrawerOpen(false)}
                      className="transition-colors duration-200 text-zinc-400 hover:text-[#FFC800]"
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: 500,
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Auth CTA */}
            <div
              style={{
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--wy-border)',
                marginTop: '1rem',
              }}
            >
              {user ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <p style={{ fontSize: '0.78rem', color: 'var(--wy-muted)' }}>
                    Signed in as <span style={{ color: '#FFFFFF' }}>{user.email}</span>
                  </p>
                  <Link
                    href="/account"
                    onClick={() => setDrawerOpen(false)}
                    className="btn btn-ghost btn-sm"
                    style={{ width: '100%' }}
                  >
                    Account Dashboard
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Link
                    href="/auth/login"
                    onClick={() => setDrawerOpen(false)}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setDrawerOpen(false)}
                    className="btn btn-ghost btn-sm"
                    style={{ flex: 1 }}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Spacer to offset fixed navbar */}
      <div style={{ height: '72px' }} />
    </>
  );
}
