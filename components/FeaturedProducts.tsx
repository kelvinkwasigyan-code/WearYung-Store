'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, ArrowRight, Star } from 'lucide-react';
import { useCartContext } from '@/context/CartContext';
import type { CartItem, Product } from '@/types/ecommerce';

export default function FeaturedProducts({ products }: { products: Product[] }) {
  const { addToCart } = useCartContext();
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleQuickAdd = (product: Product) => {
    const item: CartItem = {
      variantId: product.variants?.[0]?.id || `${product.id}-default`,
      productId: product.id,
      productTitle: product.title,
      productSlug: product.slug,
      productImage: product.images?.[0] || '',
      sku: product.variants?.[0]?.sku || `SKU-${product.id}`,
      price: product.variants?.[0]?.price || 0,
      quantity: 1,
      attributes: product.variants?.[0]?.attributes || { size: 'OS', color: 'Default' } as any,
    };
    addToCart(item);

    setAddedItems((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedItems((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 2000);
  };

  return (
    <section className="section-wy">
      <div className="container-wy">
        {/* Section Header */}
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-2 h-1 w-12 bg-[#FFC800]"></div>
            <h2 className="font-display text-3xl tracking-wide text-white md:text-4xl uppercase">
              LATEST DROPS
            </h2>
            <p className="mt-2 text-zinc-400">
              Engineered for the streets. Limited quantities per release.
            </p>
          </div>
          <Link
            href="/shop"
            className="group flex items-center gap-2 font-display text-sm uppercase tracking-widest text-white transition-colors hover:text-[#FFC800]"
          >
            View All Products
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => {
            const isWishlisted = wishlist.has(product.id);
            const isAdded = addedItems.has(product.id);

            return (
              <div
                key={product.id}
                className="group relative flex flex-col transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#0D0D0D]">
                  <Image
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1000&q=80'}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                  />
                  
                  {/* Overlay Gradient (for text readability if needed) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Badges */}
                  {/* Note: badge field is not in schema natively, we'll mock it if not present */}
                  <div className="absolute left-3 top-3 z-10 rounded-full bg-black/70 backdrop-blur-md px-3 py-1 font-display text-[10px] font-bold uppercase tracking-widest text-[#FFC800]">
                    HOT DROP
                  </div>

                  {/* Wishlist Toggle */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black"
                  >
                    <Heart
                      size={16}
                      fill={isWishlisted ? '#FFC800' : 'none'}
                      className={isWishlisted ? 'text-[#FFC800]' : ''}
                    />
                  </button>

                  {/* Quick Add Button (Slide up on hover) */}
                  <div className="absolute bottom-4 left-4 right-4 z-20 translate-y-8 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                    <button
                      onClick={() => handleQuickAdd(product)}
                      disabled={isAdded}
                      className={`w-full rounded-xl py-3 text-center font-display text-sm font-bold uppercase tracking-wider transition-colors duration-300 shadow-xl ${
                        isAdded
                          ? 'bg-green-500 text-black'
                          : 'bg-[#FFC800] text-black hover:bg-yellow-400'
                      }`}
                    >
                      {isAdded ? 'Added to Bag' : 'Quick Add +'}
                    </button>
                  </div>
                </div>
                {/* Unboxed Content */}
                <div className="flex flex-col pt-4 pb-2">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">
                      {product.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star size={10} className="text-[#FFC800]" fill="currentColor" />
                      <span className="text-[11px] font-semibold text-zinc-400">
                        {product.average_rating ? product.average_rating.toFixed(1) : '5.0'}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="mb-1 truncate font-display text-base tracking-wide text-white transition-colors group-hover:text-[#FFC800]">
                    {product.title}
                  </h3>

                  <div className="flex items-center gap-2">
                    <span className="font-display text-lg font-bold tracking-wide text-white">
                      GH₵ {product.variants?.[0]?.price ? product.variants[0].price.toLocaleString() : '0'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
