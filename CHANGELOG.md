# Changelog

## Unreleased — 2026-09-06

### Content wave C, export price calculator, use-case pages (D-022 wave C)

- `/tools/export-price-calculator`: EXW → FCA/FOB → CFR/CPT → CIF/CIP plus a DDP estimate from
  costs the visitor enters (`src/lib/trade/export-price.ts`, decimal-safe, no rates of our own).
- `/for/exporters`, `/for/freight-forwarders`, `/for/trade-consultants` from
  `src/lib/content/use-cases.ts`; claims follow `plans.ts` FEATURES and CTAs follow the live
  capability flags; the forwarders page says it is document preparation, not a TMS.
- 26 articles (posts and guides: US customs, Incoterm comparisons, UK/EU VAT and declarations,
  IOSS, export business, product-led), 9 glossary terms (3 regulated: mechanism only, no
  rates), Germany and South Korea country pages. ATA carnet pending.
- Carrier sites (UPS, FedEx, DHL) blocked fetches, so no carrier facts were stated.
- All pending CI.

### Glossary, export documents by country, CBM-to-cubic-feet and pallet calculator (D-022 wave A)

- `/glossary` hub (A–Z, in-browser search, DefinedTermSet) and `/glossary/[term]` (DefinedTerm
  in the hub set, BreadcrumbList, FAQPage) from `src/lib/content/glossary/<slug>.ts`. Wave A
  terms: cbm, consignor, dunnage, feu, teu, verified-gross-mass, waybill, plus 18 hub-only
  entries linked to the guide or tool that owns them. Regulated terms stay noindex and out of
  the sitemap and llms until a review record exists.
- `/export-documents` and `/export-documents/[country]` (Article, BreadcrumbList, FAQPage) from
  `src/lib/content/countries/<slug>.ts`: Mexico (ANAM, SAT, ITA guide) and India (CBIC, DGFT,
  ITA guide), every row sourced, no rates. Always regulated: both pages and the hub are noindex
  and out of the sitemap and llms.txt until a named review record is added.
- `/tools/cbm-to-cubic-feet` (m³, ft³, cm³, in³, L, exact decimal factors; new source
  `nist-si-volume-units`) and `/tools/pallet-calculator` (cartons per layer and pallet, loaded
  height, gross weight; EPAL and 48 × 40 in presets; `src/lib/trade/pallet.ts`).
- FedEx and UPS chargeable-weight presets not published: both carriers' live pages refused
  WebFetch on 2026-10-07, so no divisor could be read with a retrieval date.
- New source files: teu, dunnage, waybill, consignor, mexico, india. Footer and phone menu link
  the glossary and the country hub. Tests: vitest `glossary`, `pallet`; e2e additions in
  `tools.spec.ts`. All pending CI.

### Three free tools: container loading, unit converter, delivery note

- `/tools/container-loading-calculator`: cartons or pallets per 20ft, 40ft and 40ft HC by
  volume and by weight (Maersk figures in `CONTAINERS`), an optional usable-volume share and
  the containers a quantity needs; labelled an estimate, not a stow plan. Exact decimal
  arithmetic in `src/lib/trade/container-loading.ts`.
- `/tools/unit-converter`: CBM ↔ ft³ and kg ↔ lb both ways with the exact defined factors
  (`src/lib/trade/conversions.ts`); new source record `nist-si-mass` (NIST SP 811 B.9,
  retrieved 2026-10-07, pending owner review).
- `/tools/delivery-note-generator`: the free generator preset to the delivery note.
- Each has an answer-first intro, visible FAQ (`src/lib/tools/faq.ts`), sources, ToolCta and
  SoftwareApplication + FAQPage JSON-LD, and is registered in `PUBLIC_TOOLS` (tools hub,
  related tools, sitemap dated 2026-10-07, llms.txt), the footer and the home page.
- Tests: vitest `container-loading` (bounds, units, rounding, refusals, sources); e2e
  `tools.spec.ts` (calculator, converter, delivery note and proforma downloads, registration,
  axe on the new pages). All pending CI.

### Buyer reference, proforma validity and payment terms (snapshot schema 6)

- Shipments gain a buyer reference / PO number and a proforma valid-until date (shipment
  editor, `updateShipment`); payment terms stay in the organization's document settings. The
  free generators gain the same two fields plus payment terms on invoices and proformas.
- Snapshot schema 6 and renderer `tradedocs-pdf/6`: the buyer reference prints on commercial
  and proforma invoices and the validity date on proformas, in a second row of term boxes,
  only on snapshots that state one; schema 1–5 documents render byte for byte as before.
  Setting either marks earlier documents stale ("Shipment terms changed").
- The free generator also offers the delivery note (the renderer already supported it).
- Migration `20261007000200_document_commercial_terms.sql`; tests: vitest `tool-document`,
  `staleness`, `shipment-actions`, `branding` (renderer version); pgTAP
  `document_commercial_terms` (9). All pending CI.

### Content plan v3 toward 250 pages (D-022)

