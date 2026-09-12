'use client';

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { planimeterText, type PlanimeterText } from './planimeter.i18n';
import { SAMPLES, sampleById, type Sample } from './planimeter.samples';
import {
  buildLinkage,
  CALIBRATIONS,
  dist,
  integrateMove,
  meToMM,
  mmToME,
  readWheel,
  reachRange,
  shoelace,
  WHEEL_CIRCUMFERENCE,
  zeroCircleArea,
  zeroCircleRadius,
  type Linkage,
  type Vec,
} from './planimeter.geometry';

/* =========================================================================
   Design tokens — site palette, pencil flavour for the drawn parts.
   ========================================================================= */
const C = {
  paper: '#faf9f7',
  sheet: '#fffefb',
  panel: '#ffffff',
  edge: '#dbd9d4',
  soft: '#f7f7f5',
  ink: '#282523',
  ink2: '#4d4844',
  muted: '#958e82',
  faint: '#c4c0b8',
  accent: '#1a5c3a',
  accentLight: '#2a7a52',
  brass: '#8b6a13',
  brassLight: '#b08c2a',
  steel: '#6b6f76',
  steelDark: '#4a4e54',
  red: '#9b3a2a',
  pencil: '#5e5751',
};
const SANS = "'Source Sans 3', system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

/* table (paper) coordinate system, in mm */
const TABLE_W = 264;
const TABLE_H = 192;

/* pole arm is fixed on a real instrument; only the tracer arm is adjustable */
const POLE_ARM = 70; // R, mm
const WHEEL_OFFSET = 16; // wheel distance from the hinge, along the tracer arm

/** how close (mm) the tracer must return to its start for a contour to count as closed */
const CLOSE_TOLERANCE = 4;

/**
 * Tracer-arm length for a calibration setting.
 *
 * The instrument must be self-consistent: the factor k printed on the arm has
 * to be the one the wheel actually delivers. Since
 *
 *     A[mm²] = roll[mm] · L   and   roll[mm] = m[ME]/100 · circumference,
 *
 * we get  A[cm²] = m · (circumference · L / 10000), so
 *
 *     k = circumference · L / 10000   ⇒   L = 10000 k / circumference.
 *
 * Deriving L from k this way (rather than scaling f by a guessed constant)
 * keeps the notepad arithmetic A = k·m in exact agreement with the wheel.
 * The real table is itself consistent with this: k ∝ f throughout.
 */
const armLengthFromK = (k: number) => (10000 * k) / WHEEL_CIRCUMFERENCE;

/* =========================================================================
   small helpers
   ========================================================================= */
const fmt = (v: number, d = 2) =>
  v.toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });

const pathOf = (pts: Vec[], close = true) =>
  pts.length
    ? `M ${pts.map((p) => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' L ')}${close ? ' Z' : ''}`
    : '';

/** point-in-polygon, ray casting */
function pointInPoly(p: Vec, poly: Vec[]) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i];
    const b = poly[j];
    if (a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x)
      inside = !inside;
  }
  return inside;
}

/* =========================================================================
   MOVING-PART RING — every draggable / moving component wears one on hover
   ========================================================================= */
function MoverRing({
  at,
  r = 7,
  active,
  hot,
  color = C.accent,
}: {
  at: Vec;
  r?: number;
  active: boolean;
  hot: boolean;
  color?: string;
}) {
  if (!active && !hot) return null;
  return (
    <g pointerEvents="none">
      <circle
        cx={at.x}
        cy={at.y}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={hot ? 0.7 : 0.45}
        opacity={hot ? 0.95 : 0.5}
      />
      <circle
        cx={at.x}
        cy={at.y}
        r={r + 3.5}
        fill="none"
        stroke={color}
        strokeWidth={0.3}
        opacity={hot ? 0.45 : 0.18}
        strokeDasharray="1.5 2"
      />
    </g>
  );
}

/* =========================================================================
   THE MEASURING UNIT — drum + vernier + revolution dial, as on the original
   ========================================================================= */
function MeasuringUnit({
  me,
  t,
  compact,
}: {
  me: number;
  t: PlanimeterText;
  compact?: boolean;
}) {
  const r = readWheel(me);

  // drum: 100 divisions, we show a window of ~22 around the current value
  const span = 22;
  const centre = r.value % 100;
  const ticks: { v: number; x: number }[] = [];
  for (let i = Math.floor(centre - span / 2) - 2; i <= Math.ceil(centre + span / 2) + 2; i++) {
    const v = ((i % 100) + 100) % 100;
    ticks.push({ v, x: ((i - centre) / span) * 100 + 50 });
  }

  const H = compact ? 92 : 112;

  return (
    <div
      style={{
        background: C.panel,
        border: `1px solid ${C.edge}`,
        borderRadius: 10,
        padding: compact ? '10px 12px 12px' : '12px 14px 14px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontSize: 9.5,
            letterSpacing: 1.6,
            textTransform: 'uppercase',
            color: C.muted,
          }}
        >
          {t.reading}
        </span>
        {/* The four digits are read as one number: revolutions and drum give the
            whole wheel units, the vernier the tenth. 0·79·5 means 79,5 ME — the
            decimal point belongs before the vernier digit, not after the dial. */}
        <span style={{ fontFamily: MONO, fontSize: 22, color: C.ink, letterSpacing: 1 }}>
          <span style={{ color: r.revs ? C.ink : C.faint }}>{r.revs}</span>
          {String(r.drum).padStart(2, '0')}
          <span style={{ color: C.faint }}>,</span>
          <span style={{ color: C.brass }}>{r.vernier}</span>
          <span style={{ fontSize: 11, color: C.muted, marginLeft: 5 }}>{t.me}</span>
        </span>
      </div>

      <svg viewBox={`0 0 200 ${H}`} style={{ width: '100%', display: 'block' }}>
        <defs>
          <linearGradient id="brassDrum" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8d9a8" />
            <stop offset="22%" stopColor="#c9a94e" />
            <stop offset="52%" stopColor="#a8862c" />
            <stop offset="78%" stopColor="#c9a94e" />
            <stop offset="100%" stopColor="#8a6c1e" />
          </linearGradient>
          <linearGradient id="dialFace" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fdfcf8" />
            <stop offset="100%" stopColor="#e8e4d9" />
          </linearGradient>
          <clipPath id="drumWin">
            <rect x="46" y="20" width="148" height="30" rx="2" />
          </clipPath>
        </defs>

        {/* revolution dial (worm gear, 0..9) */}
        <g transform="translate(22,35)">
          <circle r="19" fill="url(#dialFace)" stroke={C.steel} strokeWidth="1.1" />
          <circle r="15.5" fill="none" stroke={C.edge} strokeWidth="0.4" />
          {Array.from({ length: 10 }, (_, i) => {
            const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
            return (
              <g key={i}>
                <line
                  x1={Math.cos(a) * 15.5}
                  y1={Math.sin(a) * 15.5}
                  x2={Math.cos(a) * 12.5}
                  y2={Math.sin(a) * 12.5}
                  stroke={C.ink2}
                  strokeWidth="0.5"
                />
                <text
                  x={Math.cos(a) * 8.6}
                  y={Math.sin(a) * 8.6 + 2.4}
                  textAnchor="middle"
                  fontFamily={MONO}
                  fontSize="5.4"
                  fill={C.ink2}
                >
                  {i}
                </text>
              </g>
            );
          })}
          {/* pointer */}
          <g transform={`rotate(${(r.value / 100) * 36})`}>
            <path d="M 0 3 L -1.5 0 L 0 -14 L 1.5 0 Z" fill={C.red} />
          </g>
          <circle r="1.8" fill={C.steelDark} />
          <text
            y="27"
            textAnchor="middle"
            fontFamily={MONO}
            fontSize="5"
            fill={C.muted}
            letterSpacing="0.6"
          >
            {t.revs}
          </text>
        </g>

        {/* drum window */}
        <rect
          x="45"
          y="19"
          width="150"
          height="32"
          rx="3"
          fill="url(#brassDrum)"
          stroke={C.steelDark}
          strokeWidth="1"
        />
        <g clipPath="url(#drumWin)">
          <rect x="46" y="20" width="148" height="30" fill="url(#brassDrum)" />
          {ticks.map((tk, i) => {
            const x = 46 + (tk.x / 100) * 148;
            const major = tk.v % 10 === 0;
            const mid = tk.v % 5 === 0;
            return (
              <g key={i}>
                <line
                  x1={x}
                  y1={20}
                  x2={x}
                  y2={major ? 33 : mid ? 29 : 26}
                  stroke="#3a2f14"
                  strokeWidth={major ? 0.65 : 0.4}
                  opacity={0.85}
                />
                {major && (
                  <text
                    x={x}
                    y={44}
                    textAnchor="middle"
                    fontFamily={MONO}
                    fontSize="7"
                    fill="#3a2f14"
                  >
                    {tk.v}
                  </text>
                )}
              </g>
            );
          })}
        </g>
        {/* index line */}
        <line x1="120" y1="14" x2="120" y2="56" stroke={C.red} strokeWidth="0.9" />
        <path d="M 117 12 L 123 12 L 120 17 Z" fill={C.red} />

        {/* vernier: 10 divisions spanning 9 drum divisions */}
        <g transform="translate(0,56)">
          <rect
            x="82"
            y="0"
            width="76"
            height="15"
            rx="2"
            fill={C.soft}
            stroke={C.steel}
            strokeWidth="0.7"
          />
          {Array.from({ length: 11 }, (_, i) => {
            // vernier zero sits at the index, shifted by the fractional part
            const frac = r.vernier / 10;
            const x = 120 - frac * ((148 / span) * 1) * 1 + (i * (148 / span) * 0.9);
            const x0 = 120 - frac * (148 / span) + i * (148 / span) * 0.9;
            void x;
            return (
              <g key={i}>
                <line
                  x1={x0}
                  y1={0}
                  x2={x0}
                  y2={i % 5 === 0 ? 8 : 5.5}
                  stroke={i === 0 ? C.red : C.ink2}
                  strokeWidth={i === 0 ? 0.7 : 0.4}
                />
                {i % 5 === 0 && (
                  <text
                    x={x0}
                    y={13.5}
                    textAnchor="middle"
                    fontFamily={MONO}
                    fontSize="5"
                    fill={C.ink2}
                  >
                    {i}
                  </text>
                )}
              </g>
            );
          })}
          <text
            x="164"
            y="10"
            fontFamily={MONO}
            fontSize="5.4"
            fill={C.muted}
            letterSpacing="0.5"
          >
            {t.vernier}
          </text>
        </g>
      </svg>
    </div>
  );
}

