'use client';

import Link from 'next/link';
import StatsBar from './StatsBar';
import { motion, type Variants } from 'framer-motion';
import { Fragment, useState, useEffect } from 'react';

export default function HeroSection() {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey(prev => prev + 1);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const words = [
    { text: 'DRESS', color: '#FFFFFF', glow: false, br: false },
    { text: 'LIKE', color: '#FFFFFF', glow: false, br: true },
    { text: 'YOU', color: '#FFFFFF', glow: false, br: false },
    { text: 'OWN', color: '#FFC800', glow: true, br: true },
    { text: 'THE', color: '#FFC800', glow: true, br: false },
    { text: 'ROOM', color: '#FFC800', glow: true, br: false },
  ];

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
    <section
      style={{
        position: 'relative',
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 70% 50%, rgba(255,200,0,0.08) 0%, transparent 60%), var(--wy-canvas)',
      }}
    >
      {/* Background Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(var(--wy-border) 1px, transparent 1px), linear-gradient(90deg, var(--wy-border) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          opacity: 0.3,
        }}
      />

      {/* Yellow accent glow circle */}
      <div
        style={{
          position: 'absolute',
          right: '-10%',
          top: '20%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,200,0,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container-wy" style={{ position: 'relative', zIndex: 1, paddingTop: '2rem', paddingBottom: '4rem' }}>
        <div style={{ maxWidth: '760px' }}>
          {/* Pill badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255,200,0,0.1)',
              border: '1px solid rgba(255,200,0,0.3)',
              borderRadius: '100px',
              padding: '0.4rem 1rem',
              marginBottom: '1.5rem',
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
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              New Drop Available
            </span>
          </div>

          {/* Headline */}
          <motion.h1
            key={animationKey}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3.5rem, 10vw, 7rem)',
              letterSpacing: '0.04em',
              lineHeight: 1,
              marginBottom: '1.5rem',
            }}
          >
            {words.map((word, i) => (
              <Fragment key={i}>
                <motion.span
                  variants={itemVariants}
                  style={{
                    display: 'inline-block',
                    color: word.color,
                    textShadow: word.glow ? '0 0 15px rgba(255,200,0,0.3)' : 'none',
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
            style={{
              color: 'var(--wy-muted)',
              fontSize: '1.1rem',
              lineHeight: 1.7,
              maxWidth: '480px',
              marginBottom: '2.5rem',
            }}
          >
            Premium streetwear, authentic sneakers, luxury watches & more. 
            Curated for those who move different.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/shop" id="hero-shop-btn" className="btn btn-primary btn-lg">
              Shop Now
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/shop?category=sneakers" id="hero-sneakers-btn" className="btn btn-ghost btn-lg">
              View Sneakers
            </Link>
          </div>

          <StatsBar />
        </div>
      </div>
    </section>
  );
}
