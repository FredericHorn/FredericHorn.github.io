'use client';

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import katex from 'katex';
import { useLanguage } from '@/lib/LanguageContext';
import { politicsDimensionsText, type PoliticsDimensionsText } from './politicsDimensions.i18n';

/* =========================================================================
   How many dimensions does politics have?
   An interactive scrollytelling explainer for SVD & PCA.
   All math (eigendecomposition / SVD via Gram, 2D PCA) runs in the browser.
   ========================================================================= */

/* ---- design tokens (site palette) -------------------------------------- */
const C = {
  paper: '#faf9f7',
  panel: '#ffffff',
  panelEdge: '#dbd9d4',
  panelSoft: '#f7f7f5',
  ink: '#282523',
  ink2: '#4d4844',
  muted: '#958e82',
  coral: '#9b3a2a', // axis 1 / primary
  teal: '#1a5c3a', // axis 2 / secondary (site accent green)
  violet: '#726961',
  gold: '#8b4513', // singular values (theorem color)
};
const SANS = "'Source Sans 3', system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

/* =========================================================================
   MATH
   ========================================================================= */

// symmetric n×n eigendecomposition via cyclic Jacobi. returns {values, vectors}
// vectors[k] is the k-th eigenvector (column), sorted by value desc.
function jacobiEigen(Ain: number[][]) {
  const n = Ain.length;
  const A = Ain.map((r) => r.slice());
  const V: number[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
  );
  const off = () => {
    let s = 0;
    for (let i = 0; i < n; i++)
      for (let j = i + 1; j < n; j++) s += A[i][j] * A[i][j];
    return s;
  };
  let sweeps = 0;
  while (off() > 1e-14 && sweeps < 100) {
    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-18) continue;
        const theta = (A[q][q] - A[p][p]) / (2 * A[p][q]);
        const t =
          Math.sign(theta || 1) /
          (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let k = 0; k < n; k++) {
          const akp = A[k][p],
            akq = A[k][q];
          A[k][p] = c * akp - s * akq;
          A[k][q] = s * akp + c * akq;
        }
        for (let k = 0; k < n; k++) {
          const apk = A[p][k],
            aqk = A[q][k];
          A[p][k] = c * apk - s * aqk;
          A[q][k] = s * apk + c * aqk;
        }
        for (let k = 0; k < n; k++) {
          const vkp = V[k][p],
            vkq = V[k][q];
          V[k][p] = c * vkp - s * vkq;
          V[k][q] = s * vkp + c * vkq;
        }
      }
    }
    sweeps++;
  }
  const vals = A.map((r, i) => r[i]);
  const idx = vals.map((_, i) => i).sort((a, b) => vals[b] - vals[a]);
  return {
    values: idx.map((i) => vals[i]),
    vectors: idx.map((i) => V.map((row) => row[i])), // vectors[k] = column
  };
}

const colMean = (M: number[][]) => {
  const n = M[0].length;
  const m = new Array(n).fill(0);
  M.forEach((r) => r.forEach((v, j) => (m[j] += v)));
  return m.map((v) => v / M.length);
};
const gram = (A: number[][]) => {
  // A Aᵀ (rows × rows)
  const m = A.length;
  const G = Array.from({ length: m }, () => new Array(m).fill(0));
  for (let i = 0; i < m; i++)
    for (let j = 0; j < m; j++) {
      let s = 0;
      for (let k = 0; k < A[0].length; k++) s += A[i][k] * A[j][k];
      G[i][j] = s;
    }
  return G;
};

// full SVD scores of a (parties × theses) matrix.
// returns singular values, party scores (U*Σ), thesis loadings (V), variance ratios
function svdParties(M: number[][]) {
  // PCA: center each thesis (column) on its mean across parties, then SVD
  const mean = colMean(M);
  const A = M.map((row) => row.map((v: number, j: number) => v - mean[j]));
  const G = gram(A); // m×m
  const { values, vectors } = jacobiEigen(G);
  const sv = values.map((v) => Math.sqrt(Math.max(v, 0)));
  const total = values.reduce((a, b) => a + Math.max(b, 0), 0) || 1;
  const ratios = values.map((v) => Math.max(v, 0) / total);
  // party scores: U Σ  => for party i, comp k = vectors[k][i] * sv[k]
  const scores = A.map((_, i) => sv.map((s, k) => vectors[k][i] * s));
  // thesis loadings V = Aᵀ U Σ⁻¹  (column k)
  const nThe = A[0].length;
  const loadings: number[][] = Array.from({ length: nThe }, () => []);
  sv.forEach((s, k) => {
    for (let j = 0; j < nThe; j++) {
      let val = 0;
      for (let i = 0; i < A.length; i++) val += A[i][j] * vectors[k][i];
      loadings[j][k] = s > 1e-9 ? val / s : 0;
    }
  });
  return { sv, ratios, scores, loadings, mean: colMean(M) };
}

// 2D covariance + principal angle for the sandbox
function cov2(pts: { x: number; y: number }[]) {
  const n = pts.length;
  const mx = pts.reduce((a, p) => a + p.x, 0) / n;
  const my = pts.reduce((a, p) => a + p.y, 0) / n;
  let sxx = 0,
    syy = 0,
    sxy = 0;
  pts.forEach((p) => {
    const dx = p.x - mx,
      dy = p.y - my;
    sxx += dx * dx;
    syy += dy * dy;
    sxy += dx * dy;
  });
  return { sxx: sxx / n, syy: syy / n, sxy: sxy / n, mx, my };
}
// variance of the cloud projected onto unit direction (cos a, sin a)
type Cov2 = { sxx: number; syy: number; sxy: number; mx: number; my: number };
const varAlong = (c: Cov2, a: number) => {
  const cx = Math.cos(a),
    sy = Math.sin(a);
  return c.sxx * cx * cx + 2 * c.sxy * cx * sy + c.syy * sy * sy;
};
const principalAngle = (c: Cov2) => 0.5 * Math.atan2(2 * c.sxy, c.sxx - c.syy);

/* =========================================================================
   REAL DATA · Wahl-O-Mat, Bundestagswahl 2025
   Party order as given (do not reorder). WAHLOMAT rows = theses,
   columns = parties, entries in {-1 disagree, 0 neutral, +1 agree}.
   M is the parties × theses view used throughout.
   ========================================================================= */
const PARTIES = [
  { name: 'CDU / CSU', short: 'CDU', col: '#726961' },
  { name: 'AfD', short: 'AfD', col: '#2a5c8a' },
  { name: 'SPD', short: 'SPD', col: '#9b3a2a' },
  { name: 'GRÜNE', short: 'GRÜNE', col: '#1a5c3a' },
  { name: 'Die Linke', short: 'LINKE', col: '#8a2a5c' },
  { name: 'BSW', short: 'BSW', col: '#a86a1a' },
  { name: 'FDP', short: 'FDP', col: '#9a8820' },
];
const THESES = [
  'Unterstützung der Ukraine',
  'Erneuerbare Energien',
  'Streichung des Bürgergelds',
  'Tempolimit auf Autobahnen',
  'Abweisung Asylsuchender',
  'Begrenzung der Mietpreise',
  'Automatisierte Gesichtserkennung',
  'Energieintensive Unternehmen',
  'Rente nach 40 Beitragsjahren',
  'Grundgesetz',
  'Anwerbung von Fachkräften',
  'Nutzung der Kernenergie',
  'Anhebung des Spitzensteuersatzes',
  'Kompetenzen in der Schulpolitik',
  'Rüstungsexporte nach Israel',
  'Krankenkassen',
  'Abschaffung der Frauenquote',
  'Ökologische Landwirtschaft',
  'Projekte gegen Rechtsextremismus',
  'Kontrolle von Zulieferern',
  'Elternabhängiges BAföG',
  'Schuldenbremse',
  'Arbeitserlaubnis für Asylsuchende',
  'Verwerfen der Klimaziele',
  '35-Stunden-Woche',
  'Schwangerschaftsabbruch nach Beratung',
  'Nationale Währung',
  'Schiene vor Straße',
  'Ehrenamt',
  'Umlegung der Grundsteuer',
  'Einschränkung des Streikrechts',
  'Volksentscheide',
  'Strafrecht für unter 14-Jährige',
  'Abschaffung von Zöllen',
  'Zweite Staatsbürgerschaft',
  'Soziales Pflichtjahr',
  'Fossile Brennstoffe',
  'Erhöhung des Mindestlohns',
];
// rows = theses, cols = parties (CDU, AfD, SPD, GRÜNE, Linke, BSW, FDP)
const WAHLOMAT = [
  [1, -1, 1, 1, -1, -1, 1],
  [1, -1, 1, 1, 1, -1, -1],
  [1, 1, 1, -1, -1, 1, 1],
  [-1, -1, 1, 1, 1, -1, -1],
  [1, 1, -1, -1, -1, 1, 1],
  [1, -1, 1, 1, 1, 1, -1],
  [1, 1, -1, -1, -1, 0, -1],
  [1, -1, 1, 1, 1, -1, -1],
  [-1, -1, -1, -1, 1, 1, -1],
  [1, 1, 1, 0, -1, 0, 0],
  [1, -1, 1, 1, -1, -1, 1],
  [1, 1, -1, -1, -1, -1, 1],
  [-1, -1, 1, 1, 1, 1, -1],
  [-1, -1, 1, 1, 1, 1, 1],
  [1, 0, 1, 1, -1, -1, 1],
  [-1, -1, 1, 1, 1, 1, -1],
  [-1, 1, -1, -1, -1, -1, 0],
  [-1, -1, 1, 1, 1, 0, -1],
  [1, -1, 1, 1, 1, 1, 1],
  [-1, -1, 1, 1, 1, 0, -1],
  [1, 1, 1, 1, -1, 1, -1],
  [1, 1, -1, -1, -1, 0, 1],
  [-1, -1, 1, 1, 1, -1, 0],
  [-1, 1, -1, -1, -1, -1, -1],
  [-1, -1, 0, -1, 1, 0, -1],
  [1, 1, -1, -1, -1, -1, 0],
  [-1, 1, -1, -1, -1, -1, -1],
  [-1, -1, 1, 1, 1, 1, -1],
  [-1, -1, -1, 1, 0, 0, -1],
  [1, 0, -1, -1, -1, -1, 1],
  [0, 1, -1, -1, -1, -1, 1],
  [-1, 1, 0, -1, 1, 1, -1],
  [1, 1, -1, -1, -1, -1, -1],
  [0, 1, 0, 1, 1, 1, 1],
  [-1, -1, 1, 1, 1, 1, 1],
  [1, 0, -1, -1, -1, 1, -1],
  [1, 1, -1, -1, -1, 1, 1],
  [0, 0, 1, 1, 1, 1, -1],
];
// parties × theses
const M = PARTIES.map((_, p) => WAHLOMAT.map((row) => row[p]));

