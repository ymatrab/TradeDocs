import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-09';

const term: GlossaryTerm = {
  slug: 'arrival-notice',
  term: 'Arrival notice',
  abbreviation: 'A/N',
  aliases: ['notice of arrival', 'cargo arrival notice', 'arrival notification'],
  demand: {
    keyword: 'arrival notice',
    market: 'US',
    volume: 140,
    kd: null,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'Arrival notice in shipping: what it tells you',
  description:
    'What a carrier’s or forwarder’s arrival notice is, who receives it, what it lists, what to do when it lands, and how it differs from the bill of lading and the customs release.',
  shortDefinition:
    'An arrival notice is the message a carrier or forwarder sends to the consignee or notify party when a shipment is due at, or has reached, the port of discharge or destination. It gives the arrival details and what must happen before the goods are released.',
  definition: [
    'The UN/EDIFACT standard for trade messages has a message for it, IFTMAN, defined as a message from the party providing forwarding or transport services to the party named in the contract, giving notice and details of the arrival of the consignment. In practice it comes as an email, a PDF or a portal alert from the shipping line, the NVOCC or the forwarder.',
    'An arrival notice is a commercial document, not a customs filing. Its details mirror what the carrier has already reported to customs; in the United States that is the inward manifest, which lists cargo by bill of lading number and port of discharge. The notice tells the importer or its broker that it is time to act: arrange customs entry, pay any freight or charges the carrier is collecting, and book delivery or collection.',
    'Timing matters. Free time at the terminal starts running when the goods are discharged, and in the United States cargo that is not entered within the period set by CBP’s general order rule must be moved by the carrier to a bonded general order warehouse. A late or missed arrival notice does not usually stop either clock, so importers often track the ETA themselves.',
  ],
  onYourDocuments: [
    'The arrival notice usually repeats the bill of lading or air waybill number, the shipper, consignee and notify party, the vessel or flight, the ports of loading and discharge, the container and seal numbers, and the package count, weight and description. It adds the ETA or arrival date, where the cargo is held, the charges due and the free time.',
    'Check it against your commercial invoice and packing list. Package counts, marks and the consignee name should agree; a difference found now is easier to fix than at the customs exam or on delivery.',
  ],
  example: {
    caption: 'Worked example with an invented importer and shipment',
    paragraphs: [
      'Oakmere Supply (invented) is the notify party on a sea shipment of 84 cartons of kitchenware into Los Angeles. Three days before the ETA, its forwarder emails an arrival notice listing the bill of lading number, container and seal, 84 packages and the terminal where the box will be discharged.',
      'Oakmere sends the notice, invoice and packing list to its customs broker, pays the destination charges shown, and books a haulier for the day after release. When the container is devanned at its warehouse, it counts the cartons against the same packing list.',
    ],
  },
  confusedWith: [
    {
      term: 'Delivery order',
      difference:
        'An arrival notice tells you the cargo is arriving. A delivery order is issued later, once charges are paid and documents surrendered, and authorizes the terminal to release the cargo to you or your haulier.',
    },
    {
      term: 'Customs release',
      difference:
        'The arrival notice comes from the carrier or forwarder. Release comes from customs after entry is made and accepted; you normally need both before the goods can leave the terminal.',
    },
  ],
  related: [
    '/guides/shipper-consignee-notify-party',
    '/guides/demurrage-and-detention',
    '/blog/how-long-does-customs-clearance-take',
    'etd',
    'devanning',
  ],
  tool: '/tools/delivery-note-generator',
  toolPitch:
    'The delivery note generator turns the arrival details and packing list into a note for the final delivery to your customer’s site.',
  faq: [
    {
      q: 'Who sends an arrival notice?',
      a: 'The carrier, NVOCC or forwarder that issued the transport document. It goes to the consignee or the notify party named on the bill of lading or air waybill, and often to their customs broker.',
    },
    {
      q: 'What should I do when I receive an arrival notice?',
      a: 'Check it against your invoice and packing list, send it to your customs broker so entry can be made, pay any charges shown, and book delivery before free time runs out.',
    },
  ],
  sources: ['e4-unedifact-iftman', 'e4-cfr-19-4-7a-ports', 'e4-cfr-19-4-37-general-order'],
  regulated: false,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
