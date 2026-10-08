import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'exporting',
  term: 'Exporting',
  aliases: ['export', 'what is exporting', 'export meaning', 'exporter'],
  demand: {
    keyword: 'what is exporting',
    market: 'US',
    volume: 3_600,
    kd: 12,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'What is exporting? Meaning and documents',
  description:
    'What exporting means in trade and in U.S. regulations, who the exporter is on a shipment, and which documents an export usually needs.',
  shortDefinition:
    'Exporting is sending or transporting goods out of a country to a buyer or recipient abroad. The exporter, usually the seller, prepares the commercial documents, and the shipment may need an export filing or licence depending on the goods and destination.',
  definition: [
    'The plain meaning is also the regulatory one. The U.S. Foreign Trade Regulations define export as to send or transport goods out of a country. The Export Administration Regulations go further for controlled items: an export includes an actual shipment or transmission out of the United States in any manner, and releasing controlled technology or source code to a foreign person inside the country counts as a deemed export.',
    'An export has a party who benefits from it. In U.S. export reporting that is the U.S. principal party in interest (USPPI), the person in the United States that receives the primary benefit, monetary or otherwise, from the transaction. It is usually the seller, and it stays responsible for its export information even when a forwarder files it.',
    'For a business, exporting is a sale with extra steps: agreeing the Incoterms® rule and payment, checking whether the item needs a licence for that destination and end user, and producing documents that agree with each other from the quotation to the transport document.',
  ],
  onYourDocuments: [
    'The exporter appears as seller or shipper. On the commercial invoice it is the seller, with its full name and address; on the bill of lading or air waybill it is usually the shipper or consignor; and in a U.S. export filing it is the USPPI.',
    'A typical export uses a proforma invoice, a commercial invoice, a packing list and the transport document, plus an Electronic Export Information filing in AES when a mandatory filing requirement applies. The ITA warns that discrepancies between these documents can cause delays, nonpayment or seizure.',
  ],
  example: {
    caption: 'Worked example with invented parties',
    paragraphs: [
      'Fernhill Instruments (invented), in Ohio, sells pressure gauges to a distributor in Chile. Fernhill is the exporter: it issues the invoice, books the freight through a forwarder and confirms the gauges need no licence for the buyer and end use.',
    ],
    table: {
      caption: 'Invented example: where the exporter appears',
      head: ['Document', 'Fernhill appears as'],
      rows: [
        ['Proforma and commercial invoice', 'Seller'],
        ['Packing list', 'Shipper'],
        ['Bill of lading', 'Shipper (consignor)'],
        ['Electronic Export Information', 'USPPI'],
      ],
    },
  },
  confusedWith: [
    {
      term: 'Importing',
      difference:
        'Exporting is the outbound side of the same sale. The buyer’s country treats the shipment as an import, with its own declaration, importer and charges.',
    },
  ],
  related: [
    '/guides/how-to-export-from-the-us',
    '/blog/export-documents-checklist',
    '/guides/eei-aes-filing-itn',
    'consignor',
  ],
  tool: '/tools/invoice-generator',
  toolPitch:
    'The invoice generator produces the export commercial invoice, and the packing list follows from the same record so the documents agree.',
  faq: [
    {
      q: 'What documents do I need to export?',
      a: 'Usually a commercial invoice, a packing list and the transport document, with a proforma invoice before the sale. A U.S. export also needs an EEI filing in AES when a mandatory filing requirement applies, and some goods need a licence. The destination may ask for more.',
    },
    {
      q: 'Who is the exporter if a freight forwarder ships the goods?',
      a: 'The seller usually remains the exporter. The forwarder acts as its agent, and the ITA notes that the exporter stays responsible for the accuracy of documents the forwarder prepares.',
    },
  ],
  sources: [
    'b7-ftr-30-1-export',
    'b7-ear-734-13',
    'trade-gov-export-documents',
    'w4-trade-gov-export-transaction',
    'a5-bis-license-needed',
  ],
  regulated: false,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
