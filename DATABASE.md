# Database and data lifecycle

Status: planned data contract. No schema migration, RLS policy, production store or retention schedule is approved by this document.

Proposed owner: Data/Engineering Lead with Privacy Lead; named assignments pending. Review before every migration, exposed table/view/function, retention change, role change or restore; monthly access review. Last reviewed: 2026-09-06.

## Inventory and ownership

| Planned records/store                                               | Classification                                        | Proposed owner             | Lifecycle requirement                                                            |
| ------------------------------------------------------------------- | ----------------------------------------------------- | -------------------------- | -------------------------------------------------------------------------------- |
| profiles, organizations, memberships, invitations                   | Restricted identity/authorization                     | Identity owner             | Account export, audited deletion and last-owner protection                       |
| companies, contacts, parties, addresses, products, product_variants | Confidential tenant master data                       | Domain owner               | Archive/merge history; referenced historical snapshots survive edits             |
| shipments, shipment_items, packages, package_items, transport_legs  | Confidential tenant trade data                        | Domain owner               | Optimistic version checks; scoped cursor pagination                              |
| document_sets, documents, document_revisions, templates             | Confidential artifacts; internal template definitions | Document owner             | Immutable finalized revisions; source/schema/renderer/template lineage           |
| attachments, private Storage objects                                | Restricted customer files                             | Document/security owners   | MIME/content/size validation; private access; versioned retention                |
| render_jobs, numbering_sequences                                    | Internal operational/tenant control                   | Engineering owner          | Transactional numbering; retry-safe bounded job lifecycle                        |
| orders, payments, entitlements, webhook ledger                      | Restricted commercial records                         | Finance/engineering owners | Immutable price/currency snapshots; verified event deduplication; reconciliation |
| email_events, audit_events                                          | Restricted operational metadata                       | Operations/security owners | Minimal payload; append-only audit; access and retention limits                  |
| regulatory_sources, feature_flags                                   | Internal controlled configuration                     | Legal/operations owners    | Versioned approvals, effective intervals, affected-version mapping               |
| Analytics/log/Sentry stores                                         | Pseudonymous/internal telemetry                       | Analytics/security owners  | Allowlisted metadata; no trade contents or contact identifiers                   |

Exact retention periods, deletion grace period, anonymous draft lifetime, legal holds, regional storage locations and subprocessors need named product/privacy/operations approval before the relevant production path. Do not treat an unspecified duration as indefinite retention. Anonymous drafts require short expiry and one-time claim tokens; the approved interval must be executable and tested.

## Relational invariants

All tenant records carry an organization relationship enforced by foreign keys and RLS. Cross-table references must not connect entities from different tenants. Generated identifiers must not replace authorization. Organization-scoped numbering is allocated transactionally with a unique constraint and concurrency tests. Monetary values use decimal-safe arithmetic and approved minor-unit currency rules; units, country codes and currency are explicit, with original user values retained when converted.

Master records are mutable; document revisions capture the complete resolved values, explicit overrides, shipment revision, schema/template/renderer versions, input hash and final artifact hash. A finalized document must regenerate without reading mutable master data. A document set references one shipment revision and specific immutable member revisions. A manifest lists type, number, version, hash and legal status for exactly the selected artifacts.

## State and access design to finalize before migrations

Draft → final requires complete schema validation, authorization and entitlement. Final content is immutable; correction creates a superseding revision with lineage. Voiding records actor/time/reason without erasing history. Archiving affects navigation and preserves historical access. External endorsement is a separate evidence-backed state, never inferred from finalization or upload alone. Task 11 must provide a field-level dictionary and authoritative transition table before migrations.

For every exposed table, view and function record SELECT/INSERT/UPDATE/DELETE/EXECUTE decisions for anonymous, member, admin, owner and narrowly scoped service actors. Test two tenants with same-named entities, guessed IDs, forged organization IDs and indirect relations. Audit and payment ledgers reject client mutation. Views/functions must preserve caller authorization; inspect definer privileges and search paths. Storage access, signed-link issuance, search, export and background jobs must use the same tenant rules.

## Change and recovery policy

Use versioned Supabase migrations, synthetic seeds and generated database types; never hand-edit generated types. Validate clean reset, forward migration and compatibility with both application versions during rollout. Destructive changes need explicit backup and migration/rollback notes before execution. Restore drills must include relational data, private artifacts, object metadata, schema versions and payment reconciliation; see [RUNBOOK.md](RUNBOOK.md). Data export and deletion jobs are idempotent, auditable and privacy-safe, with approved legal holds and retained-record explanations.

## Implemented schema (Task 04)

The identity subset of the quarantined draft is now executable under `supabase/migrations`:
`profiles`, `organizations`, `memberships`, `invitations`, `audit_events` and
`account_deletion_requests`. The remaining draft tables stay in `supabase/drafts` until Task 11.

Access is fail-closed by construction. The first migration enables row level security on every
table and revokes all privileges from `anon` and `authenticated`; the second grants only the
specific access each role is entitled to. `anon` receives no grant on any tenant table, so
PostgreSQL refuses those tables before row policies are consulted.

Membership tests run through `private.is_member` and `private.has_org_role`, which are security
definer and pinned to an empty search path. A policy on `memberships` that queried `memberships`
would recurse; the helper reads it once with row security bypassed and the policy consumes the
boolean.

