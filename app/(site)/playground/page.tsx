import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { PICKER_BRIEF } from "@/components/playground/engine/brief";
import { SCENARIOS } from "@/components/playground/scenarios";

export const metadata: Metadata = {
  title: "Playground",
  alternates: { canonical: "/playground" },
  description:
    "Live demos of Lisn. Open a made-up website with Lisn docked on the side, then ask it anything, or let it offer. It clicks, fills in forms and highlights what it is talking about.",
};

export default function PlaygroundPage() {
  return (
    <>
      {/* Read by the Lisn widget on this page only. */}
      <script type="application/json" id="markaible-page" dangerouslySetInnerHTML={{ __html: JSON.stringify(PICKER_BRIEF) }} />
      <header className="border-b border-[var(--color-border)] py-12">
        <Container>
          <p className="mono-label mb-3">playground</p>
          <h1 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-5xl">
            Try Lisn on a real-looking website
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-[var(--color-muted)]">
            This is a live demo, not a recording. Pick a website below. It opens full page with Lisn docked on the side.
            Ask it anything by voice or text, or let it offer to help. It clicks through the pages, fills in the forms,
            and highlights what it is talking about as it goes.
          </p>
          <p className="mt-3 max-w-2xl leading-relaxed text-[var(--color-muted)]">
            The websites are made up for this demo, but they behave like real ones. Click around yourself at any point:
            Lisn sees where you are and follows your lead.
          </p>
        </Container>
      </header>
      <Container className="py-10">
        <ul className="grid gap-4 md:grid-cols-3">
          {SCENARIOS.map((s) => (
            <li key={s.id}>
              {/* A full page load on purpose: the demo page brings its own widget. */}
              <a
                href={`/playground/${s.id}/`}
                className="group flex h-full flex-col rounded-2xl border border-[var(--color-border-bright)] bg-[var(--color-panel)] p-6 transition-colors hover:border-[var(--color-neon)]"
              >
                <span className="flex items-center gap-3">
                  <span className="h-9 w-9 shrink-0 rounded-lg ring-1 ring-white/15" style={{ background: s.brand.swatch }} />
                  <span className="min-w-0">
                    <span className="block text-lg font-semibold text-[var(--color-fg)]">{s.name}</span>
                    <span className="block truncate font-mono text-[11px] text-[var(--color-dim)]">{s.domain}</span>
                  </span>
                </span>
                <span className="mt-4 block leading-relaxed text-[var(--color-muted)]">{s.task}</span>
                <span className="mt-4 block text-sm italic leading-relaxed text-[var(--color-dim)]">“{s.opening}”</span>
                <span className="mt-auto flex items-center justify-between pt-6">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-dim)]">{s.label}</span>
                  <span className="text-sm font-medium text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-neon)]">
                    Open the demo →
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-[var(--color-dim)]">Works best on a laptop or desktop.</p>
      </Container>
    </>
  );
}
