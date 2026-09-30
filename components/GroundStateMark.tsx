"use client";

import { useEffect, useRef } from "react";

/** A ball in a potential well. It rolls in, oscillates, and settles at the lowest
 *  point: the ground state. Sweep the cursor (or a finger) through it and it takes the
 *  hit, rolls, and settles again.
 *
 *  Physics, in the frame of the curve (units: viewBox units, the bowl read as 30 cm wide):
 *  - The ball is a solid sphere rolling without slipping, so its effective inertia is
 *    7/5 of its mass (translation plus spin).
 *  - Along the track: (7/5) m a = -m g sin(theta) - Crr N - m k v.
 *  - Normal force: N = m (g cos(theta) + kappa v^2), where theta is the local slope angle
 *    and kappa the local curvature. It rises in the bowl, falls on the shoulders.
 *  - Rolling friction is Crr * N, so it depends on where the ball is and how fast it goes.
 *  - If N would go negative (too fast over a convex shoulder), the ball leaves the track
 *    and flies ballistically until it lands, keeping its velocity along the track. */

const W = 300;
const H = 56;
const X0 = 4;
const X1 = 296;
const MID = 150;
const HALF = 146;
const TOP = 6;
const DEPTH = 40;
const R = 3.5;

const G = 9810; // gravity: 9.81 m/s^2 with 1 unit = 1 mm (a 30 cm bowl)
const INERTIA = 7 / 5; // solid sphere rolling without slipping
const CRR = 0.05; // rolling-resistance coefficient (a ball rolling on felt)
const AIR = 0.05; // air drag, 1 / s (small)
const HAND_E = 0.7; // restitution of a hit: a light ball bouncing off a much heavier hand
const WALL_E = 0.5; // restitution at the frame edges
const MAX_V = 1600; // speed cap for a push
const PUSH_R = 14; // how close the pointer's path must pass to count as a push

// Height above the bottom of the bowl (up is positive), and its derivatives.
// Cosine bowl with flat rims; the shoulders are convex, so a fast ball can take off there.
const hgt = (x: number) => DEPTH * 0.5 * (1 - Math.cos((Math.PI * (x - MID)) / HALF));
const K = Math.PI / HALF;
const hgt1 = (x: number) => DEPTH * 0.5 * K * Math.sin(K * (x - MID));
const hgt2 = (x: number) => DEPTH * 0.5 * K * K * Math.cos(K * (x - MID));
const BOTTOM = TOP + DEPTH; // SVG y of the lowest point (SVG y grows downward)
const toSvgY = (height: number) => BOTTOM - height;

const PATH = Array.from({ length: 61 }, (_, i) => {
  const x = X0 + ((X1 - X0) * i) / 60;
  return `${i ? "L" : "M"}${x.toFixed(2)} ${toSvgY(hgt(x)).toFixed(2)}`;
}).join(" ");

/** Distance from point (px, py) to segment (ax, ay)-(bx, by). */
function segDist(px: number, py: number, ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy;
  const t = len2 ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2)) : 0;
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

type Ball = {
  x: number;
  /** speed along the track (on track) */
  v: number;
  air: boolean;
  /** height and velocity components while airborne */
  y: number;
  vx: number;
  vy: number;
};

