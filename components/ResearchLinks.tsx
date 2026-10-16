import Link from "next/link";
import { getAllResearch, categoryTitle } from "@/lib/research";

/** Editorial list of the research pieces behind a product, in the given order. */
export default function ResearchLinks({ slugs }: { slugs: string[] }) {
  const all = getAllResearch();
  const pieces = slugs.map((s) => all.find((r) => r.slug === s)).filter((r) => r !== undefined);
  return (
    <div className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
      {pieces.map((r) => (
        <Link key={r.slug} href={`/research/${r.slug}`} className="group grid gap-1 py-5 sm:grid-cols-[12rem_1fr] sm:gap-8">
          <span className="text-xs text-[var(--color-dim)]">{categoryTitle(r.category)}</span>
          <span>
            <span className="block font-semibold text-[var(--color-fg)] underline-offset-4 group-hover:underline">{r.title}</span>
            <span className="mt-1 block text-sm leading-relaxed text-[var(--color-muted)]">{r.excerpt}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
