import Link from 'next/link';

export default function CallToActionBanner() {
  return (
    <section
      style={{
        background: 'var(--wy-yellow)',
        padding: '4rem 0',
        textAlign: 'center',
      }}
    >
      <div className="container-wy">
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            color: 'var(--wy-canvas)',
            marginBottom: '1rem',
          }}
        >
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
  );
}
