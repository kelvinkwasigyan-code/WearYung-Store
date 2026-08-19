'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AppDownloadButtonProps {
  variant?: 'floating' | 'solid';
}

export default function AppDownloadButton({ variant = 'solid' }: AppDownloadButtonProps) {
  const [dismissed, setDismissed] = useState(false);
  const [isInApp, setIsInApp] = useState(true); // Default hidden until verified on client

  useEffect(() => {
    const ua = window.navigator.userAgent;
    // Hide if inside custom app, standard Android WebView, or standalone PWA
    const isApp =
      ua.includes('WearYungApp') ||
      ua.includes('; wv') ||
      window.matchMedia('(display-mode: standalone)').matches;
    setIsInApp(isApp);

    if (!isApp && variant === 'floating') {
      // Auto-dismiss floating pill after 2 minutes (120,000 ms)
      const timer = setTimeout(() => {
        setDismissed(true);
      }, 120000);

      return () => clearTimeout(timer);
    }
  }, [variant]);

  if (isInApp || (dismissed && variant === 'floating')) return null;

  if (variant === 'floating') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.92 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-18 right-3 z-50 md:bottom-5 md:right-5"
        >
          <div className="group relative flex items-center rounded-full border border-[#FFC800]/30 bg-zinc-950/90 p-1 pl-1.5 pr-3 shadow-[0_8px_30px_rgba(0,0,0,0.85)] backdrop-blur-xl transition-all duration-300 hover:border-[#FFC800] hover:shadow-[0_8px_30px_rgba(255,200,0,0.2)]">
            
            {/* Dismiss Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDismissed(true);
              }}
              className="absolute -top-1.5 -left-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-zinc-800 hover:text-white"
              title="Dismiss"
              aria-label="Dismiss app download button"
            >
              <X className="h-2.5 w-2.5" />
            </button>

            <a
              href="/app-release.apk"
              download="wear-yung.apk"
              className="flex items-center gap-2.5 no-underline"
            >
              {/* Compact Icon Badge */}
              <div className="relative flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-full bg-[#FFC800] text-black shadow-sm transition-transform duration-200 group-hover:scale-105">
                <Smartphone className="h-3.5 w-3.5" strokeWidth={2.4} />
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
              </div>

              {/* Text Info */}
              <div className="flex flex-col text-left leading-tight">
                <span className="text-[9px] font-black uppercase tracking-wider text-[#FFC800]">
                  Official App
                </span>
                <span className="text-[11px] font-extrabold tracking-tight text-white transition-colors group-hover:text-[#FFC800]">
                  Get Android App
                </span>
              </div>

              {/* Action Download Icon */}
              <div className="ml-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-zinc-300 transition-colors group-hover:bg-[#FFC800] group-hover:text-black">
                <Download className="h-3 w-3" strokeWidth={2.5} />
              </div>
            </a>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <a
      href="/app-release.apk"
      download="wear-yung.apk"
      className="inline-flex items-center gap-2 px-1 py-1 text-xs font-black uppercase tracking-wider text-[#FFC800] no-underline transition-all duration-200 hover:opacity-80 active:scale-95"
    >
      <Download className="h-4 w-4 text-[#FFC800]" strokeWidth={2.5} />
      <span>Download .APK</span>
    </a>
  );
}
