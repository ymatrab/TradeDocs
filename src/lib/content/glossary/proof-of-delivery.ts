import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'proof-of-delivery',
  term: 'Proof of delivery (POD)',
  abbreviation: 'POD',
  aliases: ['POD', 'delivery receipt', 'signed delivery note', 'proof of delivery template'],
  demand: {
    keyword: 'proof of delivery',
    market: 'US',
    volume: 1_000,
    kd: 17,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'Proof of delivery (POD): meaning and examples',
  description:
    'What proof of delivery is, what a POD shows, how carriers and signed delivery notes provide it, and why noting damage on it matters.',
  shortDefinition:
    'Proof of delivery (POD) is the record that a shipment reached its consignee: who received it, where and when, usually with a signature. Carriers produce it from tracking, and sellers often use a delivery note signed by the receiver.',
  definition: [
    'A POD answers one question after the goods leave: did they arrive? Parcel carriers build it from their delivery scan. UPS, for example, describes its proof of delivery as showing the time of delivery, the full delivery address and the name and signature of the person who received the shipment, retrievable by tracking number.',
    'On freight moves the receipt is often part of the transport document. Under the CMR Convention for international road carriage, the consignee is entitled at the place of delivery to the second copy of the consignment note and the goods against a receipt. Many sellers add their own document: a delivery note listing the goods and quantities, signed and dated by the receiver.',
    'The signature carries weight in a dispute. Under CMR, taking delivery without checking the goods with the carrier is prima facie evidence that they arrived in the condition the consignment note describes, and reservations for visible damage have to be made no later than delivery.',
  ],
  onYourDocuments: [
    'A POD refers back to the shipment through its identifiers: the tracking or waybill number, the consignment note, or the delivery note number and your order or invoice reference. Using the same reference on the invoice, packing list and delivery note lets you match a signed POD to the invoice it settles.',
    'If cartons arrive damaged or short, the receiver should note it on the POD or consignment note at delivery, with the number of packages affected, rather than signing it clean.',
  ],
  example: {
    caption: 'Worked example with invented parties',
    paragraphs: [
      'Millbrook Textiles (invented) delivers 12 rolls of fabric to a workshop by truck. The driver hands over Millbrook’s delivery note DN-1043; the workshop counts 11 rolls and one with a torn wrap, writes that on the note, signs and dates it.',
    ],
    table: {
      caption: 'Invented example: what the signed delivery note records',
      head: ['Field', 'Entry'],
      rows: [
        ['Delivery note', 'DN-1043, for invoice INV-2290'],
        ['Delivered', '11 rolls of 12; one roll wrap torn'],
        ['Received by', 'Name, signature, date and time'],
      ],
    },
  },
  confusedWith: [
    {
      term: 'Delivery note',
      difference:
        'A delivery note travels with the goods and lists what was sent; once the receiver signs it, it becomes a proof of delivery.',
    },
    {
      term: 'Bill of lading',
      difference:
        'A bill of lading is the carrier’s receipt when it takes the goods; a POD records that the goods were handed over at the destination.',
    },
  ],
  related: ['/blog/delivery-note-vs-packing-list', '/guides/cmr-note', 'waybill', 'consignor'],
  tool: '/tools/delivery-note-generator',
  toolPitch:
    'The delivery note generator gives you a document the receiver signs on arrival, so it doubles as your proof of delivery.',
  faq: [
    {
      q: 'What does a proof of delivery show?',
      a: 'Who received the shipment, where and when, usually with a signature. A carrier’s POD such as UPS’s shows the delivery time, the full address and the recipient’s name and signature; a signed delivery note adds the goods and quantities received.',
    },
    {
      q: 'Should I sign a POD if the goods are damaged?',
      a: 'Note the damage on it first. Under the CMR Convention, a consignee who takes delivery without checking the goods is presumed to have received them as described, so visible damage should be recorded at delivery.',
    },
  ],
  sources: ['b7-ups-delivery-history', 'b7-cmr-delivery'],
  regulated: false,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
