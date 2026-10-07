import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "importing into the us" 4,400, KD 41;
 * "how to import" 880.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave A. The importer's view; the seller's
 * view is the planned export-documents/united-states country page.
 * No duty rates, de minimis thresholds or fees: those change and belong to CBP and the USITC.
 */
const article: ContentArticle = {
  slug: 'how-to-import-into-the-us',
  title: 'How to import into the US: entry, documents and deadlines',
  metaTitle: 'Importing into the US: entry, bond and documents',
  description:
    'The US import process step by step: who the importer of record is, the entry documents CBP asks for, the bond, ISF for ocean cargo, and the 15-day and 10-day deadlines.',
  lede:
    'Importing into the United States is a sequence with fixed deadlines, most of them set in Title 19 of the Code of Federal Regulations. Knowing the order, and which document each step relies on, is how you keep goods moving instead of sitting in a warehouse.',
  answer:
    'To import into the US, the importer of record files entry documents with CBP within 15 calendar days of arrival: an entry form, evidence of the right to make entry, a commercial invoice and a packing list. A bond must be on file before release, and the entry summary with estimated duties follows within 10 working days.',
  keyFacts: [
    'CBP does not require an importer to hold a licence, but other federal agencies may require a permit or licence for particular goods.',
    'Under 19 CFR 142.2, entry is made within 15 calendar days after the goods arrive in the United States.',
    'Under 19 CFR 142.12, the entry summary, with estimated duties attached, is filed within 10 working days after entry.',
    'Under 19 CFR 142.4, goods are not released at entry unless a single entry or continuous bond on CBP Form 301 is on file, with limited exceptions.',
    'Under 19 CFR 149.2, the Importer Security Filing for ocean cargo is due 24 hours before the goods are laden aboard the vessel abroad.',
    'CBP states that the importer of record stays responsible for the entry and all duties, taxes and fees, even when a licensed customs broker files it.',
  ],
  definitions: [
    {
      term: 'Importer of record',
      meaning:
        'The party responsible to CBP for the entry, its accuracy and the duties, taxes and fees owed.',
    },
    {
      term: 'Entry',
      meaning:
        'Filing the documents CBP needs to decide whether to release the goods from customs custody.',
    },
    {
      term: 'Entry summary',
      meaning:
        'The filing that follows entry, giving the classification and value of the goods, with estimated duties.',
    },
    {
      term: 'Customs bond',
      meaning:
        'A guarantee from an approved surety, or cash or US obligations, that the importer will pay what is owed and meet CBP’s conditions.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'Do you need a licence to import into the US?',
      paragraphs: [
        'Not from CBP. Its guidance for new importers says CBP does not require an importer to have a licence or permit, but other agencies may require a permit, licence or other certification, depending on the goods. Find out which agencies regulate your product, and what each one asks for, before you buy rather than after the goods arrive.',
        'You do need an importer number on the entry. CBP says this is your IRS business registration number, or, if you have no registered business, your social security number.',
      ],
    },
    {
      heading: 'Who is the importer of record?',
      paragraphs: [
        'It is the party that answers to CBP for the entry. Many first-time importers hire a customs broker, licensed by CBP, to file it for them. Using one does not hand over the responsibility: CBP says the importer of record remains ultimately responsible for the correctness of the entry documentation and for all duties, taxes and fees.',
        'The Incoterms® 2020 rules decide who clears the goods for import. Under DDP the seller does, so it has to act as importer or arrange for someone who can. Under every other rule the buyer clears import, so if you are buying on EXW, FOB, CIF or DAP terms, plan on the importer of record being you.',
      ],
    },
    {
      heading: 'What documents does a US import entry need?',
      paragraphs: [
        'Under 19 CFR 142.3 the entry documentation is an entry form (CBP Form 3461 or its electronic equivalent), evidence of the right to make entry, a commercial invoice, a packing list where appropriate, and any other documents CBP or another agency requires for the shipment. In the cases the regulations list, a pro forma invoice or other documentation may stand in for the commercial invoice.',
        'The commercial invoice carries most of the weight. 19 CFR 141.86 sets out what it must state for a US import, including a detailed description of the goods with their grade or quality, the quantities, the purchase price of each item in the currency of the purchase, the charges such as freight and packing, and the country of origin. Ask your supplier for an invoice that meets that list before the goods leave.',
      ],
    },
    {
      heading: 'What are the steps to import goods into the US?',
      paragraphs: [
        'The order below follows the regulations for a formal entry. A broker will do several of these for you, but each one depends on information you or your supplier provide.',
      ],
      steps: [
        'Check whether another agency regulates the goods and what it requires.',
        'Find the classification and duty rate in the Harmonized Tariff Schedule; CBP makes the final determination.',
        'Agree the Incoterms® rule, and get a commercial invoice and packing list from the seller.',
        'For ocean cargo, make sure the Importer Security Filing is lodged 24 hours before loading abroad.',
        'Arrange a single entry or continuous bond on CBP Form 301.',
        'File the entry documents within 15 calendar days of arrival.',
        'File the entry summary with estimated duties within 10 working days of entry.',
        'Be ready for an examination: CBP may examine any shipment, and the importer bears the costs that go with it.',
      ],
    },
    {
      heading: 'What deadlines apply to a US import?',
      paragraphs: [
        'Three clocks run on most formal entries, and a fourth condition gates release. Missing them costs storage, penalties or both.',
      ],
      table: {
        caption: 'US import deadlines and where each rule lives',
        head: ['Step', 'Deadline or condition', 'Rule'],
        rows: [
          [
            'Importer Security Filing (ocean only)',
            '24 hours before lading at the foreign port',
            '19 CFR 149.2',
          ],
          ['Entry', 'Within 15 calendar days after arrival', '19 CFR 142.2'],
          ['Bond', 'On file before goods are released at entry', '19 CFR 142.4'],
          [
            'Entry summary with estimated duties',
            'Within 10 working days after entry',
            '19 CFR 142.12',
          ],
        ],
      },
    },
    {
      heading: 'How is US import duty worked out?',
      paragraphs: [
        'Duty is the rate in the Harmonized Tariff Schedule for the goods’ classification, applied to their customs value. CBP says the USITC’s tariff database gives an approximate rate, that CBP makes the final determination, and that you can ask for a binding ruling before you import.',
        'The value is normally the transaction value, the price actually paid or payable, which under 19 CFR 152.102 excludes international freight and insurance to the US. The WTO notes that other members add freight and insurance, valuing on a CIF basis, so the same goods can carry a different customs value elsewhere. A landed cost estimate adds the freight, insurance, duty and fees you expect, so you know the cost per unit before you commit.',
      ],
    },
    {
      heading: 'What happens if goods are not entered in time?',
      paragraphs: [
        'Under 19 CFR 127.1, goods not entered within the time allowed, or held because documents are missing or the goods are not correctly invoiced, can be sent to a general order warehouse at the consignee’s risk and expense. Have the broker, bond and documents ready before the goods land.',
      ],
    },
  ],
  faq: [
    {
      q: 'Can I import into the US without a customs broker?',
      a:
        'CBP’s guidance says certain resident importers may file entries on their own behalf, though many first-time importers use a licensed broker. Either way, the importer of record is responsible for the entry.',
    },
    {
      q: 'Do small shipments need a formal entry?',
      a:
        'Not always. Under 19 CFR 143.21, shipments valued at $2,500 or less are generally eligible for informal entry, with exceptions for certain goods. Check the current rules with CBP or your broker for your goods.',
    },
    {
      q: 'Who files the Importer Security Filing?',
      a:
        'The ISF importer or its authorised agent, for cargo arriving by vessel. It is due no later than 24 hours before the cargo is laden aboard the vessel at the foreign port.',
    },
    {
      q: 'What number goes in the importer number field?',
      a:
        'CBP says it is your IRS business registration number or, if you have no registered business, your social security number.',
    },
    {
      q: 'Can I get the duty rate confirmed before I import?',
      a:
        'Yes. CBP issues binding rulings on classification. The USITC tariff database gives an approximate rate, but CBP makes the final determination at entry.',
    },
  ],
  sources: [
    'a4-cbp-importer-tips',
    'w3-cbp-importer-tips',
    'a4-cfr-19-142-3',
    'w3-cbp-19-cfr-142-2',
    'a4-cfr-19-142-4',
    'a4-cfr-19-142-12',
    'a4-cfr-19-149-2',
    'us-cbp-invoice-contents',
    'w3-cbp-duty-rates',
    'w3-cbp-19-cfr-152-102',
    'w3-cbp-19-cfr-127-1',
    'w3-cbp-19-cfr-143-21',
    'wto-customs-valuation',
    'icc-incoterms-2020',
  ],
  primaryTool: '/tools/landed-cost-calculator',
  callout: {
    afterSection: 2,
    tool: '/tools/invoice-generator',
    title: 'Send your supplier an invoice that meets 19 CFR 141.86',
    text:
      'The commercial invoice generator has the fields a US entry relies on: parties, description, quantities, unit prices, currency, origin and the Incoterms® rule.',
  },
  tools: [
    '/tools/landed-cost-calculator',
    '/tools/invoice-generator',
    '/tools/packing-list-generator',
    '/tools/incoterms',
  ],
  related: [
    '/blog/how-to-calculate-import-duty',
    '/guides/landed-cost',
    '/blog/how-long-does-customs-clearance-take',
    '/blog/commercial-invoice-requirements',
    '/guides/how-to-export-from-the-us',
  ],
  cover: {
    id: '6Vg8N8u61aI',
    src: 'https://images.unsplash.com/photo-1571244222371-0b0b60f3c92b',
    width: 4896,
    height: 3264,
    alt:
      'Container ship and stacked shipping containers at the port of Los Angeles, a main US entry point',
    caption: 'Container ship and stacked containers at Los Angeles, California',
    photographer: { name: 'Diego Fernandez', profile: 'https://unsplash.com/@diegitane' },
    page: 'https://unsplash.com/photos/black-and-red-ship-on-body-of-water-at-daytime-6Vg8N8u61aI',
  },
};

export default article;
