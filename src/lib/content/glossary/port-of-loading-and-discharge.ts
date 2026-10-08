import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-09';

const term: GlossaryTerm = {
  slug: 'port-of-loading-and-discharge',
  term: 'Port of loading and port of discharge',
  abbreviation: 'POL / POD',
  aliases: [
    'port of loading',
    'port of discharge',
    'POL',
    'POD',
    'port of lading',
    'port of unlading',
  ],
  demand: {
    keyword: 'port of discharge',
    market: 'US',
    volume: 170,
    kd: null,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'Port of loading and port of discharge',
  description:
    'What the port of loading and port of discharge mean on an invoice and bill of lading, how they differ from the place of receipt and final destination, and how ports are coded.',
  shortDefinition:
    'The port of loading is the port where goods are loaded onto the main vessel or aircraft; the port of discharge is the port where they are unloaded from it. Together they mark the main sea or air leg of a shipment.',
  definition: [
    'The two ports bracket the main carriage. Goods may be collected inland at a place of receipt and delivered beyond the port to a place of delivery, but the port of loading (POL) and port of discharge (POD) are the points where they go on and come off the ocean vessel or aircraft. U.S. regulations use the older words lading and unlading for the same thing.',
    'Authorities ask for both. CBP’s inward manifest rule lists cargo by U.S. port of discharge and reports the foreign port where the cargo was laden on board. For exports, the Foreign Trade Regulations ask for the port of export, the U.S. seaport or airport where the goods are loaded on the carrier leaving the country, and the foreign port of unlading, where they are removed from that conveyance. That port does not have to be in the country of ultimate destination.',
    'Ports are usually written with a UN/LOCODE, a five-character code with two letters for the country from ISO 3166 and three for the location, such as NOOSL for Oslo. U.S. export filings use CBP’s Schedule D for U.S. ports and Schedule K for foreign ports instead.',
  ],
  onYourDocuments: [
    'The bill of lading and sea waybill carry both ports in their own boxes, usually beside the vessel and voyage. Many commercial invoices and packing lists repeat them, and some importing countries and letters of credit expect the invoice ports to match the transport document exactly.',
    'Write the port, not just the country, and use the same spelling or code on every document. If the goods will be transshipped, the port of discharge is still the port where they leave the last vessel, not the hub where they change ships.',
  ],
  example: {
    caption: 'Worked example with an invented exporter and route',
    paragraphs: [
      'Cobaltline Pumps (invented) sells to a buyer in Prague on CIF Hamburg terms. The goods are trucked from its factory in Ohio to Norfolk and loaded on a vessel there; they are unloaded in Hamburg and railed on to Prague.',
      'The invoice and bill of lading show Norfolk as port of loading and Hamburg as port of discharge, with Prague as place of delivery. The EEI reports Norfolk as port of export and Hamburg as foreign port of unlading, while the country of ultimate destination is the Czech Republic.',
    ],
  },
  confusedWith: [
    {
      term: 'Place of receipt and place of delivery',
      difference:
        'These are where the carrier takes and hands over the goods, which may be inland. The ports of loading and discharge are only the ends of the main sea or air leg.',
    },
    {
      term: 'Final destination',
      difference:
        'The final destination is where the buyer uses or stores the goods. A port of discharge in one country can serve a buyer in another, as in a landlocked market.',
    },
  ],
  related: [
    '/guides/what-is-a-bill-of-lading',
    '/guides/shipper-consignee-notify-party',
    '/guides/eei-aes-filing-itn',
    'transshipment',
    'etd',
  ],
  tool: '/tools/invoice-generator',
  toolPitch:
    'The commercial invoice generator has fields for the port of loading and port of discharge, so the invoice matches the bill of lading.',
  faq: [
    {
      q: 'What is the difference between port of loading and port of discharge?',
      a: 'The port of loading is where the goods are put on the main vessel or aircraft; the port of discharge is where they are taken off it. Both appear on the bill of lading and often on the commercial invoice.',
    },
    {
      q: 'Is the port of discharge the same as the final destination?',
      a: 'Not always. Goods can be discharged at a port and moved on by truck or rail to an inland place of delivery, sometimes in another country.',
    },
  ],
  sources: ['e4-cfr-19-4-7a-ports', 'e4-ftr-30-6-ports', 'e4-emsa-unlocode'],
  regulated: false,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
