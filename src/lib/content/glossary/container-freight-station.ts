import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'container-freight-station',
  term: 'Container freight station (CFS)',
  abbreviation: 'CFS',
  aliases: ['CFS', 'container station', 'CFS warehouse', 'what is a CFS'],
  demand: {
    keyword: 'what is a cfs',
    market: 'US',
    volume: 390,
    kd: 40,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'Container freight station (CFS): what it is',
  description:
    'What a container freight station does, why LCL cargo passes through one at both ends, how U.S. customs rules treat container stations, and what your packing list must show.',
  shortDefinition:
    'A container freight station (CFS) is a warehouse where less-than-container-load (LCL) shipments are consolidated into containers for export and unloaded from them on arrival, so goods from several shippers can share one box.',
  definition: [
    'A full container load goes from the shipper’s door to the port sealed. An LCL shipment does not fill a box, so it needs a place where it can be combined with other cargo. That place is the CFS: at origin, shippers deliver pallets and cartons, which are measured, checked and loaded together into one container; at destination, the container is unloaded there and each consignment is released to its own consignee. Because LCL is priced on the cubic metres a shipment takes up, the CFS measurement usually sets the bill.',
    'In the United States the term has a regulatory cousin. CBP’s rules in 19 CFR 19.40 let a container station be set up at a port, independent of the importing carrier, on application, the port director’s approval and a customs bond. Under 19 CFR 19.41, containerized cargo can be moved there from the place of unloading, or delivered by a bonded carrier after an in-bond movement, before entry is filed, so the container can be stripped and the cargo released for delivery.',
  ],
  onYourDocuments: [
    'The CFS works from your packing list and shipping marks. It counts packages, measures and weighs them, and compares the result with what you declared, so the number of packages, each one’s dimensions and gross weight, and the marks on the cartons should match the list exactly. Differences become remeasurement charges or delays.',
    'On an LCL bill of lading the place of receipt or delivery is often the CFS itself, and the delivery terms may read “CFS/CFS”, meaning the carrier’s responsibility starts and ends at the station rather than at your door.',
  ],
  example: {
    caption: 'Worked example with invented parties',
    paragraphs: [
      'Bluegrass Candle Co. (invented) of Kentucky ships four pallets of candles to a shop in Melbourne by LCL. Its packing list declares 4 pallets, each 1.2 × 1.0 × 1.1 metres. The CFS in Savannah measures them on receipt, confirms the volume and loads them into a shared container with eight other shippers’ cargo.',
      'In Melbourne the container is stripped at a destination CFS, and the shop’s broker clears the four pallets for collection.',
    ],
  },
  confusedWith: [
    {
      term: 'Container yard (CY)',
      difference:
        'A container yard handles full, sealed containers. A CFS handles loose cargo going into or coming out of containers.',
    },
  ],
  related: ['/guides/lcl-vs-fcl', 'freight-all-kinds', 'nvocc', '/blog/how-many-cbm-fit-in-a-container'],
  tool: '/tools/cbm-calculator',
  toolPitch:
    'The CBM calculator works out the cubic metres of your cartons or pallets before the CFS measures them, so the LCL quote and the final bill line up.',
  faq: [
    {
      q: 'What happens at a container freight station?',
      a: 'At origin, LCL shipments from several shippers are received, measured and loaded into one container. At destination, containers are unloaded there and each shipment is sorted and released to its consignee once customs allow.',
    },
    {
      q: 'Who pays CFS charges?',
      a: 'It depends on the sale terms and the freight contract: origin CFS charges usually sit with the party paying export handling, and destination CFS charges with the party collecting the goods. Check which Incoterms® rule and which freight quote cover them.',
    },
  ],
  sources: ['d5-cfr-19-19-40', 'd5-cfr-19-19-41', 'maersk-fcl-lcl'],
  regulated: false,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
