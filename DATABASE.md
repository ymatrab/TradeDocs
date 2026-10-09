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

## Document lineage, voiding and settings (20261006000300)

`public.organization_settings` (one row per organization): `default_currency`,
`number_prefix` (`^[A-Z0-9]{1,10}$`), `payment_terms`, `bank_details`, `signatory_name`,
`signatory_title`, `document_notes`, `updated_by`. Members select; owners and admins insert
and update (`has_org_role`). Settings reach documents only through new snapshots.

`public.documents` gains `supersedes_id` (composite FK `(org_id, supersedes_id)` to
`documents (org_id, id)`), `status_reason`, `status_changed_at`, `status_changed_by`.
`freeze_document` also freezes `supersedes_id` and lets the status fields change only together
with a final → superseded/voided transition. The `documents_void` policy and the
`authenticated` UPDATE grant are removed: no API role writes documents directly.

- `generate_document` locks the shipment row, allocates `<prefix->KIND-YYYY-NNNN`, writes a
  schema 4 snapshot, supersedes every earlier final of the same kind ("Replaced by …") and
  records the lineage in the row, the snapshot (`supersedes`) and the audit event.
- `preview_document(shipment, kind)` returns the snapshot generation would write now, number
  `PREVIEW`, `preview: true`; nothing is allocated or stored.
- `void_document(document, reason)` — owner/admin, reason 3–500 characters, final only,
  audited as `document.voided`.
- Snapshot schema 4 (`private.document_snapshot`, shared by both): `supersedes`, `issuer`,
  party blocks of printed fields only (`private.party_snapshot`, no notes or timestamps),
  `packages[].net/gross_weight_total_kg` = count × per-package weight, and `packing_totals`
  weights count-weighted and null when no package states one.

## Reuse, allocation limits and import v2 (20261006000400)

- `duplicate_shipment(source, reference)` copies parties (an archived party is left empty),
  terms, currency, marks, lines, packages and allocations into a new revision-1 draft and
  audits `shipment.duplicated`. Documents are never copied or changed.
- `package_contents_same_shipment` also locks the line and refuses allocating more than its
  quantity across packages; the error detail carries `line_quantity` and `allocated_elsewhere`.
- `bump_own_revision` ignores an update that changes no column besides `updated_at`.
- `import_products(org, rows, dry_run default false)` replaces the two-argument version:
  every field is validated, all problems per row are reported against `rows[].line` (the
  file line), duplicate SKUs within a file are refused, and a dry run writes nothing and
  returns `{inserted, updated, problems, dry_run}`.

Tests: `supabase/tests/product_logic.test.sql` (49 assertions); `tenant_integrity` and
`trade_core` now prove the document trigger as the table owner and void through the routine.
Generated types were extended by hand (`organization_settings`, the four document columns,
`duplicate_shipment`, `preview_document`, `void_document`, `import_products.dry_run`); the CI
`database-evidence` artifact is authoritative. Rollback notes are in each migration header.

## Accounts and access (20261006000900)

- `account_deletion_requests` gains `last_purge_attempt_at` and `last_purge_outcome`
  (`blocked_sole_owner` or null). `invitations.invited_by` becomes nullable; `invited_by` and
  `accepted_by` are `on delete set null`, and the pairing check becomes "an accepter implies an
  acceptance", so a purged account detaches from the invitations it sent or accepted.
- `private.protect_last_owner` allows removing the last owner of a soft-deleted organization.
- Policy `memberships_delete_scoped` replaces `memberships_delete_admin_or_self`: self, any
  owner, or an administrator removing a plain member.
- Authenticated routines (audited): `rename_organization`, `change_member_role` (owner),
  `remove_member`, `revoke_invitation`, `reissue_invitation` (rotates the token digest, 7 more
  days), and `create_invitation` replaced (refuses existing members, supersedes a pending
  invitation to the same address).
