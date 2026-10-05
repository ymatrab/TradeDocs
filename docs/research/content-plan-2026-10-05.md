# Content plan from keyword and competitor data — 2026-10-05

Source: DataForSEO under D-014, Google US in English, plus the UK for the top 24 seeds. Raw data is in `dataforseo-2026-10-05/` (files 01–23). Vol = US monthly searches. KD = keyword difficulty (0–100). Close variants are grouped, so volumes overlap and should not be summed. The SERP type is our reading of the live top 10. Competitor `etv` is a DataForSEO modelled estimate.

## Keyword clusters

| Keyword | Vol | KD | Intent | SERP page type | Target URL | P |
| --- | --- | --- | --- | --- | --- | --- |
| commercial invoice template | 2,400 | 18 | info | Image pack (incodocs, eforms), PDF/Scribd, blogs | `/tools/invoice-generator` | P1 |
| commercial invoice | 3,600 | 24 | commercial | AI overview, carrier how-tos | `/tools/invoice-generator` | P1 |
| proforma invoice | 12,100 | 7 | transactional | AI overview, glossaries, template images | new `/tools/proforma-invoice-generator` | P1 |
| proforma invoice template | 1,300 | 5 | info | not pulled | same | P1 |
| packing list template | 2,400 | 5 | info | Travel-dominated; pdfFiller #4, incodocs #11 | new `/tools/packing-list-generator` | P1 |
| cbm calculator | 4,400 | 12 | info | Calculators only | `/tools/cbm-calculator` | P1 |
| dimensional weight calculator | 1,600 | 36 | info | Calculators + AI overview | `/tools/chargeable-weight` | P1 |
| incoterms | 22,200 | 41 | info | AI overview (ICC, trade.gov, incodocs), guides | `/tools/incoterms` | P1 |
| fca / dap / ddp / exw incoterm | 6,600 / 4,400 / 3,600 / 3,600 | ≤14 | nav | not pulled | `/tools/incoterms/[code]` | P1 |
| ddp shipping / fob shipping | 6,600 / 5,400 | 12 / 6 | nav/comm. | not pulled | rule pages | P1 |
| proforma vs commercial invoice | 720 | 5 | info | not pulled | new guide | P1 |
| fob meaning | 33,100 | 5 | info | Mixed with key fob and slang | `/tools/incoterms/fob` | P2 |
| cbm to cubic feet | 6,600 | n/a | info | not pulled | section on the CBM page | P2 |
| dap vs ddp | 1,900 | n/a | info | not pulled | new comparison | P2 |
| less than container load | 22,200 | 2 | info | not pulled | new LCL vs FCL guide | P2 |
| certificate of origin | 4,400 | 37 | info | not pulled | new explainer | P2 |
| landed cost calculator | 320 | 10 | commercial | not pulled | new tool | P2 |
| container loading calculator | 260 | 7 | info | not pulled | extend the CBM page | P3 |
| hs code | 14,800 | 74 | info | not pulled | guide only | P3 |
| incodocs alternative | 0 | n/a | nav | n/a | defer | P3 |

UK (file 22): proforma invoice 8,100, incoterms 9,900, commercial invoice 1,000 (KD 1), delivery note template 480. UK searchers use "volumetric weight" (480) rather than "dimensional" (50).

## Competitors seen in the data

- **incodocs.com** appears in every money SERP we pulled: template images for invoice, packing list and CoO, #11 for packing list template, and a citation in the Incoterms AI overview. Its top US pages by etv (file 21) are off-topic posts (NATO alphabet ≈6,477, NMFC chart ≈1,181), the Incoterms guide (≈998), FCA vs FOB (≈452), templates (proforma ≈276, packing list ≈151, bill of lading ≈147) and `/ports/*` programmatic pages.
- **Template farms** (Scribd, pdfFiller, templatelab, template.net) hold the template SERPs with static files. **Calculator sites** (cbmcalculator.com, omni, freightos, ovrseas.io) hold the CBM results. **Carriers** (UPS, FedEx, TNT, DHL) hold the how-tos.
- Product claims about any competitor must come from its live page before we publish them.

## Phase 1: money pages

