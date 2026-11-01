# Solta Site: converted frontend and commerce handoff

## Current implementation

The supplied HTML/CSS design is converted to **Next.js App Router, React, TypeScript, and Tailwind CSS**, targeting Vercel with Supabase Postgres and private Storage. Dependencies are pinned in `package.json` and `package-lock.json`. This document describes the code; deployed accounts, migrations, credentials, and hosted verification are separate release steps.

The product flow is **$499 USD once → Stripe Checkout → verified paid order → materials form**. There is no customer account or login in this implementation. The owner created new Supabase and Vercel accounts and linked the repo to the different Vercel account; use those intended hosting/database targets after verifying access. The owner subsequently chose the existing Solta Works Stripe account, with a dedicated Solta Site sandbox and website attribution on checkout/payment records. See `docs/stripe-shared-account.md`. KP continues to require its dedicated Solta Site integration identity and secret.

Provider setup targets `build/nextjs-supabase-conversion` as an isolated test preview. Its database, Stripe sandbox and order-access settings were moved from their earlier Production scope without reading the secrets. Managed Turnstile widgets are separately configured for the preview hostname and `soltasite.com`, with matching keys and pre-clearance disabled. The owner approved and applied a public exception for only the stable preview hostname; project-level Vercel Authentication remains enabled elsewhere. Production still uses old `main` with commerce disabled, and KP remains disabled.

Hosted testing of commit `97cf787` has verified decline handling, a USD $499 sandbox payment, signed webhook delivery and duplicate handling, paid materials-page access, website attribution and text/radio draft restoration. The overall test is partial and paused at browser file transfer. The final snapshot retains one paid order, two pending paid-order outbox rows, zero delivery attempts and zero assets/storage objects/submissions/refund events. No materials submission was attempted, and the refund is deferred so the same test can continue. Synthetic fixtures were published in `b3944ce73e549bc7252d5aef19fdaadb9cbe776d` without changing application code. See `docs/hosted-sandbox-test.md` for the browser-tooling blocker, observed results and remaining checks, and `docs/new-accounts-setup.md` for release requirements.

The original layout, colors, copy, photos, image crops, and typography remain the visual baseline. Marketing styles are scoped to `.solta-site`; the Maya and Devon examples use CSS Modules and their own font variables. Components render real TSX, not injected HTML. Fonts use `next/font`; actor photos use `next/image`.

| Route | Purpose |
| --- | --- |
| `/` | Actor-site offer and $499 purchase path. |
| `/start` | Name, email, terms acceptance, and checkout. |
| `/thanks` | Paid-order materials form; redirects or displays a pending/unavailable state without authorized access. |
| `/preview/materials` | Explicit synthetic form preview; never uploads files or submits answers. |
| `/examples/maya`, `/examples/devon` | Fictional actor examples, excluded from indexing. Reels explain their sample status; galleries expand to all supplied example photos. |
| `/terms`, `/privacy`, `/accessibility` | Original handoff placeholder copy, excluded from indexing; requires owner completion before live commerce. |

The inherited legal and support copy, including `contact@soltaworks.com`, has not been treated as finalized new-brand policy. Do not silently invent replacement legal terms or contact details.

## Browser/API contracts

Authoritative validation lives in `lib/server/policies.ts`; shared materials fields, options, limits, and defaults live in `lib/materials-fields.ts`. Browser POSTs use same-origin JSON. Server configuration and anti-abuse checks fail closed. Errors use `{ok:false,error:{code,message,fields?}}`; validation errors return HTTP 422.

### Checkout

`POST /api/checkout` accepts exactly:

```json
{
  "requestId": "7f54670e-7f50-42a9-b0ba-0bb58fc3ea88",
  "name": "Alex Example",
  "email": "alex@example.com",
  "termsAccepted": true,
  "turnstileToken": "fresh-checkout-challenge-token",
  "company": ""
}
```

`name` is required and limited to 120 characters; email to 254; the token to 4,096. `company` is the empty honeypot. Success returns `{url:string}` for Stripe Checkout. The server selects and verifies the active one-time USD 49,900-cent price, quantity, and test/live mode. Browser amount, price, paid-state, and redirect fields are rejected.

Keep the same UUID request ID and semantic input across uncertain network retries. Changed input starts a new logical request. Challenge tokens do not enter the fingerprint. An unresolved checkout attempt older than 23 hours requires recovery instead of blindly creating another Stripe session.

