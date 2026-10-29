# Commercial invoice against the rules, and how competitors handle countries (2026-10-29)

Owner request 2026-10-29: with correct input, is our output correct, and how do competitors deal
with country requirements? Checked against the official text and the competitors' own terms
on 2026-10-29. Our side was read from the code (`src/lib/pdf/trade-document.ts`,
`src/lib/tools/document-snapshot.ts`).

## 1. United States: 19 CFR 141.86 (contents of invoices)

Source: eCFR versioner API, title 19, § 141.86, as of 2026-10-01
(<https://www.ecfr.gov/current/title-19/chapter-I/part-141/subpart-F/section-141.86>).

| Rule    | What it requires                                                                                                              | TradeDocs commercial invoice                                                                                                                                                | Status                                                                                                  |
| ------- | ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| (a)(1)  | Port of entry                                                                                                                 | "Port of discharge" box                                                                                                                                                     | Covered                                                                                                 |
| (a)(2)  | When, where, by whom and to whom sold                                                                                         | Issue date, Seller/Exporter and Buyer/Consignee boxes, Incoterm place                                                                                                       | Covered                                                                                                 |
| (a)(3)  | Detailed description, grade/quality, marks and numbers of the packages                                                        | Description per line (free text), "Marks and numbers" block                                                                                                                 | Covered (grade/quality goes in the description)                                                         |
| (a)(4)  | Quantities in weights and measures                                                                                            | Quantity + unit per line                                                                                                                                                    | Covered                                                                                                 |
| (a)(5)  | Purchase price of each item in the currency of purchase                                                                       | Unit price and amount per line, currency stated                                                                                                                             | Covered                                                                                                 |
| (a)(6)  | Value when not sold (e.g. samples, free of charge)                                                                            | Unit price per line; no "not sold, value for customs" wording                                                                                                               | Partly: the user can state value, but no explicit "no commercial value / value for customs only" option |
| (a)(7)  | Kind of currency                                                                                                              | ISO currency code on every amount                                                                                                                                           | Covered                                                                                                 |
| (a)(8)  | **All charges itemized by name and amount: freight, insurance, commission, packing** (or identified as included in the price) | **Not supported**: no charge lines; only goods lines and one total. The Incoterm shows what the price covers, but CIF/CIP/DAP invoices cannot itemize freight and insurance | **Gap, fix first**                                                                                      |
| (a)(9)  | Rebates, drawbacks, bounties itemized                                                                                         | Not supported (free-text note only)                                                                                                                                         | Gap, rare                                                                                               |
| (a)(10) | Country of origin                                                                                                             | Shipment box and per-line origin column                                                                                                                                     | Covered                                                                                                 |
| (a)(11) | Assists (dies, molds, tools) not in the price                                                                                 | Not supported (free-text note only)                                                                                                                                         | Gap, rare                                                                                               |
| (d)     | English                                                                                                                       | All labels in English                                                                                                                                                       | Covered                                                                                                 |
| (e)     | What each package contains                                                                                                    | Packing list                                                                                                                                                                | Covered                                                                                                 |
| (g)     | **Every discount from list price**                                                                                            | **Not supported**: no discount field                                                                                                                                        | **Gap**                                                                                                 |
| (h)     | Invoice and page numbering ("Inv. 1, p. 1")                                                                                   | "Page n of N" on each page                                                                                                                                                  | Covered for one invoice; the importer numbers multi-invoice entries                                     |
| (j)     | **Name of a responsible employee of the exporter**                                                                            | Signatory name, printed when set in document settings                                                                                                                       | Covered when set; **not required yet**                                                                  |

## 2. European Union

The EU has no single customs list of invoice fields like 19 CFR 141.86: customs data travel in
the declaration (UCC Delegated Regulation 2015/2446, Annex B), and the invoice supports it. What
an EU seller's invoice must show comes from VAT law (Directive 2006/112/EC, Art. 226): date,
sequential number, supplier VAT number, full names and addresses, quantity and nature of goods,
unit price, discounts, and, for an exempt export, the exemption reference.

| Requirement                                                | TradeDocs                                                     | Status                             |
| ---------------------------------------------------------- | ------------------------------------------------------------- | ---------------------------------- |
| Sequential number, date, names, addresses                  | Document number, issue date, party boxes                      | Covered                            |
| Quantity, nature of goods, unit price                      | Lines                                                         | Covered                            |
| Supplier VAT number                                        | One "Tax ID" per party                                        | Covered (one number only)          |
| **EORI number** (needed on EU export paperwork)            | Same single "Tax ID" field: cannot show VAT and EORI together | **Gap**                            |
| Discounts and rebates                                      | Not supported                                                 | **Gap** (same as US (g))           |
| Exemption reference for an export ("VAT exempt, Art. 146") | Free-text note only                                           | Gap: add a standard wording option |

## 3. How competitors handle countries

- **ovrseas** (terms, <https://ovrseas.io/terms>): documents are "for convenience purposes"; the
  user verifies "their accuracy and compliance with applicable regulations". No claim to meet
  any country's rules; its site says "PDFs ready for your forwarder, broker or bank".
- **IncoDocs** (terms PDF, <https://incodocs.com/terms-and-conditions.pdf>, "last updated
  September 2018"): "We are not responsible for any document you create and do so at your own
  risk"; no warranty that content is complete, accurate or up to date.
- Neither publishes per-country field checks. Both are general templates plus a user-
  responsibility clause, which is where TradeDocs already is.

## 4. Verdict and fixes

With correct input, the figures and the data TradeDocs prints are correct: the verification
pack (`tests/unit/verification-pack.test.ts`) proves line totals, totals, weights, packages,
rounding, currencies and the calculators against hand-worked examples, down to the printed
page. What is missing are **fields**, not wrong numbers. In order:

1. **Charges lines** on invoices: freight, insurance, packing, commission, each named with an
   amount, or marked "included in price". Required by 19 CFR 141.86(a)(8). Biggest gap.
2. **Discount** per line or per invoice (141.86(g), EU VAT Art. 226).
3. **EORI** as its own party field next to the tax/VAT number.
4. **Responsible person** (141.86(j)): require the signatory name before a commercial invoice is
   final, or warn.
5. Options for "no commercial value, value for customs purposes only" and a standard VAT export
   exemption wording.
6. Public wording: "Built to the US invoice contents rule (19 CFR 141.86); for other countries,
   check your importer's requirements", plus the same user-responsibility clause competitors
   use, in the terms.
