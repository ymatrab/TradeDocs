import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 're-export',
  term: 'Re-export',
  aliases: ['reexport', 're-exportation', 'foreign goods export'],
  demand: {
    keyword: 're export',
    market: 'US',
    volume: 390,
    kd: null,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'Re-export meaning in customs and export controls',
  description:
    'What re-export means in customs and in U.S. export controls, how it differs from transshipment, why origin stays the same, and what the invoice should say about where goods were made.',
  shortDefinition:
    'A re-export is the export of goods that were previously imported, without being transformed into something new. In U.S. export controls the word has a wider meaning: shipping an item subject to the EAR from one foreign country to another.',
  definition: [
    'In customs practice, re-export describes goods that come into a country and leave it again: unsold stock sent back or on to another market, samples and exhibition goods returning home, or imports resold abroad. Several customs regimes are built on it. Temporary admission, the subject of the WCO’s Istanbul Convention and the ATA carnet, relieves goods from duty on condition that they are re-exported within a set time, and U.S. drawback refunds certain duties paid on imports that are later exported or destroyed.',
    'U.S. export controls use the word differently. Under 15 CFR 734.14 of the Export Administration Regulations, a reexport is an actual shipment or transmission of an item subject to the EAR from one foreign country to another. A U.S.-made machine sold to Mexico and then resold to Brazil is reexported from Mexico, and EAR licence requirements can follow it there. Shipping through a country on the way to a destination counts as a reexport to that destination.',
    'Either way, re-exporting does not change where the goods were made. Their origin stays that of the country of manufacture.',
  ],
  onYourDocuments: [
    'An invoice for re-exported goods must not make them look as if they were made where they are shipped from. Show the real country of origin for each line, which may differ from the country of export, and describe the goods exactly as they were imported if they are unchanged.',
    'Where the re-export settles an earlier procedure, such as temporary admission, a carnet or drawback, the broker will need the import entry or carnet reference, so keep it with the shipment file and quote it in the invoice remarks.',
  ],
  example: {
    caption: 'Worked example with invented parties',
    paragraphs: [
      'Coastline Marine Supply (invented) in Florida imports German-made outboard motor parts, then sells part of the stock to a boatyard in Panama without opening the cartons. Its commercial invoice to Panama names Coastline as seller, the United States as country of export and Germany as country of origin for each line.',
      'Because the parts were imported and duty was paid, Coastline asks its broker whether the export qualifies for drawback, and keeps the import entry number on file.',
    ],
  },
  confusedWith: [
    {
      term: 'Transshipment',
      difference:
        'Transshipment moves goods from one means of transport to another under customs control without importing them. A re-export follows an import, or in EAR terms any onward shipment between foreign countries.',
    },
  ],
  related: [
    '/guides/duty-drawback',
    '/guides/ata-carnet',
    'transshipment',
    '/guides/eccn-ear99-export-licence',
  ],
  tool: '/tools/invoice-generator',
  toolPitch:
    'The commercial invoice generator records the country of origin line by line, so goods made elsewhere are not presented as made where you ship them from.',
  faq: [
    {
      q: 'Does a re-export change the country of origin?',
      a: 'No. If the goods leave in the same state they arrived, their origin remains the country where they were made, and the invoice should say so even though the country of export is different.',
    },
    {
      q: 'What is a reexport under the EAR?',
      a: 'A shipment or transmission of an item subject to the Export Administration Regulations from one foreign country to another. Licence requirements can apply to it even though the goods never return to the United States.',
    },
  ],
  sources: [
    'd5-ear-734-14',
    'c8-wco-istanbul-convention',
    'c2-cbp-drawback-overview',
    'b7-wco-rkc-transhipment',
    'd5-revenue-new-to-customs',
  ],
  regulated: true,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
