import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'exporter-of-record',
  term: 'Exporter of record',
  aliases: ['EOR', 'exporter', 'exporter of record meaning', 'export declarant'],
  demand: {
    keyword: 'exporter of record',
    market: 'US',
    volume: 140,
    kd: null,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'Exporter of record: who it is in an export',
  description:
    'What exporter of record means, why U.S. rules speak of the exporter and the USPPI instead, who that is in a normal and a routed export, and where the exporter appears on your documents.',
  shortDefinition:
    'Exporter of record is the everyday name for the party legally responsible for an export: the one named as exporter on the export filing. U.S. rules do not use the phrase; they define the exporter and the U.S. principal party in interest.',
  definition: [
    'Traders borrow the phrase from importer of record, the party responsible for an import entry. On the export side U.S. regulations use two other terms. The Export Administration Regulations, in 15 CFR 772.1, define the exporter as the person in the United States who has the authority of a principal party in interest to determine and control the sending of items out of the country. The Census Bureau’s Foreign Trade Regulations, in 15 CFR 30.1, define the U.S. principal party in interest (USPPI) as the person in the United States that receives the primary benefit of the export, and the filer as the USPPI or its authorized agent who submits the Electronic Export Information.',
    'In most sales the same company is all three: the U.S. seller is the USPPI, controls the shipment, and appears as exporter on the invoice. A freight forwarder that files for you is an authorized agent, not the exporter of record. In a routed export transaction the foreign buyer’s U.S. agent arranges the shipment and files, while the seller remains the USPPI.',
    'Elsewhere the idea is the person in whose name the export declaration is made. In the United Kingdom, for example, an exporter in England, Wales or Scotland needs an EORI number starting with GB and makes the export declaration itself or hires someone to make it.',
  ],
  onYourDocuments: [
    'The commercial invoice and packing list name the seller or exporter, usually with the address the goods ship from. That name should match the USPPI on the EEI, so the forwarder can file without asking who the exporter really is.',
    'If someone else ships for you, such as a contract manufacturer or a fulfilment warehouse, list it as the ship-from or consignor and keep your company as the exporter, so the documents show who sold the goods.',
  ],
  example: {
    caption: 'Worked example with invented parties',
    paragraphs: [
      'Copperline Audio (invented), a speaker maker in Oregon, sells 40 amplifiers to a retailer in Japan on FCA terms. Copperline’s invoice names it as exporter, and its forwarder files the EEI under a written authorization with Copperline as USPPI. Asked who the exporter of record is, everyone points to Copperline.',
      'On the next order the Japanese retailer appoints its own U.S. forwarder to arrange and file the export. That is a routed export transaction: the buyer’s agent files, but Copperline is still the USPPI and supplies the export information.',
    ],
  },
  confusedWith: [
    {
      term: 'Importer of record',
      difference:
        'The importer of record is the party responsible for the import entry and duty in the country of arrival. The exporter of record is responsible on the departure side, and they are often different companies.',
    },
    {
      term: 'Shipper',
      difference:
        'The shipper is the party named on the bill of lading as handing goods to the carrier. It is often the exporter, but a forwarder or warehouse can be shipper while the seller stays the exporter.',
    },
  ],
  related: [
    'usppi',
    'routed-export-transaction',
    '/guides/importer-of-record',
    '/guides/eei-aes-filing-itn',
  ],
  tool: '/tools/invoice-generator',
  toolPitch:
    'The commercial invoice generator puts the exporter’s name and address in the seller block, which is where your forwarder looks for the USPPI details.',
  faq: [
    {
      q: 'Is the exporter of record the same as the USPPI?',
      a: 'Usually, yes. U.S. rules do not use the phrase exporter of record; in most sales the party people mean is the U.S. seller, which is the USPPI. A forwarder filing for you is your authorized agent, not the exporter.',
    },
    {
      q: 'Can a freight forwarder be the exporter of record?',
      a: 'Not just by filing. Under the Export Administration Regulations the forwarding or other agent is in most cases not a principal party in interest, so the forwarder acts for the exporter rather than being it.',
    },
  ],
  sources: ['e5-ear-772-1', 'c6-ftr-30-1-parties', 'w5-ftr-30-3', 'b7-gov-uk-export-goods'],
  regulated: true,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
