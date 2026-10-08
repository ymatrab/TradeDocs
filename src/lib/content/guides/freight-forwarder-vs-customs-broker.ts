import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-06/07): "what is a freight forwarder" 2,900, KD 11;
 * "freight forwarder meaning" 1,600; "what is a customs broker" 880, KD 21.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave B (v2 guide #20).
 * TradeDocs is neither a forwarder nor a broker; it prepares the invoice and packing list both use.
 */
const article: ContentArticle = {
  slug: 'freight-forwarder-vs-customs-broker',
  title: 'What is a freight forwarder, and how is it different from a customs broker?',
  metaTitle: 'What is a freight forwarder vs a customs broker?',
  description:
    'A freight forwarder arranges the transport; a customs broker clears the goods. What each one does under US rules, how each is licensed, and the documents each asks you for.',
  lede: 'Your first export or import usually involves two service providers whose names sound interchangeable. They are not. One moves the goods and the paperwork that goes with them; the other deals with customs on the importer’s behalf. Knowing which is which tells you who to send each document to.',
  answer:
    'A freight forwarder arranges the transport of your goods: it books space with carriers and handles the shipping documents. A customs broker deals with customs: in the US, a CBP-licensed broker transacts customs business, such as entry, classification and valuation, on the importer’s behalf. One company can do both, but in the US each role is licensed separately.',
  keyFacts: [
    'Under 46 U.S.C. § 40102, an ocean freight forwarder dispatches shipments from the US via a common carrier, books space on behalf of shippers and processes the documentation.',
    'Under 46 CFR 515.3, no person in the United States may act as an ocean transportation intermediary without a licence from the Federal Maritime Commission.',
    'CBP licenses customs brokers under 19 U.S.C. 1641 and 19 CFR Part 111 to conduct customs business on behalf of other persons.',
    'Under 19 CFR 111.2, an importer transacting customs business solely on its own account does not need a broker licence.',
    'Under 19 CFR 141.46, a customs broker must obtain a valid power of attorney before transacting customs business in its principal’s name.',
  ],
  definitions: [
    {
      term: 'Freight forwarder',
      meaning:
        'A business that dispatches shipments for others: it books carrier space, coordinates the movement and prepares or processes the shipping documents.',
    },
    {
      term: 'Customs broker',
      meaning:
        'A person or company licensed to transact customs business with the customs authority on behalf of importers.',
    },
    {
      term: 'NVOCC',
      meaning:
        'A non-vessel-operating common carrier: it sells ocean transport and issues its own bills of lading without operating ships.',
    },
    {
      term: 'Customs business',
      meaning:
        'In 19 CFR 111.1, dealings with CBP on entry, admissibility, classification, valuation and payment of duties, including preparing documents for filing.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What does a freight forwarder do?',
      paragraphs: [
        'A freight forwarder organises the movement of your goods for you. The Shipping Act definition in 46 U.S.C. § 40102 describes an ocean freight forwarder as a person in the United States that dispatches shipments from the US via a common carrier, books or otherwise arranges space for them on behalf of shippers, and processes the documentation or performs related activities.',
        'The Federal Maritime Commission groups ocean freight forwarders and NVOCCs together as ocean transportation intermediaries, regulated under the Shipping Act of 1984. An NVOCC goes a step further than a forwarder: the FMC describes it as a common carrier that issues its own house bill of lading without operating the vessels, and that is itself a shipper in its relationship with the shipping line. The FMC’s regulations, in 46 CFR 515.2, list what forwarding services can include:',
      ],
      list: [
        'Booking, arranging or confirming cargo space.',
        'Preparing or processing export documents, including the Electronic Export Information.',
        'Preparing or processing bills of lading and dock receipts.',
        'Arranging warehouse storage and cargo insurance.',
        'Coordinating the movement of the goods from origin to the vessel.',
      ],
    },
    {
      heading: 'What does a customs broker do?',
      paragraphs: [
        'A customs broker handles customs on the importer’s behalf. CBP licenses brokers under 19 U.S.C. 1641 and the rules in 19 CFR Part 111, and issues licences to individuals, corporations, partnerships and associations to conduct customs business for other persons.',
        'That term is defined in 19 CFR 111.1: transactions with CBP concerning the entry and admissibility of goods, their classification and valuation, the payment of duties, taxes and fees, and refunds or drawback, including preparing the documents to be filed. The same section says that merely transmitting data received for transmission to CBP is not customs business. Before acting in your name, the broker needs your power of attorney under 19 CFR 141.46; it keeps the document on file rather than lodging it with CBP.',
      ],
    },
    {
      heading: 'How do a freight forwarder and a customs broker compare?',
      paragraphs: [
        'The short version: the forwarder deals with carriers, the broker deals with customs. The table sets out the US position; other countries license these roles in their own way, so check the rules where your goods arrive.',
      ],
      table: {
        caption: 'Freight forwarder and customs broker compared, under US rules',
        head: ['', 'Freight forwarder', 'Customs broker'],
        rows: [
          ['Works with', 'Carriers: shipping lines, airlines, truckers', 'The customs authority (CBP in the US)'],
          ['Main job', 'Books space, moves the goods, handles shipping documents', 'Files the entry, declares classification and value, pays duties'],
          ['US licence (ocean)', 'FMC, as an ocean transportation intermediary', 'CBP, under 19 CFR Part 111'],
          ['Needs from you', 'Booking details, invoice, packing list, shipping instructions', 'Power of attorney, invoice, packing list, transport document'],
          ['Typical side', 'Exporter or importer, depending on the Incoterms® rule', 'Usually the importer'],
        ],
      },
    },
    {
      heading: 'Do you need a customs broker to import into the US?',
      paragraphs: [
        'Not legally. Under 19 CFR 111.2, an importer transacting customs business solely on its own account, and its own employees acting only for it, does not need a licence. A broker is needed when someone acts for another party.',
        'Using a broker does not move the legal responsibility. 19 CFR 141.1 makes duty liability a personal debt of the importer to the United States, and paying a broker who then fails to pay CBP does not discharge it. 19 U.S.C. § 1484 also requires the importer of record to use reasonable care when making entry, so the figures you give the broker have to be right.',
      ],
    },
    {
      heading: 'Which documents does each one ask you for?',
      paragraphs: [
        'Both work from the same commercial facts, which is why the documents have to agree. On the export side, the Foreign Trade Regulations let the US principal party in interest or its authorized agent, often the forwarder, file the Electronic Export Information. On the import side, 19 CFR 142.3 lists the entry documents a broker assembles.',
      ],
      steps: [
        'Send the forwarder the booking details: pickup address, ready date, destination and the Incoterms® rule with its named place.',
        'Give the forwarder the commercial invoice and packing list, and written shipping instructions if it files the export information for you.',
        'Sign the broker’s power of attorney before the goods arrive.',
        'Give the broker the same commercial invoice and packing list, plus the transport document the forwarder or carrier issued.',
        'Answer the broker’s questions on classification and value from your own records; it declares what you can support.',
      ],
    },
    {
      heading: 'Can a freight forwarder choose your customs broker?',
      paragraphs: [
        'It can refer you to one, with conditions. 19 CFR 111.36 allows a broker to compensate a freight forwarder for referring brokerage business, provided the importer is told in advance the name of the broker the forwarder selected. If the brokerage charges are collected through the forwarder, the broker must send the importer a true copy of them directly, unless the importer has waived that in writing.',
        'In practice, many companies offer forwarding and brokerage together. That is allowed, but they are still two roles: ask which entity holds the CBP broker licence and which holds the FMC licence, and whose name goes on the power of attorney.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is a freight forwarder a carrier?',
      a: 'An ocean freight forwarder arranges carriage on behalf of shippers. An NVOCC is different: 46 U.S.C. § 40102 defines it as a common carrier that does not operate the vessels, and it issues its own bills of lading.',
    },
    {
      q: 'Can I clear my own goods through US customs without a broker?',
      a: 'Yes. Under 19 CFR 111.2, an importer acting solely on its own account does not need a broker licence. You then take on the entry filing, classification and valuation yourself.',
    },
    {
      q: 'Does the freight forwarder file the EEI for my export?',
      a: 'It can. Under 15 CFR 30.3, the US principal party in interest or its authorized agent files the Electronic Export Information, and 46 CFR 515.2 lists preparing it among freight forwarding services.',
    },
    {
      q: 'If I pay the broker, am I covered if the duty is not paid?',
      a: 'No. Under 19 CFR 141.1, duty is a personal debt of the importer, and paying a broker who fails to pay CBP does not discharge it.',
    },
  ],
  sources: [
    'b5-usc-46-40102',
    'b5-cfr-46-515-2',
    'b5-cfr-46-515-3',
    'b5-fmc-oti',
    'b5-cbp-customs-brokers',
    'b5-cfr-19-111-1',
    'b5-cfr-19-111-2',
    'b5-cfr-19-111-36',
    'b5-cfr-19-141-46',
    'a5-cfr-19-141-1',
    'a5-usc-19-1484',
    'a4-cfr-19-142-3',
    'w5-ftr-30-3',
  ],
  primaryTool: '/tools/packing-list-generator',
  callout: {
    afterSection: 4,
    tool: '/tools/packing-list-generator',
    title: 'One packing list for the forwarder and the broker',
    text: 'Build the packing list from your invoice lines, so the carton count, weights and descriptions your forwarder and broker receive are the same figures.',
  },
  tools: ['/tools/packing-list-generator', '/tools/invoice-generator', '/tools/landed-cost-calculator'],
  related: [
    '/guides/importer-of-record',
    '/guides/how-to-import-into-the-us',
    '/guides/eei-aes-filing-itn',
    '/blog/shippers-letter-of-instruction',
    '/guides/what-is-a-bill-of-lading',
  ],
  cover: {
    id: 'EoS4ZFRJCJ4',
    src: 'https://images.unsplash.com/photo-1759826350352-c5b0b77729bd',
    width: 6000,
    height: 4000,
    alt: 'A forklift moving shipping containers at a port terminal, where a forwarder’s booked cargo is handled',
    caption: 'A forklift moving containers at a port',
    photographer: { name: 'Solømen', profile: 'https://unsplash.com/@solomen' },
    page: 'https://unsplash.com/photos/forklift-moving-shipping-containers-at-a-port-EoS4ZFRJCJ4',
  },
};

export default article;
