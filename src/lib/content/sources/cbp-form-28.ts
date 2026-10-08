import type { SourceFields } from '@/lib/trade/sources';

const RETRIEVED = '2026-10-09';
const PENDING = 'pending owner review';

/**
 * Sources first cited by the wave E posts cbp-form-28, fumigation-certificate and
 * exporting-a-vehicle-from-the-us. Each URL was opened on 2026-10-09 and the cited sentence
 * checked.
 */
export default {
  'e3-cbp-form-28': {
    authority: 'U.S. Customs and Border Protection (CBP)',
    title: 'CBP Form 28 — Request for Information (08/24)',
    url: 'https://www.cbp.gov/sites/default/files/2025-05/cbp_form_28.pdf',
    jurisdiction: 'United States (import)',
    supports:
      'the header fields of the request (entry number, entry date, invoice number and description, HTSUS item number, country of origin or exportation, manufacturer or seller, broker, port), question A on relationship to the seller, question B on packing, commissions, proceeds, assists and royalties, the items CBP may ask for (contract or purchase order, breakdown of components and their cost, descriptive literature, samples), the certification by a company official not required where a foreign firm completes the form, the general instructions (answer to the best of your knowledge, contact the named officer if a reply cannot be made within 30 days of the request, return a copy of the form, information treated confidentially), the definitions of related persons, price paid or payable and assists, the reply being required under 19 U.S.C. 1509, OMB control number 1651-0023 and the two-hour average time estimate',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e3-cbp-form-28-page': {
    authority: 'U.S. Customs and Border Protection (CBP)',
    title: 'CBP Form 28 — Request for Information (forms library page)',
    url: 'https://www.cbp.gov/document/forms/cbp-form-28-request-information',
    jurisdiction: 'United States (import)',
    supports:
      'CBP publishing Form 28 in its forms library and stating that the form remains valid for use while its OMB approval is under review',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e3-fr-2026-09221': {
    authority: 'U.S. Customs and Border Protection, Federal Register notice 2026-09221 (via GovInfo)',
    title:
      'Agency Information Collection Activities; Reinstatement; Request for Information (CBP Form 28), 8 May 2026',
    url: 'https://www.govinfo.gov/content/pkg/FR-2026-05-08/html/2026-09221.htm',
    jurisdiction: 'United States (import)',
    supports:
      'CBP sending Form 28 to importers, exporters, producers or their agents when the invoice or other documentation does not give enough information for appraisement, classification or trade agreement and preference compliance, the authority in 19 CFR 151.11, and the burden estimate of 13,415 respondents at two hours per response',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e3-ecfr-19-cfr-151-11': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 151.11, via Cornell LII',
    title: '19 CFR § 151.11 — Samples or additional examination packages',
    url: 'https://www.law.cornell.edu/cfr/text/19/151.11',
    jurisdiction: 'United States (import)',
    supports:
      'CBP requesting samples or additional examination packages of released goods on Customs Form 28, its electronic equivalent or another appropriate form, and demanding redelivery under the bond in accordance with 19 CFR 141.113 if the request is not promptly complied with',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e3-ecfr-19-cfr-152-2': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 152.2, via Cornell LII',
    title: '19 CFR § 152.2 — Notification to importer of increased duties',
    url: 'https://www.law.cornell.edu/cfr/text/19/152.2',
    jurisdiction: 'United States (import)',
    supports:
      'the Center director notifying the importer on Customs Form 29, or its electronic equivalent, when the entered rate or value is believed too low or the quantity exceeds the entered quantity, and stating the nature of the difference',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e3-cbp-ace-forms-notice': {
    authority: 'U.S. Customs and Border Protection (CBP)',
    title: 'ACE Forms Modernization Information Notice (18 April 2022)',
    url: 'https://www.cbp.gov/document/guidance/ace-forms-modernization-information-notice',
    jurisdiction: 'United States (import)',
    supports:
      'the ACE Forms tool, deployed on 23 April 2022, for trade users to respond to and manage CBP Forms 28, 29 and 4647 and Docs Required requests',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e3-ippc-ispm-43': {
    authority: 'International Plant Protection Convention (IPPC), FAO',
    title: 'ISPM 43: Requirements for the use of fumigation as a phytosanitary measure (adopted 2019)',
    url: 'https://assets.ippc.int/static/media/files/publication/en/2019/04/ISPM_43_2019_En_Fumigation_2019-04-29_PostCPM-14.pdf',
    jurisdiction: 'International (phytosanitary standard)',
    supports:
      'fumigation as treatment with chemicals reaching the commodity as a gas, efficacy depending on concentration, minimum temperature and duration, the NPPO of the country where fumigation is conducted or initiated authorizing treatment providers and keeping a list of them, the consignment owner preventing reinfestation after treatment, labelling of fumigated lots, the treatment provider keeping records for at least one year (fumigant, enclosure and provider, commodity, target pest, lot number, date and duration, lowest temperature, dosage and concentration readings), inspection by the exporting and importing NPPOs, and the split of responsibility for fumigation during transport',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e3-ippc-ispm-12': {
    authority: 'International Plant Protection Convention (IPPC), FAO',
    title: 'ISPM 12: Phytosanitary certificates (revision adopted by CPM-16, 2022)',
    url: 'https://assets.ippc.int/static/media/files/publication/en/2022/05/ISPM_12_2022_En_PCs_2022-04-21_PostCPM-16.pdf',
    jurisdiction: 'International (phytosanitary standard)',
    supports:
      'section III of the phytosanitary certificate, Disinfestation and/or Disinfection Treatment, with its entries for date, treatment, chemical (active ingredient), duration and temperature, concentration and additional information, treatments shown being only those acceptable to the importing country and performed under the supervision or authority of the exporting NPPO, and treatments not being entered in the additional declaration',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e3-ecfr-7-cfr-305-4': {
    authority: 'USDA Animal and Plant Health Inspection Service, 7 CFR 305.4, via Cornell LII',
    title: '7 CFR § 305.4 — Monitoring and certification of treatments',
    url: 'https://www.law.cornell.edu/cfr/text/7/305.4',
    jurisdiction: 'United States (plant health, import)',
    supports:
      'treatments approved under 7 CFR part 305 being subject to APHIS monitoring and verification, and treatments performed outside the United States being monitored and certified by an inspector or an official authorized by APHIS',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
