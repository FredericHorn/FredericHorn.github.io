/* =========================================================================
   Polar planimeter — exact kinematics & measuring-wheel integration.

   Geometry (all in "table" coordinates, unit = mm on the paper):

        P ---------- R ---------- G ---------- L ---------- T
      pole                     hinge                    tracer

   The measuring wheel W sits on the tracer arm at distance d from the
   hinge G, its axis parallel to the arm, so it only rolls when W moves
   *perpendicular* to the arm direction u = (T-G)/L.

   Rolled length increment:   dm = n · dW,   n = u rotated by +90°

   Over a closed contour this integrates to A/L (+ zero-circle term when
   the pole sits inside), which is the whole trick of the instrument.
   We integrate it incrementally, so the readout is genuinely earned
   rather than computed from a polygon area.
   ========================================================================= */

export type Vec = { x: number; y: number };

export const sub = (a: Vec, b: Vec): Vec => ({ x: a.x - b.x, y: a.y - b.y });
export const add = (a: Vec, b: Vec): Vec => ({ x: a.x + b.x, y: a.y + b.y });
export const scale = (a: Vec, s: number): Vec => ({ x: a.x * s, y: a.y * s });
export const len = (a: Vec) => Math.hypot(a.x, a.y);
export const dist = (a: Vec, b: Vec) => Math.hypot(a.x - b.x, a.y - b.y);
export const dot = (a: Vec, b: Vec) => a.x * b.x + a.y * b.y;
/** rotate by +90° (screen coords: y down, so this is a consistent normal) */
export const perp = (a: Vec): Vec => ({ x: -a.y, y: a.x });
export const norm = (a: Vec): Vec => {
  const l = Math.hypot(a.x, a.y) || 1;
  return { x: a.x / l, y: a.y / l };
};

/* ---------------------------------------------------------------------
   Hinge position: intersection of circle(P,R) and circle(T,L).
   Two solutions exist; `prefer` picks the branch continuous with the
   previous frame so the linkage never flips mid-trace.
   Returns null when the tracer is out of reach (|R-L| .. R+L).
   --------------------------------------------------------------------- */
export function solveHinge(
  P: Vec,
  T: Vec,
  R: number,
  L: number,
  prefer: Vec | null
): Vec | null {
  const d = dist(P, T);
  if (d > R + L - 1e-9 || d < Math.abs(R - L) + 1e-9 || d < 1e-9) return null;

  // distance from P to the radical line, along PT
  const a = (d * d + R * R - L * L) / (2 * d);
  const h2 = R * R - a * a;
  if (h2 < 0) return null;
  const h = Math.sqrt(h2);

  const ex = norm(sub(T, P));
  const ey = perp(ex);
  const M = add(P, scale(ex, a));

  const s1 = add(M, scale(ey, h));
  const s2 = add(M, scale(ey, -h));

  if (!prefer) return s1;
  return dist(s1, prefer) <= dist(s2, prefer) ? s1 : s2;
}

/** How far the tracer may be from the pole, given both arm lengths. */
export function reachRange(R: number, L: number) {
  return { min: Math.abs(R - L), max: R + L };
}

export type Linkage = {
  /** hinge */
  G: Vec;
  /** tracer */
  T: Vec;
  /** measuring wheel contact point */
  W: Vec;
  /** unit vector along the tracer arm, hinge → tracer */
  u: Vec;
  /** wheel rolling direction (normal to the arm) */
  n: Vec;
};

export function buildLinkage(
  P: Vec,
  T: Vec,
  R: number,
  L: number,
  wheelOffset: number,
  prefer: Vec | null
): Linkage | null {
  const G = solveHinge(P, T, R, L, prefer);
  if (!G) return null;
  const u = norm(sub(T, G));
  const n = perp(u);
  const W = add(G, scale(u, wheelOffset));
  return { G, T, W, u, n };
}

/* ---------------------------------------------------------------------
   Incremental roll.

   Exact for a straight tracer step would require integrating along the
   (curved) path of W. We subdivide the step and use the midpoint normal
   on each sub-step, which converges quickly and keeps the closed-contour
   error far below the instrument's own reading precision.
   --------------------------------------------------------------------- */
