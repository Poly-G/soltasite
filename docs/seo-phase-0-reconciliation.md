# SoltaSite SEO Phase 0 Reconciliation

**Date:** 2026-10-31  
**Plan:** `docs/seo-operating-plan.md`  
**Status:** SOURCE CLEANUP COMPLETE; PRODUCTION RELEASE PENDING

## Changes completed

- Merged the Instagram / Linktree / casting-profile comparison into `/do-actors-need-a-website`.
- Added a permanent redirect from `/actor-website-vs-instagram-linktree-casting-profile` to `/do-actors-need-a-website`.
- Deleted the obsolete standalone comparison page source.
- Removed the consolidated comparison URL from the XML sitemap.
- Made `/start` permanently noindex, including after live commerce is enabled.
- Removed `/start` from the XML sitemap permanently.
- Reduced duplicated checklist content on `/actor-website-examples`; the dedicated checklist page now owns that intent.
- Reduced duplicated checklist content on `/actor-website-cost`; the page now stays focused on total-cost comparison.
- Tightened the `/actor-seo` CTA so it does not imply a broader SEO service than the published $499 actor-site product.

## Surviving indexable page map

| URL | Owner intent | Audit |
| --- | --- | --- |
| `/` | actor websites / website for actors | PASS |
| `/actor-website-design` | actor website design / designer | PASS |
| `/actor-website-examples` | actor website examples | PASS after checklist trim |
| `/actor-website-cost` | actor website cost / pricing | PASS after checklist trim |
| `/actor-website-builder` | actor website builder / DIY vs done-for-you | PASS |
| `/do-actors-need-a-website` | need/timing + platform comparison | PASS after merge |
| `/what-to-put-on-an-actor-website` | actor website checklist / inclusions | PASS |
| `/actor-seo` | SEO for actors / name search visibility | PASS after scope cleanup |

## Intent / cannibalization audit

- No surviving page has the same primary query family as another surviving page.
- The checklist intent now has one clear owner.
- Platform-comparison content has one clear owner.
- Cost and builder pages remain separate because one answers price/payment-model intent and the other answers DIY-vs-done-for-you intent.
- The homepage remains broad category intent while `/actor-website-design` owns specialist service intent.
- Actor SEO remains distinct from site-content/design intent.

## Heading / metadata audit

- Each surviving SEO page has one rendered primary H1.
- Titles are unique by page intent.
- The checkout page contains alternate H1s only because mutually exclusive server-rendered states are used; one H1 renders per response.
- Canonical metadata continues to use `https://soltasite.com`.
- Fictional actor demos remain noindex.
- Utility/legal/private workflow pages remain outside the indexable SEO set.

## Internal linking audit

Every surviving supporting guide has a path toward a commercial page or the $499 start flow.

Commercial pages point to proof, pricing, examples, or supporting guidance.

No surviving SEO page is intentionally orphaned.

## Production release boundary

The reconciled SEO code currently lives on:

`build/nextjs-supabase-conversion`

The current production deployment for `soltasite.com` is still commit:

`219494a7e3055fbd74a47a71dd1ce14f3505ea38`

The reconciliation commits are preview deployments and are **not yet the canonical production site**.

Do not tell Search Console to expect the new page set until the intended release is promoted/deployed to production.

Production promotion must respect the broader SoltaSite release gates; the SEO cleanup alone is not authority to release unrelated unreviewed application changes.

## Phase 0 exit status

### Complete

- URL consolidation
- redirect definition
- sitemap cleanup
- checkout noindex cleanup
- intent separation
- duplicate-section cleanup
- product-claim cleanup
- source-level heading/metadata/internal-link audit

### Pending broader release

- production promotion / branch reconciliation
- canonical-domain verification of the reconciled page set
- production crawl after release

No additional indexable SEO URL should be created before the production release/indexation foundation and initial Search Console evidence.
