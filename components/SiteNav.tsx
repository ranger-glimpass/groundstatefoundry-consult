import Link from "next/link";
import Logo from "./Logo";
import { NAV } from "@/lib/site";

export default function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Logo />

        <nav className="hidden items-center gap-5 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-neon)]"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/contact" className="btn btn-primary px-4 py-1.5 text-xs">
            Book a consult
          </Link>
        </div>

        {/* mobile */}
        <details className="group relative lg:hidden">
          <summary className="btn btn-ghost cursor-pointer list-none px-3 py-1.5 text-xs">Menu</summary>
          <div className="absolute right-0 mt-2 w-56 card p-2">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="block px-3 py-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-neon)]">
                {n.label}
              </Link>
            ))}
            <div className="my-2 border-t border-[var(--color-border)]" />
            <Link href="/contact" className="block px-3 py-2 text-sm text-[var(--color-neon)]">Book a consult →</Link>
          </div>
        </details>
      </div>
    </header>
  );
}
