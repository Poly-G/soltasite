# Configure the new Solta Site accounts

The owner has already created a new Vercel account and a new Supabase account, and has connected `Poly-G/soltasite` to Vercel. **Verify and use those new destinations.** The previously connected KP/Solta Works accounts must not receive this application, schema or credentials.

The code conversion does not establish provider access. No remote migration, secret configuration or production deployment has been completed by these files.

## 1. Verify the intended destinations

Reconnect the Vercel and Supabase integrations to the intended new accounts. Confirm the Vercel team/project and Supabase organization/project identity before changes. Record project references in deployment notes, never secrets. If the Supabase project still needs creating, create it inside that confirmed new organization and choose its region deliberately.

Vercel settings for this repository:

| Setting | Value |
| --- | --- |
| Framework | Next.js |
| Root directory | Repository root |
| Runtime | Node.js 24 |
| Install | `npm ci` |
| Build | `npm run build` |
| Output | Next.js default; do not set a static export directory |

The frontend can be previewed with commerce disabled and without credentials.

## 2. Prepare the new Supabase database

Review `backend/schema/commerce.sql`, use the current Supabase CLI migration workflow to create the initial migration, then apply it to the confirmed new project. No migration history or linked-project configuration has been invented in this repository.

Verify all application tables have RLS enabled, no anonymous/authenticated browser privileges, and only the intended server grants. Verify that `soltasite-headshots` and `soltasite-files` are private with their 25 MiB and 10 MiB limits. Run the local database tests and repeat the critical ownership, replay, refund and transaction checks against the new hosted project using synthetic records.

Store the new project's HTTPS URL and modern secret key as `SUPABASE_URL` and `SUPABASE_SECRET_KEY`. This flow has no browser Supabase client, so no public Supabase key or customer Auth setup is required yet.

## 3. Configure providers, initially in test mode

Copy names from the root `.env.example` into private local or provider configuration. Never commit populated environment files or paste secrets into chat.

| Variable | Purpose |
| --- | --- |
| `SOLTASITE_COMMERCE_ENABLED` | Explicit activation; keep false until the environment is ready |
| `SOLTASITE_APP_ORIGIN` | Exact canonical HTTPS origin with no trailing slash |
| `SOLTASITE_STRIPE_MODE` | `test` during verification; `live` only for the production payment configuration |
| `SUPABASE_URL`, `SUPABASE_SECRET_KEY` | New hosted Supabase project and server-only secret |
| `STRIPE_SECRET_KEY` | Stripe secret matching the selected mode |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for this environment's endpoint |
| `STRIPE_PRICE_ID` | Active one-time USD $499 price in the same mode |
| `ORDER_ACCESS_SECRET` | Independently generated random secret of at least 32 characters |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Public site key built into the frontend |
| `TURNSTILE_SECRET_KEY` | Private server verification secret |
| `TURNSTILE_ALLOWED_HOSTNAMES` | Comma-separated allowed application hostnames |
| `SOLTASITE_DESIGN_PREVIEW` | Optional non-production form preview, never submits |
| `KP_SYNC_ENABLED` | Keep false; dispatcher and dedicated receiver remain to be built |

Use independently scoped preview/test and production configuration. The server requires an HTTPS origin, including for a fully connected test deployment. Browser POST requests must use that exact origin; redirect alternate domains to the canonical one. Public environment values such as the Turnstile site key require a new build when changed.

Register the Stripe webhook at `https://<this-environment-host>/api/stripe/webhook` for `checkout.session.completed`, `checkout.session.async_payment_succeeded` and `charge.refunded`. Use the matching endpoint signing secret. Configure the Turnstile widget for the intended hostnames; the client and server use actions `checkout` and `materials`.

## 4. Verify a complete test purchase

Enable commerce only in the configured test environment. Confirm a Stripe test payment creates one order through the signed webhook, then unlocks `/thanks`. Verify a delayed webhook shows the pending state; browser-only paid claims and another order's ID must not grant access.

Upload representative JPEG/PNG, PDF and supported font files, submit materials, refresh text drafts and retry interrupted requests. Confirm a successful submission creates one immutable materials receipt and pending outgoing events. Confirm duplicate/reordered webhooks and refunds leave the expected access state. Verify private objects cannot be read anonymously and invalid stored files are removed.

Local automated tests cover these contracts where possible; they do not prove hosted Stripe, Turnstile, Vercel or Supabase behavior.

## 5. Complete launch work

Implement receipt email delivery and its retry path before the site promises a receipt. Implement abandoned-reservation/object cleanup and decide retention for customer materials. Build the dedicated KP receiver and dispatcher from `kp-connection.md` when ready; queued records alone do not deliver themselves.

The original handoff marks the privacy, terms and accessibility copy as placeholders for owner review. Confirm that copy, the retained `contact@soltaworks.com` address, delivery/update promises and photo permissions. Replace the Keshia “Site coming soon” state when its actual URL is available.

After the test purchase and operational work pass, configure production credentials in the new account, connect the intended domain, verify the production origin and enable commerce. No old Solta Works or KP secrets should be copied into this application.
