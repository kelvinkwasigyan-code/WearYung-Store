'use client';

import { useCallback, useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ALL_CATEGORIES, CATEGORY_LABELS } from '@/types/ecommerce';

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

  // Sync state with URL params on navigation
  useEffect(() => {
    setMinPrice(currentMinPrice);
    setMaxPrice(currentMaxPrice);
  }, [currentMinPrice, currentMaxPrice]);

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

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get('q') as string;
    router.push(`${pathname}?${createQueryString('q', q)}`);
  };

  const applyPriceFilter = () => {
    let params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set('minPrice', minPrice);
    else params.delete('minPrice');
    
    if (maxPrice) params.set('maxPrice', maxPrice);
    else params.delete('maxPrice');
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(pathname); // Clears all search params
  };

  return (
    <aside style={{ minWidth: '220px', flex: '0 0 220px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Search */}
      <div>
        <form onSubmit={handleSearch}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              name="q"
              defaultValue={currentQuery}
              placeholder="Search drops..."
              className="input-wy"
              style={{ paddingRight: '2.5rem', width: '100%' }}
            />
            <button type="submit" style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'var(--wy-muted)',
              cursor: 'pointer',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Sort By */}
      <div>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.85rem',
          letterSpacing: '0.12em',
          color: 'var(--wy-muted)',
          marginBottom: '1rem',
          textTransform: 'uppercase',
        }}>
          Sort By
        </h3>
        <select 
          className="input-wy"
          value={currentSort}
          onChange={(e) => router.push(`${pathname}?${createQueryString('sort', e.target.value)}`)}
          style={{ width: '100%', cursor: 'pointer' }}
        >
          <option value="newest">Newest Drops</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {/* Categories */}
      <div>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.85rem',
          letterSpacing: '0.12em',
          color: 'var(--wy-muted)',
          marginBottom: '1rem',
          textTransform: 'uppercase',
        }}>
          Categories
        </h3>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <button
            onClick={() => router.push(`${pathname}?${createQueryString('category', '')}`)}
            style={{
              padding: '0.6rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              fontWeight: !currentCategory ? 700 : 500,
              color: !currentCategory ? 'var(--wy-yellow)' : 'var(--wy-muted)',
              background: !currentCategory ? 'rgba(255,200,0,0.1)' : 'transparent',
              transition: 'all 150ms',
              textAlign: 'left',
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            All Products
          </button>
          {ALL_CATEGORIES.map((cat) => {
            const isClothing = cat === 'clothing';
            const isSelected = currentCategory === cat;
            const currentSub = searchParams.get('sub') || '';

            return (
              <div key={cat} style={{ display: 'flex', flexDirection: 'column' }}>
                <button
                  onClick={() => {
                    let params = new URLSearchParams(searchParams.toString());
                    params.set('category', cat);
                    params.delete('sub');
                    router.push(`${pathname}?${params.toString()}`);
                  }}
                  style={{
                    padding: '0.6rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.875rem',
                    fontWeight: isSelected ? 700 : 500,
                    color: isSelected ? 'var(--wy-yellow)' : 'var(--wy-muted)',
                    background: isSelected ? 'rgba(255,200,0,0.1)' : 'transparent',
                    transition: 'all 150ms',
                    textAlign: 'left',
                    border: 'none',
                    cursor: 'pointer',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  {CATEGORY_LABELS[cat]}
                </button>

                {/* Subcategories for Clothing */}
                {isClothing && isSelected && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', paddingLeft: '1rem', marginTop: '0.25rem', marginBottom: '0.5rem', borderLeft: '2px solid rgba(255,200,0,0.3)' }}>
                    {[
                      { id: '', label: 'All Clothing' },
                      { id: 'hoodie', label: 'Hoodies & Sweats' },
                      { id: 'jeans', label: 'Jeans & Pants' },
                      { id: 'tops', label: 'Tees & Tops' },
                    ].map((sub) => {
                      const isSubActive = (currentSub === sub.id) || (!currentSub && sub.id === '');
                      return (
                        <button
                          key={sub.id}
                          onClick={() => {
                            let params = new URLSearchParams(searchParams.toString());
                            if (sub.id) params.set('sub', sub.id);
                            else params.delete('sub');
                            router.push(`${pathname}?${params.toString()}`);
                          }}
                          style={{
                            padding: '0.35rem 0.6rem',
                            fontSize: '0.78rem',
                            fontWeight: isSubActive ? 700 : 400,
                            color: isSubActive ? '#FFC800' : '#A1A1AA',
                            background: isSubActive ? 'rgba(255,200,0,0.08)' : 'transparent',
                            borderRadius: '4px',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.15s',
                          }}
                        >
                          • {sub.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Price Range */}
      <div>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.85rem',
          letterSpacing: '0.12em',
          color: 'var(--wy-muted)',
          marginBottom: '1rem',
          textTransform: 'uppercase',
        }}>
          Price Range (GH₵)
        </h3>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
          <input 
            type="number" 
            placeholder="Min" 
            className="input-wy"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
          />
          <span style={{ color: 'var(--wy-muted)' }}>-</span>
          <input 
            type="number" 
            placeholder="Max" 
            className="input-wy"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <button 
          onClick={applyPriceFilter}
          style={{
            width: '100%',
            padding: '0.6rem',
            background: 'var(--wy-surface)',
            border: '1px solid var(--wy-border)',
            color: 'var(--wy-text)',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.06em',
            cursor: 'pointer',
            transition: 'all 150ms'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = 'var(--wy-yellow)';
            e.currentTarget.style.color = 'var(--wy-yellow)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = 'var(--wy-border)';
            e.currentTarget.style.color = 'var(--wy-text)';
          }}
        >
          APPLY
        </button>
      </div>

      {(currentCategory || currentQuery || currentMinPrice || currentMaxPrice || currentSort !== 'newest') && (
        <button 
          onClick={clearFilters}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--wy-danger)',
            fontSize: '0.85rem',
            cursor: 'pointer',
            textDecoration: 'underline',
            textAlign: 'center',
            marginTop: '-1rem'
          }}
        >
          Clear all filters
        </button>
      )}
    </aside>
  );
}
