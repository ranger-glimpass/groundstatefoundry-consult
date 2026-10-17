import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { getAllResearch } from "@/lib/research";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/products", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/products/lisn", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/products/bubbles", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/playground", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/research", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/work", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.6, changeFrequency: "yearly" as const },
  ];

  const researchRoutes = getAllResearch().map((r) => ({
    path: `/research/${r.slug}`,
    priority: 0.6,
    changeFrequency: "yearly" as const,
  }));

  return [...staticRoutes, ...researchRoutes].map((r) => ({
    url: `${SITE.url}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
