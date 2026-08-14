import type { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';
import CategoryGrid from '@/components/CategoryGrid';
import ValueProps from '@/components/ValueProps';
import CallToActionBanner from '@/components/CallToActionBanner';

export const metadata: Metadata = {
  title: 'WEAR YUNG — Premium Streetwear & Accessories',
  description: 'Shop the latest drops in streetwear, sneakers, watches, bags and accessories.',
};

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <CategoryGrid />
      <ValueProps />
      <CallToActionBanner />
    </div>
  );
}
