'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              {/* Instagram */}
              <a href="https://instagram.com/wearyung1" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: 'var(--wy-muted)', transition: 'color 150ms' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--wy-yellow)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--wy-muted)')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <circle cx="12" cy="12" r="5"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              {/* TikTok */}
              <a href="https://tiktok.com/@wearyung1" target="_blank" rel="noopener noreferrer" aria-label="TikTok" style={{ color: 'var(--wy-muted)', transition: 'color 150ms' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--wy-yellow)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--wy-muted)')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.78-1.15 5.54-3.33 7.31-1.92 1.56-4.6 2.01-6.94 1.2-2.73-.95-4.73-3.41-4.9-6.33-.14-2.67 1.19-5.38 3.55-6.73 2.1-1.2 4.7-1.4 6.94-.53v4.22c-1.22-.59-2.73-.62-3.95-.12-1.34.55-2.22 2.05-1.95 3.51.25 1.34 1.52 2.37 2.87 2.38 1.48 0 2.75-1.13 2.89-2.61.16-1.74.05-3.49.1-5.24.03-5.24.01-10.48.02-15.72"/>
                </svg>
              </a>
              {/* Snapchat */}
              <a href="https://snapchat.com/add/wear_yung" target="_blank" rel="noopener noreferrer" aria-label="Snapchat" style={{ color: 'var(--wy-muted)', transition: 'color 150ms' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--wy-yellow)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--wy-muted)')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.012 1.267c-1.579 0-3.094.137-4.463.951C5.787 3.2 4.8 5.176 4.8 7.337v1.072c0 1.408-.047 2.822-.191 4.218-.087.954-.26 1.879-.475 2.802-.21.9-.494 1.802-1.025 2.518-.415.556-.995.952-1.65 1.173-.637.218-1.312.253-1.966.241-.532 0-.986-.263-1.316-.713a.754.754 0 0 1-.22-.685c.01-.194.067-.39.16-.566.136-.232.378-.42.63-.51.272-.102.573-.092.842.012.208.082.383.242.502.438.077.139.112.302.122.476.012.242-.08.473-.23.645-.11.127-.253.208-.418.243.393.22.868.29 1.317.243.559-.057 1.085-.313 1.5-.694.6-.568 1.06-1.282 1.368-2.079.418-1.077.69-2.208.82-3.348.163-1.41.196-2.83.196-4.249v-1.27c0-2.164 1.144-4.078 2.92-5.086C9.176 1.458 10.96 1.267 12.012 1.267c1.05 0 2.835.19 4.606 1.01 1.775 1.008 2.919 2.922 2.919 5.087v1.27c0 1.42.033 2.84.195 4.25.131 1.14.402 2.27.82 3.347.308.797.768 1.511 1.369 2.08.414.38.94.636 1.5.694.448.046.924-.023 1.317-.243-.165-.035-.308-.116-.418-.243-.15-.172-.242-.403-.23-.645.01-.174.045-.337.122-.476a1.05 1.05 0 0 1 .502-.438c.269-.104.57-.114.842-.012.253.09.495.278.63.51.093.176.15.372.16.566.01.27-.08.528-.22.685-.33.45-.783.713-1.315.713-.654.012-1.33-.023-1.967-.241-.655-.221-1.235-.617-1.65-1.173-.53-.716-.814-1.618-1.024-2.518-.215-.923-.388-1.848-.475-2.802-.144-1.396-.192-2.81-.192-4.218v-1.072c0-2.16-1.012-4.137-2.73-5.22C15.013 1.4 13.393 1.266 12.01 1.266zM7.228 17.522c.691-.122 1.488.135 1.942.502.825.688 2.015 1.127 2.842 1.127.828 0 2.017-.44 2.843-1.127.454-.367 1.25-.624 1.942-.502.97.168 1.564 1.026 1.155 2.155-.544 1.503-1.82 2.386-4.004 2.802l-1.936.33-1.936-.33c-2.184-.416-3.46-1.3-4.004-2.802-.41-1.13.184-1.987 1.156-2.155z"/>
                </svg>
              </a>
              {/* WhatsApp */}
              <a href="https://wa.me/WEAR_YUNG" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" style={{ color: 'var(--wy-muted)', transition: 'color 150ms' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--wy-yellow)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--wy-muted)')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
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
