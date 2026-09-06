# Legal and regulatory controls

Status: internal implementation requirements, not approved customer-facing legal terms or legal advice. No jurisdiction, source claim or production legal copy has been approved.

Proposed owner: Legal/qualified Trade Reviewer with Product and Privacy Leads; named assignments pending. Review before enabling a document/jurisdiction, changing regulated copy/schema/formulas, processing new data or adding a subprocessor; monthly primary-source backstop and quarterly workflow review. Last reviewed: 2026-09-06.

## Product boundaries

The specification limits TradeDocs to a shipment workspace and preparation tooling. Do not imply government, customs, carrier, chamber or other authority issuance, endorsement, legal compliance, transport title or negotiability. Tax fields, origin and HS codes entered by users are declarations. Sanctions screening, tariff classification, regulated e-signature and official issuance cannot be claimed without separately approved providers and validated workflows.

Certificate of Origin preparation requires the specification's label “Preparation template - not an issued certificate,” no simulated seals/signatures, private evidence attachments and an externally endorsed state supported by issuer/reference/evidence and audit. BOL-style output requires approved shipping-instructions/draft terminology and persistent legal status; it cannot assert carrier receipt, title, negotiability or a contract of carriage. Labels must survive UI, preview, PDF, ZIP metadata and email where applicable; branding cannot remove them.

## Required source registry

Before enabling a high-risk claim, record source URL and authority, jurisdiction, effective interval, retrieval date, reviewer name, approval status/date, applicable Incoterms edition/licensing notes, affected schema/template/copy versions, test references, rollout owner and next review date. Use official primary sources for trade/customs/origin/privacy/payment/platform rules. Retrieval alone is not approval. This baseline records the product specification, not authoritative regulatory sources.

States must distinguish draft, awaiting review, approved, expired/superseded and disabled. A stale/unapproved/missing record blocks the affected production claim or calculation through a feature flag with a clear limitation. Authoritative change alerts create human review work; they must not autonomously change legal behavior. A change must identify every affected document, page, template, formula and regression fixture and preserve historical versions.

## Approval checkpoints

| Trigger | Required named reviewer/evidence |
| --- | --- |
| New country/chamber workflow, legal document name or endorsement handling | Qualified trade/legal approval of source-backed copy and visible outputs |
| Incoterms content or new rules/calculators | Source/version/licensing review; formula/assumption evidence; affected-version map |
| Customer policies or commercial launch | Product/legal approval of actual terms, privacy notice, refunds, pricing/entitlements and support |
| New residency/subprocessor/retention or deletion behavior | Privacy/operations review of data map, executable periods and customer disclosures |
| Official-status ambiguity or changed authoritative guidance | Disable affected feature promptly; assess customers/artifacts; reviewed correction and rollout |

Before launch, obtain actual approved terms/privacy/cookie and commercial policies for the chosen business and jurisdictions. Do not generate invented policy text to satisfy route completeness. Production credentials, legal/regulatory sign-off and go-live require named human decisions recorded in the repository; an AI cannot self-approve. Task 24 must evidence a source-change drill, monthly review and quarterly workflow review. See [DECISIONS.md](DECISIONS.md) for staged registry dependencies.
