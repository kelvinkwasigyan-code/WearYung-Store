import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { CartProvider } from '@/context/CartContext';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: "WEAR YUNG | Premium Streetwear & Accessories",
    template: "%s | WEAR YUNG",
  },
  description: "Curated premium streetwear, luxury watches, and sneakers.",
  keywords: ['streetwear', 'sneakers', 'watches', 'accessories', 'fashion', 'premium', 'Nigeria'],
  openGraph: {
    title: "WEAR YUNG | Premium Streetwear & Accessories",
    description: "Curated premium streetwear, luxury watches, and sneakers.",
    type: 'website',
    locale: 'en_NG',
  },
  icons: {
    icon: "/favicon.jpeg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <CartProvider>
          <Navbar />
          <main style={{ flex: 1 }}>
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}