- Plan of record `docs/research/content-plan-v3-2026-10-07.md`: 161 new public pages in waves A–D (40, 42, 42, 37) on top of the 63 live ones, so 224 pages backed by measured demand or a named conversion role: 75 posts (100 in total), 25 guides, a glossary hub and 38 term pages (threshold 200 a month), an export-documents hub and 10 country pages (threshold 150 a month, five sourced country facts each), 8 free tool pages and 3 use-case pages. Wave E (20 help articles and 6 glossary terms at 100–199 a month) reaches 250 and waits for the owner's choice. Includes routing, exclusions, data-model specs for glossary and country pages, and a 660-row keyword appendix generated from the saved data.
- DataForSEO: the last 6 calls under D-014 (5 US and 1 UK keyword overviews), responses in `docs/research/dataforseo-2026-10-07/`, excluded from Prettier. A further 12 calls are listed for owner approval.

### PDF branding, the Pro feature (D-021)

- Pro and Team organizations can add their logo (top left of every page, fitted to 53 × 14 mm)
  and a signature or stamp image (above the signatory line, fitted to 64 × 18 mm) on the
  document settings page, with previews, replace and remove. Free organizations see the
  controls disabled with "Branding is part of Pro" and links to Billing and pricing; nothing
  they had changes.
- Feature `pdf_branding` in `src/lib/billing/plans.ts` (Pro, Team). Pricing, the comparison,
  the billing page and `/llms.txt` list it as the paid-only feature; "Paid-only features: none
  yet" is gone for Pro and Team.
- Snapshot schema 5 and renderer `tradedocs-pdf/5`: new documents of entitled organizations
  record each image's path and SHA-256 and render those exact bytes; schema 1–4 documents render
  byte for byte as before. Previews use the current branding. A changed logo marks earlier
  branded documents stale ("Logo or signature image changed").
- Dependency-free PNG/JPEG reader and PDF image embedding (JPEG as DCTDecode, PNG via
  FlateDecode with node:zlib, transparency as an SMask).
- Private bucket `org-branding` with storage RLS, table `branding_assets`, SQL entitlement check
  `private.branding_entitled` (migration `20261007000100_pdf_branding.sql`). Server actions
  accept bodies up to 2 MB (was 1 MB) so a 1 MB image fits.
- Tests: vitest `branding` (image parsing and embedding, upload validation, fail-closed gate,
  renderer dispatch, schema 4 unchanged) and `branding-actions`; pgTAP `pdf_branding` (35).
  e2e not added: an entitled organization needs a verified Stripe entitlement the CI database
  job does not have. All pending CI.

### Product logic review (D-020, docs/delivery/product-review-2026-10-06.md)

