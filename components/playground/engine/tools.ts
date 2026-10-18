/** Lisn's hands on the mock site: the 7 demo_* page tools (the agent sees them as page_demo_*). */
import { taskProgress, checkFill, pageOf, visibleEls } from "./reduce";
import { resolveEl, resolvePage } from "./resolve";
import { check, type Queue, type Token } from "./queue";
import type { Action, Result, Scenario, State, Step, PageTool, ToolResult } from "./types";

/** Choreography the Stage provides: cursor, spotlight, typing. All of it is cosmetic; state only changes via commit. */
export type Fx = {
  point: (id: string) => Promise<void>; // scroll it into view and glide the cursor there
  pointUrl: () => Promise<void>;
  press: () => Promise<void>;
  type: (id: string, text: string) => Promise<void>;
  ring: (ids: string[], o: { label: string; note?: string; dim?: boolean }) => void; // ids may include PAGE (the whole viewport)
  badge: (id: string, n: number) => void;
  readText: (page: string) => string;
  settle: () => Promise<void>; // wait for React to paint and the page to finish fading in
};

export type Driver = {
  scn: () => Scenario;
  state: () => State;
  commit: (a: Action) => Result; // always by Lisn
  reset: () => Promise<void>; // back to the scenario's first page, forms empty
  fx: () => Fx | null;
  queue: Queue;
};

class StepError extends Error {}

/** Ring the whole mock viewport (used after Lisn lands on a page, so a navigation is highlighted too). */
export const PAGE = "@page";
/** Highlight mode: how long the ring and caption sit on a target before Lisn presses it. */
const DWELL = 420;

const clip = (x: string, n: number) => (x.length > n ? `${x.slice(0, n - 1)}…` : x);
const str = (v: unknown) => (typeof v === "string" ? v : v == null ? "" : String(v));
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function receipt(scn: Scenario, s: State, text: string) {
  const t = taskProgress(scn, s);
  const line = `${text}. Now on ${pageOf(scn, s.page)?.title ?? s.page}. Tasks ${t.n}/${t.of} done${s.outcome ? `, ${s.outcome}` : ""}. seq ${s.seq}`;
  return clip(line, 199);
}

type Ctx = { d: Driver; t: Token; n?: number; badge?: boolean };
const label = (c: Ctx, verb: string) => (c.n ? `STEP ${c.n} · ${verb}` : `LISN · ${verb}`);

function commitOrThrow(d: Driver, a: Action) {
  const r = d.commit(a);
  if (!r.ok) throw new StepError(r.error);
  return r.text;
}

function onPage(d: Driver, onPageArg: unknown) {
  if (!onPageArg) return;
  const p = resolvePage(d.scn(), onPageArg);
  const here = d.state().page;
  if ("error" in p) throw new StepError(p.error);
  if (p.page.id !== here) throw new StepError(`You are on "${here}", not "${p.page.id}". Use demo_go_to first.`);
}

async function goTo(c: Ctx, pageRef: unknown) {
  const { d, t } = c;
  const scn = d.scn();
  const r = resolvePage(scn, pageRef);
  if ("error" in r) throw new StepError(r.error);
  const s = d.state();
  if (r.page.id === s.page) {
    await landed(c, r.page.title);
    return commitOrThrow(d, { type: "note", text: `already on ${r.page.title}` });
  }
  const fx = d.fx();
  // Click a real link when one is on screen (nav first), so the visitor sees how to get there.
  const links = visibleEls(scn, s).filter((e) => e.to === r.page.id && !e.when);
  const link = links.find((e) => e.page === "*") ?? links[0];
  if (fx) {
    if (link) {
      await fx.point(link.id); check(t);
      fx.ring([link.id], { label: label(c, "GO"), note: `${link.label} → ${r.page.title}` });
      if (c.badge && c.n) fx.badge(link.id, c.n);
      await sleep(DWELL); check(t);
    } else {
      await fx.pointUrl(); check(t);
    }
    await fx.press(); check(t);
  }
  const text = link ? commitOrThrow(d, { type: "click", id: link.id }) : commitOrThrow(d, { type: "go", page: r.page.id });
  // A link with its own logic might land elsewhere; make sure we end where asked.
  if (d.state().page !== r.page.id) commitOrThrow(d, { type: "go", page: r.page.id });
  await landed(c, r.page.title);
  return text;
}

/** After a move that changed the page, keep it highlighted: ring the new page with a caption. */
async function landed(c: Ctx, title: string) {
  const fx = c.d.fx();
  if (!fx) return;
  await fx.settle();
  fx.ring([PAGE], { label: label(c, "NOW ON"), note: title });
}

