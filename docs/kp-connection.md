# Solta Site to KP connection

**Status: durable commerce outbox implemented in the candidate backend; KP receiver, source dispatcher, and email sender are not implemented or enabled.** Local code and queued rows do not establish live delivery. This document supersedes the earlier inquiry-only proposal.

## Ownership and account boundary

Solta Site uses the owner's new Vercel and Supabase accounts. Its Next.js server and Supabase database own checkout attempts, webhook-confirmed orders, paid-order access, submitted materials, private asset references, and outbound delivery state. KP owns operational CRM/project records, staff tasks, and delivery workflows.

The browser never receives KP database credentials or chooses KP business, project, pipeline, owner, or stage IDs. Use the dedicated source identity `soltasite` and a new, narrowly scoped integration secret. Keep this identity distinct from Solta Works even if an operator later maps both services into one KP business. The receiving server must choose that mapping from trusted configuration.

There are no customer logins in the current Solta Site flow. KP staff identities must not become public customer identities, and integration writes must identify the integration rather than impersonate Poly or Keshia.

## Current source records and events

`backend/schema/commerce.sql` defines `soltasite_orders`, `soltasite_materials_submissions`, `soltasite_assets`, and `soltasite_commerce_outbox`, alongside checkout and webhook records. Every logical event creates separate rows for `kp` and `email`, with a uniqueness constraint on `(destination,event_id)`.

| Event type | Stable event ID | Stored references / trigger |
| --- | --- | --- |
| `v1.order.paid` | `soltasite:order:<order UUID>:paid` | `order_id`; created transactionally with a verified paid order. |
| `v1.materials.submitted` | `soltasite:materials:<submission UUID>:submitted` | `order_id` and `submission_id`; created transactionally with accepted materials. |

Every row has `source_system: "soltasite"`. The outbox stores references, status, attempts, next-attempt time, error code, and delivery timestamps; it does not yet construct or send a network envelope. Payload projection must use the verified order and immutable submission identified by those references. Browser challenge tokens, access cookies, secrets, and arbitrary form fields must never enter a delivery payload.

Refund events mark the local order refunded and cancel its pending/failed outbox entries. A refund arriving before the paid event is retained as a tombstone. There is currently no outbound refund event; handling a refund after KP/email delivery must be explicitly designed before a production integration is enabled.

Private files remain in Solta Site's private Supabase Storage. KP access requires a reviewed authenticated transfer or narrowly scoped download mechanism; sending a public bucket URL or KP database key is not a connection design.

## Required integration work

1. **Resolve KP's actual deployed revision first. Do not deploy KP `main` as part of this change.** Earlier inspection found that main and the Solta production bridge differed. Prepare focused changes against the reviewed deployed baseline.
2. Define a dedicated KP receiving contract for `soltasite` and the two commerce events above. Agree the destination business/pipeline, record mapping, and integration audit identity. A customer's acting name does not require a fabricated company.
3. Define the exact versioned wire envelope and allowlisted payload. Authenticate server requests with the dedicated secret, signed raw body, timestamp, and nonce; reject expired or replayed signatures. Delivery retries retain the durable event ID but use a fresh signed request.
4. In one KP transaction, deduplicate the event, validate its payload fingerprint, create/link only authorized operational records, and return a stable minimal receipt. Handle materials arriving before their order and refunds after prior delivery explicitly. Reused IDs with changed content must conflict.
5. Add source-side atomic claiming, leases, bounded retries/backoff, safe failure codes, and recovery from crashes or responses lost after KP committed. Recheck current order/event eligibility before delivery. The present outbox needs this work before concurrent workers are enabled; an unguarded select/send/update loop is insufficient.
6. Implement the separate email destination using the intended new service configuration. Queued `email` rows are not receipts sent, and a provider acceptance response alone is not proof of inbox delivery.
7. Verify with synthetic data: normal delivery, duplicates, changed payloads, invalid/expired signatures, access isolation, reordered events, refunds, KP downtime, and a lost acknowledgement. Keep test/preview events out of production operational records before enabling either destination.

The browser's materials success response means durable local receipt. It must not promise completed KP synchronization or notification delivery based solely on an outbox row.

## Existing KP contracts inspected

These are references to specific inspected revisions, not claims about today's deployed source:

- [General integration event envelope](https://github.com/Poly-G/KP-Duty/blob/eb7377ffc0524d219019bbab203ee2004200aa73/src/modules/integrations/event-envelope.ts): provides a versioned-event/external-entity pattern. The new commerce wire contract still needs its own implementation.
- [Existing Solta Works portal receiver](https://github.com/Poly-G/KP-Duty/blob/80771f2fc6a825167de621570fccc5174248a1cb/src/modules/integrations/solta/receiver.ts): fixes the business to `solta` and expects pre-existing project, organization, portal-project, and actor mappings. It cannot directly ingest the new service's checkout/materials events.
- [Existing Solta Works public quote handler](https://github.com/Poly-G/mettlesite/blob/e56aec84d33e1c3f40c190d55040d7922f497913/app/api/contact/quote/route.ts): validates and sends a quote email. It is not Solta Site's order or materials integration.

The new source database grants no browser-role access to orders, submissions, assets, or integration state. Its server-only Supabase secret belongs to the new project. KP's secret stays in KP.
