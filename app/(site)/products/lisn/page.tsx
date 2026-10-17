import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui";
import ResearchLinks from "@/components/ResearchLinks";
import { LISN_CAPABILITIES, LISN_STEPS, LISN_RESEARCH, LISN_DEMO_VIDEO } from "@/lib/products";

export const metadata: Metadata = {
  title: "Lisn",
  alternates: { canonical: "/products/lisn" },
  description:
    "Lisn is an AI that talks to your customers wherever they are: it talks with visitors on your website by voice or chat, captures leads, books appointments, and hands over to a person when it should. Phone lines are next.",
};

export default function LisnPage() {
  return (
    <>
      <header className="border-b border-[var(--color-border)] py-16">
        <Container>
          <div className="flex flex-wrap items-center gap-3">
            <p className="mono-label">product</p>
            <span className="tag">Early access</span>
          </div>
          <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-5xl">
            Lisn talks to your customers, wherever they are.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--color-muted)]">
            One agent on your website today, and on your phone lines next. It talks or chats with
            visitors, answers from what your business actually offers, books, and hands over to a
            person, in English and Arabic. It practises against simulated customers before it talks
            to real ones.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="btn btn-primary">Request early access →</Link>
            <a href={LISN_DEMO_VIDEO} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Watch it guide a visitor ↗</a>
          </div>
        </Container>
      </header>

      <Container className="py-16">
        <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">What Lisn does</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {LISN_CAPABILITIES.map((c) => (
            <div key={c.id} id={c.id} className="card flex scroll-mt-24 flex-col p-8">
              <h3 className="text-xl font-semibold text-[var(--color-fg)]">{c.t}</h3>
              <p className="mt-3 flex-1 leading-relaxed text-[var(--color-muted)]">{c.d}</p>
              <p className="mt-6 text-xs text-[var(--color-dim)]">{c.from}</p>
              {c.link.href.startsWith("http") ? (
                <a href={c.link.href} target="_blank" rel="noopener noreferrer" className="link-u mt-2 text-sm">{c.link.label}</a>
              ) : (
                <Link href={c.link.href} className="link-u mt-2 text-sm">{c.link.label}</Link>
              )}
            </div>
          ))}
        </div>
      </Container>

      <Container className="py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">How Lisn goes live</h2>
            <p className="mt-4 max-w-sm leading-relaxed text-[var(--color-muted)]">
              Five steps from connecting your channels to an agent that keeps improving on its own.
            </p>
          </div>
          <ol className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
            {LISN_STEPS.map((p) => (
              <li key={p.n} className="grid grid-cols-[3rem_1fr] gap-4 py-5 sm:grid-cols-[3rem_9rem_1fr]">
                <span className="font-mono text-sm tabular-nums text-[var(--color-dim)]">{p.n}</span>
                <span className="font-semibold text-[var(--color-fg)]">{p.t}</span>
                <span className="col-start-2 text-sm leading-relaxed text-[var(--color-muted)] sm:col-start-3">{p.d}</span>
              </li>
            ))}
          </ol>
        </div>
      </Container>

      <Container className="py-12">
        <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">The research inside it</h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-[var(--color-muted)]">
          Lisn is built from systems we have already run in production, and from the lab work that
          made them better. These are the pieces that went into it.
        </p>
        <div className="mt-8">
          <ResearchLinks slugs={LISN_RESEARCH} />
        </div>
      </Container>

      <Container className="py-12">
        <div className="card-neon p-10 text-center sm:p-14">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-[var(--color-fg)]">
            Put Lisn where your customers already are.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[var(--color-muted)]">
            We are onboarding a small group of early teams. Tell us where your customers reach you,
            and we will set Lisn up there first.
          </p>
          <Link href="/contact" className="btn btn-primary mt-8">Request early access →</Link>
        </div>
      </Container>
    </>
  );
}
