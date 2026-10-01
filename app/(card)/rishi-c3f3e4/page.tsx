import type { Metadata, Viewport } from "next";
import Card from "./Card";

/** Rishi's digital business card. Unlisted: not in the nav or sitemap, and not indexed. */

export const metadata: Metadata = {
  title: { absolute: "Rishi Raj · Ground State Foundry" },
  description: "Rishi Raj, Founder & Chief Scientist at Ground State Foundry. Save my contact, message me on WhatsApp, or call.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Rishi Raj · Ground State Foundry",
    description: "Founder & Chief Scientist, Ground State Foundry. Applied AI research & engineering, Dubai.",
    images: [{ url: "/card/rishi.jpg", width: 480, height: 480, alt: "Rishi Raj" }],
  },
};

export const viewport: Viewport = { themeColor: "#000000" };

export default function CardPage() {
  return <Card />;
}
