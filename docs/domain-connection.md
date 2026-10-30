# Solta Site domain connection

Connected and verified October 30, 2026.

## Public addresses

- Canonical site: <https://soltasite.com/>
- `https://www.soltasite.com/` returns a permanent 308 redirect to the canonical site.
- `http://soltasite.com/` returns a permanent 308 redirect to HTTPS.
- Public homepage and `/start` returned HTTP 200 without a Vercel sign-in or bypass token. Standard TLS certificate validation succeeded.

## Project and first production release

- Vercel team: `sn-d1` (`team_duIjSUsrF3ojzP4f4pyMEUAs`).
- Project: `soltasite` (`prj_XtzLWNJKw63Ol5mUB8SPioiiyHeM`).
- First application production deployment: `dpl_7oeC5ZVAdyLZ4MZtX8cdbbMcbH6n`.
- Source: `34209449d1f56a645d419976a0cb4ce9d93e09ab`, branch `build/nextjs-supabase-conversion`.
- Built for the **Production environment**, with production configuration. This replaced the original README-only production deployment; it was not a promotion of the sandbox artifact.
- `SOLTASITE_APP_ORIGIN=https://soltasite.com`.
- Production commerce, KP sync and the materials design preview remain disabled. Stripe mode remains `test`; production has no Stripe payment credentials or price configured.
- `/start` displays “Online checkout isn’t open yet.” and the existing contact email, without a checkout form.

The existing sandbox alias stays attached to a separate Preview deployment. Creating a production build from this branch also moves its generated branch alias, so restore that sandbox alias to the corresponding Preview deployment after each manual production release. After this domain release it points to `dpl_5zbLHHShJ4EkVvSqBqZVNFPrUD7H`, from the same source SHA.

The source PR remains open. Connecting the domain did not merge the branch into `main` or change the project's production branch. Future application changes need a reviewed Production-target deployment until the normal release branch is established.

## Authoritative DNS

Registration and DNS remain with Namecheap. Nameservers remain `dns1.registrar-servers.com` and `dns2.registrar-servers.com`.

| Type | Host | Value | TTL |
| --- | --- | --- | --- |
| A | `@` | `216.198.79.1` | 30 minutes |
| A | `@` | `64.29.17.1` | 30 minutes |
| CNAME | `www` | `acae6223e8deee91.vercel-dns-017.com.` | 30 minutes |

These were the rank-1 DNS values returned by Vercel for this exact project/domain. Both domains are verified and Vercel reports `misconfigured: false`.

Replaced parking records:

- `CNAME www parkingpage.namecheap.com.`
- `URL Redirect @ http://www.soltasite.com/` (unmasked)

Namecheap Email Forwarding and the SPF TXT record `v=spf1 include:spf.efwd.registrar-servers.com ~all` were preserved. No nameserver migration, domain purchase, mailbox creation or registrar transfer was performed.

## Evidence

- [Saved Namecheap DNS configuration](evidence/domain-2026-10-30/namecheap-dns.jpg)
- Vercel domain verification and DNS checks for both names succeeded.
- Independent unauthenticated HTTP checks verified the homepage, disabled checkout presentation, HTTPS redirect and `www` redirect.

DNS caches elsewhere can retain old parking records until their prior TTL expires; an accepted DNS write alone was not treated as proof of HTTPS availability.
