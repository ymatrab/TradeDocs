# Content plan v3: toward 250 public pages — 2026-10-07

Plan of record for D-022 (at least 250 public pages including 100 blog posts, GEO/AEO-led, conversion first), under D-019 (trade-document keywords only) and D-014 (DataForSEO cap). It extends [content-plan-v2-2026-10-06.md](content-plan-v2-2026-10-06.md): every v2 row that is not yet published is carried here with its v2 slug, keyword and angle, re-sorted into waves. v2's briefs, sources table and exclusions still apply; this file only adds to them.

Data: DataForSEO Labs, Google, English. United States unless marked UK. New data is in [`dataforseo-2026-10-07/`](dataforseo-2026-10-07/) (files 01–06); the v2 appendix (234 rows) and the 2026-10-05 and 2026-10-06 files were reused first. Vol = monthly searches. KD = keyword difficulty (0–100), "n/a" where DataForSEO returned none. Close variants overlap, so volumes are never summed into a total, only listed. Every v3 number traces to a row in the appendix at the end, generated from the saved files.

## The honest answer first

Measured demand supports **224 public pages** (63 live + 161 new) without thin or per-variant padding. Reaching 250 needs 26 more pages from one of two routes that the owner should choose between (wave E below): 20 help-centre articles (support and conversion role, no search demand claimed) plus 6 glossary terms between 100 and 199 searches a month, or more research (the call list under "DataForSEO usage"). The blog reaches **100 posts** on demand and named conversion roles alone.

## Current public pages: 63

Counted from `SITEMAP_PAGES` in `src/lib/seo/site.ts` and the generated routes it maps (legal pages excluded while they are unapproved drafts):

| Group                                             | Pages  |
| ------------------------------------------------- | ------ |
| `/`, `/tools`, `/pricing`                         | 3      |
| Tool pages (`PUBLIC_TOOLS`)                       | 7      |
| Incoterms® rule pages (`/tools/incoterms/[code]`) | 11     |
| `/guides` hub + 13 guides                         | 14     |
| `/blog` hub + 25 posts                            | 26     |
| `/help`, `/contact`                               | 2      |
| **Total**                                         | **63** |

## Page counts

| Type                                                                                     | Live   | New (waves A–D) | After A–D | Wave E (owner choice) | After E |
| ---------------------------------------------------------------------------------------- | ------ | --------------- | --------- | --------------------- | ------- |
| Blog posts                                                                               | 25     | 75              | 100       | 0                     | 100     |
| Guides                                                                                   | 13     | 25              | 38        | 0                     | 38      |
| Glossary (hub + term pages)                                                              | 0      | 39              | 39        | 6                     | 45      |
| Export documents by country (hub + countries)                                            | 0      | 11              | 11        | 0                     | 11      |
| Free tools (new pages)                                                                   | 7      | 8               | 15        | 0                     | 15      |
| Use-case pages                                                                           | 0      | 3               | 3         | 0                     | 3       |
| Help articles                                                                            | 0      | 0               | 0         | 20                    | 20      |
| Incoterms® rule pages                                                                    | 11     | 0               | 11        | 0                     | 11      |
| Hubs and site pages (`/`, `/tools`, `/pricing`, `/guides`, `/blog`, `/help`, `/contact`) | 7      | 0               | 7         | 0                     | 7       |
| **Total**                                                                                | **63** | **161**         | **224**   | **26**                | **250** |

Waves: **A 40, B 42, C 42, D 37** (161), then **E 26**. Wave A is chosen by volume × conversion fit: the new tools, the highest-volume terms and posts, and the product-led posts that turn a reader into a document.

## How v3 pages were chosen

1. **Demand or a named conversion role.** Each page has a primary keyword with measured volume, or is marked "conversion role" (product-led posts, use-case pages, help articles).
2. **One intent, one URL.** A query owned by a live tool, rule page, guide or post stays there (see "Routed to existing pages"). The glossary hub lists every term but links to the owner page; it creates term pages only for terms nobody owns.
3. **Thresholds.** Glossary term page: the best single phrasing reaches 200 a month (US or UK) and the volume is not dominated by another meaning. Country page: 150 a month across distinct business phrasings (export to / exporting to / shipping to … from us or uk / <country> customs), excluding traveller-dominated heads, and the country has its own official customs source and at least five country-specific facts.
4. **Product fit.** Every page ends at one of the public tools or the workspace. TradeDocs makes commercial invoices, proformas, packing lists and delivery notes (`src/lib/labels.ts`); the certificate of origin stays gated (D-002).
5. **GEO/AEO shape.** Every article, term and country page uses the `ContentArticle` shape (`src/lib/content/article.ts`): a 40–60 word answer first, key facts, question headings, tables for comparisons, FAQ feeding FAQPage JSON-LD, named primary sources.

## Wave A (40 pages)

- **Tools (5):** cbm-to-cubic-feet, pallet-calculator, delivery-note-generator, chargeable-weight/fedex, chargeable-weight/ups.
- **Glossary (8):** the `/glossary` hub, dunnage, teu, verified-gross-mass, waybill, consignor, feu, cbm.
- **Countries (3):** the `/export-documents` hub, mexico, india.
- **Guides (9):** what-is-a-proforma-invoice, how-to-import-into-the-us, cmr-note, air-waybill, export-payment-terms, eccn-ear99-export-licence, importer-of-record, uk-commodity-codes, demurrage-and-detention.
- **Posts (15):** how-to-measure-a-box-for-shipping, how-much-does-a-pallet-weigh, standard-box-sizes-for-shipping, cargo-insurance-for-exporters, importing-from-china-documents, commercial-invoice-example, packing-list-example, how-to-fill-out-a-commercial-invoice, how-to-make-a-packing-list-from-your-invoice, commercial-invoice-and-packing-list-must-match, schedule-b-number, delivery-note-vs-packing-list, cbp-form-7501, how-to-read-the-harmonized-tariff-schedule, customs-status-messages-explained.

## Blog posts: 75 new (100 total)

Tool short names as in v2: **invoice**, **proforma**, **packing**, **cbm**, **weight**, **landed**, **incoterms**, plus the new **delivery** (`/tools/delivery-note-generator`), **converter** (`/tools/cbm-to-cubic-feet`), **pallet** (`/tools/pallet-calculator`), **container** (`/tools/container-loading-calculator`), **price** (`/tools/export-price-calculator`) and **workspace** (account creation). "v2 #n" rows keep the v2 angle and sources.

### New in v3 (40)