- Service-role routines: `purge_due_accounts(p_limit)`, `admin_force_account_deletion`,
  `admin_search_users(p_query, p_limit)` (3–254 characters, at most 50 rows, wildcards
  escaped), `admin_revoke_sessions`, `peek_rate_limit`. `private.purge_account` is callable
  by none of the API roles.
- pgTAP: `supabase/tests/accounts_access.test.sql`. Types hand-added; replace with the CI
  `database-evidence` artifact. Rollback notes are in the migration header.

## PDF branding (20261007000100, D-021)

- Storage bucket `org-branding`: private (`public = false`), 1 MiB per object, `image/png` and
  `image/jpeg` only. Objects are content-addressed, `org/<org id>/assets/<sha-256>.<png|jpg>`
  (`private.branding_object_org` accepts nothing else), and never overwritten: there is no
  UPDATE policy. Members of the organization in the path read; owners and admins insert while
  the organization is entitled, and delete whether or not it is. `anon` has no policy.
- `public.branding_assets` (primary key `org_id, slot`; `slot` is `logo` or `signature`):
  `sha256`, `format` (`png`/`jpeg`), `object_path`, `width`/`height` (1–2000), `byte_size`
  (≤ 1 MiB), `updated_by`. A check ties `object_path` to the row's own organization and hash.
  Members select; owners and admins insert and update while entitled, and delete.
- `private.org_entitled(org, plans)` is `entitlementGrants` (src/lib/billing/entitlements.ts)
  in SQL, and `private.branding_entitled(org)` applies it to Pro and Team, the plans of
  `pdf_branding` in `src/lib/billing/plans.ts`. Both answer false on no row (fail closed).
- Snapshot schema 5: `private.document_snapshot` adds `branding.{logo,signature}`
  (`object_path`, `sha256`, `format`, `width`, `height`) and `schema_version: 5` only when the
  organization is entitled at that moment and has an image; every other snapshot is schema 4
  exactly as before. The renderer (`tradedocs-pdf/5`) fetches each image by its recorded path,
  checks its SHA-256 and draws only those bytes, so a finalized document re-renders identically
  after the logo changes; issued documents are never re-rendered without their images.
- `generate_document` takes `for share` on the organization's `branding_assets` rows before the
  snapshot, so a concurrent replace/remove waits until the document is committed.
- `branding_asset_in_use(org, sha256)` (authenticated): true when either slot or any document of
  the organization, in any status, refers to the image, or the caller is not a member. The
  upload/remove actions delete an old object only when it answers false.
- pgTAP: `supabase/tests/pdf_branding.test.sql` (bucket privacy, member read, cross-org read and
  write denied, member write denied, owner write allowed, free org denied, no overwrite, delete
  authority, schema 5 capture and lapse). Types for `branding_assets` and
  `branding_asset_in_use` were added by hand; the CI `database-evidence` artifact is
  authoritative. Rollback notes are in the migration header (keep the bucket and the schema 5
  renderer while schema 5 documents exist).

### Commercial terms (migration 20261007000200_document_commercial_terms.sql)

- `public.shipments.buyer_reference` (text, 1–60 characters after trimming; null when not
  stated) and `public.shipments.proforma_valid_until` (date). No new table, policy or grant: the
  existing shipments policies cover both, and an update bumps the shipment revision.
  `duplicate_shipment` does not copy them (a new order has its own PO and offer).
- Snapshot schema 6: `private.document_snapshot` adds `shipment.buyer_reference` and
  `shipment.proforma_valid_until` and `schema_version: 6` only when the shipment states one of
  them; every other snapshot is schema 4 or 5 exactly as before (branding is still recorded on a
  schema 6 snapshot). Renderer `tradedocs-pdf/6` prints the buyer reference on commercial and
  proforma invoices and the validity date on proforma invoices, in a second row of term boxes,
  from schema 6 only. The free generator emits schema 6 under the same rule and keeps payment
  terms in the schema 4 `issuer` block.
