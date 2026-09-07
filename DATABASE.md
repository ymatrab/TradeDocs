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
