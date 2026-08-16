import type { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';
import CategoryGrid from '@/components/CategoryGrid';
import AnnouncementMarquee from '@/components/AnnouncementMarquee';
import UnifiedProductShowcase from '@/components/UnifiedProductShowcase';
import ValueProps from '@/components/ValueProps';
import CallToActionBanner from '@/components/CallToActionBanner';

export const metadata: Metadata = {
  title: 'WEAR YUNG — Premium Streetwear & Accessories',
  description: 'Shop the latest drops in streetwear, sneakers, watches, bags and accessories.',
};

import { getProducts } from '@/lib/supabase/products';

export default async function HomePage() {
  const allProducts = await getProducts();

  return (
    <div>
      <HeroSection />
      <CategoryGrid />
      <AnnouncementMarquee />
      <UnifiedProductShowcase products={allProducts} />
      <ValueProps />
      <CallToActionBanner />
    </div>
  );
}
