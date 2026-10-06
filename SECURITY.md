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

## Accounts and access under real conditions (D-020)

- **Passwords.** 12 characters minimum, 72 bytes maximum (bcrypt's limit in Supabase Auth);
  no composition rules. New passwords (sign-up, reset, change) are checked against Have I
  Been Pwned's k-anonymity range API: only the first 5 hex characters of the SHA-1 leave the
  server. The check fails open (skipped) when HIBP cannot be reached within 1.5 s; length is
  the primary control and never skips. Sign-in validates only that a password was typed.
- **No account enumeration.** Sign-in failures share one message; sign-up for an existing
  address gets the same "check your inbox" screen as a new one; magic link, reset and resend
  answer identically for unknown addresses; email change to a taken address answers as if
  sent. Supabase reports "email not confirmed" and "banned" only after the password matched,
  so those two messages disclose nothing the caller has not proved.
- **Quotas on every account action** (`src/lib/security/auth-limits.ts`), per attested
  address and per account/address acted on, HMAC-hashed in the store: sign-in 30/15 min per
  address and 10/15 min per account; sign-up 10/h per address; email-sending actions 10/15 min
  per address and 3/15 min per account plus a 60 s resend cooldown; password/email/name
  changes and deletion confirmations 10/h per account; invitations 30/h per inviter.
  Degraded (no store) on local/CI only; production service mode requires the store.
- **Turnstile** (`src/lib/security/turnstile.ts`) verifies server-side via siteverify on
  sign-up, on sign-in once 3 failures per account or 10 per address are counted in 15 min,
  on the contact form and on the free document generator. Active whenever either key exists;
  skipped only under `WAIVE_TURNSTILE` with both keys absent. Once active it fails closed:
  missing secret, missing/forged/replayed token, wrong action, or Cloudflare unreachable all
  refuse. Where failures cannot be counted, sign-in requires the challenge every time.
- **Re-authentication.** Changing the email address or password, and scheduling deletion,
  require the current password. A password change or reset ends every other session.
- **Email links.** `/auth/confirm` verifies token-hash links server-side (any device);
  `/auth/callback` exchanges PKCE codes (same browser). Both are single use; a reused or
  expired link lands on the screen that issues a new one. Post-sign-in redirects pass
  `safeNextPath`: same-origin and only `/app`, `/admin`, `/invitations/accept`,
  `/reset-password/new`. No email address is ever placed in a URL.
- **Sign-out** is POST-only and refuses a cross-site Origin; "sign out everywhere" revokes
  every refresh token (Supabase global scope).
- **Organizations.** Role changes, removals, renames, invitation revoke/reissue run through
  audited security-definer routines. Owners change roles and remove anyone; administrators
  remove plain members only (policy `memberships_delete_scoped`); anyone may leave; the
  last-owner trigger refuses orphaning a live organization. One live invitation per address;
  reissue rotates the token (the old link dies); revoked, used or expired tokens are refused.
- **Platform admin users.** Search is a POST whose query never enters a URL or the audit
  record (count only); `admin_search_users` (service role only) needs 3+ characters and
  returns at most 50 rows. Disable sign-in = Supabase ban plus `admin_revoke_sessions`;
  admins cannot disable or delete their own account. Every view and action is audited.
- **Purge.** `purge_due_accounts` and `/api/internal/purge-accounts` (bearer `CRON_SECRET`,
  constant-time compare, closed without it) remove accounts past grace; see RUNBOOK.md.

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

## Payments and entitlements

Only verified, server-side Stripe facts change an entitlement:

- `/api/billing/stripe/webhook` answers 404 unless payments are open (service mode,
  `ENABLE_PAYMENTS` with `PAYMENTS_APPROVED`, Stripe keys and the service-role connection), and
  503 when switched on but misconfigured (reported in `/api/ready` by reason, no values).
- The `Stripe-Signature` is verified against the raw body with HMAC-SHA256 (node:crypto),
  constant-time comparison of every `v1` signature, other schemes ignored, and a 5-minute
  timestamp tolerance in both directions. Bodies over 256 KB are refused before verification.
- Event ids are recorded in `private.billing_events`; a redelivery or replay of a seen id is a
  no-op. Production acts on live-mode events only and other environments on test-mode only, so
  a preview never acts on a real payment.
- The organization comes from `client_reference_id`, which the in-app button sets to the org id
  (a random UUID; no email, name or other personal data is put in the URL). The plan comes from
  the session's `payment_link`, which Stripe sets, so editing the URL cannot change what was
  bought. Subscription state and dispute customers are re-read from Stripe's API, never trusted
  from the event body.
- Paid checks (`hasEntitlement`) fail closed on a missing row, a query error, an unknown status
  or plan, or an absent `paid_through`. Cancelled keeps access to the end of the paid period; a
  full refund or a dispute revokes at once. No free feature is gated.
- Logs carry event id, type and outcome only.

Known limits: a refund or dispute revokes every entitlement paid by that Stripe customer (the
safe direction). A refund that arrives before its checkout is recorded as `unmatched`, and the
later checkout still grants; reconcile from the Stripe dashboard if that happens. A plan change
made inside Stripe (Pro to Team) is not reflected; the plan is the one bought at checkout.

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
