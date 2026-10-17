/** Marsa Homes: a made-up Dubai property site. Visitor tasks: search, read a floor plan, check affordability, find an agent, book a viewing. */
import type { CSSProperties, ReactNode } from "react";
import { DM_Serif_Display, Readex_Pro } from "next/font/google";
import type { El, Effect, Scenario, Site, State } from "../engine/types";
import { MadeUp, MkButton, MkField, MkLink, MkSelect, MkTab } from "../engine/ui/site";

const display = DM_Serif_Display({ subsets: ["latin"], variable: "--mh-display", weight: "400" });
const sans = Readex_Pro({ subsets: ["arabic", "latin"], variable: "--mh-sans", weight: ["300", "400", "500", "600"] });

/* ---------- data ---------- */

type Facing = "west" | "south" | "east" | "north";
type AgentId = "layla" | "daniel" | "priya" | "omar";
type ListingId = "bayline" | "mizan" | "coral" | "sable" | "lumen" | "fernwood";
type Listing = {
  name: string; area: "dubai_marina" | "jlt"; beds: number; baths: number; sqft: number; price: number; floor: string;
  maids: boolean; facing: Facing; view: string; service: number; agent: AgentId; tone: string; line: string;
};

const AREAS = [
  { value: "any", label: "Any area" },
  { value: "dubai_marina", label: "Dubai Marina" },
  { value: "jlt", label: "Jumeirah Lake Towers" },
];
const BEDS = [
  { value: "any", label: "Any" },
  { value: "1", label: "1 bed" },
  { value: "2", label: "2 beds" },
  { value: "3", label: "3 beds" },
];

const LISTINGS: Record<ListingId, Listing> = {
  bayline: {
    name: "Bayline Residences", area: "dubai_marina", beds: 2, baths: 3, sqft: 1214, price: 1950000, floor: "23rd floor",
    maids: true, facing: "west", view: "Full marina view", service: 19, agent: "layla", tone: "#c9d6dd",
    line: "Corner unit over the water, with a maid's room and a long west balcony.",
  },
  mizan: {
    name: "Mizan Tower", area: "dubai_marina", beds: 2, baths: 2, sqft: 1080, price: 1720000, floor: "11th floor",
    maids: false, facing: "east", view: "Partial marina view", service: 17, agent: "daniel", tone: "#e3d5c3",
    line: "Bright, compact and close to the tram. Morning sun on the balcony.",
  },
  coral: {
    name: "Coral Quay", area: "dubai_marina", beds: 2, baths: 3, sqft: 1320, price: 1980000, floor: "8th floor",
    maids: true, facing: "south", view: "Pool and community view", service: 21, agent: "layla", tone: "#d9cbbd",
    line: "The most space for the money, on a low floor above the pool deck.",
  },
  sable: {
    name: "Sable Point", area: "dubai_marina", beds: 2, baths: 3, sqft: 1260, price: 2350000, floor: "41st floor",
    maids: true, facing: "west", view: "Sea and Ain Dubai view", service: 24, agent: "daniel", tone: "#c3cdd6",
    line: "High floor, upgraded kitchen, and a price to match.",
  },
  lumen: {
    name: "Lumen Heights", area: "dubai_marina", beds: 1, baths: 2, sqft: 820, price: 1240000, floor: "17th floor",
    maids: false, facing: "south", view: "Marina view", service: 18, agent: "layla", tone: "#ddd2c6",
    line: "A one bed with a study nook, two minutes from the marina walk.",
  },
  fernwood: {
    name: "Fernwood Lakes", area: "jlt", beds: 2, baths: 2, sqft: 1150, price: 1450000, floor: "6th floor",
    maids: false, facing: "north", view: "Lake view", service: 15, agent: "priya", tone: "#cfd8c8",
    line: "Across the road from the Marina, quieter and a lot cheaper per square foot.",
  },
};
const LISTING_IDS = Object.keys(LISTINGS) as ListingId[];

const AGENTS: Record<AgentId, { name: string; role: string; langs: string[]; areas: string; arabic: boolean; deals: string; ar?: string; arName?: string }> = {
  layla: {
    name: "Layla Haddad", role: "Senior agent, Dubai Marina", langs: ["English", "Arabic"], areas: "Dubai Marina, JBR", arabic: true,
    deals: "Lists most of our Marina towers", arName: "ليلى", ar: "أهلاً، أنا ليلى. أساعدك في إيجاد بيتك في دبي مارينا، وأرد على أسئلتك بالعربية.",
  },
  omar: {
    name: "Omar Al Suwaidi", role: "Agent, off-plan and resale", langs: ["Arabic", "English", "French"], areas: "Dubai Marina, Business Bay", arabic: true,
    deals: "Handles mortgage paperwork with the banks", arName: "عمر", ar: "أتابع معك أوراق التمويل مع البنك خطوة بخطوة.",
  },
  daniel: {
    name: "Daniel Novak", role: "Agent, high floors", langs: ["English", "Russian"], areas: "Dubai Marina, Palm Jumeirah", arabic: false,
    deals: "Knows every view line in the Marina",
  },
  priya: {
    name: "Priya Raman", role: "Agent, Jumeirah Lake Towers", langs: ["English", "Hindi", "Tamil"], areas: "JLT, The Greens", arabic: false,
    deals: "Good with first-time buyers",
  },
};
const AGENT_IDS = Object.keys(AGENTS) as AgentId[];

const DAYS = [
  { id: "thu", short: "Thu", long: "Thursday", date: "22 Oct", taken: ["10:00"] },
  { id: "fri", short: "Fri", long: "Friday", date: "23 Oct", taken: ["11:00", "12:30"] },
  { id: "sat", short: "Sat", long: "Saturday", date: "24 Oct", taken: ["16:00"] },
  { id: "sun", short: "Sun", long: "Sunday", date: "25 Oct", taken: [] as string[] },
] as const;
const SLOTS = ["10:00", "11:00", "12:30", "16:00", "17:30"];
const slotId = (t: string) => t.replace(":", "");

/** Fixed demo rate, so the calculator is reproducible. Made up, like everything else here. */
const RATE = 4.49;

/* ---------- helpers ---------- */

const f = (s: State, k: string) => s.flags[k] ?? "";
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const aed = (n: number) => `AED ${fmt(n)}`;
const short = (n: number) => (n >= 1e6 ? `AED ${(n / 1e6).toFixed(2).replace(/\.?0+$/, "")}M` : aed(n));
const pps = (l: Listing) => Math.round(l.price / l.sqft);

/** "2M", "2,000,000", "1.95m", "800k" all work. */
function money(x: string | undefined) {
  const t = String(x ?? "").toLowerCase().replace(/[, ]|aed/g, "");
  const m = t.match(/^(\d+(?:\.\d+)?)(m|k)?$/);
  if (!m) return 0;
  return Number(m[1]) * (m[2] === "m" ? 1e6 : m[2] === "k" ? 1e3 : 1);
}

/** Standard repayment mortgage: L * r / (1 - (1 + r)^-n), r monthly, n months. */
export function monthlyPayment(loan: number, ratePct: number, years: number) {
  const r = ratePct / 100 / 12;
  const n = years * 12;
  return r === 0 ? loan / n : (loan * r) / (1 - Math.pow(1 + r, -n));
}

