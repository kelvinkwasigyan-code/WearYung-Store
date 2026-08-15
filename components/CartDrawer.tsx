'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartContext } from '@/context/CartContext';
import { ShoppingBag, X, Trash2, ArrowRight } from 'lucide-react';

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

  const freeDeliveryThreshold = 3;
  const progressPercent = Math.min(100, Math.round((itemCount / freeDeliveryThreshold) * 100));
  const itemsNeeded = Math.max(0, freeDeliveryThreshold - itemCount);

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
          background: '#18181B', // Requested surface background
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
                textTransform: 'uppercase',
              }}
            >
              YOUR BAG
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
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div style={{ padding: '1rem 1.5rem', background: '#18181B', borderBottom: '1px solid #27272A' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
            <span style={{ color: '#A1A1AA' }}>
              {itemCount >= freeDeliveryThreshold ? (
                <span style={{ color: '#FFC800', fontWeight: 700 }}>You have qualified for Free Delivery!</span>
              ) : (
                <>Add <strong style={{ color: '#FFFFFF' }}>{itemsNeeded} more {itemsNeeded === 1 ? 'item' : 'items'}</strong> for Free Delivery</>
              )}
            </span>
            <span style={{ color: '#A1A1AA', fontWeight: 600 }}>{progressPercent}%</span>
          </div>
          <div style={{ width: '100%', height: '4px', background: '#27272A', borderRadius: '2px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: '#FFC800',
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
                  color: '#FFC800', // Yellow accent
                }}
              >
                <ShoppingBag size={28} strokeWidth={1.5} />
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  letterSpacing: '0.06em',
                  color: '#FFFFFF',
                  marginBottom: '1.5rem',
                }}
              >
                Your bag is empty.
              </p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="btn btn-primary"
                style={{
                  background: '#FFC800',
                  color: '#0D0D0D',
                  padding: '0.85rem 2rem',
                  fontWeight: 700,
                  display: 'inline-block',
                }}
              >
                EXPLORE DROPS
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
                  transition: 'all 0.3s ease',
                }}
              >
                {/* Item Thumbnail */}
                <div
                  style={{
                    position: 'relative',
                    width: '80px',
                    height: '80px',
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
                      sizes="80px"
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
                      <ShoppingBag size={24} strokeWidth={1.5} />
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
                          fontSize: '1.1rem',
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
                        <Trash2 size={16} strokeWidth={2} />
                      </button>
                    </div>

                    <p style={{ color: '#71717A', fontSize: '0.8rem', marginTop: '0.2rem' }}>
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
                          padding: '0.25rem 0.6rem',
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
                          padding: '0.25rem 0.6rem',
                          color: '#FFFFFF',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          minWidth: '28px',
                          textAlign: 'center',
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        style={{
                          padding: '0.25rem 0.6rem',
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

                    <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '1rem' }}>
                      GH₵ {(item.price * item.quantity).toLocaleString()}
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
              padding: '1.5rem',
              background: '#18181B',
              borderTop: '1px solid #27272A',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase' }}>
                Subtotal
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  color: '#FFC800',
                  letterSpacing: '0.04em',
                }}
              >
                GH₵ {total.toLocaleString()}
              </span>
            </div>
            
            <p style={{ color: '#71717A', fontSize: '0.8rem', textAlign: 'center' }}>
              Taxes and shipping calculated at checkout.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link
                href="/checkout"
                onClick={closeCart}
                id="drawer-checkout-btn"
                style={{
                  width: '100%',
                  background: '#FFC800',
                  color: '#0D0D0D',
                  padding: '1rem 1.5rem',
                  fontWeight: 700,
                  textAlign: 'center',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'opacity 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                PROCEED TO CHECKOUT
                <ArrowRight size={18} />
              </Link>

              <button
                onClick={closeCart}
                style={{
                  width: '100%',
                  textAlign: 'center',
                  background: 'transparent',
                  border: 'none',
                  color: '#A1A1AA',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  fontSize: '0.9rem',
                  textDecoration: 'underline',
                }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
