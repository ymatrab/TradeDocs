import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "terminal handling charges" 50; "bunker adjustment
 * factor" 5,400 with no KD (volume anomaly, unverified).
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave D (v2 #48: BAF, THC and other line items
 * on a freight quote, and where each sits in landed cost). Carrier tariff pages did not load on
 * the retrieval date, so no carrier is cited and no amount is stated.
 */
const article: ContentArticle = {
  slug: 'ocean-freight-surcharges',
  title: 'Terminal handling charges, BAF and other ocean freight surcharges',
  metaTitle: 'Terminal handling charges and ocean surcharges',
  description:
    'What THC, BAF, CAF and the other lines on an ocean freight quote cover, where carriers must publish them for US trades, who pays them under the Incoterms rule, and how they reach landed cost.',
  lede: 'An ocean freight quote is rarely one number. Below the base rate sit lines with three-letter codes, some charged at the port of loading, some at the port of discharge and some that move with fuel prices or exchange rates. Each one has to be paid by someone, and the Incoterms® rule in your sale contract is where that question starts.',
  answer:
    'Terminal handling charges (THC) are what the terminal and carrier bill for handling a container at the port of loading or discharge. They sit beside the base ocean rate with other surcharges, such as the bunker adjustment factor (BAF) for fuel and the currency adjustment factor (CAF). Who pays each depends on the Incoterms® rule and the carriage contract.',
  keyFacts: [
    'The Austrian Federal Economic Chamber’s seafreight glossary defines THC as the handling costs for a container, BAF as a balance for changing fuel costs and CAF as a balance for currency fluctuations.',
    'Under 46 CFR 520.3, common carriers in the US foreign trades must keep tariffs open for public inspection showing all their rates, charges, classifications, rules and practices.',
    'The Federal Maritime Commission (FMC) requires vessel-operating common carriers to give the public free access to their tariff publication system.',
    'Under 46 CFR 520.8, a tariff change that increases a shipper’s cost cannot take effect earlier than thirty calendar days after publication.',
    'Demurrage and detention are charges for keeping a container too long, not surcharges on the freight rate.',
  ],
  definitions: [
    {
      term: 'Terminal handling charge (THC)',
      meaning:
        'The charge for handling a container at the terminal, billed separately at the origin and at the destination.',
    },
    {
      term: 'Bunker adjustment factor (BAF)',
      meaning: 'A surcharge that adjusts the freight for changes in the cost of ship fuel.',
    },
    {
      term: 'Currency adjustment factor (CAF)',
      meaning:
        'A surcharge that adjusts the freight for movements in the exchange rates the carrier deals in.',
    },
    {
      term: 'Tariff',
      meaning:
        'A carrier’s published list of rates, charges, rules and practices; in US trades it must be open to the public.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What are terminal handling charges?',
      paragraphs: [
        'Terminal handling charges are what you pay for the container to be handled at the port: received at the terminal, stored until the vessel arrives, lifted on board, and the reverse at the other end. The Austrian Federal Economic Chamber’s freight forwarding glossary defines THC simply as the handling costs for a container.',
        'There are two of them on most container shipments. Origin THC is charged at the port of loading and destination THC at the port of discharge. They are billed separately, often to different parties, which is why a quote can show one and not the other. Read the quote for the words “origin” and “destination” before you compare two prices.',
      ],
    },
    {
      heading: 'What surcharges appear on an ocean freight quote?',
      paragraphs: [
        'The base rate pays for moving the container between the two ports. The surcharges adjust it for costs that change or that apply only at certain ports. The table lists the common lines; the definitions follow the Austrian Federal Economic Chamber’s glossary, and the carrier’s own tariff is the authority for what each one includes on your route. This article gives no amounts, because they change and differ by carrier, route and date.',
      ],
      table: {
        caption: 'Common line items on an ocean freight quote',
        head: ['Line item', 'What it covers', 'Usually charged'],
        rows: [
          ['Base ocean freight', 'Carriage between the port of loading and the port of discharge', 'Per container or per cubic metre'],
          ['THC, origin', 'Handling the container at the port of loading', 'At origin'],
          ['THC, destination', 'Handling the container at the port of discharge', 'At destination'],
          ['BAF (bunker adjustment factor)', 'Changes in ship fuel costs', 'With the freight'],
          ['CAF (currency adjustment factor)', 'Exchange rate movements', 'With the freight'],
          ['Congestion surcharge', 'Waiting time at congested ports', 'With the freight, where applied'],
          ['Demurrage and detention', 'Keeping the container beyond the free time', 'After arrival, if incurred'],
        ],
      },
    },
    {
      heading: 'Where are ocean freight surcharges published?',
      paragraphs: [
        'In the US foreign trades, in the carrier’s tariff. Under 46 CFR 520.3, common carriers must keep tariffs open for public inspection in automated tariff systems, showing all their rates, charges, classifications, rules and practices. The FMC’s guidance for vessel-operating common carriers adds that they must give the public free access to the tariff publication system.',
        'So a surcharge is not a figure the carrier invents on the invoice. For US trades it should be traceable to a published tariff, or to a service contract if you have one. If a line on your bill does not match the quote or the tariff, ask the forwarder or carrier which tariff item it comes from.',
        'Other countries regulate carrier pricing differently. Outside US trades, ask the carrier or forwarder where its surcharges are published and which version applies to your sailing date.',
      ],
    },
    {
      heading: 'How much notice does a carrier give before a surcharge goes up?',
      paragraphs: [
        'In US trades, at least thirty calendar days. Under 46 CFR 520.8, a new or changed rate or charge that increases the shipper’s cost may not take effect earlier than thirty calendar days after it is published; a change that lowers the cost can take effect on publication. The FMC can grant a carrier special permission to shorten the notice period.',
        'This is why quotes carry a validity date and may say “surcharges as applicable at time of shipment”. The rate can be fixed while the surcharges move. If you quote a buyer a CFR or CIF price weeks before the sailing, allow for that, or agree with the buyer how a published increase will be handled.',
      ],
    },
    {
      heading: 'Who pays terminal handling charges under each Incoterms® rule?',
      paragraphs: [
        'The Incoterms® rule decides which party bears the costs up to the point of delivery and which bears them afterwards; the Incoterms® 2020 rules gather the allocation of costs into one article of each rule. The carriage contract decides whom the carrier invoices. The two do not always match, so read both.',
        'The general pattern, which your contract can change:',
      ],
      list: [
        'EXW and FCA: the buyer books the main carriage, so origin THC normally falls on the buyer once the goods are delivered, unless the contract says otherwise.',
        'FOB: the seller bears the costs until the goods are on board, so terminal handling at the port of loading can fall within the seller’s costs; check the sale contract and the forwarder’s terms.',
        'CFR, CIF, CPT and CIP: the seller contracts for the carriage, so charges included in that carriage contract are the seller’s cost; destination THC may be billed to the receiver unless the carriage contract includes it.',
        'DAP, DPU and DDP: the seller pays the carriage to the named place, which can take in destination THC as well; agree it in the contract.',
      ],
    },
    {
      heading: 'Where do surcharges sit in landed cost?',
      paragraphs: [
        'Every line on the freight bill ends up in somebody’s landed cost. For the importer, landed cost is the price of the goods plus freight, insurance, duty, taxes and the charges paid on arrival, destination THC included.',
        'Whether a charge is also part of the value for duty depends on the importing country. In the US, the transaction value under 19 U.S.C. § 1401a excludes the costs of international transportation and insurance. In the UK, HMRC includes transport and insurance up to the place of introduction into the UK, and costs after that point can be deducted if shown separately. Ask the forwarder to split origin, freight and destination charges on its invoice, so the importer can value the goods correctly.',
      ],
      steps: [
        'Ask for an all-in quote that lists origin charges, the ocean freight and destination charges as separate lines.',
        'Check each surcharge against the quote validity date and the sailing date.',
        'Mark which lines your Incoterms® rule puts on you and which on the buyer.',
        'Put your lines into the export price, and pass the buyer’s lines into its landed cost estimate.',
        'Keep the forwarder’s invoice, with each charge named, with the shipment file.',
      ],
    },
    {
      heading: 'Are demurrage and detention surcharges?',
      paragraphs: [
        'No. They are charges for keeping the carrier’s container, or keeping it at the terminal, beyond the free time, and they arise only if the container is not collected or returned in time. The Austrian Federal Economic Chamber’s glossary lists them separately from the surcharges for that reason. The guide to demurrage and detention covers how free time works and how to avoid them.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is THC included in the ocean freight rate?',
      a: 'Sometimes. A quote may list origin and destination THC as separate lines from the base rate. Read the quote for the words “included” or “excluded” next to each charge, and ask the forwarder if it is unclear.',
    },
    {
      q: 'Who pays destination THC under CIF?',
      a: 'It depends on the carriage contract and the sale contract. Under CIF the seller pays the carriage to the destination port; whether destination THC is in that carriage contract varies, so agree it with the buyer and write it down.',
    },
    {
      q: 'Why does BAF change from month to month?',
      a: 'BAF exists to pass changes in ship fuel costs through to shippers, so it moves when fuel prices move. In US trades, an increase must be published in the carrier’s tariff before it applies.',
    },
    {
      q: 'Can a carrier add a new surcharge after booking?',
      a: 'In US trades, a new charge that increases cost normally needs thirty days’ notice in the published tariff, unless the FMC grants special permission. Check the booking terms and the quote validity for the rules that apply to you.',
    },
    {
      q: 'Where can I complain about an ocean freight charge in the US?',
      a: 'Start with the carrier or forwarder that billed it and ask which tariff item it is based on. The Federal Maritime Commission regulates ocean carriers in the US foreign trades and publishes guidance on tariffs on its website.',
    },
  ],
  sources: [
    'd3-wko-seafreight-terms',
    'd3-cfr-46-520-3',
    'd3-cfr-46-520-8',
    'd3-fmc-voccs',
    'b7-cfr-46-520-2',
    'icc-incoterms-2020',
    'c3-usc-19-1401a',
    'c3-hmrc-delivery-costs',
  ],
  primaryTool: '/tools/landed-cost-calculator',
  tools: ['/tools/landed-cost-calculator', '/tools/export-price-calculator', '/tools/incoterms'],
  callout: {
    afterSection: 4,
    tool: '/tools/landed-cost-calculator',
    title: 'Add the freight lines to a landed cost',
    text: 'Enter the goods value, freight, insurance and the rates you have, and the landed cost calculator shows the total and the cost per unit. No tariff lookup, nothing stored.',
  },
  related: [
    '/guides/demurrage-and-detention',
    '/guides/landed-cost',
    '/blog/how-to-calculate-shipping-cost',
    '/guides/lcl-vs-fcl',
    '/blog/fob-vs-cfr',
    '/blog/freight-prepaid-vs-freight-collect',
  ],
  cover: {
    id: '5T5zmIqs0AM',
    src: 'https://images.unsplash.com/photo-1706499856012-14f062c72b49',
    width: 6728,
    height: 4485,
    alt: 'Gantry cranes over stacked containers at Shinagawa Container Terminal, where terminal handling is charged',
    caption: 'Shinagawa Container Terminal, Tokyo',
    photographer: { name: 'taro ohtani', profile: 'https://unsplash.com/@taro_ohtani' },
    page: 'https://unsplash.com/photos/a-crane-is-on-top-of-a-large-stack-of-containers-5T5zmIqs0AM',
  },
};

export default article;
