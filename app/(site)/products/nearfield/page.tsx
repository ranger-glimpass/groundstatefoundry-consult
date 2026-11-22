import type { Metadata } from "next";
import Redirect from "@/components/Redirect";

export const metadata: Metadata = {
  title: "Nearfield",
  alternates: { canonical: "/models/nearfield" },
  robots: { index: false },
};

export default function NearfieldMoved() {
  return <Redirect to="/models/nearfield/" label="Nearfield" />;
}
