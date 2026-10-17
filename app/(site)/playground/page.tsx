import type { Metadata } from "next";
import { Container } from "@/components/ui";
import Playground from "@/components/playground/Playground";
import { PAGE_BRIEF } from "@/components/playground/engine/brief";
import { LISN_AGENT_ID } from "@/lib/products";

export const metadata: Metadata = {
  title: "Playground",
  alternates: { canonical: "/playground" },
  description:
    "Watch Lisn work a website. Pick a made-up site, talk or type to Lisn, and it clicks, fills forms and points things out on the page in front of you. Or press Autoplay.",
};

export default function PlaygroundPage() {
  return (
    <>
      {/* Read by the Lisn widget on this page only. */}
      <script type="application/json" id="markaible-page" dangerouslySetInnerHTML={{ __html: JSON.stringify(PAGE_BRIEF) }} />
      <header className="border-b border-[var(--color-border)] py-12">
        <Container>
          <p className="mono-label mb-3">playground</p>
          <h1 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-5xl">
            Watch Lisn work a website
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-[var(--color-muted)]">
            Pick a website below. They are made up for this demo, but they behave like real ones. Then talk or type to
            Lisn and ask for something, the way a customer would. It clicks through the pages, fills in the forms, and
            lights up the line you need to read.
          </p>
          <p className="mt-3 max-w-2xl leading-relaxed text-[var(--color-muted)]">
            No microphone handy? Press Autoplay and Lisn runs through the tasks on its own. You can also click around
            yourself at any point. Lisn sees where you are, and stops when you take over.
          </p>
          {!LISN_AGENT_ID && (
            <p className="mt-4 max-w-2xl text-sm text-[var(--color-dim)]">
              Lisn is being connected to this page. Until then, Autoplay and your own clicks still work.
            </p>
          )}
        </Container>
      </header>
      <Container className="py-8">
        <Playground />
      </Container>
    </>
  );
}
