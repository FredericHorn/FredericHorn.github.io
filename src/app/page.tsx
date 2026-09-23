'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { Card } from '@/components/ui/Card';
import { HeroGraph } from '@/components/home/HeroGraph';

const areas = [
  {
    title: 'Discrete Mathematics',
    description: 'Combinatorics, graph theory, and the art of counting with structure.',
    symbol: '⊕',
  },
  {
    title: 'Optimization',
    description: 'Polyhedral combinatorics, linear programming, and finding what is best.',
    symbol: '⊗',
  },
  {
    title: 'Mathematical Structures',
    description: 'Polytopes, symmetry groups, and the geometry of abstract objects.',
    symbol: '△',
  },
];

const sections = [
  {
    title: 'Research',
    description: 'Exploring the geometry of complex cut polytopes and their connections to the Gomory relaxation.',
    href: '/research',
    tag: 'Current work',
  },
  {
    title: 'Activities',
    description: 'Mathematical outreach, education, talks, and explorations at the boundary of mathematics and society.',
    href: '/activities',
    tag: 'Outreach & Teaching',
  },
  {
    title: 'Tools',
    description: 'Interactive mathematical visualizations for exploration and play.',
    href: '/tools',
    tag: 'Interactive',
  },
  /* {
    title: 'Blog',
    description: 'Essays on mathematical ideas, intuitions, and the process of discovery.',
    href: '/blog',
    tag: 'Writing',
  }, */
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Decorative graph - positioned behind text 
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[400px] opacity-30 sm:opacity-40 pointer-events-none hidden sm:block">
          <HeroGraph />
        </div>*/}

        <div className="section-container relative z-10 py-32 sm:py-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <span className="text-accent font-mono text-sm tracking-widest uppercase">
              Mathematician by Heart
            </span>
          </motion.div>

          <motion.h1
            className="mt-6 font-display text-display-lg sm:text-display-xl text-ink-950 max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
          >
            Welcome
          </motion.h1>

          <motion.p
            className="mt-6 text-lg sm:text-xl text-ink-500 max-w-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            I&apos;m a PhD student in mathematics at OVGU Magdeburg, working on combinatorial
            optimization and polytopes. Alongside my research I like to pursue various
            other mathematical projects, some of which you can explore here, and I
            enjoy sharing my enthusiasm for mathematics, which is also why I take part
            in organizing math olympiads.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link
              href="/research"
              className="inline-flex items-center px-6 py-3 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent-dark transition-colors"
            >
              Research
            </Link>
            <Link
              href="/tools/politics-dimensions"
              className="inline-flex items-center px-6 py-3 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent-dark transition-colors"
            >
              Wahl-O-Mat Tool
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center px-6 py-3 border border-ink-200 text-ink-700 text-sm font-medium rounded-md hover:border-ink-400 hover:text-ink-900 transition-colors"
            >
              About Me
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Core Areas 
      <section className="py-20 sm:py-28 border-t border-ink-100/50">
        <div className="section-container">
          <AnimatedSection>
            <span className="math-ornament">∘</span>
            <h2 className="mt-2 font-display text-display-sm sm:text-display-md text-ink-900">
              Core Areas
            </h2>
          </AnimatedSection>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {areas.map((area, i) => (
              <AnimatedSection key={area.title} delay={i * 0.1}>
                <div className="group">
                  <span className="block font-math text-4xl text-accent/50 group-hover:text-accent transition-colors mb-4">
                    {area.symbol}
                  </span>
                  <h3 className="font-display text-xl text-ink-900">
                    {area.title}
                  </h3>
                  <p className="mt-2 text-ink-500 text-sm leading-relaxed">
                    {area.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>*/}

      {/* Sections Teaser 
      <section className="py-20 sm:py-28 bg-white/40">
        <div className="section-container">
          <AnimatedSection>
            <span className="math-ornament">◇</span>
            <h2 className="mt-2 font-display text-display-sm sm:text-display-md text-ink-900">
              Explore
            </h2>
            <p className="mt-3 text-ink-500 max-w-wide">
              From current research to interactive tools — ways to engage with mathematical ideas.
            </p>
          </AnimatedSection>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {sections.map((section, i) => (
              <AnimatedSection key={section.title} delay={i * 0.08}>
                <Card {...section} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>*/}

      {/* Quote / Philosophy 
      <section className="py-24 sm:py-32">
        <div className="section-container">
          <AnimatedSection>
            <blockquote className="max-w-2xl mx-auto text-center">
              <p className="font-display text-display-sm sm:text-display-md text-ink-700 italic leading-snug">
                "The purpose of computing is insight, not numbers."
              </p>
              <cite className="mt-6 block text-sm text-ink-400 not-italic font-mono">
                — Richard Hamming
              </cite>
            </blockquote>
          </AnimatedSection>
        </div>
      </section>*/}
    </>
  );
}
