import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import GroundStateMark from "@/components/GroundStateMark";
import CardQr from "./CardQr";
import { SITE } from "@/lib/site";

/** Rishi's digital business card. Unlisted: not in the nav or sitemap, and not indexed. */

const PHONE = "+919608848421";
const PHONE_DISPLAY = "+91 96088 48421";
const EMAIL = "rishi@groundstatefoundry.com";
const WHATSAPP = `https://wa.me/${PHONE.replace("+", "")}?text=${encodeURIComponent(
  "Hi Rishi, we just met. Saving your number.",
)}`;

export const metadata: Metadata = {
  title: { absolute: "Rishi Raj · Ground State Foundry" },
  description: "Rishi Raj, Director at Ground State Foundry. Save my contact, message me on WhatsApp, or call.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Rishi Raj · Ground State Foundry",
    description: "Director, Ground State Foundry. Applied AI research & engineering, Dubai.",
    images: [{ url: "/card/rishi.jpg", width: 480, height: 480, alt: "Rishi Raj" }],
  },
};

export const viewport: Viewport = { themeColor: "#000000" };

function Icon({ d, className = "h-5 w-5" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const ICON = {
  save: "M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 19h14",
  call: "M5 4h3.5l1.8 4.6-2.3 1.4a11 11 0 005 5l1.4-2.3L19 14.5V18a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z",
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  web: "M12 3a9 9 0 100 18 9 9 0 000-18zm-9 9h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z",
  in: "M6 9v9M6 6v.01M10 18v-5.5a2.5 2.5 0 015 0V18M10 9v9",
};

function WhatsAppGlyph({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M12.04 2a9.9 9.9 0 00-8.5 15l-1.4 5 5.2-1.4A9.9 9.9 0 1012.04 2zm0 18.1a8.2 8.2 0 01-4.2-1.15l-.3-.18-3.1.8.83-3-.2-.31a8.2 8.2 0 116.97 3.84zm4.5-6.1c-.25-.12-1.46-.72-1.69-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.78.97-.15.16-.29.18-.54.06a6.7 6.7 0 01-1.98-1.22 7.5 7.5 0 01-1.37-1.7c-.14-.25 0-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.42h-.48a.92.92 0 00-.66.31 2.8 2.8 0 00-.87 2.07 4.8 4.8 0 001.02 2.56 11 11 0 004.2 3.7c.59.26 1.05.41 1.4.52.6.19 1.13.16 1.56.1.47-.07 1.46-.6 1.67-1.18.2-.58.2-1.07.14-1.18-.06-.1-.22-.16-.47-.29z" />
    </svg>
  );
}

export default function CardPage() {
  return (
    <main className="mx-auto flex min-h-[100svh] w-full max-w-md flex-col px-5 py-8">
      <div className="card relative overflow-hidden p-6 pt-7">
        {/* the well: a ground-state particle sits under the name, and still reacts to touch */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mono-label">ground state foundry</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--color-fg)]">Rishi Raj</h1>
            <p className="mt-1 text-[var(--color-muted)]">Director</p>
          </div>
          <Image
            src="/card/rishi.jpg"
            alt="Rishi Raj"
            width={96}
            height={96}
            priority
            className="h-20 w-20 shrink-0 rounded-2xl border border-[var(--color-border-bright)] object-cover"
          />
        </div>

        <p className="mt-5 text-sm leading-relaxed text-[var(--color-muted)]">
          Applied AI research and engineering. Voice AI, agents, and simulation, built into
          production systems. Based in {SITE.address.zone}, Dubai.
        </p>

        <GroundStateMark className="mt-6 w-full" />
      </div>

      <a
        href="/card/rishi-raj.vcf"
        download="Rishi Raj.vcf"
        className="btn btn-primary mt-5 w-full gap-2.5 py-3.5 text-base"
      >
        <Icon d={ICON.save} />
        Save contact
      </a>

      <div className="mt-3 grid grid-cols-3 gap-3">
        <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="card flex flex-col items-center gap-2 py-4 text-sm text-[var(--color-fg)] transition-colors hover:border-[var(--color-muted)]">
          <WhatsAppGlyph className="h-6 w-6" />
          WhatsApp
        </a>
        <a href={`tel:${PHONE}`} className="card flex flex-col items-center gap-2 py-4 text-sm text-[var(--color-fg)] transition-colors hover:border-[var(--color-muted)]">
          <Icon d={ICON.call} className="h-6 w-6" />
          Call
        </a>
        <a href={`mailto:${EMAIL}`} className="card flex flex-col items-center gap-2 py-4 text-sm text-[var(--color-fg)] transition-colors hover:border-[var(--color-muted)]">
          <Icon d={ICON.mail} className="h-6 w-6" />
          Email
        </a>
      </div>

      <dl className="mt-6 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)] text-sm">
        <div className="flex items-center justify-between gap-4 py-3">
          <dt className="text-[var(--color-dim)]">Phone</dt>
          <dd><a href={`tel:${PHONE}`} className="text-[var(--color-fg)] tabular-nums">{PHONE_DISPLAY}</a></dd>
        </div>
        <div className="flex items-center justify-between gap-4 py-3">
          <dt className="text-[var(--color-dim)]">Email</dt>
          <dd><a href={`mailto:${EMAIL}`} className="text-[var(--color-fg)]">{EMAIL}</a></dd>
        </div>
        <div className="flex items-center justify-between gap-4 py-3">
          <dt className="text-[var(--color-dim)]">Web</dt>
          <dd><Link href="/" className="text-[var(--color-fg)]">groundstatefoundry.com</Link></dd>
        </div>
        <div className="flex items-center justify-between gap-4 py-3">
          <dt className="text-[var(--color-dim)]">LinkedIn</dt>
          <dd>
            <a href="https://www.linkedin.com/in/rishi-raj-jaiswal-4b353913a/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-fg)]">
              View profile ↗
            </a>
          </dd>
        </div>
      </dl>

      <CardQr />

      <p className="mt-auto pt-8 text-center text-xs text-[var(--color-dim)]">
        {SITE.legalName} · {SITE.address.zone}, Dubai
      </p>
    </main>
  );
}
