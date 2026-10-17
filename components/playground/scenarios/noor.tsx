/** Noor Bank: a made-up UAE bank. Visitor tasks: compare cards, check fees abroad, read fees in Arabic, find a branch, apply. */
import type { CSSProperties, ReactNode } from "react";
import { Fraunces, IBM_Plex_Sans_Arabic } from "next/font/google";
import type { El, Effect, Scenario, Site, State } from "../engine/types";
import { MadeUp, MkButton, MkCheck, MkField, MkLink, MkSelect, MkTab } from "../engine/ui/site";

const display = Fraunces({ subsets: ["latin"], variable: "--nb-display", weight: ["500", "600"] });
const sans = IBM_Plex_Sans_Arabic({ subsets: ["arabic", "latin"], variable: "--nb-sans", weight: ["400", "500", "600"] });

/* ---------- data ---------- */

type CardId = "everyday" | "skymiles" | "platinum";
const CARDS: Record<CardId, {
  name: string; line: string; fee: string; feeShort: string; abroad: string; salary: number; perks: string[]; art: string;
}> = {
  everyday: {
    name: "Noor Everyday", line: "Cashback on the things you buy every week.", fee: "No annual fee", feeShort: "None",
    abroad: "2.99%", salary: 5000, perks: ["1% cashback on everything", "5% on groceries, up to AED 200 a month", "Contactless and Apple Pay"],
    art: "linear-gradient(135deg,#e9e2d3,#cfc3aa)",
  },
  skymiles: {
    name: "Noor Sky Miles", line: "For people who are often somewhere else.", fee: "AED 750 a year", feeShort: "AED 750",
    abroad: "0%", salary: 8000, perks: ["2 Noor Miles per AED 1 spent abroad", "1 mile per AED 1 at home", "4 airport lounge visits a year"],
    art: "linear-gradient(135deg,#1d6a7a,#0c3a46)",
  },
  platinum: {
    name: "Noor Platinum", line: "Dining, travel and a few nice extras.", fee: "Free for life*", feeShort: "AED 1,500*",
    abroad: "1.99%", salary: 15000, perks: ["3% cashback on dining and travel", "Valet parking at 12 malls", "Golf at 3 clubs, twice a month"],
    art: "linear-gradient(135deg,#2b2f36,#0e1013)",
  },
};
const CARD_IDS = Object.keys(CARDS) as CardId[];

const BRANCHES = [
  { id: "marina", name: "Dubai Marina", addr: "Marina Walk, Tower 3, ground floor", hours: "Sun to Thu 8:00 to 16:00 · Sat 10:00 to 16:00", sat: true, islamic: true },
  { id: "difc", name: "DIFC", addr: "Gate Avenue, Zone B, level 1", hours: "Mon to Fri 8:00 to 15:00", sat: false, islamic: true },
  { id: "deira", name: "Deira City Centre", addr: "Mall entrance 4, next to the cinema", hours: "Every day 10:00 to 22:00", sat: true, islamic: false },
  { id: "abudhabi", name: "Abu Dhabi, Al Maryah", addr: "Al Maryah Island, Galleria North", hours: "Sun to Thu 8:00 to 15:00 · Sat 10:00 to 14:00", sat: true, islamic: true },
] as const;

/* ---------- elements ---------- */

const f = (s: State, k: string) => s.flags[k] ?? "";
const onTab = (tab: string) => (s: State) => f(s, "fees_tab") === tab;
const cmp = (...show: string[]) => (s: State) => show.includes(f(s, "compare_filter"));
const step = (n: string) => (s: State) => f(s, "apply_step") === n;
const branchShown = (b: (typeof BRANCHES)[number]) => (s: State) =>
  f(s, "branch_filter") === "saturday" ? b.sat : f(s, "branch_filter") === "islamic" ? b.islamic : true;
const CARD_SHOWN: Record<CardId, (s: State) => boolean> = {
  everyday: cmp("all", "no_fee"),
  skymiles: cmp("all", "travel"),
  platinum: cmp("all", "no_fee", "travel"),
};

