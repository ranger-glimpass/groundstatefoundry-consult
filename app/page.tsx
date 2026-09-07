import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui";
import { SITE } from "@/lib/site";

const SERVICES = [
  {
    tag: "01",
    title: "Enterprise AI Solutions",
    body: "Custom LLM applications, RAG systems, and copilots built into your existing stack, designed for accuracy, security, and scale.",
  },
  {
    tag: "02",
    title: "AI Strategy & Advisory",
    body: "Opportunity mapping, readiness audits, and a pragmatic roadmap. We tell you where AI earns its keep, and where it doesn't.",
  },
  {
    tag: "03",
    title: "AI Agents & Automation",
    body: "Agentic workflows that take real work off your team across support, operations, research, and back-office, measured on outcomes.",
  },
  {
    tag: "04",
    title: "Data & ML Infrastructure",
    body: "Pipelines, vector stores, evaluation, and MLOps. The unglamorous foundations that make AI reliable in production.",
  },
  {
    tag: "05",
    title: "Product Engineering",
    body: "Full-stack teams that ship, from MVP to scale. AI-native by default, with the craft of a senior product studio.",
  },
  {
    tag: "06",
    title: "Startup Studio",
    body: "For founders at zero: company formation in the UAE, MVP build, go-to-market, and a path to your first paying customers.",
  },
];

const PROCESS = [
  { n: "01", t: "Discover", d: "We embed, map the workflow, and find where AI moves the number that matters." },
  { n: "02", t: "Design", d: "A scoped solution with a clear success metric, not a science project." },
  { n: "03", t: "Build", d: "Senior engineers ship in weeks, in the open, with evaluation baked in." },
  { n: "04", t: "Deploy", d: "Secure rollout inside your environment, with your team in the loop." },
  { n: "05", t: "Scale", d: "We harden, monitor, and hand over, or stay on as your AI partner." },
];

const INDUSTRIES = [
  "Legal & Compliance",
  "Financial Services",
  "Healthcare",
  "Real Estate",
  "Retail & E-commerce",
  "Logistics",
];

const FOUNDERS = [
  {
    name: "Rishi",
    role: "Director",
    img: "/rishi.png",
    linkedin: "https://www.linkedin.com/in/rishi-raj-jaiswal-4b353913a/",
    body: "Leads the firm's direction, client partnerships, and growth. Sets how engagements run and how the Foundry delivers, keeping every project tied to a business outcome that matters.",
  },
  {
    name: "Devashish",
    role: "AI Advisor & Strategist",
    img: "/dev.jpg",
    linkedin: "https://www.linkedin.com/in/devajais/",
    body: "Builder behind NeuroLaw AI. Advises on AI strategy and solution architecture end to end, from model and data pipeline to the product a customer actually uses.",
  },
];

