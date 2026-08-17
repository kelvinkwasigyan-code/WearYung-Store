'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { ShoppingBag, ArrowUpRight, Tag, Plus } from 'lucide-react';
import { useCartContext } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function LookbookView() {
  const { toggleCart } = useCartContext();
  const [activeLook, setActiveLook] = useState<string | null>(null);
  const [lookbooks, setLookbooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLookbooks() {
      const supabase = createClient();
      const { data } = await supabase
        .from('lookbooks')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      
      if (data) setLookbooks(data);
      setLoading(false);
    }
    fetchLookbooks();
  }, []);

  return (
    <div style={{ backgroundColor: '#0D0D0D', minHeight: '100vh', color: '#FFFFFF' }}>
      {/* Hero Header Section */}
      <section
        style={{
          position: 'relative',
          padding: '3rem 0 2rem',
          borderBottom: '1px solid var(--wy-border)',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(255,200,0,0.06) 0%, transparent 70%), #0D0D0D',
        }}
      >
        <div className="container-wy" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255,200,0,0.1)',
              border: '1px solid rgba(255,200,0,0.3)',
              borderRadius: '100px',
              padding: '0.35rem 1rem',
              marginBottom: '1.25rem',
            }}
          >

            <span
              style={{
                color: '#FFC800',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              WE STYLE GHANA
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 4vw, 3rem)',
              letterSpacing: '0.04em',
              lineHeight: 1.05,
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}
          >
            WEAR YUNG EDITORIALS <span style={{ color: '#FFC800' }}>/ VOLUME 01</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              color: '#FFC800',
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              fontWeight: 500,
              letterSpacing: '0.06em',
              maxWidth: '620px',
              margin: '0 auto',
            }}
          >
            Curated looks from the urban landscape.
          </motion.p>
        </div>
      </section>

      {/* Editorial Masonry Grid */}
      <section className="section-wy" style={{ padding: '4rem 0 6rem' }}>
        <div className="container-wy">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '2.5rem',
            }}
          >
            {loading ? (
              <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '4rem 0', color: '#71717A' }}>
                Loading editorials...
              </div>
            ) : lookbooks.length === 0 ? (
              <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '4rem 0', color: '#71717A' }}>
                No editorials available at the moment.
              </div>
            ) : lookbooks.map((look, index) => {
              const isTall = look.aspect_ratio === 'tall';
              const minHeight = isTall ? '550px' : '420px';

              return (
                <motion.div
                  key={look.id}
                  variants={cardVariants}
                  className="group relative overflow-hidden rounded-xl border border-[#27272A] bg-[#18181B] transition-all duration-300 hover:border-[#FFC800]/50"
                  style={{
                    minHeight,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={() => setActiveLook(look.id)}
                  onMouseLeave={() => setActiveLook(null)}
                >
                  {/* Photo Container */}
                  <div className="relative w-full h-full min-h-[400px] flex-1 overflow-hidden">
                    <Image
                      src={look.image_url}
                      alt={look.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />

                    {/* Gradient Overlay */}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/40 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                      <span className="bg-[#0D0D0D]/80 backdrop-blur-md border border-[#27272A] px-3 py-1 text-xs font-bold tracking-widest text-[#FFC800] uppercase rounded-sm">
                        {look.season}
                      </span>
                      <span className="bg-[#0D0D0D]/80 backdrop-blur-md border border-[#27272A] px-3 py-1 text-xs font-semibold tracking-wider text-zinc-300 uppercase rounded-sm">
                        {look.category}
                      </span>
                    </div>

                    {/* Default Bottom Look Info */}
                    <div className="absolute bottom-4 left-4 right-4 z-10 transition-opacity duration-300 group-hover:opacity-0 pointer-events-none">
                      <h3
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.75rem',
                          letterSpacing: '0.04em',
                          color: '#FFFFFF',
                          lineHeight: 1.1,
                          marginBottom: '0.25rem',
                        }}
                      >
                        {look.title}
                      </h3>
                      <p className="text-zinc-400 text-xs line-clamp-2">
                        {look.description}
                      </p>
                    </div>

                    {/* 'Shop The Look' Hover Overlay */}
                    <div className="absolute inset-0 bg-[#0D0D0D]/90 backdrop-blur-md p-6 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                      <div>
                        <div className="flex items-center gap-2 mb-2 text-[#FFC800]">
                          <Tag size={16} />
                          <span className="text-xs font-bold tracking-widest uppercase">
                            TAGGED IN THIS LOOK
                          </span>
                        </div>

                        <h3
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.85rem',
                            letterSpacing: '0.04em',
                            color: '#FFFFFF',
                            lineHeight: 1.1,
                            marginBottom: '1rem',
                          }}
                        >
                          {look.title}
                        </h3>

                        {/* List of outfit items */}
                        <div className="flex flex-col gap-2.5 mb-4">
                          {(look.tagged_items || []).map((item: any, idx: number) => (
                            <Link
                              key={idx}
                              href={`/shop?category=${item.category}`}
                              className="flex items-center justify-between p-2.5 rounded-lg bg-[#18181B] border border-[#27272A] hover:border-[#FFC800] transition-colors"
                            >
                              <div className="flex flex-col">
                                <span className="text-xs font-semibold text-white tracking-wide">
                                  {item.name}
                                </span>
                                <span className="text-[11px] text-zinc-400 uppercase">
                                  {item.category}
                                </span>
                              </div>
                              <span className="text-xs font-bold text-[#FFC800] font-mono">
                                {item.price}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Action CTA Buttons */}
                      <div className="flex flex-col gap-2 pt-2 border-t border-[#27272A]">
                        <Link
                          href={`/shop`}
                          className="btn btn-primary btn-sm flex items-center justify-center gap-2 w-full"
                        >
                          <ShoppingBag size={16} />
                          <span>Shop This Outfit</span>
                          <ArrowUpRight size={16} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleCart()}
                          className="btn btn-ghost btn-sm flex items-center justify-center gap-2 w-full text-zinc-300 hover:text-white"
                        >
                          <Plus size={14} />
                          <span>Quick Bag View</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

