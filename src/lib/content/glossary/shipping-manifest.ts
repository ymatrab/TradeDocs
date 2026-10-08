import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'shipping-manifest',
  term: 'Shipping manifest (cargo manifest)',
  aliases: ['cargo manifest', 'manifest', 'cargo declaration', 'freight manifest'],
  demand: {
    keyword: 'shipping manifest',
    market: 'US',
    volume: 1_900,
    kd: 7,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'Shipping manifest: what a cargo manifest is',
  description:
    'What a shipping or cargo manifest is, who files it, how it differs from a packing list and a bill of lading, and where your documents feed into it.',
  shortDefinition:
    'A shipping manifest, or cargo manifest, is the carrier’s list of all the cargo carried on one vessel, flight or vehicle, compiled from the bills of lading or waybills. Carriers file it with customs, often electronically before loading or arrival.',
  definition: [
    'The manifest belongs to the carrier, not the shipper. It lists every consignment on the conveyance, with the shippers, consignees, package counts, descriptions and weights drawn from the transport documents the carrier or its agents issued. Customs uses it to know what is arriving before the goods are unloaded and to match each consignment to an entry.',
    'U.S. rules show how this works for ocean cargo. The vessel’s manifest includes a Cargo Declaration, CBP Form 1302, and CBP must receive the electronic version 24 hours before the cargo is laden aboard the vessel at the foreign port, through the Automated Manifest System or another approved system. Bulk and some break-bulk cargo are exempt from that timing.',
    'Consolidated cargo adds a layer. An NVOCC that is licensed by or registered with the Federal Maritime Commission and holds an international carrier bond may transmit its own cargo declaration to CBP; otherwise it gives the information to the vessel carrier, which files it.',
  ],
  onYourDocuments: [
    'You never fill in the manifest yourself, but it is built from what you supply. The description, package count, marks and weight on your bill of lading come from your commercial invoice and packing list, and the carrier repeats them on the manifest.',
    'That is why late or vague details matter: when a manifest line and the entry disagree, with different weights or a generic description, the difference has to be resolved before customs can match the consignment to its entry.',
  ],
  example: {
    caption: 'Worked example with invented parties',
    paragraphs: [
      'Saltmarsh Foods (invented) ships 400 cartons of olive oil to New Jersey. Its packing list gives 400 cartons and 7,200 kg gross. The bill of lading repeats those figures, and the carrier’s manifest line for the consignment carries the same description, count and weight.',
    ],
    table: {
      caption: 'Invented example: one consignment, three documents',
      head: ['Document', 'Prepared by', 'Shows'],
      rows: [
        ['Packing list', 'Saltmarsh Foods', 'Each carton’s contents and weight'],
        ['Bill of lading', 'Carrier', '400 cartons, olive oil, 7,200 kg'],
        ['Manifest', 'Carrier', 'Every consignment on the vessel, this one included'],
      ],
    },
  },
  confusedWith: [
    {
      term: 'Packing list',
      difference:
        'A packing list is the shipper’s itemised list of one shipment’s packages; a manifest is the carrier’s list of every shipment on the conveyance.',
    },
    {
      term: 'Bill of lading',
      difference:
        'The bill of lading is the contract and receipt for one consignment; the manifest summarises all the bills of lading for a voyage.',
    },
  ],
  related: ['/guides/what-is-a-bill-of-lading', '/blog/packing-list-for-shipping', 'nvocc', 'waybill'],
  tool: '/tools/packing-list-generator',
  toolPitch:
    'The packing list generator produces the package counts and weights the carrier copies onto the bill of lading and the manifest.',
  faq: [
    {
      q: 'Who files the cargo manifest?',
      a: 'The carrier. For U.S.-bound ocean cargo the vessel carrier files the cargo declaration with CBP, and an NVOCC that is FMC-licensed or registered and bonded may file its own; otherwise it passes the details to the vessel carrier.',
    },
    {
      q: 'Is a shipping manifest the same as a packing list?',
      a: 'No. The packing list describes one shipment and comes from the shipper. The manifest lists every consignment on a vessel, flight or vehicle and comes from the carrier, using the details on each bill of lading.',
    },
  ],
  sources: ['b7-cfr-19-4-7', 'a2-trade-gov-packing-list'],
  regulated: false,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
