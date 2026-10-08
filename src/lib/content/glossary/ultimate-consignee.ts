import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'ultimate-consignee',
  term: 'Ultimate consignee',
  aliases: ['ultimate consignee in EEI', 'intermediate consignee', 'end user'],
  demand: {
    keyword: 'ultimate consignee',
    market: 'US',
    volume: 210,
    kd: null,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'Ultimate consignee: meaning in U.S. exports',
  description:
    'Who the ultimate consignee is in a U.S. export, how it differs from the intermediate consignee and the buyer, what the EEI asks for, and how to show the parties on your invoice.',
  shortDefinition:
    'The ultimate consignee is the person located abroad who finally receives an export shipment, as known at the time of export. It may be the foreign buyer or the end user, but never a foreign forwarding agent or intermediate consignee.',
  definition: [
    'The term comes from the Census Bureau’s Foreign Trade Regulations, 15 CFR Part 30, which define the parties reported in the Electronic Export Information (EEI). Section 30.1 separates the person who ends up with the goods from the people who only handle them on the way. The ultimate consignee receives the shipment; an intermediate consignee is a party abroad, often a foreign forwarding agent, that takes physical possession of the goods only to deliver them to the ultimate consignee.',
    'The ultimate consignee is often, but not always, the foreign principal party in interest, the buyer. When the seller knows the end user and when it will receive the goods, the end user is the ultimate consignee. When the buyer is a distributor holding the goods in stock and the end user is not known, the buyer is the ultimate consignee.',
    'The EEI asks for the ultimate consignee’s name and address and for its type, the business function that applies most often: direct consumer, government entity, reseller or other. Export controls care about the same party, because the end user and end use can decide whether a licence is needed.',
  ],
  onYourDocuments: [
    'On the commercial invoice the ultimate consignee is usually the consignee, or a ship-to party shown beside a different buyer. If the goods pass through a foreign forwarder or a consolidator abroad, show that party separately as notify party or intermediate consignee, not in the consignee box.',
    'Give your forwarder the ultimate consignee’s full name, street address and type with the invoice, because those go into the EEI and should match the consignee on the bill of lading or air waybill.',
  ],
  example: {
    caption: 'Worked example with invented parties',
    paragraphs: [
      'Lone Star Lab Supply (invented) of Texas sells centrifuges to a distributor in Singapore, which has already resold them to a university hospital in Kuala Lumpur and asks for direct delivery. Lone Star knows the end user and the delivery, so the hospital is the ultimate consignee; the Singapore distributor remains the buyer, the FPPI.',
      'A Malaysian forwarder clears and delivers the goods. It is the intermediate consignee, shown as notify party, not as consignee, on Lone Star’s invoice.',
    ],
  },
  confusedWith: [
    {
      term: 'Consignee on the bill of lading',
      difference:
        'The bill of lading consignee is whoever the carrier delivers to, which can be a forwarder or a bank. The ultimate consignee is the party abroad that finally receives the goods, reported in the EEI.',
    },
  ],
  related: [
    'usppi',
    '/guides/shipper-consignee-notify-party',
    '/guides/eei-aes-filing-itn',
    'consignor',
  ],
  tool: '/tools/invoice-generator',
  toolPitch:
    'The commercial invoice generator keeps the buyer, the consignee and the notify party in separate boxes, so the ultimate consignee your forwarder reports is the one your invoice names.',
  faq: [
    {
      q: 'Is the ultimate consignee the same as the buyer?',
      a: 'Often, but not always. The ultimate consignee is the party abroad that finally receives the goods. If the buyer is a reseller shipping to a known end user, the end user is the ultimate consignee.',
    },
    {
      q: 'What is an intermediate consignee?',
      a: 'A party abroad, such as a foreign forwarding agent, that takes physical possession of the goods only to deliver them to the ultimate consignee. It is reported separately in the EEI and is never the ultimate consignee.',
    },
  ],
  sources: ['w5-ftr-30-1', 'w5-ftr-30-6', 'c6-ftr-30-1-parties', 'a5-bis-license-needed'],
  regulated: false,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
