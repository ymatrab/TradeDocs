# Operations and ownership

Status: operating requirements; no live infrastructure, monitoring, backup or on-call capability is claimed configured.

Proposed owner: Operations Lead; named owner, deputy and escalation contacts pending. Review for deployment/provider/region changes, SLO breaches, incidents and recovery objective changes; monthly operations review. Last reviewed: 2026-09-06.

## Service objectives

Authenticated and purchase flows target 99.9% monthly availability excluding scheduled maintenance. Define eligible requests/synthetic outcomes and measurement exclusions before launch. Error budget equals eligible service time ×0.001 (43.2 minutes for a 30-day month); an exhausted budget prioritizes reliability work and restricts risky rollout. Document maintenance notice and measurement treatment rather than silently excluding outages.

Public pages target p75 LCP ≤2.5 s, INP ≤200 ms and CLS ≤0.1. Instrument p50/p95 latency by server action/API route using safe route templates. Establish bounded job/concurrency/load budgets before bulk generation launch; avoid claiming latency objectives not yet measured.

## Ownership and telemetry to establish

| Capability | Proposed responsible role | Required signals and response |
| --- | --- | --- |
| Auth/database/tenant policy | Identity/data owner | Availability, permission anomalies, export/delete failure; restrict access on isolation incident |
| Checkout/webhooks/entitlements | Payments owner with Finance | Signature failures, lag, mismatch, refunds/disputes; reconcile daily |
| PDF/sets/storage | Document/platform owner | Per-type failures, queue age, partial sets, object growth/hash failure; scoped retry |
| Email | Messaging owner | Delivery failures, suppression, complaint/bounce rates; pause eligible sends |
| Abuse | Security owner | Rate-limit/Turnstile anomalies, malicious uploads; tuned restriction and recovery |
| SEO/analytics/regulatory | Editorial/analytics/legal owners | Crawl failures, event reconciliation, stale sources; reviewed correction |

Each alert needs a concrete threshold, window, severity, named responder/deputy, escalation and runbook before activation. Thresholds depend on staging/load evidence; they are unresolved launch decisions. Associate Sentry releases with commit IDs and redact all logs/breadcrumbs. Health/readiness endpoints reveal no secrets. Configure synthetic shipment → set → purchase → PDF → email → history checks with controlled recipients/accounts.

## Recovery and deployment

Require daily automated backups, tested point-in-time recovery where the selected plan permits, versioned storage retention and quarterly restore drills. Product/operations must approve per-service RPO/RTO using actual plan capabilities and restore evidence: Postgres, Auth/configuration, Storage, payments reconciliation and queued jobs all need explicit treatment. No backup schedule is considered active until verified. Preserve original renderer/schema/template versions for historical regeneration.

GitHub CI must install the lockfile and gate format, lint, typecheck, tests, build, migration validation, targeted E2E and scans. Separate vendor projects and credentials by environment; previews use synthetic data and sandbox recipients. Promotion needs the approved release checklist, backup confirmation, migration and rollback plan, monitoring and post-deploy smoke. A failing gate cannot promote; destructive migrations require explicit rollout/rollback notes and backup. Credentials, legal/regulatory sign-off and go-live are named human decisions.

## Operating cadence

Daily review uptime/errors/jobs/reconciliation/delivery/abuse/support. Weekly review funnels/search/returning use/document adoption. Monthly review authoritative sources, access, backup evidence, dependencies, content decay and KPI priorities. Quarterly restore drill, incident tabletop, threat model, accessibility and vendor/subprocessor review. Save dated evidence and owners; a calendar intention is not proof the review happened. [RUNBOOK.md](RUNBOOK.md) defines response procedures and [TEST_PLAN.md](TEST_PLAN.md) release evidence.