const els: El[] = [
  { id: "noor.nav.home", label: "Noor Bank home", kind: "link", page: "*", to: "home" },
  { id: "noor.nav.cards", label: "Cards", kind: "link", page: "*", to: "cards" },
  { id: "noor.nav.compare", label: "Compare", kind: "link", page: "*", to: "compare" },
  { id: "noor.nav.fees", label: "Fees & Charges", kind: "link", page: "*", to: "fees" },
  { id: "noor.nav.branches", label: "Branches", kind: "link", page: "*", to: "branches" },
  { id: "noor.nav.apply", label: "Open an account", kind: "button", page: "*", to: "apply" },

  { id: "noor.home.hero", label: "Banking in plain light", kind: "text", page: "home" },
  { id: "noor.home.open_account", label: "Start your application", kind: "button", page: "home", to: "apply" },
  { id: "noor.home.see_cards", label: "Explore cards", kind: "button", page: "home", to: "cards" },
  { id: "noor.home.amana", label: "Amana Savings (Islamic account)", kind: "card", page: "home" },
  { id: "noor.home.amana_fees", label: "See account fees", kind: "link", page: "home", to: "fees", set: { fees_tab: "accounts" } },
  { id: "noor.home.compare_link", label: "Compare all cards", kind: "link", page: "home", to: "compare" },
  { id: "noor.home.branches_link", label: "Find a branch", kind: "link", page: "home", to: "branches" },

  ...CARD_IDS.flatMap((c): El[] => [
    { id: `noor.cards.${c}`, label: `${CARDS[c].name} card`, kind: "card", page: "cards" },
    { id: `noor.cards.${c}_fee`, label: `${CARDS[c].name} annual fee`, kind: "text", page: "cards" },
    { id: `noor.cards.${c}_apply`, label: `Apply for ${CARDS[c].name}`, kind: "button", page: "cards" },
  ]),
  { id: "noor.cards.platinum_fineprint", label: "Platinum fine print", kind: "text", page: "cards" },
  { id: "noor.cards.compare_link", label: "Compare cards side by side", kind: "link", page: "cards", to: "compare" },

  { id: "noor.compare.filter_all", label: "All cards", kind: "button", page: "compare", set: { compare_filter: "all" } },
  { id: "noor.compare.filter_no_fee", label: "No annual fee", kind: "button", page: "compare", set: { compare_filter: "no_fee" } },
  { id: "noor.compare.filter_travel", label: "Best for travel", kind: "button", page: "compare", set: { compare_filter: "travel" } },
  ...CARD_IDS.flatMap((c): El[] => [
    { id: `noor.compare.${c}_row`, label: `${CARDS[c].name} row`, kind: "card", page: "compare", when: CARD_SHOWN[c] },
    { id: `noor.compare.${c}_fee`, label: `${CARDS[c].name} annual fee`, kind: "text", page: "compare", when: CARD_SHOWN[c] },
    { id: `noor.compare.${c}_abroad`, label: `${CARDS[c].name} fee abroad`, kind: "text", page: "compare", when: CARD_SHOWN[c] },
  ]),
  { id: "noor.compare.fineprint", label: "Note on Platinum's waived fee", kind: "text", page: "compare", when: cmp("no_fee") },
  { id: "noor.compare.fees_link", label: "See all fees and charges", kind: "link", page: "compare", to: "fees" },

  { id: "noor.fees.tab_cards", label: "Cards tab", kind: "button", page: "fees", set: { fees_tab: "cards" } },
  { id: "noor.fees.tab_accounts", label: "Accounts tab", kind: "button", page: "fees", set: { fees_tab: "accounts" } },
  { id: "noor.fees.tab_abroad", label: "Spending abroad tab", kind: "button", page: "fees", set: { fees_tab: "abroad" } },
  { id: "noor.fees.lang_en", label: "English", kind: "button", page: "fees", set: { fees_lang: "en" } },
  { id: "noor.fees.lang_ar", label: "Arabic (العربية)", kind: "button", page: "fees", set: { fees_lang: "ar" } },
  { id: "noor.fees.cards_annual", label: "Annual fee row", kind: "text", page: "fees", when: onTab("cards") },
  { id: "noor.fees.cards_late", label: "Late payment fee row", kind: "text", page: "fees", when: onTab("cards") },
  { id: "noor.fees.cards_cash", label: "Cash advance fee row", kind: "text", page: "fees", when: onTab("cards") },
  { id: "noor.fees.accounts_current", label: "Current account monthly fee row", kind: "text", page: "fees", when: onTab("accounts") },
  { id: "noor.fees.accounts_amana", label: "Amana Savings fee row", kind: "text", page: "fees", when: onTab("accounts") },
  { id: "noor.fees.abroad_purchase", label: "Foreign currency purchases row", kind: "text", page: "fees", when: onTab("abroad") },
  { id: "noor.fees.abroad_atm", label: "ATM cash abroad row", kind: "text", page: "fees", when: onTab("abroad") },
  { id: "noor.fees.abroad_tip", label: "Tip: pay in local currency", kind: "text", page: "fees", when: onTab("abroad") },

  { id: "noor.apply.name", label: "Full name", kind: "field", page: "apply", when: step("1") },
  { id: "noor.apply.email", label: "Email", kind: "field", page: "apply", input: "email", when: step("1") },
  { id: "noor.apply.mobile", label: "Mobile number", kind: "field", page: "apply", input: "tel", when: step("1") },
  { id: "noor.apply.salary", label: "Monthly salary (AED)", kind: "field", page: "apply", input: "number", when: step("1") },
  {
    id: "noor.apply.account", label: "Account type", kind: "field", page: "apply", when: step("1"),
    options: [{ value: "current", label: "Current account" }, { value: "amana", label: "Amana Savings (Islamic)" }],
  },
  { id: "noor.apply.salary_note", label: "Salary rules", kind: "text", page: "apply", when: step("1") },
  { id: "noor.apply.next", label: "Next", kind: "button", page: "apply", when: step("1") },
  { id: "noor.apply.summary", label: "Your details", kind: "card", page: "apply", when: step("2") },
  {
    id: "noor.apply.card", label: "Add a credit card", kind: "field", page: "apply", when: step("2"),
    options: [{ value: "none", label: "No card for now" }, ...CARD_IDS.map((c) => ({ value: c, label: CARDS[c].name }))],
  },
  {
    id: "noor.apply.branch", label: "Branch to visit with your Emirates ID", kind: "field", page: "apply", when: step("2"),
    options: BRANCHES.map((b) => ({ value: b.id, label: b.name })),
  },
  { id: "noor.apply.consent", label: "I agree to the terms", kind: "button", page: "apply", when: step("2") },
  { id: "noor.apply.back", label: "Back", kind: "button", page: "apply", when: step("2"), set: { apply_step: "1" } },
  { id: "noor.apply.submit", label: "Submit application", kind: "button", page: "apply", when: step("2") },
  { id: "noor.apply.confirmation", label: "Application received", kind: "text", page: "apply", when: step("done") },
  { id: "noor.apply.done_home", label: "Back to Noor Bank home", kind: "link", page: "apply", when: step("done"), to: "home" },

  { id: "noor.branches.filter_all", label: "All branches", kind: "button", page: "branches", set: { branch_filter: "all" } },
  { id: "noor.branches.filter_saturday", label: "Open on Saturday", kind: "button", page: "branches", set: { branch_filter: "saturday" } },
  { id: "noor.branches.filter_islamic", label: "Islamic banking desk", kind: "button", page: "branches", set: { branch_filter: "islamic" } },
  ...BRANCHES.map((b): El => ({ id: `noor.branches.${b.id}`, label: `${b.name} branch`, kind: "card", page: "branches", when: branchShown(b) })),
];

