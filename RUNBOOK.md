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

### PDF branding images (D-021)

The private `org-branding` bucket and its policies are created by migration
`20261007000100_pdf_branding.sql`; there is nothing to set up by hand. Storage is enabled on
every Supabase project by default; if the hosted project has it switched off, enable it in the
dashboard before running the migration. Never make the bucket public.

- A branded document that answers 503 ("logo or signature image could not be loaded"): check
  that the object named in its snapshot (`snapshot -> 'branding'`) exists in `org-branding` and
  that its SHA-256 matches. Do not regenerate or edit the document; restore the object from
  backup under the same name. Documents never render without the images they were issued with.
- Previews fall back to no branding when the entitlement or an image cannot be read; that is
  expected fail-closed behaviour, not an incident.
- Orphaned objects (an upload whose record failed) are harmless; delete one only after
  `branding_asset_in_use(org, sha256)` answers false.

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

## Opening paid plans (Stripe Payment Links)

Owner steps; agents never handle the keys. Prices are the owner's decision (P-002). The
team's proposal is `PROPOSED_PRICES` in `src/lib/billing/plans.ts`
(docs/research/pricing-proposal-2026-10-06.md); it shows only with `PRICES_APPROVED=true`.
Without it `/pricing` shows each paid plan as "Not available yet". With it, and before the
steps below, each paid plan shows its approved prices and "Checkout is not open yet". The
webhook route answers 404 until payments are enabled.

0. Approve or edit `PROPOSED_PRICES` (a code change), then set `PRICES_APPROVED=true` and
   redeploy. Each Stripe Price created below must equal the approved amount.

1. Publish the refund policy and the paid plans' features first. The pricing FAQ promises the
   policy before paid plans open, and a paid card lists only features the code gates
   (`src/lib/billing/plans.ts`); with none, the card says so.
2. In Stripe (test mode first, on a preview), create one Product and recurring Price per plan
   (Pro, optionally Team), then a **Payment Link** for each Price. Subscription mode only: a
   one-time link is ignored by the webhook. Do not add custom fields that collect personal data.
3. Create a webhook endpoint at `https://<APP_URL host>/api/billing/stripe/webhook` with the
   events `checkout.session.completed`, `customer.subscription.created`,
   `customer.subscription.updated`, `customer.subscription.deleted`, `charge.refunded` and
   `charge.dispute.created`. Copy its signing secret.
4. Create a restricted API key with read access to Subscriptions and Charges only.
5. Set in Vercel for that environment: `PAYMENT_PROVIDER=stripe`, `PAYMENT_API_KEY` (the
   restricted key), `PAYMENT_WEBHOOK_SECRET` (the signing secret), and per plan
   `PRICE_<PLAN>_AMOUNT`, `PRICE_<PLAN>_CURRENCY`, `PRICE_<PLAN>_INTERVAL`,
   `PAYMENT_LINK_<PLAN>_URL`, `PAYMENT_LINK_<PLAN>_ID` (see `.env.example`). The amount must
   match the Stripe Price. Then `PAYMENTS_APPROVED=true` (recorded approval) and
   `ENABLE_PAYMENTS=true`. Production requires live-mode keys and only acts on live events;
   every other environment only acts on test events.
6. Apply migration `20261006000100_billing_entitlements.sql` (the manual production migration
   workflow) before enabling payments, then redeploy.
7. Verify: `/api/ready` carries no `payments: "misconfigured"`; `/pricing` shows the price; as
   an organization owner, `/app/<org>/billing` shows the upgrade button; a test checkout makes
   the plan appear after Stripe's webhook (Stripe → webhook → event deliveries shows 200).
   Cancel the test subscription: the plan stays until the period end. Refund it in full: the
   plan ends at once.

Rollback: set `ENABLE_PAYMENTS=false` and redeploy. The webhook answers 404 (Stripe retries for
up to three days, so re-enabling within that window replays the backlog idempotently); stored
entitlements remain and keep their dates.

