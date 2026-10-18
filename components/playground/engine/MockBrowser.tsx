"use client";

import { useEffect, useState, type ReactNode, type RefObject } from "react";

/** Browser chrome around the mock site: real back/forward (in-memory history), reload, a URL that types itself. */
export default function MockBrowser({
  rootRef, urlRef, full = false, domain, path, navKey, canBack, canForward, onBack, onForward, onReload, trail, children,
}: {
  rootRef: RefObject<HTMLDivElement | null>;
  urlRef: RefObject<HTMLDivElement | null>;
  full?: boolean; // fill the parent edge to edge (demo pages)
  domain: string;
  path: string;
  navKey: number;
  canBack: boolean;
  canForward: boolean;
  onBack: () => void;
  onForward: () => void;
  onReload: () => void;
  trail: ReactNode;
  children: ReactNode;
}) {
  const [typed, setTyped] = useState(path.length);

  // Type the new path over 220ms.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || path.length <= 1) {
      setTyped(path.length);
      return;
    }
    setTyped(0);
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / 220);
      setTyped(Math.ceil(k * path.length));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [path, navKey]);

  const nav = "grid h-7 w-7 place-items-center rounded-md text-[var(--color-muted)] transition-colors hover:bg-white/5 hover:text-[var(--color-fg)] disabled:opacity-30 disabled:hover:bg-transparent";

  return (
    <div
      ref={rootRef}
      style={full ? undefined : { height: "max(560px, calc(100vh - 180px))" }}
      className={`relative flex flex-col overflow-hidden bg-[var(--color-panel)] ${full ? "h-full w-full" : "rounded-xl border border-[var(--color-border-bright)]"}`}
    >
      <div className="relative flex h-10 shrink-0 items-center gap-1 border-b border-[var(--color-border)] bg-[var(--color-panel-2)] px-2">
        <button type="button" aria-label="Back" className={nav} disabled={!canBack} onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M9 2.5 4.5 7 9 11.5" /></svg>
        </button>
        <button type="button" aria-label="Forward" className={nav} disabled={!canForward} onClick={onForward}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 2.5 9.5 7 5 11.5" /></svg>
        </button>
        <button type="button" aria-label="Reload" className={nav} onClick={onReload}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M11.5 7a4.5 4.5 0 1 1-1.3-3.2" /><path d="M11 1.5v2.8H8.2" /></svg>
        </button>
        <div ref={urlRef} className="ml-1 flex h-7 min-w-0 flex-1 items-center gap-2 rounded-full bg-black/40 px-3 font-mono text-xs">
          <svg width="10" height="10" viewBox="0 0 10 10" className="shrink-0 text-[var(--color-dim)]" fill="currentColor" aria-hidden><path d="M2.5 4.5V3.2a2.5 2.5 0 0 1 5 0v1.3h.5v4.5H2V4.5h.5Zm1 0h3V3.2a1.5 1.5 0 0 0-3 0v1.3Z" /></svg>
          <span className="truncate">
            <span className="text-[var(--color-dim)]">https://</span>
            <span className="text-[var(--color-fg)]">{domain}</span>
            <span className="text-[var(--color-muted)]">{path.slice(0, typed)}</span>
          </span>
        </div>
        {/* 2px lime progress bar on every navigation */}
        <span key={navKey} className={`absolute inset-x-0 bottom-[-1px] h-[2px] origin-left bg-[var(--color-neon)] ${navKey ? "mk-progress" : "opacity-0"}`} />
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
      {trail}
    </div>
  );
}
