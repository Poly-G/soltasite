# Configure the new Solta Site accounts

The owner created new Vercel and Supabase accounts and connected `Poly-G/soltasite` to Vercel. **The new destinations are now confirmed.** The previously connected KP/Solta Works accounts must not receive this application, schema or credentials.

| Destination | Confirmed identity |
| --- | --- |
| GitHub | `Poly-G/soltasite`; conversion PR #1, branch `build/nextjs-supabase-conversion` |
| Vercel team | SnD, slug `sn-d1`, ID `team_duIjSUsrF3ojzP4f4pyMEUAs` |
| Vercel project | `soltasite`, ID `prj_XtzLWNJKw63Ol5mUB8SPioiiyHeM` |
| Supabase project | `SoltaSite`, reference `rarcknqbxaeffevgpbvj` |

The reviewed conversion remains on PR #1's preview branch, with Ready preview deployments. Current production still points to the earlier `main` deployment; no production release or custom-domain change was made in this setup stage. Vercel now has 11 environment entries, including the sensitive production-only Supabase server key. Configuration metadata does not establish working payments or runtime application/database connectivity.

## 1. Confirmed Vercel settings

The intended new Vercel project is configured as follows. Keep operations explicitly scoped to the IDs above; no replacement project is needed.

| Setting | Value |
| --- | --- |
| Framework | Next.js |
| Root directory | Repository root (`rootDirectory: null`) |
| Runtime | Node.js `24.x` |
| Install | `npm ci` |
| Build | `npm run build` |
| Output | Next.js default (`outputDirectory: null`); no static export directory |

The frontend can be previewed with commerce disabled and without credentials. Settings or environment changes require a subsequent deployment to take effect in the running application.

The observed branch alias is `https://soltasite-git-build-nextjs-supabase-conversion-sn-d1.vercel.app`; the inspected deployment URL is `https://soltasite-lp1s14uvh-sn-d1.vercel.app`. Use one chosen preview origin consistently when configuring and testing browser POSTs. The only attached project domain at inspection was `soltasite.vercel.app`; neither `soltasite.com` nor `www.soltasite.com` was attached yet.

Vercel authentication currently protects deployments except custom domains. Before hosted Stripe testing, resolve webhook reachability deliberately and verify signed callbacks; a Ready preview or successful checkout redirect does not prove webhook delivery.

## 2. Applied Supabase database

Two migrations are applied to `rarcknqbxaeffevgpbvj`: `20261030031755_initial_commerce` and `20261030031930_index_outbox_references`. Their tracked SQL is under `supabase/migrations`. All nine hosted database verification gates passed, and a post-rollback count confirmed that all six application tables contain zero records. See `backend/verify-commerce.sql` for the reproducible check. This verifies the database boundary; runtime application connectivity and hosted upload/payment tests remain outstanding.

Verified: all application tables have RLS enabled, no anonymous/authenticated browser privileges, and only the intended server grants. The `soltasite-headshots` and `soltasite-files` buckets are private with their 25 MiB and 10 MiB limits. Hosted checks covered effective permissions, service-role execution, ownership, replay, refund ordering, and transaction rollback. Advisors have only expected informational notices, documented in `backend/README.md`.

The new project's API origin is `https://rarcknqbxaeffevgpbvj.supabase.co`, used as `SUPABASE_URL`. Its modern server secret is now configured as `SUPABASE_SECRET_KEY` in Vercel.

**Server key configured:** the owner-authorized private dashboard transfer is complete. A metadata-only check confirmed `SUPABASE_SECRET_KEY` has type `sensitive` and target `production`; its value was not printed or committed. It is not available to the conversion preview. Saving it is not a runtime connectivity test, and redeploying the existing production deployment would still use the old `main` source. Any application release must explicitly use the reviewed conversion source. This flow has no browser Supabase client, so no public Supabase key or customer Auth setup is required yet.

## 3. Provider configuration and remaining credentials

Eleven environment entries are configured in Vercel: commerce and KP remain disabled, Stripe mode remains test, production has the canonical origin, new Supabase URL, allowed Turnstile hostnames, a generated sensitive order-access signing secret, and the sensitive production-only `SUPABASE_SECRET_KEY`. The conversion preview alone enables the non-submitting materials design route and has its own origin; it has no production database credential. Stripe keys/price and the Turnstile site/secret keys are still missing.

Use names from the root `.env.example` in private local or provider configuration. Never commit populated environment files or paste secrets into chat.

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
