import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Product } from '@/types/ecommerce';
import ProductDetailView from '@/components/ProductDetailView';

export const runtime = 'edge';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from('products')
    .select('title, description, category, images')
    .eq('slug', slug)
    .single();

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const p = product as Product;
  return {
    title: `${p.title} — WEAR YUNG`,
    description: p.description || `Shop ${p.title} in ${p.category} at WEAR YUNG. Authentic streetwear & premium accessories.`,
    openGraph: {
      title: `${p.title} | WEAR YUNG`,
      description: p.description || `Shop ${p.title} at WEAR YUNG.`,
      images: p.images?.[0] ? [{ url: p.images[0] }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from('products')
    .select('*, variants:product_variants(*)')
    .eq('slug', slug)
    .single();

  if (!product) {
    notFound();
  }

  const p = product as Product;

  return (
    <div style={{ background: 'var(--wy-canvas)', minHeight: '100vh', paddingBottom: '5rem' }}>
      <div className="container-wy" style={{ padding: '2.5rem 1.5rem' }}>
        {/* Breadcrumbs Navigation */}
        <nav
          aria-label="Breadcrumb"
          style={{
            display: 'flex',
            gap: '0.6rem',
            alignItems: 'center',
            marginBottom: '2.5rem',
            fontSize: '0.85rem',
            color: 'var(--wy-muted)',
            flexWrap: 'wrap',
          }}
        >
          <Link href="/" style={{ color: 'var(--wy-muted)', textDecoration: 'none' }}>
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" style={{ color: 'var(--wy-muted)', textDecoration: 'none' }}>
            Shop
          </Link>
          <span>/</span>
          <Link
            href={`/shop?category=${p.category}`}
            style={{
              color: 'var(--wy-muted)',
              textDecoration: 'none',
              textTransform: 'capitalize',
            }}
          >
            {p.category}
          </Link>
          <span>/</span>
          <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{p.title}</span>
        </nav>

        {/* Modular Product Detail View */}
        <ProductDetailView product={p} />
      </div>
    </div>
  );
}
