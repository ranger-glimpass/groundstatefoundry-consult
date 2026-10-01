import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

/** Chrome for the main site. Standalone pages (like the digital card) sit outside this group. */
export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative z-10 flex min-h-full flex-col">
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
