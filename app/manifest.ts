import { MetadataRoute } from 'next';

export const runtime = 'edge';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'WEAR YUNG | Streetwear & Luxury Grails',
    short_name: 'WEAR YUNG',
    description: 'Raw silhouettes, heavyweight luxury cuts, and limited timepiece drops.',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090B',
    theme_color: '#09090B',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