| Slug                                           | Type        | Primary keyword                                                                                                 | US vol   | KD  | Intent | Conversion target   | Wave |
| ---------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------- | -------- | --- | ------ | ------------------- | ---- |
| how-to-measure-a-box-for-shipping              | how-to      | lxwxh (also how to measure a box for shipping 1,600; length width height order 1,300; box dimensions order 480) | 8,100    | n/a | info   | cbm, weight         | A    |
| how-much-does-a-pallet-weigh                   | question    | how much does a pallet weigh (pallet weight 1,000)                                                              | 1,900    | n/a | info   | packing             | A    |
| standard-box-sizes-for-shipping                | reference   | standard box sizes for shipping                                                                                 | 1,300    | 26  | info   | cbm                 | A    |
| cargo-insurance-for-exporters                  | explainer   | cargo insurance (marine cargo insurance 720; freight insurance 390); ICC (A)/(C) under CIP/CIF                  | 2,400    | n/a | comm.  | incoterms           | A    |
| importing-from-china-documents                 | how-to      | importing from china (shipping from china to us 1,000 / KD 2)                                                   | 2,400    | 32  | info   | invoice, landed     | A    |
| commercial-invoice-example                     | example     | commercial invoice example (commercial invoice sample 390)                                                      | 390      | 22  | trans. | invoice             | A    |
| packing-list-example                           | example     | packing list example (packing list sample 210; packing list format 210)                                         | 390      | 10  | info   | packing             | A    |
| how-to-fill-out-a-commercial-invoice           | product-led | how to fill out a commercial invoice (how to create 50; how to make 30)                                         | 70       | 20  | info   | invoice             | A    |
| how-to-make-a-packing-list-from-your-invoice   | product-led | how to make a packing list                                                                                      | 40       | n/a | info   | packing, workspace  | A    |
| commercial-invoice-and-packing-list-must-match | product-led | commercial invoice and packing list (ci pl 30; invoice and packing list 30)                                     | 40       | n/a | info   | workspace           | A    |
| skid-vs-pallet                                 | comparison  | skid vs pallet                                                                                                  | 1,300    | n/a | info   | packing             | B    |
| what-is-customs-clearance                      | question    | what is customs clearance (v2 appendix; customs clearance process 140)                                          | 1,000    | 23  | info   | invoice             | B    |
| how-to-calculate-shipping-cost                 | how-to      | how to calculate shipping cost (no rates of our own: chargeable weight and CBM inputs only)                     | 1,900    | 49  | info   | weight, cbm         | B    |
| mawb-vs-hawb                                   | comparison  | mawb (hawb 720; mawb vs hawb 50)                                                                                | 720      | n/a | info   | weight              | B    |
| shipping-container-weight-limits               | reference   | shipping container weight (pallet weight limit 90)                                                              | 720      | n/a | info   | container           | B    |
| freight-prepaid-vs-freight-collect             | comparison  | freight collect vs prepaid (freight collect 480; freight terms 480)                                             | 480      | 12  | comm.  | incoterms           | B    |
| how-many-cbm-fit-in-a-container                | question    | how many cbm in a 40ft container (20ft 170; 20ft container cbm 210)                                             | 320      | 9   | info   | container           | B    |
| paperless-commercial-invoice                   | how-to      | ups paperless invoice (carrier facts from each carrier's live page, dated)                                      | 260      | n/a | comm.  | invoice             | B    |
| uk-import-duty                                 | explainer   | uk import duty (UK; customs duty uk 2,900)                                                                      | UK 2,900 | 24  | info   | landed              | B    |
| how-to-make-a-proforma-invoice                 | product-led | how to make a proforma invoice (how to create 20)                                                               | 20       | 9   | info   | proforma            | B    |
| proforma-to-commercial-invoice                 | product-led | conversion role: the accepted proforma becomes the commercial invoice without retyping                          | n/a      | n/a | trans. | workspace           | B    |
| delivery-note-from-packing-list                | product-led | delivery note vs invoice (conversion role)                                                                      | 50       | n/a | info   | delivery, workspace | B    |
| how-to-start-an-import-export-business         | guide-post  | import export business (how to start import export business 140)                                                | 1,000    | 25  | comm.  | workspace           | C    |
| letter-of-indemnity                            | explainer   | letter of indemnity (shipping sense; SERP check before writing)                                                 | 2,400    | n/a | info   | packing             | C    |
| pre-shipment-inspection                        | explainer   | third party inspection (inspection certificate 260; pre shipment inspection 70)                                 | 390      | n/a | info   | invoice             | C    |
| cbp-form-3461                                  | explainer   | cbp form 3461 (customs entry 170; entry summary 110; informal entry 70)                                         | 320      | n/a | info   | invoice             | C    |
| partial-shipments                              | explainer   | partial shipment (split shipment 140)                                                                           | 320      | n/a | info   | invoice, packing    | C    |
| cbp-customs-exam                               | question    | cbp exam (customs inspection 170; customs exam 50)                                                              | 260      | 6   | info   | invoice             | C    |
| who-pays-import-duties                         | question    | who pays import duties (who pays customs duties 20)                                                             | 90       | 26  | info   | incoterms, landed   | C    |
| export-compliance-checklist                    | checklist   | export compliance (v2 appendix; export compliance program 90)                                                   | 320      | 23  | comm.  | invoice             | C    |
| fca-vs-dap                                     | comparison  | fca vs dap                                                                                                      | 110      | n/a | info   | incoterms           | C    |
| fob-vs-dap                                     | comparison  | fob vs dap                                                                                                      | 70       | n/a | info   | incoterms           | C    |
| zero-rating-exports-vat-uk                     | explainer   | vat on exports (UK; proof of export 40)                                                                         | UK 140   | 8   | info   | invoice             | C    |
| reuse-shipment-data-for-repeat-orders          | product-led | conversion role: second shipment from saved records                                                             | n/a      | n/a | trans. | workspace           | C    |
| add-logo-and-signature-to-export-documents     | product-led | conversion role: Pro PDF branding (D-021); no price until PRICES_APPROVED                                       | n/a      | n/a | trans. | workspace (Pro)     | C    |
| first-sale-rule                                | explainer   | first sale rule                                                                                                 | 210      | n/a | info   | landed              | D    |
| invoice-legalization                           | explainer   | legalized invoice (consular invoice 20)                                                                         | 140      | n/a | info   | invoice             | D    |
| commercial-invoice-for-returns-and-repairs     | how-to      | american goods returned (UK returned goods relief 260)                                                          | 90       | 1   | info   | invoice             | D    |
| cif-vs-dap                                     | comparison  | cif vs dap                                                                                                      | 50       | n/a | info   | incoterms           | D    |
| exw-vs-dap                                     | comparison  | exw vs dap                                                                                                      | 50       | n/a | info   | incoterms           | D    |

### Carried from v2 (35)

| Slug                                       | Type               | Primary keyword                                                                            | US vol   | KD  | Intent | Conversion target | Wave |
| ------------------------------------------ | ------------------ | ------------------------------------------------------------------------------------------ | -------- | --- | ------ | ----------------- | ---- |
| schedule-b-number                          | v2 #40             | schedule b number                                                                          | 1,000    | 11  | info   | invoice           | A    |
| delivery-note-vs-packing-list              | v2 #44             | delivery note (UK 880; delivery note template UK 480)                                      | 390      | n/a | trans. | delivery          | A    |
| cbp-form-7501                              | v2 #45             | us customs form 7501                                                                       | 1,600    | 17  | info   | invoice           | A    |
| how-to-read-the-harmonized-tariff-schedule | v2 #52             | harmonized tariff schedule                                                                 | 6,600    | 35  | info   | landed            | A    |
| customs-status-messages-explained          | v2 #60             | import customs clearance completed                                                         | 1,600    | n/a | info   | invoice           | A    |
| taric-and-cn-codes                         | v2 #53             | taric                                                                                      | 1,900    | 8   | info   | invoice           | B    |
| proforma-invoice-for-customs               | v2 #31             | proforma invoice for customs                                                               | 50       | 13  | trans. | proforma          | B    |
| cn22-vs-cn23                               | v2 #33             | cn22 (cn23 UK 590)                                                                         | 170      | n/a | info   | invoice           | B    |
| declared-value-for-customs                 | v2 #36             | declared value                                                                             | 390      | n/a | info   | invoice           | B    |
| container-load-plan                        | v2 #41             | container load plan                                                                        | 70       | 7   | info   | container         | B    |
| tt-payment                                 | v2 #43             | tt payment                                                                                 | 320      | 3   | info   | proforma          | B    |
| postponed-vat-accounting                   | v2 #50             | postponed vat accounting (UK)                                                              | UK 1,000 | 1   | info   | landed            | B    |
| pi-and-po                                  | v2 #56, retargeted | pi meaning in business (pi and po 110); replaces "proforma invoice vs purchase order" (10) | 140      | n/a | info   | proforma          | B    |
| how-to-ship-a-pallet-internationally       | v2 #58             | how to ship a pallet (how to wrap a pallet 140; how to stack boxes on a pallet 110)        | 140      | n/a | info   | pallet            | B    |
| cif-vs-cip                                 | v2 #26             | cip vs cif                                                                                 | 140      | n/a | info   | incoterms         | C    |
| exw-vs-ddp                                 | v2 #27             | exw vs ddp                                                                                 | 110      | n/a | info   | incoterms         | C    |
| proforma-invoice-vs-quotation              | v2 #32             | proforma invoice vs quotation                                                              | 70       | 6   | info   | proforma          | C    |
| air-freight-vs-sea-freight                 | v2 #35             | air freight vs sea freight                                                                 | 70       | n/a | comm.  | weight            | C    |
| shipping-to-the-uk-and-eu-documents        | v2 #38             | how to ship to uk from us                                                                  | 90       | 19  | info   | invoice           | C    |
| export-packing                             | v2 #42             | export packing (UK 140)                                                                    | 90       | n/a | comm.  | packing           | C    |
| uk-export-declaration                      | v2 #51             | export declaration (UK)                                                                    | UK 210   | 3   | info   | invoice           | C    |
| commercial-invoice-declaration-statement   | v2 #30             | commercial invoice declaration statement                                                   | 110      | n/a | info   | invoice           | C    |
| customs-bond                               | v2 #49             | customs bond (continuous bond 210)                                                         | 880      | n/a | comm.  | landed            | C    |
| shipping-invoice-vs-commercial-invoice     | v2 #55             | shipping invoice                                                                           | 320      | n/a | info   | invoice           | C    |
| cfr-vs-cif                                 | v2 #28             | cfr vs cif                                                                                 | 90       | 11  | info   | incoterms         | D    |
| cif-vs-ddp                                 | v2 #29             | cif vs ddp                                                                                 | 90       | n/a | info   | incoterms         | D    |
| incoterms-for-air-freight                  | v2 #39             | incoterms for air freight                                                                  | 70       | 5   | info   | incoterms         | D    |
| dap-vs-dpu                                 | v2 #46             | dap vs dpu (conversion role)                                                               | 20       | n/a | info   | incoterms         | D    |
| fob-vs-cfr                                 | v2 #47             | fob vs cfr                                                                                 | 50       | n/a | info   | incoterms         | D    |
| ocean-freight-surcharges                   | v2 #48             | terminal handling charges                                                                  | 50       | n/a | info   | landed            | D    |
| freight-quote-checklist                    | v2 #54             | how to get a freight quote (conversion role)                                               | 10       | 17  | info   | packing           | D    |
| aes-exemptions                             | v2 #57             | aes exemption                                                                              | 260      | 11  | info   | invoice           | D    |
| uk-export-licence                          | v2 #59             | export licence (UK)                                                                        | UK 320   | 5   | info   | invoice           | D    |
| power-of-attorney-for-customs              | v2 #37             | power of attorney customs                                                                  | 140      | n/a | trans. | invoice           | D    |
| letter-of-credit-documents                 | v2 #34             | letter of credit documents (conversion role)                                               | 30       | n/a | info   | invoice           | D    |

Product-led posts (8) show the real product: screenshots of the live UI only, behaviour checked in code before writing, no invented results, and the CTA to the generator or workspace. They sit in waves A–C so each wave has a conversion path.

## Guides: 25 new (38 total)

| Slug                                | Type             | Primary keyword                                                                        | US vol    | KD  | Intent | Conversion target | Wave |
| ----------------------------------- | ---------------- | -------------------------------------------------------------------------------------- | --------- | --- | ------ | ----------------- | ---- |
| what-is-a-proforma-invoice          | new              | what is a proforma invoice (proforma invoice meaning 2,400; definition 320)            | 4,400     | 6   | info   | proforma          | A    |
| how-to-import-into-the-us           | new              | importing into the us (how to import 880)                                              | 4,400     | 41  | info   | landed, invoice   | A    |
| cmr-note                            | new              | cmr (UK; cmr document UK 390; road consignment note under the CMR Convention)          | UK 2,900  | 2   | info   | packing           | A    |
| air-waybill                         | v2 #17           | air waybill (what is an air waybill 880)                                               | 5,400     | 10  | info   | weight            | A    |
| export-payment-terms                | v2 #18           | letter of credit (what is a letter of credit 2,400; documentary credit 1,000)          | 5,400     | 15  | info   | proforma          | A    |
| eccn-ear99-export-licence           | v2 #19           | eccn (ear99 3,600; eccn lookup 720; commerce control list 40,500, anomaly, not quoted) | 3,600     | n/a | info   | invoice           | A    |
| importer-of-record                  | v2 #23           | importer of record                                                                     | 1,300     | n/a | info   | landed            | A    |
| uk-commodity-codes                  | v2 #24           | commodity code (UK; tariff code UK 4,400)                                              | UK 12,100 | 18  | info   | invoice           | A    |
| demurrage-and-detention             | v2 #26           | demurrage (demurrage meaning 3,600)                                                    | 6,600     | 16  | info   | landed            | A    |
| freight-forwarder-vs-customs-broker | v2 #20           | what is a freight forwarder (freight forwarder meaning 1,600)                          | 2,900     | 11  | info   | packing           | B    |
| customs-value                       | v2 #14           | customs value                                                                          | 260       | 3   | info   | landed            | B    |
| types-of-bill-of-lading             | v2 #16           | straight bill of lading (surrender bill of lading 70)                                  | 720       | n/a | info   | packing           | B    |
| chargeable-weight                   | v2 #21           | volumetric weight (how to calculate dimensional weight 390)                            | 390       | 20  | info   | weight            | B    |
| isf-10-2                            | v2 #25           | isf filing (isf 5 70)                                                                  | 880       | 8   | info   | packing           | B    |
| ispm-15-wood-packaging              | new              | heat treated pallets (ispm 15 1,000; ispm 15 stamp 390)                                | 1,900     | n/a | trans. | packing, pallet   | B    |
| how-to-export-from-the-uk           | new              | exporting from uk (UK)                                                                 | UK 1,000  | 48  | info   | invoice           | B    |
| transit-declarations-t1-ncts        | new              | ncts (UK; t1 document UK 260; tir carnet UK 140)                                       | UK 14,800 | 66  | info   | invoice           | B    |
| duty-drawback                       | v2 #29           | duty drawback                                                                          | 1,000     | 7   | info   | landed            | C    |
| cbm-and-weight-or-measure           | v2 #22           | cbm to kg (kg to cbm 390)                                                              | 390       | 2   | info   | cbm               | C    |
| ioss                                | v2 #27           | ioss (UK 1,000)                                                                        | 590       | 18  | info   | landed            | C    |
| ata-carnet                          | v2 #30           | ata carnet (UK 1,600; temporary admission UK 140)                                      | 1,900     | 36  | info   | invoice           | C    |
| de-minimis                          | v2 #28           | section 321 (fast-changing; cite the live CBP page, date every claim)                  | 260       | n/a | info   | landed            | D    |
| phytosanitary-certificate           | new, review gate | phytosanitary certificate (UK 1,600)                                                   | 2,400     | 7   | info   | invoice           | D    |
| export-health-certificate           | new, review gate | ehc (UK; export health certificate UK 390)                                             | UK 2,400  | 24  | info   | invoice           | D    |
| shipping-to-northern-ireland        | new, review gate | windsor framework (UK; shipping to northern ireland UK 210)                            | UK 1,600  | 17  | info   | invoice           | D    |

v2 guide #15 (international-shipping-terms-glossary, "shipping terms" 2,400) is **replaced by the `/glossary` hub**, which takes its keyword; it is not built as a guide. The phytosanitary, EHC and Northern Ireland guides describe official certificates and procedures we do not issue; they stay noindex until a review record exists (rules/seo-content.md "Review gate").

## Glossary: hub + 38 term pages

**Minimum volume threshold: 200 searches a month** for the best single phrasing (US or UK), with the volume not dominated by another meaning, and no live or planned page that already owns the term. Below 200, or when owned elsewhere, the term is a hub entry (a two-line definition and a link to its owner page), not a page.

| Slug                           | Type              | Primary keyword                                                            | US vol | KD  | Intent | Conversion target | Wave |
| ------------------------------ | ----------------- | -------------------------------------------------------------------------- | ------ | --- | ------ | ----------------- | ---- |
| glossary (hub, `/glossary`)    | hub               | shipping terms (trade terms 880; replaces v2 guide #15)                    | 2,400  | n/a | info   | all tools         | A    |
| dunnage                        | term              | dunnage (dunnage meaning 5,400; what is dunnage 1,900; UK 880)             | 18,100 | n/a | info   | container         | A    |
| teu                            | term              | teu (teu meaning 720; what is teu 720; UK 3,600)                           | 9,900  | 17  | info   | container, cbm    | A    |
| verified-gross-mass            | term              | verified gross mass (vgm 8,100; UK 1,300)                                  | 8,100  | 12  | info   | packing           | A    |
| waybill                        | term              | waybill (what is a waybill 1,900; waybill meaning 880)                     | 5,400  | n/a | nav.   | packing           | A    |
| consignor                      | term              | consignor (consignor vs consignee 1,300; UK 1,300)                         | 2,900  | 35  | nav.   | invoice           | A    |
| feu                            | term              | feu                                                                        | 2,900  | 14  | info   | container         | A    |
| cbm                            | term              | cbm meaning (what is cbm 880; cbm in shipping 170)                         | 1,900  | n/a | info   | cbm, converter    | A    |
| nvocc                          | term              | nvocc (nvocc meaning 590; what is an nvocc 210)                            | 2,900  | 3   | info   | packing           | B    |
| transshipment                  | term              | transshipment (meaning 590; what is 260)                                   | 1,900  | 11  | info   | invoice           | B    |
| freight-all-kinds              | term              | freight all kinds                                                          | 4,400  | n/a | comm.  | landed            | B    |
| exporting                      | term              | what is exporting                                                          | 3,600  | 12  | info   | invoice           | B    |
| importing                      | term              | what is importing                                                          | 3,600  | 12  | info   | landed            | B    |
| shipping-manifest              | term              | shipping manifest (cargo manifest 390)                                     | 1,900  | 7   | info   | packing           | B    |
| proof-of-delivery              | term              | proof of delivery (proof of delivery template 140)                         | 1,000  | 17  | info   | delivery          | B    |
| usppi                          | term              | usppi (what is usppi 170)                                                  | 720    | n/a | info   | invoice           | C    |
| container-seal-number          | term              | container seal (seal number 260)                                           | 720    | n/a | trans. | packing           | C    |
| advance-shipping-notice        | term              | advance shipping notice                                                    | 590    | n/a | info   | packing           | C    |
| master-carton                  | term              | master carton                                                              | 260    | n/a | trans. | packing, pallet   | C    |
| bill-of-exchange               | term              | bill of exchange (what is a bill of exchange 480; sight draft 210; UK 390) | 1,600  | n/a | info   | proforma          | C    |
| customs-declaration            | term              | customs declaration (UK 590)                                               | 1,000  | 42  | info   | invoice           | C    |
| tariff-rate-quota              | term, regulated   | tariff rate quota                                                          | 14,800 | 8   | info   | landed            | C    |
| countervailing-duty            | term, regulated   | countervailing duty                                                        | 720    | 15  | trans. | landed            | C    |
| anti-dumping-duty              | term, regulated   | anti dumping duty                                                          | 590    | 29  | info   | landed            | C    |
| ics2                           | term, regulated   | ics2                                                                       | 1,600  | 32  | info   | invoice           | D    |
| standby-letter-of-credit       | term              | standby letter of credit                                                   | 880    | 7   | info   | proforma          | D    |
| excise-duty                    | term, regulated   | excise duty (UK)                                                           | UK 880 | 13  | info   | landed            | D    |
| gvms                           | term              | gvms (UK; goods vehicle movement service UK 90)                            | UK 880 | n/a | info   | invoice           | D    |
| break-bulk                     | term              | break bulk (breakbulk cargo 390)                                           | 590    | 47  | info   | packing           | D    |
| container-freight-station      | term              | what is a cfs (container freight station 320)                              | 390    | 40  | info   | cbm               | D    |
| import-license                 | term, regulated   | import license                                                             | 390    | 28  | info   | proforma          | D    |
| re-export                      | term, regulated   | re export                                                                  | 390    | n/a | info   | invoice           | D    |
| routed-export-transaction      | term, regulated   | routed export transaction                                                  | 260    | n/a | comm.  | invoice           | D    |
| country-of-origin              | term, review gate | country of origin (country of origin meaning 1,900; UK 1,000)              | 12,100 | 9   | info   | invoice           | D    |
| in-bond-shipment               | term              | in bond (in bond shipment 170)                                             | 320    | n/a | info   | invoice           | D    |
| duty-deferment-account         | term, regulated   | duty deferment account (UK)                                                | UK 260 | 6   | info   | landed            | D    |
| general-average                | term              | general average                                                            | 210    | 9   | info   | incoterms         | D    |
| single-administrative-document | term              | single administrative document                                             | 210    | n/a | info   | invoice           | D    |
| ultimate-consignee             | term              | ultimate consignee (intermediate consignee 110)                            | 210    | n/a | nav.   | invoice           | D    |

`country-of-origin` describes only the invoice field (what the seller declares and where it goes); it must not mention or offer a certificate of origin while D-002 holds, and it stays noindex until reviewed.

**Hub entries without their own page** (owner page in brackets): bill of lading, consignee, notify party, shipper (guides); landed cost, customs value (guides); HS / HTS / Schedule B, commodity code, TARIC (guides and posts); LCL / FCL, groupage (lcl-vs-fcl); letter of credit, documentary collection, open account (export-payment-terms); EORI, EEI / ITN, ISF, IOSS, ATA carnet, air waybill (guides); every Incoterms® rule (rule pages); customs duty, tariff (duty-vs-tariff); demurrage, detention (guide); freight forwarder, customs broker (guide); CMR, T1 / T2L, NCTS, TIR (cmr-note, transit guide); marks and numbers (shipping-marks); pallet, euro pallet (pallet-sizes); gross, net and tare weight (guide); delivery note, packing list, proforma, commercial invoice (tool pages and posts). Below threshold, hub entry only until wave E: temporary import bond 170, dual use goods 170, arrival notice 140, exporter of record 140, groupage 140, AMS filing 110.

## Export documents by country: hub + 10 countries

Measured per-country demand is thin (2026-10-06 plan: "commercial invoice <country>" is 10 a month except Canada). Only the countries below pass the 150-a-month threshold; each must carry at least five country-specific, sourced facts. The template answers "what documents does my shipment to X need, and what must the commercial invoice show"; it does not quote duty rates.

| Slug                                        | Type         | Primary keyword                                                                                                 | US vol | KD  | Intent | Conversion target | Wave |
| ------------------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------- | ------ | --- | ------ | ----------------- | ---- |
| export-documents (hub, `/export-documents`) | hub          | conversion role: index of country pages, the Canada post and the UK/EU post                                     | n/a    | n/a | nav.   | invoice           | A    |
| mexico                                      | country      | mexico customs (shipping to mexico 590; shipping from us to mexico 480; pedimento 720; carta porte 320)         | 1,900  | 5   | info   | invoice           | A    |
| india                                       | country      | india customs (shipping to india from us 480; india import tax 390; iec code 210)                               | 880    | 19  | info   | invoice           | A    |
| brazil                                      | country      | export to brazil (exporting to brazil 260; brazil customs 320; siscomex 210; shipping to brazil from us 140)    | 260    | 5   | comm.  | invoice           | B    |
| china                                       | country      | export to china (exporting to china 260 / KD 5; china customs 390 / KD 52; ccc certification 590, mention only) | 260    | 21  | comm.  | invoice           | B    |
| australia                                   | country      | shipping to australia from us (australia customs 390; from UK 390; australia import tax 110)                    | 390    | 14  | comm.  | invoice           | B    |
| united-states                               | country      | shipping to usa from uk (UK); seller's view, distinct from the importer guide how-to-import-into-the-us         | UK 880 | 4   | comm.  | invoice           | B    |
| germany                                     | country (EU) | shipping to germany from us (germany customs 210; zoll germany 140; from UK 140)                                | 210    | 11  | comm.  | invoice           | C    |
| south-korea                                 | country      | korea customs (export to south korea 110; exporting to south korea 110; kc certification 110)                   | 170    | 29  | info   | invoice           | C    |
| japan                                       | country      | shipping to japan from us (export to japan 20; "japan customs" 2,400 is traveller intent, not counted)          | 140    | 13  | info   | invoice           | D    |
| ireland                                     | country (EU) | shipping to ireland from uk (UK; exporting to ireland 10)                                                       | UK 170 | 8   | info   | invoice           | D    |

Canada keeps its post (`/blog/commercial-invoice-for-canada`, 480 + 480; shipping to canada from us 880) and the UK and EU share v2's post; the hub links both rather than duplicating them. Below threshold (no page): Colombia 110 + 10, New Zealand 90 + 10, Spain 90 + 20, France 90 (UK) + 10, Israel 70, Netherlands 40 + 10, Saudi Arabia 50, South Africa 50, Switzerland 50 (UK), UAE and Dubai 30, Vietnam, Philippines, Nigeria, Chile, Taiwan 10–30.

## Free tools: 8 new pages

| Slug                               | Type              | Primary keyword                                                                                                                                                               | US vol | KD  | Intent | Conversion target                     | Wave |
| ---------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | --- | ------ | ------------------------------------- | ---- |
| tools/cbm-to-cubic-feet            | converter         | cbm to cft (cubic feet to cubic meters 6,600; cbm conversion calculator 4,400 / KD 15; cubic meters to cubic feet 3,600; cm3 to cbm 2,900; m3 to ft3 1,600; cft to cbm 1,300) | 6,600  | n/a | info   | cbm → packing                         | A    |
| tools/pallet-calculator            | calculator        | pallet calculator (UK 260; pallet configuration calculator 140; pallet loading calculator 90)                                                                                 | 1,600  | n/a | info   | packing                               | A    |
| tools/delivery-note-generator      | generator         | delivery note (UK 880; delivery note template UK 480, word UK 480; delivery receipt template 210; proof of delivery template 140; delivery note template 140)                 | 390    | n/a | trans. | workspace (delivery note kind exists) | A    |
| tools/chargeable-weight/fedex      | calculator preset | fedex dimensional weight calculator                                                                                                                                           | 1,300  | 36  | info   | weight → packing                      | A    |
| tools/chargeable-weight/ups        | calculator preset | ups dimensional weight calculator                                                                                                                                             | 880    | 21  | info   | weight → packing                      | A    |
| tools/container-loading-calculator | calculator        | container loading calculator (container load calculator 260; container calculator 140 / KD 41; UK 90)                                                                         | 260    | 7   | info   | packing                               | B    |
| tools/chargeable-weight/dhl        | calculator preset | dhl volumetric weight calculator                                                                                                                                              | 140    | 17  | info   | weight → packing                      | B    |
| tools/export-price-calculator      | calculator        | cif value 140 / KD 1; feeds "fob price" 1,300 (post owns the keyword); export price calculator 10 (conversion role)                                                           | 140    | 1   | info   | proforma                              | C    |

Builder notes (each needs a tool brief before building; design lays out):

- **cbm-to-cubic-feet:** a volume converter (m³, ft³, cm³, in³, litres), exact factors from NIST (1 ft = 0.3048 m exactly). The CBM calculator works from dimensions; this page converts a volume, so the intents differ. Links to the CBM calculator and the packing list generator.
- **pallet-calculator:** cartons per layer and layers per pallet from user-entered carton and pallet sizes, height and weight limits; presets for ISO 6780 pallets (48 × 40 in, 1200 × 800 mm, 1200 × 1000 mm). Output rows feed the packing list. Label results "before overhang, crushing strength and carrier limits".
- **container-loading-calculator:** v2's "container fit" extension, now its own URL because the measured head ("container loading calculator") differs from "cbm calculator". Floor-fit of pallets or cartons into 20', 40', 40' HC from the carrier inside dimensions already cited by the CBM calculator; never claims an optimal 3D plan.
- **chargeable-weight presets:** the existing calculator with the carrier's divisor and rounding preselected, each read from that carrier's live page with a retrieval date (sources `fedex-dimensional`, `ups-dimensional`, `dhl-express-volumetric`). One shared component, three pages; each page states the carrier's own rule and links the carrier page. No rates.
- **delivery-note-generator:** the anonymous generator pattern (short retention, one-time claim) for the existing `delivery_note` kind. Needs product sign-off that the anonymous flow may include it.
- **export-price-calculator:** EXW cost plus user-entered inland, export clearance, loading, freight and insurance gives FCA/FOB, CFR/CPT, CIF/CIP and a DDP estimate with user-entered duty and tax; deterministic like the landed cost calculator, no rates of our own, results carry into a proforma.

## Use-case pages: 3 (conversion role)

| Slug                   | Type     | Primary keyword                                                                                                                               | US vol | KD  | Intent | Conversion target | Wave |
| ---------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------ | --- | ------ | ----------------- | ---- |
| for/exporters          | use case | conversion role (PRODUCT.md primary audience); export documentation software 10                                                               | 10     | 39  | comm.  | workspace         | C    |
| for/freight-forwarders | use case | freight forwarder software 260 / KD 6, but the SERP intent is forwarding TMS; the page sells client document preparation only and must say so | 260    | 6   | comm.  | workspace (Team)  | C    |
| for/trade-consultants  | use case | conversion role (PRODUCT.md audience: consultants preparing drafts)                                                                           | n/a    | n/a | comm.  | workspace (Team)  | C    |

Owner: marketing agent writes the copy (conversion copy is out of the content agent's scope). No competitor named, no invented customers or results.

## Wave E: the last 26 pages (owner chooses)

These meet the rules but rest on a support role or on volumes between 100 and 199, so they need an explicit owner yes. With them the site reaches 250.

**Help articles (20), `/help/<slug>`:** each documents behaviour that exists in the code today (checked before writing; any that is not live is dropped, never written as "coming soon"). create-your-account-and-organization, invite-team-members-and-roles, save-company-and-customer-details, add-products-and-import-from-csv, create-a-shipment, allocate-items-to-packages, generate-a-document-set, preview-and-finalize-a-revision, correct-a-finalized-document, download-the-zip, share-a-secure-document-link, reuse-data-for-a-second-shipment, claim-a-free-generator-document, add-your-logo-and-signature, plans-and-billing (no prices until PRICES_APPROVED), stale-documents-explained, supported-documents-and-limits (limits read from `src/lib/limits.ts`), free-tool-data-retention, export-your-data, contact-support. Builder: a `/help/[slug]` route and sitemap entries; content: HowTo-shaped answers.

**Glossary terms at 100–199 a month (6):** temporary-import-bond 170, dual-use-goods 170, arrival-notice 140, exporter-of-record 140, groupage 140 (only if the LCL guide does not absorb it), ams-filing 110.

## Template spec: glossary term pages

Data model `src/lib/content/glossary/<slug>.ts`, one file per term, registered in `glossary/index.ts` (same pattern as guides and posts), rendered by one route `/glossary/[slug]` and listed by `/glossary`.

| Field                        | Type                                      | Rule                                                                                                                                                      |
| ---------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| slug                         | string                                    | kebab-case, equals the file name                                                                                                                          |
| term                         | string                                    | display name, e.g. "Verified gross mass (VGM)"                                                                                                            |
| abbreviation                 | string, optional                          | e.g. "VGM", "TEU"                                                                                                                                         |
| aliases                      | string[]                                  | other phrasings shown on the hub and matched by help search                                                                                               |
| demand                       | { keyword, market, volume, kd, dataFile } | the qualifying row from the appendix; build fails without it (volume ≥ 200, or wave E ≥ 100)                                                              |
| shortDefinition              | string, 25–50 words                       | answer-first; reused on the hub, in DefinedTerm JSON-LD and llms.txt                                                                                      |
| definition                   | paragraphs                                | the expanded meaning, 120–250 words                                                                                                                       |
| onYourDocuments              | paragraphs or list                        | where the term appears on an invoice, packing list, delivery note or transport document, and which field                                                  |
| example                      | { caption, text or table }                | worked example with invented parties, labelled as invented                                                                                                |
| confusedWith                 | { term, difference }[], optional          | e.g. TEU vs FEU, consignor vs consignee                                                                                                                   |
| related                      | slug[] (2–5)                              | glossary slugs or site paths; every target must exist (tested)                                                                                            |
| tool                         | path from PUBLIC_TOOLS                    | the one tool CTA; required                                                                                                                                |
| faq                          | { q, a }[] (1–3)                          | feeds FAQPage JSON-LD only when the term page has a real question                                                                                         |
| sources                      | SourceId[] (≥ 1)                          | registered in `src/lib/trade/sources` with authority, URL, jurisdiction, effective and retrieval dates                                                    |
| regulated                    | boolean                                   | true for duties, licences, controls, tax and customs procedures; true keeps the page noindex and out of sitemap and llms.txt until a review record exists |
| published, updated, reviewed | ISO dates                                 | `updated` drives the per-page sitemap date                                                                                                                |

Length: **350–700 words** of body text (validator counts definition + onYourDocuments + example + FAQ). Structured data: `DefinedTerm` with `inDefinedTermSet` pointing at the hub's `DefinedTermSet`, plus `BreadcrumbList`. Required sources by kind: container terms (TEU, FEU, VGM, dunnage, seal) cite ISO 668 / IMO SOLAS / a carrier's published sheet; customs and duty terms cite the authority of the jurisdiction they describe (CBP, Census FTR, USITC, BIS, HMRC, European Commission); payment terms cite ICC (UCP 600, URC 522) or the ITA Trade Finance Guide; carrier terms cite IATA or the carrier's own page. No term page states a duty rate, threshold or fee.

## Template spec: country pages

Data model `src/lib/content/countries/<slug>.ts`, rendered by `/export-documents/[country]`, listed by `/export-documents`.

| Field                        | Type                                                                          | Rule                                                                                                                                                                                                            |
| ---------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| slug, name, iso2             | strings                                                                       | e.g. `mexico`, "Mexico", "MX"                                                                                                                                                                                   |
| customsUnion                 | "EU" or null                                                                  | EU pages reuse the shared EU block (EORI, UCC, ICS2) and add only national facts                                                                                                                                |
| demand                       | { keyword, market, volume, kd, dataFile }[]                                   | the qualifying rows; combined distinct phrasings ≥ 150                                                                                                                                                          |
| answer                       | string, 40–60 words                                                           | which documents a shipment to the country needs, answer-first                                                                                                                                                   |
| customsAuthority             | { name, url, sourceId }                                                       | the national customs authority, required (e.g. Mexico ANAM/SAT, India CBIC, Brazil Receita Federal, China GACC, Australia ABF, Germany Zoll, Korea Customs Service, Japan Customs, Ireland Revenue, US CBP)     |
| documents                    | { document, status: required, conditional or typical, condition, sourceId }[] | at least four rows, each sourced; TradeDocs documents link to their tool                                                                                                                                        |
| invoiceRequirements          | { requirement, sourceId }[]                                                   | country-specific invoice content: language, currency, copies, signature, importer identifiers (e.g. Mexico RFC, Brazil CNPJ, India IEC and GSTIN), each sourced                                                 |
| importerIdentifiers          | { name, whoNeedsIt, sourceId }[]                                              | e.g. RFC, CNPJ, IEC, ABN, PCCC, EORI                                                                                                                                                                            |
| valuationBasis               | { basis: CIF or FOB, sourceId }                                               | stated only with a source                                                                                                                                                                                       |
| incotermsNotes               | paragraphs                                                                    | who can be importer of record under DDP; local registration needs; sourced                                                                                                                                      |
| controlledGoods              | { label, officialUrl }                                                        | links to the official lists only; no classification, no product examples                                                                                                                                        |
| packaging                    | { ispm15: boolean, sourceId }                                                 | wood packaging rule, IPPC or national source                                                                                                                                                                    |
| lowValueThreshold            | { text, effectiveDate, sourceId } or null                                     | only with a dated official source; otherwise omitted (fast-changing)                                                                                                                                            |
| faq                          | { q, a }[] (3–5)                                                              | FAQPage JSON-LD                                                                                                                                                                                                 |
| sources                      | SourceId[] (≥ 3)                                                              | the customs authority, the trade.gov Country Commercial Guide "Import Requirements and Documentation" chapter, and one more official source; each with jurisdiction, effective and retrieval dates and reviewer |
| regulated                    | true (always)                                                                 | noindex, out of sitemap and llms.txt until a review record exists; the not-advice note is shown                                                                                                                 |
| published, updated, reviewed | ISO dates                                                                     |                                                                                                                                                                                                                 |

Length: **900–1,600 words**. Distinctness rule (validator): at least five sourced country-specific facts, and no more than 30% of body sentences shared with any other country page (the shared EU block is excluded from the count and rendered from one module). If a country cannot meet five sourced facts, it is not published.

## Routed to existing pages (no new URL)

| Query (vol)                                                                                                                                                                                                  | Goes to                                      | Why                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- | ---------------------------------------------------------------- |
| packing list 40,500; international packing list 1,000; pro forma invoice 12,100; proforma invoice 12,100; commercial invoice 3,600                                                                           | the generator tool pages                     | Head terms with document intent                                  |
| commercial invoice template 2,400 / word 2,400; packing list template 2,400; proforma invoice template 1,300 / word 1,300 / sample 1,300; customs invoice template 480; free commercial invoice template 210 | generator tool pages (template sections)     | Template intent is the tool's own query; example posts link back |
| cbm calculation 4,400; calculate cbm 4,400; how to calculate cbm 320; cbm formula 70                                                                                                                         | `/tools/cbm-calculator` (FAQ)                | A post would compete with the tool                               |
| dimensional weight calculator 1,600; dim weight calculator 1,600; how to calculate dimensional weight 390; chargeable weight calculator 590                                                                  | `/tools/chargeable-weight`                   | Calculator intent; carrier presets take the carrier queries      |
| fca incoterms 6,600; dap incoterms 4,400; exw incoterms 3,600; fob incoterms 2,400; ddp shipping 6,600; what is ddp shipping 1,900; dap terms 1,000; ddp terms 880; fob terms 880                            | `/tools/incoterms/[code]`                    | The rule pages own each rule                                     |
| incoterm 22,200; incoterms 2020 2,900; incoterms chart 880; incoterms list 210                                                                                                                               | `/tools/incoterms`                           | The hub                                                          |
| what is an hs code 1,600; harmonized code 2,900; tariff code 1,600; hs code 14,800                                                                                                                           | `/guides/hs-vs-hts-vs-schedule-b`            | Owned by the guide                                               |
| lcl 22,200; fcl 5,400; freight consolidation 18,100; groupage 140                                                                                                                                            | `/guides/lcl-vs-fcl` (refresh)               | Same intent                                                      |
| customs duty 1,900; customs duty meaning 1,000                                                                                                                                                               | `/blog/duty-vs-tariff`                       | Same intent                                                      |
| euro pallet size UK 4,400; uk pallet size UK 1,600                                                                                                                                                           | `/guides/pallet-sizes`                       | Same intent                                                      |
| shipping container sizes UK 1,600; 20ft / 40ft container dimensions                                                                                                                                          | `/guides/shipping-container-sizes`           | Same intent                                                      |
| eccn lookup 720; export controls 2,400; what is an export license 110                                                                                                                                        | `/guides/eccn-ear99-export-licence`          | Same intent                                                      |
| how to fill out a bill of lading 110; how to read a bill of lading 30                                                                                                                                        | `/guides/what-is-a-bill-of-lading` (refresh) | Same intent                                                      |
| customs declaration service UK 590                                                                                                                                                                           | `/blog/uk-export-declaration`                | Same intent                                                      |

## Excluded, and why

- **Competitor pages (comparison and alternatives):** PRODUCT.md "Messaging & conversion" says no competitor is named on public pages. Competitor brand queries were not researched or planned.
- **Generic unit conversions:** kg to lbs 1,220,000, lbs to kg 823,000, cm to inches 1,220,000, inches to cm 550,000, cubic feet calculator 40,500 (home and garden intent). Google answers these in its own calculator; no trade intent. The CBM converter covers the trade-specific volume units.
- **Documents we do not make:** quotation template 3,600, quotation meaning 12,100, purchase order 9,900 and template 6,600, sales order 1,000, sales contract template 1,000, packing slip 4,400 and template 1,600, goods received note 4,400, bill of lading template / form 1,900–5,400 (BOL draft gated), shippers letter of instruction template 320 (shipping-instruction draft gated), certificate of origin template 1,300 (D-002).
- **Certificate of origin gate (D-002):** free trade agreement 2,400, NAFTA 40,500, preferential tariff, rules of origin, REX number 110. Plan when the gate lifts.
- **Boundaries in PRODUCT.md (not a sanctions, classification or tariff service):** OFAC 49,500, sanctioned countries 1,000, denied / restricted party screening 320 / 170, HS / HTS code lookup, customs duty calculator 320, import duty calculator 2,400 (served by the landed cost calculator), commerce control list 40,500 (routed to the ECCN guide, volume not quoted).
- **Regulated with no product tie or high risk:** dangerous goods 880, shipping lithium batteries internationally 260, hazmat shipping 320, dangerous goods note UK 260, CE / UKCA marking 5,400 / 1,900, IPAFFS 4,400, certificate of free sale 260, CCC and KC certification as standalone pages (mentioned on country pages only).
- **Different meaning dominates:** stuffing 90,500, consignment 74,000, pallet 110,000, crate 60,500, carton 22,200, skid 27,100, tare 40,500, embargo 90,500, escrow 60,500, freight 49,500, cargo 60,500, value added tax 49,500, quota 33,100, duty free 27,100, factoring 27,100, net 30 8,100, most favored nation 9,900 (2025 drug-pricing news), what is a carrier 2,400, delivery order 1,000, destination charges 880 (car dealers), pod shipping 1,900 (print on demand), mrn number 1,900 (medical record number), cds UK 40,500, chief UK 8,100, ehc as an acronym beyond the certificate.
- **Off-scope logistics or service intent:** cross docking 12,100, transloading 2,400, LTL 9,900, drayage meaning 4,400, freight forwarding 6,600 and freight forwarder 18,100 (service), door to door shipping 390, ocean freight 1,600, air freight 3,600, booking number 3,600, container yard 720, freight carrier 2,900, shipping software for small business 590 (label printing), invoice maker 12,100 (general invoicing), exim bank 4,400, uk export finance 1,900, trade finance 1,300, export financing 110.
- **News or fast-changing policy:** section 301 tariffs 4,400, reciprocal tariffs, Incoterms® 2030 (not published). De minimis stays in a dated guide only.
- **Volume anomalies (do not quote):** ncts US 33,100 (UK 14,800 is used), currency adjustment factor 33,100 / KD 73, commerce control list 40,500, japan customs 2,400 (traveller), cnpj 8,100 and rfc mexico 5,400 (domestic tax-ID navigation; mentioned as invoice fields only), etd meaning 2,900 (mixed senses; needs a SERP check before a term page).
- **Thin per-variant pages:** per-industry "how to export X" (food, wine, cosmetics, furniture, machinery, coffee, seafood, auto parts: 0–10 each), "commercial invoice <country>" (10 each), "<country> customs regulations / import requirements" (0–30 each), Incoterms® pairs under 50 (fas vs fob 50 and cpt / cip vs dap 40 go into rule-page FAQs), incoterms comparison tool 10, software terms (commercial invoice software 40, export documentation software 10).
- **Legal-only:** CISG 1,000 / KD 4: a contract-law topic that needs legal review; revisit with the legal pages.

## Briefs and sources

Writers follow [docs/content/WRITING_BRIEF.md](../content/WRITING_BRIEF.md) and the v2 "Sources to register" table. New source ids this plan needs (registered by the first article that cites them, with retrieval date): `ippc-ispm-15`, `usda-aphis-phytosanitary`, `unece-cmr-convention`, `gov-uk-ncts`, `gov-uk-gvms`, `gov-uk-duty-deferment`, `gov-uk-vat-exports`, `gov-uk-ehc`, `gov-uk-windsor-framework`, `ec-ics2`, `cbp-form-3461`, `cbp-first-sale` (19 CFR 152.103 via the CBP ruling guidance), `cbp-american-goods-returned`, `usitc-trq`, `trade-gov-ad-cvd`, `icc-urc-522`, `nist-si-volume` (exists in v2), `iso-6780` (exists), each country's customs authority, and `trade-gov-ccg-<iso2>` for each country page.

## DataForSEO usage (D-014: 6 calls left before this plan)

- **6 calls used, 0 left.** Five `dataforseo_labs_google_keyword_overview` (US: glossary 259 keywords returned, countries 163, tools / how-to / industry 210, questions 198, posts and countries 146) and one UK `keyword_overview` (170). Raw responses: [`dataforseo-2026-10-07/`](dataforseo-2026-10-07/) files 01–06, saved byte for byte from the MCP tool output and excluded from Prettier like the earlier folders.
- **Cost: not reported** in the MCP responses; check the DataForSEO dashboard.
- **To unlock more than 224 demand-backed pages, for owner approval (12 calls):**
  1. 5 × `serp_organic_live_advanced` (US): "etd meaning", "letter of indemnity", "nota fiscal", "freight forwarder software", "ncts" — confirm intent for one term page, one post, the Brazil anchor, the forwarder use-case page and the US anomaly.
  2. 2 × `dataforseo_labs_google_keyword_overview` for Canada and Australia (same country, glossary and tool lists): English markets not yet measured; likely adds country and term volume above threshold.
  3. 3 × `dataforseo_labs_google_keyword_suggestions` (US, trade-filtered) for "container", "pallet" and "invoice": long-tail posts not yet measured.
  4. 2 × `dataforseo_labs_google_ranked_keywords` for two competitor domains (the competitor page export the seo agent owns): which page types earn their traffic beyond the ones measured here.
     Expected effect: 15–35 more demand-backed pages, which would replace wave E's help articles as the route to 250.

## Appendix: v3 keyword rows

All rows with 50 or more searches a month from the six new files, generated from the saved responses (01 glossary US, 02 countries US, 03 tools / how-to / industry US, 04 questions US, 05 posts and countries US, 06 UK). Rows below 50 that the plan cites are in the raw files.

| #   | Keyword                                    | Mkt | Vol     | KD  | Intent        | File |
| --- | ------------------------------------------ | --- | ------- | --- | ------------- | ---- |
| 1   | pallet                                     | US  | 110000  | 24  | transactional | 01   |
| 2   | embargo                                    | US  | 90500   | 10  | informational | 01   |
| 3   | stuffing                                   | US  | 90500   | 42  | informational | 01   |
| 4   | consignment                                | US  | 74000   | n/a | commercial    | 01   |
| 5   | cargo                                      | US  | 60500   | 51  | informational | 01   |
| 6   | crate                                      | US  | 60500   | 13  | transactional | 01   |
| 7   | escrow                                     | US  | 60500   | 57  | informational | 01   |
| 8   | freight                                    | US  | 49500   | 55  | informational | 01   |
| 9   | ofac                                       | US  | 49500   | 65  | informational | 01   |
| 10  | value added tax                            | US  | 49500   | 16  | informational | 01   |
| 11  | export                                     | US  | 40500   | 30  | informational | 01   |
| 12  | import                                     | US  | 40500   | 38  | informational | 01   |
| 13  | tare                                       | US  | 40500   | 7   | informational | 01   |
| 14  | currency adjustment factor                 | US  | 33100   | 73  | informational | 01   |
| 15  | fob meaning                                | US  | 33100   | 5   | informational | 01   |
| 16  | ncts                                       | US  | 33100   | 15  | informational | 01   |
| 17  | quota                                      | US  | 33100   | 10  | informational | 01   |
| 18  | duty free                                  | US  | 27100   | 33  | informational | 01   |
| 19  | factoring                                  | US  | 27100   | 12  | informational | 01   |
| 20  | skid                                       | US  | 27100   | 8   | informational | 01   |
| 21  | incoterm                                   | US  | 22200   | 43  | informational | 01   |
| 22  | carton                                     | US  | 22200   | 4   | transactional | 01   |
| 23  | lcl                                        | US  | 22200   | n/a | informational | 01   |
| 24  | dunnage                                    | US  | 18100   | n/a | informational | 01   |
| 25  | freight consolidation                      | US  | 18100   | n/a | commercial    | 01   |
| 26  | hs code                                    | US  | 14800   | 74  | informational | 01   |
| 27  | tariff rate quota                          | US  | 14800   | 8   | informational | 01   |
| 28  | country of origin                          | US  | 12100   | 9   | informational | 01   |
| 29  | quotation meaning                          | US  | 12100   | 19  | informational | 01   |
| 30  | cross docking                              | US  | 12100   | 7   | informational | 01   |
| 31  | consignment meaning                        | US  | 9900    | 11  | informational | 01   |
| 32  | most favored nation                        | US  | 9900    | 32  | informational | 01   |
| 33  | proforma meaning                           | US  | 9900    | 17  | informational | 01   |
| 34  | purchase order                             | US  | 9900    | 15  | transactional | 01   |
| 35  | teu                                        | US  | 9900    | 17  | informational | 01   |
| 36  | cubic feet                                 | US  | 9900    | 14  | informational | 01   |
| 37  | ltl                                        | US  | 9900    | 2   | informational | 01   |
| 38  | verified gross mass                        | US  | 8100    | 12  | informational | 01   |
| 39  | vgm                                        | US  | 8100    | 12  | informational | 01   |
| 40  | net 30                                     | US  | 8100    | 11  | informational | 01   |
| 41  | freight forwarding                         | US  | 6600    | 14  | commercial    | 01   |
| 42  | dunnage meaning                            | US  | 5400    | 2   | informational | 01   |
| 43  | waybill                                    | US  | 5400    | n/a | navigational  | 01   |
| 44  | fcl                                        | US  | 5400    | 21  | informational | 01   |
| 45  | freight all kinds                          | US  | 4400    | n/a | commercial    | 01   |
| 46  | packing slip                               | US  | 4400    | n/a | informational | 01   |
| 47  | section 301 tariffs                        | US  | 4400    | 41  | informational | 01   |
| 48  | what is a proforma invoice                 | US  | 4400    | 6   | informational | 01   |
| 49  | cubic meter                                | US  | 4400    | 30  | informational | 01   |
| 50  | detention meaning                          | US  | 4400    | 7   | informational | 01   |
| 51  | drayage meaning                            | US  | 4400    | n/a | informational | 01   |
| 52  | booking number                             | US  | 3600    | 29  | transactional | 01   |
| 53  | shipper meaning                            | US  | 3600    | n/a | informational | 01   |
| 54  | air freight                                | US  | 3600    | 41  | commercial    | 01   |
| 55  | demurrage meaning                          | US  | 3600    | 11  | informational | 01   |
| 56  | what is exporting                          | US  | 3600    | 12  | informational | 01   |
| 57  | what is importing                          | US  | 3600    | 12  | informational | 01   |
| 58  | consignor                                  | US  | 2900    | 35  | navigational  | 01   |
| 59  | etd meaning                                | US  | 2900    | 9   | informational | 01   |
| 60  | feu                                        | US  | 2900    | 14  | informational | 01   |
| 61  | freight carrier                            | US  | 2900    | 81  | informational | 01   |
| 62  | harmonized code                            | US  | 2900    | 39  | informational | 01   |
| 63  | incoterms 2020                             | US  | 2900    | 26  | informational | 01   |
| 64  | nvocc                                      | US  | 2900    | 3   | informational | 01   |
| 65  | bonded warehouse                           | US  | 2400    | 10  | navigational  | 01   |
| 66  | cargo insurance                            | US  | 2400    | n/a | commercial    | 01   |
| 67  | export control                             | US  | 2400    | 12  | informational | 01   |
| 68  | export controls                            | US  | 2400    | 16  | informational | 01   |
| 69  | free trade agreement                       | US  | 2400    | 53  | informational | 01   |
| 70  | proforma invoice meaning                   | US  | 2400    | 8   | informational | 01   |
| 71  | what is a carrier                          | US  | 2400    | 9   | informational | 01   |
| 72  | transloading                               | US  | 2400    | n/a | informational | 01   |
| 73  | what is a letter of credit                 | US  | 2400    | 15  | informational | 01   |
| 74  | cbm meaning                                | US  | 1900    | n/a | informational | 01   |
| 75  | country of origin meaning                  | US  | 1900    | n/a | informational | 01   |
| 76  | customs duty                               | US  | 1900    | 30  | informational | 01   |
| 77  | mrn number                                 | US  | 1900    | n/a | informational | 01   |
| 78  | payment terms                              | US  | 1900    | 17  | informational | 01   |
| 79  | pod shipping                               | US  | 1900    | 33  | commercial    | 01   |
| 80  | shipping manifest                          | US  | 1900    | 7   | informational | 01   |
| 81  | transshipment                              | US  | 1900    | 11  | informational | 01   |
| 82  | what is a waybill                          | US  | 1900    | n/a | informational | 01   |
| 83  | what is dunnage                            | US  | 1900    | 4   | informational | 01   |
| 84  | ics2                                       | US  | 1600    | 32  | informational | 01   |
| 85  | import tax                                 | US  | 1600    | 63  | informational | 01   |
| 86  | tariff code                                | US  | 1600    | 74  | informational | 01   |
| 87  | what is an hs code                         | US  | 1600    | 40  | informational | 01   |
| 88  | bill of exchange                           | US  | 1600    | n/a | informational | 01   |
| 89  | freight forwarder meaning                  | US  | 1600    | 4   | informational | 01   |
| 90  | ocean freight                              | US  | 1600    | 20  | commercial    | 01   |
| 91  | what is ltl                                | US  | 1600    | 13  | informational | 01   |
| 92  | consignor vs consignee                     | US  | 1300    | n/a | informational | 01   |
| 93  | import duty                                | US  | 1300    | 53  | informational | 01   |
| 94  | reefer container                           | US  | 1300    | 14  | transactional | 01   |
| 95  | skid vs pallet                             | US  | 1300    | n/a | informational | 01   |
| 96  | trade finance                              | US  | 1300    | 40  | commercial    | 01   |
| 97  | awb number                                 | US  | 1000    | 39  | informational | 01   |
| 98  | customs declaration                        | US  | 1000    | 42  | informational | 01   |
| 99  | delivery order                             | US  | 1000    | 14  | transactional | 01   |
| 100 | duties and taxes                           | US  | 1000    | 63  | informational | 01   |
| 101 | proof of delivery                          | US  | 1000    | 17  | informational | 01   |
| 102 | sales order                                | US  | 1000    | 4   | transactional | 01   |
| 103 | sanctioned countries                       | US  | 1000    | 46  | informational | 01   |
| 104 | import export business                     | US  | 1000    | 25  | commercial    | 01   |
| 105 | incoterms ddp                              | US  | 1000    | 11  | navigational  | 01   |
| 106 | what is cross docking                      | US  | 1000    | 3   | informational | 01   |
| 107 | dangerous goods                            | US  | 880     | 31  | informational | 01   |
| 108 | destination charges                        | US  | 880     | 8   | informational | 01   |
| 109 | flat rack container                        | US  | 880     | n/a | transactional | 01   |
| 110 | high cube container                        | US  | 880     | n/a | transactional | 01   |
| 111 | incoterms chart                            | US  | 880     | 13  | informational | 01   |
| 112 | trade compliance                           | US  | 880     | 1   | commercial    | 01   |
| 113 | waybill meaning                            | US  | 880     | 6   | informational | 01   |
| 114 | what is a free trade agreement             | US  | 880     | 29  | informational | 01   |
| 115 | what is cbm                                | US  | 880     | n/a | informational | 01   |
| 116 | customs clearance meaning                  | US  | 880     | 10  | informational | 01   |
| 117 | standby letter of credit                   | US  | 880     | 7   | informational | 01   |
| 118 | container seal                             | US  | 720     | n/a | transactional | 01   |
| 119 | container yard                             | US  | 720     | 7   | navigational  | 01   |
| 120 | countervailing duty                        | US  | 720     | 15  | transactional | 01   |
| 121 | hawb                                       | US  | 720     | n/a | informational | 01   |
| 122 | hs code meaning                            | US  | 720     | 24  | informational | 01   |
| 123 | marine cargo insurance                     | US  | 720     | n/a | commercial    | 01   |
| 124 | mawb                                       | US  | 720     | n/a | informational | 01   |
| 125 | teu meaning                                | US  | 720     | 6   | informational | 01   |
| 126 | usppi                                      | US  | 720     | n/a | informational | 01   |
| 127 | what is customs duty                       | US  | 720     | 17  | informational | 01   |
| 128 | what is teu                                | US  | 720     | 5   | informational | 01   |
| 129 | letter of credit meaning                   | US  | 720     | 19  | informational | 01   |
| 130 | anti dumping duty                          | US  | 590     | 29  | informational | 01   |
| 131 | break bulk                                 | US  | 590     | 47  | informational | 01   |
| 132 | customs code                               | US  | 590     | 74  | informational | 01   |
| 133 | nvocc meaning                              | US  | 590     | n/a | informational | 01   |
| 134 | transshipment meaning                      | US  | 590     | 2   | informational | 01   |
| 135 | free trade agreement meaning               | US  | 480     | 29  | informational | 01   |
| 136 | freight collect                            | US  | 480     | n/a | commercial    | 01   |
| 137 | freight collect vs prepaid                 | US  | 480     | 12  | commercial    | 01   |
| 138 | freight terms                              | US  | 480     | n/a | informational | 01   |
| 139 | what is a bill of exchange                 | US  | 480     | 4   | informational | 01   |
| 140 | bill of lading number                      | US  | 390     | 60  | informational | 01   |
| 141 | breakbulk cargo                            | US  | 390     | 6   | transactional | 01   |
| 142 | cargo manifest                             | US  | 390     | 6   | informational | 01   |
| 143 | door to door shipping                      | US  | 390     | 3   | commercial    | 01   |
| 144 | import license                             | US  | 390     | 28  | informational | 01   |
| 145 | re export                                  | US  | 390     | n/a | informational | 01   |
| 146 | what is a cfs                              | US  | 390     | 40  | informational | 01   |
| 147 | what is a shipper                          | US  | 390     | n/a | informational | 01   |
| 148 | what is transloading                       | US  | 390     | 1   | informational | 01   |
| 149 | container freight station                  | US  | 320     | n/a | navigational  | 01   |
| 150 | denied party screening                     | US  | 320     | 11  | informational | 01   |
| 151 | hazmat shipping                            | US  | 320     | 36  | commercial    | 01   |
| 152 | in bond                                    | US  | 320     | n/a | informational | 01   |
| 153 | teu container                              | US  | 320     | 5   | transactional | 01   |
| 154 | what is a consignor                        | US  | 320     | n/a | informational | 01   |
| 155 | fcl meaning                                | US  | 320     | n/a | informational | 01   |
| 156 | shipping carton                            | US  | 320     | 19  | transactional | 01   |
| 157 | what is trade finance                      | US  | 320     | 5   | informational | 01   |
| 158 | cbp exam                                   | US  | 260     | 6   | informational | 01   |
| 159 | customs tariff                             | US  | 260     | 78  | informational | 01   |
| 160 | harmonized system                          | US  | 260     | 71  | informational | 01   |
| 161 | prepaid vs collect                         | US  | 260     | n/a | informational | 01   |
| 162 | routed export transaction                  | US  | 260     | n/a | commercial    | 01   |
| 163 | seal number                                | US  | 260     | 11  | informational | 01   |
| 164 | what is a packing list                     | US  | 260     | 6   | informational | 01   |
| 165 | what is a tariff code                      | US  | 260     | 35  | informational | 01   |
| 166 | what is break bulk                         | US  | 260     | n/a | informational | 01   |
| 167 | what is transshipment                      | US  | 260     | n/a | informational | 01   |
| 168 | devanning                                  | US  | 260     | n/a | informational | 01   |
| 169 | export documentation                       | US  | 260     | 15  | transactional | 01   |
| 170 | export documents                           | US  | 260     | 8   | transactional | 01   |
| 171 | master carton                              | US  | 260     | n/a | transactional | 01   |
| 172 | what is fcl                                | US  | 260     | 11  | informational | 01   |
| 173 | general average                            | US  | 210     | 9   | informational | 01   |
| 174 | landed cost meaning                        | US  | 210     | 9   | informational | 01   |
| 175 | mfn tariff                                 | US  | 210     | 14  | informational | 01   |
| 176 | single administrative document             | US  | 210     | n/a | informational | 01   |
| 177 | ultimate consignee                         | US  | 210     | n/a | navigational  | 01   |
| 178 | what is an nvocc                           | US  | 210     | n/a | informational | 01   |
| 179 | sight draft                                | US  | 210     | n/a | informational | 01   |
| 180 | what is air freight                        | US  | 210     | 17  | informational | 01   |
| 181 | cbm in shipping                            | US  | 170     | 7   | navigational  | 01   |
| 182 | container number                           | US  | 170     | 49  | informational | 01   |
| 183 | customs inspection                         | US  | 170     | n/a | informational | 01   |
| 184 | dual use goods                             | US  | 170     | 17  | informational | 01   |
| 185 | freight prepaid                            | US  | 170     | n/a | commercial    | 01   |
| 186 | in bond shipment                           | US  | 170     | n/a | informational | 01   |
| 187 | port of discharge                          | US  | 170     | n/a | informational | 01   |
| 188 | restricted party screening                 | US  | 170     | n/a | informational | 01   |
| 189 | temporary import bond                      | US  | 170     | n/a | commercial    | 01   |
| 190 | what is a customs declaration              | US  | 170     | 21  | informational | 01   |
| 191 | what is trade compliance                   | US  | 170     | n/a | informational | 01   |
| 192 | what is usppi                              | US  | 170     | n/a | informational | 01   |
| 193 | arrival notice                             | US  | 140     | n/a | informational | 01   |
| 194 | etd shipping                               | US  | 140     | n/a | navigational  | 01   |
| 195 | exporter of record                         | US  | 140     | n/a | informational | 01   |
| 196 | groupage                                   | US  | 140     | n/a | informational | 01   |
| 197 | export credit insurance                    | US  | 140     | 4   | commercial    | 01   |
| 198 | import documents                           | US  | 140     | 18  | transactional | 01   |
| 199 | ams filing                                 | US  | 110     | n/a | informational | 01   |
| 200 | commercial invoice meaning                 | US  | 110     | 4   | informational | 01   |
| 201 | intermediate consignee                     | US  | 110     | n/a | navigational  | 01   |
| 202 | port of loading                            | US  | 110     | n/a | transactional | 01   |
| 203 | t2l                                        | US  | 110     | n/a | informational | 01   |
| 204 | vgm shipping                               | US  | 110     | n/a | navigational  | 01   |
| 205 | open account meaning                       | US  | 110     | n/a | informational | 01   |
| 206 | cash against documents                     | US  | 90      | n/a | transactional | 01   |
| 207 | customs broker meaning                     | US  | 90      | 12  | informational | 01   |
| 208 | documentary collection                     | US  | 90      | 2   | informational | 01   |
| 209 | bill of entry                              | US  | 70      | n/a | informational | 01   |
| 210 | duty paid                                  | US  | 70      | 24  | informational | 01   |
| 211 | export duty                                | US  | 70      | 42  | informational | 01   |
| 212 | port to port shipping                      | US  | 70      | 12  | commercial    | 01   |
| 213 | preferential tariff                        | US  | 70      | n/a | informational | 01   |
| 214 | shipping terms meaning                     | US  | 70      | 6   | informational | 01   |
| 215 | vat on imports                             | US  | 70      | 5   | informational | 01   |
| 216 | what is a high cube container              | US  | 70      | 12  | informational | 01   |
| 217 | container capacity                         | US  | 70      | 22  | informational | 01   |
| 218 | container stuffing                         | US  | 70      | 21  | transactional | 01   |
| 219 | what is ocean freight                      | US  | 70      | n/a | informational | 01   |
| 220 | customs exam                               | US  | 50      | 12  | informational | 01   |
| 221 | customs hold                               | US  | 50      | n/a | informational | 01   |
| 222 | eta shipping                               | US  | 50      | n/a | navigational  | 01   |
| 223 | mawb vs hawb                               | US  | 50      | n/a | informational | 01   |
| 224 | packing list meaning                       | US  | 50      | n/a | informational | 01   |
| 225 | what is a delivery order                   | US  | 50      | n/a | informational | 01   |
| 226 | chassis fee                                | US  | 50      | n/a | commercial    | 01   |
| 227 | shipping to canada from us                 | US  | 880     | 13  | informational | 02   |
| 228 | canada customs invoice                     | US  | 480     | n/a | informational | 02   |
| 229 | commercial invoice canada                  | US  | 480     | 2   | informational | 02   |
| 230 | shipping to india from us                  | US  | 480     | 3   | informational | 02   |
| 231 | shipping to mexico from us                 | US  | 480     | 5   | commercial    | 02   |
| 232 | shipping to australia from us              | US  | 390     | 14  | commercial    | 02   |
| 233 | export to brazil                           | US  | 260     | 5   | commercial    | 02   |
| 234 | export to canada                           | US  | 260     | 44  | commercial    | 02   |
| 235 | export to china                            | US  | 260     | 21  | commercial    | 02   |
| 236 | exporting to brazil                        | US  | 260     | 8   | commercial    | 02   |
| 237 | exporting to canada                        | US  | 260     | 40  | commercial    | 02   |
| 238 | exporting to china                         | US  | 260     | 5   | commercial    | 02   |
| 239 | shipping to germany from us                | US  | 210     | 11  | commercial    | 02   |
| 240 | export to india                            | US  | 140     | 17  | commercial    | 02   |
| 241 | exporting to india                         | US  | 140     | 27  | commercial    | 02   |
| 242 | shipping to brazil from us                 | US  | 140     | n/a | commercial    | 02   |
| 243 | shipping to japan from us                  | US  | 140     | 13  | informational | 02   |
| 244 | export to south korea                      | US  | 110     | 32  | commercial    | 02   |
| 245 | exporting to south korea                   | US  | 110     | 2   | commercial    | 02   |
| 246 | shipping to colombia from us               | US  | 110     | n/a | informational | 02   |
| 247 | shipping to new zealand from us            | US  | 90      | n/a | commercial    | 02   |
| 248 | shipping to spain from us                  | US  | 90      | 12  | informational | 02   |
| 249 | shipping to eu from us                     | US  | 90      | 10  | informational | 02   |
| 250 | shipping to israel from us                 | US  | 70      | n/a | commercial    | 02   |
| 251 | shipping to saudi arabia from us           | US  | 50      | n/a | commercial    | 02   |
| 252 | shipping to south africa from us           | US  | 50      | n/a | commercial    | 02   |
| 253 | shipping to uk from us                     | US  | 50      | 18  | informational | 02   |
| 254 | export to eu                               | US  | 50      | n/a | commercial    | 02   |
| 255 | exporting to eu                            | US  | 50      | 14  | informational | 02   |
| 256 | cm to inches                               | US  | 1220000 | 8   | informational | 03   |
| 257 | kg to lbs                                  | US  | 1220000 | 3   | informational | 03   |
| 258 | lbs to kg                                  | US  | 823000  | n/a | informational | 03   |
| 259 | inches to cm                               | US  | 550000  | 12  | informational | 03   |
| 260 | cubic feet calculator                      | US  | 40500   | n/a | informational | 03   |
| 261 | invoice maker                              | US  | 12100   | 62  | transactional | 03   |
| 262 | cbm to cft                                 | US  | 6600    | n/a | informational | 03   |
| 263 | cubic feet to cubic meters                 | US  | 6600    | n/a | informational | 03   |
| 264 | fca incoterms                              | US  | 6600    | n/a | navigational  | 03   |
| 265 | dap incoterms                              | US  | 4400    | 7   | navigational  | 03   |
| 266 | cubic meters to cubic feet                 | US  | 3600    | n/a | informational | 03   |
| 267 | quotation template                         | US  | 3600    | 8   | informational | 03   |
| 268 | exw incoterms                              | US  | 3600    | 10  | navigational  | 03   |
| 269 | commercial invoice template                | US  | 2400    | 18  | informational | 03   |
| 270 | commercial invoice template word           | US  | 2400    | 18  | transactional | 03   |
| 271 | packing list template                      | US  | 2400    | 5   | informational | 03   |
| 272 | fob incoterms                              | US  | 2400    | 18  | navigational  | 03   |
| 273 | cif incoterms                              | US  | 1900    | 14  | navigational  | 03   |
| 274 | dim weight calculator                      | US  | 1600    | 30  | informational | 03   |
| 275 | dimensional weight calculator              | US  | 1600    | 36  | informational | 03   |
| 276 | m3 to ft3                                  | US  | 1600    | n/a | informational | 03   |
| 277 | pallet calculator                          | US  | 1600    | n/a | informational | 03   |
| 278 | cpt incoterms                              | US  | 1600    | n/a | navigational  | 03   |
| 279 | cft to cbm                                 | US  | 1300    | n/a | informational | 03   |
| 280 | cubic feet to cbm                          | US  | 1300    | n/a | informational | 03   |
| 281 | fedex dimensional weight calculator        | US  | 1300    | 36  | informational | 03   |
| 282 | proforma invoice sample                    | US  | 1300    | 5   | informational | 03   |
| 283 | proforma invoice template                  | US  | 1300    | 5   | informational | 03   |
| 284 | proforma invoice template word             | US  | 1300    | n/a | informational | 03   |
| 285 | cfr incoterms                              | US  | 1000    | 2   | navigational  | 03   |
| 286 | ups dimensional weight calculator          | US  | 880     | 21  | informational | 03   |
| 287 | proforma invoice vs commercial invoice     | US  | 720     | n/a | informational | 03   |
| 288 | shipping container weight                  | US  | 720     | n/a | informational | 03   |
| 289 | chargeable weight calculator               | US  | 590     | n/a | transactional | 03   |
| 290 | shipping software for small business       | US  | 590     | 21  | commercial    | 03   |
| 291 | cubic meter calculator                     | US  | 480     | 18  | informational | 03   |
| 292 | customs invoice template                   | US  | 480     | 43  | informational | 03   |
| 293 | price quotation template                   | US  | 480     | 9   | commercial    | 03   |
| 294 | commercial invoice example                 | US  | 390     | 22  | transactional | 03   |
| 295 | commercial invoice sample                  | US  | 390     | 22  | informational | 03   |
| 296 | kg to cbm                                  | US  | 390     | 4   | informational | 03   |
| 297 | packing list example                       | US  | 390     | 10  | informational | 03   |
| 298 | customs duty calculator                    | US  | 320     | 46  | informational | 03   |
| 299 | how many cbm in a 40ft container           | US  | 320     | 9   | informational | 03   |
| 300 | shippers letter of instruction template    | US  | 320     | n/a | informational | 03   |
| 301 | sli template                               | US  | 320     | n/a | informational | 03   |
| 302 | dpu incoterms                              | US  | 320     | n/a | navigational  | 03   |
| 303 | container load calculator                  | US  | 260     | 7   | informational | 03   |
| 304 | container loading calculator               | US  | 260     | 7   | informational | 03   |
| 305 | freight forwarder software                 | US  | 260     | 6   | commercial    | 03   |
| 306 | freight forwarding software                | US  | 260     | 6   | commercial    | 03   |
| 307 | proforma invoice template excel            | US  | 260     | 3   | informational | 03   |
| 308 | shipping lithium batteries internationally | US  | 260     | 42  | commercial    | 03   |
| 309 | ups paperless invoice                      | US  | 260     | n/a | commercial    | 03   |
| 310 | 20ft container cbm                         | US  | 210     | 14  | transactional | 03   |
| 311 | cbm to cubic feet                          | US  | 210     | 2   | informational | 03   |
| 312 | delivery receipt template                  | US  | 210     | n/a | informational | 03   |
| 313 | how to ship a car internationally          | US  | 210     | 15  | informational | 03   |
| 314 | how to ship perfume internationally        | US  | 210     | n/a | informational | 03   |
| 315 | packing list format                        | US  | 210     | n/a | informational | 03   |
| 316 | packing list sample                        | US  | 210     | 8   | informational | 03   |
| 317 | how many cbm in a 20ft container           | US  | 170     | 10  | informational | 03   |
| 318 | fas incoterms                              | US  | 170     | n/a | navigational  | 03   |
| 319 | air freight calculator                     | US  | 140     | 3   | informational | 03   |
| 320 | commercial invoice form                    | US  | 140     | 19  | transactional | 03   |
| 321 | commercial invoice format                  | US  | 140     | 10  | informational | 03   |
| 322 | container calculator                       | US  | 140     | 41  | informational | 03   |
| 323 | delivery note template                     | US  | 140     | n/a | informational | 03   |
| 324 | dhl volumetric weight calculator           | US  | 140     | 17  | informational | 03   |
| 325 | how to start import export business        | US  | 140     | 25  | informational | 03   |
| 326 | packing list maker                         | US  | 140     | 10  | transactional | 03   |
| 327 | pallet configuration calculator            | US  | 140     | n/a | informational | 03   |
| 328 | proof of delivery template                 | US  | 140     | n/a | informational | 03   |
| 329 | shipping invoice template                  | US  | 140     | 23  | informational | 03   |
| 330 | weight to volume calculator                | US  | 140     | 15  | informational | 03   |
| 331 | incoterms explained                        | US  | 140     | 38  | informational | 03   |
| 332 | freight invoice template                   | US  | 110     | n/a | informational | 03   |
| 333 | incoterms 2020 pdf                         | US  | 110     | 13  | informational | 03   |
| 334 | fca vs dap                                 | US  | 110     | n/a | informational | 03   |
| 335 | incoterms table                            | US  | 90      | 37  | informational | 03   |
| 336 | pallet label template                      | US  | 90      | 4   | transactional | 03   |
| 337 | pallet loading calculator                  | US  | 90      | n/a | informational | 03   |
| 338 | commercial invoice template pdf            | US  | 70      | 3   | informational | 03   |
| 339 | commercial invoice vs invoice              | US  | 70      | n/a | informational | 03   |
| 340 | container cbm                              | US  | 70      | 8   | informational | 03   |
| 341 | how to fill out a commercial invoice       | US  | 70      | 20  | informational | 03   |
| 342 | proforma invoice vs quotation              | US  | 70      | 6   | informational | 03   |
| 343 | shipping artwork internationally           | US  | 70      | 11  | commercial    | 03   |
| 344 | fob vs dap                                 | US  | 70      | n/a | informational | 03   |
| 345 | 40ft container cbm                         | US  | 50      | n/a | transactional | 03   |
| 346 | cbm to kg calculator                       | US  | 50      | n/a | informational | 03   |
| 347 | commercial invoice requirements            | US  | 50      | n/a | informational | 03   |
| 348 | delivery note sample                       | US  | 50      | 28  | informational | 03   |
| 349 | export invoice                             | US  | 50      | 1   | informational | 03   |
| 350 | exporting wine                             | US  | 50      | n/a | commercial    | 03   |
| 351 | how many boxes fit on a pallet             | US  | 50      | n/a | informational | 03   |
| 352 | how to create a commercial invoice         | US  | 50      | 20  | informational | 03   |
| 353 | incoterms pdf                              | US  | 50      | n/a | informational | 03   |
| 354 | cif vs dap                                 | US  | 50      | n/a | informational | 03   |
| 355 | exw vs dap                                 | US  | 50      | n/a | informational | 03   |
| 356 | fas vs fob                                 | US  | 50      | n/a | informational | 03   |
| 357 | incoterms cheat sheet                      | US  | 50      | n/a | informational | 03   |
| 358 | packing list                               | US  | 40500   | 17  | informational | 04   |
| 359 | pro forma invoice                          | US  | 12100   | 8   | transactional | 04   |
| 360 | proforma invoice                           | US  | 12100   | 7   | transactional | 04   |
| 361 | lxwxh                                      | US  | 8100    | n/a | informational | 04   |
| 362 | ddp shipping                               | US  | 6600    | 12  | navigational  | 04   |
| 363 | exim bank                                  | US  | 4400    | 61  | navigational  | 04   |
| 364 | importing into the us                      | US  | 4400    | 41  | informational | 04   |
| 365 | goods received note                        | US  | 4400    | n/a | informational | 04   |
| 366 | what is a pro forma invoice                | US  | 4400    | 6   | informational | 04   |
| 367 | commercial invoice                         | US  | 3600    | 24  | commercial    | 04   |
| 368 | importing from china                       | US  | 2400    | 32  | informational | 04   |
| 369 | phytosanitary certificate                  | US  | 2400    | 7   | informational | 04   |
| 370 | heat treated pallets                       | US  | 1900    | n/a | transactional | 04   |
| 371 | how to calculate shipping cost             | US  | 1900    | 49  | informational | 04   |
| 372 | what is ddp shipping                       | US  | 1900    | 24  | informational | 04   |
| 373 | export import bank                         | US  | 1600    | 82  | commercial    | 04   |
| 374 | how to measure a box for shipping          | US  | 1600    | n/a | informational | 04   |
| 375 | length width height order                  | US  | 1300    | 12  | informational | 04   |
| 376 | pro forma invoice template                 | US  | 1300    | 17  | informational | 04   |
| 377 | proforma invoice example                   | US  | 1300    | 11  | informational | 04   |
| 378 | dap terms                                  | US  | 1000    | 19  | informational | 04   |
| 379 | ispm 15                                    | US  | 1000    | 47  | informational | 04   |
| 380 | ddp terms                                  | US  | 880     | 24  | informational | 04   |
| 381 | fob terms                                  | US  | 880     | 12  | informational | 04   |
| 382 | how to import                              | US  | 880     | 15  | informational | 04   |
| 383 | fob origin vs fob destination              | US  | 720     | n/a | informational | 04   |
| 384 | fob shipping terms                         | US  | 720     | 13  | informational | 04   |
| 385 | pedimento                                  | US  | 720     | n/a | informational | 04   |
| 386 | shipping terms fob                         | US  | 720     | 13  | informational | 04   |
| 387 | advance shipping notice                    | US  | 590     | n/a | informational | 04   |
| 388 | asn shipping                               | US  | 590     | n/a | navigational  | 04   |
| 389 | ccc certification                          | US  | 590     | 15  | informational | 04   |
| 390 | cif terms                                  | US  | 590     | 8   | informational | 04   |
| 391 | exw terms                                  | US  | 590     | 9   | informational | 04   |
| 392 | freight terms fob                          | US  | 590     | 14  | informational | 04   |
| 393 | nota fiscal                                | US  | 590     | 24  | informational | 04   |
| 394 | shipping order                             | US  | 590     | 100 | navigational  | 04   |
| 395 | box dimensions order                       | US  | 480     | n/a | informational | 04   |
| 396 | how to calculate dimensional weight        | US  | 390     | 36  | informational | 04   |
| 397 | ispm 15 stamp                              | US  | 390     | 32  | informational | 04   |
| 398 | delivery note                              | US  | 390     | n/a | transactional | 04   |
| 399 | how to calculate cbm                       | US  | 320     | 13  | informational | 04   |
| 400 | partial shipment                           | US  | 320     | n/a | informational | 04   |
| 401 | packing list template excel                | US  | 320     | 1   | informational | 04   |
| 402 | proforma invoice definition                | US  | 320     | 9   | informational | 04   |
| 403 | packing list pdf                           | US  | 260     | 6   | informational | 04   |
| 404 | first sale rule                            | US  | 210     | n/a | informational | 04   |
| 405 | iec code                                   | US  | 210     | 16  | informational | 04   |
| 406 | incoterms list                             | US  | 210     | 40  | informational | 04   |
| 407 | list of incoterms                          | US  | 210     | 37  | informational | 04   |
| 408 | siscomex                                   | US  | 210     | 5   | navigational  | 04   |
| 409 | booking request                            | US  | 210     | 3   | transactional | 04   |
| 410 | free commercial invoice template           | US  | 210     | n/a | informational | 04   |
| 411 | packing list shipping                      | US  | 210     | n/a | informational | 04   |
| 412 | export business                            | US  | 170     | 52  | commercial    | 04   |
| 413 | ispm 15 pallets                            | US  | 170     | 39  | transactional | 04   |
| 414 | free packing list template                 | US  | 170     | 3   | informational | 04   |
| 415 | customs clearance process                  | US  | 140     | 21  | informational | 04   |
| 416 | how to calculate freight cost              | US  | 140     | 14  | informational | 04   |
| 417 | legalized invoice                          | US  | 140     | n/a | informational | 04   |
| 418 | split shipment                             | US  | 140     | 8   | commercial    | 04   |
| 419 | commercial invoice template excel          | US  | 140     | 8   | informational | 04   |
| 420 | shipping instructions                      | US  | 140     | 5   | informational | 04   |
| 421 | export commercial invoice                  | US  | 110     | 22  | informational | 04   |
| 422 | export financing                           | US  | 110     | n/a | commercial    | 04   |
| 423 | fumigation certificate                     | US  | 110     | n/a | informational | 04   |
| 424 | how to fill out a bill of lading           | US  | 110     | 10  | informational | 04   |
| 425 | how to import from china                   | US  | 110     | 6   | informational | 04   |
| 426 | how to measure a pallet                    | US  | 110     | n/a | informational | 04   |
| 427 | kc certification                           | US  | 110     | 12  | informational | 04   |
| 428 | rex number                                 | US  | 110     | n/a | informational | 04   |
| 429 | what is an export license                  | US  | 110     | 4   | informational | 04   |
| 430 | commercial invoice definition              | US  | 110     | 5   | informational | 04   |
| 431 | commercial invoice pdf                     | US  | 110     | 1   | informational | 04   |
| 432 | what is a delivery note                    | US  | 110     | n/a | informational | 04   |
| 433 | dimensional weight formula                 | US  | 90      | 36  | informational | 04   |
| 434 | export compliance program                  | US  | 90      | 8   | commercial    | 04   |
| 435 | how does international shipping work       | US  | 90      | 32  | informational | 04   |
| 436 | how to calculate volume weight             | US  | 90      | 18  | informational | 04   |
| 437 | how to measure package dimensions          | US  | 90      | 16  | informational | 04   |
| 438 | who pays import duties                     | US  | 90      | 26  | informational | 04   |
| 439 | dispatch note                              | US  | 90      | n/a | informational | 04   |
| 440 | shipping note                              | US  | 90      | n/a | informational | 04   |
| 441 | 10 digit hts code                          | US  | 70      | 27  | informational | 04   |
| 442 | cbm formula                                | US  | 70      | 9   | informational | 04   |
| 443 | importer exporter code                     | US  | 70      | 17  | commercial    | 04   |
| 444 | pedimento mexico                           | US  | 70      | 3   | navigational  | 04   |
| 445 | packing note                               | US  | 70      | n/a | informational | 04   |
| 446 | documents required for export              | US  | 50      | 7   | informational | 04   |
| 447 | export assistance                          | US  | 50      | 19  | informational | 04   |
| 448 | how to calculate landed cost               | US  | 50      | 12  | informational | 04   |
| 449 | invoice in foreign currency                | US  | 50      | n/a | informational | 04   |
| 450 | landed cost formula                        | US  | 50      | n/a | informational | 04   |
| 451 | letter of credit process                   | US  | 50      | n/a | informational | 04   |
| 452 | what is an export declaration              | US  | 50      | 1   | informational | 04   |
| 453 | delivery note vs invoice                   | US  | 50      | n/a | informational | 04   |
| 454 | free proforma invoice template             | US  | 50      | 2   | informational | 04   |
| 455 | commerce control list                      | US  | 40500   | 12  | informational | 05   |
| 456 | nafta                                      | US  | 40500   | 35  | informational | 05   |
| 457 | cnpj                                       | US  | 8100    | 66  | navigational  | 05   |
| 458 | rfc mexico                                 | US  | 5400    | n/a | navigational  | 05   |
| 459 | japan customs                              | US  | 2400    | 72  | informational | 05   |
| 460 | letter of indemnity                        | US  | 2400    | n/a | informational | 05   |
| 461 | how much does a pallet weigh               | US  | 1900    | n/a | informational | 05   |
| 462 | mexico customs                             | US  | 1900    | 5   | informational | 05   |
| 463 | standard box sizes for shipping            | US  | 1300    | 26  | informational | 05   |
| 464 | cisg                                       | US  | 1000    | 4   | informational | 05   |
| 465 | documentary credit                         | US  | 1000    | 5   | informational | 05   |
| 466 | pallet weight                              | US  | 1000    | n/a | transactional | 05   |
| 467 | sales contract template                    | US  | 1000    | 8   | informational | 05   |
| 468 | shipping from china to us                  | US  | 1000    | 2   | informational | 05   |
| 469 | india customs                              | US  | 880     | 19  | informational | 05   |
| 470 | eccn lookup                                | US  | 720     | 5   | informational | 05   |
| 471 | shipping to mexico                         | US  | 590     | 7   | commercial    | 05   |
| 472 | shipping from us to mexico                 | US  | 480     | 5   | informational | 05   |
| 473 | australia customs                          | US  | 390     | 27  | informational | 05   |
| 474 | cbp form 3299                              | US  | 390     | n/a | informational | 05   |
| 475 | china customs                              | US  | 390     | 52  | informational | 05   |
| 476 | freight insurance                          | US  | 390     | n/a | commercial    | 05   |
| 477 | india import tax                           | US  | 390     | 4   | informational | 05   |
| 478 | indian customs duty                        | US  | 390     | 5   | informational | 05   |
| 479 | third party inspection                     | US  | 390     | n/a | informational | 05   |
| 480 | brazil customs                             | US  | 320     | 3   | informational | 05   |
| 481 | carta porte                                | US  | 320     | n/a | navigational  | 05   |
| 482 | cbp form 3461                              | US  | 320     | n/a | informational | 05   |
| 483 | inspection certificate                     | US  | 260     | n/a | informational | 05   |
| 484 | continuous bond                            | US  | 210     | n/a | informational | 05   |
| 485 | customs clearance agent                    | US  | 210     | 6   | commercial    | 05   |
| 486 | germany customs                            | US  | 210     | 28  | informational | 05   |
| 487 | uk import duty                             | US  | 210     | 23  | informational | 05   |
| 488 | customs entry                              | US  | 170     | 12  | informational | 05   |
| 489 | japan import tax                           | US  | 170     | 7   | informational | 05   |
| 490 | korea customs                              | US  | 170     | 29  | informational | 05   |
| 491 | how to wrap a pallet                       | US  | 140     | n/a | informational | 05   |
| 492 | pi meaning in business                     | US  | 140     | n/a | informational | 05   |
| 493 | zoll germany                               | US  | 140     | 21  | informational | 05   |
| 494 | australia import tax                       | US  | 110     | 19  | informational | 05   |
| 495 | brazil import tax                          | US  | 110     | 2   | informational | 05   |
| 496 | cbp form 28                                | US  | 110     | n/a | informational | 05   |
| 497 | entry summary                              | US  | 110     | 32  | informational | 05   |
| 498 | how to ship to china                       | US  | 110     | 3   | informational | 05   |
| 499 | how to stack boxes on a pallet             | US  | 110     | 3   | informational | 05   |
| 500 | pi and po                                  | US  | 110     | n/a | informational | 05   |
| 501 | single entry bond                          | US  | 110     | n/a | navigational  | 05   |
| 502 | american goods returned                    | US  | 90      | 1   | informational | 05   |
| 503 | country commercial guides                  | US  | 90      | 33  | informational | 05   |
| 504 | pallet weight limit                        | US  | 90      | n/a | informational | 05   |
| 505 | sea freight from china to usa              | US  | 90      | 20  | commercial    | 05   |
| 506 | cbp form 29                                | US  | 70      | n/a | informational | 05   |
| 507 | how to ship to australia                   | US  | 70      | 20  | informational | 05   |
| 508 | how to ship to germany                     | US  | 70      | 29  | informational | 05   |
| 509 | how to ship to mexico                      | US  | 70      | 8   | informational | 05   |
| 510 | informal entry                             | US  | 70      | 3   | informational | 05   |
| 511 | isf 5                                      | US  | 70      | 5   | informational | 05   |
| 512 | mexico import tax                          | US  | 70      | n/a | informational | 05   |
| 513 | pre shipment inspection                    | US  | 70      | 34  | informational | 05   |
| 514 | surrender bill of lading                   | US  | 70      | n/a | transactional | 05   |
| 515 | us export regulations                      | US  | 70      | 26  | informational | 05   |
| 516 | australia customs clearance                | US  | 50      | 25  | informational | 05   |
| 517 | china customs clearance                    | US  | 50      | n/a | commercial    | 05   |
| 518 | export to europe                           | US  | 50      | 15  | informational | 05   |
| 519 | germany import tax                         | US  | 50      | 18  | informational | 05   |
| 520 | isf penalty                                | US  | 50      | n/a | informational | 05   |
| 521 | max pallet height                          | US  | 50      | n/a | transactional | 05   |
| 522 | negotiable bill of lading                  | US  | 50      | n/a | commercial    | 05   |
| 523 | pallet height limit                        | US  | 50      | n/a | informational | 05   |
| 524 | uk customs declaration                     | US  | 50      | 14  | informational | 05   |
| 525 | cds                                        | UK  | 40500   | 45  | informational | 06   |
| 526 | eori number                                | UK  | 14800   | 31  | informational | 06   |
| 527 | ncts                                       | UK  | 14800   | 66  | informational | 06   |
| 528 | commodity code                             | UK  | 12100   | 18  | informational | 06   |
| 529 | hs code                                    | UK  | 12100   | 72  | informational | 06   |
| 530 | incoterms                                  | UK  | 9900    | 45  | informational | 06   |
| 531 | chief                                      | UK  | 8100    | 75  | informational | 06   |
| 532 | proforma invoice                           | UK  | 8100    | n/a | transactional | 06   |
| 533 | packing list                               | UK  | 6600    | 14  | informational | 06   |
| 534 | ce marking                                 | UK  | 5400    | 37  | informational | 06   |
| 535 | fob meaning                                | UK  | 5400    | 11  | informational | 06   |
| 536 | air waybill                                | UK  | 4400    | 1   | navigational  | 06   |
| 537 | euro pallet size                           | UK  | 4400    | 10  | informational | 06   |
| 538 | ipaffs                                     | UK  | 4400    | n/a | informational | 06   |
| 539 | tariff code                                | UK  | 4400    | 36  | informational | 06   |
| 540 | freight forwarder                          | UK  | 3600    | 14  | commercial    | 06   |
| 541 | teu                                        | UK  | 3600    | 10  | informational | 06   |
| 542 | trade tariff                               | UK  | 3600    | 26  | informational | 06   |
| 543 | cmr                                        | UK  | 2900    | 2   | informational | 06   |
| 544 | consignee                                  | UK  | 2900    | 3   | informational | 06   |
| 545 | customs duty uk                            | UK  | 2900    | 22  | informational | 06   |
| 546 | import duty uk                             | UK  | 2900    | 22  | informational | 06   |
| 547 | uk import duty                             | UK  | 2900    | 24  | informational | 06   |
| 548 | bill of lading                             | UK  | 2400    | 35  | informational | 06   |
| 549 | ehc                                        | UK  | 2400    | 24  | informational | 06   |
| 550 | import duty calculator                     | UK  | 2400    | 43  | informational | 06   |
| 551 | uk trade tariff                            | UK  | 2400    | 16  | informational | 06   |
| 552 | uk export finance                          | UK  | 1900    | 27  | informational | 06   |
| 553 | ukca marking                               | UK  | 1900    | 7   | informational | 06   |
| 554 | ata carnet                                 | UK  | 1600    | 28  | informational | 06   |
| 555 | fca meaning                                | UK  | 1600    | 27  | informational | 06   |
| 556 | incoterms 2020                             | UK  | 1600    | 31  | informational | 06   |
| 557 | pallet sizes                               | UK  | 1600    | n/a | transactional | 06   |
| 558 | phytosanitary certificate                  | UK  | 1600    | 5   | informational | 06   |
| 559 | shipping container sizes                   | UK  | 1600    | 16  | informational | 06   |
| 560 | uk pallet size                             | UK  | 1600    | n/a | informational | 06   |
| 561 | windsor framework                          | UK  | 1600    | 17  | informational | 06   |
| 562 | 20ft container dimensions                  | UK  | 1300    | 10  | informational | 06   |
| 563 | cbm calculator                             | UK  | 1300    | 8   | informational | 06   |
| 564 | consignor                                  | UK  | 1300    | n/a | navigational  | 06   |
| 565 | dap meaning                                | UK  | 1300    | 29  | informational | 06   |
| 566 | verified gross mass                        | UK  | 1300    | n/a | informational | 06   |
| 567 | vgm                                        | UK  | 1300    | 31  | informational | 06   |
| 568 | commercial invoice                         | UK  | 1000    | 1   | commercial    | 06   |
| 569 | country of origin                          | UK  | 1000    | 2   | informational | 06   |
| 570 | exporting from uk                          | UK  | 1000    | 48  | informational | 06   |
| 571 | ioss                                       | UK  | 1000    | 26  | informational | 06   |
| 572 | ioss number                                | UK  | 1000    | 20  | informational | 06   |
| 573 | letter of credit                           | UK  | 1000    | 12  | informational | 06   |
| 574 | postponed vat accounting                   | UK  | 1000    | 1   | informational | 06   |
| 575 | standard pallet size uk                    | UK  | 1000    | n/a | informational | 06   |
| 576 | cif meaning                                | UK  | 880     | 4   | informational | 06   |
| 577 | ddp meaning                                | UK  | 880     | 7   | informational | 06   |
| 578 | delivery note                              | UK  | 880     | 2   | transactional | 06   |
| 579 | dunnage                                    | UK  | 880     | 4   | informational | 06   |
| 580 | excise duty                                | UK  | 880     | 13  | informational | 06   |
| 581 | gvms                                       | UK  | 880     | n/a | informational | 06   |
| 582 | hs code lookup                             | UK  | 880     | 86  | informational | 06   |
| 583 | made in uk                                 | UK  | 880     | 51  | informational | 06   |
| 584 | shipper                                    | UK  | 880     | 11  | informational | 06   |
| 585 | shipping to usa from uk                    | UK  | 880     | 4   | commercial    | 06   |
| 586 | 40ft container dimensions                  | UK  | 590     | 10  | informational | 06   |
| 587 | commercial invoice template                | UK  | 590     | n/a | informational | 06   |
| 588 | customs declaration                        | UK  | 590     | 35  | informational | 06   |
| 589 | customs declaration service                | UK  | 590     | 5   | navigational  | 06   |
| 590 | import vat                                 | UK  | 590     | n/a | informational | 06   |
| 591 | what is a freight forwarder                | UK  | 590     | 12  | informational | 06   |
| 592 | commodity code lookup                      | UK  | 480     | 62  | informational | 06   |
| 593 | customs broker                             | UK  | 480     | 15  | commercial    | 06   |
| 594 | delivery note template                     | UK  | 480     | n/a | informational | 06   |
| 595 | delivery note template word                | UK  | 480     | n/a | informational | 06   |
| 596 | exw meaning                                | UK  | 480     | n/a | informational | 06   |
| 597 | heat treated pallets                       | UK  | 480     | n/a | transactional | 06   |
| 598 | ispm 15                                    | UK  | 480     | 36  | informational | 06   |
| 599 | proforma invoice template                  | UK  | 480     | n/a | informational | 06   |
| 600 | volumetric weight calculator               | UK  | 480     | 11  | informational | 06   |
| 601 | bill of exchange                           | UK  | 390     | 4   | informational | 06   |
| 602 | cmr document                               | UK  | 390     | 17  | informational | 06   |
| 603 | customs agent                              | UK  | 390     | 5   | navigational  | 06   |
| 604 | export health certificate                  | UK  | 390     | 5   | informational | 06   |
| 605 | shipping to australia from uk              | UK  | 390     | 12  | commercial    | 06   |
| 606 | export licence                             | UK  | 320     | 5   | informational | 06   |
| 607 | harmonised system                          | UK  | 320     | 68  | informational | 06   |
| 608 | how many pallets in a 40ft container       | UK  | 320     | n/a | informational | 06   |
| 609 | ata carnet uk                              | UK  | 260     | 13  | navigational  | 06   |
| 610 | certificate of free sale                   | UK  | 260     | 2   | transactional | 06   |
| 611 | customs declaration uk                     | UK  | 260     | 14  | informational | 06   |
| 612 | dangerous goods note                       | UK  | 260     | n/a | informational | 06   |
| 613 | duty deferment account                     | UK  | 260     | 6   | informational | 06   |
| 614 | how many pallets in a 20ft container       | UK  | 260     | n/a | informational | 06   |
| 615 | packing list template                      | UK  | 260     | 4   | informational | 06   |
| 616 | pallet calculator                          | UK  | 260     | n/a | informational | 06   |
| 617 | returned goods relief                      | UK  | 260     | 9   | informational | 06   |
| 618 | shipping to canada from uk                 | UK  | 260     | n/a | informational | 06   |
| 619 | t1 document                                | UK  | 260     | n/a | informational | 06   |
| 620 | volumetric weight                          | UK  | 260     | 6   | informational | 06   |
| 621 | border control post                        | UK  | 210     | 6   | navigational  | 06   |
| 622 | export declaration                         | UK  | 210     | 3   | informational | 06   |
| 623 | port health                                | UK  | 210     | 8   | informational | 06   |
| 624 | shipping to northern ireland               | UK  | 210     | 8   | commercial    | 06   |
| 625 | what is a delivery note                    | UK  | 210     | n/a | informational | 06   |
| 626 | c88                                        | UK  | 170     | n/a | informational | 06   |
| 627 | customs warehouse                          | UK  | 170     | n/a | commercial    | 06   |
| 628 | shipping to ireland from uk                | UK  | 170     | 8   | informational | 06   |
| 629 | commercial invoice template uk             | UK  | 140     | n/a | informational | 06   |
| 630 | export licence uk                          | UK  | 140     | 4   | informational | 06   |
| 631 | export packing                             | UK  | 140     | n/a | commercial    | 06   |
| 632 | landed cost                                | UK  | 140     | 8   | informational | 06   |
| 633 | shipping to germany from uk                | UK  | 140     | n/a | informational | 06   |
| 634 | temporary admission                        | UK  | 140     | n/a | informational | 06   |
| 635 | tir carnet                                 | UK  | 140     | 9   | informational | 06   |
| 636 | uk global tariff                           | UK  | 140     | n/a | commercial    | 06   |
| 637 | vat on exports                             | UK  | 140     | 8   | informational | 06   |
| 638 | export academy                             | UK  | 110     | n/a | informational | 06   |
| 639 | incoterms explained                        | UK  | 110     | n/a | informational | 06   |
| 640 | inward processing                          | UK  | 110     | n/a | informational | 06   |
| 641 | cmr note                                   | UK  | 90      | n/a | informational | 06   |
| 642 | container loading calculator               | UK  | 90      | n/a | informational | 06   |
| 643 | customs valuation                          | UK  | 90      | n/a | commercial    | 06   |
| 644 | customs value                              | UK  | 90      | n/a | informational | 06   |
| 645 | dimensional weight                         | UK  | 90      | n/a | informational | 06   |
| 646 | export certificate                         | UK  | 90      | n/a | informational | 06   |
| 647 | goods vehicle movement service             | UK  | 90      | n/a | commercial    | 06   |
| 648 | landed cost calculator                     | UK  | 90      | n/a | commercial    | 06   |
| 649 | shipping to eu from uk                     | UK  | 90      | 4   | informational | 06   |
| 650 | shipping to europe from uk                 | UK  | 90      | 4   | informational | 06   |
| 651 | shipping to france from uk                 | UK  | 90      | n/a | informational | 06   |
| 652 | chargeable weight                          | UK  | 70      | n/a | informational | 06   |
| 653 | export goods from uk                       | UK  | 70      | 6   | commercial    | 06   |
| 654 | outward processing                         | UK  | 70      | n/a | informational | 06   |
| 655 | t2l                                        | UK  | 70      | n/a | informational | 06   |
| 656 | entry summary declaration                  | UK  | 50      | n/a | informational | 06   |
| 657 | export support service                     | UK  | 50      | 19  | navigational  | 06   |
| 658 | northern ireland customs                   | UK  | 50      | n/a | informational | 06   |
| 659 | shipping to norway from uk                 | UK  | 50      | n/a | informational | 06   |
| 660 | shipping to switzerland from uk            | UK  | 50      | n/a | informational | 06   |
