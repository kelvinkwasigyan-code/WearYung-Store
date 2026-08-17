import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import MobileScrollProgress from '@/components/MobileScrollProgress';
import PWARegister from '@/components/PWARegister';
import { CartProvider } from '@/context/CartContext';
import { Analytics } from '@vercel/analytics/next';
import { Bebas_Neue, Inter } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import './globals.css';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#09090B',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: "WEAR YUNG | Premium Streetwear & Accessories",
    template: "%s | WEAR YUNG",
  },
  description: "Curated premium streetwear, luxury watches, and sneakers.",
  keywords: ['streetwear', 'sneakers', 'watches', 'accessories', 'fashion', 'premium', 'Ghana', 'Nigeria'],
  openGraph: {
    title: "WEAR YUNG | Premium Streetwear & Accessories",
    description: "Curated premium streetwear, luxury watches, and sneakers.",
    type: 'website',
    locale: 'en_GH',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'WEAR YUNG',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/icons/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${bebasNeue.variable} ${inter.variable}`}>
      <body className="overflow-x-hidden" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <CartProvider>
          <MobileScrollProgress />
          <Navbar />
          <main style={{ flex: 1, overflowX: 'hidden' }}>
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <MobileBottomNav />
          <PWARegister />
          <Analytics />
        </CartProvider>
      </body>
    </html>
  );
}
