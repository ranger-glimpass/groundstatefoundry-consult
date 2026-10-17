"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Stage from "./engine/Stage";
import ScenarioPicker from "./engine/ui/ScenarioPicker";
import type { TrailItem } from "./engine/ActionTrail";
import { buildContext } from "./engine/context";
import { Queue } from "./engine/queue";
import { initState, pageOf, reduce, taskProgress } from "./engine/reduce";
import { makeTools, type Driver, type Fx } from "./engine/tools";
import { auditScenario } from "./engine/resolve";
import type { Action, By, PageTool, Scenario, State } from "./engine/types";
import { LINEUP, SCENARIOS, scenarioById } from "./scenarios";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const frame = () => new Promise((r) => requestAnimationFrame(() => r(null)));
const clip = (x: string, n: number) => (x.length > n ? `${x.slice(0, n - 1)}…` : x);

/** The playground: pick a made-up website, then Lisn (or you, or Autoplay) works it. */
export default function Playground() {
  const [scn, setScn] = useState<Scenario>(SCENARIOS[0]);
  const [state, setState] = useState<State>(() => initState(SCENARIOS[0]));
  const [trail, setTrail] = useState<TrailItem[]>([]);
  const [auto, setAuto] = useState<number | null>(null); // step Autoplay is on
  const scnRef = useRef(scn);
  const stateRef = useRef(state);
  const fxRef = useRef<Fx | null>(null);
  const toolsRef = useRef<PageTool[]>([]);
  const autoRun = useRef(0);
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
      const scn = scnRef.current, before = stateRef.current;
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

    const start = async (id: string) => {
      const next = scenarioById(id);
      if (!next) {
        const soon = LINEUP.find((x) => x.id === id);
        return `${soon ? `${soon.name} is coming soon` : `No scenario "${id}"`}. Ready now: ${SCENARIOS.map((s) => s.id).join(", ")}.`;
      }
      const s = initState(next);
      scnRef.current = next;
      stateRef.current = s;
      setScn(next);
      setState(s);
      setTrail([]);
      await frame(); await frame();
      return null;
    };

    return {
      scn: () => scnRef.current,
      state: () => stateRef.current,
      commit: (a) => commit(a, "lisn"),
      visitorCommit: (a) => commit(a, "you"),
      start,
      fx: () => fxRef.current,
      queue,
    };
  }, [queue]);

  const stopAuto = useCallback((why: string) => {
    autoRun.current++;
    setAuto(null);
    queue.abort(why);
  }, [queue]);

  // The visitor's own hands always win: anything they do stops what Lisn has queued.
  const onVisitor = useCallback((a: Action) => {
    stopAuto("visitor took over");
    driver.visitorCommit(a);
  }, [driver, stopAuto]);

  // Dev check: scenario data mistakes show up in the console.
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    for (const s of SCENARIOS) {
      const issues = auditScenario(s);
      if (issues.length) console.warn(`[playground] ${s.id} audit:`, issues);
    }
  }, []);

  // Register Lisn's page tools once.
  useEffect(() => {
    const tools = makeTools(driver, SCENARIOS.map((s) => s.id));
    toolsRef.current = tools;
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

  async function pick(id: string) {
    stopAuto("visitor switched website");
    await driver.start(id);
  }

  /** Autoplay runs the scenario's solution through the very same tools Lisn calls. */
  async function autoplay() {
    if (auto !== null) return stopAuto("autoplay stopped");
    stopAuto("autoplay restarted");
    const run = autoRun.current;
    await driver.start(scnRef.current.id);
    const tools = Object.fromEntries(toolsRef.current.map((t) => [t.name, t]));
    const steps = scnRef.current.solution;
    for (let i = 0; i < steps.length; i++) {
      if (autoRun.current !== run) return;
      setAuto(i + 1);
      const { action, ...args } = steps[i];
      const r = await tools[`demo_${action}`].run({ ...args, __n: i + 1, __badge: true });
      if (autoRun.current !== run) return;
      if (r.status !== "done") {
        setTrail((t) => [...t, { n: ++trailN.current, by: "lisn", text: clip(r.error ?? "stopped", 60), tone: "error" }]);
        break;
      }
      await sleep(action === "highlight" ? 2200 : action === "fill" ? 700 : 450);
    }
    if (autoRun.current === run) setAuto(null);
  }

  const progress = taskProgress(scn, state);

  return (
    <div className="@container space-y-4">
      <ScenarioPicker lineup={LINEUP} selected={scn.id} onSelect={pick} />

      <div className="flex flex-col gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-3 @3xl:flex-row @3xl:items-center">
        <div className="min-w-0 flex-1">
          <p className="mono-label">
            tasks · {progress.n} of {progress.of} done
          </p>
          <ol className="mt-2 flex flex-wrap gap-1.5">
            {scn.tasks.map((t, i) => {
              const done = progress.done[i];
              const next = !done && t.goal === progress.goal;
              return (
                <li
                  key={t.goal}
                  className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs ${
                    done ? "border-transparent bg-white/5 text-[var(--color-muted)]"
                    : next ? "border-[var(--color-muted)] text-[var(--color-fg)]"
                    : "border-[var(--color-border-bright)] text-[var(--color-muted)]"
                  }`}
                >
                  <span className={`grid h-4 w-4 place-items-center rounded-full font-mono text-[10px] ${done ? "bg-[var(--color-neon)] text-[var(--color-accent-fg)]" : "bg-white/10"}`}>
                    {done ? <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.4" aria-label="done"><path d="m2.5 6.5 2.3 2.3L9.5 3.8" /></svg> : i + 1}
                  </span>
                  {t.goal}
                </li>
              );
            })}
          </ol>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" onClick={() => pick(scn.id)} className="btn btn-ghost px-4 py-2 text-xs">Reset</button>
          <button type="button" onClick={autoplay} className={`btn px-4 py-2 text-xs ${auto !== null ? "btn-ghost" : "btn-primary"}`}>
            {auto !== null ? `Stop · step ${auto} of ${scn.solution.length}` : "▶ Autoplay"}
          </button>
        </div>
      </div>

      <Stage
        scn={scn}
        state={state}
        trail={trail}
        fxRef={fxRef}
        onVisitor={onVisitor}
        onReload={() => stopAuto("visitor reloaded")}
      />
    </div>
  );
}
