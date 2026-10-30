# Configure the new Solta Site accounts

The owner created new Vercel and Supabase accounts and connected `Poly-G/soltasite` to Vercel. **The hosting and database destinations are confirmed.** The owner subsequently chose to share the existing Solta Works Stripe account. Hosting, database ownership and KP integration identity remain specific to Solta Site.

| Destination | Confirmed identity |
| --- | --- |
| GitHub | `Poly-G/soltasite`; conversion PR #1, branch `build/nextjs-supabase-conversion` |
| Vercel team | SnD, slug `sn-d1`, ID `team_duIjSUsrF3ojzP4f4pyMEUAs` |
| Vercel project | `soltasite`, ID `prj_XtzLWNJKw63Ol5mUB8SPioiiyHeM` |
| Supabase project | `SoltaSite`, reference `rarcknqbxaeffevgpbvj` |
| Stripe account | Existing `Solta Works`, `acct_1UPBWxRBWfGUnoea` |
| Stripe test environment | `Solta Site` sandbox within Solta Works, `acct_1UW7CeEYpNmRDZ8w` |

The reviewed conversion remains on PR #1's preview branch. Current production still points to the earlier `main` deployment with commerce disabled; no production release or custom-domain change was made in this setup stage. Backend test configuration is deployed and scoped only to `build/nextjs-supabase-conversion`, with commerce enabled only for that branch and Stripe in test mode. Separate Turnstile widgets and keys are configured for this branch and Production. The owner approved the public exception for only the stable test hostname. Hosted checks on commit `97cf787` verified the checkout/payment/order path, signed delivery and duplicate handling. The test is partial and paused at browser file transfer; upload, materials and refund verification remain uncompleted. See [the test report](hosted-sandbox-test.md).

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

The chosen test origin is `https://soltasite-git-build-nextjs-supabase-conversion-sn-d1.vercel.app`. Use this stable branch alias consistently for browser POSTs, Turnstile hostname validation, checkout returns and Stripe webhook delivery. The only attached project domain at inspection was `soltasite.vercel.app`; neither `soltasite.com` nor `www.soltasite.com` was attached yet.

The owner approved and applied an `alias-protection-override` for only the stable branch hostname. Project-level Vercel Authentication remains enabled with `all_except_custom_domains`; other protected deployment URLs, `main` and Production were not changed. The exception permits Stripe's signed requests to reach this test endpoint without making a project-wide protection change. Signed delivery was subsequently confirmed with HTTP 200. See [Vercel's exception documentation](https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/deployment-protection-exceptions); current exceptions are available on all plans.

## 2. Applied Supabase database

Two migrations are applied to `rarcknqbxaeffevgpbvj`: `20261030031755_initial_commerce` and `20261030031930_index_outbox_references`. Their tracked SQL is under `supabase/migrations`. All nine hosted database verification gates passed, and the post-rollback count at that verification confirmed all six application tables were empty. See `backend/verify-commerce.sql` for the reproducible check. Later hosted checkout testing created real sandbox test records through the deployed application, establishing runtime order-path connectivity. These later records were not part of the earlier rolled-back database verification.

Verified: all application tables have RLS enabled, no anonymous/authenticated browser privileges, and only the intended server grants. The `soltasite-headshots` and `soltasite-files` buckets are private with their 25 MiB and 10 MiB limits. Hosted checks covered effective permissions, service-role execution, ownership, replay, refund ordering, and transaction rollback. Advisors have only expected informational notices, documented in `backend/README.md`.

The new project's API origin is `https://rarcknqbxaeffevgpbvj.supabase.co`, used as `SUPABASE_URL`. Its modern server secret is now configured as `SUPABASE_SECRET_KEY` in Vercel.

