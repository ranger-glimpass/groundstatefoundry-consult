import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/ui";
import ContactForm from "@/components/ContactForm";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  alternates: { canonical: "/contact" },
  description:
    "Talk to Ground State Foundry, an AI consultancy in Meydan Free Zone, Dubai. Book a consult or send an enquiry.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="contact"
        title="Let's build something real"
        subtitle="A 30-minute call. We'll tell you honestly whether AI is the answer, and how we'd approach it."
      />
      <Container className="py-16">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <ContactForm />

          <div className="space-y-5">
            <div className="card p-8">
              <p className="mono-label">email</p>
              <a
                href={`mailto:${SITE.email}`}
                className="mt-2 block text-lg text-[var(--color-neon)] underline-offset-4 hover:underline"
              >
                {SITE.email}
              </a>
              <a
                href={SITE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-neon)]"
              >
                LinkedIn ↗
              </a>
            </div>

            <div className="card p-8">
              <p className="mono-label">{SITE.address.zone}</p>
              <address className="mt-3 not-italic leading-relaxed text-[var(--color-muted)]">
                {SITE.address.line1}
                <br />
                {SITE.address.line2}
                <br />
                {SITE.address.city}
              </address>
              <a
                href="https://maps.google.com/?q=Meydan+Grandstand+Dubai"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm text-[var(--color-neon)] underline-offset-4 hover:underline"
              >
                Open in Maps ↗
              </a>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
