'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Generates a small decorative graph with edges
function generateGraph() {
  const nodes = [
    { x: 120, y: 80 },
    { x: 280, y: 50 },
    { x: 400, y: 120 },
    { x: 200, y: 200 },
    { x: 350, y: 230 },
    { x: 100, y: 280 },
    { x: 450, y: 300 },
    { x: 260, y: 340 },
  ];

  const edges = [
    [0, 1], [1, 2], [0, 3], [1, 3], [2, 4],
    [3, 4], [3, 5], [4, 6], [5, 7], [3, 7],
    [4, 7], [6, 7],
  ];

  return { nodes, edges };
}

export function HeroGraph() {
  const [mounted, setMounted] = useState(false);
  const { nodes, edges } = generateGraph();

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-full h-full" />;

  return (
    <svg
      viewBox="0 0 550 400"
      className="w-full h-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Edges */}
      {edges.map(([a, b], i) => (
        <motion.line
          key={`e-${i}`}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="currentColor"
          className="text-ink-200"
          strokeWidth={1}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: 1.2,
            delay: 0.5 + i * 0.08,
            ease: 'easeOut',
          }}
        />
      ))}
      {/* Nodes */}
      {nodes.map((node, i) => (
        <motion.circle
          key={`n-${i}`}
          cx={node.x}
          cy={node.y}
          r={4}
          className="fill-accent/70"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.3 + i * 0.1,
            ease: 'easeOut',
          }}
        />
      ))}
      {/* Highlight a path */}
      <motion.path
        d={`M ${nodes[0].x} ${nodes[0].y} L ${nodes[3].x} ${nodes[3].y} L ${nodes[4].x} ${nodes[4].y} L ${nodes[6].x} ${nodes[6].y}`}
        stroke="currentColor"
        className="text-accent"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.6 }}
        transition={{ duration: 2, delay: 1.8, ease: 'easeInOut' }}
      />
    </svg>
  );
}
