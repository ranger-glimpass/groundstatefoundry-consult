/** What Ground State Foundry makes. Drives /products, the product pages, the nav, and the homepage. */

export const BUBBLES_REPO = "https://github.com/Sentinal-Glimpass/bubbles";
export const LISN_DEMO_VIDEO = "https://www.youtube.com/watch?v=qFtrS9HNJRE";

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
      "Lisn guides visitors on your website, answers and makes phone calls, and resolves the issue end to end. It practises against simulated customers before it talks to real ones.",
    bullets: [
      "Guides visitors through your website by voice",
      "Answers and makes calls on the numbers you already have",
      "Uses your tools mid-conversation to get the job done",
      "English and Arabic",
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
    d: "Lisn talks to visitors by voice and moves them through the page: it highlights, scrolls, opens the right screen, and fills the form. It runs in the browser, with no install, and drops in as a widget.",
    from: "From our embeddable demo agent",
    link: { href: LISN_DEMO_VIDEO, label: "Watch it guide a visitor ↗" },
  },
  {
    id: "phone",
    t: "On the phone",
    d: "Inbound and outbound calls on the numbers you already have, over Twilio, Plivo, Exotel, or a SIP trunk. It books, reschedules, qualifies, follows up, and hands over to a person when it should.",
    from: "From our production voice platform",
    link: { href: "/research/one-integration-any-carrier", label: "One integration, any carrier →" },
  },
  {
    id: "resolve",
    t: "Gets it done",
    d: "Lisn calls your tools during the conversation, so the appointment is actually moved and the message is actually sent. Hard guardrails stop it from promising what it should not.",
    from: "Tool calls during a live call",
    link: { href: "/research/giving-a-voice-agent-hands", label: "Giving a voice agent hands →" },
  },
  {
    id: "practice",
    t: "Practises first",
    d: "Before it talks to your customers, other agents play them: impatient, confused, switching language mid-sentence. They call through the same phone stack, and every failure becomes a fix.",
    from: "From our simulation suite",
    link: { href: "/research/test-with-more-ai", label: "Test your AI with more AI →" },
  },
];

export const LISN_STEPS = [
  { n: "01", t: "Connect", d: "Point Lisn at your website, your phone numbers, and the tools it needs to get things done." },
  { n: "02", t: "Teach", d: "Give it your products, policies, and the answers your best people give." },
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
