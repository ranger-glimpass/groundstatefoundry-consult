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
  "An applied AI research and engineering firm in Meydan Free Zone, Dubai. We do original research in voice AI, agents, and evolutionary systems, and build it into production systems for enterprises worldwide.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Ground State Foundry · Applied AI research & engineering",
    template: "%s · Ground State Foundry",
  },
  description: DESCRIPTION,
  applicationName: SITE.name,
  keywords: [
    "applied AI research",
    "AI engineering firm",
    "AI company Dubai",
    "voice AI",
    "AI agents",
    "AI automation",
    "enterprise AI",
    "LLM development",
    "RAG systems",
    "agent simulation",
    "AI strategy",
    "Meydan Free Zone",
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
    title: "Ground State Foundry · applied AI research & engineering",
    description:
      "Original AI research, built into production systems for enterprises worldwide. Voice AI, agents, simulation, and the infrastructure underneath.",
    images: [{ url: "/groundstate-logo.png", width: 1254, height: 1254, alt: "Ground State Foundry" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ground State Foundry · applied AI research & engineering",
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
    "Applied AI Research",
    "Voice AI",
    "Large Language Models",
    "AI Agents",
    "Agent Simulation",
    "Machine Learning Operations",
    "AI Strategy",
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
