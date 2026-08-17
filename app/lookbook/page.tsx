import type { Metadata } from 'next';
import LookbookView from '@/components/LookbookView';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'Lookbook — Volume 01 Editorial',
  description: 'Explore the WEAR YUNG Autumn/Winter 2026 Editorial. Curated looks, street styling, and direct outfit shopping.',
};

export default function LookbookPage() {
  return <LookbookView />;
}
