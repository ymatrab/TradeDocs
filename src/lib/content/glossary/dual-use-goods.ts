import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'dual-use-goods',
  term: 'Dual-use goods',
  aliases: ['dual-use items', 'dual use goods', 'dual-use exports', 'dual-use export controls'],
  demand: {
    keyword: 'dual use goods',
    market: 'US',
    volume: 170,
    kd: 17,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'Dual-use goods: meaning and export controls',
  description:
    'What dual-use goods are, where the EU, US and UK control lists and licences live, and what an exporter puts on the invoice. No item is classified here.',
  shortDefinition:
    'Dual-use goods are items, including software and technology, that can be used for both civil and military purposes. Export controls decide whether they need a licence, based on the item, its destination, the end user and the end use.',
  definition: [
    'In the European Union the term is defined by Regulation (EU) 2021/821, Article 2(1): items, including software and technology, which can be used for both civil and military purposes. Exporting an item on the regulation’s Annex I list needs an authorisation, granted by the competent authority of the Member State where the exporter is established. Article 4 adds a catch-all for items that are not listed: a licence is needed when the authority tells the exporter of a sensitive end use, and an exporter that knows of one must notify it.',
    'In the United States the Export Administration Regulations describe a dual-use item as one with civil uses as well as terrorism, military or weapons-related uses, but the EAR are wider than that: they also cover purely civilian items. Whether a licence is needed depends on the item’s classification, the destination, the end user and the end use. The United Kingdom runs its own dual-use controls through the Export Control Joint Unit.',
    'Being dual-use is a legal status, not a description of the product. Only the control lists and the authority decide it, and this page does not say whether any goods are controlled.',
  ],
  onYourDocuments: [
    'There is no dual-use box on a commercial invoice. What the documents carry is the result of the exporter’s classification: in a U.S. export of items on the Commerce Control List, the EAR require a destination control statement on the commercial invoice, and some items must also show their ECCN.',
    'In the EU and UK, the licence or general authorisation is quoted on the export declaration. Keep the invoice description precise enough for the forwarder to match the goods to the licence, and keep the classification record with the shipment file.',
  ],
  example: {
    caption: 'Worked example with invented parties; no real item is classified',
    paragraphs: [
      'Lindqvist Sensors AB (invented), a Swedish manufacturer, gets an order from a distributor outside the EU. Its compliance officer checks the product against Annex I of Regulation 2021/821 and finds a listed entry, so the company applies to the Swedish competent authority for an individual licence before shipping. The licence reference goes on the export declaration and the invoice describes the goods exactly as the licence does.',
      'A second order for an unlisted product is screened too. Nothing suggests a sensitive end use and the authority has not contacted the company, so no licence is needed under the catch-all.',
    ],
  },
  confusedWith: [
    {
      term: 'Military goods',
      difference:
        'Goods designed for military use sit on separate military lists with their own licences. Dual-use controls cover items with civil uses that could also serve military or weapons purposes.',
    },
    {
      term: 'Import licence',
      difference:
        'Dual-use licences are export controls granted by the exporter’s authority. An import licence is required by the destination country before goods may enter.',
    },
  ],
  related: [
    '/guides/eccn-ear99-export-licence',
    '/blog/uk-export-licence',
    '/blog/export-compliance-checklist',
    'import-license',
    're-export',
  ],
  tool: '/tools/invoice-generator',
  toolPitch:
    'The commercial invoice generator gives each line a full description field, so the goods on the invoice can match the wording of your licence.',
  faq: [
    {
      q: 'Who decides whether goods are dual-use?',
      a: 'The control lists do, applied by the exporter. In the EU the list is Annex I of Regulation 2021/821 and the national competent authority grants licences; in the U.S. it is the Commerce Control List under the EAR. Ask the authority if you are unsure.',
    },
    {
      q: 'Can unlisted goods still need a dual-use licence?',
      a: 'Yes. Under Article 4 of the EU regulation, an authority can require a licence for unlisted items with a sensitive end use, and U.S. end-use and end-user controls work in a similar way.',
    },
  ],
  sources: [
    'e6-eu-reg-2021-821',
    'e6-ec-dual-use-exporting',
    'e6-ear-730-3',
    'a5-bis-license-needed',
    'a5-ear-758-6',
    'd4-gov-uk-dual-use-controls',
  ],
  regulated: true,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
