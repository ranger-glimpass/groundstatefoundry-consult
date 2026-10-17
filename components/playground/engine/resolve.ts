/** Turn what Lisn asked for (an id, a label, a page name) into a real element, or a helpful error. */
import { pageOf, visible, visibleEls } from "./reduce";
import type { El, PageDef, Scenario, State } from "./types";

function lev(a: string, b: string) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return row[b.length];
}

const tail = (id: string) => id.split(".").slice(-1)[0];
const norm = (x: string) => x.toLowerCase().replace(/[^a-z0-9؀-ۿ]+/g, " ").trim();

/** The closest ids, visible ones first. */
function suggest(scn: Scenario, s: State, ref: string) {
  const r = ref.toLowerCase();
  return scn.els
    .map((e) => ({ e, d: Math.min(lev(r, e.id), lev(tail(r), tail(e.id)) + 2, lev(norm(r), norm(e.label)) + 1) - (visible(e, s) ? 1 : 0) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 2)
    .map((x) => x.e.id);
}

export function onScreenList(scn: Scenario, s: State, kinds?: El["kind"][]) {
  const ids = visibleEls(scn, s).filter((e) => !kinds || kinds.includes(e.kind)).map((e) => e.id);
  const out: string[] = [];
  let len = 0;
  for (const id of ids) {
    if (len + id.length > 420) { out.push("…"); break; }
    out.push(id);
    len += id.length + 2;
  }
  return out.join(", ");
}

export function resolveEl(
  scn: Scenario,
  s: State,
  ref: unknown,
  kinds?: El["kind"][],
): { el: El } | { error: string } {
  const r = typeof ref === "string" ? ref.trim() : "";
  if (!r) return { error: "Missing element id." };
  const exact = scn.els.find((e) => e.id === r);
  if (exact) {
    if (visible(exact, s)) return { el: exact };
    if (exact.page !== "*" && exact.page !== s.page)
      return { error: `"${exact.id}" is on page "${exact.page}", but you are on "${s.page}". Go there first.` };
    return { error: `"${exact.id}" is on this page but hidden right now (another tab, filter or form step). On screen: ${onScreenList(scn, s, kinds)}.` };
  }
  // Label fallback: "Apply now" or "apply now" finds the visible element with that label.
  const want = norm(r);
  const pool = visibleEls(scn, s).filter((e) => !kinds || kinds.includes(e.kind));
  const byLabel = pool.find((e) => norm(e.label) === want) ?? pool.find((e) => want.length > 3 && norm(e.label).includes(want));
  if (byLabel) return { el: byLabel };
  return { error: `Unknown id "${r}". Did you mean ${suggest(scn, s, r).map((x) => `"${x}"`).join(" or ")}? On screen: ${onScreenList(scn, s, kinds)}.` };
}

export function resolvePage(scn: Scenario, ref: unknown): { page: PageDef } | { error: string } {
  const r = typeof ref === "string" ? ref.trim().toLowerCase() : "";
  const p = pageOf(scn, r)
    ?? scn.pages.find((x) => x.path === r || x.path === `/${r}` || norm(x.title) === norm(r))
    ?? scn.pages.find((x) => r.length > 2 && norm(x.title).includes(norm(r)));
  if (p) return { page: p };
  return { error: `No page "${r}". Pages: ${scn.pages.map((x) => x.id).join(", ")}.` };
}

/** Catch scenario mistakes early: bad ids, duplicates, broken links, a solution that points at nothing. */
export function auditScenario(scn: Scenario): string[] {
  const out: string[] = [];
  const ids = new Set<string>();
  const pages = new Set(scn.pages.map((p) => p.id));
  for (const e of scn.els) {
    if (!/^[a-z0-9_.]+$/.test(e.id)) out.push(`bad id ${e.id}`);
    if (!e.id.startsWith(`${scn.id}.`)) out.push(`id ${e.id} should start with ${scn.id}.`);
    if (ids.has(e.id)) out.push(`duplicate id ${e.id}`);
    ids.add(e.id);
    if (e.page !== "*" && !pages.has(e.page)) out.push(`${e.id} on unknown page ${e.page}`);
    if (e.to && !pages.has(e.to)) out.push(`${e.id} links to unknown page ${e.to}`);
  }
  for (const st of scn.solution) {
    const refs = st.action === "click" ? [st.id] : st.action === "fill" ? st.fields.map((f) => f.id) : st.action === "highlight" ? st.ids : [];
    for (const r of refs) if (!ids.has(r)) out.push(`solution uses unknown id ${r}`);
    if (st.action === "go_to" && !pages.has(st.page)) out.push(`solution goes to unknown page ${st.page}`);
  }
  return out;
}
