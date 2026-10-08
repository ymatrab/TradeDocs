# Content plan v4: wave E, past 250 public pages — 2026-10-08

Plan of record for D-022 (at least 250 public pages including 100 blog posts) under D-023 (12 more DataForSEO calls, regulated glossary terms listed at launch like country pages), D-019 (trade-document keywords only, no payroll) and D-008 (certificate of origin gated: no page about it). It extends [content-plan-v3-2026-10-07.md](content-plan-v3-2026-10-07.md); v3's template specs, routing table and exclusions still apply, and this file only adds wave E.

Data: DataForSEO Labs and SERP API, Google, English. New data is in [`dataforseo-2026-10-08/`](dataforseo-2026-10-08/) (files 01–12, below); the 2026-10-07 files were reused first. Vol = monthly searches, US unless marked CA, AU or UK. KD = keyword difficulty (0–100), "n/a" where DataForSEO returned none. Close variants overlap, so volumes are listed, never summed.

## The answer first

- **Wave E: 30 new pages with measured demand** (15 posts, 15 glossary terms), none already covered by a post, guide, glossary term, country page or tool. 212 sitemap URLs + about 12 unlisted pages today = about 224; after wave E **about 254 public pages**.
- **Blog posts today: 100** (files in `src/lib/content/posts`, excluding `index.ts`). Wave E's 15 posts take the blog to **115**.
- Margin: if a row fails its writing check (two rows carry one), replace it from v3's 20 help articles (conversion role, no demand claimed), not with a thinner page.
- **What the 5 SERPs showed:** "etd meaning" is informational with shipping leading (AI Overview and 9 of 10 results define estimated time of departure; one medical sense), so it gets a term page. "letter of indemnity" is mixed legal and finance plus shipping (FINRA sample, contract and insurance pages beside logistics glossaries), so the existing post stays in the shipping sense and offers no template. "nota fiscal" is Brazilian Portuguese, domestic and navigational (municipal and accounting pages), so no page: it is a mention on the Brazil country page. "freight forwarder software" is commercial investigation (vendor pages, Capterra, listicles of forwarding and freight management systems), so `/for/freight-forwarders` must keep saying it sells client document preparation only, and no listicle is written (no competitor named). "ncts" mixes six meanings (EU transit system, Irish car test, US Navy stations, a tile contractor, a music artist with a video pack), which confirms v3's anomaly: no term page, the transit guide keeps the UK sense.

## Wave E (30 pages)

Rows use the v3 format. Tool short names as in v3: **invoice**, **proforma**, **packing**, **delivery**, **cbm**, **converter**, **weight**, **landed**, **incoterms**, **pallet**, **container**, **price**, **workspace**. "Regulated" glossary rows are listed at launch like country pages (D-023, D-015): indexed, sourced from the authority, the not-advice note shown, owner review after launch. No row states a duty rate, threshold or fee.

Each group is one writer's batch (6 writers, 5 rows each); a seventh writer can take the replacement rows if any fail.

### Group 1: reference numbers and document pairs (posts)

| Slug                           | Type       | Primary keyword (evidence)                                                                                                                                | Vol   | KD  | Intent | Tool CTA | Wave |
| ------------------------------ | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | --- | ------ | -------- | ---- |
| how-to-read-an-awb-number      | explainer  | awb number (CA 260; AU 170). Airline prefix, serial and check digit; where it goes on the invoice and packing list. Distinct from the air waybill guide   | 1,000 | 37  | info   | packing  | E    |
| container-number-format        | explainer  | container number (AU 70; CA 30; container number format 20). ISO 6346 owner code, category, serial, check digit; not the seal number (glossary owns that) | 170   | 24  | info   | packing  | E    |
| bill-of-lading-number          | explainer  | bill of lading number (CA 50). Who issues it, where to find it, booking number vs B/L number; links the bill of lading guide                              | 390   | 7   | info   | invoice  | E    |
| air-waybill-vs-bill-of-lading  | comparison | air waybill vs bill of lading (file 12, ovrseas cluster: air waybill of lading 20; airway bill bill of lading 20; bill of lading and airway bill 20)      | 20    | 9   | info   | weight   | E    |
| packing-list-vs-bill-of-lading | comparison | packing list vs bill of lading (file 12: packing list vs bill of lading 30; bill of lading vs packing list 30; packing slip vs bill of lading 40)         | 30    | n/a | info   | packing  | E    |

### Group 2: Incoterms®, quoting and booking (posts)

