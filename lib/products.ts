/** What Ground State Foundry makes. Drives /products, the product pages, the nav, and the homepage. */

export const BUBBLES_REPO = "https://github.com/Sentinal-Glimpass/bubbles";
export const PLAYGROUND = "/playground";
/** The Lisn agent that runs on this site. Empty until it is created; the widget only loads when set. */
export const LISN_AGENT_ID = "";
export const LISN_WIDGET_SRC = "https://my.groundstatefoundry.com/widget-v2.js";

export type Product = {
  slug: "lisn" | "bubbles";
  name: string;
  status: string;
  line: string;
  summary: string;
  bullets: string[];
};

export const PRODUCTS: Product[] = [
  {
    slug: "lisn",
    name: "Lisn",
    status: "Early access",
    line: "An AI that talks to your customers, wherever they are.",
    summary:
      "Lisn talks and chats with visitors on your website, answers from your own business knowledge, captures leads, and books appointments. Phone lines are next. It practises against simulated customers before it talks to real ones.",
    bullets: [
      "Voice and chat on your website, from one script tag",
      "Answers from your own business knowledge, and says when it does not know",
      "Captures leads, books appointments and callbacks, hands over to a person",
      "English and Arabic, including mixed-language speech",
    ],
  },
  {
    slug: "bubbles",
    name: "Bubbles",
    status: "Open source · MIT",
    line: "A terminal tool that runs a whole fleet of AI coding agents.",
    summary:
      "Bubbles keeps Claude Code agents alive as long-running workers, lets them message each other and hand off work, and lets them spawn more agents on their own.",
    bullets: [
      "Agents run as persistent background workers",
      "Messaging between agents that never interrupts their work",
      "Agents can spawn and manage their own sub-agents",
      "Written in Go, released under MIT",
    ],
  },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

/** Lisn's four capabilities, with the shipped system each one comes from. */
export const LISN_CAPABILITIES = [
  {
    id: "website",
    t: "On your website",
    d: "Visitors talk or type, and Lisn answers in their language. It learns your services, prices, hours, and FAQs from your own website, sticks to them, and says so when it does not know. It drops in with one script tag.",
    from: "From our embeddable demo agent",
    link: { href: PLAYGROUND, label: "Try it in the playground →" },
  },
  {
    id: "phone",
    t: "On the phone, next",
    d: "Coming next: inbound and outbound calls on the numbers you already have. The same agent that talks on your website will answer your lines, built on the voice platform we have already run on real telephony.",
    from: "Coming next, from our production voice platform",
    link: { href: "/research/one-integration-any-carrier", label: "One integration, any carrier →" },
  },
  {
    id: "resolve",
    t: "Gets it done",
    d: "Lisn checks availability and books through your booking tool, takes callbacks at the time the customer gives, and sends you the lead with a summary of the conversation. It hands over to a person during working hours, and it does not promise what it should not.",
    from: "Tool calls during a live call",
    link: { href: "/research/giving-a-voice-agent-hands", label: "Giving a voice agent hands →" },
  },
  {
    id: "practice",
    t: "Practises first",
    d: "Before it talks to your customers, other agents play them: impatient, confused, switching language mid-sentence. They talk to it through the same stack your customers will, and every failure becomes a fix.",
    from: "From our simulation suite",
    link: { href: "/research/test-with-more-ai", label: "Test your AI with more AI →" },
  },
];

export const LISN_STEPS = [
  { n: "01", t: "Connect", d: "Paste groundstatefoundry.com/skill into your coding agent (Claude Code, Cursor and others) and it installs Lisn in minutes. Or we set it up for you." },
  { n: "02", t: "Teach", d: "Lisn learns your services, prices, hours, and FAQs from your own website. Add the answers your best people give." },
  { n: "03", t: "Practise", d: "Lisn talks to simulated customers first, and every conversation that goes wrong becomes a fix." },
  { n: "04", t: "Go live", d: "It starts answering real visitors and callers, and hands over to a person when it should." },
  { n: "05", t: "Improve", d: "It keeps practising against new situations, so it gets better every week." },
];

/** Research pieces that went into Lisn, in reading order. */
export const LISN_RESEARCH = [
  "three-seconds-of-silence",
  "cutting-the-pause",
  "cascade-vs-speech-to-speech",
  "giving-a-voice-agent-hands",
  "guardrails-over-prompts",
  "real-time-call-translation",
  "test-with-more-ai",
  "grading-the-agent-blind",
];

export const BUBBLES_RESEARCH = [
  "running-a-fleet",
  "messaging-that-never-interrupts",
  "agent-control-plane-in-go",
  "an-org-chart-of-agents",
];

/** Old consultancy URLs and where they now point. Rendered as static redirect pages. */
export const LEGACY_REDIRECTS: Record<string, string> = {
  "voice-ai": "/products/lisn/",
  "ai-agents-automation": "/products/lisn/",
  simulation: "/products/lisn/#practice",
  "enterprise-ai": "/products/",
  "strategy-advisory": "/products/",
  "data-ml-infrastructure": "/products/",
};
