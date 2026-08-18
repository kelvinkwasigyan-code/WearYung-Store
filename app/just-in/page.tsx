import type { Metadata } from 'next';
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';
import ShopFilters from '@/components/ShopFilters';
import { getProducts } from '@/lib/supabase/products';
import { ALL_CATEGORIES, CATEGORY_LABELS, type Product, type ProductCategory } from '@/types/ecommerce';
import { Sparkles, Flame, Clock, ArrowLeft, PackageCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Just In — New Drops & Arrivals | WEAR YUNG',
  description: 'Explore the latest streetwear drops, fresh sneaker releases, luxury watches, and exclusive apparel just added to WEAR YUNG.',
};

interface JustInPageProps {
  searchParams: Promise<{ category?: string; q?: string; minPrice?: string; maxPrice?: string; sort?: string }>;
}

export default async function JustInPage({ searchParams }: JustInPageProps) {
  const params = await searchParams;
  const activeCategory = params.category as ProductCategory | undefined;
  const query = (params.q ?? '').toLowerCase().trim();
  const minPrice = params.minPrice ? parseFloat(params.minPrice) : null;
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : null;
  const sort = params.sort ?? 'newest';

  const allProducts = await getProducts();
  let products = [...allProducts];

  // Category Filtering
  if (activeCategory) {
    products = products.filter((p) => p.category === activeCategory);
  }

  // Search Query Filtering
  if (query) {
    products = products.filter((p) => {
      const t = p.title.toLowerCase();
      const desc = (p.description || '').toLowerCase();
      const cat = p.category.toLowerCase();
      const attrs = (p.variants?.[0]?.attributes as any) || {};
      const clothingType = (attrs.clothing_type || '').toLowerCase();
      const color = (attrs.color || '').toLowerCase();
      return (
        t.includes(query) ||
        desc.includes(query) ||
        cat.includes(query) ||
        clothingType.includes(query) ||
        color.includes(query)
      );
    });
  }

  // Price Range Filtering
  if (minPrice !== null || maxPrice !== null) {
    products = products.filter((product) => {
      if (!product.variants || product.variants.length === 0) return false;
      const price = product.variants[0].price;
      if (minPrice !== null && price < minPrice) return false;
      if (maxPrice !== null && price > maxPrice) return false;
      return true;
    });
  }

  // Sorting
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
    // default: newest first
    products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  return (
    <div style={{ minHeight: '100vh', background: '#09090B' }}>
      {/* ─── Editorial Hero Banner ─── */}
      <div
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255, 200, 0, 0.15), transparent 70%), linear-gradient(180deg, #121216 0%, #09090B 100%)',
          borderBottom: '1px solid #1E1E24',
          padding: 'clamp(2.5rem, 6vw, 4.5rem) 0 clamp(1.5rem, 4vw, 2.5rem)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container-wy">
          {/* Breadcrumb / Back Link */}
          <div style={{ marginBottom: '1.25rem' }}>
            <Link
              href="/shop"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.78rem',
                color: '#A1A1AA',
                textDecoration: 'none',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                transition: 'color 0.15s ease',
              }}
            >
              <ArrowLeft size={14} /> Back to Catalog
            </Link>
          </div>

          {/* Glowing Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 200, 0, 0.12)', border: '1px solid rgba(255, 200, 0, 0.35)', padding: '4px 12px', borderRadius: '20px', marginBottom: '1rem' }}>
            <Sparkles size={14} style={{ color: '#FFC800' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#FFC800', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              JUST IN • NEW ARRIVALS
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              color: '#FFFFFF',
              letterSpacing: '0.04em',
              lineHeight: 1.05,
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
            }}
          >
            LATEST DROPS & ARRIVALS
          </h1>

          <p style={{ color: '#A1A1AA', fontSize: 'clamp(0.88rem, 2vw, 1.05rem)', maxWidth: '640px', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Discover the freshest streetwear pieces, rare footwear, and luxury accessories recently cataloged into the WEAR YUNG vault.
          </p>

          {/* Quick Metrics Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#FFC800', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <PackageCheck size={16} />
              <span>{products.length} New Drop{products.length === 1 ? '' : 's'}</span>
            </div>
            <span style={{ color: '#3F3F46' }}>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10B981', fontWeight: 700, fontSize: '0.85rem' }}>
              <Clock size={16} />
              <span>Sorted by Drop Date (Latest First)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Just In Content ─── */}
      <div className="container-wy" style={{ padding: '2rem 0 5rem' }}>
        {/* Category Pills & Quick Switcher */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1.5rem', scrollbarWidth: 'none' }}>
          <Link
            href="/just-in"
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 700,
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              whiteSpace: 'nowrap',
              background: !activeCategory ? '#FFC800' : '#18181C',
              color: !activeCategory ? '#000000' : '#A1A1AA',
              border: !activeCategory ? '1px solid #FFC800' : '1px solid #27272A',
              transition: 'all 0.15s ease',
            }}
          >
            All Drops
          </Link>

          {ALL_CATEGORIES.map((cat) => {
            const isCatActive = activeCategory === cat;
            return (
              <Link
                key={cat}
                href={`/just-in?category=${cat}`}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  whiteSpace: 'nowrap',
                  background: isCatActive ? '#FFC800' : '#18181C',
                  color: isCatActive ? '#000000' : '#A1A1AA',
                  border: isCatActive ? '1px solid #FFC800' : '1px solid #27272A',
                  transition: 'all 0.15s ease',
                }}
              >
                {CATEGORY_LABELS[cat as ProductCategory]}
              </Link>
            );
          })}
        </div>

        {/* Filter Controls Bar */}
        <ShopFilters
          totalProducts={products.length}
          activeCategory={activeCategory}
          currentSort={sort}
        />

        {/* Products Grid */}
        {products.length === 0 ? (
          <div
            style={{
              padding: '5rem 1.5rem',
              textAlign: 'center',
              background: '#121216',
              border: '1px solid #27272A',
              borderRadius: '16px',
              marginTop: '1.5rem',
            }}
          >
            <Sparkles size={40} style={{ color: '#FFC800', margin: '0 auto 1rem', opacity: 0.8 }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: '#FFFFFF', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
              NO RECENT DROPS FOUND
            </h3>
            <p style={{ color: '#A1A1AA', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
              We couldn't find any newly added items matching your filter criteria. Check back soon for the next drop.
            </p>
            <Link
              href="/shop"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#FFC800',
                color: '#000000',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontFamily: 'var(--font-display)',
                fontSize: '0.95rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textDecoration: 'none',
              }}
            >
              Browse Full Catalog
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 'clamp(0.75rem, 2vw, 1.25rem)',
              marginTop: '1.5rem',
            }}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
