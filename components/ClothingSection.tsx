'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, ArrowRight, Sparkles, SlidersHorizontal } from 'lucide-react';
import { useCartContext } from '@/context/CartContext';
import type { CartItem, Product } from '@/types/ecommerce';

interface ClothingSectionProps {
  products: Product[];
}

type ClothingFilter = 'all' | 'hoodie' | 'jeans' | 'tops';

export default function ClothingSection({ products }: ClothingSectionProps) {
  const { addToCart } = useCartContext();
  const [activeFilter, setActiveFilter] = useState<ClothingFilter>('all');
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  // Filter only clothing products
  const clothingProducts = products.filter((p) => p.category === 'clothing');

  // Sub-filter matching
  const filteredProducts = clothingProducts.filter((product) => {
    if (activeFilter === 'all') return true;

    // Check variant attributes or title keywords
    const variantType = product.variants?.[0]?.attributes?.clothing_type;
    if (variantType === activeFilter) return true;

    const titleLower = product.title.toLowerCase();
    const slugLower = product.slug.toLowerCase();

    if (activeFilter === 'hoodie') {
      return titleLower.includes('hoodie') || titleLower.includes('sweat') || slugLower.includes('hoodie');
    }
    if (activeFilter === 'jeans') {
      return (
        titleLower.includes('jean') ||
        titleLower.includes('pant') ||
        titleLower.includes('cargo') ||
        titleLower.includes('denim') ||
        slugLower.includes('pant') ||
        slugLower.includes('jean')
      );
    }
    if (activeFilter === 'tops') {
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
      attributes: product.variants?.[0]?.attributes || { size: 'OS', color: 'Default' },
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

  const filterTabs: { id: ClothingFilter; label: string; count: number }[] = [
    {
      id: 'all',
      label: 'ALL CLOTHING',
      count: clothingProducts.length,
    },
    {
      id: 'hoodie',
      label: 'HOODIES & SWEATS',
      count: clothingProducts.filter(
        (p) =>
          p.variants?.[0]?.attributes?.clothing_type === 'hoodie' ||
          p.title.toLowerCase().includes('hoodie') ||
          p.title.toLowerCase().includes('sweat')
      ).length,
    },
    {
      id: 'jeans',
      label: 'JEANS & PANTS',
      count: clothingProducts.filter(
        (p) =>
          p.variants?.[0]?.attributes?.clothing_type === 'jeans' ||
          p.title.toLowerCase().includes('jean') ||
          p.title.toLowerCase().includes('pant') ||
          p.title.toLowerCase().includes('cargo') ||
          p.title.toLowerCase().includes('denim')
      ).length,
    },
    {
      id: 'tops',
      label: 'TEES & TOPS',
      count: clothingProducts.filter(
        (p) =>
          p.variants?.[0]?.attributes?.clothing_type === 'tops' ||
          p.title.toLowerCase().includes('tee') ||
          p.title.toLowerCase().includes('top') ||
          p.title.toLowerCase().includes('shirt')
      ).length,
    },
  ];

  if (clothingProducts.length === 0) return null;

  return (
    <section style={{ background: '#0D0D0D', padding: '5rem 0', borderTop: '1px solid #1E1E22' }}>
      <div className="container-wy">

        {/* Section Header with Category Label */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#FFC800',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
            }}>
              <Sparkles size={13} />
              <span>Apparel Capsule</span>
            </div>

            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
              color: '#FFFFFF',
              letterSpacing: '0.04em',
              lineHeight: 1.05,
            }}>
              CLOTHING & STREETWEAR
            </h2>
            <p style={{ color: '#A1A1AA', fontSize: '0.9rem', marginTop: '0.4rem', maxWidth: '600px' }}>
              Heavyweight hoodies, custom vintage washes, and raw selvedge denim in one unified drop.
            </p>
          </div>

          {/* Subcategory Filter Pills */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap',
            width: '100%',
            paddingTop: '0.5rem',
          }}>
            {filterTabs.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 1.15rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    background: isActive ? '#FFC800' : '#141416',
                    color: isActive ? '#000000' : '#A1A1AA',
                    border: isActive ? '1px solid #FFC800' : '1px solid #27272A',
                    boxShadow: isActive ? '0 0 16px rgba(255, 200, 0, 0.3)' : 'none',
                  }}
                >
                  <span>{tab.label}</span>
                  <span style={{
                    fontSize: '0.65rem',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '999px',
                    background: isActive ? 'rgba(0,0,0,0.2)' : '#27272A',
                    color: isActive ? '#000000' : '#71717A',
                    fontWeight: 800,
                  }}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid */}
        <motion.div
          layout
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.75rem',
          }}
        >
          <AnimatePresence>
            {filteredProducts.map((product) => {
              const isWishlisted = wishlist.has(product.id);
              const isAdded = addedItems.has(product.id);
              const price = product.variants?.[0]?.price || 0;
              const subType = product.variants?.[0]?.attributes?.clothing_type || 'clothing';

              const badgeLabel =
                subType === 'hoodie'
                  ? 'HOODIE'
                  : subType === 'jeans'
                  ? 'JEANS / PANTS'
                  : subType === 'tops'
                  ? 'TOPS & TEES'
                  : 'CLOTHING';

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  key={product.id}
                  style={{
                    background: '#141416',
                    borderRadius: '16px',
                    border: '1px solid #27272A',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                    transition: 'border-color 0.2s, transform 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 200, 0, 0.4)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#27272A';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Image Container with Badge */}
                  <Link
                    href={`/shop/${product.slug}`}
                    style={{
                      position: 'relative',
                      aspectRatio: '4/5',
                      overflow: 'hidden',
                      background: '#080808',
                      display: 'block',
                    }}
                  >
                    <Image
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1000&q=80'}
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: 'cover', objectPosition: 'center', transition: 'transform 0.5s ease' }}
                    />

                    {/* Subcategory Pill Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      zIndex: 10,
                      background: '#FFC800',
                      color: '#000000',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.7rem',
                      letterSpacing: '0.08em',
                      fontWeight: 700,
                    }}>
                      {badgeLabel}
                    </div>

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        zIndex: 10,
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(4px)',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isWishlisted ? '#FFC800' : '#FFFFFF',
                        cursor: 'pointer',
                      }}
                    >
                      <Heart size={15} fill={isWishlisted ? '#FFC800' : 'none'} />
                    </button>
                  </Link>

                  {/* Product Details & Actions */}
                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      <Link href={`/shop/${product.slug}`}>
                        <h3 style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.15rem',
                          color: '#FFFFFF',
                          letterSpacing: '0.03em',
                          lineHeight: 1.2,
                          marginBottom: '0.35rem',
                        }}>
                          {product.title}
                        </h3>
                      </Link>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#FFC800' }}>
                        GH₵ {price.toLocaleString()}
                      </div>
                    </div>

                    {/* Quick Add Button */}
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(product)}
                      disabled={isAdded}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        background: isAdded ? '#10b981' : '#FFC800',
                        color: isAdded ? '#FFFFFF' : '#000000',
                        border: 'none',
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.85rem',
                        letterSpacing: '0.06em',
                        cursor: isAdded ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        transition: 'background 0.2s',
                      }}
                    >
                      <ShoppingBag size={14} />
                      <span>{isAdded ? 'ADDED TO BAG' : '+ QUICK ADD'}</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
