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
import ClothingSection from '@/components/ClothingSection';

export default async function HomePage() {
  const allProducts = await getProducts();
  const featuredDrops = allProducts.slice(0, 4);

  return (
    <div>
      <HeroSection />
      <CategoryGrid />
      <ClothingSection products={allProducts} />
      <FeaturedProducts products={featuredDrops} />
      <ProductGrid />
      <ValueProps />
      <CallToActionBanner />
    </div>
  );
}