async function click(c: Ctx, id: unknown, pageArg?: unknown) {
  const { d, t } = c;
  onPage(d, pageArg);
  const r = resolveEl(d.scn(), d.state(), id, ["link", "button", "card", "field", "text"]);
  if ("error" in r) throw new StepError(r.error);
  const fx = d.fx();
  if (fx) {
    await fx.point(r.el.id); check(t);
    fx.ring([r.el.id], { label: label(c, "CLICK"), note: r.el.label });
    if (c.badge && c.n) fx.badge(r.el.id, c.n);
    await sleep(DWELL); check(t);
    await fx.press(); check(t);
  }
  const before = d.state();
  const text = commitOrThrow(d, { type: "click", id: r.el.id });
  const after = d.state();
  if (after.page !== before.page || after.at !== before.at) await landed(c, pageOf(d.scn(), after.page)?.title ?? after.page);
  return text;
}

async function fill(c: Ctx, fields: unknown, pageArg?: unknown) {
  const { d, t } = c;
  onPage(d, pageArg);
  if (!Array.isArray(fields) || fields.length === 0) throw new StepError("fields must be a list of {id, value}.");
  if (fields.length > 6) throw new StepError("At most 6 fields per call.");
  // Check every field before touching any, so a bad call changes nothing.
  const plan = fields.map((f) => {
    const r = resolveEl(d.scn(), d.state(), (f as { id?: unknown })?.id, ["field"]);
    if ("error" in r) throw new StepError(r.error);
    const v = checkFill(r.el, str((f as { value?: unknown })?.value));
    if ("error" in v) throw new StepError(v.error);
    return { el: r.el, value: v.value };
  });
  const fx = d.fx();
  const done: string[] = [];
  for (const { el, value } of plan) {
    const shown = el.options?.find((o) => o.value === value)?.label ?? value;
    if (fx) {
      await fx.point(el.id); check(t);
      fx.ring([el.id], { label: label(c, "FILL"), note: clip(`${el.label}: ${shown}`, 80) });
      if (c.badge && c.n) fx.badge(el.id, c.n);
      await sleep(DWELL / 2); check(t);
      await fx.press(); check(t);
      if (el.options) await sleep(220);
      else await fx.type(el.id, value);
      check(t);
    }
    commitOrThrow(d, { type: "fill", id: el.id, value });
    done.push(`${el.label}: ${clip(shown, 20)}`);
  }
  return `filled ${done.join(", ")}`;
}

async function highlight(c: Ctx, ids: unknown, note: unknown) {
  const { d, t } = c;
  const list = Array.isArray(ids) ? ids : [ids];
  if (list.length === 0 || list.length > 3) throw new StepError("Highlight 1 to 3 ids.");
  const els = list.map((id) => {
    const r = resolveEl(d.scn(), d.state(), id);
    if ("error" in r) throw new StepError(r.error);
    return r.el;
  });
  const text = clip(str(note), 80);
  const fx = d.fx();
  if (fx) {
    await fx.point(els[0].id); check(t);
    fx.ring(els.map((e) => e.id), { label: label(c, "LOOK"), note: text || els[0].label, dim: true });
    if (c.badge && c.n) fx.badge(els[0].id, c.n);
  }
  return commitOrThrow(d, { type: "note", text: `pointed at ${els.map((e) => `"${clip(e.label, 30)}"`).join(", ")}` });
}

function read(d: Driver, pageArg: unknown) {
  const scn = d.scn();
  let page = d.state().page;
  if (pageArg) {
    const r = resolvePage(scn, pageArg);
    if ("error" in r) throw new StepError(r.error);
    page = r.page.id;
  }
  const body = d.fx()?.readText(page) ?? "";
  return `${pageOf(scn, page)?.title} (${page}${page === d.state().page ? ", on screen" : ", not open"}): ${clip(body, 1500)}`;
}

export async function runStep(c: Ctx, step: Step) {
  switch (step?.action) {
    case "go_to": return goTo(c, step.page);
    case "click": return click(c, step.id);
    case "fill": return fill(c, step.fields);
    case "highlight": return highlight(c, step.ids, step.note);
    default: throw new StepError(`Unknown step action "${str((step as { action?: unknown })?.action)}". Use go_to, click, fill or highlight.`);
  }
}