Webhook outcomes appear in the platform logs as `billing.webhook` lines with the event id, type
and outcome only. `unmatched` means the event named a subscription or customer with no
entitlement (for example a subscription event that arrived before its checkout; the checkout
re-reads the live subscription when it lands). `retry` means Stripe or the database was
unreachable and Stripe will redeliver.

## Contact inbox, legal pages and platform admin (D-009, D-018)

- **Chat.** `CHAT_PROVIDER` accepts only `none` today (D-019); any other value is treated as
  `none`, so the help centre and contact form are the only support channels.
- **Admin access.** Set `PLATFORM_ADMIN_EMAILS` (Production target only) to the owner's
  confirmed sign-in address(es). `/admin` checks the signed-in user against the list on every
  request and action; anyone else gets a 404, and so does everyone on a deployment without a
  database (every preview, D-011). With a database but no `SUPABASE_SERVICE_ROLE_KEY`, an
  allowlisted admin sees "Admin needs the production database". Every admin view and action writes a `platform_admin.*` row to
  `audit_events`; if that write fails the page shows nothing but the cause.
- **Contact messages.** `/contact` stores every valid message in `contact_messages` (service
  role) before attempting email. Email goes through Resend when `RESEND_API_KEY`,
  `EMAIL_FROM` and `LEGAL_CONTACT_EMAIL` are set; outside production only to
  `EMAIL_SANDBOX_RECIPIENT`. The inbox shows each message's email outcome
  (`sent` / `not_sent` / `failed` + reason code). Work the inbox at `/admin/messages` and mark
  each handled. Quota: 5 messages per address per hour; a filled honeypot is answered as
  sent and stored nowhere.
- **Approving the legal pages.** Set `LEGAL_ENTITY_NAME`, `LEGAL_ENTITY_COUNTRY`,
  `LEGAL_CONTACT_EMAIL` (plus `LEGAL_ENTITY_ADDRESS`, `LEGAL_GOVERNING_LAW`,
  `LEGAL_DATA_REGION` where the text shows "to be provided"), review `/privacy`, `/terms` and
  `/cookies`, then set `LEGAL_APPROVED_AT=YYYY-MM-DD` and redeploy. The draft banner and
  noindex go, and the pages enter the sitemap and llms.txt dated by approval. Open items the
  owner must decide before approving: transfer mechanism per provider, contact-message
  retention, liability cap.
- **Account deletion purge.** See "Account purge" below.

## Certificate of origin (D-008, D-025)

Off by default. It is launch-ready behind `ENABLE_REGULATED_DOCUMENTS` and switches on only
with a recorded legal review; nothing else needs changing.

**What the reviewer reviews.** The wording in `src/lib/trade/certificate-of-origin.ts`
(version 1: the "Preparation template - not an issued certificate" label, the exporter's
declaration, the preparation statement, the empty certification box and the signature
caption), the workspace and public notice `CERTIFICATE_OF_ORIGIN_NOTICE` in
`src/lib/trade/regulated.ts`, and a preview PDF from a staging shipment. The certificate is
the exporter's own preparation: TradeDocs never certifies or issues it, and where
certification is required the issuing chamber of commerce or authority does that. Open items
for the reviewer (LEGAL.md): private evidence attachments and an "externally endorsed" state
are not built; the signature/stamp image is the organization's own upload (PDF branding).

**To enable** (Vercel → Project → Settings → Environment Variables, Production; preview only
with staging data):

1. `LEGAL_COO_REVIEWED_BY` = the reviewer's full name (one line).
2. `LEGAL_COO_REVIEWED_AT` = the review date, `YYYY-MM-DD` (a real date, not in the future).
3. `REGULATED_DOCUMENTS_APPROVED` = `true`.
4. `ENABLE_REGULATED_DOCUMENTS` = `true`.
5. Redeploy (the public pages are built with the flag), then confirm: `/api/ready` shows no
   `regulated_documents` key; the home page, `/pricing` and `/llms.txt` list "Certificate of
   origin"; on a shipment the document type list offers it and the preview opens. Record the
   name, date and commit in DECISIONS.md D-025.

