import { STORE_LOCATION } from '@/lib/constants';

export { STORE_LOCATION };

interface StoreMapProps {
  className?: string;
}

export default function StoreMap({ className = '' }: StoreMapProps) {
  return (
    <div className={`w-full h-48 sm:h-60 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/50 ${className}`}>
      <iframe
        title={STORE_LOCATION.name}
        width="100%"
        height="100%"
        style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }} // Dark-mode styled map
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://maps.google.com/maps?q=${STORE_LOCATION.lat},${STORE_LOCATION.lng}&hl=en&z=17&output=embed`}
      />
    </div>
  );
}
