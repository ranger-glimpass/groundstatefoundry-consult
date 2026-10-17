"use client";

import { useEffect, useRef } from "react";
import type { By } from "./types";

export type TrailItem = { n: number; by: By; text: string; tone: "nav" | "act" | "look" | "outcome" | "error"; key?: string };

/** 36px strip under the mock site: what just happened, Lisn's moves and the visitor's ("you"). */
export default function ActionTrail({ items }: { items: TrailItem[] }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    box.current?.scrollTo({ left: box.current.scrollWidth, behavior: "smooth" });
  }, [items]);

  return (
    <div
      ref={box}
      role="log"
      aria-label="What happened on the site"
      className="flex h-9 shrink-0 items-center gap-1.5 overflow-x-auto border-t border-[var(--color-border)] bg-[var(--color-panel-2)] px-3 [scrollbar-width:none]"
    >
      {items.length === 0 && <span className="font-mono text-[11px] text-[var(--color-dim)]">Moves show up here, Lisn&apos;s and yours.</span>}
      {items.map((it) => (
        <span
          key={it.n}
          className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 font-mono text-[11px] leading-4 ${
            it.tone === "outcome"
              ? "border-[var(--color-neon)] bg-[var(--color-neon)] font-medium text-[var(--color-accent-fg)]"
              : it.tone === "error"
                ? "border-[rgba(248,113,113,0.35)] text-[var(--color-magenta)]"
                : "border-[var(--color-border-bright)] text-[var(--color-muted)]"
          }`}
        >
          {it.by === "you" && it.tone !== "outcome" && <span className="text-[var(--color-dim)]">you</span>}
          {it.text}
        </span>
      ))}
    </div>
  );
}
