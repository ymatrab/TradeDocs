import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'nvocc',
  term: 'NVOCC (non-vessel-operating common carrier)',
  abbreviation: 'NVOCC',
  aliases: ['non-vessel-operating common carrier', 'non-vessel operating common carrier', 'NVO'],
  demand: {
    keyword: 'nvocc',
    market: 'US',
    volume: 2_900,
    kd: 3,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'NVOCC meaning: non-vessel-operating carrier',
  description:
    'What an NVOCC is, how it differs from a shipping line and a freight forwarder, what it issues and where it shows up on your shipping documents.',
  shortDefinition:
    'An NVOCC, or non-vessel-operating common carrier, is an ocean carrier that owns or operates no ships. It sells space it buys from shipping lines, issues its own bills of lading to shippers, and acts as the shipper towards the line.',
  definition: [
    'The term comes from U.S. shipping law. The Shipping Act defines an NVOCC as a common carrier that does not operate the vessels by which the ocean transportation is provided, and that is a shipper in its relationship with an ocean common carrier. Facing you it is the carrier; facing the shipping line it is the customer.',
    'The Federal Maritime Commission’s rules list what that usually involves: buying transportation from a common carrier and reselling it, entering into affreightment agreements with shippers, issuing bills of lading or other shipping documents, arranging inland transport, leasing containers and paying the line as a shipper in its own name. Consolidating several shippers’ cargo into one container is a common way of doing this.',
    'In the U.S. trades an NVOCC must publish a tariff of its rates, charges and rules open to public inspection, and must show financial responsibility for claims. A U.S.-based NVOCC needs an FMC licence, and a non-U.S. NVOCC must name an agent in the United States in its tariff.',
  ],
  onYourDocuments: [
    'An NVOCC issues its own bill of lading, often called a house bill of lading. That document names you as shipper and your buyer, or the buyer’s bank, as consignee, and it is the one you present for payment. The shipping line issues a separate master bill to the NVOCC, which appears as shipper on it.',
    'Your commercial invoice and packing list do not name the NVOCC, but the descriptions, package counts and weights on them should match what the NVOCC’s bill of lading shows. For U.S.-bound vessel cargo, an NVOCC that is licensed or registered with the FMC and bonded can file its cargo declaration with CBP itself; otherwise the line files it.',
  ],
  example: {
    caption: 'Worked example with invented parties',
    paragraphs: [
      'Larkspur Ceramics (invented) books 6 m³ of tableware to Rotterdam with Northgate Consolidators (invented), an NVOCC. Northgate loads Larkspur’s pallets with three other shippers’ cargo into one 40ft container booked with a shipping line.',
    ],
    table: {
      caption: 'Invented example: who appears on which bill of lading',
      head: ['Document', 'Issued by', 'Shipper', 'Consignee'],
      rows: [
        ['House bill of lading', 'Northgate (NVOCC)', 'Larkspur Ceramics', 'Larkspur’s buyer'],
        ['Master bill of lading', 'Shipping line', 'Northgate', 'Northgate’s agent at destination'],
      ],
    },
  },
  confusedWith: [
    {
      term: 'Ocean freight forwarder',
      difference:
        'A forwarder books space and handles documents on the shipper’s behalf; an NVOCC is itself the carrier and issues its own bill of lading. U.S. law groups both as ocean transportation intermediaries.',
    },
    {
      term: 'Shipping line (VOCC)',
      difference:
        'A vessel-operating common carrier runs the ships. The NVOCC buys space from it and is the shipper on the line’s master bill.',
    },
  ],
  related: ['/guides/what-is-a-bill-of-lading', '/guides/lcl-vs-fcl', 'waybill', 'consignor'],
  tool: '/tools/packing-list-generator',
  toolPitch:
    'The packing list generator gives the NVOCC the package counts, weights and dimensions its bill of lading has to show.',
  faq: [
    {
      q: 'Is an NVOCC the same as a freight forwarder?',
      a: 'No. U.S. law treats both as ocean transportation intermediaries, but a forwarder arranges carriage for you while an NVOCC contracts to carry the goods itself and issues its own bill of lading. Many companies hold both roles and tell you which one applies on the booking.',
    },
    {
      q: 'Does an NVOCC need a licence?',
      a: 'In the U.S. trades, an NVOCC based in the United States needs a licence from the Federal Maritime Commission. Every NVOCC serving those trades must publish a tariff and show financial responsibility, and a non-U.S. NVOCC names a U.S. agent in its tariff.',
    },
  ],
  sources: ['b7-usc-46-40102', 'b7-cfr-46-515-2', 'b7-fmc-oti', 'b7-cfr-19-4-7'],
  regulated: false,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
