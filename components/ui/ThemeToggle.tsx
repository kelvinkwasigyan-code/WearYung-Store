'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  variant?: 'icon' | 'pill';
}

export default function ThemeToggle({ className = '', variant = 'icon' }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render placeholder with identical dimensions to prevent hydration layout shift
    return (
      <div
        className={`w-9 h-9 rounded-full bg-black/10 dark:bg-white/10 ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isLight = resolvedTheme === 'light';

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200 border cursor-pointer ${
          isLight
            ? 'bg-zinc-100 border-zinc-200 text-zinc-900 hover:bg-zinc-200'
            : 'bg-[#18181B] border-[#27272A] text-zinc-200 hover:bg-[#202025]'
        } ${className}`}
      >
        <div className="relative w-5 h-5 flex items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            {isLight ? (
              <motion.div
                key="sun"
                initial={{ rotate: -90, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: 90, scale: 0 }}
                transition={{ duration: 0.2 }}
                className="text-amber-500"
              >
                <Sun size={18} strokeWidth={2.4} />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ rotate: 90, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: -90, scale: 0 }}
                transition={{ duration: 0.2 }}
                className="text-[#FFC800]"
              >
                <Moon size={18} strokeWidth={2.4} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <span className="text-xs font-bold uppercase tracking-wider">
          {isLight ? 'Light Mode' : 'Dark Mode'}
        </span>
      </button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      aria-label={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      className={`relative p-2 rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer border-none ${
        isLight
          ? 'bg-black/10 hover:bg-black/20 text-zinc-900'
          : 'bg-black/20 hover:bg-black/35 text-[#000000]'
      } ${className}`}
      style={{ width: '36px', height: '36px' }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isLight ? (
          <motion.div
            key="sun-icon"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center text-zinc-900"
          >
            <Sun size={18} strokeWidth={2.4} />
          </motion.div>
        ) : (
          <motion.div
            key="moon-icon"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center text-black"
          >
            <Moon size={18} strokeWidth={2.4} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
