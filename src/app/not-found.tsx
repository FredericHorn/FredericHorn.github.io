import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center">
        <span className="math-ornament text-4xl">∅</span>
        <h1 className="mt-4 font-display text-display-md text-ink-950">
          Page not found
        </h1>
        <p className="mt-3 text-ink-500">
          This page doesn't exist — like a solution to an infeasible LP.
        </p>
        <Link
          href="/"
          className="inline-block mt-8 px-6 py-3 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent-dark transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
