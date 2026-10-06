import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-06';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "consignee meaning" 8,100; "what is a consignee" 2,400;
 * "shipper vs consignee" 110; "notify party" 50. UK: "consignee meaning" 2,900, KD 4.
 * Plan: docs/research/content-plan-v2-2026-10-06.md, batch 1.
 */
const article: ContentArticle = {
  slug: 'shipper-consignee-notify-party',
  title: 'Shipper, consignee and notify party: who is who on the paperwork',
  metaTitle: 'Shipper, consignee and notify party explained',
  description:
    'What shipper, consignee and notify party mean on a bill of lading and an invoice, how the consignee differs from the buyer and the importer, and how to fill each box.',
  lede: 'A bill of lading has three boxes for parties, and the commercial invoice has its own seller and buyer. They are often the same companies, and sometimes they are not. Knowing who belongs in each box is what lets the carrier deliver the goods and customs clear them.',
  answer:
    'The shipper is the party that hands the goods to the carrier and contracts for the transport, usually the seller or exporter. The consignee is the party the carrier delivers the goods to at destination. The notify party is a contact the carrier tells when the goods arrive, often the buyer or its customs broker.',
  keyFacts: [
    'The ITA describes the bill of lading as a contract between the owner of the goods and the carrier.',
    'Under 19 CFR 4.7a, the consignee on a US-bound bill of lading is the party to whom the cargo will be delivered.',
    'For goods shipped “to order of” a named party, CBP requires the carrier to report that named party as the consignee.',
    'Another commercial party listed on the bill for delivery or contact is reported in the notify party field, under 19 CFR 4.7a.',
    'The Foreign Trade Regulations define the ultimate consignee as the person abroad who ultimately receives the export shipment.',
  ],
  definitions: [
    {
      term: 'Shipper (consignor)',
      meaning: 'The party that tenders the goods to the carrier and is named as shipper on the transport document.',
    },
    {
      term: 'Consignee',
      meaning: 'The party named on the transport document to receive the goods at destination.',
    },
    {
      term: 'Notify party',
      meaning: 'A party the carrier contacts when the goods arrive; it gets no right to the goods by being named.',
    },
    {
      term: 'Ultimate consignee',
      meaning:
        'In US export reporting, the person abroad who finally receives the goods, as known at the time of export.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is a shipper?',
      paragraphs: [
        'The shipper is the party that hands the goods over for carriage and is named in the shipper box of the bill of lading or air waybill. In most sales it is the seller or exporter. The ITA describes the bill of lading as a contract between the owner of the goods and the carrier, and the shipper is the owner’s side of that contract when the goods leave.',
        'The shipper is not always the seller. A trading company may sell goods that a manufacturer ships directly, or a forwarder may appear as shipper on a consolidated booking. Whoever is named, the shipper’s name and address should match the export documents, because the carrier and customs read them together.',
      ],
    },
    {
      heading: 'What does consignee mean?',
      paragraphs: [
        'The consignee is the party the carrier delivers the goods to. CBP’s manifest rule for vessel cargo, 19 CFR 4.7a, describes the consignee as the party to whom the cargo will be delivered in the United States, and that is what the box means on most transport documents: the person entitled to collect the goods at the end of the journey.',
        'On a straight, non-negotiable bill of lading the consignee is named outright. On a negotiable bill the box often reads “to order” or “to order of” a bank or the shipper, and the goods go to whoever holds the endorsed original. The ITA notes that the customer usually needs an original bill of lading as proof of ownership to collect goods from the ocean carrier.',
      ],
    },
    {
      heading: 'What is a notify party?',
      paragraphs: [
        'The notify party is the contact the carrier tells when the goods arrive, so that someone starts the clearance and collection. Under 19 CFR 4.7a, when goods are shipped to order of a named party, any other commercial party listed on the bill for delivery or contact purposes is reported to CBP in the notify party field.',
        'In practice the notify party is often the buyer when the consignee is a bank, or the buyer’s customs broker. Being named as notify party gives no right to take the goods; it only puts that party on the carrier’s list of people to call.',
      ],
    },
    {
      heading: 'Is the consignee the same as the buyer or the importer?',
      paragraphs: [
        'Often, but not always. The buyer is the party in the sales contract. The consignee is the party on the transport document. The importer is the party that declares the goods to customs at destination. One company can be all three, and in many small shipments it is.',
        'They separate when a bank holds the bill under a letter of credit, when the buyer has goods delivered to its own customer, or when a broker acts as importer of record. Under 19 CFR 141.86, a US import invoice must state the person by whom and the person to whom the goods are sold, so the invoice shows the sale even when the bill of lading shows someone else as consignee.',
      ],
      table: {
        caption: 'Who appears where, in a sale with invented parties',
        head: ['Box', 'Document', 'Who usually goes there', 'In this invented sale'],
        rows: [
          ['Seller', 'Commercial invoice', 'The party selling the goods', 'Harbour Lane Ceramics Ltd'],
          ['Buyer', 'Commercial invoice', 'The party paying for the goods', 'Nordvik Interiors AS'],
          ['Shipper', 'Bill of lading', 'The seller or its forwarder', 'Harbour Lane Ceramics Ltd'],
          ['Consignee', 'Bill of lading', 'The party collecting the goods, or “to order”', 'To order of Example Bank'],
          ['Notify party', 'Bill of lading', 'The buyer or its broker', 'Nordvik Interiors AS'],
        ],
      },
    },
    {
      heading: 'What are the ultimate and intermediate consignee in US export filings?',
      paragraphs: [
        'They are reporting terms in the Foreign Trade Regulations. 15 CFR 30.1 defines the ultimate consignee as the person abroad who ultimately receives the export shipment, as known at the time of export; it may be the buyer or the end user, but not a foreign forwarding agent. The intermediate consignee is the person abroad who takes physical possession of the goods as an agent, to deliver them to the ultimate consignee.',
        'These names go into the Electronic Export Information, so they have to match what the transport documents and the invoice say about where the goods are going. The guide on EEI, AES filing and the ITN covers the filing itself.',
      ],
    },
    {
      heading: 'How should each party box be filled in?',
      paragraphs: [
        'Treat the party boxes as data that several organisations will match against each other: carrier, customs at both ends, the bank if there is one.',
      ],
      steps: [
        'Agree with the buyer, before booking, who the consignee and notify party will be and whether the bill will be straight or to order.',
        'Use full legal names and street addresses, with a contact name and phone number for the notify party.',
        'Add the tax or customs identifiers the destination asks for, such as an EORI number for goods entering the EU or UK.',
        'Copy the same names onto the commercial invoice and the packing list so the documents agree.',
        'If a letter of credit governs the sale, follow its wording for the consignee and notify party exactly.',
      ],
    },
  ],
  faq: [
    {
      q: 'Can the shipper and the consignee be the same company?',
      a: 'Yes. A company moving its own goods to its own branch abroad can be both. The transport document still names each role, and the export and import filings treat the two ends separately.',
    },
    {
      q: 'What does “to order” mean in the consignee box?',
      a: 'It makes the bill of lading negotiable: the goods go to whoever holds the original bill, endorsed by the named party. It is common when a bank finances the sale.',
    },
    {
      q: 'Can the consignee be changed after the goods have shipped?',
      a: 'The ITA notes that a negotiable bill can be used to buy, sell or trade the goods while they are in transit. Under a straight bill, whether and how the consignee can be changed depends on the carrier’s terms, so ask the carrier before the goods arrive.',
    },
    {
      q: 'Does the notify party pay the import duty?',
      a: 'Not because it is named as notify party. Duty is paid by whoever acts as importer at destination, which the sale and the Incoterms® rule decide.',
    },
  ],
  sources: [
    'trade-gov-export-documents',
    'w5-cbp-19-cfr-4-7a',
    'us-cbp-invoice-contents',
    'w5-ftr-30-1',
    'w5-ec-eori',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: ['/tools/invoice-generator', '/tools/packing-list-generator', '/tools/incoterms'],
  callout: {
    afterSection: 3,
    tool: '/tools/invoice-generator',
    title: 'Get the seller and buyer right first',
    text: 'The invoice generator takes the seller’s and the buyer’s names, addresses and tax numbers in one place, so the invoice states the sale clearly before the bill of lading is drawn up.',
  },
  related: [
    '/guides/eei-aes-filing-itn',
    '/blog/commercial-invoice-requirements',
    '/blog/packing-list-for-shipping',
    '/guides/eori-number',
  ],
  cover: {
    id: 'tnVdQGmWtb0',
    src: 'https://images.unsplash.com/photo-1617817546276-80b86dd60151',
    width: 6000,
    height: 4000,
    alt: 'Man standing beside stacked cardboard boxes, a shipment waiting to be handed to the carrier',
    caption: 'Man standing beside brown cardboard boxes',
    photographer: { name: 'Ismael Paramo', profile: 'https://unsplash.com/@ismaelparamo' },
    page: 'https://unsplash.com/photos/man-in-blue-crew-neck-t-shirt-standing-beside-brown-cardboard-boxes-tnVdQGmWtb0',
  },
};

export default article;
