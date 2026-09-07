import type { Metadata, Viewport } from "next";
import { Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import ParticleField from "@/components/ParticleField";
import { SITE } from "@/lib/site";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono-gs",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const DESCRIPTION =
  "An AI consultancy based in Meydan Free Zone, Dubai. We build enterprise-grade AI systems across strategy, agents, automation, and data, and back startups from zero to launch.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Ground State Foundry · AI consultancy for enterprises & startups",
    template: "%s · Ground State Foundry",
  },
  description: DESCRIPTION,
  applicationName: SITE.name,
  keywords: [
    "AI consultancy",
    "AI consultancy Dubai",
    "enterprise AI",
    "AI solutions",
    "AI agents",
    "LLM development",
    "RAG systems",
    "AI strategy",
    "AI automation",
    "Meydan Free Zone",
    "startup studio Dubai",
    "AI product engineering",
    "UAE AI company",
    "Ground State Foundry",
  ],
  authors: [{ name: "Ground State Foundry", url: SITE.url }],
  creator: "Ground State Foundry",
  publisher: "Ground State Foundry",
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    url: SITE.url,
    locale: "en_US",
    title: "Ground State Foundry · build with AI, from ground state up",
    description:
      "Enterprise AI systems and startup support from a Dubai-based AI consultancy. Strategy, build, deploy, scale.",
    images: [{ url: "/groundstate-logo.png", width: 1254, height: 1254, alt: "Ground State Foundry" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ground State Foundry · AI consultancy for enterprises & startups",
    description: DESCRIPTION,
    images: ["/groundstate-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE.url}/#organization`,
  name: SITE.name,
  url: SITE.url,
  image: `${SITE.url}/groundstate-logo.png`,
  logo: `${SITE.url}/groundstate-logo.png`,
  description: DESCRIPTION,
  email: SITE.email,
  sameAs: [SITE.linkedin],
  areaServed: ["AE", "Worldwide"],
  address: {
    "@type": "PostalAddress",
    streetAddress: `${SITE.address.line1}, ${SITE.address.line2}`,
    addressLocality: "Dubai",
    addressRegion: "Dubai",
    addressCountry: "AE",
  },
  founder: SITE.founders.map((f) => ({
    "@type": "Person",
    name: f.fullName,
    jobTitle: f.role,
    url: f.linkedin,
    sameAs: [f.linkedin],
  })),
  knowsAbout: [
    "Artificial Intelligence",
    "Large Language Models",
    "AI Agents",
    "Machine Learning Operations",
    "AI Strategy",
    "Product Engineering",
    "Startup Incubation",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sora.variable} ${mono.variable} h-full antialiased`}>
      <body className="min-h-full" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <ParticleField />
        <div className="relative z-10 flex min-h-full flex-col">
          <SiteNav />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
