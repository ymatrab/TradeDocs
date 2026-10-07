import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-07';

const term: GlossaryTerm = {
  slug: 'consignor',
  term: 'Consignor',
  aliases: ['shipper', 'sender'],
  demand: {
    keyword: 'consignor',
    market: 'US',
    volume: 2_900,
    kd: 35,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'Consignor: meaning, and consignor vs consignee',
  description:
    'Who the consignor is in a shipment, how it differs from the consignee and the seller, and where the consignor goes on the invoice and transport documents.',
  shortDefinition:
    'The consignor is the party that hands goods to a carrier for shipment and is named on the transport document as the one they were received from. It is usually the seller or exporter, also called the shipper. The consignee is the party they are delivered to.',
  definition: [
    'In U.S. commercial law the definition is short. The Uniform Commercial Code, section 7-102, defines a consignor as a person named in a bill of lading as the person from which the goods have been received for shipment, and a consignee as a person named in a bill of lading to which or to whose order the bill promises delivery. The carrier is the person that issues the bill.',
    'In everyday trade, consignor and shipper mean the same party, and it is normally the seller. It need not be. A seller can have a factory or a third-party warehouse send the goods, and under some Incoterms rules the buyer’s forwarder books the transport. What makes a party the consignor is that the carrier received the goods from it and the transport document names it.',
    'The word also has a separate meaning in retail, where a consignor places goods with a shop that sells them on its behalf. That sense has nothing to do with transport documents.',
  ],
  onYourDocuments: [
    'On the commercial invoice the consignor usually appears as the seller or exporter, with its full name and address, and sometimes in a separate “shipper” box when the goods leave from a different site. On the packing list it is the same party. On the bill of lading, sea waybill or air waybill it is the shipper box at the top left.',
    'Keep the consignor’s name and address identical across the set. A trading name on the invoice and a legal name on the bill of lading is one of the small differences that prompt questions from a bank or customs.',
  ],
  example: {
    caption: 'Worked example with invented parties',
    paragraphs: [
      'Oakmere Textiles Ltd (invented) sells 400 cartons of towels to Bayview Retail (invented). The goods leave from Oakmere’s contract warehouse, Dockside Logistics (invented).',
    ],
    table: {
      caption: 'Invented example: who is who',
      head: ['Role', 'Party', 'Where it appears'],
      rows: [
        ['Seller / exporter', 'Oakmere Textiles Ltd', 'Commercial invoice'],
        ['Consignor (shipper)', 'Oakmere Textiles Ltd, c/o Dockside Logistics', 'Bill of lading shipper box'],
        ['Consignee', 'Bayview Retail', 'Invoice, packing list and bill of lading'],
      ],
    },
  },
  confusedWith: [
    {
      term: 'Consignee',
      difference:
        'The consignor sends the goods; the consignee is the party the carrier delivers them to.',
    },
    {
      term: 'Exporter',
      difference:
        'The exporter is the party responsible for the export in customs terms; it is often, but not always, the consignor.',
    },
  ],
  related: ['waybill', '/guides/shipper-consignee-notify-party', '/guides/what-is-a-bill-of-lading'],
  tool: '/tools/invoice-generator',
  toolPitch:
    'The commercial invoice generator puts the seller, consignee and shipping details in the boxes customs and carriers look for.',
  faq: [
    {
      q: 'What is the difference between consignor and consignee?',
      a: 'The consignor hands the goods to the carrier and is named as the party they were received from; the consignee is the party the carrier delivers them to. In a sale they are usually the seller and the buyer.',
    },
    {
      q: 'Is the consignor the same as the shipper?',
      a: 'In transport documents, yes: the shipper box on a bill of lading or air waybill names the consignor. It is usually the seller, but can be a warehouse or another party sending on the seller’s behalf.',
    },
  ],
  sources: ['cornell-ucc-7-102', 'w4-cornell-ucc-1-201'],
  regulated: false,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
