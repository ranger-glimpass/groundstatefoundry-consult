import Link from "next/link";
import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/ui";
import { PRODUCTS, MODEL_GROUPS, itemHref } from "@/lib/products";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Models",
  alternates: { canonical: "/models" },
  description:
    "Models from Ground State Foundry. Audio essentials: Nearfield keeps only the caller's voice, Audio Upscaler turns phone audio into full-band speech, and Ant Flash changes an accent live. All run in real time on a CPU.",
};

export default function ModelsPage() {
  return (
    <>
      <PageHeader eyebrow="models" title="Models" subtitle="Models we trained ourselves, measured, and released. Each page has a demo you can listen to." />
      <Container className="py-16">
        {MODEL_GROUPS.map((g) => {
          const models = PRODUCTS.filter((p) => p.kind === "model" && p.group === g.id);
          return (
            <section key={g.id} id={g.id} className="scroll-mt-20">
              <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">{g.name}</h2>
              <p className="mt-4 max-w-2xl leading-relaxed text-[var(--color-muted)]">{g.line}</p>
              <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {models.map((p) => (
                  <div key={p.slug} className="card flex flex-col p-8">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-2xl font-semibold text-[var(--color-fg)]">{p.name}</h3>
                      <span className="tag">{p.status}</span>
                    </div>
                    <p className="mt-4 text-lg leading-relaxed text-[var(--color-fg)]">{p.line}</p>
                    <ul className="mt-6 flex-1 space-y-2">
                      {p.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2.5 text-sm text-[var(--color-muted)]">
                          <span className="mt-[7px] h-[6px] w-[6px] shrink-0 rounded-full bg-[var(--color-muted)]" />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link href={itemHref(p)} className="btn btn-primary">Listen to the demo →</Link>
                      {p.repo && (
                        <a href={p.repo} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">GitHub ↗</a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
        <p className="mt-12 text-sm text-[var(--color-dim)]">
          Want to use a model that is not public yet? <Link href="/contact" className="link-u">Ask us</Link> or write to{" "}
          <a href={`mailto:${SITE.email}`} className="link-u">{SITE.email}</a>.
        </p>
      </Container>
    </>
  );
}
