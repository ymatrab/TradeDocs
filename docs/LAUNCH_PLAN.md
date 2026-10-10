# TradeDocs launch plan

Written 2026-10-05 after the /elliot launch-readiness run. Decisions referenced are in
[DECISIONS.md](../DECISIONS.md); the go-live mechanics are in [RUNBOOK.md](../RUNBOOK.md).

## Weekend launch checklist (2026-10-10, D-024/D-025)

Live on production (foundation mode: no database, sign-up closed, indexing closed): 251
sitemap URLs (113 posts, guides, 50+ glossary terms, 6 country pages, 11 free tools including
the HS code lookup), and the workspace build from PR #21: 11 document types (quotation,
purchase order, sales confirmation, sales contract draft, proforma, commercial invoice,
packing list, delivery note, bill of lading draft, shipper's letter of instruction, VGM
declaration), certificate of origin behind its review gate, REST API (Team), QuickBooks/Xero
import and Dropbox Sign e-signature (Pro and Team), each off until configured. Prices approved
(Pro $19/mo or $190/yr, Team $49/mo or $490/yr), not yet shown.

Owner, in order (details in RUNBOOK.md):

1. Vercel Production env: `PRICES_APPROVED=true`, `APPLICATION_MODE=service`, `APP_ENV`,
   `APP_URL`, `RATE_LIMIT_KEY_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`, `PLATFORM_ADMIN_EMAILS`,
   `WAIVE_TURNSTILE/SENTRY/ANALYTICS/INDEXNOW=true`; redeploy.
2. Resend account and verified sending domain; Supabase Auth SMTP set to Resend.
3. Supabase dashboard: confirm email on, minimum password 12, Site URL and redirect
   `<APP_URL>/**`, the 4 templates from `supabase/templates/`.
4. Supabase backup, `PRODUCTION_DATABASE_URL` secret in the GitHub `production`
   environment, then the "Migrate production database" workflow (dry run, then apply). PR #21
   added migrations 20261009000100, 0200, 0400, 0500 and 0600.
5. Legal identity (business name, country, address, contact email) and approval of the
   privacy policy and terms (`LEGAL_*`, `LEGAL_APPROVED_AT`).
6. Domain attached, `APP_URL` updated; Google Search Console and sitemap submission.
7. Stripe Payment Links for Pro and Team, webhook secret, `PAYMENTS_APPROVED`,
   `ENABLE_PAYMENTS`.
8. `LAUNCH_APPROVED=true`. Agent then runs the post-launch smoke: sign-up and confirmation
   email, first shipment with every document type, ZIP, cross-tenant isolation.

Optional, each switches on one feature: `API_KEY_PEPPER` (REST API); `LEGAL_COO_REVIEWED_BY`,
`LEGAL_COO_REVIEWED_AT`, `REGULATED_DOCUMENTS_APPROVED`, `ENABLE_REGULATED_DOCUMENTS`
(certificate of origin, after a named legal review); `CSL_API_KEY` (denied-party screening);
Intuit and Xero developer apps plus `QUICKBOOKS_*`, `XERO_*`, `INTEGRATION_TOKEN_KEY`;
`DROPBOX_SIGN_API_KEY` (e-signature).

Not buildable by agents (D-025): AES filing, chamber-certified certificates of origin,
dangerous goods declarations, phone support.

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

## Round 3 — overnight 2026-10-06/07 (launch-v3, PR #13)

Built while the owner slept (D-020); not on production until the owner merges.

- **Product:** documents supersede earlier finals and record lineage; void needs owner/admin
  and a reason; staleness says why; packing totals are count × weight; concurrent edits are
  refused; CSV import reports problems by file line with a dry run; reuse a shipment as a new
  draft; organization document settings (currency, prefix, payment terms, bank details,
  signatory, note); "PREVIEW · NOT ISSUED" PDF; renderer v4 for new documents (old documents
  render exactly as issued); onboarding checklist, shipment step links, sticky totals,
  stacked tables on phones, document filters and Regenerate.
- **Accounts:** 12-character passwords with a breached-password check, email confirmation
  with resend, password reset end to end (fixed a host mismatch that dropped the session),
  change email/password/name, roles and emailed invites, Turnstile verification whenever keys
  exist, admin user management (search, disable, resend, reset, deletion), purge routine
  (not scheduled — owner decision).
- **Pricing:** competitor analysis (docs/research/competitors-2026-10-06.md) and proposed
  packages (docs/research/pricing-proposal-2026-10-06.md): Free $0, Pro $19/mo or $190/yr,
  Team $49/mo or $490/yr, per organization. Hidden until `PRICES_APPROVED=true`.
- **Content:** 60 posts + 30 guides planned (docs/research/content-plan-v2-2026-10-06.md);
  launch batch published on the branch: 20 posts + 10 guides (25 posts and 13 guides total).

## Owner morning checklist (round 3)

1. Prices: approve or change the proposal, then set `PRICES_APPROVED=true` in Vercel.
2. Paid-plan value: Pro/Team add nothing yet. Suggested: make PDF branding (logo, signature)
   the Pro feature — approve and the team builds it.
3. Merge PR #13 (CI green, sign-offs OK; production stays in foundation mode).
4. Supabase dashboard: confirm email on, minimum password length 12, Site URL + redirect
   `<APP_URL>/**`, paste the 4 templates from supabase/templates/ (required before admin
   resend/reset emails work).
5. Then the Phase 1 list above (Resend, database secret + migrations, production env,
   `PLATFORM_ADMIN_EMAILS`, purge schedule choice, legal details, Stripe, domain).

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
   comparison page (facts from Incodocs' live pages, dated). The container loading calculator
   was built 2026-10-07, with a unit converter and a delivery note generator.
8. **Analytics** — consent-aware, after the domain; needs a cookie decision. (measurement)
9. **IndexNow** — after Search Console is live.
10. **Dependabot backlog** — merge the open dependency PRs through CI (supabase-js + ssr
    together).
11. **Generator fields** — built 2026-10-07 (snapshot schema 6): proforma validity date, payment terms, buyer reference.

## Owner inputs still needed for legal approval

Business name, country, address, contact email, governing law, data region; the transfer
mechanism per provider; contact-message retention period; liability cap in the terms.
Then set LEGAL_* env values and LEGAL_APPROVED_AT.

## Rollback

Vercel instant rollback to the previous production deployment. Migrations are
forward-only: back up the database before Phase 1 step 3.
