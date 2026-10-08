import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "partial shipment" 320; "split shipment" 140.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave C.
 */
const article: ContentArticle = {
  slug: 'partial-shipments',
  title: 'Partial shipments: how to ship one order in several lots',
  metaTitle: 'Partial shipment vs split shipment explained',
  description:
    'What a partial shipment is, how it differs from a split shipment, when a letter of credit allows it, and how to invoice, pack and declare each lot so the documents still add up.',
  lede: 'Orders do not always leave in one piece. Production runs late, a container fills up, or the buyer wants half now and half next month. Shipping an order in lots is normal, but the sales contract, the letter of credit and customs each have rules about it, and every lot needs documents that describe only what is in it.',
  answer:
    'A partial shipment sends one order in two or more lots, each with its own transport document, invoice and packing list. It needs the buyer’s agreement: under UCC § 2-307 goods are delivered in a single lot unless otherwise agreed, while UCP 600 allows partial shipments under a letter of credit unless the credit prohibits them.',
  keyFacts: [
    'Under UCC § 2-307, all goods called for by a contract for sale must be tendered in a single delivery unless otherwise agreed.',
    'The ICC confirms that UCP 600 sub-article 31(a) allows partial drawings or shipments, so a credit silent on the point allows them.',
    'Under 19 CFR 141.57, CBP can process a split shipment under one entry if the remaining portions arrive within 10 calendar days of the first.',
    'Under 15 CFR 30.28, an export split by the carrier needs no new EEI record if the parts leave within 24 hours by vessel or 7 days by air, truck or rail.',
    'Under 19 CFR 141.86, a US import invoice must state what merchandise is in each individual package.',
  ],
  definitions: [
    {
      term: 'Partial shipment',
      meaning:
        'One order shipped in two or more lots, each under its own transport document, by the seller’s choice or agreement.',
    },
    {
      term: 'Split shipment',
      meaning:
        'One consignment booked under a single bill of lading or waybill that the carrier divides across conveyances.',
    },
    {
      term: 'Instalment shipment',
      meaning:
        'Partial shipments made to a schedule set in the contract or the letter of credit, such as monthly lots.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is a partial shipment?',
      paragraphs: [
        'A partial shipment is an order that leaves in more than one lot, each moving under its own transport document. The seller ships part of the goods now and the rest later, on another sailing, flight or truck.',
        'It is a commercial decision that needs the buyer’s agreement, because the default is one delivery. Under UCC § 2-307, which governs most US sales of goods, all goods called for by a contract for sale must be tendered in a single delivery unless otherwise agreed, and payment is due only on that tender. Where lots are allowed, the price can be demanded for each lot if it can be apportioned. Other countries’ sales laws differ, so write the rule into the contract either way.',
        'Put it on the proforma invoice or the sales contract in plain words: “partial shipments allowed” or “partial shipments not allowed”, and the number of lots or the schedule if there is one.',
      ],
    },
    {
      heading: 'How is a partial shipment different from a split shipment?',
      paragraphs: [
        'The difference is who divides the goods and under how many transport documents. In a partial shipment the seller divides the order and each lot gets its own bill of lading or waybill. In a split shipment the goods are booked under one document and the carrier divides them, for example because they do not fit on one flight.',
        'CBP’s rule for imports uses exactly that test: under 19 CFR 141.57, a split shipment is delivered to the carrier under one bill of lading or waybill and then divided by the carrier, with the portions consigned to the same party in the United States. Transshipment is something else again: moving goods from one means of transport to another under customs control on the way.',
      ],
      table: {
        caption: 'Partial shipment and split shipment compared',
        head: ['', 'Partial shipment', 'Split shipment'],
        rows: [
          ['Who divides the goods', 'The seller', 'The carrier'],
          ['Transport documents', 'One per lot', 'One for the whole consignment'],
          ['Commercial invoices', 'Usually one per lot', 'One for the consignment'],
          [
            'Needs the buyer’s agreement',
            'Yes, under the contract',
            'Not usually; it is a carrier decision',
          ],
          [
            'US import entry',
            'Each lot entered on arrival',
            'One entry possible under 19 CFR 141.57',
          ],
        ],
      },
    },
    {
      heading: 'Are partial shipments allowed under a letter of credit?',
      paragraphs: [
        'Yes, unless the credit says otherwise. The ICC’s own guidance on UCP 600 explains that sub-article 31(a) provides the rule that partial drawings or shipments are allowed, so if they are to be allowed the credit can stay silent and the rule applies automatically.',
        'Read the credit for the words “partial shipments prohibited” or a fixed instalment schedule. If partial shipments are prohibited, all the goods must be shipped and presented together. If the credit sets instalments, each lot has its own shipment period and set of documents; check the exact wording with your bank before the first lot leaves.',
        'Every presentation is checked against the credit. The International Trade Administration notes that the exporter’s bank checks the documents for compliance and that errors must be amended and resubmitted, so the quantities on each lot’s invoice, packing list and bill of lading need to agree.',
      ],
    },
    {
      heading: 'How do you invoice and pack a partial shipment?',
      paragraphs: [
        'Give each lot its own commercial invoice and packing list, describing only the goods in that lot. The International Trade Administration notes that customs uses the commercial invoice to determine duties, and under 19 CFR 141.86 a US import invoice must state what merchandise is in each individual package, so an invoice for the whole order on the first lot misdescribes the shipment.',
        'Reference the order on every invoice, number the lots (“shipment 1 of 2”), and keep the unit prices identical to the proforma. The worked example below shows one order shipped in two lots.',
      ],
      table: {
        caption: 'Worked example with invented parties and figures: one order shipped in two lots',
        head: ['', 'Order PO-4471', 'Lot 1', 'Lot 2'],
        rows: [
          ['Goods', '1,200 ceramic mugs', '500 ceramic mugs', '700 ceramic mugs'],
          ['Cartons', '50', '21', '29'],
          ['Invoice', 'Proforma PI-2026-014', 'INV-2026-031', 'INV-2026-044'],
          ['Invoice value at an invented $4.00 each', '$4,800.00', '$2,000.00', '$2,800.00'],
          ['Transport document', 'None yet', 'Bill of lading 1', 'Bill of lading 2'],
        ],
      },
    },
    {
      heading: 'How does US customs handle a split shipment?',
      paragraphs: [
        'At the importer’s election, CBP can process it under a single entry. Under 19 CFR 141.57, the portions must arrive at the port of entry shown on the original bill of lading or waybill, and all the remaining portions must arrive within 10 calendar days of the first; later ones need separate entries. The importer notifies CBP in writing before the entry summary is filed.',
        'It is a facility, not a right. The rule lets the port director deny incremental release, and CBP may examine any or all parts of the shipment. A partial shipment, with a separate bill of lading per lot, is normally entered lot by lot.',
      ],
    },
    {
      heading: 'How is a split export reported in AES?',
      paragraphs: [
        'Under 15 CFR 30.28, a split shipment is one covered by a single EEI record and booked on one conveyance that the exporting carrier then divides. If the later parts leave within 24 hours by vessel, or within 7 days by air, truck or rail, no new EEI record is needed; after that, a new record is filed and the original is amended.',
        'The carrier marks each manifest “SPLIT SHIPMENT” with the part number, such as “4 of 10”, and the last one “SPLIT SHIPMENT, FINAL”. A partial shipment that you divide yourself is a separate shipment, with its own transport document and, where one is required, its own EEI filing.',
        'Do not divide an order to stay under a filing threshold or a duty limit. Ship in lots when the goods, the buyer or the transport need it, and declare each lot as it is.',
      ],
    },
  ],
  faq: [
    {
      q: 'Does each partial shipment need its own packing list?',
      a: 'In practice, yes. The International Trade Administration notes that customs uses the packing list to check what is in each package, and each lot has different cartons, weights and marks. Generate it from the same lines as that lot’s invoice.',
    },
    {
      q: 'Can a seller ship partially if the contract says nothing?',
      a: 'Under US commercial law the default is one delivery: UCC § 2-307 requires all goods to be tendered in a single delivery unless otherwise agreed. Other legal systems differ, so state the rule in the contract and on the proforma invoice.',
    },
    {
      q: 'What does “partial shipments prohibited” mean on a letter of credit?',
      a: 'It overrides the UCP 600 default that partial shipments are allowed. The goods must be shipped together and the documents presented in a single drawing, so plan production and booking around one sailing or flight.',
    },
    {
      q: 'Is a split shipment the same as transshipment?',
      a: 'No. A split shipment divides one consignment across conveyances. Transshipment moves goods from one means of transport to another under customs control on the way, and a credit or contract may treat it separately.',
    },
  ],
  sources: [
    'c1-ucc-2-307',
    'c1-icc-ucp-31-partial-shipments',
    'a2-trade-gov-letter-of-credit',
    'c1-cfr-19-141-57',
    'c1-ftr-30-28',
    'a2-cornell-19-cfr-141-86',
    'trade-gov-commercial-invoice',
    'trade-gov-packing-list',
    'b7-wco-rkc-transhipment',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: [
    '/tools/invoice-generator',
    '/tools/packing-list-generator',
    '/tools/proforma-invoice-generator',
  ],
  callout: {
    afterSection: 3,
    tool: '/tools/packing-list-generator',
    title: 'One invoice and packing list per lot',
    text: 'Copy the order’s lines, keep only what ships in this lot, and generate a matching commercial invoice and packing list with the right carton count and weights.',
  },
  related: [
    '/blog/commercial-invoice-requirements',
    '/blog/packing-list-for-shipping',
    '/blog/commercial-invoice-and-packing-list-must-match',
    '/guides/export-payment-terms',
    '/guides/eei-aes-filing-itn',
    '/guides/how-to-import-into-the-us',
  ],
  cover: {
    id: '1e_-zA4uf1k',
    src: 'https://images.unsplash.com/photo-1774929104680-bf61cc6f845d',
    width: 4608,
    height: 3456,
    alt: 'A container ship being loaded by large cranes at a port, one lot of an order going aboard',
    caption: 'A container ship loading under cranes at North Port, Manila',
    photographer: { name: 'PortCalls Asia', profile: 'https://unsplash.com/@portcalls' },
    page: 'https://unsplash.com/photos/container-ship-being-loaded-by-large-cranes-at-port-1e_-zA4uf1k',
  },
};

export default article;
