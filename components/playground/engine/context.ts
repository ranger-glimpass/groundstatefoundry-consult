/** What Lisn sees of the mock site on every turn. Kept under 1900 bytes of JSON. */
import { pageOf, taskProgress, visibleEls } from "./reduce";
import type { Scenario, State } from "./types";

export const CONTEXT_BUDGET = 1900;

const clip = (x: string, n: number) => (x.length > n ? `${x.slice(0, n - 1)}…` : x);
export const bytes = (o: unknown) => new TextEncoder().encode(JSON.stringify(o)).length;

export function buildContext(scn: Scenario, s: State) {
  const page = pageOf(scn, s.page);
  const t = taskProgress(scn, s);
  // Current page first, nav chrome last: the page is what matters most when we trim.
  const els = visibleEls(scn, s)
    .sort((a, b) => Number(a.page === "*") - Number(b.page === "*"))
    .slice(0, 25)
    .map((e) => {
      const val = e.kind === "field" ? s.values[e.id] : undefined;
      const label = clip(e.label, 36) + (val ? ` = ${clip(val, 24)}` : "");
      return [e.id, label, e.kind];
    });
  const ctx = {
    demo: scn.id,
    site: `${scn.name} (made up for this demo)`,
    page: s.page,
    title: page?.title ?? s.page,
    pages: scn.pages.map((p) => p.id),
    els,
    task: { n: Math.min(t.n + 1, t.of), of: t.of, goal: t.goal, done: t.n },
    outcome: s.outcome,
    last: clip(s.last, 90),
    seq: s.seq,
  };
  while (bytes(ctx) > CONTEXT_BUDGET && ctx.els.length > 1) ctx.els.pop();
  return ctx;
}
