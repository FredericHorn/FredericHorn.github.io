'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function computePascal(rows: number): number[][] {
  const t: number[][] = [[1]];
  for (let i = 1; i < rows; i++) {
    const prev = t[i - 1];
    const row = [1];
    for (let j = 1; j < i; j++) row.push(prev[j - 1] + prev[j]);
    row.push(1);
    t.push(row);
  }
  return t;
}

function isPrime(n: number): boolean {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6)
    if (n % i === 0 || n % (i + 2) === 0) return false;
  return true;
}

function fib(n: number): number {
  if (n <= 0) return 1;
  let a = 1, b = 1;
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
  return b;
}

function binomial(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  let c = 1;
  for (let x = n - k + 1; x <= n; x++) c *= x;
  for (let x = 1; x <= k; x++) c /= x;
  return Math.round(c);
}

const modColors: Record<number, string[]> = {
  2: ['#1a5c3a', '#edecea'],
  3: ['#1a5c3a', '#4a8c6a', '#edecea'],
  5: ['#0e3d25', '#1a5c3a', '#4a8c6a', '#8bb8a0', '#edecea'],
  7: ['#0e3d25', '#145230', '#1a5c3a', '#2a7a52', '#4a8c6a', '#7aaa90', '#edecea'],
};

type HighlightMode = 'none' | 'mod' | 'diagonal' | 'even-odd' | 'fibonacci' | 'powers-of-2';
type FactMode = 'none' | 'hockey' | 'row-sum' | 'prime' | 'fibonacci' | 'honeycomb';

const FC = {
  selected: { bg: '#1a5c3a', text: '#faf9f7' },
  orange:   { bg: '#c87941', text: '#faf9f7' },
  red:      { bg: '#9b3a2a', text: '#faf9f7' },
  yellow:   { bg: '#9a8820', text: '#faf9f7' },
  neutral:  { bg: '#edecea', text: '#4d4844' },
  dim:      { bg: '#d8d5d0', text: '#8a8680' },
};

interface CellProps {
  value: number; row: number; col: number;
  color: string; textColor: string;
  size: number; showValues: boolean;
  highlighted: boolean; selected: boolean;
  onHover: () => void; onLeave: () => void; onClick: () => void;
}

function PascalCell({ value, row, col, color, textColor, size, showValues, highlighted, selected, onHover, onLeave, onClick }: CellProps) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: row * 0.02 + col * 0.01 }}
    >
      <motion.rect
        x={-size / 2} y={-size / 2} width={size} height={size}
        rx={size > 20 ? 3 : 1.5}
        fill={color}
        stroke={selected ? '#ffffff' : highlighted ? '#1a5c3a' : 'transparent'}
        strokeWidth={selected || highlighted ? 2 : 0}
        style={{ cursor: 'pointer' }}
        whileHover={{ scale: 1.3 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        onClick={onClick}
      />
      {showValues && size >= 18 && (
        <text
          textAnchor="middle"
          dominantBaseline="central"
          fill={textColor}
          fontSize={Math.max(7, Math.min(11, size * 0.4))}
          fontFamily="'JetBrains Mono', monospace"
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          {value > 9999 ? '' : value}
        </text>
      )}
    </motion.g>
  );
}

