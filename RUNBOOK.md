# Operational runbook

Status: procedures to configure and rehearse; no live incident channel, credentials or provider account is assumed.

Proposed owner: Operations Lead; named primary/deputy and security/finance/legal contacts pending. Review after an incident/drill, provider or deployment change, alert change, and quarterly. Last reviewed: 2026-09-06.

## Common incident procedure

1. Appoint an incident commander; record UTC timeline, affected environment, release/commit, safe correlation IDs and customer impact. Use metadata instead of copying document contents.
2. Assess P0 (active cross-tenant disclosure, severe compromise or broad integrity loss), P1 (critical auth/purchase/generation failure or material integrity risk), or lower severity by impact. Notify the assigned on-call/security/finance/legal roles as relevant; contacts must exist before launch.
3. Preserve audit evidence, job/payment state and redacted logs. Restrict the affected feature, credential or deployment with a recorded reason. Never weaken authorization or verification to restore service.
4. Apply the documented rollback or forward fix with migration compatibility checked. Reconcile queued/external side effects before replay.
5. Verify the relevant synthetic/user journey, metrics and tenant boundaries. Named humans assess required customer/regulatory notices. Record resolution, remaining risks, owners and follow-up dates; update tests and runbooks.

## Tenant isolation or credential incident

Restrict affected access immediately, preserve immutable evidence and identify tenant/object scope through audited metadata. Rotate compromised credentials in the correct vendor/environment and invalidate affected sessions/links where supported. Prove isolation with the complete role/data-path matrix before restoring. Do not erase evidence or assume rotating one key revokes every derived token.

## Payment mismatch / webhook backlog

Inspect provider event identity/signature status, order snapshot and ledger state using authorized tooling. Keep access pending unless verified payment facts justify it. Reconcile provider truth, payments and entitlements transactionally. Replay only authenticated persisted events through the idempotent handler; do not edit customer entitlement rows manually or issue a second charge to diagnose. Finance approves refund/dispute policy actions and confirms post-replay revenue/event deduplication.

## PDF/set/storage incident

Inspect tenant-scoped job attempts, schema/template/renderer versions and per-artifact status. Preserve existing final objects. Retry failed work with stable idempotency keys and bounded concurrency. Verify every selected output hash and manifest member before marking the set complete. Check storage access and signed-link expiry without making buckets public. A misleading legal label requires feature disable and legal review, not silent regeneration of historical purchased artifacts.

## Email or regulatory incident

For delivery incidents inspect template/event IDs, provider webhook verification and suppression state; use sandbox recipients for diagnostics, respect complaints/bounces and never resend blindly. For source/claim incidents disable the affected feature, identify versions/pages/documents from the registry, assign qualified review and preserve prior artifact provenance. Alerts never approve new legal behavior automatically.

## Release / rollback procedure

Verify clean required gates, focused release commit/tag, named approvals, separate environment configuration, current backup and tested migration compatibility. Deploy the approved artifact, apply migrations per reviewed plan, associate telemetry release and run smoke: auth, tenant isolation, generation, sandbox/probe checkout, delivery and history. Roll back the application only if schema/data remain compatible; otherwise follow the tested forward-fix path. Monitor errors, queues and payment mismatch before closing the release.

## Restore drill

Restore approved backup into an isolated environment; disable customer email, live payment actions, analytics and indexing. Restore/check schema, tenant records, private objects, versions/hashes and queued side effects. Verify counts/constraints/RLS, historical PDF regeneration and a full synthetic journey. Reconcile external payment facts before resuming jobs. Measure actual recovery point/time against approved per-service RPO/RTO and record gaps, owners and dates. Delete the drill environment according to its approved retention policy. Run quarterly and before launch; backup existence alone is insufficient.

## Production go-live (service mode)

Order matters; each step is the owner's unless marked agent.

1. Merge the release to `main` after CI and preview sign-off.
2. GitHub → Settings → Environments → `production` → add secret `PRODUCTION_DATABASE_URL`
   (Supabase session-pooler URI). Agents never handle the value.
3. Actions → "Migrate production database" → confirm `migrate production`, first with
   dry run on (lists pending migrations), then with dry run off.
4. Vercel → Production environment variables (Production target only, D-011):
   `APP_ENV=production`, `APPLICATION_MODE=service`, `APP_URL=https://<custom domain>`,
   `SUPABASE_PROJECT_REF` and `PRODUCTION_SUPABASE_PROJECT_REF` (the project ref from the
   Supabase URL), `SUPABASE_ENVIRONMENT=production`, `RATE_LIMIT_KEY_SECRET` (32+ random
   characters), `LAUNCH_APPROVED=true` only after the launch checklist is signed.
   The schema (`src/lib/config/schema.ts`) also refuses production service mode without
   `RESEND_API_KEY` and `EMAIL_FROM` (always required), and without `TURNSTILE_SITE_KEY` +
   `TURNSTILE_SECRET_KEY`, `SENTRY_DSN`, `ANALYTICS_SITE_ID` and `INDEXNOW_KEY` unless the
   matching waiver is set. Per D-017 (sign-up launch), set `WAIVE_TURNSTILE=true`,
   `WAIVE_SENTRY=true`, `WAIVE_ANALYTICS=true` and `WAIVE_INDEXNOW=true`. Adding a service's
   key later re-enables it whatever its waiver says; remove the waiver at the same time.
   `/api/ready` lists the waived controls under `degraded`. `SUPABASE_URL`,
   `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` already come from the Vercel Supabase
   integration (D-011).
   Supabase → Authentication → SMTP Settings → enable custom SMTP with Resend: host
   `smtp.resend.com`, port `465`, username `resend`, password = the Resend API key, sender =
   the `EMAIL_FROM` address. Without it, sign-up confirmation emails hit Supabase's built-in
   email rate limit. The owner sets this in the Supabase dashboard; agents never handle the
   key.
5. Redeploy production. Agent: verify `/api/ready` is 200, sign-up works end to end,
   `/design-system` is 404, robots and sitemap match the indexing decision (D-007).