export function rollIncrement(prev: Linkage, next: Linkage): number {
  const dW = sub(next.W, prev.W);
  // average normal (trapezoid rule) — second-order accurate in the step
  const nAvg = { x: (prev.n.x + next.n.x) / 2, y: (prev.n.y + next.n.y) / 2 };
  return dot(nAvg, dW);
}

/**
 * Integrate the roll for a tracer move from `from` to `to`, subdividing so
 * that each sub-step stays small even when the user drags fast.
 * Returns the accumulated roll and the final linkage (or null if unreachable).
 */
export function integrateMove(
  P: Vec,
  from: Linkage,
  to: Vec,
  R: number,
  L: number,
  wheelOffset: number,
  maxStep = 1.5
): { roll: number; linkage: Linkage } | null {
  const total = dist(from.T, to);
  const steps = Math.max(1, Math.ceil(total / maxStep));
  let cur = from;
  let roll = 0;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const Ti = {
      x: from.T.x + (to.x - from.T.x) * t,
      y: from.T.y + (to.y - from.T.y) * t,
    };
    const nxt = buildLinkage(P, Ti, R, L, wheelOffset, cur.G);
    if (!nxt) return null;
    roll += rollIncrement(cur, nxt);
    cur = nxt;
  }
  return { roll, linkage: cur };
}

/* ---------------------------------------------------------------------
   Zero circle: the circle of tracer positions on which the wheel does not
   turn at all. With the wheel sitting a distance d from the hinge, the
   constant the pole-inside case adds is

       Z = π (R² + L² − 2 L d)

   which reduces to the textbook π(R² + L²) when the wheel is right at the
   hinge (d = 0). Verified numerically against traced circles.
   --------------------------------------------------------------------- */
export const zeroCircleRadius = (R: number, L: number, d = 0) =>
  Math.sqrt(Math.max(R * R + L * L - 2 * L * d, 0));
export const zeroCircleArea = (R: number, L: number, d = 0) =>
  Math.PI * Math.max(R * R + L * L - 2 * L * d, 0);

/* ---------------------------------------------------------------------
   Shoelace area of a polygon, signed (positive = clockwise in screen
   coords where y points down). Used only by the maths mode to compare
   the "true" area against what the wheel actually measured.
   --------------------------------------------------------------------- */
export function shoelace(pts: Vec[]): number {
  let s = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    s += a.x * b.y - b.x * a.y;
  }
  return s / 2;
}

/* ---------------------------------------------------------------------
   Calibration table (Reiss "Mikroplanimeter" style), tracer-arm setting f
   against the conversion factor k in cm² per wheel unit (ME).

   On the real instrument each of these settings is engraved on the arm
   next to the *one* map scale it is meant for — exactly like the little
   brass table glued to the instrument's box lid: "Verhältnis" (map scale)
   on the left, the nonius setting for the arm in the middle, and the real
   area one nonius division (1/10 ME) then stands for on the right. That
   pairing is fixed by the maker, not something you look up separately —
   you set the arm to the number printed next to your map's scale, full
   stop. `scaleDenom` here is that printed pairing: for each calibration,
   the one map scale (1:scaleDenom) it is built for, chosen so 1 nonius
   division comes out to a clean number of m² (10, 20, 25, 40, 50, 80,
   160, 400 — verified by scaleDenom² · k / 1e5).
   --------------------------------------------------------------------- */
export type Calibration = { f: number; k: number; label: string; scaleDenom: number };

export const CALIBRATIONS: Calibration[] = [
  { f: 330.3, k: 1, label: '1', scaleDenom: 1000 },
  { f: 294.4, k: 8 / 9, label: '8/9', scaleDenom: 1500 },
  { f: 206.4, k: 0.625, label: '0,625', scaleDenom: 2000 },
  { f: 263.8, k: 0.8, label: '0,8', scaleDenom: 2500 },
  { f: 145.6, k: 4 / 9, label: '4/9', scaleDenom: 3000 },
  { f: 164.0, k: 0.5, label: '0,5', scaleDenom: 4000 },
  { f: 210.6, k: 0.64, label: '0,64', scaleDenom: 5000 },
  { f: 130.7, k: 0.4, label: '0,4', scaleDenom: 10000 },
];

