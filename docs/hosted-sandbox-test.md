# Hosted sandbox test

**Test date:** October 29, 2026, Pacific time (October 30 UTC). **Application commit:** `97cf787` on `build/nextjs-supabase-conversion`. Synthetic fixtures were subsequently published in [`b3944ce73e549bc7252d5aef19fdaadb9cbe776d`](https://github.com/Poly-G/soltasite/commit/b3944ce73e549bc7252d5aef19fdaadb9cbe776d); application code was unchanged.

**Status: PARTIAL — paused at browser file transfer.** Checkout, signed paid-event handling, paid access, attribution and draft restoration passed. Private uploads, materials submission and refund verification did not complete. The paid test order is preserved so the authorized test can continue. The complete hosted flow has not passed.

## Environment and exposure

The application was tested at `https://soltasite-git-build-nextjs-supabase-conversion-sn-d1.vercel.app` against the Solta Site Stripe sandbox `acct_1UW7CeEYpNmRDZ8w` and new Supabase project `rarcknqbxaeffevgpbvj`. Commerce is enabled only for that preview branch, Stripe mode is `test`, and KP is disabled.

The owner approved a public exception for only this stable preview hostname. Only `alias-protection-override` was applied; project-level Vercel Authentication remains enabled with `all_except_custom_domains`. Other protected deployment URLs, `main`, Production configuration and the production domain were not changed. Production commerce remains disabled.

## Observed results

| Check | Result | Evidence |
| --- | --- | --- |
| Declined test payment | Passed | Stripe rejected the official decline test card. The database had one checkout intent and zero orders, webhook-event records or outbox rows. |
| Successful test payment | Passed | Stripe's official success card ending `4242` completed a USD $499 sandbox payment; the order has `livemode=false`. |
| Signed paid webhook | Passed | `evt_1UW88uEYpNmRDZ8wSYy0Vl3g` was Delivered with HTTP 200 and `received:true`; the database recorded the paid order. |
| Paid materials access | Passed | The successful checkout return unlocked `/thanks`. |
| Website attribution | Passed | Both Checkout Session and PaymentIntent had `source_system=soltasite`, `source_site=soltasite.com`, the exact preview `source_origin` and matching request ID. |
| Paid-event resend | Passed | Resent at 05:15:39 UTC; second HTTP 200. At 05:16:36 UTC, the database still had one paid order, one paid-event row and two pending paid-order outbox rows. |
| Outbound isolation | Passed for the observed paid step | Both email and KP rows remained pending, with zero attempts or deliveries. No message or KP record was sent. |
| Draft restoration | Passed | Text and radio choices survived a browser refresh; the form confirmed that saved text was restored and files must be chosen again. |
| PNG/PDF uploads | Paused; not verified | Browser-tooling file delivery failed to complete. Final database/storage snapshot contains zero assets or objects. |
| Materials submission | Not attempted | The form's Send it action was not used. Zero submissions; `materials_submitted_at` remains null. |
| Refund and access revocation | Intentionally deferred | No refund was requested and no refund event exists. The same paid order is retained for completing upload/materials checks first. |

Visual evidence: [successful sandbox payment and prior declined attempt](evidence/hosted-sandbox-2026-10-30/payment-paid.jpg).

Provider record: [paid sandbox payment in Stripe](https://dashboard.stripe.com/acct_1UW7CeEYpNmRDZ8w/test/payments/pi_3UW88PEYpNmRDZ8w0Glo6M2f).

## Final snapshot and pause reason

At `2026-10-30 05:36:35 UTC` (`2026-10-29 22:36:35 PDT`), the read-only Supabase snapshot confirmed:

| State | Observed value |
| --- | --- |
| Checkout intents | 1 |
| Orders | 1, still `paid`, `livemode=false` |
| Paid-event records | 1 |
| Refund-event records | 0 |
| Asset reservations / Storage objects | 0 / 0 |
| Materials submissions | 0 |
| Order materials timestamp | `materials_submitted_at=null` |
| Paid-order outbox | 2 pending, zero attempts, no deliveries |

The synthetic PNG/PDF could not be delivered through the connected browser tooling: file-transfer downloads timed out, a bundle fetch failed, and a file-chooser attempt timed out. The connection subsequently listed tabs but could not attach to the materials tab, reporting `Debugger unattached`; marking the tab for handoff also failed. No UI upload completed, no Send it action was taken, and the application has no corresponding asset or materials records. These observations do not establish an application-upload defect or prove that a particular browser permission is disabled.

The Browser skill's `chrome-file-upload-troubleshooting` guide calls for the user to check the extension's file-URL access setting before continuing. The setting's actual state is unverified. The paid order, browser access cookie and saved draft were preserved; the user can resume in the same browser. Once browser attachment and file transfer work, continue with the [published fixture instructions](../tests/fixtures/hosted-checkout/README.md), [synthetic PNG](../tests/fixtures/hosted-checkout/sandbox-headshot.png) and [synthetic PDF](../tests/fixtures/hosted-checkout/sandbox-resume.pdf). Existing authorization for the complete hosted test persists; a new paid test order is not needed solely because of this tooling pause.

The refund was intentionally held so the current paid order can still complete file upload and materials submission. After those checks pass, issue the sandbox refund and verify signed processing and revoked access.

## Non-secret test references

| Reference | Value |
| --- | --- |
| Order | `a8e86ba7-d043-4fc6-baba-2bf5988f33d1` |
| Order created | `2026-10-30 05:14:22 UTC` (`2026-10-29 22:14:22 PDT`) |
| Checkout request | `82da09c6-f943-4d7e-a075-569cf34c6ec8` |
| PaymentIntent | `pi_3UW88PEYpNmRDZ8w0Glo6M2f` |
| Paid event | `evt_1UW88uEYpNmRDZ8wSYy0Vl3g` |
| Webhook destination | `we_1UW7teEYpNmRDZ8wjiIRlgbH` |

These are synthetic test records in the new prelaunch database, not real customer orders. They have not been cleaned up or represented as disposable. The earlier migration-verification writes were rolled back separately. Bearer checkout sessions, signed upload URLs, cookies and secrets are intentionally omitted.

## Remaining verification and release work

Complete the PNG/PDF upload, materials and refund sequence before marking this hosted flow complete. Delayed-webhook UI, async-payment success, refund-before-payment arrival, supported font uploads, interrupted-upload recovery, invalid-file removal and unauthorized-order probes are not hosted passes in this report. Existing automated coverage is separate from an observed provider integration result.

Launch still requires the KP receiver/dispatcher, email receipt delivery, retry scheduling, abandoned-upload cleanup and retention decisions; sandbox-record reconciliation; live Stripe product/price/webhook and Production secrets; domain connection; and review of legal, contact, delivery and image-permission copy. Production also needs its Supabase server-key entry and an independent order-access signing secret. Remove the public preview exception when no longer needed. See [account and release setup](new-accounts-setup.md).
