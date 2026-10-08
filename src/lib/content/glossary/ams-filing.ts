import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'ams-filing',
  term: 'AMS filing (Automated Manifest System)',
  abbreviation: 'AMS',
  aliases: [
    'AMS',
    'Automated Manifest System',
    'AMS manifest',
    '24-hour rule',
    'advance cargo declaration',
  ],
  demand: {
    keyword: 'ams filing',
    market: 'US',
    volume: 110,
    kd: 29,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'AMS filing: the U.S. cargo manifest rule',
  description:
    'What an AMS filing is, who transmits it for ocean and air cargo bound for the United States, the 24-hour rule before loading, and which shipment details come from your packing list.',
  shortDefinition:
    'An AMS filing is the electronic cargo declaration a carrier or NVOCC sends to U.S. Customs and Border Protection through the Automated Manifest System. For ocean cargo it must reach CBP 24 hours before the goods are loaded on the vessel abroad.',
  definition: [
    'The rule for ocean cargo is 19 CFR 4.7. Every vessel arriving in the United States carries a manifest that includes a Cargo Declaration, CBP Form 1302. CBP must receive the electronic equivalent of that declaration from the incoming carrier 24 hours before the cargo is laden aboard the vessel at the foreign port, sent through AMS or another system CBP approves. Bulk cargo and some break-bulk cargo are exempt from the 24-hour timing.',
    'The carrier is not always the only filer. An NVOCC licensed by or registered with the Federal Maritime Commission, holding an international carrier bond, may transmit the declaration for its own house bills directly to CBP; otherwise it must give the full details to the vessel carrier to file. A freight forwarder that is not an NVOCC does not file for itself.',
    'Air cargo uses the AMS air module. The incoming air carrier transmits the master air waybill and the house air waybills for a consolidation, unless a deconsolidator or other authorized party sends the house details itself.',
  ],
  onYourDocuments: [
    'You do not file AMS as a shipper, but the filing is built from your documents. Under 19 CFR 4.7a the declaration carries a precise cargo description, the quantity and weight, the shipper’s and consignee’s names and addresses, and container and seal numbers, which the carrier or NVOCC takes from the bill of lading and so from the booking details you supplied off your packing list and invoice.',
    'Give your forwarder those details before the cut-off, not at the port. Generic descriptions such as FAK, general cargo or said to contain are not acceptable, so describe the goods as specifically on the packing list as you do on the invoice.',
  ],
  example: {
    caption: 'Worked example with invented parties',
    paragraphs: [
      'Brightwater Ceramics (invented) books a 40-foot container from Valencia to a buyer in Savannah through an NVOCC. The NVOCC issues its house bill of lading and transmits its own AMS filing for that house bill, using Brightwater’s packing list: 18 pallets of glazed floor tiles, the gross weight and the consignee’s name.',
      'The vessel loads two days later, after the 24-hour window has passed, and the ocean carrier’s master bill filing lists the NVOCC as shipper.',
    ],
  },
  confusedWith: [
    {
      term: 'ISF (10+2)',
      difference:
        'The Importer Security Filing is the importer’s own advance filing for cargo arriving by vessel. AMS is the carrier’s or NVOCC’s manifest filing for the same voyage.',
    },
    {
      term: 'ICS2',
      difference:
        'ICS2 is the European Union’s advance cargo information system. AMS covers cargo arriving in the United States.',
    },
  ],
  related: ['/guides/isf-10-2', 'nvocc', 'shipping-manifest', '/blog/mawb-vs-hawb', 'ics2'],
  tool: '/tools/packing-list-generator',
  toolPitch:
    'The packing list generator gives your forwarder the package count, kind, weights and descriptions the AMS filing is built from, in one consistent document.',
  faq: [
    {
      q: 'Who files AMS for ocean cargo?',
      a: 'The incoming vessel carrier, or an NVOCC licensed by or registered with the FMC that holds an international carrier bond and files for its own house bills. The shipper does not file.',
    },
    {
      q: 'What is the 24-hour rule?',
      a: 'CBP must receive the electronic cargo declaration for ocean cargo 24 hours before the cargo is loaded aboard the vessel at the foreign port, under 19 CFR 4.7. Bulk and some break-bulk cargo are exempt.',
    },
  ],
  sources: ['e5-cfr-19-4-7', 'e5-cfr-19-4-7a', 'b1-cbp-ams-air-features', 'a1-cbp-isf', 'd5-ec-ics2'],
  regulated: true,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