No table accepts a direct insert. Operations spanning more than one row are routines, so
creating an organization also creates its first owner and accepting an invitation also consumes
it, each within one transaction. A trigger refuses any change that would leave an organization
without an owner.

Every change is proved in CI against a disposable stack: `supabase/tests/identity_rls.test.sql`
asserts the access matrix and the invitation and ownership rules, and generated types are
regenerated and compared so a schema change cannot land without its types.

## Tenant-scoped references and document provenance (20260909000100)

Every tenant parent is addressable by `(org_id, id)` and every child references it by that
pair: shipment parties, lines (to their shipment and source product), packages, package
contents, and documents. A row therefore cannot point at another tenant's data, whatever row
policy admits the write. A trigger additionally keeps package contents to lines of the same
shipment. The definer routines `generate_document` and `add_product_to_shipment` scope every
lookup to the shipment's organization as well.

Documents freeze `org_id`, `created_at` and `created_by` (which may only become null, for
account erasure) with their content; status only moves `final` to `superseded` or `voided`.
A shipment with documents cannot be deleted. Snapshots now carry `schema_version` (2) and
`money_places`, the currency minor units money was rounded to; schema 1 snapshots render
with two places as issued. Schema 3 (renderer `tradedocs-pdf/3`) adds a nullable net weight
total, a per-line origin column on invoices whose lines state one and the "Incoterms® 2020"
caption. `supabase/tests/tenant_integrity.test.sql` proves the cross-tenant cases, products,
packages, contents, import, add-from-catalog and rate limiting.

## Workspace snapshots at schema 3 (20260910000100)

`generate_document` is redefined unchanged except that it stamps `schema_version` 3 and
leaves `totals.net_weight_kg` and `totals.gross_weight_kg` null when no line states one
(schema 2 coalesced them to zero). Lines already carried `country_of_origin`; `packing_totals`
keep their schema 2 shape. Every org-scoped lookup from 20260909000100 is kept. Existing
documents are not rewritten: the renderer dispatches on `schema_version`, so schema 1 and 2
snapshots render byte-identically, and `freeze_document` refuses any rewrite. The tenant
integrity test asserts a new document is schema 3 with an absent unstated gross total, and
that a pre-existing schema 2 row is untouched. Rollback: re-run the 20260909000100
definition; schema 3 documents issued meanwhile keep rendering as issued.

`public.consume_rate_limit` (20260909000200) is the service-role-only quota store behind
`src/lib/security/rate-limit.ts`. It holds HMAC digests only, never addresses or user ids.

## Billing entitlements (20261006000100)

`public.entitlements` holds one row per organization with a paid plan: `plan` (`pro` or
`team`), `status`, `paid_through`, `cancel_at_period_end`, `revoked_at`/`revoke_reason`, and the
Stripe references (`customer_ref`, `subscription_ref` unique, `checkout_ref`). No row means the
free plan. Members read their own organization's row through `entitlements_select_member`, and
only the plan and date columns (column grant); the Stripe references are not readable by any API
role. Nobody but `public.apply_billing_event` writes it.

`private.billing_events` is the webhook ledger: one row per Stripe event id with its outcome
(`applied`, `ignored`, `unmatched`). No API role can reach it.

`public.apply_billing_event(p_event_id, p_event_type, p_action)` is executable by
`service_role` only. It inserts the event id (a duplicate returns `duplicate` and does
nothing) and applies the action in the same transaction, so a failed write leaves no ledger row
and the retry is processed. Actions: `grant` (upsert for an existing, undeleted organization;
a revoked row is never re-granted by the same checkout), `subscription` (status and dates by
`subscription_ref`; `paid_through` only moves forward and only while Stripe reports the
subscription active, so a cancelled or past-due plan ends when the paid period does), `revoke`
(by `customer_ref`, sets `revoked_at`; later subscription events cannot undo it) and `ignore`.

Tests: `supabase/tests/billing_entitlements.test.sql` (27 assertions: isolation, column
grant, write refusal for members and anon, idempotency, cancel/past-due/refund rules).
Rollback: drop the routine and both tables; every paid check then answers false.
Generated types: `entitlements` and `apply_billing_event` were added to
`src/lib/database.types.ts` by hand; the CI `database` job's generated file is authoritative.

## Contact messages (20261006000100)

`public.contact_messages` holds messages sent through `/contact`: name, email, topic
(`question`, `account`, `problem`, `privacy`, `other`), message (10–5000 characters), the
owner-notification outcome (`notification_status` pending/sent/not_sent/failed and a reason
code of at most 100 characters) and `handled_at`/`handled_by` (set together by the admin
inbox). RLS on, no policies, no `anon`/`authenticated` grants; `service_role` holds select,
insert and update only. The migration also states the service-role grants the admin panel
relies on (select on organizations, memberships, profiles, shipments, documents; select and
insert on audit_events), which Supabase's default privileges already provided. Retention is
not yet decided (P-003) and the privacy draft says so. Rollback: drop the table; nothing
references it, and `/contact` then reports the form unavailable. `src/lib/database.types.ts`
was extended by hand for this table: replace it with the CI `database-evidence` artifact.
