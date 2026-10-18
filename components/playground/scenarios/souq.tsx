/** Souq Lane: a made-up UAE online store, signed in. Visitor tasks: check a return window, cash or credit, return sneakers, get a person for a broken bowl. */
import type { CSSProperties, ReactNode } from "react";
import { Bricolage_Grotesque, Readex_Pro } from "next/font/google";
import type { El, Effect, Scenario, Site, State } from "../engine/types";
import { MadeUp, MkButton, MkField, MkLink, MkSelect, MkTab } from "../engine/ui/site";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--sl-display", weight: ["600", "700"] });
const sans = Readex_Pro({ subsets: ["arabic", "latin"], variable: "--sl-sans", weight: ["400", "500", "600"] });

/* ---------- data ---------- */

type OrderId = "sneakers" | "bowl" | "throw" | "tees";
type Order = {
  no: string; item: string; detail: string; price: number; was?: number; placed: string;
  status: string; when: string; delivered: boolean; days: number; windowNote: string; art: string;
};
const ORDERS: Record<OrderId, Order> = {
  sneakers: {
    no: "SL-48213", item: "Dune Runner sneakers", detail: "Sand suede, size 42", price: 289, was: 459, placed: "Placed 1 Oct",
    status: "Delivered 12 days ago", when: "Mon 5 Oct, signed for by Layla", delivered: true, days: 12,
    windowNote: "Returnable until Mon 19 Oct: 2 days left", art: "#efe3cf",
  },
  bowl: {
    no: "SL-48577", item: "Fakhar serving bowl", detail: "Hand-thrown clay, 30 cm, made in Ras Al Khaimah", price: 145, placed: "Placed 12 Oct",
    status: "Delivered yesterday", when: "Fri 16 Oct, left with the building concierge", delivered: true, days: 1,
    windowNote: "Returnable until Fri 30 Oct: 13 days left", art: "#f1d9cc",
  },
  throw: {
    no: "SL-47102", item: "Linen throw", detail: "Olive, 130 x 170 cm", price: 210, placed: "Placed 2 Sep",
    status: "Delivered 41 days ago", when: "Sun 6 Sep", delivered: true, days: 41,
    windowNote: "Return window closed on 20 Sep", art: "#dfe3cf",
  },
  tees: {
    no: "SL-48901", item: "Everyday cotton tee, 3 pack", detail: "White, grey, navy, size M", price: 119, placed: "Placed 16 Oct",
    status: "On the way", when: "Arriving Mon 19 Oct, 9:00 to 13:00", delivered: false, days: 0,
    windowNote: "", art: "#dcdff0",
  },
};
const ORDER_IDS = Object.keys(ORDERS) as OrderId[];
const returnable = (o: OrderId) => ORDERS[o].delivered && ORDERS[o].days <= 14;
const onSale = (o: OrderId) => !!ORDERS[o].was;

const SLOTS = [
  { id: "sun_am", label: "Sun 18 Oct, 9:00 to 13:00", short: "Sun 9:00" },
  { id: "sun_pm", label: "Sun 18 Oct, 16:00 to 20:00", short: "Sun 16:00" },
  { id: "mon_am", label: "Mon 19 Oct, 9:00 to 13:00", short: "Mon 9:00" },
] as const;

const HELP_TOPICS = [
  { id: "where", label: "Where is my order?" },
  { id: "returns", label: "Returns and refunds" },
  { id: "damaged", label: "Damaged or wrong item" },
  { id: "payments", label: "Payments and store credit" },
] as const;

/* ---------- elements ---------- */

const f = (s: State, k: string) => s.flags[k] ?? "";
const viewing = (s: State) => (f(s, "order") || "sneakers") as OrderId;
const ord = (test: (o: OrderId, s: State) => boolean) => (s: State) => test(viewing(s), s);
const tab = (t: string) => (s: State) => f(s, "policy_tab") === t;
const retStep = (t: string) => (s: State) => f(s, "return_step") === t;
const damagedForm = (s: State) => f(s, "topic") === "damaged" && !f(s, "handed");

