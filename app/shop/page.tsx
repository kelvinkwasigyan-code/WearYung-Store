import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import ProductCard from '@/components/ui/ProductCard';
import ShopFilters from '@/components/ShopFilters';
import { ALL_CATEGORIES, CATEGORY_LABELS, type Product, type ProductCategory } from '@/types/ecommerce';

export const metadata: Metadata = {
  title: 'Shop All Products | WEAR YUNG',
  description: 'Browse all WEAR YUNG products — luxury streetwear, hoodies, sneakers, watches, bags, and exclusive accessories.',
};

interface ShopPageProps {
  searchParams: Promise<{ category?: string; q?: string; minPrice?: string; maxPrice?: string; sort?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const activeCategory = params.category as ProductCategory | undefined;
  const query = params.q ?? '';
  const minPrice = params.minPrice ? parseFloat(params.minPrice) : null;
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : null;
  const sort = params.sort ?? 'newest';

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

  const { data: rawProducts, error } = await dbQuery;
  let products = (rawProducts as Product[]) || [];

  // In-memory Price Filtering
  if (minPrice !== null || maxPrice !== null) {
    products = products.filter((product) => {
      if (!product.variants || product.variants.length === 0) return false;
      const price = product.variants[0].price;
      if (minPrice !== null && price < minPrice) return false;
      if (maxPrice !== null && price > maxPrice) return false;
      return true;
    });
  }

  // In-memory Sorting
  if (sort === 'price-asc') {
    products.sort((a, b) => {
      const priceA = a.variants?.[0]?.price ?? 0;
      const priceB = b.variants?.[0]?.price ?? 0;
      return priceA - priceB;
    });
  } else if (sort === 'price-desc') {
    products.sort((a, b) => {
      const priceA = a.variants?.[0]?.price ?? 0;
      const priceB = b.variants?.[0]?.price ?? 0;
      return priceB - priceA;
    });
  } else {
    // newest
    products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  const categoryTitle = activeCategory ? CATEGORY_LABELS[activeCategory] : 'ALL DROPS & GRAILS';

  return (
    <div style={{ minHeight: '100vh', background: '#0D0D0D' }}>
      {/* ─── Editorial Header Banner ─── */}
      <div
        style={{
          background: 'linear-gradient(180deg, #16161A 0%, #0D0D0D 100%)',
          borderBottom: '1px solid #1E1E22',
          padding: 'clamp(2rem, 5vw, 3.5rem) 0 clamp(1.25rem, 3vw, 2rem)',
        }}
      >
        <div className="container-wy">
          <div style={{ width: '36px', height: '3px', background: 'var(--wy-yellow)', marginBottom: '0.65rem' }} />
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.1rem, 5vw, 3.75rem)',
              color: '#FFFFFF',
              letterSpacing: '0.04em',
              lineHeight: 1.05,
              marginBottom: '0.45rem',
              textTransform: 'uppercase',
            }}
          >
            {categoryTitle}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--wy-yellow)', fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {products.length} {products.length === 1 ? 'Product' : 'Products'} Available
            </span>
            <span style={{ color: '#52525B' }}>•</span>
            <span style={{ color: '#A1A1AA', fontSize: '0.82rem' }}>
              Authentic Streetwear & Luxury Pieces
            </span>
          </div>
        </div>
      </div>

      {/* ─── Main Shop Content ─── */}
      <div className="container-wy" style={{ padding: 'clamp(1rem, 3vw, 2.5rem) clamp(1rem, 3vw, 2rem) 5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="lg:flex-row lg:items-start lg:gap-8">
          {/* Filters (Desktop Sidebar + Mobile Top Controls) */}
          <ShopFilters />

          {/* Products Grid Area */}
          <div style={{ flex: 1, minWidth: 0, width: '100%' }}>
            {error && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '12px',
                  padding: '1rem',
                  color: '#EF4444',
                  fontSize: '0.85rem',
                  marginBottom: '1.5rem',
                }}
              >
                Failed to load products. Please refresh and try again.
              </div>
            )}

            {!products.length && !error ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '4.5rem 1.5rem',
                  background: '#121215',
                  border: '1px solid #27272A',
                  borderRadius: '16px',
                  color: '#71717A',
                }}
              >
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 1rem', color: '#52525B' }}>
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#FFFFFF', letterSpacing: '0.04em', margin: '0 0 0.4rem' }}>
                  {query ? `No items found for "${query}"` : 'No products found in this section'}
                </p>
                <p style={{ fontSize: '0.82rem', color: '#A1A1AA', margin: '0 0 1.25rem' }}>
                  {query ? 'Check your spelling or reset filters to browse full catalog.' : 'Check back soon or explore our other collections.'}
                </p>
                <Link
                  href="/shop"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.6rem 1.25rem',
                    borderRadius: '8px',
                    background: 'var(--wy-yellow)',
                    color: '#000000',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                  }}
                >
                  View All Drops
                </Link>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 'clamp(0.6rem, 2vw, 1.25rem)',
                }}
                className="md:grid-cols-3 xl:grid-cols-4"
              >
                {products.map((product) => (
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