/** the calibration built for a given map scale, or the closest one if the
    scale isn't one of the table's own (e.g. the 1:1 "paper" samples, which
    aren't tied to any particular arm setting) */
export function calibrationForScale(scaleDenom: number): { cal: Calibration; index: number } {
  const index = CALIBRATIONS.findIndex((c) => c.scaleDenom === scaleDenom);
  if (index !== -1) return { cal: CALIBRATIONS[index], index };
  // no exact match (e.g. 1:1): fall back to whichever real-area-per-ME is
  // closest, so the popover still has a sensible default to show
  let best = 0;
  let bestDist = Infinity;
  CALIBRATIONS.forEach((c, i) => {
    const realM2PerME = (c.k * scaleDenom * scaleDenom) / 1e4;
    const d = Math.abs(Math.log(realM2PerME || 1e-9));
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  });
  return { cal: CALIBRATIONS[best], index: best };
}

/* ---------------------------------------------------------------------
   Wheel reading.

   The drum's circumference is divided into 100 parts, read to 1/1000 of a
   revolution with the vernier; a worm gear counts up to 10 full turns.
   A reading is therefore four digits:  U . H T  V
     U = revolutions (dial, 0..9)
     H = tens on the drum, T = units on the drum (00..99)
     V = vernier tenth
   Total range 0.000 .. 9999 ME, wrapping around.
   --------------------------------------------------------------------- */
export const WHEEL_UNITS_PER_TURN = 100; // drum divisions per wheel revolution
export const WHEEL_TOTAL_UNITS = 1000; // 10 revolutions before wrap-around

/**
 * Wheel circumference in mm — how much paper travel makes one revolution.
 * Chosen together with the pole-arm length so that the tracer arms implied
 * by the calibration table (L = 10000k / circumference) land in a range that
 * comfortably sweeps the drawing table without a large dead zone round the pole.
 */
export const WHEEL_CIRCUMFERENCE = 80;

/** convert rolled paper distance (mm) to wheel units (ME) */
export const mmToME = (mm: number) => (mm / WHEEL_CIRCUMFERENCE) * WHEEL_UNITS_PER_TURN;

/** inverse of `mmToME`: wheel units back to rolled paper distance in mm */
export const meToMM = (me: number) => (me / WHEEL_UNITS_PER_TURN) * WHEEL_CIRCUMFERENCE;

/** wrap a reading into [0, 1000) */
export const wrapME = (me: number) => ((me % WHEEL_TOTAL_UNITS) + WHEEL_TOTAL_UNITS) % WHEEL_TOTAL_UNITS;

export type Reading = {
  /** full reading in ME, wrapped to [0,1000) */
  value: number;
  /** revolutions counter digit 0..9 */
  revs: number;
  /** drum reading 0..99 */
  drum: number;
  /** vernier digit 0..9 */
  vernier: number;
  /** the four digits as displayed, e.g. "3.472" */
  text: string;
};

export function readWheel(meRaw: number): Reading {
  const value = wrapME(meRaw);
  // value in ME; 100 ME = one revolution
  const revsFloat = value / WHEEL_UNITS_PER_TURN; // 0..10
  const revs = Math.floor(revsFloat) % 10;
  const withinRev = value - Math.floor(revsFloat) * WHEEL_UNITS_PER_TURN; // 0..100
  const drum = Math.floor(withinRev);
  const vernier = Math.floor((withinRev - drum) * 10 + 1e-9);
  const text = `${revs}${String(drum).padStart(2, '0')}${vernier}`;
  return { value, revs, drum, vernier, text };
}

/** the numeric value a four-digit reading stands for, in ME */
export const readingToME = (revs: number, drum: number, vernier: number) =>
  revs * WHEEL_UNITS_PER_TURN + drum + vernier / 10;
