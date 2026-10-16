import Link from "next/link";
import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/ui";
import { PRODUCTS, BUBBLES_REPO } from "@/lib/products";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Products",
  alternates: { canonical: "/products" },
  description: "Lisn, an AI that talks to your customers wherever they are, and Bubbles, an open-source tool for running fleets of AI coding agents.",
};

export default function ProductsPage() {
  return (
    <>
      <PageHeader eyebrow="products" title="What we make" subtitle="Two products, one research lab behind them." />
      <Container className="py-16">
        <div className="grid gap-5 md:grid-cols-2">
          {PRODUCTS.map((p) => (
            <div key={p.slug} className="card flex flex-col p-8">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-semibold text-[var(--color-fg)]">{p.name}</h2>
                <span className="tag">{p.status}</span>
              </div>
              <p className="mt-4 text-lg leading-relaxed text-[var(--color-fg)]">{p.line}</p>
              <p className="mt-3 leading-relaxed text-[var(--color-muted)]">{p.summary}</p>
              <ul className="mt-6 flex-1 space-y-2">
                {p.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-[var(--color-muted)]">
                    <span className="mt-[7px] h-[6px] w-[6px] shrink-0 rounded-full bg-[var(--color-muted)]" />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={`/products/${p.slug}`} className="btn btn-ghost">More about {p.name} →</Link>
                {p.slug === "lisn" ? (
                  <Link href="/contact" className="btn btn-primary">Request early access →</Link>
                ) : (
                  <a href={BUBBLES_REPO} target="_blank" rel="noopener noreferrer" className="btn btn-primary">View on GitHub ↗</a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="card mt-12 flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center sm:p-10">
          <div className="max-w-xl">
            <p className="mono-label">the lab behind them</p>
            <p className="mt-3 leading-relaxed text-[var(--color-muted)]">
              Both products come out of our research in voice AI, agent simulation, multi-agent
              systems, and evolutionary search. Our evolutionary framework rediscovered Winograd&apos;s
              48-multiplication method on its own, then averaged 47.94 on a 500-case test set.
            </p>
          </div>
          <Link href="/research" className="btn btn-ghost shrink-0">Read the research →</Link>
        </div>

        <p className="mt-10 text-sm text-[var(--color-dim)]">
          Questions? <a href={`mailto:${SITE.email}`} className="link-u">{SITE.email}</a>
        </p>
      </Container>
    </>
  );
}