**Server key configured for the test branch:** the owner-authorized private dashboard transfer is complete. The existing `SUPABASE_SECRET_KEY` entry was then moved from Production to target `preview`, restricted to `build/nextjs-supabase-conversion`, by editing metadata only. Its value was not retrieved, printed or committed. Other preview branches receive no database credential, and a future Production build now needs a separately configured server-key entry. The subsequent hosted order test, rather than key configuration alone, established runtime database connectivity. Redeploying the existing production deployment would still use the old `main` source. Any application deployment must explicitly use the reviewed conversion source.

Prelaunch tests use this same new SoltaSite database, which has no real customer data. It is not a separately disposable test database; record and reconcile test orders/uploads before live use, and do not assume cleanup has happened. This flow has no browser Supabase client, so no public Supabase key or customer Auth setup is required yet.

## 3. Provider configuration and remaining credentials

`SOLTASITE_COMMERCE_ENABLED=true` is configured only for the reviewed preview branch, with `SOLTASITE_STRIPE_MODE=test` and `KP_SYNC_ENABLED=false`. Global/default and Production commerce remain false. The existing `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, `SUPABASE_SECRET_KEY` and `ORDER_ACCESS_SECRET` entries were moved from Production to the reviewed preview branch by metadata edits; no secret value was retrieved. The branch also has the exact test origin, `SUPABASE_URL`, exact `TURNSTILE_ALLOWED_HOSTNAMES`, explicit Stripe test mode, its public Turnstile site key and private verification secret. The conversion preview alone enables the non-submitting materials design route. Other previews retain no backend credentials.

A metadata-only audit confirmed all 11 required provider/configuration keys for the branch. All five private values—Supabase server key, Stripe API key, Stripe webhook secret, Turnstile verification secret and order-access secret—are stored as type `sensitive`. The separate branch commerce override does not enable Production or other previews.

Production retains the canonical origin, Supabase URL, allowed production hostnames and its separate Turnstile keys, with commerce disabled. It no longer has the moved Stripe test credentials, Supabase server key or order-access secret. Configure its required private values independently before a future live release.

The shared Stripe account has a dedicated Solta Site sandbox with product `prod_VXBaIPq0R1GJyo` and active one-time USD $499 price `price_1UW7DWEYpNmRDZ8wRCb7Q8us`. The sandbox API key is a sensitive variable scoped only to the reviewed preview branch. The sandbox webhook `we_1UW7teEYpNmRDZ8wjiIRlgbH` is registered and Active, and its matching `STRIPE_WEBHOOK_SECRET` is saved as a sensitive variable for that same branch. A successful USD $499 test payment produced a delivered signed event, one paid order and two pending paid-order outbox rows. A declined attempt produced no paid order or outgoing work. See [shared Stripe account setup](stripe-shared-account.md) for attribution and Dashboard searches and [the hosted test report](hosted-sandbox-test.md) for verification details.

### Configured Turnstile widgets

Both widgets use **Managed** mode with **pre-clearance disabled**. Public site keys below are identifiers, not server secrets; their private verification keys were saved directly into the matching Vercel environments.

| Widget purpose | Public site key | Allowed hostname | Vercel scope |
| --- | --- | --- | --- |
| Solta Site sandbox | `0x4AAAAAAFsLH0-PjPx_q9Jt` | `soltasite-git-build-nextjs-supabase-conversion-sn-d1.vercel.app` | Preview, only `build/nextjs-supabase-conversion` |
| Solta Site production | `0x4AAAAAAFsLOt7ka7vhnBWr` | `soltasite.com` (also covers `www.soltasite.com`) | Production |

The application verifies the expected `checkout` and `materials` actions and exact returned hostname on the server. Cloudflare's root-domain allowance does not replace the application's explicit `TURNSTILE_ALLOWED_HOSTNAMES` check. See [Turnstile hostname management](https://developers.cloudflare.com/turnstile/additional-configuration/hostname-management/).

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

The registered sandbox Stripe webhook points to `https://soltasite-git-build-nextjs-supabase-conversion-sn-d1.vercel.app/api/stripe/webhook`, with snapshot payloads from **Your account** for exactly `checkout.session.completed`, `checkout.session.async_payment_succeeded` and `charge.refunded`. Its API version is `2026-09-30.endive`, the stable version offered by the Dashboard; the pinned SDK's API-request default remains `2026-10-28.endive`. The matching signing secret is restricted to the test branch. [Open this sandbox endpoint](https://dashboard.stripe.com/acct_1UW7CeEYpNmRDZ8w/test/workbench/webhooks/we_1UW7teEYpNmRDZ8wjiIRlgbH).

