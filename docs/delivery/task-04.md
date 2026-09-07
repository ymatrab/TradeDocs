# Task 04 — Identity, organizations and lifecycle

Source: `TradeDocs_Production_Build_Plan.pdf` page 10. Dependencies: Tasks 01–03.
Execution constraint: **no local runs**; every gate below runs in GitHub Actions against a
disposable Supabase stack started inside the runner.

## Acceptance criteria → implementation → evidence

- **A user can complete all identity recovery and organization flows.** Sign-up, sign-in,
  magic link, password reset and the shared email callback are Server Actions and Route
  Handlers under `src/app/(auth)`; organization creation, invitation, role change and
  leave/remove are under `src/app/(app)`. Proved by `tests/e2e/identity.spec.ts` driving a
  real browser against a real database.
- **User A cannot enumerate, read or write User B or Organization B data.** Enforced by row
  policies in `supabase/migrations/20260907000200_identity_access.sql`, not by page code.
  Proved twice: at the database by `supabase/tests/identity_rls.test.sql`, and through the
  interface by the cross-tenant case, which signs up a second real account, requests the
  first tenant's URL and asserts the organization's name appears zero times on the response.
- **The last owner cannot accidentally orphan an organization.** A trigger refuses the
  removal or demotion of the final owner, so no caller can bypass it by reaching the table
  another way. Proved at both layers.
- **Export and deletion produce logged, privacy-safe outcomes.** `export_account_data`
  returns only the caller's own profile and memberships; deletion is queued with a 30-day
  grace period and can be withdrawn. Both write an audit event.

## Required tests

- Format, lint, strict typecheck, unit, integration and production build: `quality` job.
- Playwright happy path, validation failure, authorization failure, retry/reload and mobile
  viewport: `tests/e2e/identity.spec.ts`, run in the `database` job against the service build.
- Accessibility on affected pages: axe over the authenticated screens at a 360 px viewport.
- Tenant isolation for every new data path: the pgTAP matrix covers anonymous, member, admin
  and owner against organizations, memberships, profiles, invitations and audit events.
- Invitation replay: proved at both layers. Session handling: the signed-out redirect and the
  reload case cover it; sign-out is POST-only so it cannot be triggered by a foreign page.

## Design decisions worth recording

- **Authorization lives in the database.** Page code never decides who may read a row. A
  policy or a routine's own role check decides, so a future API route, job or console session
  inherits the same boundary.
- **Membership checks run through security-definer helpers.** A policy on `memberships` that
  queried `memberships` would recurse; the helper reads it once with RLS bypassed and the
  policy consumes the boolean.
- **Multi-row operations are routines, not client writes.** No table accepts a direct insert.
  Creating an organization also creates its first owner, and accepting an invitation also
  consumes it, each in one transaction, so neither can half-apply.
- **Only the digest of an invitation token is stored.** A database leak yields no usable
  invitation link. The token is returned to the inviter exactly once.
- **The anonymous role holds no grant on any tenant table.** PostgreSQL refuses the table
  before row policies are consulted. The pgTAP suite asserts this rather than an empty result.
- **Identical answers for absent and wrong credentials.** Sign-in, magic link and password
  reset never reveal whether an address has an account.

## Not implemented in this task

- **The purge worker does not exist.** Deletion is queued, audited and revocable, and the
  grace period is recorded, but nothing yet destroys or anonymizes data when it expires. That
  needs a scheduled job and a retention decision, and it is not safe to imply it runs.
- **Invitation delivery is manual.** The interface shows the single-use link once and says so
  plainly; automatic delivery arrives with transactional email in Task 07.
- **Email confirmation is disabled in the CI configuration only.** `supabase/config.toml`
  records this as local-and-CI behaviour. A deployed environment must require confirmation;
  that is a hosted-project setting and a Task 25 launch check.
- **Rate limiting is not yet applied to the credential endpoints.** The fail-closed limiter
  from Task 02 still has no database routine behind it; abuse prevention is Task 05.

Until Task 05 and Task 07 land, this task's code must not be promoted past a non-production
environment, and `APPLICATION_MODE` stays `foundation` on the deployed project.
