import type { SourceFields } from '@/lib/trade/sources';

/**
 * Sources first cited by wave E group 5: the regulated glossary terms bonded-warehouse,
 * foreign-trade-zone, temporary-import-bond, ams-filing and exporter-of-record. Each record was
 * opened on the retrieval date and checked against the claim in `supports`; the eCFR text was
 * read through the eCFR versioner API for the current edition of the section, and the page URL
 * below is the public reading link for the same section. None of them is cited for a duty rate,
 * bond amount or fee: the terms describe the mechanism only.
 */
const RETRIEVED = '2026-10-08';
const PENDING = 'pending owner review';

export default {
  'e5-cfr-19-19-1': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 19.1 (eCFR)',
    title: '19 CFR § 19.1 — Classes of customs warehouses',
    url: 'https://www.ecfr.gov/current/title-19/section-19.1',
    jurisdiction: 'United States (import)',
    supports:
      'the classes of customs warehouses, including importers’ private bonded warehouses (class 2) for the proprietor’s own goods, public bonded warehouses (class 3), bonded yards, sheds and tanks (class 4), manufacturing warehouses solely for exportation (class 6), manipulation warehouses for cleaning, sorting and repacking but not manufacturing (class 8), duty-free stores (class 9) and general order warehouses (class 11)',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e5-cfr-19-19-11': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 19.11 (eCFR)',
    title: '19 CFR § 19.11 — Manipulation in bonded warehouses and elsewhere',
    url: 'https://www.ecfr.gov/current/title-19/section-19.11',
    jurisdiction: 'United States (import)',
    supports:
      'warehouse proprietors not allowing manipulation without a prior permit, the application to manipulate on CBP Form 3499 describing whether goods are to be cleaned, sorted, repacked or otherwise changed in condition but not manufactured, and blanket applications of up to one year with a running record of quantities before and after',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e5-cfr-19-144-1': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 144.1 (eCFR)',
    title: '19 CFR § 144.1 — Merchandise eligible for warehousing',
    url: 'https://www.ecfr.gov/current/title-19/section-144.1',
    jurisdiction: 'United States (import)',
    supports:
      'any merchandise subject to duty being eligible for a warehouse entry except perishable merchandise and explosive substances, dangerous and highly flammable goods needing the warehouse insurer’s written consent',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e5-cfr-19-144-5': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 144.5 (eCFR)',
    title: '19 CFR § 144.5 — Period of warehousing',
    url: 'https://www.ecfr.gov/current/title-19/section-144.5',
    jurisdiction: 'United States (import)',
    supports:
      'merchandise not remaining in a bonded warehouse beyond 5 years from the date of importation, or a longer period the Center director permits on request and good cause shown',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e5-usc-19-1557': {
    authority: 'U.S. Code, 19 U.S.C. 1557 (Tariff Act of 1930, section 557), via Cornell LII',
    title: '19 U.S. Code § 1557 — Entry for warehouse',
    url: 'https://www.law.cornell.edu/uscode/text/19/1557',
    jurisdiction: 'United States (import)',
    supports:
      'dutiable merchandise being entered for warehousing at the expense and risk of the owner, a total warehousing period not exceeding 5 years from importation, withdrawal for exportation or for transportation and exportation without the payment of duties, and withdrawal for consumption on payment of the duties and charges accruing',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e5-cfr-19-144-38': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 144.38, via Cornell LII',
    title: '19 CFR § 144.38 — Withdrawal for consumption',
    url: 'https://www.law.cornell.edu/cfr/text/19/144.38',
    jurisdiction: 'United States (import)',
    supports:
      'withdrawals for consumption being filed on CBP Form 7501 or its electronic equivalent, with estimated duties on the merchandise withdrawn deposited under 19 CFR Part 141 subpart G',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e5-gov-uk-customs-warehouse': {
    authority: 'HM Revenue & Customs (GOV.UK)',
    title: 'How to use a customs warehouse',
    url: 'https://www.gov.uk/guidance/how-to-use-a-customs-warehouse',
    jurisdiction: 'United Kingdom (import)',
    supports:
      'a customs warehouse letting a business delay paying duty and import VAT on goods from outside the UK, warehousekeepers needing HMRC authorisation, public warehouses storing depositors’ goods and private warehouses storing the operator’s own, duty and import VAT becoming due when goods are released to free circulation, and no duty on goods re-exported from the warehouse',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e5-cbp-ftz-about': {
    authority: 'U.S. Customs and Border Protection (CBP)',
    title: 'About Foreign-Trade Zones and Contact Info',
    url: 'https://www.cbp.gov/border-security/ports-entry/cargo-security/cargo-control/foreign-trade-zones/about',
    jurisdiction: 'United States (import)',
    supports:
      'foreign-trade zones as secure areas under CBP supervision in or near ports of entry, generally treated as outside CBP territory once activated; the Foreign-Trade Zones Board and the Foreign-Trade Zones Act of 1934, administered through the FTZ Regulations (15 CFR Part 400) and CBP Regulations (19 CFR Part 146); formal entry and duty payment not being required on foreign merchandise until it enters CBP territory for consumption; and no retail trade of foreign merchandise in a zone',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e5-cfr-19-146-1': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 146.1 (eCFR)',
    title: '19 CFR § 146.1 — Definitions (foreign trade zones)',
    url: 'https://www.ecfr.gov/current/title-19/section-146.1',
    jurisdiction: 'United States (import)',
    supports:
      'the definitions of activation, admit, constructive transfer, Customs territory, domestic and foreign merchandise, operator (a party operating a zone under an agreement with the grantee), subzone (a special-purpose zone for a limited purpose) and transfer',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e5-cfr-19-146-32': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 146.32 (eCFR)',
    title: '19 CFR § 146.32 — Application and permit for admission of merchandise',
    url: 'https://www.ecfr.gov/current/title-19/section-146.32',
    jurisdiction: 'United States (import)',
    supports:
      'merchandise being admitted into a zone only on CBP Form 214 (Application for Foreign Trade Zone Admission and/or Status Designation) and a port director’s permit, supported by an examination invoice meeting 19 CFR Part 141 subpart F and evidence of the right to make entry',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e5-cfr-19-146-41': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 146.41 (eCFR)',
    title: '19 CFR § 146.41 — Privileged foreign status',
    url: 'https://www.ecfr.gov/current/title-19/section-146.41',
    jurisdiction: 'United States (import)',
    supports:
      'privileged foreign status being available, on application on CBP Form 214, to foreign merchandise not yet manipulated or manufactured so as to change its tariff classification, and that status, once granted, being binding even if the goods later change form',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e5-cfr-19-146-43': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 146.43 (eCFR)',
    title: '19 CFR § 146.43 — Domestic status',
    url: 'https://www.ecfr.gov/current/title-19/section-146.43',
    jurisdiction: 'United States (import)',
    supports:
      'domestic status for U.S. goods on which internal-revenue taxes have been paid, goods previously imported with duty and tax paid and goods previously entered free, no permit being needed to admit them in most cases, and their return to Customs territory free of quotas, duty or tax',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e5-cfr-19-146-63': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 146.63 (eCFR)',
    title: '19 CFR § 146.63 — Entry for consumption (from a zone)',
    url: 'https://www.ecfr.gov/current/title-19/section-146.63',
    jurisdiction: 'United States (import)',
    supports:
      'merchandise in foreign status being entered for consumption from a zone, and the weekly entry on CBP Form 3461 for estimated removals of goods manufactured or changed in the zone, accompanied by a pro forma invoice or schedule showing the units of each type to be removed during the week and their zone and dutiable values, with an additional Form 3461 when removals exceed the estimate',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e5-cfr-19-146-62': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 146.62 (eCFR)',
    title: '19 CFR § 146.62 — Entry (transfer from a zone)',
    url: 'https://www.ecfr.gov/current/title-19/section-146.62',
    jurisdiction: 'United States (import)',
    supports:
      'entry of foreign merchandise transferred from a zone for consumption, warehouse, exportation or transport to another port being made by an in-bond application, CBP Form 3461, CBP Form 7501 or another applicable form, with the entry documentation including invoices',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e5-cbp-tib': {
    authority: 'U.S. Customs and Border Protection (CBP)',
    title: 'Temporary Importation under Bond (TIB)',
    url: 'https://www.cbp.gov/trade/programs-administration/entry-summary-and-post-release-processes/temporary-importation-under-bond',
    jurisdiction: 'United States (import)',
    supports:
      'TIB goods not being imported for sale or sale on approval, only goods in the fourteen subheadings 9813.00.05 to 9813.00.75 of the HTSUS qualifying, export or destruction within a period not exceeding three years from importation, and failure to export or destroy resulting in liquidated damages, with the rules in 19 CFR 10.31 to 10.40',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e5-cfr-19-10-31': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 10.31 (eCFR)',
    title: '19 CFR § 10.31 — Entry; bond (temporary importation under bond)',
    url: 'https://www.ecfr.gov/current/title-19/section-10.31',
    jurisdiction: 'United States (import)',
    supports:
      'TIB entry on CBP Form 3461 or 7533 with an entry summary on Form 7501, unless an ATA carnet is used; the entry summary stating the HTSUS subheading claimed, the intended use and a declaration that the articles are not for any other use or for sale; the entry or invoice describing each article in detail with its value and marks or numbers; and a bond on CBP Form 301 with the conditions of 19 CFR 113.62, or a carnet in its place',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e5-cfr-19-10-37': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 10.37 (eCFR)',
    title: '19 CFR § 10.37 — Extension of time for exportation',
    url: 'https://www.ecfr.gov/current/title-19/section-10.37',
    jurisdiction: 'United States (import)',
    supports:
      'the TIB period being extendable for not more than two further periods of one year each on CBP Form 3173, provided the articles have not been exported or destroyed and liquidated damages have not been assessed before the application is received, and no extension of a carnet’s validity',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e5-cfr-19-4-7': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 4.7 (eCFR)',
    title:
      '19 CFR § 4.7 — Inward foreign manifest; production on demand; contents and form; advance filing of cargo declaration',
    url: 'https://www.ecfr.gov/current/title-19/section-4.7',
    jurisdiction: 'United States (vessel arrivals)',
    supports:
      'CBP having to receive from the incoming carrier the electronic equivalent of the Cargo Declaration (CBP Form 1302) 24 hours before the cargo is laden aboard the vessel at the foreign port, transmitted through the CBP Automated Manifest System or a CBP-approved replacement; FMC-licensed or registered NVOCCs with an international carrier bond being able to transmit their own cargo declaration or else disclose it to the vessel carrier; freight forwarders not being NVOCCs for this purpose; and the bulk and break-bulk exemptions',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e5-ear-772-1': {
    authority: 'Bureau of Industry and Security, Export Administration Regulations, 15 CFR 772.1 (eCFR)',
    title: '15 CFR § 772.1 — Definitions of terms as used in the Export Administration Regulations',
    url: 'https://www.ecfr.gov/current/title-15/section-772.1',
    jurisdiction: 'United States (export controls)',
    supports:
      'the exporter being the person in the United States who has the authority of a principal party in interest to determine and control the sending of items out of the United States, and principal parties in interest being those who receive the primary benefit of the transaction, generally the seller and the buyer, with the forwarding or other agent in most cases not one of them',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
