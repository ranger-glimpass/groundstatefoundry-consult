"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/ui";

/** Static-export redirect for retired URLs: meta refresh plus a client replace, with a visible link. */
export default function Redirect({ to, label }: { to: string; label: string }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);
  return (
    <Container className="py-24">
      <meta httpEquiv="refresh" content={`0; url=${to}`} />
      <p className="text-[var(--color-muted)]">
        This page has moved. <Link href={to} className="link-u">Go to {label} →</Link>
      </p>
    </Container>
  );
}
