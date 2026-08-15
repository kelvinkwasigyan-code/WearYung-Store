import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types/ecommerce';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const firstVariant = product.variants?.[0];
  const minPrice = product.variants?.length
    ? Math.min(...product.variants.map(v => v.price))
    : null;
  const inStock = product.variants?.some(v => v.stock_quantity > 0) ?? false;
  const imageUrl = product.images?.[0] ?? null;

  return (
    <Link href={`/shop/${product.slug}`} className="group relative flex flex-col transition-all duration-300" style={{ textDecoration: 'none', display: 'block' }}>
      {/* Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#0D0D0D]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="transition-transform duration-700 ease-out group-hover:scale-105"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-600">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
        
        {/* Overlay Gradient (for text readability if needed) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Category Badge (Floating top-left) */}
        <div className="absolute left-3 top-3 z-10 rounded-full bg-black/70 px-3 py-1 font-display text-[10px] font-bold uppercase tracking-widest text-[#FFC800] backdrop-blur-md">
          {product.category}
        </div>

        {/* Out of Stock Overlay */}
        {!inStock && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <span className="rounded-full border border-zinc-500 px-4 py-2 font-display text-xs font-bold uppercase tracking-widest text-zinc-300">
              Sold Out
            </span>
          </div>
        )}

        {/* View Details Button (Slide up on hover) */}
        <div className="absolute bottom-4 left-4 right-4 z-20 translate-y-8 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <div className="w-full rounded-xl bg-zinc-800/90 py-3 text-center font-display text-sm font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-colors duration-300 hover:bg-[#FFC800] hover:text-black shadow-xl border border-zinc-700 hover:border-[#FFC800]">
            View Details
          </div>
        </div>
      </div>

      {/* Unboxed Content */}
      <div className="flex flex-col pt-4 pb-2">
        {/* Reviews Summary */}
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">
            {product.variants?.length ?? 0} Option{(product.variants?.length ?? 0) !== 1 ? 's' : ''}
          </span>
          <div className="flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" className="text-[#FFC800]">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span className="text-[11px] font-semibold text-zinc-400">
              {product.average_rating ? product.average_rating.toFixed(1) : '4.8'}
            </span>
          </div>
        </div>

        <h3 className="mb-1 truncate font-display text-base tracking-wide text-white transition-colors group-hover:text-[#FFC800]">
          {product.title}
        </h3>

        <div className="flex items-center gap-2">
          <span className="font-display text-lg font-bold tracking-wide text-white">
            {minPrice !== null ? `GH₵ ${minPrice.toLocaleString()}` : '—'}
          </span>
        </div>
      </div>
    </Link>
  );
}

