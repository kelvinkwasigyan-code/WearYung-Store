'use client';

import { useState } from 'react';
import type { Product, ProductVariant } from '@/types/ecommerce';
import { useCartContext } from '@/context/CartContext';
import { ShoppingBag, Check, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickAddButtonProps {
  product: Product;
  variant?: ProductVariant;
}

export default function QuickAddButton({ product, variant }: QuickAddButtonProps) {
  const { addToCart } = useCartContext();
  const [added, setAdded] = useState(false);
  const [animatingKey, setAnimatingKey] = useState(0);
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
    setAnimatingKey((prev) => prev + 1);
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
    <div className="relative w-full">
      {/* Fly-up particle */}
      <AnimatePresence>
        {added && (
          <motion.div
            key={animatingKey}
            initial={{ opacity: 1, y: 0, scale: 0.7 }}
            animate={{ opacity: 0, y: -35, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-[#FFC800] px-3 py-0.5 text-[10px] font-black text-black shadow-lg z-30"
          >
            <ShoppingBag className="h-3 w-3 fill-black text-black" />
            <span>+1 BAG</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        whileTap={{ scale: 0.92, rotate: -2 }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
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
          <motion.span initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="flex items-center gap-1">
            <Check size={14} strokeWidth={3} />
            <span>Added!</span>
          </motion.span>
        ) : (
          <span className="flex items-center gap-1">
            <Plus size={14} strokeWidth={2.5} />
            <span>Quick Add</span>
          </span>
        )}
      </motion.button>
    </div>
  );
}
