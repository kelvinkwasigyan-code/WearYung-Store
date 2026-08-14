'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartContext } from '@/context/CartContext';

export default function CartDrawer() {
  const {
    items,
    total,
    itemCount,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
  } = useCartContext();

  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeCart]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const freeDeliveryThreshold = 50000;
  const progressPercent = Math.min(100, Math.round((total / freeDeliveryThreshold) * 100));

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        onClick={closeCart}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          zIndex: 90,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 300ms ease',
        }}
      />

      {/* Slide-out Drawer Panel */}
      <aside
        ref={drawerRef}
        aria-label="Shopping Cart Drawer"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '440px',
          background: '#0D0D0D',
          borderLeft: '1px solid #27272A',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: isOpen ? '-10px 0 30px rgba(0, 0, 0, 0.8)' : 'none',
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #27272A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#18181B',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.4rem',
                letterSpacing: '0.08em',
                color: '#FFFFFF',
                margin: 0,
              }}
            >
              YOUR CART
            </h2>
            <span
              style={{
                background: '#FFC800',
                color: '#0D0D0D',
                borderRadius: '12px',
                padding: '0.15rem 0.6rem',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              {itemCount}
            </span>
          </div>

          <button
            onClick={closeCart}
            aria-label="Close cart"
            id="close-cart-drawer-btn"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#A1A1AA',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.4rem',
              borderRadius: '4px',
              transition: 'color 150ms ease, background 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.background = '#27272A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#A1A1AA';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div style={{ padding: '0.85rem 1.5rem', background: '#121214', borderBottom: '1px solid #27272A' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.4rem' }}>
            <span style={{ color: '#A1A1AA' }}>
              {total >= freeDeliveryThreshold ? (
                <span style={{ color: 'var(--wy-success)', fontWeight: 700 }}>🎉 You qualified for FREE Delivery!</span>
              ) : (
                <>Add <strong style={{ color: '#FFC800' }}>₦{(freeDeliveryThreshold - total).toLocaleString()}</strong> for Free Delivery</>
              )}
            </span>
            <span style={{ color: '#A1A1AA', fontWeight: 600 }}>{progressPercent}%</span>
          </div>
          <div style={{ width: '100%', height: '4px', background: '#27272A', borderRadius: '2px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: total >= freeDeliveryThreshold ? 'var(--wy-success)' : '#FFC800',
                transition: 'width 300ms ease',
              }}
            />
          </div>
        </div>

        {/* Drawer Body / Items List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {items.length === 0 ? (
            <div
              style={{
                margin: 'auto 0',
                textAlign: 'center',
                padding: '2rem 1rem',
                color: '#A1A1AA',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#18181B',
                  border: '1px solid #27272A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                  color: '#71717A',
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  letterSpacing: '0.06em',
                  color: '#FFFFFF',
                  marginBottom: '0.5rem',
                }}
              >
                YOUR CART IS EMPTY
              </p>
              <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem', color: '#71717A' }}>
                Discover our latest streetwear collections and drops.
              </p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="btn btn-primary btn-sm"
                style={{ background: '#FFC800', color: '#0D0D0D' }}
              >
                Explore Shop
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.variantId}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '1rem',
                  background: '#18181B',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #27272A',
                }}
              >
                {/* Item Thumbnail */}
                <div
                  style={{
                    position: 'relative',
                    width: '72px',
                    height: '72px',
                    borderRadius: 'var(--radius-sm)',
                    background: '#121214',
                    flexShrink: 0,
                    overflow: 'hidden',
                    border: '1px solid #27272A',
                  }}
                >
                  {item.productImage ? (
                    <Image
                      src={item.productImage}
                      alt={item.productTitle}
                      fill
                      sizes="72px"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#3F3F46',
                      }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Item Details */}
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <Link
                        href={`/shop/${item.productSlug}`}
                        onClick={closeCart}
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1rem',
                          letterSpacing: '0.04em',
                          color: '#FFFFFF',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          display: 'block',
                        }}
                      >
                        {item.productTitle}
                      </Link>

                      <button
                        onClick={() => removeFromCart(item.variantId)}
                        aria-label="Remove item"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#71717A',
                          cursor: 'pointer',
                          padding: '0.2rem',
                          transition: 'color 150ms ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--wy-danger)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#71717A')}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                        </svg>
                      </button>
                    </div>

                    <p style={{ color: '#71717A', fontSize: '0.75rem', marginTop: '0.15rem' }}>
                      {Object.values(item.attributes as Record<string, unknown>).map(String).join(' / ')}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem' }}>
                    {/* Quantity Selector */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid #27272A',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        background: '#121214',
                      }}
                    >
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        style={{
                          padding: '0.2rem 0.5rem',
                          background: 'transparent',
                          border: 'none',
                          color: '#FFFFFF',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                        }}
                      >
                        −
                      </button>
                      <span
                        style={{
                          padding: '0.2rem 0.5rem',
                          color: '#FFFFFF',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          minWidth: '24px',
                          textAlign: 'center',
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        style={{
                          padding: '0.2rem 0.5rem',
                          background: 'transparent',
                          border: 'none',
                          color: '#FFFFFF',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                        }}
                      >
                        +
                      </button>
                    </div>

                    <span style={{ color: '#FFC800', fontWeight: 700, fontSize: '0.95rem' }}>
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div
            style={{
              padding: '1.25rem 1.5rem',
              background: '#18181B',
              borderTop: '1px solid #27272A',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#A1A1AA', fontSize: '0.9rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Subtotal
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.4rem',
                  color: '#FFC800',
                  letterSpacing: '0.04em',
                }}
              >
                ₦{total.toLocaleString()}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <Link
                href="/checkout"
                onClick={closeCart}
                id="drawer-checkout-btn"
                className="btn btn-primary"
                style={{
                  width: '100%',
                  background: '#FFC800',
                  color: '#0D0D0D',
                  padding: '0.85rem 1.5rem',
                  fontWeight: 700,
                  textAlign: 'center',
                }}
              >
                Proceed to Checkout →
              </Link>

              <Link
                href="/cart"
                onClick={closeCart}
                id="drawer-view-cart-btn"
                className="btn btn-ghost btn-sm"
                style={{
                  width: '100%',
                  textAlign: 'center',
                  borderColor: '#27272A',
                  color: '#A1A1AA',
                }}
              >
                View Full Cart
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
