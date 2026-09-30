"use client";

import { useEffect, useRef } from "react";

/** A particle in a potential well. It rolls in, oscillates, and settles at the lowest
 *  point: the ground state. Sweep the cursor (or a finger) through it and it picks up
 *  the pointer's momentum, then rolls back down and settles again. */

const W = 300;
const H = 56;
const X0 = 4;
const X1 = 296;
const MID = 150;
const HALF = 146;
const TOP = 6;
const DEPTH = 40;
const R = 3.5;

const G = 900; // gravity, viewBox units / s^2
const DAMP = 1.6; // friction, 1 / s
const MAX_V = 600; // speed cap for a push
const PUSH_R = 14; // how close the pointer's path must pass to count as a push
const RESTITUTION = 0.45; // bounce off the rim walls

// Flat rims, smooth cosine bowl. SVG y grows downward, so the bottom is the max y.
const wellY = (x: number) => TOP + DEPTH * (0.5 + 0.5 * Math.cos((Math.PI * (x - MID)) / HALF));
const wellSlope = (x: number) =>
  ((-DEPTH * 0.5 * Math.PI) / HALF) * Math.sin((Math.PI * (x - MID)) / HALF);

const PATH = Array.from({ length: 61 }, (_, i) => {
  const x = X0 + ((X1 - X0) * i) / 60;
  return `${i ? "L" : "M"}${x.toFixed(2)} ${wellY(x).toFixed(2)}`;
}).join(" ");

/** Distance from point (px, py) to segment (ax, ay)-(bx, by). */
function segDist(px: number, py: number, ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy;
  const t = len2 ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2)) : 0;
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

export default function GroundStateMark({ className = "" }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const dot = dotRef.current;
    if (!svg || !dot) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const s = reduce ? { x: MID, v: 0 } : { x: X0 + R + 1, v: 40 };
    let raf = 0;
    let prev = 0;
    let running = false;
    let last: { x: number; y: number; t: number } | null = null;

    const draw = () => {
      dot.setAttribute("cx", s.x.toFixed(2));
      dot.setAttribute("cy", wellY(s.x).toFixed(2));
    };

    const step = (now: number) => {
      const dt = Math.min((now - prev) / 1000, 1 / 30);
      prev = now;
      const n = Math.max(1, Math.ceil(dt * 240));
      const h = dt / n;
      for (let i = 0; i < n; i++) {
        const yp = wellSlope(s.x);
        s.v += ((G * yp) / (1 + yp * yp) - DAMP * s.v) * h;
        s.x += s.v * h;
        if (s.x < X0 + R) {
          s.x = X0 + R;
          s.v = Math.abs(s.v) * RESTITUTION;
        } else if (s.x > X1 - R) {
          s.x = X1 - R;
          s.v = -Math.abs(s.v) * RESTITUTION;
        }
      }
      if (Math.abs(s.v) < 0.5 && Math.abs(s.x - MID) < 0.3) {
        s.x = MID;
        s.v = 0;
        draw();
        running = false;
        return;
      }
      draw();
      raf = requestAnimationFrame(step);
    };

    const wake = () => {
      if (running) return;
      running = true;
      prev = performance.now();
      raf = requestAnimationFrame(step);
    };

    const onMove = (e: PointerEvent) => {
      const rect = svg.getBoundingClientRect();
      const pad = 40;
      if (
        e.clientX < rect.left - pad ||
        e.clientX > rect.right + pad ||
        e.clientY < rect.top - pad ||
        e.clientY > rect.bottom + pad
      ) {
        last = null;
        return;
      }
      const px = ((e.clientX - rect.left) * W) / rect.width;
      const py = ((e.clientY - rect.top) * H) / rect.height;
      const t = e.timeStamp;
      if (last) {
        const dt = Math.max((t - last.t) / 1000, 1 / 240);
        const pvx = (px - last.x) / dt;
        const bx = s.x;
        const by = wellY(s.x);
        const came = bx - last.x; // which side the pointer came from
        const rel = pvx - s.v; // pointer speed relative to the particle
        if (
          segDist(bx, by, last.x, last.y, px, py) < PUSH_R &&
          Math.sign(came) === Math.sign(rel) &&
          Math.abs(rel) > 5
        ) {
          s.v = Math.max(-MAX_V, Math.min(MAX_V, s.v + rel * 0.9));
          wake();
        }
      }
      last = { x: px, y: py, t };
    };

    draw();
    if (!reduce) wake();
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      style={{ touchAction: "pan-y" }}
      aria-hidden
      fill="none"
    >
      <path d={PATH} stroke="var(--color-border-bright)" strokeWidth="1.25" />
      <circle ref={dotRef} r={R} cx={MID} cy={TOP + DEPTH} fill="var(--color-fg)" />
    </svg>
  );
}
