import type { SourceFields } from '@/lib/trade/sources';

/**
 * Sources first cited by the wave B batch-4 posts: tt-payment, postponed-vat-accounting,
 * pi-and-po and how-to-ship-a-pallet-internationally. Each URL was opened on the retrieval
 * date and checked against the claim in `supports`.
 */
const RETRIEVED = '2026-10-07';
const PENDING = 'pending owner review';

export default {
  'b4-trade-gov-cash-in-advance': {
    authority: 'International Trade Administration (ITA), US Department of Commerce',
    title: 'Trade Finance Guide: Cash-in-Advance',
    url: 'https://www.trade.gov/cash-advance',
    jurisdiction: 'United States (export guidance)',
    supports:
      'cash in advance as the most secure method for the exporter, with the importer paying the full or a significant amount before shipment; wire transfer as the most secure and preferred cash-in-advance option, with clear bank routing instructions from the exporter; credit card and escrow as other options; cash in advance as the least attractive option for the buyer',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b4-ic3-bec': {
    authority: 'Internet Crime Complaint Center (IC3), Federal Bureau of Investigation',
    title: 'Business Email Compromise (BEC)',
    url: 'https://www.ic3.gov/Home/BEC',
    jurisdiction: 'United States (fraud guidance)',
    supports:
      'business email compromise as a scam targeting transfers of funds through compromised email accounts; verifying requests to change account information through a secondary channel; contacting the originating bank as soon as fraud is recognised to request a recall or reversal',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b4-hmrc-overseas-bank-details': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'Pay your Self Assessment tax bill: bank details',
    url: 'https://www.gov.uk/pay-self-assessment-tax-bill/bank-details',
    jurisdiction: 'United Kingdom',
    supports:
      'HMRC asking payers with an overseas account for the Business Identifier Code (BIC), the account number (IBAN) and the account name; some banks charging if the payment is not made in pounds sterling; payments from overseas possibly taking longer',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b4-hmrc-vat-notice-700': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'VAT guide (VAT Notice 700), section 17.3: Pro-forma invoices',
    url: 'https://www.gov.uk/guidance/vat-guide-notice-700',
    jurisdiction: 'United Kingdom (VAT)',
    supports:
      'pro-forma invoices being used to offer goods to potential customers, not being evidence to reclaim input tax, being clearly marked “this is not a VAT invoice”, and a proper VAT invoice being issued once the goods are supplied or payment is received',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b4-gov-uk-pva': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'Check when you can account for import VAT on your VAT Return',
    url: 'https://www.gov.uk/guidance/check-when-you-can-account-for-import-vat-on-your-vat-return',
    jurisdiction: 'United Kingdom (import VAT)',
    supports:
      'postponed VAT accounting declaring and recovering import VAT on the same VAT Return; UK VAT registration being required and no approval needed; Great Britain from outside the UK and Northern Ireland from outside the UK and EU; goods for business use with the right to dispose of them and the VAT number on the import declaration (Data Element 3/40); written instructions to agents and suppliers who import on your behalf, and giving the supplier your EORI number; non-established persons needing someone to deal with customs; the choice not being changeable after the declaration is submitted; Royal Mail postal consignments over £135 being excluded; the update of 9 June 2025',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b4-gov-uk-pva-vat-return': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'Complete your VAT Return to account for import VAT',
    url: 'https://www.gov.uk/guidance/complete-your-vat-return-to-account-for-import-vat',
    jurisdiction: 'United Kingdom (import VAT)',
    supports:
      'accounting for postponed import VAT in the return period covering the import date; postponed import VAT in Box 1 and the amount reclaimed in Box 4; the value of imports excluding VAT in Box 7; the normal input tax rules applying; asking an agent to confirm the VAT was allocated to the correct EORI number',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b4-gov-uk-pva-statement': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'Get your postponed import VAT statement',
    url: 'https://www.gov.uk/guidance/get-your-postponed-import-vat-statement',
    jurisdiction: 'United Kingdom (import VAT)',
    supports:
      'monthly postponed import VAT statements in the Customs Declaration Service, usually available by the 10th working day of the month, accessible for 6 months from publication, to be downloaded and kept',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b4-gov-uk-import-vat': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title:
      'Paying VAT on imports from outside the UK to Great Britain and from outside the EU to Northern Ireland',
    url: 'https://www.gov.uk/guidance/vat-imports-acquisitions-and-purchases-from-abroad',
    jurisdiction: 'United Kingdom (import VAT)',
    supports:
      'import VAT normally being charged at the same rate as on a UK supply; the value for VAT being the customs value plus incidental expenses such as packing, transport and insurance up to the first UK destination, and any customs duty and other import charges; VAT-registered businesses choosing postponed VAT accounting or paying at import; businesses not registered for VAT paying import VAT and being unable to reclaim it; duty deferment accounts needing a bank guarantee',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b4-gov-uk-c79': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'Get your import VAT certificate (C79)',
    url: 'https://www.gov.uk/guidance/get-your-import-vat-certificates',
    jurisdiction: 'United Kingdom (import VAT)',
    supports:
      'the C79 import VAT certificate showing import VAT paid through a duty deferment account, distinct from the postponed import VAT statement used with postponed VAT accounting',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b4-cornell-ucc-2-206': {
    authority: 'Legal Information Institute, Cornell Law School (Uniform Commercial Code)',
    title: 'UCC § 2-206: Offer and Acceptance in Formation of Contract',
    url: 'https://www.law.cornell.edu/ucc/2/2-206',
    jurisdiction: 'United States (state law based on the UCC)',
    supports:
      'an order or other offer to buy goods for prompt or current shipment being construed as inviting acceptance by a prompt promise to ship or by prompt shipment',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b4-uncitral-cisg': {
    authority: 'United Nations Commission on International Trade Law (UNCITRAL)',
    title: 'United Nations Convention on Contracts for the International Sale of Goods (CISG)',
    url: 'https://uncitral.un.org/en/texts/salegoods/conventions/sale_of_goods/cisg',
    jurisdiction: 'International (contracting states)',
    supports:
      'the CISG providing uniform rules for contracts for the international sale of goods, applying when the parties have places of business in contracting states, or by choice of law or the parties’ choice; adopted 11 April 1980, in force 1 January 1988',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
