import { BYLINE, type ContentArticle } from '@/lib/content/article';

const BLOG_ROUND = '2026-10-06';

/**
 * Demand (DataForSEO, Google US, 2026-10-05): "shipping documents" 590, "export documents" 260,
 * "export documentation" 260.
 */
const article: ContentArticle = {
  slug: 'export-documents-checklist',
  title: 'Export documents checklist for small exporters',
  metaTitle: 'Export documents checklist for small exporters',
  description:
    'The shipping documents a typical export needs, who prepares each one, when it is issued and who reads it: proforma, commercial invoice, packing list, bill of lading, EEI and licences.',
  lede: 'A first export usually fails on paperwork, not on freight. This checklist lists the documents a typical shipment uses, who produces each one and in what order, so nothing is missing when the goods reach the port.',
  answer:
    'Most exports need a commercial invoice, a packing list and a transport document: a bill of lading for sea freight or an air waybill for air. Many also need a proforma invoice before the sale, an export filing such as Electronic Export Information in the U.S., and, for some goods or destinations, an export licence or proof of origin.',
  keyFacts: [
    'The commercial invoice, the packing list and the transport document are the core of almost every export shipment.',
    'A bill of lading is the contract between the owner of the goods and the carrier; for ocean freight it can be negotiable.',
    'In the United States, Electronic Export Information is filed in the Automated Export System when a Schedule B line is worth over $2,500 or another filing requirement applies.',
    'An export licence authorises specific goods, in specific quantities, to a particular destination.',
    'The seller prepares the invoice and packing list; the carrier issues the transport document.',
  ],
  definitions: [
    {
      term: 'Bill of lading',
      meaning:
        'The carrier’s receipt and contract of carriage for sea freight; an original may be needed to collect the goods.',
    },
    {
      term: 'Air waybill',
      meaning: 'The transport document that accompanies an air freight shipment.',
    },
    {
      term: 'EEI (Electronic Export Information)',
      meaning: 'The U.S. export data filed through the Automated Export System (AES).',
    },
    {
      term: 'Destination control statement',
      meaning:
        'A statement on the invoice or shipping documents telling the parties the goods are subject to export restrictions.',
    },
  ],
  published: BLOG_ROUND,
  updated: BLOG_ROUND,
  reviewed: BLOG_ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'Which documents does an export shipment need?',
      paragraphs: [
        'The exact set depends on the goods, the destination, the mode of transport and the payment terms. The U.S. International Trade Administration’s list of common export documents is a good map of what a typical shipment can involve. The table sorts them by who produces them and when.',
      ],
      table: {
        caption: 'Common export documents, who issues them and when',
        head: ['Document', 'Who issues it', 'When', 'Who relies on it'],
        rows: [
          [
            'Proforma invoice',
            'Seller',
            'Before the sale is final',
            'Buyer, its bank, licensing bodies',
          ],
          ['Commercial invoice', 'Seller', 'When the goods ship', 'Buyer, customs at both ends'],
          ['Packing list', 'Seller', 'When the goods are packed', 'Forwarder, customs, buyer'],
          [
            'Bill of lading',
            'Ocean carrier',
            'When the goods are received or loaded',
            'Buyer, banks, the carrier at destination',
          ],
          [
            'Air waybill',
            'Air carrier or its agent',
            'When the goods are accepted',
            'Buyer, the airline, customs',
          ],
          ['EEI filing (U.S.)', 'Exporter or its agent', 'Before export', 'U.S. government'],
          [
            'Export licence',
            'Export control authority',
            'Before shipment, where required',
            'Customs, the carrier',
          ],
        ],
      },
    },
    {
      heading: 'Which documents do you prepare yourself?',
      paragraphs: [
        'Three documents are the seller’s own work, and they are the ones most often wrong because they are typed separately from each other.',
        'The proforma invoice quotes the deal before it is final, so the buyer can arrange payment or a licence. The commercial invoice bills the goods actually shipped and is what customs in the importing country values them from. The packing list itemises the contents, weights and measurements of each package; the ITA notes that forwarders use it to work out freight and customs use it to check the contents.',
        'All three describe the same goods. Prepared from one set of figures, they agree; typed three times, they drift, and a difference between the invoice and the packing list is one of the commonest reasons for a customs query.',
        'Keep the quotation, the confirmed order and the final packing figures together. The proforma is written from the quotation, but the commercial invoice and the packing list must be written from what was actually packed, because that is what the forwarder will weigh and customs may open.',
      ],
    },
    {
      heading: 'Which documents do carriers and authorities issue?',
      paragraphs: [
        'The transport document comes from the carrier. For sea freight it is the bill of lading, which the ITA describes as a contract between the owner of the goods and the carrier. It can be negotiable, and the buyer usually needs an original to take the goods. For air freight it is the air waybill.',
        'In the United States, Electronic Export Information (EEI) is filed through the Automated Export System. The ITA states it is required when the value of the goods under a single Schedule B number is over $2,500, or when another mandatory filing requirement applies, such as goods that need a licence. Other countries have their own export declaration, usually lodged by the exporter or its forwarder.',
        'Some goods need an export licence: a government document authorising specific goods, in specific quantities, to a particular destination. Controlled goods may also need a destination control statement on the invoice. Where a trade agreement, the buyer’s bank or the importing country asks for proof of origin, that is a separate document with its own issuing rules. TradeDocs does not prepare licences or origin documents.',
      ],
    },
    {
      heading: 'In what order are export documents prepared?',
      paragraphs: [
        'The order follows the shipment. Getting it right means each document is built on figures that are already settled.',
      ],
      steps: [
        'Quote the deal with a proforma invoice, naming the Incoterms® rule, its place and the version.',
        'Once the order is confirmed and payment is arranged, check whether the goods or the destination need a licence.',
        'Pack the goods and record each package’s contents, dimensions and weights on the packing list.',
        'Issue the commercial invoice from the same figures, with the HS codes and country of origin.',
        'Book the transport and give the forwarder the invoice and packing list.',
        'File the export declaration, such as EEI in the U.S., where required.',
        'Collect the bill of lading or air waybill and send the document set to the buyer or its bank.',
      ],
    },
    {
      heading: 'What does the checklist look like before the goods leave?',
      paragraphs: [
        'Run through this list for every shipment, not only the first one. Each line is a question with a yes or no answer.',
      ],
      list: [
        'Do the seller, buyer and consignee appear the same way on every document?',
        'Do the invoice and the packing list show the same lines, quantities and package count?',
        'Do the net and gross weights on the packing list match what the forwarder will weigh?',
        'Does every invoice line have a plain description, an HS code and a country of origin?',
        'Is the Incoterms® rule written with its named place and version, the same on every document?',
        'Has the export declaration been filed where one is required?',
        'If payment is by letter of credit, does every document match the credit’s wording exactly?',
      ],
    },
  ],
  faq: [
    {
      q: 'What are the three main export documents?',
      a: 'The commercial invoice, the packing list and the transport document, which is a bill of lading for sea freight or an air waybill for air freight. Most other documents depend on the goods, the destination or the payment terms.',
    },
    {
      q: 'Who prepares the bill of lading?',
      a: 'The carrier or its agent issues it, usually from shipping instructions the exporter or its forwarder provides. The exporter checks the draft against the invoice and packing list before it is issued.',
    },
    {
      q: 'When is EEI required for U.S. exports?',
      a: 'According to the U.S. International Trade Administration, when the value of the goods under one Schedule B number is over $2,500, or when another mandatory filing requirement applies, such as goods that need an export licence.',
    },
    {
      q: 'Do small shipments need a commercial invoice?',
      a: 'Yes, for goods crossing a border, whatever the size.',
    },
    {
      q: 'Which export documents must match each other?',
      a: 'The commercial invoice, the packing list and the transport document must agree on the parties, the goods, the package count and the weights. Where payment is by letter of credit, every document must also match the credit’s terms.',
    },
  ],
  sources: [
    'trade-gov-export-documents',
    'trade-gov-commercial-invoice',
    'trade-gov-packing-list',
    'trade-gov-proforma-invoice',
    'icc-incoterms-2020',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: [
    '/tools/invoice-generator',
    '/tools/packing-list-generator',
    '/tools/proforma-invoice-generator',
  ],
  callout: {
    afterSection: 1,
    tool: '/tools/packing-list-generator',
    title: 'Prepare the packing list alongside the invoice',
    text: 'The packing list generator itemises packages with net and gross weights per line and downloads a PDF, so the figures match the invoice you send with it.',
  },
  cover: {
    id: 'zQCDJZLS-Ms',
    src: 'https://images.unsplash.com/photo-1743385779431-45d26d9775b1',
    width: 7008,
    height: 4672,
    alt: 'Clipboard with a pencil and pen on a wooden desk, ready for working through an export documents checklist',
    caption: 'Clipboard, pencil and pen on a wooden surface',
    photographer: { name: 'Kelly Sikkema', profile: 'https://unsplash.com/@kellysikkema' },
    page: 'https://unsplash.com/photos/clipboard-pencil-and-pen-on-a-wooden-surface-zQCDJZLS-Ms',
  },
};

export default article;
