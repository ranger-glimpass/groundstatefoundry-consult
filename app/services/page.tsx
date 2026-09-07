import Link from "next/link";
import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/ui";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  alternates: { canonical: "/services" },
  description:
    "Enterprise AI solutions, strategy, agents & automation, data infrastructure, and product engineering from a Dubai-based AI consultancy.",
};

const SERVICES = [
  {
    tag: "01",
    title: "Enterprise AI Solutions",
    body: "We build LLM applications, RAG systems, and copilots directly into your stack, with retrieval, guardrails, and evaluation designed for accuracy and security.",
    points: ["Custom LLM & RAG applications", "Knowledge copilots & assistants", "Document & workflow intelligence", "Security & access-aware design"],
  },
  {
    tag: "02",
    title: "AI Strategy & Advisory",
    body: "Before a line of code, we map where AI earns real return. You get a prioritized roadmap, a readiness assessment, and clear success metrics.",
    points: ["Opportunity mapping & prioritization", "AI readiness & data audit", "Build-vs-buy & vendor selection", "Executive & team enablement"],
  },
  {
    tag: "03",
    title: "AI Agents & Automation",
    body: "Agentic systems that take real work off your team across support, operations, research, and back-office, measured on outcomes, not demos.",
    points: ["Multi-step agent workflows", "Tool & API integration", "Human-in-the-loop controls", "Cost & latency optimization"],
  },
  {
    tag: "04",
    title: "Data & ML Infrastructure",
    body: "The unglamorous foundations that make AI reliable: pipelines, vector stores, evaluation harnesses, monitoring, and MLOps.",
    points: ["Data pipelines & vector stores", "Evaluation & observability", "MLOps & deployment", "Fine-tuning & model routing"],
  },
  {
    tag: "05",
    title: "Product Engineering",
    body: "Senior, AI-native teams that ship from MVP to scale with the craft of a top product studio: full-stack, design-aware, fast.",
    points: ["MVP to production", "Full-stack web & mobile", "Design & UX", "Cloud & DevOps"],
  },
  {
    tag: "06",
    title: "Startup Studio",
    body: "For founders at zero: UAE company formation, an AI-native MVP, go-to-market, and a path to first paying customers.",
    points: ["UAE company formation", "MVP build & launch", "Go-to-market support", "Fundraising readiness"],
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="services"
        title="A full-stack AI partner"
        subtitle="We advise, we build, and we stay accountable to the outcome. Engage us for a single project or as your ongoing AI team."
      />
      <Container className="py-16">
        <div className="grid gap-5 md:grid-cols-2">
          {SERVICES.map((s) => (
            <div key={s.title} className="card p-8">
              <p className="mono-label">service · {s.tag}</p>
              <h3 className="mt-3 text-2xl font-semibold text-[var(--color-fg)]">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-[var(--color-muted)]">{s.body}</p>
              <ul className="mt-5 space-y-2">
                {s.points.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-sm text-[var(--color-muted)]">
                    <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-[var(--color-neon)] shadow-[0_0_8px_1px_rgba(185,242,58,0.6)]" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="card-neon mt-12 p-10 text-center">
          <p className="mono-label">engagement</p>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--color-fg)] sm:text-3xl">
            Not sure which you need?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[var(--color-muted)]">
            Most engagements start with a short discovery sprint. We&apos;ll scope the smallest thing worth building.
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
