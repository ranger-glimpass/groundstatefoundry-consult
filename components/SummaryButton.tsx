"use client";

import { useEffect, useRef, useState } from "react";
import type { ResearchSummary } from "@/lib/research";

const SECTIONS: { key: keyof Omit<ResearchSummary, "tldr">; label: string }[] = [
  { key: "what", label: "What" },
  { key: "why", label: "Why" },
  { key: "how", label: "How" },
  { key: "takeaway", label: "Takeaway" },
];

/** Four-point sparkle, the common "AI" mark. */
function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M12 2.5c.4 3.9 1.4 6.1 2.9 7.6 1.5 1.5 3.7 2.5 7.6 2.9-3.9.4-6.1 1.4-7.6 2.9-1.5 1.5-2.5 3.7-2.9 7.6-.4-3.9-1.4-6.1-2.9-7.6C7.6 14.4 5.4 13.4 1.5 13c3.9-.4 6.1-1.4 7.6-2.9C10.6 8.6 11.6 6.4 12 2.5Z" />
      <path d="M19.5 1.5c.15 1.4.5 2.2 1.05 2.75.55.55 1.35.9 2.75 1.05-1.4.15-2.2.5-2.75 1.05-.55.55-.9 1.35-1.05 2.75-.15-1.4-.5-2.2-1.05-2.75-.55-.55-1.35-.9-2.75-1.05 1.4-.15 2.2-.5 2.75-1.05.55-.55.9-1.35 1.05-2.75Z" opacity=".6" />
    </svg>
  );
}

export default function SummaryButton({ title, summary }: { title: string; summary: ResearchSummary }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn btn-ghost gap-2 px-4 py-2 text-sm"
        aria-haspopup="dialog"
      >
        <Sparkle className="h-4 w-4" />
        Summarize with AI
      </button>

      <dialog
        ref={ref}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false); // click on the backdrop
        }}
        aria-labelledby="summary-title"
        className="summary-dialog m-auto w-[min(40rem,calc(100vw-2rem))] max-h-[85vh] overflow-y-auto rounded-2xl border border-[var(--color-border-bright)] bg-[var(--color-panel)] p-0 text-[var(--color-fg)]"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <p className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
              <Sparkle className="h-3.5 w-3.5" />
              AI summary
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close summary"
              className="-m-2 rounded-full p-2 text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <h2 id="summary-title" className="mt-3 text-xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-fg)]">{summary.tldr}</p>

          <dl className="mt-6 divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]">
            {SECTIONS.map(({ key, label }) => (
              <div key={key} className="grid gap-1 py-4 sm:grid-cols-[6.5rem_1fr] sm:gap-4">
                <dt className="text-sm font-semibold text-[var(--color-fg)]">{label}</dt>
                <dd className="text-sm leading-relaxed text-[var(--color-muted)]">{summary[key]}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] pt-5">
            <p className="text-xs text-[var(--color-dim)]">Generated with AI from the full article.</p>
            <button type="button" onClick={() => setOpen(false)} className="btn btn-ghost px-4 py-2 text-sm">
              Read the full piece
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
