"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import GroundStateMark from "@/components/GroundStateMark";

const PHONE = "+919608848421";
const PHONE_DISPLAY = "+91 96088 48421";
const EMAIL = "rishi@groundstatefoundry.com";
const LINKEDIN = "https://www.linkedin.com/in/rishi-raj-jaiswal-4b353913a/";
const LANG_KEY = "gsf-card-lang";

type Lang = "en" | "ar";

const T = {
  en: {
    company: "ground state foundry",
    name: "Rishi Raj",
    title: "Founder & Chief Scientist",
    toggle: "العربية",
    toggleLabel: "Switch to Arabic",
    about:
      "Applied AI research and engineering. Voice AI, agents, and simulation, built into production systems. Based in Meydan Free Zone, Dubai.",
    save: "Save contact",
    whatsapp: "WhatsApp",
    call: "Call",
    email: "Email",
    more: "More details",
    less: "Fewer details",
    phone: "Phone",
    web: "Web",
    linkedin: "LinkedIn",
    profile: "View profile",
    waText: "Hi Rishi, we just met. Saving your number.",
    legal: "Ground State Foundry L.L.C-FZ · Meydan Free Zone, Dubai",
  },
  ar: {
    company: "جراوند ستيت فاوندري",
    name: "ريشي راج",
    title: "المؤسس وكبير العلماء",
    toggle: "English",
    toggleLabel: "التبديل إلى الإنجليزية",
    about:
      "أبحاث وهندسة الذكاء الاصطناعي التطبيقي. الذكاء الاصطناعي الصوتي والوكلاء الأذكياء والمحاكاة، نحوّلها إلى أنظمة تعمل فعلياً. مقرّنا في منطقة ميدان الحرة، دبي.",
    save: "حفظ جهة الاتصال",
    whatsapp: "واتساب",
    call: "اتصال",
    email: "البريد",
    more: "المزيد من التفاصيل",
    less: "تفاصيل أقل",
    phone: "الهاتف",
    web: "الموقع",
    linkedin: "لينكدإن",
    profile: "عرض الملف الشخصي",
    waText: "مرحباً ريشي، تعارفنا للتو. سأحفظ رقمك.",
    legal: "جراوند ستيت فاوندري ش.ذ.م.م - منطقة حرة · منطقة ميدان الحرة، دبي",
  },
} as const;

function Icon({ d, className = "h-5 w-5" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const ICON = {
  save: "M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 19h14",
  call: "M5 4h3.5l1.8 4.6-2.3 1.4a11 11 0 005 5l1.4-2.3L19 14.5V18a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z",
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  chevron: "M6 9l6 6 6-6",
};

function WhatsAppGlyph({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M12.04 2a9.9 9.9 0 00-8.5 15l-1.4 5 5.2-1.4A9.9 9.9 0 1012.04 2zm0 18.1a8.2 8.2 0 01-4.2-1.15l-.3-.18-3.1.8.83-3-.2-.31a8.2 8.2 0 116.97 3.84zm4.5-6.1c-.25-.12-1.46-.72-1.69-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.78.97-.15.16-.29.18-.54.06a6.7 6.7 0 01-1.98-1.22 7.5 7.5 0 01-1.37-1.7c-.14-.25 0-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.42h-.48a.92.92 0 00-.66.31 2.8 2.8 0 00-.87 2.07 4.8 4.8 0 001.02 2.56 11 11 0 004.2 3.7c.59.26 1.05.41 1.4.52.6.19 1.13.16 1.56.1.47-.07 1.46-.6 1.67-1.18.2-.58.2-1.07.14-1.18-.06-.1-.22-.16-.47-.29z" />
    </svg>
  );
}

export default function Card() {
  const [lang, setLang] = useState<Lang>("en");
  const [open, setOpen] = useState(false);
  const t = T[lang];
  const ar = lang === "ar";

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === "ar" || saved === "en") setLang(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {}
  }, [lang]);

  const whatsapp = `https://wa.me/${PHONE.replace("+", "")}?text=${encodeURIComponent(t.waText)}`;
  const action =
    "card flex flex-col items-center gap-2 py-4 text-sm text-[var(--color-fg)] transition-colors hover:border-[var(--color-muted)]";

  return (
    <main
      dir={ar ? "rtl" : "ltr"}
      lang={lang}
      className={`mx-auto flex min-h-[100svh] w-full max-w-md flex-col px-5 py-8 ${ar ? "font-[system-ui]" : ""}`}
    >
      <div className="card relative overflow-hidden p-6 pt-6">
        <div className="flex items-center justify-between gap-3">
          <p className={ar ? "text-xs text-[var(--color-muted)]" : "mono-label"}>{t.company}</p>
          <button
            type="button"
            onClick={() => setLang(ar ? "en" : "ar")}
            aria-label={t.toggleLabel}
            lang={ar ? "en" : "ar"}
            className="rounded-full border border-[var(--color-border-bright)] px-3 py-1 text-xs text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
          >
            {t.toggle}
          </button>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-fg)]">{t.name}</h1>
            <p className="mt-1 text-[var(--color-muted)]">{t.title}</p>
          </div>
          <Image
            src="/card/rishi.jpg"
            alt={t.name}
            width={96}
            height={96}
            priority
            className="h-20 w-20 shrink-0 rounded-2xl border border-[var(--color-border-bright)] object-cover"
          />
        </div>

        <div dir="ltr">
          <GroundStateMark className="mt-6 w-full" />
        </div>
      </div>

      <a href="/card/rishi-raj.vcf" download="Rishi Raj.vcf" className="btn btn-primary mt-5 w-full gap-2.5 py-3.5 text-base">
        <Icon d={ICON.save} />
        {t.save}
      </a>

      <div className="mt-3 grid grid-cols-3 gap-3">
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={action}>
          <WhatsAppGlyph className="h-6 w-6" />
          {t.whatsapp}
        </a>
        <a href={`tel:${PHONE}`} className={action}>
          <Icon d={ICON.call} className="h-6 w-6" />
          {t.call}
        </a>
        <a href={`mailto:${EMAIL}`} className={action}>
          <Icon d={ICON.mail} className="h-6 w-6" />
          {t.email}
        </a>
      </div>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="card-details"
        className="mx-auto mt-5 flex items-center gap-1.5 px-3 py-2 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
      >
        {open ? t.less : t.more}
        <Icon d={ICON.chevron} className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <div id="card-details" hidden={!open}>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{t.about}</p>
        <dl className="mt-5 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)] text-sm">
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-[var(--color-dim)]">{t.phone}</dt>
            <dd>
              <a href={`tel:${PHONE}`} dir="ltr" className="text-[var(--color-fg)] tabular-nums">{PHONE_DISPLAY}</a>
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-[var(--color-dim)]">{t.email}</dt>
            <dd>
              <a href={`mailto:${EMAIL}`} dir="ltr" className="text-[var(--color-fg)]">{EMAIL}</a>
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-[var(--color-dim)]">{t.web}</dt>
            <dd>
              <Link href="/" dir="ltr" className="text-[var(--color-fg)]">groundstatefoundry.com</Link>
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-[var(--color-dim)]">{t.linkedin}</dt>
            <dd>
              <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="text-[var(--color-fg)]">
                {t.profile} ↗
              </a>
            </dd>
          </div>
        </dl>
      </div>

      <p className="mt-auto pt-8 text-center text-xs text-[var(--color-dim)]">{t.legal}</p>
    </main>
  );
}
