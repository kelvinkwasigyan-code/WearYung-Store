import Link from 'next/link';
import { ALL_CATEGORIES, CATEGORY_LABELS, type ProductCategory } from '@/types/ecommerce';

const categoryIcons: Record<ProductCategory, string> = {
  clothing: '👕',
  watches: '⌚',
  sprays: '💨',
  accessories: '💎',
  sneakers: '👟',
  slides: '🩴',
  bags: '👜',
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
              style={{ textDecoration: 'none' }}
            >
              <div
                className="card-wy"
                style={{
                  padding: '1.75rem 1rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>
                  {categoryIcons[cat]}
                </div>
                <p
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
