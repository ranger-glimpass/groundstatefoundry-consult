import type { Metadata } from "next";
import Redirect from "@/components/Redirect";

export const metadata: Metadata = {
  title: "Lisn",
  robots: { index: false, follow: true },
  alternates: { canonical: "/products/lisn" },
};

export default function IndustriesMoved() {
  return <Redirect to="/products/lisn/" label="Lisn" />;
}