- pgTAP: `supabase/tests/document_commercial_terms.test.sql` (schema 4 unchanged, length and
  blank checks, schema 6 capture on preview and generation, cross-tenant read and write denied).
  The two columns were added to `src/lib/database.types.ts` by hand; the CI
  `database-evidence` artifact is authoritative. Rollback in the migration header.

### Sales and shipping documents (migration 20261009000100_sales_and_shipping_documents.sql, D-025)

- `public.documents.kind` also accepts `quotation`, `purchase_order`, `sales_confirmation`,
  `sales_contract`, `bill_of_lading_draft`, `shipper_letter_of_instruction` and
  `vgm_declaration` (prefixes QT, PO, SC, CT, BL, SLI, VGM). `private.document_kind_known`
  (private, no client grant) is the one list generate and preview accept; `DOCUMENT_KINDS` in
  `src/lib/labels.ts` is pinned to it by a unit test.
- `public.shipments` gains `container_number` (ISO 6346 shape; the app also checks the
  check digit), `container_type`, `seal_number`, `booking_number`, `vessel_voyage`,
  `vgm_method` (1 or 2), `vgm_kg` (positive, below 1,000,000), `vgm_weighed_on` and
  `vgm_signatory`. No new table, policy or grant: the shipments policies cover them, an update
  bumps the revision, and `duplicate_shipment` does not copy them.
- Snapshot schema 7 adds those nine fields to `shipment` only when one is stated; every other
  snapshot is schema 4, 5 or 6 exactly as before. Renderer `tradedocs-pdf/7` draws the seven new
  kinds; the five older kinds take none of the new branches (unit test renders them byte for byte
  with and without schema 7 fields). `generate_document` refuses a VGM declaration without
  container number, method, mass and signatory (IMO MSC.1/Circ.1475 5.1, 6.2).
- pgTAP: `supabase/tests/sales_and_shipping_documents.test.sql` (prefixes, VGM refusal,
  column checks, schema 7 capture, cross-tenant read and write denied). Columns added to
  `src/lib/database.types.ts` by hand; the CI `database-evidence` artifact is authoritative.
  Rollback in the migration header.

## E-signature requests (20261009000600, D-025)

- `public.esign_requests`: one row per Dropbox Sign request for a final document — the exact
  bytes sent (`original_sha256`), provider request id (write once), `test_mode`, status
  (`sending`, `sent`, `signed`, `declined`, `cancelled`, `expired`, `error`, `failed`), 1–5
  signers with their status (jsonb), an optional message, and the signed copy
  (`signed_object_path`, `signed_sha256`, `signed_byte_size`, `signed_stored_at`, written once,
  path `org/<org>/esign/<request>/<sha-256>.pdf`). `private.freeze_esign_request` keeps the
  organization, document, bytes, mode and requester fixed and an end state final. The
  original `documents` row is never touched: the signed copy is a new linked artifact.
- `private.esign_events`: the callback ledger (event key = SHA-256 of event hash, type and
  provider id), so a redelivery is a no-op.
- Storage bucket `esign-signed`: private, PDF only, 25 MiB. Members of the organization in
  the path may select (for 60-second signed URLs); nobody but the service role writes.
- Access: members read their organization's rows; no API role writes directly. The service
  role reads and writes only through `esign_create_request` (membership, Pro/Team via
  `private.org_entitled`, final and current document), `esign_mark_sent`,
  `esign_mark_failed`, `esign_event_recorded`, `esign_apply_event`, `esign_attach_signed` and
  `esign_record_download`, each writing its audit event (no signer emails in metadata).
- pgTAP: `supabase/tests/esign_requests.test.sql` (bucket and grants, paid gate, final-only,
  cross-tenant reads and writes denied, idempotent events, end states, write-once copy). Types
  added to `src/lib/database.types.ts` by hand; the CI `database-evidence` artifact is
  authoritative. Rollback in the migration header.

## Public API keys (20261009000400, D-025)

