import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-ink-100 mt-32">
      <div className="section-container py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-8">
          <div>
            <p className="font-display text-lg text-ink-800">Frederic Horn</p>
            <p className="text-sm text-ink-500 mt-1">
              Discrete Mathematics · Optimization · Mathematical Structures
            </p>
          </div>
          <div className="flex gap-8 text-sm text-ink-500">
            <Link href="/legal" className="hover:text-ink-800 transition-colors">
              Legal Notice
            </Link>
            <Link href="/legal#privacy" className="hover:text-ink-800 transition-colors">
              Privacy
            </Link>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-ink-100/50">
          <p className="text-xs text-ink-400 font-mono">
            No cookies · No tracking · No analytics
          </p>
        </div>
      </div>
    </footer>
  );
}