Requirements already in place: service mode, `SUPABASE_SERVICE_ROLE_KEY` (the certificate is
generated through the service-role-only `generate_certificate_of_origin`), and migration
`20261009000200_certificate_of_origin.sql` applied. A shipment needs an exporter, a consignee,
a country of origin on every line and a signatory name in the document settings; the
workspace says which is missing.

**If something is wrong.** Any missing or invalid value keeps the certificate refused (fail
closed) and `/api/ready` answers `regulated_documents: misconfigured` with the reason; the
rest of the site is unaffected. **To switch off**, set `ENABLE_REGULATED_DOCUMENTS=false` and
redeploy: the workspace, the preview and the database path refuse it again and the public
pages drop it. Certificates already generated stay in their shipment's history and still
download as issued. Changing the wording means a new version in
`certificate-of-origin.ts` and the migration constant, and a new review.

## Account purge (owner decision: scheduling)

Accounts whose deletion request is past `purge_after` (30 days) are removed by
`public.purge_due_accounts(p_limit)`: it deletes the auth user (cascading profile, sessions and
the request), soft-deletes organizations whose only member was that account, revokes
invitations it sent, and writes `account.purged` to `audit_events`. It is idempotent and
batch-bounded; an account that is the only owner of an organization with other members is
held back (`last_purge_outcome = 'blocked_sole_owner'`, audited once) until ownership moves.

**Nothing schedules it.** No cron exists in `vercel.json` or the database (factory rule: no
scheduled jobs without the owner). Until the owner chooses, run it from `/admin/users` → "Run
purge now" at least weekly. To schedule it, pick one:

1. **Vercel Cron.** Set `CRON_SECRET` (32+ random characters) on the Production target, then
   add to `vercel.json`: `"crons": [{ "path": "/api/internal/purge-accounts", "schedule":
"0 3 * * *" }]`. Vercel sends `Authorization: Bearer $CRON_SECRET` itself.
2. **Supabase pg_cron.** Enable the pg_cron extension, then
   `select cron.schedule('purge-accounts', '0 3 * * *', $$select public.purge_due_accounts(50)$$);`
   No secret is needed; the job runs inside the database.

Manual call: `curl -H "Authorization: Bearer $CRON_SECRET" https://<host>/api/internal/purge-accounts`
returns `{ purged, blocked, ran_at }`; 503 means `CRON_SECRET` is unset, 401 a wrong secret.
Rollback: unschedule (remove the cron entry / `select cron.unschedule('purge-accounts')`).
Purged accounts cannot be restored except from a database backup.

## Auth settings on the hosted project (owner, Supabase dashboard)

Local and CI read `supabase/config.toml`; the hosted project must be set by hand to match:

- Authentication → Providers → Email: **Confirm email ON**, **Secure email change ON**,
  minimum password length **12**. Leaked password protection ON if the plan offers it (the app
  also checks HIBP).
- URL configuration: Site URL = `APP_URL`; redirect URLs include `<APP_URL>/**`.
- Email templates: paste `supabase/templates/confirmation.html`, `magic-link.html`,
  `recovery.html` and `email-change.html` (subjects are in `config.toml`). They link to
  `/auth/confirm` with a token hash, which works on any device; the default templates only
  work in the browser that asked, and an admin-triggered reset or confirmation (sent from the
  server) does not work with them at all.
- SMTP: Resend (D-017), so auth email is not limited to Supabase's built-in sender.
- Rate limits: keep the hosted defaults; the app adds its own quotas.

## Account administration (`/admin/users`)

Search by email (full address or first 3+ characters). The account page shows organizations
and roles, created/last sign-in, confirmation, sign-in state and deletion status, with:
disable/enable sign-in (ban + end sessions), resend confirmation, send password reset, cancel
deletion, delete now (purges immediately; refused for a sole owner with colleagues). Every
action is in `/admin/audit` as `platform_admin.*`.

Turnstile: create a widget in Cloudflare for the production hostname, set
`TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`, and unset `WAIVE_TURNSTILE`. Invitations are
emailed once `RESEND_API_KEY`, `EMAIL_FROM` and `APP_URL` are set (previews: only to
`EMAIL_SANDBOX_RECIPIENT`); otherwise inviters get a copy-link fallback labelled as such.
