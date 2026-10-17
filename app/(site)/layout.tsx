import Script from "next/script";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { LISN_AGENT_ID, LISN_WIDGET_SRC } from "@/lib/products";

/** Chrome for the main site. Standalone pages (like the digital card) sit outside this group. */
export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative z-10 flex min-h-full flex-col">
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      {LISN_AGENT_ID && <Script src={LISN_WIDGET_SRC} data-agent={LISN_AGENT_ID} strategy="afterInteractive" />}
    </div>
  );
}
