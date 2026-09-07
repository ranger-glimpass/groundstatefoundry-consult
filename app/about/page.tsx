import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/ui";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  alternates: { canonical: "/about" },
  description:
    "An AI consultancy based in Meydan Free Zone, Dubai, building enterprise AI systems and backing startups from zero.",
};

const VALUES = [
  { t: "Execution over slideware", d: "We measure ourselves on systems in production, not decks. If it doesn't ship, it didn't happen." },
  { t: "Senior by default", d: "The people who scope your work are the people who build it. No hand-offs to a junior bench." },
  { t: "Honest about AI", d: "We'll tell you when AI isn't the answer. Trust is worth more than a bigger contract." },
  { t: "Own the outcome", d: "We tie our work to a metric that matters to your business and stay accountable to it." },
];

const FOUNDERS = [
  {
    name: "Rishi",
    role: "Director",
    img: "/rishi.png",
    linkedin: "https://www.linkedin.com/in/rishi-raj-jaiswal-4b353913a/",
    body: "Leads the firm's direction, client partnerships, and growth. Sets how engagements run and how the Foundry delivers, keeping every project tied to a business outcome that matters.",
  },
  {
    name: "Devashish",
    role: "AI Advisor & Strategist",
    img: "/dev.jpg",
    linkedin: "https://www.linkedin.com/in/devajais/",
    body: "Builder behind NeuroLaw AI. Advises on AI strategy and solution architecture end to end, from model and data pipeline to the product a customer actually uses.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="about"
        title="Built from ground state up"
        subtitle="The ground state is the lowest, most stable energy state, where everything begins. We start there, and build up."
      />
      <Container className="py-16">
        {/* story */}
        <div className="mx-auto max-w-2xl">
          <p className="leading-relaxed text-[var(--color-muted)]">
            Ground State Foundry is an AI consultancy based in {SITE.address.zone}, Dubai. We help enterprises
            put AI to work across strategy, custom systems, agents, and the data foundations underneath, and we back
            founders building AI-native companies from zero.
          </p>
          <p className="mt-4 leading-relaxed text-[var(--color-muted)]">
            We started because too much of &ldquo;AI transformation&rdquo; ends at a slide. We&apos;re the opposite:
            a small, senior team that embeds, builds in weeks, and stays accountable to a number that matters.
            The same craft we bring to enterprise, we bring to startups, because we build companies too.
          </p>
        </div>

        {/* values */}
        <div className="mt-16">
          <div className="mb-8 text-center">
            <p className="mono-label">how we operate</p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--color-fg)] sm:text-3xl">What we hold to</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {VALUES.map((v) => (
              <div key={v.t} className="card p-7">
                <h3 className="text-lg font-semibold text-[var(--color-fg)]">{v.t}</h3>
                <p className="mt-2 leading-relaxed text-[var(--color-muted)]">{v.d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* founders */}
        <div className="mt-16">
          <div className="mb-8 text-center">
            <p className="mono-label">the team</p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--color-fg)] sm:text-3xl">Founders who build</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {FOUNDERS.map((f) => (
              <Founder key={f.name} {...f} />
            ))}
          </div>
        </div>

        {/* location */}
        <div className="card mt-16 flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center sm:p-10">
          <div>
            <p className="mono-label">where we are</p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--color-fg)]">{SITE.address.zone}, Dubai</h2>
            <address className="mt-3 not-italic leading-relaxed text-[var(--color-muted)]">
              {SITE.address.line1}, {SITE.address.line2}, {SITE.address.city}
            </address>
          </div>
          <Link href="/contact" className="btn btn-primary shrink-0">Get in touch →</Link>
        </div>
      </Container>
    </>
  );
}

function Founder({
  name,
  role,
  body,
  img,
  linkedin,
}: {
  name: string;
  role: string;
  body: string;
  img: string;
  linkedin: string;
}) {
  return (
    <div className="card p-8">
      <div className="flex items-center gap-4">
        <Image
          src={img}
          alt={name}
          width={64}
          height={64}
          className="h-16 w-16 shrink-0 rounded-full border border-[var(--color-border-bright)] object-cover"
        />
        <div>
          <h3 className="text-xl font-semibold text-[var(--color-fg)]">{name}</h3>
          <p className="mono-label mt-1">{role}</p>
        </div>
      </div>
      <p className="mt-5 leading-relaxed text-[var(--color-muted)]">{body}</p>
      <a
        href={linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-neon)]"
      >
        LinkedIn ↗
      </a>
    </div>
  );
}
