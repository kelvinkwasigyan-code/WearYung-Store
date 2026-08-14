'use client';

import { useState } from 'react';
import type { ProductVariant } from '@/types/ecommerce';

interface AddToCartButtonProps {
  variants: ProductVariant[];
  productId: string;
  productTitle: string;
  productSlug: string;
  productImage: string;
}

export default function AddToCartButton({
  variants,
  productId,
  productTitle,
  productSlug,
  productImage,
}: AddToCartButtonProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>(variants[0]?.id ?? '');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const selectedVariant = variants.find(v => v.id === selectedVariantId);
  const inStock = (selectedVariant?.stock_quantity ?? 0) > 0;

  const handleAddToCart = () => {
    if (!selectedVariant || !inStock) return;

    // Read existing cart from localStorage
    const raw = localStorage.getItem('wy-cart');
    const cart = raw ? JSON.parse(raw) : { items: [] };

    const existingIndex = cart.items.findIndex(
      (item: { variantId: string }) => item.variantId === selectedVariant.id
    );

    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      cart.items.push({
        variantId: selectedVariant.id,
        productId,
        productTitle,
        productSlug,
        productImage,
        sku: selectedVariant.sku,
        price: selectedVariant.price,
        quantity,
        attributes: selectedVariant.attributes,
      });
    }

    localStorage.setItem('wy-cart', JSON.stringify(cart));

    // Flash confirmation
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const renderAttributeLabel = (variant: ProductVariant): string => {
    const attrs = variant.attributes as Record<string, unknown>;
    return Object.entries(attrs)
      .map(([k, v]) => `${String(v)}`)
      .join(' / ');
  };

  return (
    <div>
      {/* Variant Selector */}
      {variants.length > 1 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontFamily: 'var(--font-display)',
            fontSize: '0.85rem',
            letterSpacing: '0.1em',
            color: 'var(--wy-muted)',
            marginBottom: '0.75rem',
          }}>
            SELECT VARIANT
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {variants.map(variant => {
              const isSelected = variant.id === selectedVariantId;
              const outOfStock = variant.stock_quantity === 0;
              return (
                <button
                  key={variant.id}
                  id={`variant-${variant.id}`}
                  onClick={() => !outOfStock && setSelectedVariantId(variant.id)}
                  disabled={outOfStock}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: isSelected ? '2px solid var(--wy-yellow)' : '1px solid var(--wy-border)',
                    background: isSelected ? 'rgba(255,200,0,0.1)' : 'var(--wy-surface)',
                    color: outOfStock ? 'var(--wy-muted-dim)' : isSelected ? 'var(--wy-yellow)' : 'var(--wy-text)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: outOfStock ? 'not-allowed' : 'pointer',
                    opacity: outOfStock ? 0.5 : 1,
                    textDecoration: outOfStock ? 'line-through' : 'none',
                    transition: 'all 150ms',
                  }}
                >
                  {renderAttributeLabel(variant)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Price */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--wy-yellow)', letterSpacing: '0.04em' }}>
          ₦{selectedVariant?.price.toLocaleString() ?? '—'}
        </p>
        <p style={{ color: 'var(--wy-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
          SKU: {selectedVariant?.sku ?? '—'} · Stock: {selectedVariant?.stock_quantity ?? 0} left
        </p>
      </div>

      {/* Quantity Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <label style={{ color: 'var(--wy-muted)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>QTY</label>
        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--wy-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
          <button
            id="qty-decrease"
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            style={{ padding: '0.5rem 0.875rem', background: 'var(--wy-surface)', border: 'none', color: 'var(--wy-text)', cursor: 'pointer', fontSize: '1.1rem' }}
          >
            −
          </button>
          <span style={{ padding: '0.5rem 1rem', background: 'var(--wy-surface-raised)', color: 'var(--wy-text)', fontWeight: 600, minWidth: '3rem', textAlign: 'center' }}>
            {quantity}
          </span>
          <button
            id="qty-increase"
            onClick={() => setQuantity(q => Math.min(selectedVariant?.stock_quantity ?? 10, q + 1))}
            style={{ padding: '0.5rem 0.875rem', background: 'var(--wy-surface)', border: 'none', color: 'var(--wy-text)', cursor: 'pointer', fontSize: '1.1rem' }}
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart */}
      <button
        id="add-to-cart-btn"
        onClick={handleAddToCart}
        disabled={!inStock}
        className={`btn btn-primary btn-lg`}
        style={{
          width: '100%',
          background: added ? 'var(--wy-success)' : inStock ? 'var(--wy-yellow)' : 'var(--wy-border)',
          color: added || !inStock ? '#fff' : 'var(--wy-canvas)',
          cursor: inStock ? 'pointer' : 'not-allowed',
          transition: 'background 300ms',
        }}
      >
        {added ? (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Added to Cart!
          </>
        ) : !inStock ? (
          'Out of Stock'
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            Add to Cart
          </>
        )}
      </button>
    </div>
  );
}
