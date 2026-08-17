'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const GRID_SLIDES_1X2 = [
  // Slide 1 (1x2 pair)
  [
    { src: '/hero-grid (1).jpg', alt: 'Streetwear Drop 1', label: 'Fresh Apparel' },
    { src: '/hero-grid (2).jpg', alt: 'Streetwear Drop 2', label: 'Kicks & Sneakers' },
  ],
  // Slide 2 (1x2 pair)
  [
    { src: '/hero-grid (3).jpg', alt: 'Streetwear Drop 3', label: 'Luxury Fits' },
    { src: '/hero-grid (4).jpg', alt: 'Streetwear Drop 4', label: 'Trending Grails' },
  ],
  // Slide 3 (1x2 pair)
  [
    { src: '/hero-grid (5).jpg', alt: 'Streetwear Drop 5', label: 'Exclusive Drop' },
    { src: '/hero-grid (1).jpg', alt: 'Streetwear Drop 1', label: 'Urban Streetwear' },
  ],
  // Slide 4 (1x2 pair)
  [
    { src: '/hero-grid (2).jpg', alt: 'Streetwear Drop 2', label: 'Sneakers Edition' },
    { src: '/hero-grid (3).jpg', alt: 'Streetwear Drop 3', label: 'Premium Quality' },
  ],
  // Slide 5 (1x2 pair)
  [
    { src: '/hero-grid (4).jpg', alt: 'Streetwear Drop 4', label: 'Grail Collection' },
    { src: '/hero-grid (5).jpg', alt: 'Streetwear Drop 5', label: 'Limited Run' },
  ],
];

interface HeroGridCarouselProps {
  currentSlideIndex?: number;
  onSlideChange?: (index: number) => void;
  isHovered?: boolean;
  setIsHovered?: (hovered: boolean) => void;
}

