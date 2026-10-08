import type { SourceFields } from '@/lib/trade/sources';

const RETRIEVED = '2026-10-08';
const PENDING = 'pending owner review';

/**
 * Sources first cited by the wave C comparison batch: fca-vs-dap, fob-vs-dap, cif-vs-cip,
 * exw-vs-ddp, proforma-invoice-vs-quotation and shipping-invoice-vs-commercial-invoice. Each
 * URL was opened and the claim checked on the retrieval date.
 */
export default {
  'c3-icc-incoterms-2020': {
    authority: 'International Chamber of Commerce (ICC)',
    title: 'Incoterms® 2020',
    url: 'https://iccwbo.org/business-solutions/incoterms-rules/incoterms-2020/',
    jurisdiction: 'International (contractual rules, not law)',
    supports:
      'the eleven rules; CIP requiring cover compliant with Institute Cargo Clauses (A) or similar, while Institute Cargo Clauses (C) remains the default under CIF, which is reserved for maritime trade; the FCA option for an on-board bill of lading; the seller not unloading under DAP; DAT renamed DPU',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c3-ita-know-your-incoterms': {
    authority: 'International Trade Administration, U.S. Department of Commerce',
    title: 'Know Your Incoterms',
    url: 'https://www.trade.gov/know-your-incoterms',
    jurisdiction: 'United States (export guidance)',
    supports:
      'EXW, FCA, CIP, DAP and DDP being any-mode rules and FOB and CIF sea and inland waterway rules; parties being able to use an earlier version if they specify it, with the ICC recommending Incoterms® 2020 and the version identified on the export documents',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c3-hmrc-incoterms': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'Customs valuation: Incoterms',
    url: 'https://www.gov.uk/guidance/customs-valuation/incoterms',
    jurisdiction: 'United Kingdom (customs valuation guidance)',
    supports:
      'EXW not requiring the seller to load or clear for export; FCA risk passing at the named point; FOB and CIF risk passing on board; DAP delivery ready for unloading with the seller bearing the risks to the named place; DDP requiring the seller to clear for export and import and pay the duties; the Incoterm not restricting the valuation method',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c3-hmrc-delivery-costs': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'Delivery costs to include in the customs value',
    url: 'https://www.gov.uk/guidance/delivery-costs-to-include-in-the-customs-value',
    jurisdiction: 'United Kingdom (imports)',
    supports:
      'transport and insurance costs up to the place of introduction into the UK being included in the customs value, and UK transport after that point being deductible when shown separately or otherwise evidenced',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c3-usc-19-1401a': {
    authority: 'Legal Information Institute, Cornell Law School (United States Code)',
    title: '19 U.S. Code § 1401a: Value',
    url: 'https://www.law.cornell.edu/uscode/text/19/1401a',
    jurisdiction: 'United States (imports)',
    supports:
      'the price actually paid or payable excluding costs for transportation, insurance and related services incident to the international shipment to the United States',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c3-cornell-19-cfr-141-86': {
    authority: 'Legal Information Institute, Cornell Law School (Code of Federal Regulations)',
    title: '19 CFR § 141.86: Contents of invoices and general requirements',
    url: 'https://www.law.cornell.edu/cfr/text/19/141.86',
    jurisdiction: 'United States (imports)',
    supports:
      'the purchase price of each item in the currency of the purchase, and all charges on the goods itemised by name and amount, including freight, insurance, commission and packing, with missing information allowed on an attachment',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c3-trade-gov-proforma-invoice': {
    authority: 'International Trade Administration, U.S. Department of Commerce',
    title: 'Pro Forma Invoice',
    url: 'https://www.trade.gov/pro-forma-invoice',
    jurisdiction: 'United States (export guidance)',
    supports:
      'the proforma as a quote in an invoice format, used by the buyer for an import licence, a letter of credit, pre-shipment inspection or a currency transfer; the items it carries, including the Incoterm, payment terms, estimated shipping date and a validity date; no changes without the buyer’s consent',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c3-trade-gov-common-export-documents': {
    authority: 'International Trade Administration, U.S. Department of Commerce',
    title: 'Common Export Documents',
    url: 'https://www.trade.gov/common-export-documents',
    jurisdiction: 'United States (export guidance)',
    supports:
      'the proforma as a negotiating tool before shipment that later becomes the commercial invoice; the commercial invoice as a legal document between exporter and buyer used by customs; the packing list not substituting for the invoice; the bill of lading as the contract with the carrier',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c3-trade-gov-commercial-invoice': {
    authority: 'International Trade Administration, U.S. Department of Commerce',
    title: 'Commercial Invoice',
    url: 'https://www.trade.gov/commercial-invoice',
    jurisdiction: 'United States (export guidance)',
    supports:
      'the commercial invoice being required for export and import clearance and used by the buyer’s customs to assess duties and taxes, carrying the proforma information, and the seller’s own format being acceptable in most countries',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c3-hmrc-vat-notice-700-proforma': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'VAT guide (VAT Notice 700), paragraph 17.3: pro-forma invoices',
    url: 'https://www.gov.uk/guidance/vat-guide-notice-700',
    jurisdiction: 'United Kingdom (VAT)',
    supports:
      'pro-forma invoices being used to offer goods to potential customers, being marked “this is not a VAT invoice”, not being evidence to reclaim input tax, and a VAT invoice being issued once the goods are supplied or paid for',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