/** Wrap a job: serial queue, abort handling, receipts. */
function job(d: Driver, fn: (c: Ctx) => Promise<string>, a: Record<string, unknown>, raw = false): Promise<ToolResult> {
  return d.queue.run<ToolResult>(
    async (t) => {
      t.step = 1;
      const c: Ctx = { d, t, n: typeof a.__n === "number" ? a.__n : undefined, badge: a.__badge === true };
      try {
        const text = await fn(c);
        return { status: "done", observed: raw ? text : receipt(d.scn(), d.state(), text) };
      } catch (e) {
        if (e instanceof StepError) return { status: "failed", error: clip(e.message, 700) };
        throw e;
      }
    },
    (t) => ({ status: "failed", error: t.step ? `stopped at step ${t.step}: ${t.reason || "visitor took over"}` : `not run: ${t.reason || "visitor took over"}` }),
  );
}

const S = { type: "string" } as const;
const ID = { type: "string", description: "Element id from els in the page context" } as const;
const FIELDS = {
  type: "array",
  maxItems: 6,
  items: { type: "object", properties: { id: ID, value: S }, required: ["id", "value"] },
} as const;

export function makeTools(d: Driver): PageTool[] {
  return [
    {
      name: "demo_go_to",
      description: "Open a page of the mock website (clicks the matching link when one is on screen). page = an id from pages in the context.",
      parameters: { type: "object", properties: { page: S }, required: ["page"] },
      run: (a) => job(d, (c) => goTo(c, a.page), a),
    },
    {
      name: "demo_highlight",
      description: "Highlight mode: spotlight 1 to 3 elements on the current page with a short caption, so the visitor sees what you mean. Call it before you explain anything, and keep it on what you are talking about.",
      parameters: { type: "object", properties: { ids: { type: "array", items: ID, maxItems: 3 }, note: { type: "string", description: "Caption, at most 80 characters" } }, required: ["ids"] },
      run: (a) => job(d, (c) => highlight(c, a.ids, a.note), a),
    },
    {
      name: "demo_click",
      description: "Click a link, button, tab or card on the current page of the mock website. The target is highlighted for the visitor automatically.",
      parameters: { type: "object", properties: { id: ID, on_page: { type: "string", description: "Page you expect to be on" } }, required: ["id"] },
      run: (a) => job(d, (c) => click(c, a.id, a.on_page), a),
    },
    {
      name: "demo_fill",
      description: "Type into form fields (or pick a select option) on the current page. Up to 6 fields. Does not submit; click the button after.",
      parameters: { type: "object", properties: { fields: FIELDS, on_page: S }, required: ["fields"] },
      run: (a) => job(d, (c) => fill(c, a.fields, a.on_page), a),
    },
    {
      name: "demo_read",
      description: "Read the text of a page of the mock website (default: the current page). Use it to answer with real numbers.",
      parameters: { type: "object", properties: { page: S } },
      run: (a) => job(d, async () => read(d, a.page), a, true),
    },
    {
      name: "demo_do_steps",
      description: "Do 2 to 6 moves in a row: go_to {page}, click {id}, fill {fields}, highlight {ids, note}. Stops at the first failure.",
      parameters: {
        type: "object",
        properties: {
          steps: {
            type: "array",
            maxItems: 6,
            items: {
              type: "object",
              properties: { action: { type: "string", enum: ["go_to", "click", "fill", "highlight"] }, page: S, id: ID, fields: FIELDS, ids: { type: "array", items: S }, note: S },
              required: ["action"],
            },
          },
        },
        required: ["steps"],
      },
      run: (a) =>
        job(d, async (c) => {
          const steps = Array.isArray(a.steps) ? (a.steps as Step[]) : [];
          if (steps.length === 0) throw new StepError("steps must be a non-empty list.");
          if (steps.length > 6) throw new StepError("At most 6 steps per call.");
          const lines: string[] = [];
          for (let i = 0; i < steps.length; i++) {
            check(c.t);
            c.t.step = i + 1;
            try {
              lines.push(await runStep({ ...c, n: i + 1, badge: steps.length >= 3 }, steps[i]));
            } catch (e) {
              if (e instanceof StepError) throw new StepError(`Step ${i + 1} (${str(steps[i]?.action)}) failed: ${e.message}${i ? ` Steps 1-${i} done.` : ""}`);
              throw e;
            }
            if (i < steps.length - 1) await sleep(steps[i].action === "highlight" ? 900 : 200);
            check(c.t);
          }
          return lines.length > 2 ? `${steps.length} steps done, last: ${lines[lines.length - 1]}` : lines.join("; ");
        }, a),
    },
    {
      name: "demo_start",
      description: "Reset this made-up website to its first page with empty forms. Other websites are opened by the visitor from All demos.",
      parameters: { type: "object", properties: {} },
      run: (a) =>
        job(d, async () => {
          await d.reset();
          const scn = d.scn();
          return `reset ${scn.name}, first task: ${taskProgress(scn, d.state()).goal}`;
        }, a),
    },
  ];
}