/* =========================================================================
   MAIN
   ========================================================================= */
type Mode = 'idle' | 'tracing';
type Drag = null | 'tracer' | 'pole';

type Run = { id: number; start: number; end: number; k: number; scale: number };

type ImageState = {
  src: string;
  /** mm per image pixel, set by the scale calibration */
  mmPerPx: number;
  /** 1 : denom */
  scaleDenom: number;
  w: number;
  h: number;
};

export function Planimeter() {
  const { lang } = useLanguage();
  const t = planimeterText[lang === 'de' ? 'de' : 'en'];

  /* ---- instrument state ---------------------------------------------- */
  // default: f = 263.8 / k = 0,8 — the setting whose arm reaches every sample
  // outline from a natural pole position on the left of the table.
  const [calIdx, setCalIdx] = useState(2);
  const cal = CALIBRATIONS[calIdx];
  const L = armLengthFromK(cal.k);
  const R = POLE_ARM;

  const [pole, setPole] = useState<Vec>({ x: 32, y: 96 });
  const [tracer, setTracer] = useState<Vec>({ x: 132, y: 51 });
  const [linkage, setLinkage] = useState<Linkage | null>(null);

  /* wheel accumulator, in mm of rolled paper */
  const [rollMM, setRollMM] = useState(0);
  const rollRef = useRef(0);

  /* ---- sheet / image -------------------------------------------------- */
  const [sample, setSample] = useState<Sample>(SAMPLES[0]);
  const [image, setImage] = useState<ImageState | null>(null);

  /* ---- interaction ---------------------------------------------------- */
  const [drag, setDrag] = useState<Drag>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>('idle');
  const [trace, setTrace] = useState<Vec[]>([]);
  const [traceStartReading, setTraceStartReading] = useState<number | null>(null);

  /* ---- panels --------------------------------------------------------- */
  const [mathMode, setMathMode] = useState(false);
  const [autoLog, setAutoLog] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showZero, setShowZero] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);

  /* ---- notepad -------------------------------------------------------- */
  const [padStart, setPadStart] = useState('');
  const [padEnd, setPadEnd] = useState('');
  const [padNotes, setPadNotes] = useState('');
  const [runs, setRuns] = useState<Run[]>([]);

  /* ---- maths-mode live numbers ---------------------------------------- */
  const [lastStep, setLastStep] = useState<{ perp: number; along: number } | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);

  /* ---------------------------------------------------------------------
     Keep the linkage consistent whenever geometry parameters change.
     --------------------------------------------------------------------- */
  useLayoutEffect(() => {
    const lk = buildLinkage(pole, tracer, R, L, WHEEL_OFFSET, linkage?.G ?? null);
    if (lk) setLinkage(lk);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pole, R, L]);

  useLayoutEffect(() => {
    if (linkage) return;
    const lk = buildLinkage(pole, tracer, R, L, WHEEL_OFFSET, null);
    if (lk) setLinkage(lk);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reach = useMemo(() => reachRange(R, L), [R, L]);
  const outOfReach = useMemo(() => {
    const d = dist(pole, tracer);
    return d > reach.max || d < reach.min;
  }, [pole, tracer, reach]);

  /* ---------------------------------------------------------------------
     Pointer → table coordinates
     --------------------------------------------------------------------- */
  const toTable = useCallback((e: React.PointerEvent | PointerEvent): Vec | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * TABLE_W;
    const y = ((e.clientY - rect.top) / rect.height) * TABLE_H;
    return { x, y };
  }, []);

  /* ---------------------------------------------------------------------
     THE MEASUREMENT ITSELF.
     Every tracer move integrates the wheel roll along the actual path.
     --------------------------------------------------------------------- */
  const moveTracerTo = useCallback(
    (to: Vec) => {
      if (!linkage) return;
      const res = integrateMove(pole, linkage, to, R, L, WHEEL_OFFSET);
      if (!res) return; // out of reach: refuse the move, as the real linkage would

      rollRef.current += res.roll;
      setRollMM(rollRef.current);
      setLinkage(res.linkage);
      setTracer(to);

      if (mathMode) {
        const dW = { x: res.linkage.W.x - linkage.W.x, y: res.linkage.W.y - linkage.W.y };
        const u = res.linkage.u;
        setLastStep({
          perp: res.roll,
          along: dW.x * u.x + dW.y * u.y,
        });
      }

      if (mode === 'tracing') {
        setTrace((prev) => {
          const last = prev[prev.length - 1];
          if (last && dist(last, to) < 0.8) return prev;
          return [...prev, to];
        });
      }
    },
    [linkage, pole, R, L, mode, mathMode]
  );

  /* ---------------------------------------------------------------------
     Pointer handlers
     --------------------------------------------------------------------- */
  const onPointerDown = (e: React.PointerEvent) => {
    const p = toTable(e);
    if (!p || !linkage) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);

    if (dist(p, pole) < 9) {
      setDrag('pole');
      return;
    }
    if (dist(p, linkage.T) < 11) {
      setDrag('tracer');
      // starting a trace: remember the reading we set off from
      setMode('tracing');
      setTrace([linkage.T]);
      setTraceStartReading(readWheel(mmToME(rollRef.current)).value);
      if (autoLog) setPadStart(readWheel(mmToME(rollRef.current)).text);
      return;
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const p = toTable(e);
    if (!p) return;

    if (!drag) {
      // hover detection for the moving-part rings
      if (linkage) {
        if (dist(p, pole) < 9) setHover('pole');
        else if (dist(p, linkage.T) < 11) setHover('tracer');
        else if (dist(p, linkage.G) < 9) setHover('hinge');
        else if (dist(p, linkage.W) < 9) setHover('wheel');
        else setHover(null);
      }
      return;
    }

    if (drag === 'pole') {
      setPole(p);
      return;
    }
    if (drag === 'tracer') moveTracerTo(p);
  };

  const finishTrace = useCallback(() => {
    setDrag(null);
    if (mode !== 'tracing') return;
    setMode('idle');
    const endReading = readWheel(mmToME(rollRef.current));

    // A measurement only counts once the tracer has come back to its starting
    // mark — same rule as at the drawing board. Merely repositioning the tracer
    // is not a run, so it must not land in the log.
    const closed =
      trace.length > 8 && dist(trace[0], trace[trace.length - 1]) <= CLOSE_TOLERANCE;

    if (autoLog && closed && traceStartReading !== null) {
      setPadEnd(endReading.text);
      setRuns((prev) => [
        ...prev,
        {
          id: Date.now(),
          start: traceStartReading,
          end: endReading.value,
          k: cal.k,
          scale: image ? image.scaleDenom : sample.scaleDenom,
        },
      ]);
    }
  }, [mode, autoLog, traceStartReading, cal.k, image, sample, trace]);

  const onPointerUp = () => finishTrace();

  useEffect(() => {
    const up = () => {
      if (drag) finishTrace();
    };
    window.addEventListener('pointerup', up);
    return () => window.removeEventListener('pointerup', up);
  }, [drag, finishTrace]);

  /* ---------------------------------------------------------------------
     Derived readings
     --------------------------------------------------------------------- */
  const meNow = mmToME(rollRef.current);
  const reading = readWheel(meNow);

  const currentScaleDenom = image ? image.scaleDenom : sample.scaleDenom;

  /** parse a four-digit notepad entry like "3472" or "3.472" into ME */
  const parseReading = (s: string): number | null => {
    const cleaned = s.replace(/[^0-9]/g, '');
    if (!cleaned.length) return null;
    const n = cleaned.padStart(4, '0').slice(-4);
    return (
      parseInt(n[0], 10) * 100 + parseInt(n.slice(1, 3), 10) + parseInt(n[3], 10) / 10
    );
  };

  const padDiff = useMemo(() => {
    const a = parseReading(padStart);
    const b = parseReading(padEnd);
    if (a === null || b === null) return null;
    let d = b - a;
    if (d < -500) d += 1000; // wheel wrapped forwards
    if (d > 500) d -= 1000;
    return d;
  }, [padStart, padEnd]);

  const padAreaPaper = padDiff === null ? null : padDiff * cal.k; // cm²
  const padAreaReal =
    padAreaPaper === null
      ? null
      : padAreaPaper * currentScaleDenom * currentScaleDenom * 1e-4; // cm²→m²

  /* ---- maths mode: compare against the true polygon area --------------- */
  const traceTrueArea = useMemo(() => {
    if (trace.length < 4) return null;
    return Math.abs(shoelace(trace)); // mm²
  }, [trace]);

  /** has the tracer come back to where the run started? */
  const traceClosed = useMemo(
    () =>
      trace.length > 8 && dist(trace[0], trace[trace.length - 1]) <= CLOSE_TOLERANCE,
    [trace]
  );

  const poleInsideTrace = useMemo(
    () => (trace.length > 3 ? pointInPoly(pole, trace) : false),
    [trace, pole]
  );

  const traceMeasuredArea = useMemo(() => {
    if (traceStartReading === null || trace.length < 4) return null;
    // roll in mm × L = area in mm²
    const rolled = rollRef.current;
    void rolled;
    return null;
  }, [traceStartReading, trace]);
  void traceMeasuredArea;

  /* ---------------------------------------------------------------------
     Actions
     --------------------------------------------------------------------- */
  const zeroWheel = () => {
    rollRef.current = 0;
    setRollMM(0);
  };
  const clearTrace = () => {
    setTrace([]);
    setTraceStartReading(null);
    setLastStep(null);
  };
  const clearPad = () => {
    setPadStart('');
    setPadEnd('');
    setPadNotes('');
    setRuns([]);
  };

  const takeStart = () => setPadStart(reading.text);
  const takeEnd = () => setPadEnd(reading.text);

  /* =======================================================================
     RENDER
     ======================================================================= */
  const outline = image ? null : sample.outline;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        top: 0,
        background: C.paper,
        fontFamily: SANS,
        color: C.ink,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @media (max-width: 1280px) {
          .planimeter-subtitle { display: none; }
        }
      `}</style>

      <TopBar
        t={t}
        cal={cal}
        calIdx={calIdx}
        setCalIdx={setCalIdx}
        onImage={() => setShowImageDialog(true)}
        onZero={zeroWheel}
        onClear={clearTrace}
        mathMode={mathMode}
        setMathMode={setMathMode}
        autoLog={autoLog}
        setAutoLog={setAutoLog}
        showZero={showZero}
        setShowZero={setShowZero}
        onHelp={() => setShowHelp(true)}
        sample={sample}
        setSample={setSample}
        image={image}
        clearImage={() => setImage(null)}
        lang={lang}
      />

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'grid',
          // side panels give way first so the drawing table keeps a usable
          // width on smaller laptops; the table itself never scrolls
          gridTemplateColumns: mathMode
            ? 'minmax(0,1fr) clamp(232px,21vw,300px) clamp(224px,20vw,286px)'
            : 'minmax(0,1fr) clamp(252px,24vw,320px)',
          gap: 12,
          padding: '10px 12px 12px',
        }}
      >
        {/* ---------------- DRAWING TABLE ---------------- */}
        <div
          style={{
            position: 'relative',
            background: C.sheet,
            border: `1px solid ${C.edge}`,
            borderRadius: 12,
            overflow: 'hidden',
            minWidth: 0,
          }}
        >
          <svg
            ref={svgRef}
            viewBox={`0 0 ${TABLE_W} ${TABLE_H}`}
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              touchAction: 'none',
              cursor: drag === 'tracer' ? 'grabbing' : hover ? 'grab' : 'default',
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={() => setHover(null)}
          >
            <defs>
              <filter id="pencilRough">
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="7" />
                <feDisplacementMap in="SourceGraphic" scale="0.5" />
              </filter>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke={C.edge} strokeWidth="0.15" />
              </pattern>
              <linearGradient id="armSteel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9aa0a8" />
                <stop offset="35%" stopColor="#c8ccd2" />
                <stop offset="65%" stopColor="#7d838b" />
                <stop offset="100%" stopColor="#5a6068" />
              </linearGradient>
              <linearGradient id="armSteel2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a8aeb6" />
                <stop offset="40%" stopColor="#d2d6db" />
                <stop offset="70%" stopColor="#868c94" />
                <stop offset="100%" stopColor="#63686e" />
              </linearGradient>
              <radialGradient id="poleWeight">
                <stop offset="0%" stopColor="#8a9099" />
                <stop offset="70%" stopColor="#565b62" />
                <stop offset="100%" stopColor="#35393e" />
              </radialGradient>
              <linearGradient id="wheelBrass" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8a6c1e" />
                <stop offset="30%" stopColor="#d8bc68" />
                <stop offset="60%" stopColor="#a8862c" />
                <stop offset="100%" stopColor="#7a5f18" />
              </linearGradient>
            </defs>

            <rect width={TABLE_W} height={TABLE_H} fill={C.sheet} />
            <rect width={TABLE_W} height={TABLE_H} fill="url(#grid)" opacity="0.55" />

            {/* ---- the sheet being measured ----
                 Centred on the table so it sits within comfortable reach of a
                 pole placed beside it. Only the position is adjusted; the
                 mm-per-pixel scale set in the dialog is preserved exactly, so
                 the measured area stays true. */}
            {image && (
              <image
                href={image.src}
                x={(TABLE_W - image.w * image.mmPerPx) / 2}
                y={(TABLE_H - image.h * image.mmPerPx) / 2}
                width={image.w * image.mmPerPx}
                height={image.h * image.mmPerPx}
                opacity={0.92}
                preserveAspectRatio="none"
              />
            )}

            {outline && (
              <g>
                <path
                  d={pathOf(outline)}
                  fill={C.accent}
                  opacity={0.05}
                />
                <path
                  d={pathOf(outline)}
                  fill="none"
                  stroke={C.pencil}
                  strokeWidth={0.55}
                  strokeLinejoin="round"
                  filter="url(#pencilRough)"
                  opacity={0.85}
                />
                {sample.decor?.map((d, i) => (
                  <path
                    key={i}
                    d={pathOf(d.path, d.closed)}
                    fill="none"
                    stroke={C.pencil}
                    strokeWidth={d.width ?? 0.3}
                    strokeDasharray={d.dash}
                    opacity={0.45}
                    filter="url(#pencilRough)"
                  />
                ))}
                <text
                  x={TABLE_W - 8}
                  y={TABLE_H - 7}
                  textAnchor="end"
                  fontFamily={SERIF}
                  fontSize={6}
                  fill={C.muted}
                  fontStyle="italic"
                >
                  {sample.caption[lang === 'de' ? 'de' : 'en']}
                </text>
              </g>
            )}

            {/* ---- zero circle ---- */}
            {showZero && (
              <g pointerEvents="none">
                <circle
                  cx={pole.x}
                  cy={pole.y}
                  r={zeroCircleRadius(R, L, WHEEL_OFFSET)}
                  fill="none"
                  stroke={C.brass}
                  strokeWidth={0.4}
                  strokeDasharray="3 2.5"
                  opacity={0.6}
                />
                <text
                  x={pole.x}
                  y={pole.y - zeroCircleRadius(R, L, WHEEL_OFFSET) - 3}
                  textAnchor="middle"
                  fontFamily={MONO}
                  fontSize={4.6}
                  fill={C.brass}
                >
                  {t.showZeroCircle} · {fmt(zeroCircleArea(R, L, WHEEL_OFFSET) / 100, 1)} cm²
                </text>
              </g>
            )}

            {/* ---- the traced path ---- */}
            {trace.length > 1 && (
              <path
                d={pathOf(trace, false)}
                fill="none"
                stroke={C.red}
                strokeWidth={0.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.75}
                pointerEvents="none"
              />
            )}
            {trace.length > 0 && (
              <circle
                cx={trace[0].x}
                cy={trace[0].y}
                r={1.3}
                fill="none"
                stroke={C.red}
                strokeWidth={0.4}
                pointerEvents="none"
              />
            )}

            {/* ---- the instrument ---- */}
            {linkage && (
              <Instrument
                pole={pole}
                linkage={linkage}
                R={R}
                hover={hover}
                drag={drag}
                t={t}
                mathMode={mathMode}
              />
            )}

            {/* ---- out-of-reach warning ---- */}
            {outOfReach && (
              <g pointerEvents="none">
                <circle
                  cx={pole.x}
                  cy={pole.y}
                  r={reach.max}
                  fill="none"
                  stroke={C.red}
                  strokeWidth={0.35}
                  strokeDasharray="2 2"
                  opacity={0.5}
                />
              </g>
            )}
          </svg>

          {/* status strip */}
          <div
            style={{
              position: 'absolute',
              left: 12,
              bottom: 10,
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              fontFamily: MONO,
              fontSize: 10.5,
              color: outOfReach ? C.red : traceClosed ? C.accent : C.muted,
              background: 'rgba(255,254,251,0.88)',
              border: `1px solid ${C.edge}`,
              borderRadius: 6,
              padding: '4px 9px',
            }}
          >
            {outOfReach
              ? t.outOfReach
              : mode === 'tracing'
                ? `● ${t.tracing}`
                : traceClosed
                  ? poleInsideTrace
                    ? `${t.closed} · ${t.poleInside}`
                    : `✓ ${t.closed}`
                  : t.dragTracer}
          </div>
        </div>

        {/* ---------------- RIGHT: wheel + notepad ---------------- */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            minHeight: 0,
          }}
        >
          <MeasuringUnit me={meNow} t={t} />

          <Notepad
            t={t}
            padStart={padStart}
            padEnd={padEnd}
            setPadStart={setPadStart}
            setPadEnd={setPadEnd}
            padNotes={padNotes}
            setPadNotes={setPadNotes}
            diff={padDiff}
            k={cal.k}
            areaPaper={padAreaPaper}
            areaReal={padAreaReal}
            scaleDenom={currentScaleDenom}
            onTakeStart={takeStart}
            onTakeEnd={takeEnd}
            onClear={clearPad}
            runs={runs}
            autoLog={autoLog}
          />
        </div>

        {/* ---------------- MATHS PANEL ---------------- */}
        {mathMode && (
          <MathsPanel
            t={t}
            L={L}
            R={R}
            lastStep={lastStep}
            rollMM={rollMM}
            trace={trace}
            trueArea={traceTrueArea}
            startReading={traceStartReading}
            currentME={meNow}
            k={cal.k}
            poleInside={poleInsideTrace}
            closed={traceClosed}
            lang={lang}
          />
        )}
      </div>

      {showHelp && <HelpOverlay t={t} onClose={() => setShowHelp(false)} />}
      {showImageDialog && (
        <ImageDialog
          t={t}
          onClose={() => setShowImageDialog(false)}
          onApply={(img) => {
            setImage(img);
            setShowImageDialog(false);
            clearTrace();
          }}
        />
      )}
    </div>
  );
}

/* =========================================================================
   THE INSTRUMENT — drawn in table coordinates
   ========================================================================= */
function Instrument({
  pole,
  linkage,
  R,
  hover,
  drag,
  t,
  mathMode,
}: {
  pole: Vec;
  linkage: Linkage;
  R: number;
  hover: string | null;
  drag: Drag;
  t: PlanimeterText;
  mathMode: boolean;
}) {
  const { G, T, W, u, n } = linkage;
  void R;

  return (
    <g>
      {/* ---- pole arm ---- */}
      <line
        x1={pole.x}
        y1={pole.y}
        x2={G.x}
        y2={G.y}
        stroke="url(#armSteel2)"
        strokeWidth={3.2}
        strokeLinecap="round"
      />
      <line
        x1={pole.x}
        y1={pole.y}
        x2={G.x}
        y2={G.y}
        stroke="rgba(255,255,255,0.5)"
        strokeWidth={0.7}
        strokeLinecap="round"
        transform="translate(0,-0.8)"
      />

      {/* ---- tracer arm, extended past the hinge for the wheel carriage ---- */}
      <line
        x1={G.x - u.x * 10}
        y1={G.y - u.y * 10}
        x2={T.x}
        y2={T.y}
        stroke="url(#armSteel)"
        strokeWidth={3.6}
        strokeLinecap="round"
      />
      <line
        x1={G.x - u.x * 10}
        y1={G.y - u.y * 10}
        x2={T.x}
        y2={T.y}
        stroke="rgba(255,255,255,0.55)"
        strokeWidth={0.8}
        strokeLinecap="round"
        transform="translate(0,-0.9)"
      />
      {/* scale graduations on the tracer arm */}
      {Array.from({ length: 14 }, (_, i) => {
        const s = 8 + i * 6;
        const px = G.x + u.x * s;
        const py = G.y + u.y * s;
        return (
          <line
            key={i}
            x1={px - n.x * 1.9}
            y1={py - n.y * 1.9}
            x2={px - n.x * 3.1}
            y2={py - n.y * 3.1}
            stroke={C.steelDark}
            strokeWidth={i % 5 === 0 ? 0.45 : 0.25}
            opacity={0.75}
          />
        );
      })}

      {/* ---- measuring wheel carriage ---- */}
      <g>
        {/* axle */}
        <line
          x1={W.x - n.x * 4.2}
          y1={W.y - n.y * 4.2}
          x2={W.x + n.x * 4.2}
          y2={W.y + n.y * 4.2}
          stroke={C.steelDark}
          strokeWidth={0.9}
        />
        {/* the wheel itself: a disc seen edge-on, rim perpendicular to the arm.
            Its plane contains u, so on paper it reads as a short bar along u. */}
        <g>
          <rect
            x={W.x - 4.6}
            y={W.y - 1.5}
            width={9.2}
            height={3}
            rx={0.6}
            fill="url(#wheelBrass)"
            stroke={C.steelDark}
            strokeWidth={0.35}
            transform={`rotate(${(Math.atan2(u.y, u.x) * 180) / Math.PI} ${W.x} ${W.y})`}
          />
          {/* rim graduations, they visibly turn as the wheel rolls */}
          <g
            transform={`rotate(${(Math.atan2(u.y, u.x) * 180) / Math.PI} ${W.x} ${W.y})`}
            opacity={0.85}
          >
            {Array.from({ length: 9 }, (_, i) => (
              <line
                key={i}
                x1={W.x - 4.2 + i * 1.05}
                y1={W.y - 1.4}
                x2={W.x - 4.2 + i * 1.05}
                y2={W.y + 1.4}
                stroke="#4a3a10"
                strokeWidth={0.18}
              />
            ))}
          </g>
        </g>
        {/* counterweight / worm housing */}
        <rect
          x={W.x - u.x * 8 - 2.4}
          y={W.y - u.y * 8 - 2.4}
          width={4.8}
          height={4.8}
          rx={1}
          fill={C.steel}
          stroke={C.steelDark}
          strokeWidth={0.3}
          opacity={0.9}
        />
      </g>

      {/* ---- hinge ---- */}
      <circle cx={G.x} cy={G.y} r={2.6} fill={C.steel} stroke={C.steelDark} strokeWidth={0.5} />
      <circle cx={G.x} cy={G.y} r={1.1} fill={C.steelDark} />

      {/* ---- pole ---- */}
      <circle cx={pole.x} cy={pole.y} r={5.2} fill="url(#poleWeight)" stroke={C.steelDark} strokeWidth={0.5} />
      <circle cx={pole.x} cy={pole.y} r={1.5} fill="#2a2d31" />
      <circle cx={pole.x - 1.6} cy={pole.y - 1.8} r={1.5} fill="rgba(255,255,255,0.28)" />

      {/* ---- tracer ---- */}
      <g>
        <circle cx={T.x} cy={T.y} r={4.4} fill="none" stroke={C.steelDark} strokeWidth={0.7} />
        <circle cx={T.x} cy={T.y} r={4.4} fill="rgba(255,255,255,0.35)" />
        <line x1={T.x - 3} y1={T.y} x2={T.x + 3} y2={T.y} stroke={C.red} strokeWidth={0.4} />
        <line x1={T.x} y1={T.y - 3} x2={T.x} y2={T.y + 3} stroke={C.red} strokeWidth={0.4} />
        <circle cx={T.x} cy={T.y} r={0.7} fill={C.red} />
      </g>

      {/* ---- maths mode: the roll decomposition at the wheel ---- */}
      {mathMode && (
        <g pointerEvents="none">
          <line
            x1={W.x}
            y1={W.y}
            x2={W.x + n.x * 14}
            y2={W.y + n.y * 14}
            stroke={C.accent}
            strokeWidth={0.45}
            markerEnd="url(#arrowA)"
            opacity={0.8}
          />
          <line
            x1={W.x}
            y1={W.y}
            x2={W.x + u.x * 14}
            y2={W.y + u.y * 14}
            stroke={C.muted}
            strokeWidth={0.4}
            strokeDasharray="1.5 1.5"
            opacity={0.7}
          />
          <text
            x={W.x + n.x * 16.5}
            y={W.y + n.y * 16.5 + 1.2}
            textAnchor="middle"
            fontFamily={MONO}
            fontSize={4}
            fill={C.accent}
          >
            n
          </text>
          <text
            x={W.x + u.x * 16.5}
            y={W.y + u.y * 16.5 + 1.2}
            textAnchor="middle"
            fontFamily={MONO}
            fontSize={4}
            fill={C.muted}
          >
            u
          </text>
          <defs>
            <marker id="arrowA" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5 z" fill={C.accent} />
            </marker>
          </defs>
        </g>
      )}

      {/* ---- moving-part indicator rings ---- */}
      <MoverRing at={pole} r={7.5} active hot={hover === 'pole' || drag === 'pole'} color={C.steel} />
      <MoverRing at={G} r={5.5} active hot={hover === 'hinge'} color={C.steel} />
      <MoverRing at={W} r={6.5} active hot={hover === 'wheel'} color={C.brass} />
      <MoverRing at={T} r={8} active hot={hover === 'tracer' || drag === 'tracer'} color={C.red} />

      {/* ---- labels, only while hovering the part ---- */}
      {hover && (
        <g pointerEvents="none">
          {hover === 'pole' && <PartLabel at={pole} text={t.pole} />}
          {hover === 'hinge' && <PartLabel at={G} text={t.hinge} />}
          {hover === 'wheel' && <PartLabel at={W} text={t.wheel} />}
          {hover === 'tracer' && <PartLabel at={T} text={t.tracer} />}
        </g>
      )}
    </g>
  );
}

function PartLabel({ at, text }: { at: Vec; text: string }) {
  return (
    <g>
      <rect
        x={at.x + 9}
        y={at.y - 12}
        width={text.length * 2.5 + 5}
        height={6.5}
        rx={1.6}
        fill="rgba(40,37,35,0.88)"
      />
      <text
        x={at.x + 11.5}
        y={at.y - 7.4}
        fontFamily={MONO}
        fontSize={4.2}
        fill={C.paper}
      >
        {text}
      </text>
    </g>
  );
}

/* =========================================================================
   TOP BAR
   ========================================================================= */
function TopBar({
  t,
  cal,
  calIdx,
  setCalIdx,
  onImage,
  onZero,
  onClear,
  mathMode,
  setMathMode,
  autoLog,
  setAutoLog,
  showZero,
  setShowZero,
  onHelp,
  sample,
  setSample,
  image,
  clearImage,
  lang,
}: {
  t: PlanimeterText;
  cal: (typeof CALIBRATIONS)[number];
  calIdx: number;
  setCalIdx: (i: number) => void;
  onImage: () => void;
  onZero: () => void;
  onClear: () => void;
  mathMode: boolean;
  setMathMode: (b: boolean) => void;
  autoLog: boolean;
  setAutoLog: (b: boolean) => void;
  showZero: boolean;
  setShowZero: (b: boolean) => void;
  onHelp: () => void;
  sample: Sample;
  setSample: (s: Sample) => void;
  image: ImageState | null;
  clearImage: () => void;
  lang: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '9px 14px',
        borderBottom: `1px solid ${C.edge}`,
        background: C.panel,
        flexWrap: 'nowrap',
        overflowX: 'auto',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexShrink: 0 }}>
        <a
          href="/tools"
          style={{ color: C.muted, textDecoration: 'none', fontSize: 15, lineHeight: 1 }}
          aria-label="tools"
        >
          ←
        </a>
        <span style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, color: C.ink }}>
          {t.title}
        </span>
        {/* the subtitle is the first thing to go when the bar gets tight */}
        <span
          className="planimeter-subtitle"
          style={{ fontFamily: SERIF, fontSize: 13, fontStyle: 'italic', color: C.muted }}
        >
          {t.subtitle}
        </span>
      </div>

      <Divider />

      {/* tracer-arm setting */}
      <Field label={t.armF}>
        <select
          value={calIdx}
          onChange={(e) => setCalIdx(Number(e.target.value))}
          style={selectStyle}
        >
          {CALIBRATIONS.map((c, i) => (
            <option key={c.f} value={i}>
              {fmt(c.f, 1)}
            </option>
          ))}
        </select>
      </Field>
      <Field label={t.factorK}>
        <span style={{ fontFamily: MONO, fontSize: 12.5, color: C.accent }}>
          {cal.label} cm²/{t.me}
        </span>
      </Field>

      <Divider />

      {/* sheet */}
      <Field label={t.image}>
        <select
          value={image ? '__img' : sample.id}
          onChange={(e) => {
            if (e.target.value === '__img') return;
            clearImage();
            setSample(sampleById(e.target.value));
          }}
          style={selectStyle}
        >
          {image && <option value="__img">{lang === 'de' ? 'eigenes Bild' : 'own image'}</option>}
          {SAMPLES.map((s) => (
            <option key={s.id} value={s.id}>
              {t[`sample${s.id[0].toUpperCase()}${s.id.slice(1)}` as keyof typeof t] ?? s.id}
            </option>
          ))}
        </select>
      </Field>
      <Btn onClick={onImage}>{t.loadImage}</Btn>

      <Divider />

      <Btn onClick={onZero}>{t.resetWheel}</Btn>
      <Btn onClick={onClear}>{t.clearTrace}</Btn>

      <Divider />

      <Toggle on={autoLog} set={setAutoLog} label={t.autoLog} />
      <Toggle on={mathMode} set={setMathMode} label={t.mathMode} />
      <Toggle on={showZero} set={setShowZero} label={t.showZeroCircle} />

      <div style={{ flex: 1 }} />
      <LangToggle />
      <Btn onClick={onHelp}>{t.help}</Btn>
    </div>
  );
}

/** the site header is hidden on this route, so the tool carries its own toggle */
function LangToggle() {
  const { lang, toggle } = useLanguage();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle language"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        fontFamily: MONO,
        fontSize: 11,
        padding: '4px 9px',
        borderRadius: 20,
        border: `1px solid ${C.edge}`,
        background: C.soft,
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      <span style={{ color: lang === 'en' ? C.ink : C.faint, fontWeight: lang === 'en' ? 600 : 400 }}>
        EN
      </span>
      <span style={{ color: C.faint }}>/</span>
      <span style={{ color: lang === 'de' ? C.ink : C.faint, fontWeight: lang === 'de' ? 600 : 400 }}>
        DE
      </span>
    </button>
  );
}

const Divider = () => (
  <div style={{ width: 1, height: 22, background: C.edge, flexShrink: 0 }} />
);

const selectStyle: React.CSSProperties = {
  fontFamily: MONO,
  fontSize: 12,
  padding: '3px 6px',
  border: `1px solid ${C.edge}`,
  borderRadius: 5,
  background: C.soft,
  color: C.ink,
  cursor: 'pointer',
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
      <span
        style={{
          fontFamily: MONO,
          fontSize: 8.5,
          letterSpacing: 1.1,
          textTransform: 'uppercase',
          color: C.muted,
        }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

function Btn({
  onClick,
  children,
  tone,
}: {
  onClick: () => void;
  children: React.ReactNode;
  tone?: 'accent';
}) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: SANS,
        fontSize: 12,
        padding: '5px 11px',
        borderRadius: 6,
        border: `1px solid ${tone === 'accent' ? C.accent : C.edge}`,
        background: tone === 'accent' ? C.accent : C.soft,
        color: tone === 'accent' ? C.paper : C.ink2,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

function Toggle({
  on,
  set,
  label,
}: {
  on: boolean;
  set: (b: boolean) => void;
  label: string;
}) {
  return (
    <button
      onClick={() => set(!on)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: SANS,
        fontSize: 12,
        padding: '4px 9px 4px 6px',
        borderRadius: 20,
        border: `1px solid ${on ? C.accent : C.edge}`,
        background: on ? 'rgba(26,92,58,0.08)' : C.soft,
        color: on ? C.accent : C.ink2,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          width: 20,
          height: 11,
          borderRadius: 6,
          background: on ? C.accent : C.faint,
          position: 'relative',
          transition: 'background 160ms',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 1.5,
            left: on ? 10.5 : 1.5,
            width: 8,
            height: 8,
            borderRadius: 4,
            background: '#fff',
            transition: 'left 160ms',
          }}
        />
      </span>
      {label}
    </button>
  );
}

/* =========================================================================
   NOTEPAD — a torn sheet you write your readings on
   ========================================================================= */
function Notepad({
  t,
  padStart,
  padEnd,
  setPadStart,
  setPadEnd,
  padNotes,
  setPadNotes,
  diff,
  k,
  areaPaper,
  areaReal,
  scaleDenom,
  onTakeStart,
  onTakeEnd,
  onClear,
  runs,
  autoLog,
}: {
  t: PlanimeterText;
  padStart: string;
  padEnd: string;
  setPadStart: (s: string) => void;
  setPadEnd: (s: string) => void;
  padNotes: string;
  setPadNotes: (s: string) => void;
  diff: number | null;
  k: number;
  areaPaper: number | null;
  areaReal: number | null;
  scaleDenom: number;
  onTakeStart: () => void;
  onTakeEnd: () => void;
  onClear: () => void;
  runs: Run[];
  autoLog: boolean;
}) {
  const realText = (() => {
    if (areaReal === null) return '—';
    if (scaleDenom === 1) return `${fmt(areaPaper ?? 0, 2)} cm²`;
    if (areaReal >= 1e6) return `${fmt(areaReal / 1e6, 3)} km²`;
    if (areaReal >= 1e4) return `${fmt(areaReal / 1e4, 3)} ha`;
    return `${fmt(areaReal, 1)} m²`;
  })();

  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        background:
          'repeating-linear-gradient(to bottom, #fffef9 0px, #fffef9 21px, #eceadf 21px, #eceadf 22px)',
        border: `1px solid ${C.edge}`,
        borderRadius: 10,
        boxShadow: '0 1px 2px rgba(40,37,35,0.05)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px 6px',
          borderBottom: `1px solid ${C.edge}`,
          background: 'rgba(255,255,255,0.6)',
        }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontSize: 9.5,
            letterSpacing: 1.6,
            textTransform: 'uppercase',
            color: C.muted,
          }}
        >
          {t.notepad}
          {autoLog && <span style={{ color: C.accent, marginLeft: 6 }}>● auto</span>}
        </span>
        <button
          onClick={onClear}
          style={{
            fontFamily: SANS,
            fontSize: 10.5,
            color: C.muted,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          {t.clearPad}
        </button>
      </div>

      <div style={{ padding: '9px 12px', display: 'grid', gap: 7, flexShrink: 0 }}>
        <PadRow
          label={t.end}
          value={padEnd}
          onChange={setPadEnd}
          onTake={onTakeEnd}
          takeLabel={t.take}
        />
        <PadRow
          label={t.start}
          value={padStart}
          onChange={setPadStart}
          onTake={onTakeStart}
          takeLabel={t.take}
          minus
        />

        <div style={{ height: 1, background: C.ink, opacity: 0.25, margin: '1px 0' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontFamily: SANS, fontSize: 12, color: C.ink2 }}>{t.diff}</span>
          <span style={{ fontFamily: MONO, fontSize: 15, color: C.ink }}>
            {diff === null ? '—' : fmt(diff, 1)}
            <span style={{ fontSize: 10, color: C.muted, marginLeft: 4 }}>{t.me}</span>
          </span>
        </div>

        <div
          style={{
            fontFamily: MONO,
            fontSize: 11,
            color: C.accent,
            textAlign: 'right',
            opacity: 0.85,
          }}
        >
          {t.formula} = {fmt(k, 3)} · {diff === null ? 'm' : fmt(diff, 1)}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            paddingTop: 3,
            borderTop: `1px solid ${C.edge}`,
          }}
        >
          <span style={{ fontFamily: SANS, fontSize: 11.5, color: C.muted }}>{t.onPaper}</span>
          <span style={{ fontFamily: MONO, fontSize: 13.5, color: C.ink }}>
            {areaPaper === null ? '—' : `${fmt(areaPaper, 2)} cm²`}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontFamily: SANS, fontSize: 11.5, color: C.muted }}>
            {t.inReality}
            {scaleDenom !== 1 && (
              <span style={{ fontFamily: MONO, fontSize: 9.5, marginLeft: 4 }}>
                1:{scaleDenom.toLocaleString('de-DE')}
              </span>
            )}
          </span>
          <span style={{ fontFamily: MONO, fontSize: 15, color: C.accent, fontWeight: 600 }}>
            {realText}
          </span>
        </div>
      </div>

      {/* recorded runs */}
      {runs.length > 0 && (
        <div
          style={{
            padding: '6px 12px',
            borderTop: `1px solid ${C.edge}`,
            background: 'rgba(255,255,255,0.5)',
            flexShrink: 0,
            maxHeight: 92,
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: 8.5,
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              color: C.muted,
              marginBottom: 3,
            }}
          >
            {t.runs}
          </div>
          {runs.map((r, i) => {
            let d = r.end - r.start;
            if (d < -500) d += 1000;
            if (d > 500) d -= 1000;
            return (
              <div
                key={r.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: MONO,
                  fontSize: 10.5,
                  color: C.ink2,
                  padding: '1px 0',
                }}
              >
                <span style={{ color: C.muted }}>{i + 1}</span>
                <span>
                  {fmt(r.end, 1)} − {fmt(r.start, 1)} = {fmt(d, 1)}
                </span>
                <span style={{ color: C.accent }}>{fmt(d * r.k, 2)} cm²</span>
              </div>
            );
          })}
          {runs.length > 1 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: MONO,
                fontSize: 11,
                color: C.ink,
                borderTop: `1px solid ${C.edge}`,
                marginTop: 3,
                paddingTop: 3,
              }}
            >
              <span style={{ color: C.muted }}>{t.mean}</span>
              <span style={{ color: C.accent, fontWeight: 600 }}>
                {fmt(
                  runs.reduce((a, r) => {
                    let d = r.end - r.start;
                    if (d < -500) d += 1000;
                    if (d > 500) d -= 1000;
                    return a + d * r.k;
                  }, 0) / runs.length,
                  2
                )}{' '}
                cm²
              </span>
            </div>
          )}
        </div>
      )}

      {/* free scratch area */}
      <div style={{ flex: 1, minHeight: 40, display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 8.5,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            color: C.muted,
            padding: '5px 12px 2px',
            borderTop: `1px solid ${C.edge}`,
          }}
        >
          {t.notes}
        </div>
        <textarea
          value={padNotes}
          onChange={(e) => setPadNotes(e.target.value)}
          placeholder={t.notesPlaceholder}
          spellCheck={false}
          style={{
            flex: 1,
            minHeight: 0,
            resize: 'none',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            padding: '2px 12px 10px',
            fontFamily: MONO,
            fontSize: 12,
            lineHeight: '22px',
            color: C.ink2,
          }}
        />
      </div>
    </div>
  );
}

function PadRow({
  label,
  value,
  onChange,
  onTake,
  takeLabel,
  minus,
}: {
  label: string;
  value: string;
  onChange: (s: string) => void;
  onTake: () => void;
  takeLabel: string;
  minus?: boolean;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
      <span style={{ fontFamily: SANS, fontSize: 12, color: C.ink2, flex: 1 }}>
        {minus && <span style={{ color: C.muted, marginRight: 3 }}>−</span>}
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9.,]/g, '').slice(0, 5))}
        placeholder="0000"
        inputMode="numeric"
        style={{
          width: 62,
          fontFamily: MONO,
          fontSize: 13.5,
          textAlign: 'right',
          border: 'none',
          borderBottom: `1px solid ${C.faint}`,
          background: 'transparent',
          outline: 'none',
          color: C.ink,
          padding: '1px 2px',
        }}
      />
      <button
        onClick={onTake}
        title={takeLabel}
        style={{
          fontFamily: SANS,
          fontSize: 10,
          padding: '2px 6px',
          borderRadius: 4,
          border: `1px solid ${C.edge}`,
          background: C.soft,
          color: C.muted,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        ↵
      </button>
    </div>
  );
}

/* =========================================================================
   MATHS PANEL
   ========================================================================= */
function MathsPanel({
  t,
  L,
  R,
  lastStep,
  rollMM,
  trace,
  trueArea,
  startReading,
  currentME,
  k,
  poleInside,
  closed,
  lang,
}: {
  t: PlanimeterText;
  L: number;
  R: number;
  lastStep: { perp: number; along: number } | null;
  rollMM: number;
  trace: Vec[];
  trueArea: number | null;
  startReading: number | null;
  currentME: number;
  k: number;
  poleInside: boolean;
  closed: boolean;
  lang: string;
}) {
  void k;
  /* measured area from the roll since the trace began */
  const measured = useMemo(() => {
    // only a closed contour has a meaningful area to report
    if (startReading === null || !closed) return null;
    let d = currentME - startReading;
    if (d < -500) d += 1000;
    if (d > 500) d -= 1000;
    // ME → mm of roll → × L = mm²
    const rolledMM = meToMM(d);
    const a = rolledMM * L;
    return poleInside ? a + zeroCircleArea(R, L, WHEEL_OFFSET) : a;
  }, [startReading, currentME, closed, L, R, poleInside]);

  const shownTrue = closed ? trueArea : null;
  const err =
    measured !== null && shownTrue ? ((Math.abs(measured) - shownTrue) / shownTrue) * 100 : null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 9,
        minHeight: 0,
        overflowY: 'auto',
        background: C.panel,
        border: `1px solid ${C.edge}`,
        borderRadius: 12,
        padding: '12px 13px',
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontSize: 9.5,
          letterSpacing: 1.6,
          textTransform: 'uppercase',
          color: C.accent,
        }}
      >
        {t.mathTitle}
      </div>

      <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.6, color: C.ink2 }}>{t.mathIntro}</p>

      {/* live decomposition */}
      <div
        style={{
          background: C.soft,
          border: `1px solid ${C.edge}`,
          borderRadius: 8,
          padding: '9px 10px',
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 8.5,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            color: C.muted,
            marginBottom: 6,
          }}
        >
          {t.mathLive}
        </div>
        <Bar
          label={t.mathPerp}
          value={lastStep?.perp ?? 0}
          max={1.6}
          color={C.accent}
        />
        <Bar
          label={t.mathAlong}
          value={lastStep?.along ?? 0}
          max={1.6}
          color={C.faint}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: MONO,
            fontSize: 11,
            color: C.ink2,
            marginTop: 7,
            paddingTop: 6,
            borderTop: `1px solid ${C.edge}`,
          }}
        >
          <span style={{ color: C.muted }}>{t.mathSum}</span>
          <span>{fmt(rollMM, 2)} mm</span>
        </div>
      </div>

      {/* the formula */}
      <div
        style={{
          background: 'rgba(26,92,58,0.05)',
          border: `1px solid rgba(26,92,58,0.18)`,
          borderRadius: 8,
          padding: '10px 11px',
          fontFamily: SERIF,
          fontSize: 15,
          color: C.ink,
          textAlign: 'center',
          lineHeight: 1.5,
        }}
      >
        <div style={{ fontStyle: 'italic' }}>
          ∮ <span style={{ fontSize: 13 }}>n</span> · d<span style={{ fontSize: 13 }}>W</span> ={' '}
          <span style={{ color: C.accent }}>A / L</span>
        </div>
        <div style={{ fontSize: 11, fontFamily: SANS, color: C.muted, marginTop: 5 }}>
          {t.mathGreen}
        </div>
      </div>

      <p style={{ margin: 0, fontSize: 12, lineHeight: 1.6, color: C.ink2 }}>{t.mathClosed}</p>

      {poleInside && (
        <div
          style={{
            background: 'rgba(139,106,19,0.07)',
            border: `1px solid rgba(139,106,19,0.25)`,
            borderRadius: 8,
            padding: '8px 10px',
            fontSize: 11.5,
            lineHeight: 1.55,
            color: C.ink2,
          }}
        >
          {t.mathZeroCircle}
          <div style={{ fontFamily: MONO, fontSize: 11, color: C.brass, marginTop: 4 }}>
            π(R² + L² − 2Ld) = {fmt(zeroCircleArea(R, L, WHEEL_OFFSET) / 100, 2)} cm²
          </div>
        </div>
      )}

      {/* verification */}
      <div
        style={{
          background: C.soft,
          border: `1px solid ${C.edge}`,
          borderRadius: 8,
          padding: '9px 10px',
          marginTop: 'auto',
        }}
      >
        <Row
          label={t.mathTrue}
          value={shownTrue === null ? '—' : `${fmt(shownTrue / 100, 2)} cm²`}
        />
        <Row
          label={t.mathMeasured}
          value={measured === null ? '—' : `${fmt(Math.abs(measured) / 100, 2)} cm²`}
          accent
        />
        <Row
          label={t.mathError}
          value={err === null ? '—' : `${err > 0 ? '+' : ''}${fmt(err, 2)} %`}
          muted
        />
        <div
          style={{
            fontSize: 10.5,
            color: C.muted,
            lineHeight: 1.5,
            marginTop: 6,
            paddingTop: 6,
            borderTop: `1px solid ${C.edge}`,
          }}
        >
          {lang === 'de'
            ? 'Die „wahre" Fläche stammt aus der Gaußschen Trapezformel über deine Spur — das Planimeter kennt sie nicht.'
            : "The “true” area comes from the shoelace formula over your trace — the planimeter never sees it."}
        </div>
      </div>
    </div>
  );
}

function Bar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const w = Math.min(Math.abs(value) / max, 1) * 50;
  return (
    <div style={{ marginBottom: 5 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: MONO,
          fontSize: 9.5,
          color: C.muted,
          marginBottom: 2,
        }}
      >
        <span>{label}</span>
        <span style={{ color: C.ink2 }}>{fmt(value, 3)}</span>
      </div>
      <div
        style={{
          height: 5,
          background: '#e8e6e1',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: C.faint }} />
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: value >= 0 ? '50%' : `${50 - w}%`,
            width: `${w}%`,
            background: color,
            transition: 'all 70ms linear',
          }}
        />
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  accent,
  muted,
}: {
  label: string;
  value: string;
  accent?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        padding: '2px 0',
      }}
    >
      <span style={{ fontSize: 11.5, color: C.muted }}>{label}</span>
      <span
        style={{
          fontFamily: MONO,
          fontSize: accent ? 13 : 12,
          color: accent ? C.accent : muted ? C.muted : C.ink,
          fontWeight: accent ? 600 : 400,
        }}
      >
        {value}
      </span>
    </div>
  );
}

/* =========================================================================
   HELP
   ========================================================================= */
function HelpOverlay({ t, onClose }: { t: PlanimeterText; onClose: () => void }) {
  return (
    <Overlay onClose={onClose}>
      <div style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 600, marginBottom: 14 }}>
        {t.helpTitle}
      </div>
      <ol
        style={{
          margin: 0,
          paddingLeft: 20,
          display: 'grid',
          gap: 9,
          fontSize: 14,
          lineHeight: 1.6,
          color: C.ink2,
        }}
      >
        <li>{t.help1}</li>
        <li>{t.help2}</li>
        <li>{t.help3}</li>
        <li>{t.help4}</li>
        <li>{t.help5}</li>
      </ol>
      <button
        onClick={onClose}
        style={{
          marginTop: 20,
          fontFamily: SANS,
          fontSize: 13,
          padding: '7px 16px',
          borderRadius: 6,
          border: `1px solid ${C.accent}`,
          background: C.accent,
          color: C.paper,
          cursor: 'pointer',
        }}
      >
        {t.close}
      </button>
    </Overlay>
  );
}

function Overlay({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(40,37,35,0.35)',
        backdropFilter: 'blur(2px)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 100,
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.panel,
          border: `1px solid ${C.edge}`,
          borderRadius: 14,
          padding: '24px 26px',
          maxWidth: 480,
          width: '100%',
          boxShadow: '0 12px 40px rgba(40,37,35,0.18)',
          maxHeight: '86vh',
          overflowY: 'auto',
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* =========================================================================
   IMAGE + SCALE DIALOG
   ========================================================================= */
function ImageDialog({
  t,
  onClose,
  onApply,
}: {
  t: PlanimeterText;
  onClose: () => void;
  onApply: (img: ImageState) => void;
}) {
  const [src, setSrc] = useState<string | null>(null);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const [mode, setMode] = useState<'map' | 'direct'>('map');
  const [denom, setDenom] = useState('20000');
  const [refPx, setRefPx] = useState<{ a: Vec; b: Vec } | null>(null);
  const [refMM, setRefMM] = useState('100');
  const [dragRef, setDragRef] = useState<Vec | null>(null);
  const imgBoxRef = useRef<HTMLDivElement>(null);

  const onFile = (f: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result);
      const im = new window.Image();
      im.onload = () => {
        setDims({ w: im.width, h: im.height });
        setSrc(url);
      };
      im.src = url;
    };
    reader.readAsDataURL(f);
  };

  /* reference line drawing, in displayed-image coordinates */
  const boxToImg = (e: React.PointerEvent): Vec | null => {
    const el = imgBoxRef.current;
    if (!el || !dims) return null;
    const r = el.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * dims.w,
      y: ((e.clientY - r.top) / r.height) * dims.h,
    };
  };

  const refLenPx = refPx ? dist(refPx.a, refPx.b) : 0;

  const apply = () => {
    if (!src || !dims) return;
    // mm on the table per image pixel
    const fitted = Math.min((TABLE_W * 0.92) / dims.w, (TABLE_H * 0.92) / dims.h);
    const declared = parseFloat(refMM.replace(',', '.'));
    let mmPerPx: number;
    if (refPx && refLenPx > 2 && Number.isFinite(declared) && declared > 0) {
      // a reference line was drawn: honour the scale the user declared
      mmPerPx = declared / refLenPx;
    } else {
      // no reference given — fit the sheet inside the table, both dimensions
      mmPerPx = fitted;
    }
    onApply({
      src,
      mmPerPx,
      scaleDenom: mode === 'map' ? Math.max(1, parseInt(denom, 10) || 1) : 1,
      w: dims.w,
      h: dims.h,
    });
  };

  return (
    <Overlay onClose={onClose}>
      <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, marginBottom: 12 }}>
        {t.imageTitle}
      </div>

      {!src ? (
        <label
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) onFile(f);
          }}
          style={{
            display: 'grid',
            placeItems: 'center',
            height: 170,
            border: `1.5px dashed ${C.faint}`,
            borderRadius: 10,
            cursor: 'pointer',
            color: C.muted,
            fontSize: 13,
            background: C.soft,
          }}
        >
          {t.imageDrop}
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
            }}
          />
        </label>
      ) : (
        <>
          <div
            ref={imgBoxRef}
            onPointerDown={(e) => {
              const p = boxToImg(e);
              if (p) {
                setDragRef(p);
                setRefPx({ a: p, b: p });
              }
            }}
            onPointerMove={(e) => {
              if (!dragRef) return;
              const p = boxToImg(e);
              if (p) setRefPx({ a: dragRef, b: p });
            }}
            onPointerUp={() => setDragRef(null)}
            style={{
              position: 'relative',
              border: `1px solid ${C.edge}`,
              borderRadius: 8,
              overflow: 'hidden',
              cursor: 'crosshair',
              touchAction: 'none',
              background: C.soft,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" style={{ width: '100%', display: 'block' }} />
            {refPx && dims && (
              <svg
                viewBox={`0 0 ${dims.w} ${dims.h}`}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
              >
                <line
                  x1={refPx.a.x}
                  y1={refPx.a.y}
                  x2={refPx.b.x}
                  y2={refPx.b.y}
                  stroke={C.red}
                  strokeWidth={dims.w / 300}
                />
                {[refPx.a, refPx.b].map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r={dims.w / 160} fill="none" stroke={C.red} strokeWidth={dims.w / 400} />
                ))}
              </svg>
            )}
          </div>
          <div style={{ fontSize: 11.5, color: C.muted, marginTop: 7, lineHeight: 1.5 }}>
            {t.imageScaleHint}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
            <span style={{ fontSize: 12.5, color: C.ink2 }}>{t.measureDistance}</span>
            <span style={{ fontFamily: MONO, fontSize: 12, color: C.muted }}>
              {fmt(refLenPx, 0)} px
            </span>
            <span style={{ fontSize: 12.5, color: C.ink2 }}>{t.realLength}</span>
            <input
              value={refMM}
              onChange={(e) => setRefMM(e.target.value.replace(/[^0-9.,]/g, ''))}
              style={{
                width: 62,
                fontFamily: MONO,
                fontSize: 12.5,
                padding: '3px 6px',
                border: `1px solid ${C.edge}`,
                borderRadius: 5,
                background: C.soft,
                textAlign: 'right',
                color: C.ink,
              }}
            />
            <span style={{ fontFamily: MONO, fontSize: 12, color: C.muted }}>mm</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
            <button
              onClick={() => setMode('map')}
              style={pillStyle(mode === 'map')}
            >
              {t.mapScale}
            </button>
            <button
              onClick={() => setMode('direct')}
              style={pillStyle(mode === 'direct')}
            >
              {t.directScale}
            </button>
            {mode === 'map' && (
              <>
                <span style={{ fontFamily: MONO, fontSize: 13, color: C.ink2 }}>1 :</span>
                <input
                  value={denom}
                  onChange={(e) => setDenom(e.target.value.replace(/[^0-9]/g, ''))}
                  style={{
                    width: 86,
                    fontFamily: MONO,
                    fontSize: 12.5,
                    padding: '3px 6px',
                    border: `1px solid ${C.edge}`,
                    borderRadius: 5,
                    background: C.soft,
                    textAlign: 'right',
                    color: C.ink,
                  }}
                />
              </>
            )}
          </div>
        </>
      )}

      <div style={{ display: 'flex', gap: 9, marginTop: 18, justifyContent: 'flex-end' }}>
        <button
          onClick={onClose}
          style={{
            fontFamily: SANS,
            fontSize: 13,
            padding: '7px 15px',
            borderRadius: 6,
            border: `1px solid ${C.edge}`,
            background: C.soft,
            color: C.ink2,
            cursor: 'pointer',
          }}
        >
          {t.cancel}
        </button>
        <button
          onClick={apply}
          disabled={!src}
          style={{
            fontFamily: SANS,
            fontSize: 13,
            padding: '7px 16px',
            borderRadius: 6,
            border: `1px solid ${src ? C.accent : C.edge}`,
            background: src ? C.accent : C.soft,
            color: src ? C.paper : C.faint,
            cursor: src ? 'pointer' : 'not-allowed',
          }}
        >
          {t.apply}
        </button>
      </div>
    </Overlay>
  );
}

const pillStyle = (on: boolean): React.CSSProperties => ({
  fontFamily: SANS,
  fontSize: 12,
  padding: '4px 11px',
  borderRadius: 20,
  border: `1px solid ${on ? C.accent : C.edge}`,
  background: on ? 'rgba(26,92,58,0.08)' : C.soft,
  color: on ? C.accent : C.ink2,
  cursor: 'pointer',
});