export function PascalTriangle() {
  const [numRows, setNumRows] = useState(16);
  const [modulus, setModulus] = useState(2);
  const [mode, setMode] = useState<HighlightMode>('mod');
  const [showValues, setShowValues] = useState(true);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
  const [factMode, setFactMode] = useState<FactMode>('none');
  const [rawSelectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  const triangle = useMemo(() => computePascal(numRows), [numRows]);

  // If the row count shrinks below the previously selected cell, drop the
  // selection instead of letting stale coordinates index past the new triangle.
  const selectedCell =
    rawSelectedCell && (rawSelectedCell.row >= numRows || rawSelectedCell.col > rawSelectedCell.row)
      ? null
      : rawSelectedCell;

  useEffect(() => {
    if (rawSelectedCell && selectedCell === null) setSelectedCell(null);
  }, [rawSelectedCell, selectedCell]);

  const fibSet = useMemo(() => {
    const s = new Set<number>();
    let a = 0, b = 1;
    while (a <= 100000) { s.add(a); [a, b] = [b, a + b]; }
    return s;
  }, []);

  const pow2Set = useMemo(() => {
    const s = new Set<number>();
    let p = 1;
    while (p <= 100000) { s.add(p); p *= 2; }
    return s;
  }, []);

  const getHighlightColor = useCallback(
    (value: number, _row: number, col: number): { bg: string; text: string } => {
      switch (mode) {
        case 'mod': {
          const colors = modColors[modulus] || modColors[2];
          const idx = value % modulus;
          const bg = colors[idx] || '#edecea';
          const isLight = idx >= Math.floor(colors.length / 2);
          return { bg, text: isLight ? '#4d4844' : '#faf9f7' };
        }
        case 'even-odd':
          return value % 2 === 0
            ? { bg: '#edecea', text: '#4d4844' }
            : { bg: '#1a5c3a', text: '#faf9f7' };
        case 'diagonal': {
          const hue = (col * 37) % 360;
          return { bg: `hsl(${hue}, 35%, 75%)`, text: '#282523' };
        }
        case 'fibonacci':
          return fibSet.has(value)
            ? { bg: '#1a5c3a', text: '#faf9f7' }
            : { bg: '#edecea', text: '#a9a49a' };
        case 'powers-of-2':
          return pow2Set.has(value)
            ? { bg: '#8b4513', text: '#faf9f7' }
            : { bg: '#edecea', text: '#a9a49a' };
        default:
          return { bg: '#edecea', text: '#4d4844' };
      }
    },
    [mode, modulus, fibSet, pow2Set]
  );

  const getFactColor = useCallback(
    (row: number, col: number): { bg: string; text: string } | null => {
      if (factMode === 'none') return null;
      const sel = selectedCell;

      if (factMode === 'hockey') {
        if (!sel) return FC.neutral;
        if (row === sel.row && col === sel.col) return FC.selected;
        if ((sel.row - row) === (sel.col - col + 1) && sel.row > row) return FC.orange;
        if (col === sel.col - 1 && sel.row > row && sel.col - 1 <= row) return FC.red;
        return FC.dim;
      }

      if (factMode === 'row-sum') {
        if (!sel) return FC.neutral;
        if (row === sel.row) return FC.selected;
        return FC.dim;
      }

      if (factMode === 'prime') {
        if (!sel) return FC.neutral;
        const selVal = triangle[sel.row]?.[sel.col] ?? 0;
        if (row === sel.row && col === sel.col) return FC.selected;
        if (!isPrime(selVal)) return FC.neutral;
        if (row === sel.row - 1) return col % 2 === 0 ? FC.red : FC.orange;
        return FC.dim;
      }

      if (factMode === 'fibonacci') {
        const d = ((2 * row - col) % 3 + 3) % 3;
        if (!sel) {
          if (d === 0) return FC.red;
          if (d === 1) return FC.orange;
          return FC.yellow;
        }
        const isSelected = (2 * row - col) === (2 * sel.row - sel.col);
        if (isSelected) {
          if (d === 0) return { bg: '#6a1515', text: '#faf9f7' };
          if (d === 1) return { bg: '#7a3a10', text: '#faf9f7' };
          return { bg: '#6a5810', text: '#faf9f7' };
        }
        return FC.dim;
      }

      if (factMode === 'honeycomb') {
        if (!sel) return FC.neutral;
        const selIsEdge = sel.col === 0 || sel.col === sel.row || sel.row < 1 || sel.row >= numRows - 1;
        if (row === sel.row && col === sel.col) return selIsEdge ? FC.dim : FC.selected;
        if (selIsEdge) return FC.dim;
        const [sr, sc] = [sel.row, sel.col];
        if ((row === sr-1 && col === sc-1) || (row === sr && col === sc+1) || (row === sr+1 && col === sc))
          return FC.red;
        if ((row === sr-1 && col === sc) || (row === sr+1 && col === sc+1) || (row === sr && col === sc-1))
          return FC.orange;
        return FC.dim;
      }

      return null;
    },
    [factMode, selectedCell, triangle, numRows]
  );

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (factMode === 'none') return;
      setSelectedCell(prev =>
        prev?.row === row && prev?.col === col ? null : { row, col }
      );
    },
    [factMode]
  );

  const handleFactMode = (m: FactMode) => {
    setFactMode(prev => {
      if (prev === m) { setSelectedCell(null); return 'none'; }
      setSelectedCell(null);
      return m;
    });
  };

  const cellSize = Math.max(12, Math.min(32, 500 / numRows));
  const gap = cellSize * 0.2;
  const totalSize = cellSize + gap;
  const svgWidth = numRows * totalSize + cellSize;
  const svgHeight = numRows * totalSize * 0.9 + cellSize;

  const getCellPos = (r: number, c: number) => {
    const y = r * totalSize * 0.9 + cellSize;
    // Disabled for now: shifts cells into diagonal alignment for the Fibonacci
    // fun fact. Keeping the normal triangle layout instead, per request.
    // if (factMode === 'fibonacci') {
    //   return { x: svgWidth - (r - c) * totalSize - cellSize * 0.5, y };
    // }
    return { x: svgWidth / 2 + (c - r / 2) * totalSize, y };
  };

  const factInfo = useMemo((): React.ReactNode => {
    if (factMode === 'none' || !selectedCell) return null;
    const { row, col } = selectedCell;
    const value = triangle[row]?.[col] ?? 0;

    if (factMode === 'hockey') {
      const orangeVals: number[] = [];
      const redVals: number[] = [];
      for (let r = 0; r < row; r++) {
        const oc = col + r - row + 1;
        if (oc >= 0 && oc <= r) orangeVals.push(triangle[r][oc]);
        const rc = col - 1;
        if (rc >= 0 && rc <= r) redVals.push(triangle[r][rc]);
      }
      return (
        <span>
          {orangeVals.length > 0 && (
            <><span style={{ color: '#c87941' }}>{orangeVals.join(' + ')}</span>{' = '}</>
          )}
          <strong>{value}</strong>
          {redVals.length > 0 && (
            <>{' = '}<span style={{ color: '#9b3a2a' }}>{redVals.join(' + ')}</span></>
          )}
        </span>
      );
    }

    if (factMode === 'row-sum') {
      const rowVals = triangle[row];
      const sum = rowVals.reduce((a, b) => a + b, 0);
      return (
        <span>
          {rowVals.join(' + ')} = <strong>{sum} = 2<sup>{row}</sup></strong>
        </span>
      );
    }

    if (factMode === 'prime') {
      if (!isPrime(value)) return <span><strong>{value}</strong> is not prime</span>;
      if (row === 0) return <span>Select a larger prime</span>;
      const aboveRow = triangle[row - 1];
      const half = Math.ceil(aboveRow.length / 2);
      const parts: React.ReactNode[] = [];
      let ri = 0, oi = 0;
      for (let i = 0; i < half; i++) {
        const c = i % 2 === 0 ? i : aboveRow.length - 1 - Math.floor(i / 2) * 2;
        const entry = aboveRow[i];
        if (i % 2 === 0) {
          parts.push(
            <span key={i} style={{ color: '#9b3a2a' }}>
              {entry} − 1 = {Math.round((entry - 1) / value)} × {value}
            </span>
          );
          ri++;
        } else {
          parts.push(
            <span key={i} style={{ color: '#c87941' }}>
              {entry} + 1 = {Math.round((entry + 1) / value)} × {value}
            </span>
          );
          oi++;
        }
      }
      return (
        <span className="flex flex-wrap gap-x-6 gap-y-1">
          {parts}
        </span>
      );
    }

    if (factMode === 'fibonacci') {
      const fibNum = 2 * row - col;
      const fibVal = fib(fibNum);
      const terms: number[] = [];
      for (let i = 0; i <= Math.floor(fibNum / 2); i++) {
        terms.push(binomial(fibNum - i, fibNum - 2 * i));
      }
      const d = ((fibNum % 3) + 3) % 3;
      const color = d === 0 ? '#9b3a2a' : d === 1 ? '#c87941' : '#9a8820';
      return (
        <span style={{ color }}>
          F({fibNum}) = {fibVal} = {terms.join(' + ')}
        </span>
      );
    }

    if (factMode === 'honeycomb') {
      const selIsEdge = col === 0 || col === row || row < 1 || row >= numRows - 1;
      if (selIsEdge) return <span><strong>{value}</strong> is on the edge</span>;
      const red = [triangle[row-1][col-1], triangle[row][col+1], triangle[row+1][col]];
      const orange = [triangle[row-1][col], triangle[row+1][col+1], triangle[row][col-1]];
      const rProd = red.reduce((a, b) => a * b, 1);
      const oProd = orange.reduce((a, b) => a * b, 1);
      return (
        <span>
          <span style={{ color: '#9b3a2a' }}>{red.join(' × ')} = {rProd}</span>
          {' = '}
          <span style={{ color: '#c87941' }}>{orange.join(' × ')} = {oProd}</span>
        </span>
      );
    }

    return null;
  }, [factMode, selectedCell, triangle, numRows]);

  const factPrompt: Record<FactMode, string> = {
    none: '',
    hockey: 'Click any entry to see the hockey stick identity',
    'row-sum': 'Click any entry to see its row sum',
    prime: 'Click a prime number in the triangle',
    fibonacci: 'Click any entry to see its Fibonacci diagonal',
    honeycomb: 'Click a non-edge entry to see the honeycomb property',
  };

  return (
    <div>
      {/* Controls */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs font-mono text-ink-500 uppercase tracking-wider">Rows</label>
            <input
              type="range" min={4} max={32} value={numRows}
              onChange={(e) => setNumRows(Number(e.target.value))}
              className="w-24 accent-accent"
            />
            <span className="text-sm font-mono text-ink-700 w-6">{numRows}</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-mono text-ink-500 uppercase tracking-wider">Show values</label>
            <button
              onClick={() => setShowValues(!showValues)}
              className={`w-10 h-5 rounded-full transition-colors ${showValues ? 'bg-accent' : 'bg-ink-200'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transform transition-transform ${showValues ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>

        {/* Fun Facts (includes the Modular / None highlight modes) */}
        <div className="border-t border-ink-100 pt-4 space-y-3">
          <p className="text-xs font-mono text-ink-500 uppercase tracking-wider mb-2">Fun Facts</p>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ['mod', 'Modular'],
                ['none', 'None'],
              ] as [HighlightMode, string][]
            ).map(([m, label]) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setFactMode('none');
                  setSelectedCell(null);
                }}
                className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all ${
                  factMode === 'none' && mode === m ? 'bg-accent text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
                }`}
              >
                {label}
              </button>
            ))}
            {(
              [
                ['hockey', 'Hockey Stick'],
                ['row-sum', 'Row Sums'],
                ['prime', 'Prime Rows'],
                ['fibonacci', 'Fibonacci'],
                ['honeycomb', 'Honeycomb'],
              ] as [FactMode, string][]
            ).map(([m, label]) => (
              <button
                key={m}
                onClick={() => handleFactMode(m)}
                className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all ${
                  factMode === m ? 'bg-accent text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <AnimatePresence>
            {factMode === 'none' && mode === 'mod' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 overflow-hidden"
              >
                <span className="text-xs font-mono text-ink-500">mod</span>
                {[2, 3, 5, 7].map((m) => (
                  <button
                    key={m}
                    onClick={() => setModulus(m)}
                    className={`w-8 h-8 rounded-full text-sm font-mono transition-all ${
                      modulus === m ? 'bg-accent text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Triangle */}
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full max-w-3xl mx-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          {triangle.map((row, r) =>
            row.map((value, c) => {
              const { x, y } = getCellPos(r, c);
              const factColor = getFactColor(r, c);
              const { bg, text } = factColor ?? getHighlightColor(value, r, c);
              const isHovered = hoveredCell?.row === r && hoveredCell?.col === c;
              const isSel = selectedCell?.row === r && selectedCell?.col === c;

              return (
                <g key={`${r}-${c}`} transform={`translate(${x}, ${y})`}>
                  <PascalCell
                    value={value} row={r} col={c}
                    color={bg} textColor={text}
                    size={cellSize} showValues={showValues}
                    highlighted={isHovered} selected={isSel}
                    onHover={() => setHoveredCell({ row: r, col: c })}
                    onLeave={() => setHoveredCell(null)}
                    onClick={() => handleCellClick(r, c)}
                  />
                </g>
              );
            })
          )}

          {/* Row sum labels */}
          {factMode === 'row-sum' && triangle.map((_, r) => {
            const { x, y } = getCellPos(r, r);
            return (
              <text
                key={`sum-${r}`}
                x={x + cellSize * 0.8}
                y={y}
                textAnchor="start"
                dominantBaseline="central"
                fill="#4d4844"
                fontSize={Math.max(7, Math.min(10, cellSize * 0.38))}
                fontFamily="'JetBrains Mono', monospace"
              >
                2^{r}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Info panel */}
      <div className="mt-6 min-h-[60px]">
        <AnimatePresence mode="wait">
          {factMode !== 'none' && (
            <motion.div
              key={factMode + (selectedCell ? `${selectedCell.row}-${selectedCell.col}` : 'none')}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="bg-white/80 border border-ink-100 rounded-lg px-5 py-3 inline-block max-w-full"
            >
              <p className="text-sm font-mono text-ink-700 flex flex-wrap gap-x-4 gap-y-1">
                {factInfo ?? (
                  <span className="text-ink-400">{factPrompt[factMode]}</span>
                )}
              </p>
            </motion.div>
          )}
          {factMode === 'none' && hoveredCell && (
            <motion.div
              key={`hover-${hoveredCell.row}-${hoveredCell.col}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="bg-white/80 border border-ink-100 rounded-lg px-5 py-3 inline-block"
            >
              <p className="text-sm font-mono text-ink-700">
                <span className="text-ink-400">C(</span>
                <span className="text-accent font-semibold">{hoveredCell.row}</span>
                <span className="text-ink-400">, </span>
                <span className="text-accent font-semibold">{hoveredCell.col}</span>
                <span className="text-ink-400">) = </span>
                <span className="text-ink-900 font-semibold">
                  {triangle[hoveredCell.row][hoveredCell.col]}
                </span>
                {mode === 'mod' && (
                  <>
                    <span className="text-ink-400 ml-4">≡ </span>
                    <span className="text-theorem font-semibold">
                      {triangle[hoveredCell.row][hoveredCell.col] % modulus}
                    </span>
                    <span className="text-ink-400"> (mod {modulus})</span>
                  </>
                )}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Explanation */}
      <div className="mt-8 text-sm text-ink-500 max-w-reading space-y-3">
        {factMode === 'none' && mode === 'mod' && (
          <p>
            <strong className="text-ink-700">Modular coloring</strong> reveals self-similar
            fractal patterns. With mod 2, you see Sierpiński&apos;s triangle. Higher moduli produce
            increasingly intricate structures — all arising from a single recursive rule.
          </p>
        )}
        {factMode === 'none' && mode === 'fibonacci' && (
          <p>
            <strong className="text-ink-700">Fibonacci numbers</strong> appear along the
            shallow diagonals of Pascal&apos;s triangle. The sum of entries along each diagonal
            gives the Fibonacci sequence — a surprising connection between binomial
            coefficients and the golden ratio.
          </p>
        )}
        {factMode === 'none' && mode === 'diagonal' && (
          <p>
            <strong className="text-ink-700">Diagonals</strong> of Pascal&apos;s triangle encode
            different combinatorial families: natural numbers, triangular numbers, tetrahedral
            numbers, and beyond. Each diagonal represents a sequence of figurate numbers.
          </p>
        )}
        {factMode === 'none' && mode === 'powers-of-2' && (
          <p>
            <strong className="text-ink-700">Powers of 2</strong> appear exactly at the
            entries C(2ᵏ, j) for certain j. The highlighted pattern reveals the interplay
            between binary representation and binomial coefficients.
          </p>
        )}
        {factMode === 'hockey' && (
          <p>
            <strong className="text-ink-700">Hockey stick identity</strong>: the sum of entries
            along any diagonal equals the single entry one step beyond — like the handle and
            blade of a hockey stick. Two different diagonals into any entry both sum to it.
          </p>
        )}
        {factMode === 'row-sum' && (
          <p>
            <strong className="text-ink-700">Row sums</strong>: every row sums to a power of 2.
            Row n sums to 2ⁿ, since each C(n, k) counts a subset of size k and there are 2ⁿ
            subsets in total.
          </p>
        )}
        {factMode === 'prime' && (
          <p>
            <strong className="text-ink-700">Prime rows</strong>: if p is prime, then
            C(p−1, k) ≡ (−1)ᵏ (mod p). So alternating entries in row p−1 are exactly ±1
            away from a multiple of p — select any prime value to see this.
          </p>
        )}
        {factMode === 'fibonacci' && (
          <p>
            <strong className="text-ink-700">Fibonacci diagonals</strong>: the shallow diagonals
            of Pascal&apos;s triangle sum to Fibonacci numbers. Each entry belongs to the diagonal
            where 2·row − col is constant; three consecutive diagonals are colored identically.
          </p>
        )}
        {factMode === 'honeycomb' && (
          <p>
            <strong className="text-ink-700">Honeycomb property</strong>: for any interior entry,
            the product of its three alternating neighbors equals the product of the other three.
            A hidden symmetry of the binomial coefficient lattice.
          </p>
        )}
      </div>
    </div>
  );
}
