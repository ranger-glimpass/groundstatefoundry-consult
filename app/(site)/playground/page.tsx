import type { Metadata } from "next";
import { Container } from "@/components/ui";
import FrontDeskRush from "@/components/playground/FrontDeskRush";
import { LISN_AGENT_ID } from "@/lib/products";

export const metadata: Metadata = {
  title: "Playground",
  alternates: { canonical: "/playground" },
  description: "Run the front desk of a made-up clinic with Lisn. Talk or type, and watch it book, call back, capture leads, and hand over to a person.",
};

// Read by the Lisn widget on this page only.
const PAGE_BRIEF = {
  instructions: [
    "You are Lisn, playing Front Desk Rush with the visitor on groundstatefoundry.com/playground.",
    "The visitor runs the front desk of Cedar Clinic, a made-up clinic. Customer tickets arrive one at a time; the current ticket and the free slots are in the page context.",
    "When the visitor asks you to handle a ticket, resolve it with one tool call: book_appointment, book_callback, capture_lead or hand_off.",
    "Only use slots listed as free in the page context. Never invent slots, names or ticket details. If a tool fails, read the error, tell the visitor briefly, and fix it.",
    "Reply in the visitor's language. Keep every turn to one or two sentences.",
    "If the visitor asks how Lisn would work on their own website, answer from groundstatefoundry.com and point them to Request early access.",
  ].join(" "),
};

export default function PlaygroundPage() {
  return (
    <>
      <script type="application/json" id="markaible-page" dangerouslySetInnerHTML={{ __html: JSON.stringify(PAGE_BRIEF) }} />
      <header className="border-b border-[var(--color-border)] py-14">
        <Container>
          <p className="mono-label mb-3">playground</p>
          <h1 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-5xl">
            Front Desk Rush
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-[var(--color-muted)]">
            Five customers are waiting at a made-up clinic. Talk or type to Lisn and it works the
            site in front of you: it books the slot, switches to Arabic, takes a callback when the
            day is full, captures a sales lead, and hands the angry one to a person.
          </p>
          {!LISN_AGENT_ID && (
            <p className="mt-4 max-w-2xl text-sm text-[var(--color-dim)]">
              Lisn is being connected to this page. Until then, you can play the desk by hand.
            </p>
          )}
        </Container>
      </header>
      <Container className="py-12">
        <FrontDeskRush />
      </Container>
    </>
  );
}
