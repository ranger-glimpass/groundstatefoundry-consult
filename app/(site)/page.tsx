import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui";
import GroundStateMark from "@/components/GroundStateMark";
import MatmulChart from "@/components/MatmulChart";
import { SITE } from "@/lib/site";
import { PRODUCTS, PLAYGROUND, NEARFIELD_REPO } from "@/lib/products";
import { getAllResearch, categoryTitle, RESEARCH_CATEGORIES } from "@/lib/research";

const DARWEEL_REPORT_URL = "https://www.onevoid.org/post/conditional-winograd-by-edbbc5b2";

const MATMUL = [
  { v: "64", l: "schoolbook method" },
  { v: "49", l: "Strassen, applied twice" },
  { v: "48", l: "rediscovered by our system, matching Winograd" },
  { v: "47.94", l: "average across 500 test cases, all correct" },
];

const RESULTS = [
  {
    label: "voice · nearfield",
    v: "15.9%",
    unit: "of the caller's words lost with an equally loud person talking behind them",
    body: "Nearfield keeps the voice closest to the microphone and cuts everything else. We mixed 40 callers with a background talker at the same loudness, sent the result through a phone line and gave it to a speech recogniser. With no filter it lost 41.4% of the caller's words. Through Nearfield v2 it lost 15.9%.",
    note: "Version 2 is our own model, 2.5 MB, running on one CPU thread with 48 ms of delay. A second set of weights takes 80 ms and loses 13.6%. With a whole room talking the 48 ms model still loses more than a third of the caller's words, about the same as no filter, and the background stays faintly audible under the caller.",
    links: [
      { href: "/products/nearfield", label: "Try the demo" },
      { href: NEARFIELD_REPO, label: "Code on GitHub" },
    ],
  },
  {
    label: "simulation · agents that call agents",
    v: "20",
    unit: "concurrent calls, end to end, through the full stack",
    body: "We test voice agents by having other AI agents call them over real telephony. Paired caller and receiver agents put the whole pipeline under genuine load, with no customer anywhere near it.",
    note: "20 is the tested ceiling from logged runs, not a theoretical maximum.",
    links: [{ href: "/research/test-with-more-ai", label: "How it works" }],
  },
];

