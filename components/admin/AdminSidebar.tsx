'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Star,
  ExternalLink,
  LogOut,
  Images,
  Settings,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { href: '/admin/products', label: 'Products', icon: <Package size={18} /> },
  { href: '/admin/orders', label: 'Orders', icon: <ShoppingBag size={18} /> },
  { href: '/admin/customers', label: 'Customers', icon: <Users size={18} /> },
  { href: '/admin/lookbook', label: 'Lookbook', icon: <Images size={18} /> },
  { href: '/admin/reviews', label: 'Reviews', icon: <Star size={18} /> },
  { href: '/admin/settings', label: 'Settings', icon: <Settings size={18} /> },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <>
      {/* ─── 1. MOBILE TOP ADMIN BAR (Visible on < 1024px) ─── */}
      <header
        className="flex lg:hidden"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: 'rgba(13, 13, 16, 0.95)',
          borderBottom: '1px solid #1E1E24',
          backdropFilter: 'blur(12px)',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1rem',
          zIndex: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: '#1A1A20',
              border: '1px solid #27272A',
              color: 'var(--wy-yellow)',
              cursor: 'pointer',
            }}
          >
            <Menu size={20} />
          </button>

          <Link href="/admin" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: '#FFC800', letterSpacing: '0.08em' }}>
              WEAR YUNG
            </span>
            <span
              style={{
                background: 'rgba(255, 200, 0, 0.15)',
                border: '1px solid rgba(255, 200, 0, 0.3)',
                color: 'var(--wy-yellow)',
                fontSize: '0.62rem',
                fontWeight: 800,
                padding: '0.1rem 0.4rem',
                borderRadius: '4px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              ADMIN
            </span>
          </Link>
        </div>

        <Link
          href="/"
          target="_blank"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.35rem 0.65rem',
            borderRadius: '6px',
            background: '#1A1A20',
            border: '1px solid #27272A',
            color: '#D4D4D8',
            fontSize: '0.72rem',
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          <ExternalLink size={12} />
          <span>Live Store</span>
        </Link>
      </header>

      {/* ─── 2. MOBILE SLIDE-OUT DRAWER ─── */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(6px)',
                zIndex: 50,
              }}
            />

            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              style={{
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                width: '280px',
                background: '#0D0D10',
                borderRight: '1px solid #1E1E24',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 51,
                padding: '1.25rem 1rem',
                boxShadow: '10px 0 40px rgba(0,0,0,0.8)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #1E1E24' }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#FFC800', letterSpacing: '0.08em' }}>
                    WEAR YUNG
                  </span>
                  <div style={{ fontSize: '0.65rem', color: '#71717A', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '2px' }}>
                    Administrator Portal
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMobileOpen(false)}
                  style={{
                    background: '#1A1A20',
                    border: '1px solid #27272A',
                    borderRadius: '8px',
                    width: '34px',
                    height: '34px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#A1A1AA',
                    cursor: 'pointer',
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Mobile Nav Links */}
              <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem', overflowY: 'auto' }}>
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        fontSize: '0.88rem',
                        fontWeight: isActive ? 800 : 500,
                        textDecoration: 'none',
                        transition: 'all 0.15s ease',
                        background: isActive ? 'rgba(255, 200, 0, 0.15)' : 'transparent',
                        color: isActive ? 'var(--wy-yellow)' : '#A1A1AA',
                        borderLeft: isActive ? '3px solid var(--wy-yellow)' : '3px solid transparent',
                      }}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Drawer Bottom Actions */}
              <div style={{ paddingTop: '1rem', borderTop: '1px solid #1E1E24', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link
                  href="/"
                  target="_blank"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    color: '#D4D4D8',
                    fontSize: '0.82rem',
                    textDecoration: 'none',
                    background: '#141418',
                    border: '1px solid #27272A',
                  }}
                >
                  <ExternalLink size={15} />
                  <span>View Live Store</span>
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    color: '#EF4444',
                    fontSize: '0.82rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ─── 3. DESKTOP PERMANENT SIDEBAR (Visible on ≥ 1024px) ─── */}
      <aside
        className="hidden lg:flex"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: '260px',
          background: '#0D0D10',
          borderRight: '1px solid #1A1A1E',
          flexDirection: 'column',
          zIndex: 40,
        }}
      >
        {/* Brand Logo */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #1A1A1E' }}>
          <Link href="/admin" style={{ textDecoration: 'none', display: 'block' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#FFC800', letterSpacing: '0.08em' }}>
              WEAR YUNG
            </span>
            <span style={{ display: 'block', fontSize: '0.68rem', color: '#A1A1AA', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '2px', fontWeight: 600 }}>
              Admin Portal
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.875rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 800 : 600,
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                  background: isActive ? 'rgba(255,200,0,0.12)' : 'transparent',
                  color: isActive ? '#FFC800' : '#D4D4D8',
                  borderLeft: isActive ? '3px solid #FFC800' : '3px solid transparent',
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid #1A1A1E', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <Link
            href="/"
            target="_blank"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.55rem 0.875rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 500,
              color: '#D4D4D8',
              textDecoration: 'none',
              transition: 'color 0.15s',
            }}
          >
            <ExternalLink size={15} />
            <span>View Live Store</span>
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.55rem 0.875rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              color: '#EF4444',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
            }}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
