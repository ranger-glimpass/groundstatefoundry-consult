"use client";

import { useEffect, useRef } from "react";

/** Ambient field: sparse particles + faint binary "bits" drifting upward like
 *  vacuum fluctuations, gently pulled toward the cursor (a field well).
 *  Cheap canvas, DPR-aware, pauses when hidden, respects reduced-motion. */
export default function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    const mouse = { x: -9999, y: -9999 };

    type P = {
      x: number; y: number; vx: number; vy: number;
      a: number; tw: number; lime: boolean;
      bit: string | null; size: number; // bit char or null (dot); size = radius or font px
    };
    let ps: P[] = [];

    const build = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const n = Math.min(96, Math.floor((w * h) / 20000));
      ps = Array.from({ length: n }, (_, i) => {
        const isBit = i % 5 < 2; // ~40% are binary bits
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15 - 0.05,
          a: (isBit ? 0.22 : 0.35) + Math.random() * (isBit ? 0.22 : 0.4),
          tw: Math.random() * Math.PI * 2,
          lime: i % 9 === 0,
          bit: isBit ? (Math.random() < 0.5 ? "0" : "1") : null,
          size: isBit ? Math.floor(Math.random() * 6) + 11 : Math.random() * 1.5 + 0.7,
        };
      });
    };
    build();

    const onResize = () => build();
    const onMove = (e: PointerEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove);

    const draw = (animate: boolean) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        if (animate) {
          p.tw += 0.02;
          const dx = mouse.x - p.x, dy = mouse.y - p.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 150 && d > 0.001) {
            const f = (1 - d / 150) * 0.05;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
          p.vx *= 0.985;
          p.vy *= 0.985;
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -14) p.x = w + 14; else if (p.x > w + 14) p.x = -14;
          if (p.y < -14) p.y = h + 14; else if (p.y > h + 14) p.y = -14;
        }
        const a = animate ? p.a * (0.7 + 0.3 * Math.sin(p.tw)) : p.a;
        const color = p.lime ? `rgba(185,242,58,${a})` : `rgba(232,244,228,${a})`;
        if (p.bit) {
          ctx.font = `${p.size}px ui-monospace, "JetBrains Mono", monospace`;
          ctx.fillStyle = color;
          ctx.shadowBlur = 0;
          ctx.fillText(p.bit, p.x, p.y);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          if (p.lime) { ctx.shadowColor = "rgba(185,242,58,0.85)"; ctx.shadowBlur = 7; }
          else { ctx.shadowBlur = 0; }
          ctx.fillStyle = color;
          ctx.fill();
        }
      }
      ctx.shadowBlur = 0;
    };

    let raf = 0;
    const loop = () => { draw(true); raf = requestAnimationFrame(loop); };
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(loop);
    };

    if (reduce) {
      draw(false);
    } else {
      document.addEventListener("visibilitychange", onVis);
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      style={{ opacity: 0.9 }}
    />
  );
}
