/** Front Desk Rush: game rules, kept pure so the page UI and Lisn's tools share one source of truth. */

export const SERVICES = ["dental", "general", "physio", "skin"] as const;
export const DAYS = ["mon", "tue", "wed", "thu", "fri"] as const;
export const TIMES = ["09:00", "11:00", "15:00", "17:00"] as const;

export type Service = (typeof SERVICES)[number];
export type Day = (typeof DAYS)[number];
export type Time = (typeof TIMES)[number];
export type Lang = "en" | "ar";
export type By = "lisn" | "you";

export const SERVICE_LABEL: Record<Service, string> = {
  dental: "Dental check",
  general: "General check-up",
  physio: "Physiotherapy",
  skin: "Skin check",
};
export const DAY_LABEL: Record<Day, string> = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri" };

export type Outcome =
  | { kind: "booking"; name: string; service: string; day: string; time: string; lang: string; by: By }
  | { kind: "callback"; name: string; when: string; by: By }
  | { kind: "lead"; name: string; contact: string; need: string; by: By }
  | { kind: "handoff"; summary: string; by: By };

type Ticket = {
  id: string;
  from: string;
  message: string;
  dir?: "rtl";
  solves: (o: Outcome) => string | null; // null = solved, string = why not
};

const named = (name: string, ...accept: string[]) => accept.some((a) => name.trim().toLowerCase().includes(a));

export const TICKETS: Ticket[] = [
  {
    id: "sara",
    from: "Sara",
    message: "Hi! Can I see a dentist on Tuesday afternoon? Any time after lunch works.",
    solves: (o) =>
      o.kind !== "booking" ? "Sara wants an appointment booked."
      : !named(o.name, "sara") ? "The booking should be in Sara's name."
      : o.service !== "dental" ? "Sara asked for a dentist."
      : o.day !== "tue" ? "Sara asked for Tuesday."
      : !["15:00", "17:00"].includes(o.time) ? "Sara asked for the afternoon."
      : null,
  },
  {
    id: "ahmed",
    from: "أحمد",
    message: "مرحبا، أريد موعد فحص عام يوم الخميس صباحاً من فضلك.",
    dir: "rtl",
    solves: (o) =>
      o.kind !== "booking" ? "Ahmed wants an appointment booked."
      : !named(o.name, "ahmed", "أحمد", "احمد") ? "The booking should be in Ahmed's name."
      : o.service !== "general" ? "Ahmed asked for a general check-up."
      : o.day !== "thu" ? "Ahmed asked for Thursday."
      : !["09:00", "11:00"].includes(o.time) ? "Ahmed asked for the morning."
      : o.lang !== "ar" ? "Ahmed wrote in Arabic, so set the booking language to Arabic."
      : null,
  },
  {
    id: "maya",
    from: "Maya",
    message: "Do you have physio on Wednesday? It's the only day I can do this week.",
    solves: (o) =>
      o.kind === "booking" ? "Wednesday physio is fully booked. Offer Maya a callback instead."
      : o.kind !== "callback" ? "Maya needs a callback, since Wednesday physio is full."
      : !named(o.name, "maya") ? "The callback should be in Maya's name."
      : null,
  },
  {
    id: "omar",
    from: "Omar",
    message: "I run a gym with 40 staff. Can someone send me prices for team health checks? omar@example.com",
    solves: (o) =>
      o.kind !== "lead" ? "Omar is a sales lead. Capture his details for the team."
      : !named(o.name, "omar") ? "The lead should be in Omar's name."
      : !o.contact.toLowerCase().includes("omar@example.com") ? "Use the email Omar gave: omar@example.com."
      : null,
  },
  {
    id: "khalid",
    from: "Khalid",
    message: "This is the third time my results are late. I don't want a bot. Put me through to a person.",
    solves: (o) => (o.kind !== "handoff" ? "Khalid asked for a person. Hand him over." : null),
  },
];

