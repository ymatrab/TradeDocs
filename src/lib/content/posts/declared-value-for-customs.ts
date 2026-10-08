import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "declared value" 390; "declared value for
 * customs" 90.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave B (v2 #36).
 */
const article: ContentArticle = {
  slug: 'declared-value-for-customs',
  title: 'Declared value for customs vs declared value for carriage',
  metaTitle: 'Declared value for customs, and for carriage',
  description:
    'The two declared values on a shipment: the customs value duty is assessed on and the carriage value that sets the carrier’s liability, how each is worked out and why they differ.',
  lede: 'A courier booking or an air waybill can ask for a declared value twice: once for customs and once for carriage. They sound alike and are often confused, but they answer different questions. One tells customs what the goods are worth so duty and tax can be assessed. The other tells the carrier how much it is liable for if the goods are lost. This post explains both.',
  answer:
    'The declared value for customs is the value of the goods that customs uses to assess duty and tax, normally the price paid, as the WTO Valuation Agreement sets out. The declared value for carriage is a separate figure that sets the carrier’s liability for loss or damage. Leaving it blank leaves the carrier’s standard liability limit in place.',
  keyFacts: [
    'The WTO states that transaction value, the price actually paid or payable for the goods, is the main basis of customs value under its Customs Valuation Agreement.',
    'HMRC’s Method 1 guidance adds the costs of transport, insurance, loading and handling to the UK border to the price when valuing UK imports.',
    'In 19 CFR 152.103, a CBP example excludes ocean freight and insurance from the transaction value of a US import.',
    'DHL Express’s US terms state that every shipment travels on a limited liability basis, with higher protection available on request for an additional charge.',
    'HMRC’s export guidance says to use the market value on the invoice for goods you are not selling.',
  ],
  definitions: [
    {
      term: 'Declared value for customs',
      meaning:
        'The value of the goods stated for customs, from which duty, import tax and trade statistics are worked out.',
    },
    {
      term: 'Declared value for carriage',
      meaning:
        'The value the shipper declares to the carrier to set the carrier’s liability above its standard limit.',
    },
    {
      term: 'Transaction value',
      meaning:
        'The price actually paid or payable for goods sold for export, adjusted as the importing country’s rules require; the first method of customs valuation.',
    },
    {
      term: 'NVD (no value declared)',
      meaning:
        'A carriage value left blank or marked NVD, so the carrier’s standard liability limit applies.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What does declared value mean in shipping?',
      paragraphs: [
        'It means one of two things, and the document usually tells you which. On a commercial invoice, a customs declaration or a postal CN23, the declared value is the value of the goods for customs. On a carrier’s waybill or booking screen, a separate field asks for a declared value for carriage, which sets how much the carrier will pay if the goods are lost or damaged.',
        'The two figures come from different rules. Customs value follows the importing country’s valuation law. Carriage value follows the carrier’s terms and the transport conventions behind them. Treat them as separate questions, even when the same number ends up in both boxes.',
      ],
    },
    {
      heading: 'What is the declared value for customs?',
      paragraphs: [
        'It is the value of the goods for duty and import tax, normally the price the buyer pays. The World Trade Organization explains that under its Customs Valuation Agreement the main basis is transaction value: the price actually paid or payable for the goods, with certain adjustments. WTO members apply the agreement, and each sets out the adjustments in its own law.',
        'Those adjustments differ on transport costs. HMRC’s Method 1 guidance adds the costs of transport, insurance, loading and handling connected with delivering the goods to the UK border, along with selling commissions and some royalties. In the US, an example in 19 CFR 152.103 excludes ocean freight and insurance from transaction value. That is why your invoice should list freight and insurance separately from the price of the goods: each country can then build its own customs value from the same figures.',
        'Postal shipments work the same way. The USPS International Mail Manual requires the mailer to declare a value on each item containing merchandise, and the customs form asks for the value of each article.',
      ],
    },
    {
      heading: 'What is the declared value for carriage?',
      paragraphs: [
        'It is the figure that sets the carrier’s liability. Carriers move goods on limited liability terms: DHL Express’s US terms (retrieved 8 October 2026), for example, state that every shipment travels on a limited liability basis, and that liability for air shipments is limited by the Montreal or Warsaw Convention, or otherwise to the lower of the market or declared value and 26 SDR per kilogram. The Montreal Convention itself sets a per-kilogram limit for cargo in Article 22.',
        'If that limit is too low for your goods, the carrier offers a way to raise it. DHL’s terms describe a special declaration of value with Shipment Value Protection, arranged in writing or in its booking system for an additional charge, or your own insurance instead. Read your carrier’s current terms; the limits, the names of the services and the conditions differ between carriers.',
      ],
    },
    {
      heading: 'How do the two declared values compare?',
      paragraphs: [
        'They share a name and sometimes a number, but nothing else. The table sets them side by side.',
      ],
      table: {
        caption: 'Declared value for customs and declared value for carriage, compared',
        head: ['Point', 'For customs', 'For carriage'],
        rows: [
          [
            'Question it answers',
            'What are the goods worth for duty and tax?',
            'How much is the carrier liable for?',
          ],
          [
            'Set by',
            'The importing country’s valuation rules',
            'The carrier’s terms and transport conventions',
          ],
          [
            'Usual figure',
            'The price paid, adjusted for freight and insurance as the country requires',
            'Up to the value of the goods, if you want cover above the standard limit',
          ],
          [
            'Can it be left blank?',
            'No; customs needs a value',
            'Yes; the standard limit then applies',
          ],
          [
            'Where it appears',
            'Commercial invoice, customs declaration, CN22 or CN23',
            'Waybill or booking, in the carriage value field',
          ],
        ],
      },
    },
    {
      heading: 'Can you declare a lower value to reduce duty?',
      paragraphs: [
        'No. The customs value is a matter of fact, not a choice. HMRC’s guidance says the seller’s invoice serves as evidence of the price paid or payable, and that customs asks for more information and issues a written decision when it doubts a declared value. The WCO–UPU guidelines on postal data expect the destination post to raise it with the origin post where a commercial sender’s declared value is lower than its invoice.',
        'The carriage value works the other way round. Under terms such as DHL’s, liability is capped at the lower of the declared value and the standard limit, so a carriage value below the real value only lowers what you can recover. Declare the real value for customs, and set the carriage value by how much risk you want to carry.',
      ],
    },
    {
      heading: 'What value do you declare for samples, gifts and returns?',
      paragraphs: [
        'A fair value, even when nobody pays. HMRC’s export guidance says to use the market value of goods that are not being sold. Its valuation guidance explains that gifts, samples and promotional items supplied free of charge are not sales, so transaction value cannot be used and the value is usually found under Method 6, based on what the goods would have cost to buy.',
        'Mark free goods as supplied free of charge, and still give each line a realistic value. Goods returned after repair, or sent back under warranty, often have their own relief rules in the importing country; state the reason for the shipment clearly and check the relief with the importer or their broker.',
      ],
    },
    {
      heading: 'How do you set both values on a shipment?',
      paragraphs: [
        'Work out the customs value from the sale, then decide the carriage value separately.',
      ],
      steps: [
        'Take the price the buyer pays for the goods from the commercial invoice, in the invoice currency.',
        'List freight and insurance on the invoice as separate lines, so each importing country can add or exclude them under its rules.',
        'For goods not sold, use their market value and say on the invoice that they are supplied free of charge.',
        'Enter the same goods value in the customs value field of the waybill, the courier booking or the postal form.',
        'Decide whether the carrier’s standard liability is enough. If not, declare a carriage value up to the value of the goods and request the carrier’s added protection, or arrange cargo insurance.',
        'Check the invoice, packing list and customs form agree before you hand the goods over.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is declared value for carriage the same as insurance?',
      a: 'Not necessarily. It raises the carrier’s liability under its terms, often for a charge. DHL Express, for example, names its option Shipment Value Protection and mentions your own insurance as the alternative. Read the carrier’s terms for what is covered.',
    },
    {
      q: 'Does the declared value for customs include shipping costs?',
      a: 'It depends on the importing country. HMRC adds transport and insurance to the UK border, while a CBP example in 19 CFR 152.103 excludes ocean freight and insurance. Show them separately on the invoice.',
    },
    {
      q: 'What happens if I leave the carriage value blank?',
      a: 'The carrier’s standard liability limit applies. DHL Express’s US terms, for instance, describe every shipment as carried on a limited liability basis unless greater protection is arranged.',
    },
    {
      q: 'What if customs thinks my declared value is wrong?',
      a: 'HMRC’s guidance says customs will ask for more information, explain its concerns, give you time to respond and then issue a written decision. Keep the contract, the invoice and proof of payment.',
    },
  ],
  sources: [
    'wto-customs-valuation',
    'b3-gov-uk-method-1-transaction-value',
    'b3-cfr-19-152-103',
    'b3-dhl-express-terms-us',
    'a4-montreal-convention',
    'b3-usps-imm-123',
    'b3-wco-upu-postal-ead-guidelines',
    'b3-gov-uk-export-goods',
    'b3-gov-uk-free-of-charge-goods',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: ['/tools/invoice-generator', '/tools/landed-cost-calculator', '/tools/incoterms'],
  callout: {
    afterSection: 1,
    tool: '/tools/invoice-generator',
    title: 'Keep the goods value, freight and insurance apart',
    text: 'The commercial invoice generator lists the price of the goods, freight and insurance on separate lines, so each importing country can build its customs value from the same invoice.',
  },
  related: [
    '/blog/cargo-insurance-for-exporters',
    '/blog/commercial-invoice-for-samples',
    '/blog/brokerage-fees-and-duties-on-courier-shipments',
    '/guides/landed-cost',
    '/blog/cn22-vs-cn23',
  ],
  cover: {
    id: 'RqZ-xGRnCYI',
    src: 'https://images.unsplash.com/photo-1758351507026-71ad3645cb43',
    width: 3706,
    height: 2779,
    alt: 'Cardboard shipping box sealed with red fragile tape, ready to be declared and handed to a carrier',
    caption: 'A cardboard box sealed with red fragile tape',
    photographer: { name: 'Ari Sha', profile: 'https://unsplash.com/@46057_ma' },
    page: 'https://unsplash.com/photos/cardboard-box-sealed-with-red-fragile-tape-RqZ-xGRnCYI',
  },
};

export default article;
