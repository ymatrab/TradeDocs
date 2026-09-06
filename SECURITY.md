# Security contract

Status: threat model and required controls; implementation and staging verification remain task evidence. This is not a security certification.

Proposed owner: Security Lead; named assignment and reporting contact pending. Review for new trust boundary/provider, schema/RLS change, authentication/payment/upload/admin work, incident or critical dependency advisory; quarterly full review. Last reviewed: 2026-09-06.

## Assets, actors and threats

Protect tenant trade data and attachments, finalized document integrity, account sessions, entitlements/revenue, signing/provider secrets and audit evidence. Threat actors include unauthenticated bots, malicious tenant members, compromised accounts, abusive administrators and forged/replayed provider callbacks.

| Threat                                        | Required mitigation and proof                                                                                                          |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Cross-tenant access / guessed object IDs      | Server authorization plus RLS on tables/views/functions/storage; two-tenant role/action matrix                                         |
| Account takeover / invitation replay          | Supabase Auth; verified identity; sensitive-action reauthentication; expiring single-use invitations; session/recovery tests           |
| Fraudulent or repeated payment events         | Original-body signature/timestamp checks; durable unique event ledger; transactional entitlement changes; replay/out-of-order fixtures |
| Render/upload abuse, SSRF or active content   | Bounded inputs/jobs; MIME and content inspection; private storage; safe font/image fetching and SSRF controls; malicious fixtures      |
| Resource exhaustion                           | Distributed IP/account/device-aware quotas, bounded queues and Turnstile on risky anonymous flows; concurrent bypass tests             |
| CSRF/XSS and clickjacking                     | Explicit CSRF posture, schema validation, output encoding, secure headers/CSP; browser/header tests                                    |
| Data disclosure through observability or URLs | Safe metadata allowlists; short-lived signed links; no PII/document contents in telemetry; redaction/expiry tests                      |
| Privileged misuse                             | Scoped roles, reauthentication, masking, reason codes, audit and break-glass review; no silent impersonation                           |
| Artifact tampering / inconsistent sets        | Immutable snapshots, versioned renderers, hashes/manifests and exact membership verification                                           |
| Supply-chain compromise                       | Lockfile install, pinned runtime/manager, dependency/license review, secret/history scanning and CI evidence                           |

## Non-negotiable boundaries

Service-role keys, payment/webhook secrets, Resend keys, Turnstile secrets and Sentry auth tokens are server-only and never committed. `.env.example` contains configuration names/purposes without credentials. Preview never receives production secrets/data and never emails real customers. Paid routes check entitlement on the server; a successful payment redirect grants nothing. All callbacks/jobs authenticate where applicable and are idempotent, observable, bounded and replay-safe.

Every audit event includes actor, tenant, action, target, timestamp, correlation ID and safe metadata. Cover authentication, writes, generation/finalization/voiding, downloads/email, payment changes, admin actions, endorsement transitions and regulatory edits. Do not persist sensitive contents to explain an event. Define audit retention and privileged read access before launch.

## Release and incident rules

Any cross-tenant access, exploitable secret, payment integrity failure or misleading official-document behavior blocks release. Never weaken authentication, RLS, verification, limits, validation, audit or privacy to pass a test. On discovery, preserve redacted evidence, restrict the affected capability, assign an incident owner and use [RUNBOOK.md](RUNBOOK.md). Named human security/privacy/legal reviewers determine notification obligations; no deadline or legal advice is invented here. Security reporting contact and escalation roster must be approved and published before launch.
