# Task 01 — Repository foundation and decision records

Status: source authored; acceptance pending remote verification. Owner: engineering role proposed, named owner pending. Source: PDF page 7. Session constraint: no local runs.

| Acceptance criterion                                  | Source implementation                                                                                                 | Required evidence / current status                    |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Fresh setup reproduces from documented steps          | README, pinned runtimes/package manager, lockfile, Next/TS/Tailwind config                                            | Clean CI install/build not executed                   |
| Required living documents have owners/review triggers | Root product/architecture/security/legal/SEO/analytics/operations/test/design/data/runbook contracts and ADR template | Files authored; named operational assignments pending |
| Build/lint/typecheck/smoke pass in a clean checkout   | Quality gates workflow; Playwright foundation/reload/missing route/axe/mobile cases                                   | All execution pending; no pass claimed                |
| No credential or copied competitor asset              | Original CSS/icons; names-only `.env.example`; gitignore; secret checks and full-history Gitleaks CI                  | Scan execution pending; original PDF preserved        |

## Scope and impact

Task 01 includes only repository/delivery foundation and a non-customer entry screen; feature slices belong to later reports. No tenant data or payment path is available from the foundation. Authorization/tenant tests for new data paths are assigned to the corresponding implementation tasks, not fabricated for the static screen. Environment validation and health/readiness have their own Task 02 report.

Supply-chain controls, action pinning, secret scans, license review, branch protection and named CODEOWNERS require the remote repository to be connected and checked. Release promotion is not automated by the source foundation.

## Evidence and rollback

- Unit/integration/E2E/accessibility/build/format/lint/typecheck: **not executed — user requested no local runs**.
- Visual screenshots: **not captured — no local preview**.
- GitHub run URL: **unavailable — remote repository not configured**.
- Migration: no Task 01 migration.
- Rollback: source commit revert, no deployed data to restore.
- Commit: source checkpoint hash can be resolved with `git log`; no acceptance/release tag is assigned.

Completion is withheld until relevant remote checks and required human repository controls are evidenced.
