import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'bill-of-exchange',
  term: 'Bill of exchange (draft)',
  aliases: ['draft', 'sight draft', 'time draft', 'usance draft', 'trade draft'],
  demand: {
    keyword: 'bill of exchange',
    market: 'US',
    volume: 1_600,
    kd: null,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'Bill of exchange meaning: sight and time drafts in trade',
  description:
    'What a bill of exchange is, how sight and time drafts work in a documentary collection, and how the draft relates to your commercial invoice and proforma terms.',
  shortDefinition:
    'A bill of exchange, or draft, is a written, signed order from one party to another to pay a fixed sum of money, either on demand or at a set future date. In export trade the seller draws it on the buyer, and banks present it with the shipping documents.',
  definition: [
    'The classic legal definition is in the UK Bills of Exchange Act 1882: an unconditional order in writing, addressed by one person to another and signed by the person giving it, requiring the person it is addressed to to pay a sum certain in money, on demand or at a fixed or determinable future time, to a named person, to that person’s order, or to the bearer. The person who signs is the drawer, the person told to pay is the drawee, and the person to be paid is the payee.',
    'In trade the draft is the instrument behind a documentary collection. ICC Academy explains that a collection usually involves a bill of exchange that serves as a legal demand on the importer to pay on presentation, called a sight draft, or to accept it and pay later, called a usance or time draft. Collections commonly follow the ICC Uniform Rules for Collections (URC 522), and the banks act only as agents, without liability beyond following the collection instruction.',
    'The ITA’s guidance on documentary collections adds the practical point: the bill of exchange tells the bank which documents are required, the amount due and the payment terms, and the importer’s bank releases the documents either against full payment or against the importer’s signed acceptance committing to pay later.',
  ],
  onYourDocuments: [
    'The draft is a separate document from the commercial invoice, but the two must agree. The amount and currency on the draft should equal the invoice total, the drawee should be the buyer named on the invoice, and the tenor (at sight, or so many days after sight or after the bill of lading date) should match the payment terms agreed on the proforma invoice and repeated on the commercial invoice.',
    'When you sell on collection terms, state them in the payment terms field, for example documents against payment at sight, so the buyer knows what the bank will present.',
  ],
  example: {
    caption: 'Worked example with invented parties and figures',
    paragraphs: [
      'Lakeside Instruments (invented) sells to a buyer in Kenya on documents against acceptance, 60 days after sight. It draws a time draft on the buyer for USD 18,400, the invoice total, and gives it to its bank with the commercial invoice, packing list and bill of lading. The buyer’s bank presents the draft; the buyer signs its acceptance, receives the documents and collects the goods, and the bank presents the accepted draft for payment when it matures.',
    ],
  },
  confusedWith: [
    {
      term: 'Bill of lading',
      difference:
        'A bill of lading is the carrier’s transport document and receipt for the goods. A bill of exchange is a payment instrument; in a collection the bank holds one against the other.',
    },
    {
      term: 'Letter of credit',
      difference:
        'Under a letter of credit a bank undertakes to pay against compliant documents. In a collection the banks only pass documents and the draft along, without guaranteeing payment.',
    },
  ],
  related: ['/guides/export-payment-terms', '/blog/tt-payment', '/guides/what-is-a-bill-of-lading', '/guides/what-is-a-proforma-invoice'],
  tool: '/tools/proforma-invoice-generator',
  toolPitch:
    'The proforma invoice generator records the agreed payment terms, so the draft’s amount and tenor have a document to match.',
  faq: [
    {
      q: 'What is the difference between a sight draft and a time draft?',
      a: 'A sight draft is payable on presentation, so the buyer pays before receiving the documents. A time draft is accepted on presentation and paid at a later date, which gives the buyer credit.',
    },
    {
      q: 'Does the bank guarantee that a draft will be paid?',
      a: 'No. In a documentary collection the banks act as agents: they present the draft and release documents as instructed, but they do not verify the documents or guarantee payment, unlike a letter of credit.',
    },
  ],
  sources: ['c6-uk-bills-of-exchange-act-s3', 'c6-icc-collections', 'a4-trade-gov-documentary-collections'],
  regulated: false,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
