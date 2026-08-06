import type { MDXComponents } from 'mdx/types';

// Custom components available in MDX
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    // Custom theorem block
    Theorem: ({ title, children }: { title?: string; children: React.ReactNode }) => (
      <div className="theorem-block">
        {title && (
          <p className="font-display text-sm font-semibold text-theorem mb-2">{title}</p>
        )}
        {children}
      </div>
    ),
    // Custom definition block
    Definition: ({ title, children }: { title?: string; children: React.ReactNode }) => (
      <div className="definition-block">
        {title && (
          <p className="font-display text-sm font-semibold text-accent mb-2">{title}</p>
        )}
        {children}
      </div>
    ),
    // Callout / aside
    Aside: ({ children }: { children: React.ReactNode }) => (
      <aside className="my-6 bg-accent-muted/30 border border-accent/10 rounded-lg p-5 text-sm text-ink-700">
        {children}
      </aside>
    ),
    // Math display wrapper
    MathBlock: ({ children }: { children: React.ReactNode }) => (
      <div className="my-8 text-center font-math text-lg">{children}</div>
    ),
  };
}
