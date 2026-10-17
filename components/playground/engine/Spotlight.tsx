"use client";

import { useEffect, useId, useRef, useState, type RefObject } from "react";

export type Spot = { key: number; ids: string[]; label: string; note?: string; dim?: boolean };
export type Badge = { id: string; n: number; until: number };

type Box = { x: number; y: number; w: number; h: number };
type Layout = { rects: Box[]; badges: { n: number; x: number; y: number }[]; cap: { x: number; y: number } | null };

const RING_MS = 4000;
const DIM_MS = 2600;
const same = (a: Layout, b: Layout) => JSON.stringify(a) === JSON.stringify(b);

/**
 * Dim + lime ring + caption over the mock viewport. Absolute inside the viewport (never fixed), and it
 * re-measures every frame while visible, so it follows scrolling, resizing and the dock squeezing the page.
 */
export default function Spotlight({
  host, find, spot, badges, reduced,
}: {
  host: RefObject<HTMLDivElement | null>;
  find: (id: string) => HTMLElement | null;
  spot: Spot | null;
  badges: Badge[];
  reduced: boolean;
}) {
  const mask = useId().replace(/:/g, "");
  const cap = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<Layout>({ rects: [], badges: [], cap: null });
  const [phase, setPhase] = useState<"off" | "on" | "fading">("off");
  const [dim, setDim] = useState(false);

  // Timeline for one spotlight: show, drop the dim, fade the ring.
  useEffect(() => {
    if (!spot) return;
    setPhase("on");
    setDim(!!spot.dim && !reduced);
    const t1 = setTimeout(() => setDim(false), DIM_MS);
    const t2 = setTimeout(() => setPhase("fading"), RING_MS);
    const t3 = setTimeout(() => setPhase("off"), RING_MS + 200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [spot, reduced]);

  const active = phase !== "off" || badges.length > 0;

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const tick = () => {
      const h = host.current;
      if (h) {
        const hr = h.getBoundingClientRect();
        const box = (el: HTMLElement): Box => {
          const r = el.getBoundingClientRect();
          return { x: Math.round(r.left - hr.left), y: Math.round(r.top - hr.top), w: Math.round(r.width), h: Math.round(r.height) };
        };
        const rects = phase !== "off" && spot ? spot.ids.map(find).filter((e): e is HTMLElement => !!e).map(box) : [];
        const now = Date.now();
        const bs = badges.filter((b) => b.until > now).flatMap((b) => {
          const el = find(b.id);
          if (!el) return [];
          const r = box(el);
          return [{ n: b.n, x: r.x - 9, y: r.y - 9 }];
        });
        let c: Layout["cap"] = null;
        if (rects[0] && cap.current) {
          const r = rects[0];
          const cw = cap.current.offsetWidth, ch = cap.current.offsetHeight;
          let y = r.y + r.h + 12;
          if (y + ch > hr.height - 8) y = r.y - ch - 12; // flip above when it would overflow
          y = Math.max(8, Math.min(y, hr.height - ch - 8));
          const x = Math.max(8, Math.min(r.x, hr.width - cw - 8));
          c = { x: Math.round(x), y: Math.round(y) };
        }
        const next = { rects, badges: bs, cap: c };
        setLayout((prev) => (same(prev, next) ? prev : next));
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [active, phase, spot, badges, find, host]);

  const show = phase === "on";
  const hidden = layout.rects.length === 0;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <svg className="absolute inset-0 h-full w-full transition-opacity duration-[180ms]" style={{ opacity: dim && show && !hidden ? 1 : 0 }}>
        <defs>
          <mask id={mask}>
            <rect width="100%" height="100%" fill="white" />
            {layout.rects.map((r, i) => (
              <rect key={i} x={r.x - 6} y={r.y - 6} width={r.w + 12} height={r.h + 12} rx="10" fill="black" />
            ))}
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(0,0,0,0.45)" mask={`url(#${mask})`} />
      </svg>

      {phase !== "off" && spot && layout.rects.map((r, i) => (
        <div
          key={`${spot.key}-${i}`}
          className={`absolute rounded-[10px] border-2 border-[var(--color-neon)] transition-opacity duration-200 ${reduced ? "" : "mk-ring-pulse"}`}
          style={{ left: r.x - 6, top: r.y - 6, width: r.w + 12, height: r.h + 12, opacity: show ? 1 : 0 }}
        />
      ))}

      {spot && phase !== "off" && (
        <div
          ref={cap}
          key={spot.key}
          className="absolute max-w-[240px] rounded-lg bg-[#0a0b0a] px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.35)] ring-1 ring-white/10 transition-opacity duration-200"
          style={{ left: layout.cap?.x ?? 0, top: layout.cap?.y ?? 0, opacity: show && layout.cap ? 1 : 0 }}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-neon)]">{spot.label}</p>
          {spot.note && <p className="mt-0.5 text-[13px] leading-snug text-[#f3f5f1]">{spot.note}</p>}
        </div>
      )}

      {layout.badges.map((b) => (
        <span
          key={`${b.n}`}
          className="absolute grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[var(--color-neon)] px-1 font-mono text-[10px] font-medium text-[var(--color-accent-fg)] shadow-[0_1px_4px_rgba(0,0,0,0.3)]"
          style={{ left: b.x, top: b.y }}
        >
          {b.n}
        </span>
      ))}
    </div>
  );
}
