'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';

// Vertices of a polytope projection (illustrative 2D projection of a higher-dimensional object)
function generatePolytopeVertices(n: number, radius: number, cx: number, cy: number) {
  const vertices = [];
  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    vertices.push({
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    });
  }
  return vertices;
}

interface PolytopeVisualizationProps {
  phase?: number; // 0-1 scroll progress
  interactive?: boolean;
}

export function PolytopeVisualization({ phase = 0, interactive = true }: PolytopeVisualizationProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [m, setM] = useState(3);

  const outerVertices = generatePolytopeVertices(6, 140, 200, 200);
  const innerVertices = generatePolytopeVertices(6, 70, 200, 200);

  // Roots of unity visualization
  const roots = generatePolytopeVertices(m, 50, 200, 200);

  return (
    <div className="relative">
      <svg
        viewBox="0 0 400 400"
        className="w-full max-w-md mx-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle */}
        <circle
          cx={200}
          cy={200}
          r={160}
          fill="none"
          stroke="currentColor"
          className="text-ink-100"
          strokeWidth={0.5}
        />

        {/* Outer polytope edges */}
        {outerVertices.map((v, i) => {
          const next = outerVertices[(i + 1) % outerVertices.length];
          return (
            <motion.line
              key={`outer-${i}`}
              x1={v.x}
              y1={v.y}
              x2={next.x}
              y2={next.y}
              stroke="currentColor"
              className="text-ink-300"
              strokeWidth={1}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: phase > 0.1 ? 1 : 0 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            />
          );
        })}

        {/* Cross edges (facet structure) */}
        {outerVertices.map((v, i) => {
          const opposite = outerVertices[(i + 3) % outerVertices.length];
          return (
            <motion.line
              key={`cross-${i}`}
              x1={v.x}
              y1={v.y}
              x2={opposite.x}
              y2={opposite.y}
              stroke="currentColor"
              className="text-ink-200"
              strokeWidth={0.5}
              strokeDasharray="4 4"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase > 0.3 ? 0.5 : 0 }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            />
          );
        })}

        {/* Inner polytope (representing a face) */}
        {phase > 0.4 &&
          innerVertices.map((v, i) => {
            const next = innerVertices[(i + 1) % innerVertices.length];
            return (
              <motion.line
                key={`inner-${i}`}
                x1={v.x}
                y1={v.y}
                x2={next.x}
                y2={next.y}
                stroke="currentColor"
                className="text-accent"
                strokeWidth={1.5}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.7 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              />
            );
          })}

        {/* Vertices */}
        {outerVertices.map((v, i) => (
          <motion.circle
            key={`v-${i}`}
            cx={v.x}
            cy={v.y}
            r={hovered === i ? 6 : 4}
            className={hovered === i ? 'fill-accent' : 'fill-ink-400'}
            initial={{ scale: 0 }}
            animate={{ scale: phase > 0.15 ? 1 : 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            onMouseEnter={() => interactive && setHovered(i)}
            onMouseLeave={() => interactive && setHovered(null)}
            style={{ cursor: interactive ? 'pointer' : 'default' }}
          />
        ))}

        {/* Highlighted cut (when vertex hovered) */}
        {hovered !== null && (
          <motion.polygon
            points={outerVertices
              .filter((_, i) => i <= hovered!)
              .map((v) => `${v.x},${v.y}`)
              .join(' ')}
            fill="currentColor"
            className="text-accent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
          />
        )}

        {/* Center label */}
        {phase > 0.5 && (
          <motion.text
            x={200}
            y={205}
            textAnchor="middle"
            className="fill-accent font-math text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.6 }}
          >
            CUT(G, ζ{m === 3 ? '₃' : m === 4 ? '₄' : 'ₘ'})
          </motion.text>
        )}
      </svg>

      {/* m-selector */}
      {interactive && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <span className="text-xs font-mono text-ink-400">m =</span>
          {[3, 4, 5, 6].map((val) => (
            <button
              key={val}
              onClick={() => setM(val)}
              className={`w-8 h-8 rounded-full text-sm font-mono transition-all ${
                m === val
                  ? 'bg-accent text-white'
                  : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
              }`}
            >
              {val}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Animated roots of unity display
export function RootsOfUnityViz({ m = 3 }: { m?: number }) {
  const roots = Array.from({ length: m }, (_, k) => ({
    x: 100 + 70 * Math.cos((2 * Math.PI * k) / m - Math.PI / 2),
    y: 100 + 70 * Math.sin((2 * Math.PI * k) / m - Math.PI / 2),
    label: k === 0 ? '1' : k === 1 ? 'ζ' : `ζ${String.fromCharCode(0x2070 + k)}`,
  }));

  return (
    <svg viewBox="0 0 200 200" className="w-48 h-48 mx-auto" xmlns="http://www.w3.org/2000/svg">
      <circle cx={100} cy={100} r={70} fill="none" stroke="currentColor" className="text-ink-200" strokeWidth={0.5} />

      {/* Unit circle axis */}
      <line x1={100} y1={25} x2={100} y2={175} stroke="currentColor" className="text-ink-100" strokeWidth={0.5} />
      <line x1={25} y1={100} x2={175} y2={100} stroke="currentColor" className="text-ink-100" strokeWidth={0.5} />

      {/* Edges forming regular polygon */}
      {roots.map((r, i) => {
        const next = roots[(i + 1) % m];
        return (
          <motion.line
            key={`re-${i}`}
            x1={r.x} y1={r.y} x2={next.x} y2={next.y}
            stroke="currentColor" className="text-accent/40" strokeWidth={1}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
          />
        );
      })}

      {/* Root points */}
      {roots.map((r, i) => (
        <g key={`rg-${i}`}>
          <motion.circle
            cx={r.x} cy={r.y} r={4}
            className="fill-accent"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          />
          <motion.text
            x={r.x + (r.x > 100 ? 10 : -10)}
            y={r.y + (r.y > 100 ? 14 : -8)}
            textAnchor={r.x > 100 ? 'start' : 'end'}
            className="fill-ink-600 text-xs font-math"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
          >
            {r.label}
          </motion.text>
        </g>
      ))}
    </svg>
  );
}
