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
      'the numbered blocks of the entry/immediate delivery form and CBP’s instructions for them (port of entry, bond type, importer number, surety code of a Treasury-authorised surety, 11-digit entry number, entry type codes, bill of lading, line HTS number, value and country of origin), the applicant’s certification, the CBP use block for examination, and the purpose statement that the form lets CBP verify the consignee and shipment, confirm a bond is on file, close out the manifest and establish the obligation to pay estimated duties',
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
  'c2-cbp-bond-amounts-guide': {
    authority: 'U.S. Customs and Border Protection (CBP), Office of Finance – Revenue Division',
    title: 'A Guide for the Public: How CBP Sets Bond Amounts (February 2024)',
    url: 'https://www.cbp.gov/sites/default/files/assets/documents/2024-Feb/FINAL_A%20Guide%20for%20the%20Public_How%20CBP%20Sets%20Bond%20Amounts%20%28February%202024%29_0.pdf',
    jurisdiction: 'United States (import)',
    supports:
      'the definitions of bond, single transaction bond and continuous bond, CBP as third-party beneficiary, eBond transmission to ACE and the ACE account prerequisite, the Activity Code 1 continuous bond minimum of $50,000 or 10% of duties, taxes and fees in the previous 12 months and its increments, entry types excluded from that computation, single transaction bond amounts (entered value plus duties, taxes and fees; 10% for unconditionally duty-free goods; three times the value of restricted goods), and drawback bonds being required only for accelerated payment and equal to 100% of the accelerated amount',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c2-cfr-19-113-11': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 113.11, via the eCFR',
    title: '19 CFR § 113.11 — Bond application',
    url: 'https://www.ecfr.gov/current/title-19/section-113.11',
    jurisdiction: 'United States (import)',
    supports:
      'single transaction bond applications identifying the value and nature of the goods, and continuous bond applications to the Revenue Division stating the general character of the goods and the duties and taxes accrued in the preceding calendar year, updated within 30 days of a significant change',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c2-cfr-19-113-12': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 113.12, via the eCFR',
    title: '19 CFR § 113.12 — Bond approval',
    url: 'https://www.ecfr.gov/current/title-19/section-113.12',
    jurisdiction: 'United States (import)',
    supports:
      'single transaction bonds being approved by the Revenue Division or the port director, continuous bonds by the Revenue Division, and only one continuous bond per activity for each principal',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c2-cfr-19-113-13': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 113.13, via the eCFR',
    title: '19 CFR § 113.13 — Amount of bond',
    url: 'https://www.ecfr.gov/current/title-19/section-113.13',
    jurisdiction: 'United States (import)',
    supports:
      'the $100 minimum for any CBP bond, the factors CBP weighs in judging sufficiency, periodic sufficiency review with 15 days to remedy a deficiency, and additional security where the revenue is at risk',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c2-cfr-19-113-62': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 113.62, via the eCFR',
    title: '19 CFR § 113.62 — Basic importation and entry bond conditions',
    url: 'https://www.ecfr.gov/current/title-19/section-113.62',
    jurisdiction: 'United States (import)',
    supports:
      'the basic importation and entry bond being a single transaction or continuous bond, and the principal and surety agreeing jointly and severally to deposit duties, taxes and charges when due, pay additional amounts later found due, and make or complete entry for goods released early',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c2-cbp-drawback-overview': {
    authority: 'U.S. Customs and Border Protection (CBP)',
    title: 'Drawback Overview',
    url: 'https://www.cbp.gov/trade/programs-administration/entry-summary/drawback-overview',
    jurisdiction: 'United States (import and export)',
    supports:
      'drawback being the refund of certain duties, internal revenue taxes and fees collected on importation when the goods are exported or destroyed, the rules being in 19 CFR Part 190, and CBP’s published USMCA drawback guidance',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c2-cfr-19-190-3': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 190.3, via the eCFR',
    title: '19 CFR § 190.3 — Duties, taxes, and fees subject or not subject to drawback',
    url: 'https://www.ecfr.gov/current/title-19/section-190.3',
    jurisdiction: 'United States (import and export)',
    supports:
      'drawback applying to ordinary customs duties, marking duties, internal revenue taxes on importation, merchandise processing fees and harbor maintenance taxes, and not to antidumping and countervailing duties',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c2-cfr-19-190-11': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 190.11, via the eCFR',
    title: '19 CFR § 190.11 — Valuation of merchandise',
    url: 'https://www.ecfr.gov/current/title-19/section-190.11',
    jurisdiction: 'United States (import and export)',
    supports:
      'the value of exported goods for drawback being the selling price declared in the Electronic Export Information, or the value that would have been declared where no EEI was required',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c2-cfr-19-190-21': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 190.21, via the eCFR',
    title: '19 CFR § 190.21 — Direct identification manufacturing drawback',
    url: 'https://www.ecfr.gov/current/title-19/section-190.21',
    jurisdiction: 'United States (import and export)',
    supports:
      'drawback under 19 U.S.C. 1313(a) on exported or destroyed articles made in the US from imported merchandise, not used before export, up to 99 percent of the duties, taxes and fees paid',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c2-cfr-19-190-22': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 190.22, via the eCFR',
    title: '19 CFR § 190.22 — Substitution drawback',
    url: 'https://www.ecfr.gov/current/title-19/section-190.22',
    jurisdiction: 'United States (import and export)',
    supports:
      'substitution manufacturing drawback under 19 U.S.C. 1313(b) using merchandise in the same 8-digit HTSUS subheading within 5 years of importation, capped at 99 percent of the lesser of the duties paid or the duties that would apply to the substituted merchandise',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c2-cfr-19-190-31': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 190.31, via the eCFR',
    title: '19 CFR § 190.31 — Direct identification unused merchandise drawback',
    url: 'https://www.ecfr.gov/current/title-19/section-190.31',
    jurisdiction: 'United States (import and export)',
    supports:
      'drawback under 19 U.S.C. 1313(j)(1) on imported merchandise exported or destroyed unused within 5 years of importation and before the claim is filed, up to 99 percent of the duties, taxes and fees paid',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c2-cfr-19-190-32': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 190.32, via the eCFR',
    title: '19 CFR § 190.32 — Substitution unused merchandise drawback',
    url: 'https://www.ecfr.gov/current/title-19/section-190.32',
    jurisdiction: 'United States (import and export)',
    supports:
      'drawback under 19 U.S.C. 1313(j)(2) on substituted merchandise exported or destroyed unused within 5 years of importation, capped at 99 percent of the lesser of the duties paid or the duties that would apply to the exported article',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c2-cfr-19-190-35': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 190.35, via the eCFR',
    title: '19 CFR § 190.35 — Notice of intent to export or destroy; examination of merchandise',
    url: 'https://www.ecfr.gov/current/title-19/section-190.35',
    jurisdiction: 'United States (import and export)',
    supports:
      'the Notice of Intent to Export on CBP Form 7553 being filed at least 5 working days before export for unused merchandise claims unless waived, and CBP deciding within 2 working days whether to examine',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c2-cfr-19-190-42': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 190.42, via the eCFR',
    title: '19 CFR § 190.42 — Procedures and supporting documentation (rejected merchandise)',
    url: 'https://www.ecfr.gov/current/title-19/section-190.42',
    jurisdiction: 'United States (import and export)',
    supports:
      'rejected merchandise drawback being denied for goods exported or destroyed after the 5-year period, and the documents showing nonconformity, defect or shipment without consent',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c2-cfr-19-190-51': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 190.51, via the eCFR',
    title: '19 CFR § 190.51 — Completion of drawback claims',
    url: 'https://www.ecfr.gov/current/title-19/section-190.51',
    jurisdiction: 'United States (import and export)',
    supports:
      'a complete claim consisting of the electronic drawback entry, any CBP Form 7553 notices, import entry data and evidence of export or destruction, claims being filed through a CBP-authorised system, and a claim being timely if transmitted within 5 years of the date of importation',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c2-cfr-19-190-71': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 190.71, via the eCFR',
    title: '19 CFR § 190.71 — Drawback on articles destroyed under CBP supervision',
    url: 'https://www.ecfr.gov/current/title-19/section-190.71',
    jurisdiction: 'United States (import and export)',
    supports:
      'the Notice of Intent on CBP Form 7553 being filed at least 7 working days before destruction and CBP deciding within 4 working days whether to witness it',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c2-cfr-19-190-72': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 190.72, via the eCFR',
    title: '19 CFR § 190.72 — Proof of exportation',
    url: 'https://www.ecfr.gov/current/title-19/section-190.72',
    jurisdiction: 'United States (import and export)',
    supports:
      'proof of exportation giving the date of export, exporter, description, quantity and unit, Schedule B or HTSUS number and country of ultimate destination, supported by carrier documents such as a bill of lading or air waybill, or electronic export system records',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c2-cfr-19-190-82': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 190.82, via the eCFR',
    title: '19 CFR § 190.82 — Person entitled to claim drawback',
    url: 'https://www.ecfr.gov/current/title-19/section-190.82',
    jurisdiction: 'United States (import and export)',
    supports:
      'the exporter or destroyer being entitled to claim drawback unless it waives the right by certification and assigns it to the manufacturer, producer, importer or intermediate party',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
