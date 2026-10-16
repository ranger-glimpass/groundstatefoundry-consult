import type { Metadata } from "next";
import Redirect from "@/components/Redirect";
import { LEGACY_REDIRECTS } from "@/lib/products";

export function generateStaticParams() {
  return Object.keys(LEGACY_REDIRECTS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const to = LEGACY_REDIRECTS[slug] ?? "/products/";
  return { title: "Products", robots: { index: false, follow: true }, alternates: { canonical: to.split("#")[0] } };
}

export default async function ServiceMoved({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const to = LEGACY_REDIRECTS[slug] ?? "/products/";
  return <Redirect to={to} label={to.startsWith("/products/lisn") ? "Lisn" : "our products"} />;
}
