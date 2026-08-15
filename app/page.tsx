import type { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';
import CategoryGrid from '@/components/CategoryGrid';
import FeaturedProducts from '@/components/FeaturedProducts';
import ProductGrid from '@/components/ProductGrid';
import ValueProps from '@/components/ValueProps';
import CallToActionBanner from '@/components/CallToActionBanner';

export const metadata: Metadata = {
  title: 'WEAR YUNG — Premium Streetwear & Accessories',
  description: 'Shop the latest drops in streetwear, sneakers, watches, bags and accessories.',
};

import { getProducts } from '@/lib/supabase/products';

export default async function HomePage() {
  const products = await getProducts({ limit: 4 });

  return (
    <div>
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts products={products} />
      <ProductGrid />
      <ValueProps />
      <CallToActionBanner />
    </div>
  );
}
