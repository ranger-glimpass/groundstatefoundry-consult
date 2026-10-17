import type { Metadata, Viewport } from "next";
import { Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import { BUBBLES_REPO, LISN_DEMO_VIDEO } from "@/lib/products";

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
  "Ground State Foundry is a research-led product company in Meydan Free Zone, Dubai. We build Lisn, an AI that talks to your customers wherever they are, and Bubbles, an open-source tool for running fleets of AI coding agents.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Lisn · An AI that talks to your customers · Ground State Foundry",
    template: "%s · Ground State Foundry",
  },
  description: DESCRIPTION,
  applicationName: SITE.name,
  keywords: [
    "Lisn",
    "AI customer agent",
    "AI voice agent",
    "Arabic voice AI",
    "website AI guide",
    "agent simulation",
    "Bubbles",
    "open source agent IDE",
    "Claude Code agents",
    "AI research Dubai",
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
    title: "Lisn by Ground State Foundry",
    description:
      "Lisn, an AI that talks to your customers wherever they are: on your website today, by voice or chat, in English and Arabic.",
    images: [{ url: "/groundstate-logo.png", width: 1254, height: 1254, alt: "Ground State Foundry" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lisn by Ground State Foundry",
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
  "@type": "Organization",
  "@id": `${SITE.url}/#organization`,
  name: SITE.name,
  url: SITE.url,
  image: `${SITE.url}/groundstate-logo.png`,
  logo: `${SITE.url}/groundstate-logo.png`,
  description: DESCRIPTION,
  email: SITE.email,
  sameAs: [SITE.linkedin, BUBBLES_REPO],
  legalName: SITE.legalName,
  identifier: { "@type": "PropertyValue", name: "Meydan Free Zone licence number", value: SITE.licence },
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
  owns: [
    {
      "@type": "SoftwareApplication",
      name: "Lisn",
      applicationCategory: "BusinessApplication",
      description: "An AI that talks to your customers on your website by voice or chat, in English and Arabic, with phone lines next.",
      url: `${SITE.url}/products/lisn`,
      subjectOf: LISN_DEMO_VIDEO,
    },
    {
      "@type": "SoftwareSourceCode",
      name: "Bubbles",
      description: "Open-source terminal tool for running fleets of AI coding agents.",
      codeRepository: BUBBLES_REPO,
      license: "https://opensource.org/licenses/MIT",
      programmingLanguage: "Go",
    },
  ],
  knowsAbout: [
    "Artificial Intelligence",
    "Applied AI Research",
    "Voice AI",
    "Large Language Models",
    "AI Agents",
    "Agent Simulation",
    "Conversational AI",
    "Multi-agent Systems",
    "Evolutionary Computation",
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
        {children}
      </body>
    </html>
  );
}
