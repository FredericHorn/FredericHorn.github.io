import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

export const metadata: Metadata = {
  title: 'Research',
  description: 'Research in polyhedral combinatorics, complex cut polytopes, and combinatorial optimization.',
};

export default function ResearchPage() {
  return (
    <>
      <PageHeader
        title="Research"
        subtitle="My work lies at the intersection of polyhedral combinatorics, integer programming, and finite group theory. I study the geometry of discrete objects and what it reveals about all the problems we can model."
        ornament="∫"
      />

      <div className="section-container pb-24">
        {/* Main Research Project */}
        <AnimatedSection>
          <div className="mb-16">
            <span className="text-xs font-mono text-accent uppercase tracking-wider">
              Main Project
            </span>
            <div className="mt-4 border border-accent/20 bg-accent-muted/30 rounded-lg p-8 sm:p-10">
              <h2 className="font-display text-display-sm text-ink-950">
                Cyclic Transversal Polytopes over Finite Abelian Groups
              </h2>
              <p className="mt-4 text-ink-600 leading-relaxed max-w-wide">
                Binary cyclic transversal polytopes unify parity-type constraints in combinatorial
                optimization. Frede, Kaibel, Merkert created this modelling framework that can 
                explain facets of many well known combinatorial polytopes at once. 
                My work extends this framework to arbitrary finite abelian groups,
                uncovering a structural connection to Gomory&apos;s master polyhedra: every facet of a
                master polyhedron induces a family of facets for the corresponding cyclic transversal
                polytope via a systematic translation. Consequences include a complete facet description
                for G = ℤ₃, polynomial-time separation, and new formulations for complex cut polytopes
                and other combinatorial problems.
              </p>
              <div className="mt-6">
                <span
                  className="group relative inline-flex items-center px-5 py-2.5 bg-ink-300 text-ink-500 text-sm font-medium rounded-md cursor-not-allowed"
                >
                  Explore this research →
                  <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-ink-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                    Under construction
                  </span>
                </span>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Research Interests 
        <AnimatedSection delay={0.15}>
          <h2 className="font-display text-display-sm text-ink-900 mb-8">
            Research Interests
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card
              title="Polyhedral Combinatorics"
              description="Facial structure of polytopes arising from combinatorial optimization problems. Cut polytopes, boolean quadric polytopes, and their generalizations."
              tag="Geometry"
            />
            <Card
              title="Combinatorial Optimization"
              description="Integer programming, LP relaxations, and the interplay between structure and solvability."
              tag="Optimization"
            />
            <Card
              title="Algebraic Methods"
              description="Group-theoretic and harmonic-analytic techniques in discrete optimization. Gomory relaxations and group problems."
              tag="Algebra"
            />
            <Card
              title="Computational Methods"
              description="SDP relaxations, numerical enumeration, and computational verification of polyhedral conjectures."
              tag="Computation"
            />
          </div>
        </AnimatedSection>

        {/* Publications placeholder
        <AnimatedSection delay={0.25}>
          <div className="mt-20">
            <h2 className="font-display text-display-sm text-ink-900 mb-6">
              Publications
            </h2>
            <p className="text-ink-500 italic">
              Publication list will be added here.
            </p>
          </div>
        </AnimatedSection> */}
      </div>
    </>
  );
}
