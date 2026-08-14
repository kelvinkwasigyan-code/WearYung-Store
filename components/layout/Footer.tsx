'use client';

import Link from 'next/link';
import { ALL_CATEGORIES, CATEGORY_LABELS, type ProductCategory } from '@/types/ecommerce';
import AnnouncementMarquee from '../AnnouncementMarquee';

export default function Footer() {
  const categories = ALL_CATEGORIES;

  return (
    <footer style={{ background: 'var(--wy-surface)', borderTop: '1px solid var(--wy-border)', marginTop: 'auto' }}>
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
              <a href="#" aria-label="Instagram" style={{ color: 'var(--wy-muted)', transition: 'color 150ms' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--wy-yellow)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--wy-muted)')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <circle cx="12" cy="12" r="5"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              {/* Twitter / X */}
              <a href="#" aria-label="Twitter" style={{ color: 'var(--wy-muted)', transition: 'color 150ms' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--wy-yellow)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--wy-muted)')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* WhatsApp */}
              <a href="#" aria-label="WhatsApp" style={{ color: 'var(--wy-muted)', transition: 'color 150ms' }}
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
          <p style={{ color: 'var(--wy-muted-dim)', fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} WEAR YUNG. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy Policy', 'Terms of Service'].map((item) => (
              <a key={item} href="#" style={{ color: 'var(--wy-muted-dim)', fontSize: '0.8rem', transition: 'color 150ms' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--wy-muted)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--wy-muted-dim)')}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
