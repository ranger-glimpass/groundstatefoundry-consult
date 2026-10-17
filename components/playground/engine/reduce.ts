/** The one pure reducer. Visitor clicks and Lisn's tools both go through reduce(), so they can never disagree. */
import type { Action, El, Result, Scenario, State } from "./types";

export function initState(scn: Scenario): State {
  const page = scn.initial?.page ?? scn.pages[0].id;
  return {
    page,
    stack: [page],
    at: 0,
    values: { ...scn.initial?.values },
    flags: { ...scn.initial?.flags },
    outcome: null,
    seq: 0,
    last: "",
  };
}

export const pageOf = (scn: Scenario, id: string) => scn.pages.find((p) => p.id === id);

/** Is this element on screen right now? */
export function visible(el: El, s: State) {
  return (el.page === "*" || el.page === s.page) && (!el.when || el.when(s));
}

export const visibleEls = (scn: Scenario, s: State) => scn.els.filter((e) => visible(e, s));

/** Normalise a fill value. Selects accept the option value or its label. */
export function checkFill(el: El, raw: string): { value: string } | { error: string } {
  if (el.kind !== "field") return { error: `"${el.label}" is not a field; use demo_click.` };
  const value = String(raw ?? ""); // not trimmed: the visitor may be mid-word
  if (el.options) {
    const low = value.trim().toLowerCase();
    const hit = el.options.find((o) => o.value === low || o.label.toLowerCase() === low)
      ?? el.options.find((o) => o.label.toLowerCase().includes(low) && low.length > 2);
    if (!hit) return { error: `"${el.label}" takes one of: ${el.options.map((o) => o.value).join(", ")}.` };
    return { value: hit.value };
  }
  if (value.length > 120) return { error: `Value for "${el.label}" is too long.` };
  return { value };
}

export function taskProgress(scn: Scenario, s: State) {
  const done = scn.tasks.map((t) => t.done(s));
  const n = done.filter(Boolean).length;
  const next = scn.tasks.find((_, i) => !done[i]);
  return { done, n, of: scn.tasks.length, goal: next?.goal ?? "all tasks done" };
}

function go(s: State, page: string): State {
  const stack = [...s.stack.slice(0, s.at + 1), page];
  return { ...s, page, stack, at: stack.length - 1 };
}

const bump = (s: State, text: string): Result => ({ ok: true, state: { ...s, seq: s.seq + 1, last: text }, text });

export function reduce(scn: Scenario, s: State, a: Action): Result {
  switch (a.type) {
    case "go": {
      const p = pageOf(scn, a.page);
      if (!p) return { ok: false, error: `No page "${a.page}". Pages: ${scn.pages.map((x) => x.id).join(", ")}.` };
      if (p.id === s.page) return bump(s, `already on ${p.title}`);
      return bump(go(s, p.id), `opened ${p.title}`);
    }
    case "back":
    case "forward": {
      const at = s.at + (a.type === "back" ? -1 : 1);
      if (at < 0 || at >= s.stack.length) return { ok: false, error: `Nothing to go ${a.type} to.` };
      const page = s.stack[at];
      return bump({ ...s, at, page }, `went ${a.type} to ${pageOf(scn, page)?.title ?? page}`);
    }
    case "fill": {
      const el = scn.els.find((e) => e.id === a.id);
      if (!el) return { ok: false, error: `No element "${a.id}".` };
      if (!visible(el, s)) return { ok: false, error: `"${el.label}" is not on screen.` };
      const c = checkFill(el, a.value);
      if ("error" in c) return { ok: false, error: c.error };
      const shown = el.options?.find((o) => o.value === c.value)?.label ?? c.value;
      return bump({ ...s, values: { ...s.values, [el.id]: c.value } }, `filled ${el.label}: ${shown}`);
    }
    case "click": {
      const el = scn.els.find((e) => e.id === a.id);
      if (!el) return { ok: false, error: `No element "${a.id}".` };
      if (!visible(el, s)) return { ok: false, error: `"${el.label}" is not on screen.` };
      if (el.kind === "text" || el.kind === "field") {
        if (!el.to && !el.set) return { ok: false, error: `"${el.label}" is ${el.kind === "field" ? "a field; use demo_fill" : "text; use demo_highlight"}.` };
      }
      const fx = scn.onClick?.(s, el.id) ?? {};
      if (fx.error) return { ok: false, error: fx.error };
      let next: State = { ...s, flags: { ...s.flags, ...el.set, ...fx.set }, values: { ...s.values, ...fx.values } };
      if (fx.outcome) next.outcome = fx.outcome;
      const to = fx.go ?? el.to;
      if (to && to !== next.page) {
        if (!pageOf(scn, to)) return { ok: false, error: `Broken link to "${to}".` };
        next = go(next, to);
      }
      return bump(next, fx.say ?? `clicked "${el.label}"`);
    }
    case "note":
      return bump(s, a.text);
  }
}