### Paid access

Stripe returns to `GET /api/orders/access?session_id=...`. The server verifies the paid Stripe session and configured line item, then requires the corresponding paid order recorded by the signed webhook. Pending confirmation redirects to a retry state; a return URL or browser flag never marks an order paid.

Authorized access sets the signed `soltasite_order` cookie: **HttpOnly, Secure, SameSite=Lax, 24-hour expiry**. The browser is redirected to `/thanks` without the session ID. Every protected operation rechecks the order's current paid status and matches the requested order ID. There is no Supabase customer sign-up or client-readable access token.

`POST /api/stripe/webhook` verifies Stripe's signature and mode. It handles paid `checkout.session.completed` / `checkout.session.async_payment_succeeded` events and `charge.refunded`. Refund tombstones prevent a delayed paid event from reopening refunded access. The endpoint observes refunds; it does not issue them.

### Files

`POST /api/uploads`, requiring the paid-order cookie, accepts:

```json
{
  "orderId": "11111111-1111-4111-8111-111111111111",
  "requestId": "22222222-2222-4222-8222-222222222222",
  "kind": "headshot",
  "fileName": "headshot.jpg",
  "contentType": "image/jpeg",
  "sizeBytes": 2400000
}
```

Success returns `{assetId,uploadUrl,headers}`. PUT the raw file to the supplied signed URL with its content type and no application credentials. A retry may instead return `{assetId,alreadyUploaded:true}` after the server verifies the existing object. Preserve each file's request ID across retries; do not overwrite an existing private object.

| Kind | Accepted files | Per-file maximum | Final submission count |
| --- | --- | --- | --- |
| `headshot` | JPEG or PNG | 25 MiB | 12 |
| `resume` | PDF | 10 MiB | 1 |
| `font` | OTF, TTF, WOFF, WOFF2 | 10 MiB | 1 |

The server chooses the private bucket and generated path. It verifies actual stored size, MIME, and file signature before materials are accepted. Browser-supplied file URLs are not asset references.

### Materials

`POST /api/materials`, requiring the paid-order cookie, accepts `{orderId,requestId,answers,assets,turnstileToken,company:""}`. `assets` is `{headshots: UUID[], resume: UUID|null, font_file: UUID|null}`. The token must be valid for the `materials` challenge action.

Build the complete `answers` object with `defaultMaterialsAnswers`; use the exported option sets and limits rather than copying another schema. The form groups are:

- Identity: `name`, `pronouns`, `market`, `union`, `type`, `parent`.
- Headshots/reel/credits: `headshots_state`, `reel`, `reel_state`, `credits`; files travel through `assets`.
- Representation: `rep`, `rep_name`, `rep_email`, `rep_kind`, `seek_kind`, `seek_work`.
- Profiles/domain: `imdb`, `actors_access`, `casting_networks`, `instagram`, `domain_state`, `domain`.
- Design: `color`, `color_custom`, `font`, `font_link`, `like1_url`, `like1_why`, `like2_url`, `like2_why`, `like3_url`, `like3_why`, `notes`.

Use `materialsForSubmission` to clear inactive conditional branches. Preserve blank fields in the complete object. Keep the submission UUID across retries with unchanged semantic answers and asset references; changed content gets a new ID. The UI retains text drafts locally, with order-scoped versioned keys, and asks the user to reselect files after reload.

Successful submission returns HTTP 202 with `{ok:true,status:"received",submissionId:UUID}`. This means the materials and verified file references were saved durably. KP and email events are queued; no implemented dispatcher sends them yet. Do not represent a queued event as an email delivered or a KP project created.

## Continuing the build

Use `npm ci`, `npm run dev`, `npm run typecheck`, `npm test`, and `npm run build`. Browser checks use `npm run test:e2e`. Keep supplied assets and licensing records. Preserve loading, validation, provider-failure, retry, and success states; never replace a live error with simulated payment or submission success.

Read `backend/README.md`, `supabase/migrations/20261030031755_initial_commerce.sql`, `docs/new-accounts-setup.md`, and `docs/kp-connection.md` before wiring services. Keep credentials in private environment configuration, never in frontend code, chat, or committed files. The original legal placeholders and actual hosted payment/upload/integration checks remain release work.