/* ---------- rules ---------- */

const num = (x: string | undefined) => Number(String(x ?? "").replace(/[^\d.]/g, "")) || 0;
const aed = (n: number) => `AED ${n.toLocaleString("en-US")}`;

function ref(s: State) {
  let h = 7;
  for (const ch of `${s.values["noor.apply.name"]}${s.values["noor.apply.email"]}`) h = (h * 31 + ch.charCodeAt(0)) % 90000;
  return `NB-${10000 + h}`;
}

function onClick(s: State, id: string): Effect | null {
  const v = (k: string) => (s.values[`noor.apply.${k}`] ?? "").trim();
  const card = id.match(/^noor\.cards\.(everyday|skymiles|platinum)_apply$/)?.[1] as CardId | undefined;
  if (card) return { go: "apply", values: { "noor.apply.card": card }, say: `chose ${CARDS[card].name} and opened Apply` };

  if (id === "noor.apply.next") {
    if (v("name").split(/\s+/).length < 2) return { error: "Full name needs a first and last name (noor.apply.name)." };
    if (!/^\S+@\S+\.\S+$/.test(v("email"))) return { error: "Email looks wrong (noor.apply.email)." };
    if (v("mobile").replace(/\D/g, "").length < 9) return { error: "Mobile number needs at least 9 digits (noor.apply.mobile)." };
    if (num(v("salary")) <= 0) return { error: "Add a monthly salary in AED (noor.apply.salary)." };
    if (!v("account")) return { error: "Choose an account type (noor.apply.account)." };
    return { set: { apply_step: "2" }, say: "checked the details and went to step 2" };
  }
  if (id === "noor.apply.consent") return { set: { consent: f(s, "consent") ? "" : "yes" }, say: f(s, "consent") ? "unticked the terms" : "ticked the terms" };
  if (id === "noor.apply.submit") {
    const c = v("card") as CardId | "none" | "";
    const salary = num(v("salary"));
    if (!c) return { error: "Choose a card, or \"No card for now\" (noor.apply.card)." };
    if (c !== "none" && salary < CARDS[c].salary)
      return { error: `${CARDS[c].name} needs a salary of ${aed(CARDS[c].salary)} a month; the form says ${aed(salary)}. Pick another card or "none".` };
    if (!v("branch")) return { error: "Choose a branch (noor.apply.branch)." };
    if (!f(s, "consent")) return { error: "Tick \"I agree to the terms\" first (noor.apply.consent)." };
    return { set: { apply_step: "done" }, outcome: "APPLIED", say: `submitted the application, ${ref(s)}` };
  }
  return null;
}

/* ---------- pages ---------- */

const Section = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <section className={`mx-auto w-full max-w-5xl px-5 @3xl:px-8 ${className}`}>{children}</section>
);
const Eyebrow = ({ children }: { children: ReactNode }) => (
  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--mk-accent-ink)]">{children}</p>
);
const H1 = ({ children }: { children: ReactNode }) => (
  <h1 className="mk-display mt-2 text-3xl font-semibold leading-tight text-[var(--mk-ink)] @3xl:text-4xl">{children}</h1>
);

function Logo() {
  return (
    <span className="flex items-center gap-2">
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden>
        <circle cx="13" cy="13" r="12" fill="var(--mk-primary)" />
        <circle cx="13" cy="13" r="5.5" fill="var(--mk-accent)" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <rect key={a} x="12.3" y="3.2" width="1.4" height="2.6" rx="0.7" fill="var(--mk-accent)" transform={`rotate(${a} 13 13)`} />
        ))}
      </svg>
      <span className="mk-display text-lg font-semibold tracking-tight text-[var(--mk-ink)]">Noor Bank</span>
    </span>
  );
}

function Header({ site, page }: { site: Site; page: string }) {
  const links = ["cards", "compare", "fees", "branches"];
  return (
    <header className="sticky top-0 z-10 border-b border-[var(--mk-line)] bg-[var(--mk-surface)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3 @3xl:flex-nowrap @3xl:px-8">
        <button {...site.hit("noor.nav.home")} aria-label="Noor Bank home"><Logo /></button>
        <nav className="order-3 -mx-1 flex w-full gap-1 overflow-x-auto @3xl:order-none @3xl:w-auto">
          {links.map((p) => (
            <button
              key={p}
              {...site.hit(`noor.nav.${p}`)}
              className={`whitespace-nowrap rounded-md px-2.5 py-1.5 text-sm transition ${page === p ? "font-semibold text-[var(--mk-primary)]" : "text-[var(--mk-muted)] hover:text-[var(--mk-ink)]"}`}
            >
              {site.el(`noor.nav.${p}`)?.label}
            </button>
          ))}
        </nav>
        <MkButton site={site} id="noor.nav.apply" className="ml-auto !py-2" />
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--mk-line)] bg-[var(--mk-surface)]">
      <Section className="flex flex-col gap-3 py-6 @3xl:flex-row @3xl:items-center @3xl:justify-between">
        <Logo />
        <MadeUp name="Noor Bank" />
      </Section>
    </footer>
  );
}