function calc(s: State) {
  const price = Number(f(s, "calc_price")) || 0;
  const down = Number(f(s, "calc_down")) || 0;
  const years = Number(f(s, "calc_years")) || 0;
  const loan = price * (1 - down / 100);
  const monthly = monthlyPayment(loan, RATE, years);
  return {
    price, down, years, loan, monthly,
    downCash: price - loan, dld: price * 0.04, agency: price * 0.02 * 1.05,
    interest: monthly * years * 12 - loan,
    salary: Math.ceil((monthly * 2) / 500) * 500, // demo rule: payments up to half of salary
  };
}

const listingOf = (s: State) => LISTINGS[(f(s, "listing") || "bayline") as ListingId] ?? LISTINGS.bayline;
const matches = (s: State) => (id: ListingId) => {
  const l = LISTINGS[id];
  const area = f(s, "q_area") || "any";
  const beds = f(s, "q_beds") || "any";
  const max = Number(f(s, "q_max")) || 0;
  return (area === "any" || l.area === area) && (beds === "any" || String(l.beds) === beds) && (!max || l.price <= max);
};
const booking = (s: State) => f(s, "book_step") !== "done";
const dayPicked = (s: State) => booking(s) && !!f(s, "day");
const agentShown = (a: AgentId) => (s: State) => f(s, "agent_filter") === "arabic" ? AGENTS[a].arabic : f(s, "agent_filter") === "marina" ? AGENTS[a].areas.includes("Dubai Marina") : true;
const bookAgent = (s: State): AgentId =>
  (f(s, "book_agent") as AgentId) || LISTINGS[(s.values["marsa.book.property"] || "bayline") as ListingId]?.agent || "layla";
const calcDone = (s: State) => f(s, "calc") === "yes";
const sunOn = (s: State) => f(s, "plan_sun") === "yes";

/* ---------- elements ---------- */

const els: El[] = [
  { id: "marsa.nav.home", label: "Marsa Homes home", kind: "link", page: "*", to: "search" },
  { id: "marsa.nav.search", label: "Buy", kind: "link", page: "*", to: "search" },
  { id: "marsa.nav.mortgage", label: "Mortgage calculator", kind: "link", page: "*", to: "mortgage" },
  { id: "marsa.nav.agents", label: "Agents", kind: "link", page: "*", to: "agents" },
  { id: "marsa.nav.book", label: "Book a viewing", kind: "button", page: "*", to: "book" },

  { id: "marsa.search.area", label: "Area", kind: "field", page: "search", options: AREAS },
  { id: "marsa.search.beds", label: "Bedrooms", kind: "field", page: "search", options: BEDS },
  { id: "marsa.search.max_price", label: "Max price (AED)", kind: "field", page: "search", input: "text" },
  { id: "marsa.search.apply", label: "Search homes", kind: "button", page: "search" },
  { id: "marsa.search.count", label: "Results count", kind: "text", page: "search" },
  ...LISTING_IDS.flatMap((id): El[] => {
    const when = (s: State) => matches(s)(id);
    return [
      { id: `marsa.search.${id}`, label: `${LISTINGS[id].name} listing`, kind: "card", page: "search", when },
      { id: `marsa.search.${id}_sqft`, label: `${LISTINGS[id].name} price per sqft`, kind: "text", page: "search", when },
    ];
  }),

  { id: "marsa.listing.back", label: "Back to results", kind: "link", page: "listing", to: "search" },
  { id: "marsa.listing.price", label: "Asking price", kind: "text", page: "listing" },
  { id: "marsa.listing.price_sqft", label: "Price per sqft", kind: "text", page: "listing" },
  { id: "marsa.listing.facts", label: "Beds, baths and size", kind: "text", page: "listing" },
  { id: "marsa.listing.service", label: "Service charge", kind: "text", page: "listing" },
  { id: "marsa.listing.description", label: "About this home", kind: "text", page: "listing" },
  { id: "marsa.listing.floorplan", label: "View floor plan", kind: "button", page: "listing", to: "floorplan" },
  { id: "marsa.listing.afford", label: "Can I afford this?", kind: "button", page: "listing", to: "mortgage" },
  { id: "marsa.listing.book", label: "Book a viewing of this home", kind: "button", page: "listing", to: "book" },
  { id: "marsa.listing.agent", label: "Listing agent", kind: "card", page: "listing" },

  { id: "marsa.floorplan.back", label: "Back to the listing", kind: "link", page: "floorplan", to: "listing" },
  { id: "marsa.floorplan.living", label: "Living and dining", kind: "card", page: "floorplan" },
  { id: "marsa.floorplan.kitchen", label: "Kitchen", kind: "card", page: "floorplan" },
  { id: "marsa.floorplan.maids", label: "Maid's room", kind: "card", page: "floorplan", when: (s) => listingOf(s).maids },
  { id: "marsa.floorplan.store", label: "Store room", kind: "card", page: "floorplan", when: (s) => !listingOf(s).maids },
  { id: "marsa.floorplan.master", label: "Main bedroom", kind: "card", page: "floorplan" },
  { id: "marsa.floorplan.bed2", label: "Second bedroom", kind: "card", page: "floorplan" },
  { id: "marsa.floorplan.balcony", label: "Balcony", kind: "card", page: "floorplan" },
  { id: "marsa.floorplan.sun", label: "Show sun and views", kind: "button", page: "floorplan" },
  { id: "marsa.floorplan.orientation", label: "Which way the balcony faces", kind: "text", page: "floorplan", when: sunOn },
  { id: "marsa.floorplan.sizes", label: "Room sizes", kind: "text", page: "floorplan" },
  { id: "marsa.floorplan.book", label: "Book a viewing from the plan", kind: "button", page: "floorplan", to: "book" },

  { id: "marsa.mortgage.price", label: "Property price (AED)", kind: "field", page: "mortgage", input: "text" },
  {
    id: "marsa.mortgage.down", label: "Down payment", kind: "field", page: "mortgage",
    options: ["20", "25", "30", "40", "50"].map((p) => ({ value: p, label: `${p}%` })),
  },
  {
    id: "marsa.mortgage.years", label: "Loan length", kind: "field", page: "mortgage",
    options: ["10", "15", "20", "25"].map((y) => ({ value: y, label: `${y} years` })),
  },
  { id: "marsa.mortgage.rate", label: "Interest rate", kind: "text", page: "mortgage" },
  { id: "marsa.mortgage.calculate", label: "Calculate", kind: "button", page: "mortgage" },
  { id: "marsa.mortgage.monthly", label: "Monthly payment", kind: "text", page: "mortgage", when: calcDone },
  { id: "marsa.mortgage.upfront", label: "Cash needed upfront", kind: "text", page: "mortgage", when: calcDone },
  { id: "marsa.mortgage.salary", label: "Salary you need", kind: "text", page: "mortgage", when: calcDone },
  { id: "marsa.mortgage.book", label: "Book a viewing", kind: "button", page: "mortgage", to: "book", when: calcDone },

  {
    id: "marsa.book.property", label: "Home to view", kind: "field", page: "book", when: booking,
    options: LISTING_IDS.map((id) => ({ value: id, label: LISTINGS[id].name })),
  },
  ...DAYS.map((d): El => ({ id: `marsa.book.day_${d.id}`, label: `${d.long} ${d.date}`, kind: "button", page: "book", when: booking, set: { day: d.id, slot: "" } })),
  ...SLOTS.map((t): El => ({ id: `marsa.book.slot_${slotId(t)}`, label: `${t} slot`, kind: "button", page: "book", when: dayPicked })),
  { id: "marsa.book.name", label: "Your name", kind: "field", page: "book", when: booking },
  { id: "marsa.book.email", label: "Email", kind: "field", page: "book", input: "email", when: booking },
  { id: "marsa.book.mobile", label: "Mobile", kind: "field", page: "book", input: "tel", when: booking },
  {
    id: "marsa.book.language", label: "Language for the viewing", kind: "field", page: "book", when: booking,
    options: [{ value: "en", label: "English" }, { value: "ar", label: "العربية (Arabic)" }, { value: "hi", label: "Hindi" }, { value: "ru", label: "Russian" }],
  },
  { id: "marsa.book.submit", label: "Confirm viewing", kind: "button", page: "book", when: booking },
  { id: "marsa.book.confirmation", label: "Viewing confirmed", kind: "text", page: "book", when: (s) => !booking(s) },
  { id: "marsa.book.again", label: "Back to search", kind: "link", page: "book", to: "search", when: (s) => !booking(s) },

  { id: "marsa.agents.filter_all", label: "All agents", kind: "button", page: "agents", set: { agent_filter: "all" } },
  { id: "marsa.agents.filter_arabic", label: "Speaks Arabic", kind: "button", page: "agents", set: { agent_filter: "arabic" } },
  { id: "marsa.agents.filter_marina", label: "Dubai Marina experts", kind: "button", page: "agents", set: { agent_filter: "marina" } },
  ...AGENT_IDS.flatMap((a): El[] => [
    { id: `marsa.agents.${a}`, label: `${AGENTS[a].name}`, kind: "card", page: "agents", when: agentShown(a) },
    { id: `marsa.agents.${a}_book`, label: `Book with ${AGENTS[a].name.split(" ")[0]}`, kind: "button", page: "agents", to: "book", when: agentShown(a) },
  ]),
];

