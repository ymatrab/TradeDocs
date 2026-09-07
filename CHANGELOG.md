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

### Verification status

The user requested no local runs. Builds, lint, tests, database migrations, browser inspection and remote CI have not been executed. Source creation does not constitute completion of any production delivery contract. Vendor projects, real ownership, approved prices/policies, legal review, production credentials and go-live remain unresolved.
