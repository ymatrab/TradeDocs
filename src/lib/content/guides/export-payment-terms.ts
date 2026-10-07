import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "letter of credit" 5,400, KD 15; "what is a letter
 * of credit" 2,400; "advance payment" 6,600; "open account" 1,900; "documentary credit" 1,000;
 * "documentary collection" 90.
 * Plan: docs/research/content-plan-v2-2026-10-06.md #18, carried into v3 wave A.
 * Explains the methods; never recommends one for a reader's deal. No bank fees quoted.
 */
const article: ContentArticle = {
  slug: 'export-payment-terms',
  title: 'Export payment terms: letter of credit, collection or open account',
  metaTitle: 'Letter of credit and other export payment terms',
  description:
    'Cash in advance, letters of credit, documentary collections and open account compared: the risk each puts on seller and buyer, and the documents each one depends on.',
  lede:
    'How you get paid decides how much of the shipment is really at risk. The five usual payment methods move that risk between seller and buyer in steps, and the safer ones for the seller depend on documents being exactly right.',
  answer:
    'A letter of credit is a commitment by the buyer’s bank to pay the exporter once the documents the credit requires are presented and comply. It sits between cash in advance, safest for the seller, and open account, safest for the buyer. Documentary collections use banks to exchange documents for payment without a bank guarantee.',
  keyFacts: [
    'The International Trade Administration (ITA) ranks cash in advance as the lowest-risk method for the exporter and open account and consignment as the highest.',
    'The ITA describes a letter of credit as a commitment by the buyer’s bank to pay once the exporter ships and presents the required documents.',
    'Under UCP 600, the ICC’s rules for documentary credits, banks examine documents only and have up to five banking days to examine a presentation.',
    'In a documentary collection, the ITA notes, banks do not verify the documents or guarantee payment.',
    'Under open account, the ITA says goods are shipped and delivered before payment is due, typically in 30, 60 or 90 days.',
  ],
  definitions: [
    {
      term: 'Letter of credit (documentary credit)',
      meaning:
        'A bank’s undertaking, on the buyer’s behalf, to pay the seller against documents that comply with the credit’s terms.',
    },
    {
      term: 'Documentary collection',
      meaning:
        'The seller’s bank sends the shipping documents to the buyer’s bank, which releases them against payment or acceptance.',
    },
    {
      term: 'D/P and D/A',
      meaning:
        'Documents against payment and documents against acceptance: the two ways a collection releases documents to the buyer.',
    },
    {
      term: 'Open account',
      meaning:
        'The seller ships and invoices, and the buyer pays on agreed credit terms after delivery.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What are the main export payment methods?',
      paragraphs: [
        'The ITA’s Trade Finance Guide sets out five, ordered by how much risk they leave with the exporter. Moving down the table, the seller takes on more risk and the buyer less, which is why the safest terms for the seller are also the hardest to sell to a buyer who has a choice.',
      ],
      table: {
        caption:
          'The five methods of payment and their risk, following the ITA Trade Finance Guide',
        head: ['Method', 'When the seller is paid', 'Risk to exporter', 'Risk to importer'],
        rows: [
          ['Cash in advance', 'Before the goods ship', 'Lowest', 'Highest'],
          ['Letter of credit', 'When complying documents are presented', 'Low', 'Moderate'],
          [
            'Documentary collection',
            'When the buyer pays or accepts against the documents',
            'Moderate',
            'Low',
          ],
          ['Open account', 'After delivery, on agreed terms', 'Highest', 'Lowest'],
          ['Consignment', 'After the buyer’s customer pays', 'Highest', 'Lowest'],
        ],
      },
    },
    {
      heading: 'What is a letter of credit?',
      paragraphs: [
        'It is a bank’s promise to pay instead of the buyer’s. The ITA describes it as a contractual commitment by the foreign buyer’s bank to pay once the exporter ships the goods and presents the required documents. The seller is relying on the bank’s credit, not the buyer’s, provided it meets the conditions in the credit.',
        'A letter of credit is usually issued subject to UCP 600, the International Chamber of Commerce’s rules for documentary credits, which apply when the credit says so. Under those rules banks deal with documents, not goods: they check that the documents presented comply with the terms of the credit, the rules and international standard banking practice, and they have a maximum of five banking days after presentation to do it.',
      ],
    },
    {
      heading: 'Why do letter of credit documents get rejected?',
      paragraphs: [
        'Because the bank checks the paper, not the shipment. The ITA warns that the documents a letter of credit requires are detailed and prone to errors and discrepancies, and a discrepancy can delay payment or add fees. An invoice description that differs from the credit, or a quantity that does not match the packing list, is the kind of mismatch the bank’s checker is looking for.',
        'The ICC publishes ISBP 821, guidance on how banks examine documents under UCP 600. It does not change the rules, but it shows how strictly the documents are read. The safest approach is to prepare the invoice, packing list and transport details from the wording of the credit itself, and to check them against each other before presenting.',
      ],
    },
    {
      heading: 'What is a documentary collection?',
      paragraphs: [
        'It is a way of using banks as couriers with conditions. The exporter’s bank sends the shipping documents to the buyer’s bank with instructions to release them only against payment (documents against payment, D/P) or against the buyer’s signed acceptance of a bill of exchange that commits it to pay later (documents against acceptance, D/A). The ICC’s rules for collections are URC 522.',
        'The ITA is clear about the limit: banks in a collection do not verify that the documents are accurate and do not guarantee payment as they do with letters of credit. If the buyer does not pay, the exporter typically has to find another buyer, pay for the goods to come back, or abandon them. The ITA suggests collections for established relationships in stable markets, where they are faster and cheaper than a letter of credit.',
      ],
    },
    {
      heading: 'When do cash in advance and open account make sense?',
      paragraphs: [
        'Cash in advance removes the seller’s credit risk, because payment arrives before the goods leave; the ITA notes it carries the highest risk for the buyer, which is why many buyers resist it. When a buyer does pay in advance, it is usually paying against your proforma invoice, so the proforma has to carry the payment terms and your bank details.',
        'Open account is the reverse: the goods are shipped and delivered before payment is due, typically in 30, 60 or 90 days, so the exporter carries the whole risk. The ITA places it, with consignment, at the highest risk for the exporter. Offering it is a credit decision: the question is whether you would lend this buyer the invoice value for that long.',
      ],
    },
    {
      heading: 'How do you choose payment terms for an export?',
      paragraphs: [
        'There is no single right answer; it depends on the buyer, the market and the order. These questions follow the ITA’s guidance and help you decide what to propose.',
      ],
      steps: [
        'Assess the buyer: is this a new relationship, and is their credit known?',
        'Assess the market: is the buyer’s country economically and politically stable?',
        'Weigh the order: how much can you afford to lose if it goes unpaid?',
        'Ask your bank what a letter of credit or collection would cost and who pays the fees.',
        'Put the agreed method on the proforma invoice, and keep the wording identical on later documents.',
      ],
    },
    {
      heading: 'Where does the proforma invoice fit in?',
      paragraphs: [
        'It usually comes first. The ITA notes that a buyer may need a pro forma invoice to open a letter of credit, and the credit then repeats its description, quantity and price. Under cash in advance, the proforma is what the buyer pays against. In both cases the commercial invoice you issue at shipment has to tell the same story, so draft the proforma carefully and reuse its wording.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is a letter of credit the same as a documentary credit?',
      a:
        'Yes. The ICC’s rules call it a documentary credit; in practice both names describe a bank’s undertaking to pay against documents that comply with the credit.',
    },
    {
      q: 'Who pays for a letter of credit?',
      a:
        'It is a matter for the contract and the banks. The ITA describes letters of credit as relatively expensive because of bank fees, and suggests asking your bank what one costs and who pays before you agree terms.',
    },
    {
      q: 'What is the difference between D/P and D/A?',
      a:
        'Under D/P the buyer’s bank releases the documents when the buyer pays. Under D/A it releases them when the buyer accepts a bill of exchange promising to pay at a later date.',
    },
    {
      q: 'Does a letter of credit guarantee I will be paid?',
      a:
        'Only if your documents comply with the credit. The bank’s commitment is to pay against a complying presentation, so discrepancies can delay or put payment at risk.',
    },
    {
      q: 'Which payment term is safest for the buyer?',
      a:
        'Open account and consignment, according to the ITA, because the buyer receives the goods before it pays.',
    },
  ],
  sources: [
    'a4-trade-gov-methods-of-payment',
    'a4-trade-gov-letter-of-credit',
    'a4-trade-gov-documentary-collections',
    'a4-icc-documentary-credits',
    'trade-gov-proforma-invoice',
  ],
  primaryTool: '/tools/proforma-invoice-generator',
  callout: {
    afterSection: 2,
    tool: '/tools/proforma-invoice-generator',
    title: 'Start the letter of credit with a clean proforma',
    text:
      'The proforma invoice generator carries the payment terms, Incoterms® rule, buyer’s reference and validity date a bank will read when the credit is opened.',
  },
  tools: [
    '/tools/proforma-invoice-generator',
    '/tools/invoice-generator',
    '/tools/packing-list-generator',
  ],
  related: [
    '/guides/proforma-vs-commercial-invoice',
    '/blog/proforma-invoice-example',
    '/guides/what-is-a-bill-of-lading',
    '/blog/export-documents-checklist',
  ],
  cover: {
    id: 'OQMZwNd3ThU',
    src: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85',
    width: 7360,
    height: 4912,
    alt:
      'Person signing a document at a desk, as a buyer or bank would when agreeing payment terms',
    caption: 'Signing a document at a desk',
    photographer: { name: 'Scott Graham', profile: 'https://unsplash.com/@amstram' },
    page: 'https://unsplash.com/photos/man-writing-on-paper-OQMZwNd3ThU',
  },
};

export default article;
