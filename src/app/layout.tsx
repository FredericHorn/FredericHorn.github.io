import type { Metadata } from 'next';
import './globals.css';
import 'katex/dist/katex.min.css';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { LanguageProvider } from '@/lib/LanguageContext';

export const metadata: Metadata = {
  title: {
    default: 'Frederic — Mathematician',
    template: '%s — Frederic',
  },
  description: 'Personal academic website. Research in discrete mathematics, combinatorial optimization, and mathematical structures.',
  metadataBase: new URL('https://example.com'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="grain">
      <body className="min-h-screen flex flex-col">
        <LanguageProvider>
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
