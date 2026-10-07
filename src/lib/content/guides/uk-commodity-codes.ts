import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google UK, 2026-10-06/07): "commodity code" 12,100, KD 18; "uk commodity code" 2,400, KD 10;
 * "tariff code" 4,400; "commodity code lookup" 480, KD 62.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave A (v2 #24).
 */
const article: ContentArticle = {
  slug: 'uk-commodity-codes',
  title: 'UK commodity codes: what the 8 and 10 digits mean',
  metaTitle: 'Commodity code UK: how the digits work',
  description:
    'How UK commodity codes are built from the Harmonized System, why imports use 10 digits and exports 8, where to look a code up and how to get HMRC’s advice or a binding ruling.',
  lede: 'Every UK customs declaration names the goods by a commodity code. The first six digits are shared with most of the world, the rest are the UK’s own, and the number you need depends on which way the goods are moving.',
  answer:
    'A UK commodity code is the number that identifies goods on a UK customs declaration and sets the duty, import VAT and other measures. HMRC says goods are classified to a 10-digit code when imported into the UK and an 8-digit code when exported. The first six digits follow the international Harmonized System.',
  keyFacts: [
    'HMRC says goods are classified to a 10-digit commodity code when imported into the UK and an 8-digit code when exported.',
    'Only the first 6 digits of a commodity code are used worldwide, according to GOV.UK.',
    'The WCO’s Harmonized System is a six-digit nomenclature used by more than 200 countries and economies.',
    'In the Customs Declaration Service, data element 6/14 carries the first 8 digits and data element 6/15 carries digits 9 and 10.',
    'An Advance Tariff Ruling from HMRC is a legally binding decision on the commodity code for goods moving into or out of Great Britain.',
  ],
  definitions: [
    {
      term: 'Commodity code',
      meaning: 'The number that classifies goods for customs, duty and trade statistics.',
    },
    {
      term: 'Harmonized System (HS)',
      meaning: 'The WCO’s international six-digit goods nomenclature that national codes build on.',
    },
    {
      term: 'UK Trade Tariff',
      meaning:
        'The government’s online tool for looking up commodity codes and the measures attached to them.',
    },
    {
      term: 'Advance Tariff Ruling (ATaR)',
      meaning:
        'A legally binding HMRC decision on which commodity code applies to a specific product.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is a UK commodity code?',
      paragraphs: [
        'It is the reference number customs uses for a type of goods. GOV.UK calls commodity codes internationally recognised reference numbers, used to declare goods and to work out the rate of customs duty and import VAT, other taxes and any preferential rates.',
        'The code is what the rest of the declaration hangs on. Duty, import VAT, preferential rates and the product specific rules of origin are all read against it, which is why a wrong code can change what you pay or which rules apply.',
      ],
    },
    {
      heading: 'How is a UK commodity code built?',
      paragraphs: [
        'From the Harmonized System outwards. The WCO maintains the HS as a six-digit nomenclature of more than 5,000 commodity groups, used by more than 200 countries and economies. GOV.UK notes that only the first six digits are used worldwide; the digits after that are national decisions.',
      ],
      table: {
        caption: 'The levels of a UK commodity code, from HMRC guidance',
        head: ['Digits', 'Level', 'Who sets it'],
        rows: [
          ['First 2', 'Chapter', 'Harmonized System (WCO)'],
          ['First 4', 'Heading', 'Harmonized System (WCO)'],
          ['First 6', 'Subheading (the HS code)', 'Harmonized System (WCO)'],
          ['First 8', 'Code used on exports and in data element 6/14', 'UK tariff'],
          ['All 10', 'Code used on imports; digits 9–10 in data element 6/15', 'UK tariff'],
        ],
      },
    },
    {
      heading: 'Why do imports use 10 digits and exports 8?',
      paragraphs: [
        'Because the extra detail matters for import duty. HMRC’s guidance on product specific rules says you classify goods to a 10-digit commodity code when importing them into the UK and an 8-digit code when exporting from the UK.',
        'In the Customs Declaration Service, HMRC splits the code across two data elements. Data element 6/14 is the first 8 digits, used for imports and exports. Data element 6/15 holds digits 9 and 10, which give further detail and can affect the duty and measures applied to the goods.',
      ],
    },
    {
      heading: 'How do you find the commodity code for your goods?',
      paragraphs: [
        'With the UK Trade Tariff tool, which GOV.UK names as the place to look a code up. Classification depends on what the specific product is, made of and used for, so this guide does not suggest codes for any goods.',
      ],
      steps: [
        'Write down what the product is, what it is made of, what it does and how it is packed.',
        'Search the UK Trade Tariff by the product’s description and open the chapter that covers it.',
        'Work down from the heading to the subheading and the 8- or 10-digit code that fits the description.',
        'For product groups such as textiles, ceramics or pharmaceuticals, read the detailed GOV.UK classification guidance for that group.',
        'If you remain unsure, ask HMRC’s Tariff Classification Service or apply for an Advance Tariff Ruling.',
        'Use the same code on the commercial invoice, the declaration and any licence application.',
      ],
    },
    {
      heading: 'Can you use the code your supplier or buyer gives you?',
      paragraphs: [
        'Only after checking it. GOV.UK says that if you rely on a commodity code from an overseas supplier, you need to check whether the treatment is the same and how much of the code applies in the UK. The six-digit HS part is shared; the national digits beyond it may differ.',
        'The same applies in the other direction. An 8-digit UK export code and the buyer’s import code may share the first six digits and then diverge, so the importing country’s own tariff decides its code. The guide comparing HS, HTS and Schedule B explains how the US builds its numbers.',
      ],
    },
    {
      heading: 'How do you get HMRC’s help with classification?',
      paragraphs: [
        'There are two routes, one advisory and one binding. HMRC’s Tariff Classification Service gives non-legally binding advice by email, asks for one email per product with its make-up, use and packaging, and expects to reply within 5 working days.',
        'An Advance Tariff Ruling is a legally binding decision on the commodity code to use when importing into or exporting from Great Britain. HMRC says you need a separate application for each type of goods, decisions cannot be made retrospectively, and it responds in 30 to 120 days.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is a commodity code the same as an HS code?',
      a: 'The HS code is the first six digits. A UK commodity code adds national digits after them: 8 for exports and 10 for imports, according to HMRC.',
    },
    {
      q: 'Does a UK commodity code work in the EU or the US?',
      a: 'Only the first six digits are shared worldwide, GOV.UK says. The digits after that are set by each country or customs union, so the importing side uses its own tariff.',
    },
    {
      q: 'How long does an Advance Tariff Ruling take?',
      a: 'HMRC says it responds to applications in 30 to 120 days, and each type of goods needs its own application.',
    },
    {
      q: 'Is HMRC’s email classification advice binding?',
      a: 'No. HMRC describes it as non-legally binding advice. A legally binding decision comes from an Advance Tariff Ruling.',
    },
    {
      q: 'Where does the commodity code go on a commercial invoice?',
      a: 'Usually against each line item, next to its description. Use the code that matches the declaration and confirm with the importer which national code it needs.',
    },
  ],
  sources: [
    'a5-gov-uk-psr-commodity-codes',
    'w4-gov-uk-commodity-codes',
    'w5-wco-hs',
    'a5-gov-uk-cds-commodity-codes',
    'a5-gov-uk-classification-help',
    'a5-gov-uk-atar',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: [
    '/tools/invoice-generator',
    '/tools/packing-list-generator',
    '/tools/landed-cost-calculator',
  ],
  callout: {
    afterSection: 3,
    tool: '/tools/invoice-generator',
    title: 'Put the code on every invoice line',
    text: 'Enter the commodity code you have confirmed against each item, so the invoice and the declaration describe the goods the same way.',
  },
  related: [
    '/guides/hs-vs-hts-vs-schedule-b',
    '/blog/how-to-find-hs-code',
    '/guides/eori-number',
    '/blog/commercial-invoice-requirements',
  ],
  cover: {
    id: 'iWI0nZ1iloY',
    src: 'https://images.unsplash.com/photo-1723134091310-e6c6f5a65573',
    width: 8064,
    height: 6048,
    alt: 'Container ship being loaded by a crane at night at the Southampton docks in the UK',
    caption: 'A container ship loading at night in Southampton',
    photographer: { name: 'Ed Wingate', profile: 'https://unsplash.com/@ed_wingate' },
    page: 'https://unsplash.com/photos/a-harbor-filled-with-lots-of-boats-at-night-iWI0nZ1iloY',
  },
};

export default article;
