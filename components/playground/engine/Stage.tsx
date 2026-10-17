"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import MockBrowser from "./MockBrowser";
import Spotlight, { type Badge, type Spot } from "./Spotlight";
import GhostCursor, { glide, press, type Pos } from "./GhostCursor";
import ActionTrail, { type TrailItem } from "./ActionTrail";
import { pageOf, visibleEls } from "./reduce";
import type { Fx } from "./tools";
import type { Action, Scenario, Site, State } from "./types";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const frame = () => new Promise((r) => requestAnimationFrame(() => r(null)));
const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Text of a node with spaces between blocks; works on hidden nodes too (innerText does not). */
function textOf(node: Element | null) {
  if (!node) return "";
  if (node instanceof HTMLElement && node.offsetParent !== null) return node.innerText.replace(/\s+/g, " ").trim();
  const parts: string[] = [];
  const w = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
  while (w.nextNode()) parts.push(w.currentNode.textContent ?? "");
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

/** The mock site on stage: browser chrome, the brand's pages, and Lisn's cursor and spotlight on top. */
export default function Stage({
  scn, state, trail, fxRef, onVisitor, onReload,
}: {
  scn: Scenario;
  state: State;
  trail: TrailItem[];
  fxRef: MutableRefObject<Fx | null>;
  onVisitor: (a: Action) => void;
  onReload: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const url = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const current = useRef<HTMLDivElement>(null);
  const hiddenPages = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const pos = useRef<Pos>({ x: 40, y: 80 });
  const hideCursor = useRef<ReturnType<typeof setTimeout>>(undefined);
  const navAt = useRef(0);

  const [typing, setTyping] = useState<{ id: string; text: string } | null>(null);
  const [spot, setSpot] = useState<Spot | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [reload, setReload] = useState(0);
  const [navKey, setNavKey] = useState(0);

  const page = pageOf(scn, state.page);

  // Every navigation (link, back, forward, reload): progress bar, fade in, back to the top.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    navAt.current = Date.now();
    setNavKey((k) => k + 1);
    scroller.current?.scrollTo({ top: 0 });
  }, [state.page, state.at, reload, scn.id]);

  // Lisn's typing is shown until the real value lands in state.
  useEffect(() => setTyping(null), [state.seq]);

  // Drop badges once they expire.
  useEffect(() => {
    if (!badges.length) return;
    const next = Math.min(...badges.map((b) => b.until)) - Date.now();
    const t = setTimeout(() => setBadges((bs) => bs.filter((b) => b.until > Date.now())), Math.max(50, next));
    return () => clearTimeout(t);
  }, [badges]);

  const find = useCallback((id: string) => current.current?.querySelector<HTMLElement>(`[data-el="${id}"]`) ?? null, []);

  const site: Site = useMemo(() => ({
    s: state,
    v: (id) => (typing?.id === id ? typing.text : state.values[id] ?? ""),
    flag: (k) => state.flags[k] ?? "",
    hit: (id) => ({ "data-el": id, type: "button", onClick: () => onVisitor({ type: "click", id }) }),
    field: (id) => ({
      "data-el": id,
      value: typing?.id === id ? typing.text : state.values[id] ?? "",
      onChange: (e) => onVisitor({ type: "fill", id, value: e.target.value }),
    }),
    mark: (id) => ({ "data-el": id }),
    el: (id) => scn.els.find((e) => e.id === id),
  }), [state, typing, onVisitor, scn]);

  // Dev check: what the scenario says is on screen should match what the page renders.
  useEffect(() => {
    if (process.env.NODE_ENV === "production" || !current.current) return;
    const want = new Set(visibleEls(scn, state).map((e) => e.id));
    const have = new Set([...current.current.querySelectorAll("[data-el]")].map((n) => n.getAttribute("data-el") ?? ""));
    const missing = [...want].filter((x) => !have.has(x));
    const extra = [...have].filter((x) => !want.has(x));
    if (missing.length || extra.length) console.warn(`[playground] ${scn.id}/${state.page}: not rendered`, missing, "rendered but hidden or undefined", extra);
  }, [scn, state]);

  // Choreography for Lisn's tools. DOM only; state changes go through the reducer.
  useEffect(() => {
    const rel = (el: HTMLElement, aim: "center" | "start") => {
      const r = el.getBoundingClientRect();
      const h = (cursor.current?.offsetParent ?? root.current!).getBoundingClientRect();
      const x = aim === "center" ? r.left + Math.min(r.width / 2, 120) : r.left + Math.min(28, r.width / 2);
      return { x: x - h.left, y: r.top + Math.min(r.height / 2, 22) - h.top };
    };
    const showCursor = () => {
      clearTimeout(hideCursor.current);
      hideCursor.current = setTimeout(() => { if (cursor.current) cursor.current.style.opacity = "0"; }, 3500);
    };
    const settle = async () => {
      await frame(); await frame();
      const wait = navAt.current + 230 - Date.now();
      if (wait > 0) await sleep(wait);
    };
    const reveal = async (el: HTMLElement) => {
      const sc = scroller.current;
      if (!sc) return;
      const sr = sc.getBoundingClientRect(), r = el.getBoundingClientRect();
      if (r.top >= sr.top + 40 && r.bottom <= sr.bottom - 40) return;
      const top = Math.max(0, sc.scrollTop + (r.top - sr.top) - sr.height / 2 + Math.min(r.height, sr.height * 0.6) / 2);
      sc.scrollTo({ top, behavior: reducedMotion() ? "auto" : "smooth" });
      // Wait until the scroll settles (or 700ms).
      let last = -1, still = 0;
      const t0 = Date.now();
      while (Date.now() - t0 < 700 && still < 3) {
        await frame();
        still = sc.scrollTop === last ? still + 1 : 0;
        last = sc.scrollTop;
      }
    };
    const moveTo = async (to: Pos) => {
      if (!cursor.current) return;
      showCursor();
      await glide(cursor.current, pos.current, to, reducedMotion());
      pos.current = to;
    };

    // Bring the mock browser into view before Lisn acts, so the visitor sees it happen.
    const frameInView = async () => {
      const r = root.current?.getBoundingClientRect();
      if (!r) return;
      const seen = Math.min(r.bottom, innerHeight) - Math.max(r.top, 64);
      if (seen >= Math.min(r.height, innerHeight - 64) * 0.85) return;
      window.scrollTo({ top: window.scrollY + r.top - 72, behavior: reducedMotion() ? "auto" : "smooth" });
      await sleep(reducedMotion() ? 0 : 450);
    };

    const fx: Fx = {
      settle,
      point: async (id) => {
        await settle();
        await frameInView();
        const el = find(id);
        if (!el) return;
        await reveal(el);
        const kind = scn.els.find((e) => e.id === id)?.kind;
        await moveTo(rel(el, kind === "field" || kind === "card" || kind === "text" ? "start" : "center"));
      },
      pointUrl: async () => {
        if (!url.current) return;
        await frameInView();
        await moveTo(rel(url.current, "start"));
      },
      press: async () => {
        if (!cursor.current) return;
        showCursor();
        await press(cursor.current, reducedMotion());
      },
      type: async (id, text) => {
        if (reducedMotion() || !text) return;
        const per = Math.min(25, 600 / text.length);
        for (let i = 1; i <= text.length; i++) {
          setTyping({ id, text: text.slice(0, i) });
          await sleep(per);
        }
      },
      ring: (ids, o) => setSpot((s) => ({ key: (s?.key ?? 0) + 1, ids, label: o.label, note: o.note, dim: o.dim })),
      badge: (id, n) => setBadges((bs) => [...bs.filter((b) => b.n !== n && b.id !== id), { id, n, until: Date.now() + 6000 }].slice(-6)),
      readText: (pid) => {
        if (pid === state.page) {
          // Skip the site chrome (nav, footer) so the agent reads the page itself.
          const main = current.current?.querySelector("main") ?? current.current;
          return textOf(main);
        }
        const box = hiddenPages.current?.querySelector(`[data-read="${pid}"]`);
        return textOf(box?.querySelector("main") ?? box ?? null);
      },
    };
    fxRef.current = fx;
  }, [find, fxRef, scn, state.page]);

  const Page = scn.Page;

  return (
    <MockBrowser
      rootRef={root}
      urlRef={url}
      domain={scn.domain}
      path={page?.path ?? "/"}
      navKey={navKey}
      canBack={state.at > 0}
      canForward={state.at < state.stack.length - 1}
      onBack={() => onVisitor({ type: "back" })}
      onForward={() => onVisitor({ type: "forward" })}
      onReload={() => { setReload((r) => r + 1); onReload(); }}
      trail={<ActionTrail items={trail} />}
    >
      <div ref={viewport} className="absolute inset-0">
        <div ref={scroller} className="absolute inset-0 overflow-y-auto overscroll-contain">
          <div
            data-brand={scn.id}
            className={`mk-site @container min-h-full ${scn.brand.className ?? ""}`}
            style={scn.brand.style}
          >
            <div key={`${scn.id}-${state.at}-${state.page}-${reload}`} ref={current} className="mk-enter min-h-full">
              <Page site={site} page={state.page} />
            </div>
          </div>
        </div>
        <Spotlight host={viewport} find={find} spot={spot} badges={badges} reduced={reducedMotion()} />
      </div>
      {/* Other pages, rendered hidden so demo_read can read a page that is not open. */}
      <div ref={hiddenPages} hidden>
        {scn.pages.filter((p) => p.id !== state.page).map((p) => (
          <div key={p.id} data-read={p.id}>
            <Page site={site} page={p.id} />
          </div>
        ))}
      </div>
      <GhostCursor ref={cursor} />
    </MockBrowser>
  );
}
