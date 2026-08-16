'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, ShoppingBag, Zap, ShieldCheck } from 'lucide-react';
import { useCartContext } from '@/context/CartContext';

export default function HeroSection() {
  const cartContext = useCartContext();

  const handleQuickCop = () => {
    if (!cartContext) return;
    cartContext.addToCart({
      productId: 'hero-featured-vortex-hoodie',
      variantId: 'hero-featured-vortex-hoodie-l',
      name: 'VORTEX ACID HOODIE',
      category: 'clothing',
      price: 450,
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80',
      size: 'L',
      quantity: 1,
      inStock: true,
    });
    cartContext.openCart();
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <section className="relative min-h-[90vh] lg:min-h-[92vh] flex items-center overflow-hidden bg-[#0D0D0E]">
      {/* Background Grid Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Typographic Watermark Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
        <span className="text-zinc-900 font-black text-8xl md:text-[12rem] lg:text-[14rem] tracking-tighter opacity-40 whitespace-nowrap">
          WY ARCHIVE
        </span>
      </div>

      {/* Main 2-Column Layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-20 grid lg:grid-cols-12 gap-12 items-center w-full">
        {/* Left Column (lg:col-span-7) */}
        <motion.div
          className="lg:col-span-7"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-block mb-6">
            <div className="inline-flex items-center gap-2 bg-[#FFC800]/10 border border-[#FFC800]/30 rounded-full px-4 py-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FFC800] animate-pulse" />
              <span className="text-[#FFC800] text-xs font-semibold tracking-widest uppercase">
                • NEW DROP AVAILABLE
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] mb-6 text-white font-extrabold"
          >
            DRESS LIKE <br className="hidden sm:inline" />
            <span className="text-[#FFC800] drop-shadow-[0_0_25px_rgba(255,200,0,0.35)]">
              YOU OWN THE ROOM
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-zinc-400 text-lg sm:text-xl leading-relaxed max-w-xl mb-10"
          >
            Premium streetwear, authentic sneakers, luxury watches &amp; curated drops.
            Designed &amp; sourced for those who move different.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-10">
            <Link
              href="/shop"
              id="hero-shop-btn"
              className="px-8 py-4 bg-[#FFC800] text-black font-extrabold hover:bg-yellow-400 transition-all rounded-xl flex items-center gap-2 shadow-[0_0_25px_rgba(255,200,0,0.25)] hover:scale-105 active:scale-95"
            >
              SHOP NOW
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/shop?category=sneakers"
              id="hero-sneakers-btn"
              className="px-8 py-4 border border-zinc-700 bg-zinc-900/60 text-white font-bold hover:border-[#FFC800] hover:text-[#FFC800] transition-all rounded-xl hover:scale-105 active:scale-95 backdrop-blur-sm"
            >
              VIEW SNEAKERS
            </Link>
          </motion.div>

          {/* Micro-Trust Footer */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-4 pt-6 border-t border-zinc-800/80 max-w-md"
          >
            <div className="flex -space-x-3 overflow-hidden">
              <img
                className="inline-block h-9 w-9 rounded-full ring-2 ring-[#0D0D0E] object-cover"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Customer Avatar 1"
              />
              <img
                className="inline-block h-9 w-9 rounded-full ring-2 ring-[#0D0D0E] object-cover"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                alt="Customer Avatar 2"
              />
              <img
                className="inline-block h-9 w-9 rounded-full ring-2 ring-[#0D0D0E] object-cover"
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80"
                alt="Customer Avatar 3"
              />
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 font-medium">
              🔥 <span className="text-white font-bold">1,200+</span> Streetwear Enthusiasts across Ghana
            </p>
          </motion.div>
        </motion.div>

        {/* Right Column — Featured Drop Showcase (lg:col-span-5) */}
        <motion.div
          className="lg:col-span-5 relative flex justify-center items-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* Background Glow */}
          <div className="absolute -inset-4 bg-[#FFC800]/15 blur-3xl rounded-full pointer-events-none" />

          {/* Floating Hero Card */}
          <div className="relative w-full max-w-md bg-[#141416] border border-zinc-800 rounded-3xl p-4 shadow-2xl overflow-hidden group transition-all duration-500 hover:-translate-y-1.5 hover:border-zinc-700">
            {/* Main Image Container */}
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-zinc-900">
              <Image
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80"
                alt="Featured Drop - VORTEX ACID HOODIE"
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                priority
              />

              {/* Floating Glass Badge (Top-Left) */}
              <div className="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-md border border-white/10 text-[#FFC800] text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                <Zap size={14} className="fill-[#FFC800]" />
                <span>LIMITED RELEASE (1 OF 50)</span>
              </div>

              {/* Bottom Overlay Glass Card */}
              <div className="absolute bottom-4 left-4 right-4 z-10 bg-black/80 backdrop-blur-xl border border-white/15 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-extrabold text-[#FFC800] tracking-widest uppercase block mb-0.5">
                    FEATURED DROP
                  </span>
                  <h3 className="text-sm font-extrabold text-white truncate tracking-tight">
                    VORTEX ACID HOODIE
                  </h3>
                  <p className="text-xs font-bold text-zinc-300">GH₵ 450</p>
                </div>
                <button
                  onClick={handleQuickCop}
                  className="bg-[#FFC800] hover:bg-yellow-400 text-black text-xs font-black px-4 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(255,200,0,0.3)] hover:scale-105 active:scale-95 shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag size={14} />
                  Quick Cop
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