The approved single-host exception makes the configured endpoint reachable by Stripe, and a signed paid event plus its resend both returned HTTP 200. `commerceConfig()` still runs before signature/source handling and returns `503` if commerce is disabled or required configuration is missing. Environment changes require rebuilding the reviewed branch.

## 4. Verify a complete test purchase

Keep the completed branch-scoped configuration with `SOLTASITE_COMMERCE_ENABLED=true`, `SOLTASITE_STRIPE_MODE=test` and `KP_SYNC_ENABLED=false`, and rebuild the reviewed source after environment changes. The public Turnstile key requires a rebuild. The approved public exception applies only to the stable preview hostname; Production must remain disabled.

Hosted testing has confirmed a declined card creates no paid order, while a successful test payment creates one order through the signed webhook and unlocks `/thanks`. Resending the paid event returned HTTP 200 and preserved one order, one webhook-event row and two pending paid-order outbox rows, with zero delivery attempts. Website metadata on Checkout and PaymentIntent and text/radio draft restoration were also checked. See [hosted sandbox test results](hosted-sandbox-test.md).

Private uploads and materials submission are paused because browser-tooling file delivery did not complete. The final snapshot at `2026-10-30 05:36:35 UTC` contained one paid order, zero asset/storage-object/submission/refund records and two pending paid-order outbox rows with zero attempts. The form's Send it action was not used. The refund is intentionally deferred to keep that paid order available for continuing the same test.

The next step is to check the Chrome extension's file-URL access setting, as directed by the Browser skill's `chrome-file-upload-troubleshooting` guide, and resume file transfer; the setting's actual state has not been established. Existing authorization to complete the hosted test persists. This does not establish an application-upload defect. After transfer works, complete representative uploads and materials submission, verify the durable receipt/outbox state, then test refund delivery and revoked access. Delayed-webhook UI, unauthorized-order probes, supported font uploads, interrupted uploads and invalid-file removal must not be represented as hosted passes without an observed result.

The previous code verification passed 43 individual tests and the Vercel preview build. Those checks were not rerun for this documentation-only update. The hosted report records additional observed provider behavior separately; the entire purchase/upload/refund sequence is not yet complete.

## 5. Complete launch work

Implement receipt email delivery and its retry path before the site promises a receipt. Implement abandoned-reservation/object cleanup and decide retention for customer materials. Build the dedicated KP receiver and dispatcher from `kp-connection.md` when ready; queued records alone do not deliver themselves.

The original handoff marks the privacy, terms and accessibility copy as placeholders for owner review. Confirm that copy, the retained `contact@soltaworks.com` address, delivery/update promises and photo permissions. Replace the Keshia “Site coming soon” state when its actual URL is available.

After the test purchase and operational work pass, create the matching live product/price and dedicated live webhook in the owner-selected Solta Works Stripe account. Configure the Production-scoped live Stripe key, price and signing secret together with `SOLTASITE_STRIPE_MODE=live`. Restore a Production-scoped `SUPABASE_SECRET_KEY` from the intended new SoltaSite project and generate a new, independent `ORDER_ACCESS_SECRET`; the previously staged entries now belong only to the test branch. Verify the separate production Turnstile settings, reviewed source and exact production origin, connect the intended domain, and enable production commerce only as part of that deliberate live release. KP uses its dedicated integration contract and secret. Reconcile recorded sandbox data before live use and remove the public preview exception when it is no longer needed.
