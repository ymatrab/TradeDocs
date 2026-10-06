import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-06';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "ups brokerage fee" 1,300, KD 22; "fedex duties
 * and taxes" 880, KD 25; "fedex ddp" 260; "dhl ddp" 170.
 * Plan: docs/research/content-plan-v2-2026-10-06.md, batch 1.
 * Carrier fee pages could not be opened on 2026-10-06 (automated access blocked), so the post
 * quotes no carrier fee amounts or carrier-specific rules; it points readers to the carrier.
 */
const article: ContentArticle = {
  slug: 'brokerage-fees-and-duties-on-courier-shipments',
  title: 'Brokerage fees and duties on courier shipments: who pays and why',
  metaTitle: 'Courier brokerage fees and duties: who pays?',
  description:
    'Why the receiver of a UPS, FedEx or DHL parcel gets a bill for duties, taxes and brokerage, how DAP and DDP decide who pays, and how to estimate the charges before you ship.',
  lede: 'Your customer’s parcel arrives with a bill attached, and the email that follows is not friendly. The charge is rarely a mistake. It is the import cost the sale terms left with the receiver, plus the courier’s fee for clearing the goods.',
  answer:
    'When a courier delivers an international parcel, someone must pay the import duties and taxes and the courier’s charge for clearing customs. Unless the shipper agreed to pay them, as under DDP, they fall on the receiver, which is what happens under DAP. The fix is to agree the Incoterms® rule before shipping and quote accordingly.',
  keyFacts: [
    'Under the ICC’s Incoterms® 2020 rules, DAP leaves import clearance, duties and import taxes with the buyer.',
    'Under DDP, the seller clears the goods for import and pays any import duties and taxes.',
    'CBP states that customs brokers are licensed by CBP but are not CBP employees.',
    'CBP states that the importer of record stays responsible for the entry and all duties, taxes and fees even when using a broker.',
    'In the US, 19 CFR 143.21 makes shipments valued at $2,500 or less eligible for informal entry, with some exceptions.',
  ],
  definitions: [
    {
      term: 'Duty',
      meaning:
        'The charge the importing country’s tariff sets on imported goods, often a percentage of their customs value.',
    },
    {
      term: 'Import taxes',
      meaning:
        'Taxes such as VAT, GST or sales tax that some countries collect at import, on top of duty.',
    },
    {
      term: 'Brokerage fee',
      meaning:
        'The charge a courier or customs broker makes for preparing and filing the import entry.',
    },
    {
      term: 'DAP and DDP',
      meaning:
        'Incoterms® 2020 rules: under DAP the buyer pays import costs; under DDP the seller does.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'Why did the receiver get a bill for duties and brokerage?',
      paragraphs: [
        'Because the goods were shipped on terms that leave import costs with the receiver, and somebody had to clear them. When a courier delivers to another country, the parcel cannot be released until an import entry is filed and what is owed is settled. Couriers commonly arrange that clearance so the parcel keeps moving, then collects the cost from whoever the shipment says should pay.',
        'Two different things end up on that bill. One is what the importing country charges: duty from its tariff and, in many countries, import tax. The other is what the courier charges for the clearance work. The first is set by law; the second is the courier’s own price.',
        'If the shipper chose “receiver pays duties and taxes” when booking, or quoted a price that did not mention import costs, the receiver pays both. That is normal under DAP, the Incoterms® 2020 rule that delivers the goods to the buyer’s door without import clearance.',
      ],
    },
    {
      heading: 'What is the difference between duties, taxes and brokerage fees?',
      paragraphs: [
        'They are set by different parties and calculated on different bases, which is why one parcel can carry three lines of charges.',
      ],
      table: {
        caption: 'Charges on an imported courier parcel and who sets each one',
        head: ['Charge', 'Who sets it', 'What it is usually based on'],
        rows: [
          [
            'Import duty',
            'The importing country’s tariff',
            'The customs value and the tariff line the goods fall under',
          ],
          [
            'Import tax (VAT, GST, sales tax)',
            'The importing country’s tax law',
            'Usually the customs value plus duty, under that country’s rules',
          ],
          [
            'Brokerage or clearance fee',
            'The courier or customs broker',
            'Its own published or agreed price for filing the entry',
          ],
          [
            'Other carrier charges',
            'The courier',
            'Its terms of carriage; ask for the current schedule for the destination',
          ],
        ],
      },
    },
    {
      heading: 'Who pays duties under DAP and DDP?',
      paragraphs: [
        'The rule in the contract answers it. Under the ICC’s Incoterms® 2020 rules, DAP (Delivered at Place) has the seller deliver the goods to the named place ready for unloading, with export clearance done, while the buyer handles import clearance and pays import duties and taxes. DDP (Delivered Duty Paid) moves all of that to the seller: the seller clears the goods for import and pays what is due.',
        'On a courier booking, the payment option you pick for duties and taxes should match the rule on your invoice. A DDP invoice with a “receiver pays” booking leaves your customer paying for something you promised to cover. A DAP invoice with a “shipper pays” booking gives away money you did not price in.',
        'The Incoterms® rules decide costs between buyer and seller. They do not change who the importer of record is in the eyes of customs, and CBP is clear that the importer of record stays responsible for the entry and the duties, taxes and fees even when a broker files it.',
      ],
    },
    {
      heading: 'Can the sender pay the duties on a courier shipment?',
      paragraphs: [
        'Usually yes, by booking the shipment as duties and taxes paid by the shipper, which is the courier’s version of DDP. The courier then bills you instead of the receiver after the goods clear.',
        'Before offering it, check three things. First, what the courier will bill you for: duties, taxes and its own charges, at amounts you will only know after clearance. Second, whether the destination country expects a non-resident seller to register for import tax before acting as the paying party; that is a question for the destination’s tax authority, not the courier. Third, whether your price covers it, because a DDP quote that forgets import tax is a loss on every parcel.',
      ],
    },
    {
      heading: 'How do you estimate duties and fees before you ship?',
      paragraphs: [
        'You can estimate them, not know them; customs makes the final decision. CBP says plainly that it determines the correct rate of duty, not the importer. A careful estimate still beats a surprise.',
      ],
      steps: [
        'Find the tariff line for the goods in the importing country’s official tariff, such as the USITC Harmonized Tariff Schedule for the US, or ask for a binding ruling if it is unclear.',
        'Work out the customs value on that country’s basis. The US excludes international freight and insurance under 19 CFR 152.102; the UK includes delivery costs up to the UK border, according to HMRC.',
        'Apply the duty rate printed in the tariff to that value.',
        'Add any import tax on the base the destination uses.',
        'Add the courier’s clearance charge, from its current schedule or a quote.',
        'Put the figures into a landed cost calculation, so you can quote DDP or warn the buyer under DAP.',
      ],
    },
    {
      heading: 'How do you avoid a surprise bill for your customer?',
      paragraphs: [
        'Decide who pays before the parcel leaves, and say so in writing. The surprise comes when the buyer did not know import costs were theirs.',
      ],
      list: [
        'State the Incoterms® rule and named place on the quotation, the proforma and the commercial invoice.',
        'Match the courier’s duties-and-taxes payment option to that rule.',
        'Under DAP, tell the customer in the quotation that duties, taxes and clearance charges will be billed on delivery.',
        'Under DDP, include your estimate of those costs in the price.',
        'Declare the true value and an exact description on the commercial invoice. Never lower a value or blur a description to reduce charges; an incorrect declaration can breach customs law and leaves the receiver with the problem.',
      ],
    },
  ],
  faq: [
    {
      q: 'What is a brokerage fee on a courier shipment?',
      a: 'It is the courier’s or customs broker’s charge for preparing and filing the import entry. It is separate from duty and import tax, which the importing country sets.',
    },
    {
      q: 'Why do I pay brokerage if no duty was due?',
      a: 'Because the entry still had to be filed. The clearance work is the same whether the tariff rate is zero or not, so a courier may charge for it either way, depending on its terms.',
    },
    {
      q: 'What happens if the receiver refuses to pay the duties?',
      a: 'The courier’s terms of carriage decide that, and they may make the shipper liable for unpaid charges or for return costs. Read them before choosing who pays.',
    },
    {
      q: 'Is DDP shipping always the better choice for the customer?',
      a: 'It is simpler for the customer, who pays nothing on delivery, but the seller takes on costs it cannot know exactly in advance and may face tax registration duties in some countries.',
    },
    {
      q: 'Does the shipping fee include duties?',
      a: 'Not unless the booking says duties and taxes are paid by the shipper. The transport charge and the import charges are billed separately.',
    },
  ],
  sources: [
    'icc-incoterms-2020',
    'w3-cbp-importer-tips',
    'w3-cbp-duty-rates',
    'w3-cbp-19-cfr-143-21',
    'w3-cbp-19-cfr-152-102',
    'w3-hmrc-delivery-costs',
    'trade-gov-commercial-invoice',
  ],
  primaryTool: '/tools/landed-cost-calculator',
  tools: ['/tools/landed-cost-calculator', '/tools/incoterms', '/tools/invoice-generator'],
  callout: {
    afterSection: 2,
    tool: '/tools/landed-cost-calculator',
    title: 'Estimate duties and fees before you quote',
    text: 'Enter the goods value, freight, the duty rate from the official tariff and the courier’s charges to see the landed cost under DAP or DDP.',
  },
  related: [
    '/guides/dap-vs-ddp',
    '/blog/how-to-calculate-import-duty',
    '/blog/duty-vs-tariff',
    '/blog/commercial-invoice-requirements',
  ],
  cover: {
    id: 'q8kR_ie6WnI',
    src: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59',
    width: 7952,
    height: 5304,
    alt: 'Cardboard parcels stacked in the back of a delivery van, ready for courier delivery',
    caption: 'Cardboard shipping boxes in the back of a delivery van',
    photographer: { name: 'Claudio Schwarz', profile: 'https://unsplash.com/@purzlbaum' },
    page: 'https://unsplash.com/photos/cardboard-shipping-boxes-in-delivery-van-q8kR_ie6WnI',
  },
};

export default article;
