import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui";
import GroundStateMark from "@/components/GroundStateMark";
import MatmulChart from "@/components/MatmulChart";
import { SITE } from "@/lib/site";
import { SERVICES } from "@/lib/services";
import { WORK } from "@/lib/work";
import { getAllResearch, categoryTitle } from "@/lib/research";

const BUBBLES_URL = "https://github.com/Sentinal-Glimpass/bubbles";
/** The homepage research list is hidden for now; the /research pages stay live. */
const SHOW_RESEARCH_LIST = false;
const DARWEEL_REPORT_URL = "https://www.onevoid.org/post/conditional-winograd-by-edbbc5b2";

/** The three service lines we lead with; the rest live on /services. */
const LEAD_SERVICES = ["voice-ai", "ai-agents-automation", "simulation"];

const MATMUL = [
  { v: "64", l: "schoolbook method" },
  { v: "49", l: "Strassen, applied twice" },
  { v: "48", l: "rediscovered by our system, matching Winograd" },
  { v: "47.94", l: "average across 500 test cases, all correct" },
];

const PROCESS = [
  { n: "01", t: "Connect", d: "Point Lisn at your website, your phone numbers, and the tools it needs to get things done." },
  { n: "02", t: "Teach", d: "Give it your products, policies, and the answers your best people give." },
  { n: "03", t: "Practise", d: "Lisn talks to simulated customers first, and every conversation that goes wrong becomes a fix." },
  { n: "04", t: "Go live", d: "It starts answering real visitors and callers, and hands over to a person when it should." },
  { n: "05", t: "Improve", d: "It keeps practising against new situations, so it gets better every week." },
];

