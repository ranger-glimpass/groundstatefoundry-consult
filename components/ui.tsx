import Link from "next/link";

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 ${className}`}>{children}</div>;
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="border-b border-[var(--color-border)] py-14">
      <Container>
        {eyebrow && <p className="mono-label mb-3">{eyebrow}</p>}
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl leading-relaxed text-[var(--color-muted)]">{subtitle}</p>}
      </Container>
    </header>
  );
}

export function CTAButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "cyan";
}) {
  return (
    <Link href={href} className={`btn btn-${variant}`}>
      {children}
    </Link>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="card p-5">
      <div className="text-3xl font-semibold text-[var(--color-fg)]">{value}</div>
      <div className="mono-label mt-2">{label}</div>
    </div>
  );
}
