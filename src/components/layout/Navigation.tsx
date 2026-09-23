'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';

const navItems = [
  { href: '/research', label: 'Research' },
  { href: '/activities', label: 'Activities' },
  { href: '/tools', label: 'Tools' },
  { href: '/about', label: 'About' },
];

function LanguageToggle({ className = '' }: { className?: string }) {
  const { lang, toggle } = useLanguage();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle language"
      className={`flex items-center gap-1 rounded-full border border-ink-200/60 px-2.5 py-1 text-xs font-medium tracking-wide text-ink-700 hover:text-accent hover:border-accent/50 transition-colors ${className}`}
    >
      <span className={lang === 'en' ? 'text-ink-950 font-semibold' : ''}>EN</span>
      <span className="text-ink-300">/</span>
      <span className={lang === 'de' ? 'text-ink-950 font-semibold' : ''}>DE</span>
    </button>
  );
}

export function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const showLanguageToggle = pathname?.startsWith('/tools/politics-dimensions');

  // Full-screen tools bring their own chrome and must not scroll; the site
  // header would overlap their toolbar, so it steps aside on those routes.
  const fullScreenTool = pathname?.startsWith('/tools/planimeter');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (fullScreenTool) return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-chalk/90 backdrop-blur-md shadow-sm shadow-ink-200/10'
          : 'bg-transparent'
      }`}
    >
      <nav className="section-container flex items-center justify-between h-16 sm:h-20">
        <Link
          href="/"
          className="font-display text-xl sm:text-2xl font-semibold text-ink-950 tracking-tight hover:text-accent transition-colors"
        >
          Frederic Horn
        </Link>

        {/* Desktop navigation */}
        <ul className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`nav-link text-sm font-medium tracking-wide uppercase ${
                  pathname?.startsWith(item.href)
                    ? 'text-ink-950 after:!w-full'
                    : ''
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
          {showLanguageToggle && (
            <li>
              <LanguageToggle />
            </li>
          )}
        </ul>

        {/* Mobile hamburger + language toggle */}
        <div className="md:hidden flex items-center gap-3">
          {showLanguageToggle && <LanguageToggle />}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="relative w-8 h-8 flex flex-col justify-center items-center gap-1.5"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-px bg-ink-800 transition-all duration-300 ${
                mobileOpen ? 'rotate-45 translate-y-[3.5px]' : ''
              }`}
            />
            <span
              className={`block w-5 h-px bg-ink-800 transition-all duration-300 ${
                mobileOpen ? '-rotate-45 -translate-y-[3.5px]' : ''
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden bg-chalk/95 backdrop-blur-md border-t border-ink-100"
          >
            <ul className="section-container py-6 flex flex-col gap-4">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block text-lg font-body ${
                      pathname?.startsWith(item.href)
                        ? 'text-accent font-medium'
                        : 'text-ink-700'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
