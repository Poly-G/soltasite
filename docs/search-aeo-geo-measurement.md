# Search, AEO and GEO Measurement

**Status:** Operating notes  
**Date:** 2026-11-01  
**Governing plan:** `docs/seo-operating-plan.md`

## What is measured

SoltaSite records privacy-light first-party search attribution in Supabase:

- `page_view`
- `start_click`
- `checkout_submit`
- `checkout_session_created`
- `purchase`

Stored attribution fields:

- anonymous session UUID
- checkout request UUID when applicable
- current path
- first landing path
- referral hostname
- grouped source
- UTM source / medium / campaign / content / term
- timestamp

Not stored in this analytics table:

- customer name
- customer email
- IP address
- raw browser user-agent string

## Source groups

Current source groups:

- direct
- google
- bing
- other_search
- chatgpt
- perplexity
- copilot
- claude
- gemini
- social
- paid
- referral
- unknown

## Purchase attribution

The browser records the checkout request UUID before Stripe opens.

The verified Stripe webhook records the order first, then best-effort writes a `purchase` analytics event joined to that request UUID.

Analytics failure must never block order fulfillment.

## IndexNow

Verification key file:

`/9f4c2b1a7d6e5f308c1b2a3d4e5f6071.txt`

Submission command:

`npm run indexnow`

The script reads the production sitemap and submits only canonical sitemap URLs to IndexNow.

Run after meaningful production URL or content changes. Do not use it as a replacement for Google Search Console.

## Bing Webmaster Tools / AI Performance

Once the Bing property is connected:

Track traditional search:
- indexed pages
- impressions
- clicks
- query/page performance

Track AI visibility:
- cited URLs
- grounding queries
- citations
- topic groupings
- citation share where available

## AEO review

For question-led pages, verify:
- the primary question is answered near the top,
- the first answer is concise and factual,
- supporting nuance follows,
- headings reflect real user questions naturally,
- no FAQ/schema stuffing.

## GEO review

Prioritize:
- consistent brand/entity facts,
- server-rendered content,
- sources/evidence,
- real examples,
- first-party research,
- external brand mentions.

Do not create separate GEO-only URLs.
