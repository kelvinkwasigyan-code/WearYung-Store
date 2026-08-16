'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Compass, Heart, ShoppingBag, User } from 'lucide-react';
import { useCartContext } from '@/context/CartContext';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { itemCount, toggleCart } = useCartContext();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    const updateWishlistCount = () => {
      try {
        const stored = localStorage.getItem('wy_wishlist');
        if (stored) {
          const ids = JSON.parse(stored);
          setWishlistCount(Array.isArray(ids) ? ids.length : 0);
        } else {
          setWishlistCount(0);
        }
      } catch {
        setWishlistCount(0);
      }
    };

    updateWishlistCount();
    window.addEventListener('storage', updateWishlistCount);
    window.addEventListener('wishlist-updated', updateWishlistCount);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('storage', updateWishlistCount);
      window.removeEventListener('wishlist-updated', updateWishlistCount);
    };
  }, []);

  // Hide on admin portal or before mounting
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
      id: 'shop',
      label: 'Drops',
      href: '/shop',
      icon: Compass,
      isActive: pathname.startsWith('/shop') || pathname.startsWith('/category'),
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      href: '/wishlist',
      icon: Heart,
      badge: wishlistCount > 0 ? wishlistCount : null,
      isActive: pathname === '/wishlist',
    },
    {
      id: 'cart',
      label: 'Bag',
      isButton: true,
      onClick: toggleCart,
      icon: ShoppingBag,
      badge: mounted && itemCount > 0 ? itemCount : null,
      isActive: false,
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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300"
      style={{
        background: 'rgba(13, 13, 13, 0.94)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255, 200, 0, 0.25)',
        boxShadow: '0 -8px 24px rgba(0, 0, 0, 0.6)',
        paddingBottom: 'max(0.4rem, env(safe-area-inset-bottom))',
        paddingTop: '0.45rem',
      }}
      aria-label="Mobile Bottom Navigation"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          alignItems: 'center',
          maxWidth: '500px',
          margin: '0 auto',
          padding: '0 0.5rem',
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const content = (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.2rem',
                position: 'relative',
                padding: '0.35rem 0',
                color: item.isActive ? '#FFC800' : '#A1A1AA',
                transition: 'color 0.15s ease',
              }}
            >
              {/* Icon Container with Badge */}
              <div style={{ position: 'relative', display: 'inline-flex' }}>
                <Icon
                  size={20}
                  strokeWidth={item.isActive ? 2.5 : 1.9}
                  style={{
                    color: item.isActive ? '#FFC800' : '#D4D4D8',
                    filter: item.isActive ? 'drop-shadow(0 0 6px rgba(255,200,0,0.5))' : 'none',
                  }}
                />

                {/* Badge for Wishlist or Cart */}
                {item.badge !== null && item.badge !== undefined && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-10px',
                      background: '#FFC800',
                      color: '#000000',
                      fontSize: '0.65rem',
                      fontWeight: 900,
                      minWidth: '16px',
                      height: '16px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 3px',
                      lineHeight: 1,
                      border: '1px solid #000000',
                    }}
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </motion.span>
                )}
              </div>

              {/* Label */}
              <span
                style={{
                  fontSize: '0.68rem',
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
                    top: '-4px',
                    width: '18px',
                    height: '2.5px',
                    borderRadius: '2px',
                    background: '#FFC800',
                    boxShadow: '0 0 8px #FFC800',
                  }}
                />
              )}
            </div>
          );

          if (item.isButton) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={item.onClick}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  width: '100%',
                }}
                aria-label={`Open ${item.label}`}
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href!}
              style={{
                textDecoration: 'none',
                width: '100%',
                display: 'block',
              }}
              aria-label={item.label}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
