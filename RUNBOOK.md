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
