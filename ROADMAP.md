# Delivery roadmap

Status: all contracts remain required. Task 01 is in progress; Tasks 02–25 are planned and have not passed their acceptance gates. No estimated schedule replaces evidence. The user has instructed “no local runs”: app, database, build and test execution must use authorized CI/cloud environments. Required verification remains pending until remote evidence exists.

Proposed owner: Engineering Lead with Product Lead; named assignments pending. Review before starting/closing each task, when dependencies change, and for every release. Last reviewed: 2026-09-06.

## Ordered delivery contracts

Each row inherits the PDF's full scope, four acceptance criteria and required tests. The final column identifies evidence beyond the common checks; it does not reduce the contract.

| ID | Delivery contract | Dependencies from specification | Distinct completion evidence |
| --- | --- | --- | --- |
| 01 | Repository foundation and decision records | None | Reproducible setup; owned living docs; clean build/lint/typecheck/smoke; secret/history scan |
| 02 | Architecture, environments and configuration | 01 | Service/trust map; preview isolation; configuration matrix; outage behavior |
| 03 | Design system and application shell | 01–02 | Mobile/tablet/desktop component states; keyboard/axe; stable layout; tokens |
| 04 | Identity, organizations and lifecycle | 01–03 | Auth/recovery; complete RLS role matrix; last-owner protection; export/delete jobs |
| 05 | Security, abuse prevention and auditability | 02, 04 | Threat model; distributed quota concurrency; audit/redaction; staging headers |
| 06 | Billing, payment links and entitlements | 02, 04–05 | Signed/replayed/out-of-order webhook fixtures; paid-route checks; refunds; reconciliation |
| 07 | Transactional email and notification controls | 04–06 | HTML/text snapshots; deduplicated sends; suppression; expiring tenant-safe links |
| 08 | Analytics, consent and funnel measurement | 02, 04, 06 | Event dictionary; consent denied/granted; payment reconciliation; funnel queries |
| 09 | SEO platform and indexation controls | 01–03, 08 | Route crawl; canonical/sitemap/schema; private exclusion; Search Console/IndexNow checklist |
| 10 | CI/CD, release safety and supply chain | 01–09 | Protected preview/promotion; intentional-failure gate; rollback; smoke; dependency inventory |
| 11 | TradeDocs domain model and database | 01–05 | Field dictionary; immutable snapshots; concurrent numbering; constraints/RLS/pagination |
| 12 | Reusable company, customer and product workspace | 11, identity/security | Reuse; atomic CSV validation/rollback; merge impact; archival history |
| 13 | Shipment workspace and document dependency graph | 11–12 | Shared field dependency registry; stale reasons; independent clone; edit conflict handling |
| 14 | Trade document rules and canonical schemas | 11–13, regulatory contract | All document schema fixtures; field provenance; finalization rejection; legal/version rules |
| 15 | Commercial and sales document workflows | 13–14 | Decimal/rounding properties; conversion lineage; 100-line stress; supersede/void |
| 16 | Packing, delivery and shipping-style workflows | 13–14 | Package allocations; unit reconciliation; legal label persistence; signature audit |
| 17 | Certificate of Origin preparation workflow | 12–14, regulatory registry | Unambiguous labels; endorsement evidence/audit; unsupported-country blocks; external next step |
| 18 | Trade PDF engine, templates and branding | 14–17, 06–07 | All types at 1/3/10 pages; visual inspection; original-version regeneration; hashes; access tests |
| 19 | Document sets, bulk operations and exports | 18, 05–07 | One shipment revision; exact ZIP/manifest/hashes; partial retry; quota/concurrency/expiry |
| 20 | TradeDocs dashboard, history and collaboration | 11–19, 04 | Returning-customer journey; related records isolation; server/UI RBAC; responsive states |
| 21 | Trade calculators, free generators and acquisition | 05, 08–09, document/calculation tasks | Formula/unit properties; anonymous expiry/quotas; single-use claim; private-data-free events |
| 22 | TradeDocs SEO and editorial system | 08–09, 21, regulatory contract | Unique useful pages; full crawl; review/source metadata; intent-segmented funnels |
| 23 | TradeDocs admin, support and operational controls | Prior Trade tasks, 05–06 | Scoped support; privileged audits; API restrictions; idempotent retries/refund reconciliation |
| 24 | Trade regulatory, terminology and source registry | 14–17, 23, 10 | Approved claims; UI/PDF/email labels; impact mapping; source-change/disable drill and review evidence |
| 25 | TradeDocs launch, monitoring and post-launch optimization | 01–24 | Signed rehearsal/launch report; paid set journey; restore/rollback; reconciled metrics; no P0/P1 |

## Dependency cycle handling

Tasks 14/17/22 need regulatory prerequisites, while Task 24 depends on 14–17 and admin tooling. Prepare the registry schema, approval status, impact mapping and default-off feature contract before Task 14. Complete Task 24's operational controls and drills after Task 23. A partial registry does not mark Task 24 complete, and high-risk production workflows remain disabled until the relevant named human review is recorded. See [DECISIONS.md](DECISIONS.md), D-002. Default to task order; parallelize only demonstrably independent work with recorded dependencies.

## Per-task evidence contract

Use `docs/delivery/task-NN.md` to restate every acceptance criterion verbatim and map it one-to-one to implementation, test command/output, actual UI/PDF inspection, migration/rollback notes and remaining risks. Link updated living documents and the focused conventional commit. Every task requires formatting, lint, strict typecheck, unit/integration, relevant Playwright, accessibility and a production build in an authorized CI/cloud environment under the current no-local-runs instruction. Explain genuinely inapplicable paths with evidence; do not call unimplemented features tested. A failing/unrun required gate leaves the task incomplete. An unapproved human gate is recorded as pending, never self-approved.

## Release and operating loop

Task 25 additionally requires approved pricing/refunds/support, production credentials, legal/regulatory sign-off and go-live authorization; deployment readiness is not authorization. Daily monitor availability/jobs/billing/mail/abuse; weekly review acquisition and repeat use; monthly review sources/access/backups/dependencies/content; quarterly drill restore/incidents and review threat model, accessibility and subprocessors. Prioritize security, payment integrity, data loss and regulatory correctness ahead of growth experiments.
