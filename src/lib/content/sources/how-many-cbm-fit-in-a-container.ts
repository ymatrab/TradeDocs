import type { SourceFields } from '@/lib/trade/sources';

/**
 * Sources for the wave B posts (writer b2): how-many-cbm-fit-in-a-container,
 * paperless-commercial-invoice, uk-import-duty, how-to-make-a-proforma-invoice,
 * proforma-to-commercial-invoice and delivery-note-from-packing-list. One file for the six
 * posts, ids prefixed `b2-`.
 */
const RETRIEVED = '2026-10-08';
const PENDING = 'pending owner review';

export default {
  'b2-imo-ctu-code': {
    authority: 'International Maritime Organization (IMO), with the ILO and UNECE',
    title: 'IMO/ILO/UNECE Code of Practice for Packing of Cargo Transport Units (CTU Code)',
    url: 'https://www.imo.org/en/OurWork/Safety/Pages/CTU-Code.aspx',
    jurisdiction: 'International (non-mandatory code of practice)',
    supports:
      'the CTU Code being a non-mandatory 2014 code of practice from the IMO, ILO and UNECE on loading and securing cargo in containers and other cargo transport units',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b2-fedex-etd': {
    authority: 'FedEx',
    title: 'FedEx Electronic Trade Documents',
    url: 'https://www.fedex.com/en-us/electronic-trade-documents.html',
    jurisdiction: 'Carrier practice (FedEx, United States site)',
    supports:
      'ETD transmitting customs documents electronically, the three invoice choices in FedEx Ship Manager at fedex.com (your own uploaded invoice, or a FedEx-created commercial or pro forma invoice with your letterhead and signature), up to four additional documents, and pre-shipment, at-shipment and post-shipment upload',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b2-dhl-plt-terms': {
    authority: 'DHL Express',
    title: 'MyDHL+ Digital Customs Invoice Terms and Conditions',
    url: 'https://mydhl.express.dhl/us/en/legal/digital-customs-invoice-terms.html',
    jurisdiction: 'Carrier practice (DHL Express, United States site)',
    supports:
      'DHL Paperless Trade (PLT) sending documentation electronically instead of printed copies, DHL checking from the shipment details whether PLT is available, PLT not being used where legal or customs rules require hard copies, some documents still being needed on paper, and electronic documents having to be legible',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b2-dhl-nz-prepare-shipment': {
    authority: 'DHL Express',
    title: 'Prepare your shipment on MyDHL+',
    url: 'https://www.dhl.com/discover/en-nz/starter-hub/prepare-shipment-on-mydhl',
    jurisdiction: 'Carrier practice (DHL Express, New Zealand site)',
    supports:
      'MyDHL+ offering “Create Invoice” or “Use My Own Invoice”, uploading the invoice for the digital customs invoice service, and otherwise printing two hard copies to attach',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b2-gov-uk-import-step-by-step': {
    authority: 'GOV.UK (HM Revenue & Customs)',
    title: 'Import goods into the UK: step by step',
    url: 'https://www.gov.uk/import-goods-into-uk',
    jurisdiction: 'United Kingdom (imports)',
    supports:
      'the import steps: a GB EORI number, deciding who makes the declaration, the commodity code setting the duty rate, trade agreements and reliefs, the declared value setting duty and VAT, reclaiming import VAT with the C79, and keeping invoices and records',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b2-gov-uk-goods-sent-from-abroad': {
    authority: 'GOV.UK (HM Revenue & Customs)',
    title: 'Tax and customs for goods sent from abroad: tax and duty',
    url: 'https://www.gov.uk/goods-sent-from-abroad/tax-and-duty',
    jurisdiction: 'United Kingdom (imports, goods sent from abroad)',
    supports:
      'no Customs Duty on non-excise goods worth £135 or less sent to Great Britain, duty above £135 at the rate for the goods and their origin, no VAT on gifts worth £39 or less, and different rules for Northern Ireland',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b2-gov-uk-value-imports': {
    authority: 'GOV.UK (HM Revenue & Customs)',
    title: 'How to value your imports for Customs Duty and trade statistics',
    url: 'https://www.gov.uk/guidance/how-to-value-your-imports-for-customs-duty-and-trade-statistics',
    jurisdiction: 'United Kingdom (imports)',
    supports:
      'the customs value being the basis for Customs Duty, import VAT and trade statistics, the six valuation methods starting with Method 1 (transaction value), and exchange rates for foreign currency amounts',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b2-gov-uk-vat-on-imports': {
    authority: 'GOV.UK (HM Revenue & Customs)',
    title: 'Paying VAT on imports from outside the UK to Great Britain',
    url: 'https://www.gov.uk/guidance/vat-imports-acquisitions-and-purchases-from-abroad',
    jurisdiction: 'United Kingdom (import VAT)',
    supports:
      'the value for import VAT being the customs value plus incidental costs to the first UK destination and any Customs Duty, postponed VAT accounting on the VAT Return for VAT-registered businesses, and reclaiming import VAT as input tax',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b2-gov-uk-vat-rates': {
    authority: 'GOV.UK (HM Revenue & Customs)',
    title: 'VAT rates',
    url: 'https://www.gov.uk/vat-rates',
    jurisdiction: 'United Kingdom (VAT)',
    supports: 'the standard rate of 20%, the reduced rate of 5% and the zero rate',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b2-gov-uk-trade-tariff': {
    authority: 'GOV.UK (HM Revenue & Customs)',
    title: 'Trade Tariff: look up commodity codes, duty and VAT rates',
    url: 'https://www.gov.uk/trade-tariff',
    jurisdiction: 'United Kingdom (imports and exports)',
    supports:
      'the Trade Tariff service for finding a commodity code and checking the duty and VAT to pay, including suspensions and reductions',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b2-gov-uk-preference-agreements': {
    authority: 'GOV.UK (HM Revenue & Customs)',
    title: 'Pay less Customs Duty on goods from a country with a UK trade agreement',
    url: 'https://www.gov.uk/guidance/import-and-export-goods-using-preference-agreements',
    jurisdiction: 'United Kingdom (imports)',
    supports:
      'reduced duty under a UK trade agreement, meeting the rules of origin on every claim, the Trade Tariff showing which proof of origin can be used, and keeping the proof for at least 4 years',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
