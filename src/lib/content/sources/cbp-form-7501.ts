import type { SourceFields } from '@/lib/trade/sources';

const RETRIEVED = '2026-10-07';
const PENDING = 'pending owner review';

/**
 * Sources first cited by the wave A posts schedule-b-number, delivery-note-vs-packing-list,
 * cbp-form-7501, how-to-read-the-harmonized-tariff-schedule and
 * customs-status-messages-explained. Each URL was opened on 2026-10-07 and the cited
 * sentence checked.
 */
export default {
  'a3-cbp-form-7501': {
    authority: 'U.S. Customs and Border Protection (CBP)',
    title: 'CBP Form 7501 — Entry Summary, with continuation sheets and instructions (02/26)',
    url: 'https://www.cbp.gov/sites/default/files/2026-02/cbp_form_7501.pdf',
    jurisdiction: 'United States (import)',
    supports:
      'the numbered blocks and columns of the entry summary and CBP’s instructions for them: entry type codes, entry date, country of origin, manufacturer ID, missing-document codes, description, 10-digit HTS number, gross weight, net quantity in HTS units, entered value, charges, relationship, HTS rate, duty, fees and the importer’s declaration, and the purpose of the collection',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a3-cbp-form-7501-page': {
    authority: 'U.S. Customs and Border Protection (CBP)',
    title: 'CBP Form 7501 — Entry Summary with Continuation Sheets',
    url: 'https://www.cbp.gov/document/forms/form-7501-entry-summary-continuation-sheets',
    jurisdiction: 'United States (import)',
    supports:
      'CBP relying on the entry summary to determine appraisement, classification and origin of imported goods',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a3-ecfr-19-cfr-141-0a': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 141.0a, via Cornell LII',
    title: '19 CFR § 141.0a — Definitions',
    url: 'https://www.law.cornell.edu/cfr/text/19/141.0a',
    jurisdiction: 'United States (import)',
    supports:
      'the definitions of entry (the filing that secures release from CBP custody), entry summary (the filing that lets CBP assess duties and collect statistics) and released conditionally',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a3-ecfr-19-cfr-142-3': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 142.3, via Cornell LII',
    title: '19 CFR § 142.3 — Entry documentation required',
    url: 'https://www.law.cornell.edu/cfr/text/19/142.3',
    jurisdiction: 'United States (import)',
    supports:
      'the entry documents: CBP Form 3461 or its electronic equivalent, evidence of the right to make entry, a commercial invoice, a packing list where appropriate, and other documents required by CBP or other agencies',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a3-ecfr-19-cfr-142-11': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 142.11, via Cornell LII',
    title: '19 CFR § 142.11 — Entry summary form',
    url: 'https://www.law.cornell.edu/cfr/text/19/142.11',
    jurisdiction: 'United States (import)',
    supports: 'the entry summary being on CBP Form 7501 or its electronic equivalent',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a3-ecfr-19-cfr-142-12': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 142.12, via Cornell LII',
    title: '19 CFR § 142.12 — Time for filing entry summary documentation',
    url: 'https://www.law.cornell.edu/cfr/text/19/142.12',
    jurisdiction: 'United States (import)',
    supports:
      'the entry summary being filed, with estimated duties attached, within 10 working days after the time of entry',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a3-usitc-hts-general-notes': {
    authority: 'U.S. International Trade Commission (USITC)',
    title: 'Harmonized Tariff Schedule of the United States, Revision 20 (2026): General Notes',
    url: 'https://hts.usitc.gov/reststop/file?release=currentRelease&filename=General%20Notes',
    jurisdiction: 'United States (import)',
    supports:
      'General Note 3: rate of duty column 1 with its General (normal trade relations) and Special subcolumns, special programs applying only when their legal requirements are met and the lowest eligible rate applying, column 2 applying to products of Belarus, Cuba, North Korea and Russia, and temporary modifications in chapter 99',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a3-usitc-hts-gri': {
    authority: 'U.S. International Trade Commission (USITC)',
    title:
      'Harmonized Tariff Schedule of the United States, Revision 20 (2026): General Rules of Interpretation',
    url: 'https://hts.usitc.gov/reststop/file?release=currentRelease&filename=General%20Rules%20of%20Interpretation',
    jurisdiction: 'United States (import)',
    supports:
      'titles being for reference only, classification following the terms of the headings and the section and chapter notes, and the rules for goods prima facie classifiable under two or more headings',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a3-usitc-hts-stat-notes': {
    authority: 'U.S. International Trade Commission (USITC)',
    title:
      'Harmonized Tariff Schedule of the United States, Revision 20 (2026): General Statistical Notes',
    url: 'https://hts.usitc.gov/reststop/file?release=currentRelease&filename=General%20Statistical%20Notes',
    jurisdiction: 'United States (import)',
    supports:
      'the 2-digit statistical suffixes and units of quantity being statistical annotations outside the legal text, and the 10-digit statistical reporting number formed from the 8-digit subheading and the suffix',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a3-dhl-tracking-faq': {
    authority: 'DHL Express',
    title: 'MyDHL+ FAQs — Tracking and Monitoring',
    url: 'https://mydhl.express.dhl/ca/en/help-and-support/faqs/tracking-monitoring.html',
    jurisdiction: 'Carrier practice (DHL Express)',
    supports:
      'the “Customs status updated” checkpoint indicating clearance processing at destination, and its further details showing early whether customs needs more information',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a3-hmrc-vat-notice-703': {
    authority: 'HM Revenue & Customs (HMRC), on GOV.UK',
    title: 'VAT on goods exported from the UK (VAT Notice 703)',
    url: 'https://www.gov.uk/guidance/vat-on-goods-exported-from-the-uk-notice-703',
    jurisdiction: 'United Kingdom (VAT on exports)',
    supports:
      'section 6.3 listing transport documents (such as bills of lading, air waybills and CMR notes) as commercial evidence of export, and section 6.4 listing records such as an advice note, consignment note and packing list as supporting evidence of the supply',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
