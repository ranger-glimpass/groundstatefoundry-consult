"use client";

import { useState } from "react";
import type { Scenario, Upcoming } from "../types";

/** Pick a made-up website. Each card has two things to try saying to Lisn. */
export default function ScenarioPicker({
  lineup, selected, onSelect,
}: {
  lineup: (Scenario | Upcoming)[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  async function say(text: string) {
    try { await navigator.clipboard?.writeText(text); } catch { /* clipboard blocked: the chip still opens the chat */ }
    window.Markaible?.open?.();
    setCopied(text);
    setTimeout(() => setCopied((c) => (c === text ? null : c)), 1600);
  }

  return (
    <div className="grid gap-3 @3xl:grid-cols-3">
      {lineup.map((x) => {
        const soon = "soon" in x;
        const on = x.id === selected;
        const swatch = soon ? x.swatch : x.brand.swatch;
        return (
          <div
            key={x.id}
            className={`relative flex flex-col rounded-xl border p-4 transition-colors ${
              on ? "border-[var(--color-neon)] bg-[var(--color-panel)]" : "border-[var(--color-border-bright)] bg-[var(--color-panel)]/60"
            } ${soon ? "opacity-60" : "hover:border-[var(--color-muted)]"}`}
          >
            <button
              type="button"
              disabled={soon}
              onClick={() => onSelect(x.id)}
              aria-pressed={on}
              className="text-left after:absolute after:inset-0 after:content-[''] disabled:cursor-default"
            >
              <span className="flex items-center gap-2.5">
                <span className="h-3.5 w-3.5 rounded-[4px] ring-1 ring-white/15" style={{ background: swatch }} />
                <span className="font-semibold text-[var(--color-fg)]">{x.name}</span>
                <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-dim)]">
                  {soon ? "coming soon" : x.label}
                </span>
              </span>
              <span className="mt-2 block text-sm leading-relaxed text-[var(--color-muted)]">{x.task}</span>
            </button>
            {!soon && (
              <div className="relative z-10 mt-3 flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-[var(--color-dim)]">Try saying:</span>
                {x.prompts.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => say(p)}
                    title="Copy, then paste it to Lisn"
                    className="rounded-full border border-[var(--color-border-bright)] px-2.5 py-0.5 text-xs text-[var(--color-fg)] transition-colors hover:border-[var(--color-muted)]"
                  >
                    {copied === p ? "Copied" : `“${p}”`}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