| Slug                       | Type       | Primary keyword (evidence)                                                                                                                         | Vol | KD  | Intent | Tool CTA         | Wave |
| -------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | --- | --- | ------ | ---------------- | ---- |
| fca-vs-ddp                 | comparison | fca vs ddp (file 12: ddp vs fca 70; fca vs ddp incoterms 30; ovrseas ranks 7)                                                                      | 90  | n/a | info   | incoterms, price | E    |
| cpt-vs-ddp                 | comparison | cpt vs ddp (file 12; ovrseas ranks 4, so a standalone page earns the query)                                                                        | 50  | n/a | info   | incoterms        | E    |
| quotation-validity-period  | explainer  | quotation validity (file 12: price validity 30; quotation valid for 30 days 30; quote is valid for 30 days 30). The proforma's "valid until" field | 70  | n/a | info   | proforma         | E    |
| shipping-booking-request   | how-to     | booking request (2026-10-07 file 04; booking confirmation shipping 20). What the forwarder needs, taken from the packing list                      | 210 | 3   | trans. | packing          | E    |
| import-documents-checklist | checklist  | import documents (CA 20; AU 10). Importer's side of the export documents checklist; no country duty rules                                          | 140 | n/a | trans. | invoice, landed  | E    |

### Group 3: regulated and specialist documents (posts)

| Slug                               | Type      | Primary keyword (evidence)                                                                                                                                                                                                                                                         | Vol   | KD  | Intent | Tool CTA     | Wave |
| ---------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | --- | ------ | ------------ | ---- |
| cbp-form-28                        | explainer | cbp form 28 (2026-10-07 file 05). CBP Request for Information: which invoice details it asks for and how to answer from the invoice                                                                                                                                                | 110   | n/a | info   | invoice      | E    |
| fumigation-certificate             | explainer | fumigation certificate (2026-10-07 file 04). Who issues it, how it differs from ISPM 15 marking and the phytosanitary certificate; links both guides                                                                                                                               | 110   | n/a | info   | packing      | E    |
| exporting-a-vehicle-from-the-us    | how-to    | how to ship a car internationally (AU 10; how to export cars 10). EEI for used vehicles and title presentation to CBP, sourced from CBP and Census                                                                                                                                 | 210   | n/a | info   | invoice      | E    |
| non-asbestos-declaration-australia | explainer | manufactured without asbestos stamp (file 11, incodocs ranks 42 with a non-asbestos declaration template). Australian Border Force rule, sourced. **Writing check:** open the live SERP by hand; drop the row if results are not about import declarations                         | 2,400 | n/a | info   | invoice      | E    |
| nmfc-freight-class                 | explainer | nmfc (file 11: nmfc codes 2,900; national motor freight classification codes 2,900; nmfc class 2,400; nmfc classification 2,400). The class on a US bill of lading, density from the packing list; we do not classify freight. **Owner may cut** (domestic freight, next to D-019) | 3,600 | 8   | info   | packing, cbm | E    |

### Group 4: shipping operations terms (glossary)

| Slug                          | Type | Primary keyword (evidence)                                                                                                                                           | Vol   | KD  | Intent | Tool CTA | Wave |
| ----------------------------- | ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | --- | ------ | -------- | ---- |
| etd                           | term | etd meaning (CA 590; AU 390; etd shipping 140; eta shipping 50). SERP 01: shipping sense leads; covers ETA vs ETD in `confusedWith`                                  | 2,900 | n/a | info   | packing  | E    |
| unit-load-device              | term | uld (file 11: ulds 1,900; incodocs ranks 26 with an air container page, so Google reads the cargo sense)                                                             | 1,900 | 8   | info   | weight   | E    |
| devanning                     | term | devanning (AU 110; CA 30). Unloading a container and checking it against the packing list                                                                            | 260   | 7   | info   | packing  | E    |
| port-of-loading-and-discharge | term | port of discharge (AU 40; CA 30; port of loading 110, CA 20, AU 20; port of loading meaning 20). One page for the pair, the fields on the invoice and bill of lading | 170   | 17  | info   | invoice  | E    |
| arrival-notice                | term | arrival notice (v3 wave E list)                                                                                                                                      | 140   | n/a | info   | delivery | E    |

### Group 5: US customs procedures (glossary, regulated)

