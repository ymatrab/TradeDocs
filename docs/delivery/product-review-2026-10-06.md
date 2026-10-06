# Product logic review — 2026-10-06 (D-020)

Owner instruction D-020: revise the product part by part (logic, results, process, UX) for
satisfied users. This pass walked the signed-in journey in code — master data, CSV import,
shipment building, packing, documents, the set download and reuse — and fixed what was wrong.

Branch `product-logic` from `origin/launch-v3`. No local runs (AGENTS.md): every test below
is written and **pending CI** (`npm run test`, `npx supabase test db`, Playwright service
suite). Generated database types were extended by hand; the CI `database-evidence` artifact
is authoritative.

## Findings, fixes and tests

| # | Finding | Fix | Test |
|---|---|---|---|
| 1 | Re-generating a document left the earlier one `final`: a shipment could hold two current commercial invoices and the ZIP set bundled both. | `generate_document` supersedes every earlier final of that kind (`status_reason` "Replaced by …"), records `supersedes_id`, and the new snapshot states `supersedes`; the PDF header prints "replaces No. …". | pgTAP `product_logic` (superseded, reason, lineage, one final per kind, old snapshot unchanged); e2e "a second shipment reuses the first"; `pdf-layout` "states the number…" |
| 2 | Any member could void a document by a direct UPDATE, with no reason and no audit row. | Direct UPDATE on `documents` revoked; `void_document(id, reason)` is owner/admin only, needs 3–500 characters, writes `document.voided` to the audit log. Panel offers Void with a reason to owners/admins. | pgTAP: member refused, reason required, voided+reason recorded, audited, superseded cannot be voided, API role cannot update directly; `tenant_integrity` other-tenant void refused; vitest `voidDocument` |
| 3 | Packing totals summed per-package weights without the package count, while volume was multiplied: 4 cartons × 12.5 kg printed 12.5 kg. | Snapshot schema 4: `net/gross_weight_total_kg` per row and count-weighted `packing_totals` (null when unstated). Panel uses `src/lib/trade/packing.ts` (exact decimals) and shows row weight. | pgTAP gross 50.000 / net 40.000 / volume 0.2400; vitest `packing-and-inputs` |
| 4 | Party snapshots copied the whole company row, internal `notes` and timestamps included, into documents sent to counterparties. | `private.party_snapshot` copies printed fields only (plus id). | pgTAP "a party snapshot leaves internal notes … out" |
| 5 | Staleness came from the revision only: correcting a consignee's address in the address book never marked its documents stale, and nothing said *why* a document was stale. | `preview_document` builds the current snapshot; `src/lib/trade/staleness.ts` compares sections (lines, packing, terms, each party, issuer) and returns a sentence. Shipment panel shows it; the ZIP excludes content-stale documents and lists them in the manifest. | vitest `staleness` (11 cases) |
| 6 | Saving the shipment form unchanged advanced the revision and marked every document stale. | `bump_own_revision` ignores updates that change nothing. | pgTAP no-op vs real edit |
| 7 | Concurrent edits: the last save silently overwrote another user's change. | Editor posts the revision it rendered; `updateShipment` saves only against it and says "Someone changed this shipment after you opened it…". | vitest revision filter + conflict message |
| 8 | Concurrent generation could read the shipment and its lines from different states; two generations could supersede the same predecessor. | `generate_document` locks the shipment row before reading. | Reviewed; concurrency not reproducible in pgTAP |
| 9 | Allocations could exceed the line quantity with no refusal. | `package_contents_same_shipment` locks the line and refuses more than it holds across packages (replacing a package's own amount is allowed); the action says "100 in total, 80 already in other packages". | pgTAP limit/replace; vitest allocation message |
| 10 | CSV import: an unreadable weight ("abc") failed a cast with a generic error; an unreadable price became 0 silently; a duplicate SKU in one file overwrote the earlier row; long units, gross < net, out-of-range figures failed without a row; rows without a description were dropped silently; row numbers did not match the file. | `import_products` v2 validates every field, reports **all** problems per row against the file line (`line` from `parseDelimitedLines`), flags in-file duplicate SKUs, and has `dry_run`. The form gains "Check the file" (validate and count, write nothing, keep the text for the import). | pgTAP dry run writes nothing, problems by line, rejection whole; vitest `csv` (line numbers, kept rows), `importCatalog` preview/raw values/row limit |
| 11 | Org settings for real documents were missing. | `organization_settings` (members read, owners/admins write): default currency (new shipments start in it), number prefix (`ACME-CI-2026-0001`), payment terms and bank details (invoices), signatory and a note (every type). `/app/[org]/settings`. Logo deliberately not done: needs private storage, upload bounds and PDF image embedding. | pgTAP write/read/isolation/prefix check/prefixed number; vitest settings action |
| 12 | PDF: totals could be pushed onto a page alone or into the disclosure footer; marks and later blocks were never page-checked; long legal names and named places overflowed their boxes; the notify party was never printed. | Renderer `tradedocs-pdf/4`, schema 4 only (older documents render as issued): the last row carries the totals to the next page with it, every block is page-checked against the footer, party and term text wraps/ellipsizes inside its box, notify party box, issuer blocks, signature line, preview label on every page. | vitest `pdf-layout` at 1/3/10/24/25/26/60 lines and 40 packages; wrapping; preview; determinism; schema 3 unchanged |
| 13 | No way to see a document before finalizing it. | `GET /api/shipments/[id]/preview?kind=` renders `preview_document` marked "PREVIEW · NOT ISSUED" with no number; links in the documents panel. | vitest `pdf-layout` preview; pgTAP preview stores nothing, other tenant refused |
| 14 | Workflow 7: a second shipment had to be retyped. | `duplicate_shipment(source, reference)` copies parties (archived ones left empty), terms, lines (values as they were), packing and allocations into a revision-1 draft; documents untouched. "Reuse for a new shipment" panel. | pgTAP copy contents, parties, documents untouched, duplicate reference, other tenant; vitest action; e2e |
| 15 | Server actions reported success for 0-row updates: company/product edit and archive, role change, member removal, allocation removal. | All read back with `.select()` scoped by `org_id` and say what happened ("Only an owner can change roles."). | vitest row-count suite |
| 16 | Validation gaps: Incoterm accepted any 4 characters (DB error), no named place required, country codes of 1 letter, "1,5" rejected as a quantity, unlimited decimal places silently rounded, dimensions of 0 hit a DB check, package gross < net reached the DB. | `src/lib/trade/inputs.ts` (exact `decimalField`, HS code with dots, calendar date, Incoterms list) used by every trade form; Incoterm requires its named place; shipping date field added. | vitest `packing-and-inputs`, `shipment-actions` |
| 17 | Generation message did not say which number was issued or that one was replaced; e2e and copy updated. | Notice names the number and the superseded revision. | vitest, e2e |
| 18 | ZIP manifest gave no per-document detail and its checksum block was mixed with other lines. | Checksum lines stay `sha256sum -c` compatible; a "Documents" block lists number, type, revision and time; excluded stale documents are listed with their reason. | Covered by e2e set download (status/headers) |

## Not done, and why

- **Amounts in words:** not simple and correct across currencies, minor units and languages; left out rather than half-right.
- **Company logo:** needs a private bucket, RLS on storage paths, upload size/type bounds and image embedding in the PDF writer. Recommend as its own task.
- **Org-level documents list** still flags staleness by revision only (one preview per shipment would be needed); the shipment page and the ZIP use the content comparison.
- **CJK names** still render as replacement glyphs (no CJK face embedded); unchanged and stated in `tests/unit/pdf.test.ts`.
- Entitlement gating of generation is billing's scope and was not touched.

## Migration and rollback

`20261006000300_document_lineage.sql` and `20261006000400_shipment_reuse_and_import.sql`.
Neither rewrites data; both carry rollback notes in their headers. After rollback, schema 4
documents keep rendering as issued only while renderer `tradedocs-pdf/4` stays deployed.