/* =========================================================================
   Small shared UI
   ========================================================================= */
function useInView(threshold = 0.35): [React.RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setSeen(true),
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen];
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [ref, seen] = useInView(0.25);
  return (
    <div
      ref={ref}
      style={{
        opacity: seen ? 1 : 0,
        transform: seen ? 'none' : 'translateY(22px)',
        transition: `opacity .8s ease ${delay}s, transform .8s cubic-bezier(.2,.7,.2,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function Eyebrow({ n, children }: { n: string | number; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 18,
      }}
    >
      <span
        style={{
          fontFamily: MONO,
          fontSize: 12,
          letterSpacing: 2,
          color: C.coral,
        }}
      >
        {n}
      </span>
      <span
        style={{
          height: 1,
          width: 34,
          background: C.panelEdge,
        }}
      />
      <span
        style={{
          fontFamily: MONO,
          fontSize: 11,
          letterSpacing: 3,
          textTransform: 'uppercase',
          color: C.muted,
        }}
      >
        {children}
      </span>
    </div>
  );
}

function DeepDive({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        marginTop: 22,
        border: `1px solid ${C.panelEdge}`,
        borderRadius: 12,
        background: C.panelSoft,
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '14px 18px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: C.ink,
          fontFamily: MONO,
          fontSize: 12.5,
          letterSpacing: 1,
          textAlign: 'left',
        }}
      >
        <span>
          <span style={{ color: C.teal }}>◈ </span>
          {title}
        </span>
        <ChevronDown
          size={16}
          color={C.muted}
          style={{
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform .3s',
          }}
        />
      </button>
      <div
        style={{
          maxHeight: open ? 900 : 0,
          transition: 'max-height .5s ease',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '2px 18px 20px',
            color: C.muted,
            fontSize: 14.5,
            lineHeight: 1.7,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

const K = ({ children }: { children: React.ReactNode }) => (
  <span style={{ fontFamily: MONO, color: C.ink }}>{children}</span>
);

// real typeset math (KaTeX) for the DeepDive boxes
function Tex({ children, block = false }: { children: string; block?: boolean }) {
  const html = useMemo(
    () => katex.renderToString(children, { throwOnError: false, displayMode: block }),
    [children, block]
  );
  return block ? (
    <div style={{ overflowX: 'auto', margin: '10px 0' }} dangerouslySetInnerHTML={{ __html: html }} />
  ) : (
    <span dangerouslySetInnerHTML={{ __html: html }} />
  );
}

function Scene({ id, children, center: ctr }: { id?: string; children: React.ReactNode; center?: boolean }) {
  return (
    <section
      id={id}
      style={{
        position: 'relative',
        maxWidth: 980,
        margin: '0 auto',
        padding: 'clamp(56px,9vh,110px) clamp(22px,5vw,40px)',
        display: ctr ? 'flex' : 'block',
        flexDirection: 'column',
        alignItems: ctr ? 'center' : 'stretch',
        textAlign: ctr ? 'center' : 'left',
      }}
    >
      {children}
    </section>
  );
}

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2
    style={{
      fontFamily: SERIF,
      fontWeight: 600,
      letterSpacing: '-0.015em',
      lineHeight: 1.15,
      fontSize: 'clamp(28px,4.2vw,42px)',
      color: C.ink,
      margin: '0 0 20px',
    }}
  >
    {children}
  </h2>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p
    style={{
      fontFamily: SANS,
      fontSize: 'clamp(16px,1.9vw,19px)',
      lineHeight: 1.72,
      color: C.ink2,
      margin: '0 auto 18px',
      maxWidth: 720,
    }}
  >
    {children}
  </p>
);

/* =========================================================================
   1 · HERO — drifting cloud whose axes swing to principal orientation
   ========================================================================= */
function HeroCloud() {
  const ref = useRef<HTMLCanvasElement>(null);
  const state = useRef<{ t: number; pts: { u: number; v: number; r: number }[] }>({ t: 0, pts: [] });
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    let raf: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const w = cv.clientWidth,
        h = cv.clientHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);
    // an elongated cloud ~ almost 1D, tilted
    const N = 150;
    state.current.pts = Array.from({ length: N }, () => {
      const u = (Math.random() - 0.5) * 2;
      const v = (Math.random() - 0.5) * 0.28;
      return { u, v, r: Math.random() };
    });
    const draw = () => {
      const w = cv.clientWidth,
        h = cv.clientHeight;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2,
        cy = h / 2;
      const s = Math.min(w, h) * 0.42;
      state.current.t += 0.008;
      const settle = Math.min(state.current.t / 3, 1);
      const target = -0.42;
      const ang = target * (0.5 - 0.5 * Math.cos(settle * Math.PI)); // ease to tilt
      const ca = Math.cos(ang),
        sa = Math.sin(ang);
      // axes
      const drawAxis = (dx: number, dy: number, col: string, len: number, lw: number) => {
        ctx.strokeStyle = col;
        ctx.lineWidth = lw;
        ctx.beginPath();
        ctx.moveTo(cx - dx * len, cy - dy * len);
        ctx.lineTo(cx + dx * len, cy + dy * len);
        ctx.stroke();
      };
      ctx.globalAlpha = 0.35;
      drawAxis(ca, sa, C.coral, s * 1.15, 2);
      drawAxis(-sa, ca, C.teal, s * 0.4, 1.5);
      ctx.globalAlpha = 1;
      // points
      state.current.pts.forEach((p) => {
        const x = p.u * ca - p.v * sa;
        const y = p.u * sa + p.v * ca;
        const px = cx + x * s;
        const py = cy + y * s;
        const tw = 0.5 + 0.5 * Math.sin(state.current.t * 1.5 + p.r * 9);
        ctx.beginPath();
        ctx.arc(px, py, 2.1 + tw * 1.1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(40,37,35,${(0.18 + tw * 0.32) * 0.4})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);
  return (
    <canvas
      ref={ref}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
      }}
    />
  );
}

/* =========================================================================
   GAL-TAN COMPASS — German parties placed by rough economic + GAL-TAN
   position, blob size by 2025 Bundestagswahl vote share (Zweitstimmen).
   Positions are illustrative, not derived from the Wahl-O-Mat data above.
   ========================================================================= */
const GALTAN_PARTIES = [
  { short: 'LINKE', x: -0.85, y: -0.55, vote: 8.8, col: '#8a2a5c' },
  { short: 'GRÜNE', x: -0.35, y: -0.8, vote: 11.6, col: '#1a5c3a' },
  { short: 'SPD', x: -0.3, y: -0.15, vote: 16.4, col: '#9b3a2a' },
  { short: 'FDP', x: 0.45, y: -0.2, vote: 4.3, col: '#9a8820' },
  { short: 'CDU/CSU', x: 0.35, y: 0.35, vote: 28.6, col: '#726961' },
  { short: 'BSW', x: -0.55, y: 0.55, vote: 4.97, col: '#a86a1a' },
  { short: 'AfD', x: 0.55, y: 0.9, vote: 20.8, col: '#2a5c8a' },
];
function GalTanCompass({ t }: { t: PoliticsDimensionsText }) {
  const size = 380;
  const pad = 46;
  const toX = (x: number) => pad + ((x + 1) / 2) * (size - 2 * pad);
  const toY = (y: number) => pad + ((y + 1) / 2) * (size - 2 * pad);
  const maxVote = Math.max(...GALTAN_PARTIES.map((p) => p.vote));
  const rFor = (v: number) => 10 + (Math.sqrt(v) / Math.sqrt(maxVote)) * 34;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        style={{
          width: size,
          maxWidth: '92vw',
          background: `radial-gradient(120% 120% at 50% 50%, ${C.panel} 0%, ${C.panelSoft} 100%)`,
          border: `1px solid ${C.panelEdge}`,
          borderRadius: 16,
        }}
      >
        {/* diagonal band hinting where most weight concentrates */}
        <line
          x1={toX(-1)}
          y1={toY(-1)}
          x2={toX(1)}
          y2={toY(1)}
          stroke={C.panelEdge}
          strokeWidth={40}
          strokeLinecap="round"
          opacity={0.35}
        />
        <line x1={size / 2} y1={pad - 14} x2={size / 2} y2={size - pad + 14} stroke={C.panelEdge} />
        <line x1={pad - 14} y1={size / 2} x2={size - pad + 14} y2={size / 2} stroke={C.panelEdge} />
        <text x={size - pad + 8} y={size / 2 + 4} fill={C.muted} fontSize="10" fontFamily={MONO} textAnchor="start">
          {t.compassRight}
        </text>
        <text x={pad - 8} y={size / 2 + 4} fill={C.muted} fontSize="10" fontFamily={MONO} textAnchor="end">
          {t.compassLeft}
        </text>
        <text x={size / 2} y={pad - 20} fill={C.muted} fontSize="10" fontFamily={MONO} textAnchor="middle">
          TAN
        </text>
        <text x={size / 2} y={size - pad + 30} fill={C.muted} fontSize="10" fontFamily={MONO} textAnchor="middle">
          GAL
        </text>
        {GALTAN_PARTIES.map((p) => {
          const r = rFor(p.vote);
          const X = toX(p.x),
            Y = toY(p.y);
          return (
            <g key={p.short}>
              <circle cx={X} cy={Y} r={r} fill={p.col} opacity={0.75} stroke={C.paper} strokeWidth={2} />
              <text
                x={X}
                y={Y + r + 14}
                fill={C.ink}
                fontSize="11.5"
                fontWeight="700"
                fontFamily={MONO}
                textAnchor="middle"
              >
                {p.short}
              </text>
              <text
                x={X}
                y={Y + r + 27}
                fill={C.muted}
                fontSize="10"
                fontFamily={MONO}
                textAnchor="middle"
              >
                {p.vote}%
              </text>
            </g>
          );
        })}
      </svg>
      <div
        style={{
          fontFamily: MONO,
          fontSize: 12,
          color: C.muted,
          marginTop: 14,
          maxWidth: 420,
          textAlign: 'center',
          lineHeight: 1.6,
        }}
      >
        {t.compassCaption1}
      </div>
      <div
        style={{
          fontFamily: MONO,
          fontSize: 11,
          color: C.muted,
          marginTop: 6,
          maxWidth: 420,
          textAlign: 'center',
          lineHeight: 1.5,
          opacity: 0.75,
        }}
      >
        {t.compassCaption2}
      </div>
    </div>
  );
}

/* =========================================================================
   4 · MATRIX BUILD
   ========================================================================= */
function MatrixBuild() {
  const [ref, seen] = useInView(0.3);
  const glyph = (v: number) => (v > 0 ? '+' : v < 0 ? '−' : '0');
  const col = (v: number) => (v > 0 ? C.teal : v < 0 ? C.coral : C.muted);
  return (
    <div ref={ref} style={{ overflowX: 'auto', padding: '6px 0' }}>
      <div
        style={{
          display: 'inline-grid',
          gridTemplateColumns: `120px repeat(${THESES.length}, 30px)`,
          gap: 4,
          fontFamily: MONO,
          fontSize: 13,
        }}
      >
        <div />
        {THESES.map((th, j) => (
          <div
            key={j}
            title={th}
            style={{
              color: C.muted,
              textAlign: 'center',
              fontSize: 10,
              cursor: 'help',
            }}
          >
            t{j + 1}
          </div>
        ))}
        {M.map((row, i) => (
          <React.Fragment key={i}>
            <div
              style={{
                color: PARTIES[i].col,
                fontWeight: 700,
                fontSize: 12,
                alignSelf: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              {PARTIES[i].name}
            </div>
            {row.map((v, j) => {
              const d = (i * THESES.length + j) * 0.005;
              return (
                <div
                  key={j}
                  title={`${PARTIES[i].name} · ${THESES[j]}`}
                  style={{
                    height: 30,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: 6,
                    background: C.panelSoft,
                    border: `1px solid ${C.panelEdge}`,
                    color: col(v),
                    opacity: seen ? 1 : 0,
                    transform: seen ? 'none' : 'scale(.6)',
                    transition: `all .4s ease ${d}s`,
                  }}
                >
                  {glyph(v)}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   6 · ROTATE SANDBOX — the heart. genuine 2D PCA.
   ========================================================================= */
function RotateSandbox({ t }: { t: PoliticsDimensionsText }) {
  const cv = useRef<HTMLCanvasElement>(null);
  const [angle, setAngle] = useState(0.9);
  const dragRef = useRef(false);
  const W = 460,
    H = 360;
  // a fixed tilted cloud
  const pts = useMemo(() => {
    let seed = 7;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    const arr = [];
    const tilt = 0.55;
    for (let i = 0; i < 90; i++) {
      const a = (rnd() - 0.5) * 2.6;
      const b = (rnd() - 0.5) * 0.7;
      arr.push({
        x: a * Math.cos(tilt) - b * Math.sin(tilt),
        y: a * Math.sin(tilt) + b * Math.cos(tilt),
      });
    }
    return arr;
  }, []);
  const c = useMemo(() => cov2(pts), [pts]);
  const best = useMemo(() => principalAngle(c), [c]);
  const vU = varAlong(c, angle);
  const vV = varAlong(c, angle + Math.PI / 2);
  const pctU = (vU / (vU + vV)) * 100;

  const toScreen = (x: number, y: number): [number, number] => [W / 2 + x * 66, H / 2 - y * 66];
  const handlePointer = (e: PointerEvent | React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragRef.current || !cv.current) return;
    const r = cv.current.getBoundingClientRect();
    const anyE = e as unknown as { touches?: { clientX: number; clientY: number }[]; clientX: number; clientY: number };
    const mx = (anyE.touches ? anyE.touches[0].clientX : anyE.clientX) - r.left - W / 2;
    const my = -((anyE.touches ? anyE.touches[0].clientY : anyE.clientY) - r.top - H / 2);
    setAngle(Math.atan2(my, mx));
  };
  useEffect(() => {
    const up = () => (dragRef.current = false);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointermove', handlePointer);
    return () => {
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointermove', handlePointer);
    };
  });

  useLayoutEffect(() => {
    if (!cv.current) return;
    const ctx = cv.current.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.current.width = W * dpr;
    cv.current.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    // faint grid
    ctx.strokeStyle = 'rgba(40,37,35,.06)';
    ctx.lineWidth = 1;
    for (let gx = 0; gx <= W; gx += 46) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, H);
      ctx.stroke();
    }
    for (let gy = 0; gy <= H; gy += 46) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(W, gy);
      ctx.stroke();
    }
    // projections onto chosen axis
    const ux = Math.cos(angle),
      uy = Math.sin(angle);
    pts.forEach((p) => {
      const proj = p.x * ux + p.y * uy;
      const [sx, sy] = toScreen(p.x, p.y);
      const [px, py] = toScreen(proj * ux, proj * uy);
      ctx.strokeStyle = 'rgba(155,58,42,.22)';
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(px, py);
      ctx.stroke();
    });
    // axes
    const axis = (a: number, col: string, len: number, lw: number) => {
      const [x1, y1] = toScreen(Math.cos(a) * -len, Math.sin(a) * -len);
      const [x2, y2] = toScreen(Math.cos(a) * len, Math.sin(a) * len);
      ctx.strokeStyle = col;
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };
    axis(angle + Math.PI / 2, C.violet, 2.6, 1.6);
    axis(angle, C.coral, 3.2, 2.6);
    // handle
    const [hx, hy] = toScreen(Math.cos(angle) * 2.9, Math.sin(angle) * 2.9);
    ctx.fillStyle = C.coral;
    ctx.beginPath();
    ctx.arc(hx, hy, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = C.paper;
    ctx.font = `700 10px ${MONO}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('↔', hx, hy);
    // points
    pts.forEach((p) => {
      const [sx, sy] = toScreen(p.x, p.y);
      ctx.beginPath();
      ctx.arc(sx, sy, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = C.ink;
      ctx.fill();
    });
  }, [angle, pts]);

  const snap = () => {
    // animate to best
    const start = angle;
    let target = best;
    while (target - start > Math.PI) target -= Math.PI;
    while (target - start < -Math.PI) target += Math.PI;
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min((t - t0) / 600, 1);
      const e = 1 - Math.pow(1 - k, 3);
      setAngle(start + (target - start) * e);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const aligned = Math.abs(((angle - best) % Math.PI + Math.PI + Math.PI / 2) % Math.PI - Math.PI / 2) < 0.04;

  return (
    <div
      style={{
        display: 'flex',
        gap: 26,
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <canvas
        ref={cv}
        onPointerDown={(e) => {
          dragRef.current = true;
          handlePointer(e);
        }}
        style={{
          width: W,
          height: H,
          maxWidth: '92vw',
          borderRadius: 14,
          background: C.panelSoft,
          border: `1px solid ${C.panelEdge}`,
          touchAction: 'none',
          cursor: 'grab',
        }}
      />
      <div style={{ width: 210, minWidth: 210 }}>
        <div style={{ fontFamily: MONO, fontSize: 11, color: C.muted, letterSpacing: 1 }}>
          {t.sandboxLabel}
        </div>
        {(
          [
            [t.sandboxAxis1, pctU, C.coral],
            [t.sandboxAxis2, 100 - pctU, C.violet],
          ] as [string, number, string][]
        ).map(([lab, val, col]) => (
          <div key={lab} style={{ marginTop: 12 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: MONO,
                fontSize: 12,
                color: C.ink,
                marginBottom: 4,
              }}
            >
              <span>{lab}</span>
              <span style={{ color: col }}>{val.toFixed(1)}%</span>
            </div>
            <div
              style={{
                height: 9,
                borderRadius: 5,
                background: C.panelEdge,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${val}%`,
                  background: col,
                  transition: 'width .1s linear',
                }}
              />
            </div>
          </div>
        ))}
        <button
          onClick={snap}
          style={{
            marginTop: 20,
            width: '100%',
            padding: '11px 14px',
            borderRadius: 10,
            border: `1px solid ${aligned ? C.teal : C.panelEdge}`,
            background: aligned ? 'rgba(26,92,58,.08)' : C.panel,
            color: aligned ? C.teal : C.ink,
            fontFamily: MONO,
            fontSize: 12.5,
            letterSpacing: 0.5,
            cursor: 'pointer',
            transition: 'all .3s',
          }}
        >
          {aligned ? t.sandboxAligned : t.sandboxSnap}
        </button>
        <p
          style={{
            fontSize: 12.5,
            lineHeight: 1.6,
            color: C.muted,
            marginTop: 14,
            fontFamily: SANS,
          }}
        >
          {t.sandboxHint}
        </p>
      </div>
    </div>
  );
}

/* =========================================================================
   8c · RANK-K MATRIX HEATMAP — watch A_k come into focus
   ========================================================================= */
function RankKMatrixHeatmap({ svd, t, lang }: { svd: any; t: PoliticsDimensionsText; lang: 'en' | 'de' }) {
  const { scores, loadings, mean, sv } = svd;
  const maxK = sv.length;
  const [k, setK] = useState(2);

  // A_k[i][j] = mean[j] + Σ_{ℓ<k} scores[i][ℓ] * loadings[j][ℓ]
  const Ak = useMemo(() => {
    return M.map((row, i) =>
      row.map((_, j) => {
        let v = mean[j];
        for (let l = 0; l < k; l++) v += scores[i][l] * loadings[j][l];
        return v;
      })
    );
  }, [k, scores, loadings, mean]);

  // ‖A − A_k‖_F = sqrt(Σ_{ℓ≥k} σ_ℓ²), from the theorem's own closed form
  const errF = Math.sqrt(sv.slice(k).reduce((s: number, v: number) => s + v * v, 0));
  const totalF = Math.sqrt(sv.reduce((s: number, v: number) => s + v * v, 0));

  // per-cell reconstruction error |A_k − A|, independent of agree/disagree sign.
  // entries live in {-1,0,+1}, so the worst possible miss is 2 (max error → hot);
  // a perfect reconstruction is 0 (no error → cool). Blue→orange (Okabe–Ito) instead
  // of teal→coral: the two ends stay distinguishable under red-green, blue-yellow,
  // and full colorblindness, and differ in lightness too so the scale still reads
  // in grayscale.
  const GOOD = [0, 114, 178]; // blue — good approximation
  const MID = [247, 247, 247]; // near-white — medium error
  const BAD = [230, 159, 0]; // orange — bad approximation
  const lerp3 = (a: number[], b: number[], t: number) => a.map((av, idx) => Math.round(av + (b[idx] - av) * t));
  const cellColor = (v: number, truth: number) => {
    const err = Math.min(Math.abs(v - truth) / 2, 1); // 0 = perfect, 1 = worst
    const mix = err < 0.5 ? lerp3(GOOD, MID, err / 0.5) : lerp3(MID, BAD, (err - 0.5) / 0.5);
    return `rgb(${mix.join(',')})`;
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: MONO, fontSize: 12, color: C.muted }}>k =</span>
        <input
          type="range"
          min={0}
          max={maxK}
          step={1}
          value={k}
          onChange={(e) => setK(Number(e.target.value))}
          style={{ width: 180 }}
        />
        <span style={{ fontFamily: MONO, fontSize: 13, color: C.ink, minWidth: 18 }}>{k}</span>
        <span style={{ fontFamily: MONO, fontSize: 12, color: C.muted, marginLeft: 10 }}>
          ‖A − A<sub>k</sub>‖<sub>F</sub> = <span style={{ color: C.gold }}>{errF.toFixed(2)}</span>
          {'  '}(of {totalF.toFixed(2)} total)
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 12,
          fontFamily: MONO,
          fontSize: 11,
          color: C.muted,
        }}
      >
        <span>{t.cellColorLegend}</span>
        <span
          style={{
            display: 'inline-block',
            width: 100,
            height: 10,
            borderRadius: 5,
            background: `linear-gradient(90deg, ${cellColor(0, 0)}, ${cellColor(0.5, 0)}, ${cellColor(1, 0)})`,
          }}
        />
        <span style={{ color: `rgb(${GOOD.join(',')})`, fontWeight: 700 }}>{t.cellColorExact}</span>
        <span>→</span>
        <span style={{ color: `rgb(${BAD.join(',')})`, fontWeight: 700 }}>{t.cellColorWayOff}</span>
      </div>
      <div style={{ overflowX: 'auto', padding: '4px 0' }}>
        <div
          style={{
            display: 'inline-grid',
            gridTemplateColumns: `120px repeat(${THESES.length}, 14px)`,
            gap: 2,
          }}
        >
          <div />
          {THESES.map((_, j) => (
            <div key={j} />
          ))}
          {Ak.map((row, i) => (
            <React.Fragment key={i}>
              <div
                style={{
                  color: PARTIES[i].col,
                  fontWeight: 700,
                  fontSize: 11,
                  fontFamily: MONO,
                  alignSelf: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                {PARTIES[i].short}
              </div>
              {row.map((v, j) => (
                <div
                  key={j}
                  title={`${PARTIES[i].name} · ${THESES[j]} · reconstructed ${v.toFixed(2)}, true ${M[i][j]} · error ${Math.abs(v - M[i][j]).toFixed(2)}`}
                  style={{
                    height: 14,
                    borderRadius: 2,
                    background: cellColor(v, M[i][j]),
                    transition: 'background .25s ease',
                  }}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
      <p style={{ fontSize: 12.5, lineHeight: 1.6, color: C.muted, marginTop: 12, fontFamily: SANS }}>
        {lang === 'de' ? (
          <>
            Jede Zelle ist danach eingefärbt, wie weit die Rang-<K>k</K>-Schätzung von der
            wahren Antwort der Partei entfernt ist — <span style={{ color: `rgb(${GOOD.join(',')})`, fontWeight: 700 }}>blau</span> bedeutet,
            die Rekonstruktion trifft genau, <span style={{ color: `rgb(${BAD.join(',')})`, fontWeight: 700 }}>orange</span> bedeutet,
            sie liegt stark daneben, unabhängig davon, ob die wahre Antwort Zustimmung
            oder Ablehnung war — so gewählt, dass beide Enden auch bei
            Rot-Grün-Farbenblindheit unterscheidbar bleiben. Zieh <K>k</K> von 0 bis {maxK}:
            bei <K>k=0</K> wird jede Partei mit der Durchschnittsantwort geschätzt
            (meist orange), und mit wachsendem <K>k</K> verschwindet Orange sichtbar aus
            dem Raster, bis bei <K>k={maxK}</K> alles blau ist — eine exakte Rekonstruktion.
            Die Fehlerzahl oben wird direkt aus dem Ende der Singulärwerte abgelesen,
            nicht aus dem Raster neu berechnet — Theorem und Bild stimmen
            konstruktionsbedingt überein und schrumpfen gemeinsam.
          </>
        ) : (
          <>
            Every cell is colored by how far the rank-<K>k</K> guess is from the party's
            true answer — <span style={{ color: `rgb(${GOOD.join(',')})`, fontWeight: 700 }}>blue</span> means
            the reconstruction nailed it, <span style={{ color: `rgb(${BAD.join(',')})`, fontWeight: 700 }}>orange</span> means
            it's badly wrong, regardless of whether the true answer was agree or
            disagree — chosen so the two ends stay distinct even under red–green color
            blindness. Drag <K>k</K> from 0 to {maxK}: at <K>k=0</K> every party is
            guessed as the average answer (mostly orange), and as <K>k</K> grows the grid
            visibly drains of orange until, at <K>k={maxK}</K>, it's entirely blue — an
            exact reconstruction. The error number above is read directly off the tail
            of the singular values, not recomputed from the grid — theorem and picture
            agree by construction, and shrink together.
          </>
        )}
      </p>
    </div>
  );
}

/* =========================================================================
   8d · CENTERING TOGGLE — raw offset vs. centered, on the real axes
   ========================================================================= */
function CenteringToggle({ svd, t }: { svd: any; t: PoliticsDimensionsText }) {
  const { scores, loadings, mean } = svd;
  const [centered, setCentered] = useState(true);
  // offset[ℓ] = ⟨mean, V_{*ℓ}⟩ — the raw coordinate of the origin along axis ℓ,
  // i.e. exactly what centering subtracts away
  const offset = useMemo(() => {
    const o = [0, 0];
    for (let l = 0; l < 2; l++) {
      let s = 0;
      for (let j = 0; j < mean.length; j++) s += mean[j] * loadings[j][l];
      o[l] = s;
    }
    return o;
  }, [mean, loadings]);

  const pts: { x: number; y: number }[] = scores.map((s: number[]) => ({
    x: s[0] + (centered ? 0 : offset[0]),
    y: s[1] + (centered ? 0 : offset[1]),
  }));
  const W = 360,
    H = 280;
  const ex = Math.max(...pts.map((p: { x: number; y: number }) => Math.abs(p.x)), Math.abs(offset[0])) * 1.3 || 1;
  const ey = Math.max(...pts.map((p: { x: number; y: number }) => Math.abs(p.y)), Math.abs(offset[1])) * 1.3 || 1;
  const e = Math.max(ex, ey);
  const sx = (x: number) => W / 2 + (x / e) * (W / 2 - 30);
  const sy = (y: number) => H / 2 - (y / e) * (H / 2 - 30);
  const [ox, oy] = [sx(centered ? 0 : offset[0]), sy(centered ? 0 : offset[1])];
  const [zx, zy] = [sx(0), sy(0)];

  return (
    <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: W, maxWidth: '92vw', background: C.panel, border: `1px solid ${C.panelEdge}`, borderRadius: 12 }}
      >
        <line x1={0} y1={H / 2} x2={W} y2={H / 2} stroke={C.panelEdge} />
        <line x1={W / 2} y1={0} x2={W / 2} y2={H} stroke={C.panelEdge} />
        {!centered && (
          <line
            x1={zx}
            y1={zy}
            x2={ox}
            y2={oy}
            stroke={C.coral}
            strokeWidth={2}
            markerEnd="url(#cta)"
          />
        )}
        <defs>
          <marker id="cta" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill={C.coral} />
          </marker>
        </defs>
        {pts.map((p, i) => (
          <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={5} fill={PARTIES[i].col} stroke={C.panel} strokeWidth={1} />
        ))}
        <circle cx={zx} cy={zy} r={4} fill="none" stroke={C.teal} strokeWidth={2} />
      </svg>
      <div style={{ width: 190, minWidth: 170 }}>
        <button
          onClick={() => setCentered((c) => !c)}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: 9,
            border: `1px solid ${centered ? C.teal : C.coral}`,
            background: centered ? 'rgba(26,92,58,.08)' : 'rgba(155,58,42,.08)',
            color: centered ? C.teal : C.coral,
            fontFamily: MONO,
            fontSize: 12.5,
            cursor: 'pointer',
          }}
        >
          {centered ? t.centeringCentered : t.centeringRaw}
        </button>
        <p style={{ fontSize: 12.5, lineHeight: 1.6, color: C.muted, marginTop: 12, fontFamily: SANS }}>
          {centered ? t.centeringHint1 : t.centeringHint2}
        </p>
      </div>
    </div>
  );
}

/* =========================================================================
   9 · SCREE PLOT + cumulative
   ========================================================================= */
function ScreePlot({ svd, t }: { svd: any; t: PoliticsDimensionsText }) {
  const [ref, seen] = useInView(0.4);
  const { ratios } = svd;
  const shown: number[] = ratios.filter((r: number) => r > 0.0005).slice(0, 7);
  const maxR = Math.max(...shown);
  return (
    <div ref={ref}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 14,
          height: 220,
          padding: '0 4px',
          borderBottom: `1px solid ${C.panelEdge}`,
        }}
      >
        {shown.map((r, i) => {
          return (
            <div
              key={i}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                height: '100%',
              }}
            >
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 12,
                  color: i === 0 ? C.gold : C.muted,
                  marginBottom: 6,
                }}
              >
                {(r * 100).toFixed(0)}%
              </div>
              <div
                style={{
                  width: '100%',
                  maxWidth: 54,
                  height: seen ? `${(r / maxR) * 100}%` : 0,
                  background: i === 0 ? C.gold : i === 1 ? C.coral : C.panelEdge,
                  borderRadius: '6px 6px 0 0',
                  transition: `height .8s cubic-bezier(.2,.7,.2,1) ${i * 0.08}s`,
                }}
              />
            </div>
          );
        })}
      </div>
      <div
        style={{
          display: 'flex',
          gap: 14,
          padding: '8px 4px 0',
        }}
      >
        {shown.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              textAlign: 'center',
              fontFamily: MONO,
              fontSize: 11,
              color: C.muted,
            }}
          >
            σ{i + 1}
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 20,
          fontFamily: MONO,
          fontSize: 13,
          color: C.ink,
        }}
      >
        {t.screePlotAxis1Alone}{' '}
        <span style={{ color: C.gold }}>{(ratios[0] * 100).toFixed(0)}%</span>
        {'  ·  '}
        {t.screePlotAxes12}{' '}
        <span style={{ color: C.coral }}>
          {((ratios[0] + ratios[1]) * 100).toFixed(0)}%
        </span>{' '}
        {t.screePlotOfDisagreement}
      </div>
    </div>
  );
}

/* =========================================================================
   10 · PARTY MAP  (with k = 1 / 2 toggle to dramatize "almost 1D")
   ========================================================================= */
function PartyMap({ svd, t }: { svd: any; t: PoliticsDimensionsText }) {
  const { scores, loadings } = svd;
  const [k, setK] = useState(2);
  const [showTheses, setShowTheses] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const W = 560,
    H = 420;
  // sign-orient: put Die Linke (index 4) on the left, GRÜNE (index 3) up
  const LINKE = 4,
    GRUENE = 3;
  const s1sign = scores[LINKE][0] > 0 ? -1 : 1;
  const s2sign = scores[GRUENE][1] >= 0 ? 1 : -1;
  // only label the most influential theses so the biplot stays legible
  const topTheses = useMemo<number[]>(() => {
    return loadings
      .map((l: number[], j: number) => ({ j, mag: Math.hypot(l[0], l[1]) }))
      .sort((a: { mag: number }, b: { mag: number }) => b.mag - a.mag)
      .slice(0, 12)
      .map((o: { j: number }) => o.j);
  }, [loadings]);
  const xs = scores.map((s: number[]) => s[0] * s1sign);
  const ys = scores.map((s: number[]) => (k >= 2 ? s[1] * s2sign : 0));
  const ex = Math.max(...xs.map(Math.abs)) * 1.25 || 1;
  const ey = Math.max(0.5, Math.max(...scores.map((s: number[]) => Math.abs(s[1])))) * 1.25;
  const sx = (x: number) => W / 2 + (x / ex) * (W / 2 - 60);
  const sy = (y: number) => H / 2 - (y / ey) * (H / 2 - 50);
  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        {[1, 2].map((kk) => (
          <button
            key={kk}
            onClick={() => setK(kk)}
            style={{
              padding: '8px 16px',
              borderRadius: 9,
              fontFamily: MONO,
              fontSize: 12.5,
              cursor: 'pointer',
              border: `1px solid ${k === kk ? C.coral : C.panelEdge}`,
              background: k === kk ? 'rgba(155,58,42,.08)' : C.panel,
              color: k === kk ? C.coral : C.muted,
            }}
          >
            {kk === 1 ? t.partyMapKeep1 : t.partyMapKeep2}
          </button>
        ))}
        <button
          onClick={() => setShowTheses((s) => !s)}
          style={{
            padding: '8px 16px',
            borderRadius: 9,
            fontFamily: MONO,
            fontSize: 12.5,
            cursor: 'pointer',
            border: `1px solid ${showTheses ? C.teal : C.panelEdge}`,
            background: showTheses ? 'rgba(26,92,58,.08)' : C.panel,
            color: showTheses ? C.teal : C.muted,
          }}
        >
          {showTheses ? t.partyMapHideTheses : t.partyMapShowTheses}
        </button>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{
          width: '100%',
          maxWidth: W,
          background: C.panelSoft,
          border: `1px solid ${C.panelEdge}`,
          borderRadius: 14,
        }}
      >
        <line x1={W / 2} y1={20} x2={W / 2} y2={H - 20} stroke={C.panelEdge} />
        <line x1={30} y1={H / 2} x2={W - 30} y2={H / 2} stroke={C.panelEdge} />
        <text x={W - 34} y={H / 2 - 8} fill={C.coral} fontSize="11" fontFamily={MONO} textAnchor="end">
          {t.partyMapAxis1}
        </text>
        {k >= 2 && (
          <text x={W / 2 + 8} y={26} fill={C.teal} fontSize="11" fontFamily={MONO}>
            {t.partyMapAxis2}
          </text>
        )}
        {/* thesis loading arrows (top 12 only) */}
        {showTheses &&
          topTheses.map((j) => {
            const l = loadings[j];
            const lx = l[0] * s1sign;
            const ly = k >= 2 ? l[1] * s2sign : 0;
            const scale = 4.2;
            const X = sx(lx * scale),
              Y = sy(ly * scale);
            return (
              <g key={j} opacity="0.85">
                <title>{THESES[j]}</title>
                <line
                  x1={W / 2}
                  y1={H / 2}
                  x2={X}
                  y2={Y}
                  stroke={C.teal}
                  strokeWidth="2.2"
                  opacity="0.45"
                />
                <text x={X} y={Y} fill={C.teal} fontSize="9" fontFamily={MONO} opacity="0.9">
                  t{j + 1}
                </text>
              </g>
            );
          })}
        {/* parties */}
        {PARTIES.map((p, i) => {
          const X = sx(xs[i]),
            Y = sy(ys[i]);
          return (
            <g
              key={i}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle cx={X} cy={Y} r={hover === i ? 11 : 8} fill={p.col} stroke={C.paper} strokeWidth="2" />
              <text
                x={X}
                y={Y - 15}
                fill={C.ink}
                fontSize="12"
                fontFamily={MONO}
                textAnchor="middle"
                fontWeight="700"
              >
                {p.short}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* =========================================================================
   AXIS MEANING — what SV1 and SV2 turn out to be (real loadings)
   ========================================================================= */
function AxisMeaning({ svd, t }: { svd: any; t: PoliticsDimensionsText }) {
  const { loadings, scores } = svd;
  const CDU = 0,
    LINKE = 4;
  const s1 = scores[LINKE][0] > 0 ? 1 : -1; // left = positive
  const s2 = scores[CDU][1] > 0 ? 1 : -1; // preservation = positive

  const THRESHOLD = 0.1;
  const [expanded1, setExpanded1] = useState(false);
  const [expanded2, setExpanded2] = useState(false);

  const allFor = (k: number, sgn: number, want: number): { j: number; v: number }[] =>
    loadings
      .map((l: number[], j: number) => ({ j, v: l[k] * sgn }))
      .filter((o: { j: number; v: number }) => (want > 0 ? o.v > 0 : o.v < 0))
      .sort((a: { v: number }, b: { v: number }) => Math.abs(b.v) - Math.abs(a.v));
  const topFor = (k: number, sgn: number, want: number, expanded: boolean) => {
    const all = allFor(k, sgn, want);
    return expanded ? all.filter((o) => Math.abs(o.v) >= THRESHOLD) : all.slice(0, 4);
  };

  const Pole = ({ items, color, label }: { items: { j: number; v: number }[]; color: string; label: string }) => (
    <div>
      <div
        style={{
          fontFamily: MONO,
          fontSize: 11,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          color,
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 6 }}>
        {items.map((o) => (
          <li
            key={o.j}
            style={{
              display: 'flex',
              gap: 10,
              alignItems: 'baseline',
              fontSize: 13.5,
              color: C.ink2,
            }}
          >
            <span style={{ fontFamily: MONO, color, fontSize: 12, minWidth: 42 }}>
              {o.v > 0 ? '+' : ''}
              {o.v.toFixed(2)}
            </span>
            <span>{THESES[o.j]}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const ThresholdControl = ({
    expanded,
    setExpanded,
    color,
  }: {
    expanded: boolean;
    setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
    color: string;
  }) => (
    <div
      style={{
        marginTop: 16,
        paddingTop: 14,
        borderTop: `1px solid ${C.panelEdge}`,
      }}
    >
      <button
        onClick={() => setExpanded((e) => !e)}
        style={{
          fontFamily: MONO,
          fontSize: 11.5,
          letterSpacing: 0.5,
          color,
          background: 'transparent',
          border: `1px solid ${color}`,
          borderRadius: 8,
          padding: '5px 10px',
          cursor: 'pointer',
        }}
      >
        {expanded ? t.axisMeaningShowTop4 : t.axisMeaningShowAbove.replace('{threshold}', THRESHOLD.toFixed(2))}
      </button>
    </div>
  );

  const Card = ({
    n,
    title,
    subtitle,
    leftPole,
    rightPole,
    note,
    threshold,
  }: {
    n: number;
    title: string;
    subtitle: string;
    leftPole: React.ReactNode;
    rightPole: React.ReactNode;
    note: string;
    threshold: React.ReactNode;
  }) => (
    <div
      style={{
        border: `1px solid ${C.panelEdge}`,
        borderRadius: 16,
        background: C.panel,
        padding: '22px 22px 24px',
      }}
    >
      <div style={{ fontFamily: MONO, fontSize: 12, color: C.coral, marginBottom: 4 }}>
        {t.axisLabel.replace('{n}', String(n))}
      </div>
      <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 22, color: C.ink, letterSpacing: '-0.01em' }}>
        {title}
      </div>
      <div style={{ color: C.muted, fontSize: 14, marginTop: 4, marginBottom: 18 }}>
        {subtitle}
      </div>
      <div style={{ display: 'grid', gap: 18 }}>
        {leftPole}
        {rightPole}
      </div>
      {threshold}
      <div
        style={{
          marginTop: 18,
          paddingTop: 14,
          borderTop: `1px solid ${C.panelEdge}`,
          color: C.muted,
          fontSize: 13.5,
          lineHeight: 1.6,
        }}
      >
        {note}
      </div>
    </div>
  );

  return (
    <div
      style={{
        display: 'grid',
        gap: 20,
        gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
      }}
    >
      <Card
        n={1}
        title={t.axis1Title}
        subtitle={t.axis1Subtitle}
        leftPole={
          <Pole label={t.axis1PullLeft} color={C.coral} items={topFor(0, s1, +1, expanded1)} />
        }
        rightPole={
          <Pole label={t.axis1PullRight} color={C.teal} items={topFor(0, s1, -1, expanded1)} />
        }
        note={t.axis1Note}
        threshold={
          <ThresholdControl expanded={expanded1} setExpanded={setExpanded1} color={C.coral} />
        }
      />
      <Card
        n={2}
        title={t.axis2Title}
        subtitle={t.axis2Subtitle}
        leftPole={
          <Pole label={t.axis2Preservation} color={C.coral} items={topFor(1, s2, +1, expanded2)} />
        }
        rightPole={
          <Pole label={t.axis2Change} color={C.teal} items={topFor(1, s2, -1, expanded2)} />
        }
        note={t.axis2Note}
        threshold={
          <ThresholdControl expanded={expanded2} setExpanded={setExpanded2} color={C.teal} />
        }
      />
    </div>
  );
}

/* =========================================================================
   MAIN
   ========================================================================= */
export function PoliticsDimensions() {
  const { lang } = useLanguage();
  const t = politicsDimensionsText[lang];
  const svd = useMemo(() => svdParties(M), []);
  const scrollTo = () =>
    document.getElementById('compass')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToResults = () =>
    document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div
      style={{
        background: C.paper,
        color: C.ink,
        fontFamily: SANS,
        overflowX: 'hidden',
      }}
    >
      {/* 1 · HERO */}
      <section
        style={{
          position: 'relative',
          minHeight: '78vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <HeroCloud />
        <div
          style={{
            position: 'relative',
            textAlign: 'center',
            padding: '0 22px',
            maxWidth: 860,
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: 12,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: C.coral,
              marginBottom: 22,
            }}
          >
            {t.heroEyebrow}
          </div>
          <h1
            style={{
              fontFamily: SERIF,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              lineHeight: 1.08,
              fontSize: 'clamp(34px,6.4vw,72px)',
              margin: 0,
              color: C.ink,
            }}
          >
            {t.heroTitleLine1}
            <br />
            {t.heroTitleLine2}
          </h1>
          <p
            style={{
              fontSize: 'clamp(16px,2.2vw,21px)',
              color: C.ink2,
              marginTop: 26,
              lineHeight: 1.6,
            }}
          >
            {t.heroSubtitle}
          </p>
          <p
            style={{
              fontSize: 'clamp(12.5px,1.3vw,14px)',
              color: C.muted,
              marginTop: 14,
              lineHeight: 1.6,
            }}
          >
            {t.heroNote}
          </p>
          <div
            style={{
              marginTop: 40,
              display: 'flex',
              gap: 14,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={scrollTo}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '13px 26px',
                borderRadius: 999,
                border: `1px solid ${C.panelEdge}`,
                background: C.panel,
                color: C.ink,
                fontFamily: MONO,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              {t.heroBegin} <ChevronDown size={16} />
            </button>
            <button
              onClick={scrollToResults}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '13px 26px',
                borderRadius: 999,
                border: `1px solid ${C.panelEdge}`,
                background: 'transparent',
                color: C.muted,
                fontFamily: MONO,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              {t.heroSkip} <ChevronDown size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* 2 · COMPASS */}
      <Scene id="compass">
        <Reveal>
          <Eyebrow n="01">{t.s01Eyebrow}</Eyebrow>
          <H2>{t.s01Title}</H2>
          <P>{t.s01P1}</P>
          <P>
            {t.s01P2a}
            <strong>{t.s01P2b}</strong>
            {t.s01P2c}
            <em>{t.s01P2d}</em>
            {t.s01P2e}
            <em>{t.s01P2f}</em>
            {t.s01P2g}
          </P>
          <P>{t.s01P3}</P>
        </Reveal>
        <Reveal delay={0.1}>
          <div style={{ marginTop: 30 }}>
            <GalTanCompass t={t} />
          </div>
        </Reveal>
      </Scene>

      {/* 3 · tension */}
      <Scene id="tension">
        <Reveal>
          <p
            style={{
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: 'clamp(24px,4vw,38px)',
              lineHeight: 1.3,
              maxWidth: 820,
              letterSpacing: '-0.01em',
              color: C.ink,
            }}
          >
            {t.s03Text1}
            <span style={{ color: C.coral }}>{t.s03Numbers}</span>.
          </p>
        </Reveal>
      </Scene>

      {/* 4 · POLITICS AS POINTS */}
      <Scene id="matrix">
        <Reveal>
          <Eyebrow n="02">{t.s02Eyebrow}</Eyebrow>
          <H2>{t.s02Title}</H2>
          <P>
            {t.s02P1a}
            <span style={{ color: C.teal }}>{t.s02Agree}</span>
            {t.s02P1b}
            <span style={{ color: C.muted }}>{t.s02Neutral}</span>
            {t.s02P1c}
            <span style={{ color: C.coral }}>{t.s02Disagree}</span>
            {t.s02P1d}
          </P>
        </Reveal>
        <Reveal delay={0.1}>
          <div style={{ marginTop: 26 }}>
            <MatrixBuild />
            <p style={{ fontFamily: MONO, fontSize: 12, color: C.muted, marginTop: 14 }}>
              {t.s02Caption.replace('{parties}', String(PARTIES.length)).replace('{theses}', String(THESES.length))}
            </p>
          </div>
        </Reveal>
        <DeepDive title={t.deepDiveObject}>
          {t.deepDiveObjectBody1}<Tex>{'A \\in \\mathbb{R}^{m\\times n}'}</Tex>{t.deepDiveObjectBody2}
          <K>m</K>{t.deepDiveObjectBody3}
          <K>n</K>{t.deepDiveObjectBody4}
          <Tex>{'\\{-1,0,+1\\}'}</Tex>{t.deepDiveObjectBody5}<K>i</K>{t.deepDiveObjectBody6}<Tex>{'A_{i*}'}</Tex>
          {t.deepDiveObjectBody7}<K>i</K>{t.deepDiveObjectBody8}
          <K>m</K>{t.deepDiveObjectBody9}<Tex>{'\\mathbb{R}^n'}</Tex>{t.deepDiveObjectBody10}
        </DeepDive>
      </Scene>

      {/* 5 · unpicturable */}
      <Scene id="highdim" center>
        <Reveal>
          <Eyebrow n="03">{t.s03bEyebrow}</Eyebrow>
          <H2>{t.s03bTitle}</H2>
          <P>
            {t.s03bP1} <br></br><br></br>
            {t.s03bP2}
          </P>
          <div
            style={{
              display: 'grid',
              gap: 14,
              gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
              textAlign: 'left',
              maxWidth: 720,
              marginTop: 6,
            }}
          >
            {[
              [t.s03bCard1H, t.s03bCard1B],
              [t.s03bCard2H, t.s03bCard2B],
            ].map(([h, b]) => (
              <div
                key={h}
                style={{
                  border: `1px solid ${C.panelEdge}`,
                  borderRadius: 12,
                  background: C.panel,
                  padding: '16px 18px',
                }}
              >
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 11,
                    letterSpacing: 1.5,
                    textTransform: 'uppercase',
                    color: C.coral,
                    marginBottom: 6,
                  }}
                >
                  {h}
                </div>
                <div style={{ color: C.ink2, fontSize: 14.5, lineHeight: 1.6 }}>
                  {b}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Scene>

      {/* 6 · SANDBOX */}
      <Scene id="sandbox">
        <Reveal>
          <Eyebrow n="04">{t.s04Eyebrow}</Eyebrow>
          <H2>{t.s04Title}</H2>
          <P>
            {t.s04P1a}
            <em>{t.s04Thesis1}</em>{t.s04P1b}<em>{t.s04Thesis2}</em>{t.s04P1c}
          </P>
          <P>{t.s04P2}</P>
          <P>
            {t.s04P3}
            <em>{t.s04Orthogonal}</em>
            {t.s04P3b}
          </P>
          <P>{t.s04P4}</P>
        </Reveal>
        <Reveal delay={0.1}>
          <div style={{ marginTop: 28 }}>
            <RotateSandbox t={t} />
          </div>
        </Reveal>
        <DeepDive title={t.deepDiveRotate}>
          {lang === 'de' ? (
            <>
              Jede Matrix tut mit dem Raum genau drei Dinge:{' '}
              <span style={{ color: C.violet }}>drehen</span> (<K>Vᵀ</K>),{' '}
              <span style={{ color: C.gold }}>strecken</span> entlang von Achsen (<K>Σ</K>), dann{' '}
              <span style={{ color: C.violet }}>drehen</span> erneut (<K>U</K>). Präzise formuliert:
              für jedes <Tex>{'A \\in \\mathbb{R}^{m\\times n}'}</Tex> vom Rang{' '}
              <Tex>r</Tex> existieren Matrizen <Tex>{'U\\in\\mathbb{R}^{m\\times r}'}</Tex>,{' '}
              <Tex>{'V\\in\\mathbb{R}^{n\\times r}'}</Tex> mit orthonormalen Spalten und
              reellen Zahlen <Tex>{'\\sigma_1\\ge\\cdots\\ge\\sigma_r>0'}</Tex>, sodass
              <Tex block>
                {'A = U\\Sigma V^{\\mathsf T}, \\qquad \\Sigma = \\operatorname{diag}(\\sigma_1,\\dots,\\sigma_r).'}
              </Tex>
              Der "beste Winkel" im Sandkasten ist die erste Spalte von <K>V</K>; die
              dabei erfasste Streuung ist <Tex>{'\\sigma_1'}</Tex> — der erste{' '}
              <em>Singulärwert</em>. Das ist keine von der Eigenzerlegung unabhängige
              Tatsache: Multipliziert man beide Seiten mit <Tex>{'A^{\\mathsf T}'}</Tex>, ergibt sich{' '}
              <Tex>{'A^{\\mathsf T}A = V\\Sigma^2V^{\\mathsf T}'}</Tex>, die Spektralzerlegung
              der symmetrischen positiv semidefiniten Matrix{' '}
              <Tex>{'A^{\\mathsf T}A'}</Tex> — die Spalten von <K>V</K> sind also genau
              ihre Eigenvektoren, und <Tex>{'\\sigma_i^2'}</Tex> ihre Eigenwerte. PCA liest
              diese direkt als Eigenvektoren der Kovarianzmatrix ab.
            </>
          ) : (
            <>
              Any matrix does exactly three things to space:{' '}
              <span style={{ color: C.violet }}>rotate</span> (<K>Vᵀ</K>),{' '}
              <span style={{ color: C.gold }}>stretch</span> along axes (<K>Σ</K>), then{' '}
              <span style={{ color: C.violet }}>rotate</span> again (<K>U</K>). Stated
              precisely: for any <Tex>{'A \\in \\mathbb{R}^{m\\times n}'}</Tex> of rank{' '}
              <Tex>r</Tex>, there exist matrices <Tex>{'U\\in\\mathbb{R}^{m\\times r}'}</Tex>,{' '}
              <Tex>{'V\\in\\mathbb{R}^{n\\times r}'}</Tex> with orthonormal columns and
              real numbers <Tex>{'\\sigma_1\\ge\\cdots\\ge\\sigma_r>0'}</Tex> such that
              <Tex block>
                {'A = U\\Sigma V^{\\mathsf T}, \\qquad \\Sigma = \\operatorname{diag}(\\sigma_1,\\dots,\\sigma_r).'}
              </Tex>
              The sandbox's "best angle" is the first column of <K>V</K>; the amount of
              spread it captures is <Tex>{'\\sigma_1'}</Tex> — the first{' '}
              <em>singular value</em>. This isn't a separate fact from eigendecomposition:
              multiplying both sides by <Tex>{'A^{\\mathsf T}'}</Tex> gives{' '}
              <Tex>{'A^{\\mathsf T}A = V\\Sigma^2V^{\\mathsf T}'}</Tex>, the spectral
              decomposition of the symmetric positive-semidefinite matrix{' '}
              <Tex>{'A^{\\mathsf T}A'}</Tex> — so <K>V</K>'s columns are exactly its
              eigenvectors, and <Tex>{'\\sigma_i^2'}</Tex> its eigenvalues. PCA reads
              these off in one shot as the eigenvectors of the covariance matrix.
            </>
          )}
        </DeepDive>
      </Scene>

      {/* 8 · PCA */}
      <Scene id="pca">
        <Reveal>
          <Eyebrow n="05">{t.s06Eyebrow}</Eyebrow>
          <H2>{t.s06Title}</H2>
          <P>{t.s06P1}</P>
          <P>{t.s06P2}</P>
          <P>{t.s06P3a}</P>
        </Reveal>
        <DeepDive title={t.deepDiveCentering}>
          <CenteringToggle svd={svd} t={t} />
          <div style={{ height: 18 }} />
          {lang === 'de' ? (
            <>
              Für jede These (Spalte) <K>j</K> berechnet man ihren Mittelwert über die Parteien:{' '}
              <Tex>{'\\mu_j = \\tfrac{1}{m}\\sum_{i=1}^m A_{ij}'}</Tex>. Die zentrierte
              Matrix ist
              <Tex block>{'\\tilde A = A - \\mathbf 1\\mu^{\\mathsf T},'}</Tex>
              wobei <K>1</K> die Einsvektor-Spalte ist und <K>μ</K> der Vektor der
              Spaltenmittelwerte — jede Zeile von <Tex>{'\\mathbf 1\\mu^{\\mathsf T}'}</Tex> ist
              einfach wieder <K>μ</K>, sodass derselbe Mittelwertvektor von jeder Parteizeile
              abgezogen wird. Jede Spalte von <Tex>{'\\tilde A'}</Tex> summiert sich nun zu null.
              Das Subtrahieren einer Konstante von einer Spalte ist eine Translation, und
              Translationen erhalten alle paarweisen Abstände und Distanzen innerhalb der
              Wolke — die Form bleibt unangetastet, nur ihre Position relativ zum Ursprung
              ändert sich. PCA diagonalisiert dann die Kovarianz
              <Tex block>{'\\Sigma_{\\text{cov}} = \\tilde A^{\\mathsf T}\\tilde A / m;'}</Tex>
              ihre Eigenvektoren sind genau die rechten Singulärvektoren von{' '}
              <Tex>{'\\tilde A'}</Tex> (Spalten von <K>V</K>), mit Eigenwerten{' '}
              <Tex>{'\\sigma_i^2/m'}</Tex>. "Hauptkomponentenanalyse" und "SVD der
              zentrierten Matrix" sind also dieselbe Berechnung unter zwei Namen.
            </>
          ) : (
            <>
              For each thesis (column) <K>j</K>, compute its mean over parties:{' '}
              <Tex>{'\\mu_j = \\tfrac{1}{m}\\sum_{i=1}^m A_{ij}'}</Tex>. The centered
              matrix is
              <Tex block>{'\\tilde A = A - \\mathbf 1\\mu^{\\mathsf T},'}</Tex>
              where <K>1</K> is the all-ones column and <K>μ</K> the vector of column
              means — each row of <Tex>{'\\mathbf 1\\mu^{\\mathsf T}'}</Tex> is just{' '}
              <K>μ</K> again, so this subtracts the same mean vector from every party's
              row. Every column of <Tex>{'\\tilde A'}</Tex> now sums to zero.
              Subtracting a constant from a column is a translation, and translations
              preserve all pairwise differences and distances within the cloud — the
              shape is untouched, only its position relative to the origin changes. PCA
              then diagonalizes the covariance
              <Tex block>{'\\Sigma_{\\text{cov}} = \\tilde A^{\\mathsf T}\\tilde A / m;'}</Tex>
              its eigenvectors are exactly the right singular vectors of{' '}
              <Tex>{'\\tilde A'}</Tex> (columns of <K>V</K>), with eigenvalues{' '}
              <Tex>{'\\sigma_i^2/m'}</Tex>. So "principal component analysis" and "SVD
              of the centered matrix" are the same computation wearing two names.
            </>
          )}
        </DeepDive>
      </Scene>

      {/* 9 · THE MAP (payoff) */}
      <Scene id="map">
        <Reveal>
          <Eyebrow n="06">{t.s07Eyebrow}</Eyebrow>
          <H2>{t.s07Title}</H2>
          <P>{t.s07P1}</P>
          <P>{t.s07P2}</P>
        </Reveal>
        <Reveal delay={0.1}>
          <div style={{ marginTop: 26 }}>
            <PartyMap svd={svd} t={t} />
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <P>{t.s07P3}</P>
        </Reveal>
        <DeepDive title={t.deepDiveRankK}>
          <RankKMatrixHeatmap svd={svd} t={t} lang={lang} />
          <div style={{ height: 18 }} />
          {lang === 'de' ? (
            <>
              Nur die obersten <K>k</K> Achsen zu behalten ist keine Heuristik — es ist
              nachweislich das Bestmögliche. Schreibt man die abgeschnittene SVD als
              <Tex block>
                {'A_k := \\sum_{\\ell=1}^{k}\\sigma_\\ell\\, U_{*\\ell}V_{*\\ell}^{\\mathsf T},'}
              </Tex>
              die Rang-<K>k</K>-Matrix, gebaut aus den <K>k</K> stärksten Singulärrichtungen —
              genau die allgemeine <K>n</K>-dimensionale Version des "Griff drehen"-Spiels
              aus dem Sandkasten oben, nun mit <K>k</K> Griffen statt einem. Das{' '}
              <em>Eckart–Young-Theorem</em> besagt, dass <K>A_k</K> den Frobenius-Abstand
              zu <K>A</K> unter <em>jeder</em> Rang-<K>k</K>-Matrix{' '}
              <K>B</K> minimiert, und außerdem
              <Tex block>
                {'\\|A-A_k\\|_F \\;=\\; \\min_{\\operatorname{rank}(B)=k}\\|A-B\\|_F, \\qquad \\|A-A_k\\|_F^2=\\sum_{\\ell>k}\\sigma_\\ell^2.'}
              </Tex>
              Zusammen mit <Tex>{'\\|A\\|_F^2=\\sum_\\ell\\sigma_\\ell^2'}</Tex> (dem Beitrag
              jedes Singulärwerts zur Gesamtstreuung) ist das genau die Arithmetik hinter der
              "ungefähr die Hälfte… drei Viertel"-Lesart des Scree-Plots unten: Es gibt keine
              Rang-2-Matrix, wie geschickt auch gewählt, die die Parteidaten besser trifft als
              die zwei stärksten Achsen zu behalten.
            </>
          ) : (
            <>
              Keeping only the top <K>k</K> axes isn't a heuristic — it's provably the
              best you can do. Write the truncated SVD as
              <Tex block>
                {'A_k := \\sum_{\\ell=1}^{k}\\sigma_\\ell\\, U_{*\\ell}V_{*\\ell}^{\\mathsf T},'}
              </Tex>
              the rank-<K>k</K> matrix built from the <K>k</K> strongest singular
              directions — exactly the general-<K>n</K>-dimensional version of the
              "rotate the handle" game from the sandbox above, now with <K>k</K> handles
              instead of one. The <em>Eckart–Young theorem</em> says <K>A_k</K> minimizes
              the Frobenius distance to <K>A</K> among <em>every</em> rank-<K>k</K> matrix{' '}
              <K>B</K>, and moreover
              <Tex block>
                {'\\|A-A_k\\|_F \\;=\\; \\min_{\\operatorname{rank}(B)=k}\\|A-B\\|_F, \\qquad \\|A-A_k\\|_F^2=\\sum_{\\ell>k}\\sigma_\\ell^2.'}
              </Tex>
              Combined with <Tex>{'\\|A\\|_F^2=\\sum_\\ell\\sigma_\\ell^2'}</Tex> (each
              singular value's contribution to the total spread), this is exactly the
              arithmetic behind the "roughly half… three-quarters" reading of the scree
              plot below: there is no rank-2 matrix, however cleverly chosen, that fits
              the party data better than keeping the two strongest axes.
            </>
          )}
        </DeepDive>
      </Scene>

      {/* 10 · WHAT THE AXES ARE */}
      <Scene id="axes">
        <Reveal>
          <Eyebrow n="07">{t.s08Eyebrow}</Eyebrow>
          <H2>{t.s08Title}</H2>
          <P>{t.s08P1}</P>
          <P>{t.s08P2}</P>
        </Reveal>
        <Reveal delay={0.1}>
          <div style={{ marginTop: 26 }}>
            <AxisMeaning svd={svd} t={t} />
          </div>
        </Reveal>
      </Scene>

      {/* 11 · EXPLAINED VARIANCE */}
      <Scene id="variance">
        <Reveal>
          <Eyebrow n="08">{t.s09Eyebrow}</Eyebrow>
          <H2>{t.s09Title}</H2>
          <P>{t.s09P1}</P>
        </Reveal>
        <Reveal delay={0.1}>
          <div
            style={{
              marginTop: 30,
              padding: '26px 24px',
              borderRadius: 16,
              background: C.panel,
              border: `1px solid ${C.panelEdge}`,
            }}
          >
            <ScreePlot svd={svd} t={t} />
          </div>
        </Reveal>
        <DeepDive title={t.deepDiveStability}>
          {lang === 'de' ? (
            <>
              Eine naheliegende Sorge: Hätte der Wahl-O-Mat eine These weniger gestellt,
              oder hätte eine Partei eine Frage anders beantwortet, könnte sich das
              gesamte Zwei-Achsen-Bild dann stark verschieben? <em>Weyls Theorem</em>{' '}
              über Singulärwerte begrenzt genau das. Für zwei beliebige Matrizen{' '}
              <K>X</K>, <K>Y</K> gleicher Form gilt
              <Tex block>
                {'\\sigma_{i+j-1}(X+Y)\\;\\le\\;\\sigma_i(X)+\\sigma_j(Y)\\qquad(i,j\\ge 1).'}
              </Tex>
              Setzt man <K>X = A</K> und <K>Y</K> als kleine Störung (eine geänderte
              Antwort, eine weggelassene These) und <K>j = 1</K>, ergibt sich{' '}
              <Tex>{'\\sigma_i(A+Y)\\le\\sigma_i(A)+\\sigma_1(Y)'}</Tex>: Jeder Singulärwert
              verschiebt sich um höchstens die Größe der Störung selbst — nie mehr.
              Die Zwei-Achsen-Struktur ist kein fragiles Artefakt genau dieses
              38-Thesen-Fragebogens; sie ist stabil unter der Art kleiner Änderungen,
              die die Entscheidungen eines Redaktionsteams tatsächlich ausmachen.
            </>
          ) : (
            <>
              A natural worry: if the Wahl-O-Mat had asked one fewer thesis, or a party
              had answered one question differently, could the whole two-axis picture
              shift wildly? <em>Weyl's theorem</em> on singular values bounds exactly
              this. For any two matrices <K>X</K>, <K>Y</K> of the same shape,
              <Tex block>
                {'\\sigma_{i+j-1}(X+Y)\\;\\le\\;\\sigma_i(X)+\\sigma_j(Y)\\qquad(i,j\\ge 1).'}
              </Tex>
              Taking <K>X = A</K> and <K>Y</K> a small perturbation (one changed
              answer, one dropped thesis), setting <K>j = 1</K> gives{' '}
              <Tex>{'\\sigma_i(A+Y)\\le\\sigma_i(A)+\\sigma_1(Y)'}</Tex>: each singular
              value moves by at most the size of the perturbation itself — never more.
              The two-axis structure isn't a fragile artifact of this exact 38-thesis
              questionnaire; it's stable under the kind of small edits an editorial
              committee's choices actually amount to.
            </>
          )}
        </DeepDive>
      </Scene>

      {/* 12 · THE ANSWER */}
      <Scene id="answer">
        <Reveal>
          <Eyebrow n="09">{t.s10Eyebrow}</Eyebrow>
          <H2>{t.s10Title}</H2>
          <P>{t.s10P1}</P>
          <div style={{ display: 'grid', gap: 14, marginTop: 6, maxWidth: 720 }}>
            {[
              [t.s10Card1H, t.s10Card1B],
              [t.s10Card2H, t.s10Card2B],
            ].map(([h, b], i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: 14,
                  padding: '16px 18px',
                  borderRadius: 12,
                  background: C.panel,
                  border: `1px solid ${C.panelEdge}`,
                }}
              >
                <span style={{ fontFamily: MONO, color: C.gold, fontSize: 16, lineHeight: 1.2 }}>
                  {'*'.repeat(i + 1)}
                </span>
                <div>
                  <div style={{ fontWeight: 700, color: C.ink, marginBottom: 3 }}>{h}</div>
                  <div style={{ color: C.muted, fontSize: 14.5, lineHeight: 1.6 }}>{b}</div>
                </div>
              </div>
            ))}
          </div>
          <P>{t.s10P2}</P>
        </Reveal>
      </Scene>

      {/* 13 · LIMITS */}
      <Scene id="limits">
        <Reveal>
          <Eyebrow n="10">{t.s11Eyebrow}</Eyebrow>
          <H2>{t.s11Title}</H2>
          <div style={{ display: 'grid', gap: 14, marginTop: 8 }}>
            {[
              [t.s11Card1H, t.s11Card1B],
              [t.s11Card2H, t.s11Card2B],
              [t.s11Card3H, t.s11Card3B],
              [t.s11Card4H, t.s11Card4B],
            ].map(([h, b], i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: 14,
                  padding: '16px 18px',
                  borderRadius: 12,
                  background: C.panel,
                  border: `1px solid ${C.panelEdge}`,
                }}
              >
                <span style={{ fontFamily: MONO, color: C.coral, fontSize: 13 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <div style={{ fontWeight: 700, color: C.ink, marginBottom: 3 }}>{h}</div>
                  <div style={{ color: C.muted, fontSize: 14.5, lineHeight: 1.6 }}>{b}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Scene>

      {/* 14 · ZOOM OUT */}
      <Scene id="zoom" center>
        <Reveal>
          <Eyebrow n="11">{t.s12Eyebrow}</Eyebrow>
          <H2>{t.s12Title}</H2>
          <P>{t.s12P1}</P>
        </Reveal>
      </Scene>

      {/* FOOTER · data source & legal notice (bpb terms) */}
      <div
        style={{
          borderTop: `1px solid ${C.panelEdge}`,
          background: C.panelSoft,
          padding: '42px clamp(22px,5vw,40px) 54px',
        }}
      >
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: C.coral,
              marginBottom: 16,
            }}
          >
            {t.footerEyebrow}
          </div>
          <div
            style={{
              display: 'inline-block',
              fontFamily: MONO,
              fontSize: 11.5,
              color: C.gold,
              border: `1px solid ${C.panelEdge}`,
              borderRadius: 8,
              padding: '7px 12px',
              marginBottom: 18,
              background: C.panel,
            }}
          >
            {lang === 'de' ? (
              <>Die bpb ist <strong>nicht</strong> die Urheberin dieser Analyse.</>
            ) : (
              <>The bpb is <strong>not</strong> the author of this analysis.</>
            )}
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 14.5,
              lineHeight: 1.72,
              color: C.muted,
              display: 'grid',
              gap: 12,
            }}
          >
            <p style={{ margin: 0 }}>
              {t.footerP1a}
              <span style={{ color: C.ink }}>{t.footerP1b}</span>
              {t.footerP1c}
              <span style={{ color: C.ink }}>{t.footerP1d}</span>
              {t.footerP1e}
            </p>
            <p style={{ margin: 0 }}>{t.footerP2}</p>
            <p style={{ margin: 0 }}>{t.footerAI}</p>
            <p style={{ margin: 0 }}>
              {t.footerP3a}
              <span style={{ color: C.ink }}>{t.footerP3Not}</span>
              {t.footerP3b}
            </p>
            <p style={{ margin: 0 }}>
              {t.footerSource}{' '}
              <a
                href="https://archiv.wahl-o-mat.de/bundestagswahl2025/app/main_app.html"
                target="_blank"
                rel="noreferrer noopener"
                style={{ color: C.teal, textDecoration: 'none' }}
              >
                archiv.wahl-o-mat.de/bundestagswahl2025
              </a>
            </p>
          </div>
          <div
            style={{
              marginTop: 24,
              paddingTop: 20,
              borderTop: `1px solid ${C.panelEdge}`,
              fontFamily: SANS,
              fontSize: 13.5,
              lineHeight: 1.7,
              color: C.muted,
              fontStyle: 'italic',
            }}
          >
            {t.footerNote}
          </div>
        </div>
      </div>
    </div>
  );
}
