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

## Identity controls (Task 04)

Credentials never reach the browser bundle: there is no client-side database client, and every
authentication call is a Server Action or Route Handler. Sign-in, magic link and password reset
return the same answer whether or not an address has an account, so none of them can be used to
enumerate accounts. Sign-out is POST only, so a foreign page cannot end a session by embedding a
link. Scheduling an account deletion requires the password again; an unattended open session is
not sufficient for a destructive request.

Only the SHA-256 digest of an invitation token is stored, and the token is returned to the
inviter exactly once. A leaked database therefore yields no usable invitation link. Acceptance
locks the row, checks expiry, revocation and prior use, and verifies the caller's own address
matches the invited one.

Authorization is not implemented in page code. Row policies and database routines decide every
outcome, so an API route, background job or console session added later inherits the same
boundary instead of needing the check re-implemented correctly.

## Public request quotas

Unauthenticated endpoints that do real work (the free document generator) take a quota per
platform-attested client address: Vercel's `x-real-ip`, never an arbitrary forwarded header;
elsewhere callers share one quota. Quotas live in the database and fail closed with a retryable
503 when the store is unreachable. A deployment without a database (the foundation deployment)
cannot enforce quotas; it runs degraded, relies on each endpoint's per-request bounds, and says
so in `/api/ready` (`rate_limiting: "degraded"` with a reason).

## Waived controls (D-017)

Production service mode requires each deferred control's keys unless its named waiver is
`true`. A waiver applies only while every key for that control is absent; any configured key
re-activates the control and then requires its full configuration. `/api/ready` lists waived
controls by name in `degraded` (no values).

- `WAIVE_TURNSTILE`: no bot challenge on anonymous flows; quotas and per-request bounds remain.
- `WAIVE_SENTRY`: no external error ingestion; errors reach platform logs only.
- `WAIVE_ANALYTICS`: no product analytics are collected.
- `WAIVE_INDEXNOW`: no IndexNow submission; search engines discover pages through the sitemap.

## Contact form, help and platform admin (D-018)

- `contact_messages` has RLS enabled, no policies and no grant to `anon` or `authenticated`
  (pgTAP `contact_messages.test.sql`). Only the server writes it, with the service role, after
  zod validation (`src/lib/contact/schema.ts`), the shared quota (`contact:message`, 5/hour per
  attested address, fails closed with 503 when the store is down) and a honeypot field. The
  table repeats the bounds as checks, including no line breaks in the name (header injection).
  Nothing a visitor types is logged; results come back in form state, never a URL.
- `/admin` is allowlisted by `PLATFORM_ADMIN_EMAILS`: exact, case-insensitive address match on
  a user verified with the auth server, confirmed address required, empty list admits nobody
  (`src/lib/admin/allowlist.ts`, unit tested). Non-admins and signed-out visitors get 404.
  Each page and server action re-checks (`adminContext`), because layouts render in parallel
  with pages. The service-role client is created only after that check. Admin views show
  counts, members and roles, never shipment, party, product or document contents or audit
  metadata. Every view and action is recorded in `audit_events` (`platform_admin.*`, actor id,
  target, time) and the view fails closed when the record cannot be written; events about one
  organization carry its `org_id`, so its owners see them.
- `/admin` is noindex (metadata and X-Robots-Tag via `PRIVATE_PATH_PREFIXES`) and is not named
  in robots.txt, the sitemap or llms.txt.
- The help panel has no third-party chat and makes no AI calls (`CHAT_PROVIDER` only accepts
  `none`). Search runs in the browser over `/api/help/faq`; queries are never sent or stored.
