'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ALL_CATEGORIES, CATEGORY_LABELS, type ProductCategory } from '@/types/ecommerce';
import AnnouncementMarquee from '../AnnouncementMarquee';

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
      {/* Marquee Banner */}
      <AnnouncementMarquee />


      <div className="container-wy" style={{ padding: '4rem 1.5rem 2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem',
        }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              letterSpacing: '0.12em',
              color: 'var(--wy-text)',
              display: 'block',
              marginBottom: '1rem',
            }}>
              WEAR<span style={{ color: 'var(--wy-yellow)' }}>YUNG</span>
            </Link>
            <p style={{ color: 'var(--wy-muted)', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: '260px' }}>
              Premium streetwear and accessories for those who move different.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', alignItems: 'center' }}>
              {/* Instagram */}
              <a href="https://instagram.com/wearyung1" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ transition: 'opacity 150ms' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                <Image src="/icons/instagram-icon.png" alt="Instagram" width={24} height={24} style={{ objectFit: 'contain', borderRadius: '4px' }} />
              </a>
              {/* TikTok */}
              <a href="https://tiktok.com/@wearyung1" target="_blank" rel="noopener noreferrer" aria-label="TikTok" style={{ transition: 'opacity 150ms' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                <Image src="/icons/tiktok-icon.png" alt="TikTok" width={24} height={24} style={{ objectFit: 'contain', borderRadius: '4px' }} />
              </a>
              {/* Snapchat */}
              <a href="https://snapchat.com/add/wear_yung" target="_blank" rel="noopener noreferrer" aria-label="Snapchat" style={{ transition: 'opacity 150ms' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                <Image src="/icons/snapchat-icon.jpg" alt="Snapchat" width={24} height={24} style={{ objectFit: 'contain', borderRadius: '4px' }} />
              </a>
              {/* WhatsApp */}
              <a href="https://wa.me/WEAR_YUNG" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" style={{ transition: 'opacity 150ms' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                <Image src="/icons/whatsapp-icon.png" alt="WhatsApp" width={24} height={24} style={{ objectFit: 'contain', borderRadius: '4px' }} />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.12em', color: 'var(--wy-yellow)', marginBottom: '1.25rem' }}>
              SHOP
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <Link href="/shop" style={{ color: 'var(--wy-muted)', fontSize: '0.875rem', transition: 'color 150ms' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--wy-text)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--wy-muted)')}>
                  All Products
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat}>
                  <Link href={`/shop?category=${cat}`}
                    style={{ color: 'var(--wy-muted)', fontSize: '0.875rem', transition: 'color 150ms' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--wy-text)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--wy-muted)')}>
                    {CATEGORY_LABELS[cat as ProductCategory]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.12em', color: 'var(--wy-yellow)', marginBottom: '1.25rem' }}>
              HELP
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['Shipping Policy', 'Returns & Exchanges', 'Size Guide', 'FAQ', 'Contact Us'].map((item) => (
                <li key={item}>
                  <a href="#" style={{ color: 'var(--wy-muted)', fontSize: '0.875rem', transition: 'color 150ms' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--wy-text)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--wy-muted)')}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--wy-border)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <p suppressHydrationWarning style={{ color: 'var(--wy-muted-dim)', fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} WEAR YUNG. All rights reserved.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            {['Privacy Policy', 'Terms of Service'].map((item) => (
              <a key={item} href="#" style={{ color: 'var(--wy-muted-dim)', fontSize: '0.8rem', transition: 'color 150ms' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--wy-muted)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--wy-muted-dim)')}>
                {item}
              </a>
            ))}
            
            {/* Development Admin Portal Button */}
            <Link
              href="/admin/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.3rem 0.65rem',
                borderRadius: '6px',
                background: 'rgba(255, 200, 0, 0.08)',
                border: '1px solid rgba(255, 200, 0, 0.25)',
                color: '#FFC800',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'all 150ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#FFC800';
                e.currentTarget.style.color = '#000000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 200, 0, 0.08)';
                e.currentTarget.style.color = '#FFC800';
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
