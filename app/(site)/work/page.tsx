import type { Metadata } from "next";
import Redirect from "@/components/Redirect";

export const metadata: Metadata = {
  title: "Products",
  robots: { index: false, follow: true },
  alternates: { canonical: "/products" },
};

export default function WorkMoved() {
  return <Redirect to="/products/" label="Products" />;
}
