import Link from "next/link";
import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/ui";
import { SITE } from "@/lib/site";
import { SERVICES } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services",
  alternates: { canonical: "/services" },
  description:
    "Voice AI, agents and automation, enterprise AI, simulation, strategy, and data infrastructure from a Dubai-based applied AI firm.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="services"
        title="What you can hire us for"
        subtitle="Six things we do, from a phone line that answers itself to the plumbing that keeps AI reliable in production."
      />
      <Container className="py-16">
        <div className="grid gap-5 md:grid-cols-2">
          {SERVICES.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="card p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-neon)]"
            >
              <p className="mono-label">service · {s.num}</p>
              <h3 className="mt-3 text-2xl font-semibold text-[var(--color-fg)]">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-[var(--color-muted)]">{s.summary}</p>
              <p className="mt-5 mono-label text-[var(--color-dim)]">
                {s.subs.length} capabilities
              </p>
            </Link>
          ))}
        </div>

        <div className="card-neon mt-12 p-10 text-center">
          <p className="mono-label">engagement</p>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--color-fg)] sm:text-3xl">
            Not sure which you need?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[var(--color-muted)]">
            Most engagements start with a short discovery sprint. We&apos;ll scope the smallest thing worth building.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link href="/contact" className="btn btn-primary">Book a consult →</Link>
            <a href={`mailto:${SITE.email}`} className="btn btn-ghost">{SITE.email}</a>
          </div>
        </div>
      </Container>
    </>
  );
}