export default function HeroGridCarousel({
  currentSlideIndex: externalIndex,
  onSlideChange,
  isHovered: externalHovered,
  setIsHovered: externalSetHovered,
}: HeroGridCarouselProps = {}) {
  const [internalSlideIndex, setInternalSlideIndex] = useState(0);
  const [internalHovered, setInternalHovered] = useState(false);

  const isControlled = externalIndex !== undefined;
  const currentSlideIndex = isControlled ? externalIndex : internalSlideIndex;
  const isHovered = externalHovered !== undefined ? externalHovered : internalHovered;
  const setHovered = externalSetHovered || setInternalHovered;

  // Auto rotate carousel every 4 seconds if uncontrolled
  useEffect(() => {
    if (isControlled || isHovered) return;
    const interval = setInterval(() => {
      setInternalSlideIndex((prev) => (prev + 1) % GRID_SLIDES_1X2.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isControlled, isHovered]);

  const handleNext = () => {
    const nextIndex = (currentSlideIndex + 1) % GRID_SLIDES_1X2.length;
    if (onSlideChange) onSlideChange(nextIndex);
    else setInternalSlideIndex(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = (currentSlideIndex - 1 + GRID_SLIDES_1X2.length) % GRID_SLIDES_1X2.length;
    if (onSlideChange) onSlideChange(prevIndex);
    else setInternalSlideIndex(prevIndex);
  };

  const handleGoTo = (index: number) => {
    if (onSlideChange) onSlideChange(index);
    else setInternalSlideIndex(index);
  };

  const currentPair = GRID_SLIDES_1X2[currentSlideIndex];

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '720px',
        margin: '0 auto',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top Floating Mini Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.8rem',
          padding: '0 0.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: 'var(--wy-yellow)',
              boxShadow: '0 0 10px var(--wy-yellow)',
              display: 'inline-block',
            }}
          />
          <span
            style={{
              color: '#FFFFFF',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            IN-STORE LOOKBOOK
          </span>
        </div>

        {/* Integrated Navigation & Counter Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.55rem',
            background: 'rgba(24, 24, 28, 0.85)',
            border: '1px solid rgba(255, 200, 0, 0.35)',
            backdropFilter: 'blur(12px)',
            borderRadius: '100px',
            padding: '0.28rem 0.7rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
          }}
        >
          <button
            onClick={handlePrev}
            aria-label="Previous slide"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--wy-yellow)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '2px',
            }}
          >
            <ChevronLeft size={16} />
          </button>

          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.9rem',
              color: '#FFFFFF',
              letterSpacing: '0.06em',
            }}
          >
            <span style={{ color: 'var(--wy-yellow)' }}>0{currentSlideIndex + 1}</span>
            <span style={{ color: 'rgba(255,255,255,0.3)', margin: '0 2px' }}>/</span>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>0{GRID_SLIDES_1X2.length}</span>
          </span>

          <button
            onClick={handleNext}
            aria-label="Next slide"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--wy-yellow)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '2px',
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* 1x2 Dual Frameless Floating Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlideIndex}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 'clamp(0.5rem, 2vw, 1.2rem)',
          }}
        >
          {currentPair.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.25 }}
              style={{
                position: 'relative',
                borderRadius: 'clamp(14px, 2.5vw, 22px)',
                overflow: 'hidden',
                background: '#121215',
                border: '1px solid rgba(255, 200, 0, 0.25)',
                aspectRatio: '1 / 1.25',
                width: '100%',
                maxHeight: '375px',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
              }}
            >
              {/* Product / Lookbook Photo */}
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 50vw, 390px"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                  filter: 'brightness(0.96) contrast(1.05)',
                  transition: 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="hover:scale-110"
                priority={index === 0}
              />

              {/* Top Left Tag Chip */}
              <div
                style={{
                  position: 'absolute',
                  top: 'clamp(0.5rem, 1.5vw, 0.9rem)',
                  left: 'clamp(0.5rem, 1.5vw, 0.9rem)',
                  padding: 'clamp(0.2rem, 0.8vw, 0.3rem) clamp(0.45rem, 1.2vw, 0.7rem)',
                  background: 'rgba(10, 10, 12, 0.75)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '100px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  pointerEvents: 'none',
                }}
              >
                <span
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: 'var(--wy-yellow)',
                  }}
                />
                <span
                  style={{
                    color: '#FFFFFF',
                    fontSize: 'clamp(0.6rem, 1.2vw, 0.68rem)',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  {index === 0 ? 'Featured' : 'Exclusive'}
                </span>
              </div>

              {/* Dark Gradient Overlay */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to top, rgba(10, 10, 12, 0.95) 0%, rgba(10, 10, 12, 0.3) 42%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />

              {/* Bottom Editorial Caption Card */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 'clamp(0.45rem, 1.5vw, 0.9rem)',
                  left: 'clamp(0.45rem, 1.5vw, 0.9rem)',
                  right: 'clamp(0.45rem, 1.5vw, 0.9rem)',
                  padding: 'clamp(0.45rem, 1.2vw, 0.7rem) clamp(0.55rem, 1.5vw, 0.95rem)',
                  background: 'rgba(18, 18, 22, 0.88)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: 'clamp(10px, 2vw, 14px)',
                  border: '1px solid rgba(255, 200, 0, 0.35)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.6)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p
                      style={{
                        color: '#FFFFFF',
                        fontSize: 'clamp(0.75rem, 1.8vw, 0.92rem)',
                        fontWeight: 800,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        lineHeight: 1.2,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        margin: 0,
                      }}
                    >
                      {item.label}
                    </p>
                    <p
                      style={{
                        color: 'var(--wy-yellow)',
                        fontSize: 'clamp(0.58rem, 1.2vw, 0.68rem)',
                        fontWeight: 600,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        marginTop: '2px',
                        marginBottom: 0,
                      }}
                    >
                      Wear Yung Drop
                    </p>
                  </div>

                  <span
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'rgba(255, 200, 0, 0.15)',
                      border: '1px solid rgba(255, 200, 0, 0.4)',
                      color: 'var(--wy-yellow)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    ↗
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Bottom Subtle Indicator Line */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.4rem',
          marginTop: '0.85rem',
        }}
      >
        {GRID_SLIDES_1X2.map((_, i) => (
          <button
            key={i}
            onClick={() => handleGoTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width: currentSlideIndex === i ? '24px' : '6px',
              height: '4px',
              borderRadius: '100px',
              background: currentSlideIndex === i ? 'var(--wy-yellow)' : 'rgba(255, 255, 255, 0.2)',
              boxShadow: currentSlideIndex === i ? '0 0 10px rgba(255, 200, 0, 0.6)' : 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 300ms ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}
