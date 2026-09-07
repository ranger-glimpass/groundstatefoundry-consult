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
npm run build   # static export to ./out
npm run lint
```

## Deploy (GitHub Pages)

The site is a static export (`output: "export"` in `next.config.ts`) served on the
custom domain **groundstatefoundry.com**. `npm run build` writes the whole site to `out/`.

Deployment is automated by `.github/workflows/deploy.yml`: every push to `main` builds
and publishes to GitHub Pages. One-time setup in the repo:

1. **Settings -> Pages -> Build and deployment -> Source: GitHub Actions.**
2. **Settings -> Pages -> Custom domain: `groundstatefoundry.com`** (the `public/CNAME`
   file already ships this).
3. Point DNS at GitHub Pages: four `A` records for the apex (`185.199.108.153`,
   `185.199.109.153`, `185.199.110.153`, `185.199.111.153`), or an `ALIAS`/`ANAME`
   to `ranger-glimpass.github.io`. Enable **Enforce HTTPS** once the cert is issued.

To serve on a project subpath instead of a custom domain, set `basePath` /
`assetPrefix` in `next.config.ts` and update `SITE.url` in `lib/site.ts`.