| Slug                  | Type            | Primary keyword (evidence)                                                                                                   | Vol   | KD  | Intent | Tool CTA | Wave |
| --------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----- | --- | ------ | -------- | ---- |
| bonded-warehouse      | term, regulated | bonded warehouse (CA 390; AU 320; bonded warehousing 2,400 in file 11; UK customs warehouse 170)                             | 2,400 | 11  | nav.   | landed   | E    |
| foreign-trade-zone    | term, regulated | free trade zone (file 11: foreign trade zones 1,600; ftz 1,600; foreign trade zone 1,300). US FTZ under 19 CFR 146, no rates | 2,900 | 25  | info   | landed   | E    |
| temporary-import-bond | term, regulated | temporary import bond (CA 50; AU 10)                                                                                         | 170   | n/a | comm.  | invoice  | E    |
| ams-filing            | term, regulated | ams filing (CA 20; AU 10)                                                                                                    | 110   | 40  | info   | packing  | E    |
| exporter-of-record    | term, regulated | exporter of record (CA 20; AU 10). Who it is under US EAR usage and elsewhere; links USPPI                                   | 140   | 40  | info   | invoice  | E    |

### Group 6: controls, quotas and UK procedures (glossary, regulated)

| Slug                        | Type            | Primary keyword (evidence)                                                                                                                                                          | Vol    | KD  | Intent | Tool CTA | Wave |
| --------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | --- | ------ | -------- | ---- |
| dual-use-goods              | term, regulated | dual use goods (CA 30; AU 30). Definition and where licensing lives; no classification                                                                                              | 170    | n/a | info   | invoice  | E    |
| import-quota                | term, regulated | import quota (file 11: trade quota 1,600, KD 1; imports quotas 1,600). Absolute quota vs tariff-rate quota (links the TRQ term); bare "quota" stays excluded                        | 1,600  | n/a | info   | landed   | E    |
| most-favoured-nation-tariff | term, regulated | mfn tariff (CA 140; AU 20). The WTO MFN principle and the general rate column; never a rate. Bare "most favored nation" stays excluded (news sense); preferences only named (D-008) | 210    | n/a | info   | landed   | E    |
| inward-processing           | term, regulated | inward processing (UK, 2026-10-07 file 06)                                                                                                                                          | UK 110 | n/a | info   | invoice  | E    |
| temporary-admission         | term, regulated | temporary admission (UK, 2026-10-07 file 06). The UK/EU procedure; distinct from the US temporary import bond and the ATA carnet guide, which it links                              | UK 140 | n/a | info   | invoice  | E    |

## Page counts after wave E

| Type                                 | Today         | Wave E | After E       |
| ------------------------------------ | ------------- | ------ | ------------- |
| Blog posts                           | 100           | 15     | 115           |
| Glossary term pages                  | 38            | 15     | 53            |
| Everything else (sitemap + unlisted) | about 86      | 0      | about 86      |
| **Total public pages**               | **about 224** | **30** | **about 254** |

Builder note: D-023 changes the glossary template rule that `regulated: true` keeps a term noindex and out of the sitemap and llms.txt. Regulated terms are now listed at launch like country pages; the not-advice note and authority sources stay required.

## Routed or refreshed (no new URL)

| Finding (vol)                                                                                            | Goes to                                             | Why                                                                                           |
| -------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| standard pallet dimensions 18,100 / KD 8; standard pallet size 18,100; pallet gma 4,400 (file 09)        | `/guides/pallet-sizes`                              | The guide already targets "standard pallet sizes" and 48 × 40 in; add "pallet gma" to its FAQ |
| less than container load 22,200 / KD 2 (file 08)                                                         | `/guides/lcl-vs-fcl`                                | Same intent                                                                                   |
| cubic meter calculator AU 3,600 / KD 13                                                                  | `/tools/cbm-calculator`, `/tools/cbm-to-cubic-feet` | Calculator intent                                                                             |
| kg to cbm 390 (CA 140; AU 210); weight to volume calculator 140                                          | `/guides/cbm-and-weight-or-measure`                 | The guide owns it                                                                             |
| tare weight 4,400; what is tare weight 3,600; gross and net weight 6,600 (file 11)                       | `/guides/gross-weight-vs-net-weight`                | The guide owns it                                                                             |
| telegraphic transfer meaning 4,400; what is tt transfer 2,400 (file 11)                                  | `/blog/tt-payment`                                  | Same intent                                                                                   |
| canada customs invoice CA 480; commercial invoice canada CA 480; shipping to canada from us 880 (CA 210) | `/blog/commercial-invoice-for-canada`               | v3 decision stands: no Canada country page beside the post                                    |
| nota fiscal (SERP 03)                                                                                    | `/export-documents/brazil` (mention)                | Portuguese domestic intent                                                                    |
| fca incoterms CA 1,300 / AU 1,000 and the other rule queries                                             | `/tools/incoterms/[code]`                           | Rule pages own each rule                                                                      |

