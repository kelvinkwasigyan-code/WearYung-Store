import type { Metadata } from 'next';
import Link from 'next/link';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'Order Confirmed',
  description: 'Your WEAR YUNG order has been placed successfully.',
};

interface SuccessPageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const { order } = await searchParams;

  return (
    <div style={{ background: 'var(--wy-canvas)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '500px' }}>
        {/* Success Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(34,197,94,0.15)',
          border: '2px solid var(--wy-success)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 2rem',
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--wy-success)" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: 'var(--wy-text)', marginBottom: '1rem' }}>
          ORDER CONFIRMED!
        </h1>

        <p style={{ color: 'var(--wy-muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
          Thank you for shopping with WEAR YUNG. Your order has been placed and is being processed.
        </p>

        {order && (
          <p style={{ color: 'var(--wy-muted-dim)', fontSize: '0.8rem', marginBottom: '2rem' }}>
            Order ID: <span style={{ color: 'var(--wy-yellow)', fontFamily: 'monospace' }}>{order}</span>
          </p>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/account" id="view-account-btn" className="btn btn-outline">
            View Account & Orders
          </Link>
          <Link href="/shop" id="continue-shopping-btn" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
