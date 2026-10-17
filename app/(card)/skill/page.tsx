import type { Metadata } from "next";

const TARGET = "https://my.groundstatefoundry.com/skill";

export const metadata: Metadata = {
  title: "Install Lisn",
  robots: { index: false, follow: true },
  alternates: { canonical: TARGET },
};

/** Short URL for the installer instructions. Static export, so redirect by meta refresh plus script,
 *  and spell the target out in text for coding agents that read the page without following redirects. */
export default function SkillRedirect() {
  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-[var(--color-muted)]">
      <meta httpEquiv="refresh" content={`0; url=${TARGET}`} />
      <script dangerouslySetInnerHTML={{ __html: `window.location.replace(${JSON.stringify(TARGET)});` }} />
      <h1 className="text-xl font-semibold text-[var(--color-fg)]">Install Lisn on your website</h1>
      <p className="mt-4">
        Coding agent: the install instructions are at{" "}
        <a href={TARGET} className="link-u">{TARGET}</a>. Fetch that page and follow it.
      </p>
    </main>
  );
}
