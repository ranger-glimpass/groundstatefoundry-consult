import type { Metadata } from "next";
import Redirect from "@/components/Redirect";

export const metadata: Metadata = {
  title: "Products",
  robots: { index: false, follow: true },
  alternates: { canonical: "/products" },
};

export default function ServicesMoved() {
  return <Redirect to="/products/" label="our products" />;
}
