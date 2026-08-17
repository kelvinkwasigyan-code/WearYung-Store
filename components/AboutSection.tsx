'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Clock, Navigation, ArrowRight, MessageCircle } from 'lucide-react';

export default function AboutSection() {
  return (
    <section style={{
      background: 'var(--wy-canvas)',
      padding: 'clamp(3.5rem, 6vw, 5rem) 0',
      borderTop: '1px solid var(--wy-border)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '-10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, var(--wy-yellow-glow) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container-wy">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(2rem, 4vw, 3.5rem)',
          alignItems: 'center',
          maxWidth: '1100px',
          margin: '0 auto',
        }}>
          {/* LEFT: CEO Portrait Frame */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '420px', margin: '0 auto' }}>
            <div style={{
              position: 'relative',
              width: '100%',
              height: 'clamp(290px, 40vh, 380px)',
              borderRadius: '18px',
              overflow: 'hidden',
              background: 'var(--wy-surface)',
              border: '1px solid var(--wy-border)',
              boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.4), 0 0 25px var(--wy-yellow-glow)',
            }}>
              <Image
                src="/Ceo-about.jpeg"
                alt="Daniel Mante — CEO & Founder of Wear Yung Collections"
                fill
                sizes="(max-width: 768px) 100vw, 420px"
                style={{ objectFit: 'cover' }}
              />

              {/* Gradient Scrim at bottom */}
              <div style={{
                position: 'absolute',
                inset: '0',
                background: 'linear-gradient(to top, rgba(9, 9, 11, 0.88) 0%, rgba(9, 9, 11, 0.2) 40%, transparent 70%)',
                pointerEvents: 'none',
              }} />

              {/* Floating Name Badge */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: '1rem',
                  right: '1rem',
                  padding: '0.75rem 1rem',
                  background: 'rgba(18, 18, 20, 0.85)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 200, 0, 0.3)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <h4 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                    color: '#FFFFFF',
                    letterSpacing: '0.04em',
                    margin: '0 0 0.15rem',
                    lineHeight: 1.1,
                  }}>
                    DANIEL MANTE
                  </h4>
                  <p style={{
                    fontSize: 'clamp(0.62rem, 1.2vw, 0.72rem)',
                    color: 'var(--wy-yellow)',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    margin: 0,
                  }}>
                    CEO & Founder &bull; Wear Yung Collections
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* RIGHT: About Narrative & Mission */}
          <div>
            {/* Tagline pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '999px',
              background: 'rgba(255, 200, 0, 0.08)',
              border: '1px solid rgba(255, 200, 0, 0.25)',
              color: 'var(--wy-yellow)',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '1rem',
            }}>
              <span>Behind The Brand</span>
            </div>

            {/* Headline */}
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: 'var(--wy-text)',
              letterSpacing: '0.04em',
              lineHeight: 1.15,
              marginBottom: '1.25rem',
              textTransform: 'uppercase',
            }}>
              MODERN MENSWEAR FOR <br />
              <span style={{ color: 'var(--wy-yellow)' }}>THE TRENDY GENTLEMAN</span>
            </h2>

            {/* Founder Note */}
            <div style={{
              position: 'relative',
              paddingLeft: '1.25rem',
              borderLeft: '3px solid var(--wy-yellow)',
              marginBottom: '1.75rem',
            }}>
              <p suppressHydrationWarning style={{
                fontSize: 'clamp(0.95rem, 1.8vw, 1.08rem)',
                color: '#E4E4E7',
                lineHeight: 1.7,
                margin: 0,
              }}>
                &ldquo;My name is <strong>Daniel Mante</strong>, CEO of Wear Yung Collections. In Koforidua, Ghana, I bring modern and stylish menswear designed for the youthful and trendy gentleman. I offer quality, affordable fashion that keeps you looking sharp, confident, and effortlessly stylish.&rdquo;
              </p>
            </div>

            {/* Location & Hours meta card */}
            <div suppressHydrationWarning style={{
              background: '#141416',
              borderRadius: '12px',
              border: '1px solid #27272A',
              padding: '1rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              marginBottom: '1.75rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#FFFFFF' }}>
                <MapPin size={16} style={{ color: '#FFC800', flexShrink: 0 }} />
                <span>Koforidua, Behind B Foster Bakery</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: '#A1A1AA' }}>
                <Clock size={15} style={{ color: '#FFC800', flexShrink: 0 }} />
                <span>Mon–Sat 8:30am–10:30pm &bull; Sun 1pm–10pm</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=6.094672706386784,-0.2603865047343695"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '8px',
                  background: 'rgba(255, 200, 0, 0.1)',
                  border: '1px solid rgba(255, 200, 0, 0.35)',
                  color: '#FFC800',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#FFC800';
                  e.currentTarget.style.color = '#000000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 200, 0, 0.1)';
                  e.currentTarget.style.color = '#FFC800';
                }}
              >
                <Navigation size={13} style={{ transform: 'rotate(45deg)' }} />
                <span>Get Directions</span>
              </a>

              <a
                href="https://wa.me/233545355585?text=Hello%20Daniel%20Mante%20%26%20Wear%20Yung%20Team,%20I%20need%20assistance"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '8px',
                  background: '#18181B',
                  border: '1px solid #3F3F46',
                  color: '#FFFFFF',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#FFC800';
                  e.currentTarget.style.color = '#FFC800';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#3F3F46';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
              >
                <MessageCircle size={15} style={{ color: '#10B981' }} />
                <span>Support</span>
                <ArrowRight size={14} />
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