const els: El[] = [
  { id: "souq.nav.home", label: "Souq Lane home", kind: "link", page: "*", to: "orders" },
  { id: "souq.nav.orders", label: "My orders", kind: "link", page: "*", to: "orders" },
  { id: "souq.nav.policy", label: "Return policy", kind: "link", page: "*", to: "policy" },
  { id: "souq.nav.help", label: "Help", kind: "link", page: "*", to: "help" },

  { id: "souq.orders.greeting", label: "Welcome back, Layla", kind: "text", page: "orders" },
  ...ORDER_IDS.flatMap((o): El[] => [
    { id: `souq.orders.${o}`, label: `${ORDERS[o].item} order`, kind: "card", page: "orders" },
    { id: `souq.orders.${o}_open`, label: `View ${ORDERS[o].item} order`, kind: "link", page: "orders", to: "order", set: { order: o } },
  ]),
  { id: "souq.orders.policy_link", label: "How returns work", kind: "link", page: "orders", to: "policy" },

  { id: "souq.order.back", label: "All orders", kind: "link", page: "order", to: "orders" },
  { id: "souq.order.item", label: "Item in this order", kind: "card", page: "order" },
  { id: "souq.order.status", label: "Delivery status", kind: "text", page: "order" },
  { id: "souq.order.window", label: "Return window", kind: "text", page: "order", when: ord((o) => ORDERS[o].delivered) },
  { id: "souq.order.price", label: "Price paid", kind: "text", page: "order" },
  { id: "souq.order.sale_tag", label: "Sale tag", kind: "text", page: "order", when: ord((o) => onSale(o)) },
  { id: "souq.order.return_booked", label: "Return booked", kind: "text", page: "order", when: ord((o, s) => f(s, "returned") === o) },
  { id: "souq.order.start_return", label: "Start a return", kind: "button", page: "order", when: ord((o, s) => returnable(o) && f(s, "returned") !== o) },
  { id: "souq.order.report_problem", label: "Report a problem", kind: "button", page: "order", when: ord((o) => ORDERS[o].delivered) },
  { id: "souq.order.policy_link", label: "Read the return policy", kind: "link", page: "order", to: "policy" },

  { id: "souq.policy.tab_time", label: "Time limits", kind: "button", page: "policy", set: { policy_tab: "time" } },
  { id: "souq.policy.tab_refunds", label: "Refunds", kind: "button", page: "policy", set: { policy_tab: "refunds", refunds_seen: "yes" } },
  { id: "souq.policy.tab_damaged", label: "Damaged items", kind: "button", page: "policy", set: { policy_tab: "damaged" } },
  { id: "souq.policy.window", label: "14 days from delivery", kind: "text", page: "policy", when: tab("time") },
  { id: "souq.policy.condition", label: "Condition of returned items", kind: "text", page: "policy", when: tab("time") },
  { id: "souq.policy.excluded", label: "Items we cannot take back", kind: "text", page: "policy", when: tab("time") },
  { id: "souq.policy.full_price", label: "Full-price items: refund to card", kind: "text", page: "policy", when: tab("refunds") },
  { id: "souq.policy.sale", label: "Sale items: store credit only", kind: "text", page: "policy", when: tab("refunds") },
  { id: "souq.policy.credit", label: "How store credit works", kind: "text", page: "policy", when: tab("refunds") },
  { id: "souq.policy.damaged", label: "Arrived damaged: full refund to card", kind: "text", page: "policy", when: tab("damaged") },
  { id: "souq.policy.back_order", label: "Back to your order", kind: "link", page: "policy", to: "order", when: (s) => !!f(s, "order") },
  { id: "souq.policy.start_return", label: "Start a return", kind: "button", page: "policy", to: "return" },
  { id: "souq.policy.help_link", label: "Talk to us", kind: "link", page: "policy", to: "help" },

  {
    id: "souq.return.order", label: "Order to return", kind: "field", page: "return", when: retStep("form"),
    options: ORDER_IDS.filter(returnable).map((o) => ({ value: o, label: `${ORDERS[o].no}, ${ORDERS[o].item}` })),
  },
  {
    id: "souq.return.reason", label: "Reason for return", kind: "field", page: "return", when: retStep("form"),
    options: [
      { value: "too_small", label: "Too small" }, { value: "too_big", label: "Too big" },
      { value: "not_as_pictured", label: "Not as pictured" }, { value: "changed_mind", label: "Changed my mind" },
    ],
  },
  { id: "souq.return.details", label: "Anything we should know? (optional)", kind: "field", page: "return", when: retStep("form") },
  ...SLOTS.map((x): El => ({ id: `souq.return.slot_${x.id}`, label: `Pickup ${x.label}`, kind: "button", page: "return", when: retStep("form"), set: { slot: x.id } })),
  { id: "souq.return.address", label: "Pickup address", kind: "text", page: "return", when: retStep("form") },
  { id: "souq.return.refund", label: "How you get your money back", kind: "text", page: "return", when: retStep("form") },
  { id: "souq.return.submit", label: "Book the pickup", kind: "button", page: "return", when: retStep("form") },
  { id: "souq.return.confirmation", label: "Return booked", kind: "text", page: "return", when: retStep("done") },
  { id: "souq.return.done_orders", label: "Back to my orders", kind: "link", page: "return", to: "orders", when: retStep("done") },

  ...HELP_TOPICS.map((t): El => ({ id: `souq.help.topic_${t.id}`, label: t.label, kind: "button", page: "help", set: { topic: t.id } })),
  { id: "souq.help.answer_where", label: "Tracking answer", kind: "text", page: "help", when: (s) => f(s, "topic") === "where" },
  { id: "souq.help.answer_returns", label: "Returns answer", kind: "text", page: "help", when: (s) => f(s, "topic") === "returns" },
  { id: "souq.help.answer_payments", label: "Store credit answer", kind: "text", page: "help", when: (s) => f(s, "topic") === "payments" },
  { id: "souq.help.damaged_note", label: "What happens with damaged items", kind: "text", page: "help", when: damagedForm },
  { id: "souq.help.order", label: "Order number", kind: "field", page: "help", when: damagedForm },
  { id: "souq.help.photo", label: "Add a photo of the damage", kind: "button", page: "help", when: damagedForm },
  { id: "souq.help.message", label: "What happened?", kind: "field", page: "help", when: damagedForm },
  {
    id: "souq.help.lang", label: "Language for the chat", kind: "field", page: "help", when: damagedForm,
    options: [{ value: "en", label: "English" }, { value: "ar", label: "العربية (Arabic)" }],
  },
  { id: "souq.help.handoff", label: "Talk to a person", kind: "button", page: "help", when: damagedForm },
  { id: "souq.help.handed", label: "A person is joining", kind: "text", page: "help", when: (s) => !!f(s, "handed") },
];

