import Link from "next/link";
import Logo from "./Logo";
import { SITE, NAV } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="mt-28 border-t border-[var(--color-border)]">
      <Container>
        <div className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--color-muted)]">
              {SITE.positioning}
            </p>
            <a
              href={SITE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-neon)]"
            >
              LinkedIn ↗
            </a>
          </div>

          <div>
            <p className="mono-label mb-4">Navigate</p>
            <nav className="flex flex-col gap-2.5">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-neon)]">
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="mono-label mb-4">{SITE.address.zone}</p>
            <address className="text-sm not-italic leading-relaxed text-[var(--color-muted)]">
              {SITE.address.line1}
              <br />
              {SITE.address.line2}
              <br />
              {SITE.address.city}
            </address>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-3 inline-block text-sm text-[var(--color-neon)] underline-offset-4 hover:underline"
            >
              {SITE.email}
            </a>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-2 border-t border-[var(--color-border)] py-5 text-xs text-[var(--color-dim)] sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} {SITE.name}</span>
          <span className="mono-label">{SITE.address.zone} · Dubai</span>
        </div>
      </Container>
    </footer>
  );
}

function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl px-4">{children}</div>;
}
