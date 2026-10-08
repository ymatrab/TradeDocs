import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "letter of credit documents" 30; conversion role.
 * Plan: docs/research/content-plan-v3-2026-10-07.md (v2 #34), wave D. Angle: why the invoice,
 * packing list and transport document must agree under UCP 600. UCP 600 is described from ICC
 * pages without quoting rule text; process facts are from trade.gov. Opened 2026-10-08.
 * Example parties and figures are invented.
 */
const article: ContentArticle = {
  slug: 'letter-of-credit-documents',
  title: 'Letter of credit documents: why every detail has to match',
  metaTitle: 'Letter of credit documents: what must match',
  description:
    'Which documents a letter of credit asks for, why banks reject documents that disagree, the discrepancies ICC sees most often, and how to prepare a presentation that gets paid.',
  lede: 'A letter of credit pays you against documents, not against goods. If the commercial invoice, packing list and bill of lading tell slightly different stories, the bank can refuse to pay even though the cargo arrived in perfect order. The work that gets you paid happens at your desk, before the documents leave.',
  answer:
    'Letter of credit documents are the papers the credit lists as conditions of payment, usually a commercial invoice, packing list, transport document such as a bill of lading, and any certificates or insurance it names. Banks check them against the credit and each other; trade.gov says discrepancies must be amended and resubmitted before payment.',
  keyFacts: [
    'The ICC’s UCP 600, the 2007 revision of the Uniform Customs and Practice for Documentary Credits, has 39 articles and governs most credits issued today, according to ICC Academy.',
    'ICC Academy says banks have a maximum of five banking days after the day of presentation to examine documents under UCP 600.',
    'ICC Academy says documents are presented within 21 calendar days after shipment and in any case no later than the credit’s expiry date.',
    'The ITA’s trade.gov says letter of credit documents are detailed and prone to errors and discrepancies, which must be amended and resubmitted.',
    'ICC Academy says ISBP 821, published in 2023, explains how banks examine documents and does not modify UCP 600.',
  ],
  definitions: [
    {
      term: 'Letter of credit (documentary credit)',
      meaning:
        'A bank’s commitment, made for the buyer, to pay the seller when the seller presents documents that comply with the credit’s terms.',
    },
    {
      term: 'Presentation',
      meaning:
        'The set of documents the exporter delivers to the bank to claim payment under the credit.',
    },
    {
      term: 'Discrepancy',
      meaning:
        'Any point where a presented document fails the credit’s terms, the ICC rules or banking practice, or conflicts with another presented document.',
    },
    {
      term: 'ISBP',
      meaning:
        'The ICC’s International Standard Banking Practice, the guide banks use with UCP 600 when examining documents; the current version is ISBP 821.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'Which documents does a letter of credit require?',
      paragraphs: [
        'Whatever the credit itself lists, and nothing is assumed. trade.gov explains that the importer’s bank drafts the letter of credit from the terms of the sales agreement, so the document list starts in the contract you negotiate with the buyer.',
        'A typical list has a commercial invoice, a packing list and a transport document: a bill of lading for sea freight or an air waybill for air. Depending on the Incoterms® 2020 rule and the buyer’s market, it may add an insurance document, an inspection certificate, a proof of origin, which TradeDocs does not prepare, or other certificates issued by named bodies. Each one has to be issued by whoever the credit says, in the number of originals and copies it asks for.',
        'The ICC Academy advises agreeing the required documents, their content and who issues or signs them before the credit is issued. That conversation is the cheapest place to remove a document you cannot get or a condition you cannot meet.',
      ],
    },
    {
      heading: 'Why must letter of credit documents match exactly?',
      paragraphs: [
        'Because the banks pay on the documents alone. ICC Academy describes UCP 600 as the ICC rules for documentary credits and says banks examine documents only; nobody at the bank inspects the goods. A document that disagrees with the credit, or with another document in the set, gives the bank grounds to refuse.',
        'The standard is consistency, not photocopying. ICC Academy’s guidance on discrepancies says documents must be consistent and must not contradict one another, and that the commercial invoice is held to more specific standards than the others, which may describe goods in general terms as long as they do not conflict with the credit. So the invoice should carry the goods description as the credit states it, while the bill of lading can say “machine parts” if that does not contradict anything.',
        'trade.gov describes the sequence: you ship, submit the documents to your bank, the bank checks them against the credit, and discrepancies must be amended and resubmitted before the complying documents go to the importer’s bank for payment.',
      ],
    },
    {
      heading: 'What has to agree between the invoice, packing list and bill of lading?',
      paragraphs: [
        'Every fact that appears on more than one document. The table shows data points that typically appear on all three and how a mismatch looks.',
      ],
      table: {
        caption: 'Worked example with invented parties and figures: one shipment, three documents',
        head: ['Data point', 'Invoice', 'Packing list', 'Bill of lading', 'Problem?'],
        rows: [
          [
            'Beneficiary name',
            'Harrow Valve Co. Ltd',
            'Harrow Valve Co. Ltd',
            'Harrow Valve Company',
            'Check against the credit; a different name is a common discrepancy',
          ],
          ['Packages', '12 pallets', '12 pallets', '12 pallets', 'Consistent'],
          [
            'Gross weight',
            '—',
            '6,480 kg',
            '6,840 kg',
            'Conflict: transposed digits between packing list and bill of lading',
          ],
          [
            'Port of loading',
            'Felixstowe',
            'Felixstowe',
            'Felixstowe',
            'Must also match the port the credit names',
          ],
          ['Shipping marks', 'HVC/0412/1-12', 'HVC/0412/1-12', 'HVC/0412/1-12', 'Consistent'],
        ],
      },
    },
    {
      heading: 'What are the most common letter of credit discrepancies?',
      paragraphs: [
        'ICC Academy groups them by document. Most come from data typed more than once by different people, or from a condition in the credit that nobody read closely.',
      ],
      list: [
        'Invoice: wrong currency, unit price, total value or goods description; small typing errors that make it differ from the credit.',
        'Transport document: missing signature, wrong shipment date, a carrier the credit does not allow, or the wrong port of loading or discharge.',
        'Insurance document: insufficient cover, the wrong currency or a missing endorsement.',
        'Between documents: different beneficiary names, goods descriptions, quantities or shipment details, such as an invoice that disagrees with the bill of lading.',
        'Timing: documents presented after the permitted period or after the credit expires.',
        'Certificates: missing signatures, an issuer the credit does not name, or a wrong reference to the credit.',
        'Alterations: corrections made without proper authentication.',
      ],
    },
    {
      heading: 'How do you prepare a presentation that gets paid?',
      paragraphs: [
        'Treat the credit as the specification and build every document from one set of data. The steps follow ICC Academy and trade.gov guidance; your bank’s own checklist comes first.',
      ],
      steps: [
        'When the credit arrives, read every condition, including the additional conditions field, which ICC Academy warns often hides problems; ask for an amendment at once if you cannot comply.',
        'Note the latest shipment date, the presentation period and the expiry date and place.',
        'Enter the parties, goods description, quantities, weights and marks once, and generate the invoice and packing list from that single record.',
        'Give your forwarder the same data for the bill of lading or air waybill, and check its draft before it is issued.',
        'Collect the certificates and insurance document the credit lists, from the issuers it names.',
        'Check the whole set against the credit and against each other, line by line, before it goes to the bank.',
        'Present within the period the credit allows; if a document is wrong, have it reissued rather than corrected by hand.',
      ],
    },
    {
      heading: 'How long do you have to present the documents?',
      paragraphs: [
        'ICC Academy says presentation is due within 21 calendar days after shipment, and in any case no later than the expiry date of the credit, unless the credit sets its own period. Documents that arrive late do not comply, however good they are.',
        'Build that window into the shipment plan. A bill of lading issued days after loading, or a certificate that needs an appointment, eats into it. On the other side, ICC Academy says the banks have a maximum of five banking days after the day of presentation to examine the documents.',
      ],
    },
    {
      heading: 'What happens if the bank finds a discrepancy?',
      paragraphs: [
        'Payment stops until it is fixed or accepted. trade.gov says errors and discrepancies must be amended and resubmitted, and that discrepancies can cause payment delays and extra fees. If the presentation period or the credit expires while you fix them, you may lose the protection of the credit and be left with an unpaid shipment.',
        'trade.gov’s advice is to prevent them: it recommends having trained professionals prepare the documents, and asking your bank before the buyer applies what a credit will cost, who pays the fees and how disputes are resolved.',
      ],
    },
  ],
  faq: [
    {
      q: 'Does a letter of credit always require a packing list?',
      a: 'Only if the credit lists one. Banks examine the documents the credit asks for. Many credits do include a packing list, and when it is presented it must not conflict with the invoice or transport document.',
    },
    {
      q: 'Is a typing error on an invoice always a discrepancy?',
      a: 'Not always, but ICC Academy warns that small spelling or numerical errors can create a discrepancy when they make the invoice differ from the credit. Reissue the document rather than risk it.',
    },
    {
      q: 'Can I correct a document by hand before presenting it?',
      a: 'ICC Academy advises reissuing a document rather than correcting it, because corrections can be treated as alterations that need proper authentication.',
    },
    {
      q: 'Does UCP 600 apply to every letter of credit?',
      a: 'It applies when the credit is issued subject to it. ICC Academy says most modern credits are, and that ISBP 821 explains how banks apply UCP 600 when examining documents.',
    },
    {
      q: 'Who checks the documents before the buyer’s bank sees them?',
      a: 'Your own bank first. trade.gov describes the exporter’s bank checking the documents for compliance and sending the complying set to the importer’s bank.',
    },
  ],
  sources: [
    'a4-icc-documentary-credits',
    'd4-icc-isbp-discrepancies',
    'a4-trade-gov-letter-of-credit',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: [
    '/tools/invoice-generator',
    '/tools/packing-list-generator',
    '/tools/proforma-invoice-generator',
  ],
  callout: {
    afterSection: 2,
    tool: '/tools/packing-list-generator',
    title: 'Make the packing list from the invoice data',
    text: 'Typing the same weights and marks twice is how documents drift apart. Build the invoice, then create the packing list from the same goods lines in the packing list generator.',
  },
  related: [
    '/guides/export-payment-terms',
    '/blog/commercial-invoice-and-packing-list-must-match',
    '/blog/partial-shipments',
    '/blog/how-to-fill-out-a-commercial-invoice',
    '/guides/what-is-a-bill-of-lading',
    '/blog/tt-payment',
  ],
  cover: {
    id: 'h9F2mPCfUKk',
    src: 'https://images.unsplash.com/photo-1661156901266-5490bcba9f35',
    width: 4032,
    height: 3024,
    alt: 'A worker loading a pallet into a lorry, the shipment a letter of credit’s documents have to describe',
    caption: 'A pallet being loaded into a truck',
    photographer: { name: 'Krisana Nakajo', profile: 'https://unsplash.com/@krisanan' },
    page: 'https://unsplash.com/photos/a-person-loading-a-large-truck-h9F2mPCfUKk',
  },
};

export default article;
