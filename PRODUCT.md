# TradeDocs product contract

Status: planning baseline for the full production product; Task 01 is in progress. No feature, vendor configuration, approval or launch readiness is implied by this document. Source: `TradeDocs_Production_Build_Plan.pdf`, version 1.0, 6 September 2026.

Proposed owner: Product Lead; named assignment pending. Review on every scope, pricing, entitlement, supported document/jurisdiction or launch decision, and monthly after launch. Last reviewed: 2026-09-06.

## Promise and audience

Capture company, customer and product information once and reuse it to create coherent trade-document sets and repeat shipment history. Serve small exporters/importers, manufacturers, wholesalers, freight operations teams, trade consultants preparing drafts and internal support/compliance operators.

The commercial product must include a reusable master-data workspace, shipment records, immutable document revisions, secure PDF delivery, payments and entitlements, collaboration, free acquisition tools, editorial review and operated production infrastructure. [ROADMAP.md](ROADMAP.md) preserves all 25 delivery contracts; a working foundation is not a completed product.

## Required workflows

1. Verify an account, create/join an organization and manage owner/admin/member access.
2. Save company, customer, supplier, address and product data; preview and validate CSV imports.
3. Build a shipment from saved records, allocate items to packages and resolve concurrent changes.
4. Validate document-specific inputs, preview and finalize immutable revisions. Identify stale outputs when source fields change.
5. Purchase access through a provider-neutral Payment Links flow; verified webhooks control entitlements.
6. Generate a consistent set, inspect per-document progress, download a checksummed ZIP, deliver secure links and retrieve history.
7. Reuse earlier data for a second shipment without modifying historical artifacts.

Document families: Commercial Invoice, Proforma Invoice, Packing List, Purchase Order, Quotation, Sales Order, Delivery Note, Certificate of Origin preparation template and constrained BOL-style/shipping-instruction draft. The last two require reviewed legal labels and feature gating.

Acquisition tools: CBM, dimensional weight, bounded landed-cost estimation using explicit assumptions, Incoterms education/selection and anonymous Commercial Invoice, Packing List and Proforma generators with short retention and one-time account claiming.

## Boundaries

TradeDocs is not a customs broker, carrier, chamber, issuing authority, legal adviser, sanctions-screening service or tariff classifier. It does not establish official origin, customs clearance, title, legal compliance, regulated signatures or endorsement. User-entered origin, HS codes and tax rates remain user declarations unless a separately approved verification process exists. No negotiable transport document workflow is authorized by this specification.

## Commercial decisions awaiting humans

Product and finance must select the payment provider, currencies, actual prices, plans, quotas, refund/dispute policy and support commitments before production checkout is enabled. Product/legal must approve supported jurisdictions, disclosures, privacy/retention terms and external endorsement handling. Operations must approve domain, vendor projects, residency, recovery objectives and launch ownership. There are no approved values or named approvers yet.

## Success measures

Measure verified traffic-to-paid conversion, successful tool-to-workspace claiming, time to first coherent set, returning organizations creating a second shipment, data reuse, set generation reliability, reconciled revenue and support burden. Establish baselines before setting conversion targets. Required quality targets are 99.9% monthly availability for authenticated/purchase flows, WCAG 2.2 AA and public-page p75 LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1. [ANALYTICS.md](ANALYTICS.md) defines measurement ownership.
