import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google UK, 2026-10-07): "uk import duty" 2,900, KD 24; "customs duty uk"
 * 2,900. Every rule and threshold is from a GOV.UK page opened 2026-10-08 and listed in
 * `sources`. The duty rate in the worked example is an invented placeholder; no commodity code
 * or real duty rate is suggested for any product.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave B.
 */
const article: ContentArticle = {
  slug: 'uk-import-duty',
  title: 'UK import duty: how Customs Duty and import VAT are worked out',
  metaTitle: 'UK import duty: how duty and import VAT work',
  description:
    'How UK Customs Duty and import VAT are calculated on business imports into Great Britain: the commodity code, the customs value, the £135 line and postponed VAT accounting.',
  lede: 'Importing goods into Great Britain usually means two charges at the border: Customs Duty, at a rate set by the goods’ commodity code and origin, and import VAT. Both are worked out from the value you declare, and both depend on paperwork you prepare before the goods arrive. This post walks through each step with HMRC’s own guidance.',
  answer:
    'UK import duty is Customs Duty charged on goods brought into Great Britain from outside the UK, at the rate the UK Trade Tariff sets for the goods’ commodity code and origin. It is a percentage of the customs value, which includes freight and insurance to the UK border. Import VAT is then charged on that value plus the duty.',
  keyFacts: [
    'HMRC says the commodity code determines the rate of duty you pay and whether you need an import licence.',
    'GOV.UK says no Customs Duty is charged on non-excise goods worth £135 or less sent to Great Britain from abroad.',
    'HMRC’s customs value includes transport and insurance costs up to the place the goods enter the UK.',
    'HMRC’s value for import VAT is the customs value plus incidental costs to the first UK destination and any Customs Duty.',
    'The standard UK VAT rate is 20%, with a reduced rate of 5% and a zero rate for some goods.',
    'VAT-registered businesses can account for import VAT on their VAT Return using postponed VAT accounting.',
  ],
  definitions: [
    {
      term: 'Customs Duty',
      meaning: 'The UK tax on imported goods, at the rates published in the UK Trade Tariff.',
    },
    {
      term: 'Commodity code',
      meaning:
        'The number that classifies goods in the UK Trade Tariff and sets their duty rate; 10 digits for imports.',
    },
    {
      term: 'Customs value',
      meaning:
        'The value duty is calculated on, normally the price paid plus freight and insurance to the UK border.',
    },
    {
      term: 'Postponed VAT accounting',
      meaning:
        'Declaring and reclaiming import VAT on the VAT Return instead of paying it when the goods are cleared.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is UK import duty?',
      paragraphs: [
        'UK import duty is Customs Duty: a tax on goods brought into the UK from abroad, charged when they are cleared at the border. The rate is not one figure for everything. HMRC’s step-by-step guide to importing says the commodity code of your goods determines the rate of duty you need to pay, and the same goods can carry a different rate depending on the country they come from.',
        'Customs Duty is separate from import VAT, which is charged on most imports too, and from excise duty on goods such as alcohol and tobacco. This post covers the first two for ordinary goods imported by a business into Great Britain. Northern Ireland follows different rules for goods at risk of moving into the EU, so check GOV.UK for movements there.',
      ],
    },
    {
      heading: 'How is UK import duty calculated?',
      paragraphs: [
        'Duty is the customs value of the goods multiplied by the duty rate for their commodity code and origin. Work through it in this order:',
      ],
      steps: [
        'Find the 10-digit commodity code for the goods in the UK Trade Tariff, or ask your customs agent.',
        'Look up the duty rate for that code. The Trade Tariff shows the rate and whether a suspension or reduction applies.',
        'Check whether the exporting country has a UK trade agreement and whether your goods meet its rules of origin; a lower preferential rate may apply.',
        'Work out the customs value: normally the price paid, plus transport and insurance to the place the goods enter the UK, converted to sterling using the exchange rates HMRC’s guidance specifies.',
        'Multiply the customs value by the duty rate to get the Customs Duty.',
        'Add the duty and the incidental costs to the first UK destination to the customs value, and apply the VAT rate to get import VAT.',
      ],
    },
    {
      heading: 'What goes into the customs value?',
      paragraphs: [
        'HMRC’s guidance on valuing imports says the customs value is used for Customs Duty, import VAT and trade statistics, and sets out six methods, starting with Method 1, the transaction value, which starts from the price on the commercial invoice.',
        'Delivery costs are where many declarations go wrong. HMRC’s guidance on delivery costs says you must include transport costs up to the place where the goods are brought into the UK, inland transport and associated costs in the country of export, and insurance against loss or damage in transit up to the same point. Transport and insurance after arrival in the UK can be left out, provided they are charged and shown separately. That is why your Incoterms® rule matters: under EXW or FOB the freight to the UK is not in the invoice price but still has to be added.',
      ],
    },
    {
      heading: 'How is import VAT worked out on top of duty?',
      paragraphs: [
        'Import VAT is charged on a larger base than duty. HMRC’s guidance on VAT on imports says the value for VAT is the customs value plus incidental expenses, such as commission, packing, transport and insurance, up to the goods’ first destination in the UK, plus any Customs Duty or levy payable on importation. The rate is the one that applies to the goods: GOV.UK lists the standard rate as 20%, the reduced rate as 5%, and a zero rate for some goods.',
        'A VAT-registered business can usually recover import VAT on goods it owns as input tax, subject to the normal rules. HMRC says it can either pay import VAT at the border or account for it on its VAT Return using postponed VAT accounting, declaring and reclaiming it on the same return. A business that is not registered for VAT pays import VAT and cannot reclaim it.',
      ],
    },
    {
      heading: 'What does a worked example look like?',
      paragraphs: [
        'Take an invented shipment bought on FOB terms. The duty rate below is a placeholder, not the rate for any real product; replace it with the rate the Trade Tariff gives for your commodity code and origin, and check whether your goods take the standard VAT rate.',
      ],
      table: {
        caption: 'Worked example with invented figures and an invented duty rate',
        head: ['Line', 'How it is worked out', 'Amount'],
        rows: [
          ['Goods (FOB price)', 'From the commercial invoice, converted to sterling', '£9,200'],
          ['Sea freight and insurance to the UK port', 'Added for the customs value', '£800'],
          ['Customs value', '£9,200 + £800', '£10,000'],
          ['Customs Duty at an invented 4%', '£10,000 × 4%', '£400'],
          [
            'Haulage from the port to your warehouse',
            'Incidental cost to the first UK destination',
            '£150',
          ],
          ['Value for VAT', '£10,000 + £400 + £150', '£10,550'],
          ['Import VAT at 20%', '£10,550 × 20%', '£2,110'],
          ['Duty and VAT at the border', '£400 + £2,110', '£2,510'],
        ],
      },
    },
    {
      heading: 'Is there a threshold below which no duty is charged?',
      paragraphs: [
        'For goods sent from abroad, GOV.UK says there is no Customs Duty on non-excise goods worth £135 or less sent to Great Britain; above £135, duty is charged at the rate for the goods and their origin. Gifts worth £39 or less are not charged VAT. These rules are written for goods sent from abroad, such as parcels; VAT can still be due below £135, and excise goods are treated differently.',
        'Do not plan a commercial import around the threshold. Declare the full, true value of every consignment, and never split a shipment or lower a value to stay under a line; the value you declare is what HMRC checks duty and VAT against.',
      ],
    },
    {
      heading: 'Which documents does HMRC expect you to keep?',
      paragraphs: [
        'HMRC’s step-by-step guide asks importers to keep commercial invoices, customs paperwork and the Import VAT Certificate (C79), which a VAT-registered business needs to claim back import VAT. If you claim a preferential rate under a trade agreement, GOV.UK says you must keep the proof of origin, which TradeDocs does not prepare, for at least 4 years, because HMRC may check it.',
        'Before any of that you need an EORI number starting with GB for imports into England, Wales or Scotland, and most businesses appoint a customs agent or use their transporter to make the import declaration. The agent works from the commercial invoice and packing list, so the value, origin, description and weights on them must be complete and consistent.',
      ],
    },
  ],
  faq: [
    {
      q: 'What is the import duty rate in the UK?',
      a: 'There is no single rate. Each commodity code has its own rate, which can differ by country of origin, and some goods are duty-free. Look up your code in the UK Trade Tariff.',
    },
    {
      q: 'Is import VAT charged on the duty as well as the goods?',
      a: 'Yes. HMRC’s value for import VAT includes any Customs Duty payable, as well as the customs value and incidental costs to the first UK destination.',
    },
    {
      q: 'Who pays UK import duty, the seller or the buyer?',
      a: 'It depends on the agreed Incoterms® rule. Under DDP the seller arranges and pays import duty and VAT; under most other rules, including DAP, the buyer or its agent pays them.',
    },
    {
      q: 'Can I reclaim UK import duty like VAT?',
      a: 'Not in the same way. Import VAT can usually be recovered by a VAT-registered business; Customs Duty is a cost, though GOV.UK describes refunds for overpayments or rejected goods.',
    },
    {
      q: 'Do I pay duty on goods from the EU?',
      a: 'Goods from the EU are imports into Great Britain. They may qualify for a reduced rate under the UK–EU trade agreement if they meet its rules of origin and you hold the proof of origin the Trade Tariff lists.',
    },
  ],
  sources: [
    'b2-gov-uk-import-step-by-step',
    'b2-gov-uk-trade-tariff',
    'b2-gov-uk-value-imports',
    'w3-hmrc-delivery-costs',
    'b2-gov-uk-vat-on-imports',
    'b2-gov-uk-vat-rates',
    'b2-gov-uk-goods-sent-from-abroad',
    'b2-gov-uk-preference-agreements',
    'a5-gov-uk-cds-commodity-codes',
    'icc-incoterms-2020',
  ],
  primaryTool: '/tools/landed-cost-calculator',
  tools: ['/tools/landed-cost-calculator', '/tools/invoice-generator', '/tools/incoterms'],
  callout: {
    afterSection: 1,
    tool: '/tools/landed-cost-calculator',
    title: 'Add duty and VAT to your cost',
    text: 'Enter the goods value, freight, insurance and the duty and VAT rates you looked up to see the total landed cost and the cost per unit.',
  },
  related: [
    '/guides/uk-commodity-codes',
    '/blog/how-to-calculate-import-duty',
    '/guides/landed-cost',
    '/guides/eori-number',
    '/blog/duty-vs-tariff',
    '/guides/dap-vs-ddp',
  ],
  cover: {
    id: 'V7npJMbWYj4',
    src: 'https://images.unsplash.com/photo-1602475827026-f2dbb24abcd7',
    width: 4250,
    height: 2503,
    alt: 'Container cranes at the Port of Felixstowe, a UK entry point for imports, against a sunset',
    caption: 'Cranes at the Port of Felixstowe at sunset',
    photographer: { name: 'Matthew Cassidy', profile: 'https://unsplash.com/@togglephoto10' },
    page: 'https://unsplash.com/photos/silhouette-of-cargo-ship-during-sunset-V7npJMbWYj4',
  },
};

export default article;
