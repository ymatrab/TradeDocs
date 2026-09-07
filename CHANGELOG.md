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

### Verification status

The user requested no local runs. Builds, lint, tests, database migrations, browser inspection and remote CI have not been executed. Source creation does not constitute completion of any production delivery contract. Vendor projects, real ownership, approved prices/policies, legal review, production credentials and go-live remain unresolved.
