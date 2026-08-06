'use client';

import { AnimatedSection } from '@/components/ui/AnimatedSection';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  ornament?: string;
}

export function PageHeader({ title, subtitle, ornament = '§' }: PageHeaderProps) {
  return (
    <div className="pt-32 sm:pt-40 pb-12 sm:pb-16">
      <div className="section-container">
        <AnimatedSection>
          <span className="math-ornament block mb-4">{ornament}</span>
          <h1 className="font-display text-display-md sm:text-display-lg text-ink-950 text-balance">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 text-lg sm:text-xl text-ink-500 max-w-wide font-light leading-relaxed">
              {subtitle}
            </p>
          )}
        </AnimatedSection>
      </div>
    </div>
  );
}