export default function Home() {
  return (
    <>
      {/* ───────────────── HERO ───────────────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[8%] h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-70 blur-[130px]"
          style={{ background: "radial-gradient(circle, rgba(185,242,58,0.2), transparent 70%)" }}
        />
        <Container className="relative flex min-h-[88vh] flex-col items-center justify-center py-20 text-center">
          <p className="reveal mono-label" style={{ animationDelay: "0ms" }}>
            AI consultancy · Meydan Free Zone, Dubai
          </p>

          <h1
            className="reveal mt-5 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight text-[var(--color-fg)] sm:text-6xl"
            style={{ animationDelay: "90ms" }}
          >
            We build AI systems that<br className="hidden sm:block" />{" "}
            <span className="text-[var(--color-neon)]">actually ship.</span>
          </h1>

          <p
            className="reveal mt-6 max-w-xl text-base leading-relaxed text-[var(--color-muted)]"
            style={{ animationDelay: "200ms" }}
          >
            Ground State Foundry is an AI consultancy for enterprises and startups.
            We take you from strategy to a working system in production, and back
            founders from zero. <span className="text-[var(--color-fg)]">No slideware. Only execution.</span>
          </p>

          <div className="reveal mt-9 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: "320ms" }}>
            <Link href="/contact" className="btn btn-primary">Book a consult →</Link>
            <Link href="/services" className="btn btn-ghost">Explore services</Link>
          </div>

          <p className="reveal mt-6 text-xs text-[var(--color-dim)]" style={{ animationDelay: "420ms" }}>
            {SITE.tagline}
          </p>
        </Container>
      </section>

      {/* ───────────────── STATS ───────────────── */}
      <Container className="py-6">
        <div className="card grid grid-cols-2 divide-y divide-[var(--color-border)] sm:grid-cols-4 sm:divide-x sm:divide-y-0">
          {[
            ["Weeks", "not quarters, to production"],
            ["Senior", "engineers only, no juniors"],
            ["UAE", "based · global delivery"],
            ["0 → 1", "startups backed from scratch"],
          ].map(([v, l]) => (
            <div key={l} className="px-6 py-7 text-center">
              <div className="text-2xl font-semibold text-[var(--color-fg)] sm:text-3xl">{v}</div>
              <div className="mono-label mt-2">{l}</div>
            </div>
          ))}
        </div>
      </Container>

      {/* ───────────────── SERVICES ───────────────── */}
      <Container className="py-24 sm:py-28">
        <div className="mb-14 text-center">
          <p className="mono-label">what we do</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-5xl">
            From strategy to shipped
          </h2>
          <p className="mx-auto mt-4 max-w-lg leading-relaxed text-[var(--color-muted)]">
            A full-stack AI partner. We advise, we build, and we stay accountable to the outcome.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="card group p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-neon)]"
            >
              <p className="mono-label">service · {s.tag}</p>
              <h3 className="mt-3 text-xl font-semibold text-[var(--color-fg)]">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/services" className="link-u text-sm">See how we engage →</Link>
        </div>
      </Container>

      {/* ───────────────── PROCESS ───────────────── */}
      <Container className="py-16">
        <div className="mb-12 text-center">
          <p className="mono-label">how we work</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">
            Five phases. One outcome.
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {PROCESS.map((p) => (
            <div key={p.n} className="card p-6">
              <div className="text-2xl font-semibold text-[var(--color-neon)]">{p.n}</div>
              <h3 className="mt-3 font-semibold text-[var(--color-fg)]">{p.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{p.d}</p>
            </div>
          ))}
        </div>
      </Container>

      {/* ───────────────── INDUSTRIES ───────────────── */}
      <Container className="py-16">
        <div className="card flex flex-col items-start justify-between gap-8 p-8 sm:p-10 lg:flex-row lg:items-center">
          <div className="max-w-md">
            <p className="mono-label">industries</p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--color-fg)] sm:text-3xl">
              Domain-aware, not one-size-fits-all
            </h2>
            <p className="mt-3 leading-relaxed text-[var(--color-muted)]">
              We&apos;ve shipped AI where the stakes and the regulations are real. We learn your domain
              before we write a line of code.
            </p>
            <Link href="/industries" className="mt-5 inline-block link-u text-sm">Explore industries →</Link>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {INDUSTRIES.map((i) => (
              <span key={i} className="tag tag-neon">{i}</span>
            ))}
          </div>
        </div>
      </Container>

      {/* ───────────────── STARTUP STUDIO ───────────────── */}
      <Container className="py-12">
        <div className="card-neon relative overflow-hidden p-8 sm:p-12">
          <div className="max-w-2xl">
            <p className="mono-label">for founders</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-3xl">
              Starting from zero? We&apos;ve been there.
            </h2>
            <p className="mt-3 leading-relaxed text-[var(--color-muted)]">
              Company formation in the UAE, an AI-native MVP, first customers, and fundraising support,
              under one roof in Meydan Free Zone. We build alongside you, not just for you.
            </p>
            <Link href="/startups" className="btn btn-primary mt-6">Startup support →</Link>
          </div>
        </div>
      </Container>

      {/* ───────────────── FOUNDERS ───────────────── */}
      <Container className="py-16">
        <div className="mb-10 text-center">
          <p className="mono-label">the team</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">
            Founders who build
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {FOUNDERS.map((f) => (
            <FounderCard key={f.name} {...f} />
          ))}
        </div>
      </Container>

      {/* ───────────────── FINAL CTA ───────────────── */}
      <Container className="py-20">
        <div className="card-neon relative overflow-hidden p-10 text-center sm:p-16">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[100px]"
            style={{ background: "radial-gradient(circle, rgba(185,242,58,0.25), transparent 70%)" }}
          />
          <div className="relative">
            <p className="mono-label">let&apos;s build</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">
              Tell us what you&apos;re trying to move.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[var(--color-muted)]">
              A 30-minute call. We&apos;ll tell you honestly whether AI is the answer, and how we&apos;d approach it.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/contact" className="btn btn-primary">Book a consult →</Link>
              <a href={`mailto:${SITE.email}`} className="btn btn-ghost">{SITE.email}</a>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

function FounderCard({
  name,
  role,
  body,
  img,
  linkedin,
}: {
  name: string;
  role: string;
  body: string;
  img: string;
  linkedin: string;
}) {
  return (
    <div className="card p-8">
      <div className="flex items-center gap-4">
        <Image
          src={img}
          alt={name}
          width={64}
          height={64}
          className="h-16 w-16 shrink-0 rounded-full border border-[var(--color-border-bright)] object-cover"
        />
        <div>
          <h3 className="text-xl font-semibold text-[var(--color-fg)]">{name}</h3>
          <p className="mono-label mt-1">{role}</p>
        </div>
      </div>
      <p className="mt-5 leading-relaxed text-[var(--color-muted)]">{body}</p>
      <a
        href={linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-neon)]"
      >
        LinkedIn ↗
      </a>
    </div>
  );
}
