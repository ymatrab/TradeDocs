import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "freight collect vs prepaid" 480, KD 12;
 * "freight collect" 480; "freight terms" 480.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave B.
 * Definitions from the DCSA information model (carrier data standard); the link to who books
 * carriage from the ICC's Incoterms® 2020 rules; invoice and valuation rules from 19 CFR 141.86,
 * 19 CFR 152.102 and HMRC. No freight amounts; the example uses invented parties.
 */
const article: ContentArticle = {
  slug: 'freight-prepaid-vs-freight-collect',
  title: 'Freight prepaid vs freight collect: who pays the carrier?',
  metaTitle: 'Freight prepaid vs freight collect explained',
  description:
    'Freight prepaid means the shipper pays the carrier; freight collect means the consignee does. How the terms map to Incoterms rules, and how to show freight on the invoice.',
  lede: 'Every bill of lading or booking says who pays the freight, and the answer is not always the party who agreed to. The prepaid or collect term tells the carrier whom to invoice; the sale contract decides who should bear the cost. Keeping the two aligned avoids a release held for unpaid charges.',
  answer:
    'Freight prepaid means the shipper, or someone paying for it, pays the carrier’s charges; freight collect means the consignee, or someone paying for it, does. The DCSA carrier data standard defines the terms this way, charge by charge. Choose the term that matches your Incoterms® rule: C and D rules usually prepaid, E and F rules usually collect.',
  keyFacts: [
    'The DCSA information model defines prepaid charges as the responsibility of the shipper, or an invoice payer on its behalf, and collect charges as the responsibility of the consignee, or an invoice payer on its behalf.',
    'In the DCSA model, each charge on a booking carries its own payment term, so freight can be prepaid while other charges are collect.',
    'Under the ICC’s Incoterms® 2020 rules, the seller contracts for the main carriage under CPT, CIP, CFR, CIF, DAP, DPU and DDP.',
    'Under 19 CFR 141.86, a US commercial invoice must itemise all charges on the goods by name and amount, including freight and insurance.',
    'Under 19 CFR 152.102, the US customs value excludes international freight to the place of importation, while HMRC includes freight up to the UK border.',
  ],
  definitions: [
    {
      term: 'Freight prepaid',
      meaning:
        'The carrier invoices the shipper, or a party paying for the shipper, for the freight.',
    },
    {
      term: 'Freight collect',
      meaning:
        'The carrier invoices the consignee, or a party paying for the consignee, usually before it releases the goods.',
    },
    {
      term: 'Third-party billing',
      meaning:
        'An arrangement where a party other than the shipper or consignee, named as the invoice payer, settles the charges.',
    },
    {
      term: 'Payment term',
      meaning:
        'The prepaid or collect marking on a booking or transport document, set charge by charge.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is the difference between freight prepaid and freight collect?',
      paragraphs: [
        'Who the carrier invoices. The Digital Container Shipping Association, which publishes the data standards that ocean carriers use for bookings and bills of lading, defines a charge as prepaid when the shipper, or an invoice payer on the shipper’s behalf, is responsible for it, and as collect when the consignee, or an invoice payer on the consignee’s behalf, is responsible.',
        'The term is a billing instruction to the carrier. It does not move risk, ownership or customs duties. Those follow the sale contract and the Incoterms® rule, which is why the payment term on the booking should be chosen from the contract, not the other way round.',
      ],
      table: {
        caption: 'Freight prepaid and freight collect compared',
        head: ['', 'Freight prepaid', 'Freight collect'],
        rows: [
          [
            'Carrier invoices',
            'The shipper, or its invoice payer',
            'The consignee, or its invoice payer',
          ],
          [
            'Usual Incoterms® rules',
            'CPT, CIP, CFR, CIF, DAP, DPU, DDP',
            'EXW, FCA, FAS, FOB',
          ],
          ['Who books the main carriage', 'Usually the seller', 'Usually the buyer'],
          [
            'Seller’s invoice to the buyer',
            'Freight included in the price, or itemised',
            'Freight not charged by the seller',
          ],
          [
            'Risk of unpaid charges',
            'With the shipper',
            'With the consignee, and can hold up release',
          ],
        ],
      },
    },
    {
      heading: 'Can some charges be prepaid and others collect?',
      paragraphs: [
        'Yes. In the DCSA model each charge on a booking has its own payment term, so the ocean freight can be prepaid while destination charges are collect. Charges at origin, such as export handling, and charges at destination, such as terminal handling and delivery, can be billed separately from the main freight.',
        'State the term for every charge in your shipping instructions. If you leave it to the carrier’s default, a charge you meant to pay can be invoiced to your buyer, or the other way round, and the buyer’s first sight of it is at the port.',
      ],
    },
    {
      heading: 'Which Incoterms rules go with freight prepaid?',
      paragraphs: [
        'The C and D rules. Under the ICC’s Incoterms® 2020 rules, the seller contracts for carriage to the named place under CPT, CIP, CFR and CIF, and for delivery at destination under DAP, DPU and DDP. The seller books the carrier and pays it, so the freight is normally prepaid and recovered from the buyer through the price.',
        'The E and F rules usually go with freight collect. Under EXW, FCA, FAS and FOB the buyer arranges the main carriage, so the buyer’s carrier or forwarder bills the buyer. Under FCA the parties can agree that the seller books the carriage at the buyer’s cost; if you do, make sure the booking and the invoice say who pays.',
      ],
    },
    {
      heading: 'How do you choose between prepaid and collect?',
      paragraphs: [
        'Let the sale contract decide, then check the practical points. These steps keep the booking, the invoice and the contract consistent.',
      ],
      steps: [
        'Read the Incoterms® rule and named place in the sale contract or proforma invoice.',
        'If you contract the main carriage, book it freight prepaid; if the buyer does, expect freight collect from the buyer’s forwarder.',
        'Agree in writing who pays origin and destination charges that sit outside the main freight.',
        'Give the carrier a payment term for every charge in the shipping instructions.',
        'Show the agreed freight and insurance on the commercial invoice as the importing country requires.',
        'Check the bill of lading or air waybill draft for the prepaid or collect marking before it is issued.',
      ],
    },
    {
      heading: 'How should freight appear on the commercial invoice?',
      paragraphs: [
        'Itemised, when you are charging it. Under 19 CFR 141.86, a commercial invoice for a US import must list all charges on the goods by name and amount, including freight, insurance and commission. That matters for duty: under 19 CFR 152.102, the US transaction value excludes international freight and insurance to the place of importation, so a separate freight line keeps it out of the dutiable value.',
        'Other countries treat freight differently. HMRC includes transport and insurance costs up to the point the goods enter the UK in the customs value, so the freight is part of the value whether you prepay it or the buyer pays it on collect. Check the importing country’s valuation rules and show the freight the way its customs expects.',
      ],
      table: {
        caption: 'Worked example with invented parties: a CIF sale, freight prepaid',
        head: ['Invoice line', 'Shown as'],
        rows: [
          ['Goods, 400 units (invented)', 'Unit price and total'],
          ['Ocean freight to the named port', 'Separate line, by name and amount'],
          ['Marine insurance', 'Separate line, by name and amount'],
          ['Incoterms® rule', 'CIF named port of destination, Incoterms® 2020'],
          ['Carrier booking', 'Ocean freight prepaid by the seller'],
        ],
      },
    },
    {
      heading: 'What happens if freight collect is not paid?',
      paragraphs: [
        'Delivery can stall. On a collect shipment the carrier invoices the consignee, and the carrier’s terms of carriage set out what it may do while its charges are unpaid, including whether it releases the goods. Read those terms before you agree collect. A consignee that delays payment can leave the goods waiting at the terminal, and the shipper is not clear of the problem either, because the buyer is the shipper’s customer.',
        'Agree collect terms only with a buyer who has its own forwarder and an account with the carrier, or who has confirmed it will pay. Where that is uncertain, booking prepaid under a C or D rule and charging the freight in the price keeps control of the shipment with you.',
      ],
    },
  ],
  faq: [
    {
      q: 'Does FOB mean freight collect?',
      a: 'Usually. Under FOB the buyer contracts the ocean freight, so the buyer’s carrier bills the buyer and the bill of lading is normally marked freight collect.',
    },
    {
      q: 'Does CIF mean freight prepaid?',
      a: 'Yes, normally. Under CIF the seller contracts and pays for carriage to the named port and covers insurance, so the freight is prepaid and recovered in the price.',
    },
    {
      q: 'Is freight collect cheaper for the seller?',
      a: 'It moves the carrier’s invoice to the buyer, but not the effort: the seller still has to hand over the goods under the agreed rule. Price the sale to match the term.',
    },
    {
      q: 'Can a third party pay the freight?',
      a: 'Yes. The DCSA model allows an invoice payer acting for the shipper or the consignee, so a parent company or forwarder can settle the charges.',
    },
    {
      q: 'Is freight prepaid the same as delivered duty paid?',
      a: 'No. Prepaid covers the carrier’s charges only. Under DDP the seller also pays import duties and taxes, which have nothing to do with the freight term.',
    },
  ],
  sources: [
    'b1-dcsa-charges-payment-term',
    'b1-dcsa-charge',
    'icc-incoterms-2020',
    'w1-ita-know-your-incoterms',
    'us-cbp-invoice-contents',
    'w3-cbp-19-cfr-152-102',
    'w3-hmrc-delivery-costs',
  ],
  primaryTool: '/tools/incoterms',
  tools: ['/tools/incoterms', '/tools/invoice-generator', '/tools/landed-cost-calculator'],
  callout: {
    afterSection: 2,
    tool: '/tools/incoterms',
    title: 'Check who books the carriage',
    text: 'See, rule by rule, who contracts the main carriage, where risk passes and who clears customs under the Incoterms® 2020 rules.',
  },
  related: [
    '/blog/cif-vs-fob',
    '/blog/fob-vs-ddp',
    '/blog/exw-vs-fca',
    '/guides/dap-vs-ddp',
    '/guides/what-is-a-bill-of-lading',
    '/blog/how-to-calculate-shipping-cost',
  ],
  cover: {
    id: 'WhsEqs7VVP8',
    src: 'https://images.unsplash.com/photo-1784914182515-a10fcc716d5d',
    width: 5882,
    height: 3921,
    alt: 'A cargo ship docked under blue gantry cranes, with its freight charges billed prepaid or collect',
    caption: 'A cargo ship docked under gantry cranes',
    photographer: { name: 'Julia Taubitz', profile: 'https://unsplash.com/@justmejuliee' },
    page: 'https://unsplash.com/photos/cargo-ship-docked-under-towering-blue-gantry-cranes-WhsEqs7VVP8',
  },
};

export default article;
