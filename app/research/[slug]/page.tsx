import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Container } from "@/components/ui";
import { categoryTitle, getAllResearch, getResearch } from "@/lib/research";

export function generateStaticParams() {
  return getAllResearch().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const piece = getResearch(slug);
  if (!piece) return { title: "Research" };
  return {
    title: piece.title,
    description: piece.excerpt,
    alternates: { canonical: `/research/${slug}` },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function ResearchPiecePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const piece = getResearch(slug);
  if (!piece) notFound();

  return (
    <Container className="py-16">
      <article className="mx-auto max-w-2xl">
        <header className="border-b border-[var(--color-border)] pb-8">
          <Link href="/research" className="mono-label transition-colors hover:text-[var(--color-neon)]">
            ← research
          </Link>
          <p className="mono-label mt-6">{categoryTitle(piece.category)}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">
            {piece.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[var(--color-muted)]">
            <span>{piece.author}</span>
            <span className="text-[var(--color-dim)]">·</span>
            <span>{formatDate(piece.date)}</span>
            <span className="text-[var(--color-dim)]">·</span>
            <span>{piece.readingTime}</span>
          </div>
        </header>

        <div className="article mt-10">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{piece.content}</ReactMarkdown>
        </div>

        <div className="mt-14 border-t border-[var(--color-border)] pt-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link href="/research" className="btn btn-ghost">← All research</Link>
            <Link href="/contact" className="btn btn-primary">Work with us →</Link>
          </div>
        </div>
      </article>
    </Container>
  );
}
