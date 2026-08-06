'use client';

import { useState } from 'react';

interface ExpandableCardProps {
  title: string;
  description: string;
  tag?: string;
  details: string[];
}

export function ExpandableCard({ title, description, tag, details }: ExpandableCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="group relative bg-white/60 border border-ink-100/60 rounded-lg p-6 sm:p-8 card-hover cursor-pointer"
      onClick={() => setOpen((o) => !o)}
    >
      {tag && (
        <span className="inline-block text-xs font-mono text-accent uppercase tracking-wider mb-3">
          {tag}
        </span>
      )}
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-xl sm:text-2xl text-ink-900 group-hover:text-accent transition-colors">
          {title}
        </h3>
        <span
          className={`mt-1 text-accent/70 text-lg leading-none transition-transform duration-200 ${open ? 'rotate-45' : ''}`}
          aria-hidden
        >
          +
        </span>
      </div>
      <p className="mt-2 text-ink-600 leading-relaxed text-sm sm:text-base">
        {description}
      </p>

      {open && (
        <ul className="mt-4 space-y-1 border-t border-ink-100 pt-4">
          {details.map((item, i) => (
            <li key={i} className="text-sm text-ink-500 leading-relaxed flex gap-2">
              <span className="text-accent/50 mt-0.5">–</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
