# Changelog

## Unreleased — 2026-09-06

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
