import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import { CartProvider } from '@/context/CartContext';
import type { Metadata } from 'next';
import './globals.css';

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
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 60px)' }}>
        <CartProvider>
          <Navbar />
          <main style={{ flex: 1 }}>
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <MobileBottomNav />
        </CartProvider>
      </body>
    </html>
  );
}