function CardArt({ id, className = "" }: { id: CardId; className?: string }) {
  const dark = id !== "everyday";
  return (
    <div className={`relative aspect-[1.586] overflow-hidden rounded-xl p-4 shadow-[0_10px_30px_-12px_rgba(20,33,43,0.45)] ${className}`} style={{ background: CARDS[id].art }}>
      <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-[var(--mk-accent)] opacity-25 blur-[2px]" />
      <p className={`mk-display text-sm font-semibold ${dark ? "text-white" : "text-[var(--mk-ink)]"}`}>{CARDS[id].name.replace("Noor ", "")}</p>
      <div className="absolute bottom-4 left-4 h-6 w-8 rounded-md bg-gradient-to-br from-[#e8cf8f] to-[#b98a35]" />
      <p className={`absolute bottom-4 right-4 font-mono text-[11px] tracking-widest ${dark ? "text-white/70" : "text-[var(--mk-ink)]/60"}`}>NOOR</p>
    </div>
  );
}

function Home({ site }: { site: Site }) {
  return (
    <>
      <Section className="grid items-center gap-8 pb-10 pt-10 @3xl:grid-cols-[1.15fr_1fr] @3xl:pt-14">
        <div>
          <Eyebrow>Personal banking in the UAE</Eyebrow>
          <h1 {...site.mark("noor.home.hero")} className="mk-display mt-3 text-4xl font-semibold leading-[1.05] text-[var(--mk-ink)] @3xl:text-5xl">
            Banking in plain light.
          </h1>
          <p className="mt-4 max-w-md leading-relaxed text-[var(--mk-muted)]">
            Current accounts, cards and Islamic savings, with every fee written down where you can find it.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <MkButton site={site} id="noor.home.open_account" />
            <MkButton site={site} id="noor.home.see_cards" variant="outline" />
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-sm">
          <CardArt id="skymiles" className="rotate-[-6deg]" />
          <CardArt id="everyday" className="absolute inset-x-6 top-10 rotate-[4deg]" />
        </div>
      </Section>

      <Section>
        <div className="grid gap-px overflow-hidden rounded-[var(--mk-radius)] border border-[var(--mk-line)] bg-[var(--mk-line)] @2xl:grid-cols-3">
          {[
            ["No monthly fee", "when your salary of AED 5,000 or more comes to Noor"],
            ["Open on Saturdays", "at three of our four branches"],
            ["English and Arabic", "in the app, in branch and on the phone"],
          ].map(([a, b]) => (
            <div key={a} className="bg-[var(--mk-surface)] p-4">
              <p className="font-semibold text-[var(--mk-ink)]">{a}</p>
              <p className="mt-1 text-sm text-[var(--mk-muted)]">{b}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="mt-10 grid gap-5 @3xl:grid-cols-2">
        <div {...site.mark("noor.home.amana")} className="rounded-[var(--mk-radius)] border border-[var(--mk-line)] bg-[var(--mk-surface)] p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Eyebrow>Islamic banking</Eyebrow>
              <h2 className="mk-display mt-2 text-2xl font-semibold text-[var(--mk-ink)]">Amana Savings</h2>
            </div>
            <p lang="ar" dir="rtl" className="text-right text-lg font-medium text-[var(--mk-primary)]">حساب أمانة للتوفير</p>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[var(--mk-muted)]">
            A Sharia-compliant savings account, reviewed by our Sharia board. Expected profit rate 3.10% a year, paid
            monthly. No monthly fee and no minimum balance.
          </p>
          <p lang="ar" dir="rtl" className="mt-2 text-sm leading-relaxed text-[var(--mk-muted)]">
            حساب توفير متوافق مع أحكام الشريعة، بربح متوقع 3.10٪ سنوياً يُدفع كل شهر.
          </p>
          <MkLink site={site} id="noor.home.amana_fees" className="mt-4 text-sm">See account fees →</MkLink>
        </div>
        <div className="flex flex-col justify-between rounded-[var(--mk-radius)] bg-[var(--mk-primary)] p-6 text-[var(--mk-on-primary)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--mk-accent)]">Credit cards</p>
            <h2 className="mk-display mt-2 text-2xl font-semibold">Three cards. One honest table.</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/75">
              Annual fees, fees abroad and the salary each card needs, side by side.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <button {...site.hit("noor.home.compare_link")} className="font-semibold text-[var(--mk-accent)] hover:underline">Compare all cards →</button>
            <button {...site.hit("noor.home.branches_link")} className="font-semibold text-white/85 hover:underline">Find a branch →</button>
          </div>
        </div>
      </Section>
    </>
  );
}

function Cards({ site }: { site: Site }) {
  return (
    <>
      <Section className="pt-10">
        <Eyebrow>Credit cards</Eyebrow>
        <H1>Pick the card that fits how you spend</H1>
        <p className="mt-3 max-w-xl text-[var(--mk-muted)]">All three come with contactless, Apple Pay and Google Pay, and free supplementary cards for family.</p>
      </Section>
      <Section className="mt-8 grid gap-5 @3xl:grid-cols-3">
        {CARD_IDS.map((c) => (
          <article key={c} {...site.mark(`noor.cards.${c}`)} className="flex flex-col rounded-[var(--mk-radius)] border border-[var(--mk-line)] bg-[var(--mk-surface)] p-5">
            <CardArt id={c} />
            <h2 className="mk-display mt-5 text-xl font-semibold text-[var(--mk-ink)]">{CARDS[c].name}</h2>
            <p className="mt-1 text-sm text-[var(--mk-muted)]">{CARDS[c].line}</p>
            <p {...site.mark(`noor.cards.${c}_fee`)} className="mt-4 text-lg font-semibold text-[var(--mk-ink)]">
              {CARDS[c].fee}
              {c === "everyday" && <span className="ml-2 rounded-full bg-[var(--mk-primary)]/10 px-2 py-0.5 align-middle text-xs font-semibold text-[var(--mk-primary)]">Always</span>}
            </p>
            <ul className="mt-3 flex-1 space-y-1.5 text-sm text-[var(--mk-ink)]">
              {CARDS[c].perks.map((p) => (
                <li key={p} className="flex gap-2"><span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--mk-accent)]" />{p}</li>
              ))}
              <li className="flex gap-2 text-[var(--mk-muted)]"><span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--mk-line-strong)]" />Minimum salary {aed(CARDS[c].salary)} a month</li>
            </ul>
            {c === "platinum" && (
              <p {...site.mark("noor.cards.platinum_fineprint")} className="mt-3 text-[11px] leading-snug text-[var(--mk-muted)]">
                *The AED 1,500 annual fee is waived only with AED 5,000 monthly spend. Miss a month and the full fee is charged at renewal.
              </p>
            )}
            <MkButton site={site} id={`noor.cards.${c}_apply`} variant={c === "everyday" ? "primary" : "outline"} className="mt-5 w-full">Apply</MkButton>
          </article>
        ))}
      </Section>
      <Section className="mt-6">
        <MkLink site={site} id="noor.cards.compare_link">Compare cards side by side →</MkLink>
      </Section>
    </>
  );
}

