'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingBag, Check } from 'lucide-react';
import type { Product } from '@/types/ecommerce';
import { useCartContext } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCartContext();
  const [added, setAdded] = useState(false);

  const targetVariant = product.variants?.[0];
  const minPrice = product.variants?.length
    ? Math.min(...product.variants.map((v) => v.price))
    : null;
  const inStock = product.variants?.some((v) => (v.stock_quantity ?? 0) > 0) ?? false;
  const imageUrl = product.images?.[0] ?? null;

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

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group relative flex flex-col transition-all duration-300"
      style={{ textDecoration: 'none', display: 'flex' }}
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
          border: '1px solid #27272A',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
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
            className="transition-transform duration-500 ease-out group-hover:scale-105"
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

        {/* Floating Quick Add Button */}
        {inStock && (
          <button
            type="button"
            onClick={handleQuickAdd}
            aria-label={`Quick add ${product.title} to bag`}
            className="absolute bottom-2.5 right-2.5 z-20 flex h-8.5 items-center gap-1.5 rounded-lg border border-[#FFC800]/30 bg-zinc-950/85 px-3 text-xs font-black uppercase tracking-wider text-[#FFC800] shadow-lg backdrop-blur-md transition-all duration-200 hover:border-[#FFC800] hover:scale-105 active:scale-95"
          >
            {added ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" strokeWidth={3} />
                <span className="text-[10px] font-black text-emerald-400">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5 text-[#FFC800]" strokeWidth={2.4} />
                <span className="text-[10px] font-black text-[#FFC800]">Quick Add</span>
              </>
            )}
          </button>
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
        {/* Sub-header: Rating (Option count tag removed) */}
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
  );
}
