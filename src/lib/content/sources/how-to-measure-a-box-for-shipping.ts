import type { SourceFields } from '@/lib/trade/sources';

/**
 * Sources first cited by the wave A posts how-to-measure-a-box-for-shipping,
 * how-much-does-a-pallet-weigh, standard-box-sizes-for-shipping, cargo-insurance-for-exporters
 * and importing-from-china-documents (content plan v3, 2026-10-07). Each page was opened and the
 * claim checked on the retrieval date.
 */
const RETRIEVED = '2026-10-07';
const PENDING = 'pending owner review';

export default {
  'a1-usps-dmm-101': {
    authority: 'United States Postal Service (USPS), Domestic Mail Manual',
    title: 'DMM 101: Physical standards (section 3.2.1, parcels)',
    url: 'https://pe.usps.com/text/dmm300/101.htm',
    jurisdiction: 'United States (domestic mail)',
    supports:
      'length being the longest dimension of a parcel, girth the distance around its thickest part, and the 108 inch combined length and girth maximum (130 inches for USPS Ground Advantage – Retail)',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a1-usps-dmm-223': {
    authority: 'United States Postal Service (USPS), Domestic Mail Manual',
    title: 'DMM 223: Priority Mail prices and eligibility (dimensional weight, 1.4.2)',
    url: 'https://pe.usps.com/text/dmm300/223.htm',
    jurisdiction: 'United States (domestic mail)',
    supports:
      'measuring length, width and height in inches, rounding each up to the whole inch, and dividing cubic inches by 139 for parcels over 1 cubic foot',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a1-usps-pmi-flat-rate': {
    authority: 'United States Postal Service (USPS)',
    title: 'Priority Mail International',
    url: 'https://www.usps.com/international/priority-mail-international.htm',
    jurisdiction: 'United States (outbound international mail)',
    supports:
      'the inside and outside dimensions and the 4 lb and 20 lb weight limits of the Priority Mail International Flat Rate Boxes',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a1-iso-3394': {
    authority: 'International Organization for Standardization (ISO), via AFNOR',
    title:
      'ISO 3394:2012 — Packaging: complete, filled transport packages and unit loads; dimensions of rigid rectangular packages',
    url: 'https://www.boutique.afnor.org/en-gb/standard/iso-33942012/packaging-complete-filled-transport-packages-and-unit-loads-dimensions-of-r/xs119110/118565',
    jurisdiction: 'International standard',
    supports:
      'ISO 3394 setting package dimensions based on the 600 × 400 mm, 600 × 500 mm and 550 × 366 mm modules, tied to the ISO 3676 unit load sizes of 1,219 × 1,016, 1,200 × 1,000, 1,200 × 800 and 1,100 × 1,100 mm',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a1-fefco-code': {
    authority: 'FEFCO (European Federation of Corrugated Board Manufacturers)',
    title: 'FEFCO Code',
    url: 'https://www.fefco.org/technical-information/fefco-code',
    jurisdiction:
      'Industry classification (adopted by the International Corrugated Case Association)',
    supports:
      'the FEFCO code being the internationally applied system that gives a code number to each common corrugated box design',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a1-epal-3-pallet': {
    authority: 'European Pallet Association (EPAL)',
    title: 'EPAL 3 Pallet',
    url: 'https://www.epal-pallets.org/eu-en/load-carriers/epal-3-pallet',
    jurisdiction: 'Industry specification (EPAL licensed pallets)',
    supports:
      'the EPAL 3 pallet measuring 1,000 × 1,200 × 144 mm, weighing about 30 kg, with a 1,500 kg safe working load',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a1-uk-cogsa-1971': {
    authority: 'UK Parliament, via legislation.gov.uk',
    title: 'Carriage of Goods by Sea Act 1971, Schedule (the Hague-Visby Rules)',
    url: 'https://www.legislation.gov.uk/ukpga/1971/19/schedule',
    jurisdiction: 'United Kingdom (sea carriage under bills of lading)',
    supports:
      'carrier liability limited to 666.67 units of account per package or 2 per kilogramme of gross weight, whichever is higher, unless value is declared; suit within one year; the unit being the IMF special drawing right',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a1-cornell-19-cfr-142-3': {
    authority: 'Legal Information Institute, Cornell Law School (19 CFR, CBP)',
    title: '19 CFR 142.3 — Entry documentation required',
    url: 'https://www.law.cornell.edu/cfr/text/19/142.3',
    jurisdiction: 'United States (imports)',
    supports:
      'the entry documents: CBP Form 3461 or its electronic equivalent, evidence of the right to make entry, a commercial invoice, a packing list where appropriate, and other documents agencies require',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a1-cornell-19-cfr-142-4': {
    authority: 'Legal Information Institute, Cornell Law School (19 CFR, CBP)',
    title: '19 CFR 142.4 — Bond requirements at the time of entry',
    url: 'https://www.law.cornell.edu/cfr/text/19/142.4',
    jurisdiction: 'United States (imports)',
    supports:
      'merchandise not being released from CBP custody unless a single entry or continuous bond on CBP Form 301 has been filed, with listed exceptions',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a1-cornell-19-cfr-149-2': {
    authority: 'Legal Information Institute, Cornell Law School (19 CFR, CBP)',
    title: '19 CFR 149.2 — Importer Security Filing requirements',
    url: 'https://www.law.cornell.edu/cfr/text/19/149.2',
    jurisdiction: 'United States (imports by vessel)',
    supports:
      'the ISF Importer submitting the Importer Security Filing no later than 24 hours before the cargo is laden aboard the vessel at the foreign port',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a1-cbp-isf': {
    authority: 'U.S. Customs and Border Protection (CBP)',
    title: 'Importer Security Filing "10+2"',
    url: 'https://www.cbp.gov/border-security/ports-entry/cargo-security/importer-security-filing-102',
    jurisdiction: 'United States (imports by vessel)',
    supports:
      'the 10+2 rule applying to import cargo arriving by vessel, and non-compliance risking penalties, more inspections and delay',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a1-cornell-19-cfr-134-11': {
    authority: 'Legal Information Institute, Cornell Law School (19 CFR, CBP)',
    title: '19 CFR 134.11 — Country of origin marking required',
    url: 'https://www.law.cornell.edu/cfr/text/19/134.11',
    jurisdiction: 'United States (imports)',
    supports:
      'every article of foreign origin, or its container, being marked legibly, indelibly and permanently with the English name of the country of origin',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a1-cbp-csms-de-minimis': {
    authority: 'U.S. Customs and Border Protection (CBP), CSMS # 66065494',
    title: 'Suspension of Duty-Free De Minimis Treatment for All Countries (28 August 2025)',
    url: 'https://content.govdelivery.com/accounts/USDHSCBP/bulletins/3f01456',
    jurisdiction: 'United States (imports)',
    supports:
      'goods of all countries losing duty-free de minimis treatment from 12:01 a.m. on 29 August 2025, regardless of value, origin or mode, and needing a formal or informal entry in ACE',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a1-whitehouse-eo-14388': {
    authority: 'The White House',
    title:
      'Continuing the Suspension of Duty-Free De Minimis Treatment for All Countries (20 February 2026)',
    url: 'https://www.whitehouse.gov/presidential-actions/2026/02/continuing-the-suspension-of-duty-free-de-minimis-treatment-for-all-countries/',
    jurisdiction: 'United States (imports)',
    supports: 'the suspension of duty-free de minimis treatment being continued in February 2026',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a1-ustr-301-china': {
    authority: 'Office of the United States Trade Representative (USTR)',
    title: 'Section 301 investigations: tariff actions',
    url: 'https://ustr.gov/issue-areas/enforcement/section-301-investigations/tariff-actions',
    jurisdiction: 'United States (imports from China)',
    supports: 'the Section 301 tariff actions on products of China, published as Lists 1 to 4',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
