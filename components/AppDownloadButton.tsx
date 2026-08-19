'use client';

import React, { useState } from 'react';
import { Smartphone, Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AppDownloadButtonProps {
  variant?: 'floating' | 'solid';
}

export default function AppDownloadButton({ variant = 'solid' }: AppDownloadButtonProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed && variant === 'floating') return null;

  if (variant === 'floating') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.92 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-20 right-4 z-50 md:bottom-6 md:right-6"
        >
          <div className="group relative flex items-center rounded-2xl border border-[#FFC800]/30 bg-zinc-950/90 p-2 pr-4 shadow-[0_12px_40px_rgba(0,0,0,0.85),0_0_20px_rgba(255,200,0,0.15)] backdrop-blur-xl transition-all duration-300 hover:border-[#FFC800] hover:shadow-[0_12px_40px_rgba(0,0,0,0.9),0_0_30px_rgba(255,200,0,0.25)]">
            
            {/* Dismiss Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDismissed(true);
              }}
              className="absolute -top-2 -left-2 flex h-5.5 w-5.5 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-zinc-800 hover:text-white"
              title="Dismiss"
              aria-label="Dismiss app download button"
            >
              <X className="h-3 w-3" />
            </button>

            <a
              href="/app-release.apk"
              download="wear-yung.apk"
              className="flex items-center gap-3.5 no-underline"
            >
              {/* Icon Badge with live status dot */}
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFC800] to-[#E6B200] text-black shadow-md transition-transform duration-300 group-hover:scale-105">
                <Smartphone className="h-5 w-5" strokeWidth={2.4} />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full border border-zinc-950 bg-emerald-500"></span>
                </span>
              </div>

              {/* Text Info */}
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FFC800]">
                    Official App
                  </span>
                </div>
                <span className="text-xs font-extrabold tracking-wide text-white transition-colors group-hover:text-[#FFC800]">
                  Get Android App
                </span>
              </div>

              {/* Action Button */}
              <div className="ml-1 flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-zinc-300 transition-colors group-hover:bg-[#FFC800] group-hover:text-black">
                <Download className="h-4 w-4" strokeWidth={2.5} />
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
      className="inline-flex items-center gap-2.5 rounded-xl border border-[#FFC800]/40 bg-zinc-900 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-[#FFC800] no-underline transition-all duration-300 hover:bg-[#FFC800] hover:text-black hover:shadow-[0_0_20px_rgba(255,200,0,0.3)] active:scale-95"
    >
      <Download className="h-4 w-4" strokeWidth={2.5} />
      <span>Download .APK</span>
    </a>
  );
}
