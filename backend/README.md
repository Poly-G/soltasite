# Supabase commerce backend

The implemented flow is **USD $499 checkout → verified paid access → private materials submission**. Next.js Node route handlers live in `app/api`; server-only helpers live in `lib/server`.

**Status:** implemented application code and locally verified candidate SQL. No hosted Supabase project has been migrated, no Stripe purchase has been made, and no KP or email delivery is active. Use only Solta Site's new provider accounts.

## Database candidate

`schema/commerce.sql` contains tables, indexes, grants, RLS, transactional functions and two private Storage bucket definitions. Generate a real migration with the Supabase CLI after reviewing this file against the confirmed new project; this directory deliberately does not claim a migration has been generated or applied.

| Table | Role |
| --- | --- |
| `soltasite_checkout_intents` | Durable request identity and Stripe checkout-session recovery |
| `soltasite_orders` | Canonical payment/order state written from verified webhooks |
| `soltasite_webhook_events` | Webhook deduplication and refund-before-payment tombstones |
| `soltasite_assets` | Order-owned upload reservations and validated metadata |
| `soltasite_materials_submissions` | Immutable, versioned accepted materials |
| `soltasite_commerce_outbox` | Pending KP and email work committed with the source event |

The exact table names are authoritative in the SQL. Public, anonymous and authenticated browser roles cannot access these tables or execute the internal functions. The server role has explicit grants; RLS is enabled on every application table. Functions are security invoker with an empty search path.

`tests/database/commerce.test.ts` executes the actual SQL in local PGlite with a minimal model of Supabase's roles and bucket catalog. It verifies transactions, access restrictions, payment/refund event ordering, conflicting replays, reservation boundaries and bucket limits. This is not a substitute for checking the new hosted database and Storage API.

## Payment and access

`POST /api/checkout` accepts bounded JSON, checks the exact configured origin, validates name/email/affirmative terms and Turnstile action/hostname, and verifies the configured Stripe price is active, one-time USD 49900 in the selected test/live mode. Amounts and payment state are never accepted from the browser.

A stable request ID is persisted before the Stripe request. Unchanged retries recover the same session; conflicting payloads cannot reuse the ID. An unresolved attempt at least 23 hours old requires manual reconciliation before another payment attempt, avoiding a second checkout after Stripe's idempotency window.

Stripe returns to `/api/orders/access?session_id={CHECKOUT_SESSION_ID}`. Access requires a verified paid Stripe session and the canonical paid order created by the signed webhook. The route issues a secure, HTTP-only, same-site cookie and redirects to `/thanks` without the session ID. A delayed webhook produces a pending screen with a retry link. The capability expires after 24 hours; the original verified checkout link can establish a fresh cookie while the order remains paid.

The webhook checks raw signed bytes, test/live mode, session identity, expected product/price, quantity, amount and currency. Payment state and outbox events are written atomically. Refund tombstones and locking prevent a reordered event or paid replay from restoring refunded access. Every upload/materials operation rechecks that the order is still paid.

## Uploads and submissions

| Private bucket | Files | Limit per file |
| --- | --- | --- |
| `soltasite-headshots` | JPEG or PNG headshots | 25 MiB |
| `soltasite-files` | PDF resume or supported font file | 10 MiB |

Each submission allows up to 12 headshots, one resume and one font file. The server creates object paths and signed URLs with overwrites disabled. Reservations require a paid order capability, stable request ID and matching owner. The browser sends file bytes directly to the private signed URL.

Before accepting materials, the server verifies each referenced reservation, ownership, kind, stored size/MIME and file signature. Invalid stored objects are removed. A retry after an upload response was lost can return `alreadyUploaded: true` only after the object is verified. Otherwise the client receives an upload URL.

`POST /api/materials` validates the form and Turnstile, verifies the assets, then atomically saves an immutable submission and the outgoing events. The frontend clears its local draft only after a valid `202` receipt with a submission ID. Files are not saved in local draft storage; users must reselect them after a refresh.

## Outgoing work

Paid orders and accepted materials generate `v1.order.paid` and `v1.materials.submitted` outbox rows, with `source_system=soltasite`, stable event IDs and destinations for KP and email. These rows contain source references, not another copy of the full customer record.

**The dispatcher, KP receiver, receipt sender, retry scheduler and provider credentials are not implemented.** A pending row means locally queued work, not delivery. `KP_SYNC_ENABLED=false` documents the disabled state; there is no sender to activate by changing that flag alone. See [KP connection](../docs/kp-connection.md).

## Configuration and verification

The root `.env.example` is the single environment inventory. `SOLTASITE_COMMERCE_ENABLED` defaults to false. Missing settings, mixed Stripe modes, invalid origins or incomplete secrets cause the API to fail closed. Server credentials never use `NEXT_PUBLIC_` names.

Run `npm run typecheck`, `npm test`, `npm run build` and `npm run test:e2e` from the repository root. Unit checks cover request/configuration boundaries, capability signing and material validation/drafts; the browser checks cover the converted routes, responsive layout, interactions and disabled-commerce behavior.

Before activation, apply and inspect a CLI-generated migration on the new Supabase project, verify grants/RLS with the real roles, exercise signed Storage uploads and retries, and complete a Stripe test-mode checkout → webhook → materials → refund sequence. Add a retention/cleanup job for abandoned reservations and uploads, plus the receipt delivery that the customer copy promises. See [new account setup](../docs/new-accounts-setup.md).
