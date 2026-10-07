import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-07';

const term: GlossaryTerm = {
  slug: 'waybill',
  term: 'Waybill',
  aliases: ['sea waybill', 'air waybill (AWB)'],
  demand: {
    keyword: 'waybill',
    market: 'US',
    volume: 5_400,
    kd: null,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'Waybill: meaning, sea waybill vs bill of lading',
  description:
    'What a waybill is, how a sea waybill and an air waybill work, why neither is a document of title, and when a bill of lading is still needed.',
  shortDefinition:
    'A waybill is a transport document issued by the carrier that records the goods, the shipper and the consignee and evidences the contract of carriage. Unlike a bill of lading it is not a document of title: the named consignee collects the goods without presenting an original.',
  definition: [
    'Waybill is the general name for the carrier’s document that travels with, or is sent ahead of, a consignment. The two you meet in export are the sea waybill and the air waybill.',
    'A sea waybill is an alternative to the ocean bill of lading. The Digital Container Shipping Association describes it as non-negotiable: it cannot be used to transfer title, it is not a document of title and it only confirms receipt. No original is needed to release the cargo, so the consignee named on it takes delivery once it identifies itself, which avoids couriering paper originals.',
    'An air waybill (AWB) is the standard air cargo document. IATA describes it as constituting the contract of carriage between the shipper and the airline, and IATA Resolution 672 lets airlines and shippers use an electronic air waybill in place of the paper one.',
    'The difference matters when you are paid. A negotiable bill of lading, as a document of title, lets a seller or a bank hold the goods until the buyer pays. With a waybill, control passes to the named consignee, so it suits shipments between related companies, open-account trade with a trusted buyer, or goods already paid for. The same caution applies to an air waybill, which names the consignee the airline delivers to.',
  ],
  onYourDocuments: [
    'The waybill repeats information from your commercial invoice and packing list: the shipper and consignee, the description of the goods, the number of packages, the gross weight and the marks. Those figures should match across all three, because a mismatch is a question at the border.',
    'The waybill number is the reference the carrier, the consignee and customs use to track and clear the shipment, so it is worth adding to the packing list or the shipment record once it is issued.',
  ],
  example: {
    caption: 'Worked example with invented parties',
    paragraphs: [
      'Pinecrest Foods (invented) ships a container of sauces each month to its own subsidiary abroad. Payment is between group companies, so nobody needs the goods held against payment. The forwarder books it on a sea waybill naming the subsidiary as consignee, and the subsidiary collects the container on arrival without waiting for paper originals.',
      'When Pinecrest sells to a new distributor on a letter of credit, it switches to a negotiable bill of lading, the document of title the letter of credit calls for.',
    ],
  },
  confusedWith: [
    {
      term: 'Bill of lading',
      difference:
        'A negotiable bill of lading is a document of title and must be presented to collect the goods; a waybill is not, and needs no original.',
    },
    {
      term: 'Air waybill vs sea waybill',
      difference:
        'Both are carrier documents naming a consignee; one is issued for air cargo, the other by an ocean carrier as an alternative to the bill of lading.',
    },
  ],
  related: ['consignor', '/guides/what-is-a-bill-of-lading', '/guides/shipper-consignee-notify-party'],
  tool: '/tools/packing-list-generator',
  toolPitch:
    'The packing list generator gives you the package count, gross weight and marks the waybill has to repeat.',
  faq: [
    {
      q: 'Is a waybill the same as a bill of lading?',
      a: 'No. Both are carrier documents for the same shipment, but a negotiable bill of lading is a document of title that has to be presented to collect the goods. A sea waybill is non-negotiable and the named consignee takes delivery without an original.',
    },
    {
      q: 'Who issues the waybill?',
      a: 'The carrier, or a forwarder acting as carrier: an ocean line issues a sea waybill and an airline, or its agent, an air waybill. The shipper provides the details it is issued from.',
    },
  ],
  sources: ['dcsa-sea-waybill', 'iata-air-waybill', 'w4-cornell-ucc-1-201'],
  regulated: false,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