/* ---------- rules ---------- */

const aed = (n: number) => `AED ${n.toLocaleString("en-US")}`;
const slotOf = (s: State) => SLOTS.find((x) => x.id === f(s, "slot"));

function ref(prefix: string, seed: string) {
  let h = 11;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) % 90000;
  return `${prefix}-${10000 + h}`;
}

function refundLine(o: OrderId | "") {
  if (!o) return "Pick an order to see how the refund works.";
  if (onSale(o)) return `Store credit, ${aed(ORDERS[o].price)}. This was a sale item, and sale items come back as Souq Lane credit.`;
  return `Refund to your Visa ending 4417, ${aed(ORDERS[o].price)}, 5 to 7 working days after pickup.`;
}

function onClick(s: State, id: string): Effect | null {
  const v = (k: string) => (s.values[k] ?? "").trim();
  const o = viewing(s);

  if (id === "souq.orders.sneakers_open") return { set: { seen_sneakers: "yes" }, say: "opened the Dune Runner sneakers order" };
  if (id === "souq.order.start_return")
    return { go: "return", set: { return_step: "form", slot: "" }, values: { "souq.return.order": o }, say: `started a return for ${ORDERS[o].no}` };
  if (id === "souq.order.report_problem")
    return { go: "help", set: { topic: "damaged" }, values: { "souq.help.order": ORDERS[o].no }, say: `opened Help with ${ORDERS[o].no} filled in` };

  if (id === "souq.return.submit") {
    const r = v("souq.return.order") as OrderId | "";
    if (!r) return { error: "Choose the order to return (souq.return.order)." };
    if (!v("souq.return.reason")) return { error: "Choose a reason (souq.return.reason)." };
    const slot = slotOf(s);
    if (!slot) return { error: "Pick a pickup slot (souq.return.slot_sun_am, souq.return.slot_sun_pm or souq.return.slot_mon_am)." };
    return { set: { return_step: "done", returned: r, order: r }, outcome: `RETURN BOOKED ${slot.short}`, say: `booked the pickup for ${ORDERS[r].no}, ${slot.label}` };
  }

  if (id === "souq.help.photo") return { set: { photo: f(s, "photo") ? "" : "yes" }, say: f(s, "photo") ? "removed the photo" : "added a photo: bowl-crack.jpg" };
  if (id === "souq.help.handoff") {
    if (!/^SL-?\d{5}$/i.test(v("souq.help.order"))) return { error: "Add the order number, like SL-48577 (souq.help.order)." };
    if (!f(s, "photo")) return { error: "Damaged items need a photo first (souq.help.photo)." };
    if (v("souq.help.message").length < 5) return { error: "Say in a few words what happened (souq.help.message)." };
    return { set: { handed: "yes" }, outcome: "HANDED OFF", say: `handed ${v("souq.help.order").toUpperCase()} to Mariam on the care team` };
  }
  return null;
}

/* ---------- pages ---------- */

const Section = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <section className={`mx-auto w-full max-w-5xl px-5 @3xl:px-8 ${className}`}>{children}</section>
);
const Crumb = ({ children }: { children: ReactNode }) => (
  <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--mk-muted)]">{children}</p>
);
const H1 = ({ children }: { children: ReactNode }) => (
  <h1 className="mk-display mt-2 text-3xl font-bold leading-tight text-[var(--mk-ink)] @3xl:text-[2.4rem]">{children}</h1>
);
const Panel = ({ children, className = "", mark }: { children: ReactNode; className?: string; mark?: { "data-el": string } }) => (
  <div {...mark} className={`rounded-[var(--mk-radius)] border border-[var(--mk-line)] bg-[var(--mk-surface)] ${className}`}>{children}</div>
);
const Callout = ({ children, className = "", mark }: { children: ReactNode; className?: string; mark?: { "data-el": string } }) => (
  <div {...mark} className={`rounded-[var(--mk-radius)] border border-[var(--mk-accent)]/35 bg-[var(--mk-accent)]/[0.08] p-4 text-sm leading-relaxed text-[var(--mk-ink)] ${className}`}>{children}</div>
);
const SaleTag = ({ o, mark }: { o: OrderId; mark?: { "data-el": string } }) => {
  const off = Math.round((1 - ORDERS[o].price / (ORDERS[o].was ?? ORDERS[o].price)) * 100);
  return (
    <span {...mark} className="inline-flex items-center gap-1 rounded-full bg-[var(--mk-accent)] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--mk-on-accent)]">
      Sale · {off}% off
    </span>
  );
};