- Documents: re-generating supersedes the earlier revision of that type and the new one states the number it replaces; voiding is owner/admin only, needs a reason and is audited; previews (`/api/shipments/[id]/preview`) are labelled "PREVIEW · NOT ISSUED" with no number; a stale document says why (lines, packing, terms, a party's details, issuer settings), and the ZIP set leaves content-stale documents out and lists them.
- Snapshot schema 4 and renderer `tradedocs-pdf/4`: packing weights are count × per-package weight (they were per package), party blocks leave internal notes out, the notify party prints, long names and places stay inside their boxes, totals always share a page with the last row and never reach the footer, and invoices carry payment terms, bank details and a signatory line from the new document settings. Older documents render exactly as issued. The free generator moves to schema 4.
- Document settings page (`/app/[org]/settings`): default currency, number prefix, payment terms, bank details, signatory, document note.
- Reuse: "Reuse for a new shipment" copies parties, terms, lines and packing into a new draft without touching the original or its documents.
- Packing: allocations cannot exceed the line; the panel adds up in exact decimals and shows row weights.
- Shipments: Incoterms rule requires its named place; shipping date field; a save against an older revision is refused with a message instead of overwriting; saving an unchanged form no longer marks documents stale.
- Import: "Check the file" validates without writing; every problem is reported per file line, including unreadable figures, duplicate SKUs in one file and rows with no description.
- Actions: 0-row updates are reported (company/product edit and archive, role change, member removal, allocation removal); figures accept decimal commas and state their decimal-place limits.
- Tests: pgTAP `product_logic` (49), vitest `pdf-layout`, `staleness`, `packing-and-inputs`, extended `shipment-actions` and `csv`; e2e reuse flow. All pending CI.

### Competitor analysis and proposed pricing (D-020, prices behind PRICES_APPROVED)

- `docs/research/competitors-2026-10-06.md`: IncoDocs, ovrseas, Shipping Solutions, Zoho Invoice, Refrens and Invoice-Generator.com, from their live pages retrieved 2026-10-06 (plans, prices, limits, features, weak spots; unverified items marked), where TradeDocs is already better, ranked launch gaps and positioning lines that name no competitor.
- `docs/research/pricing-proposal-2026-10-06.md`: proposed Free / Pro $19 / Team $49 a month (yearly = 10 months, USD and EUR), rationale with sources, owner confirmations and the exact env to flip. Proposed Free limits and the Pro member cap are documented only: not enforced, not displayed, nothing free reduced.
- `src/lib/billing/plans.ts`: `PROPOSED_PRICES`, `PRICE_CURRENCIES`, `pricesApproved()` and `listedPrices()`; new offer state `listed` (approved prices on show, no button). Without `PRICES_APPROVED=true` every paid plan stays "Not available yet" with no price, as before; a buy button still needs payments open and all five `PRICE_<PLAN>_*`/`PAYMENT_LINK_<PLAN>_*` values. An invalid checkout value now falls back to `listed` (still nothing to buy).
- `/pricing`: copy, FAQ (with FAQPage JSON-LD) and metadata follow the three states; the comparison table header shows the plan's price when one is set; new "Why TradeDocs" section stating facts about TradeDocs only (account-dependent points hidden where accounts are closed). `/llms.txt` lists approved prices. Pro/Team summaries rewritten.
- `.env.example` and RUNBOOK.md document `PRICES_APPROVED`. Unit tests in `tests/unit/billing.test.ts` cover the flag, listed prices and the fallback. Pending CI; nothing was run locally.

### Workspace product UX: first run, shipment builder, documents, catalog (D-020)

- Overview: a setup checklist for a new organization (add your company, add a customer, add a product, create the first shipment), ticked from real data and gone once done; quick actions; a "Needs attention" table listing stale documents with the revision they came from and a link to their shipment; recent shipments with dates; an error state if the reads fail. No sample data: it could not be labelled and deleted cleanly without new server logic.
- Shipment builder: step links (Parties and terms, Goods, Packing, Documents) with a word + glyph state each; a summary of lines, quantity, net and gross kg, CBM, packages and total value, sticky beside the panels from 1280px and above them below that; the cursor returns to the description (or the catalog search) after a line is added; success toasts that name what changed, drawn silently because the inline result callouts still announce.
- Documents: per-state actions (Regenerate on a stale document whose kind has no current copy, PDF on every row), "rendered from revision N; the shipment is now at revision M", the set download shown only when it has something to bundle; the documents page gains All / Needs attention / Current filters.
- Catalog and companies: company search and kind filter; the CSV import previews the rows as read, flags figures that are not numbers, marks the import's own row problems in that preview and offers the template as a button. `/companies/new?kind=own|customer` preselects the kind.
- Consistency: record pages put a breadcrumb in the topbar caption (`AppShell parent`); goods, packages, documents, shipments, products and companies tables become cards below 640px (`DataTable stack`, `data-label` per cell).
- No server action, query semantics, migration or e2e selector changed. Nothing was run locally; format, lint, typecheck and e2e are pending CI. A PDF preview frame was not added: `/api/documents/[id]` serves the file as an attachment.

### Content plan v2 and one file per article (D-020)

- Plan of record for 60 posts and 30 guides (`docs/research/content-plan-v2-2026-10-06.md`): 55 new posts and 27 new guides, each with slug, primary keyword, volume, KD, intent, tool, angle, sources and batch; launch batch 1 is 20 posts and 10 guides. It also covers routing to existing pages, exclusions, volume anomalies, free tool candidates (container fit as a CBM extension, an export price builder; no HS finder) and a 234-row candidate keyword appendix generated from the saved data. DataForSEO: 11 calls (6 of the 17 left under D-014 remain); responses in `docs/research/dataforseo-2026-10-06/`, excluded from Prettier so the raw files stay as returned.
- `src/lib/content/posts.ts` and `guides.ts` are split into `posts/<slug>.ts` and `guides/<slug>.ts` with an `index.ts` each. Exports, order and content are unchanged. Listing order is now computed (`orderArticles`: newest `published` first, ties in index order).
- Per-article sources: `src/lib/content/sources/<slug>.ts` files merge into `SOURCES` (`mergeSourceFiles`); their keys become `SourceId`s; a repeated id throws.
- Optional `related` paths on an article choose its foot links (`src/lib/content/related.ts`); without them the foot lists at most six of the same kind (today: all others, as before).
- `docs/content/WRITING_BRIEF.md`: the structure, field limits, sourcing, Unsplash and self-check rules every writer follows.
- Tests in `tests/unit/posts.test.ts`: every article file is in its index and named after its slug, ordering, source-file merging and duplicate ids, related paths. Pending CI; nothing was run locally.

### Accounts and access under real conditions (D-020)

- Sign-up: 12-character minimum (72-byte maximum), Have I Been Pwned k-anonymity check on every new password (fails open on outage), Turnstile when configured, and a "check your inbox" screen with a resend on a 60-second cooldown. An address that already has an account gets the same screen.
- Sign-in: password or magic link, generic failures, Turnstile after 3 failures per account or 10 per address in 15 minutes, clear messages for unconfirmed (with resend) and disabled accounts, and a return to the page that was asked for (`?next=`, safe-listed to `/app`, `/admin`, `/invitations/accept`, `/reset-password/new`).
- Password reset end to end: request → email → `/auth/confirm` (token hash, any device) or `/auth/callback` (PKCE) → `/reset-password/new` → `/reset-password/done`, signed in, other sessions ended. Used or expired links land on a "can’t be used" screen with a fresh request. Token-hash email templates in `supabase/templates/` (hosted project must use them: RUNBOOK).
- Quotas on every account action (`src/lib/security/auth-limits.ts`); `peek_rate_limit` reads a counter without consuming it. Sign-out refuses cross-site posts.
- Account settings: change name, change email (current password, re-confirmation, pending state), change password (current password, ends other sessions), sign out everywhere, deletion as before.
- Account purge: `purge_due_accounts()` (service role, idempotent, batch-bounded, holds back a sole owner with colleagues), `/api/internal/purge-accounts` (bearer `CRON_SECRET`), and "Run purge now" in `/admin/users`. Not scheduled; RUNBOOK lists the owner's two options.
- Organizations: rename, switch (shell link), audited role change/removal/invite routines; administrators can no longer remove owners or other administrators. Invitations are emailed through Resend when configured, with an honestly labelled copy-link fallback otherwise; resend rotates the token, revoke kills the link, one live invitation per address, existing members cannot be re-invited.
- Turnstile verification (siteverify, fail closed once active) on sign-up, sign-in after failures, the contact form and the free document generator.
- `/admin/users`: email search by POST (exact/prefix, never in a URL), account view (organizations, roles, created, last sign-in, confirmation, sign-in and deletion state), disable/enable sign-in (ban + end sessions), resend confirmation, send password reset, cancel or force deletion; all audited.
- Migration `20261006000900_accounts_access.sql`; pgTAP `accounts_access.test.sql` (41); unit `tests/unit/accounts.test.ts`; e2e `identity.spec.ts` extended (duplicate sign-up, return-to-page, reset via the stack's mailbox, invite fallback, resend/revoke, role change, password change, admin search/disable, non-admin 404). CI exposes the stack mailbox and a synthetic admin address to the database job. E2E passwords are unique per run because the breach check refuses well-known phrases. DB types hand-added; CI's generated file is authoritative. Nothing was run locally; all gates pending CI.

### Homepage v3: photos, search sections and navigation (D-018)

- Four credited Unsplash photos support homepage sections (`SectionPhoto`, `HOME_PHOTOS` in `src/lib/content/home.ts`): desk (spScdgWY-_c, 2H Media), warehouse (VnMbc9Szs-E, Arum Visuals, download tracked 2026-10-06), port (b4lmjXJi9e4, Cosmin Andrei Buzamat) and truck (crHhZlES310, Maxim Tolchinskiy). Lazy, explicit dimensions, cropped `srcset` (`unsplashSrcSetAt`), clip-path/scale reveal only, reduced-motion safe. The hero product frame is unchanged.
- New sections: commercial invoice, proforma and packing list from one record (`#documents`, links to each generator and guide, ITA sources), a mid-page hull CTA band, who it's for (exporters, importers, forwarders, consultants, each with what TradeDocs does not do), and an export document checklist (`#checklist`) that marks what TradeDocs prepares, what is not offered (certificate of origin) and what is outside it, with a not-advice note. The free tools section links every guide and the blog. Each section ends on the capability-aware primary offer; no sticky mobile CTA, because it would cover content.
- FAQ grows from five to ten answer-first questions; the same array feeds FAQPage JSON-LD (new e2e check in `tests/e2e/seo.spec.ts`).
- Metadata: "Commercial invoice generator & export documents", description names the three generators; canonical `/` kept. Sitemap: `/` dated 2026-10-06 and lists its four photos.
- Navigation: Free tools · Guides · Blog · Pricing · Sign in; the phone menu adds Help and Contact. Footer: Product (How it works, Documents, Checklist, Pricing, Free while early), Free tools, Resources (Guides, Blog, Help, Contact), the offer, and Privacy/Terms/Cookies. The status band anchor moves from `/#pricing` to `/#status` and links `/pricing`. `/pricing`, `/blog`, `/help`, `/contact` and the legal pages are built in parallel branches; merge them together.

### Pricing page and Stripe Payment Links (flag off)

- `src/lib/billing/plans.ts` is the one source for plans, features and prices: "Free (while early)" with the features and limits the code really has (limits from `src/lib/limits.ts`, now shared with the routes), and Pro/Team whose price, currency, interval and Payment Link come only from env (`PRICE_<PLAN>_*`, `PAYMENT_LINK_<PLAN>_URL|ID`). Unset or invalid, or payments closed: "Not available yet", no price, no button (P-002). No feature is paid-only and nothing free is gated.
- `/pricing`: all plans side by side with full feature lists, a comparison table, an honest FAQ (with FAQ JSON-LD) and a CTA that follows account capability. In the sitemap and llms.txt; not in the nav yet (design owns nav/footer).
- `POST /api/billing/stripe/webhook`: 404 while payments are closed; verifies `Stripe-Signature` (HMAC-SHA256, constant time, 5-minute tolerance, no SDK), enforces live/test mode per environment, re-reads subscriptions and dispute charges from Stripe, and records event id plus effect in one transaction via `apply_billing_event` (service role only). Handles checkout.session.completed, customer.subscription.created/updated/deleted, charge.refunded (full only) and charge.dispute.created.
- Migration `20261006000100_billing_entitlements.sql`: `public.entitlements` (members read own org, plan/date columns only), `private.billing_events` ledger. Cancelled keeps access to the paid period end; refund or dispute revokes and is sticky. pgTAP `billing_entitlements.test.sql` (27). DB types for the new objects were hand-added; CI's generated file is authoritative.
- `/app/[org]/billing`: the organization's plan and status; an upgrade button (owners/admins, only when a plan is purchasable) that opens the Payment Link with `client_reference_id` = org id; otherwise "Paid plans aren't open yet". `hasEntitlement(org, feature)` fails closed.
- `/api/ready` reports `payments: "misconfigured"` with a reason when payments are switched on but unusable.
- Tests: `tests/unit/billing.test.ts` (signature fixtures with a synthetic secret, event mapping, subscription states, entitlement rules, offers), `tests/integration/billing-webhook.test.ts`, `tests/e2e/pricing.spec.ts`. All pending CI; nothing was run locally.

### Blog and GEO/AEO round (D-018)

- `/blog` hub and `/blog/[slug]` from one data module (`src/lib/content/posts.ts`), rendered by the shared `ArticleView` (`src/components/content/article-view.tsx`) that the guides now use too. Five posts chosen from measured demand in the 2026-10-05 plan: commercial invoice requirements, proforma invoice example, export documents checklist, packing list for shipping, FCA vs FOB. "Incodocs alternatives" was not written (0 measured searches; the plan defers it).
- Guides and posts share one shape (`src/lib/content/article.ts`): a 40–60-word short answer, key facts, terms defined, question-style H2s, step lists and comparison tables, a visible FAQ feeding FAQPage JSON-LD, published/updated/last-reviewed dates and a team byline. The three guides were upgraded to it (question headings, key facts, definitions, steps).
- Conversion: an in-context tool button under each short answer (capability-aware: the account offer appears only where accounts are open), a mid-article tool callout, the closing `ToolCta`, and a plain link to `/pricing`.
- Structured data: Article + ImageObject, BreadcrumbList and FAQPage on every post; Article `author`/`publisher` now name the Organization in full. Each post has its own credited Unsplash cover (downloads tracked once per photo), and so does the hub.
- Discovery: sitemap entries with cover images for `/blog` and every post; llms.txt gains a Blog section and summarises guides and posts by their short answer; new `/llms-full.txt` (full text with sources) and `/blog/rss.xml` (RSS 2.0). The guides hub links the posts and the blog hub links the guides.
- Source registry: ITA "Common Export Documents" (retrieved 2026-10-06).
- Tests: `tests/unit/posts.test.ts` (word range, title length, sources, covers, sitemap, answer-first structure for posts and guides, gated phrase, plain text); e2e checks for post structured data, the feed and llms-full.txt; review captures for `/blog` and one post.

### Legal pages, contact, help centre and platform admin (D-009, D-018)

- `/privacy`, `/terms`, `/cookies` drafted from what the code does (Supabase auth/Postgres, Vercel, Resend when configured, Unsplash hotlinks, session cookies only, generators store nothing, HMAC quota keys, 30-day revocable deletion). Identity comes from `LEGAL_*` env; missing values print "to be provided". Until `LEGAL_APPROVED_AT` is set with a complete identity they show "Draft — pending owner approval", are noindex and stay out of the sitemap and llms.txt.
- `/contact`: validated form (name, email, topic, message, honeypot) → server action → `contact_messages` (migration `20261006000100`, RLS with no policies, service-role insert only, pgTAP `contact_messages.test.sql`) with a 5/hour quota; Resend notification to `LEGAL_CONTACT_EMAIL` when configured (sandbox recipient outside production), outcome recorded per row.
- `/help`: every FAQ on the site searchable in the browser, from one module (`src/lib/content/faq.ts`; the six tool pages now import their FAQ from it). A floating Help button on the public and workspace shells opens a native modal panel (focus trap, Escape, focus return) with search and a contact link; `CHAT_PROVIDER` is a vendor slot that only accepts `none`.
- `/admin` (noindex, unlisted): `PLATFORM_ADMIN_EMAILS` allowlist checked per request and action, 404 otherwise; overview counts, organizations list/detail (members, roles, counts only), contact inbox with mark-handled, audit log. Service role on the server only; every view and action audited as `platform_admin.*`; fails closed without the service-role key.
- Sign-up links the terms and privacy policy; magic-link and reset pages cross-link; the accounts-closed state links to contact and survives a configuration fault.
- Unit tests `tests/unit/ops-pages.test.ts` (allowlist, contact validation/honeypot, legal approval state, sitemap exclusion, help search, email recipient). Pending CI: format, lint, typecheck, unit, pgTAP, build, and the database-types artifact (types for `contact_messages` were added by hand).

### Workspace documents at snapshot schema 3

- Migration `20260910000100_document_snapshot_v3.sql` redefines `generate_document` (same org scoping as 20260909000100) to emit schema 3: new workspace invoices get the per-line Origin column and "Incoterms® 2020" caption, and net/gross weight totals that no line states are null instead of zero. Existing schema 1/2 documents are not rewritten and render as issued. pgTAP (`tenant_integrity.test.sql`, plan 44) asserts the new schema, the absent gross total and an untouched schema 2 row; pending CI.

### Deferred service waivers (D-017)

- Production service mode still requires `RESEND_API_KEY` and `EMAIL_FROM`; Turnstile, Sentry, analytics and IndexNow keys are required unless `WAIVE_TURNSTILE` / `WAIVE_SENTRY` / `WAIVE_ANALYTICS` / `WAIVE_INDEXNOW` is `true`. Any configured key keeps its control active (a partial Turnstile pair is rejected). `/api/ready` lists waived controls under `degraded`. RUNBOOK documents the launch waivers and Resend as Supabase Auth SMTP.

### Content sign-off fixes

- Container capacities match the cited Maersk sheet (33/67/76/85 m³, 28,200/28,800/28,620/27,600 kg), pinned by a unit test.
- Free document PDFs (snapshot schema 3, renderer `tradedocs-pdf/3`): invoices print a per-line Origin column when any line states one; a packing list with no net weights omits "Total net weight" instead of printing 0.000 kg; the terms caption reads "Incoterms® 2020" (Noto Sans carries ®, now tested). Older snapshots render exactly as issued; workspace `generate_document` still emits schema 2.
- Road 333 kg/m³ and LCL 1 t/m³ labelled as common industry conventions with a check-your-tariff note (no primary source found).
- Generator copy: weights and packages print on the packing list, not the invoice; "with a quantity above zero"; the proforma FAQ lists the missing fields and that the proforma shows no weights.
- Incoterm pages no longer repeat the risk sentence in the lede; DAP and DDP link to the DAP vs DDP guide; the CBM page links to LCL vs FCL.
- Guide meta titles fit 60 characters with the " · TradeDocs" suffix (tested). SITE_DESCRIPTION names the generators and the landed cost calculator; home links the landed cost calculator; "document generators" on the auth fallback.

### Guide covers and image SEO (D-016)

- The three guides and `/guides` show a credited Unsplash cover (`cover` on each guide, `GUIDES_HUB_COVER`), hotlinked from images.unsplash.com through a plain `<img>` (`CoverFigure`): imgix-resized 2:1 `srcset` 640–1920, `sizes`, explicit dimensions, eager/high priority at the top of the page, and a "Photo by … on Unsplash" caption with `utm_source=paydocs` referral links.
- CSP `img-src` allows `https://images.unsplash.com`.
- Article JSON-LD gains an ImageObject (credit, creator, Unsplash licence, photo page); guide and hub Open Graph/Twitter cards use the cover at 1200 × 630; the sitemap lists each cover as an image entry.
- Unit tests for the URL builders, referral links, ImageObject, CSP and image sitemap (`tests/unit/images.test.ts`); the guides test now requires a cover. SEO.md gains the image policy.

### Content round (content plan 2026-10-05)

- New `/tools/proforma-invoice-generator` and `/tools/packing-list-generator`: the existing generator and `/api/tools/document`, preset to each kind (`initialKind`), with their own intro, a definition section, a visible FAQ, sources and the capability-aware CTA.
- `/tools/invoice-generator` retitled around "commercial invoice template", with a "what each field means" section and two answered questions (creating your own, standard format).
- CBM calculator: CBM ↔ cubic feet section and tables from the exact SI factor (`CUBIC_METRES_PER_CUBIC_FOOT`, NIST SP 811 B.9), and the calculator's ft³ figure now uses it.
- `/tools/chargeable-weight` renamed "Dimensional (volumetric) weight calculator" (URL unchanged), with the formula and only the divisors already cited.
- Incoterms: an Incoterms 2020 responsibilities chart on the hub (`INCOTERMS_CHART`, built from the rule data) and search-phrased titles, headings and leads for EXW, FCA, DAP, DDP and FOB (FOB leads with the shipping sense).
- New `/tools/landed-cost-calculator`: goods + freight + insurance + duty + taxes + other costs at user-entered rates only, duty on the goods or CIF value, exact decimal arithmetic in `src/lib/trade/landed-cost.ts` with unit tests, cost per unit, listed assumptions and a not-advice note.
- New `/guides` hub and three guides from `src/lib/content/guides.ts`: LCL vs FCL, DAP vs DDP, proforma vs commercial invoice. Team byline, last-reviewed date, sources, not-advice note, tool links, visible FAQ; Article, BreadcrumbList and FAQPage JSON-LD.
- Seven sources added to the registry (ITA ×3, 19 CFR 141.85, NIST, Maersk FCL vs LCL, WTO customs valuation), each opened on 2026-10-05.
- Wiring: `PUBLIC_TOOLS`, sitemap, llms.txt, tools hub (now read from `PUBLIC_TOOLS`), related tools, footer and a Guides nav link. The home "free tools" count is `PUBLIC_TOOLS.length`, and home links to the three generators. CONTENT.md and SEO.md updated.

### Design v2 refinement (D-013, Manifest palette kept)

- Type: Inter Tight 500/600 for headlines (display 72 → 44, line-height .94, −.025em; H2 48 → 32; H3 24 → 20) and Geist Mono 500 for eyebrows, tags, buttons and figures, replacing Archivo and JetBrains Mono; `text-wrap: balance` on headings. The home headline is nine words, so it is set in sentence case; uppercase stays for headlines of six words or fewer. PDFs embed their own font and are unchanged.
- Spacing: one section rhythm (`clamp(72px, 10vw, 140px)`), one card padding, a tighter hero so the header, headline, offer and product frame fit 1280 × 800, 16px gutters below 900px.
- Hero: the edge-on document stack is replaced by a product frame — an example record in the workspace's field boxes and a rail of the four documents, with the total quantity sharing one marker across all five.
- New "one record → four documents" section: the record pinned on the left, the documents stacking on the right as the page scrolls (a horizontal snap row on phones). The four tool cards became one ruled tool bench, each tool with one live field worked out by the same domain functions as the full tool.
- Motion: line rise inside masks, scroll-driven stacked documents and pixel dissolve (with fallbacks), marker sweep, header condense via a sentinel, an eased count-up, hero frame drift and a press scale. No motion animates text opacity or colour; reduced motion shows every final state.
- Nav: "Pricing" is now "Free while early" (there are no prices); the anchor stays `/#pricing`.
- Fixed the CI axe colour-contrast failure on `/`: the white "PL" plate in the hero took `--muted`, which the hero redefines to `--hull-muted`, giving #b6c9c3 on #fff (1.73:1). Light grounds placed on hull now restore named paper tokens (`--paper-muted`, `--paper-link`, `--paper-rule`).
- Workspace: a section caption above every page title, a sticky topbar, one page column (`.app-page`), panels with full-bleed tables, row hover and inset focus rings, an empty-state mark and a next action on every empty state, a short rise on dialogs and menus, and the press scale on buttons.

### Search readiness (D-007, indexing still closed)

- `isIndexable()` now also requires `APP_URL` on a custom domain. `X-Robots-Tag: noindex, nofollow` is sent only when the deployment is not indexable or on private paths, and a production deployment with a custom `APP_URL` 308s its vercel.app hosts to it; previews are never redirected. Both decisions are pure and unit-tested.
- Sitemap entries carry the date each page's content last changed instead of the request time.
- Explicit `noindex` on the design-system and invitation pages; app and auth layouts already had it.
- Share card (`opengraph-image`) in the Manifest palette, Open Graph and Twitter metadata on the root and on every public page.
- JSON-LD: Organization and WebSite on the home page, SoftwareApplication (free, no ratings) on the three interactive tools, BreadcrumbList on the tools hub, tool and Incoterm pages, and FAQPage only where the questions are rendered.
- `/llms.txt` generated from the same tool, Incoterms and document lists the pages use, with the boundary statement; certificate of origin excluded (D-008).
- A shared related-tools block at the end of every tool and Incoterm page. SEO.md now holds the route inventory and the go-live checklist.

### Redesign — "Manifest" (D-005)

- Replaced the navy/amber field-box look with the Manifest system: hull green, manifest paper, safety-yellow tape markers, Archivo/Inter/JetBrains Mono roles, square controls and flat offset depth. Every token is recorded with its measured contrast in DESIGN_SYSTEM.md.
- Public shell: a floating header card that carries the boundary statement as its first line, a hull footer that repeats it verbatim, and a new TradeDocs icon.
- Homepage rebuilt in the order hero (the document stack) · enter once · the consistent set · saved data · free tools · honest status · questions · closing. Primary calls to action follow `isDatabaseConfigured()`: with accounts closed they lead to the free invoice generator and drop "No card required".
- Homepage copy corrected: the "box 9 / 6 / 4 net weight" illustration is gone (the PDFs have no numbered boxes and a delivery note has no weight); the stack shows only the total quantity every document prints; only the four available document types are listed and counted, with the certificate of origin stated as awaiting legal review; the tools copy says the calculators run in the browser and the generator sends details once to render and stores nothing; team invitations are described as links. The homepage declares its canonical URL.
- Six CSS-only motions behind one IntersectionObserver hook, all inside `prefers-reduced-motion: no-preference`; no motion ever animates text opacity. The workspace adopts the tokens with a lighter touch (hull sidebar, paper canvas, no marker or entrance motion).
- The boundary-statement e2e check is scoped to the header, since the statement now also appears in the footer.

### Source implementation

- Preserved the original 33-page production specification and mapped all 25 delivery contracts.
- Established Next.js App Router, React, strict TypeScript, Tailwind and pinned toolchain configuration.
- Added living architecture, product, data, security, legal, design, analytics, SEO and operations contracts.
- Added a non-customer foundation screen, recovery routes and CI browser/accessibility test definitions.
- Added CI quality gates, dependency updates, license policy and redacted secret scanning.
- Allowed compatible npm 11 releases supplied by Vercel and added an explicit closed-foundation deployment mode; service mode retains the production configuration and approval gates.
- Added repository-owned Vercel framework, clean-install, and build settings after the production-equivalent remote build passed.
- Scoped Supabase configuration to service mode so a foundation deployment neither fails its build on, nor reads, database variables the hosting project carries for another application.
- Task 03: shipped the design system and both application shells — documented tokens with measured contrast, form/table/dialog/menu/tab/toast/state primitives, the numbered field-box grid and document status stamps, public and authenticated shells, a command palette, print styles, and a production-gated component showcase at `/design-system`.
- Task 04: identity and multi-tenant organizations — Supabase Auth flows as server-side actions, organizations with owner/admin/member roles, single-use invitations, data export, and account deletion that is queued, audited and revocable. Authorization is enforced by row policies and database routines rather than page code, proved by a pgTAP matrix and by cross-tenant browser tests.
- Trade core: shipments, reusable parties and line items, with generated documents held as immutable snapshots so an edit marks earlier documents stale rather than rewriting them.
- Documents render to PDF with an embedded, subsetted Noto Sans, so European, Greek and Cyrillic party names appear correctly instead of degrading to question marks. CJK and Arabic remain uncovered.
- Foundation deployments now report absent capabilities as missing routes instead of failing with a server error.
- Interface review against the shipped screens: the workspace keeps its navigation below the sidebar breakpoint through a topbar disclosure, destructive actions confirm and hold their confirmation open until they succeed, server-side validation lands on the field it rejects and takes focus there, and results are announced through live regions rather than appearing silently.
- Added the workspace overview and organization-wide documents pages the sidebar had been linking to.
- Superseded documents are reported as superseded rather than final, shipment status is a stamp rather than a raw column value, roles read as words, and one formatter sets every figure in a table.
- Long tables keep their column names on screen and are no longer truncated on paper; compact controls carry a 44 px hit area; every control answers a press.
- Reusable master data: a product catalog and a company directory with search, archival and a CSV import that reads an exporter's existing spreadsheet — loose heading matching, quoted descriptions, both decimal conventions, and an all-or-nothing commit that reports every bad row against the line number in the user's own file.
- A shipment is now assembled from that data. Parties are chosen from the directory, a line is added by picking a product and a quantity, and the copy happens inside the database so a catalog edit mid-form cannot leave a line holding two versions of a product. Editing a product never reaches a line already added.
- Packing is modelled as its own records: cartons with dimensions, marks and derived volume, and an allocation of goods to them. The workspace states whether the packing reconciles with the lines, per line; the packing list prints measured figures where they exist and the earlier per-line estimate where they do not.
- A shipment's current documents download as one ZIP with a manifest of SHA-256 checksums, written in-repository like the PDF writer. Stale, superseded and voided revisions are excluded from the set.
- Public acquisition surfaces: CBM and chargeable-weight calculators, an Incoterms 2020 reference with a page per rule, and a document generator that produces a real commercial invoice, proforma or packing list without an account. The calculators run in the browser and the generator stores nothing.
- Indexing follows the deployment rather than being hard-coded off: only a production service is crawlable, previews and the closed foundation build stay excluded, and the workspace and auth flows declare their own exclusion.
- Panels are named regions, so a screen carrying several similar forms can be navigated — and tested — by saying which one is meant.

### Verification status

The user requested no local runs. Builds, lint, tests, database migrations and browser inspection have not been executed locally; `src/lib/database.types.ts` was written by hand against the new migrations rather than generated, and CI's generated-types gate is what settles it. Source creation does not constitute completion of any production delivery contract. Vendor projects, real ownership, approved prices/policies, legal review, production credentials and go-live remain unresolved.

- Tenant integrity: composite foreign keys make cross-tenant references unstorable; documents freeze their provenance, only move forward in status and keep their shipment from being deleted. pgTAP covers products, packing, import, add-from-catalog and the cross-tenant cases.
- Certificates of origin are withheld, with a stated limitation, until regulated documents are approved.
- The free document generator rounds money exactly to the currency's minor unit, no longer prints the seller's country as the goods' origin, accepts an optional gross weight, and is quota-limited where a database exists; `/api/ready` reports when it is not.
- Password reset links land on a page that sets the new password. Updates that match no row report failure. Document downloads answer 503 without a database. Vercel skips Dependabot branches.
