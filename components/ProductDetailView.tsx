'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Product, ProductVariant } from '@/types/ecommerce';
import { useCartContext } from '@/context/CartContext';

interface ProductDetailViewProps {
  product: Product;
}

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const variants = product.variants ?? [];
  const [selectedVariantId, setSelectedVariantId] = useState<string>(variants[0]?.id ?? '');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { addToCart } = useCartContext();

  const selectedVariant = variants.find((v) => v.id === selectedVariantId) || variants[0];
  const stock = selectedVariant?.stock_quantity ?? 0;
  const inStock = stock > 0;
  const isLowStock = inStock && stock <= 5;
  const images = product.images?.length ? product.images : [];
  const currentImage = images[selectedImageIndex] ?? null;

  const handleAddToCart = () => {
    if (!selectedVariant || !inStock) return;

    addToCart({
      variantId: selectedVariant.id,
      productId: product.id,
      productTitle: product.title,
      productSlug: product.slug,
      productImage: currentImage ?? '',
      sku: selectedVariant.sku,
      price: selectedVariant.price,
      quantity,
      attributes: selectedVariant.attributes,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Helper to render label for a variant based on category
  const getVariantLabel = (variant: ProductVariant): string => {
    const attrs = variant.attributes as Record<string, unknown>;
    switch (product.category) {
      case 'clothing':
        return `${attrs.size ?? ''} ${attrs.color ? `· ${attrs.color}` : ''}`.trim() || variant.sku;
      case 'sneakers':
      case 'slides':
        return `EU ${attrs.size_eu ?? ''} ${attrs.colorway ? `· ${attrs.colorway}` : ''}`.trim() || variant.sku;
      case 'watches':
        return `${attrs.dial_mm ? `${attrs.dial_mm}mm` : ''} ${attrs.strap ? `· ${attrs.strap}` : ''}`.trim() || variant.sku;
      case 'sprays':
        return `${attrs.volume ?? ''} ${attrs.fragrance_notes ? `· ${attrs.fragrance_notes}` : ''}`.trim() || variant.sku;
      case 'bags':
        return `${attrs.bag_type ?? ''} ${attrs.material ? `· ${attrs.material}` : ''}`.trim() || variant.sku;
      default:
        return Object.values(attrs).map(String).join(' / ') || variant.sku;
    }
  };

  const getAttributeCategoryLabel = () => {
    switch (product.category) {
      case 'clothing':
        return 'Select Size / Color';
      case 'sneakers':
      case 'slides':
        return 'Select Shoe Size';
      case 'watches':
        return 'Select Dial & Strap';
      case 'sprays':
        return 'Select Volume';
      case 'bags':
        return 'Select Type & Material';
      default:
        return 'Select Option';
    }
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '3.5rem',
        alignItems: 'start',
      }}
    >
      {/* LEFT: Product Gallery */}
      <div>
        {/* Main Display Image */}
        <div
          style={{
            position: 'relative',
            aspectRatio: '4/5',
            background: 'var(--wy-surface)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: '1px solid var(--wy-border)',
          }}
        >
          {currentImage ? (
            <div className="product-img-wrap">
              <Image
                src={currentImage}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                className="product-img"
              />
            </div>
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                color: 'var(--wy-border-light)',
                gap: '1rem',
              }}
            >
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <p style={{ fontSize: '0.85rem', color: 'var(--wy-muted-dim)' }}>No image available</p>
            </div>
          )}

          {/* Category Tag Overlay */}
          <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 2 }}>
            <span className="badge badge-yellow" style={{ fontSize: '0.75rem', padding: '0.35rem 0.8rem' }}>
              {product.category}
            </span>
          </div>

          {/* Out of Stock Overlay */}
          {!inStock && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(13,13,13,0.75)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 3,
              }}
            >
              <span
                style={{
                  background: 'rgba(239,68,68,0.2)',
                  border: '1px solid var(--wy-danger)',
                  color: 'var(--wy-danger)',
                  padding: '0.6rem 1.5rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Thumbnail Selector */}
        {images.length > 1 && (
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              marginTop: '1rem',
              overflowX: 'auto',
              paddingBottom: '0.5rem',
            }}
          >
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImageIndex(idx)}
                style={{
                  position: 'relative',
                  width: '80px',
                  height: '80px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  background: 'var(--wy-surface)',
                  border: selectedImageIndex === idx ? '2px solid var(--wy-yellow)' : '1px solid var(--wy-border)',
                  padding: 0,
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'border-color 150ms ease',
                }}
              >
                <Image src={img} alt={`${product.title} ${idx + 1}`} fill sizes="80px" style={{ objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT: Product Information & Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* Title & Category Header */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--wy-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              WEAR YUNG / {product.category}
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.4rem, 5vw, 3.5rem)',
              letterSpacing: '0.04em',
              color: '#FFFFFF',
              lineHeight: 1.1,
              marginBottom: '1rem',
            }}
          >
            {product.title}
          </h1>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.5rem',
                color: '#FFC800',
                letterSpacing: '0.04em',
              }}
            >
              ₦{(selectedVariant?.price ?? 0).toLocaleString()}
            </p>
            {selectedVariant?.sku && (
              <span style={{ color: 'var(--wy-muted-dim)', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                SKU: {selectedVariant.sku}
              </span>
            )}
          </div>
        </div>

        {/* Real-time Stock Status Indicator */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-sm)',
            width: 'fit-content',
            background: !inStock
              ? 'rgba(239, 68, 68, 0.1)'
              : isLowStock
              ? 'rgba(245, 158, 11, 0.1)'
              : 'rgba(34, 197, 94, 0.1)',
            border: `1px solid ${
              !inStock
                ? 'rgba(239, 68, 68, 0.3)'
                : isLowStock
                ? 'rgba(245, 158, 11, 0.3)'
                : 'rgba(34, 197, 94, 0.3)'
            }`,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: !inStock ? 'var(--wy-danger)' : isLowStock ? '#f59e0b' : 'var(--wy-success)',
              display: 'inline-block',
              animation: inStock ? 'pulse-yellow 2s infinite' : 'none',
            }}
          />
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: !inStock ? 'var(--wy-danger)' : isLowStock ? '#f59e0b' : 'var(--wy-success)',
            }}
          >
            {!inStock
              ? 'Out of Stock'
              : isLowStock
              ? `Low Stock — Only ${stock} left!`
              : `In Stock (${stock} available)`}
          </span>
        </div>

        {/* Product Description */}
        {product.description && (
          <p style={{ color: 'var(--wy-muted)', lineHeight: 1.8, fontSize: '0.95rem' }}>
            {product.description}
          </p>
        )}

        {/* Dynamic Category Variant Selector */}
        {variants.length > 0 && (
          <div style={{ padding: '1.25rem 0', borderTop: '1px solid var(--wy-border)', borderBottom: '1px solid var(--wy-border)' }}>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-display)',
                fontSize: '0.9rem',
                letterSpacing: '0.1em',
                color: 'var(--wy-muted)',
                marginBottom: '0.85rem',
                textTransform: 'uppercase',
              }}
            >
              {getAttributeCategoryLabel()}
            </label>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              {variants.map((v) => {
                const isSelected = v.id === selectedVariantId;
                const isItemOutOfStock = v.stock_quantity === 0;

                return (
                  <button
                    key={v.id}
                    id={`variant-btn-${v.id}`}
                    type="button"
                    disabled={isItemOutOfStock}
                    onClick={() => {
                      if (!isItemOutOfStock) {
                        setSelectedVariantId(v.id);
                      }
                    }}
                    style={{
                      padding: '0.6rem 1.1rem',
                      borderRadius: 'var(--radius-sm)',
                      border: isSelected ? '2px solid var(--wy-yellow)' : '1px solid var(--wy-border)',
                      background: isSelected ? 'rgba(255,200,0,0.12)' : 'var(--wy-surface)',
                      color: isItemOutOfStock ? 'var(--wy-muted-dim)' : isSelected ? 'var(--wy-yellow)' : '#FFFFFF',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: isItemOutOfStock ? 'not-allowed' : 'pointer',
                      opacity: isItemOutOfStock ? 0.4 : 1,
                      textDecoration: isItemOutOfStock ? 'line-through' : 'none',
                      transition: 'all 150ms ease',
                    }}
                  >
                    {getVariantLabel(v)}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quantity and Add to Bag Row */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {/* Quantity Selector */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid var(--wy-border)',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                background: 'var(--wy-surface)',
              }}
            >
              <button
                type="button"
                id="pdp-qty-dec"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                style={{
                  padding: '0.75rem 1rem',
                  background: 'transparent',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                }}
              >
                −
              </button>
              <span
                style={{
                  padding: '0.75rem 1.25rem',
                  color: '#FFFFFF',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  minWidth: '40px',
                  textAlign: 'center',
                  background: 'var(--wy-surface-raised)',
                }}
              >
                {quantity}
              </span>
              <button
                type="button"
                id="pdp-qty-inc"
                onClick={() => setQuantity((q) => Math.min(stock || 10, q + 1))}
                style={{
                  padding: '0.75rem 1rem',
                  background: 'transparent',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                }}
              >
                +
              </button>
            </div>

            {/* Add to Bag Button */}
            <button
              id="add-to-bag-btn"
              type="button"
              onClick={handleAddToCart}
              disabled={!inStock}
              className="btn btn-lg"
              style={{
                flex: 1,
                background: added ? 'var(--wy-success)' : inStock ? '#FFC800' : 'var(--wy-surface-raised)',
                color: added ? '#FFFFFF' : inStock ? '#0D0D0D' : 'var(--wy-muted-dim)',
                cursor: inStock ? 'pointer' : 'not-allowed',
                fontWeight: 800,
                letterSpacing: '0.08em',
                fontSize: '0.95rem',
                border: inStock ? 'none' : '1px solid var(--wy-border)',
                transition: 'all 200ms ease',
              }}
            >
              {added ? (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Added to Bag!
                </>
              ) : !inStock ? (
                'Sold Out'
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                  Add to Bag
                </>
              )}
            </button>
          </div>
        </div>

        {/* Value Guarantees Card */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            padding: '1.25rem',
            background: 'var(--wy-surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--wy-border)',
          }}
        >
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFC800" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <div>
              <p style={{ color: '#FFFFFF', fontSize: '0.8rem', fontWeight: 700 }}>100% Authentic</p>
              <p style={{ color: 'var(--wy-muted-dim)', fontSize: '0.7rem' }}>Verified origin</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFC800" strokeWidth="2">
              <rect x="1" y="3" width="15" height="13" rx="2" />
              <path d="M16 8h4l3 3v5h-7V8z" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            <div>
              <p style={{ color: '#FFFFFF', fontSize: '0.8rem', fontWeight: 700 }}>Fast Shipping</p>
              <p style={{ color: 'var(--wy-muted-dim)', fontSize: '0.7rem' }}>Free above ₦50k</p>
            </div>
          </div>
        </div>

        {/* Detailed Attribute Breakdown */}
        {selectedVariant && Object.keys(selectedVariant.attributes).length > 0 && (
          <div
            style={{
              padding: '1.25rem',
              background: 'var(--wy-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--wy-border)',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.9rem',
                letterSpacing: '0.1em',
                color: 'var(--wy-muted)',
                marginBottom: '0.75rem',
                textTransform: 'uppercase',
              }}
            >
              Specifications
            </h3>
            <dl style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: 0 }}>
              {Object.entries(selectedVariant.attributes as Record<string, unknown>).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <dt style={{ color: 'var(--wy-muted)', textTransform: 'capitalize' }}>
                    {k.replace(/_/g, ' ')}
                  </dt>
                  <dd style={{ color: '#FFFFFF', fontWeight: 600, margin: 0 }}>
                    {String(v)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
