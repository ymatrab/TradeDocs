# TradeDocs launch plan

Written 2026-10-05 after the /elliot launch-readiness run. Decisions referenced are in
[DECISIONS.md](../DECISIONS.md); the go-live mechanics are in [RUNBOOK.md](../RUNBOOK.md).

## Where things stand

- **Built on `redesign/manifest` (PR #10), not yet on production:** Manifest design v2
  (D-005, D-012, D-013), security and data-integrity fixes, content and SEO fixes, 3 document
  generators, landed-cost calculator, guides hub + 3 guides with Unsplash covers, image SEO,
  service waivers (D-017), snapshot schema 3, production migration workflow.
- **Production today:** `trade-docs-six.vercel.app` runs the old design in foundation mode
  (free tools only, accounts closed, indexing closed).

## Built in round 2 (launch-v2, PR #12)

Pricing page + Stripe Payment Links plumbing (flag off, no prices until the owner sets them),
in-app billing page, contact form + inbox, help centre + floating help button, platform admin
panel (email allowlist, audited), legal drafts (privacy, terms, cookies — noindex until
approved), homepage v3 (photos, keyword sections, answer-first FAQ, new nav/footer), blog with
5 posts + RSS + llms-full.txt, guides upgraded for AI answers (D-018, D-019).

## Phase 0 — merge (owner, today)

1. Merge PR #10 into `main` once CI is green. Production stays in foundation mode: no data,
   no sign-up, no indexing — this only ships the new design, tools and content.
2. Agent: verify production pages, headers and that `/design-system` is 404.

## Phase 1 — open sign-up (blocked on owner items)

| #   | Item                                                                                                                                                                                                             | Who                              |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| 1   | Business name, country, contact email → agents draft privacy + terms (D-009), owner approves                                                                                                                     | owner → agents                   |
| 2   | Resend account + verified sending domain; Supabase Auth SMTP → Resend (RUNBOOK)                                                                                                                                  | owner                            |
| 3   | `PRODUCTION_DATABASE_URL` secret in GitHub `production` environment; run "Migrate production database" (dry run, then apply). Take a Supabase backup first                                                       | owner                            |
| 4   | Vercel Production env: APP_ENV, APPLICATION_MODE=service, APP_URL, project refs, SUPABASE_ENVIRONMENT, RATE_LIMIT_KEY_SECRET, RESEND_API_KEY, EMAIL_FROM, WAIVE_TURNSTILE/SENTRY/ANALYTICS/INDEXNOW=true (D-017) | owner                            |
| 5   | Branch protection on `main` (require CI)                                                                                                                                                                         | owner approves, agent configures |
| 6   | Redeploy; agent smoke test: `/api/ready` 200 with degraded list, sign-up + confirmation email, first shipment → 4 PDFs → ZIP, second org cannot see the first                                                    | agents                           |
| 7   | `LAUNCH_APPROVED=true` after the checklist is signed                                                                                                                                                             | owner                            |

## Phase 2 — open search (blocked on domain)

1. Owner buys and attaches the custom domain; set `APP_URL` to it (D-007).
2. Agent verifies: vercel.app → domain 308, robots/sitemap/X-Robots-Tag open, canonicals.
3. Owner verifies the domain in Google Search Console and submits `/sitemap.xml`; Bing
   Webmaster Tools optional.
4. Owner reviews fact pages after launch and records name + date (D-015).

## Improvements still to build before or soon after launch

Ranked by risk to customers first, then growth.

1. **Automatic account removal after the 30-day grace period** — today a weekly manual check
   (RUNBOOK); the privacy text says "shortly after". (privacy)
2. **Turnstile verification on sign-up and the free generators** — the config exists but no
   code verifies tokens yet. Build before removing `WAIVE_TURNSTILE`. (security)
3. **Error monitoring** — Sentry needs its SDK (a dependency change via CI/Dependabot) or keep
   Vercel logs + deploy alerts; decide before real traffic. (operations)
4. **Transactional email for invitations** — invites are copy-links today; send them via
   Resend once the sender is verified. (product)
5. **Payments** — plumbing built (Payment Links + verified webhook, flag off); owner creates
   Stripe Payment Links, sets prices, refund policy and webhook secret (P-002). Copy says
   "free while early" until then. Known limits: a refund revokes every org paid by that
   Stripe customer; plan changes made inside Stripe are not reflected.
6. **Certificate of origin** — stays gated until a recorded legal review (D-008).
7. **Content backlog with measured demand** (docs/research/content-plan-2026-10-05.md):
   "how to fill out a commercial invoice" guide, certificate of origin explainer, Incodocs
   comparison page (facts from Incodocs' live pages, dated), container loading calculator.
8. **Analytics** — consent-aware, after the domain; needs a cookie decision. (measurement)
9. **IndexNow** — after Search Console is live.
10. **Dependabot backlog** — merge the open dependency PRs through CI (supabase-js + ssr
    together).
11. **Generator fields** — proforma validity date and payment terms; buyer reference.

## Owner inputs still needed for legal approval

Business name, country, address, contact email, governing law, data region; the transfer
mechanism per provider; contact-message retention period; liability cap in the terms.
Then set LEGAL_* env values and LEGAL_APPROVED_AT.

## Rollback

Vercel instant rollback to the previous production deployment. Migrations are
forward-only: back up the database before Phase 1 step 3.
