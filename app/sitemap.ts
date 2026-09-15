import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { SERVICES } from "@/lib/services";
import { getAllResearch } from "@/lib/research";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/research", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/work", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/industries", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.6, changeFrequency: "yearly" as const },
  ];

  const serviceRoutes = SERVICES.map((s) => ({
    path: `/services/${s.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  const researchRoutes = getAllResearch().map((r) => ({
    path: `/research/${r.slug}`,
    priority: 0.6,
    changeFrequency: "yearly" as const,
  }));

  return [...staticRoutes, ...serviceRoutes, ...researchRoutes].map((r) => ({
    url: `${SITE.url}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
