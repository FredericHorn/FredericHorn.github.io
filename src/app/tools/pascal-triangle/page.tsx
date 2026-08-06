import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { PascalTriangle } from '@/components/tools/PascalTriangle';

export const metadata: Metadata = {
  title: "Pascal's Triangle",
  description: 'Interactive exploration of Pascal\'s triangle — modular patterns, Fibonacci connections, and fractal structure.',
};

export default function PascalTrianglePage() {
  return (
    <>
      <PageHeader
        title="Pascal's Triangle"
        subtitle="One of the most studied objects in mathematics — and still full of surprises. Explore its patterns interactively."
        ornament="△"
      />

      <div className="section-container pb-24">
        <div className="bg-white/60 border border-ink-100 rounded-lg p-6 sm:p-10">
          <PascalTriangle />
        </div>

        <div className="mt-16 max-w-reading">
          <h2 className="font-display text-display-sm text-ink-900 mb-4">
            About this visualization
          </h2>
          <div className="space-y-4 text-ink-600 leading-relaxed">
            <p>
              Pascal's triangle is built from a simple rule: each entry is the sum of the
              two entries above it. Despite this simplicity, the triangle encodes a remarkable
              wealth of mathematical structure.
            </p>
            <p>
              Use the controls above to switch between different highlight modes.
              <strong> Modular coloring</strong> reveals fractal self-similarity.
              <strong> Fibonacci mode</strong> highlights entries that are Fibonacci numbers.
              <strong> Diagonal mode</strong> shows the figurate number sequences.
              Hover over any cell to see its binomial coefficient value.
            </p>
            <p>
              Try increasing the number of rows and switching to mod 3 or mod 5 — the
              patterns become increasingly intricate and beautiful.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
