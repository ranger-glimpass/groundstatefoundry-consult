/** What Lisn and Bubbles are built from: shipped systems, open source, and research. */

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
    tag: "Lisn: phone",
    status: "In production",
    summary:
      "A multi-tenant platform that runs AI phone agents over real telephony, on the phone numbers a business already has.",
    points: [
      "Provider-agnostic: works across Twilio, Plivo, and Exotel",
      "Campaign orchestration and a visual flow builder",
      "Built so callers are not left in silence while the agent thinks",
    ],
    featured: true,
  },
  {
    slug: "autonomous-outreach",
    title: "An agent that does its own sales outreach",
    tag: "Lisn: tools",
    status: "Precursor",
    summary:
      "An agent given a large toolbelt and left to run, it researches prospects, verifies emails, writes, sends, follows up, and books meetings.",
    points: [
      "Built on a toolbelt of 50+ tools the agent calls on its own",
      "Ran day and night without a person driving each step",
      "The same toolbelt approach now lets Lisn act mid-conversation",
    ],
    link: { href: "https://mechmagnet.com", label: "mechmagnet.com" },
  },
  {
    slug: "demogod",
    title: "A voice agent that demos your product",
    tag: "Lisn: website",
    status: "Beta",
    summary:
      "An embeddable voice agent that walks a visitor through a live, interactive product demo on any website.",
    points: [
      "Runs in the browser over WebRTC, no install",
      "Speaks and listens in real time",
      "Drops into any site as a widget",
    ],
    link: { href: "https://www.youtube.com/watch?v=qFtrS9HNJRE", label: "Watch the demo" },
    featured: true,
  },
  {
    slug: "simulation-suite",
    title: "Agents that call agents",
    tag: "Lisn: practice",
    status: "In production",
    summary:
      "A simulation suite where one AI agent calls another through the real phone stack, so a voice system is tested before real customers reach it.",
    points: [
      "Paired caller and receiver agents run over real telephony, end to end",
      "Verified at 20 concurrent calls through the full stack",
      "The basis of how Lisn practises before it goes live",
    ],
    link: { href: "/research/test-with-more-ai", label: "How it works →" },
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
      "A descendant then averaged 47.94 across 500 test cases, all correct, by learning to skip multiplications by zero",
    ],
    link: { href: "https://www.onevoid.org/post/conditional-winograd-by-edbbc5b2", label: "Read the report" },
  },
];

export function featuredWork() {
  return WORK.filter((w) => w.featured);
}
