"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Stage from "./engine/Stage";
import type { TrailItem } from "./engine/ActionTrail";
import { buildContext } from "./engine/context";
import { Queue } from "./engine/queue";
import { initState, pageOf, reduce } from "./engine/reduce";
import { makeTools, type Driver, type Fx } from "./engine/tools";
import { auditScenario } from "./engine/resolve";
import type { Action, By, State } from "./engine/types";
import { scenarioById, SCENARIOS } from "./scenarios";

const frame = () => new Promise((r) => requestAnimationFrame(() => r(null)));
const clip = (x: string, n: number) => (x.length > n ? `${x.slice(0, n - 1)}…` : x);
const BAR = 44;

/** Open Lisn's chat: the widget's opener when it has one, else a click on its launcher button. */
function openLisn() {
  if (window.Markaible?.open) {
    try { window.Markaible.open({ tab: "chat" }); return; } catch { /* fall back to the launcher */ }
  }
  for (const host of document.body.children) {
    const launch = host.shadowRoot?.querySelector<HTMLElement>(".launch");
    if (launch) { launch.click(); return; }
  }
}

/** One live demo, full page: a slim bar on top, the made-up website under it, Lisn docked on the side. */
export default function Playground({ id }: { id: string }) {
  const scn = scenarioById(id) ?? SCENARIOS[0];
  const [state, setState] = useState<State>(() => initState(scn));
  const [trail, setTrail] = useState<TrailItem[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const stateRef = useRef(state);
  const fxRef = useRef<Fx | null>(null);
  const trailN = useRef(0);
  const [queue] = useState(() => new Queue());

  // Everything that changes the site goes through here: Lisn's tools and the visitor's clicks alike.
  const driver = useMemo<Driver & { visitorCommit: (a: Action) => void }>(() => {
    const push = (by: By, text: string, tone: TrailItem["tone"], key?: string) =>
      setTrail((t) => {
        const item = { n: ++trailN.current, by, text: clip(text, 60), tone, key };
        const last = t[t.length - 1];
        // The visitor typing into a field is one chip, not one per key.
        if (key && last?.key === key && last.by === by) return [...t.slice(0, -1), item];
        return [...t.slice(-59), item];
      });

    const commit = (a: Action, by: By) => {
      const before = stateRef.current;
      const r = reduce(scn, before, a);
      if (!r.ok) {
        if (!(by === "you" && a.type === "fill")) push(by, r.error, "error");
        return r;
      }
      stateRef.current = r.state;
      setState(r.state);
      const el = "id" in a ? scn.els.find((e) => e.id === a.id) : undefined;
      if (a.type === "click") push(by, `click "${el?.label}"`, "act");
      if (a.type === "fill") push(by, `fill ${el?.label}: ${el?.options?.find((o) => o.value === r.state.values[a.id])?.label ?? r.state.values[a.id]}`, "act", `fill:${a.id}`);
      if (a.type === "note") push(by, r.text.replace(/^pointed at /, "look "), "look");
      if (r.state.page !== before.page || r.state.at !== before.at) push(by, `→ ${pageOf(scn, r.state.page)?.path}`, "nav");
      if (r.state.outcome && r.state.outcome !== before.outcome) push(by, r.state.outcome, "outcome");
      return r;
    };

    const reset = async () => {
      const s = initState(scn);
      stateRef.current = s;
      setState(s);
      setTrail([]);
      await frame(); await frame();
    };

    return {
      scn: () => scn,
      state: () => stateRef.current,
      commit: (a) => commit(a, "lisn"),
      visitorCommit: (a) => commit(a, "you"),
      reset,
      fx: () => fxRef.current,
      queue,
    };
  }, [queue, scn]);

  // The visitor's own hands always win: anything they do stops what Lisn has queued.
  const onVisitor = useCallback((a: Action) => {
    queue.abort("visitor took over");
    driver.visitorCommit(a);
  }, [driver, queue]);

  // Dev check: scenario data mistakes show up in the console.
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const issues = auditScenario(scn);
    if (issues.length) console.warn(`[playground] ${scn.id} audit:`, issues);
  }, [scn]);

  // Register Lisn's page tools once.
  useEffect(() => {
    const tools = makeTools(driver);
    window.MarkaibleTools = (window.MarkaibleTools || []).filter((t) => !tools.some((x) => x.name === t.name));
    window.MarkaibleTools.push(...tools);
    return () => {
      window.MarkaibleTools = (window.MarkaibleTools || []).filter((t) => !tools.includes(t));
    };
  }, [driver]);

  // Keep Lisn's view of the site current (and seed it for a widget that loads later).
  useEffect(() => {
    const ctx = buildContext(scn, state);
    window.MarkaibleContext = ctx;
    window.Markaible?.setContext?.(ctx);
  }, [scn, state]);

  /** A suggestion chip: send the question to Lisn, or on an older widget open it and copy the question to paste. */
  async function ask(text: string) {
    if (window.Markaible?.send) {
      try { openLisn(); window.Markaible.send(text); return; } catch { /* fall back to copy and paste */ }
    }
    openLisn();
    try { await navigator.clipboard?.writeText(text); } catch { /* clipboard blocked: the chat still opens */ }
    setCopied(text);
    setTimeout(() => setCopied((c) => (c === text ? null : c)), 2400);
  }

  return (
    <div className="flex h-[100dvh] min-w-0 flex-col overflow-hidden">
      <div
        style={{ height: BAR }}
        className="@container relative flex shrink-0 items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-bg)] px-3"
      >
        {/* Full page loads on purpose: each page brings its own Lisn widget. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" aria-label="Ground State Foundry, home" className="group flex shrink-0 flex-col items-center gap-[4px] px-1">
          <span className="h-[2px] w-5 rounded bg-[var(--color-fg)] transition-colors group-hover:bg-[var(--color-neon)]" />
          <span className="h-[5px] w-[5px] rounded-full bg-[var(--color-neon)] shadow-[0_0_8px_1px_rgba(185,242,58,0.7)]" />
        </a>
        {/* Full page loads on purpose: each page brings its own Lisn widget. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/playground/" className="shrink-0 whitespace-nowrap text-xs text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]">
          ← All demos
        </a>
        <span className="h-4 w-px shrink-0 bg-[var(--color-border-bright)]" />
        <span className="flex min-w-0 shrink-0 items-center gap-2">
          <span className="h-2.5 w-2.5 shrink-0 rounded-[3px] ring-1 ring-white/15" style={{ background: scn.brand.swatch }} />
          <span className="whitespace-nowrap text-sm font-semibold text-[var(--color-fg)]">{scn.name}</span>
          <span className="hidden whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-dim)] @5xl:inline">
            made up for this demo
          </span>
        </span>
        <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto [scrollbar-width:none]">
          <span className="hidden shrink-0 text-xs text-[var(--color-dim)] @3xl:inline">Ask Lisn:</span>
          {scn.suggestions.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => ask(q)}
              title="Opens Lisn and copies the question"
              className="shrink-0 whitespace-nowrap rounded-full border border-[var(--color-border-bright)] px-2.5 py-0.5 text-xs text-[var(--color-fg)] transition-colors hover:border-[var(--color-neon)]"
            >
              {q}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => { queue.abort("visitor reset"); driver.reset(); }} className="hidden shrink-0 text-xs text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)] @2xl:inline">
          Reset
        </button>
        <a href="/contact/" className="btn btn-primary shrink-0 whitespace-nowrap px-3 py-1 text-xs">
          Request early access
        </a>
        {copied && (
          <p role="status" className="absolute right-3 top-full z-40 mt-2 rounded-lg bg-[var(--color-neon)] px-3 py-1.5 text-xs font-medium text-[var(--color-accent-fg)] shadow-lg">
            Copied, paste it to Lisn
          </p>
        )}
      </div>
      <div className="min-h-0 min-w-0 flex-1">
        <Stage
          scn={scn}
          state={state}
          trail={trail}
          fxRef={fxRef}
          onVisitor={onVisitor}
          onReload={() => queue.abort("visitor reloaded")}
          full
        />
      </div>
    </div>
  );
}
