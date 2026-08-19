'use client';

import { useState } from 'react';
import type { Product, ProductVariant } from '@/types/ecommerce';
import { useCartContext } from '@/context/CartContext';
import { ShoppingBag, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickAddButtonProps {
  product: Product;
  variant?: ProductVariant;
}

export default function QuickAddButton({ product, variant }: QuickAddButtonProps) {
  const { addToCart, updateQuantity, removeFromCart, items } = useCartContext();
  const [added, setAdded] = useState(false);
  const [animatingKey, setAnimatingKey] = useState(0);

  const targetVariant = variant || product.variants?.[0];
  const inStock = (targetVariant?.stock_quantity ?? 0) > 0;

  const cartItem = items.find(
    (i) => i.productId === product.id && (!targetVariant || i.variantId === targetVariant.id)
  );

  const quantityInCart = items
    .filter((i) => i.productId === product.id)
    .reduce((sum, i) => sum + i.quantity, 0);

  const handleIncrease = (e: React.MouseEvent) => {
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

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!cartItem) return;

    if (cartItem.quantity > 1) {
      updateQuantity(cartItem.variantId, cartItem.quantity - 1);
    } else {
      removeFromCart(cartItem.variantId);
    }
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

      {quantityInCart > 0 ? (
        <div
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '0.35rem 0.5rem',
            borderRadius: '8px',
            background: '#09090B',
            border: '1px solid rgba(255, 200, 0, 0.4)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
          }}
        >
          <motion.button
            type="button"
            whileTap={{ scale: 0.8 }}
            onClick={handleDecrease}
            aria-label="Decrease quantity"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: 'rgba(255, 200, 0, 0.12)',
              color: '#FFC800',
              border: '1px solid rgba(255, 200, 0, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Minus size={15} strokeWidth={3} />
          </motion.button>

          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(0.78rem, 1.4vw, 0.88rem)',
              fontWeight: 800,
              letterSpacing: '0.06em',
              color: '#FFC800',
            }}
          >
            {quantityInCart} IN BAG
          </span>

          <motion.button
            type="button"
            whileTap={{ scale: 0.8 }}
            onClick={handleIncrease}
            aria-label="Increase quantity"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: '#FFC800',
              color: '#000000',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 0 12px rgba(255, 200, 0, 0.4)',
              transition: 'all 0.15s ease',
            }}
          >
            <Plus size={15} strokeWidth={3} />
          </motion.button>
        </div>
      ) : (
        <motion.button
          type="button"
          whileTap={{ scale: 0.92, rotate: -2 }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          onClick={handleIncrease}
          className="btn btn-sm"
          style={{
            width: '100%',
            background: 'var(--wy-yellow)',
            color: 'var(--wy-canvas)',
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
          <span className="flex items-center gap-1">
            <Plus size={14} strokeWidth={2.5} />
            <span>Quick Add</span>
          </span>
        </motion.button>
      )}
    </div>
  );
}