function Compare({ site }: { site: Site }) {
  const filter = site.flag("compare_filter") || "all";
  const rows = CARD_IDS.filter((c) => CARD_SHOWN[c](site.s));
  return (
    <>
      <Section className="pt-10">
        <Eyebrow>Compare</Eyebrow>
        <H1>Cards, side by side</H1>
        <div className="mt-5 flex flex-wrap gap-2">
          <MkTab site={site} id="noor.compare.filter_all" active={filter === "all"} />
          <MkTab site={site} id="noor.compare.filter_no_fee" active={filter === "no_fee"} />
          <MkTab site={site} id="noor.compare.filter_travel" active={filter === "travel"} />
        </div>
      </Section>
      <Section className="mt-6">
        <div className="overflow-x-auto rounded-[var(--mk-radius)] border border-[var(--mk-line)] bg-[var(--mk-surface)]">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-[var(--mk-line)] text-xs uppercase tracking-wider text-[var(--mk-muted)]">
              <tr>
                <th className="px-4 py-3 font-medium">Card</th>
                <th className="px-4 py-3 font-medium">Annual fee</th>
                <th className="px-4 py-3 font-medium">Fee abroad</th>
                <th className="px-4 py-3 font-medium">Min. salary</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c} {...site.mark(`noor.compare.${c}_row`)} className="border-b border-[var(--mk-line)] last:border-0">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-[var(--mk-ink)]">{CARDS[c].name}</p>
                    <p className="text-xs text-[var(--mk-muted)]">{CARDS[c].perks[0]}</p>
                  </td>
                  <td className="px-4 py-4"><span {...site.mark(`noor.compare.${c}_fee`)} className="font-medium text-[var(--mk-ink)]">{CARDS[c].feeShort}</span></td>
                  <td className="px-4 py-4"><span {...site.mark(`noor.compare.${c}_abroad`)} className="font-medium text-[var(--mk-ink)]">{CARDS[c].abroad}</span></td>
                  <td className="px-4 py-4 text-[var(--mk-muted)]">{aed(CARDS[c].salary)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filter === "no_fee" && (
          <p {...site.mark("noor.compare.fineprint")} className="mt-4 rounded-[var(--mk-radius)] border border-[var(--mk-accent)]/40 bg-[var(--mk-accent)]/10 p-4 text-sm leading-relaxed text-[var(--mk-ink)]">
            *Platinum is listed because its AED 1,500 fee can be waived, but only with AED 5,000 spend every month.
            Noor Everyday is the only card with no annual fee at all.
          </p>
        )}
        <MkLink site={site} id="noor.compare.fees_link" className="mt-6 text-sm">See all fees and charges →</MkLink>
      </Section>
    </>
  );
}

const T = {
  en: {
    title: "Fees & Charges", sub: "Every fee we charge, written down.", fee: "Fee",
    tabs: { cards: "Cards", accounts: "Accounts", abroad: "Spending abroad" },
    annual: ["Annual fee", "None", "AED 750", "AED 1,500, waived with AED 5,000 monthly spend"],
    late: ["Late payment", "AED 230", "AED 230", "AED 230"],
    cash: ["Cash advance", "3%, min. AED 99", "3%, min. AED 99", "3%, min. AED 99"],
    current: ["Current account, monthly fee", "AED 25", "Waived when a salary of AED 5,000 or more is paid in"],
    amana: ["Amana Savings (Islamic)", "No fee", "Expected profit 3.10% a year, paid monthly"],
    amount: "Amount", waived: "Good to know",
    purchase: ["Purchases in a foreign currency", "2.99%", "0%", "1.99%"],
    atm: ["Cash from an ATM abroad", "AED 25 + 2.99%", "AED 25", "AED 25 + 1.99%"],
    tip: "Tip: if a shop or ATM abroad offers to charge you in dirhams, say no. Paying in the local currency avoids a conversion markup of up to 3% set by the merchant.",
    vat: "All fees include 5% VAT.",
  },
  ar: {
    title: "الرسوم والتكاليف", sub: "كل رسم نفرضه، مكتوب بوضوح.", fee: "الرسم",
    tabs: { cards: "البطاقات", accounts: "الحسابات", abroad: "الإنفاق في الخارج" },
    annual: ["الرسوم السنوية", "لا توجد", "750 درهماً", "1,500 درهم، تُعفى عند إنفاق 5,000 درهم شهرياً"],
    late: ["رسوم التأخر في السداد", "230 درهماً", "230 درهماً", "230 درهماً"],
    cash: ["السحب النقدي", "3٪، بحد أدنى 99 درهماً", "3٪، بحد أدنى 99 درهماً", "3٪، بحد أدنى 99 درهماً"],
    current: ["الحساب الجاري، رسوم شهرية", "25 درهماً", "تُعفى عند تحويل راتب بقيمة 5,000 درهم أو أكثر"],
    amana: ["حساب أمانة للتوفير (متوافق مع الشريعة)", "بدون رسوم", "ربح متوقع 3.10٪ سنوياً، يُدفع شهرياً"],
    amount: "المبلغ", waived: "معلومة مفيدة",
    purchase: ["المشتريات بعملة أجنبية", "2.99٪", "0٪", "1.99٪"],
    atm: ["السحب من الصراف الآلي في الخارج", "25 درهماً + 2.99٪", "25 درهماً", "25 درهماً + 1.99٪"],
    tip: "نصيحة: إذا عرض عليك متجر أو صراف آلي في الخارج الدفع بالدرهم، فارفض. الدفع بالعملة المحلية يجنّبك هامش تحويل يصل إلى 3٪ يحدده التاجر.",
    vat: "جميع الرسوم تشمل ضريبة القيمة المضافة 5٪.",
  },
};

