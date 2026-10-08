import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "customs value" 260, KD 3; "customs valuation"
 * 260, KD 8; UK "customs value" 90.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave B (v2 guide #14).
 * Explains the valuation rules; never suggests a lower declared value.
 */
const article: ContentArticle = {
  slug: 'customs-value',
  title: 'Customs value: what it is and how it is worked out',
  metaTitle: 'Customs value: transaction value and additions',
  description:
    'Customs value is the figure ad valorem duty is charged on. How transaction value works, what is added to the invoice price, and why the US and the UK treat freight differently.',
  lede: 'The duty on most imports is a percentage, and the percentage is applied to one figure: the customs value. It usually starts from your invoice price, but it is not always the same number, and the difference can change the duty bill in either direction.',
  answer:
    'Customs value is the value customs charges ad valorem duty on. Under the WTO Valuation Agreement it is normally the transaction value: the price actually paid or payable for the goods, usually shown on the invoice, plus certain listed additions. Whether international freight and insurance are included depends on the importing country.',
  keyFacts: [
    'The WCO describes the customs value as the taxable basis for ad valorem customs duties, also used for trade statistics, tariff preferences and national taxes.',
    'The WTO Valuation Agreement makes transaction value, the price actually paid or payable plus Article 8 adjustments, the first of six valuation methods.',
    'Under 19 U.S.C. § 1401a, US transaction value adds the buyer’s packing costs and selling commissions, assists, required royalties and resale proceeds that accrue to the seller.',
    'US customs value excludes international freight and insurance, while HMRC includes transport and insurance up to the place where goods enter the UK.',
    'Under Article 17 of the WTO Valuation Agreement, customs may satisfy itself of the truth or accuracy of any statement, document or declaration.',
  ],
  definitions: [
    {
      term: 'Customs value',
      meaning: 'The value of imported goods that customs uses as the base for ad valorem duty.',
    },
    {
      term: 'Transaction value',
      meaning:
        'The price actually paid or payable for goods sold for export to the importing country, adjusted for the listed additions.',
    },
    {
      term: 'Assist',
      meaning:
        'Something the buyer supplies free or at reduced cost for producing the goods, such as moulds, tools or materials.',
    },
    {
      term: 'CIF and FOB basis',
      meaning:
        'Whether the importing country includes international freight and insurance in customs value (CIF basis) or leaves them out (FOB basis).',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is customs value used for?',
      paragraphs: [
        'It is the base that ad valorem duty is calculated on. The WCO calls it the taxable basis for customs duties and notes that it is also used for trade statistics, monitoring quantitative restrictions, tariff preferences and national taxes. The WTO adds that when the duty rate is a percentage, the customs value is essential to work out the duty to be paid.',
        'In the UK, HMRC’s guidance uses the same customs value for Customs Duty, import VAT and trade statistics. A wrong value therefore travels into more than one charge.',
      ],
    },
    {
      heading: 'What is transaction value?',
      paragraphs: [
        'Transaction value is the main method, and it starts from the price. The WTO describes the price actually paid or payable as the total payment made or to be made by the buyer to, or for the benefit of, the seller for the imported goods, including payments made to a third party to satisfy an obligation of the seller.',
        'It applies only when certain conditions hold, as the WTO summarises them:',
      ],
      list: [
        'There is evidence of a sale for export to the importing country, such as invoices, contracts or purchase orders.',
        'The buyer’s use of the goods is not restricted, beyond limits set by law, limits on where they can be resold, or limits that do not substantially affect value.',
        'The price is not subject to conditions whose value cannot be determined.',
        'No part of resale proceeds goes back to the seller, unless it can be added.',
        'Buyer and seller are not related, or the relationship did not influence the price.',
      ],
    },
    {
      heading: 'What is added to the invoice price?',
      paragraphs: [
        'Costs the buyer bears that are not already in the price. For US imports, 19 U.S.C. § 1401a lists them, and says the price is increased by these amounts and no others, and only when each is based on sufficient information. The WTO’s Article 8 list is similar, and makes freight to the place of importation an addition only where a member values on a CIF basis. Costs after importation, such as duties and onward transport, are not part of it.',
      ],
      table: {
        caption: 'Additions to the price actually paid or payable, US statute and WTO list',
        head: ['Item', 'US, 19 U.S.C. § 1401a', 'WTO Article 8'],
        rows: [
          ['Packing costs', 'Added if incurred by the buyer', 'Added (packing and containers)'],
          [
            'Commissions',
            'Selling commissions incurred by the buyer',
            'Commissions and brokerage, except buying commissions',
          ],
          ['Assists', 'Added, apportioned as appropriate', 'Added'],
          ['Royalties and licence fees', 'Added if required as a condition of sale', 'Added'],
          ['Resale proceeds to the seller', 'Added', 'Added'],
          [
            'International freight and insurance',
            'Excluded from the price',
            'Added only on a CIF basis',
          ],
        ],
      },
    },
    {
      heading: 'Is customs value on an FOB or a CIF basis?',
      paragraphs: [
        'It depends on the country of import. The US values on an FOB-type basis: under 19 U.S.C. § 1401a, the price actually paid or payable excludes international freight, insurance and related costs to the place of importation. The UK goes the other way: HMRC’s guidance includes transport, insurance and related costs up to the place where the goods are brought into the UK.',
        'Your Incoterms® rule decides what your invoice price already covers. A CIF or CIP price includes main carriage, so show freight and insurance as separate amounts on the invoice. The importer can then value on whichever basis its country uses without guessing.',
      ],
    },
    {
      heading: 'What if there is no transaction value?',
      paragraphs: [
        'Customs moves down a fixed list. The WTO Agreement sets six methods in hierarchical order, and the next one is used only if the one before cannot be applied. The importer may ask for methods 4 and 5 to be swapped; the customs officer may not swap them on its own initiative.',
      ],
      list: [
        'Method 1: transaction value.',
        'Method 2: transaction value of identical goods.',
        'Method 3: transaction value of similar goods.',
        'Method 4: deductive value, worked back from the resale price in the importing country.',
        'Method 5: computed value, built up from production costs and profit.',
        'Method 6: the fall-back method.',
      ],
    },
    {
      heading: 'How do you work out customs value from an invoice?',
      paragraphs: [
        'Start from what the buyer paid and adjust it, line by line, for the importing country’s rules. The example below uses invented figures for one shipment valued two ways.',
      ],
      table: {
        caption:
          'Worked example with invented figures: one CIF-priced shipment valued on a US and a UK basis',
        head: ['Step', 'US basis', 'UK basis'],
        rows: [
          ['Invoice price, CIF port of arrival', '10,000', '10,000'],
          ['Less ocean freight to the port of arrival', '−800', 'kept in'],
          ['Less insurance to the port of arrival', '−50', 'kept in'],
          ['Plus export packing paid by the buyer separately', '+200', '+200'],
          ['Plus moulds supplied free by the buyer (assist)', '+1,000', '+1,000'],
          ['Customs value', '10,350', '11,200'],
        ],
      },
    },
    {
      heading: 'Why must the declared value be right?',
      paragraphs: [
        'Because customs checks it, and the importer answers for it. Article 17 of the WTO Agreement confirms that customs administrations may satisfy themselves as to the truth or accuracy of any statement, document or declaration. In the US, 19 U.S.C. § 1484 requires the importer of record to use reasonable care in declaring value, classification and the rate of duty.',
        'Goods sent free of charge, such as samples or replacements, still have a customs value; HMRC publishes separate guidance on valuing them. Never lower the price on a document to reduce duty. Declare what was paid, add what the rules require, and keep the records that support each figure.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is customs value the same as the invoice value?',
      a: 'Often close, not always the same. It starts from the price actually paid or payable and is adjusted for listed additions and, depending on the country, for international freight and insurance.',
    },
    {
      q: 'Are import duties part of the customs value?',
      a: 'No. The WTO notes that costs incurred after importation, including duties and onward transport, are not part of the transaction value.',
    },
    {
      q: 'Do buying commissions count towards customs value?',
      a: 'Not under the WTO list, which adds commissions and brokerage except buying commissions. The US statute adds selling commissions incurred by the buyer.',
    },
    {
      q: 'Can I get a ruling on value before importing into the UK?',
      a: 'Yes. HMRC’s customs value guidance includes applying for an Advance Valuation Ruling.',
    },
  ],
  sources: [
    'b5-wco-valuation',
    'wto-customs-valuation',
    'w5-usc-19-1401a',
    'w3-hmrc-delivery-costs',
    'b5-hmrc-customs-value',
    'a5-usc-19-1484',
    'icc-incoterms-2020',
  ],
  primaryTool: '/tools/landed-cost-calculator',
  callout: {
    afterSection: 3,
    tool: '/tools/landed-cost-calculator',
    title: 'See how the valuation basis changes the duty',
    text: 'Enter the goods value, freight and insurance, and the landed cost calculator shows duty on a goods-only or CIF base, with rates you enter from the official tariff.',
  },
  tools: ['/tools/landed-cost-calculator', '/tools/invoice-generator', '/tools/incoterms'],
  related: [
    '/guides/landed-cost',
    '/blog/how-to-calculate-import-duty',
    '/blog/cif-vs-fob',
    '/blog/commercial-invoice-for-samples',
    '/blog/duty-vs-tariff',
  ],
  cover: {
    id: '8wLZi9OhsWU',
    src: 'https://images.unsplash.com/photo-1709880945165-d2208c6ad2ec',
    width: 3148,
    height: 2100,
    alt: 'A calculator on a desk next to a laptop, ready for working out the customs value of an invoice',
    caption: 'A calculator beside a laptop',
    photographer: { name: 'Jakub Żerdzicki', profile: 'https://unsplash.com/@jakubzerdzicki' },
    page: 'https://unsplash.com/photos/a-calculator-sitting-on-top-of-a-table-next-to-a-laptop-8wLZi9OhsWU',
  },
};

export default article;
