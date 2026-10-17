/**
 * Building blocks for mock sites. They read the brand's --mk-* vars, so every scenario gets its own look
 * from the same parts. Never lime here: lime belongs to Lisn.
 */
import type { ReactNode } from "react";
import type { Site } from "../types";

type Base = { site: Site; id: string; className?: string; children?: ReactNode };

const BTN = {
  primary: "bg-[var(--mk-primary)] text-[var(--mk-on-primary)] hover:brightness-110",
  outline: "border border-[var(--mk-line-strong)] bg-[var(--mk-surface)] text-[var(--mk-ink)] hover:border-[var(--mk-primary)]",
  accent: "bg-[var(--mk-accent)] text-[var(--mk-on-accent)] hover:brightness-105",
};

export function MkButton({ site, id, className = "", children, variant = "primary" }: Base & { variant?: keyof typeof BTN }) {
  return (
    <button {...site.hit(id)} className={`inline-flex items-center justify-center gap-2 rounded-[var(--mk-radius)] px-4 py-2.5 text-sm font-semibold transition ${BTN[variant]} ${className}`}>
      {children ?? site.el(id)?.label}
    </button>
  );
}

/** A text link. Mock links are buttons: no href, so nothing ever leaves the page. */
export function MkLink({ site, id, className = "", children }: Base) {
  return (
    <button {...site.hit(id)} className={`text-left font-medium text-[var(--mk-primary)] underline-offset-4 hover:underline ${className}`}>
      {children ?? site.el(id)?.label}
    </button>
  );
}

export function MkTab({ site, id, active, className = "", children }: Base & { active: boolean }) {
  return (
    <button
      {...site.hit(id)}
      aria-pressed={active}
      className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
        active ? "bg-[var(--mk-ink)] text-[var(--mk-surface)]" : "bg-[var(--mk-surface)] text-[var(--mk-muted)] ring-1 ring-[var(--mk-line)] hover:text-[var(--mk-ink)]"
      } ${className}`}
    >
      {children ?? site.el(id)?.label}
    </button>
  );
}

const FIELD = "w-full rounded-[var(--mk-radius)] border border-[var(--mk-line-strong)] bg-[var(--mk-surface)] px-3 py-2.5 text-sm text-[var(--mk-ink)] outline-none transition placeholder:text-[var(--mk-muted)]/70 focus:border-[var(--mk-primary)] focus:ring-2 focus:ring-[var(--mk-primary)]/15";

export function MkField({ site, id, className = "", hint, placeholder, dir }: Base & { hint?: ReactNode; placeholder?: string; dir?: "rtl" | "ltr" }) {
  const el = site.el(id);
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[13px] font-medium text-[var(--mk-ink)]">{el?.label}</span>
      <input {...site.field(id)} type={el?.input ?? "text"} inputMode={el?.input === "number" ? "numeric" : undefined} placeholder={placeholder} dir={dir} className={FIELD} />
      {hint && <span className="mt-1 block text-xs text-[var(--mk-muted)]">{hint}</span>}
    </label>
  );
}

export function MkSelect({ site, id, className = "", hint }: Base & { hint?: ReactNode }) {
  const el = site.el(id);
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[13px] font-medium text-[var(--mk-ink)]">{el?.label}</span>
      <select {...site.field(id)} className={`${FIELD} appearance-none bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-8`} style={{ backgroundImage: CHEVRON }}>
        <option value="">Choose…</option>
        {el?.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {hint && <span className="mt-1 block text-xs text-[var(--mk-muted)]">{hint}</span>}
    </label>
  );
}

const CHEVRON = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M2.5 4.5 6 8l3.5-3.5' fill='none' stroke='%23667' stroke-width='1.5'/%3E%3C/svg%3E")`;

export function MkCheck({ site, id, checked, className = "", children }: Base & { checked: boolean }) {
  return (
    <button {...site.hit(id)} role="checkbox" aria-checked={checked} className={`flex items-start gap-2.5 text-left text-sm text-[var(--mk-ink)] ${className}`}>
      <span className={`mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[5px] border transition ${checked ? "border-[var(--mk-primary)] bg-[var(--mk-primary)] text-[var(--mk-on-primary)]" : "border-[var(--mk-line-strong)] bg-[var(--mk-surface)]"}`}>
        {checked && <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="m2.5 6.5 2.3 2.3L9.5 3.8" /></svg>}
      </span>
      <span>{children ?? site.el(id)?.label}</span>
    </button>
  );
}

/** Footer line every mock site carries, so nobody mistakes it for a real brand. */
export function MadeUp({ name }: { name: string }) {
  return (
    <p className="text-xs text-[var(--mk-muted)]">
      {name} is made up for the Ground State Foundry playground. It is not a real company, and nothing here is an offer.
    </p>
  );
}