/* ---------- rules ---------- */

function ref(s: State) {
  let h = 11;
  for (const ch of `${s.values["marsa.book.name"]}${s.values["marsa.book.email"]}${f(s, "day")}${f(s, "slot")}`) h = (h * 31 + ch.charCodeAt(0)) % 9000;
  return `MH-${1000 + h}`;
}

function onClick(s: State, id: string): Effect | null {
  const v = (k: string) => (s.values[`marsa.${k}`] ?? "").trim();

  if (id === "marsa.search.apply") {
    const max = money(v("search.max_price"));
    if (v("search.max_price") && !max) return { error: "Max price should be a number like 2000000 or 2M (marsa.search.max_price)." };
    const area = v("search.area") || "any";
    const beds = v("search.beds") || "any";
    const n = LISTING_IDS.filter(matches({ ...s, flags: { ...s.flags, q_area: area, q_beds: beds, q_max: String(max || "") } })).length;
    return {
      set: { q_area: area, q_beds: beds, q_max: max ? String(max) : "" },
      say: `searched ${AREAS.find((a) => a.value === area)?.label}, ${beds === "any" ? "any beds" : `${beds} bed`}${max ? `, up to ${short(max)}` : ""}: ${n} found`,
    };
  }
  const card = id.match(/^marsa\.search\.(\w+)$/)?.[1] as ListingId | undefined;
  if (card && LISTINGS[card]) return { go: "listing", set: { listing: card, plan_sun: "" }, say: `opened ${LISTINGS[card].name}` };

  if (id === "marsa.listing.afford") {
    const l = listingOf(s);
    return { values: { "marsa.mortgage.price": String(l.price) }, set: { calc: "" }, say: `took ${aed(l.price)} to the calculator` };
  }
  if (id === "marsa.nav.book" && s.values["marsa.book.property"]) return { set: { book_step: "" } };
  if (id === "marsa.nav.book" || id === "marsa.listing.book" || id === "marsa.floorplan.book" || id === "marsa.mortgage.book") {
    return { values: { "marsa.book.property": f(s, "listing") || "bayline" }, set: { book_agent: listingOf(s).agent, book_step: "" } };
  }
  if (id === "marsa.floorplan.sun") return { set: sunOn(s) ? { plan_sun: "" } : { plan_sun: "yes", plan_seen: "yes" }, say: sunOn(s) ? "hid sun and views" : "showed sun and views" };

  if (id === "marsa.mortgage.calculate") {
    const price = money(v("mortgage.price"));
    if (!price) return { error: "Add the property price in AED (marsa.mortgage.price)." };
    if (price < 300000) return { error: "That price looks too low for Dubai; check marsa.mortgage.price." };
    if (!v("mortgage.down")) return { error: "Choose a down payment (marsa.mortgage.down)." };
    if (!v("mortgage.years")) return { error: "Choose a loan length (marsa.mortgage.years)." };
    const set = { calc: "yes", calc_price: String(price), calc_down: v("mortgage.down"), calc_years: v("mortgage.years") };
    return { set, say: `calculated ${aed(calc({ ...s, flags: { ...s.flags, ...set } }).monthly)} a month` };
  }

  const agent = id.match(/^marsa\.agents\.(\w+)_book$/)?.[1] as AgentId | undefined;
  if (agent && AGENTS[agent]) {
    const keep = f(s, "listing") && LISTINGS[f(s, "listing") as ListingId].agent === agent ? f(s, "listing") : LISTING_IDS.find((l) => LISTINGS[l].agent === agent)!;
    return { set: { book_agent: agent, book_step: "" }, values: { "marsa.book.property": keep }, say: `chose ${AGENTS[agent].name} and opened booking` };
  }

  const slot = id.match(/^marsa\.book\.slot_(\d{4})$/)?.[1];
  if (slot) {
    const t = `${slot.slice(0, 2)}:${slot.slice(2)}`;
    const day = DAYS.find((d) => d.id === f(s, "day"));
    if (!day) return { error: "Pick a day first (marsa.book.day_sat)." };
    if ((day.taken as readonly string[]).includes(t)) {
      const free = SLOTS.filter((x) => !(day.taken as readonly string[]).includes(x)).join(", ");
      return { error: `${t} on ${day.long} is taken. Free that day: ${free}.` };
    }
    return { set: { slot: t }, say: `picked ${day.short} ${t}` };
  }

  if (id === "marsa.book.submit") {
    const day = DAYS.find((d) => d.id === f(s, "day"));
    if (!v("book.property")) return { error: "Choose the home to view (marsa.book.property)." };
    if (!day) return { error: "Pick a day (marsa.book.day_sat)." };
    if (!f(s, "slot")) return { error: "Pick a time slot (marsa.book.slot_1100)." };
    if (v("book.name").split(/\s+/).length < 2) return { error: "Name needs a first and last name (marsa.book.name)." };
    if (!/^\S+@\S+\.\S+$/.test(v("book.email"))) return { error: "Email looks wrong (marsa.book.email)." };
    if (v("book.mobile").replace(/\D/g, "").length < 9) return { error: "Mobile needs at least 9 digits (marsa.book.mobile)." };
    const agentId = bookAgent(s);
    return {
      set: { book_step: "done", book_agent: agentId },
      outcome: `VIEWING BOOKED ${day.short} ${f(s, "slot")}`,
      say: `booked ${day.short} ${f(s, "slot")} and sent the lead to ${AGENTS[agentId].name}`,
    };
  }
  return null;
}

