# Content inventory and plan

Proposed owner: Content Lead; named assignment pending. Route indexation, metadata and structured data are governed by [SEO.md](SEO.md); regulated wording by [LEGAL.md](LEGAL.md). Plan of record: [docs/research/content-plan-2026-10-05.md](docs/research/content-plan-2026-10-05.md). Last reviewed: 2026-10-05.

## Current public pages

| Route                                    | Intent (target query)                                                         | Conversion role                                                                     | Sources cited                                                         |
| ---------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `/`                                      | Product: one shipment record, the whole document set                          | Primary sign-up (or free tools when accounts closed); links to the three generators | —                                                                     |
| `/tools`                                 | Hub for the free tools and the guides                                         | Routes visitors to a tool                                                           | —                                                                     |
| `/tools/invoice-generator`               | Transactional: commercial invoice template / generator; what each field means | Core-action tool; account offer for repeat shipments                                | US CBP 19 CFR 141.86, ITA commercial invoice, EU UCC, ICC             |
| `/tools/proforma-invoice-generator`      | Transactional: proforma invoice template; "what is a proforma invoice"        | Same generator preset to proforma                                                   | ITA pro forma invoice, US CBP 19 CFR 141.85, ICC                      |
| `/tools/packing-list-generator`          | Transactional: export packing list template; what goes on one                 | Same generator preset to packing list                                               | ITA packing list, ITA commercial invoice                              |
| `/tools/cbm-calculator`                  | Calculate CBM from carton dimensions; CBM ↔ cubic feet; container fit         | Tool; points to packing-list workflow                                               | Maersk dry container specifications, NIST SP 811 B.9                  |
| `/tools/chargeable-weight`               | Dimensional (volumetric) weight calculator; chargeable weight by mode         | Tool; points to saved product weights                                               | IATA, DHL Express, FedEx, UPS                                         |
| `/tools/landed-cost-calculator`          | Landed cost estimate from user-entered rates; cost per unit                   | Tool; points to the invoice and DAP vs DDP guide                                    | WTO customs valuation, ICC                                            |
| `/tools/incoterms`                       | Informational: Incoterms 2020 chart and all eleven rules compared             | Reference; points to term + place on every document                                 | ICC Incoterms® 2020                                                   |
| `/tools/incoterms/[code]` ×11            | Informational: one rule; EXW, FCA, DAP, DDP and FOB titled by search phrasing | Reference; same                                                                     | ICC Incoterms® 2020                                                   |
| `/guides`                                | Hub for the guides                                                            | Routes to a guide and its tools                                                     | —                                                                     |
| `/guides/lcl-vs-fcl`                     | Informational: LCL vs FCL, less than container load                           | Feeds CBM, dimensional weight, packing list                                         | Maersk FCL vs LCL, Maersk containers, ICC                             |
| `/guides/dap-vs-ddp`                     | Informational: DAP vs DDP                                                     | Feeds Incoterms, landed cost, invoice                                               | ICC, ITA commercial invoice                                           |
| `/guides/proforma-vs-commercial-invoice` | Informational: proforma vs commercial invoice                                 | Feeds both generators and the packing list                                          | ITA pro forma and commercial invoice, US CBP 19 CFR 141.85 and 141.86 |

Every tool CTA follows `primaryAction(isDatabaseConfigured())`, so no page offers sign-up while accounts are closed. Rule pages are generated from `src/lib/trade/incoterms.ts` (including the optional `search` title, heading and lead, and `INCOTERMS_CHART` for the hub chart); guides from `src/lib/content/guides.ts`. FAQ data is exported so FAQPage JSON-LD matches visible text; guides also carry Article and BreadcrumbList JSON-LD with a team byline. The tool list, sitemap, llms.txt and related-tools block all read `PUBLIC_TOOLS` and `GUIDES`, and the home "free tools" count is `PUBLIC_TOOLS.length`.

The landed cost calculator has no tariff or tax data: every rate and both valuation bases are entered by the visitor, arithmetic is exact decimal in `src/lib/trade/landed-cost.ts` (unit-tested), and the page lists its assumptions with a not-advice note.

## Source registry

All cited sources live in [`src/lib/trade/sources.ts`](src/lib/trade/sources.ts) (authority, title, URL, jurisdiction, what it supports, retrieval date, reviewer) and render through `SourcesBlock`. Each URL was opened on 2026-10-05 and checked against its claim. The eCFR pages refuse automated readers, so 19 CFR 141.85 and 141.86 were checked through the eCFR versioner API; the Maersk FCL vs LCL article was read from its HTML because the fetch tool rejected its headers.

Added 2026-10-05: ITA pro forma invoice, commercial invoice and packing list pages; 19 CFR 141.85; NIST SP 811 Appendix B.9 (ft³ factor); Maersk FCL vs LCL; WTO customs valuation technical information.

Not yet sourced, kept with existing hedging: the 333 kg/m³ European road groupage convention and the 1 t/m³ sea LCL W/M convention (`VOLUMETRIC_RULES` in `src/lib/trade/calculations.ts`; the LCL guide says "commonly"). Container capacities in the calculator are typical figures; Maersk's sheet (33/67/76/85 m³) is cited as an example and the calculator's own constants were not changed.

## Review status

- Every source record: reviewer **pending owner review**. This is not an approval.
- Incoterms® summaries and the responsibilities chart: drafted from ICC 2020 positions (FCA A6/B6 on-board bill of lading option, DAP import-clearance delay costs on the buyer, CIP ICC (A) / CIF ICC (C) cover, DPU the only rule with seller unloading); legal review pending.
- Guides: written 2026-10-05 by the TradeDocs team, last reviewed against their sources the same day; no named author, no statistics; each guide and the hub carry a credited, hotlinked Unsplash cover (D-016, see SEO.md "Images"). Customs statements are general and hedged; the DDP import-VAT point and the US pro forma invoice (19 CFR 141.85) want a broker or legal read before indexing opens.
- Certificate of origin: not offered and not written about; `REGULATED_DOCUMENT_LIMITATION` states it is pending legal and regulatory review (D-002).
- Worked examples on rule pages use invented parties and say so.

## Next pages (backlog)

Ordered by the content plan. Each needs a brief before writing; none is published without measured demand or a clear conversion role.

| Planned page                                            | Demand (US/mo, plan)                              | Conversion role                                           |
| ------------------------------------------------------- | ------------------------------------------------- | --------------------------------------------------------- |
| How to fill out a commercial invoice (guide)            | PAA on "commercial invoice" 3,600                 | Feeds the invoice generator; names 19 CFR 141.86          |
| Filled example image on the invoice generator           | Image pack on "commercial invoice template" 2,400 | Needs a real rendered PDF image, credited                 |
| FCA vs FOB, EXW vs FOB, CIF vs FOB (blog pairs)         | 720 / 320 / 320                                   | Incoterms pages; each states the cited ICC position       |
| Certificate of origin explainer                         | 4,400                                             | Informational only while the CoO feature is gated (D-002) |
| Cartons/pallets in a 20/40 ft container (CBM extension) | 390                                               | Extends the CBM calculator                                |
| HS codes on an invoice (P3)                             | head term KD 74                                   | Feeds the invoice generator's HS field                    |
| Trade document glossary                                 | not measured                                      | Internal links into tools and Incoterms® pages            |

Excluded keywords stay excluded (see the plan's "Excluded" list): fake or undervalued documents, travel packing lists, packing slips, FOB slang and key fobs, vehicle certificates of origin, carrier-navigational invoice queries, and out-of-scope templates.
