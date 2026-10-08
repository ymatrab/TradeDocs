import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-09';

const term: GlossaryTerm = {
  slug: 'unit-load-device',
  term: 'Unit load device (ULD)',
  abbreviation: 'ULD',
  aliases: ['ULD', 'ULDs', 'air cargo container', 'aircraft pallet'],
  demand: {
    keyword: 'uld',
    market: 'US',
    volume: 1_900,
    kd: 8,
    dataFile: '../dataforseo-2026-10-08/11-labs-ranked-keywords-us-incodocs-com.json',
  },
  metaTitle: 'ULD meaning: unit load device in air cargo',
  description:
    'What a unit load device is, the difference between an aircraft container and a pallet with a net, how ULDs are identified, and what a shipper’s documents need for ULD cargo.',
  shortDefinition:
    'A unit load device, or ULD, is an aircraft container, or an aircraft pallet combined with a pallet net, used to group and restrain cargo, mail and baggage so it can be loaded onto an aircraft as one unit.',
  definition: [
    'IATA, the airline trade association, defines a ULD as either an aircraft container or an aircraft pallet with a pallet net. Both do the same job: they let an airline load many pieces as one unit that locks into the aircraft’s cargo system, instead of handling every carton separately in the hold.',
    'A ULD is not ordinary packaging. IATA describes ULDs as removable aircraft parts subject to civil aviation authority requirements, and an airworthy ULD must be able to restrain its load in flight. That is why airlines and ground handlers, not shippers, normally own and build ULDs, and why IATA publishes the ULD Regulations, which cover technical and operating specifications, pallet and net compatibility, marking and the IATA ULD ID Code that identifies each unit.',
    'Containers and pallets come in contours that fit particular aircraft decks, so the ULD an airline uses depends on the aircraft and on whether the cargo travels on the main deck or the lower deck. A forwarder consolidating several shippers’ goods will often build one ULD from many house shipments. A shipper with enough freight can sometimes book a whole ULD, but the airline still decides how it is built and loaded.',
  ],
  onYourDocuments: [
    'Your commercial invoice and packing list describe the pieces you hand over, not the ULD. What the airline and forwarder need from you is accurate piece counts, weights and dimensions per carton or pallet, because they plan the build of each ULD from those figures and charge on the chargeable weight.',
    'The ULD ID code appears on the airline’s and handler’s loading and transfer documents, and sometimes on the master air waybill when a whole unit is booked. If your goods are on your own skids, mark each one clearly and keep the packing list in the same order so the receiver can match pieces after the ULD is broken down.',
  ],
  example: {
    caption: 'Worked example with an invented forwarder and shipment',
    paragraphs: [
      'Fernhill Optics (invented) sends 14 cartons of lenses by air from Chicago to Singapore. Its packing list gives each carton’s gross weight and dimensions. The forwarder, Northgate Air Cargo (invented), consolidates Fernhill’s cartons with three other shippers’ goods and builds them onto one airline pallet with a net.',
      'Fernhill never sees the ULD. Its house air waybill lists its 14 pieces; the master air waybill and the airline’s loading records carry the pallet’s ULD ID code. In Singapore the pallet is broken down and the consignee checks the 14 cartons against Fernhill’s packing list.',
    ],
  },
  confusedWith: [
    {
      term: 'Shipping container (sea freight)',
      difference:
        'An ISO sea container is built for ships, trucks and rail and is identified by an ISO 6346 container number. An air ULD is an aircraft part shaped to the aircraft’s hold and identified by an IATA ULD ID code.',
    },
    {
      term: 'Wooden pallet or skid',
      difference:
        'A shipper’s pallet is packaging that travels with the goods. An aircraft pallet is a ULD owned by the airline or handler; your pallets are placed on it and secured with a net.',
    },
  ],
  related: [
    '/guides/air-waybill',
    '/guides/chargeable-weight',
    '/blog/mawb-vs-hawb',
    '/blog/air-freight-vs-sea-freight',
  ],
  tool: '/tools/chargeable-weight',
  toolPitch:
    'The chargeable weight calculator shows whether your cartons will be charged on actual or volumetric weight before the forwarder builds them into a ULD.',
  faq: [
    {
      q: 'What does ULD stand for in air cargo?',
      a: 'Unit load device: an aircraft container, or an aircraft pallet with a pallet net, that holds cargo, mail or baggage as one unit for loading onto an aircraft.',
    },
    {
      q: 'Do shippers have to supply ULDs?',
      a: 'Usually not. Airlines and ground handlers own and build ULDs because they are aircraft parts with airworthiness requirements. The shipper supplies well-packed pieces and accurate weights and dimensions.',
    },
  ],
  sources: ['e4-iata-uld-ops', 'e4-iata-uldr'],
  regulated: false,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
