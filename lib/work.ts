/** Case studies / proof. Shipped and open work, anonymized where required. */

export type WorkItem = {
  slug: string;
  title: string;
  tag: string; // short category label
  status: string; // e.g. "Live", "Open source", "Research"
  summary: string; // one plain line
  points: string[]; // 2-4 concrete facts
  link?: { href: string; label: string }; // external (GitHub / live / research)
  featured?: boolean;
};

export const WORK: WorkItem[] = [
  {
    slug: "voice-agent-platform",
    title: "Production voice-agent platform",
    tag: "Voice AI",
    status: "In production",
    summary:
      "A multi-tenant platform that runs AI phone agents over real telephony, on the phone numbers a business already has.",
    points: [
      "Provider-agnostic: works across Twilio, Plivo, and Exotel",
      "Campaign orchestration and a visual flow builder",
      "Engineered for sub-second response, so callers do not sit in silence",
    ],
    featured: true,
  },
  {
    slug: "autonomous-outreach",
    title: "An agent that does its own sales outreach",
    tag: "Agents & Automation",
    status: "Productized",
    summary:
      "An agent given a large toolbelt and left to run, it researches prospects, verifies emails, writes, sends, follows up, and books meetings.",
    points: [
      "Built on a toolbelt of 50+ tools the agent calls on its own",
      "Ran day and night without a person driving each step",
      "Later turned into a live outreach service with paying clients",
    ],
    featured: true,
  },
  {
    slug: "demogod",
    title: "A voice agent that demos your product",
    tag: "Voice AI",
    status: "Live beta",
    summary:
      "An embeddable voice agent that walks a visitor through a live, interactive product demo on any website.",
    points: [
      "Runs in the browser over WebRTC, no install",
      "Speaks and listens in real time",
      "Drops into any site as a widget",
    ],
    link: { href: "https://demogod.me", label: "demogod.me" },
    featured: true,
  },
  {
    slug: "bubbles",
    title: "Bubbles, open-source agent fleet manager",
    tag: "Open source",
    status: "Open source (MIT)",
    summary:
      "A terminal tool that runs a whole fleet of AI coding agents: they stay alive, talk to each other, and spawn more agents on their own.",
    points: [
      "Agents message each other and hand off work",
      "Sessions run as long-lived background workers",
      "Written in Go, released under MIT",
    ],
    link: { href: "https://github.com/Sentinal-Glimpass/bubbles", label: "View on GitHub" },
    featured: true,
  },
  {
    slug: "darweel",
    title: "Darweel, a framework where code evolves",
    tag: "Research",
    status: "Research",
    summary:
      "A framework where programs compete, mutate, and reproduce, and the survivors are better than what we wrote by hand.",
    points: [
      "Evolved a 4x4 matrix-multiplication algorithm down to 48 multiplications",
      "That matches Winograd, below the textbook Strassen result of 49",
      "The algorithm emerged from the search, we did not design it",
    ],
    link: { href: "https://www.onevoid.org/post/conditional-winograd-by-edbbc5b2", label: "Read the report" },
  },
  {
    slug: "healthcare-ai",
    title: "AI for a pharmacy workflow",
    tag: "Healthcare",
    status: "Shipped",
    summary:
      "A mobile and web system that reads a bill by camera, tracks stock and expiry, and handles compliant invoicing.",
    points: [
      "Scans a paper bill and turns it into structured data",
      "Flags medicines nearing expiry before they are a loss",
      "Shipped as an Android app with a web back office",
    ],
  },
];

export function featuredWork() {
  return WORK.filter((w) => w.featured);
}
