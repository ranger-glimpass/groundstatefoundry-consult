/** What Ground State Foundry makes. Models live under /models (grouped, e.g. audio essentials); products under /products. */

export const GITHUB_ORG = "https://github.com/Ground-State-Foundry";
export const BUBBLES_REPO = `${GITHUB_ORG}/bubbles`;
export const NEARFIELD_REPO = `${GITHUB_ORG}/nearfield`;
export const PLAYGROUND = "/playground";
/** The Lisn agent that runs on this site ("GSF Assistant"). The widget only loads when set. */
export const LISN_AGENT_ID = "6ad3df8f20ae684a1d8fa881";
export const LISN_WIDGET_SRC = "https://my.groundstatefoundry.com/widget-v2.js";

export type Product = {
  slug: "lisn" | "bubbles" | "nearfield" | "audio-upscaler" | "ant-flash";
  kind: "model" | "product";
  group?: "audio-essentials"; // models only
  repo?: string; // public repos only; private ones offer access on request
  page?: boolean; // has its own /products/<slug> page
  name: string;
  status: string;
  line: string;
  summary: string;
  bullets: string[];
};

export const PRODUCTS: Product[] = [
  {
    slug: "lisn",
    kind: "product",
    name: "Lisn",
    status: "Early access",
    page: true,
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
    kind: "product",
    name: "Bubbles",
    status: "Open source · MIT",
    repo: BUBBLES_REPO,
    page: true,
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
  {
    slug: "nearfield",
    kind: "model",
    group: "audio-essentials",
    name: "Nearfield",
    status: "Open source · Apache-2.0",
    repo: NEARFIELD_REPO,
    page: true,
    line: "Keeps the caller's voice and removes everything else, in real time.",
    summary:
      "Nearfield cleans the audio of a phone or voice-agent call as it happens. It keeps the voice closest to the microphone and removes background noise and other people talking nearby, so the agent hears only the caller.",
    bullets: [
      "One 2.5 MB model of our own, 48 ms of delay (or 80 ms for the best quality), light enough for one CPU thread",
      "Separates the caller from other voices, not only from noise",
      "Ahead of Krisp and Sanas on Krisp's public benchmark of real calls",
      "Drop-in filter for Pipecat voice agents",
      "Python package, released under Apache-2.0",
    ],
  },
  {
    slug: "audio-upscaler",
    kind: "model",
    group: "audio-essentials",
    name: "Audio Upscaler",
    status: "v3 · available to license",
    page: true,
    line: "Turns phone-quality speech into full-band 48 kHz audio while you talk.",
    summary:
      "Audio Upscaler rebuilds the high frequencies a phone line or a 16 kHz pipeline throws away. It keeps the original band exactly and generates only what is missing, so the voice, the words and their timing never change.",
    bullets: [
      "8 kHz or 16 kHz in, 48 kHz out, with 21 to 43 ms of delay",
      "A trained listener tells it apart from the real recording 55% of the time, where 50% is chance",
      "Runs live on a CPU, in 10 ms blocks, with no look-ahead",
      "Never adds hiss in the pauses",
    ],
  },
  {
    slug: "ant-flash",
    kind: "model",
    group: "audio-essentials",
    name: "Ant Flash",
    status: "3.2 · Arabic 1.0 · available to license",
    page: true,
    line: "Changes an Indian English accent to American or Arabic-accented English, live, in the talker's own voice.",
    summary:
      "Ant Flash converts accent as the person speaks. It keeps their own voice, timing and pitch, and changes how the words sound. It runs on a CPU, with Nearfield clean-up built in.",
    bullets: [
      "Indian English to American English or Arabic-accented English, about 0.6 s behind the talker",
      "The talker's own voice, from a voice print, with no stock voice",
      "Runs on a CPU, about 94 ms of compute per 200 ms of speech",
      "One model per accent pair, more pairs to come",
    ],
  },
];

export const MODEL_GROUPS = [
  {
    id: "audio-essentials" as const,
    name: "Audio essentials",
    line: "Small models for live calls: hear only the caller, restore the sound a phone line throws away, change an accent while someone talks. All run in real time on a CPU.",
  },
];

/** Where an item's own page lives. */
export function itemHref(p: Product) {
  return p.kind === "model" ? `/models/${p.slug}` : `/products/${p.slug}`;
}

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

/** Research behind Nearfield. Slugs without a file yet are skipped by the page. */
export const NEARFIELD_RESEARCH = ["hearing-only-the-caller"];

export const BUBBLES_RESEARCH = [
  "running-a-fleet",
  "messaging-that-never-interrupts",
  "agent-control-plane-in-go",
  "an-org-chart-of-agents",
];

/** Old consultancy URLs and where they now point. Rendered as static redirect pages. */
export const LEGACY_REDIRECTS: Record<string, string> = {
  "voice-ai": "/models/nearfield/",
  "ai-agents-automation": "/products/lisn/",
  simulation: "/products/lisn/#practice",
  "enterprise-ai": "/products/",
  "strategy-advisory": "/products/",
  "data-ml-infrastructure": "/products/",
};

/** Live record-your-voice demo (AWS Lambda, scales to zero). Only answers groundstatefoundry.com. */
export const VOICE_DEMO_API = "https://24uprg46f5llvpkoaysztc2asu0wofey.lambda-url.us-east-1.on.aws/";
/** Off for now. To turn back on: set true here, and restore the Lambda's concurrency
 *  (aws lambda put-function-concurrency --function-name gsf-voice-demo --reserved-concurrent-executions 2). */
export const LIVE_DEMO_ON = false;
