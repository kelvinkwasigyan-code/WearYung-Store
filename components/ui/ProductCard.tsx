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
    <Link href={`/shop/${product.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
      <article className="card-wy" style={{ cursor: 'pointer' }}>
        {/* Image */}
        <div style={{
          position: 'relative',
          aspectRatio: '3/4',
          overflow: 'hidden',
          background: 'var(--wy-surface-raised)',
        }}>
          {imageUrl ? (
            <div className="product-img-wrap">
              <Image
                src={imageUrl}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                style={{ objectFit: 'cover' }}
                className="product-img"
              />
            </div>
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--wy-border-light)',
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
          )}

          {/* Category Badge */}
          <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
            <span className="badge badge-yellow" style={{ fontSize: '0.65rem' }}>
              {product.category}
            </span>
          </div>

          {/* Out of Stock Overlay */}
          {!inStock && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(13,13,13,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span className="badge badge-outline" style={{ fontSize: '0.75rem', padding: '0.4rem 1rem' }}>
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '1rem' }}>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.1rem',
            letterSpacing: '0.06em',
            color: 'var(--wy-text)',
            marginBottom: '0.25rem',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}>
            {product.title}
          </h3>
          {minPrice !== null && (
            <p style={{ color: 'var(--wy-yellow)', fontWeight: 700, fontSize: '1rem' }}>
              {product.variants && product.variants.length > 1 ? 'From ' : ''}
              ₦{minPrice.toLocaleString()}
            </p>
          )}
          {firstVariant && (
            <p style={{ color: 'var(--wy-muted-dim)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
              {product.variants?.length ?? 0} variant{(product.variants?.length ?? 0) !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
