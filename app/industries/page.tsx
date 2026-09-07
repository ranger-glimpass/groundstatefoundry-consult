import Link from "next/link";
import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Industries",
  alternates: { canonical: "/industries" },
  description:
    "Domain-aware AI for legal, financial services, healthcare, real estate, retail, and logistics.",
};

const INDUSTRIES = [
  { t: "Legal & Compliance", d: "Contract analysis, research copilots, and compliance workflows, with the citations and audit trails the domain demands. Home turf: NeuroLaw AI." },
  { t: "Financial Services", d: "Document processing, risk and KYC automation, and analyst copilots built for accuracy and traceability." },
  { t: "Healthcare", d: "Clinical documentation, intake, and knowledge assistants designed around privacy and human oversight." },
  { t: "Real Estate", d: "Listing intelligence, lead qualification, and tenant/owner assistants tuned for the UAE and global markets." },
  { t: "Retail & E-commerce", d: "Product discovery, support automation, and merchandising copilots that lift conversion and deflect tickets." },
  { t: "Logistics", d: "Operations automation, document extraction, and planning assistants that cut manual coordination." },
];

export default function IndustriesPage() {
  return (
    <>
      <PageHeader
        eyebrow="industries"
        title="Domain-aware, not one-size-fits-all"
        subtitle="We ship AI where stakes and regulations are real. We learn your domain before we write a line of code."
      />
      <Container className="py-16">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((i) => (
            <div key={i.t} className="card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-neon)]">
              <h3 className="text-lg font-semibold text-[var(--color-fg)]">{i.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">{i.d}</p>
            </div>
          ))}
        </div>

        <div className="card mt-12 flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center sm:p-10">
          <div className="max-w-lg">
            <p className="mono-label">don&apos;t see yours?</p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--color-fg)]">
              The method travels across domains.
            </h2>
            <p className="mt-3 leading-relaxed text-[var(--color-muted)]">
              Our discovery process starts by learning your workflow. If AI can move a number that matters, we&apos;ll find it.
            </p>
          </div>
          <Link href="/contact" className="btn btn-primary shrink-0">Talk to us →</Link>
        </div>
      </Container>
    </>
  );
}
