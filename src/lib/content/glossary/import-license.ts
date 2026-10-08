import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'import-license',
  term: 'Import license',
  aliases: [
    'import licence',
    'import permit',
    'automatic import licensing',
    'non-automatic import licensing',
  ],
  demand: {
    keyword: 'import license',
    market: 'US',
    volume: 390,
    kd: 28,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'Import license: what it is and who needs one',
  description:
    'What an import license is, the difference between automatic and non-automatic licensing under WTO rules, who applies for it, and why the proforma invoice often comes first.',
  shortDefinition:
    'An import license is a government permission the importer must obtain before particular goods may be imported. The WTO defines import licensing as procedures requiring an application or other documents, beyond those needed for customs, as a prior condition for importation.',
  definition: [
    'Most goods need no license at all; they need only a customs declaration. Licensing applies to specific products a country chooses to watch or limit, and it is always the importing country’s rule, applied to the importer, not the exporter.',
    'The World Trade Organization’s Agreement on Import Licensing Procedures, binding on all members since 1995, splits licenses into two kinds. Automatic licensing is granted in every case and exists to collect statistics or other information; applications may be made on any working day before clearance and are to be approved within ten working days. Non-automatic licensing covers everything else and is used to administer restrictions such as quantitative limits, so a license can be refused or rationed.',
    'The agreement also asks members to publish which products need a license and how to apply, and not to refuse licensed goods over minor variations in value, quantity or weight from the license. Japan, for example, lists hazardous materials, animals, plants and quota items among goods needing a separate import license, and U.S. agencies other than CBP set requirements for particular commodities.',
  ],
  onYourDocuments: [
    'The license is the buyer’s document, but it is usually applied for using yours. The ITA notes that buyers use a proforma invoice to apply for an import license; it should show the product description, quantity, unit and total value, and the seller, so it has to be accurate enough to stand as the basis of the application.',
    'Once issued, the license number may have to appear on the import declaration, and the commercial invoice should match the licensed description and quantity. Ask your buyer for the number and put it in the invoice reference or remarks.',
  ],
  example: {
    caption: 'Worked example with invented parties',
    paragraphs: [
      'Summit Seed Supply (invented) of Idaho quotes a consignment of vegetable seed to an importer abroad. The buyer explains that seed in that country needs an import permit and asks for a proforma invoice listing each variety by weight and value. Summit issues the proforma; the buyer files it with its application and receives a permit about two weeks later.',
      'Summit then ships, quoting the permit number on the commercial invoice, with the same varieties and weights the permit lists.',
    ],
  },
  confusedWith: [
    {
      term: 'Export license',
      difference:
        'An export license is the exporting country’s permission to send controlled items out, applied for by the exporter. An import license is the destination’s permission to bring goods in, applied for by the importer.',
    },
  ],
  related: [
    '/guides/eccn-ear99-export-licence',
    '/guides/how-to-import-into-the-us',
    '/guides/importer-of-record',
    'tariff-rate-quota',
  ],
  tool: '/tools/proforma-invoice-generator',
  toolPitch:
    'The proforma invoice generator produces the itemised quote with descriptions, quantities and values that licensing offices commonly ask the importer to file.',
  faq: [
    {
      q: 'Who applies for an import license, the exporter or the importer?',
      a: 'The importer, in the destination country, because the license is that country’s condition for importation. The exporter usually supports the application with a proforma invoice and product details.',
    },
    {
      q: 'What is the difference between automatic and non-automatic import licensing?',
      a: 'Under WTO rules, an automatic license is granted in all cases and serves to collect information; a non-automatic license administers a restriction such as a quota and can be refused.',
    },
  ],
  sources: [
    'd5-wto-import-licensing',
    'd5-wto-licensing-and-origin',
    'c3-trade-gov-proforma-invoice',
    'trade-gov-ccg-jp',
    'b7-cbp-basic-import-export',
  ],
  regulated: true,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
