import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "commercial invoice and packing list" 40;
 * "ci pl" 30; "invoice and packing list" 30. Product-led (conversion role): the last section
 * describes the workspace reconciliation (src/lib/trade/packing.ts, the shipment packing panel)
 * and document staleness as they exist in the code.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave A.
 */
const article: ContentArticle = {
  slug: 'commercial-invoice-and-packing-list-must-match',
  title: 'Why your commercial invoice and packing list must match',
  metaTitle: 'Commercial invoice and packing list must match',
  description:
    'Which fields on a commercial invoice and its packing list have to agree, what a mismatch looks like, how to fix one, and where the two documents may differ.',
  lede: 'The commercial invoice and the packing list describe one shipment from two sides: the sale and the boxes. Customs, the forwarder, the buyer and, under a letter of credit, the bank read them together. When they disagree, someone has to stop and find out which one is right.',
  answer:
    'The commercial invoice and packing list must match on the parties, the invoice reference, the description of each product, the quantity of each line, the number of packages, the marks and the weights. Only the prices stay off the packing list. A mismatch gives customs or a bank two accounts of one shipment to resolve.',
  keyFacts: [
    'Under 19 CFR 141.86(e), a US import invoice must state in adequate detail what merchandise is in each individual package.',
    '19 CFR 141.86(i) allows invoice information to be given on an attachment, such as a packing list.',
    'The ITA says customs officials use the packing list to check the contents of a specific package or carton.',
    'The ITA says the exporter’s bank checks documents for compliance with a letter of credit, and discrepancies must be amended and resubmitted.',
    'The CBSA’s invoice fields for Canadian imports include the number of packages and both net and gross weight.',
  ],
  definitions: [
    {
      term: 'Discrepancy',
      meaning:
        'A difference between documents, or between a document and the letter of credit, that a bank or customs officer notices.',
    },
    {
      term: 'Reconciliation',
      meaning: 'Checking that each line’s packed quantity equals its invoiced quantity.',
    },
    {
      term: 'Gross weight',
      meaning: 'The weight of the goods with all their packing, as the carrier weighs it.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'Why must the commercial invoice and packing list match?',
      paragraphs: [
        'Because the people who read them compare one against the other. The ITA describes the commercial invoice as the document customs uses to assess duties, and the packing list as the one customs uses to check what is inside a specific package. An officer who opens a carton, finds the goods the packing list names and then sees a different quantity on the invoice cannot tell which figure to value.',
        'For a US entry the link is written into the regulation. 19 CFR 141.86(e) requires the invoice to state what merchandise is in each individual package, and 141.86(i) allows invoice information to be given on an attachment. A packing list attached to the invoice is therefore part of the invoice information, not a separate story.',
        'Under a letter of credit, the documents go to a bank before the seller is paid. The ITA notes that the exporter’s bank checks them for compliance with the credit and that errors and discrepancies must be amended and resubmitted, which delays payment.',
      ],
    },
    {
      heading: 'Which fields have to agree?',
      paragraphs: [
        'Every field that describes the shipment rather than the price. The table lists them with the check to make.',
      ],
      table: {
        caption: 'Fields the two documents share',
        head: ['Field', 'What to check'],
        rows: [
          ['Seller and buyer', 'The same legal names and addresses, spelt the same way'],
          ['Invoice number', 'The packing list quotes the invoice it belongs to'],
          ['Description of goods', 'The same words for each product, not a shortened version'],
          ['Quantity per line', 'Packed quantity equals invoiced quantity, line by line'],
          ['Unit of measure', 'Pieces, sets, kilograms or metres: the same unit on both'],
          ['Number of packages', 'The same count, which is also the count handed to the carrier'],
          ['Marks and numbers', 'The same marks, matching what is on the boxes'],
          [
            'Net and gross weight',
            'The same totals, and the gross weight matches the weighed goods',
          ],
          ['Country of origin', 'The same origin wherever either document states it'],
        ],
      },
    },
    {
      heading: 'What does a mismatch look like?',
      paragraphs: [
        'Usually a late change made to one document and not the other. In the invented example below, one carton of mugs broke on the packing bench and was left out. The packing list was updated; the invoice was not.',
      ],
      table: {
        caption: 'Mismatch example with invented figures',
        head: ['Field', 'Commercial invoice', 'Packing list'],
        rows: [
          ['Mugs, 350 ml', '1,200 pcs', '1,176 pcs in C/No. 1–49'],
          ['Total cartons', '130', '129'],
          ['Net weight', '1,200.0 kg', '1,191.6 kg'],
          ['Gross weight', '1,410.0 kg', '1,400.0 kg'],
          ['Total value', 'GBP 9,060.00', 'not shown'],
        ],
      },
    },
    {
      heading: 'How do you fix a mismatch?',
      paragraphs: [
        'Work out what was actually shipped, then make both documents say it. Never adjust one to look like the other without checking the goods.',
      ],
      steps: [
        'Count and weigh what is actually being shipped, carton by carton if needed.',
        'Correct the document that is wrong. In the example, the invoice changes to 1,176 mugs, 129 cartons and the new weights, and its total falls by 24 × GBP 3.40 = GBP 81.60 to GBP 8,978.40.',
        'Issue the corrected document as a new version and withdraw the old one from everyone who has it.',
        'Check the other documents that quote the same figures, such as the transport booking.',
        'If the buyer pays under a letter of credit, check the corrected documents against the credit before presenting them.',
      ],
    },
    {
      heading: 'Where can the two documents differ?',
      paragraphs: [
        'They are not copies. The packing list leaves out what only the sale needs and adds what only the boxes need. These differences are expected:',
      ],
      list: [
        'Prices, amounts, the total value, payment terms and bank details: on the invoice only.',
        'The packing list’s own number and date, alongside the invoice number it quotes.',
        'Per-package detail: which goods are in which carton, each carton’s weight and size, and the volume.',
        'Layout: the invoice goes line by line; the packing list may go package by package, as long as the totals per line agree.',
      ],
    },
    {
      heading: 'How does TradeDocs keep the two in step?',
      paragraphs: [
        'By making both documents from the same data. In the free generator, the commercial invoice and the packing list are one form with a type switch, so the parties, descriptions, quantities and weights you entered for the invoice are the ones the packing list prints. Nothing is stored, so make both before you close the page.',
        'In a free TradeDocs account, the documents are generated from one shipment record. The packing panel lets you allocate each line’s quantity to packages and lists any line whose packed quantity differs from its invoiced quantity, saying whether more or less was packed than invoiced; when every line is fully allocated, it says the packing reconciles. Both documents are generated from the same shipment revision, and editing the shipment marks earlier documents as out of date so a stale copy is not sent by mistake.',
        'TradeDocs checks that the documents agree with each other. Whether they agree with the goods is for you to check, which is why the first step of any fix is to count what is in the boxes.',
      ],
    },
  ],
  faq: [
    {
      q: 'Does the packing list need the same number as the invoice?',
      a: 'It needs to quote the invoice number so the two can be paired. Give the packing list its own number as well, in a separate series, so neither document is mistaken for the other.',
    },
    {
      q: 'Can the packing list show only gross weight?',
      a: 'It is clearer with both. Net weight is the goods alone and gross weight adds the packing, and different readers need different figures. The CBSA, for example, asks for both net and gross weight on the invoice for Canadian imports.',
    },
    {
      q: 'What happens if customs finds a difference?',
      a: 'That depends on the country and on the difference. It may lead to questions, an examination of the goods or a delay while it is resolved. Your customs broker can tell you how the importing country handles corrections.',
    },
    {
      q: 'Should the bill of lading match too?',
      a: 'If your bill of lading or air waybill states the number of packages or the weight, check those figures against the invoice and packing list before it is issued.',
    },
    {
      q: 'Does a partial shipment need its own invoice and packing list?',
      a: 'Each shipment should travel with documents that describe what is actually in it. When an order ships in two parts, prepare a commercial invoice and a packing list for each part, with quantities and weights for that part only, and check the importing country’s rules on split invoicing.',
    },
  ],
  sources: [
    'a2-cornell-19-cfr-141-86',
    'a2-trade-gov-packing-list',
    'a2-trade-gov-commercial-invoice',
    'a2-trade-gov-letter-of-credit',
    'a2-cbsa-d1-4-1',
  ],
  primaryTool: '/tools/packing-list-generator',
  tools: ['/tools/packing-list-generator', '/tools/invoice-generator', '/tools/cbm-calculator'],
  callout: {
    afterSection: 2,
    tool: '/tools/invoice-generator',
    title: 'Make both documents from one form',
    text: 'Fill in the commercial invoice generator once, download the invoice, then switch the type to packing list and download that too. Same parties, same lines.',
  },
  related: [
    '/blog/how-to-make-a-packing-list-from-your-invoice',
    '/blog/packing-list-example',
    '/blog/commercial-invoice-example',
    '/blog/packing-list-for-shipping',
    '/blog/export-documents-checklist',
    '/guides/gross-weight-vs-net-weight',
  ],
  cover: {
    id: 'uWrumIrt6wI',
    src: 'https://images.unsplash.com/photo-1609558755571-fe0b9dce7595',
    width: 6000,
    height: 4000,
    alt: 'A man leaning on a counter reviewing paperwork with a pen, checking one document against another',
    caption: 'Reviewing paperwork at a counter, pen in hand',
    photographer: { name: 'Beth Macdonald', profile: 'https://unsplash.com/@elsbethcat' },
    page: 'https://unsplash.com/photos/man-in-gray-hoodie-writing-on-white-paper-uWrumIrt6wI',
  },
};

export default article;
