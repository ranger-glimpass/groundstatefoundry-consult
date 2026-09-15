import Link from "next/link";
import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/ui";
import { SITE } from "@/lib/site";
import { WORK } from "@/lib/work";

export const metadata: Metadata = {
  title: "Work",
  alternates: { canonical: "/work" },
  description:
    "Selected work from Ground State Foundry: production voice agents, autonomous outreach, open-source agent tooling, and original research.",
};

export default function WorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="work"
        title="What we have built"
        subtitle="A few things we have shipped and released. Some are live products, some are open source, some are research. Where a client's name is theirs to share, we describe the work instead."
      />
      <Container className="py-16">
        <div className="grid gap-5 md:grid-cols-2">
          {WORK.map((w) => (
            <div key={w.slug} className="card flex flex-col p-8">
              <div className="flex items-center justify-between gap-3">
                <span className="tag tag-neon">{w.tag}</span>
                <span className="mono-label">{w.status}</span>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-[var(--color-fg)]">{w.title}</h2>
              <p className="mt-2 leading-relaxed text-[var(--color-muted)]">{w.summary}</p>
              <ul className="mt-5 space-y-2">
                {w.points.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-sm text-[var(--color-muted)]">
                    <span className="mt-[7px] h-[6px] w-[6px] shrink-0 rounded-full bg-[var(--color-neon)] shadow-[0_0_8px_1px_rgba(185,242,58,0.6)]" />
                    {p}
                  </li>
                ))}
              </ul>
              {w.link && (
                <a
                  href={w.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-block text-sm text-[var(--color-neon)] underline-offset-4 hover:underline"
                >
                  {w.link.label} ↗
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="card-neon mt-12 p-10 text-center">
          <p className="mono-label">your project</p>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--color-fg)] sm:text-3xl">
            Want something like this built?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[var(--color-muted)]">
            Tell us the problem. We will tell you honestly what it takes.
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