function Fees({ site }: { site: Site }) {
  const lang = site.flag("fees_lang") === "ar" ? "ar" : "en";
  const tab = (site.flag("fees_tab") || "cards") as "cards" | "accounts" | "abroad";
  const t = T[lang];
  const Row = ({ id, cells }: { id: string; cells: string[] }) => (
    <tr {...site.mark(id)} className="border-b border-[var(--mk-line)] last:border-0">
      {cells.map((c, i) => (
        <td key={i} className={`px-4 py-3.5 align-top ${i === 0 ? "font-medium text-[var(--mk-ink)]" : "text-[var(--mk-ink)]/85"}`}>{c}</td>
      ))}
    </tr>
  );
  const head = tab === "accounts" ? [t.fee, t.amount, t.waived] : [t.fee, "Everyday", "Sky Miles", "Platinum"];
  return (
    <>
      <Section className="pt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
            <Eyebrow>{lang === "ar" ? "نور بنك" : "Pricing"}</Eyebrow>
            <H1>{t.title}</H1>
            <p className="mt-2 text-[var(--mk-muted)]">{t.sub}</p>
          </div>
          <div className="flex gap-1 rounded-full bg-[var(--mk-surface)] p-1 ring-1 ring-[var(--mk-line)]">
            <MkTab site={site} id="noor.fees.lang_en" active={lang === "en"} className="!py-1 !ring-0">English</MkTab>
            <MkTab site={site} id="noor.fees.lang_ar" active={lang === "ar"} className="!py-1 !ring-0">العربية</MkTab>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2" dir={lang === "ar" ? "rtl" : "ltr"}>
          {(["cards", "accounts", "abroad"] as const).map((k) => (
            <MkTab key={k} site={site} id={`noor.fees.tab_${k}`} active={tab === k}>{t.tabs[k]}</MkTab>
          ))}
        </div>
      </Section>
      <Section className="mt-5">
        <div lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} className="overflow-x-auto rounded-[var(--mk-radius)] border border-[var(--mk-line)] bg-[var(--mk-surface)]">
          <table className="w-full min-w-[560px] text-start text-sm">
            <thead className="border-b border-[var(--mk-line)] bg-[var(--mk-bg)] text-xs text-[var(--mk-muted)]">
              <tr>{head.map((h) => <th key={h} className="px-4 py-3 text-start font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody>
              {tab === "cards" && (
                <>
                  <Row id="noor.fees.cards_annual" cells={t.annual} />
                  <Row id="noor.fees.cards_late" cells={t.late} />
                  <Row id="noor.fees.cards_cash" cells={t.cash} />
                </>
              )}
              {tab === "accounts" && (
                <>
                  <Row id="noor.fees.accounts_current" cells={t.current} />
                  <Row id="noor.fees.accounts_amana" cells={t.amana} />
                </>
              )}
              {tab === "abroad" && (
                <>
                  <Row id="noor.fees.abroad_purchase" cells={t.purchase} />
                  <Row id="noor.fees.abroad_atm" cells={t.atm} />
                </>
              )}
            </tbody>
          </table>
          {tab === "abroad" && (
            <p {...site.mark("noor.fees.abroad_tip")} className="border-t border-[var(--mk-line)] bg-[var(--mk-accent)]/10 px-4 py-3.5 text-sm leading-relaxed text-[var(--mk-ink)]">
              {t.tip}
            </p>
          )}
        </div>
        <p lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} className="mt-3 text-xs text-[var(--mk-muted)]">{t.vat}</p>
      </Section>
    </>
  );
}

