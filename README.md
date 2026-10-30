# Solta Site

Actor websites at **soltasite.com**. This repository converts the supplied Claude HTML/CSS/JavaScript handoff into **Next.js App Router, React, TypeScript, and Tailwind CSS**, with Vercel hosting and a Supabase backend.

The original visual direction, copy, actor examples, photos, and nine-section materials form are retained. Checkout uses hosted Stripe Checkout; the supplied demonstration card fields are replaced by the real server integration.

## Current state

The application and backend code are implemented and can be built without provider credentials. **Commerce is disabled by default.** The two tracked Supabase migrations have been applied to the new SoltaSite project and verified against its hosted database. KP and email events are saved to a transactional outbox, but their dispatchers are not implemented.

Solta Site uses the owner's **new Vercel and Supabase accounts**. The existing KP and Solta Works infrastructure is a reference only. Both new provider connections are confirmed. The Vercel project is configured for Next.js/Node 24 and has 11 environment entries. The database URL, order-access signing secret, and private `SUPABASE_SECRET_KEY` are configured for production; the server key is a sensitive variable scoped to production only.

The reviewed application remains on the PR #1 preview branch. Current production still uses the earlier `main` source. Saving the server key does not establish runtime Supabase connectivity or release the converted application; hosted Stripe, Turnstile, upload, and complete-flow verification remain outstanding.

## Stack

| Layer | Implementation |
| --- | --- |
| Application | Next.js App Router + React + strict TypeScript |
| Styling | Tailwind CSS 4, scoped original brand styles, CSS Modules for actor examples |
| Hosting and API | Vercel, Next.js Node route handlers |
| Database | Supabase Postgres; server-only access, explicit grants and row-level security |
| Private uploads | Supabase Storage, signed uploads, ownership and file validation |
| Payment | Stripe Checkout and signature-verified webhooks; one-time USD $499 |
| Anti-abuse | Cloudflare Turnstile, request validation, database-backed limits |
| Order access | Expiring signed HTTP-only cookie after verified payment; no customer login required |
| Future KP connection | Dedicated Solta Site receiver and outbox delivery, not activated |

Exact dependencies and Node 24 are pinned in `package.json` and `package-lock.json`.

## Local development

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. Marketing pages work without external credentials. Checkout remains unavailable until the complete provider configuration is supplied and explicitly enabled.

To inspect the materials form without a payment, set `SOLTASITE_DESIGN_PREVIEW=true` locally and open `/preview/materials`. This route never uploads or submits, is marked noindex, and returns 404 when `VERCEL_ENV=production`. The real `/thanks` route always requires paid access.

```bash
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

The browser suite builds and starts a local production server automatically. For an existing production build server, set `E2E_BASE_URL` to its URL. `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` optionally selects an already installed Chromium. Browser tests use synthetic data and disabled commerce, never live payments.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page, examples, FAQ and purchase links |
| `/start` | Customer name/email, terms, anti-bot challenge and hosted checkout |
| `/thanks` | Paid-only materials form, with versioned text drafts scoped to the order |
| `/examples/maya`, `/examples/devon` | Fictional actor demos, photo galleries and accessible example dialogs |
| `/privacy`, `/terms`, `/accessibility` | Supplied policy pages; owner review required before launch |
| `/preview/materials` | Optional local/non-production form preview; never submits |
| `/api/checkout` | Create or recover an idempotent Stripe Checkout session |
| `/api/stripe/webhook` | Verify payment/refund events and persist canonical order state |
| `/api/orders/access` | Verify paid order, issue the order cookie and remove the session ID from the URL |
| `/api/uploads` | Reserve and authorize an order-owned private upload |
| `/api/materials` | Verify assets and durably accept the materials submission |

## Backend and launch setup

Start with [new account setup](docs/new-accounts-setup.md). The configuration names are in `.env.example`; no provider credentials belong in Git, browser code, or chat. Only the Turnstile site key is public.

The server expects an exact HTTPS application origin and the new hosted Supabase project URL. Preview environments need their own matching origin, Turnstile configuration, and Stripe test settings. Do not connect previews to production KP delivery.

[Backend details](backend/README.md) cover the applied migrations, private buckets, payment/access rules, retry behavior, and remaining provider verification. [Claude handoff](docs/claude-handoff.md) records the frontend contracts. [KP connection](docs/kp-connection.md) describes the dedicated integration that remains to be built.

Before enabling real purchases, complete Stripe and Turnstile configuration, verify runtime Supabase access with the reviewed application, and finish test-mode purchase/upload/refund checks, receipt delivery and abandoned-upload cleanup. Review the supplied placeholder legal text and the retained contact address. The Keshia example still says “Site coming soon”; the Maya and Devon examples are fictional.

## Source assets

The original handoff photographs are retained under `public/assets/img`. The supplied handoff describes the demo photos as licensed stock and the Keshia photo as used with permission. Keep those permissions with the project; this conversion does not create additional image rights. Fonts are served through `next/font`.
