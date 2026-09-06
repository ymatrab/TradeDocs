# Task 02 — Architecture, environments and configuration

Status: source authored; remote verification pending. Proposed owner: Engineering Lead, named appointment pending.

| Acceptance criterion                              | Implementation and evidence                                                                                                                                                         |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| All required services and trust boundaries mapped | ARCHITECTURE.md diagrams, classified store inventory in DATABASE.md; integration execution pending                                                                                  |
| Preview cannot access production data/credentials | Explicit APP_ENV, VERCEL_ENV, Supabase environment/project identity checks; non-production rejects production project reference; protected remote secret-store verification pending |
| Misconfiguration fails clearly at build/startup   | Pure Zod environment schema in next.config and instrumentation; server-only configuration reads; field-name-only errors; written matrix tests, unexecuted                           |
| Vendor outage behavior documented                 | Architecture failure table; health is liveness only; readiness probes actual Supabase Auth health with bounded timeout and returns503 when absent/failing                           |

Per-request CSP nonce is applied to both request and response, with dynamic rendering. Deployed startup requires explicit configuration; production is closed without launch approval. Boolean environment flags are operational enforcement, not a substitute for signed human evidence in the decision registry.

No vendor account has been created, no secret has been populated, and no deployed service behavior has been verified. The readiness probe currently covers the Auth dependency only, not the future complete payment/PDF/mail service. All required tests/build/browser review are **not executed**, following the user's no-local-runs constraint. No task acceptance or production readiness is claimed.

Rollback: revert source checkpoint; no deployment or migration was applied.
