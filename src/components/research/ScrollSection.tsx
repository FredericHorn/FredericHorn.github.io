'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface ScrollSectionProps {
  children: ReactNode;
  className?: string;
  fadeOut?: boolean;
}

export function ScrollSection({ children, className = '', fadeOut = false }: ScrollSectionProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(
    scrollYProgress,
    fadeOut ? [0, 0.2, 0.7, 0.9] : [0, 0.2, 0.8, 1],
    fadeOut ? [0, 1, 1, 0] : [0, 1, 1, 1]
  );

  const y = useTransform(scrollYProgress, [0, 0.2], [60, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
      className={`${className}`}
    >
      {children}
    </motion.div>
  );
}

interface ParallaxProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export function Parallax({ children, speed = 0.3, className = '' }: ParallaxProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

interface StickyRevealProps {
  children: ReactNode;
  visual: ReactNode;
  className?: string;
}

export function StickyReveal({ children, visual, className = '' }: StickyRevealProps) {
  return (
    <div className={`relative grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 ${className}`}>
      <div className="lg:sticky lg:top-32 lg:self-start">
        {visual}
      </div>
      <div>
        {children}
      </div>
    </div>
  );
}
