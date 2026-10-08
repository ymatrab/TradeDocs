import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "proforma invoice for customs" 50, KD 13.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave B (v2 #31).
 */
const article: ContentArticle = {
  slug: 'proforma-invoice-for-customs',
  title: 'Proforma invoice for customs: when it is accepted and what it needs',
  metaTitle: 'Proforma invoice for customs: when it works',
  description:
    'When customs accepts a proforma invoice instead of a commercial invoice, what US rule 19 CFR 141.85 asks it to show, what value to use when nothing is sold and what must follow.',
  lede: 'Most shipments clear on a commercial invoice. Some do not have one: samples, goods sent for repair, items that are not being sold, or a sale whose final invoice is not ready when the goods arrive. For those, customs may accept a proforma invoice. This post explains when that happens, using the US rules as the worked case, what the document must say and what you still owe customs afterwards.',
  answer:
    'Customs accepts a proforma invoice when there is no commercial invoice to present, for example for goods not sold or when the seller’s invoice is late. In the US, 19 CFR 141.83(d) and 141.91 set those cases, and 141.85 lists what the proforma must show. It needs a fair value and enough detail to examine the goods.',
  keyFacts: [
    'Under 19 CFR 141.83(d), goods not intended for sale and goods returned after repair abroad are among the US imports that need no commercial invoice at entry.',
    'Under 19 CFR 141.85, a pro forma invoice states the parties, the basis of the prices, the goods with their quantities and values, the charges included and the country of origin.',
    'Under 19 CFR 141.91, an importer whose commercial invoice is missing files a declaration, a pro forma invoice and a bond, and produces the invoice within 120 days of the entry summary.',
    'HMRC’s export guidance says to use the market value of the goods on the invoice if you are not selling them.',
    'HMRC’s valuation guidance treats gifts, samples and promotional items supplied free of charge as goods that are not sold, so transaction value cannot be used for them.',
  ],
  definitions: [
    {
      term: 'Proforma invoice',
      meaning:
        'An invoice-style document issued before, or instead of, a final commercial invoice; the International Trade Administration calls it a quote in an invoice format.',
    },
    {
      term: 'Pro forma invoice (US customs)',
      meaning:
        'The substitute invoice described in 19 CFR 141.85, filed with a US entry when no commercial invoice is available.',
    },
    {
      term: 'Entry summary',
      meaning:
        'The US filing, usually CBP Form 7501, that lets CBP assess duties and collect statistics after the goods are entered.',
    },
    {
      term: 'Market value',
      meaning:
        'What the goods would sell for, used on the invoice when they are not being sold under HMRC’s export guidance.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'Can you use a proforma invoice for customs?',
      paragraphs: [
        'Yes, in defined cases. Customs normally assesses goods from the commercial invoice, the final record of a sale. A proforma is accepted where that record does not exist yet or never will: the goods are not being sold, they are coming back from repair, or the seller’s invoice has not reached the importer in time.',
        'The rules are national, so the importing country decides. The United States writes its rules out in detail, which makes it a useful worked case: 19 CFR 141.83(d) lists the goods that need no commercial invoice, 19 CFR 141.91 covers an invoice that is not available, and 19 CFR 141.85 sets out what the substitute must contain. For other countries, check the importing customs authority’s rules or ask the importer’s broker before you ship.',
      ],
    },
    {
      heading: 'When does US customs accept a pro forma invoice?',
      paragraphs: [
        'In two situations. The first is goods for which 19 CFR 141.83(d) waives the commercial invoice. The classes it lists include goods not intended for sale, goods returned after being repaired or altered abroad and goods entered for US government agencies. For these, the importer presents any invoice, memorandum invoice or bill it has; if none exists, it files a pro forma invoice under 141.85, with information adequate to examine the goods and determine duties.',
        'The second is a sale whose commercial invoice is missing at entry. Under 19 CFR 141.91, CBP accepts the entry only if it is satisfied that the failure is beyond the importer’s control, and the importer files a written declaration that it cannot produce the invoice, any seller’s or shipper’s invoices it does have, a pro forma invoice if there are none, and a bond. The proforma covers the gap; it does not replace the invoice for good.',
      ],
    },
    {
      heading: 'What must a proforma invoice for customs show?',
      paragraphs: [
        'Everything an officer needs to check the goods and work out the duty. The form in 19 CFR 141.85 is a useful checklist even outside the US, because it asks for the facts any customs authority values goods on.',
      ],
      list: [
        'The names and addresses of the shipper, the seller, the consignee and the buyer.',
        'Whether the goods were bought or agreed to be bought, and the basis of the prices stated, such as an order price, the exporter’s advice or known market values.',
        'Marks, item numbers, quantities and a full description of each line of goods.',
        'The unit and total prices, and which charges are included in them, such as packing, freight, insurance and duties.',
        'The country of origin of the goods.',
        'A signed statement, with title, firm and date, and an undertaking to file any other invoice later received.',
      ],
    },
    {
      heading: 'What value goes on a proforma when nothing is sold?',
      paragraphs: [
        'A fair value for the goods, not zero and not a token figure. HMRC’s export guidance says to use the selling price on the invoice when you sell the goods, and the market value of the goods if you are not selling them. Freight and export insurance included in the price are listed separately.',
        'HMRC’s valuation guidance explains why. Gifts, samples and promotional items supplied free of charge are not sales, so there is no price paid and transaction value (Method 1) cannot be used; the value is usually found under Method 6 instead, based on what the goods would have cost to buy. “No charge” on your invoice describes the deal with your buyer, not the customs value of the goods. Mark free goods as supplied free of charge, and give each line a realistic value.',
      ],
    },
    {
      heading: 'What happens after entry on a pro forma invoice?',
      paragraphs: [
        'For a waived class of goods under 141.83(d), the proforma is the invoice for that entry, so it must be complete and right. For a missing commercial invoice under 141.91, the importer still owes CBP the real invoice. The rule sets a bond on CBP Form 301 and a deadline of 120 days after the entry summary is filed, or 50 days where the invoice is needed only for statistics; the CBP Center director may extend the period for good cause.',
        'In practice, this means the seller’s commercial invoice has to reach the importer quickly. If the final invoice differs from the proforma in quantity, price or description, the importer has to deal with the difference at customs. Keeping the two documents consistent from the start saves that work.',
      ],
    },
    {
      heading: 'How is a customs proforma different from a sales proforma?',
      paragraphs: [
        'They share a name and most of their fields but serve different readers. A sales proforma goes to the buyer before shipment: the International Trade Administration notes it can be used in place of a quotation and that buyers may need one to open a letter of credit or apply for an import licence. A customs proforma goes to the customs authority with the goods, as the record it values them from.',
      ],
      table: {
        caption: 'Sales proforma and customs proforma, compared',
        head: ['Point', 'Sales proforma', 'Customs proforma'],
        rows: [
          ['Reader', 'The buyer and their bank', 'The importing customs authority'],
          ['When', 'Before the order or the payment', 'With the goods at entry'],
          [
            'Value',
            'The offered price, with a validity date',
            'The price paid, or the market value if nothing is sold',
          ],
          [
            'Later document',
            'Replaced by the commercial invoice',
            'Final for waived goods; in the US, followed by the invoice if one was missing',
          ],
          [
            'Key fields',
            'Price, payment terms, validity, Incoterms® rule',
            'Parties, description, quantities, value basis, charges, origin',
          ],
        ],
      },
    },
    {
      heading: 'How do you prepare a proforma invoice for customs?',
      paragraphs: [
        'Start from the facts of the shipment, then check the importing country’s rules. The steps below follow the US form, which covers what most authorities ask.',
      ],
      steps: [
        'Confirm with the importer or their broker that a proforma is acceptable for this shipment and why: goods not sold, goods returned after repair, or a commercial invoice to follow.',
        'Title the document “Proforma invoice” and state the reason for the shipment, such as samples, return after repair or replacement under warranty.',
        'Enter the shipper, seller, consignee and buyer with full addresses, even where two of them are the same company.',
        'Describe each line in plain words: what the goods are, what they are made of and what they are for, with marks, quantities and units.',
        'Give each line a value, using the price paid or, where nothing is sold, the market value, and say which basis you used.',
        'State which charges are in the price, list freight and insurance separately, and give the country of origin of each line.',
        'Sign and date it, keep a copy, and make sure the packing list matches it line for line.',
      ],
    },
  ],
  faq: [
    {
      q: 'Can I write “no commercial value” on a proforma invoice?',
      a: 'You can say the goods are supplied free of charge, but customs still needs a value. HMRC’s guidance says to use the market value of goods that are not being sold, and US rules ask for information adequate to determine duties.',
    },
    {
      q: 'Does a proforma invoice need a signature for customs?',
      a: 'The US form in 19 CFR 141.85 ends with a signed statement giving the signer’s title, firm and date. Other countries set their own rules, so check with the importer’s broker.',
    },
    {
      q: 'How long does a US importer have to replace a pro forma invoice?',
      a: 'Under 19 CFR 141.91, the commercial invoice is due within 120 days after the entry summary is filed, or 50 days if it is needed only for statistics. A bond covers the period.',
    },
    {
      q: 'Can a courier shipment of samples travel on a proforma invoice?',
      a: 'Often, yes, but the carrier and the importing country decide. Check the carrier’s document requirements when you book, give the samples a fair value and describe them specifically.',
    },
    {
      q: 'Is a proforma invoice a VAT invoice?',
      a: 'No. In the UK, HMRC states that VAT cannot be reclaimed using a pro-forma invoice, a statement or a delivery note. Other countries set their own VAT invoice rules.',
    },
  ],
  sources: [
    'us-cbp-proforma-invoice',
    'b3-cfr-19-141-83',
    'b3-cfr-19-141-91',
    'a4-cfr-19-142-3',
    'trade-gov-proforma-invoice',
    'b3-gov-uk-export-goods',
    'b3-gov-uk-free-of-charge-goods',
    'b3-gov-uk-vat-records',
    'a3-ecfr-19-cfr-141-0a',
  ],
  primaryTool: '/tools/proforma-invoice-generator',
  tools: [
    '/tools/proforma-invoice-generator',
    '/tools/invoice-generator',
    '/tools/packing-list-generator',
  ],
  callout: {
    afterSection: 2,
    tool: '/tools/proforma-invoice-generator',
    title: 'Build the proforma with every customs field',
    text: 'The proforma invoice generator has the parties, line descriptions, quantities, values, charges and country of origin built in, and prints a signed, dated PDF.',
  },
  related: [
    '/guides/proforma-vs-commercial-invoice',
    '/guides/what-is-a-proforma-invoice',
    '/blog/commercial-invoice-for-samples',
    '/blog/proforma-invoice-example',
    '/guides/how-to-import-into-the-us',
  ],
  cover: {
    id: 'JCyQZUvuMoE',
    src: 'https://images.unsplash.com/photo-1615138905506-665a703c6084',
    width: 3296,
    height: 2472,
    alt: 'Man in a blue shirt and brown hat holding a printed sheet of paper, checking a document',
    caption: 'Checking a printed document by hand',
    photographer: { name: 'Wan', profile: 'https://unsplash.com/@yogeeg' },
    page: 'https://unsplash.com/photos/man-in-blue-button-up-shirt-wearing-brown-hat-holding-white-printer-paper-JCyQZUvuMoE',
  },
};

export default article;
