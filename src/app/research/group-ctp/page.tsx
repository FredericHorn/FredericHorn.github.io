'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect, useRef, useReducer } from 'react';
import { ScrollSection, StickyReveal } from '@/components/research/ScrollSection';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

function SectionNumber({ n }: { n: number }) {
  return (
    <span className="block font-mono text-xs text-accent/50 mb-4 tracking-widest">
      {String(n).padStart(2, '0')}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Visualization 1: CTP(ℤ₂, 3) = parity polytope, auto-rotating 3D tetrahedron
// Vertices are the 4 even-parity 0/1 strings: 000, 011, 101, 110
// In 3D coords (x¹₁, x²₁, x³₁): they form a regular tetrahedron inscribed in the unit cube.
// ─────────────────────────────────────────────────────────────────────────────
function ParityPolytopeViz() {
  const angleRef = useRef(0.6);
  const [, redraw] = useReducer((n: number) => n + 1, 0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const loop = () => {
      angleRef.current += 0.007;
      redraw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const a = angleRef.current;
  const tilt = 0.38; // X-tilt in radians

  // Centered parity-polytope vertices (x^i_1 coordinates, shifted by -0.5)
  const raw: [number, number, number][] = [
    [-0.5, -0.5, -0.5], // 000
    [-0.5,  0.5,  0.5], // 011
    [ 0.5, -0.5,  0.5], // 101
    [ 0.5,  0.5, -0.5], // 110
  ];
  const labels = ['000', '011', '101', '110'];

  const project = ([x, y, z]: [number, number, number]) => {
    // Rotate around Y axis
    const x1 = x * Math.cos(a) + z * Math.sin(a);
    const y1 = y;
    const z1 = -x * Math.sin(a) + z * Math.cos(a);
    // Tilt around X axis
    const y2 = y1 * Math.cos(-tilt) - z1 * Math.sin(-tilt);
    const z2 = y1 * Math.sin(-tilt) + z1 * Math.cos(-tilt);
    // Perspective
    const d = 3.8;
    const s = d / (d + z2);
    return { px: 160 + x1 * 118 * s, py: 148 - y2 * 118 * s, z: z2 };
  };

  const pts = raw.map(project);
  const scx = 160, scy = 148; // SVG center

  // 4 faces of the tetrahedron
  const faces = [[0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3]];
  const sorted = [...faces].sort((fa, fb) => {
    const za = fa.reduce((s, i) => s + pts[i].z, 0);
    const zb = fb.reduce((s, i) => s + pts[i].z, 0);
    return za - zb; // back-to-front
  });

  const edges: [number, number][] = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];

  return (
    <svg viewBox="0 0 320 295" className="w-full" xmlns="http://www.w3.org/2000/svg">
      {/* Faces (back-to-front painter's algorithm) */}
      {sorted.map((face, fi) => {
        const [pa, pb, pc] = face.map(i => pts[i]);
        // Cross-product z determines facing (SVG y is inverted)
        const cross = (pb.px - pa.px) * (pc.py - pa.py) - (pb.py - pa.py) * (pc.px - pa.px);
        const front = cross > 0;
        return (
          <polygon
            key={fi}
            points={`${pa.px},${pa.py} ${pb.px},${pb.py} ${pc.px},${pc.py}`}
            fill={front ? '#5ba8d4' : '#c2dff0'}
            fillOpacity={front ? 0.55 : 0.2}
            stroke="none"
          />
        );
      })}

      {/* Edges always on top */}
      {edges.map(([u, v]) => (
        <line
          key={`${u}-${v}`}
          x1={pts[u].px} y1={pts[u].py}
          x2={pts[v].px} y2={pts[v].py}
          stroke="#111"
          strokeWidth={2.2}
        />
      ))}

      {/* Vertices + labels (radially offset from center) */}
      {pts.map((p, i) => {
        const dx = p.px - scx, dy = p.py - scy;
        const len = Math.hypot(dx, dy) || 1;
        const lx = p.px + (dx / len) * 24;
        const ly = p.py + (dy / len) * 24;
        return (
          <g key={i}>
            <circle cx={p.px} cy={p.py} r={5.5} fill="#111" />
            <text
              x={lx} y={ly + 4}
              fontSize="12"
              fontFamily="monospace"
              fill="#111"
              textAnchor={dx < -4 ? 'end' : dx > 4 ? 'start' : 'middle'}
            >
              {labels[i]}
            </text>
          </g>
        );
      })}

      <text x={160} y={16} textAnchor="middle" fontSize="11" fontFamily="Georgia,serif" fontStyle="italic" fill="#aaa">
        CTP(ℤ₂, 3) ≅ parity polytope — 4 vertices, 4 facets
      </text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Visualization 2: Master polyhedron P(ℤ₃, 1)
// G = ℤ₃, G* = {1,2}, feasible: t₁ + 2t₂ ≡ 1 (mod 3), t ≥ 0
// Single non-trivial facet: t₁ + ½t₂ = 1 (from Gomory's Theorem 1)
// passing through extreme points (1,0) and (0,2).
// ─────────────────────────────────────────────────────────────────────────────
function MasterPolyhedronViz() {
  const W = 290, H = 220;
  const ox = 46, oy = H - 30;
  const sc = 44;

  const tx = (t1: number) => ox + t1 * sc;
  const ty = (t2: number) => oy - t2 * sc;

  // Feasible integer points: (t₁ + 2t₂) mod 3 = 1
  const feasible: [number, number][] = [];
  for (let t1 = 0; t1 <= 5; t1++)
    for (let t2 = 0; t2 <= 4; t2++)
      if ((t1 + 2 * t2) % 3 === 1) feasible.push([t1, t2]);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="mpArr" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0,0 L0,7 L7,3.5 z" fill="#ccc" />
        </marker>
        <clipPath id="mpClip">
          <rect x={ox - 1} y={0} width={W - ox + 1} height={oy + 1} />
        </clipPath>
      </defs>

      {/* Feasible region: t₁ + ½t₂ ≥ 1, t ≥ 0 */}
      <polygon
        points={`${tx(1)},${ty(0)} ${tx(0)},${ty(2)} ${tx(0)},${ty(4.4)} ${tx(5.2)},${ty(4.4)} ${tx(5.2)},${ty(0)}`}
        fill="#5ba8d4"
        fillOpacity={0.09}
        clipPath="url(#mpClip)"
      />

      {/* Background lattice */}
      {Array.from({ length: 5 }, (_, t2) =>
        Array.from({ length: 7 }, (_, t1) => (
          <circle key={`bg-${t1}-${t2}`}
            cx={tx(t1)} cy={ty(t2)} r={2.2} fill="#e5e5e5" />
        ))
      )}

      {/* Highlighted feasible integer points */}
      {feasible.map(([t1, t2]) => (
        <circle key={`f-${t1}-${t2}`}
          cx={tx(t1)} cy={ty(t2)} r={5.2} fill="#1a1a1a" />
      ))}

      {/* Facet line: t₁ + ½t₂ = 1  →  (1,0)–(0,2) */}
      <line
        x1={tx(1.0)} y1={ty(-0.0)}
        x2={tx(-0.0)} y2={ty(2.0)}
        stroke="#5ba8d4" strokeWidth={2.4}
        clipPath="url(#mpClip)"
      />

      {/* Axes */}
      <line x1={ox} y1={oy + 2} x2={tx(5.8)} y2={oy + 2} stroke="#ccc" strokeWidth={1.1} markerEnd="url(#mpArr)" />
      <line x1={ox - 2} y1={oy} x2={ox - 2} y2={ty(4.7)} stroke="#ccc" strokeWidth={1.1} markerEnd="url(#mpArr)" />

      {/* Tick marks */}
      {[1, 2, 3, 4, 5].map(i => (
        <g key={`xt${i}`}>
          <line x1={tx(i)} y1={oy - 3} x2={tx(i)} y2={oy + 3} stroke="#ccc" strokeWidth={1} />
          <text x={tx(i)} y={oy + 15} textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#bbb">{i}</text>
        </g>
      ))}
      {[1, 2, 3, 4].map(i => (
        <g key={`yt${i}`}>
          <line x1={ox - 3} y1={ty(i)} x2={ox + 3} y2={ty(i)} stroke="#ccc" strokeWidth={1} />
          <text x={ox - 9} y={ty(i) + 4} textAnchor="end" fontSize="10" fontFamily="monospace" fill="#bbb">{i}</text>
        </g>
      ))}
      <text x={ox - 8} y={oy + 15} textAnchor="end" fontSize="10" fontFamily="monospace" fill="#bbb">0</text>

      {/* Axis labels */}
      <text x={tx(6.1)} y={oy + 6} fontSize="13" fontFamily="Georgia,serif" fontStyle="italic" fill="#999">t₁</text>
      <text x={ox - 14} y={ty(5)} fontSize="13" fontFamily="Georgia,serif" fontStyle="italic" fill="#999">t₂</text>

      {/* Extreme-point labels */}
      <text x={tx(1) + 5} y={ty(0) + 16} fontSize="10" fontFamily="Georgia,serif" fill="#555">(1, 0)</text>
      <text x={tx(0) - 5} y={ty(2) - 4} fontSize="10" fontFamily="Georgia,serif" fill="#555" textAnchor="end">(0, 2)</text>

      {/* Facet-line label */}
      <text
        x={(tx(1) + tx(0)) / 2 - 2}
        y={(ty(0) + ty(2)) / 2 - 20}
        fontSize="10.5"
        fontFamily="Georgia,serif"
        fontStyle="italic"
        fill="#5ba8d4"
      >
        t₁ + ½t₂ = 1
      </text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Visualization 3: Gomory translation diagram (Main Result)
// Top: CTP polytope   Bottom: P(G,g₀) integer lattice   Arrow: Theorem 2
// ─────────────────────────────────────────────────────────────────────────────
function GomoryTranslationViz() {
  const lox = 198, loy = 468, ddx = 26, ddy = 26;
  const rows = 6, cols = 7;
  const dots: { r: number; c: number; x: number; y: number }[] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      dots.push({ r, c, x: lox + c * ddx, y: loy - r * ddy });

  return (
    <svg viewBox="0 0 455 505" className="w-full max-w-md" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="gtmBlue" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
          <path d="M0,0 L0,8 L10,4 z" fill="#5ba8d4" />
        </marker>
        <marker id="gtmGray" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L0,8 L8,4 z" fill="#ccc" />
        </marker>
      </defs>

      {/* ── CTP polytope ── */}
      <g stroke="#ccc" strokeWidth={1.2} opacity={0.8}>
        <line x1={172} y1={182} x2={112} y2={218} markerEnd="url(#gtmGray)" />
        <line x1={172} y1={182} x2={232} y2={218} markerEnd="url(#gtmGray)" />
        <line x1={172} y1={182} x2={172} y2={112} markerEnd="url(#gtmGray)" />
      </g>
      <polygon points="200,52 262,156 156,222" fill="#5ba8d4" fillOpacity={0.5} />
      <line x1={156} y1={222} x2={200} y2={52}  stroke="#111" strokeWidth={2.8} />
      <line x1={156} y1={222} x2={262} y2={156} stroke="#111" strokeWidth={2.8} />
      <line x1={156} y1={222} x2={344} y2={198} stroke="#cc2222" strokeWidth={4} />
      <line x1={200} y1={52}  x2={262} y2={156} stroke="#111" strokeWidth={2.8} />
      <line x1={200} y1={52}  x2={344} y2={198} stroke="#111" strokeWidth={2.8} />
      <line x1={262} y1={156} x2={344} y2={198} stroke="#111" strokeWidth={2.8} />
      <circle cx={156} cy={222} r={5.5} fill="#111" />
      <circle cx={200} cy={52}  r={5.5} fill="#111" />
      <circle cx={262} cy={156} r={5.5} fill="#111" />
      <circle cx={344} cy={198} r={5.5} fill="#111" />
      <text x={128} y={237} fontSize="12" fontFamily="monospace" fill="#111">000</text>
      <text x={194} y={42}  fontSize="12" fontFamily="monospace" fill="#111">011</text>
      <text x={268} y={153} fontSize="12" fontFamily="monospace" fill="#111">101</text>
      <text x={350} y={203} fontSize="12" fontFamily="monospace" fill="#111">110</text>
      <text x={220} y={22} fontSize="13" fontFamily="Georgia,serif" fontStyle="italic" fill="#888" textAnchor="middle">CTP(G, n)</text>

      {/* ── Blue curved arrow: Theorem 2 ── */}
      <path d="M 190 363 C 138 316 136 273 148 230"
        stroke="#5ba8d4" strokeWidth={3.5} fill="none" markerEnd="url(#gtmBlue)" />

      {/* ── P(G,g₀) integer lattice ── */}
      {dots.map(({ r, c, x, y }) => {
        const isOrigin = r === 0 && c === 0;
        const onPath = c === 0 && r > 0 && r <= 4;
        return (
          <circle key={`${r}-${c}`} cx={x} cy={y}
            r={isOrigin ? 4.5 : onPath ? 3.5 : 2.5}
            fill={isOrigin ? '#333' : onPath ? '#222' : '#bbb'} />
        );
      })}
      <line x1={lox} y1={loy} x2={lox} y2={loy - 4 * ddy} stroke="#333" strokeWidth={2.5} />
      <line x1={lox} y1={loy + 10} x2={lox + 7 * ddx} y2={loy + 10} stroke="#aaa" strokeWidth={1.2} markerEnd="url(#gtmGray)" />
      <line x1={lox - 10} y1={loy} x2={lox - 10} y2={loy - 5.5 * ddy} stroke="#aaa" strokeWidth={1.2} markerEnd="url(#gtmGray)" />
      <text x={lox + 7.3 * ddx} y={loy + 14} fontSize="13" fontFamily="Georgia,serif" fontStyle="italic" fill="#888">t₁</text>
      <text x={lox - 26} y={loy - 5.8 * ddy} fontSize="13" fontFamily="Georgia,serif" fontStyle="italic" fill="#888">t₂</text>
      <text x={lox + 4} y={loy + 20} fontSize="10" fontFamily="Georgia,serif" fill="#aaa">(0,0)</text>
      <text x={330} y={352} fontSize="13" fontFamily="Georgia,serif" fontStyle="italic" fill="#888">P(G, g₀)</text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Visualization 4: Interactive complex cut widget for K₃
// User clicks triangle vertices to cycle their ℤ₃ value.
// Edge labels show β(u,v) = αᵤ − αᵥ (mod 3).
// Hermitian matrix entries: Y(i,j) = ω^β(i,j), ω = e^(2πi/3).
// ─────────────────────────────────────────────────────────────────────────────
function ComplexCutWidget() {
  const [alphas, setAlphas] = useState<[number, number, number]>([0, 1, 2]);

  const mod3 = (n: number) => ((n % 3) + 3) % 3;
  const beta = (u: number, v: number) => mod3(alphas[u] - alphas[v]);

  // ω^k = e^(2πik/3)
  const omega = (k: number) => {
    const θ = (2 * Math.PI * k) / 3;
    return { re: Math.cos(θ), im: Math.sin(θ) };
  };

  const fmt = (x: number) => {
    if (Math.abs(x) < 5e-4) return '0';
    return x.toFixed(3).replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
  };

  const fmtC = (re: number, im: number) => {
    const r = fmt(re), i = fmt(im);
    if (i === '0') return r;
    if (r === '0') return `${i}i`;
    return `${r} ${im < 0 ? '' : '+'}${i}i`;
  };

  // Triangle vertex SVG positions
  const V = [
    { x: 135, y: 34 },  // v₀ top
    { x: 26, y: 198 },  // v₁ bottom-left
    { x: 244, y: 198 }, // v₂ bottom-right
  ];
  const edgeList: [number, number][] = [[0, 1], [1, 2], [0, 2]];

  // Color per ℤ₃ element
  const col = ['#64748b', '#3b82f6', '#a855f7'] as const;
  const lbl = ['0', '1', '2'] as const;

  const cycle = (i: number) =>
    setAlphas(prev => {
      const n = [...prev] as [number, number, number];
      n[i] = mod3(prev[i] + 1);
      return n;
    });

  // Vanishing cycle sum: β(0→1) + β(1→2) + β(2→0) always = 0 since derived from α
  const cycleSum = mod3(beta(0, 1) + beta(1, 2) + beta(2, 0));

  return (
    <div className="space-y-5">
      <p className="text-xs font-mono text-ink-400">
        Click vertices to cycle α ∈ ℤ₃ — edges show β(u,v) = αᵤ − αᵥ (mod 3)
      </p>

      <div className="flex flex-col sm:flex-row items-start gap-6">
        {/* Triangle graph */}
        <svg viewBox="0 0 270 232" className="w-full max-w-[240px] mx-auto shrink-0" xmlns="http://www.w3.org/2000/svg">
          {/* Edges */}
          {edgeList.map(([u, v]) => {
            const mx = (V[u].x + V[v].x) / 2;
            const my = (V[u].y + V[v].y) / 2;
            const b = beta(u, v);
            return (
              <g key={`e${u}${v}`}>
                <line x1={V[u].x} y1={V[u].y} x2={V[v].x} y2={V[v].y}
                  stroke="#e0e0e0" strokeWidth={2.5} />
                {/* Edge-label badge */}
                <circle cx={mx} cy={my} r={15} fill="white" stroke="#e5e5e5" strokeWidth={1.5} />
                <text x={mx} y={my + 5} textAnchor="middle"
                  fontSize="15" fontFamily="monospace" fontWeight="bold" fill={col[b]}>
                  {lbl[b]}
                </text>
              </g>
            );
          })}

          {/* Vertex circles */}
          {V.map((pos, i) => (
            <g key={`v${i}`} onClick={() => cycle(i)} style={{ cursor: 'pointer' }}>
              <circle cx={pos.x} cy={pos.y} r={27}
                fill={col[alphas[i]]} stroke="white" strokeWidth={3} />
              <text x={pos.x} y={pos.y - 7} textAnchor="middle"
                fontSize="9" fontFamily="sans-serif" fill="rgba(255,255,255,0.65)">
                v{i}
              </text>
              <text x={pos.x} y={pos.y + 11} textAnchor="middle"
                fontSize="17" fontFamily="monospace" fontWeight="bold" fill="white">
                {lbl[alphas[i]]}
              </text>
            </g>
          ))}
        </svg>

        {/* Matrix + reference panel */}
        <div className="flex-1 space-y-4 text-xs font-mono min-w-0">
          {/* Y matrix entries */}
          <div>
            <p className="text-ink-400 mb-2.5">Y(i,j) = ω^β(i,j)</p>
            <div className="space-y-2">
              {edgeList.map(([u, v]) => {
                const b = beta(u, v);
                const { re, im } = omega(b);
                const sup = ['⁰', '¹', '²'][b];
                return (
                  <div key={`m${u}${v}`} className="flex items-center gap-2">
                    <span className="text-ink-400 w-14">Y({u},{v})</span>
                    <span className="text-ink-300">=</span>
                    <span style={{ color: col[b] }} className="w-7">ω{sup}</span>
                    <span className="text-ink-300">=</span>
                    <span className="text-ink-700 tabular-nums">{fmtC(re, im)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ω reference */}
          <div className="pt-3 border-t border-ink-100">
            <p className="text-ink-400 mb-2">ω = e^(2πi/3)</p>
            {[0, 1, 2].map(k => {
              const { re, im } = omega(k);
              const sup = ['⁰', '¹', '²'][k];
              return (
                <div key={k} className="flex items-center gap-2 mb-1">
                  <span style={{ color: col[k] }} className="w-7">ω{sup}</span>
                  <span className="text-ink-300">=</span>
                  <span className="text-ink-600 tabular-nums">{fmtC(re, im)}</span>
                </div>
              );
            })}
          </div>

          {/* Vanishing cycle constraint */}
          <div className="pt-3 border-t border-ink-100">
            <p className="text-ink-400 mb-1.5">Vanishing cycle</p>
            <div className="mb-1">
              <span className="text-ink-500">β₀₁+β₁₂+β₂₀ = </span>
              <span className={cycleSum === 0 ? 'text-green-600' : 'text-red-400'}>
                {cycleSum} (mod 3){cycleSum === 0 ? ' ✓' : ' ✗'}
              </span>
            </div>
            <p className="text-ink-400 leading-relaxed" style={{ fontFamily: 'inherit' }}>
              Any α-derived β automatically satisfies this — this is the characterization of
              realizable cuts (Lemma 1 in the paper).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────
export default function GroupCTPPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const progressBarWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div ref={containerRef}>
      <motion.div
        className="fixed top-0 left-0 h-[2px] bg-accent z-[60]"
        style={{ width: progressBarWidth }}
      />

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-muted/20 to-transparent" />
        <div className="section-container relative z-10 text-center py-32">
          <motion.span
            className="inline-block font-mono text-xs text-accent uppercase tracking-[0.3em]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Research
          </motion.span>

          <motion.h1
            className="mt-6 font-display text-display-md sm:text-display-lg lg:text-display-xl text-ink-950 max-w-4xl mx-auto text-balance"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            Cyclic Transversal Polytopes over Finite Abelian Groups
          </motion.h1>

          <motion.p
            className="mt-8 text-lg text-ink-500 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Extending a polyhedral framework from the binary setting to arbitrary finite
            abelian groups — and uncovering a structural connection to Gomory&apos;s master polyhedra.
          </motion.p>

          <motion.div className="mt-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
            <motion.div
              className="w-5 h-9 border border-ink-300 rounded-full mx-auto flex justify-center"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="w-1 h-2 bg-ink-400 rounded-full mt-2"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Section 1: The Framework ── */}
      <section className="py-24 sm:py-32">
        <div className="section-container">
          <ScrollSection>
            <SectionNumber n={1} />
            <h2 className="font-display text-display-sm sm:text-display-md text-ink-950 mb-8">
              The Framework
            </h2>
          </ScrollSection>

          <StickyReveal
            visual={
              <ScrollSection>
                <div className="bg-white/60 border border-ink-100 rounded-lg p-6">
                  <ParityPolytopeViz />
                  <p className="mt-3 text-center text-xs font-mono text-ink-300 leading-snug">
                    Vertices are the 4 even-parity bitstrings.<br />
                    It is a regular tetrahedron — all edges have length √2.
                  </p>
                </div>
              </ScrollSection>
            }
          >
            <ScrollSection>
              <div className="space-y-6 text-ink-700 leading-relaxed">
                <p>
                  A <em>block configuration</em> over a finite abelian group G is a sequence
                  B = (B(1), …, B(n)) of non-empty blocks B(i) ⊆ G. A <em>transversal</em>
                  picks one element ξ(i) ∈ B(i) from each block.
                </p>
                <p>
                  A transversal is <em>cyclic</em> when its entries sum to zero in G.
                  For the binary group ℤ₂ this is the familiar parity condition.
                </p>
                <div className="definition-block">
                  <p className="font-display text-sm font-semibold text-accent mb-2">
                    Definition (Group CTP)
                  </p>
                  <p>
                    The <em>cyclic transversal polytope</em> CTP(B) is the convex hull of the
                    incidence vectors of all cyclic transversals of B. When every block equals G,
                    we write CTP(G, n) and call it the <em>full</em> cyclic transversal polytope.
                  </p>
                </div>
                <p>
                  The rotating polytope on the left is CTP(ℤ₂, 3): three blocks of size 2,
                  one component. It lives in ℝ⁶ but — due to the three block equations
                  x⁰₀+x⁰₁=1, x¹₀+x¹₁=1, x²₀+x²₁=1 — it is genuinely 3-dimensional,
                  equal to the parity polytope. Its four facets correspond to lifted
                  odd-set inequalities.
                </p>
                <p>
                  Moving to larger groups lets us capture richer structure: Max-3-Cut, nowhere-zero
                  flows, and stable sets all embed as group CTPs.
                </p>
              </div>
            </ScrollSection>
          </StickyReveal>
        </div>
      </section>

      {/* ── Section 2: Gomory's Master Polyhedra ── */}
      <section className="py-24 sm:py-32 bg-white/40">
        <div className="section-container">
          <ScrollSection>
            <SectionNumber n={2} />
            <h2 className="font-display text-display-sm sm:text-display-md text-ink-950 mb-8">
              Gomory&apos;s Master Polyhedra
            </h2>
          </ScrollSection>

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <ScrollSection>
              <div className="space-y-6 text-ink-700 leading-relaxed">
                <p>
                  In 1969 Gomory introduced <em>master polyhedra</em> in the study of integer
                  cutting planes. For a finite abelian group G and a non-zero element g₀ ∈ G,
                  the master polyhedron P(G, g₀) is defined over G* = G \ &#123;0&#125;.
                </p>
                <div className="definition-block">
                  <p className="font-display text-sm font-semibold text-accent mb-2">
                    Definition (Master Polyhedron)
                  </p>
                  <p className="mb-3">
                    P(G, g₀) is the convex hull of all t ∈ ℕ<sup>G*</sup> satisfying
                  </p>
                  <p className="text-center font-mono text-sm">
                    Σ<sub> g ∈ G* </sub> t(g) · g = g₀.
                  </p>
                </div>
                <p>
                  Gomory completely characterized the facets of P(G, g₀) via a system of
                  linear equations and inequalities. For G = ℤ₃ and g₀ = 1, there is exactly
                  one non-trivial facet inequality: <strong>t₁ + ½t₂ ≥ 1</strong>, whose
                  boundary line passes through (1, 0) and (0, 2).
                </p>
                <p>
                  The right panel shows this: the dark dots are the integer points satisfying
                  t₁ + 2t₂ ≡ 1 (mod 3), the blue line is the single Gomory facet, and the
                  shaded region is the feasible half-space.
                </p>
                <p>
                  For cyclic groups ℤₘ, a canonical family of facets arises from a
                  piecewise-linear function on ℤₘ, generalizing the Gomory mixed-integer cuts.
                </p>
              </div>
            </ScrollSection>

            <ScrollSection>
              <div className="bg-white/80 border border-ink-100 rounded-lg p-8">
                <p className="text-xs font-mono text-ink-400 mb-5">
                  P(ℤ₃, 1) — G* = &#123;1, 2&#125;, feasible: t₁ · 1 + t₂ · 2 ≡ 1 mod 3
                </p>
                <MasterPolyhedronViz />
                <p className="mt-4 text-xs text-ink-400 leading-relaxed">
                  Dark dots: integer feasible points. Blue line: the unique non-trivial
                  Gomory facet t₁ + ½t₂ = 1. Shaded: feasible region t₁ + ½t₂ ≥ 1.
                </p>
              </div>
            </ScrollSection>
          </div>
        </div>
      </section>

      {/* ── Section 3: The Main Result ── */}
      <section className="py-24 sm:py-32">
        <div className="section-container">
          <ScrollSection>
            <SectionNumber n={3} />
            <h2 className="font-display text-display-sm sm:text-display-md text-ink-950 mb-4">
              The Main Result
            </h2>
            <p className="text-ink-500 max-w-wide mb-12">
              Every facet of a master polyhedron induces a family of facets for the
              corresponding cyclic transversal polytope — via a systematic, block-by-block
              translation of coefficients.
            </p>
          </ScrollSection>

          <StickyReveal
            visual={
              <ScrollSection>
                <div className="flex justify-center">
                  <GomoryTranslationViz />
                </div>
                <p className="mt-3 text-xs text-ink-400 text-center font-mono leading-snug">
                  Blue arrow: Theorem 2 — a Gomory facet (bottom lattice)<br />
                  translates into a CTP facet (top polytope).<br />
                  Red edge = non-cyclic transversal ξ used as reference.
                </p>
              </ScrollSection>
            }
          >
            <div className="space-y-10">
              <ScrollSection>
                <div className="space-y-6 text-ink-700 leading-relaxed">
                  <p>
                    The central theorem establishes that the facial structure of master
                    polyhedra is inherited by full cyclic transversal polytopes. Given a
                    facet of P(G, g₀), we construct a facet of CTP(G, n) by cyclically
                    shifting the master-polyhedron coefficients within each block, using a
                    non-cyclic transversal as a reference point.
                  </p>
                </div>
              </ScrollSection>

              <ScrollSection>
                <div className="theorem-block">
                  <p className="font-display text-sm font-semibold text-theorem mb-3">
                    Theorem 2 — Facet Translation
                  </p>
                  <p className="text-ink-700 leading-relaxed mb-4">
                    Let a = (a<sub>g</sub>)<sub>g∈G</sub> be coefficients of a facet of
                    P(G, g₀) with a₀ = 0, right-hand side π₀. Let n be large enough
                    (n ≥ max ord(g) + 1 over g with a<sub>g</sub> = 0), and let
                    ξ : [n] → G be a non-cyclic transversal with component sum g₀. Define:
                  </p>
                  <p className="text-center font-mono text-sm text-ink-800 my-5 tracking-wide">
                    α<sup>i</sup><sub>g</sub>  :=  a<sub>ξ(i) − g</sub>
                  </p>
                  <p className="text-ink-700 leading-relaxed">
                    Then Σ<sub>i,g</sub> α<sup>i</sup><sub>g</sub> x<sup>i</sup><sub>g</sub>
                    ≥ π₀ is a facet-defining inequality of CTP(G, n).
                  </p>
                </div>
              </ScrollSection>

              <ScrollSection>
                <div className="space-y-4 text-ink-700 leading-relaxed">
                  <p>
                    The proof lifts the master-polyhedron system n times into
                    (n · |G|)-dimensional space, enforcing consistency across blocks via
                    coupling equations. It then applies a cyclic coordinate shift within
                    each block (using ξ as reference) to produce the translated system
                    P<sub>s</sub>(G, g₀, n).
                  </p>
                  <p>
                    This result gives a group-theoretic explanation for previously ad-hoc
                    constructions. In particular, the lifted odd-set inequalities for
                    CTP(ℤ₂<sup>d</sup>, n) are precisely the translated facets arising from
                    Gomory&apos;s canonical cyclic-group construction (Theorem 7).
                  </p>
                </div>
              </ScrollSection>
            </div>
          </StickyReveal>
        </div>
      </section>

      {/* ── Section 4: Consequences ── */}
      <section className="py-24 sm:py-32 bg-white/40">
        <div className="section-container">
          <ScrollSection>
            <SectionNumber n={4} />
            <h2 className="font-display text-display-sm sm:text-display-md text-ink-950 mb-8">
              Consequences
            </h2>
          </ScrollSection>

          <div className="max-w-reading mx-auto space-y-12">
            <ScrollSection>
              <p className="text-ink-700 leading-relaxed">
                Theorem 2 yields several concrete consequences spanning exact descriptions,
                efficient algorithms, and symmetry theory.
              </p>
            </ScrollSection>

            {[
              {
                title: 'Integer Description',
                subtitle: 'Corollary 1',
                body: `The translated inequalities suffice to cut off every non-cyclic integer point:
                       the only 0/1-vectors satisfying all translated inequalities are precisely the
                       incidence vectors of cyclic transversals. This provides an exact integer
                       description even when the full polyhedral description is unknown.`,
              },
              {
                title: 'Complete Facets for ℤ₃',
                subtitle: 'Theorem 8',
                body: `For G = ℤ₃ the Countdown-inequalities — the canonical family produced by
                       Theorem 2 via the generator g₁ = 1 — completely describe CTP(ℤ₃, n) for
                       every n. Together with non-negativity and block equations they give a full
                       linear description, extending the known complete descriptions for ℤ₂ and ℤ₂²
                       to the first non-binary case.`,
              },
              {
                title: 'Polynomial Separation',
                subtitle: 'Theorem 9',
                body: `For G = ℤ₃, membership in CTP(ℤ₃, n) can be decided in polynomial time via
                       at most ⅓(n² + 3n + 2) minimum-cost flow problems — one per non-cyclic
                       multiset. This gives an efficient separation oracle using integer flow methods.`,
              },
              {
                title: 'Group-Theoretic Symmetry',
                subtitle: 'Theorems 3 & 4',
                body: `Translated facets inherit two classes of symmetry: shifting within CTP by
                       a cyclic transversal produces equivalent inequalities, and any automorphism
                       φ of G maps facets of P(G, g₀) to facets of P(G, φ(g₀)). Both symmetries
                       propagate cleanly through the translation construction.`,
              },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.08}>
                <div className="border-l-2 border-accent/30 pl-6 py-2">
                  <div className="flex items-baseline gap-3 mb-2">
                    <h3 className="font-display text-lg text-ink-900">{item.title}</h3>
                    <span className="font-mono text-xs text-ink-400">{item.subtitle}</span>
                  </div>
                  <p className="text-ink-600 text-sm leading-relaxed">{item.body}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: Expressive Power ── */}
      <section className="py-24 sm:py-32">
        <div className="section-container">
          <ScrollSection>
            <SectionNumber n={5} />
            <h2 className="font-display text-display-sm sm:text-display-md text-ink-950 mb-8">
              Expressive Power
            </h2>
          </ScrollSection>

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <ScrollSection>
              <div className="space-y-6 text-ink-700 leading-relaxed">
                <p>
                  Group CTPs provide a unifying polyhedral language for combinatorial
                  problems beyond the binary setting. Several classical polytopes embed
                  as group CTPs over appropriate finite abelian groups.
                </p>
                {[
                  {
                    label: 'Complex Cut Polytopes',
                    text: `For any graph G and m ≥ 2, the complex cut polytope CUT_m(G) has a CTP
                           extension of length equal to the cycle-space dimension. For m = 2, 3 the
                           formulation is isomorphic — CTP facets transfer directly. The interactive
                           widget on the right demonstrates this for K₃ with m = 3.`,
                  },
                  {
                    label: 'Nowhere-Zero Flows',
                    text: `Nowhere-zero flows on a digraph over an abelian group G embed as a
                           CTP of length |A| and size (|G|−1)·|A|, where A is the arc set.`,
                  },
                  {
                    label: 'Stable Sets & Graph Coloring',
                    text: `The stable-set polytope of any graph admits multiple affinely isomorphic
                           CTP formulations over ℤₘ for any m ≥ 2. Vertex coloring with |C| colors
                           admits a formulation over ℤ_{|C|+1}, generalizing the binary constructions.`,
                  },
                ].map((item, i) => (
                  <AnimatedSection key={i} delay={i * 0.1}>
                    <div>
                      <h3 className="font-display text-base text-ink-900 mb-1">{item.label}</h3>
                      <p className="text-ink-600 text-sm leading-relaxed">{item.text}</p>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </ScrollSection>

            <ScrollSection>
              <div className="bg-white/80 border border-ink-100 rounded-lg p-6">
                <p className="text-xs font-mono text-ink-400 mb-5">
                  Complex cut on K₃ — CUT₃(K₃) as a CTP over ℤ₃
                </p>
                <ComplexCutWidget />
              </div>
            </ScrollSection>
          </div>

          {/* Incompleteness callout */}
          <div className="mt-20 max-w-reading mx-auto">
            <ScrollSection>
              <div className="bg-white/80 border border-ink-100 rounded-lg p-8">
                <p className="text-xs font-mono text-ink-400 mb-4">
                  Incompleteness — a facet of CTP(ℤ₇, 3) that is not a translation
                </p>
                <div className="bg-ink-50 rounded p-4 font-mono text-xs leading-relaxed overflow-x-auto text-ink-700 mb-4">
                  <div>+3x⁰₁ +6x⁰₂ +9x⁰₃ +5x⁰₄ +8x⁰₅ +4x⁰₆</div>
                  <div>+3x¹₀ +6x¹₁ +9x¹₂ +5x¹₃ +1x¹₄ +4x¹₅</div>
                  <div>+6x²₀ +9x²₁ +5x²₂ +8x²₃ +4x²₄   +3x²₆  ≥  9</div>
                </div>
                <p className="text-ink-500 text-sm leading-relaxed">
                  The coefficients differ across blocks in a way that no single master-polyhedron
                  facet can explain — pointing to genuinely new phenomena in the non-binary case.
                  Characterizing all facets beyond the translated family remains open for groups
                  larger than ℤ₃.
                </p>
              </div>
            </ScrollSection>

            <div className="mt-12 space-y-4">
              {[
                {
                  q: 'Full facet description for larger groups',
                  text: 'Can the complete-description result for ℤ₃ be extended to ℤ₄ or ℤ₅? Does the Countdown family remain sufficient?',
                },
                {
                  q: 'Non-cyclic groups',
                  text: 'The framework applies to all finite abelian groups. What new phenomena appear for G = ℤ₂ × ℤ₂ versus ℤ₄?',
                },
                {
                  q: 'Separation beyond ℤ₃',
                  text: 'The minimum-cost flow approach for separation exploits the structure of ℤ₃. What are the right separation primitives for general G?',
                },
              ].map((item, i) => (
                <AnimatedSection key={i} delay={i * 0.08}>
                  <div className="border-l-2 border-ink-200 pl-4 py-1">
                    <h3 className="font-display text-sm text-ink-900 mb-1">{item.q}</h3>
                    <p className="text-ink-500 text-xs leading-relaxed">{item.text}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Back to research */}
      <section className="py-16 border-t border-ink-100">
        <div className="section-container text-center">
          <a
            href="/research"
            className="text-sm text-ink-500 hover:text-accent transition-colors font-mono"
          >
            ← Back to Research Overview
          </a>
        </div>
      </section>
    </div>
  );
}
