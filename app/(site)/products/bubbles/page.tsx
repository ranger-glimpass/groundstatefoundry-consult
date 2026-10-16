import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui";
import ResearchLinks from "@/components/ResearchLinks";
import { BUBBLES_REPO, BUBBLES_RESEARCH, getProduct } from "@/lib/products";

export const metadata: Metadata = {
  title: "Bubbles",
  alternates: { canonical: "/products/bubbles" },
  description: "Bubbles is an open-source (MIT) terminal tool that runs a whole fleet of AI coding agents.",
};

export default function BubblesPage() {
  const p = getProduct("bubbles")!;
  return (
    <>
      <header className="border-b border-[var(--color-border)] py-16">
        <Container>
          <div className="flex flex-wrap items-center gap-3">
            <p className="mono-label">product</p>
            <span className="tag">{p.status}</span>
          </div>
          <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-5xl">
            Bubbles runs a fleet of AI coding agents from your terminal.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--color-muted)]">{p.summary}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={BUBBLES_REPO} target="_blank" rel="noopener noreferrer" className="btn btn-primary">View on GitHub ↗</a>
            <Link href="/research/running-a-fleet" className="btn btn-ghost">Why we built it →</Link>
          </div>
        </Container>
      </header>

      <Container className="py-16">
        <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">What it does</h2>
        <ul className="mt-8 grid gap-5 md:grid-cols-2">
          {p.bullets.map((b) => (
            <li key={b} className="card p-7 leading-relaxed text-[var(--color-fg)]">{b}</li>
          ))}
        </ul>
        <p className="mt-8 max-w-2xl leading-relaxed text-[var(--color-muted)]">
          Bubbles launches the agent CLI once per agent, each in its own folder, and never calls a
          model API itself. That keeps it neutral about which model or account runs each agent. Setup
          and install instructions live in the README on GitHub.
        </p>
      </Container>

      <Container className="py-12">
        <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">How it was designed</h2>
        <div className="mt-8">
          <ResearchLinks slugs={BUBBLES_RESEARCH} />
        </div>
      </Container>

      <Container className="py-12">
        <div className="card p-10 text-center sm:p-14">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-[var(--color-fg)]">Building with agents?</h2>
          <p className="mx-auto mt-4 max-w-md text-[var(--color-muted)]">
            Bubbles is free and open source. If you are running agents at scale, we would like to hear
            what breaks.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={BUBBLES_REPO} target="_blank" rel="noopener noreferrer" className="btn btn-primary">View on GitHub ↗</a>
            <Link href="/contact" className="btn btn-ghost">Talk to us →</Link>
          </div>
        </div>
      </Container>
    </>
  );
}
