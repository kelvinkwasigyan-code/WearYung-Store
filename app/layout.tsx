import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';
import { Bebas_Neue, Inter } from 'next/font/google';
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

export const metadata: Metadata = {
  title: {
    default: 'WEAR YUNG — Premium Streetwear & Accessories',
    template: '%s | WEAR YUNG',
  },
  description: 'Shop premium streetwear, sneakers, watches, bags, and accessories at WEAR YUNG. Authentic drops, curated for those who move different.',
  keywords: ['streetwear', 'sneakers', 'watches', 'accessories', 'fashion', 'premium', 'Nigeria'],
  openGraph: {
    title: 'WEAR YUNG — Premium Streetwear & Accessories',
    description: 'Shop premium streetwear, sneakers, watches, bags, and accessories.',
    type: 'website',
    locale: 'en_NG',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${inter.variable}`}>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

