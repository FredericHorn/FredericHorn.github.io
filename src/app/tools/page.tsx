import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

export const metadata: Metadata = {
  title: 'Tools',
  description: 'Interactive mathematical visualizations for exploration and play.',
};

const tools = [
  {
    title: 'How many dimensions does politics have?',
    description: 'An interactive essay on PCA - real Wahl-O-Mat 2025 data reveals how many axes German party politics really has.',
    href: '/tools/politics-dimensions',
    tag: 'Linear Algebra · Interactive',
  },
  {
    title: 'Planimeter',
    description:
      'A polar planimeter you can actually use. Place the pole, set the tracer arm, trace a contour. The measuring wheel earns every digit in real time.',
    href: '/tools/planimeter',
    tag: 'Green’s Theorem · Interactive',
  },
  {
    title: "Pascal's Triangle",
    description: 'Explore the patterns hidden in Pascal\'s triangle. Highlight divisibility, diagonals, and modular arithmetic, all interactively.',
    href: '/tools/pascal-triangle',
    tag: 'Combinatorics · Interactive',
  },
  {
    title: 'More tools coming',
    description: 'Additional interactive visualizations and mathematical explorations will appear here over time.',
    tag: 'Coming soon',
  },
];

export default function ToolsPage() {
  return (
    <>
      <PageHeader
        title="Tools"
        subtitle="Interactive visualizations for mathematical exploration. Play with structure, discover patterns, build intuition."
        ornament="⚙"
      />

      <div className="section-container pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {tools.map((tool, i) => (
            <AnimatedSection key={tool.title} delay={i * 0.1}>
              <Card {...tool} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </>
  );
}
