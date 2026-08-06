import Link from 'next/link';
import { ReactNode } from 'react';

interface CardProps {
  title: string;
  description: string;
  href?: string;
  tag?: string;
  children?: ReactNode;
  className?: string;
}

export function Card({ title, description, href, tag, children, className = '' }: CardProps) {
  const content = (
    <div
      className={`group relative bg-white/60 border border-ink-100/60 rounded-lg p-6 sm:p-8 card-hover ${className}`}
    >
      {tag && (
        <span className="inline-block text-xs font-mono text-accent uppercase tracking-wider mb-3">
          {tag}
        </span>
      )}
      <h3 className="font-display text-xl sm:text-2xl text-ink-900 group-hover:text-accent transition-colors">
        {title}
      </h3>
      <p className="mt-2 text-ink-600 leading-relaxed text-sm sm:text-base">
        {description}
      </p>
      {children}
      {href && (
        <span className="inline-block mt-4 text-sm text-accent font-medium">
          Explore →
        </span>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
