import type { SourceFields } from '@/lib/trade/sources';

const RETRIEVED = '2026-10-08';
const PENDING = 'pending owner review';

/**
 * Sources first cited by the wave E group 2 batch: fca-vs-ddp, cpt-vs-ddp,
 * quotation-validity-period, shipping-booking-request and import-documents-checklist. Each URL
 * was opened and the claim checked on the retrieval date.
 */
export default {
  'e2-icc-incoterms-2020': {
    authority: 'International Chamber of Commerce (ICC)',
    title: 'Incoterms® 2020',
    url: 'https://iccwbo.org/business-solutions/incoterms-rules/incoterms-2020/',
    jurisdiction: 'International (contractual rules, not law)',
    supports:
      'the eleven three-letter rules published by the ICC for business-to-business sale contracts, in use since 1936 and last updated in 2020; the FCA option for an on-board bill of lading; CIP requiring cover compliant with Institute Cargo Clauses (A) or similar; costs listed together in articles A9/B9',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e2-ita-know-your-incoterms': {
    authority: 'International Trade Administration, U.S. Department of Commerce',
    title: 'Know Your Incoterms',
    url: 'https://www.trade.gov/know-your-incoterms',
    jurisdiction: 'United States (export guidance)',
    supports:
      'FCA, CPT and DDP being among the seven rules for any mode of transport; each rule allocating licensing, customs formalities, carriage, insurance and the point where risk passes; the ICC recommending Incoterms® 2020 and the version being identified on the export documents',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e2-hmrc-incoterms': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'Customs valuation: Incoterms',
    url: 'https://www.gov.uk/guidance/customs-valuation/incoterms',
    jurisdiction: 'United Kingdom (customs valuation guidance)',
    supports:
      'FCA risk passing at the handover point, which should be defined precisely; CPT delivery to a carrier with the seller paying transport to the named destination; DDP delivery cleared for import, ready for unloading, with the seller bearing costs and risks, clearing for export and import and paying the duties; the Incoterm not restricting the customs valuation method, so DDP goods can still be valued under method 1',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e2-usc-19-1401a': {
    authority: 'Legal Information Institute, Cornell Law School (United States Code)',
    title: '19 U.S. Code § 1401a: Value',
    url: 'https://www.law.cornell.edu/uscode/text/19/1401a',
    jurisdiction: 'United States (imports)',
    supports:
      'the price actually paid or payable excluding international transportation, insurance and related services, and transaction value excluding US customs duties and other federal taxes on importation when identified separately from the price',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e2-trade-gov-proforma-invoice': {
    authority: 'International Trade Administration, U.S. Department of Commerce',
    title: 'Pro Forma Invoice',
    url: 'https://www.trade.gov/pro-forma-invoice',
    jurisdiction: 'United States (export guidance)',
    supports:
      'the proforma as a quote in invoice format, used for import licences, letters of credit, pre-shipment inspection and currency transfers; its contents, including the Incoterm and delivery point, payment terms, an estimated shipping date and a validity date; the seller not changing it without the buyer’s agreement',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e2-uncitral-cisg': {
    authority: 'United Nations Commission on International Trade Law (UNCITRAL)',
    title: 'United Nations Convention on Contracts for the International Sale of Goods (CISG)',
    url: 'https://uncitral.un.org/en/texts/salegoods/conventions/sale_of_goods/cisg',
    jurisdiction: 'International (contracting states)',
    supports:
      'Part II of the CISG governing formation of the contract by offer and acceptance; the Convention applying to business sales between parties in different contracting states, through private international law or by the parties’ choice, and not to consumer sales',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e2-imo-solas-vgm': {
    authority: 'International Maritime Organization (IMO)',
    title: 'Verification of the gross mass of a packed container',
    url: 'https://www.imo.org/en/OurWork/Safety/Pages/Verification-of-the-gross-mass.aspx',
    jurisdiction: 'International (SOLAS contracting states)',
    supports:
      'SOLAS regulation VI/2, in force since 1 July 2016, making the shipper named on the bill of lading responsible for giving the master and terminal the verified gross mass in time for the stowage plan; the two methods of obtaining it; a container without a verified gross mass not being loaded',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e2-trade-gov-shipping-options': {
    authority: 'International Trade Administration, U.S. Department of Commerce',
    title: 'Shipping Options',
    url: 'https://www.trade.gov/shipping-options',
    jurisdiction: 'United States (export guidance)',
    supports:
      'freight forwarders booking space on ships, aircraft, trains or trucks, helping prepare price quotations, recommending packing, preparing the bill of lading and filing in AES, and routing documents; the exporter remaining responsible for packing, labelling, documents and insurance',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e2-cfr-19-4-7a': {
    authority: 'Legal Information Institute, Cornell Law School (Code of Federal Regulations)',
    title: '19 CFR § 4.7a: Inward manifest; information required',
    url: 'https://www.law.cornell.edu/cfr/text/19/4.7a',
    jurisdiction: 'United States (vessel cargo arriving)',
    supports:
      'the cargo declaration carrying a precise description or a six-digit HTS number, with generic terms such as FAK, general cargo and STC not acceptable; quantities in the lowest external packaging unit, not containers or pallets; gross weight; shipper and consignee; container and seal numbers',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e2-cfr-19-149-2': {
    authority: 'Legal Information Institute, Cornell Law School (Code of Federal Regulations)',
    title: '19 CFR § 149.2: Importer security filing; general requirement',
    url: 'https://www.law.cornell.edu/cfr/text/19/149.2',
    jurisdiction: 'United States (vessel cargo arriving)',
    supports:
      'the ISF Importer, or its authorised agent, filing the Importer Security Filing for vessel cargo other than bulk no later than 24 hours before the cargo is laden aboard the vessel at the foreign port',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e2-cfr-19-142-3': {
    authority: 'Legal Information Institute, Cornell Law School (Code of Federal Regulations)',
    title: '19 CFR § 142.3: Entry documentation required',
    url: 'https://www.law.cornell.edu/cfr/text/19/142.3',
    jurisdiction: 'United States (imports)',
    supports:
      'the documents filed with a US entry: CBP Form 3461 or its electronic equivalent, evidence of the right to make entry, the commercial invoice (or a pro forma invoice where allowed), a packing list where appropriate, other agencies’ documents, and the US buyer or consignee details',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e2-cbp-importer-tips': {
    authority: 'U.S. Customs and Border Protection (CBP)',
    title: 'Tips for New Importers and Exporters',
    url: 'https://www.cbp.gov/trade/basic-import-export/importer-exporter-tips',
    jurisdiction: 'United States (imports)',
    supports:
      'customs brokers being licensed by CBP but not CBP employees, the importer remaining responsible for the accuracy of entry documents and for duties, taxes and fees; the importer number being the IRS business number or a CBP-assigned number; ISF applying to ocean shipments; other agencies’ permits; binding rulings',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e2-gov-uk-import-goods': {
    authority: 'GOV.UK',
    title: 'Import goods into the UK: step by step',
    url: 'https://www.gov.uk/import-goods-into-uk',
    jurisdiction: 'United Kingdom (imports)',
    supports:
      'the UK import steps: an EORI number, the commodity code, working out duty and VAT from the customs value, licences and certificates for controlled goods, the customs declaration made by the importer or an agent, and keeping invoices, customs paperwork and the C79 import VAT certificate',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
