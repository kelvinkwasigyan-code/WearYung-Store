import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import ProductCard from '@/components/ui/ProductCard';
import { ALL_CATEGORIES, CATEGORY_LABELS, type Product, type ProductCategory } from '@/types/ecommerce';

export const metadata: Metadata = {
  title: 'Shop All Products',
  description: 'Browse all WEAR YUNG products — clothing, sneakers, watches, bags, sprays, accessories and slides.',
};

interface ShopPageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const activeCategory = params.category as ProductCategory | undefined;
  const query = params.q ?? '';

  const supabase = await createClient();

  let dbQuery = supabase
    .from('products')
    .select('*, variants:product_variants(*)')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (activeCategory) {
    dbQuery = dbQuery.eq('category', activeCategory);
  }

  if (query) {
    dbQuery = dbQuery.ilike('title', `%${query}%`);
  }

  const { data: products, error } = await dbQuery;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--wy-canvas)' }}>
      {/* Header */}
      <div style={{
        background: 'var(--wy-surface)',
        borderBottom: '1px solid var(--wy-border)',
        padding: '2.5rem 0',
      }}>
        <div className="container-wy">
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            color: 'var(--wy-text)',
            marginBottom: '0.5rem',
          }}>
            {activeCategory ? CATEGORY_LABELS[activeCategory] : 'All Products'}
          </h1>
          <p style={{ color: 'var(--wy-muted)', fontSize: '0.9rem' }}>
            {products?.length ?? 0} product{(products?.length ?? 0) !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      <div className="container-wy section-wy" style={{ paddingTop: '2rem' }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Sidebar: Category Filter */}
          <aside style={{ minWidth: '180px', flex: '0 0 180px' }}>
            <form method="GET" action="/shop" style={{ marginBottom: '1.5rem' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="q"
                  defaultValue={query}
                  placeholder="Search products..."
                  className="input-wy"
                  id="shop-search"
                  style={{ paddingRight: '2.5rem' }}
                />
                <button type="submit" style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--wy-muted)',
                  cursor: 'pointer',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                </button>
              </div>
            </form>

            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.85rem',
              letterSpacing: '0.12em',
              color: 'var(--wy-muted)',
              marginBottom: '1rem',
              textTransform: 'uppercase',
            }}>
              Categories
            </h3>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <a
                href="/shop"
                id="filter-all"
                style={{
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  fontWeight: !activeCategory ? 700 : 500,
                  color: !activeCategory ? 'var(--wy-yellow)' : 'var(--wy-muted)',
                  background: !activeCategory ? 'rgba(255,200,0,0.1)' : 'transparent',
                  transition: 'all 150ms',
                  textDecoration: 'none',
                  display: 'block',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                All
              </a>
              {ALL_CATEGORIES.map((cat) => (
                <a
                  key={cat}
                  href={`/shop?category=${cat}`}
                  id={`filter-${cat}`}
                  style={{
                    padding: '0.6rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.875rem',
                    fontWeight: activeCategory === cat ? 700 : 500,
                    color: activeCategory === cat ? 'var(--wy-yellow)' : 'var(--wy-muted)',
                    background: activeCategory === cat ? 'rgba(255,200,0,0.1)' : 'transparent',
                    transition: 'all 150ms',
                    textDecoration: 'none',
                    display: 'block',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  {CATEGORY_LABELS[cat]}
                </a>
              ))}
            </nav>
          </aside>

          {/* Product Grid */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                color: 'var(--wy-danger)',
                fontSize: '0.875rem',
                marginBottom: '1.5rem',
              }}>
                Failed to load products. Please try again.
              </div>
            )}

            {!products?.length && !error ? (
              <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--wy-muted)' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: '0 auto 1rem', opacity: 0.4 }}>
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', letterSpacing: '0.06em' }}>
                  No products found
                </p>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  {query ? `No results for "${query}"` : 'Check back soon for new drops.'}
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '1.25rem',
              }}>
                {(products as Product[])?.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
