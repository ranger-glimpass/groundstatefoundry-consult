import type { Metadata, Viewport } from "next";
import { Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
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
  "Ground State Foundry is an applied AI research lab in Meydan Free Zone, Dubai, building Lisn: an AI that talks to your customers on your website and on the phone, resolves their issues, and improves by practising with other agents.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Lisn · An AI that talks to your customers · Ground State Foundry",
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
    title: "Lisn by Ground State Foundry",
    description:
      "Lisn, an AI that talks to your customers wherever they are: on your website and on the phone, in English and Arabic.",
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
  "@type": "ProfessionalService",
  "@id": `${SITE.url}/#organization`,
  name: SITE.name,
  url: SITE.url,
  image: `${SITE.url}/groundstate-logo.png`,
  logo: `${SITE.url}/groundstate-logo.png`,
  description: DESCRIPTION,
  email: SITE.email,
  sameAs: [SITE.linkedin],
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
        {children}
      </body>
    </html>
  );
}
