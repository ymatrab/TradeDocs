import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "first sale rule" 210, KD n/a.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave D (new in v3; conversion: landed).
 */
const article: ContentArticle = {
  slug: 'first-sale-rule',
  title: 'First sale rule: valuing US imports on the factory price',
  metaTitle: 'First sale rule: US customs value explained',
  description:
    'How the US first sale rule lets an importer declare the factory’s price to a middleman as customs value, the Nissho Iwai test, and the paper trail CBP expects.',
  lede: 'When goods pass from a factory to a trading company and then to you, there are two prices on the way: the factory’s price to the middleman and the middleman’s price to you. US customs normally values the goods on the price you paid. The first sale rule is the narrow, well-documented route to using the earlier, lower price instead.',
  answer:
    'The first sale rule lets a US importer base customs value on the price a middleman paid the foreign manufacturer, not the higher price the importer paid the middleman. CBP accepts it only when that earlier sale is a bona fide sale at arm’s length and the goods were clearly destined for the United States, and the importer proves both.',
  keyFacts: [
    'CBP presumes that transaction value is based on the price actually paid or payable by the importer, and the burden is on the importer to rebut that presumption.',
    'Under the Nissho Iwai standard that CBP applies, the first sale must be at arm’s length, free of non-market influences, and for goods clearly destined for export to the United States.',
    'CBP’s informed compliance publication on bona fide sales treats the buyer taking title and risk of loss as signs that a real sale took place.',
    'Under 19 CFR 152.103, a related-party transaction value is acceptable if the relationship did not influence the price or the value closely approximates a test value.',
    'In ruling H347879 of 12 September 2025, CBP again applied the Nissho Iwai standard and rejected a first sale claim for lack of a bona fide sale.',
  ],
  definitions: [
    {
      term: 'Transaction value',
      meaning:
        'The price actually paid or payable for imported goods, plus certain statutory additions; the main basis of US customs value.',
    },
    {
      term: 'Middleman',
      meaning:
        'In CBP’s words, a party that both buys the goods (usually from the foreign manufacturer) and sells them (usually to the US importer) in a multi-tiered transaction.',
    },
    {
      term: 'Bona fide sale',
      meaning:
        'A real transfer of ownership for a price, in which the buyer takes title and the risk of loss, rather than an arrangement in name only.',
    },
    {
      term: 'Clearly destined',
      meaning:
        'CBP’s test that, when the middleman bought or contracted to buy, the only possible destination for the goods was the United States.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is the first sale rule?',
      paragraphs: [
        'It is a way of valuing imports in a chain of two or more sales. US customs value starts from transaction value, the price actually paid or payable for the goods. Where there is only one sale, the factory to you, there is only one price to use. Where a trading company sits in the middle, there are at least two sales, and the question is which one counts.',
        'CBP’s starting point is the sale to you. Its informed compliance publication on bona fide sales says there is a presumption that transaction value is based on the price actually paid or payable by the importer, and that the burden is on the importer to rebut it. The first sale rule is how you rebut it: you show that the earlier sale, from the manufacturer to the middleman, meets the legal test, and the goods are appraised on that price.',
        'The idea comes from case law. CBP’s publication describes the Federal Circuit’s decision in Nissho Iwai, which held that a manufacturer’s price can be a valid transaction value when the goods are clearly destined for export to the United States and the manufacturer and middleman deal at arm’s length, with no non-market influence affecting the price. CBP still applies that standard; ruling H347879 of September 2025 quotes it.',
      ],
    },
    {
      heading: 'Why does the first sale price matter for duty?',
      paragraphs: [
        'Because duty is usually worked out on the customs value. If the middleman adds a margin to the factory price, the first sale price is lower than the price you pay, and so is the duty calculated on it. The middleman’s margin drops out of the dutiable value.',
        'That is also why CBP looks hard at these claims. The rule is lawful and long-standing, but the lower value has to be backed by evidence of a real earlier sale. A first sale value without that evidence is a misdeclared value, and the importer of record carries the responsibility for it.',
      ],
    },
    {
      heading: 'What conditions must the first sale meet?',
      paragraphs: [
        'Three, each of which the importer has to prove with documents. CBP’s publication and its rulings set them out as follows.',
      ],
      table: {
        caption: 'First sale conditions as CBP describes them',
        head: ['Condition', 'What CBP looks for'],
        rows: [
          [
            'A bona fide sale between manufacturer and middleman',
            'The middleman takes title and the risk of loss, and acts as a buyer and seller rather than an agent; in its 2025 ruling CBP found delivery terms alone did not prove it',
          ],
          [
            'An arm’s length price',
            'Unrelated parties are generally treated as dealing at arm’s length; related parties must show the relationship did not influence the price, or that the value closely approximates a test value',
          ],
          [
            'Goods clearly destined for the United States',
            'When the middleman bought or contracted to buy, the only possible destination was the United States, and that stays evident throughout the transaction',
          ],
        ],
      },
    },
    {
      heading: 'How does CBP decide goods were clearly destined for the US?',
      paragraphs: [
        'Case by case, from the evidence at the time of the first sale. CBP’s publication says that a shipment addressed to the United States when it is handed to the carrier is not enough by itself.',
        'It gives an example of what does count: table lamps made to a US retailer’s design specifications, carrying that retailer’s labels, logos, unique stock numbers and bar codes, and shipped directly from the country of manufacture to the United States, so the goods could not be diverted elsewhere. Other evidence it mentions includes manufacture and design features made to the US buyer’s requirements, often shown in samples.',
        'The weak case is the opposite: generic goods bought by a trading company for stock, which might be sold to any market. If the middleman did not yet know the goods were going to the United States when it bought them, the first sale price is unlikely to qualify.',
      ],
    },
    {
      heading: 'What documents support a first sale claim?',
      paragraphs: [
        'A complete paper trail for every sale in the chain. CBP’s publication asks for the roles of all the parties and the documents for each transaction, and its 2025 ruling lists purchase orders, invoices, proof of payment, contracts and correspondence. CBP’s publication also names distribution agreements, bills of lading and company reports as possible evidence that a party held title and bore the risk of loss.',
        'You also need the figures that make up transaction value. CBP’s publication says the importer must give sufficient information on the statutory additions, such as packing, selling commissions, assists, royalties and licence fees, for the sale it relies on. Its example: if the middleman supplied assists to the factory, the importer must say so and state their value; without that information, transaction value cannot be based on the first sale.',
        'Collect the documents before the shipment, not after. The middleman’s invoice from the factory is often the one it least wants to share, because it shows its margin.',
      ],
      steps: [
        'Map the chain: manufacturer, middleman, importer, and who holds title at each step.',
        'Obtain the manufacturer’s invoice to the middleman and the middleman’s invoice to you for the same goods.',
        'Collect purchase orders, contracts, proof of payment for both sales and the shipping documents.',
        'Gather evidence that the goods were made or marked for the US market at the time of the first sale.',
        'Record any assists, packing, commissions or royalties that relate to the first sale.',
        'Ask your licensed customs broker to review the file before the entry declares the first sale value.',
      ],
    },
    {
      heading: 'What does a first sale look like in figures?',
      paragraphs: [
        'The figures below show how the two prices compare on one line of goods. The companies, goods and amounts are invented, and the duty rate is a placeholder to replace with the real rate from the Harmonized Tariff Schedule for your goods.',
      ],
      table: {
        caption: 'Worked example with invented parties and figures (USD)',
        head: ['', 'First sale', 'Last sale'],
        rows: [
          [
            'Seller to buyer',
            'Harbourlight Ceramics (factory) to Eastgate Trading (middleman)',
            'Eastgate Trading to Cobalt Home Inc. (US importer)',
          ],
          ['Goods', '2,000 glazed stoneware planters', 'The same 2,000 planters'],
          ['Invoice price', '18,000.00', '22,000.00'],
          ['Placeholder duty rate', 'R', 'R'],
          ['Duty on that value', '18,000 × R', '22,000 × R'],
          [
            'Accepted only if',
            'Bona fide, arm’s length, clearly destined for the US, fully documented',
            'Default basis CBP presumes',
          ],
        ],
      },
    },
    {
      heading: 'Does the first sale rule apply outside the United States?',
      paragraphs: [
        'Do not assume it does. This article describes US practice under CBP’s publication, its rulings and 19 CFR 152.103. Other customs authorities apply their own valuation rules to successive sales, and they may not follow the US approach. Check the importing country’s customs guidance, or ask a broker there, before pricing a deal on a first sale value abroad.',
      ],
    },
  ],
  faq: [
    {
      q: 'Can a related middleman still use the first sale price?',
      a: 'Possibly. CBP’s publication says related parties meet the arm’s length test only if the circumstances of sale show the relationship did not influence the price, or the value closely approximates a test value under 19 CFR 152.103.',
    },
    {
      q: 'Who has to prove the first sale qualifies?',
      a: 'The importer. CBP presumes the importer’s own purchase price is the basis of value, and the importer must rebut that with documents covering the whole chain.',
    },
    {
      q: 'Is an FOB term on the factory invoice enough to show a sale?',
      a: 'Not on its own. In ruling H347879, CBP found that delivery terms alone did not show the middleman held title or bore risk of loss, so it used the importer’s price.',
    },
    {
      q: 'Does the commercial invoice change under a first sale claim?',
      a: 'The invoice from your seller still shows the price you paid. The first sale value is declared at entry and supported by the factory’s invoice and the rest of the paper trail, so keep both invoices consistent and on file.',
    },
    {
      q: 'Can I ask CBP for a ruling before importing?',
      a: 'Yes. CBP’s publication describes the documents to submit with an advance ruling request on first sale, and says decisions are based on the evidence submitted.',
    },
  ],
  sources: ['d1-cbp-icp-bona-fide-sales', 'd1-cbp-ruling-h347879', 'd1-cornell-19-cfr-152-103'],
  primaryTool: '/tools/landed-cost-calculator',
  tools: [
    '/tools/landed-cost-calculator',
    '/tools/invoice-generator',
    '/tools/proforma-invoice-generator',
  ],
  callout: {
    afterSection: 2,
    tool: '/tools/landed-cost-calculator',
    title: 'Compare both values before you commit',
    text: 'Run the landed cost calculator once with the first sale price and once with the price you pay, using your own duty rate, to see what the documentation work is worth.',
  },
  related: [
    '/guides/customs-value',
    '/blog/declared-value-for-customs',
    '/guides/importer-of-record',
    '/blog/how-to-calculate-import-duty',
    '/guides/landed-cost',
  ],
  cover: {
    id: 'ibiKhsIQyfk',
    src: 'https://images.unsplash.com/photo-1789898552833-5cf9b0ed2074',
    width: 4896,
    height: 3264,
    alt: 'A container ship berthed at a terminal at night beneath large blue gantry cranes',
    caption: 'A container ship at a terminal at night under blue cranes',
    photographer: { name: 'Miguel A Amutio', profile: 'https://unsplash.com/@amutiomi' },
    page: 'https://unsplash.com/photos/container-ship-at-night-terminal-ibiKhsIQyfk',
  },
};

export default article;
