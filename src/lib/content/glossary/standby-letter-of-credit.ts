import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'standby-letter-of-credit',
  term: 'Standby letter of credit (SBLC)',
  abbreviation: 'SBLC',
  aliases: ['standby LC', 'standby credit', 'SBLC', 'standby'],
  demand: {
    keyword: 'standby letter of credit',
    market: 'US',
    volume: 880,
    kd: 7,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'Standby letter of credit (SBLC): meaning and use',
  description:
    'What a standby letter of credit is, how it differs from a commercial letter of credit, when an exporter draws on one, and which details from the proforma invoice it usually repeats.',
  shortDefinition:
    'A standby letter of credit is a bank’s irrevocable undertaking to pay the beneficiary if it presents the documents the standby requires, usually a demand stating that the applicant failed to pay or perform. It works as a backstop rather than the normal way of paying.',
  definition: [
    'A commercial letter of credit is the payment route: the seller ships, presents its shipping documents and is paid. A standby sits behind the deal instead. The buyer pays on open account or by transfer as agreed, and the standby is drawn only if something goes wrong, so in a deal that runs smoothly it is never drawn at all.',
    'The International Chamber of Commerce publishes rules written for standbys, the International Standby Practices, known as ISP98. They cover performance, financial and direct pay standbys, and apply when the standby says it is subject to them; it can also modify or exclude parts of them. The ICC’s rules for commercial credits, UCP 600, are a separate set written for documents presented after shipment.',
    'Under ISP98 a standby is irrevocable, independent and documentary. The issuing bank looks only at the documents presented, not at whether the goods were good or the contract was kept, and it cannot cancel its promise on its own. Any argument about the underlying sale stays between buyer and seller.',
  ],
  onYourDocuments: [
    'A standby is not printed on the commercial invoice, but the two meet at a demand. The standby usually names the contract or proforma invoice it supports, its maximum amount and currency, an expiry date and the documents the beneficiary must present, often a signed statement of default and a copy of the unpaid invoice.',
    'Keep the reference numbers, amounts and party names on your invoices exactly as the standby states them. The bank checks documents on their face, and a mismatched name or invoice number is the kind of discrepancy that delays payment.',
  ],
  example: {
    caption: 'Worked example with invented parties',
    paragraphs: [
      'Harbor Spice Traders (invented) of New Jersey agrees to sell pepper to a Dutch distributor on 60-day open account terms. To cover the credit risk, the distributor’s bank issues a standby subject to ISP98, naming Harbor Spice as beneficiary and quoting the proforma invoice number, with an expiry three months after the last shipment.',
      'The distributor pays the first two invoices on time. When the third goes unpaid, Harbor Spice presents a signed demand stating the non-payment with a copy of that invoice, and the bank pays against those documents.',
    ],
  },
  confusedWith: [
    {
      term: 'Commercial (documentary) letter of credit',
      difference:
        'A commercial credit pays when the seller presents shipping documents after a normal shipment. A standby pays only on a demand showing default, so in a deal that goes well it is never drawn.',
    },
  ],
  related: ['/guides/export-payment-terms', 'bill-of-exchange', '/blog/tt-payment'],
  tool: '/tools/proforma-invoice-generator',
  toolPitch:
    'The proforma invoice generator produces the numbered quote a standby often refers to, with the parties, amount and currency the bank will compare against.',
  faq: [
    {
      q: 'What is the difference between a standby letter of credit and a bank guarantee?',
      a: 'Both promise payment if the applicant defaults, and both are independent of the sale contract. A standby is issued as a letter of credit, often made subject to ISP98, while a guarantee follows its own wording and the law that governs it.',
    },
    {
      q: 'When can a beneficiary draw on a standby letter of credit?',
      a: 'Before it expires, by presenting exactly the documents the standby lists, usually a signed demand stating the default. The bank examines those documents only; it does not investigate the dispute.',
    },
  ],
  sources: ['d5-icc-isp98', 'a4-icc-documentary-credits', 'a2-trade-gov-letter-of-credit'],
  regulated: false,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
