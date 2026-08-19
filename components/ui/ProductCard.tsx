'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Plus, Minus } from 'lucide-react';
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
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Find existing cart item for this product
  const cartItem = items.find((item) => item.productId === product.id);
  const quantityInCart = items
    .filter((item) => item.productId === product.id)
    .reduce((sum, item) => sum + item.quantity, 0);

  const targetVariant = product.variants?.[0];
  const price = targetVariant?.price ?? 0;
  const inStock = product.variants?.some((v) => (v.stock_quantity ?? 0) > 0) ?? false;
  const imageUrl = product.images?.[0] ?? null;

  const attrs = (targetVariant?.attributes as any) || {};
  const badgeText = (attrs.clothing_type || product.category || 'Drop').toUpperCase();

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

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted((prev) => !prev);
  };

  return (
    <div className="relative h-full flex flex-col">
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

      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        style={{
          background: '#141416',
          borderRadius: '16px',
          border: added ? '2px solid #FFC800' : '1px solid #27272A',
          boxShadow: added ? '0 0 30px rgba(255,200,0,0.35)' : '0 8px 24px rgba(0,0,0,0.4)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          transition: 'all 0.2s ease',
        }}
        className="group hover:border-[#FFC800]/40"
      >
        {/* ─── Image Frame ─── */}
        <Link
          href={`/shop/${product.slug}`}
          style={{
            position: 'relative',
            aspectRatio: '4 / 5',
            overflow: 'hidden',
            background: '#080808',
            display: 'block',
          }}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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

          {/* Category / Subtype Badge */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              zIndex: 10,
              background: '#FFC800',
              color: '#000000',
              padding: '0.2rem 0.6rem',
              borderRadius: '4px',
              fontFamily: 'var(--font-display)',
              fontSize: '0.7rem',
              letterSpacing: '0.08em',
              fontWeight: 700,
            }}
          >
            {badgeText}
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={toggleWishlist}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              zIndex: 10,
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: '#000000',
              border: isWishlisted ? '1px solid #FFC800' : '1px solid #27272A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isWishlisted ? '#FFC800' : '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
            aria-label="Wishlist"
          >
            <Heart size={16} fill={isWishlisted ? '#FFC800' : 'none'} />
          </button>

          {/* Out of Stock Overlay */}
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
        </Link>

        {/* ─── Product Details & Actions ─── */}
        <div
          style={{
            padding: 'clamp(0.65rem, 1.8vw, 1.15rem)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            flex: 1,
            justifyContent: 'space-between',
          }}
        >
          <div>
            <Link href={`/shop/${product.slug}`} className="no-underline">
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
                  color: '#FFFFFF',
                  letterSpacing: '0.03em',
                  lineHeight: 1.2,
                  marginBottom: '0.25rem',
                }}
                className="group-hover:text-[#FFC800] transition-colors"
              >
                {product.title}
              </h3>
            </Link>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1rem, 2.2vw, 1.25rem)',
                color: '#FFC800',
              }}
            >
              GH₵ {price.toLocaleString()}
            </div>
          </div>

          {/* Quick Add Button / Stepper Controls */}
          {inStock && (
            <div>
              {quantityInCart > 0 ? (
                <div
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
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                >
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.8 }}
                    onClick={handleDecrease}
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
                    aria-label="Decrease quantity"
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
                    aria-label="Increase quantity"
                  >
                    <Plus size={15} strokeWidth={3} />
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.92, rotate: -2 }}
                  onClick={handleIncrease}
                  style={{
                    width: '100%',
                    padding: 'clamp(0.5rem, 1.4vw, 0.75rem)',
                    borderRadius: '8px',
                    background: '#FFC800',
                    color: '#000000',
                    border: 'none',
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(0.72rem, 1.4vw, 0.85rem)',
                    letterSpacing: '0.06em',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    transition: 'background 0.2s',
                  }}
                >
                  <ShoppingBag size={13} />
                  <span>+ QUICK ADD</span>
                </motion.button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
