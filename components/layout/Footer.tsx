'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MapPin, Clock, Navigation } from 'lucide-react';
import { ALL_CATEGORIES, CATEGORY_LABELS, type ProductCategory } from '@/types/ecommerce';
export default function Footer() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const categories = ALL_CATEGORIES;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer suppressHydrationWarning style={{ background: 'var(--wy-surface)', borderTop: '1px solid var(--wy-border)', marginTop: 'auto' }}>
      <div className="container-wy" style={{ padding: '2.75rem 1.5rem 2.25rem' }}>
        
        {/* Main Row: Brand + Nav Links + Socials */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid var(--wy-border)',
        }}>
          {/* Brand & Tagline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/" style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.65rem',
              letterSpacing: '0.12em',
              color: 'var(--wy-text)',
              textDecoration: 'none',
              lineHeight: 1,
            }}>
              WEAR <span style={{ color: 'var(--wy-yellow)' }}>YUNG</span>
            </Link>
            <span style={{ color: '#52525B', fontSize: '0.85rem' }}>•</span>
            <span style={{ color: '#A1A1AA', fontSize: '0.85rem', letterSpacing: '0.04em' }}>
              Modern Menswear &bull; Koforidua, Ghana
            </span>
          </div>

          {/* Quick Categories & Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
            <Link href="/shop" style={{ color: '#E4E4E7', textDecoration: 'none', fontWeight: 600, transition: 'color 150ms' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#FFC800')}
              onMouseLeave={e => (e.currentTarget.style.color = '#E4E4E7')}>
              All Products
            </Link>
            {categories.slice(0, 4).map((cat) => (
              <Link key={cat} href={`/shop?category=${cat}`}
                style={{ color: '#A1A1AA', textDecoration: 'none', transition: 'color 150ms' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#FFC800')}
                onMouseLeave={e => (e.currentTarget.style.color = '#A1A1AA')}>
                {CATEGORY_LABELS[cat as ProductCategory]}
              </Link>
            ))}
            <a href="https://wa.me/233545355585" target="_blank" rel="noopener noreferrer"
              style={{ color: '#A1A1AA', textDecoration: 'none', transition: 'color 150ms' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#FFC800')}
              onMouseLeave={e => (e.currentTarget.style.color = '#A1A1AA')}>
              Support
            </a>
          </div>

          {/* Social Icons */}
          <div style={{ display: 'flex', gap: '0.95rem', alignItems: 'center' }}>
            {/* Instagram */}
            <a href="https://instagram.com/wearyung1" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ transition: 'opacity 150ms' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              <Image src="/icons/instagram-icon.png" alt="Instagram" width={24} height={24} style={{ objectFit: 'contain', borderRadius: '4px' }} />
            </a>
            {/* TikTok */}
            <a href="https://tiktok.com/@wearyung1" target="_blank" rel="noopener noreferrer" aria-label="TikTok" style={{ transition: 'opacity 150ms' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              <Image src="/icons/tiktok-icon.png" alt="TikTok" width={24} height={24} style={{ objectFit: 'contain', borderRadius: '4px' }} />
            </a>
            {/* Snapchat */}
            <a href="https://snapchat.com/add/wear_yung" target="_blank" rel="noopener noreferrer" aria-label="Snapchat" style={{ transition: 'opacity 150ms' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              <Image src="/icons/snapchat-icon.jpg" alt="Snapchat" width={24} height={24} style={{ objectFit: 'contain', borderRadius: '4px' }} />
            </a>
            {/* WhatsApp */}
            <a href="https://wa.me/233545355585" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" style={{ transition: 'opacity 150ms' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              <Image src="/icons/whatsapp-icon.png" alt="WhatsApp" width={24} height={24} style={{ objectFit: 'contain', borderRadius: '4px' }} />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          paddingTop: '1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.8rem',
        }}>
          <p suppressHydrationWarning style={{ color: '#71717A', margin: 0 }}>
            © {new Date().getFullYear()} WEAR YUNG. All rights reserved.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ color: '#71717A' }}>Behind B Foster Bakery, Koforidua</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
