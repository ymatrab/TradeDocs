# Content inventory and plan

Proposed owner: Content Lead; named assignment pending. Route indexation, metadata and structured data are governed by [SEO.md](SEO.md); regulated wording by [LEGAL.md](LEGAL.md). Last reviewed: 2026-10-05.

## Current public pages

| Route                         | Intent                                                                                   | Conversion role                                      | Sources cited                       |
| ----------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------- | ----------------------------------- |
| `/`                           | Product: one shipment record, the whole document set                                     | Primary sign-up (or free tools when accounts closed) | —                                   |
| `/tools`                      | Hub for the free tools                                                                   | Routes visitors to a tool                            | —                                   |
| `/tools/invoice-generator`    | Transactional: produce a commercial invoice, proforma or packing list PDF without signup | Core-action tool; account offer for repeat shipments | US CBP 19 CFR 141.86, EU UCC, ICC   |
| `/tools/cbm-calculator`       | Calculate CBM from carton dimensions; check typical container fit                        | Tool; points to packing-list workflow                | Maersk dry container specifications |
| `/tools/chargeable-weight`    | Volumetric vs actual weight by mode                                                      | Tool; points to saved product weights                | IATA, DHL Express, FedEx, UPS       |
| `/tools/incoterms`            | Informational: compare all eleven Incoterms® 2020 rules                                  | Reference; points to term + place on every document  | ICC Incoterms® 2020                 |
| `/tools/incoterms/[code]` ×11 | Informational: one rule — carriage, risk, clearance, insurance, example, mistakes, FAQ   | Reference; same                                      | ICC Incoterms® 2020                 |

Every tool CTA follows `primaryAction(isDatabaseConfigured())`, so no page offers sign-up while accounts are closed. Rule pages are generated from `src/lib/trade/incoterms.ts`; their FAQ data (`faq`, `incotermFaq()`, `INCOTERMS_HUB_FAQ`) is exported for the SEO agent's FAQPage JSON-LD so structured data matches visible text.

## Source registry

All cited sources live in [`src/lib/trade/sources.ts`](src/lib/trade/sources.ts) (authority, title, URL, jurisdiction, what it supports, retrieval date, reviewer) and render through `SourcesBlock` on the Incoterms hub and rule pages, CBM, chargeable weight and invoice generator pages. Each URL was opened on 2026-10-05 and checked against its claim; the eCFR page refuses automated readers, so 19 CFR 141.86 was checked through the eCFR's own renderer API.

Not yet sourced, kept with existing hedging: the 333 kg/m³ European road groupage convention and the 1 t/m³ sea LCL W/M convention (`VOLUMETRIC_RULES` in `src/lib/trade/calculations.ts`). Container capacities in the calculator are typical figures; Maersk's sheet (33/67/76/85 m³) is cited as an example and the calculator's own constants were not changed.

## Review status

- Every source record: reviewer **pending owner review**. This is not an approval.
- Incoterms® summaries: drafted from ICC 2020 positions (FCA A6/B6 on-board bill of lading option, DAP import-clearance delay costs on the buyer, CIP ICC (A) / CIF ICC (C) cover); legal review pending.
- Certificate of origin: not offered; `REGULATED_DOCUMENT_LIMITATION` states it is pending legal and regulatory review (D-002).
- Worked examples on rule pages use invented parties and say so.

## Next pages (backlog)

Each item is **planned — needs keyword data** (competitor page export from the SEO agent) before a brief is written. None will be published without measured demand or a clear conversion role.

| Planned page                    | Likely intent                                       | Conversion role                                       |
| ------------------------------- | --------------------------------------------------- | ----------------------------------------------------- |
| HS code guide                   | How to find and state an HS code on an invoice      | Feeds the invoice generator's HS field                |
| Certificate of origin explainer | What a CoO is, who issues it, preferential vs not   | Informational only while the CoO feature is gated     |
| Packing list template and guide | Download/fill a packing list; what it must agree on | Packing list output of the generator; saved shipments |
| Trade document glossary         | Definitions (CBM, W/M, B/L, proforma, consignee …)  | Internal links into tools and Incoterms® pages        |
