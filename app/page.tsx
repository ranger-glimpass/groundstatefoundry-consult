import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui";
import { SITE } from "@/lib/site";
import { SERVICES } from "@/lib/services";
import { featuredWork } from "@/lib/work";
import { getAllResearch, categoryTitle } from "@/lib/research";

const PROCESS = [
  { n: "01", t: "Discover", d: "We sit with your team, map the workflow, and find where AI moves a number that matters." },
  { n: "02", t: "Design", d: "A scoped solution with a clear success metric. Not a science project." },
  { n: "03", t: "Build", d: "Senior engineers ship in weeks, with evaluation built in from day one." },
  { n: "04", t: "Deploy", d: "A careful rollout inside your environment, with your people in the loop." },
  { n: "05", t: "Scale", d: "We harden it, watch it, and hand it over, or stay on as your AI partner." },
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
    name: "Rishi Raj",
    role: "Director",
    img: "/rishi.png",
    linkedin: "https://www.linkedin.com/in/rishi-raj-jaiswal-4b353913a/",
    body: "Applied AI and research. Built voice agents that run in production over real telephony, an open-source system for running fleets of AI agents, and a framework where code evolves its own algorithms. Sets the firm's direction and keeps every project tied to a real outcome.",
  },
  {
    name: "Devashish",
    role: "AI Advisor & Strategist",
    img: "/dev.jpg",
    linkedin: "https://www.linkedin.com/in/devajais/",
    body: "Advises on AI strategy and solution architecture end to end, from the model and the data pipeline to the product a customer actually uses. Keeps the hard technical choices honest.",
  },
];

