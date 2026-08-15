'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { useCartContext } from '@/context/CartContext';
import { Search, Heart, ShoppingBag, Menu, X, User as UserIcon } from 'lucide-react';
import { ALL_CATEGORIES, CATEGORY_LABELS, type ProductCategory } from '@/types/ecommerce';

interface NavbarProps {
  cartCount?: number;
}

// Navbar slides down from above on mount
const navVariants: Variants = {
  hidden: { y: -80, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

// Nav links stagger in left to right
const navLinkContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.3 },
  },
};

const navLinkVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

// Right-side icons fade in from right
const iconGroupVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.5 },
  },
};

// Drawer overlay fade
const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2, delay: 0.15 } },
};

// Drawer panel slides in from right
const drawerVariants: Variants = {
  hidden: { x: '100%', opacity: 0.5 },
  show: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: { duration: 0.3, ease: [0.4, 0, 1, 1] },
  },
};

// Stagger drawer content sections
const drawerContentVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.2 },
  },
};

const drawerSectionVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

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
      {/* Animated Navbar */}
      <motion.nav
        variants={navVariants}
        initial="hidden"
        animate="show"
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(13,13,13,0.96)' : 'rgba(13,13,13,0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: scrolled
            ? '1px solid rgba(255,200,0,0.15)'
            : '1px solid var(--wy-border)',
          transition: 'background 300ms ease, border-color 300ms ease',
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
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
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
          </motion.div>

          {/* Desktop Main Header Navigation */}
          <motion.ul
            variants={navLinkContainerVariants}
            initial="hidden"
            animate="show"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2.25rem',
              listStyle: 'none',
            }}
            className="hidden lg:flex"
          >
            {mainHeaderLinks.map((link) => (
              <motion.li key={link.href} variants={navLinkVariants}>
                <Link
                  href={link.href}
                  className="transition-colors duration-200 hover:text-[#FFC800] relative group"
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--wy-text)',
                  }}
                >
                  {link.label}
                  {/* Yellow underline accent on hover */}
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-3px',
                      left: 0,
                      width: 0,
                      height: '2px',
                      background: '#FFC800',
                      transition: 'width 250ms ease',
                    }}
                    className="group-hover:!w-full"
                  />
                </Link>
              </motion.li>
            ))}
          </motion.ul>

          {/* Right-Side Controls */}
          <motion.div
            variants={iconGroupVariants}
            initial="hidden"
            animate="show"
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
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
              <AnimatePresence>
                {displayCartCount > 0 && (
                  <motion.span
                    key="cart-badge"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
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
                  </motion.span>
                )}
              </AnimatePresence>
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

            {/* Hamburger Menu Toggle */}
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
              <motion.div
                whileTap={{ rotate: 90, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={24} strokeWidth={2} />
              </motion.div>
            </button>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hamburger Slide-Out Drawer with AnimatePresence */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            key="drawer-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="fixed inset-0 z-50 flex justify-end"
            style={{ background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(6px)' }}
            onClick={() => setDrawerOpen(false)}
          >
            <motion.div
              key="drawer-panel"
              variants={drawerVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="w-full max-w-sm h-full flex flex-col justify-between"
              style={{
                background: '#0D0D0D',
                borderLeft: '1px solid rgba(255,200,0,0.2)',
                padding: '1.75rem',
                overflowY: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                variants={drawerContentVariants}
                initial="hidden"
                animate="show"
              >
                {/* Drawer Header */}
                <motion.div
                  variants={drawerSectionVariants}
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
                  <motion.button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    aria-label="Close navigation drawer"
                    className="transition-colors duration-200 text-white hover:text-[#FFC800] p-2"
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    whileTap={{ rotate: 90, scale: 0.85 }}
                    transition={{ duration: 0.18 }}
                  >
                    <X size={24} strokeWidth={2} />
                  </motion.button>
                </motion.div>

                {/* Main Navigation Links */}
                <motion.div variants={drawerSectionVariants} style={{ marginBottom: '1.75rem' }}>
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
                    {mainHeaderLinks.map((link, i) => (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 + i * 0.07, duration: 0.35, ease: 'easeOut' }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setDrawerOpen(false)}
                          className="transition-colors duration-200 text-white hover:text-[#FFC800]"
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.25rem',
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            display: 'block',
                          }}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Support Utilities */}
                <motion.div variants={drawerSectionVariants} style={{ marginBottom: '1.75rem' }}>
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
                </motion.div>

                {/* Category Links */}
                <motion.div variants={drawerSectionVariants} style={{ marginBottom: '1.5rem' }}>
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
                </motion.div>
              </motion.div>

              {/* Bottom Auth CTA */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.35, ease: 'easeOut' }}
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
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer to offset fixed navbar */}
      <div style={{ height: '72px' }} />
    </>
  );
}
