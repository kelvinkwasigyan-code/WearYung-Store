import Link from 'next/link';
import { ALL_CATEGORIES, CATEGORY_LABELS, type ProductCategory } from '@/types/ecommerce';
import { Shirt, Watch, Sparkles, Gem, ShoppingBag } from 'lucide-react';
import type { ReactNode } from 'react';

// Custom inline SVG icons for footwear with matching Lucide 2px stroke aesthetics
function SneakerIcon({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3.5 16.5h17a1.5 1.5 0 0 0 1.5-1.5v-1a4 4 0 0 0-2.5-3.7l-4.5-1.8L12 5H7.5A2.5 2.5 0 0 0 5 7.5V11l-2.5 3A2 2 0 0 0 2 15.5v1a1.5 1.5 0 0 0 1.5 1.5Z" />
      <path d="M2 18.5a1.5 1.5 0 0 0 1.5 1.5h17a1.5 1.5 0 0 0 1.5-1.5v-2H2v2Z" />
      <path d="M8 8.5l3.5 1.5" />
      <path d="M7 11.5l3.5 1.5" />
    </svg>
  );
}

function SlideIcon({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 18c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-1.5c0-.8-.7-1.5-1.5-1.5H4.5c-.8 0-1.5.7-1.5 1.5V18Z" />
      <path d="M6.5 15c0-4 2.5-7 6.5-7s6.5 3 6.5 7" />
      <path d="M9.5 15c0-2 1.5-3.5 3.5-3.5s3.5 1.5 3.5 3.5" />
    </svg>
  );
}

const categoryIcons: Record<ProductCategory, ReactNode> = {
  clothing: <Shirt className="w-8 h-8" size={32} strokeWidth={2} />,
  watches: <Watch className="w-8 h-8" size={32} strokeWidth={2} />,
  sprays: <Sparkles className="w-8 h-8" size={32} strokeWidth={2} />,
  accessories: <Gem className="w-8 h-8" size={32} strokeWidth={2} />,
  sneakers: <SneakerIcon className="w-8 h-8" size={32} />,
  slides: <SlideIcon className="w-8 h-8" size={32} />,
  bags: <ShoppingBag className="w-8 h-8" size={32} strokeWidth={2} />,
};

export default function CategoryGrid() {
  return (
    <section className="section-wy" style={{ background: 'var(--wy-surface)' }}>
      <div className="container-wy">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: 'var(--wy-text)',
              marginBottom: '0.75rem',
            }}
          >
            SHOP BY CATEGORY
          </h2>
          <p style={{ color: 'var(--wy-muted)' }}>Find your style across all our collections</p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem',
          }}
        >
          {ALL_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/shop?category=${cat}`}
              id={`category-${cat}`}
              className="group block"
              style={{ textDecoration: 'none' }}
            >
              <div
                className="card-wy group-hover:border-[#FFC800]/50 transition-colors duration-300"
                style={{
                  padding: '1.75rem 1rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  className="text-white group-hover:text-[#FFC800] transition-colors duration-300"
                  style={{
                    marginBottom: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {categoryIcons[cat]}
                </div>
                <p
                  className="transition-colors duration-300 group-hover:text-[#FFC800]"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.9rem',
                    letterSpacing: '0.1em',
                    color: 'var(--wy-text)',
                    textTransform: 'uppercase',
                  }}
                >
                  {CATEGORY_LABELS[cat as ProductCategory]}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
