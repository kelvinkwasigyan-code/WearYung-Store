import type { Metadata } from 'next';
import WishlistClient from '@/components/wishlist/WishlistClient';

export const metadata: Metadata = {
  title: 'My Wishlist — WEAR YUNG',
  description: 'View your saved streetwear pieces, sneakers, and luxury accessories at WEAR YUNG.',
};

export default function WishlistPage() {
  return <WishlistView />;
}