// Slots already taken when the game starts. Wednesday physio is full on purpose.
const START_TAKEN = [
  "dental-tue-17:00", "dental-mon-09:00", "dental-thu-15:00",
  "general-thu-09:00", "general-tue-11:00",
  "physio-wed-09:00", "physio-wed-11:00", "physio-wed-15:00", "physio-wed-17:00",
  "skin-fri-11:00",
];

export type Done = { ticket: string; kind: Outcome["kind"]; by: By; text: string };

export type Game = { idx: number; taken: string[]; done: Done[] };

export const newGame = (): Game => ({ idx: 0, taken: [...START_TAKEN], done: [] });

export const slotKey = (s: string, d: string, t: string) => `${s}-${d}-${t}`;

export function freeSlots(g: Game) {
  const out: Record<string, Record<string, string[]>> = {};
  for (const s of SERVICES) {
    out[s] = {};
    for (const d of DAYS) {
      const free = TIMES.filter((t) => !g.taken.includes(slotKey(s, d, t)));
      out[s][d] = [...free];
    }
  }
  return out;
}

function describe(o: Outcome) {
  switch (o.kind) {
    case "booking":
      return `${SERVICE_LABEL[o.service as Service]} for ${o.name}, ${DAY_LABEL[o.day as Day]} ${o.time}${o.lang === "ar" ? ", in Arabic" : ""}`;
    case "callback":
      return `Callback for ${o.name}${o.when ? `, ${o.when}` : ""}`;
    case "lead":
      return `Lead: ${o.name} (${o.contact}), ${o.need || "enquiry"}`;
    case "handoff":
      return `Handed to a person: ${o.summary || "customer asked for a person"}`;
  }
}

/** Apply an action to the game. Every check lives here, so neither the visitor nor the agent can skip a rule. */
export function apply(g: Game, o: Outcome): { ok: true; next: Game; text: string } | { ok: false; error: string } {
  const ticket = TICKETS[g.idx];
  if (!ticket) return { ok: false, error: "All tickets are cleared. Start a new game to play again." };

  if (o.kind === "booking") {
    if (!SERVICES.includes(o.service as Service)) return { ok: false, error: `Unknown service "${o.service}". Use one of: ${SERVICES.join(", ")}.` };
    if (!DAYS.includes(o.day as Day)) return { ok: false, error: `Unknown day "${o.day}". Use one of: ${DAYS.join(", ")}.` };
    if (!TIMES.includes(o.time as Time)) return { ok: false, error: `Unknown time "${o.time}". Use one of: ${TIMES.join(", ")}.` };
    if (!o.name.trim()) return { ok: false, error: "A booking needs the customer's name." };
    if (g.taken.includes(slotKey(o.service, o.day, o.time))) {
      const free = freeSlots(g)[o.service][o.day];
      return {
        ok: false,
        error: `${SERVICE_LABEL[o.service as Service]} on ${DAY_LABEL[o.day as Day]} at ${o.time} is taken. Free that day: ${free.length ? free.join(", ") : "none"}.`,
      };
    }
  }

  const why = ticket.solves(o);
  if (why) return { ok: false, error: why };

  const text = describe(o);
  const next: Game = {
    idx: g.idx + 1,
    taken: o.kind === "booking" ? [...g.taken, slotKey(o.service, o.day, o.time)] : g.taken,
    done: [...g.done, { ticket: ticket.id, kind: o.kind, by: o.by, text }],
  };
  return { ok: true, next, text };
}

/** Short summary for the agent: everything it needs, nothing it could misremember. */
export function stateLine(g: Game) {
  const t = TICKETS[g.idx];
  if (!t) return `All ${TICKETS.length} tickets cleared.`;
  return `Ticket ${g.idx + 1} of ${TICKETS.length}, from ${t.from}: "${t.message}"`;
}

export function context(g: Game) {
  const t = TICKETS[g.idx];
  const slots = freeSlots(g);
  return {
    game: "Front Desk Rush",
    clinic: "Cedar Clinic (made up for this game)",
    ticket: t ? { number: g.idx + 1, of: TICKETS.length, from: t.from, message: t.message } : null,
    freeSlots: slots,
    cleared: g.done.map((d) => d.text),
  };
}
