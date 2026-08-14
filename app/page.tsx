import Link from 'next/link';
import type { Metadata } from 'next';
import { ALL_CATEGORIES, CATEGORY_LABELS, type ProductCategory } from '@/types/ecommerce';

export const metadata: Metadata = {
  title: 'WEAR YUNG — Premium Streetwear & Accessories',
  description: 'Shop the latest drops in streetwear, sneakers, watches, bags and accessories.',
};

const categoryIcons: Record<ProductCategory, string> = {
  clothing: '👕',
  watches: '⌚',
  sprays: '💨',
  accessories: '💎',
  sneakers: '👟',
  slides: '🩴',
  bags: '👜',
};

export default function HomePage() {
  return (
    <div>
      {/* ======= HERO ======= */}
      <section
        style={{
          position: 'relative',
          minHeight: '92vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          background: 'radial-gradient(ellipse at 70% 50%, rgba(255,200,0,0.08) 0%, transparent 60%), var(--wy-canvas)',
        }}
      >
        {/* Background Grid */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(var(--wy-border) 1px, transparent 1px), linear-gradient(90deg, var(--wy-border) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          opacity: 0.3,
        }} />

        {/* Yellow accent circle */}
        <div style={{
          position: 'absolute',
          right: '-10%',
          top: '20%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,200,0,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="container-wy" style={{ position: 'relative', zIndex: 1, paddingTop: '2rem', paddingBottom: '4rem' }}>
          <div style={{ maxWidth: '760px' }}>
            {/* Pill badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255,200,0,0.1)',
              border: '1px solid rgba(255,200,0,0.3)',
              borderRadius: '100px',
              padding: '0.4rem 1rem',
              marginBottom: '1.5rem',
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--wy-yellow)', display: 'inline-block', animation: 'pulse-yellow 2s infinite' }} />
              <span style={{ color: 'var(--wy-yellow)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                New Drop Available
              </span>
            </div>

            {/* Headline */}
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3.5rem, 10vw, 7rem)',
              letterSpacing: '0.04em',
              lineHeight: 1,
              color: 'var(--wy-text)',
              marginBottom: '1.5rem',
            }}>
              DRESS LIKE<br />
              YOU OWN<br />
              <span className="text-gradient">THE ROOM</span>
            </h1>

            <p style={{
              color: 'var(--wy-muted)',
              fontSize: '1.1rem',
              lineHeight: 1.7,
              maxWidth: '480px',
              marginBottom: '2.5rem',
            }}>
              Premium streetwear, authentic sneakers, luxury watches & more. 
              Curated for those who move different.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/shop" id="hero-shop-btn" className="btn btn-primary btn-lg">
                Shop Now
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link href="/shop?category=sneakers" id="hero-sneakers-btn" className="btn btn-ghost btn-lg">
                View Sneakers
              </Link>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '3rem', marginTop: '4rem', flexWrap: 'wrap' }}>
              {[
                { value: '500+', label: 'Products' },
                { value: '7', label: 'Categories' },
                { value: '100%', label: 'Authentic' },
              ].map(stat => (
                <div key={stat.label}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--wy-yellow)', letterSpacing: '0.04em' }}>{stat.value}</p>
                  <p style={{ color: 'var(--wy-muted)', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======= CATEGORIES ======= */}
      <section className="section-wy" style={{ background: 'var(--wy-surface)' }}>
        <div className="container-wy">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--wy-text)', marginBottom: '0.75rem' }}>
              SHOP BY CATEGORY
            </h2>
            <p style={{ color: 'var(--wy-muted)' }}>Find your style across all our collections</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem',
          }}>
            {ALL_CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/shop?category=${cat}`}
                id={`category-${cat}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="card-wy"
                  style={{
                    padding: '1.75rem 1rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>
                    {categoryIcons[cat]}
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.9rem',
                    letterSpacing: '0.1em',
                    color: 'var(--wy-text)',
                    textTransform: 'uppercase',
                  }}>
                    {CATEGORY_LABELS[cat as ProductCategory]}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ======= WHY US ======= */}
      <section className="section-wy">
        <div className="container-wy">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--wy-text)' }}>
              WHY WEAR YUNG?
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
          }}>
            {[
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                ),
                title: '100% AUTHENTIC',
                desc: 'Every product is sourced and verified for authenticity.',
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="1" y="3" width="15" height="13" rx="2"/>
                    <path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                ),
                title: 'FAST DELIVERY',
                desc: 'Quick, reliable shipping across Nigeria.',
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
                  </svg>
                ),
                title: 'PREMIUM QUALITY',
                desc: 'Carefully curated pieces that last and impress.',
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                  </svg>
                ),
                title: '24/7 SUPPORT',
                desc: 'Our team is always here to help you.',
              },
            ].map(feature => (
              <div
                key={feature.title}
                className="feature-card"
              >
                <div style={{ color: 'var(--wy-yellow)', marginBottom: '1rem' }}>{feature.icon}</div>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.1rem',
                  letterSpacing: '0.08em',
                  marginBottom: '0.5rem',
                  color: 'var(--wy-text)',
                }}>
                  {feature.title}
                </h3>
                <p style={{ color: 'var(--wy-muted)', fontSize: '0.875rem', lineHeight: 1.7 }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= CTA BANNER ======= */}
      <section style={{
        background: 'var(--wy-yellow)',
        padding: '4rem 0',
        textAlign: 'center',
      }}>
        <div className="container-wy">
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            color: 'var(--wy-canvas)',
            marginBottom: '1rem',
          }}>
            READY TO LEVEL UP?
          </h2>
          <p style={{ color: 'rgba(13,13,13,0.7)', fontSize: '1.1rem', marginBottom: '2rem' }}>
            Explore the full collection — new drops every week.
          </p>
          <Link href="/shop" id="cta-shop-btn" className="cta-dark-btn">
            Shop All Collections →
          </Link>
        </div>
      </section>
    </div>
  );
}
