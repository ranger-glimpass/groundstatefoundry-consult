import Link from "next/link";
import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/ui";
import { PRODUCTS } from "@/lib/products";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "What we've shipped",
  alternates: { canonical: "/products" },
  description: "What Ground State Foundry has shipped: Nearfield, which isolates a caller's voice in real time, and Bubbles, for running fleets of AI coding agents, both open source; and Lisn, an AI that talks to your customers.",
};

const ORDER = ["nearfield", "bubbles", "lisn"];
const SHIPPED = [...PRODUCTS].sort((a, b) => ORDER.indexOf(a.slug) - ORDER.indexOf(b.slug));

export default function ProductsPage() {
  return (
    <>
      <PageHeader eyebrow="products" title="What we've shipped" subtitle="Two open-source projects and one product, all out of the same research lab." />
      <Container className="py-16">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SHIPPED.map((p) => (
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
                {p.page && <Link href={`/products/${p.slug}`} className="btn btn-ghost">More about {p.name} →</Link>}
                {p.repo ? (
                  <a href={p.repo} target="_blank" rel="noopener noreferrer" className="btn btn-primary">View on GitHub ↗</a>
                ) : (
                  <Link href="/contact" className="btn btn-primary">Request early access →</Link>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="card mt-12 flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center sm:p-10">
          <div className="max-w-xl">
            <p className="mono-label">the lab behind them</p>
            <p className="mt-3 leading-relaxed text-[var(--color-muted)]">
              Nearfield comes out of our voice research, Bubbles out of our work on multi-agent
              systems, and Lisn out of both, plus the simulations it practises against before it
              talks to customers. The same lab runs evolutionary search: our framework rediscovered
              Winograd&apos;s 48-multiplication method on its own, then averaged 47.94 on a 500-case
              test set.
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