## Excluded from wave E, and why

v3's exclusions stand. New measurements that still do not earn a page:

- **Suggestions files (08–10) are dominated by head-term synonyms.** Sorted by volume with a 300-row limit, "container" returned the Container Store, water and fuel containers, homes and carrier tracking; "pallet" returned pallet jacks, racking and liquidation; "invoice" returned general invoice generators (135,000, KD 50), Canva and Zoho templates and carrier bill payment. Trade-filtered, they add no new page: the trade rows route to existing pages above. Next time, filter by regex and volume band instead of taking the head.
- **Competitor ranked keywords (11–12):** incodocs.com has 8,632 US keywords; its top 500 by volume are port directory pages (programmatic, no product fit), the NATO phonetic alphabet, 3PL, JIT, protectionism, trade deficits, BRICS and comparative advantage (economics, not documents), bunkering, berthing and ISPS (port operations, nothing on our documents), BOL and purchase-order templates (documents we do not make), and certificate-of-origin pages (D-008). ovrseas.io has 403: CBM calculator, HS code lookup (boundary), certificate-of-origin and USMCA templates (D-008), ECCN and AES guides (we own both), section 122 and tariff-refund news, fake-forwarder scam checks (consumer parcel intent).
- **Canada and Australia overviews (06–07, 506 of 632 keywords returned each):** volumes run at roughly a tenth to a third of US. No new country passes the 150 rule. Australian "dangerous goods" 6,600 and "quotation template" 2,400, and Canadian "customs tariff" 1,000 (the tariff schedule, rate intent), stay excluded under v3's rules. "feu" CA 18,100 is a volume anomaly (the French word), not quoted.
- **Still out:** dangerous goods, hazmat, perfume and lithium batteries (regulated, no product tie); export credit insurance 140 (trade finance, off-scope in v3); consolidated screening list 1,300 and denied party screening (boundary); mrn number 1,900 (medical sense); freight invoice template 110 and price quotation template 480 (documents we do not make); groupage 140 (routed to the LCL guide in v3).

## DataForSEO usage (D-023: 12 calls approved 2026-10-08)

**12 calls made, 12 succeeded, 0 retries, 0 left.** Cost: not reported in the MCP responses (no cost field in any response); check the DataForSEO dashboard. Raw responses are saved byte for byte from the MCP tool output in [`dataforseo-2026-10-08/`](dataforseo-2026-10-08/), excluded from Prettier like the earlier folders.

| File | Call                                         | Parameters                                                                                                       | Result                              |
| ---- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| 01   | `serp_organic_live_advanced`                 | "etd meaning", United States, en, depth 10                                                                       | AI Overview, PAA, 10 organic        |
| 02   | `serp_organic_live_advanced`                 | "letter of indemnity", United States, en                                                                         | AI Overview, PAA, things to know    |
| 03   | `serp_organic_live_advanced`                 | "nota fiscal", United States, en                                                                                 | Portuguese organic, images          |
| 04   | `serp_organic_live_advanced`                 | "freight forwarder software", United States, en                                                                  | vendor and listicle organic         |
| 05   | `serp_organic_live_advanced`                 | "ncts", United States, en                                                                                        | mixed-sense AI Overview, video pack |
| 06   | `dataforseo_labs_google_keyword_overview`    | Canada, en; the 632 keywords returned in 2026-10-07 files 01–03 (glossary, countries, tools / how-to / industry) | 506 keywords returned               |
| 07   | `dataforseo_labs_google_keyword_overview`    | Australia, en; same 632 keywords                                                                                 | 506 keywords returned               |
| 08   | `dataforseo_labs_google_keyword_suggestions` | "container", United States, en, limit 300                                                                        | 300 of 190,372                      |
| 09   | `dataforseo_labs_google_keyword_suggestions` | "pallet", United States, en, limit 300                                                                           | 300 of 52,879                       |
| 10   | `dataforseo_labs_google_keyword_suggestions` | "invoice", United States, en, limit 300                                                                          | 300 of 64,581                       |
| 11   | `dataforseo_labs_google_ranked_keywords`     | incodocs.com, United States, en, limit 500, by volume                                                            | 500 of 8,632                        |
| 12   | `dataforseo_labs_google_ranked_keywords`     | ovrseas.io, United States, en, limit 500, by volume                                                              | 403 of 403                          |

The keyword lists for 06 and 07 are the keywords the 2026-10-07 files 01–03 returned (259 + 163 + 210, 632 unique), since the requested lists were not saved separately. Any further call needs a new owner approval.