const FOUNDERS = [
  {
    name: "Rishi Raj",
    role: "Founder & Chief Scientist",
    img: "/rishi.png",
    linkedin: "https://www.linkedin.com/in/rishi-raj-jaiswal-4b353913a/",
    body: "Applied AI and research. Built voice agents that run in production over real telephony, an open-source system for running fleets of AI agents, and a framework where code evolves its own algorithms. Leads Lisn's research and product.",
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
  const lead = LEAD_SERVICES.map((slug) => SERVICES.find((s) => s.slug === slug)!);
  const others = SERVICES.filter((s) => !LEAD_SERVICES.includes(s.slug));
  const [caseStudy, ...moreWork] = WORK.filter((w) => w.featured);
  const research = getAllResearch().slice(0, 4);

  return (
    <>
      {/* ───────────── HERO ───────────── */}
      <section>
        <Container className="grid min-h-[72vh] items-center gap-12 py-16 lg:grid-cols-[1.35fr_1fr]">
          <div>
          <p className="reveal mono-label" style={{ animationDelay: "0ms" }}>
            Lisn · by Ground State Foundry
          </p>

          <h1
            className="reveal mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-[var(--color-fg)] sm:text-6xl"
            style={{ animationDelay: "90ms" }}
          >
            An AI that talks to your customers, wherever they are.
          </h1>

          <p
            className="reveal mt-6 max-w-2xl text-pretty text-base leading-relaxed text-[var(--color-muted)]"
            style={{ animationDelay: "200ms" }}
          >
            Lisn guides visitors on your website, answers and makes phone calls, and resolves the
            issue end to end, in English and Arabic. It gets better by talking to other agents, before
            it talks to your customers.
          </p>

          <div className="reveal mt-9 flex flex-wrap items-center gap-3" style={{ animationDelay: "320ms" }}>
            <Link href="/contact" className="btn btn-primary">Request early access →</Link>
            <Link href="/research" className="btn btn-ghost">Read our research</Link>
            <span className="group relative inline-flex">
              <button
                type="button"
                aria-disabled="true"
                aria-describedby="demo-soon"
                className="btn btn-ghost cursor-not-allowed opacity-40"
              >
                Talk to Lisn
              </button>
              <span
                id="demo-soon"
                role="tooltip"
                className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-[var(--color-border-bright)] bg-[var(--color-panel-2)] px-2.5 py-1 text-xs text-[var(--color-muted)] opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
              >
                Live demo coming soon
              </span>
            </span>
          </div>

          </div>

          <div className="reveal w-full max-w-sm justify-self-center lg:max-w-none" style={{ animationDelay: "420ms" }}>
            <GroundStateMark className="w-full" />
            <p className="mt-5 text-center text-sm text-[var(--color-muted)]">{SITE.tagline}</p>
          </div>
        </Container>
      </section>

      {/* ───────────── SERVICES (lead three) ───────────── */}
      <Container className="py-12">
        <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">What Lisn does</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {lead.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="card group flex flex-col p-8 transition-colors duration-300 hover:border-[var(--color-muted)]"
            >
              <h3 className="text-xl font-semibold text-[var(--color-fg)]">{s.title}</h3>
              <p className="mt-3 flex-1 leading-relaxed text-[var(--color-muted)]">{s.summary}</p>
              <ul className="mt-6 space-y-1.5 text-sm text-[var(--color-dim)]">
                {s.subs.slice(0, 3).map((sub) => (
                  <li key={sub.title}>{sub.title}</li>
                ))}
              </ul>
              <span className="mt-6 text-sm text-[var(--color-fg)]">Learn more →</span>
            </Link>
          ))}
        </div>
        <p className="mt-8 text-sm text-[var(--color-muted)]">
          Built on the same stack:{" "}
          {others.map((s, i) => (
            <span key={s.slug}>
              <Link href={`/services/${s.slug}`} className="link-u">{s.title.replace(" Solutions", "")}</Link>
              {i < others.length - 2 ? ", " : i === others.length - 2 ? ", and " : "."}
            </span>
          ))}{" "}
          We work across legal, finance, healthcare, real estate, retail, and logistics.{" "}
          <Link href="/industries" className="link-u">Industries →</Link>
        </p>
      </Container>

      {/* ───────────── A CHECKABLE RESULT ───────────── */}
      <Container className="py-12">
        <div className="card p-8 sm:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-center">
            <div>
              <p className="mono-label">research result</p>
              <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-3xl">
                Our system rediscovered a classic 48-multiplication method on its own. Then it went lower.
              </h2>
              <p className="mt-4 leading-relaxed text-[var(--color-muted)]">
                We pointed Darweel, our evolutionary framework, at 4x4 matrix multiplication and
                counted the multiplications each candidate used. Programs competed, mutated, and
                reproduced. Without being shown the answer, it arrived at Winograd&apos;s 48. A
                descendant then learned to skip multiplications by zero, which brought the average
                below 48 on the test set.
              </p>
            </div>
            <MatmulChart />
          </div>

          <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-4">
            {MATMUL.map((m, i) => (
              <div key={m.v} className="bg-[var(--color-panel)] p-5">
                <div
                  className={`text-3xl font-semibold tabular-nums ${
                    i === MATMUL.length - 1 ? "text-[var(--color-fg)]" : "text-[var(--color-muted)]"
                  }`}
                >
                  {m.v}
                </div>
                <div className="mt-2 text-xs leading-snug text-[var(--color-dim)]">{m.l}</div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-[var(--color-dim)]">
            Scalar multiplications per 4x4 product. 47.94 is a measured average over 500 test cases; the worst case is still 48. Winograd&apos;s 48 relies on the numbers commuting, so it applies to ordinary numbers, not to every kind of matrix algebra.
          </p>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href="/research/code-that-beats-me" className="link-u">How it happened →</Link>
            <a href={DARWEEL_REPORT_URL} target="_blank" rel="noopener noreferrer" className="link-u">
              The original report ↗
            </a>
            <a href={BUBBLES_URL} target="_blank" rel="noopener noreferrer" className="link-u">
              Also ours: Bubbles, open source on GitHub ↗
            </a>
          </div>
        </div>
      </Container>

      {/* ───────────── WORK: one case study + list ───────────── */}
      <Container className="py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">Things we have shipped</h2>
          <Link href="/work" className="link-u text-sm">All work →</Link>
        </div>

        {caseStudy && (
          <div className="mt-10 grid gap-10 border-t border-[var(--color-border-bright)] pt-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <div className="flex items-center gap-3">
                <span className="tag">{caseStudy.tag}</span>
                <span className="text-xs text-[var(--color-dim)]">{caseStudy.status}</span>
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-[var(--color-fg)] sm:text-3xl">{caseStudy.title}</h3>
              <p className="mt-4 text-lg leading-relaxed text-[var(--color-muted)]">{caseStudy.summary}</p>
            </div>
            <ul className="space-y-4 self-end">
              {caseStudy.points.map((p) => (
                <li key={p} className="border-l border-[var(--color-border-bright)] pl-4 leading-relaxed text-[var(--color-muted)]">
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-12 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
          {moreWork.map((w) => (
            <div key={w.slug} className="grid gap-2 py-6 sm:grid-cols-[1fr_2fr_auto] sm:items-baseline sm:gap-8">
              <h3 className="font-semibold text-[var(--color-fg)]">{w.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--color-muted)]">{w.summary}</p>
              {w.link ? (
                <a href={w.link.href} target="_blank" rel="noopener noreferrer" className="link-u whitespace-nowrap text-sm">
                  {w.link.label} ↗
                </a>
              ) : (
                <span />
              )}
            </div>
          ))}
        </div>
      </Container>

      {/* ───────────── PROCESS: numbered list ───────────── */}
      <Container className="py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">How Lisn goes live</h2>
            <p className="mt-4 max-w-sm leading-relaxed text-[var(--color-muted)]">
              Five steps from first call to an agent that keeps improving on its own.
            </p>
          </div>
          <ol className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
            {PROCESS.map((p) => (
              <li key={p.n} className="grid grid-cols-[3rem_1fr] gap-4 py-5 sm:grid-cols-[3rem_9rem_1fr]">
                <span className="font-mono text-sm tabular-nums text-[var(--color-dim)]">{p.n}</span>
                <span className="font-semibold text-[var(--color-fg)]">{p.t}</span>
                <span className="col-start-2 text-sm leading-relaxed text-[var(--color-muted)] sm:col-start-3">{p.d}</span>
              </li>
            ))}
          </ol>
        </div>
      </Container>

      {/* ───────────── RESEARCH: editorial list ───────────── */}
      {SHOW_RESEARCH_LIST && research.length > 0 && (
        <Container className="py-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">From the lab</h2>
            <Link href="/research" className="link-u text-sm">All research →</Link>
          </div>
          <div className="mt-10 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
            {research.map((r) => (
              <Link
                key={r.slug}
                href={`/research/${r.slug}`}
                className="group grid gap-2 py-7 sm:grid-cols-[12rem_1fr] sm:gap-8"
              >
                <span className="text-xs text-[var(--color-dim)]">{categoryTitle(r.category)}</span>
                <span>
                  <span className="block text-xl font-semibold text-[var(--color-fg)] underline-offset-4 group-hover:underline">
                    {r.title}
                  </span>
                  <span className="mt-2 block max-w-2xl text-sm leading-relaxed text-[var(--color-muted)]">{r.excerpt}</span>
                </span>
              </Link>
            ))}
          </div>
        </Container>
      )}

      {/* ───────────── FOUNDERS ───────────── */}
      <Container className="py-12">
        <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">Who is building Lisn</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {FOUNDERS.map((f) => (
            <FounderCard key={f.name} {...f} />
          ))}
        </div>
      </Container>

      {/* ───────────── FINAL CTA ───────────── */}
      <Container className="py-12">
        <div className="card-neon p-10 text-center sm:p-16">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">
            Put Lisn where your customers already are.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[var(--color-muted)]">
            We are onboarding a small group of early teams. Tell us where your customers reach you,
            and we will set Lisn up there first.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/contact" className="btn btn-primary">Request early access →</Link>
            <a href={`mailto:${SITE.email}`} className="btn btn-ghost">{SITE.email}</a>
          </div>
          <p className="mt-8 text-xs text-[var(--color-dim)]">
            Ground State Foundry · {SITE.address.zone}, Dubai
          </p>
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
    <div className="card flex flex-col gap-6 p-8 sm:flex-row">
      <Image
        src={img}
        alt={name}
        width={128}
        height={128}
        className="h-28 w-28 shrink-0 rounded-2xl border border-[var(--color-border-bright)] object-cover object-top grayscale contrast-[1.05]"
      />
      <div>
        <h3 className="text-xl font-semibold text-[var(--color-fg)]">{name}</h3>
        <p className="mt-1 text-sm text-[var(--color-dim)]">{role}</p>
        <p className="mt-4 leading-relaxed text-[var(--color-muted)]">{body}</p>
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
        >
          LinkedIn ↗
        </a>
      </div>
    </div>
  );
}
