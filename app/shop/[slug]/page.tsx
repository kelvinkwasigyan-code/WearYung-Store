import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import type { Product, ProductVariant } from '@/types/ecommerce';
import AddToCartButton from '@/components/ui/AddToCartButton';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select('title, description')
    .eq('slug', slug)
    .single();

  if (!data) return { title: 'Product Not Found' };

  return {
    title: data.title,
    description: data.description ?? `Shop ${data.title} at WEAR YUNG`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from('products')
    .select('*, variants:product_variants(*)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error || !product) notFound();

  const p = product as Product;
  const variants = (p.variants ?? []) as ProductVariant[];
  const images = p.images ?? [];
  const firstVariant = variants[0];

  // Build attribute keys for display
  const attrKeys = firstVariant ? Object.keys(firstVariant.attributes) : [];

  return (
    <div style={{ background: 'var(--wy-canvas)', minHeight: '100vh' }}>
      <div className="container-wy" style={{ padding: '3rem 1.5rem' }}>
        {/* Breadcrumb */}
        <nav style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '2rem', fontSize: '0.8rem', color: 'var(--wy-muted)' }}>
          <a href="/" style={{ color: 'var(--wy-muted)', textDecoration: 'none' }}>Home</a>
          <span>/</span>
          <a href="/shop" style={{ color: 'var(--wy-muted)', textDecoration: 'none' }}>Shop</a>
          <span>/</span>
          <a href={`/shop?category=${p.category}`} style={{ color: 'var(--wy-muted)', textDecoration: 'none', textTransform: 'capitalize' }}>{p.category}</a>
          <span>/</span>
          <span style={{ color: 'var(--wy-text)' }}>{p.title}</span>
        </nav>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'start',
        }}>
          {/* Image Gallery */}
          <div>
            <div style={{
              position: 'relative',
              aspectRatio: '4/5',
              background: 'var(--wy-surface)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: '1px solid var(--wy-border)',
            }}>
              {images[0] ? (
                <Image
                  src={images[0]}
                  alt={p.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--wy-border-light)',
                  flexDirection: 'column',
                  gap: '1rem',
                }}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <p style={{ fontSize: '0.8rem', color: 'var(--wy-muted-dim)' }}>No image</p>
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', overflowX: 'auto' }}>
                {images.map((img, i) => (
                  <div key={i} style={{
                    position: 'relative',
                    flexShrink: 0,
                    width: '80px',
                    height: '80px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: i === 0 ? '2px solid var(--wy-yellow)' : '1px solid var(--wy-border)',
                  }}>
                    <Image src={img} alt={`${p.title} ${i + 1}`} fill style={{ objectFit: 'cover' }} sizes="80px" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span className="badge badge-yellow">{p.category}</span>
              {variants.some(v => v.stock_quantity > 0)
                ? <span className="badge badge-surface" style={{ color: 'var(--wy-success)' }}>In Stock</span>
                : <span className="badge badge-outline">Out of Stock</span>
              }
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              letterSpacing: '0.04em',
              color: 'var(--wy-text)',
              marginBottom: '1rem',
            }}>
              {p.title}
            </h1>

            {p.description && (
              <p style={{ color: 'var(--wy-muted)', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                {p.description}
              </p>
            )}

            {/* Variant selection + Add to cart */}
            <AddToCartButton variants={variants} productId={p.id} productTitle={p.title} productSlug={slug} productImage={images[0] ?? ''} />

            {/* Attributes display */}
            {firstVariant && attrKeys.length > 0 && (
              <div style={{
                marginTop: '2rem',
                padding: '1.25rem',
                background: 'var(--wy-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--wy-border)',
              }}>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.9rem',
                  letterSpacing: '0.1em',
                  color: 'var(--wy-muted)',
                  marginBottom: '0.75rem',
                }}>
                  PRODUCT DETAILS
                </h3>
                <dl style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {attrKeys.map(key => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                      <dt style={{ color: 'var(--wy-muted)', textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</dt>
                      <dd style={{ color: 'var(--wy-text)', fontWeight: 500 }}>
                        {String((firstVariant.attributes as Record<string, unknown>)[key])}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Delivery note */}
            <div style={{
              marginTop: '1.5rem',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start',
              padding: '1rem',
              background: 'rgba(255,200,0,0.05)',
              border: '1px solid rgba(255,200,0,0.2)',
              borderRadius: 'var(--radius-md)',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--wy-yellow)" strokeWidth="1.5" style={{ flexShrink: 0, marginTop: '2px' }}>
                <rect x="1" y="3" width="15" height="13" rx="2"/>
                <path d="M16 8h4l3 3v5h-7V8z"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
              <div>
                <p style={{ color: 'var(--wy-yellow)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  Free Delivery
                </p>
                <p style={{ color: 'var(--wy-muted)', fontSize: '0.8rem' }}>
                  On orders above ₦50,000. Standard delivery 3–5 business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
