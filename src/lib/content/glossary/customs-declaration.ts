import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'customs-declaration',
  term: 'Customs declaration (goods declaration)',
  aliases: [
    'goods declaration',
    'import declaration',
    'export declaration',
    'customs entry',
    'SAD',
  ],
  demand: {
    keyword: 'customs declaration',
    market: 'US',
    volume: 1_000,
    kd: 42,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'Customs declaration: who files it',
  description:
    'What a customs declaration is, who can make one, how it relates to the commercial invoice and packing list, and what it is called in the EU and the United States.',
  shortDefinition:
    'A customs declaration is the statement, made in the form customs prescribes, by which the declarant names the customs procedure to apply to goods, such as import or export, and gives customs the particulars it needs to apply it. It is usually filed electronically.',
  definition: [
    'The World Customs Organization’s Revised Kyoto Convention calls it the goods declaration: a statement made in the manner prescribed by customs, by which the persons concerned indicate the customs procedure to be applied to the goods and furnish the particulars customs requires for its application. The declarant is any person who makes the declaration or in whose name it is made.',
    'The Convention’s standards set the frame most countries follow. Any person with the right to dispose of the goods may act as declarant, under conditions national law sets. Customs prescribes the content and should limit it to the particulars it needs. Declarations and supporting documents may be lodged electronically, and a provisional or incomplete declaration may be accepted if the declarant undertakes to complete it within a set period.',
    'The names differ by country. In the European Union the importer’s declaration is the Single Administrative Document, covering customs duties and VAT; in the United States an import is made on an entry, with the entry summary on CBP Form 7501. In practice a customs broker or forwarder usually files on the importer’s or exporter’s behalf.',
  ],
  onYourDocuments: [
    'The declaration is built from your commercial documents. The commercial invoice supplies the parties, the goods description, the value, the currency and the Incoterms® rule; the packing list supplies the number of packages, marks and weights; the transport document supplies the shipment reference. Customs can ask for these supporting documents, so the figures on the declaration must match them.',
    'Your invoice does not have to show the declaration’s own reference number. Keep the number your broker gives you, such as a declaration reference in the EU or an entry number in the United States, with your shipment file.',
  ],
  example: {
    caption: 'Worked example with invented parties',
    paragraphs: [
      'Pinecrest Audio (invented) ships speakers from the United States to an importer in the Netherlands on DAP terms. The importer’s customs broker lodges the import declaration electronically, using the HS code, the value and currency from Pinecrest’s commercial invoice, and the package count and gross weight from its packing list. Customs accepts the declaration, the importer pays what is due, and the goods are released.',
    ],
  },
  confusedWith: [
    {
      term: 'Commercial invoice',
      difference:
        'The commercial invoice is the seller’s commercial document. The customs declaration is the declarant’s filing with customs, which draws on the invoice as a supporting document.',
    },
    {
      term: 'Entry summary declaration',
      difference:
        'In the EU, an entry summary declaration is a safety and security filing made before goods arrive. The customs declaration places the goods under a procedure such as release for free circulation.',
    },
  ],
  related: [
    '/blog/what-is-customs-clearance',
    '/blog/cbp-form-7501',
    '/guides/eori-number',
    'importing',
    'exporting',
  ],
  tool: '/tools/invoice-generator',
  toolPitch:
    'The commercial invoice generator produces the invoice your broker builds the customs declaration from.',
  faq: [
    {
      q: 'Who makes a customs declaration?',
      a: 'The declarant, which under the Revised Kyoto Convention can be any person with the right to dispose of the goods, within the conditions national law sets. Most businesses appoint a customs broker or forwarder to file for them.',
    },
    {
      q: 'Is a customs declaration the same as a commercial invoice?',
      a: 'No. The invoice is issued by the seller to the buyer. The declaration is filed with customs and uses the invoice, packing list and transport document as supporting documents.',
    },
  ],
  sources: [
    'b1-wco-rkc-definitions',
    'c6-wco-rkc-ch3',
    'trade-gov-ccg-eu',
    'a3-cbp-form-7501',
    'c6-zoll-entry-summary',
  ],
  regulated: false,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
