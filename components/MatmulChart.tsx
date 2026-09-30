/** Best multiplication count at each stage of our Darweel runs on 4x4 matrix multiply.
 *  Values come from the run logs: total multiplications over 500 test cases / 500. */

const STAGES = [
  { v: 64, l: "naive" },
  { v: 56, l: "early" },
  { v: 49, l: "Strassen" },
  { v: 48, l: "Winograd" },
  { v: 47.94, l: "zero-skip" },
];

const W = 320;
const H = 200;
const L = 22;
const R = 26;
const T = 22;
const B = 34;
const Y_MIN = 45;
const Y_MAX = 66;

const px = (i: number) => L + (i * (W - L - R)) / (STAGES.length - 1);
const py = (v: number) => T + ((Y_MAX - v) * (H - T - B)) / (Y_MAX - Y_MIN);

export default function MatmulChart({ className = "" }: { className?: string }) {
  const line = STAGES.map((s, i) => `${i ? "L" : "M"}${px(i)} ${py(s.v)}`).join(" ");
  return (
    <figure className={className}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Multiplications per 4x4 product falling from 64 to 47.94 across stages of evolution">
        {/* Strassen reference */}
        <line x1={L} x2={W - R} y1={py(49)} y2={py(49)} stroke="var(--color-border-bright)" strokeDasharray="3 4" />
        <text x={L} y={py(49) + 13} fontSize="9" fill="var(--color-dim)">Strassen, 49</text>

        <path d={line} stroke="var(--color-muted)" strokeWidth="1.5" fill="none" />

        {STAGES.map((s, i) => {
          const last = i === STAGES.length - 1;
          return (
            <g key={s.l}>
              <circle cx={px(i)} cy={py(s.v)} r={last ? 4 : 3} fill={last ? "var(--color-fg)" : "var(--color-muted)"} />
              <text
                x={px(i)}
                y={last ? py(s.v) + 16 : py(s.v) - 9}
                textAnchor="middle"
                fontSize="10"
                fill={last ? "var(--color-fg)" : "var(--color-muted)"}
                className="tabular-nums"
              >
                {s.v}
              </text>
              <text x={px(i)} y={H - B + 18} textAnchor="middle" fontSize="9" fill="var(--color-dim)">
                {s.l}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-2 text-xs text-[var(--color-dim)]">
        Best candidate at each stage of our runs, in multiplications per 4x4 product.
      </figcaption>
    </figure>
  );
}