const AREAS = [
  { slug: "voice-ai", t: "Voice", d: "Latency, turn-taking, and hearing only the person you are talking to." },
  { slug: "multi-agent-systems", t: "Agents", d: "Many agents working, messaging, and handing off work to each other." },
  { slug: "agent-simulation", t: "Simulation", d: "Simulated people and traffic that test a system before real users reach it." },
  { slug: "evolutionary-systems", t: "Evolutionary search", d: "Code that changes itself and finds answers we did not hand it." },
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
  const research = getAllResearch().slice(0, 5);
  const areas = AREAS.map((a) => ({ ...a, cat: RESEARCH_CATEGORIES.find((c) => c.slug === a.slug) })).filter(
    (a) => a.cat,
  );
  const openSource = PRODUCTS.filter((p) => p.repo);

  return (
    <>
      {/* ───────────── HERO ───────────── */}
      <section>
        <Container className="grid min-h-[72vh] items-center gap-12 py-16 lg:grid-cols-[1.35fr_1fr]">
          <div>
          <p className="reveal mono-label" style={{ animationDelay: "0ms" }}>
            Ground State Foundry · AI research lab
          </p>

          <h1
            className="reveal mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-[var(--color-fg)] sm:text-6xl"
            style={{ animationDelay: "90ms" }}
          >
            We study how AI listens, acts and improves. Then we ship what works.
          </h1>

          <p
            className="reveal mt-6 max-w-2xl text-pretty text-base leading-relaxed text-[var(--color-muted)]"
            style={{ animationDelay: "200ms" }}
          >
            Our research covers voice, agents, simulation and evolutionary search. We publish what
            we find, release the tools as open source, and put the rest into Lisn, an AI that talks
            to your customers.
          </p>

          <div className="reveal mt-9 flex flex-wrap items-center gap-3" style={{ animationDelay: "320ms" }}>
            <Link href="/research" className="btn btn-primary">Read research →</Link>
            <Link href="/products" className="btn btn-ghost">What we&apos;ve shipped</Link>
          </div>

          </div>

          <div className="reveal w-full max-w-sm justify-self-center lg:max-w-none" style={{ animationDelay: "420ms" }}>
            <GroundStateMark className="w-full" />
            <p className="mt-5 text-center text-sm text-[var(--color-muted)]">{SITE.tagline}</p>
          </div>
        </Container>
      </section>

      {/* ───────────── RESULTS ───────────── */}
      <Container className="py-12">
        <div>
          <div>
            <p className="mono-label">results</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">
              What we found, and where to check it
            </h2>
          </div>
        </div>

        <div className="card mt-10 p-8 sm:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-center">
            <div>
              <p className="mono-label">evolutionary search · darweel</p>
              <h3 className="mt-4 text-balance text-2xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-3xl">
                Our system rediscovered a classic 48-multiplication method on its own. Then it went lower.
              </h3>
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
          </div>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {RESULTS.map((r) => (
            <div key={r.label} className="card flex flex-col p-8">
              <p className="mono-label">{r.label}</p>
              <div className="mt-5 text-4xl font-semibold tabular-nums tracking-tight text-[var(--color-fg)]">{r.v}</div>
              <p className="mt-2 text-sm text-[var(--color-muted)]">{r.unit}</p>
              <p className="mt-5 flex-1 leading-relaxed text-[var(--color-muted)]">{r.body}</p>
              <p className="mt-4 text-xs leading-relaxed text-[var(--color-dim)]">{r.note}</p>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {r.links.map((l) =>
                  l.href.startsWith("http") ? (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="link-u">
                      {l.label} ↗
                    </a>
                  ) : (
                    <Link key={l.href} href={l.href} className="link-u">{l.label} →</Link>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* ───────────── RESEARCH AREAS + LATEST ───────────── */}
      <Container className="py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">What we study</h2>
          <Link href="/research" className="link-u text-sm">All research →</Link>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {areas.map((a) => (
            <Link
              key={a.slug}
              href={`/research#${a.slug}`}
              className="card group flex flex-col p-7 transition-colors duration-300 hover:border-[var(--color-muted)]"
            >
              <h3 className="text-lg font-semibold text-[var(--color-fg)]">{a.t}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-muted)]">{a.d}</p>
              <p className="mt-5 text-xs text-[var(--color-dim)]">{a.cat?.title}</p>
            </Link>
          ))}
        </div>

        {research.length > 0 && (
          <>
            <p className="mono-label mt-14">latest from the lab</p>
            <div className="mt-4 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
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
          </>
        )}
      </Container>

      {/* ───────────── OPEN SOURCE ───────────── */}
      <Container className="py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">Open source</h2>
          <Link href="/products" className="link-u text-sm">Everything we&apos;ve shipped →</Link>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {openSource.map((p) => (
            <div key={p.slug} className="card flex flex-col p-8">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-2xl font-semibold text-[var(--color-fg)]">{p.name}</h3>
                <span className="tag">{p.status}</span>
              </div>
              <p className="mt-4 flex-1 leading-relaxed text-[var(--color-muted)]">{p.line}</p>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {p.page && <Link href={`/products/${p.slug}`} className="link-u">More about {p.name} →</Link>}
                {p.repo && (
                  <a href={p.repo} target="_blank" rel="noopener noreferrer" className="link-u">View on GitHub ↗</a>
                )}
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* ───────────── LISN: one band ───────────── */}
      <Container className="py-12">
        <div className="card flex flex-col items-start justify-between gap-8 p-8 sm:p-12 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <p className="mono-label">product · lisn</p>
              <span className="tag">Early access</span>
            </div>
            <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-3xl">
              Lisn, an AI that talks to your customers.
            </h2>
            <p className="mt-4 leading-relaxed text-[var(--color-muted)]">
              Voice and chat on your website, in English and Arabic. It answers from your own business
              knowledge, captures the lead, books the appointment, and hands over to a person when it
              should. Phone lines are next. It practises against simulated customers before it talks
              to real ones.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link href="/products/lisn" className="btn btn-primary">See how Lisn works →</Link>
            <Link href={PLAYGROUND} className="btn btn-ghost">Try it in the playground</Link>
          </div>
        </div>
      </Container>

      {/* ───────────── FOUNDERS ───────────── */}
      <Container className="py-12">
        <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">Who runs the lab</h2>
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
            Work with the lab, or put Lisn to work.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[var(--color-muted)]">
            Bring us a hard problem in voice, agents, simulation or search, or tell us where your
            customers reach you and we will set Lisn up there first.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/contact" className="btn btn-primary">Collaborate on research →</Link>
            <Link href="/contact" className="btn btn-ghost">Try Lisn early</Link>
          </div>
          <p className="mt-8 text-xs text-[var(--color-dim)]">
            Or write to <a href={`mailto:${SITE.email}`} className="link-u">{SITE.email}</a>
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
