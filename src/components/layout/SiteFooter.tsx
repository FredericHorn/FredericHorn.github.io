'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './Footer';

/**
 * Full-screen tools fill the viewport and must not scroll, so the site footer
 * would add a scrollbar below them. It steps aside on those routes; every
 * other page renders the footer exactly as before.
 */
const FULL_SCREEN_ROUTES = ['/tools/planimeter'];

export function SiteFooter() {
  const pathname = usePathname();
  if (FULL_SCREEN_ROUTES.some((r) => pathname?.startsWith(r))) return null;
  return <Footer />;
}
