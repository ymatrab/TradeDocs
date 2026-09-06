# TradeDocs execution contract

Source: `TradeDocs_Production_Build_Plan.pdf`, v1.0, 6 September 2026. Build the full commercial production product across Tasks 01–25. Do not reinterpret it as an MVP, prototype, demo or single-page generator.

Proposed owner: Engineering Lead; named assignment pending. Review whenever the specification, execution gates or repository policies change and before every task. Last reviewed: 2026-09-06.

## Before work

- Current explicit user instruction: **“no local runs.”** Do not start/run the application, databases, containers, builds or tests locally. Source/configuration/document editing is authorized; use authorized CI/cloud environments for execution and verification. Do not represent configured-but-unrun checks as passing. This session instruction overrides any local execution steps in the PDF or other documents; it does not waive required verification evidence.
- Inspect repository state and existing changes; preserve user work. Read the specification's Master Instructions, active task and dependency tasks, this file and affected living documents.
- Use the required Next.js App Router/strict TypeScript/Tailwind, Supabase and Vercel architecture. Record stack/tool compatibility under [DECISIONS.md](DECISIONS.md); do not silently substitute a different stack.
- Execute numbered tasks in order unless a documented dependency graph proves independent parallelism. Regulatory prerequisites follow D-002; no early work may bypass named approval or mark Task 24 complete.
- Task 01 establishes the foundation and delivery contract; do not build feature pages under that task.

## Per-task workflow

1. Restate every acceptance criterion and create a one-to-one implementation/evidence checklist in `docs/delivery/task-NN.md`.
2. Implement the smallest complete production slice within that task, including loading/success/empty/recoverable error states.
3. Update meaningful tests and configure/run format, lint, strict typecheck, unit, affected integration, relevant Playwright, accessibility and production build in authorized CI/cloud environments only while the no-local-runs instruction applies. E2E covers happy path, validation/authorization failures, retry/reload and mobile. Prove tenant isolation for every new data path. PDF/visual work requires rendered inspection and regression fixtures. Unavailable remote execution leaves gates pending.
4. Inspect real UI/output; document security/privacy/accessibility/regulatory impact, migration and rollback, monitoring, evidence and remaining risks. Do not claim completion while required tests are unrun/failing. Explain true non-applicability; never disguise skipped implemented behavior.
5. Update living documents and CHANGELOG, then create one focused conventional commit. Link its evidence and leave the repository clean except pre-existing user changes. Workflow changes get their own focused commit where Task 10 requires it.

Maintain PRODUCT, ROADMAP, ARCHITECTURE, DATABASE, SECURITY, LEGAL, SEO, ANALYTICS, DESIGN_SYSTEM, OPERATIONS, TEST_PLAN, RUNBOOK, DECISIONS, CHANGELOG and this file. Assign actual owner names when provided; proposed roles do not constitute approvals.

## Non-negotiable correctness

- Never weaken RLS, auth, webhook verification, rate limits, audit, validation or privacy to make tests pass. Cross-tenant failures stop release. All exposed Supabase tables/views/functions/storage paths require explicit access decisions and RLS tests.
- Use migrations, synthetic seeds and generated database types. Keep deterministic arithmetic/schemas in domain modules. Finalized outputs are immutable and reproducible from snapshot/schema/template/renderer versions; correction creates lineage.
- Keep service-role/payment/Resend/Turnstile/Sentry secrets server-only and out of browser/repository. Do not place private trade data in logs, analytics or breadcrumbs. Use private storage, bounded uploads and short-lived authorized links.
- Authenticate external callbacks/jobs where applicable; make them idempotent, bounded, observable, replay-protected and retry-safe. Only verified server-side payment facts grant entitlements.
- Use official primary sources for regulated/platform claims and record authority/URL/jurisdiction/effective and retrieval dates/reviewer/affected versions. If certainty or approval is missing, disable the affected claim/calculation via feature flag and show a clear limitation.
- Do not invent credentials, official identifiers, tax rules, prices, provider behavior, legal text or endorsement. Never imply authority/carrier issuance or legal compliance. Preserve mandatory preparation/draft labels across UI/PDF/email.
- Production credentials, legal/regulatory sign-off and go-live require named human approval evidence. Complete authorized implementation and review artifacts first; do not self-approve or treat a pending decision as approval.

## Release and maintenance

Promotion requires passing gates, approved checklist, backup confirmation, migration/rollback compatibility, monitoring and post-deploy smoke. Do not run destructive migrations without backup and explicit rollout/rollback notes. Preview must never use production data/credentials or email actual customers. Keep requirements, evidence and unresolved risks truthful; no task or deployment is complete merely because code compiles.
