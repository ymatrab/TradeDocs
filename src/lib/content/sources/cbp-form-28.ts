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
} satisfies Record<string, SourceFields>;
