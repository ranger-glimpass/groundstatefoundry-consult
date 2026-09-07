# Ground State Foundry - AI Consultancy

Marketing site for **Ground State Foundry**, an AI consultancy based in **Meydan Free Zone, Dubai**.
We build enterprise-grade AI systems and back startups from zero.

Next.js 15 (App Router) · React 19 · Tailwind v4. Neo-brutalist terminal theme (ported from the
original Ground State Foundry brand - same logo, tokens, and `.card`/`.btn`/`.field`/`.tag`/`mono-label`
classes in `app/globals.css`).

> This is a separate project from the earlier cohort/residency platform in `../groundstatefoundry`.
> It reuses the brand, logo, and theme, but is a standalone static marketing site - no DB, no auth.

## Pages

- `/` - landing: positioning, services, process, industries, startup studio, founders, CTA
- `/services` - the six service lines in detail
- `/industries` - domain focus (legal, finance, healthcare, real estate, retail, logistics)
- `/startups` - startup support: formation → build → GTM → raise
- `/about` - firm story, values, founders (Devashish & Rishi), Meydan location
- `/contact` - enquiry form (opens mail client) + address

## Edit brand / contact details

Everything brand- and contact-related lives in `lib/site.ts` (name, tagline, email, LinkedIn,
Meydan address, nav). Founder bios are inline in `app/page.tsx` and `app/about/page.tsx`.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

Build / lint:

```bash
npm run build
npm run lint
```
