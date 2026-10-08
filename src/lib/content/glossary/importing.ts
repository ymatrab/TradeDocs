import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'importing',
  term: 'Importing',
  aliases: ['import', 'what is importing', 'import meaning', 'importer'],
  demand: {
    keyword: 'what is importing',
    market: 'US',
    volume: 3_600,
    kd: 12,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'What is importing? Meaning, importer and entry',
  description:
    'What importing means, who the importer of record is, what customs entry involves and which documents an import into the United States is built on.',
  shortDefinition:
    'Importing is bringing goods into a country from abroad and clearing them through its customs. The importer of record declares the goods, their value and classification, pays what is due and answers to customs for the accuracy of the entry.',
  definition: [
    'Goods crossing a border are not simply delivered: they stay under customs control until someone makes entry. In the United States, CBP defines entry as the filing that secures release of the goods from its custody, and the entry summary as the filing that lets it assess duties and collect statistics.',
    'The party who makes entry is the importer of record. Under U.S. law that is the owner or purchaser of the goods, or a licensed customs broker it designates, and it must use reasonable care to declare the value, classification and rate of duty. CBP itself does not require an importer to hold a licence or permit, although other agencies may for particular goods, and its entry forms ask for an importer number: an IRS business registration number or, without one, a Social Security number.',
    'Many first-time importers hire a licensed customs broker. The broker files, but CBP is clear that the importer of record remains ultimately responsible for the entry documentation and for the duties, taxes and fees.',
  ],
  onYourDocuments: [
    'The importer appears as buyer or consignee on the commercial invoice and transport document, and as importer of record on the entry. U.S. entry documents include CBP Form 3461 or its electronic equivalent, evidence of the right to make entry, the commercial invoice and, where appropriate, a packing list.',
    'Because the entry is built from the seller’s invoice, an import depends on the export paperwork being right: descriptions precise enough to classify, values in the currency of the sale, and quantities that match the packing list.',
  ],
  example: {
    caption: 'Worked example with invented parties',
    paragraphs: [
      'Canyon Ridge Outfitters (invented), in Colorado, buys backpacks from a maker in Vietnam on FOB terms. Canyon Ridge is the importer of record and appoints a customs broker, who files the entry from the supplier’s commercial invoice and packing list.',
    ],
    table: {
      caption: 'Invented example: who does what on the import',
      head: ['Party', 'Role'],
      rows: [
        ['Vietnamese maker', 'Seller and exporter; issues the invoice and packing list'],
        ['Canyon Ridge Outfitters', 'Buyer, consignee and importer of record'],
        ['Customs broker', 'Files the entry for Canyon Ridge'],
      ],
    },
  },
  confusedWith: [
    {
      term: 'Exporting',
      difference:
        'Exporting is the outbound side of the same sale, with its own filings in the seller’s country.',
    },
  ],
  related: ['/guides/how-to-import-into-the-us', '/guides/importer-of-record', '/guides/landed-cost', 'consignor'],
  tool: '/tools/landed-cost-calculator',
  toolPitch:
    'The landed cost calculator adds freight, insurance and the charges you enter to the goods value, so you can price an import before you order.',
  faq: [
    {
      q: 'Do I need a licence to import into the United States?',
      a: 'CBP does not require an importer to hold a licence or permit. Other federal agencies may require one for particular goods, and your state or city may require a business licence.',
    },
    {
      q: 'Do I need a customs broker to import?',
      a: 'No. You can make entry yourself, although many first-time importers use a licensed customs broker. Either way, the importer of record remains responsible for the entry and for what is owed.',
    },
  ],
  sources: [
    'a3-ecfr-19-cfr-141-0a',
    'a5-usc-19-1484',
    'a4-cbp-importer-tips',
    'w2-cbp-importer-tips',
    'a3-ecfr-19-cfr-142-3',
  ],
  regulated: false,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
