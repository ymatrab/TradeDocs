import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "tt payment" 320, KD 3.
 * Plan: docs/research/content-plan-v3-2026-10-07.md (v2 #43), wave B.
 * Describes the method and its documents; never recommends terms for a reader's deal. No bank
 * fees, cut-off times or transfer times quoted: banks set them. Deposit split is invented.
 */
const article: ContentArticle = {
  slug: 'tt-payment',
  title: 'TT payment: how a telegraphic transfer works in export trade',
  metaTitle: 'TT payment: telegraphic transfer for exporters',
  description:
    'What TT means on a proforma, the bank details a buyer needs to pay you, how deposit and balance terms work, and how to protect a transfer from payment fraud.',
  lede: 'A buyer who writes “TT 30/70” or “payment by TT” is offering to pay you by bank transfer, usually before the goods leave. The method is simple. The risk sits in the details: when each part is paid, which documents ask for it, and whether the bank details the buyer uses are really yours.',
  answer:
    'A TT payment, short for telegraphic transfer, is a bank-to-bank wire transfer from the buyer’s account to the seller’s. In export trade it usually means cash in advance, in full or as a deposit and balance, requested by a proforma invoice. The ITA calls the wire transfer the most secure and preferred cash-in-advance option for exporters.',
  keyFacts: [
    'The International Trade Administration (ITA) describes cash in advance as the most secure payment method for the exporter, because the importer pays the full or a significant amount before the goods ship.',
    'The ITA calls a wire transfer the most secure and preferred cash-in-advance option, and says exporters should give the importer clear bank routing instructions.',
    'The ITA lists terms of payment and a validity date among the details a pro forma invoice should carry.',
    'HMRC asks anyone paying it from an overseas account for its Business Identifier Code (BIC), IBAN and account name, the same details a seller gives a foreign buyer.',
    'The FBI’s IC3 advises verifying any request to change account details through a secondary channel, because business email compromise targets transfers of funds.',
  ],
  definitions: [
    {
      term: 'Telegraphic transfer (TT)',
      meaning:
        'A bank-to-bank electronic transfer of money, the older banking name for an international wire transfer.',
    },
    {
      term: 'Cash in advance',
      meaning:
        'Payment terms under which the buyer pays all or part of the price before the seller ships the goods.',
    },
    {
      term: 'BIC',
      meaning:
        'The Business Identifier Code that identifies a bank in an international payment, often called its SWIFT code.',
    },
    {
      term: 'IBAN',
      meaning:
        'The International Bank Account Number, an account number format that carries the country and bank as well as the account.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What does TT mean in payment terms?',
      paragraphs: [
        'TT means the buyer pays by bank transfer. The name comes from the days when banks sent payment instructions by telegraph; today the instruction travels electronically between the buyer’s bank, any intermediary bank and yours, and the money lands in your account.',
        'On its own, “TT” only names the method. What matters for your risk is when the transfer happens. “TT in advance” is cash in advance, which the ITA ranks as the lowest-risk method for the exporter. “TT after shipment” or “TT 30 days after invoice” is, in effect, open account: the goods are gone before you are paid. Read the timing, not just the letters.',
      ],
    },
    {
      heading: 'How does a TT payment work, step by step?',
      paragraphs: [
        'A TT in advance usually follows the same order of documents. The proforma invoice sets the terms, the transfer pays them, and the commercial invoice records the sale once the goods ship.',
      ],
      steps: [
        'Agree the price, the Incoterms® 2020 rule and named place, and the payment terms with the buyer.',
        'Send a proforma invoice that states the amount, the currency, the payment terms, your bank details and a validity date.',
        'The buyer instructs their bank to transfer the amount, quoting your proforma number as the reference.',
        'Wait until the money is credited to your account, not until the buyer sends a transfer receipt, before you release goods or start production.',
        'Ship, then issue the commercial invoice, showing what was paid in advance and any balance still due.',
      ],
    },
    {
      heading: 'What bank details does a buyer need to pay by TT?',
      paragraphs: [
        'Your bank tells you exactly what to give, and the ITA’s advice is to give clear routing instructions. As a reference point, HMRC’s own instructions for paying it from an overseas account list three items: the BIC, the account number in IBAN form and the account name. Payments in some currencies or to some countries need more, such as a local bank code or an intermediary bank, so copy the details your bank publishes for incoming international payments rather than writing them from memory.',
        'Put the details on the proforma, in a block the buyer can copy without retyping. A wrong letter in an IBAN or a name that does not match the account can send a transfer back or hold it for checks, which delays your shipment as well as your money.',
      ],
      table: {
        caption: 'Bank details block for a proforma, with invented values in brackets',
        head: ['Field', 'What to write'],
        rows: [
          ['Account name', 'Your legal business name, exactly as the bank holds it'],
          ['IBAN or account number', 'As your bank states it (GB00 INVE NTED 0000 0000 00)'],
          ['BIC (SWIFT code)', 'Your bank’s code (INVTGB2X, invented)'],
          [
            'Bank name and address',
            'The branch or head office your bank gives for incoming payments',
          ],
          ['Currency', 'The currency of the proforma, so the amount arrives as invoiced'],
          ['Payment reference', 'Your proforma number, so you can match the transfer'],
        ],
      },
    },
    {
      heading: 'What do deposit and balance terms like TT 30/70 mean?',
      paragraphs: [
        'They split the price into a deposit paid when the order is confirmed and a balance paid later. The ITA describes cash in advance as the importer paying the full amount or a significant amount before shipment, and a split is how many sellers and buyers meet in the middle. The percentages and the trigger for the balance are whatever the two of you agree.',
        'The trigger is the part to write carefully. A balance due “before shipment” keeps the seller paid in full before the goods leave. A balance due “against a copy of the bill of lading” or “on arrival” means the goods are already moving, so that part of the price carries open-account risk.',
      ],
      table: {
        caption: 'Worked example with invented figures: a 30/70 TT split on one order',
        head: ['Stage', 'Document', 'Amount (invented)'],
        rows: [
          ['Order confirmed', 'Proforma invoice PI-0412, 30% deposit', 'USD 4,500'],
          ['Goods ready, before loading', 'Same proforma, 70% balance', 'USD 10,500'],
          ['Goods shipped', 'Commercial invoice showing USD 15,000 paid', 'USD 0 due'],
        ],
      },
    },
    {
      heading: 'Is TT safe for the seller and the buyer?',
      paragraphs: [
        'For the seller, TT in advance is about as safe as payment gets, because the money arrives before the goods leave. For the buyer, it is the least attractive option: the ITA notes that paying in advance hurts the buyer’s cash flow and leaves them worried the goods will not be sent. It also warns that exporters who insist on cash in advance as their only method may lose sales to competitors who offer easier terms.',
        'If a buyer will not pay everything in advance, the ITA’s other methods move the risk in steps: a letter of credit puts a bank’s commitment behind the payment, a documentary collection uses banks to exchange documents for payment, and open account trusts the buyer to pay after delivery. The guide to export payment terms compares them.',
      ],
    },
    {
      heading: 'How do you protect a TT payment from fraud?',
      paragraphs: [
        'Treat any change of bank details as suspect until you have confirmed it by another route. The FBI’s Internet Crime Complaint Center (IC3) describes business email compromise as a scam that targets transfers of funds, often by taking over a real business email account, and its first tip is to verify requests to change account information through a secondary channel.',
        'For a seller, that means two habits. Tell buyers at the start that your bank details will never change by email alone, and that they should call a number they already have before paying a new account. And check that the sender address on any email about payment really is your buyer’s. If a payment does go astray, IC3 says to contact the originating bank as soon as the fraud is recognised to ask for a recall or reversal.',
      ],
    },
    {
      heading: 'How does a proforma invoice request a TT?',
      paragraphs: [
        'It states the terms the transfer pays. The ITA describes a pro forma as a quote in invoice format that a buyer may need to open a letter of credit or arrange the transfer of hard currency, and lists the terms of payment and a validity date among its contents. Write the terms in full (“30% deposit by TT on order, 70% balance by TT before shipment”) rather than as a bare “TT”.',
        'A proforma asks for money; it does not record a sale. In the UK, HMRC’s VAT Notice 700 says a pro-forma invoice cannot be used as evidence to reclaim input tax, should be marked “this is not a VAT invoice”, and must be followed by a proper VAT invoice once the goods are supplied or payment is received. Check the equivalent rule wherever you are registered.',
      ],
    },
  ],
  faq: [
    {
      q: 'What is the difference between TT and wire transfer?',
      a: 'None in practice. Telegraphic transfer is the older name banks and traders still use for an international wire transfer; both mean money sent electronically from one bank account to another.',
    },
    {
      q: 'How long does a TT payment take?',
      a: 'It depends on the banks, the currency and the countries involved. HMRC’s own guidance notes that payments from overseas may take longer than domestic ones and tells payers to check with their bank.',
    },
    {
      q: 'Who pays the bank charges on a TT?',
      a: 'Whoever the parties agree. Both banks, and any intermediary, may charge, so say on the proforma whether charges are shared or paid by the buyer, and ask your bank what applies to incoming payments.',
    },
    {
      q: 'Should I ship when the buyer sends a transfer receipt?',
      a: 'A receipt shows that an instruction was given, not that money arrived. Release the goods once the amount is credited to your own account.',
    },
    {
      q: 'Can I ask for TT in my own currency?',
      a: 'Yes, if the buyer agrees. Put the currency on the proforma. HMRC’s page for overseas payers warns that some banks charge if a payment to it is not made in pounds sterling, the currency of its account, so agree who bears any conversion.',
    },
  ],
  sources: [
    'b4-trade-gov-cash-in-advance',
    'a4-trade-gov-methods-of-payment',
    'trade-gov-proforma-invoice',
    'b4-hmrc-overseas-bank-details',
    'b4-ic3-bec',
    'b4-hmrc-vat-notice-700',
    'icc-incoterms-2020',
  ],
  primaryTool: '/tools/proforma-invoice-generator',
  tools: ['/tools/proforma-invoice-generator', '/tools/invoice-generator', '/tools/incoterms'],
  callout: {
    afterSection: 2,
    tool: '/tools/proforma-invoice-generator',
    title: 'Put the TT terms and bank details on a proforma',
    text: 'Fill in the price, the payment terms and your bank details once, and download a proforma invoice PDF the buyer can pay from.',
  },
  related: [
    '/guides/export-payment-terms',
    '/guides/what-is-a-proforma-invoice',
    '/blog/proforma-invoice-example',
    '/guides/proforma-vs-commercial-invoice',
    '/blog/how-to-fill-out-a-commercial-invoice',
  ],
  cover: {
    id: 'ngWKDQhM88Q',
    src: 'https://images.unsplash.com/photo-1602526430780-782d6b1783fa',
    width: 5812,
    height: 3875,
    alt: 'A person working on a laptop at a wooden table, as when checking an incoming bank transfer',
    caption: 'Working on a laptop at a wooden table',
    photographer: { name: 'Samsung Memory', profile: 'https://unsplash.com/@samsungmemory' },
    page: 'https://unsplash.com/photos/person-in-gray-long-sleeve-shirt-using-macbook-air-on-brown-wooden-table-ngWKDQhM88Q',
  },
};

export default article;
