"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  DAYS, DAY_LABEL, SERVICES, SERVICE_LABEL, TICKETS, TIMES,
  apply, context, freeSlots, newGame, stateLine,
  type By, type Game, type Lang, type Outcome, type Service,
} from "./frontDesk";

type Panel = "booking" | "callback" | "lead" | "handoff";

type ToolResult = { status: "done" | "failed"; observed?: string; error?: string };
type PageTool = { name: string; description: string; parameters: object; run: (args: Record<string, unknown>) => Promise<ToolResult> };

declare global {
  interface Window {
    MarkaibleTools?: PageTool[];
    Markaible?: { setContext?: (ctx: object) => void };
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const str = (v: unknown) => (typeof v === "string" ? v : v == null ? "" : String(v));

export default function FrontDeskRush() {
  const [game, setGame] = useState<Game>(newGame);
  const gameRef = useRef(game);
  const [glow, setGlow] = useState<Panel | null>(null);
  const [note, setNote] = useState<{ ok: boolean; text: string; by: By } | null>(null);

  // The booking form, shared by the visitor's hands and Lisn's.
  const [bName, setBName] = useState("");
  const [bService, setBService] = useState<Service>("dental");
  const [bLang, setBLang] = useState<Lang>("en");
  const [cName, setCName] = useState("");
  const [cWhen, setCWhen] = useState("");
  const [lName, setLName] = useState("");
  const [lContact, setLContact] = useState("");
  const [lNeed, setLNeed] = useState("");

  const ticket = TICKETS[game.idx];
  const slots = freeSlots(game);

  function commit(o: Outcome): ToolResult {
    const r = apply(gameRef.current, o);
    if (!r.ok) {
      setNote({ ok: false, text: r.error, by: o.by });
      return { status: "failed", error: r.error };
    }
    gameRef.current = r.next;
    setGame(r.next);
    setNote({ ok: true, text: r.text, by: o.by });
    setBName(""); setCName(""); setCWhen(""); setLName(""); setLContact(""); setLNeed("");
    return { status: "done", observed: `Done: ${r.text}. Next: ${stateLine(r.next)}` };
  }

  function reset() {
    const g = newGame();
    gameRef.current = g;
    setGame(g);
    setNote(null);
  }

  // Keep Lisn's view of the page current.
  useEffect(() => {
    window.Markaible?.setContext?.(context(game));
  }, [game]);

  // Lisn's hands on this page. Each tool shows what it is doing, then goes through the same rules as a click.
  const act = useRef<(panel: Panel, fill: () => void, o: Outcome) => Promise<ToolResult>>(async () => ({ status: "failed" }));
  act.current = async (panel, fill, o) => {
    setGlow(panel);
    document.getElementById(`desk-${panel}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    fill();
    await sleep(900);
    const r = commit(o);
    setTimeout(() => setGlow(null), 600);
    return r;
  };

  useEffect(() => {
    const tools: PageTool[] = [
      {
        name: "book_appointment",
        description: "Book the current ticket's customer into a free slot at Cedar Clinic. Use only slots listed as free in the page context.",
        parameters: {
          type: "object",
          properties: {
            name: { type: "string", description: "Customer name" },
            service: { type: "string", enum: [...SERVICES] },
            day: { type: "string", enum: [...DAYS] },
            time: { type: "string", enum: [...TIMES] },
            language: { type: "string", enum: ["en", "ar"], description: "Language the customer wrote in" },
          },
          required: ["name", "service", "day", "time", "language"],
        },
        run: async (a) => {
          const o: Outcome = { kind: "booking", name: str(a.name), service: str(a.service), day: str(a.day), time: str(a.time), lang: str(a.language) || "en", by: "lisn" };
          return act.current("booking", () => {
            setBName(o.name);
            if (SERVICES.includes(o.service as Service)) setBService(o.service as Service);
            setBLang(o.lang === "ar" ? "ar" : "en");
          }, o);
        },
      },
      {
        name: "book_callback",
        description: "Book a callback for the current customer when no slot fits what they asked for.",
        parameters: {
          type: "object",
          properties: { name: { type: "string" }, when: { type: "string", description: "When they would like the call, in their words" } },
          required: ["name"],
        },
        run: async (a) => {
          const o: Outcome = { kind: "callback", name: str(a.name), when: str(a.when), by: "lisn" };
          return act.current("callback", () => { setCName(o.name); setCWhen(o.when); }, o);
        },
      },
      {
        name: "capture_lead",
        description: "Save a sales enquiry for the clinic's team, with the customer's name, contact and what they need.",
        parameters: {
          type: "object",
          properties: { name: { type: "string" }, contact: { type: "string" }, need: { type: "string" } },
          required: ["name", "contact", "need"],
        },
        run: async (a) => {
          const o: Outcome = { kind: "lead", name: str(a.name), contact: str(a.contact), need: str(a.need), by: "lisn" };
          return act.current("lead", () => { setLName(o.name); setLContact(o.contact); setLNeed(o.need); }, o);
        },
      },
      {
        name: "hand_off",
        description: "Hand the current customer to a person at the clinic, with a one-line summary for them.",
        parameters: { type: "object", properties: { summary: { type: "string" } }, required: ["summary"] },
        run: async (a) => act.current("handoff", () => {}, { kind: "handoff", summary: str(a.summary), by: "lisn" }),
      },
      {
        name: "new_game",
        description: "Start Front Desk Rush again from the first ticket.",
        parameters: { type: "object", properties: {} },
        run: async () => {
          reset();
          return { status: "done", observed: `New game. ${stateLine(gameRef.current)}` };
        },
      },
    ];
    window.MarkaibleTools = (window.MarkaibleTools || []).filter((t) => !tools.some((x) => x.name === t.name));
    window.MarkaibleTools.push(...tools);
    return () => {
      window.MarkaibleTools = (window.MarkaibleTools || []).filter((t) => !tools.includes(t));
    };
  }, []);

  const byLisn = game.done.filter((d) => d.by === "lisn").length;
  const panelClass = (p: Panel) =>
    `card p-5 transition-shadow duration-300 ${glow === p ? "shadow-[0_0_0_2px_var(--color-neon)]" : ""}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
      {/* The queue */}
      <section aria-label="Ticket queue" className="lg:sticky lg:top-24 lg:self-start">
        <div className="flex items-center justify-between">
          <p className="mono-label">front desk · ticket {Math.min(game.idx + 1, TICKETS.length)} of {TICKETS.length}</p>
          <button onClick={reset} className="text-xs text-[var(--color-dim)] hover:text-[var(--color-fg)]">Restart</button>
        </div>

        <ol className="mt-4 flex gap-1.5" aria-hidden>
          {TICKETS.map((t, i) => (
            <li key={t.id} className={`h-1.5 flex-1 rounded-full ${i < game.idx ? "bg-[var(--color-neon)]" : i === game.idx ? "bg-[var(--color-muted)]" : "bg-[var(--color-border-bright)]"}`} />
          ))}
        </ol>

        {ticket ? (
          <div className="card-neon mt-5 p-6">
            <p className="text-sm font-semibold text-[var(--color-fg)]">{ticket.from}</p>
            <p dir={ticket.dir} className="mt-2 text-lg leading-relaxed text-[var(--color-fg)]">{ticket.message}</p>
            <p className="mt-5 text-sm leading-relaxed text-[var(--color-muted)]">
              Ask Lisn to handle it (&quot;sort this one out&quot;), or do it yourself on the clinic site.
            </p>
          </div>
        ) : (
          <div className="card-neon mt-5 p-6">
            <p className="text-2xl font-semibold text-[var(--color-fg)]">Desk cleared.</p>
            <p className="mt-2 text-[var(--color-muted)]">
              {TICKETS.length} customers looked after. Lisn handled {byLisn} of them, you handled {game.done.length - byLisn}.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contact" className="btn btn-primary">Put Lisn on your site →</Link>
              <button onClick={reset} className="btn btn-ghost">Play again</button>
            </div>
          </div>
        )}

        {note && (
          <p role="status" className={`mt-4 text-sm leading-relaxed ${note.ok ? "text-[var(--color-fg)]" : "text-[var(--color-magenta)]"}`}>
            <span className="mono-label mr-2">{note.by === "lisn" ? "lisn" : "you"}</span>
            {note.ok ? `Done: ${note.text}.` : note.text}
          </p>
        )}

        {game.done.length > 0 && (
          <ul className="mt-5 space-y-2 border-t border-[var(--color-border)] pt-4 text-sm text-[var(--color-muted)]">
            {game.done.map((d) => (
              <li key={d.ticket} className="flex gap-3">
                <span className="w-9 shrink-0 font-mono text-xs leading-5 text-[var(--color-dim)]">{d.by}</span>
                <span>{d.text}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* The made-up clinic website */}
      <section aria-label="Cedar Clinic website" className="overflow-hidden rounded-xl border border-[var(--color-border-bright)]">
        <div className="flex items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-panel-2)] px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-border-bright)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-border-bright)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-border-bright)]" />
          <span className="ml-3 truncate font-mono text-xs text-[var(--color-dim)]">cedar-clinic.example</span>
        </div>

        <div className="space-y-4 p-4 sm:p-6">
          <div>
            <p className="text-xl font-semibold text-[var(--color-fg)]">Cedar Clinic</p>
            <p className="text-sm text-[var(--color-muted)]">Dental, general, physio and skin. Open Monday to Friday, 9 to 6.</p>
          </div>

          {/* Booking */}
          <form
            id="desk-booking"
            className={panelClass("booking")}
            onSubmit={(e) => e.preventDefault()}
          >
            <p className="mono-label">book an appointment</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
              <input value={bName} onChange={(e) => setBName(e.target.value)} className="field" placeholder="Customer name" aria-label="Customer name" />
              <div className="flex gap-1.5" role="group" aria-label="Language">
                {(["en", "ar"] as const).map((l) => (
                  <button type="button" key={l} onClick={() => setBLang(l)} aria-pressed={bLang === l} className={bLang === l ? "tag tag-neon" : "tag"}>
                    {l === "en" ? "English" : "العربية"}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Service">
              {SERVICES.map((s) => (
                <button type="button" key={s} onClick={() => setBService(s)} aria-pressed={bService === s} className={bService === s ? "tag tag-neon" : "tag"}>
                  {SERVICE_LABEL[s]}
                </button>
              ))}
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[320px] text-center text-xs">
                <thead>
                  <tr className="text-[var(--color-dim)]">
                    <th className="py-1 text-left font-normal">Tap a free slot to book</th>
                    {TIMES.map((t) => <th key={t} className="py-1 font-mono font-normal">{t}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {DAYS.map((d) => (
                    <tr key={d}>
                      <td className="py-1 text-left text-[var(--color-muted)]">{DAY_LABEL[d]}</td>
                      {TIMES.map((t) => {
                        const free = slots[bService][d].includes(t);
                        return (
                          <td key={t} className="p-0.5">
                            <button
                              type="button"
                              disabled={!free}
                              onClick={() => commit({ kind: "booking", name: bName, service: bService, day: d, time: t, lang: bLang, by: "you" })}
                              aria-label={`${SERVICE_LABEL[bService]}, ${DAY_LABEL[d]} ${t}, ${free ? "free" : "taken"}`}
                              className={`h-9 w-full rounded-md border font-mono ${free ? "border-[var(--color-border-bright)] text-[var(--color-fg)] hover:border-[var(--color-neon)]" : "cursor-not-allowed border-transparent text-[var(--color-dim)] line-through"}`}
                            >
                              {free ? "free" : "taken"}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </form>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Callback */}
            <form
              id="desk-callback"
              className={panelClass("callback")}
              onSubmit={(e) => { e.preventDefault(); commit({ kind: "callback", name: cName, when: cWhen, by: "you" }); }}
            >
              <p className="mono-label">request a callback</p>
              <input value={cName} onChange={(e) => setCName(e.target.value)} className="field mt-3" placeholder="Name" aria-label="Callback name" />
              <input value={cWhen} onChange={(e) => setCWhen(e.target.value)} className="field mt-2" placeholder="Best time to call" aria-label="Best time to call" />
              <button className="btn btn-ghost mt-3 w-full">Book callback</button>
            </form>

            {/* Lead */}
            <form
              id="desk-lead"
              className={panelClass("lead")}
              onSubmit={(e) => { e.preventDefault(); commit({ kind: "lead", name: lName, contact: lContact, need: lNeed, by: "you" }); }}
            >
              <p className="mono-label">business enquiries</p>
              <input value={lName} onChange={(e) => setLName(e.target.value)} className="field mt-3" placeholder="Name" aria-label="Enquiry name" />
              <input value={lContact} onChange={(e) => setLContact(e.target.value)} className="field mt-2" placeholder="Email or phone" aria-label="Enquiry contact" />
              <input value={lNeed} onChange={(e) => setLNeed(e.target.value)} className="field mt-2" placeholder="What they need" aria-label="What they need" />
              <button className="btn btn-ghost mt-3 w-full">Send to sales</button>
            </form>
          </div>

          {/* Handoff */}
          <div id="desk-handoff" className={`${panelClass("handoff")} flex flex-wrap items-center justify-between gap-3`}>
            <div>
              <p className="mono-label">talk to a person</p>
              <p className="mt-1 text-sm text-[var(--color-muted)]">Front desk staff, 9 to 6.</p>
            </div>
            <button
              type="button"
              onClick={() => commit({ kind: "handoff", summary: "customer asked for a person", by: "you" })}
              className="btn btn-ghost"
            >
              Connect to staff
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
