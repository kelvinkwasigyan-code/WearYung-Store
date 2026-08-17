'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ALL_CATEGORIES, CATEGORY_LABELS, type ProductCategory } from '@/types/ecommerce';
import { Shirt, Watch, Gem, ShoppingBag } from 'lucide-react';
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

function PerfumeSprayIcon({ size = 32, className = '' }: { size?: number; className?: string }) {
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
      {/* Bottle body */}
      <rect x="5" y="10" width="9" height="11" rx="2" />
      {/* Bottle neck */}
      <rect x="7" y="7" width="5" height="3" rx="0.5" />
      {/* Nozzle arm extending right */}
      <path d="M12 8.5h3" />
      {/* Nozzle head */}
      <rect x="15" y="7" width="2" height="3" rx="0.5" />
      {/* Spray mist lines */}
      <path d="M18 7.5 L20 6" />
      <path d="M18 8.5 L21 8.5" />
      <path d="M18 9.5 L20 11" />
    </svg>
  );
}

const categoryIcons: Record<string, ReactNode> = {
  clothing: <Shirt size={26} strokeWidth={2} />,
  watches: <Watch size={26} strokeWidth={2} />,
  perfumes: <PerfumeSprayIcon size={26} />,
  accessories: <Gem size={26} strokeWidth={2} />,
  sneakers: <SneakerIcon size={26} />,
  slides: <SlideIcon size={26} />,
  bags: <ShoppingBag size={26} strokeWidth={2} />,
};

export default function CategoryGrid() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section style={{ background: 'var(--wy-surface)', padding: 'clamp(2.5rem, 5vw, 3.75rem) 0' }}>
      <div className="container-wy">
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.85rem, 4vw, 2.75rem)',
              color: 'var(--wy-text)',
              marginBottom: '0.4rem',
              letterSpacing: '0.05em',
            }}
          >
            SHOP BY CATEGORY
          </h2>
          <p style={{ color: 'var(--wy-muted)', fontSize: '0.85rem', margin: 0 }}>
            Find your style across all our collections
          </p>
        </div>

        <motion.div 
          className="category-showcase-grid"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {ALL_CATEGORIES.map((cat) => (
            <motion.div key={cat} variants={item}>
              <Link
                href={`/shop?category=${cat}`}
                id={`category-${cat}`}
                className="category-showcase-item group block"
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="card-wy group-hover:border-[#FFC800]/50 transition-all duration-300"
                  style={{
                    padding: 'clamp(0.95rem, 1.8vw, 1.35rem) 0.65rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#141416',
                    borderRadius: '14px',
                    border: '1px solid #27272A',
                  }}
                >
                  <div
                    className="text-white group-hover:text-[#FFC800] transition-colors duration-300"
                    style={{
                      marginBottom: '0.55rem',
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
                      fontSize: 'clamp(0.78rem, 1.1vw, 0.88rem)',
                      letterSpacing: '0.08em',
                      color: 'var(--wy-text)',
                      textTransform: 'uppercase',
                      margin: 0,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {CATEGORY_LABELS[cat as ProductCategory]}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
