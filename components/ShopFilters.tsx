'use client';

import { useCallback, useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ArrowUpDown, DollarSign, Check, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { ALL_CATEGORIES, CATEGORY_LABELS, type ProductCategory } from '@/types/ecommerce';

export default function ShopFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('category') || '';
  const currentQuery = searchParams.get('q') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';

  const [minPrice, setMinPrice] = useState(currentMinPrice);
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice);
  const [searchInput, setSearchInput] = useState(currentQuery);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkCategoryScroll = useCallback(() => {
    if (!categoryScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 8);
  }, []);

  useEffect(() => {
    const el = categoryScrollRef.current;
    if (!el) return;
    checkCategoryScroll();
    el.addEventListener('scroll', checkCategoryScroll, { passive: true });
    window.addEventListener('resize', checkCategoryScroll);
    return () => {
      el.removeEventListener('scroll', checkCategoryScroll);
      window.removeEventListener('resize', checkCategoryScroll);
    };
  }, [checkCategoryScroll]);

  const handleCategoryScroll = (direction: 'left' | 'right') => {
    if (!categoryScrollRef.current) return;
    if (direction === 'right') {
      categoryScrollRef.current.scrollTo({
        left: categoryScrollRef.current.scrollWidth,
        behavior: 'smooth',
      });
    } else {
      categoryScrollRef.current.scrollTo({
        left: 0,
        behavior: 'smooth',
      });
    }
  };

  // Sync internal state when URL search params change
  useEffect(() => {
    setMinPrice(currentMinPrice);
    setMaxPrice(currentMaxPrice);
    setSearchInput(currentQuery);
  }, [currentMinPrice, currentMaxPrice, currentQuery]);

  const activeFilterCount = [
    Boolean(currentCategory),
    Boolean(currentQuery),
    currentSort !== 'newest',
    Boolean(currentMinPrice || currentMaxPrice),
  ].filter(Boolean).length;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`${pathname}?${createQueryString('q', searchInput.trim())}`);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    router.push(`${pathname}?${createQueryString('q', '')}`);
  };

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set('minPrice', minPrice);
    else params.delete('minPrice');

    if (maxPrice) params.set('maxPrice', maxPrice);
    else params.delete('maxPrice');

    router.push(`${pathname}?${params.toString()}`);
    setIsMobileDrawerOpen(false);
  };

  const setCategory = (cat: string) => {
    router.push(`${pathname}?${createQueryString('category', cat)}`);
  };

  const setSort = (sortValue: string) => {
    router.push(`${pathname}?${createQueryString('sort', sortValue)}`);
  };

  const clearAllFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSearchInput('');
    router.push(pathname);
    setIsMobileDrawerOpen(false);
  };

  return (
    <>
      {/* ─── 1. MOBILE TOP CONTROLS (Horizontal Category Rail + Search & Filter Bar) ─── */}
      <div className="flex lg:hidden flex-col gap-3.5 mb-5 w-full">
        {/* Horizontal Category Scroll Rail with Floating Arrows */}
        <div style={{ position: 'relative', width: '100%' }}>
          <AnimatePresence>
            {canScrollLeft && (
              <motion.button
                type="button"
                onClick={() => handleCategoryScroll('left')}
                aria-label="Scroll categories left"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 rounded-full text-[#FFC800] cursor-pointer -ml-1.5"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4), 0 0 12px rgba(255, 200, 0, 0.25)',
                }}
              >
                <ChevronLeft size={16} strokeWidth={2.6} />
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {canScrollRight && (
              <motion.button
                type="button"
                onClick={() => handleCategoryScroll('right')}
                aria-label="Scroll categories right"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 rounded-full text-[#FFC800] cursor-pointer -mr-1.5"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4), 0 0 12px rgba(255, 200, 0, 0.25)',
                }}
              >
                <ChevronRight size={16} strokeWidth={2.6} />
              </motion.button>
            )}
          </AnimatePresence>

          <div
            ref={categoryScrollRef}
            className="no-scrollbar scroll-smooth"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              overflowX: 'auto',
              width: '100%',
              padding: '0.2rem 0',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <button
              type="button"
              onClick={() => setCategory('')}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '100px',
                fontFamily: 'var(--font-display)',
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: !currentCategory ? 'var(--wy-yellow)' : '#18181B',
                color: !currentCategory ? '#000000' : '#A1A1AA',
                border: !currentCategory ? '1px solid var(--wy-yellow)' : '1px solid #27272A',
                boxShadow: !currentCategory ? '0 0 12px rgba(255, 200, 0, 0.3)' : 'none',
              }}
            >
              All Drops
            </button>

            {ALL_CATEGORIES.map((cat) => {
              const isActive = currentCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  style={{
                    padding: '0.45rem 0.95rem',
                    borderRadius: '100px',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: isActive ? 'var(--wy-yellow)' : '#18181B',
                    color: isActive ? '#000000' : '#A1A1AA',
                    border: isActive ? '1px solid var(--wy-yellow)' : '1px solid #27272A',
                    boxShadow: isActive ? '0 0 12px rgba(255, 200, 0, 0.3)' : 'none',
                  }}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Mobile Search Input & Filter Button */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', width: '100%' }}>
          <form onSubmit={handleSearchSubmit} style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search drops, sneakers, hoodies..."
              style={{
                width: '100%',
                height: '42px',
                padding: '0 2.4rem 0 2.25rem',
                background: '#141416',
                border: '1px solid #27272A',
                borderRadius: '10px',
                color: '#FFFFFF',
                fontSize: '0.82rem',
                outline: 'none',
              }}
            />
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#71717A',
                pointerEvents: 'none',
              }}
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#A1A1AA',
                  cursor: 'pointer',
                  padding: '2px',
                }}
              >
                <X size={14} />
              </button>
            )}
          </form>

          {/* Filter & Sort Drawer Trigger Button */}
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(true)}
            style={{
              height: '42px',
              padding: '0 0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: activeFilterCount > 0 ? 'rgba(255, 200, 0, 0.15)' : '#141416',
              border: activeFilterCount > 0 ? '1px solid var(--wy-yellow)' : '1px solid #27272A',
              borderRadius: '10px',
              color: activeFilterCount > 0 ? 'var(--wy-yellow)' : '#FFFFFF',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <SlidersHorizontal size={15} />
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <span
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: 'var(--wy-yellow)',
                  color: '#000000',
                  fontSize: '0.65rem',
                  fontWeight: 900,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ─── 2. DESKTOP SIDEBAR PANEL (Visible on lg screens ≥ 1024px) ─── */}
      <aside
        className="hidden lg:flex"
        style={{
          width: '260px',
          flexShrink: 0,
          flexDirection: 'column',
          gap: '1.75rem',
          background: '#121215',
          border: '1px solid #27272A',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          position: 'sticky',
          top: '90px',
        }}
      >
        {/* Search */}
        <div>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.75rem',
              letterSpacing: '0.14em',
              color: '#A1A1AA',
              marginBottom: '0.65rem',
              textTransform: 'uppercase',
              fontWeight: 800,
            }}
          >
            Search Collection
          </h3>
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search drops..."
              style={{
                width: '100%',
                height: '40px',
                padding: '0 2.2rem 0 2.2rem',
                background: '#18181B',
                border: '1px solid #27272A',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '0.82rem',
                outline: 'none',
              }}
            />
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#71717A',
                pointerEvents: 'none',
              }}
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                style={{
                  position: 'absolute',
                  right: '0.65rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#A1A1AA',
                  cursor: 'pointer',
                }}
              >
                <X size={13} />
              </button>
            )}
          </form>
        </div>

        {/* Sort Order */}
        <div>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.75rem',
              letterSpacing: '0.14em',
              color: '#A1A1AA',
              marginBottom: '0.65rem',
              textTransform: 'uppercase',
              fontWeight: 800,
            }}
          >
            Sort By
          </h3>
          <select
            value={currentSort}
            onChange={(e) => setSort(e.target.value)}
            style={{
              width: '100%',
              height: '40px',
              padding: '0 0.85rem',
              background: '#18181B',
              border: '1px solid #27272A',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontSize: '0.82rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="newest">Newest Releases</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        {/* Categories List */}
        <div>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.75rem',
              letterSpacing: '0.14em',
              color: '#A1A1AA',
              marginBottom: '0.65rem',
              textTransform: 'uppercase',
              fontWeight: 800,
            }}
          >
            Categories
          </h3>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <button
              type="button"
              onClick={() => setCategory('')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.55rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: !currentCategory ? 800 : 500,
                color: !currentCategory ? '#000000' : '#D4D4D8',
                background: !currentCategory ? 'var(--wy-yellow)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
            >
              <span>All Products</span>
              {!currentCategory && <Check size={14} strokeWidth={3} />}
            </button>

            {ALL_CATEGORIES.map((cat) => {
              const isActive = currentCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.55rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: isActive ? 800 : 500,
                    color: isActive ? '#000000' : '#D4D4D8',
                    background: isActive ? 'var(--wy-yellow)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>{CATEGORY_LABELS[cat]}</span>
                  {isActive && <Check size={14} strokeWidth={3} />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Price Range */}
        <div>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.75rem',
              letterSpacing: '0.14em',
              color: '#A1A1AA',
              marginBottom: '0.65rem',
              textTransform: 'uppercase',
              fontWeight: 800,
            }}
          >
            Price Range (GH₵)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem', marginBottom: '0.65rem' }}>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              style={{
                width: '100%',
                height: '38px',
                padding: '0 0.65rem',
                background: '#18181B',
                border: '1px solid #27272A',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '0.82rem',
                outline: 'none',
              }}
            />
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              style={{
                width: '100%',
                height: '38px',
                padding: '0 0.65rem',
                background: '#18181B',
                border: '1px solid #27272A',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '0.82rem',
                outline: 'none',
              }}
            />
          </div>
          <button
            type="button"
            onClick={applyPriceFilter}
            style={{
              width: '100%',
              height: '38px',
              borderRadius: '8px',
              background: '#1E1E24',
              border: '1px solid #3F3F46',
              color: '#FFFFFF',
              fontFamily: 'var(--font-display)',
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--wy-yellow)';
              e.currentTarget.style.borderColor = 'var(--wy-yellow)';
              e.currentTarget.style.color = '#000000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#1E1E24';
              e.currentTarget.style.borderColor = '#3F3F46';
              e.currentTarget.style.color = '#FFFFFF';
            }}
          >
            Apply Range
          </button>
        </div>

        {/* Reset All Filters Button */}
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearAllFilters}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              width: '100%',
              padding: '0.6rem 0',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#EF4444',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            <RotateCcw size={13} />
            <span>Reset All Filters</span>
          </button>
        )}
      </aside>

      {/* ─── 3. MOBILE FILTER & SORT BOTTOM SHEET / MODAL ─── */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <>
            {/* Backdrop Scrim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(6px)',
                zIndex: 100,
              }}
            />

            {/* Bottom Drawer Modal */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: '#121215',
                borderTop: '1px solid #27272A',
                borderTopLeftRadius: '20px',
                borderTopRightRadius: '20px',
                padding: '1.5rem 1.25rem 2.5rem',
                zIndex: 101,
                maxHeight: '85vh',
                overflowY: 'auto',
                boxShadow: '0 -10px 40px rgba(0,0,0,0.8)',
              }}
            >
              {/* Drawer Top Handle */}
              <div style={{ width: '36px', height: '4px', borderRadius: '4px', background: '#3F3F46', margin: '0 auto 1.25rem' }} />

              {/* Drawer Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <SlidersHorizontal size={18} color="var(--wy-yellow)" />
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: '#FFFFFF', letterSpacing: '0.04em', margin: 0 }}>
                    Filter & Sort Releases
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  style={{
                    background: '#1E1E24',
                    border: '1px solid #27272A',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#A1A1AA',
                    cursor: 'pointer',
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Sort Order Options */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.65rem' }}>
                  Sort Order
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.45rem' }}>
                  {[
                    { id: 'newest', label: 'Newest Drops First' },
                    { id: 'price-asc', label: 'Price: Low to High' },
                    { id: 'price-desc', label: 'Price: High to Low' },
                  ].map((s) => {
                    const isSelected = currentSort === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSort(s.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.65rem 1rem',
                          borderRadius: '10px',
                          background: isSelected ? 'rgba(255, 200, 0, 0.15)' : '#18181B',
                          border: isSelected ? '1px solid var(--wy-yellow)' : '1px solid #27272A',
                          color: isSelected ? 'var(--wy-yellow)' : '#FFFFFF',
                          fontSize: '0.82rem',
                          fontWeight: isSelected ? 800 : 500,
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        <span>{s.label}</span>
                        {isSelected && <Check size={16} strokeWidth={2.5} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range Filter */}
              <div style={{ marginBottom: '1.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.65rem' }}>
                  Price Range (GH₵)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '0.85rem' }}>
                  <input
                    type="number"
                    placeholder="Min (e.g. 100)"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 0.85rem',
                      background: '#18181B',
                      border: '1px solid #27272A',
                      borderRadius: '10px',
                      color: '#FFFFFF',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Max (e.g. 800)"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 0.85rem',
                      background: '#18181B',
                      border: '1px solid #27272A',
                      borderRadius: '10px',
                      color: '#FFFFFF',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  style={{
                    flex: 1,
                    height: '46px',
                    borderRadius: '10px',
                    background: '#1E1E24',
                    border: '1px solid #27272A',
                    color: '#D4D4D8',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  Reset
                </button>

                <button
                  type="button"
                  onClick={applyPriceFilter}
                  style={{
                    flex: 2,
                    height: '46px',
                    borderRadius: '10px',
                    background: 'var(--wy-yellow)',
                    border: 'none',
                    color: '#000000',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.88rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    boxShadow: '0 4px 20px rgba(255, 200, 0, 0.3)',
                  }}
                >
                  Show Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
