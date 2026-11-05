# Solta Site

Actor websites at **soltasite.com**. This repository is the production source for the Solta Site Next.js application.

## Production workflow

The default branch is `main`. Vercel uses `main` as the production branch, so reviewed commits pushed to `main` deploy to production automatically. Feature or experimental work should use separate branches and remain preview-only until merged into `main`.

## Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- Vercel
- Supabase
- Stripe Checkout

## SEO publishing

Production builds run the IndexNow submission hook after a successful build. The URL list is derived from `app/sitemap.ts`, and submissions are skipped outside the Production environment.

## Local development

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Quality checks

```bash
npm run typecheck
npm test
npm run build
npm run test:e2e
```
