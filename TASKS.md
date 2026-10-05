# TradeDocs — launch build plan

Status 2026-10-05: sections 1–4 built on `redesign/manifest` (PR #10), CI green at 5fcdb3b, all six
agents signed off. Next steps and remaining improvements: docs/LAUNCH_PLAN.md.

## Already on the branch (keep, re-verify in the final pass)

- Builder fixes: tenant-integrity migration (composite org keys, scoped definer functions),
  immutable finalized documents, certificate of origin gated (D-008), public rate limit,
  decimal money with currency minor units, honest JSON 503s, password-reset route,
  0-row failures reported, generator origin/gross-weight fixes, Next.js 16.3.8.
- Content fixes: Incoterms FCA/DAP corrections, Incoterms® 2020 naming, sources registry with
  retrieval dates, expanded Incoterms pages + FAQs, generator form/FAQ agreement, CONTENT.md.
- SEO fixes: conditional X-Robots-Tag, vercel.app → custom-domain 308, per-page sitemap dates,
  explicit noindex on private routes, OG image, JSON-LD (no ratings), llms.txt, related tools.
- Previews have no database (D-011).

## 1. Design v2 (decide first — owner picks from the comparison)

- Palette: one of three new options (not navy/green + amber/yellow).
- Typography: display grotesk closer to Forest's Matter (medium weight, tight tracking).
- Motion: scroll-driven, mask-based reveals; never animate text opacity (axe gate).
- Hero/section layout upgrades (real product frame, one record → four documents sequence).
- Fix the current axe colour-contrast failures; rename nav "Pricing" → "Free while early"
  (there are no prices).
- Apply the same tokens to the signed-in app (lighter motion).

## 2. Content expansion (needs keyword data — owner approves paid calls first)

- Phase 1, money pages: homepage, invoice generator, plus dedicated **packing list** and
  **proforma invoice** generator pages (the generator already supports both kinds).
- Guides (how-to): fill in a commercial invoice, packing list vs commercial invoice, HS codes
  for a commercial invoice, Incoterms for small exporters, certificate of origin explained
  (explainer only; the template stays gated).
- Blog (search-led/comparisons): only with verified competitor data from live pages
  (e.g. an Incodocs alternative page), dated and sourced.
- Free tools: candidates ranked by demand (landed-cost estimator, container loading).
- Programmatic pages: only where measured demand exists; none planned blind.
- Every page: sources, last-reviewed date, not-advice note where regulated.

## 3. Images and image SEO (owner approves 2 samples + cost first)

- Homepage product visuals from real UI screenshots (free).
- Article covers/illustrations: Unsplash (free, attributed) or generated (paid — quote first).
- Keyword file names, alt text, image sitemap, ImageObject schema.

## 4. Launch plumbing

- Database migrations: one-off GitHub Action the owner triggers (DB URL as a GitHub secret
  the owner adds).
- Production env: APP_ENV=production, APPLICATION_MODE=service, APP_URL, SUPABASE_PROJECT_REF,
  SUPABASE_ENVIRONMENT, PRODUCTION_SUPABASE_PROJECT_REF, RATE_LIMIT_KEY_SECRET, LAUNCH_APPROVED.
- Auth email: Supabase default sender is rate-limited; Resend for production (owner account).
- Monitoring: no Sentry SDK (no local installs) — Vercel logs + deploy alerts as fallback,
  recorded in DECISIONS.
- Legal pages: privacy + terms drafted from real behaviour, noindex until approved (D-009).
- Branch protection on main (owner approves the setting).

## 5. Final pass (one build)

Build 1–4 together → CI green → Vercel preview → all six agents re-verify and sign off →
owner merges to main → verify production → wrap-up report.

## Owner-only

Pick palette · approve paid keyword research and image samples · business name/country/
contact email for legal drafts · domain purchase + DNS · add DB secret to GitHub ·
production env values · Resend account · Search Console · legal sign-off · merge to main.
