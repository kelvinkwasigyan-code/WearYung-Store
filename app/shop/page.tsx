import { getProducts } from '@/lib/supabase/products';
import ProductCard from '@/components/ui/ProductCard';
import ShopFilters from '@/components/ShopFilters';
import { ALL_CATEGORIES, CATEGORY_LABELS, type Product, type ProductCategory } from '@/types/ecommerce';

export const metadata = {
  title: 'Shop All Products',
  description: 'Browse all WEAR YUNG products — clothing, sneakers, watches, bags, perfumes, accessories and slides.',
};

interface ShopPageProps {
  searchParams: Promise<{ category?: string; sub?: string; q?: string; minPrice?: string; maxPrice?: string; sort?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const activeCategory = params.category as ProductCategory | undefined;
  const activeSub = params.sub || '';
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

  let { data: rawProducts } = await dbQuery;
  
  let products: Product[] = [];

  if (rawProducts && rawProducts.length > 0) {
    products = rawProducts as Product[];
  } else {
    // Use fallback catalog
    products = await getProducts({ category: activeCategory });
    if (query) {
      products = products.filter(p => p.title.toLowerCase().includes(query.toLowerCase()));
    }
  }

  // Clothing Subcategory Filter
  if (activeSub && (activeCategory === 'clothing' || !activeCategory)) {
    products = products.filter((product) => {
      if (product.category !== 'clothing') return false;
      const variantType = product.variants?.[0]?.attributes?.clothing_type;
      if (variantType === activeSub) return true;

      const titleLower = product.title.toLowerCase();
      const slugLower = product.slug.toLowerCase();

      if (activeSub === 'hoodie') {
        return titleLower.includes('hoodie') || titleLower.includes('sweat') || slugLower.includes('hoodie');
      }
      if (activeSub === 'jeans') {
        return (
          titleLower.includes('jean') ||
          titleLower.includes('pant') ||
          titleLower.includes('cargo') ||
          titleLower.includes('denim') ||
          slugLower.includes('pant') ||
          slugLower.includes('jean')
        );
      }
      if (activeSub === 'tops') {
        return (
          titleLower.includes('tee') ||
          titleLower.includes('top') ||
          titleLower.includes('shirt') ||
          slugLower.includes('tee') ||
          slugLower.includes('top')
        );
      }
      return true;
    });
  }

  // In-memory Price Filtering (since price is in nested variants JSON)
  if (minPrice !== null || maxPrice !== null) {
    products = products.filter(product => {
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
    // 'newest' (already sorted by DB, but we can enforce it just in case)
    products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
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
          {/* Sidebar: Filters & Search */}
          <ShopFilters />

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
                {products.map(product => (
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
