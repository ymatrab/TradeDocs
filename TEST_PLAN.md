# Verification and evidence

Status: required verification contract. Executed commands/results belong in the task reports; this document does not assert passing tests. The user has instructed “no local runs.” Do not execute the app, database, build or tests locally. Configure and execute validation only in authorized CI/cloud environments; all unexecuted checks remain explicitly pending.

Proposed owner: Engineering/QA Lead; named assignment pending. Review before/after each delivery task, after regression/incident, when test scope or release gates change, and before launch. Last reviewed: 2026-09-06.

## Definition of done for every task

Restate the PDF's acceptance criteria and map each to concrete evidence in `docs/delivery/task-NN.md`. Record implementation paths, exact commands and outcomes, timestamps/environment, UI/PDF inspection, screenshots/fixtures, migrations/rollback, security/privacy/accessibility/regulatory review, updated documents and one focused conventional commit. Preserve pre-existing user changes. Test locations are `tests/unit`, `tests/integration` and `tests/e2e`; application/configuration code lives under `src/app` and `src/lib/config`.

Required gates in authorized CI/cloud environments: formatting, lint, strict TypeScript typecheck, unit tests, affected integration tests, relevant Playwright E2E, accessibility checks and production build with zero unexplained warnings. E2E covers the happy path, validation failure, authorization failure, retry/reload and mobile viewport for affected flows. Every new data path requires tenant-isolation evidence. A truly absent capability may be documented as not applicable with a specific reason; this is not permission to omit required coverage for implemented behavior. Unrun/failing checks leave the task incomplete. Flaky tests require a documented owner and expiry before quarantine; quarantine cannot conceal a release-blocking failure. Configuring CI without a completed remote run is not passing evidence.

## Coverage by risk

| Area | Required meaningful tests |
| --- | --- |
| Foundation/configuration | Clean setup/build/lint/typecheck/smoke, tracked/history secret scan, invalid env fails fast; configuration matrix and server-only boundaries |
| Identity/data | Anonymous/member/admin/owner/service matrix; two tenants; invitation replay/session fixation; last owner; lifecycle jobs; all exposed relations/functions/storage |
| Security | IDOR/BOLA, concurrency limits, malicious uploads, SSRF/encoding, CSRF posture, headers, log/Sentry redaction |
| Billing/email | Provider sandbox contracts; invalid/signed/replayed/out-of-order webhook events; currency rounding; refund/dispute/reconciliation; duplicate checkout/mail; suppression/expiry |
| Analytics/SEO | Payload PII checks; consent denied/granted; purchase dedupe; route crawl; canonical/robots/schema/sitemap; private-route exclusion |
| Master data/shipments | CSV encodings/invalid rows/atomic rollback; merge/archive; multilingual inputs; concurrent edit; clone identity; dependency/stale graph |
| Schemas/calculations | Required-field matrices; override provenance; immutable revisions; decimal/property/unit tests; conversion lineage; package allocation totals |
| PDFs/sets | Every type at 1/3/10 pages; 100-line stress; Unicode/logos; original-version regeneration; hashes/manifests; ZIP traversal/collision; partial retry/quota |
| Official-status controls | Persistent UI/PDF/email legal labels; unsupported-jurisdiction blocks; endorsement evidence/audit; flag-disable/source-change drills |
| Admin/release | Server-side role/mask/reveal controls; reason/audit; idempotent retries; CI intentional failure; migration compatibility; preview isolation; rollback/restore/load |

## Human-visible inspection

Inspect actual affected UI at mobile/tablet/desktop, keyboard navigation and errors/long content; automate axe and maintain reviewed screenshots. For PDFs render every document type and inspect all stress-fixture pages for clipping, overlapping, legal labels, totals and page flow. Baseline updates need review of actual changed output; successful compilation is insufficient. Use synthetic data only.

## Final release evidence

Task 25 rehearses a paid coherent set with secure PDF/email/history and returning-customer reuse. Evidence must include restored data/artifacts, rollback and forward-fix, incident/support tabletop, bulk load, production smoke and synthetic monitoring, GA4/billing reconciliation and Search Console/IndexNow readiness. Require no P0/P1, cross-tenant leak or unresolved official-document ambiguity. Link named approvals, operational ownership matrix and unresolved-risk register. Never label the project production-ready while any required gate is pending.
