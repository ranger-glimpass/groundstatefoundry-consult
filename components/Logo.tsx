import Link from "next/link";

/** Horizontal lockup echoing the brand mark: energy-level bar + ground-state
 *  particle, then the GROUND STATE / FOUNDRY wordmark. */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Ground State Foundry, home"
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      <span className="flex flex-col items-center gap-[5px]" aria-hidden>
        <span className="h-[2px] w-6 rounded bg-[var(--color-fg)] transition-colors group-hover:bg-[var(--color-neon)]" />
        <span className="h-[6px] w-[6px] rounded-full bg-[var(--color-neon)] shadow-[0_0_10px_1px_rgba(185,242,58,0.7)]" />
      </span>
      <span className="leading-none">
        <span className="block text-sm font-semibold tracking-[0.18em] text-[var(--color-fg)]">GROUND&nbsp;STATE</span>
        <span className="mt-[3px] block text-[10px] font-medium tracking-[0.34em] text-[var(--color-neon)]">FOUNDRY</span>
      </span>
    </Link>
  );
}
