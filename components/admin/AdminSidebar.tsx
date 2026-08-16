'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Star,
  ExternalLink,
  LogOut,
  Images
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { href: '/admin/products', label: 'Products', icon: <Package size={18} /> },
  { href: '/admin/orders', label: 'Orders', icon: <ShoppingBag size={18} /> },
  { href: '/admin/customers', label: 'Customers', icon: <Users size={18} /> },
  { href: '/admin/lookbook', label: 'Lookbook', icon: <Images size={18} /> },
  { href: '/admin/reviews', label: 'Reviews', icon: <Star size={18} /> },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <aside style={{
      position: 'fixed',
      left: 0, top: 0, bottom: 0,
      width: '260px',
      background: '#0d0d0d',
      borderRight: '1px solid #1a1a1a',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid #1a1a1a',
      }}>
        <Link href="/admin" style={{ display: 'block' }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.4rem',
            color: '#FFC800',
            letterSpacing: '0.08em',
          }}>
            WEAR YUNG
          </span>
          <span style={{
            display: 'block',
            fontSize: '0.68rem',
            color: '#444',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginTop: '2px',
          }}>
            Admin Portal
          </span>
        </Link>
      </div>

      {/* Navigation */}
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
                fontWeight: 500,
                letterSpacing: '0.02em',
                transition: 'all 0.15s',
                background: isActive ? 'rgba(255,200,0,0.1)' : 'transparent',
                color: isActive ? '#FFC800' : '#666',
                borderLeft: isActive ? '2px solid #FFC800' : '2px solid transparent',
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div style={{
        padding: '1rem 0.75rem',
        borderTop: '1px solid #1a1a1a',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}>
        <Link
          href="/"
          target="_blank"
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.65rem 0.875rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: '#555',
            transition: 'color 0.15s',
          }}
        >
          <ExternalLink size={16} />
          View Store
        </Link>
        <button
          onClick={handleSignOut}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.65rem 0.875rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: '#ef4444',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'background 0.15s',
          }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
