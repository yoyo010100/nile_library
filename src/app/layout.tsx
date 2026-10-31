import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import SmoothScroll from '@/components/SmoothScroll';
import './globals.css';

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nile University Library — Where Knowledge Flows',
  description:
    'Nile University Library: Search 165,000+ volumes, reserve study rooms, generate digital passes, and access cutting-edge research from Egypt\'s leading academic institution.',
  keywords: ['Nile University', 'library', 'academic', 'Egypt', 'research', 'study rooms', 'digital library'],
  openGraph: {
    title: 'Nile University Library',
    description: 'Where Knowledge Flows — 45,000+ printed volumes, 120,000+ digital journals, 24/7 research hub.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#020818',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="bg-slate-950 font-sans text-slate-100 antialiased">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