export default function Home() {
  const research = getAllResearch().slice(0, 3);

  return (
    <>
      {/* ───────────── HERO ───────────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[8%] h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-70 blur-[130px]"
          style={{ background: "radial-gradient(circle, rgba(185,242,58,0.2), transparent 70%)" }}
        />
        <Container className="relative flex min-h-[86vh] flex-col items-center justify-center py-20 text-center">
          <p className="reveal mono-label" style={{ animationDelay: "0ms" }}>
            Applied AI Research & Engineering · Meydan Free Zone, Dubai
          </p>

          <h1
            className="reveal mt-5 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight text-[var(--color-fg)] sm:text-6xl"
            style={{ animationDelay: "90ms" }}
          >
            We turn frontier AI research into<br className="hidden sm:block" />{" "}
            <span className="text-[var(--color-neon)]">systems that ship.</span>
          </h1>

          <p
            className="reveal mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-muted)]"
            style={{ animationDelay: "200ms" }}
          >
            Ground State Foundry is an applied AI research and engineering firm. We do original
            research in voice AI, agents, and evolutionary systems, and we build it into production
            systems for enterprises worldwide.{" "}
            <span className="text-[var(--color-fg)]">No slideware. Only execution.</span>
          </p>

          <div className="reveal mt-9 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: "320ms" }}>
            <Link href="/contact" className="btn btn-primary">Book a consult →</Link>
            <Link href="/research" className="btn btn-ghost">See our research</Link>
          </div>

          <p className="reveal mt-6 text-xs text-[var(--color-dim)]" style={{ animationDelay: "420ms" }}>
            {SITE.tagline}
          </p>
        </Container>
      </section>

      {/* ───────────── PROOF STRIP ───────────── */}
      <Container className="py-6">
        <div className="card grid grid-cols-2 divide-y divide-[var(--color-border)] sm:grid-cols-4 sm:divide-x sm:divide-y-0">
          {[
            ["Open source", "our tools are public, under MIT"],
            ["In production", "voice agents on real phone lines"],
            ["Original research", "code that evolves its own algorithms"],
            ["Dubai · global", "based in Meydan, we deliver worldwide"],
          ].map(([v, l]) => (
            <div key={l} className="px-6 py-7 text-center">
              <div className="text-lg font-semibold text-[var(--color-fg)] sm:text-xl">{v}</div>
              <div className="mono-label mt-2 normal-case tracking-normal">{l}</div>
            </div>
          ))}
        </div>
      </Container>

      {/* ───────────── SERVICES ───────────── */}
      <Container className="py-24 sm:py-28">
        <div className="mb-14 text-center">
          <p className="mono-label">what we do</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-5xl">
            From research to shipped
          </h2>
          <p className="mx-auto mt-4 max-w-lg leading-relaxed text-[var(--color-muted)]">
            We advise, we build, and we stay accountable to the outcome. Six ways to work with us.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="card group p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-neon)]"
            >
              <p className="mono-label">service · {s.num}</p>
              <h3 className="mt-3 text-xl font-semibold text-[var(--color-fg)]">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{s.summary}</p>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/services" className="link-u text-sm">See all services →</Link>
        </div>
      </Container>

      {/* ───────────── RESEARCH-LED DIFFERENTIATOR ───────────── */}
      <Container className="py-12">
        <div className="card-neon relative overflow-hidden p-8 sm:p-12">
          <div className="max-w-2xl">
            <p className="mono-label">why we are different</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-3xl">
              We do not just advise on AI. We do the research.
            </h2>
            <p className="mt-4 leading-relaxed text-[var(--color-muted)]">
              Our framework evolved a matrix-multiplication algorithm that came in below the
              textbook result, and nobody designed it, it emerged from the search. Our open-source
              system runs whole fleets of AI agents that talk to each other and spawn more on their
              own. That research is not a side project. It is what makes the systems we build for
              you sharper than the ones you can buy off a shelf.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/research" className="btn btn-primary">Read our research →</Link>
              <Link href="/work" className="btn btn-ghost">See what we have built</Link>
            </div>
          </div>
        </div>
      </Container>

      {/* ───────────── FEATURED WORK ───────────── */}
      <Container className="py-16">
        <div className="mb-12 text-center">
          <p className="mono-label">selected work</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">
            Things we have shipped
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {featuredWork().map((w) => (
            <div key={w.slug} className="card p-7">
              <div className="flex items-center justify-between gap-3">
                <span className="tag tag-neon">{w.tag}</span>
                <span className="mono-label">{w.status}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[var(--color-fg)]">{w.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{w.summary}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/work" className="link-u text-sm">See all work →</Link>
        </div>
      </Container>

      {/* ───────────── PROCESS ───────────── */}
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

      {/* ───────────── FROM THE LAB (research) ───────────── */}
      {research.length > 0 && (
        <Container className="py-16">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mono-label">from the lab</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">
                Latest research
              </h2>
            </div>
            <Link href="/research" className="link-u text-sm">All research →</Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {research.map((r) => (
              <Link
                key={r.slug}
                href={`/research/${r.slug}`}
                className="card group flex flex-col p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-neon)]"
              >
                <p className="mono-label">{categoryTitle(r.category)}</p>
                <h3 className="mt-3 text-lg font-semibold leading-snug text-[var(--color-fg)]">{r.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-muted)]">{r.excerpt}</p>
                <p className="mt-4 text-xs text-[var(--color-dim)]">{r.readingTime}</p>
              </Link>
            ))}
          </div>
        </Container>
      )}

      {/* ───────────── INDUSTRIES ───────────── */}
      <Container className="py-16">
        <div className="card flex flex-col items-start justify-between gap-8 p-8 sm:p-10 lg:flex-row lg:items-center">
          <div className="max-w-md">
            <p className="mono-label">industries</p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--color-fg)] sm:text-3xl">
              Domain-aware, not one-size-fits-all
            </h2>
            <p className="mt-3 leading-relaxed text-[var(--color-muted)]">
              We have shipped AI where the stakes and the regulations are real. We learn your domain
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

      {/* ───────────── FOUNDERS ───────────── */}
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

      {/* ───────────── LOCATION ───────────── */}
      <Container className="py-12">
        <div className="card flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center sm:p-10">
          <div>
            <p className="mono-label">where we are</p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--color-fg)]">{SITE.address.zone}, Dubai</h2>
            <p className="mt-3 leading-relaxed text-[var(--color-muted)]">
              Based in Dubai, we work with clients around the world.
            </p>
          </div>
          <Link href="/contact" className="btn btn-ghost shrink-0">Get in touch →</Link>
        </div>
      </Container>

      {/* ───────────── FINAL CTA ───────────── */}
      <Container className="py-20">
        <div className="card-neon relative overflow-hidden p-10 text-center sm:p-16">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[100px]"
            style={{ background: "radial-gradient(circle, rgba(185,242,58,0.25), transparent 70%)" }}
          />
          <div className="relative">
            <p className="mono-label">let us build</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">
              Tell us what you are trying to move.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[var(--color-muted)]">
              A 30-minute call. We will tell you honestly whether AI is the answer, and how we would
              approach it.
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
