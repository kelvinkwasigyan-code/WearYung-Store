'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart, updateCartQuantity, removeCartItem } from '@/lib/cart';

export default function CartPage() {
  const cart = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Delay rendering cart items until after initial mount to prevent hydration mismatch
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

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
            Your Cart
          </h1>
          <p style={{ color: 'var(--wy-muted)', fontSize: '0.9rem' }}>
            {cart.itemCount} item{cart.itemCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="container-wy" style={{ padding: '2.5rem 1.5rem' }}>
        {cart.items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 2rem', color: 'var(--wy-muted)' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: '0 auto 1.5rem', opacity: 0.3 }}>
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
              Your cart is empty
            </p>
            <p style={{ marginBottom: '2rem', fontSize: '0.9rem' }}>Add some products to get started.</p>
            <Link href="/shop" id="cart-shop-link" className="btn btn-primary">Browse Shop</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
            {/* Cart Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cart.items.map(item => (
                <div key={item.variantId} style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '1.25rem',
                  background: 'var(--wy-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--wy-border)',
                }}>
                  {/* Product thumbnail */}
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--wy-surface-raised)',
                    flexShrink: 0,
                    overflow: 'hidden',
                    border: '1px solid var(--wy-border)',
                  }}>
                    {item.productImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.productImage} alt={item.productTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--wy-border-light)' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link href={`/shop/${item.productSlug}`} style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1rem',
                      letterSpacing: '0.04em',
                      color: 'var(--wy-text)',
                      display: 'block',
                      marginBottom: '0.25rem',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}>
                      {item.productTitle}
                    </Link>
                    <p style={{ color: 'var(--wy-muted-dim)', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
                      {Object.entries(item.attributes as Record<string, unknown>).map(([, v]) => String(v)).join(' / ')}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {/* Quantity */}
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--wy-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                        <button
                          id={`qty-dec-${item.variantId}`}
                          onClick={() => updateCartQuantity(item.variantId, item.quantity - 1)}
                          style={{ padding: '0.25rem 0.6rem', background: 'var(--wy-surface-raised)', border: 'none', color: 'var(--wy-text)', cursor: 'pointer' }}
                        >−</button>
                        <span style={{ padding: '0.25rem 0.75rem', color: 'var(--wy-text)', fontSize: '0.875rem', fontWeight: 600 }}>{item.quantity}</span>
                        <button
                          id={`qty-inc-${item.variantId}`}
                          onClick={() => updateCartQuantity(item.variantId, item.quantity + 1)}
                          style={{ padding: '0.25rem 0.6rem', background: 'var(--wy-surface-raised)', border: 'none', color: 'var(--wy-text)', cursor: 'pointer' }}
                        >+</button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <p style={{ color: 'var(--wy-yellow)', fontWeight: 700, fontSize: '0.95rem' }}>
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </p>
                        <button
                          id={`remove-${item.variantId}`}
                          onClick={() => removeCartItem(item.variantId)}
                          style={{ background: 'none', border: 'none', color: 'var(--wy-danger)', cursor: 'pointer', padding: '0.25rem' }}
                          aria-label="Remove item"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div style={{
              padding: '1.5rem',
              background: 'var(--wy-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--wy-border)',
              position: 'sticky',
              top: '90px',
            }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', letterSpacing: '0.08em', marginBottom: '1.5rem', color: 'var(--wy-text)' }}>
                ORDER SUMMARY
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--wy-muted)' }}>Subtotal ({cart.itemCount} items)</span>
                  <span style={{ color: 'var(--wy-text)' }}>₦{cart.total.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--wy-muted)' }}>Shipping</span>
                  <span style={{ color: cart.total >= 50000 ? 'var(--wy-success)' : 'var(--wy-text)' }}>
                    {cart.total >= 50000 ? 'Free' : 'Calculated at checkout'}
                  </span>
                </div>
              </div>

              <hr className="divider" />

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', letterSpacing: '0.06em', color: 'var(--wy-text)' }}>TOTAL</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--wy-yellow)' }}>
                  ₦{cart.total.toLocaleString()}
                </span>
              </div>

              <Link href="/checkout" id="checkout-btn" className="btn btn-primary" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                Proceed to Checkout →
              </Link>

              <Link href="/shop" id="continue-shopping-link" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', color: 'var(--wy-muted)', fontSize: '0.8rem' }}>
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
