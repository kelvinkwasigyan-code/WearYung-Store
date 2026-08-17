'use client';

import Link from 'next/link';
import StatsBar from './StatsBar';
import HeroGridCarousel, { GRID_SLIDES_1X2 } from './HeroGridCarousel';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Fragment, useState, useEffect } from 'react';
import { MapPin, Clock, Navigation, ChevronDown } from 'lucide-react';

export default function HeroSection() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const [showScrollCue, setShowScrollCue] = useState(true);

  // Hide scroll cue when user begins scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setShowScrollCue(false);
      } else {
        setShowScrollCue(true);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Synchronized auto-rotation: carousel and headline text transition together every 4 seconds
  useEffect(() => {
    if (isCarouselHovered) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % GRID_SLIDES_1X2.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isCarouselHovered]);

  const HEADLINES = [
    // 1. Dress Like You Own The Room
    [
      { text: 'DRESS', color: '#FFFFFF', glow: false, br: false },
      { text: 'LIKE', color: '#FFFFFF', glow: false, br: false },
      { text: 'YOU', color: '#FFFFFF', glow: false, br: true },
      { text: 'OWN', color: '#FFC800', glow: true, br: false },
      { text: 'THE', color: '#FFC800', glow: true, br: false },
      { text: 'ROOM', color: '#FFC800', glow: true, br: false },
    ],
    // 2. Walk In Like You Built The Place
    [
      { text: 'WALK', color: '#FFFFFF', glow: false, br: false },
      { text: 'IN', color: '#FFFFFF', glow: false, br: false },
      { text: 'LIKE', color: '#FFFFFF', glow: false, br: false },
      { text: 'YOU', color: '#FFFFFF', glow: false, br: true },
      { text: 'BUILT', color: '#FFC800', glow: true, br: false },
      { text: 'THE', color: '#FFC800', glow: true, br: false },
      { text: 'PLACE', color: '#FFC800', glow: true, br: false },
    ],
    // 3. Speak Without Saying A Word
    [
      { text: 'SPEAK', color: '#FFFFFF', glow: false, br: false },
      { text: 'WITHOUT', color: '#FFFFFF', glow: false, br: true },
      { text: 'SAYING', color: '#FFC800', glow: true, br: false },
      { text: 'A', color: '#FFC800', glow: true, br: false },
      { text: 'WORD', color: '#FFC800', glow: true, br: false },
    ],
    // 4. Effortless Drip, Unmatched Impact
    [
      { text: 'EFFORTLESS', color: '#FFFFFF', glow: false, br: false },
      { text: 'DRIP,', color: '#FFFFFF', glow: false, br: true },
      { text: 'UNMATCHED', color: '#FFC800', glow: true, br: false },
      { text: 'IMPACT', color: '#FFC800', glow: true, br: false },
    ],
  ];

  const currentWords = HEADLINES[currentSlideIndex % HEADLINES.length];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
  };

  return (
    <section
      style={{
        position: 'relative',
        minHeight: 'calc(100dvh - 72px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'var(--wy-canvas)',
        paddingTop: '1.5rem',
        paddingBottom: '1.5rem',
      }}
    >
      {/* Hero Banner Background Image */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(/hero-banner.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
          transform: 'scale(1.02)',
          filter: 'brightness(0.5) contrast(1.1)',
          transition: 'transform 8s ease-out',
        }}
      />

      {/* Multi-stage Dark Gradient Overlays for optimal text legibility and atmosphere */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(to right, rgba(13, 13, 13, 0.96) 0%, rgba(13, 13, 13, 0.82) 48%, rgba(13, 13, 13, 0.45) 100%),
            linear-gradient(to top, rgba(13, 13, 13, 0.95) 0%, transparent 35%),
            linear-gradient(to bottom, rgba(13, 13, 13, 0.7) 0%, transparent 25%),
            radial-gradient(ellipse at 75% 45%, rgba(255, 200, 0, 0.12) 0%, transparent 65%)
          `,
        }}
      />

      {/* Background Grid Pattern Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            'linear-gradient(var(--wy-border) 1px, transparent 1px), linear-gradient(90deg, var(--wy-border) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          opacity: 0.15,
          pointerEvents: 'none',
        }}
      />

      {/* Yellow accent glow circle */}
      <div
        style={{
          position: 'absolute',
          right: '-5%',
          top: '20%',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,200,0,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '1440px', margin: '0 auto', padding: '0 clamp(1rem, 3vw, 2rem)' }}>
        <div className="hero-layout-grid">
          {/* Left Column: Hero Content */}
          <div className="hero-left-col">
            {/* Pill badge */}
            <div
              className="hero-pill-badge"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255,200,0,0.12)',
                border: '1px solid rgba(255,200,0,0.35)',
                backdropFilter: 'blur(8px)',
                borderRadius: '100px',
                padding: '0.35rem 0.9rem',
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'var(--wy-yellow)',
                  display: 'inline-block',
                  animation: 'pulse-yellow 2s infinite',
                }}
              />
              <span
                style={{
                  color: 'var(--wy-yellow)',
                  fontSize: 'clamp(0.78rem, 1.5vw, 0.86rem)',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                New Drop Available
              </span>
            </div>

            {/* Headline synchronized with carousel slide transitions */}
            <motion.h1
              key={currentSlideIndex}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="hero-headline"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 5.5vw, 4.75rem)',
                letterSpacing: '0.04em',
                lineHeight: 1.04,
                marginBottom: '0.75rem',
                minHeight: 'clamp(5rem, 10vw, 9.5rem)',
                textShadow: '0 4px 20px rgba(0,0,0,0.6)',
              }}
            >
              {currentWords.map((word, i) => (
                <Fragment key={i}>
                  <motion.span
                    variants={itemVariants}
                    style={{
                      display: 'inline-block',
                      color: word.color,
                      textShadow: word.glow ? '0 0 20px rgba(255,200,0,0.5)' : '0 4px 12px rgba(0,0,0,0.5)',
                      marginRight: '0.25em',
                    }}
                  >
                    {word.text}
                  </motion.span>
                  {word.br && <br />}
                </Fragment>
              ))}
            </motion.h1>

            <p
              className="hero-desc"
              style={{
                color: '#D4D4D8',
                fontSize: 'clamp(0.95rem, 1.6vw, 1.12rem)',
                lineHeight: 1.6,
                maxWidth: '540px',
                textShadow: '0 2px 10px rgba(0,0,0,0.8)',
              }}
            >
              Premium streetwear, authentic sneakers, luxury apparel & exclusive grails.
              Curated for those who move different.
            </p>

            {/* Sharp Transparent Luxury CTA Buttons */}
            <div className="hero-cta-wrap" style={{ display: 'flex', gap: '0.65rem', width: '100%', maxWidth: '440px', alignItems: 'center' }}>
              <Link
                href="/shop"
                id="hero-shop-btn"
                style={{
                  flex: 1,
                  height: '48px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  padding: '0 1.25rem',
                  borderRadius: '2px',
                  background: 'transparent',
                  border: '1.5px solid #FFC800',
                  color: '#FFC800',
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1rem, 2vw, 1.18rem)',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  boxShadow: '0 0 15px rgba(255, 200, 0, 0.15)',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>Shop Now</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                href="/shop?category=sneakers"
                id="hero-sneakers-btn"
                style={{
                  flex: 1,
                  height: '48px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 1.25rem',
                  borderRadius: '2px',
                  background: 'transparent',
                  border: '1.5px solid rgba(255, 255, 255, 0.35)',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1rem, 2vw, 1.18rem)',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>View Sneakers</span>
              </Link>
            </div>

            {/* Stats Bar positioned directly under hero CTA */}
            <StatsBar style={{ marginTop: '0.85rem' }} />

            {/* Mobile Scroll Cue Floating Badge */}
            <AnimatePresence>
              {showScrollCue && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: [0, 5, 0] }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{
                    opacity: { duration: 0.25 },
                    y: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
                  }}
                  className="mobile-only"
                  style={{
                    alignItems: 'center',
                    gap: '0.45rem',
                    margin: '0.9rem auto 0',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '100px',
                    background: 'rgba(22, 22, 26, 0.85)',
                    border: '1px solid rgba(255, 200, 0, 0.35)',
                    backdropFilter: 'blur(10px)',
                    color: '#FFC800',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                  }}
                >
                  <ChevronDown size={13} strokeWidth={2.5} style={{ marginTop: '1px' }} />
                  <span>Scroll To Explore</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: 1x2 Grid Carousel with Location Card (Scroll-Triggered Reveal) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', width: '100%' }}
          >
            {/* 1x2 Grid Image Carousel (synchronized) */}
            <HeroGridCarousel
              currentSlideIndex={currentSlideIndex}
              onSlideChange={setCurrentSlideIndex}
              isHovered={isCarouselHovered}
              setIsHovered={setIsCarouselHovered}
            />

            {/* Store Location & Hours Pill Card */}
            <div
              style={{
                width: '100%',
                maxWidth: '720px',
                padding: 'clamp(0.65rem, 1.8vw, 0.85rem) clamp(0.75rem, 2vw, 1.25rem)',
                background: 'rgba(22, 22, 26, 0.88)',
                border: '1px solid rgba(255, 200, 0, 0.35)',
                backdropFilter: 'blur(12px)',
                borderRadius: '14px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', color: '#FFFFFF', fontSize: 'clamp(0.75rem, 1.5vw, 0.82rem)', flex: 1, minWidth: '220px' }}>
                  <MapPin size={15} style={{ color: 'var(--wy-yellow)', flexShrink: 0, marginTop: '2px' }} />
                  <span suppressHydrationWarning style={{ lineHeight: 1.3 }}>
                    <strong style={{ color: 'var(--wy-yellow)' }}>Visit Us:</strong> Koforidua, Behind B Foster Bakery
                  </span>
                </div>

                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=6.094672706386784,-0.2603865047343695"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '6px',
                    background: 'var(--wy-yellow)',
                    color: '#000000',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    transition: 'all 0.15s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--wy-yellow)';
                  }}
                >
                  <Navigation size={11} style={{ transform: 'rotate(45deg)' }} />
                  <span>Directions</span>
                </a>
              </div>

              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)', width: '100%' }} />

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', color: '#D4D4D8', fontSize: 'clamp(0.72rem, 1.4vw, 0.78rem)' }}>
                <Clock size={14} style={{ color: 'var(--wy-yellow)', flexShrink: 0, marginTop: '2px' }} />
                <div style={{ lineHeight: 1.3 }}>
                  <strong style={{ color: 'var(--wy-yellow)' }}>Hours:</strong> Mon–Sat 8:30am–10:30pm | Sun 1pm–10pm
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
