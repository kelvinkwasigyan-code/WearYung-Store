import type { Metadata } from 'next';
import AboutSection from '@/components/AboutSection';
import ValueProps from '@/components/ValueProps';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'About Us — WEAR YUNG',
  description: 'Learn more about Daniel Mante, CEO of Wear Yung Collections, and our mission to provide modern and stylish menswear in Koforidua, Ghana.',
};

export default function AboutPage() {
  return (
    <div style={{ minHeight: '80vh', background: 'var(--wy-canvas)', padding: '2rem 0 5rem' }}>
      <AboutSection />
      <div style={{ marginTop: '2rem' }}>
        <ValueProps />
      </div>
    </div>
  );
}
