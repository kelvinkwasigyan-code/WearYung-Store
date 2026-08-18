'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Compass, Images, User, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Hide on admin portal
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      href: '/',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      id: 'just-in',
      label: 'Just In',
      href: '/just-in',
      icon: Flame,
      isActive: pathname.startsWith('/just-in'),
    },
    {
      id: 'shop',
      label: 'Drops',
      href: '/shop',
      icon: Compass,
      isActive: pathname.startsWith('/shop') || pathname.startsWith('/category'),
    },
    {
      id: 'lookbook',
      label: 'Lookbook',
      href: '/lookbook',
      icon: Images,
      isActive: pathname.startsWith('/lookbook'),
    },
    {
      id: 'account',
      label: user ? 'Account' : 'Sign In',
      href: user ? '/account' : '/login',
      icon: User,
      isActive: pathname.startsWith('/account') || pathname.startsWith('/login'),
    },
  ];

  return (
    <nav
      className="mobile-bottom-nav-wrap fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300"
      style={{
        background: 'rgba(11, 11, 14, 0.96)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 200, 0, 0.25)',
        boxShadow: '0 -8px 25px rgba(0, 0, 0, 0.75)',
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
        paddingTop: '0.5rem',
      }}
      aria-label="Mobile Bottom Navigation"
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          width: '100%',
          maxWidth: '560px',
          margin: '0 auto',
          padding: '0 clamp(0.75rem, 4vw, 2rem)',
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              style={{
                textDecoration: 'none',
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              aria-label={item.label}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.28rem',
                  position: 'relative',
                  padding: '0.25rem 0.5rem',
                  width: '100%',
                  color: item.isActive ? '#FFC800' : '#A1A1AA',
                  transition: 'color 0.15s ease',
                }}
              >
                {/* Icon Container */}
                <div style={{ position: 'relative', display: 'inline-flex' }}>
                  <Icon
                    size={22}
                    strokeWidth={item.isActive ? 2.5 : 1.8}
                    style={{
                      color: item.isActive ? '#FFC800' : '#D4D4D8',
                      filter: item.isActive ? 'drop-shadow(0 0 8px rgba(255,200,0,0.6))' : 'none',
                      transition: 'transform 0.2s',
                    }}
                  />
                </div>

                {/* Label */}
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: item.isActive ? 800 : 500,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    lineHeight: 1,
                  }}
                >
                  {item.label}
                </span>

                {/* Active Pill Indicator */}
                {item.isActive && (
                  <motion.div
                    layoutId="activeMobileTab"
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      width: '22px',
                      height: '3px',
                      borderRadius: '2px',
                      background: '#FFC800',
                      boxShadow: '0 0 10px #FFC800',
                    }}
                  />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
