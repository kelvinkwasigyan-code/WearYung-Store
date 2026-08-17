'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import type { Product, ProductVariant } from '@/types/ecommerce';
import { useCartContext } from '@/context/CartContext';
import ProductReviews from './ProductReviews';

interface ProductDetailViewProps {
  product: Product;
}

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const variants = product.variants ?? [];
  const [selectedVariantId, setSelectedVariantId] = useState<string>(variants[0]?.id ?? '');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('wy_wishlist');
      if (saved) {
        const ids = JSON.parse(saved);
        if (Array.isArray(ids) && ids.includes(product.id)) {
          setIsWishlisted(true);
        }
      }
    } catch {}
  }, [product.id]);

  const handleToggleWishlist = () => {
    try {
      const saved = localStorage.getItem('wy_wishlist');
      let ids: string[] = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(ids)) ids = [];
      if (ids.includes(product.id)) {
        ids = ids.filter((id) => id !== product.id);
        setIsWishlisted(false);
      } else {
        ids.push(product.id);
        setIsWishlisted(true);
      }
      localStorage.setItem('wy_wishlist', JSON.stringify(ids));
    } catch {
      setIsWishlisted(!isWishlisted);
    }
  };

  const { addToCart } = useCartContext();

  const selectedVariant = variants.find((v) => v.id === selectedVariantId) || variants[0];
  const stock = selectedVariant?.stock_quantity ?? 0;
  const inStock = stock > 0;
  const isLowStock = inStock && stock <= 5;
  const images = product.images?.length ? product.images : ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1000&q=80'];
  const currentImage = images[selectedImageIndex];
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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
      case 'perfumes':
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
      case 'perfumes':
        return 'Select Volume';
      case 'bags':
        return 'Select Type & Material';
      default:
        return 'Select Option';
    }
  };

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 'clamp(1.75rem, 3.5vw, 3.25rem)',
          alignItems: 'start',
        }}
      >
      {/* LEFT: Product Gallery */}
      <div style={{ position: 'sticky', top: '5.5rem' }}>
        {/* Main Display Image */}
        <div 
          className="group relative w-full overflow-hidden rounded-2xl bg-[#080808] border border-zinc-800/60 cursor-crosshair"
          style={{
            height: 'clamp(440px, 70vh, 640px)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={(e) => {
            const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - left) / width) * 100;
            const y = ((e.clientY - top) / height) * 100;
            setMousePos({ x, y });
          }}
        >
          {currentImage ? (
            <>
              <Image
                src={currentImage}
                alt={product.title}
                fill
                loading="eager"
                sizes="(max-width: 768px) 100vw, 55vw"
                style={{ 
                  objectFit: 'cover',
                  opacity: isZoomed ? 0 : 1,
                  transition: 'opacity 300ms ease'
                }}
              />
              {/* Zoom Overlay */}
              <div
                className="absolute inset-0 z-10 transition-opacity duration-300 pointer-events-none"
                style={{
                  opacity: isZoomed ? 1 : 0,
                  backgroundImage: `url(${currentImage})`,
                  backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                  backgroundSize: '200%',
                  backgroundRepeat: 'no-repeat'
                }}
              />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-zinc-600">
              No image available
            </div>
          )}
          
          {/* Category Tag Overlay */}
          <div style={{ position: 'absolute', top: '0.85rem', left: '0.85rem', zIndex: 20 }}>
            <span className="badge badge-yellow" style={{ fontSize: '0.72rem', padding: '0.25rem 0.65rem' }}>
              {product.category}
            </span>
          </div>

          {/* Wishlist Button Overlay */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleToggleWishlist();
            }}
            style={{
              position: 'absolute',
              top: '0.85rem',
              right: '0.85rem',
              zIndex: 25,
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#000000',
              border: isWishlisted ? '1px solid #FFC800' : '1px solid #27272A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isWishlisted ? '#FFC800' : '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={18} fill={isWishlisted ? '#FFC800' : 'none'} />
          </button>

          {/* Low Stock Badges Overlay */}
          <div className="absolute top-10 left-3 z-20 flex flex-col gap-2 pointer-events-none mt-1">
            {isLowStock && (
              <div className="rounded-full bg-red-600/90 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-widest text-white backdrop-blur-md shadow-[0_0_15px_rgba(220,38,38,0.5)] animate-pulse">
                ONLY {stock} LEFT
              </div>
            )}
          </div>
        </div>

        {/* Thumbnail Selector */}
        {images.length > 1 && (
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              marginTop: '0.75rem',
              overflowX: 'auto',
              paddingBottom: '0.25rem',
            }}
          >
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImageIndex(idx)}
                style={{
                  position: 'relative',
                  width: '64px',
                  height: '64px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  background: 'var(--wy-surface)',
                  border: selectedImageIndex === idx ? '2px solid var(--wy-yellow)' : '1px solid var(--wy-border)',
                  padding: 0,
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'border-color 150ms ease',
                }}
              >
                <Image src={img} alt={`${product.title} ${idx + 1}`} fill sizes="64px" style={{ objectFit: 'contain' }} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT: Product Information & Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
        {/* Title & Category Header */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span style={{ color: 'var(--wy-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              WEAR YUNG / {product.category}
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.85rem, 3.5vw, 2.5rem)',
              letterSpacing: '0.04em',
              color: '#FFFFFF',
              lineHeight: 1.1,
              marginBottom: '0.5rem',
            }}
          >
            {product.title}
          </h1>

          {/* Price & SKU */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.85rem' }}>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem, 3vw, 2.25rem)',
                color: '#FFC800',
                letterSpacing: '0.04em',
                lineHeight: 1,
              }}
            >
              GH₵ {(selectedVariant?.price ?? 0).toLocaleString()}
            </p>
            {selectedVariant?.sku && (
              <span style={{ color: 'var(--wy-muted-dim)', fontSize: '0.75rem', fontFamily: 'monospace' }}>
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
            gap: '0.5rem',
            padding: '0.35rem 0.85rem',
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
          <p style={{ color: 'var(--wy-muted)', lineHeight: 1.6, fontSize: '0.88rem' }}>
            {product.description}
          </p>
        )}

        {/* Dynamic Category Variant Selector */}
        {variants.length > 0 && (
          <div style={{ padding: '0.85rem 0', borderTop: '1px solid var(--wy-border)', borderBottom: '1px solid var(--wy-border)' }}>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-display)',
                fontSize: '0.78rem',
                letterSpacing: '0.1em',
                color: 'var(--wy-muted)',
                marginBottom: '0.55rem',
                textTransform: 'uppercase',
                fontWeight: 700,
              }}
            >
              {getAttributeCategoryLabel()}
            </label>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
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
                      padding: '0.45rem 0.95rem',
                      borderRadius: '8px',
                      border: isSelected ? '2px solid var(--wy-yellow)' : '1px solid var(--wy-border)',
                      background: isSelected ? 'rgba(255,200,0,0.12)' : 'var(--wy-surface)',
                      color: isItemOutOfStock ? 'var(--wy-muted-dim)' : isSelected ? 'var(--wy-yellow)' : '#FFFFFF',
                      fontSize: '0.8rem',
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {/* Quantity Selector */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid var(--wy-border)',
                borderRadius: '8px',
                overflow: 'hidden',
                background: 'var(--wy-surface)',
              }}
            >
              <button
                type="button"
                id="pdp-qty-dec"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                style={{
                  padding: '0.6rem 0.85rem',
                  background: 'transparent',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  lineHeight: 1,
                }}
              >
                −
              </button>
              <span
                style={{
                  padding: '0.6rem 0.95rem',
                  color: '#FFFFFF',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  minWidth: '36px',
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
                  padding: '0.6rem 0.85rem',
                  background: 'transparent',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  lineHeight: 1,
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
                padding: '0.75rem 1.25rem',
                background: added ? 'var(--wy-success)' : inStock ? '#FFC800' : 'var(--wy-surface-raised)',
                color: added ? '#FFFFFF' : inStock ? '#0D0D0D' : 'var(--wy-muted-dim)',
                cursor: inStock ? 'pointer' : 'not-allowed',
                fontWeight: 800,
                letterSpacing: '0.08em',
                fontSize: '0.88rem',
                borderRadius: '8px',
                border: inStock ? 'none' : '1px solid var(--wy-border)',
                transition: 'all 200ms ease',
              }}
            >
              {added ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Added to Bag!
                </>
              ) : !inStock ? (
                'Sold Out'
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                  Add to Bag
                </>
              )}
            </button>

            {/* Black Wishlist CTA Button */}
            <button
              id="pdp-wishlist-btn"
              type="button"
              onClick={handleToggleWishlist}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              style={{
                padding: '0.75rem 1.1rem',
                borderRadius: '8px',
                background: '#000000',
                border: isWishlisted ? '1px solid #FFC800' : '1px solid #27272A',
                color: isWishlisted ? '#FFC800' : '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 150ms ease',
              }}
              onMouseEnter={(e) => {
                if (!isWishlisted) {
                  e.currentTarget.style.borderColor = '#FFC800';
                  e.currentTarget.style.color = '#FFC800';
                }
              }}
              onMouseLeave={(e) => {
                if (!isWishlisted) {
                  e.currentTarget.style.borderColor = '#27272A';
                  e.currentTarget.style.color = '#FFFFFF';
                }
              }}
            >
              <Heart size={20} fill={isWishlisted ? '#FFC800' : 'none'} strokeWidth={2.2} />
            </button>
          </div>
        </div>

        {/* Value Guarantees Card */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
            padding: '0.85rem 1rem',
            background: 'var(--wy-surface)',
            borderRadius: '10px',
            border: '1px solid var(--wy-border)',
          }}
        >
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFC800" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <div>
              <p style={{ color: '#FFFFFF', fontSize: '0.78rem', fontWeight: 700 }}>100% Authentic</p>
              <p style={{ color: 'var(--wy-muted-dim)', fontSize: '0.68rem' }}>Verified origin</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFC800" strokeWidth="2">
              <rect x="1" y="3" width="15" height="13" rx="2" />
              <path d="M16 8h4l3 3v5h-7V8z" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            <div>
              <p style={{ color: '#FFFFFF', fontSize: '0.78rem', fontWeight: 700 }}>Fast Shipping</p>
              <p style={{ color: 'var(--wy-muted-dim)', fontSize: '0.68rem' }}>Free above GH₵ 1,000</p>
            </div>
          </div>
        </div>

        {/* Detailed Attribute Breakdown */}
        {selectedVariant && Object.keys(selectedVariant.attributes).length > 0 && (
          <div
            style={{
              padding: '0.85rem 1rem',
              background: 'var(--wy-surface)',
              borderRadius: '10px',
              border: '1px solid var(--wy-border)',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.8rem',
                letterSpacing: '0.1em',
                color: 'var(--wy-muted)',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
              }}
            >
              Specifications
            </h3>
            <dl style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', margin: 0 }}>
              {Object.entries(selectedVariant.attributes as Record<string, unknown>).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
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
    <ProductReviews productId={product.id} />
    </>
  );
}

