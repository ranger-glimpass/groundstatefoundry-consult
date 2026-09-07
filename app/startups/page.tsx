import Link from "next/link";
import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/ui";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Startup Support",
  alternates: { canonical: "/startups" },
  description:
    "From zero to launch: UAE company formation in Meydan Free Zone, an AI-native MVP, go-to-market, and fundraising support.",
};

const STAGES = [
  { n: "01", t: "Formation", d: "Company setup in the UAE, covering Meydan Free Zone licensing, structure, banking, and the legal basics, so you can operate from day one." },
  { n: "02", t: "Build", d: "An AI-native MVP built by senior engineers. We ship the smallest thing real users can touch, fast." },
  { n: "03", t: "Go-to-market", d: "First customers, not first pitch deck. Positioning, outreach, onboarding, and the loop from usage to revenue." },
  { n: "04", t: "Raise", d: "Fundraising readiness: narrative, metrics, and warm intros when the traction is there to back it." },
];

const INCLUDED = [
  "UAE company formation (Meydan Free Zone)",
  "AI-native MVP built by senior engineers",
  "Product & brand design",
  "Go-to-market & first-customer playbook",
  "Cloud, infra & analytics setup",
  "Fundraising readiness & introductions",
];

export default function StartupsPage() {
  return (
    <>
      <PageHeader
        eyebrow="startup support"
        title="From zero to launch"
        subtitle="A studio for founders at ground state. We handle formation, build the product, and help you reach first customers, under one roof in Dubai."
      />
      <Container className="py-16">
        {/* stages */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STAGES.map((s) => (
            <div key={s.n} className="card p-6">
              <div className="text-2xl font-semibold text-[var(--color-neon)]">{s.n}</div>
              <h3 className="mt-3 font-semibold text-[var(--color-fg)]">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{s.d}</p>
            </div>
          ))}
        </div>

        {/* whats included */}
        <div className="mt-12 grid gap-5 lg:grid-cols-[1fr_1fr]">
          <div className="card p-8">
            <p className="mono-label">what&apos;s included</p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--color-fg)]">Everything to get to launch</h2>
            <ul className="mt-6 space-y-3">
              {INCLUDED.map((p) => (
                <li key={p} className="flex items-center gap-2.5 text-sm text-[var(--color-muted)]">
                  <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-[var(--color-neon)] shadow-[0_0_8px_1px_rgba(185,242,58,0.6)]" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="card-neon flex flex-col justify-center p-8">
            <p className="mono-label">how we partner</p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--color-fg)]">We build alongside you</h2>
            <p className="mt-3 leading-relaxed text-[var(--color-muted)]">
              Engage us as a service, or partner deeper. We&apos;re open to equity arrangements with founders we believe in.
              The right structure depends on the stage and the ambition. Let&apos;s talk.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contact" className="btn btn-primary">Pitch us →</Link>
              <a href={`mailto:${SITE.email}`} className="btn btn-ghost">{SITE.email}</a>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
