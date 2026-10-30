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
| Saved Stripe configuration | Sandbox `STRIPE_SECRET_KEY` as a sensitive production-only variable; sandbox `STRIPE_PRICE_ID` scoped to production |
| Activation | `SOLTASITE_STRIPE_MODE=test`; `SOLTASITE_COMMERCE_ENABLED=false` |

[Open the sandbox product](https://dashboard.stripe.com/acct_1UW7CeEYpNmRDZ8w/test/products/prod_VXBaIPq0R1GJyo).

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

Open a payment to inspect its description and Metadata section. Stripe documents these operators in [Dashboard searches](https://docs.stripe.com/dashboard/search). Search inside the sandbox for test activity and the parent account's live mode for real sales. No payments have been created through Solta Site yet, so payment searches are currently expected to be empty.

Other sites should set their own distinct source labels if comparable filtering is wanted across all sales. Adding these fields to Solta Site does not change their integrations.

## Shared-account webhook isolation

`lib/server/stripe-events.ts` runs after Stripe signature verification. It acknowledges unrelated Checkout events without fetching or writing their orders. It ignores explicitly other-source refunds and uses the canonical PaymentIntent to establish Solta Site ownership for relevant or untagged refunds. Genuine events retain canonical payment verification, request binding, error retries and refund-before-payment protection. Local tests cover source isolation and both payment/refund arrival orders through the actual database functions.

## Remaining configuration and verification

No webhook destination has been registered. The intended application needs a reachable HTTPS endpoint at `/api/stripe/webhook`; current Vercel protection and the earlier production source must be resolved deliberately before delivery testing. Register snapshot events for `checkout.session.completed`, `checkout.session.async_payment_succeeded` and `charge.refunded`, then save that endpoint's signing secret as `STRIPE_WEBHOOK_SECRET` in the matching environment.

Turnstile site/secret keys, a deployed application with the complete matching configuration, and the hosted checkout → webhook → private upload → materials → refund test are still required. The preview has no production credentials. Current production remains the earlier `main` deployment. The saved sandbox API key and price do not establish successful runtime connectivity or authorize enabling real payments.

Before live sales, create the live product/price and dedicated live webhook in the same Solta Works account, configure live credentials and mode together, and finish the operational release checklist in [service setup](new-accounts-setup.md).