/* ---------- pages ---------- */

const Section = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <section className={`mx-auto w-full max-w-5xl px-5 @3xl:px-8 ${className}`}>{children}</section>
);
const Eyebrow = ({ children }: { children: ReactNode }) => (
  <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--mk-accent-ink)]">{children}</p>
);
const H1 = ({ children }: { children: ReactNode }) => (
  <h1 className="mk-display mt-2 text-3xl leading-tight text-[var(--mk-ink)] @3xl:text-[2.6rem]">{children}</h1>
);
const Box = ({ children, className = "", ...rest }: { children: ReactNode; className?: string; "data-el"?: string }) => (
  <div {...rest} className={`rounded-[var(--mk-radius)] border border-[var(--mk-line)] bg-[var(--mk-surface)] ${className}`}>{children}</div>
);

function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden>
        <rect width="28" height="28" rx="4" fill="var(--mk-primary)" />
        <path d="M6 19.5 11 9l3.2 6.4L17 11l5 8.5" fill="none" stroke="var(--mk-on-primary)" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M5 22c2.2-1.3 4.4-1.3 6.6 0s4.4 1.3 6.6 0 4.4-1.3 4.8-.6" fill="none" stroke="var(--mk-on-primary)" strokeWidth="1.4" opacity=".7" />
      </svg>
      <span className="leading-none">
        <span className="mk-display block text-[19px] text-[var(--mk-ink)]">Marsa Homes</span>
        <span lang="ar" className="mt-0.5 block text-[10px] text-[var(--mk-muted)]">مرسى للعقارات</span>
      </span>
    </span>
  );
}

function Header({ site, page }: { site: Site; page: string }) {
  const links: [string, string[]][] = [["search", ["search", "listing", "floorplan"]], ["mortgage", ["mortgage"]], ["agents", ["agents"]]];
  return (
    <header className="sticky top-0 z-10 border-b border-[var(--mk-line)] bg-[var(--mk-bg)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3 @3xl:flex-nowrap @3xl:px-8">
        <button {...site.hit("marsa.nav.home")} aria-label="Marsa Homes home"><Logo /></button>
        <nav className="order-3 -mx-1 flex w-full gap-1 overflow-x-auto @3xl:order-none @3xl:w-auto">
          {links.map(([p, on]) => (
            <button
              key={p}
              {...site.hit(`marsa.nav.${p}`)}
              className={`whitespace-nowrap border-b-2 px-2.5 py-1.5 text-sm transition ${on.includes(page) ? "border-[var(--mk-primary)] font-medium text-[var(--mk-ink)]" : "border-transparent text-[var(--mk-muted)] hover:text-[var(--mk-ink)]"}`}
            >
              {site.el(`marsa.nav.${p}`)?.label}
            </button>
          ))}
        </nav>
        <MkButton site={site} id="marsa.nav.book" className="ml-auto !py-2" />
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--mk-line)] bg-[var(--mk-surface)]">
      <Section className="flex flex-col gap-3 py-6 @3xl:flex-row @3xl:items-center @3xl:justify-between">
        <Logo />
        <MadeUp name="Marsa Homes" />
      </Section>
    </footer>
  );
}

/** A flat, drawn "photo" of the tower: sky, water, a building block in the listing's tone. */
function Photo({ l, className = "" }: { l: Listing; className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: `linear-gradient(180deg, ${l.tone} 0%, #f3ede4 62%, #9fb6c2 62%, #7f9cac 100%)` }}>
      <div className="absolute bottom-[38%] left-[14%] h-[52%] w-[22%] bg-white/70" />
      <div className="absolute bottom-[38%] left-[40%] h-[70%] w-[18%] bg-[var(--mk-accent)]/55" />
      <div className="absolute bottom-[38%] left-[62%] h-[40%] w-[24%] bg-white/55" />
      <div className="absolute bottom-[38%] left-[40%] h-[70%] w-[18%] bg-[repeating-linear-gradient(180deg,transparent_0_6px,rgba(255,255,255,.35)_6px_7px)]" />
      <div className="absolute inset-x-0 bottom-[30%] h-px bg-white/50" />
    </div>
  );
}

