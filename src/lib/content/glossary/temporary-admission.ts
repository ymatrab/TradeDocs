import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'temporary-admission',
  term: 'Temporary admission',
  abbreviation: 'TA',
  aliases: ['temporary admission procedure', 'temporary import relief', 'TA relief'],
  demand: {
    keyword: 'temporary admission',
    market: 'UK',
    volume: 140,
    kd: null,
    dataFile: '06-labs-keyword-overview-uk-candidates.json',
  },
  metaTitle: 'Temporary admission: UK customs procedure',
  description:
    'How temporary admission lets goods enter the UK for a set use and leave again without import duty or VAT, the conditions and time limits, and how it differs from a carnet.',
  shortDefinition:
    'Temporary admission is a customs special procedure that lets goods be imported for a specific use, such as an exhibition or professional work, with relief from import duty and VAT, on condition that they are re-exported unchanged within a set period.',
  definition: [
    'HMRC’s customs handbook defines temporary admission as a special procedure that allows goods to be imported into the UK temporarily for a specific use, with relief from import duty and VAT when its conditions are met. Goods under it must be put to that use, must not be altered except for maintenance to preserve their condition, and must be re-exported within the time limit. Processing and repairs are not permitted.',
    'Most businesses need an authorisation first. HMRC says a temporary admission authorisation lets goods stay in most cases for up to 24 months, with shorter or longer limits for some goods in its table, and asks for prior authorisation to be applied for at least 30 days before import where it is required. Relief is usually claimed on a full customs declaration, though some goods can be declared orally or by conduct.',
    'The idea is international. The WCO’s Istanbul Convention on Temporary Admission describes the same relief from duty on condition of re-export within a set time, and the EU runs its own temporary admission procedure under the Union Customs Code. This page explains the mechanism only; which goods qualify and for how long is set by the authority.',
  ],
  onYourDocuments: [
    'Goods that are not being sold still need a commercial invoice or pro forma invoice for customs, showing a value for customs purposes and marked as not for sale. The description should identify each item, with serial numbers where there are any, so the same goods can be matched on re-export.',
    'The import declaration places the goods under the procedure and quotes the authorisation. Keep the packing list and the re-export papers together; discharging the procedure means showing that the goods that came in are the goods that left.',
  ],
  example: {
    caption: 'Worked example with invented parties',
    paragraphs: [
      'Meridian Stage Systems (invented), a US company, sends lighting rigs to a trade show in Birmingham. Its UK agent, which holds a temporary admission authorisation, declares the rigs to the procedure, so no import duty or VAT is paid. The pro forma invoice lists each rig by serial number and states that the goods are for exhibition only.',
      'After the show the rigs are re-exported within the time limit and the procedure is discharged. Had a visitor bought one rig, that unit would have been released to free circulation, with duty and VAT paid on it.',
    ],
  },
  confusedWith: [
    {
      term: 'ATA carnet',
      difference:
        'A carnet is an international document that can cover temporary admission in many countries with one guarantee. Temporary admission is the customs procedure itself, which can also be used with a declaration and authorisation.',
    },
    {
      term: 'US temporary importation under bond',
      difference:
        'The United States has its own temporary import bond, entered with CBP forms and a surety bond. It is a separate US mechanism, not the UK or EU procedure.',
    },
  ],
  related: [
    '/guides/ata-carnet',
    '/blog/commercial-invoice-for-samples',
    '/blog/commercial-invoice-for-returns-and-repairs',
    '/guides/eori-number',
    're-export',
  ],
  tool: '/tools/proforma-invoice-generator',
  toolPitch:
    'The pro forma invoice generator lets you list each item with its serial number and a value for customs, marked as not for sale, for goods going in and coming back out.',
  faq: [
    {
      q: 'How long can goods stay under temporary admission?',
      a: 'In the UK, in most cases up to 24 months under an authorisation, according to HMRC. Some goods have shorter or longer limits, and the limit for your goods is set in your authorisation.',
    },
    {
      q: 'Can I repair goods while they are under temporary admission?',
      a: 'No. HMRC allows maintenance that preserves the goods, but not processing or repairs. To change or repair imported goods without paying duty first, the procedure to look at is inward processing.',
    },
  ],
  sources: [
    'e6-gov-uk-ta-definition',
    'e6-gov-uk-ta-import-temporarily',
    'e6-gov-uk-ta-relief',
    'c8-wco-istanbul-convention',
    'c8-cbp-ata-carnet-faqs',
    'eu-union-customs-code',
  ],
  regulated: true,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
