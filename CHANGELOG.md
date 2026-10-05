# Changelog

## Unreleased — 2026-09-06

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
