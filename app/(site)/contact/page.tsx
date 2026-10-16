import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/ui";
import ContactForm from "@/components/ContactForm";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  alternates: { canonical: "/contact" },
  description:
    "Talk to Ground State Foundry, the applied AI research lab building Lisn, in Meydan Free Zone, Dubai. Request early access to Lisn or send an enquiry.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="contact"
        title="Get early access to Lisn"
        subtitle="We are onboarding a small group of early teams. Tell us where your customers reach you, and we will set Lisn up there first."
      />
      <Container className="py-16">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <ContactForm />

          <div className="space-y-5">
            <div className="card p-8">
              <p className="mono-label">email</p>
              <a
                href={`mailto:${SITE.email}`}
                className="mt-2 block text-lg text-[var(--color-fg)] underline-offset-4 hover:underline"
              >
                {SITE.email}
              </a>
              <a
                href={SITE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
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
                className="mt-4 inline-block text-sm text-[var(--color-fg)] underline-offset-4 hover:underline"
              >
                Open in Maps ↗
              </a>
            </div>

            <div className="card p-8">
              <p className="mono-label">company</p>
              <dl className="mt-3 space-y-1.5 text-sm leading-relaxed text-[var(--color-muted)]">
                <div><dt className="inline text-[var(--color-dim)]">Legal name: </dt><dd className="inline">{SITE.legalName}</dd></div>
                <div><dt className="inline text-[var(--color-dim)]">Licence No.: </dt><dd className="inline">{SITE.licence}</dd></div>
                <div><dt className="inline text-[var(--color-dim)]">Formation No.: </dt><dd className="inline">{SITE.formation}</dd></div>
                <div><dt className="inline text-[var(--color-dim)]">Type: </dt><dd className="inline">Free Zone Limited Liability Company, {SITE.address.zone}</dd></div>
              </dl>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