- `public.api_keys`: org, name, visible prefix, unique `key_hash` (HMAC-SHA-256 hex), creator,
  `last_used_at` (touched at most once a minute), `revoked_at`/`revoked_by`. RLS: select for
  owners/admins of the org, every column except `key_hash`; no direct writes.
- `public.api_idempotency`: (key, Idempotency-Key) → request fingerprint and stored response,
  24 hours, no grants to any client role.
- Routines: `create_api_key`, `revoke_api_key` (authenticated, role-checked, audited);
  `api_authenticate`, `api_list_shipments`, `api_get_shipment`, `api_create_shipment`,
  `api_list_documents`, `api_get_document`, `api_generate_document` (service_role only).
  Helpers in `private`: `api_entitled` (Team, mirrors plans.ts), `api_key_refusal`,
  `api_principal`, JSON builders, idempotency claim/store.
- Rollback: drop the routines, then `api_idempotency` and `api_keys`. No existing object is
  altered.

## Accounting integrations (20261009000500, D-025)

- `integration_connections`: one per organization and provider (`quickbooks`, `xero`), the
  provider tenant (realmId / tenantId), display name, scopes, status (`active`,
  `needs_reconnect`) and the access and refresh tokens as AES-256-GCM ciphertext sealed by
  the application with `INTEGRATION_TOKEN_KEY` (bound to org, provider and token kind). No
  policy and no grant for `anon` or `authenticated`; `service_role` only.
- `integration_oauth_states`: the server half of the OAuth state, keyed by SHA-256 of the
  nonce, with the sealed PKCE verifier; lives at most 15 minutes (check constraint); consumed
  exactly once by an update guarded on `consumed_at is null`. `service_role` only.
- `integration_records`: provider id to local company or product (FK `on delete set null`, so
  a deletion is remembered and not undone), with MD5 fingerprints of the imported values and
  of the local row after import. Members read; nobody writes except the routine.
- `integration_status(org)`: provider, display name, status, connected_at; members only; no
  token, scope or tenant id.
- `import_integration_records(org, source, record_kind, rows, dry_run)`: owner/admin,
  `private.integrations_entitled` (Pro/Team), active connection, at most 2000 rows; inserts
  new ids, updates rows unchanged locally, reports conflicts (edited in TradeDocs, or a product
  code already in use), skips deleted/archived rows and rows with problems; audits
  `integration.imported` when applied.
- Rollback: drop both functions, `private.integrations_entitled`, `private.import_fingerprint`
  and the three tables. Imported companies and products remain as ordinary rows.

### Certificate of origin path (migration 20261009000200_certificate_of_origin.sql, D-025)

- BEFORE INSERT trigger `documents_certificate_of_origin` on `public.documents`
  (`private.certificate_of_origin_insert()`, certificate rows only): refuses the row (42501)
  unless the transaction came through `public.generate_certificate_of_origin`, which closes
  the direct `generate_document(shipment, 'certificate_of_origin')` call members could make;
  and adds `snapshot.certificate` = `{ wording_version: 1, invoice_reference }`, the number of
  the shipment's current final commercial invoice (null when none).
- `public.generate_certificate_of_origin(target_shipment, actor)`: service role only (revoked
  from public, anon, authenticated). Runs `generate_document` as `actor`, so membership,
  numbering, lineage, branding and audit are that routine's own. The app calls it only after
  its review gate (`ENABLE_REGULATED_DOCUMENTS`, `REGULATED_DOCUMENTS_APPROVED`,
  `LEGAL_COO_REVIEWED_BY/AT`) is on, for the user it verified. No new table, view or policy.
- pgTAP: `supabase/tests/certificate_of_origin.test.sql` (direct path refused for members,
  reviewed path refused to members, membership enforced for the actor, invoice reference,
  wording version and per-line origin recorded). The function was added to
  `src/lib/database.types.ts` by hand; the CI `database-evidence` artifact is authoritative.
  Rollback in the migration header.
