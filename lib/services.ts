/** Service catalog: 6 categories, each with subcategories. Drives /services and /services/[slug]. */

export type SubService = { title: string; body: string };
export type Service = {
  slug: string;
  num: string;
  title: string;
  eyebrow: string;
  /** One plain sentence for cards. No jargon, no em dashes. */
  summary: string;
  /** A short lead paragraph for the detail page. */
  intro: string;
  subs: SubService[];
  /** Optional pointers to proof, shown as a note on the detail page. */
  proof?: string;
};

export const SERVICES: Service[] = [
  {
    slug: "voice-ai",
    num: "01",
    title: "Voice AI",
    eyebrow: "talk to your customers, at scale",
    summary:
      "AI that answers and makes phone calls, in real time, in the languages your customers speak.",
    intro:
      "A phone call is still the most human way a business talks to a customer, and the hardest to scale. We build voice agents that pick up every call, make outbound calls that sound natural, and turn what happens on the line into something you can measure. This is the deepest thing we do. We have run voice agents in production over real telephony, not just in demos.",
    subs: [
      {
        title: "Inbound voice agents",
        body: "An agent that answers your business line day and night, books the job, and never leaves a caller on hold. It knows your services, your hours, and when to hand off to a human.",
      },
      {
        title: "Outbound voice agents",
        body: "Calls that go out on their own for reminders, follow-ups, surveys, and qualification. They hold a real back-and-forth conversation, not a recorded script.",
      },
      {
        title: "Real-time call translation",
        body: "Two people on a call, each hearing their own language, live. We isolate each side of the call so the translation stays clean end to end.",
      },
      {
        title: "Call-center communication intelligence",
        body: "Every call transcribed, scored, and summarized. You see what is working, where agents get stuck, and which calls need a human to follow up.",
      },
      {
        title: "Telephony integration",
        body: "We connect to the phone network you already use, whether that is Twilio, Plivo, Exotel, or a SIP trunk, so the agent works with your existing numbers.",
      },
    ],
    proof:
      "Production voice agents over real telephony, provider-agnostic, with sub-second response engineering. See Work and Research.",
  },
  {
    slug: "ai-agents-automation",
    num: "02",
    title: "AI Agents & Automation",
    eyebrow: "put the busywork on autopilot",
    summary:
      "Agents that do real work end to end: research, outreach, operations, and the steps in between.",
    intro:
      "An agent is useful when it finishes a job, not when it writes a paragraph about the job. We build agents that carry a task all the way through, using the tools your team already uses, with a human in the loop where it matters. We have run an agent that did full sales outreach on its own, day and night.",
    subs: [
      {
        title: "Autonomous agents & workflows",
        body: "Multi-step agents that plan, act, check their own work, and know when to ask a person. Built around a clear outcome, not a demo.",
      },
      {
        title: "Outreach & sales automation",
        body: "Find the right people, verify their details, write a message that sounds like you wrote it, send it, follow up, and book the meeting.",
      },
      {
        title: "Custom MCP tools",
        body: "We wrap your systems as tools an agent can call safely, so the agent works inside your stack instead of guessing about it.",
      },
      {
        title: "Process automation",
        body: "The repetitive back-office work that eats your team's day, handed to an agent that does it the same way every time.",
      },
    ],
    proof:
      "An autonomous outreach agent built on a 50-tool toolbelt, later productized into a live outreach service. See Work.",
  },
  {
    slug: "enterprise-ai",
    num: "03",
    title: "Enterprise AI Solutions",
    eyebrow: "your knowledge, put to work",
    summary:
      "Custom AI applications built into your stack, designed for accuracy, security, and scale.",
    intro:
      "Most enterprise AI dies between a promising demo and a system people can trust. We build the second thing. Applications that sit inside your environment, answer from your own knowledge, and are checked against a standard before they ship.",
    subs: [
      {
        title: "Custom LLM & RAG applications",
        body: "Apps that answer from your documents and data, with the retrieval and guardrails that keep the answers grounded in what is actually true.",
      },
      {
        title: "Knowledge copilots & assistants",
        body: "An assistant that knows your business and helps your team find, draft, and decide faster, without leaving the tools they already use.",
      },
      {
        title: "Document & workflow intelligence",
        body: "Read, understand, and route the documents and requests that move your work forward, from contracts to claims to tickets.",
      },
      {
        title: "Secure deployment",
        body: "Runs inside your cloud or on-premises, with access controls that respect who is allowed to see what.",
      },
    ],
  },
  {
    slug: "simulation",
    num: "04",
    title: "Simulation as a Service",
    eyebrow: "test the system before the system is live",
    summary:
      "We simulate users, calls, and processes so you can test and evaluate a system before real traffic hits it.",
    intro:
      "You cannot always wait for real customers to find the bug. We build simulations where AI agents act like your users and drive your real system, so you can see how it behaves under load, catch failures early, and grade a change before you ship it. Some of this we ran to load-test a live voice platform, with agents calling each other through the real phone stack.",
    subs: [
      {
        title: "Load & QA simulation",
        body: "Agents drive your real system at volume to find where it slows down, drops calls, or breaks, before a customer does.",
      },
      {
        title: "Generative-agent simulation",
        body: "Simulated people with different needs and personalities, used to evaluate a product, a script, or a decision at a scale you could never staff.",
      },
      {
        title: "Process discovery",
        body: "Model a workflow, run it, and surface the hidden steps and bottlenecks that nobody wrote down.",
      },
    ],
    proof: "A voice-platform simulation suite verified at real concurrency. See Research.",
  },
  {
    slug: "strategy-advisory",
    num: "05",
    title: "AI Strategy & Advisory",
    eyebrow: "where AI earns its keep, and where it does not",
    summary:
      "A clear-eyed read on where AI will pay off for you, and an honest one on where it will not.",
    intro:
      "Before a line of code, the useful question is where AI actually moves a number that matters. We map that with you, tell you what is worth building, and just as often tell you what is not. Trust is worth more to us than a bigger contract.",
    subs: [
      {
        title: "Opportunity mapping",
        body: "We look at your workflows and rank the places AI can help, by how much it moves and how hard it is to build.",
      },
      {
        title: "AI readiness & data audit",
        body: "An honest look at whether your data and systems are ready, and what to fix first if they are not.",
      },
      {
        title: "Build-vs-buy & architecture",
        body: "What to build, what to buy, and how the pieces fit, so you do not pay twice or paint yourself into a corner.",
      },
      {
        title: "Team enablement",
        body: "We bring your people along, so the system still makes sense after we leave.",
      },
    ],
  },
  {
    slug: "data-ml-infrastructure",
    num: "06",
    title: "Data & ML Infrastructure",
    eyebrow: "the plumbing that makes AI reliable",
    summary:
      "The unglamorous foundations: pipelines, evaluation, and the operations that keep AI working in production.",
    intro:
      "AI that works once in a notebook and AI that works every day for real users are different jobs. The second one needs foundations. We build the pipelines, the evaluation, and the monitoring that turn a clever prototype into something you can depend on.",
    subs: [
      {
        title: "Pipelines & vector stores",
        body: "The data flow and search layer that feed your AI the right context at the right time.",
      },
      {
        title: "Evaluation & observability",
        body: "A way to measure whether the AI is actually right, and to see when it starts to drift.",
      },
      {
        title: "MLOps & deployment",
        body: "Ship, roll back, and update models the way you ship the rest of your software.",
      },
      {
        title: "Fine-tuning & model routing",
        body: "Use the right model for each job, and teach a model your domain when the general one is not enough.",
      },
    ],
  },
];

export function getService(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}
