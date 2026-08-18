import React from 'react';
import { STORE_LOCATION } from '@/lib/constants';

interface StoreLocationMapProps {
  className?: string;
  heightClass?: string;
}

export default function StoreLocationMap({
  className = '',
  heightClass = 'h-48 sm:h-64',
}: StoreLocationMapProps) {
  return (
    <div className={`relative w-full ${heightClass} rounded-2xl overflow-hidden border border-zinc-800 bg-[#121214] group ${className}`}>
      {/* Dark-mode styled embedded Google Map iframe (No API key required) */}
      <iframe
        title={STORE_LOCATION.name}
        width="100%"
        height="100%"
        style={{
          border: 0,
          filter: 'invert(90%) hue-rotate(180deg) contrast(1.1) brightness(0.9)',
          pointerEvents: 'auto',
        }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://maps.google.com/maps?q=${STORE_LOCATION.lat},${STORE_LOCATION.lng}&hl=en&z=17&output=embed`}
      />

      {/* Floating Directions Badge / Quick Link */}
      <a
        href={STORE_LOCATION.directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between px-3 py-2 rounded-xl bg-black/80 backdrop-blur-md border border-zinc-700/60 shadow-lg text-xs transition-all hover:bg-black/95 hover:border-yellow-400 group/btn"
      >
        <span className="font-mono text-zinc-300 group-hover/btn:text-yellow-400 transition-colors flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping inline-block" />
          {STORE_LOCATION.name}
        </span>
        <span className="text-yellow-400 font-semibold flex items-center gap-1">
          Open Directions ↗
        </span>
      </a>
    </div>
  );
}

export { STORE_LOCATION };
