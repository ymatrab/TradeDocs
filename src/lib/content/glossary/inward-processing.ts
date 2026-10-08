import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'inward-processing',
  term: 'Inward processing',
  abbreviation: 'IP',
  aliases: ['inward processing relief', 'IPR', 'inward processing procedure'],
  demand: {
    keyword: 'inward processing',
    market: 'UK',
    volume: 110,
    kd: null,
    dataFile: '06-labs-keyword-overview-uk-candidates.json',
  },
  metaTitle: 'Inward processing: UK customs procedure',
  description:
    'How UK inward processing works: import goods to process or repair without paying duty and import VAT up front, who can be authorised, and what happens when goods leave.',
  shortDefinition:
    'Inward processing is a customs special procedure that lets an authorised business import goods to process or repair them without paying Customs Duty and import VAT, provided the processed goods are re-exported. Duty may be due if they stay.',
  definition: [
    'In the United Kingdom, HMRC explains that if you are authorised to use inward processing, you do not need to pay Customs Duty and import VAT on goods you import from outside the UK and then re-export. If the processed goods are kept in the UK and released to free circulation, duty and VAT may become payable, possibly reduced where the processed product carries a lower duty rate than the imported goods.',
    'Authorisation comes first. HMRC expects applicants to be established in the UK, hold an EORI number and have a good customs compliance record, and to check whether they need a guarantee or an import licence. The application describes the goods and their commodity codes, the process, how long it takes, the products it will make and the rate of yield, how the goods will be valued if released, and the records kept. Authorisations run for up to 3 years for sensitive goods and 5 years for others, and some are examined to make sure they do not disadvantage UK producers.',
    'The EU runs an inward processing procedure of the same name under its Union Customs Code. This page describes the mechanism only; the conditions for your goods come from the authority that authorises you.',
  ],
  onYourDocuments: [
    'The supplier’s commercial invoice is the starting point for the import declaration that places goods under the procedure, so it should give a precise description, quantities and value. The declaration then carries the procedure and authorisation details.',
    'When the processed goods leave, the export invoice and packing list should let customs trace them back to the imported goods: the same descriptions, the quantities your rate of yield predicts, and your own job or batch references. HMRC asks you to keep those records for the authorisation.',
  ],
  example: {
    caption: 'Worked example with invented parties; no real rate is shown',
    paragraphs: [
      'Caldera Instruments Ltd (invented), in Wales, repairs measuring equipment for a customer in Canada. It holds an inward processing authorisation, so the faulty units enter the UK without Customs Duty or import VAT. Each unit is repaired and returned, a rate of yield of one to one. The export invoice lists the same serial numbers as the import, and Caldera discharges the goods from the procedure.',
      'One unit cannot be repaired and the customer sells it to a UK buyer instead. That unit is released to free circulation, and the duty and import VAT on it are paid then.',
    ],
  },
  confusedWith: [
    {
      term: 'Duty drawback',
      difference:
        'Drawback refunds duty already paid when goods are later exported. Inward processing relieves the duty at import, under an authorisation granted in advance.',
    },
    {
      term: 'Temporary admission',
      difference:
        'Temporary admission covers goods imported for a specific use and re-exported unchanged; processing and repairs are not allowed under it. Inward processing exists for changing or repairing the goods.',
    },
  ],
  related: [
    '/guides/duty-drawback',
    '/blog/commercial-invoice-for-returns-and-repairs',
    '/guides/eori-number',
    '/blog/uk-import-duty',
    're-export',
  ],
  tool: '/tools/invoice-generator',
  toolPitch:
    'The commercial invoice generator lets you carry the same descriptions and references from import to re-export, which is the trail inward processing records need.',
  faq: [
    {
      q: 'Do I pay VAT on goods under inward processing?',
      a: 'Not while they are under the procedure and then re-exported, according to HMRC. If you release the processed goods into free circulation in the UK, Customs Duty and import VAT may be due at that point.',
    },
    {
      q: 'Who can apply for inward processing in the UK?',
      a: 'Usually a business established in the UK with an EORI number and a good compliance history. HMRC will consider applications from businesses not established in the UK for non-commercial imports.',
    },
  ],
  sources: [
    'e6-gov-uk-inward-processing-apply',
    'e6-gov-uk-inward-processing-using',
    'e6-gov-uk-ta-relief',
    'eu-union-customs-code',
  ],
  regulated: true,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