function Search({ site }: { site: Site }) {
  const list = LISTING_IDS.filter(matches(site.s));
  const area = AREAS.find((a) => a.value === (site.flag("q_area") || "any"))?.label;
  return (
    <>
      <Section className="pt-10">
        <Eyebrow>Homes for sale in Dubai</Eyebrow>
        <H1>Find a place by the water</H1>
        <Box className="mt-6 grid gap-3 p-4 @2xl:grid-cols-[1.3fr_1fr_1.2fr_auto] @2xl:items-end">
          <MkSelect site={site} id="marsa.search.area" />
          <MkSelect site={site} id="marsa.search.beds" />
          <MkField site={site} id="marsa.search.max_price" placeholder="2,000,000 or 2M" />
          <MkButton site={site} id="marsa.search.apply" className="h-[42px]">Search</MkButton>
        </Box>
      </Section>
      <Section className="mt-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p {...site.mark("marsa.search.count")} className="text-sm text-[var(--mk-ink)]">
            <strong className="font-semibold">{list.length} {list.length === 1 ? "home" : "homes"}</strong>
            <span className="text-[var(--mk-muted)]">
              {" "}in {area}
              {site.flag("q_beds") && site.flag("q_beds") !== "any" ? `, ${site.flag("q_beds")} bed` : ""}
              {site.flag("q_max") ? `, up to ${short(Number(site.flag("q_max")))}` : ""}
            </span>
          </p>
          <p className="text-xs text-[var(--mk-muted)]">Sorted by newest · prices include no fees</p>
        </div>
        <div className="mt-4 grid gap-4 @xl:grid-cols-2 @4xl:grid-cols-3">
          {list.map((id) => {
            const l = LISTINGS[id];
            return (
              <button key={id} {...site.hit(`marsa.search.${id}`)} className="group overflow-hidden rounded-[var(--mk-radius)] border border-[var(--mk-line)] bg-[var(--mk-surface)] text-left transition hover:border-[var(--mk-line-strong)] hover:shadow-[0_12px_30px_-18px_rgba(40,25,15,.45)]">
                <Photo l={l} className="aspect-[16/9]" />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="mk-display text-[22px] leading-none text-[var(--mk-ink)]">{aed(l.price)}</p>
                    {l.maids && <span className="shrink-0 rounded-full bg-[var(--mk-accent)]/12 px-2 py-0.5 text-[11px] font-medium text-[var(--mk-accent-ink)]">Maid&apos;s room</span>}
                  </div>
                  <p className="mt-2 text-sm font-medium text-[var(--mk-ink)]">{l.name}</p>
                  <p className="text-xs text-[var(--mk-muted)]">{AREAS.find((a) => a.value === l.area)?.label} · {l.view}</p>
                  <div className="mt-3 flex items-center justify-between border-t border-[var(--mk-line)] pt-3 text-xs text-[var(--mk-muted)]">
                    <span>{l.beds} bed · {l.baths} bath · {fmt(l.sqft)} sqft</span>
                    <span {...site.mark(`marsa.search.${id}_sqft`)} className="font-semibold text-[var(--mk-primary)]">AED {fmt(pps(l))}/sqft</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {list.length === 0 && <p className="mt-4 text-sm text-[var(--mk-muted)]">Nothing matches. Try a higher price or any area.</p>}
      </Section>
    </>
  );
}

function Listing({ site }: { site: Site }) {
  const l = listingOf(site.s);
  const a = AGENTS[l.agent];
  return (
    <>
      <Section className="pt-6">
        <MkLink site={site} id="marsa.listing.back" className="text-sm">← Back to results</MkLink>
      </Section>
      <Section className="mt-4">
        <div className="grid gap-2 overflow-hidden rounded-[var(--mk-radius)] @2xl:grid-cols-[2fr_1fr]">
          <Photo l={l} className="aspect-[16/9] @2xl:aspect-auto @2xl:h-64" />
          <div className="hidden gap-2 @2xl:grid">
            <div className="bg-[linear-gradient(135deg,#efe6da,#dccbb6)]" />
            <div className="bg-[linear-gradient(135deg,#c8d5dc,#93aebb)]" />
          </div>
        </div>
      </Section>
      <Section className="mt-6 grid gap-8 @3xl:grid-cols-[1.6fr_1fr]">
        <div>
          <Eyebrow>{AREAS.find((x) => x.value === l.area)?.label} · {l.floor}</Eyebrow>
          <H1>{l.name}</H1>
          <div className="mt-4 flex flex-wrap items-end gap-x-6 gap-y-2">
            <p {...site.mark("marsa.listing.price")} className="mk-display text-3xl text-[var(--mk-ink)]">{aed(l.price)}</p>
            <p {...site.mark("marsa.listing.price_sqft")} className="pb-1 text-sm font-semibold text-[var(--mk-primary)]">AED {fmt(pps(l))} per sqft</p>
          </div>
          <dl {...site.mark("marsa.listing.facts")} className="mt-5 grid grid-cols-3 divide-x divide-[var(--mk-line)] rounded-[var(--mk-radius)] border border-[var(--mk-line)] bg-[var(--mk-surface)] text-center">
            {[[String(l.beds), l.beds === 1 ? "bedroom" : "bedrooms"], [String(l.baths), "bathrooms"], [fmt(l.sqft), "sqft"]].map(([n, t]) => (
              <div key={t} className="px-3 py-3">
                <dt className="mk-display text-xl text-[var(--mk-ink)]">{n}</dt>
                <dd className="text-xs text-[var(--mk-muted)]">{t}</dd>
              </div>
            ))}
          </dl>
          <div {...site.mark("marsa.listing.description")} className="mt-5 text-sm leading-relaxed text-[var(--mk-ink)]/85">
            <p>{l.line} {l.view}, {l.facing}-facing balcony, one covered parking space, and the marina walk is a two minute stroll.</p>
            <p className="mt-2">Vacant on transfer. Gym, pool and 24 hour security in the building.</p>
          </div>
          <p {...site.mark("marsa.listing.service")} className="mt-4 rounded-[var(--mk-radius)] bg-[var(--mk-surface)] px-4 py-3 text-sm text-[var(--mk-ink)] ring-1 ring-[var(--mk-line)]">
            Service charge AED {l.service} per sqft a year, about <strong>{aed(l.service * l.sqft)}</strong> a year for this home.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <MkButton site={site} id="marsa.listing.floorplan" variant="outline">View floor plan</MkButton>
            <MkButton site={site} id="marsa.listing.afford" variant="outline" />
          </div>
        </div>
        <aside className="space-y-4">
          <Box className="p-5" data-el="marsa.listing.agent">
            <p className="text-xs text-[var(--mk-muted)]">Listed by</p>
            <div className="mt-2 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--mk-accent)] text-sm font-semibold text-[var(--mk-on-accent)]">{a.name.split(" ").map((x) => x[0]).join("")}</span>
              <div>
                <p className="font-medium text-[var(--mk-ink)]">{a.name}</p>
                <p className="text-xs text-[var(--mk-muted)]">Speaks {a.langs.join(", ")}</p>
              </div>
            </div>
            <MkButton site={site} id="marsa.listing.book" className="mt-4 w-full">Book a viewing</MkButton>
          </Box>
          <p className="text-xs leading-relaxed text-[var(--mk-muted)]">Permit number shown on the real thing. This is a demo listing.</p>
        </aside>
      </Section>
    </>
  );
}

/** One room on the plan, positioned in percent of the plan box. */
function Room({ site, id, name, size, box, tone = "bg-[var(--mk-surface)]", note }: {
  site: Site; id?: string; name: string; size: string; box: [number, number, number, number]; tone?: string; note?: string;
}) {
  const [x, y, w, h] = box;
  return (
    <div
      {...(id ? site.mark(id) : {})}
      className={`absolute flex flex-col items-center justify-center border-[3px] border-[var(--mk-ink)]/80 p-1 text-center ${tone}`}
      style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%`, marginLeft: -1.5, marginTop: -1.5 }}
    >
      <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--mk-ink)] @2xl:text-xs">{name}</span>
      <span className="mt-0.5 font-mono text-[10px] text-[var(--mk-muted)]">{size}</span>
      {note && <span className="mt-0.5 text-[10px] text-[var(--mk-accent-ink)]">{note}</span>}
    </div>
  );
}

const NEEDLE: Record<Facing, number> = { west: 0, east: 180, south: 90, north: -90 };

const FACING: Record<Facing, { sun: string; view: string }> = {
  west: { sun: "Afternoon and sunset sun from about 14:30. Warm in summer evenings, so the glass is tinted.", view: "Looks straight over the marina basin." },
  east: { sun: "Morning sun until about 11:00, shade in the afternoon. The coolest balcony in summer.", view: "Looks towards the tram line and Sheikh Zayed Road." },
  south: { sun: "Sun most of the day in winter, high overhead in summer.", view: "Looks over the pool deck." },
  north: { sun: "Almost no direct sun. Bright but never hot.", view: "Looks over the lake." },
};

const GRID: CSSProperties = {
  backgroundColor: "var(--mk-bg)",
  backgroundImage: "linear-gradient(var(--mk-line) 1px, transparent 1px), linear-gradient(90deg, var(--mk-line) 1px, transparent 1px)",
  backgroundSize: "20px 20px",
};

function FloorPlan({ site }: { site: Site }) {
  const l = listingOf(site.s);
  const sun = site.flag("plan_sun") === "yes";
  const face = FACING[l.facing];
  const sizes = [["Living and dining", "22 × 14 ft"], ["Main bedroom", "16 × 13 ft"], ["Second bedroom", "13 × 11 ft"], [l.maids ? "Maid's room" : "Store room", "8 × 7 ft"], ["Balcony", "24 × 6 ft"]];
  return (
    <>
      <Section className="pt-6">
        <MkLink site={site} id="marsa.floorplan.back" className="text-sm">← Back to {l.name}</MkLink>
      </Section>
      <Section className="mt-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Floor plan · {fmt(l.sqft)} sqft</Eyebrow>
            <H1>{l.name}, {l.floor}</H1>
          </div>
          <MkTab site={site} id="marsa.floorplan.sun" active={sun}>{sun ? "Hide sun and views" : "Show sun and views"}</MkTab>
        </div>
      </Section>
      <Section className="mt-6 grid gap-6 @3xl:grid-cols-[1.7fr_1fr]">
        <div className="rounded-[var(--mk-radius)] border border-[var(--mk-line)] p-4 @2xl:p-5" style={GRID}>
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--mk-muted)]">Not to scale · sizes in feet</p>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[var(--mk-muted)]">North</span>
              <span className="grid h-9 w-9 place-items-center rounded-full border border-[var(--mk-line-strong)] bg-[var(--mk-surface)]">
                <svg width="16" height="16" viewBox="0 0 16 16" style={{ transform: `rotate(${NEEDLE[l.facing]}deg)` }} aria-hidden>
                  <path d="M8 1 11 8H5Z" fill="var(--mk-primary)" /><path d="M8 15 5 8h6Z" fill="var(--mk-line-strong)" />
                </svg>
              </span>
            </div>
          </div>
          <div className="relative mx-auto mt-3 aspect-[16/10] w-[calc(100%-56px)] max-w-[600px]">
            {/* The balcony is always drawn on the left; the compass turns to match the real direction. */}
            <Room site={site} id="marsa.floorplan.balcony" name="Balcony" size="24×6" box={[0, 0, 14, 58]} tone={sun ? "bg-[#f6dfb0]" : "bg-[#e8eef1]"} />
            <Room site={site} id="marsa.floorplan.living" name="Living / dining" size="22×14" box={[14, 0, 40, 58]} />
            <Room site={site} id="marsa.floorplan.kitchen" name="Kitchen" size="11×9" box={[54, 0, 22, 32]} />
            {l.maids
              ? <Room site={site} id="marsa.floorplan.maids" name="Maid's room" size="8×7" box={[76, 0, 24, 32]} tone="bg-[var(--mk-accent)]/10" note="+ own WC" />
              : <Room site={site} id="marsa.floorplan.store" name="Store" size="8×7" box={[76, 0, 24, 32]} />}
            <Room site={site} name="Hall" size="entry" box={[54, 32, 46, 26]} tone="bg-[var(--mk-bg)]" />
            <Room site={site} id="marsa.floorplan.master" name="Main bedroom" size="16×13" box={[0, 58, 38, 42]} note="en suite" />
            <Room site={site} id="marsa.floorplan.bed2" name={l.beds === 1 ? "Study" : "Bedroom 2"} size="13×11" box={[38, 58, 32, 42]} />
            <Room site={site} name="Bath" size="8×7" box={[70, 58, 30, 42]} tone="bg-[#eef1f2]" />
            <span className="absolute right-[3%] top-[41%] font-mono text-[10px] text-[var(--mk-muted)]">DOOR ▸</span>
            {sun && (
              <span
                aria-hidden
                className="pointer-events-none absolute left-[-30px] top-[29%] h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f5b84a] shadow-[0_0_0_6px_rgba(245,184,74,.3),0_0_0_12px_rgba(245,184,74,.14)]"
              />
            )}
          </div>
        </div>
        <div className="space-y-4">
          {sun && (
            <div {...site.mark("marsa.floorplan.orientation")} className="rounded-[var(--mk-radius)] border border-[var(--mk-accent)]/40 bg-[var(--mk-accent)]/10 p-4 text-sm leading-relaxed text-[var(--mk-ink)]">
              <p className="font-semibold">The balcony faces {l.facing}</p>
              <p className="mt-1">{face.sun}</p>
              <p className="mt-1">{face.view}</p>
            </div>
          )}
          <Box className="p-4" data-el="marsa.floorplan.sizes">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--mk-muted)]">Room sizes</p>
            <dl className="mt-2 divide-y divide-[var(--mk-line)] text-sm">
              {sizes.map(([n, s]) => (
                <div key={n} className="flex justify-between py-1.5"><dt className="text-[var(--mk-ink)]">{n}</dt><dd className="font-mono text-xs text-[var(--mk-muted)]">{s}</dd></div>
              ))}
            </dl>
            {l.maids && <p className="mt-2 text-xs leading-relaxed text-[var(--mk-muted)]">The maid&apos;s room sits off the kitchen with its own WC. Many owners use it as a study or storage.</p>}
          </Box>
          <MkButton site={site} id="marsa.floorplan.book" className="w-full">Book a viewing</MkButton>
        </div>
      </Section>
    </>
  );
}

function Mortgage({ site }: { site: Site }) {
  const done = site.flag("calc") === "yes";
  const c = calc(site.s);
  const stale = done && (money(site.v("marsa.mortgage.price")) !== c.price || site.v("marsa.mortgage.down") !== String(c.down) || site.v("marsa.mortgage.years") !== String(c.years));
  return (
    <Section className="pt-10">
      <Eyebrow>Mortgage calculator</Eyebrow>
      <H1>What would it cost a month?</H1>
      <p className="mt-3 max-w-xl text-sm text-[var(--mk-muted)]">Buyers who live in the UAE usually put down at least 20% on a first home under AED 5M.</p>
      <div className="mt-6 grid gap-6 @3xl:grid-cols-[1fr_1.1fr]">
        <Box className="grid gap-4 p-5">
          <MkField site={site} id="marsa.mortgage.price" placeholder="1,950,000" />
          <div className="grid gap-4 @xl:grid-cols-2">
            <MkSelect site={site} id="marsa.mortgage.down" />
            <MkSelect site={site} id="marsa.mortgage.years" />
          </div>
          <p {...site.mark("marsa.mortgage.rate")} className="rounded-[var(--mk-radius)] bg-[var(--mk-bg)] px-3 py-2.5 text-sm text-[var(--mk-ink)]">
            Interest rate <strong>{RATE}%</strong> fixed for this demo, repayment mortgage.
          </p>
          <MkButton site={site} id="marsa.mortgage.calculate">Calculate</MkButton>
        </Box>
        <div className={`rounded-[var(--mk-radius)] p-5 @3xl:p-6 ${done ? "bg-[var(--mk-ink)] text-white" : "border border-dashed border-[var(--mk-line-strong)]"}`}>
          {!done && <p className="text-sm text-[var(--mk-muted)]">Fill in the price, down payment and loan length, then press Calculate.</p>}
          {done && (
            <>
              <div {...site.mark("marsa.mortgage.monthly")}>
                <p className="text-xs uppercase tracking-[0.18em] text-white/60">Monthly payment</p>
                <p className="mk-display mt-1 text-5xl">{aed(c.monthly)}</p>
                <p className="mt-1 text-sm text-white/70">
                  for {c.years} years on a loan of {aed(c.loan)} ({100 - c.down}% of {aed(c.price)})
                </p>
                {stale && <p className="mt-2 text-xs text-[#f3c6a8]">You changed the inputs. Press Calculate to update.</p>}
              </div>
              <div {...site.mark("marsa.mortgage.upfront")} className="mt-5 border-t border-white/15 pt-4 text-sm">
                <p className="font-medium">Cash you need upfront: {aed(c.downCash + c.dld + c.agency)}</p>
                <dl className="mt-2 space-y-1 text-white/70">
                  <div className="flex justify-between"><dt>Down payment {c.down}%</dt><dd>{aed(c.downCash)}</dd></div>
                  <div className="flex justify-between"><dt>Land Department fee 4%</dt><dd>{aed(c.dld)}</dd></div>
                  <div className="flex justify-between"><dt>Agency fee 2% + VAT</dt><dd>{aed(c.agency)}</dd></div>
                </dl>
              </div>
              <p {...site.mark("marsa.mortgage.salary")} className="mt-4 rounded-[var(--mk-radius)] bg-white/10 px-3 py-2.5 text-sm">
                Banks cap repayments at half your salary, so plan on about <strong>{aed(c.salary)}</strong> a month in income. Total interest over the loan: {aed(c.interest)}.
              </p>
              <MkButton site={site} id="marsa.mortgage.book" variant="accent" className="mt-5">Book a viewing</MkButton>
            </>
          )}
        </div>
      </div>
    </Section>
  );
}

function Book({ site }: { site: Site }) {
  const open = site.flag("book_step") !== "done";
  const day = DAYS.find((d) => d.id === site.flag("day"));
  const slot = site.flag("slot");
  const prop = LISTINGS[(site.v("marsa.book.property") || "bayline") as ListingId] ?? LISTINGS.bayline;
  const agent = AGENTS[bookAgent(site.s)];
  const v = (k: string) => site.s.values[`marsa.book.${k}`] ?? "";
  return (
    <Section className="pt-10">
      <div className="mx-auto max-w-3xl">
        <Eyebrow>Book a viewing</Eyebrow>
        <H1>{open ? "Come and see it in person" : "See you there"}</H1>
        {open ? (
          <Box className="mt-6 grid gap-5 p-5 @3xl:p-7">
            <MkSelect site={site} id="marsa.book.property" hint={`With ${agent.name} · ${agent.langs.join(", ")}`} />
            <div>
              <p className="mb-1.5 text-[13px] font-medium text-[var(--mk-ink)]">Day</p>
              <div className="grid grid-cols-2 gap-2 @xl:grid-cols-4">
                {DAYS.map((d) => (
                  <button
                    key={d.id}
                    {...site.hit(`marsa.book.day_${d.id}`)}
                    className={`rounded-[var(--mk-radius)] border px-3 py-2.5 text-left transition ${day?.id === d.id ? "border-[var(--mk-primary)] bg-[var(--mk-primary)] text-[var(--mk-on-primary)]" : "border-[var(--mk-line-strong)] bg-[var(--mk-surface)] text-[var(--mk-ink)] hover:border-[var(--mk-primary)]"}`}
                  >
                    <span className="block text-sm font-semibold">{d.long}</span>
                    <span className={`block text-xs ${day?.id === d.id ? "text-white/75" : "text-[var(--mk-muted)]"}`}>{d.date}</span>
                  </button>
                ))}
              </div>
            </div>
            {day && (
              <div>
                <p className="mb-1.5 text-[13px] font-medium text-[var(--mk-ink)]">Time on {day.long}</p>
                <div className="flex flex-wrap gap-2">
                  {SLOTS.map((t) => {
                    const taken = (day.taken as readonly string[]).includes(t);
                    return (
                      <button
                        key={t}
                        {...site.hit(`marsa.book.slot_${slotId(t)}`)}
                        aria-disabled={taken}
                        className={`rounded-full px-4 py-1.5 font-mono text-sm transition ${slot === t ? "bg-[var(--mk-ink)] text-white" : taken ? "bg-[var(--mk-bg)] text-[var(--mk-muted)] line-through" : "bg-[var(--mk-surface)] text-[var(--mk-ink)] ring-1 ring-[var(--mk-line-strong)] hover:ring-[var(--mk-primary)]"}`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="grid gap-4 @xl:grid-cols-2">
              <MkField site={site} id="marsa.book.name" placeholder="First and last name" />
              <MkField site={site} id="marsa.book.email" placeholder="you@example.com" />
              <MkField site={site} id="marsa.book.mobile" placeholder="050 000 0000" />
              <MkSelect site={site} id="marsa.book.language" />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--mk-line)] pt-4">
              <p className="text-xs text-[var(--mk-muted)]">{day && slot ? `${day.long} ${day.date}, ${slot}, about 30 minutes` : "Pick a day and a time"}</p>
              <MkButton site={site} id="marsa.book.submit" />
            </div>
          </Box>
        ) : (
          <Box className="mt-6 p-6" data-el="marsa.book.confirmation">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-[var(--mk-primary)] text-[var(--mk-on-primary)]">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m4.5 10.5 3.5 3.5 7.5-8" /></svg>
            </div>
            <p className="mk-display mt-4 text-2xl text-[var(--mk-ink)]">Viewing booked: {day?.long} {day?.date}, {slot}</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--mk-muted)]">
              {prop.name}, {prop.floor}. Reference <strong className="font-mono text-[var(--mk-ink)]">{ref(site.s)}</strong>.
              {" "}{agent.name} has your details and will message {v("mobile")} the day before. A calendar invite is on its way to {v("email")}.
            </p>
            {v("language") === "ar" && agent.arName && (
              <p lang="ar" dir="rtl" className="mt-3 rounded-[var(--mk-radius)] bg-[var(--mk-bg)] px-4 py-3 text-sm leading-relaxed text-[var(--mk-ink)]">
                تم تأكيد موعد المعاينة. ستصلك رسالة بالعربية من {agent.arName} قبل الموعد بيوم.
              </p>
            )}
            <MkLink site={site} id="marsa.book.again" className="mt-5 text-sm">Back to search →</MkLink>
          </Box>
        )}
      </div>
    </Section>
  );
}

function Agents({ site }: { site: Site }) {
  const filter = site.flag("agent_filter") || "all";
  const list = AGENT_IDS.filter((a) => agentShown(a)(site.s));
  return (
    <>
      <Section className="pt-10">
        <Eyebrow>Our agents</Eyebrow>
        <H1>People who know the towers</H1>
        <div className="mt-5 flex flex-wrap gap-2">
          <MkTab site={site} id="marsa.agents.filter_all" active={filter === "all"} />
          <MkTab site={site} id="marsa.agents.filter_arabic" active={filter === "arabic"}>Speaks Arabic · يتحدث العربية</MkTab>
          <MkTab site={site} id="marsa.agents.filter_marina" active={filter === "marina"} />
        </div>
      </Section>
      <Section className="mt-6 grid gap-4 @2xl:grid-cols-2">
        {list.map((id) => {
          const a = AGENTS[id];
          return (
            <Box key={id} className="flex flex-col p-5" data-el={`marsa.agents.${id}`}>
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--mk-accent)] font-semibold text-[var(--mk-on-accent)]">{a.name.split(" ").map((x) => x[0]).slice(0, 2).join("")}</span>
                <div>
                  <h2 className="mk-display text-xl text-[var(--mk-ink)]">{a.name}</h2>
                  <p className="text-xs text-[var(--mk-muted)]">{a.role}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-[var(--mk-ink)]">{a.deals}. Covers {a.areas}.</p>
              {a.ar && <p lang="ar" dir="rtl" className="mt-2 text-sm leading-relaxed text-[var(--mk-muted)]">{a.ar}</p>}
              <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                {a.langs.map((x) => <span key={x} className={`rounded-full px-2 py-0.5 font-medium ${x === "Arabic" ? "bg-[var(--mk-primary)]/10 text-[var(--mk-primary)]" : "bg-[var(--mk-bg)] text-[var(--mk-muted)]"}`}>{x}</span>)}
              </div>
              <div className="mt-auto pt-4">
                <MkButton site={site} id={`marsa.agents.${id}_book`} variant="outline" className="w-full" />
              </div>
            </Box>
          );
        })}
      </Section>
    </>
  );
}

function MarsaPage({ site, page }: { site: Site; page: string }) {
  return (
    <div className="flex min-h-full flex-col">
      <Header site={site} page={page} />
      <main className="flex-1">
        {page === "search" && <Search site={site} />}
        {page === "listing" && <Listing site={site} />}
        {page === "floorplan" && <FloorPlan site={site} />}
        {page === "mortgage" && <Mortgage site={site} />}
        {page === "book" && <Book site={site} />}
        {page === "agents" && <Agents site={site} />}
      </main>
      <Footer />
    </div>
  );
}

/* ---------- scenario ---------- */

const DEMO = calc({ flags: { calc_price: String(LISTINGS.bayline.price), calc_down: "20", calc_years: "25" } } as unknown as State);

export const marsa: Scenario = {
  id: "marsa",
  name: "Marsa Homes",
  domain: "marsa-homes.example",
  task: "Find a 2-bed in Dubai Marina, check you can afford it, book a viewing.",
  label: "6 PAGES · BOOK",
  prompts: ["Find me a 2-bed in Dubai Marina under 2M", "Book a viewing on Saturday"],
  brand: {
    swatch: "#b4532a",
    className: `${display.variable} ${sans.variable}`,
    style: {
      "--mk-bg": "#f8f3ec",
      "--mk-surface": "#ffffff",
      "--mk-ink": "#2a211c",
      "--mk-muted": "#74675d",
      "--mk-line": "#ebe2d6",
      "--mk-line-strong": "#d8c9b8",
      "--mk-primary": "#b4532a",
      "--mk-on-primary": "#ffffff",
      "--mk-accent": "#2f5d7c",
      "--mk-accent-ink": "#24506e",
      "--mk-on-accent": "#ffffff",
      "--mk-radius": "4px",
      "--mk-font": "var(--mh-sans), system-ui, sans-serif",
      "--mk-font-display": "var(--mh-display), Georgia, serif",
    } as CSSProperties,
  },
  pages: [
    { id: "search", path: "/buy/dubai", title: "Search" },
    { id: "listing", path: "/buy/listing", title: "Listing" },
    { id: "floorplan", path: "/buy/listing/floor-plan", title: "Floor plan" },
    { id: "mortgage", path: "/mortgage-calculator", title: "Mortgage calculator" },
    { id: "book", path: "/book-viewing", title: "Book a viewing" },
    { id: "agents", path: "/agents", title: "Agents" },
  ],
  els,
  initial: { values: { "marsa.search.area": "any", "marsa.search.beds": "any" }, flags: { q_area: "any", q_beds: "any", agent_filter: "all", listing: "bayline" } },
  tasks: [
    { goal: "Find a 2-bed in Dubai Marina under AED 2M (set the filters, search)", done: (s) => f(s, "q_area") === "dubai_marina" && f(s, "q_beds") === "2" && Number(f(s, "q_max")) > 0 && Number(f(s, "q_max")) <= 2000000 },
    { goal: "Open a listing's floor plan and check which way the balcony faces", done: (s) => f(s, "plan_seen") === "yes" },
    { goal: "Work out the monthly payment with 20% down over 25 years", done: (s) => calcDone(s) && f(s, "calc_down") === "20" && f(s, "calc_years") === "25" },
    { goal: "Find an agent who speaks Arabic", done: (s) => f(s, "agent_filter") === "arabic" },
    { goal: "Book a Saturday 11:00 viewing with your contact details", done: (s) => s.outcome === "VIEWING BOOKED Sat 11:00" },
  ],
  onClick,
  Page: MarsaPage,
  solution: [
    {
      action: "fill",
      fields: [
        { id: "marsa.search.area", value: "dubai_marina" },
        { id: "marsa.search.beds", value: "2" },
        { id: "marsa.search.max_price", value: "2000000" },
      ],
    },
    { action: "click", id: "marsa.search.apply" },
    { action: "highlight", ids: ["marsa.search.bayline_sqft", "marsa.search.mizan_sqft", "marsa.search.coral_sqft"], note: `Three under 2M. Coral Quay is cheapest per sqft at AED ${fmt(pps(LISTINGS.coral))}` },
    { action: "click", id: "marsa.search.bayline" },
    { action: "highlight", ids: ["marsa.listing.price", "marsa.listing.price_sqft", "marsa.listing.service"], note: `${aed(LISTINGS.bayline.price)}, plus about ${aed(LISTINGS.bayline.service * LISTINGS.bayline.sqft)} a year in service charge` },
    { action: "click", id: "marsa.listing.floorplan" },
    { action: "highlight", ids: ["marsa.floorplan.maids", "marsa.floorplan.kitchen"], note: "The maid's room is off the kitchen, with its own WC" },
    { action: "click", id: "marsa.floorplan.sun" },
    { action: "highlight", ids: ["marsa.floorplan.balcony", "marsa.floorplan.orientation"], note: "The balcony faces west: sunset over the marina" },
    { action: "click", id: "marsa.floorplan.back" },
    { action: "click", id: "marsa.listing.afford" },
    { action: "fill", fields: [{ id: "marsa.mortgage.down", value: "20" }, { id: "marsa.mortgage.years", value: "25" }] },
    { action: "highlight", ids: ["marsa.mortgage.rate"], note: `Fixed demo rate of ${RATE}%` },
    { action: "click", id: "marsa.mortgage.calculate" },
    { action: "highlight", ids: ["marsa.mortgage.monthly"], note: `${aed(DEMO.monthly)} a month for 25 years` },
    { action: "highlight", ids: ["marsa.mortgage.upfront", "marsa.mortgage.salary"], note: `Upfront ${aed(DEMO.downCash + DEMO.dld + DEMO.agency)}, salary about ${aed(DEMO.salary)}` },
    { action: "go_to", page: "agents" },
    { action: "click", id: "marsa.agents.filter_arabic" },
    { action: "highlight", ids: ["marsa.agents.layla"], note: "Layla lists Bayline and speaks Arabic" },
    { action: "click", id: "marsa.agents.layla_book" },
    { action: "click", id: "marsa.book.day_sat" },
    { action: "click", id: "marsa.book.slot_1100" },
    {
      action: "fill",
      fields: [
        { id: "marsa.book.name", value: "Khalid Rahman" },
        { id: "marsa.book.email", value: "khalid@example.com" },
        { id: "marsa.book.mobile", value: "055 987 6543" },
        { id: "marsa.book.language", value: "ar" },
      ],
    },
    { action: "click", id: "marsa.book.submit" },
    { action: "highlight", ids: ["marsa.book.confirmation"], note: "Booked. Layla gets the lead and confirms in Arabic" },
  ],
};
