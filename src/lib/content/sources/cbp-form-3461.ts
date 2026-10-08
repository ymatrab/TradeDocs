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
  'c2-cfr-19-151-1': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 151.1, via the eCFR',
    title: '19 CFR § 151.1 — Merchandise to be examined',
    url: 'https://www.ecfr.gov/current/title-19/section-151.1',
    jurisdiction: 'United States (import)',
    supports:
      'the port director examining the packages or quantities of merchandise deemed necessary to determine duties and compliance with the laws CBP enforces',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c2-cfr-19-151-2': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 151.2, via the eCFR',
    title: '19 CFR § 151.2 — Quantities to be examined',
    url: 'https://www.ecfr.gov/current/title-19/section-151.2',
    jurisdiction: 'United States (import)',
    supports:
      'not less than one package in every 10 being examined, with fewer allowed for uniform or identical packages but not less than one package per invoice',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c2-cfr-19-151-4': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 151.4, via the eCFR',
    title: '19 CFR § 151.4 — Time of examination',
    url: 'https://www.ecfr.gov/current/title-19/section-151.4',
    jurisdiction: 'United States (import)',
    supports:
      'CBP, FDA, APHIS and other agencies examining or sampling goods before entry, and the importer’s application to examine goods before entry to check perishables or to obtain information for a pro forma invoice',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c2-cfr-19-151-5': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 151.5, via the eCFR',
    title: '19 CFR § 151.5 — Conditions for examination prior to entry',
    url: 'https://www.ecfr.gov/current/title-19/section-151.5',
    jurisdiction: 'United States (import)',
    supports:
      'an importer’s examination before entry taking place under CBP supervision, with the carrier’s concurrence and with the Government reimbursed for the supervising officer',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c2-cfr-19-151-6': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 151.6, via the eCFR',
    title: '19 CFR § 151.6 — Place of examination',
    url: 'https://www.ecfr.gov/current/title-19/section-151.6',
    jurisdiction: 'United States (import)',
    supports:
      'goods being examined at the place of arrival unless another place is required or authorised, and the importer bearing the expense of preparing goods for examination and closing packages',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c2-cfr-19-151-7': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 151.7, via the eCFR',
    title: '19 CFR § 151.7 — Examination elsewhere than at place of arrival or public stores',
    url: 'https://www.ecfr.gov/current/title-19/section-151.7',
    jurisdiction: 'United States (import)',
    supports:
      'examination at the importer’s premises or a centralized examination station, sealing of packages, the importer arranging and paying for preparation, and a bond on CBP Form 301 before removal',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c2-cfr-19-151-15': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 151.15, via the eCFR',
    title: '19 CFR § 151.15 — Movement of merchandise to a centralized examination station',
    url: 'https://www.ecfr.gov/current/title-19/section-151.15',
    jurisdiction: 'United States (import)',
    supports:
      'CBP Form 3461 being used to request transfer of goods to a centralized examination station, and the transfer taking place under bond',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c2-cfr-19-151-16': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 151.16, via the eCFR',
    title: '19 CFR § 151.16 — Detention of merchandise',
    url: 'https://www.ecfr.gov/current/title-19/section-151.16',
    jurisdiction: 'United States (import)',
    supports:
      'CBP deciding within five business days of presentation whether to release or detain, the notice of detention and its contents, test results on request, the final admissibility determination within 30 days, deemed exclusion and protest, and the section not applying to detentions for other agencies',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c2-cfr-19-141-1': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 141.1, via the eCFR',
    title: '19 CFR § 141.1 — Liability of importer for duties',
    url: 'https://www.ecfr.gov/current/title-19/section-141.1',
    jurisdiction: 'United States (import)',
    supports:
      'duties accruing on arrival, duty being a personal debt of the importer not discharged by paying a broker who fails to pay, a bond not relieving the importer, payment directly or through a broker, the lien on imported goods, and no liability for a consignee who refuses unordered goods',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c2-usc-19-1401a': {
    authority: 'U.S. Code, 19 U.S.C. 1401a, via Cornell LII',
    title: '19 U.S. Code § 1401a — Value',
    url: 'https://www.law.cornell.edu/uscode/text/19/1401a',
    jurisdiction: 'United States (import)',
    supports:
      'transaction value not including US customs duties and other Federal taxes payable by reason of importation, nor transport after importation, when identified separately from the price actually paid or payable',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
