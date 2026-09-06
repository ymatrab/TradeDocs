# TradeDocs

A commercial shipment workspace and reusable trade-document platform, built against `TradeDocs_Production_Build_Plan.pdf` (v1.0, 6 September 2026).

**Status: source implementation in progress, not validated or approved for production.** The user's instruction is **no local runs**. No local application server, database, build, test suite, or preview is run for this work. Quality gates are configured for GitHub CI; no remote repository or vendor project has been connected yet. No test, deployment, external integration, or launch approval is claimed.

## Source architecture

- Next.js App Router, React, strict TypeScript, Tailwind CSS.
- Supabase Auth, tenant-scoped Postgres, private Storage and versioned migrations.
- Vercel deployment target. Independent preview/staging/production configuration.
- Provider-neutral payment boundary; real provider and commercial terms await product approval.
- CI: formatting, lint, strict typecheck, unit/integration/E2E/axe, production build, dependency/license and secret scanning.

The complete delivery contract is in [REQUIREMENTS.md](docs/delivery/REQUIREMENTS.md). Open decisions are in [DECISIONS_REQUIRED.md](docs/delivery/DECISIONS_REQUIRED.md). [ROADMAP.md](ROADMAP.md) retains all 25 tasks; a source checkpoint is not acceptance evidence.

Vercel may deploy the current closed screen with the default `APPLICATION_MODE=foundation`. That mode cannot enable customer payment, email, or regulated-document capabilities, and it ignores every Supabase variable the hosting project may still carry for another application. Set `APPLICATION_MODE=service` only after the required environment values, tests, operational controls, and named launch approvals exist.

## Remote verification path

1. Select a private GitHub repository and assign real owners using [REPOSITORY_CONTROLS.md](docs/REPOSITORY_CONTROLS.md). Push only after authorization; no remote has been created automatically.
2. Run the `Quality gates` workflow on GitHub. It installs Node 24.19.0 and npm 11.11.1, uses `npm ci`, and retains browser and supply-chain evidence. Resolve every failing gate before promotion.
3. Use a separate non-production Supabase project or the CI-only local Supabase stack for migration/RLS checks. Never provide production secrets to pull-request jobs.
4. Configure Vercel staging from the names and purposes in `.env.example`. Validate environment ownership and isolation. Health is public and minimal; readiness must verify an actual dependency.
5. Keep production disabled until all 25 contracts, commercial/legal decisions, restore drills, monitoring and named go-live approvals have evidence.

Do not paste credentials in chat or commit `.env` files. Vendor values belong in the relevant protected environment secret store. Names and purpose only are provided in `.env.example`.

## Repository map

| Path                | Purpose                                               |
| ------------------- | ----------------------------------------------------- |
| `src/app`           | Server routes, layouts and UI                         |
| `src/components`    | Accessible shared interface                           |
| `src/lib/config`    | Typed environment validation and server-only secrets  |
| `src/lib/security`  | Privacy and abuse-prevention primitives               |
| `supabase`          | Versioned database and storage access policy          |
| `tests`             | Written verification suites, execution pending        |
| `docs/delivery`     | Acceptance matrix, evidence status and open decisions |
| `.github/workflows` | Remote quality/release gates                          |

Repository scripts exist for reproducibility, but this session does not execute them locally. Consult [TEST_PLAN.md](TEST_PLAN.md), [OPERATIONS.md](OPERATIONS.md), and [RUNBOOK.md](RUNBOOK.md) before running or deploying this system.