function Logo() {
  return (
    <span className="flex items-center gap-2">
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden>
        <rect x="1" y="1" width="26" height="26" rx="8" fill="var(--mk-primary)" />
        <path d="M8 21V13a6 6 0 0 1 12 0v8" fill="none" stroke="var(--mk-accent)" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M11.5 21v-6.5a2.5 2.5 0 0 1 5 0V21" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <span className="mk-display text-lg font-bold tracking-tight text-[var(--mk-ink)]">Souq Lane</span>
      <span lang="ar" dir="rtl" className="hidden text-sm text-[var(--mk-muted)] @xl:inline">سوق لين</span>
    </span>
  );
}

function Header({ site, page }: { site: Site; page: string }) {
  const links = [["orders", ["orders", "order", "return"]], ["policy", ["policy"]], ["help", ["help"]]] as const;
  return (
    <header className="sticky top-0 z-10 border-b border-[var(--mk-line)] bg-[var(--mk-surface)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3 @3xl:flex-nowrap @3xl:px-8">
        <button {...site.hit("souq.nav.home")} aria-label="Souq Lane home"><Logo /></button>
        <nav className="order-3 -mx-1 flex w-full gap-1 overflow-x-auto @3xl:order-none @3xl:w-auto">
          {links.map(([p, on]) => (
            <button
              key={p}
              {...site.hit(`souq.nav.${p}`)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition ${(on as readonly string[]).includes(page) ? "bg-[var(--mk-primary)]/10 font-semibold text-[var(--mk-primary)]" : "text-[var(--mk-muted)] hover:text-[var(--mk-ink)]"}`}
            >
              {site.el(`souq.nav.${p}`)?.label}
            </button>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2.5 text-sm">
          <span className="hidden text-right leading-tight @xl:block">
            <span className="block font-medium text-[var(--mk-ink)]">Layla Haddad</span>
            <span className="block text-xs text-[var(--mk-muted)]">AED 40 credit</span>
          </span>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--mk-accent)] text-sm font-semibold text-[var(--mk-on-accent)]">LH</span>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--mk-line)] bg-[var(--mk-surface)]">
      <Section className="flex flex-col gap-3 py-6 @3xl:flex-row @3xl:items-center @3xl:justify-between">
        <Logo />
        <MadeUp name="Souq Lane" />
      </Section>
    </footer>
  );
}

/** A simple drawn product tile, so no photos are needed. */
function Art({ o, className = "" }: { o: OrderId; className?: string }) {
  const ink = "var(--mk-primary)";
  return (
    <div className={`grid shrink-0 place-items-center rounded-[calc(var(--mk-radius)-4px)] ${className}`} style={{ background: ORDERS[o].art }}>
      <svg viewBox="0 0 64 64" className="h-3/5 w-3/5" aria-hidden>
        {o === "sneakers" && (
          <>
            <path d="M6 40c0-6 3-14 8-16 4 3 9 4 13 2l6 6c6 3 16 3 22 5 3 1 4 4 3 7H6Z" fill="#c9a77a" />
            <path d="M6 44h52v4H8a2 2 0 0 1-2-2Z" fill="#fff" stroke={ink} strokeWidth="1.5" />
            <path d="M20 30l3 3m2-6 3 3m2-3 3 3" stroke={ink} strokeWidth="1.5" strokeLinecap="round" />
          </>
        )}
        {o === "bowl" && (
          <>
            <ellipse cx="32" cy="26" rx="24" ry="5" fill="#b2603d" />
            <path d="M8 26c1 13 11 20 24 20s23-7 24-20" fill="#cf7a52" />
            <path d="M24 46h16l-2 5H26Z" fill="#b2603d" />
            <path d="M42 30l-3 5 2 3-3 5" fill="none" stroke={ink} strokeWidth="1.6" strokeLinecap="round" />
          </>
        )}
        {o === "throw" && (
          <>
            <rect x="10" y="16" width="44" height="32" rx="3" fill="#8b9460" />
            <path d="M10 26h44M10 36h44" stroke="#cdd2ad" strokeWidth="2" />
            <path d="M14 48v5M20 48v5M26 48v5M32 48v5M38 48v5M44 48v5M50 48v5" stroke="#8b9460" strokeWidth="1.5" />
          </>
        )}
        {o === "tees" && (
          <path d="M22 12l-12 7 4 9 6-3v27h24V25l6 3 4-9-12-7c-1 4-5 6-10 6s-9-2-10-6Z" fill="#fff" stroke={ink} strokeWidth="1.6" strokeLinejoin="round" />
        )}
      </svg>
    </div>
  );
}

function StatusDot({ o }: { o: OrderId }) {
  const c = !ORDERS[o].delivered ? "bg-[var(--mk-primary)]" : returnable(o) ? "bg-emerald-600" : "bg-[var(--mk-line-strong)]";
  return <span className={`inline-block h-2 w-2 rounded-full ${c}`} />;
}

function Orders({ site }: { site: Site }) {
  return (
    <>
      <Section className="pt-10">
        <Crumb>Account / Orders</Crumb>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div {...site.mark("souq.orders.greeting")}>
            <H1>Welcome back, Layla</H1>
            <p className="mt-1 text-[var(--mk-muted)]">
              <span lang="ar">أهلاً ليلى</span> · Four orders in the last two months.
            </p>
          </div>
          <MkLink site={site} id="souq.orders.policy_link" className="text-sm">How returns work →</MkLink>
        </div>
      </Section>
      <Section className="mt-7 grid gap-3">
        {ORDER_IDS.map((o) => {
          const x = ORDERS[o];
          const returned = site.flag("returned") === o;
          return (
            <article key={o} {...site.mark(`souq.orders.${o}`)} className="flex flex-col gap-4 rounded-[var(--mk-radius)] border border-[var(--mk-line)] bg-[var(--mk-surface)] p-4 @2xl:flex-row @2xl:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <Art o={o} className="h-16 w-16" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-[var(--mk-ink)]">{x.item}</p>
                    {onSale(o) && <SaleTag o={o} />}
                  </div>
                  <p className="mt-0.5 truncate text-sm text-[var(--mk-muted)]">{x.detail}</p>
                  <p className="mt-1 font-mono text-[11px] text-[var(--mk-muted)]">{x.no} · {x.placed} · {aed(x.price)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 @2xl:justify-end">
                <p className="flex items-center gap-2 text-sm text-[var(--mk-ink)]">
                  <StatusDot o={o} />
                  {returned ? "Return booked" : x.status}
                </p>
                <MkButton site={site} id={`souq.orders.${o}_open`} variant="outline" className="!py-2">View order</MkButton>
              </div>
            </article>
          );
        })}
      </Section>
    </>
  );
}

function OrderDetail({ site }: { site: Site }) {
  const o = viewing(site.s);
  const x = ORDERS[o];
  const returned = site.flag("returned") === o;
  const slot = slotOf(site.s);
  return (
    <>
      <Section className="pt-10">
        <MkLink site={site} id="souq.order.back" className="text-sm">← All orders</MkLink>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <Crumb>Order {x.no}</Crumb>
            <H1>{x.item}</H1>
          </div>
          <p className="text-sm text-[var(--mk-muted)]">{x.placed}, paid with Visa ending 4417</p>
        </div>
      </Section>
      <Section className="mt-6 grid gap-5 @3xl:grid-cols-[1.4fr_1fr]">
        <Panel mark={site.mark("souq.order.item")} className="p-5">
          <div className="flex flex-col gap-5 @xl:flex-row">
            <Art o={o} className="aspect-square w-full max-w-[180px]" />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="mk-display text-xl font-bold text-[var(--mk-ink)]">{x.item}</p>
                {onSale(o) && <SaleTag o={o} mark={site.mark("souq.order.sale_tag")} />}
              </div>
              <p className="mt-1 text-sm text-[var(--mk-muted)]">{x.detail}</p>
              <p {...site.mark("souq.order.price")} className="mt-4 text-lg font-semibold text-[var(--mk-ink)]">
                {aed(x.price)}
                {x.was && <span className="ml-2 text-sm font-normal text-[var(--mk-muted)] line-through">{aed(x.was)}</span>}
              </p>
              <p className="mt-1 text-xs text-[var(--mk-muted)]">Qty 1 · Free delivery · VAT included</p>
            </div>
          </div>
        </Panel>
        <div className="grid content-start gap-4">
          <Panel className="p-5">
            <p {...site.mark("souq.order.status")} className="flex items-center gap-2 text-lg font-semibold text-[var(--mk-ink)]">
              <StatusDot o={o} /> {x.status}
            </p>
            <p className="mt-1 text-sm text-[var(--mk-muted)]">{x.when}</p>
            {x.delivered && (
              <p {...site.mark("souq.order.window")} className={`mt-4 rounded-[calc(var(--mk-radius)-4px)] px-3 py-2 text-sm font-medium ${returnable(o) ? "bg-emerald-50 text-emerald-800" : "bg-[var(--mk-bg)] text-[var(--mk-muted)]"}`}>
                {x.windowNote}
              </p>
            )}
            {returned && (
              <p {...site.mark("souq.order.return_booked")} className="mt-3 rounded-[calc(var(--mk-radius)-4px)] bg-[var(--mk-primary)]/10 px-3 py-2 text-sm font-medium text-[var(--mk-primary)]">
                Return booked. Courier pickup {slot?.label ?? "soon"}.
              </p>
            )}
          </Panel>
          <div className="flex flex-wrap gap-2">
            {returnable(o) && !returned && <MkButton site={site} id="souq.order.start_return" />}
            {x.delivered && <MkButton site={site} id="souq.order.report_problem" variant="outline" />}
          </div>
          <MkLink site={site} id="souq.order.policy_link" className="text-sm">Read the return policy →</MkLink>
        </div>
      </Section>
    </>
  );
}

function Policy({ site }: { site: Site }) {
  const t = site.flag("policy_tab") || "time";
  const o = site.flag("order") as OrderId | "";
  return (
    <>
      <Section className="pt-10">
        {o && <div className="mb-3"><MkLink site={site} id="souq.policy.back_order" className="text-sm">← Back to your order ({ORDERS[o].no})</MkLink></div>}
        <Crumb>Help / Returns</Crumb>
        <H1>Return policy</H1>
        <p className="mt-2 max-w-xl text-[var(--mk-muted)]">Free courier pickup from anywhere in the UAE. Here is the whole policy, in three short parts.</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <MkTab site={site} id="souq.policy.tab_time" active={t === "time"} />
          <MkTab site={site} id="souq.policy.tab_refunds" active={t === "refunds"} />
          <MkTab site={site} id="souq.policy.tab_damaged" active={t === "damaged"} />
        </div>
      </Section>
      <Section className="mt-5 grid gap-5 @3xl:grid-cols-[1.5fr_1fr]">
        <Panel className="divide-y divide-[var(--mk-line)]">
          {t === "time" && (
            <>
              <div {...site.mark("souq.policy.window")} className="p-5">
                <p className="mk-display text-lg font-bold text-[var(--mk-ink)]">14 days from delivery</p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--mk-muted)]">Start a return within 14 days of the delivery date on your order. The courier can collect up to the last day.</p>
              </div>
              <div {...site.mark("souq.policy.condition")} className="p-5">
                <p className="font-semibold text-[var(--mk-ink)]">Unworn, with tags on</p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--mk-muted)]">Shoes should come back in their box. Trying them on indoors is fine.</p>
              </div>
              <div {...site.mark("souq.policy.excluded")} className="p-5">
                <p className="font-semibold text-[var(--mk-ink)]">Items we cannot take back</p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--mk-muted)]">Underwear, swimwear with the liner removed, perfume that has been opened, and gift cards.</p>
              </div>
            </>
          )}
          {t === "refunds" && (
            <>
              <div {...site.mark("souq.policy.full_price")} className="p-5">
                <p className="mk-display text-lg font-bold text-[var(--mk-ink)]">Full-price items: refund to your card</p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--mk-muted)]">Back to the card you paid with, 5 to 7 working days after the courier collects.</p>
              </div>
              <div {...site.mark("souq.policy.sale")} className="bg-[var(--mk-accent)]/[0.07] p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="mk-display text-lg font-bold text-[var(--mk-ink)]">Sale items: store credit only</p>
                  <span className="rounded-full bg-[var(--mk-accent)] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--mk-on-accent)]">Sale</span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-[var(--mk-muted)]">Anything bought with a Sale tag comes back as Souq Lane credit for the price you paid, on your account the day we receive it.</p>
                <p lang="ar" dir="rtl" className="mt-2 text-sm leading-relaxed text-[var(--mk-ink)]/80">منتجات التخفيضات: يُعاد المبلغ رصيداً في المتجر فقط.</p>
              </div>
              <div {...site.mark("souq.policy.credit")} className="p-5">
                <p className="font-semibold text-[var(--mk-ink)]">How store credit works</p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--mk-muted)]">It never expires, it works on everything, and you can see it next to your name at the top of the page.</p>
              </div>
            </>
          )}
          {t === "damaged" && (
            <div {...site.mark("souq.policy.damaged")} className="p-5">
              <p className="mk-display text-lg font-bold text-[var(--mk-ink)]">Arrived damaged? Full refund to your card</p>
              <p className="mt-1 text-sm leading-relaxed text-[var(--mk-muted)]">
                Even for sale items. Tell us within 48 hours of delivery, with a photo, and a person on our care team sorts it out. You do not need to book a return.
              </p>
            </div>
          )}
        </Panel>
        <div className="grid content-start gap-3">
          <Callout>
            <p className="font-semibold">Ready to send something back?</p>
            <p className="mt-1">Pick the order, a reason and a pickup slot. It takes about a minute.</p>
            <MkButton site={site} id="souq.policy.start_return" className="mt-3" />
          </Callout>
          <p className="text-sm text-[var(--mk-muted)]">
            Something else? <MkLink site={site} id="souq.policy.help_link">Talk to us →</MkLink>
          </p>
        </div>
      </Section>
    </>
  );
}

function Return({ site }: { site: Site }) {
  const st = site.flag("return_step") || "form";
  const r = site.v("souq.return.order") as OrderId | "";
  const slot = site.flag("slot");
  return (
    <Section className="pt-10">
      <div className="mx-auto max-w-2xl">
        <Crumb>Returns</Crumb>
        <H1>{st === "done" ? "Your return is booked" : "Start a return"}</H1>
        <Panel className="mt-6 p-5 @3xl:p-7">
          {st === "form" && (
            <div className="grid gap-5">
              <div className="grid gap-4 @xl:grid-cols-2">
                <MkSelect site={site} id="souq.return.order" className="@xl:col-span-2" />
                <MkSelect site={site} id="souq.return.reason" />
                <MkField site={site} id="souq.return.details" placeholder="Size 42 runs small" />
              </div>
              <div>
                <p className="mb-2 text-[13px] font-medium text-[var(--mk-ink)]">Courier pickup</p>
                <div className="grid gap-2 @xl:grid-cols-3">
                  {SLOTS.map((x) => {
                    const on = slot === x.id;
                    return (
                      <button
                        key={x.id}
                        {...site.hit(`souq.return.slot_${x.id}`)}
                        aria-pressed={on}
                        className={`rounded-[calc(var(--mk-radius)-4px)] border px-3 py-2.5 text-left text-sm transition ${on ? "border-[var(--mk-primary)] bg-[var(--mk-primary)] text-[var(--mk-on-primary)]" : "border-[var(--mk-line-strong)] bg-[var(--mk-surface)] text-[var(--mk-ink)] hover:border-[var(--mk-primary)]"}`}
                      >
                        <span className="block font-semibold">{x.label.split(",")[0]}</span>
                        <span className={on ? "text-white/80" : "text-[var(--mk-muted)]"}>{x.label.split(", ")[1]}</span>
                      </button>
                    );
                  })}
                </div>
                <p {...site.mark("souq.return.address")} className="mt-2 text-xs text-[var(--mk-muted)]">Pickup from Villa 14, Street 23, Al Barsha 2, Dubai. Have the box sealed; the courier brings the label.</p>
              </div>
              <Callout mark={site.mark("souq.return.refund")}>
                <p className="font-semibold">How you get your money back</p>
                <p className="mt-1">{refundLine(r)}</p>
              </Callout>
              <div className="flex justify-end">
                <MkButton site={site} id="souq.return.submit" className="min-w-40" />
              </div>
            </div>
          )}
          {st === "done" && (
            <div {...site.mark("souq.return.confirmation")}>
              <div className="grid h-11 w-11 place-items-center rounded-full bg-[var(--mk-primary)] text-[var(--mk-on-primary)]">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m4.5 10.5 3.5 3.5 7.5-8" /></svg>
              </div>
              <p className="mk-display mt-4 text-2xl font-bold text-[var(--mk-ink)]">Pickup booked</p>
              {r && (
                <p className="mt-2 text-sm leading-relaxed text-[var(--mk-muted)]">
                  Return <strong className="font-mono text-[var(--mk-ink)]">{ref("RT", ORDERS[r].no + slot)}</strong> for {ORDERS[r].item} ({ORDERS[r].no}).
                  The courier comes {SLOTS.find((x) => x.id === slot)?.label}. {onSale(r) ? `${aed(ORDERS[r].price)} lands as store credit the day we receive it.` : `${aed(ORDERS[r].price)} goes back to your Visa.`}
                </p>
              )}
              <MkLink site={site} id="souq.return.done_orders" className="mt-5 text-sm">Back to my orders →</MkLink>
            </div>
          )}
        </Panel>
      </div>
    </Section>
  );
}

const ANSWERS: Record<string, [string, string]> = {
  where: ["souq.help.answer_where", "Open My orders and pick the order: the status shows where it is and the courier's time slot. Orders placed before 14:00 in Dubai usually arrive the next day."],
  returns: ["souq.help.answer_returns", "You have 14 days from delivery. Start a return from the order page and pick a pickup slot; the courier brings the label."],
  payments: ["souq.help.answer_payments", "Store credit sits next to your name at the top of the page. It never expires and it pays for anything, including delivery."],
};

function Help({ site }: { site: Site }) {
  const topic = site.flag("topic");
  const ar = site.v("souq.help.lang") === "ar";
  return (
    <>
      <Section className="pt-10">
        <Crumb>Help</Crumb>
        <H1>How can we help?</H1>
        <p className="mt-2 text-[var(--mk-muted)]">People on our care team answer every day from 8:00 to 23:00, in English and Arabic.</p>
      </Section>
      <Section className="mt-6 grid gap-5 @3xl:grid-cols-[1fr_1.6fr]">
        <div className="grid content-start gap-2">
          {HELP_TOPICS.map((t) => (
            <button
              key={t.id}
              {...site.hit(`souq.help.topic_${t.id}`)}
              aria-pressed={topic === t.id}
              className={`flex items-center justify-between rounded-[var(--mk-radius)] border px-4 py-3 text-left text-sm font-medium transition ${topic === t.id ? "border-[var(--mk-primary)] bg-[var(--mk-primary)]/[0.06] text-[var(--mk-primary)]" : "border-[var(--mk-line)] bg-[var(--mk-surface)] text-[var(--mk-ink)] hover:border-[var(--mk-line-strong)]"}`}
            >
              {t.label}<span aria-hidden>›</span>
            </button>
          ))}
        </div>
        <Panel className="p-5 @3xl:p-6">
          {!topic && <p className="text-sm text-[var(--mk-muted)]">Pick a topic on the left. If it is about an order, have the order number ready (it starts with SL).</p>}
          {topic && ANSWERS[topic] && (
            <div {...site.mark(ANSWERS[topic][0])}>
              <p className="mk-display text-lg font-bold text-[var(--mk-ink)]">{HELP_TOPICS.find((t) => t.id === topic)?.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--mk-muted)]">{ANSWERS[topic][1]}</p>
            </div>
          )}
          {topic === "damaged" && !site.flag("handed") && (
            <div className="grid gap-4">
              <Callout mark={site.mark("souq.help.damaged_note")}>
                <p className="font-semibold">Damaged or wrong item</p>
                <p className="mt-1">Full refund to your card, even for sale items. Send a photo and a person picks it up from here; no return to book.</p>
              </Callout>
              <div className="grid gap-4 @xl:grid-cols-2">
                <MkField site={site} id="souq.help.order" placeholder="SL-00000" />
                <MkSelect site={site} id="souq.help.lang" />
              </div>
              <button
                {...site.hit("souq.help.photo")}
                className={`flex items-center gap-3 rounded-[var(--mk-radius)] border-2 border-dashed px-4 py-4 text-left text-sm transition ${site.flag("photo") ? "border-[var(--mk-primary)]/50 bg-[var(--mk-primary)]/[0.05]" : "border-[var(--mk-line-strong)] hover:border-[var(--mk-primary)]"}`}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--mk-bg)] text-[var(--mk-primary)]">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><rect x="2" y="4" width="14" height="11" rx="2" /><circle cx="9" cy="9.5" r="2.7" /><path d="M6 4l1.2-2h3.6L12 4" /></svg>
                </span>
                <span>
                  <span className="block font-semibold text-[var(--mk-ink)]">{site.flag("photo") ? "bowl-crack.jpg attached" : "Add a photo of the damage"}</span>
                  <span className="text-[var(--mk-muted)]">{site.flag("photo") ? "1.8 MB · tap to remove" : "JPG or PNG, one is enough"}</span>
                </span>
              </button>
              <MkField site={site} id="souq.help.message" placeholder="It arrived with a crack down the side" />
              <div className="flex justify-end">
                <MkButton site={site} id="souq.help.handoff" variant="accent" className="min-w-40" />
              </div>
            </div>
          )}
          {site.flag("handed") && (
            <div {...site.mark("souq.help.handed")} className="grid gap-3">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--mk-primary)] font-semibold text-[var(--mk-on-primary)]">M</span>
                <div>
                  <p className="font-semibold text-[var(--mk-ink)]">Mariam is joining the chat</p>
                  <p className="text-xs text-[var(--mk-muted)]">Care team · usually within 3 minutes</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-[var(--mk-muted)]">
                Case <strong className="font-mono text-[var(--mk-ink)]">{ref("CS", site.v("souq.help.order"))}</strong> for {site.v("souq.help.order").toUpperCase()}, with your photo and note attached.
                Nobody will ask you to explain it again.
              </p>
              {ar && (
                <p lang="ar" dir="rtl" className="rounded-[calc(var(--mk-radius)-4px)] bg-[var(--mk-bg)] p-3 text-sm leading-relaxed text-[var(--mk-ink)]">
                  ستنضم إليك مريم من فريق خدمة العملاء خلال 3 دقائق تقريباً، وستتابع معك بالعربية.
                </p>
              )}
            </div>
          )}
        </Panel>
      </Section>
    </>
  );
}

function SouqPage({ site, page }: { site: Site; page: string }) {
  return (
    <div className="flex min-h-full flex-col">
      <Header site={site} page={page} />
      <main className="flex-1">
        {page === "orders" && <Orders site={site} />}
        {page === "order" && <OrderDetail site={site} />}
        {page === "policy" && <Policy site={site} />}
        {page === "return" && <Return site={site} />}
        {page === "help" && <Help site={site} />}
      </main>
      <Footer />
    </div>
  );
}

/* ---------- scenario ---------- */

export const souq: Scenario = {
  id: "souq",
  name: "Souq Lane",
  domain: "souq-lane.example",
  task: "Return a pair of sneakers, check cash or credit, get a person.",
  label: "5 PAGES · RESOLVE",
  opening: "Hi, I'm Lisn. This is Souq Lane, a made-up shop for this demo. Should I help you return your sneakers?",
  suggestions: ["Can I still return my sneakers?", "Will I get cash or store credit?", "My bowl arrived broken, get me a person"],
  brand: {
    swatch: "#3b3a8f",
    className: `${display.variable} ${sans.variable}`,
    style: {
      "--mk-bg": "#f4f3f8",
      "--mk-surface": "#ffffff",
      "--mk-ink": "#1c1b33",
      "--mk-muted": "#5f5e78",
      "--mk-line": "#e5e3ee",
      "--mk-line-strong": "#cfcce0",
      "--mk-primary": "#3b3a8f",
      "--mk-on-primary": "#ffffff",
      "--mk-accent": "#e2583a",
      "--mk-accent-ink": "#a83a1f",
      "--mk-on-accent": "#ffffff",
      "--mk-radius": "14px",
      "--mk-font": "var(--sl-sans), system-ui, sans-serif",
      "--mk-font-display": "var(--sl-display), var(--sl-sans), sans-serif",
    } as CSSProperties,
  },
  pages: [
    { id: "orders", path: "/account/orders", title: "My orders" },
    { id: "order", path: "/account/orders/view", title: "Order detail" },
    { id: "policy", path: "/help/returns-policy", title: "Return policy" },
    { id: "return", path: "/returns/new", title: "Start a return" },
    { id: "help", path: "/help", title: "Help" },
  ],
  els,
  initial: { flags: { order: "", policy_tab: "time", return_step: "form", slot: "", topic: "", photo: "", handed: "", returned: "" } },
  tasks: [
    { goal: "Open the sneakers order and check the 14-day return window", done: (s) => f(s, "seen_sneakers") === "yes" },
    { goal: "Find out if the refund is cash or store credit (Return policy, Refunds)", done: (s) => f(s, "refunds_seen") === "yes" },
    { goal: "Return the sneakers (reason, pickup slot, book it)", done: (s) => f(s, "returned") === "sneakers" },
    { goal: "The bowl arrived broken: hand it to a person with the order number", done: (s) => f(s, "handed") === "yes" },
  ],
  onClick,
  Page: SouqPage,
};