function Apply({ site }: { site: Site }) {
  const st = site.flag("apply_step") || "1";
  const v = (k: string) => site.s.values[`noor.apply.${k}`] ?? "";
  const label = (id: string, val: string) => site.el(id)?.options?.find((o) => o.value === val)?.label ?? val;
  return (
    <Section className="pt-10">
      <div className="mx-auto max-w-2xl">
        <Eyebrow>Open an account</Eyebrow>
        <H1>{st === "done" ? "You are all set" : st === "2" ? "Card and branch" : "About you"}</H1>
        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-[var(--mk-muted)]">
          {["About you", "Card and branch", "Done"].map((x, i) => {
            const on = i < (st === "done" ? 3 : Number(st));
            return (
              <span key={x} className="flex items-center gap-2">
                <span className={`grid h-5 w-5 place-items-center rounded-full text-[11px] ${on ? "bg-[var(--mk-primary)] text-[var(--mk-on-primary)]" : "bg-[var(--mk-line)] text-[var(--mk-muted)]"}`}>{i + 1}</span>
                <span className={on ? "text-[var(--mk-ink)]" : ""}>{x}</span>
                {i < 2 && <span className="h-px w-6 bg-[var(--mk-line-strong)]" />}
              </span>
            );
          })}
        </div>

        <div className="mt-6 rounded-[var(--mk-radius)] border border-[var(--mk-line)] bg-[var(--mk-surface)] p-5 @3xl:p-7">
          {st === "1" && (
            <div className="grid gap-4 @xl:grid-cols-2">
              <MkField site={site} id="noor.apply.name" placeholder="As on your Emirates ID" className="@xl:col-span-2" />
              <MkField site={site} id="noor.apply.email" placeholder="you@example.com" />
              <MkField site={site} id="noor.apply.mobile" placeholder="050 000 0000" />
              <MkField site={site} id="noor.apply.salary" placeholder="12000" hint="Before deductions, per month" />
              <MkSelect site={site} id="noor.apply.account" />
              <div {...site.mark("noor.apply.salary_note")} className="rounded-[var(--mk-radius)] border border-[var(--mk-accent)]/40 bg-[var(--mk-accent)]/10 p-4 text-sm leading-relaxed text-[var(--mk-ink)] @xl:col-span-2">
                <p className="font-semibold">Salary rules</p>
                <p className="mt-1">
                  With a salary of <strong>AED 5,000 or more</strong> paid into Noor, the current account has no monthly fee.
                  Below that it costs AED 25 a month. Cards need more: Sky Miles AED 8,000, Platinum AED 15,000.
                </p>
              </div>
              <div className="flex justify-end @xl:col-span-2">
                <MkButton site={site} id="noor.apply.next" className="min-w-32">Next</MkButton>
              </div>
            </div>
          )}
          {st === "2" && (
            <div className="grid gap-4 @xl:grid-cols-2">
              <div {...site.mark("noor.apply.summary")} className="rounded-[var(--mk-radius)] bg-[var(--mk-bg)] p-4 text-sm @xl:col-span-2">
                <p className="font-semibold text-[var(--mk-ink)]">{v("name")}</p>
                <p className="mt-0.5 text-[var(--mk-muted)]">
                  {v("email")} · {v("mobile")} · {aed(num(v("salary")))} a month · {label("noor.apply.account", v("account"))}
                </p>
              </div>
              <MkSelect site={site} id="noor.apply.card" />
              <MkSelect site={site} id="noor.apply.branch" hint="Bring your Emirates ID to finish" />
              <MkCheck site={site} id="noor.apply.consent" checked={!!site.flag("consent")} className="@xl:col-span-2">
                I agree to the account terms and the fees table. (Made up, like the rest of this bank.)
              </MkCheck>
              <div className="flex items-center justify-between gap-3 @xl:col-span-2">
                <MkButton site={site} id="noor.apply.back" variant="outline">Back</MkButton>
                <MkButton site={site} id="noor.apply.submit" />
              </div>
            </div>
          )}
          {st === "done" && (
            <div {...site.mark("noor.apply.confirmation")}>
              <div className="grid h-11 w-11 place-items-center rounded-full bg-[var(--mk-primary)] text-[var(--mk-on-primary)]">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m4.5 10.5 3.5 3.5 7.5-8" /></svg>
              </div>
              <p className="mk-display mt-4 text-2xl font-semibold text-[var(--mk-ink)]">Application received</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--mk-muted)]">
                Reference <strong className="font-mono text-[var(--mk-ink)]">{ref(site.s)}</strong>. We will email {v("email")} within one
                working day. Bring your Emirates ID to the {label("noor.apply.branch", v("branch"))} branch to finish.
                {v("card") && v("card") !== "none" && <> Your {label("noor.apply.card", v("card"))} card is part of the application.</>}
              </p>
              <MkLink site={site} id="noor.apply.done_home" className="mt-5 text-sm">Back to Noor Bank home →</MkLink>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

function Branches({ site }: { site: Site }) {
  const filter = site.flag("branch_filter") || "all";
  const list = BRANCHES.filter((b) => branchShown(b)(site.s));
  return (
    <>
      <Section className="pt-10">
        <Eyebrow>Branches</Eyebrow>
        <H1>Come and see us</H1>
        <div className="mt-5 flex flex-wrap gap-2">
          <MkTab site={site} id="noor.branches.filter_all" active={filter === "all"} />
          <MkTab site={site} id="noor.branches.filter_saturday" active={filter === "saturday"} />
          <MkTab site={site} id="noor.branches.filter_islamic" active={filter === "islamic"} />
        </div>
      </Section>
      <Section className="mt-6 grid gap-4 @2xl:grid-cols-2">
        {list.map((b) => (
          <article key={b.id} {...site.mark(`noor.branches.${b.id}`)} className="rounded-[var(--mk-radius)] border border-[var(--mk-line)] bg-[var(--mk-surface)] p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="mk-display text-lg font-semibold text-[var(--mk-ink)]">{b.name}</h2>
              <svg width="18" height="18" viewBox="0 0 18 18" className="mt-1 shrink-0 text-[var(--mk-primary)]" fill="currentColor" aria-hidden><path d="M9 1.5a5.5 5.5 0 0 0-5.5 5.5c0 4 5.5 9.5 5.5 9.5s5.5-5.5 5.5-9.5A5.5 5.5 0 0 0 9 1.5Zm0 7.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" /></svg>
            </div>
            <p className="mt-1 text-sm text-[var(--mk-muted)]">{b.addr}</p>
            <p className="mt-3 text-sm text-[var(--mk-ink)]">{b.hours}</p>
            <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
              {b.sat && <span className="rounded-full bg-[var(--mk-primary)]/10 px-2 py-0.5 font-medium text-[var(--mk-primary)]">Open Saturday</span>}
              {b.islamic && <span className="rounded-full bg-[var(--mk-accent)]/15 px-2 py-0.5 font-medium text-[var(--mk-accent-ink)]">Islamic banking desk</span>}
            </div>
          </article>
        ))}
      </Section>
    </>
  );
}

function NoorPage({ site, page }: { site: Site; page: string }) {
  return (
    <div className="flex min-h-full flex-col">
      <Header site={site} page={page} />
      <main className="flex-1">
        {page === "home" && <Home site={site} />}
        {page === "cards" && <Cards site={site} />}
        {page === "compare" && <Compare site={site} />}
        {page === "fees" && <Fees site={site} />}
        {page === "apply" && <Apply site={site} />}
        {page === "branches" && <Branches site={site} />}
      </main>
      <Footer />
    </div>
  );
}

/* ---------- scenario ---------- */

export const noor: Scenario = {
  id: "noor",
  name: "Noor Bank",
  domain: "noor-bank.example",
  task: "Compare cards, check fees abroad, read them in Arabic, open an account.",
  label: "6 PAGES · APPLY",
  prompts: ["Which card has no annual fee?", "Open an account for me"],
  brand: {
    swatch: "#0f4c5c",
    className: `${display.variable} ${sans.variable}`,
    style: {
      "--mk-bg": "#f7f4ee",
      "--mk-surface": "#ffffff",
      "--mk-ink": "#14212b",
      "--mk-muted": "#5c6670",
      "--mk-line": "#e7e1d6",
      "--mk-line-strong": "#d3cab9",
      "--mk-primary": "#0f4c5c",
      "--mk-on-primary": "#ffffff",
      "--mk-accent": "#c9973f",
      "--mk-accent-ink": "#8a5f17",
      "--mk-on-accent": "#1d1405",
      "--mk-radius": "10px",
      "--mk-font": "var(--nb-sans), system-ui, sans-serif",
      "--mk-font-display": "var(--nb-display), Georgia, serif",
    } as CSSProperties,
  },
  pages: [
    { id: "home", path: "/", title: "Home" },
    { id: "cards", path: "/cards", title: "Cards" },
    { id: "compare", path: "/cards/compare", title: "Compare cards" },
    { id: "fees", path: "/fees-and-charges", title: "Fees & Charges" },
    { id: "apply", path: "/apply", title: "Open an account" },
    { id: "branches", path: "/branches", title: "Branches" },
  ],
  els,
  initial: { flags: { compare_filter: "all", fees_tab: "cards", fees_lang: "en", apply_step: "1", branch_filter: "all" } },
  tasks: [
    { goal: "Find the card with no annual fee (filter Compare by it)", done: (s) => f(s, "compare_filter") === "no_fee" },
    { goal: "Find the fee for paying abroad (Fees & Charges, Spending abroad)", done: (s) => f(s, "fees_tab") === "abroad" },
    { goal: "Read the fees table in Arabic", done: (s) => f(s, "fees_lang") === "ar" },
    { goal: "Find a branch open on Saturday", done: (s) => f(s, "branch_filter") === "saturday" },
    { goal: "Open an account (fill the form, submit)", done: (s) => s.outcome === "APPLIED" },
  ],
  onClick,
  Page: NoorPage,
  solution: [
    { action: "go_to", page: "cards" },
    { action: "highlight", ids: ["noor.cards.platinum_fee", "noor.cards.platinum_fineprint"], note: "\"Free for life\" only with AED 5,000 spend every month" },
    { action: "click", id: "noor.cards.compare_link" },
    { action: "click", id: "noor.compare.filter_no_fee" },
    { action: "highlight", ids: ["noor.compare.everyday_row", "noor.compare.fineprint"], note: "Everyday is the only card with no annual fee at all" },
    { action: "click", id: "noor.compare.fees_link" },
    { action: "click", id: "noor.fees.tab_abroad" },
    { action: "highlight", ids: ["noor.fees.abroad_purchase", "noor.fees.abroad_atm"], note: "Sky Miles charges 0% abroad, Everyday 2.99%" },
    { action: "click", id: "noor.fees.lang_ar" },
    { action: "highlight", ids: ["noor.fees.abroad_tip"], note: "Same table in Arabic, with the tip about paying in local currency" },
    { action: "go_to", page: "branches" },
    { action: "click", id: "noor.branches.filter_saturday" },
    { action: "highlight", ids: ["noor.branches.marina"], note: "Dubai Marina is open Saturday 10:00 to 16:00" },
    { action: "go_to", page: "apply" },
    {
      action: "fill",
      fields: [
        { id: "noor.apply.name", value: "Sara Al Mansoori" },
        { id: "noor.apply.email", value: "sara@example.com" },
        { id: "noor.apply.mobile", value: "050 123 4567" },
        { id: "noor.apply.salary", value: "12000" },
        { id: "noor.apply.account", value: "current" },
      ],
    },
    { action: "highlight", ids: ["noor.apply.salary_note"], note: "AED 12,000 clears the AED 5,000 rule: no monthly fee" },
    { action: "click", id: "noor.apply.next" },
    { action: "fill", fields: [{ id: "noor.apply.card", value: "skymiles" }, { id: "noor.apply.branch", value: "marina" }] },
    { action: "click", id: "noor.apply.consent" },
    { action: "click", id: "noor.apply.submit" },
    { action: "highlight", ids: ["noor.apply.confirmation"], note: "Done. Sara brings her Emirates ID to Dubai Marina" },
  ],
};
