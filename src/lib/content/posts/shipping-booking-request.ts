import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-09';

/**
 * Demand (DataForSEO, Google US, 2026-10-07, file 04): "booking request" 210, KD 3; "booking
 * confirmation shipping" 20.
 * Plan: docs/research/content-plan-v4-2026-10-08.md, wave E, group 2 (how-to; what the forwarder
 * needs, taken from the packing list).
 */
const article: ContentArticle = {
  slug: 'shipping-booking-request',
  title: 'Shipping booking request: what to send your forwarder or carrier',
  metaTitle: 'Shipping booking request: what to include',
  description:
    'The details a forwarder or ocean carrier needs to book space for your cargo, where each one comes from on your packing list, and what to check on the booking confirmation.',
  lede: 'Once a freight quote is accepted, someone has to reserve space on a ship, a flight or a truck. That starts with a booking request. Most of what it asks for is already on your packing list and invoice; the work is copying it across accurately, once, before the cut-off.',
  answer:
    'A shipping booking request asks a forwarder or carrier to reserve space for a shipment. It gives the shipper and consignee, the places of loading and delivery, the cargo-ready date, the goods description, the number and type of packages, gross weight, volume, the container type and any dangerous goods. Take these figures from the packing list.',
  keyFacts: [
    'The International Trade Administration describes freight forwarders as booking space on ships, aircraft, trains and trucks and preparing the bill of lading.',
    'Under SOLAS regulation VI/2, in force since 1 July 2016, the shipper must give the verified gross mass of a packed container before it is loaded.',
    'The IMO says a container without a verified gross mass is not loaded on board a ship to which SOLAS applies.',
    'For cargo bound for the US, 19 CFR 4.7a does not accept generic descriptions such as “FAK”, “general cargo” or “STC” on the cargo declaration.',
    'Under 19 CFR 149.2, the Importer Security Filing for US-bound vessel cargo is due 24 hours before the cargo is laden at the foreign port.',
  ],
  definitions: [
    {
      term: 'Booking request',
      meaning:
        'The shipper’s or forwarder’s request to a carrier to reserve space for a stated cargo on a stated route and date.',
    },
    {
      term: 'Booking confirmation',
      meaning:
        'The carrier’s reply accepting the booking, with a booking number, the planned sailing or flight and the deadlines to meet.',
    },
    {
      term: 'Cut-off',
      meaning:
        'The latest time, set by the carrier or terminal, for delivering the cargo or submitting a document so the booking still sails.',
    },
    {
      term: 'Verified gross mass (VGM)',
      meaning:
        'The weighed total mass of a packed container, which the shipper must provide before it can be loaded on a ship.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is a shipping booking request?',
      paragraphs: [
        'It is the message that reserves transport for your cargo. You send it to your forwarder, or the forwarder sends it to the carrier on your behalf, after you have accepted a freight quote and know when the goods will be ready.',
        'The International Trade Administration lists booking space on ships, aircraft, trains and trucks among a forwarder’s services, alongside preparing the bill of lading. A booking request is different from the shipper’s letter of instruction, which tells the forwarder how to prepare the documents and the export filing. The booking comes first and secures the space; the instructions follow.',
      ],
    },
    {
      heading: 'What does a booking request need to include?',
      paragraphs: [
        'It needs enough for the carrier to decide whether the cargo fits, where it goes and when. The table lists the usual fields and the document each one is copied from. Carriers and forwarders use their own forms, so expect the labels to vary.',
      ],
      table: {
        caption: 'Booking request fields and where each comes from',
        head: ['Field', 'What to enter', 'Copy it from'],
        rows: [
          [
            'Shipper and consignee',
            'Names and addresses as they will appear on the bill of lading',
            'Commercial invoice',
          ],
          [
            'Origin and destination',
            'Place of receipt, port of loading, port of discharge, place of delivery',
            'Quote and sale contract',
          ],
          [
            'Incoterms® rule',
            'Rule and named place, which show who pays the freight',
            'Proforma or invoice',
          ],
          [
            'Cargo-ready date',
            'When the goods can be collected or delivered to the terminal',
            'Your production plan',
          ],
          [
            'Goods description',
            'Plain, specific description of what is in the packages',
            'Packing list',
          ],
          ['Packages', 'Number and type: cartons, pallets, crates', 'Packing list'],
          ['Gross weight and volume', 'Total kilograms and cubic metres', 'Packing list'],
          ['Equipment', 'Container size and type for a full load, or LCL', 'Packing list totals'],
          [
            'Special cargo',
            'Dangerous goods class, temperature, out-of-gauge sizes',
            'Product data',
          ],
        ],
      },
    },
    {
      heading: 'How do you fill in a booking request from your packing list?',
      paragraphs: [
        'Finish the packing list first, then copy from it rather than from memory. A booking made on estimated figures gets corrected later, and corrections after the cut-off cost money or a sailing.',
      ],
      steps: [
        'Check that the packing list is final: every package counted, each weighed, each measured in centimetres.',
        'Copy the total number of packages and their type, for example “14 pallets” rather than “1 container”.',
        'Copy the total gross weight and the total volume in cubic metres; add the tare of any pallets if your list shows net weights only.',
        'Choose the equipment from the volume and weight: decide between a full container and a shared (LCL) load before you ask for space.',
        'Write a goods description that matches the commercial invoice in plain words, not a code or a trade name alone.',
        'Add the Incoterms® rule and named place, the cargo-ready date and the shipper and consignee exactly as the invoice shows them.',
        'Flag anything special, such as dangerous goods, before the carrier accepts the booking, not after.',
      ],
    },
    {
      heading: 'Why does the goods description need to be precise?',
      paragraphs: [
        'Because it travels into the carrier’s cargo declaration, and customs authorities read it. For vessel cargo arriving in the US, 19 CFR 4.7a requires a precise description of the cargo, or a six-digit HTS number, and states that generic terms such as “FAK” (freight of all kinds), “general cargo” and “STC” (said to contain) are not acceptable. The same rule has quantities reported in the lowest external packaging unit, so the carrier counts the cartons or bundles, not the container.',
        'Write the description you would want an inspector to read: “Stainless steel kitchen pans” rather than “housewares”. Other countries have their own rules for advance cargo information; describing goods plainly and consistently across the booking, the packing list and the invoice keeps all of them satisfied.',
      ],
    },
    {
      heading: 'What should you check on the booking confirmation?',
      paragraphs: [
        'Check it against your request the day it arrives. The confirmation usually carries the booking number, the vessel or flight, the routing and the dates the carrier or terminal has set for delivering the cargo and the documents.',
        'Look for differences in the equipment type, the ports, the cargo-ready date and the weight. Note every cut-off in your calendar. If you are loading your own container, check where and when the empty container is released for collection. Quote the booking number on everything that follows: your shipping instructions, the delivery to the terminal and the messages to your buyer.',
      ],
    },
    {
      heading: 'When are the VGM and other filings due?',
      paragraphs: [
        'Some data has its own deadline after the booking. For a packed container going by sea, SOLAS regulation VI/2 makes the shipper responsible for giving the master and terminal the verified gross mass in time for the ship’s stowage plan. The IMO allows two methods: weigh the packed container, or weigh every package and its packing and securing material and add the container’s tare. A container without a verified gross mass is not loaded.',
        'Shipments to the US by sea also need an Importer Security Filing. Under 19 CFR 149.2 it is the importer’s filing, due 24 hours before the cargo is laden at the foreign port, but it draws on data from the seller’s side, so the buyer’s broker may ask you for it at booking time. Export filings in your own country follow their own rules; your forwarder will tell you what it needs and by when.',
      ],
    },
    {
      heading: 'Who sends the booking request under each Incoterms® rule?',
      paragraphs: [
        'Whoever contracts the main carriage books it. Under the ICC’s Incoterms® 2020 rules that is the buyer under EXW, FCA, FAS and FOB, so the buyer’s forwarder makes the booking and you supply the cargo details. Under CPT, CIP, CFR, CIF, DAP, DPU and DDP the seller contracts the carriage, so the booking request is yours to send. Either way, your packing list is the source of the figures.',
      ],
    },
  ],
  faq: [
    {
      q: 'What is the difference between a booking request and a booking confirmation?',
      a: 'The request asks for space and describes the cargo. The confirmation is the carrier’s acceptance, with a booking number, the planned sailing or flight and the deadlines that apply.',
    },
    {
      q: 'Can I change a booking after it is confirmed?',
      a: 'Usually, if you ask before the cut-off. Changes to equipment, weight or routing may need a new confirmation, and late changes can carry charges set by the carrier. Ask your forwarder before you change anything.',
    },
    {
      q: 'Is a booking number the same as a bill of lading number?',
      a: 'Not necessarily. The booking number identifies the reservation; the bill of lading number is given to the transport document once the goods are received or loaded.',
    },
    {
      q: 'Do I need a packing list before I book?',
      a: 'You need its totals: package count, gross weight and volume. Booking on estimates is possible, but the figures must be corrected before the cut-off, and the container weight must be verified before loading.',
    },
    {
      q: 'Who books the freight under FOB?',
      a: 'The buyer. Under FOB the buyer contracts the sea carriage, so its forwarder books the space and the seller delivers the goods on board at the named port of shipment.',
    },
  ],
  sources: [
    'e2-trade-gov-shipping-options',
    'e2-imo-solas-vgm',
    'e2-cfr-19-4-7a',
    'e2-cfr-19-149-2',
    'e2-icc-incoterms-2020',
  ],
  primaryTool: '/tools/packing-list-generator',
  tools: [
    '/tools/packing-list-generator',
    '/tools/cbm-calculator',
    '/tools/container-loading-calculator',
    '/tools/proforma-invoice-generator',
  ],
  callout: {
    afterSection: 2,
    tool: '/tools/packing-list-generator',
    title: 'Get the totals right before you book',
    text: 'The free packing list generator takes packages, contents, dimensions and weights and totals them, ready to copy into the booking request.',
  },
  related: [
    '/blog/freight-quote-checklist',
    '/blog/shippers-letter-of-instruction',
    '/blog/packing-list-for-shipping',
    '/guides/lcl-vs-fcl',
    '/blog/freight-prepaid-vs-freight-collect',
    '/guides/isf-10-2',
  ],
  cover: {
    id: 'Xk1IfNnEhRA',
    src: 'https://images.unsplash.com/photo-1700716465891-9e5e9f501d7d',
    width: 4032,
    height: 2620,
    alt: 'Container on a truck trailer in front of stacked containers at a terminal, the space a booking request reserves',
    caption: 'A container on a truck at a freight terminal',
    photographer: { name: 'Bernd Dittrich', profile: 'https://unsplash.com/@hdbernd' },
    page: 'https://unsplash.com/photos/a-truck-is-parked-in-front-of-a-bunch-of-shipping-containers-Xk1IfNnEhRA',
  },
};

export default article;
