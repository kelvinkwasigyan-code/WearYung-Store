'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { useCartContext } from '@/context/CartContext';
import type { CartItem, Product } from '@/types/ecommerce';

interface UnifiedProductShowcaseProps {
  products: Product[];
}

type MainCategory = 'all' | 'clothing' | 'sneakers' | 'watches' | 'bags';
type ClothingSubFilter = 'all' | 'hoodie' | 'jeans' | 'tops';

export default function UnifiedProductShowcase({ products }: UnifiedProductShowcaseProps) {
  const { addToCart } = useCartContext();
  const [selectedCategory, setSelectedCategory] = useState<MainCategory>('all');
  const [selectedClothingSub, setSelectedClothingSub] = useState<ClothingSubFilter>('all');
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  // Filter products based on selected main category & clothing subcategory
  const displayedProducts = products.filter((product) => {
    // 1. Filter by main category
    if (selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false;
    }

    // 2. If viewing clothing (or all with clothing active filter), apply clothing subcategory
    if (selectedCategory === 'clothing' && selectedClothingSub !== 'all') {
      const variantType = (product.variants?.[0]?.attributes as any)?.clothing_type;
      if (variantType === selectedClothingSub) return true;

      const titleLower = product.title.toLowerCase();
      const slugLower = product.slug.toLowerCase();

      if (selectedClothingSub === 'hoodie') {
        return titleLower.includes('hoodie') || titleLower.includes('sweat') || slugLower.includes('hoodie');
      }
      if (selectedClothingSub === 'jeans') {
        return (
          titleLower.includes('jean') ||
          titleLower.includes('pant') ||
          titleLower.includes('cargo') ||
          titleLower.includes('denim') ||
          slugLower.includes('pant') ||
          slugLower.includes('jean')
        );
      }
      if (selectedClothingSub === 'tops') {
        return (
          titleLower.includes('tee') ||
          titleLower.includes('top') ||
          titleLower.includes('shirt') ||
          slugLower.includes('tee') ||
          slugLower.includes('top')
        );
      }
      return false;
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

  const mainCategories: { id: MainCategory; label: string; count: number }[] = [
    { id: 'all', label: 'ALL DROPS', count: products.length },
    { id: 'clothing', label: 'CLOTHING', count: products.filter((p) => p.category === 'clothing').length },
    { id: 'sneakers', label: 'SNEAKERS', count: products.filter((p) => p.category === 'sneakers').length },
    { id: 'watches', label: 'WATCHES', count: products.filter((p) => p.category === 'watches').length },
    { id: 'bags', label: 'BAGS', count: products.filter((p) => p.category === 'bags').length },
  ];

  const clothingSubFilters: { id: ClothingSubFilter; label: string }[] = [
    { id: 'all', label: 'All Clothing' },
    { id: 'hoodie', label: 'Hoodies & Sweats' },
    { id: 'jeans', label: 'Jeans & Pants' },
    { id: 'tops', label: 'Tees & Tops' },
  ];

  return (
    <section style={{ background: '#0D0D0D', padding: '5.5rem 0', borderTop: '1px solid #1E1E22' }}>
      <div className="container-wy">

        {/* Section Header */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1.75rem',
          marginBottom: '3rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%', flexWrap: 'wrap', gap: '1rem' }}>
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
                <span>Curated Catalog</span>
              </div>

              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
                color: '#FFFFFF',
                letterSpacing: '0.04em',
                lineHeight: 1.05,
              }}>
                EXPLORE ALL RELEASES
              </h2>
            </div>

            <Link
              href="/shop"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontFamily: 'var(--font-display)',
                fontSize: '0.9rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#FFC800',
                textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
            >
              <span>View Full Store Catalog</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Primary Category Navigation Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            flexWrap: 'wrap',
            width: '100%',
            paddingBottom: selectedCategory === 'clothing' ? '0.5rem' : '0',
            borderBottom: selectedCategory === 'clothing' ? '1px solid #1E1E22' : 'none',
          }}>
            {mainCategories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    if (cat.id !== 'clothing') {
                      setSelectedClothingSub('all');
                    }
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 1.25rem',
                    borderRadius: '10px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    background: isSelected ? '#FFC800' : '#141416',
                    color: isSelected ? '#000000' : '#A1A1AA',
                    border: isSelected ? '1px solid #FFC800' : '1px solid #27272A',
                    boxShadow: isSelected ? '0 0 16px rgba(255, 200, 0, 0.25)' : 'none',
                  }}
                >
                  <span>{cat.label}</span>
                  <span style={{
                    fontSize: '0.68rem',
                    padding: '0.1rem 0.45rem',
                    borderRadius: '999px',
                    background: isSelected ? 'rgba(0,0,0,0.25)' : '#222226',
                    color: isSelected ? '#000000' : '#71717A',
                    fontWeight: 800,
                  }}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Clothing Sub-Filter Bar (Active when CLOTHING is chosen) */}
          <AnimatePresence>
            {selectedCategory === 'clothing' && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  flexWrap: 'wrap',
                  width: '100%',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#FFC800',
                  marginRight: '0.5rem',
                }}>
                  <Filter size={13} />
                  <span>Filter Clothing:</span>
                </div>

                {clothingSubFilters.map((sub) => {
                  const isSubActive = selectedClothingSub === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedClothingSub(sub.id)}
                      style={{
                        padding: '0.45rem 1rem',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: isSubActive ? 700 : 500,
                        letterSpacing: '0.06em',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        background: isSubActive ? '#FFC800' : '#1A1A1E',
                        color: isSubActive ? '#000000' : '#D4D4D8',
                        border: isSubActive ? '1px solid #FFC800' : '1px solid #3F3F46',
                      }}
                    >
                      {sub.label}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Unified Product Cards Grid */}
        <motion.div
          layout
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.75rem',
          }}
        >
          <AnimatePresence>
            {displayedProducts.length === 0 ? (
              <div style={{
                gridColumn: '1 / -1',
                padding: '4rem 1rem',
                textAlign: 'center',
                color: '#71717A',
                background: '#141416',
                borderRadius: '16px',
                border: '1px solid #27272A',
              }}>
                <ShoppingBag size={36} color="#52525B" style={{ margin: '0 auto 1rem' }} />
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#FFFFFF', letterSpacing: '0.04em' }}>
                  No items found in this section
                </p>
                <p style={{ fontSize: '0.8rem', color: '#71717A', marginTop: '0.25rem' }}>
                  Try switching filters or check back for the next drop.
                </p>
              </div>
            ) : (
              displayedProducts.map((product) => {
                const isWishlisted = wishlist.has(product.id);
                const isAdded = addedItems.has(product.id);
                const price = product.variants?.[0]?.price || 0;
                const subType = (product.variants?.[0]?.attributes as any)?.clothing_type;

                // Category badge text
                let badgeText = product.category.toUpperCase();
                if (product.category === 'clothing') {
                  if (subType === 'hoodie' || product.title.toLowerCase().includes('hoodie')) {
                    badgeText = 'HOODIE';
                  } else if (subType === 'jeans' || product.title.toLowerCase().includes('jeans') || product.title.toLowerCase().includes('pants') || product.title.toLowerCase().includes('cargo')) {
                    badgeText = 'JEANS & PANTS';
                  } else if (subType === 'tops' || product.title.toLowerCase().includes('tee') || product.title.toLowerCase().includes('top')) {
                    badgeText = 'TEES & TOPS';
                  }
                }

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
                    {/* Image Container */}
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

                      {/* Category / Subtype Badge */}
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
                        {badgeText}
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
              })
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
