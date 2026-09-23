/* =========================================================================
   Built-in "sheets of paper" to measure. Each sample is drawn as a pencil
   outline in table coordinates (mm), together with the map scale it is
   meant to represent, so the reality-side number means something.
   ========================================================================= */

import type { Vec } from './planimeter.geometry';

export type Sample = {
  id: string;
  /** outline in table mm, closed implicitly */
  outline: Vec[];
  /** 1 : scaleDenom  — one mm on paper is scaleDenom mm in reality */
  scaleDenom: number;
  /** optional extra pencil decoration (rivers, hatching, veins …) */
  decor?: { path: Vec[]; closed?: boolean; dash?: string; width?: number }[];
  /** a caption drawn on the sheet */
  caption: { de: string; en: string };
};

/** closed blob from radii sampled around a centre */
function blob(cx: number, cy: number, radii: number[], jitter = 0): Vec[] {
  const n = radii.length;
  const pts: Vec[] = [];
  // Catmull-Rom style resampling for a smooth pencil outline
  const sampleR = (t: number) => {
    const f = t * n;
    const i = Math.floor(f);
    const frac = f - i;
    const r0 = radii[(i - 1 + n) % n];
    const r1 = radii[i % n];
    const r2 = radii[(i + 1) % n];
    const r3 = radii[(i + 2) % n];
    return (
      0.5 *
      (2 * r1 +
        (-r0 + r2) * frac +
        (2 * r0 - 5 * r1 + 4 * r2 - r3) * frac * frac +
        (-r0 + 3 * r1 - 3 * r2 + r3) * frac * frac * frac)
    );
  };
  const steps = n * 8;
  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    const a = t * Math.PI * 2;
    const r = sampleR(t) + (jitter ? Math.sin(a * 7.3) * jitter : 0);
    pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
  }
  return pts;
}

function circle(cx: number, cy: number, r: number, steps = 160): Vec[] {
  return Array.from({ length: steps }, (_, i) => {
    const a = (i / steps) * Math.PI * 2;
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
  });
}

function poly(pts: [number, number][]): Vec[] {
  return pts.map(([x, y]) => ({ x, y }));
}

const LAKE = blob(
  132,
  96,
  [46, 52, 49, 38, 30, 34, 44, 52, 56, 48, 36, 31, 33, 40, 47, 44],
  1.4
);

const FIELD = poly([
  [72, 44],
  [186, 52],
  [199, 108],
  [176, 150],
  [104, 158],
  [70, 126],
  [62, 78],
]);

const LEAF = (() => {
  // a leaf: two mirrored arcs meeting at tip and stalk
  const pts: Vec[] = [];
  const cx = 132;
  const cy = 96;
  const half = 62;
  const wide = 34;
  for (let i = 0; i <= 90; i++) {
    const t = i / 90;
    const x = cx - half + t * half * 2;
    const s = Math.sin(t * Math.PI);
    pts.push({ x, y: cy - s * wide * (0.6 + 0.4 * Math.sin(t * Math.PI)) });
  }
  for (let i = 90; i >= 0; i--) {
    const t = i / 90;
    const x = cx - half + t * half * 2;
    const s = Math.sin(t * Math.PI);
    pts.push({ x, y: cy + s * wide * (0.55 + 0.45 * Math.sin(t * Math.PI * 0.8)) });
  }
  return pts;
})();

export const SAMPLES: Sample[] = [
  {
    id: 'lake',
    outline: LAKE,
    scaleDenom: 10000,
    caption: { de: 'See · 1 : 10 000', en: 'Lake · 1 : 10 000' },
    decor: [
      {
        path: poly([
          [96, 58],
          [112, 70],
          [118, 88],
          [110, 104],
          [96, 118],
        ]),
        dash: '1 2',
        width: 0.3,
      },
      {
        path: poly([
          [168, 72],
          [156, 88],
          [160, 108],
          [172, 124],
        ]),
        dash: '1 2',
        width: 0.3,
      },
    ],
  },
  {
    id: 'field',
    outline: FIELD,
    scaleDenom: 5000,
    caption: { de: 'Ackerschlag · 1 : 5 000', en: 'Field · 1 : 5 000' },
    decor: Array.from({ length: 7 }, (_, i) => ({
      path: poly([
        [76 + i * 17, 50 + i * 1.2],
        [70 + i * 17, 150 - i * 1.5],
      ]),
      dash: '2 3',
      width: 0.25,
    })),
  },
  {
    id: 'leaf',
    outline: LEAF,
    scaleDenom: 1,
    caption: { de: 'Blatt · 1 : 1', en: 'Leaf · 1 : 1' },
    decor: [
      { path: poly([[70, 96], [194, 96]]), width: 0.4 },
      ...Array.from({ length: 6 }, (_, i) => ({
        path: poly([
          [92 + i * 17, 96],
          [100 + i * 17, 96 - 22 + i * 2],
        ]),
        width: 0.25,
      })),
      ...Array.from({ length: 6 }, (_, i) => ({
        path: poly([
          [92 + i * 17, 96],
          [100 + i * 17, 96 + 22 - i * 2],
        ]),
        width: 0.25,
      })),
    ],
  },
  {
    id: 'circle',
    outline: circle(132, 96, 45),
    scaleDenom: 1,
    caption: { de: 'Kreis r = 45 mm · 1 : 1', en: 'Circle r = 45 mm · 1 : 1' },
    decor: [
      { path: poly([[132, 96], [177, 96]]), dash: '2 2', width: 0.3 },
    ],
  },
];

export const sampleById = (id: string) => SAMPLES.find((s) => s.id === id) ?? SAMPLES[0];
