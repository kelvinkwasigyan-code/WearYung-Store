'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingBag, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '@/types/ecommerce';
import { useCartContext } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, updateQuantity, removeFromCart, items } = useCartContext();
  const [added, setAdded] = useState(false);
  const [animatingKey, setAnimatingKey] = useState(0);

  // Find existing cart item for this product
  const cartItem = items.find((item) => item.productId === product.id);
  const quantityInCart = items
    .filter((item) => item.productId === product.id)
    .reduce((sum, item) => sum + item.quantity, 0);

  const targetVariant = product.variants?.[0];
  const minPrice = product.variants?.length
    ? Math.min(...product.variants.map((v) => v.price))
    : null;
  const inStock = product.variants?.some((v) => (v.stock_quantity ?? 0) > 0) ?? false;
  const imageUrl = product.images?.[0] ?? null;

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
    setTimeout(() => setAdded(false), 2000);
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

  return (
    <div className="relative">
      {/* Outer Floating Particle Badge */}
      <AnimatePresence>
        {added && (
          <motion.div
            key={animatingKey}
            initial={{ opacity: 0, y: 10, scale: 0.5 }}
            animate={{ opacity: 1, y: -30, scale: 1.15 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute -top-5 right-2 z-30 flex items-center gap-1.5 rounded-full border border-[#FFC800] bg-[#FFC800] px-3 py-1 text-[11px] font-black uppercase text-black shadow-[0_0_20px_rgba(255,200,0,0.8)]"
          >
            <ShoppingBag className="h-3.5 w-3.5 fill-black text-black" />
            <span>+1 ADDED TO BAG!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Link
        href={`/shop/${product.slug}`}
        className="group relative flex flex-col transition-all duration-300 no-underline"
      >
        {/* ─── Image Frame ─── */}
        <div
          style={{
            position: 'relative',
            aspectRatio: '1 / 1.12',
            width: '100%',
            overflow: 'hidden',
            borderRadius: 'clamp(12px, 2vw, 16px)',
            background: '#141418',
            border: added ? '2px solid #FFC800' : '1px solid #27272A',
            boxShadow: added
              ? '0 0 35px rgba(255, 200, 0, 0.45)'
              : '0 8px 24px rgba(0, 0, 0, 0.4)',
            transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
          }}
          className="group-hover:border-[#FFC800]/50 group-hover:shadow-[0_8px_30px_rgba(255,200,0,0.15)]"
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className={`transition-transform duration-500 ease-out group-hover:scale-105 ${
                added ? 'scale-105 filter brightness-110' : ''
              }`}
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
          ) : (
            <div style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', color: '#52525B' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )}

          {/* Ambient Dark Scrim */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 40%)', pointerEvents: 'none' }} />

          {/* Category Pill Tag */}
          <div
            style={{
              position: 'absolute',
              left: 'clamp(6px, 1.5vw, 10px)',
              top: 'clamp(6px, 1.5vw, 10px)',
              zIndex: 10,
              borderRadius: '100px',
              background: 'rgba(9, 9, 11, 0.82)',
              border: '1px solid rgba(255, 200, 0, 0.35)',
              backdropFilter: 'blur(8px)',
              padding: '0.2rem 0.6rem',
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(0.62rem, 1.1vw, 0.72rem)',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--wy-yellow)',
            }}
          >
            {product.category}
          </div>

          {/* Floating Quick Add & Stepper Controls */}
          {inStock && (
            <div className="absolute bottom-2.5 right-2.5 z-20">
              {quantityInCart > 0 ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  className="flex h-9 items-center gap-1.5 rounded-lg border border-[#FFC800]/50 bg-zinc-950/95 p-1 shadow-2xl backdrop-blur-md"
                >
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.75 }}
                    onClick={handleDecrease}
                    aria-label="Decrease quantity"
                    className="flex h-7 w-7 items-center justify-center rounded bg-[#FFC800]/15 text-[#FFC800] border border-[#FFC800]/30 transition-colors hover:bg-[#FFC800] hover:text-black cursor-pointer"
                  >
                    <Minus className="h-3.5 w-3.5" strokeWidth={3} />
                  </motion.button>

                  <span className="px-1 text-[11px] font-black tracking-wider text-[#FFC800] whitespace-nowrap">
                    {quantityInCart} IN BAG
                  </span>

                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.75 }}
                    onClick={handleIncrease}
                    aria-label="Increase quantity"
                    className="flex h-7 w-7 items-center justify-center rounded bg-[#FFC800] text-black shadow-[0_0_10px_rgba(255,200,0,0.4)] transition-colors hover:bg-yellow-400 border-none cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" strokeWidth={3} />
                  </motion.button>
                </motion.div>
              ) : (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.75, rotate: -6 }}
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  onClick={handleIncrease}
                  aria-label={`Quick add ${product.title} to bag`}
                  className="relative flex h-9 items-center gap-1.5 rounded-lg border border-[#FFC800]/40 bg-zinc-950/90 px-3.5 text-xs font-black uppercase tracking-wider text-[#FFC800] shadow-2xl backdrop-blur-md transition-all duration-200 hover:border-[#FFC800] hover:bg-[#FFC800] hover:text-black"
                >
                  <ShoppingBag className="h-3.5 w-3.5" strokeWidth={2.4} />
                  <span className="text-[10px] font-black">Quick Add</span>
                </motion.button>
              )}
            </div>
          )}

          {/* Out of Stock Pill */}
          {!inStock && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(4px)',
              }}
            >
              <span
                style={{
                  borderRadius: '100px',
                  border: '1px solid #71717A',
                  padding: '0.35rem 0.85rem',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#E4E4E7',
                }}
              >
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* ─── Product Info ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', paddingTop: '0.65rem' }}>
          {/* Sub-header: Rating */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '0.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Star size={11} fill="var(--wy-yellow)" color="var(--wy-yellow)" />
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#A1A1AA' }}>
                {product.average_rating ? product.average_rating.toFixed(1) : '4.9'}
              </span>
            </div>
          </div>

          {/* Title */}
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(0.88rem, 1.4vw, 1.05rem)',
              fontWeight: 800,
              letterSpacing: '0.04em',
              color: '#FFFFFF',
              margin: '0 0 0.35rem',
              lineHeight: 1.25,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              transition: 'color 0.2s ease',
            }}
            className="group-hover:text-[#FFC800]"
          >
            {product.title}
          </h3>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(0.95rem, 1.6vw, 1.18rem)',
                fontWeight: 900,
                letterSpacing: '0.04em',
                color: 'var(--wy-yellow)',
              }}
            >
              {minPrice !== null ? `GH₵ ${minPrice.toLocaleString()}` : '—'}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
