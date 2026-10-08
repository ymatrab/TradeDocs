import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'advance-shipping-notice',
  term: 'Advance shipping notice (ASN)',
  abbreviation: 'ASN',
  aliases: ['advance ship notice', 'ship notice', 'despatch advice', 'dispatch advice', 'EDI 856', 'DESADV'],
  demand: {
    keyword: 'advance shipping notice',
    market: 'US',
    volume: 590,
    kd: null,
    dataFile: '04-labs-keyword-overview-us-questions.json',
  },
  metaTitle: 'Advance shipping notice (ASN): meaning and contents',
  description:
    'What an advance shipping notice is, what it lists, how it relates to the EDI 856 and DESADV messages, and how it differs from a packing list or delivery note.',
  shortDefinition:
    'An advance shipping notice (ASN) is a message the seller sends the buyer before goods arrive, listing what was shipped, how it is packed and when it left. The receiver uses it to plan the delivery and check the goods against the order.',
  definition: [
    'The ASN tells the receiving warehouse what is on its way. GS1’s EANCOM guidelines describe the matching message, the despatch advice, as specifying details for goods despatched or ready for despatch, and say it should always be sent before the goods are physically delivered so the receiver can prepare for them.',
    'GS1 lists what the message lets the recipient do: know when the goods were or will be despatched, have the precise details of the consignment, take initial steps towards customs clearance for international shipments, and check the despatched goods against the invoice that follows.',
    'Most ASNs travel as electronic data interchange (EDI) messages rather than documents. X12 publishes the 856 Ship Notice/Manifest, which can carry order information, product descriptions, packaging type, markings, carrier information and how the goods are arranged in the transport equipment. In EANCOM the equivalent message is DESADV. Which format, and how far ahead, is set by the buyer you trade with.',
  ],
  onYourDocuments: [
    'An ASN repeats the contents of your packing list in structured form: order numbers, items and quantities, and which pallet or carton each item is in. GS1 recommends identifying every unit with a Serial Shipping Container Code (SSCC), and GS1 US publishes guidance on carrying that code on the logistics label in conjunction with the ASN, so a scan at the dock links the physical carton to the message.',
    'If you do not trade by EDI, a buyer may accept the same information as an email with the packing list attached. Make sure carton numbers, quantities and weights match the packing list exactly, since the ASN is what the receiver checks first.',
  ],
  example: {
    caption: 'Worked example with invented parties',
    paragraphs: [
      'Northfield Apparel (invented) ships two pallets of jackets against one purchase order. Before the truck leaves, it sends its customer an ASN listing the order number, the two pallet SSCCs, the cartons on each and the styles and sizes inside, plus the carrier and expected delivery date. At the dock, the customer scans the pallet labels and the system matches them to the ASN without opening a carton.',
    ],
  },
  confusedWith: [
    {
      term: 'Packing list',
      difference:
        'A packing list travels with the goods and itemises each package. An ASN carries much the same data but is sent ahead of the goods, usually by EDI.',
    },
    {
      term: 'Delivery note',
      difference:
        'A delivery note is handed over or signed at delivery to confirm receipt. The ASN arrives before the delivery so the receiver can plan for it.',
    },
  ],
  related: ['shipping-manifest', 'proof-of-delivery', '/blog/delivery-note-vs-packing-list', '/blog/shipping-marks'],
  tool: '/tools/packing-list-generator',
  toolPitch:
    'The packing list generator gives you the carton-by-carton contents, weights and marks an ASN repeats.',
  faq: [
    {
      q: 'Is an ASN the same as an EDI 856?',
      a: 'The EDI 856 is the X12 Ship Notice/Manifest transaction set, one of the EDI formats used to send an ASN. In the EANCOM standard the same kind of message is the DESADV, or despatch advice.',
    },
    {
      q: 'When should an ASN be sent?',
      a: 'Before the goods arrive. GS1’s guidelines say the despatch advice should always be sent before physical delivery; each buyer sets its own deadline, so check its supplier requirements.',
    },
  ],
  sources: ['c6-gs1-desadv', 'c6-x12-856', 'c6-gs1-us-logistics-label'],
  regulated: false,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