export default function GroundStateMark({ className = "" }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const dot = dotRef.current;
    if (!svg || !dot) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const b: Ball = { x: reduce ? MID : X0 + R + 1, v: reduce ? 0 : 60, air: false, y: 0, vx: 0, vy: 0 };
    let raf = 0;
    let prev = 0;
    let running = false;
    let last: { x: number; y: number; t: number } | null = null;

    const ballHeight = () => (b.air ? b.y : hgt(b.x));
    const draw = () => {
      dot.setAttribute("cx", b.x.toFixed(2));
      dot.setAttribute("cy", toSvgY(ballHeight()).toFixed(2));
    };

    const land = () => {
      const c = 1 / Math.sqrt(1 + hgt1(b.x) ** 2);
      const s = hgt1(b.x) * c;
      b.v = b.vx * c + b.vy * s; // keep the along-track part, lose the impact
      b.air = false;
    };

    const tick = (h: number) => {
      if (b.air) {
        b.vy -= G * h;
        b.vx -= AIR * b.vx * h;
        b.x += b.vx * h;
        b.y += b.vy * h;
        if (b.x < X0 + R || b.x > X1 - R) {
          b.x = Math.max(X0 + R, Math.min(X1 - R, b.x));
          b.vx = -b.vx * WALL_E;
        }
        if (b.y <= hgt(b.x)) land();
        return;
      }

      const p = hgt1(b.x);
      const q = 1 + p * p;
      const c = 1 / Math.sqrt(q); // cos(theta)
      const s = p * c; // sin(theta)
      const kappa = hgt2(b.x) / (q * Math.sqrt(q));
      const n = G * c + kappa * b.v * b.v; // normal force per unit mass

      if (n < 0) {
        b.air = true;
        b.y = hgt(b.x);
        b.vx = b.v * c;
        b.vy = b.v * s;
        return;
      }

      const drive = -G * s;
      const fric = CRR * n;
      let a: number;
      if (b.v !== 0) a = drive - Math.sign(b.v) * fric;
      else if (Math.abs(drive) <= fric) a = 0; // static: friction holds it
      else a = drive - Math.sign(drive) * fric;
      a = a / INERTIA - AIR * b.v;

      const nv = b.v + a * h;
      // Friction can stop the ball but never reverse it.
      b.v = b.v !== 0 && Math.sign(nv) !== Math.sign(b.v) && Math.abs(drive) <= fric ? 0 : nv;
      b.x += b.v * c * h;

      if (b.x < X0 + R) {
        b.x = X0 + R;
        b.v = Math.abs(b.v) * WALL_E;
      } else if (b.x > X1 - R) {
        b.x = X1 - R;
        b.v = -Math.abs(b.v) * WALL_E;
      }
    };

    const atRest = () => {
      if (b.air || b.v !== 0) return false;
      const p = hgt1(b.x);
      const c = 1 / Math.sqrt(1 + p * p);
      return Math.abs(G * p * c) <= CRR * G * c;
    };

    const step = (now: number) => {
      const dt = Math.min((now - prev) / 1000, 1 / 30);
      prev = now;
      const n = Math.max(1, Math.ceil(dt * 1000));
      for (let i = 0; i < n; i++) tick(dt / n);
      draw();
      if (atRest()) {
        running = false;
        return;
      }
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
      if (last && !b.air) {
        const dt = Math.max((t - last.t) / 1000, 1 / 240);
        const pvx = (px - last.x) / dt;
        const pvUp = -(py - last.y) / dt;
        const p = hgt1(b.x);
        const c = 1 / Math.sqrt(1 + p * p);
        const u = pvx * c + pvUp * p * c; // pointer speed along the track
        const bx = b.x;
        const by = toSvgY(hgt(b.x));
        const came = bx - last.x; // which side the pointer came from
        const rel = u - b.v; // pointer speed relative to the ball
        if (
          segDist(bx, by, last.x, last.y, px, py) < PUSH_R &&
          Math.sign(came) === Math.sign(rel) &&
          Math.abs(rel) > 5
        ) {
          // Collision with a much heavier hand: v' = u + e(u - v).
          b.v = Math.max(-MAX_V, Math.min(MAX_V, u + HAND_E * rel));
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
      style={{ touchAction: "pan-y", overflow: "visible" }}
      aria-hidden
      fill="none"
    >
      <path d={PATH} stroke="var(--color-border-bright)" strokeWidth="1.25" />
      <circle ref={dotRef} r={R} cx={MID} cy={BOTTOM} fill="var(--color-fg)" />
    </svg>
  );
}
