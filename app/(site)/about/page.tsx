import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/ui";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  alternates: { canonical: "/about" },
  description:
    "Ground State Foundry is a research-led product company in Meydan Free Zone, Dubai. We build Lisn, an AI that talks to your customers wherever they are, and Bubbles, an open-source tool for running fleets of AI coding agents.",
};

const VALUES = [
  { t: "Research is the edge", d: "We study hard problems on purpose: simulation, multi-agent systems, evolutionary search. What works goes straight into the products." },
  { t: "Ship it, then make it practise", d: "Nothing reaches a real customer before it has talked to simulated ones. Every failure in practice becomes a fix." },
  { t: "Open where we can", d: "Bubbles is open source under MIT. We publish what we learn in our research, including what did not work." },
  { t: "Honest about AI", d: "We say what our systems can do today and what they cannot yet. No invented numbers." },
];

const FOUNDERS = [
  {
    name: "Rishi Raj",
    role: "Founder & Chief Scientist",
    img: "/rishi.png",
    linkedin: "https://www.linkedin.com/in/rishi-raj-jaiswal-4b353913a/",
    body: "Applied AI and research. Built voice agents that run in production over real telephony, an open-source system for running fleets of AI agents, and a framework where code evolves its own algorithms. Leads Lisn's research and product.",
  },
  {
    name: "Devashish",
    role: "AI Advisor & Strategist",
    img: "/dev.jpg",
    linkedin: "https://www.linkedin.com/in/devajais/",
    body: "Advises on AI strategy and solution architecture end to end, from the model and the data pipeline to the product a customer actually uses. Keeps the hard technical choices honest.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="about"
        title="Built from ground state up"
        subtitle="A research-led product company. We build Lisn and Bubbles, and the research behind them."
      />
      <Container className="py-16">
        <div className="mx-auto max-w-2xl">
          <p className="leading-relaxed text-[var(--color-muted)]">
            Ground State Foundry is a research-led product company based in{" "}
            {SITE.address.zone}, Dubai. We are building Lisn, an AI that talks to your customers on
            your website today and on the phone next, and gets their request done. Our research in
            voice, agents, and evolutionary systems is what goes into it.
          </p>
          <p className="mt-4 leading-relaxed text-[var(--color-muted)]">
            The name comes from physics. A system&apos;s ground state is the lowest-energy, most stable
            state it can settle into. Nothing is wasted holding it up, so nothing is waiting to
            fall over. That is what we want for the systems we build, and for the businesses that
            run on them.
          </p>
          <p className="mt-4 leading-relaxed text-[var(--color-muted)]">
            We started because most customer conversations still end in a hold queue or an
            unanswered chat. We had already built voice agents that run on real phone lines, a
            framework where code evolves its own algorithms, and open-source tools for running fleets
            of agents. Lisn brings that work together into one agent. The research is not a hobby. It
            is the reason Lisn keeps getting better.
          </p>
        </div>

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
          className="h-16 w-16 shrink-0 rounded-full border border-[var(--color-border-bright)] object-cover object-top grayscale contrast-[1.05]"
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
        className="mt-4 inline-block text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
      >
        LinkedIn ↗
      </a>
    </div>
  );
}
