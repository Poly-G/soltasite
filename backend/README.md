# Supabase commerce backend

The implemented flow is **USD $499 checkout → verified paid access → private materials submission**. Next.js Node route handlers live in `app/api`; server-only helpers live in `lib/server`.

**Status:** application code implemented; two migrations applied to the new SoltaSite project `rarcknqbxaeffevgpbvj`. All nine hosted database verification gates passed, with synthetic writes rolled back. Vercel now has 11 environment entries, including `SUPABASE_SECRET_KEY` as a sensitive production-only variable. This verifies configuration metadata, not runtime application connectivity. Current production remains on the earlier `main` source; the reviewed application remains on PR #1's preview branch. No Stripe purchase has been made, and no KP or email delivery is active.

## Applied database migrations

`../supabase/migrations/20261030031755_initial_commerce.sql` contains the tables, indexes, grants, RLS, transactional functions and two private Storage bucket definitions. `20261030031930_index_outbox_references.sql` adds the two covering indexes identified by the hosted performance advisor. Both files were generated with Supabase CLI 2.122.0, applied through the Supabase migration tool, and named to match the actual server-recorded versions. The migration directory is the canonical schema history.

| Table | Role |
| --- | --- |
| `soltasite_checkout_intents` | Durable request identity and Stripe checkout-session recovery |
| `soltasite_orders` | Canonical payment/order state written from verified webhooks |
| `soltasite_webhook_events` | Webhook deduplication and refund-before-payment tombstones |
| `soltasite_assets` | Order-owned upload reservations and validated metadata |
| `soltasite_materials_submissions` | Immutable, versioned accepted materials |
| `soltasite_commerce_outbox` | Pending KP and email work committed with the source event |

The exact table names are authoritative in the migrations. Public, anonymous and authenticated browser roles cannot access these tables or execute the internal functions. The server role has explicit grants; RLS is enabled on every application table. Functions are security invoker with an empty search path.

`tests/database/commerce.test.ts` executes all tracked migrations in order in local PGlite with a minimal model of Supabase's roles and bucket catalog. It verifies transactions, access restrictions, payment/refund event ordering, conflicting replays, reservation boundaries and bucket limits. `verify-commerce.sql` separately passed all nine hosted gates using the real roles, RPCs, and bucket catalog. Every synthetic write was rolled back, and all six application tables remained empty. Hosted Storage HTTP and signed-upload behavior still need an integration check using the reviewed application and its intended environment configuration.

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

The hosted migration, grants/RLS, service-role RPC, and rollback checks are complete. The private server key is configured for production only; it has not been copied into the conversion preview. Before activation, verify runtime Supabase access from the reviewed application, complete Stripe and Turnstile configuration, exercise signed Storage uploads and retries, and complete a Stripe test-mode checkout → webhook → materials → refund sequence. Add a retention/cleanup job for abandoned reservations and uploads, plus the receipt delivery that the customer copy promises. See [new account setup](../docs/new-accounts-setup.md).

## Advisor results

The hosted advisors reported no warnings or errors. Six [RLS-without-policy informational notices](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy) are intentional: application tables have no direct browser access, and the server role has explicit grants. Do not add permissive policies to silence them. The two newly created outbox indexes can appear as [unused-index informational notices](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index) before real traffic. The missing foreign-key indexes were fixed by the second migration.
