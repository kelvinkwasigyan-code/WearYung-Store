import Image from 'next/image';
import Link from 'next/link';
import { getProducts } from '@/lib/supabase/products';
import type { Product } from '@/types/ecommerce';
import QuickAddButton from './ui/QuickAddButton';

export default async function ProductGrid() {
  const productList = await getProducts({ limit: 8 });

  if (productList.length === 0) {
    return null;
  }

  return (
    <section className="section-wy" style={{ background: 'var(--wy-canvas)' }}>
      <div className="container-wy">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-block',
                color: 'var(--wy-yellow)',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
              }}
            >
              Curated Drops
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                color: '#FFFFFF',
              }}
            >
              LATEST RELEASES
            </h2>
          </div>

          <Link
            href="/shop"
            className="btn btn-outline btn-sm"
            style={{
              borderColor: 'var(--wy-border)',
              color: 'var(--wy-text)',
            }}
          >
            View All Products →
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {productList.map((product) => {
            const minPrice = product.variants?.length
              ? Math.min(...product.variants.map((v) => v.price))
              : null;
            const imageUrl = product.images?.[0] ?? null;
            const firstVariant = product.variants?.[0];

            return (
              <div
                key={product.id}
                className="card-wy"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'var(--wy-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--wy-border)',
                  overflow: 'hidden',
                }}
              >
                {/* Product Image & Link */}
                <Link
                  href={`/shop/${product.slug}`}
                  style={{
                    position: 'relative',
                    aspectRatio: '3/4',
                    overflow: 'hidden',
                    background: 'var(--wy-surface-raised)',
                    display: 'block',
                  }}
                >
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
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--wy-border-light)',
                      }}
                    >
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}

                  {/* Category Tag */}
                  <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
                    <span className="badge badge-yellow" style={{ fontSize: '0.65rem' }}>
                      {product.category}
                    </span>
                  </div>
                </Link>

                {/* Product Details */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <Link
                      href={`/shop/${product.slug}`}
                      style={{
                        textDecoration: 'none',
                        display: 'block',
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.15rem',
                          letterSpacing: '0.06em',
                          color: '#FFFFFF',
                          marginBottom: '0.35rem',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {product.title}
                      </h3>
                    </Link>

                    {minPrice !== null && (
                      <p
                        style={{
                          color: '#FFC800',
                          fontWeight: 700,
                          fontSize: '1.1rem',
                          marginBottom: '1rem',
                        }}
                      >
                        GH₵ {minPrice.toLocaleString()}
                      </p>
                    )}
                  </div>

                  {/* Quick Add Button */}
                  <QuickAddButton product={product} variant={firstVariant} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

