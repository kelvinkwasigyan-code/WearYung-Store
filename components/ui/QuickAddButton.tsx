'use client';

import { useState } from 'react';
import type { Product, ProductVariant } from '@/types/ecommerce';
import { useCartContext } from '@/context/CartContext';

interface QuickAddButtonProps {
  product: Product;
  variant?: ProductVariant;
}

export default function QuickAddButton({ product, variant }: QuickAddButtonProps) {
  const { addToCart } = useCartContext();
  const [added, setAdded] = useState(false);
  const targetVariant = variant || product.variants?.[0];
  const inStock = (targetVariant?.stock_quantity ?? 0) > 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!targetVariant || !inStock) return;

    addToCart({
      variantId: targetVariant.id,
      productId: product.id,
      productTitle: product.title,
      productSlug: product.slug,
      productImage: product.images?.[0] ?? '',
      sku: targetVariant.sku,
      price: targetVariant.price,
      quantity: 1,
      attributes: targetVariant.attributes,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  if (!inStock) {
    return (
      <button
        disabled
        style={{
          width: '100%',
          padding: '0.6rem 1rem',
          background: 'var(--wy-surface-raised)',
          border: '1px solid var(--wy-border)',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--wy-muted-dim)',
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          cursor: 'not-allowed',
        }}
      >
        Out of Stock
      </button>
    );
  }

  return (
    <button
      onClick={handleQuickAdd}
      className="btn btn-sm"
      style={{
        width: '100%',
        background: added ? 'var(--wy-success)' : 'var(--wy-yellow)',
        color: added ? '#FFFFFF' : 'var(--wy-canvas)',
        border: 'none',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.4rem',
        transition: 'all 150ms ease',
      }}
    >
      {added ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Added!
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Quick Add
        </>
      )}
    </button>
  );
}
