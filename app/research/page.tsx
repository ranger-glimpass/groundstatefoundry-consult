import Link from "next/link";
import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/ui";
import { RESEARCH_CATEGORIES, getAllResearch } from "@/lib/research";

export const metadata: Metadata = {
  title: "Research",
  alternates: { canonical: "/research" },
  description:
    "Original research and slower thoughts from Ground State Foundry on evolutionary systems, voice AI, agents, and the frontier.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function ResearchPage() {
  const all = getAllResearch();

  return (
    <>
      <PageHeader
        eyebrow="research"
        title="From the lab"
        subtitle="Original research and slower thoughts, written the way we'd explain them to a smart friend."
      />
      <Container className="py-16">
        <div className="space-y-16">
          {RESEARCH_CATEGORIES.map((cat) => {
            const pieces = all.filter((p) => p.category === cat.slug);
            if (pieces.length === 0) return null;
            return (
              <section key={cat.slug}>
                <div className="mb-6 max-w-2xl">
                  <p className="mono-label">{cat.slug}</p>
                  <h2 className="mt-3 text-2xl font-semibold text-[var(--color-fg)]">{cat.title}</h2>
                  <p className="mt-2 leading-relaxed text-[var(--color-muted)]">{cat.blurb}</p>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  {pieces.map((p) => (
                    <Link key={p.slug} href={`/research/${p.slug}`} className="card group p-8 transition-colors hover:border-[var(--color-border-bright)]">
                      <div className="flex items-center gap-3 text-xs text-[var(--color-muted)]">
                        <span>{formatDate(p.date)}</span>
                        <span className="text-[var(--color-dim)]">·</span>
                        <span>{p.readingTime}</span>
                      </div>
                      <h3 className="mt-3 text-xl font-semibold text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-neon)]">
                        {p.title}
                      </h3>
                      <p className="mt-3 leading-relaxed text-[var(--color-muted)]">{p.excerpt}</p>
                      <span className="mt-5 inline-block text-sm text-[var(--color-neon)]">Read →</span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </Container>
    </>
  );
}
