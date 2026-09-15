import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, PageHeader } from "@/components/ui";
import { SERVICES, getService } from "@/lib/services";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.summary,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return (
    <>
      <PageHeader eyebrow={service.eyebrow} title={service.title} subtitle={service.intro} />
      <Container className="py-16">
        <div className="grid gap-5 md:grid-cols-2">
          {service.subs.map((sub) => (
            <div key={sub.title} className="card p-7">
              <h3 className="text-lg font-semibold text-[var(--color-fg)]">{sub.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">{sub.body}</p>
            </div>
          ))}
        </div>

        {service.proof && (
          <div className="card-neon mt-8 p-6">
            <p className="mono-label">proof</p>
            <p className="mt-3 leading-relaxed text-[var(--color-muted)]">{service.proof}</p>
          </div>
        )}

        <div className="card mt-12 flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center sm:p-10">
          <div className="max-w-lg">
            <p className="mono-label">work with us</p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--color-fg)]">
              Let&apos;s scope it together.
            </h2>
            <p className="mt-3 leading-relaxed text-[var(--color-muted)]">
              Tell us what you are trying to move, and we&apos;ll tell you the smallest thing worth building.
            </p>
          </div>
          <Link href="/contact" className="btn btn-primary shrink-0">Talk to us →</Link>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
          <Link href="/research" className="link-u">See related research</Link>
          <Link href="/services" className="link-u">Back to all services</Link>
        </div>
      </Container>
    </>
  );
}
