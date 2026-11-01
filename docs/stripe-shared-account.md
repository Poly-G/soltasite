# Shared Stripe account and site attribution

## Account decision and current setup

The owner chose the existing **Solta Works Stripe account** for Solta Site payments. Solta Site's Vercel and Supabase projects remain separate. A dedicated Stripe **sandbox** named **Solta Site** was created inside Solta Works for testing; no new live merchant account was created.

| Item | Confirmed value |
| --- | --- |
| Parent Stripe account | `Solta Works`, `acct_1UPBWxRBWfGUnoea` |
| Sandbox | `Solta Site`, `acct_1UW7CeEYpNmRDZ8w` |
| Product | `Solta Site — Actor Website`, `prod_VXBaIPq0R1GJyo` |
| Price | `price_1UW7DWEYpNmRDZ8wRCb7Q8us`, active, one-time USD $499 |
| Vercel project | `soltasite` in team `sn-d1` |
| Saved Stripe configuration | Sandbox `STRIPE_SECRET_KEY` as a sensitive branch-preview variable; sandbox `STRIPE_PRICE_ID` scoped to the same branch |
| Test branch | `build/nextjs-supabase-conversion` |
| Test origin | `https://soltasite-git-build-nextjs-supabase-conversion-sn-d1.vercel.app` |
| Sandbox webhook | `we_1UW7teEYpNmRDZ8wjiIRlgbH`, Active; snapshot payloads for Your account |
| Webhook API version | `2026-09-30.endive`, the stable version offered by the Dashboard |
| Webhook signing secret | Sensitive `STRIPE_WEBHOOK_SECRET`, only the reviewed preview branch |
| Test activation | `SOLTASITE_STRIPE_MODE=test`; `SOLTASITE_COMMERCE_ENABLED=true` only for the reviewed preview branch |
| Production/default activation | `SOLTASITE_COMMERCE_ENABLED=false`; KP remains disabled |

[Open the sandbox product](https://dashboard.stripe.com/acct_1UW7CeEYpNmRDZ8w/test/products/prod_VXBaIPq0R1GJyo).

[Open the sandbox webhook](https://dashboard.stripe.com/acct_1UW7CeEYpNmRDZ8w/test/workbench/webhooks/we_1UW7teEYpNmRDZ8wjiIRlgbH).

The account's live merchant identity and payout configuration apply to live sales from all connected sites. Website attribution groups transactions within that account. Metadata is internal information and is not shown to customers by default; see [Stripe metadata](https://docs.stripe.com/metadata).

## What each Solta Site payment carries

`lib/server/checkout-attribution.ts` constructs the following fields on the server for both Checkout Session and PaymentIntent metadata:

| Field | Value / purpose |
| --- | --- |
| `source_system` | `soltasite`, the stable integration identity |
| `source_site` | `soltasite.com`, the site/brand being sold |
| `source_origin` | Exact configured HTTPS application origin, distinguishing a test deployment from production |
| `request_id` | Stable checkout request UUID linking the payment to Solta Site records |

The Checkout Session also retains `terms_version`. Its underlying PaymentIntent has the description **Solta Site — Actor Website**. Stripe copies the PaymentIntent's metadata to the Charge when creating it. Checkout Session metadata alone does not automatically populate the PaymentIntent, so the application sets both explicitly.

Attribution is not accepted from browser input. The site label identifies the selling site; it does not claim to track a visitor's advertising campaign or referring website. Existing historical payments and other integrations are not automatically relabeled.

## Find Solta Site payments in Stripe

In the Stripe Dashboard's search box, use:

```text
is:payment metadata:source_site=soltasite.com
```

For all supported record types with that label, omit `is:payment`:

```text
metadata:source_site=soltasite.com
```

The stable integration label also works:

```text
metadata:source_system=soltasite
```

Open a payment to inspect its description and Metadata section. Stripe documents these operators in [Dashboard searches](https://docs.stripe.com/dashboard/search). Search inside the sandbox for test activity and the parent account's live mode for real sales. A successful USD $499 Solta Site sandbox payment has now been created, and the expected metadata was inspected on both its Checkout Session and PaymentIntent. No live Solta Site payment was created by this test.

Other sites should set their own distinct source labels if comparable filtering is wanted across all sales. Adding these fields to Solta Site does not change their integrations.

## Shared-account webhook isolation

`lib/server/stripe-events.ts` runs after Stripe signature verification. It acknowledges unrelated Checkout events without fetching or writing their orders. It ignores explicitly other-source refunds and uses the canonical PaymentIntent to establish Solta Site ownership for relevant or untagged refunds. Genuine events retain canonical payment verification, request binding, error retries and refund-before-payment protection. Local tests cover source isolation and both payment/refund arrival orders through the actual database functions.

## Remaining configuration and verification

The sandbox API key and price were moved from their earlier Production scope to the reviewed preview branch without retrieving the secret. They are not available to other preview branches or future Production builds. Production still runs the earlier `main` deployment with commerce disabled.

The Active sandbox destination `we_1UW7teEYpNmRDZ8wjiIRlgbH` points to `https://soltasite-git-build-nextjs-supabase-conversion-sn-d1.vercel.app/api/stripe/webhook`. It delivers snapshot events from **Your account**, subscribed to exactly `checkout.session.completed`, `checkout.session.async_payment_succeeded` and `charge.refunded`. Its matching signing secret was transferred privately to sensitive `STRIPE_WEBHOOK_SECRET`, restricted to the same preview branch. The paid event `evt_1UW88uEYpNmRDZ8wSYy0Vl3g` and its manual resend both returned HTTP 200. The database retained one paid order, one paid-event row and two pending paid-order outbox records, with no attempted or completed outbound delivery.

The endpoint uses `2026-09-30.endive`, the only stable API version offered by the Dashboard at setup. The pinned Stripe SDK defaults to `2026-10-28.endive` for its own API requests; both use the Endive release family. The endpoint version is recorded explicitly rather than being represented as identical to the SDK default. Hosted handling of the paid event has passed; the remaining event types are not implied by that result.

Separate Managed Turnstile widgets are configured for the test hostname and `soltasite.com`, with pre-clearance disabled and keys saved in their matching environments. The preview uses the new SoltaSite database for prelaunch testing; it now contains synthetic test-order records and no real customer data. Provider configuration is deployed, with commerce enabled only for the reviewed branch and Stripe in test mode. Hosted checkout, signed paid-event delivery, order access, attribution, event replay and draft restoration have passed. The overall test is partial and paused at browser file transfer: no asset or submission was created, and the sandbox payment remains paid. The refund is intentionally deferred so the same paid order can complete upload/materials testing first. See [the hosted report](hosted-sandbox-test.md).

The owner approved and applied a public exception for only the stable preview hostname. Project-level Vercel Authentication remains enabled with `all_except_custom_domains`; other protected deployment URLs and Production were not changed. Signed webhook delivery and the resulting order now establish the hosted payment path. `commerceConfig()` runs before webhook signature/source handling and returns `503` if commerce is disabled or required configuration is missing. All observed payments were sandbox payments; no live processing was enabled.

Before live sales, create the live product/price and dedicated live webhook in the same Solta Works account and configure live credentials and mode together. Production also needs its own Supabase server-key entry and a newly generated order-access secret because the previously staged values were moved to the test branch. Finish the operational release checklist in [service setup](new-accounts-setup.md).
