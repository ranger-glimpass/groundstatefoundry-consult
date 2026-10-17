"use client";

import { forwardRef } from "react";

/** Lisn's cursor: a small arrow with a "Lisn" pill. Stage moves it with the helpers below. */
const GhostCursor = forwardRef<HTMLDivElement>(function GhostCursor(_, ref) {
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 z-30 opacity-0 transition-opacity duration-300"
      style={{ transform: "translate(40px, 80px)" }}
    >
      <div data-arrow className="relative">
        <svg width="20" height="20" viewBox="0 0 20 20" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]">
          <path d="M3 2 L3 17 L7.2 13.2 L10 19 L12.6 17.8 L9.9 12.2 L15.6 12.2 Z" fill="#0a0b0a" stroke="#ffffff" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
        <span className="absolute left-[16px] top-[15px] whitespace-nowrap rounded-full bg-[var(--color-neon)] px-1.5 py-[1px] font-mono text-[10px] font-medium leading-4 text-[var(--color-accent-fg)] shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
          Lisn
        </span>
      </div>
    </div>
  );
});

export default GhostCursor;

const clamp = (lo: number, v: number, hi: number) => Math.max(lo, Math.min(hi, v));
const EASE = "cubic-bezier(.22,.8,.3,1)";

export type Pos = { x: number; y: number };

/** Glide along a gentle curve. Duration clamp(250, dist*0.6, 700) ms. */
export async function glide(node: HTMLElement, from: Pos, to: Pos, reduced: boolean) {
  node.style.opacity = "1";
  const dist = Math.hypot(to.x - from.x, to.y - from.y);
  if (reduced || dist < 2) {
    node.style.transform = `translate(${to.x}px, ${to.y}px)`;
    return;
  }
  // Quadratic bezier with the control point pushed sideways, so the path bows like a hand would.
  const mx = (from.x + to.x) / 2, my = (from.y + to.y) / 2;
  const bow = Math.min(80, dist * 0.2);
  const cx = mx + (-(to.y - from.y) / dist) * bow, cy = my + ((to.x - from.x) / dist) * bow;
  const frames: Keyframe[] = [];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12, u = 1 - t;
    const x = u * u * from.x + 2 * u * t * cx + t * t * to.x;
    const y = u * u * from.y + 2 * u * t * cy + t * t * to.y;
    frames.push({ transform: `translate(${x}px, ${y}px)` });
  }
  const anim = node.animate(frames, { duration: clamp(250, dist * 0.6, 700), easing: EASE, fill: "forwards" });
  try { await anim.finished; } catch { /* cancelled */ }
  node.style.transform = `translate(${to.x}px, ${to.y}px)`;
  anim.cancel();
}

/** Press: shrink to .9 for 90ms and send out a ripple (0 to 36px over 400ms). Resolves when the press lands. */
export async function press(node: HTMLElement, reduced: boolean) {
  if (reduced) return;
  const arrow = node.querySelector<HTMLElement>("[data-arrow]");
  arrow?.animate([{ transform: "scale(1)" }, { transform: "scale(.9)" }, { transform: "scale(1)" }], { duration: 180, easing: "ease-out" });
  const ring = document.createElement("span");
  ring.className = "pointer-events-none absolute rounded-full border-2 border-[var(--color-neon)]";
  Object.assign(ring.style, { left: "-15px", top: "-15px", width: "36px", height: "36px" });
  node.appendChild(ring);
  ring.animate([{ transform: "scale(0)", opacity: 0.9 }, { transform: "scale(1)", opacity: 0 }], { duration: 400, easing: "ease-out" })
    .finished.then(() => ring.remove(), () => ring.remove());
  await new Promise((r) => setTimeout(r, 90));
}