1. **Invoice generator**: add "commercial invoice template" to the title and H1. Answer the PAA questions visibly (create my own, required fields, standard format), add a filled example image so the page can appear in the image pack, and link to the proforma and packing list pages. A fillable generator beats the static PDFs that rank now.
2. **CBM**: add cubic-feet output with a CBM-to-cft section, which serves the 6,600 conversion searches without a thin page. Add "cartons/pallets in a 20/40 ft container" (390).
3. **Chargeable weight**: name it "Dimensional (volumetric) weight calculator". Show divisors only from the carrier sources already cited.
4. **Incoterms hub**: add a visible chart ("incoterms chart", 880) and FAQPage. Retitle the rule pages by search phrasing ("FOB meaning in shipping", "DDP shipping", "DAP meaning"). The FOB page should lead with the trade sense, because the SERP mixes in other meanings.
5. **Home**: links to the three generators; no keyword target.
6. **New `/tools/proforma-invoice-generator`** (`proforma_invoice` kind exists): targets the template (1,300) and carries a definition block for "what is a proforma invoice" (4,400).
7. **New `/tools/packing-list-generator`** (`packing_list` kind exists): targets the shipping/export template and the Excel variant (320). The trade share of the 2,400 is smaller than the headline number, but this page is the product's own output, and incodocs earns traffic with the equivalent page.

## Guides

- Proforma vs commercial invoice (720, KD 5–7).
- How to fill out a commercial invoice: answers the PAA for 3,600 and names CBP 19 CFR 141.86.
- LCL vs FCL (22,200, KD 2): feeds the CBM calculator.
- Certificate of origin explained (4,400): explainer only. The template stays gated (D-002), so we do not target "certificate of origin template" (1,300).
- HS codes on an invoice (P3): the head term is KD 74 lookup intent, and we are not a classifier.

## Blog

- Incoterm pairs with measured demand: DAP vs DDP (1,900), FCA vs FOB (720), EXW vs FOB (320), CIF vs FOB (320). Each states the cited ICC position.
- Incodocs alternative: 0 volume (140 for the brand name). Defer. Write it only for its sales role, with dated claims from the live page.

## Free tools

- Landed cost calculator (P2): "landed cost calculator" 320, "landed cost" 1,000 at KD 5. It uses only user-entered duty rates and no tariff lookup.
- Container loading (P3): build it as a CBM extension.

## Programmatic pages

- **Per-Incoterm: yes, already built.** Eight rules have 1,000–6,600 searches each. DPU (70), FAS (40) and CIP (0) stay for completeness. No expansion.
- **Incoterm pairs**: only the four listed above.
- **Per-country, port or HS: no.** HS demand is lookup intent on KD 70+ government and tariff SERPs. Country duty pages would state regulated facts we cannot source or keep current. The incodocs `/ports` pages rest on a port dataset we do not have.
- **Per-carrier DIM** (FedEx 1,300, UPS 880): sections on the existing page, not separate pages, because they rely on carrier brands and divisors that change.

## Excluded

- **Legitimacy:** fake invoice generator (210), fake commercial invoice, fake packing list, fake certificate of origin (10), undervalue commercial invoice / commercial invoice lower value.
- **Wrong intent:** travel and cruise packing lists, packing slip template, cbm 64 / cbm motorsports, key fob and FOB slang, vehicle or manufacturer's certificate of origin and "certificate of origin vs title", FedEx/UPS/Farfetch commercial invoice (navigational).
- **Out of scope for now:** freight class calculator (14,800), schedule B (12,100), HS/HTS lookup, bill of lading template (1,900, until the BOL draft is approved), USMCA certificate of origin, purchase order and quotation templates (6,600 / 3,600, until those kinds exist).

## DataForSEO usage

- **23 of 40 calls:** 3 keyword_overview (2 US, 1 UK), 10 keyword_suggestions, 9 SERP, 1 relevant_pages.
- **Cost: not reported.** The MCP responses carry no `cost` field. Check spend in the DataForSEO dashboard.
- Files 01–07 and 12 are raw responses. Files 08–11 and 13–23 came back inline only and are condensed transcriptions keyed by response id, each marked as such.
