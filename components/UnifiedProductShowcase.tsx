'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, ArrowRight, Filter, Search, X } from 'lucide-react';
import { useCartContext } from '@/context/CartContext';
import type { CartItem, Product } from '@/types/ecommerce';

interface UnifiedProductShowcaseProps {
  products: Product[];
}

type MainCategory = 'all' | 'clothing' | 'sneakers' | 'watches' | 'bags' | 'perfumes' | 'accessories' | 'slides';
type ClothingPrimaryGroup = 'all' | 'tops_sleeves' | 'jeans_pants' | 'hoodie';
type TopsSleevesSub = 'all' | 'tops' | 'sleeves';
type JeansSub = 'all' | 'baggy' | 'slim';

export default function UnifiedProductShowcase({ products }: UnifiedProductShowcaseProps) {
  const { addToCart, items } = useCartContext();
  const [selectedCategory, setSelectedCategory] = useState<MainCategory>('all');
  const [selectedClothingGroup, setSelectedClothingGroup] = useState<ClothingPrimaryGroup>('all');
  const [selectedTopsSub, setSelectedTopsSub] = useState<TopsSleevesSub>('all');
  const [selectedJeansSub, setSelectedJeansSub] = useState<JeansSub>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  // Filter products based on selected main category, subcategory & search query
  const displayedProducts = products.filter((product) => {
    // 1. Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const attrs = (product.variants?.[0]?.attributes as any) || {};
      const clothingType = (attrs.clothing_type || '').toLowerCase();
      const sleeveType = (attrs.sleeve_type || '').toLowerCase();
      const fit = (attrs.fit || '').toLowerCase();
      const t = product.title.toLowerCase();
      const slug = product.slug.toLowerCase();
      const desc = (product.description || '').toLowerCase();
      const cat = product.category.toLowerCase();

      const matches =
        t.includes(q) ||
        slug.includes(q) ||
        desc.includes(q) ||
        cat.includes(q) ||
        clothingType.includes(q) ||
        sleeveType.includes(q) ||
        fit.includes(q);

      if (!matches) return false;
    }

    // 2. Filter by main category
    if (selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false;
    }

    // 3. Clothing sub-filters
    if (selectedCategory === 'clothing') {
      const attrs = (product.variants?.[0]?.attributes as any) || {};
      const cType = (attrs.clothing_type || '').toLowerCase();
      const sType = (attrs.sleeve_type || '').toLowerCase();
      const fit = (attrs.fit || '').toLowerCase();

      if (selectedClothingGroup === 'tops_sleeves') {
        if (cType !== 'tops_sleeves' && cType !== 'top' && cType !== 'tops' && cType !== 'tshirt' && cType !== 'shirt') {
          return false;
        }
        if (selectedTopsSub === 'tops' && sType === 'sleeves') return false;
        if (selectedTopsSub === 'sleeves' && sType !== 'sleeves') return false;
      } else if (selectedClothingGroup === 'jeans_pants') {
        if (cType !== 'jeans_pants' && cType !== 'jeans' && cType !== 'pants' && cType !== 'trousers') {
          return false;
        }
        if (selectedJeansSub === 'baggy' && fit !== 'baggy') return false;
        if (selectedJeansSub === 'slim' && fit !== 'slim') return false;
      } else if (selectedClothingGroup === 'hoodie') {
        if (cType !== 'hoodie' && cType !== 'sweatshirt' && cType !== 'sweater' && !product.title.toLowerCase().includes('hoodie')) {
          return false;
        }
      }
    }

    return true;
  });

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
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
    { id: 'perfumes', label: 'PERFUMES', count: products.filter((p) => p.category === 'perfumes').length },
    { id: 'accessories', label: 'ACCESSORIES', count: products.filter((p) => p.category === 'accessories').length },
    { id: 'slides', label: 'SLIDES', count: products.filter((p) => p.category === 'slides').length },
  ];

  const clothingPrimaryFilters: { id: ClothingPrimaryGroup; label: string }[] = [
    { id: 'all', label: 'All Clothing' },
    { id: 'tops_sleeves', label: 'Tops & Sleeves' },
    { id: 'jeans_pants', label: 'Jeans & Pants' },
    { id: 'hoodie', label: 'Hoodies & Sweats' },
  ];

  return (
    <section style={{ background: 'var(--wy-canvas)', padding: 'clamp(3rem, 6vw, 5rem) 0', borderTop: '1px solid var(--wy-border)' }}>
      <div className="container-wy">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1.25rem',
            marginBottom: '2.25rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <div style={{
                width: '36px',
                height: '3px',
                background: 'var(--wy-yellow)',
                marginBottom: '0.5rem',
              }} />

              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
                color: 'var(--wy-text)',
                letterSpacing: '0.04em',
                lineHeight: 1.05,
                margin: 0,
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
                fontSize: '0.88rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#FFC800',
                textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
            >
              <span>View Full Store Catalog</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Primary Category Navigation Bar + Search Tab */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.85rem',
            flexWrap: 'wrap',
            width: '100%',
            paddingBottom: selectedCategory === 'clothing' ? '0.75rem' : '0',
            borderBottom: selectedCategory === 'clothing' ? '1px solid #1E1E22' : 'none',
          }}>
            {/* Category Filter Pills */}
            <div
              className="no-scrollbar"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                overflowX: 'auto',
                maxWidth: '100%',
                padding: '0.25rem 0',
                WebkitOverflowScrolling: 'touch',
                flex: '1 1 auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {mainCategories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      if (cat.id !== 'clothing') {
                        setSelectedClothingGroup('all');
                        setSelectedTopsSub('all');
                        setSelectedJeansSub('all');
                      }
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      height: '36px',
                      padding: '0 0.95rem',
                      borderRadius: '100px',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      background: isSelected ? '#FFC800' : '#18181B',
                      color: isSelected ? '#000000' : '#D4D4D8',
                      border: isSelected ? '1px solid #FFC800' : '1px solid #27272A',
                      boxShadow: isSelected ? '0 0 16px rgba(255, 200, 0, 0.35)' : 'none',
                    }}
                  >
                    <span>{cat.label}</span>
                    <span
                      style={{
                        padding: '0.12rem 0.45rem',
                        borderRadius: '100px',
                        fontSize: '0.66rem',
                        fontWeight: 700,
                        background: isSelected ? '#000000' : '#27272A',
                        color: isSelected ? '#FFC800' : '#A1A1AA',
                      }}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input Tab */}
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '320px',
              flex: '1 1 220px',
            }}>
              <Search
                size={15}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: searchQuery ? '#FFC800' : '#71717A',
                  pointerEvents: 'none',
                  transition: 'color 0.2s',
                }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search releases, sneakers, tees..."
                style={{
                  width: '100%',
                  padding: '0.55rem 2rem 0.55rem 2.35rem',
                  background: '#141416',
                  border: searchQuery ? '1px solid #FFC800' : '1px solid #27272A',
                  borderRadius: '100px',
                  color: '#FFFFFF',
                  fontSize: '0.8rem',
                  outline: 'none',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#FFC800';
                  e.currentTarget.style.background = '#1A1A1E';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = searchQuery ? '#FFC800' : '#27272A';
                  e.currentTarget.style.background = '#141416';
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#71717A',
                    cursor: 'pointer',
                  }}
                  title="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>
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
                  flexDirection: 'column',
                  gap: '0.75rem',
                  width: '100%',
                }}
              >
                {/* Primary Clothing Group Tabs */}
                <div
                  className="no-scrollbar"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    overflowX: 'auto',
                    width: '100%',
                    paddingBottom: '0.2rem',
                    WebkitOverflowScrolling: 'touch',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#FFC800',
                    marginRight: '0.35rem',
                    flexShrink: 0,
                  }}>
                    <Filter size={13} />
                    <span>Filter:</span>
                  </div>

                  {clothingPrimaryFilters.map((sub) => {
                    const isSubActive = selectedClothingGroup === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => setSelectedClothingGroup(sub.id)}
                        style={{
                          padding: '0.38rem 0.85rem',
                          borderRadius: '100px',
                          fontSize: '0.74rem',
                          fontWeight: isSubActive ? 700 : 500,
                          letterSpacing: '0.04em',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
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
                </div>

                {/* Secondary Sub-Pills for Tops & Sleeves */}
                {selectedClothingGroup === 'tops_sleeves' && (
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="no-scrollbar"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      overflowX: 'auto',
                      padding: '0.45rem 0.85rem',
                      background: 'rgba(26, 26, 30, 0.65)',
                      borderRadius: '12px',
                      border: '1px solid #27272A',
                      width: '100%',
                      WebkitOverflowScrolling: 'touch',
                    }}
                  >
                    <span style={{ fontSize: '0.68rem', color: '#FFC800', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: '0.25rem', whiteSpace: 'nowrap' }}>
                      Style:
                    </span>
                    {[
                      { id: 'all', label: 'All Tops & Sleeves' },
                      { id: 'tops', label: 'Tops (Short Sleeve)' },
                      { id: 'sleeves', label: 'Sleeves (Long Sleeve)' },
                    ].map((opt) => {
                      const isActive = selectedTopsSub === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => setSelectedTopsSub(opt.id as any)}
                          style={{
                            padding: '0.3rem 0.75rem',
                            borderRadius: '100px',
                            fontSize: '0.7rem',
                            fontWeight: isActive ? 700 : 500,
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                            background: isActive ? 'rgba(255, 200, 0, 0.2)' : 'transparent',
                            color: isActive ? '#FFC800' : '#A1A1AA',
                            border: isActive ? '1px solid #FFC800' : '1px solid transparent',
                          }}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </motion.div>
                )}

                {/* Secondary Sub-Pills for Jeans & Pants */}
                {selectedClothingGroup === 'jeans_pants' && (
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      flexWrap: 'wrap',
                      padding: '0.45rem 0.85rem',
                      background: 'rgba(26, 26, 30, 0.65)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 200, 0, 0.25)',
                      width: 'fit-content',
                    }}
                  >
                    <span style={{ fontSize: '0.68rem', color: '#FFC800', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: '0.25rem' }}>
                      Fit Cut:
                    </span>
                    {[
                      { id: 'all', label: 'All Jeans & Pants' },
                      { id: 'baggy', label: 'Baggy Jeans' },
                      { id: 'slim', label: 'Slim Fit Jeans' },
                    ].map((opt) => {
                      const isActive = selectedJeansSub === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => setSelectedJeansSub(opt.id as any)}
                          style={{
                            padding: '0.3rem 0.75rem',
                            borderRadius: '100px',
                            fontSize: '0.7rem',
                            fontWeight: isActive ? 700 : 500,
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                            background: isActive ? 'rgba(255, 200, 0, 0.2)' : 'transparent',
                            color: isActive ? '#FFC800' : '#A1A1AA',
                            border: isActive ? '1px solid #FFC800' : '1px solid transparent',
                          }}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Unified Product Cards Grid */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="product-showcase-grid"
        >
          <AnimatePresence>
            {displayedProducts.length === 0 ? (
              <div style={{
                gridColumn: '1 / -1',
                padding: '4.5rem 1rem',
                textAlign: 'center',
                color: '#71717A',
                background: '#141416',
                borderRadius: '16px',
                border: '1px solid #27272A',
              }}>
                <ShoppingBag size={38} color="#52525B" style={{ margin: '0 auto 1rem' }} />
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: '#FFFFFF', letterSpacing: '0.04em' }}>
                  {searchQuery ? `No releases found matching "${searchQuery}"` : 'No items found in this section'}
                </p>
                <p style={{ fontSize: '0.82rem', color: '#71717A', marginTop: '0.35rem' }}>
                  {searchQuery ? 'Try checking your spelling or clearing search to view all drops.' : 'Try switching filters or check back for the next drop.'}
                </p>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{
                      marginTop: '1.25rem',
                      padding: '0.5rem 1.25rem',
                      borderRadius: '8px',
                      background: 'rgba(255, 200, 0, 0.1)',
                      border: '1px solid rgba(255, 200, 0, 0.3)',
                      color: '#FFC800',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#FFC800';
                      e.currentTarget.style.color = '#000000';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 200, 0, 0.1)';
                      e.currentTarget.style.color = '#FFC800';
                    }}
                  >
                    Clear Search
                  </button>
                )}
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
                  const attrs = (product.variants?.[0]?.attributes as any) || {};
                  const subType = attrs.clothing_type;
                  const sleeveType = attrs.sleeve_type;
                  const fit = attrs.fit;
                  const t = product.title.toLowerCase();

                  if (sleeveType === 'sleeves' || subType === 'sleeves' || t.includes('sleeve') || t.includes('sweatshirt')) {
                    badgeText = 'SLEEVES';
                  } else if (sleeveType === 'tops' || subType === 'tops' || ((subType === 'tops_sleeves' || !subType) && (t.includes('tee') || t.includes('top')))) {
                    badgeText = 'TOPS';
                  } else if (fit === 'baggy' || subType === 'baggy_jeans' || (t.includes('baggy') && (t.includes('jean') || t.includes('denim')))) {
                    badgeText = 'BAGGY JEANS';
                  } else if (fit === 'slim' || subType === 'slim_jeans' || (t.includes('slim') && (t.includes('jean') || t.includes('denim')))) {
                    badgeText = 'SLIM FIT JEANS';
                  } else if (subType === 'jeans_pants' || subType === 'jeans' || t.includes('jean') || t.includes('pants') || t.includes('cargo')) {
                    badgeText = 'JEANS & PANTS';
                  } else if (subType === 'hoodie' || t.includes('hoodie')) {
                    badgeText = 'HOODIES';
                  }
                }

                const quantityInCart = (items || [])
                  .filter((item) => item.productId === product.id)
                  .reduce((sum, item) => sum + item.quantity, 0);

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
                      border: isAdded ? '2px solid #FFC800' : '1px solid #27272A',
                      boxShadow: isAdded ? '0 0 30px rgba(255,200,0,0.35)' : '0 8px 24px rgba(0,0,0,0.4)',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease',
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
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          background: '#000000',
                          border: isWishlisted ? '1px solid #FFC800' : '1px solid #27272A',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isWishlisted ? '#FFC800' : '#FFFFFF',
                          cursor: 'pointer',
                          transition: 'all 150ms ease',
                        }}
                      >
                        <Heart size={16} fill={isWishlisted ? '#FFC800' : 'none'} />
                      </button>
                    </Link>

                    {/* Product Details & Actions */}
                    <div style={{
                      padding: 'clamp(0.65rem, 1.8vw, 1.15rem)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      flex: 1,
                      justifyContent: 'space-between',
                    }}>
                      <div>
                        <Link href={`/shop/${product.slug}`}>
                          <h3 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
                            color: '#FFFFFF',
                            letterSpacing: '0.03em',
                            lineHeight: 1.2,
                            marginBottom: '0.25rem',
                          }}>
                            {product.title}
                          </h3>
                        </Link>
                        <div style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 'clamp(1rem, 2.2vw, 1.25rem)',
                          color: '#FFC800',
                        }}>
                          GH₵ {price.toLocaleString()}
                        </div>
                      </div>

                      {/* Quick Add Button */}
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.92, rotate: -2 }}
                        onClick={() => handleQuickAdd(product)}
                        style={{
                          width: '100%',
                          padding: 'clamp(0.5rem, 1.4vw, 0.75rem)',
                          borderRadius: '8px',
                          background: isAdded ? '#10b981' : '#FFC800',
                          color: isAdded ? '#FFFFFF' : '#000000',
                          border: 'none',
                          fontFamily: 'var(--font-display)',
                          fontSize: 'clamp(0.72rem, 1.4vw, 0.85rem)',
                          letterSpacing: '0.06em',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.35rem',
                          transition: 'background 0.2s',
                        }}
                      >
                        <ShoppingBag size={13} />
                        <span>
                          {isAdded
                            ? `ADDED (${quantityInCart} IN BAG)`
                            : quantityInCart > 0
                            ? `+ QUICK ADD (${quantityInCart} IN BAG)`
                            : '+ QUICK ADD'}
                        </span>
                      </motion.button>
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
