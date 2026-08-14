'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { placeOrder } from '@/app/actions/orders';
import { useCart, clearCart } from '@/lib/cart';

export default function CheckoutPage() {
  const cart = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const formData = new FormData(e.currentTarget);
    const result = await placeOrder(formData, cart.items);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      clearCart();
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'var(--wy-surface)',
    border: '1px solid var(--wy-border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--wy-text)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.9rem',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--wy-muted)',
    marginBottom: '0.4rem',
  };

  if (!mounted) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40 }} className="skeleton" />
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--wy-canvas)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'var(--wy-surface)', borderBottom: '1px solid var(--wy-border)', padding: '2.5rem 0' }}>
        <div className="container-wy">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: 'var(--wy-text)' }}>
            Checkout
          </h1>
        </div>
      </div>

      <div className="container-wy" style={{ padding: '2.5rem 1.5rem' }}>
        {cart.items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--wy-muted)' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1rem' }}>Your cart is empty</p>
            <Link href="/shop" className="btn btn-primary">Continue Shopping</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
              {/* Left: Form */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Contact Info */}
                <div style={{ padding: '1.5rem', background: 'var(--wy-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--wy-border)' }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', letterSpacing: '0.08em', marginBottom: '1.25rem', color: 'var(--wy-text)' }}>
                    CONTACT INFORMATION
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label htmlFor="full_name" style={labelStyle}>Full Name *</label>
                      <input id="full_name" name="full_name" type="text" required placeholder="John Doe" style={inputStyle} className="input-wy" />
                    </div>
                    <div>
                      <label htmlFor="email" style={labelStyle}>Email *</label>
                      <input id="email" name="email" type="email" required placeholder="john@example.com" style={inputStyle} className="input-wy" />
                    </div>
                    <div>
                      <label htmlFor="phone" style={labelStyle}>Phone *</label>
                      <input id="phone" name="phone" type="tel" required placeholder="+234 800 000 0000" style={inputStyle} className="input-wy" />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div style={{ padding: '1.5rem', background: 'var(--wy-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--wy-border)' }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', letterSpacing: '0.08em', marginBottom: '1.25rem', color: 'var(--wy-text)' }}>
                    SHIPPING ADDRESS
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label htmlFor="line1" style={labelStyle}>Street Address *</label>
                      <input id="line1" name="line1" type="text" required placeholder="123 Lagos Street" style={inputStyle} className="input-wy" />
                    </div>
                    <div>
                      <label htmlFor="city" style={labelStyle}>City *</label>
                      <input id="city" name="city" type="text" required placeholder="Lagos" style={inputStyle} className="input-wy" />
                    </div>
                    <div>
                      <label htmlFor="state" style={labelStyle}>State *</label>
                      <input id="state" name="state" type="text" required placeholder="Lagos State" style={inputStyle} className="input-wy" />
                    </div>
                    <div>
                      <label htmlFor="postal_code" style={labelStyle}>Postal Code</label>
                      <input id="postal_code" name="postal_code" type="text" placeholder="100001" style={inputStyle} className="input-wy" />
                    </div>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div style={{
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    color: 'var(--wy-danger)',
                    fontSize: '0.875rem',
                  }}>
                    {error}
                  </div>
                )}
              </div>

              {/* Right: Order Summary */}
              <div style={{
                padding: '1.5rem',
                background: 'var(--wy-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--wy-border)',
                position: 'sticky',
                top: '90px',
              }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', letterSpacing: '0.08em', marginBottom: '1.25rem', color: 'var(--wy-text)' }}>
                  ORDER SUMMARY
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {cart.items.map(item => (
                    <div key={item.variantId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                      <span style={{ color: 'var(--wy-muted)' }}>
                        {item.productTitle} × {item.quantity}
                      </span>
                      <span style={{ color: 'var(--wy-text)' }}>₦{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <hr className="divider" />

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', letterSpacing: '0.06em', color: 'var(--wy-text)' }}>TOTAL</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--wy-yellow)' }}>
                    ₦{cart.total.toLocaleString()}
                  </span>
                </div>

                <button
                  id="place-order-btn"
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? 'Placing Order...' : 'Place Order →'}
                </button>

                <p style={{ color: 'var(--wy-muted-dim)', fontSize: '0.75rem', textAlign: 'center', marginTop: '1rem' }}>
                  Secure checkout. Payment handled by Paystack.
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
