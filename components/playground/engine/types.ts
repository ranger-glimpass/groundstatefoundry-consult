/** Playground engine types. A scenario is data (pages, elements, tasks, an opening line) plus page components. */
import type { ComponentType, CSSProperties } from "react";

export type By = "lisn" | "you";
export type Kind = "link" | "button" | "field" | "text" | "card";
export type Flags = Record<string, string>;
export type Option = { value: string; label: string };

/** One thing on the mock site that Lisn (and the visitor) can point at, click or fill. */
export type El = {
  id: string; // `noor.cards.platinum_fee`: scenario.page.name, matches ^[a-z0-9_.]+$
  label: string; // what a person would call it ("Apply now"); used for label fallback
  kind: Kind;
  page: string; // page id, or "*" for chrome shown on every page (nav, footer)
  to?: string; // clicking navigates to this page id
  set?: Flags; // clicking sets these flags
  input?: "text" | "email" | "tel" | "number"; // fields only
  options?: Option[]; // makes a field a select; fill accepts value or label
  when?: (s: State) => boolean; // shown only when true (tabs, filters, form steps)
};

export type PageDef = { id: string; path: string; title: string };

export type State = {
  page: string;
  stack: string[]; // in-memory browser history
  at: number; // index into stack
  values: Record<string, string>; // field values by element id
  flags: Flags; // scenario state (tabs, filters, form step)
  outcome: string | null; // final result chip, e.g. "APPLIED"
  seq: number; // bumps on every committed action
  last: string; // plain-words line for the last action
};

/** What a click does beyond `to` / `set`. Return { error } to refuse it (form validation). */
export type Effect = {
  error?: string;
  go?: string;
  set?: Flags;
  values?: Record<string, string>;
  outcome?: string;
  say?: string; // overrides the default `clicked "Label"` line
};

export type Action =
  | { type: "go"; page: string }
  | { type: "back" }
  | { type: "forward" }
  | { type: "click"; id: string }
  | { type: "fill"; id: string; value: string }
  | { type: "note"; text: string };

export type Result = { ok: true; state: State; text: string } | { ok: false; error: string };

/** One move inside demo_do_steps. */
export type Step =
  | { action: "go_to"; page: string }
  | { action: "click"; id: string }
  | { action: "fill"; fields: { id: string; value: string }[] }
  | { action: "highlight"; ids: string[]; note?: string };

export type Task = { goal: string; done: (s: State) => boolean };

/** Helpers a page component uses to wire elements to the engine. */
export type Site = {
  s: State;
  v: (id: string) => string; // field value (shows Lisn's typing as it happens)
  flag: (key: string) => string;
  hit: (id: string) => { "data-el": string; onClick: () => void; type: "button" }; // buttons, links, clickable cards
  field: (id: string) => {
    "data-el": string;
    value: string;
    onChange: (e: { target: { value: string } }) => void;
  };
  mark: (id: string) => { "data-el": string }; // text and cards Lisn can highlight
  el: (id: string) => El | undefined;
};

export type Scenario = {
  id: string; // short, lowercase: "noor"
  name: string;
  domain: string; // "noor-bank.example"
  task: string; // one line for the picker card
  label: string; // mono label, "6 PAGES · APPLY"
  opening: string; // Lisn's first line on the demo page: introduce itself, offer the first task as a question
  suggestions: [string, string, string]; // short things a visitor might ask, shown as chips in the top bar
  brand: { swatch: string; style: CSSProperties; className?: string }; // style holds the --mk-* vars + fonts
  pages: PageDef[];
  els: El[];
  tasks: Task[];
  initial?: { page?: string; values?: Record<string, string>; flags?: Flags };
  onClick?: (s: State, id: string) => Effect | null;
  Page: ComponentType<{ site: Site; page: string }>;
};

/** A picker card for a scenario that is not built yet. */
export type Upcoming = { id: string; name: string; task: string; label: string; swatch: string; soon: true };

export type ToolResult = { status: "done" | "failed" | "needs_user"; observed?: string; error?: string };
export type PageTool = {
  name: string;
  description: string;
  parameters: object;
  run: (args: Record<string, unknown>) => Promise<ToolResult>;
};

declare global {
  interface Window {
    MarkaibleTools?: PageTool[];
    Markaible?: { setContext?: (ctx: object) => void; open?: (opts?: { tab?: "chat" | "call" }) => unknown };
    MarkaibleContext?: object;
  }
}
