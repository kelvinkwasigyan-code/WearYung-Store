'use client';

import { ShieldCheck, Truck, Crown, Headset, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ValueProps() {
  const valueProps = [
    {
      num: '01',
      icon: <ShieldCheck size={28} strokeWidth={2.2} />,
      title: '100% AUTHENTIC',
      badge: 'Guaranteed',
      desc: 'Every garment, sneaker, and timepiece is hand-inspected and verified for authenticity.',
    },
    {
      num: '02',
      icon: <Truck size={28} strokeWidth={2.2} />,
      title: 'FAST DISPATCH',
      badge: 'Nationwide',
      desc: 'Rapid and discreet express shipping across Koforidua, Accra, Kumasi, and nationwide.',
    },
    {
      num: '03',
      icon: <Crown size={28} strokeWidth={2.2} />,
      title: 'PREMIUM QUALITY',
      badge: 'Curated',
      desc: 'Heavyweight cottons, custom cuts, and durable luxury tailoring that last and turn heads.',
    },
    {
      num: '04',
      icon: <Headset size={28} strokeWidth={2.2} />,
      title: 'VIP SUPPORT',
      badge: 'Always Live',
      desc: 'Direct contact with Daniel and our styling staff on WhatsApp for sizing and delivery.',
    },
  ];

  return (
    <section
      style={{
        background: 'var(--wy-canvas)',
        padding: 'clamp(3.5rem, 6vw, 5.5rem) 0',
        borderTop: '1px solid var(--wy-border)',
        borderBottom: '1px solid var(--wy-border)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle background ambient gold glow */}
      <div
        style={{
          position: 'absolute',
          bottom: '-20%',
          right: '10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, var(--wy-yellow-glow) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container-wy">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto clamp(2rem, 4vw, 3.25rem)' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '100px',
              background: 'rgba(255, 200, 0, 0.08)',
              border: '1px solid rgba(255, 200, 0, 0.28)',
              color: 'var(--wy-yellow)',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '0.85rem',
            }}
          >
            <span>The Wear Yung Standard</span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.1rem, 5vw, 3.5rem)',
              color: 'var(--wy-text)',
              letterSpacing: '0.04em',
              lineHeight: 1.05,
              marginBottom: '0.65rem',
              textTransform: 'uppercase',
            }}
          >
            WHY WEAR <span style={{ color: 'var(--wy-yellow)' }}>YUNG?</span>
          </h2>

          <p
            style={{
              color: 'var(--wy-muted)',
              fontSize: 'clamp(0.85rem, 1.4vw, 1rem)',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Authenticity, premium cuts, and white-glove customer service with every order.
          </p>
        </div>

        {/* 4-Card Grid on Desktop / 2x2 Grid on Mobile */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(150px, 42vw, 260px), 1fr))',
            gap: 'clamp(0.75rem, 2vw, 1.5rem)',
          }}
        >
          {valueProps.map((feature, idx) => (
            <motion.div
              key={feature.title}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              className="value-prop-card"
              style={{
                position: 'relative',
                background: 'var(--wy-surface)',
                borderRadius: '18px',
                border: '1px solid var(--wy-border)',
                padding: 'clamp(1.15rem, 2.5vw, 1.75rem) clamp(1rem, 2vw, 1.35rem)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.1)',
                transition: 'border-color 0.3s, box-shadow 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 200, 0, 0.45)';
                e.currentTarget.style.boxShadow = '0 18px 40px rgba(0, 0, 0, 0.7), 0 0 20px rgba(255, 200, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)';
              }}
            >
              {/* Card Header: Icon + Number & Badge */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.15rem' }}>
                {/* Glowing Icon Container */}
                <div
                  style={{
                    width: 'clamp(44px, 5vw, 52px)',
                    height: 'clamp(44px, 5vw, 52px)',
                    borderRadius: '14px',
                    background: 'rgba(255, 200, 0, 0.12)',
                    border: '1px solid rgba(255, 200, 0, 0.3)',
                    color: '#FFC800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(255, 200, 0, 0.18)',
                  }}
                >
                  {feature.icon}
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.25rem',
                      color: 'rgba(255, 255, 255, 0.18)',
                      letterSpacing: '0.05em',
                      display: 'block',
                      lineHeight: 1,
                    }}
                  >
                    {feature.num}
                  </span>
                  <span
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      color: '#FFC800',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      background: 'rgba(255, 200, 0, 0.1)',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '100px',
                      display: 'inline-block',
                      marginTop: '0.25rem',
                    }}
                  >
                    {feature.badge}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
                    letterSpacing: '0.06em',
                    color: 'var(--wy-text)',
                    margin: '0 0 0.45rem',
                    textTransform: 'uppercase',
                    lineHeight: 1.15,
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    color: 'var(--wy-muted)',
                    fontSize: 'clamp(0.78rem, 1.2vw, 0.88rem)',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
