'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export default function MobileScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{
        scaleX,
        transformOrigin: '0%',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '2.5px',
        background: 'linear-gradient(90deg, #FFC800 0%, #FFDF00 50%, #FFA500 100%)',
        boxShadow: '0 0 10px rgba(255, 200, 0, 0.8), 0 0 4px #FFC800',
        zIndex: 99,
        pointerEvents: 'none',
      }}
      className="mobile-only"
    />
  );
}
