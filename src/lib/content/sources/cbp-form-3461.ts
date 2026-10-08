import type { SourceFields } from '@/lib/trade/sources';

const RETRIEVED = '2026-10-08';
const PENDING = 'pending owner review';

/**
 * Sources first cited by the wave C articles cbp-form-3461, cbp-customs-exam,
 * who-pays-import-duties, customs-bond and duty-drawback. Each URL was opened on
 * 2026-10-08 and the cited sentence checked.
 */
export default {
  'c2-cbp-form-3461': {
    authority: 'U.S. Customs and Border Protection (CBP)',
    title: 'CBP Form 3461 — Entry/Immediate Delivery, with instructions (01/25)',
    url: 'https://www.cbp.gov/sites/default/files/2025-01/cbp_form_3461.pdf',
    jurisdiction: 'United States (import)',
    supports:
      'the numbered blocks of the entry/immediate delivery form and CBP’s instructions for them (port of entry, bond type, importer number, 11-digit entry number, entry type codes, bill of lading, line HTS number, value and country of origin), the applicant’s certification, the CBP use block for examination, and the purpose statement that the form lets CBP verify the consignee and shipment, confirm a bond is on file, close out the manifest and establish the obligation to pay estimated duties',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c2-cfr-19-142-16': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 142.16, via the eCFR',
    title: '19 CFR § 142.16 — Entry summary documentation',
    url: 'https://www.ecfr.gov/current/title-19/section-142.16',
    jurisdiction: 'United States (import)',
    supports:
      'entry documentation being transmitted electronically to ACE, and CBP Form 3461 not being required when the entry summary is filed at the time of entry',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c2-cfr-19-142-21': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 142.21, via the eCFR',
    title: '19 CFR § 142.21 — Merchandise eligible for special permit for immediate delivery',
    url: 'https://www.ecfr.gov/current/title-19/section-142.21',
    jurisdiction: 'United States (import)',
    supports:
      'the circumstances in which goods may be released under a special permit for immediate delivery, including goods arriving by land from Canada or Mexico at the port director’s discretion with a bond on CBP Form 301, fresh fruits and vegetables, US Government shipments, trade fair articles and quota-class goods',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c2-cfr-19-142-22': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 142.22, via the eCFR',
    title: '19 CFR § 142.22 — Application for special permit for immediate delivery',
    url: 'https://www.ecfr.gov/current/title-19/section-142.22',
    jurisdiction: 'United States (import)',
    supports:
      'the immediate delivery application being made on CBP Form 3461 or its electronic equivalent, a pro forma invoice or other document with an adequate description, quantities and values being accepted in place of a commercial invoice, and the goods remaining in CBP custody until the entry summary is filed',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c2-cfr-19-142-23': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 142.23, via the eCFR',
    title: '19 CFR § 142.23 — Time limit for filing documentation after release',
    url: 'https://www.ecfr.gov/current/title-19/section-142.23',
    jurisdiction: 'United States (import)',
    supports:
      'the entry summary documentation being filed and estimated duties deposited within 10 working days after release under a special permit for immediate delivery',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c2-cfr-19-143-23': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 143.23, via the eCFR',
    title: '19 CFR § 143.23 — Form of entry (informal entries)',
    url: 'https://www.ecfr.gov/current/title-19/section-143.23',
    jurisdiction: 'United States (import)',
    supports:
      'informal entries being made on CBP Form 368 or 368A, CBP Form 7501 or its electronic equivalent, or an authorised commercial invoice carrying the importer’s declaration, with other forms for listed cases',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
