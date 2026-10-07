import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "cargo insurance" 2,400; "marine cargo insurance"
 * 720; "freight insurance" 390.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave A.
 * Cover levels under CIF and CIP from the ICC's Incoterms 2020 page; carrier limits from the
 * Hague-Visby Rules as enacted in the UK (a1-uk-cogsa-1971). No premium rates or insured
 * percentages are quoted: none is published by an authority we could open. The example is invented.
 */
const article: ContentArticle = {
  slug: 'cargo-insurance-for-exporters',
  title: 'Cargo insurance for exporters: who insures, and for what?',
  metaTitle: 'Cargo insurance for exporters: CIF, CIP and more',
  description:
    'What cargo insurance covers, why the carrier’s liability is not enough, who insures under each Incoterms rule, and what Institute Cargo Clauses (A) and (C) mean.',
  lede: 'Goods in transit are handled by people who are not you, on ships, aircraft and trucks you do not control. Cargo insurance pays for loss or damage on the way. The questions an exporter has to answer are who arranges it under the sale contract, how much cover to buy, and what the carrier will pay without it.',
  answer:
    'Cargo insurance covers goods against loss or damage in transit. Under the Incoterms® 2020 rules, only CIF and CIP oblige the seller to insure: CIF at the minimum Institute Cargo Clauses (C) cover, CIP at the wider Clauses (A). Under other rules, whoever bears the risk decides whether to insure, because carrier liability is limited by law.',
  keyFacts: [
    'The ICC states that under Incoterms® 2020, Institute Cargo Clauses (C) remains the default level of cover for CIF, and the parties may agree higher cover.',
    'The ICC states that CIP requires a higher level of cover, compliant with Institute Cargo Clauses (A) or similar clauses.',
    'Under the Hague-Visby Rules, as enacted in the UK Carriage of Goods by Sea Act 1971, a sea carrier’s liability is limited to 666.67 units of account per package or 2 per kilogramme of gross weight, whichever is higher.',
    'The unit of account in the Hague-Visby Rules is the special drawing right (SDR) defined by the International Monetary Fund.',
    'The Hague-Visby Rules discharge the carrier unless suit is brought within one year of delivery, or of the date the goods should have been delivered.',
  ],
  definitions: [
    {
      term: 'Cargo insurance',
      meaning:
        'Insurance against physical loss of or damage to goods while they are carried and stored in transit.',
    },
    {
      term: 'Institute Cargo Clauses',
      meaning:
        'Standard cargo policy wordings that the Incoterms® 2020 rules refer to, in which (A) gives wider cover than (C).',
    },
    {
      term: 'Limitation of liability',
      meaning:
        'The legal cap on what a carrier must pay for lost or damaged goods, unless a higher value was declared and accepted.',
    },
    {
      term: 'Special drawing right (SDR)',
      meaning:
        'A unit of account defined by the International Monetary Fund, used in transport conventions to set liability limits.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What does cargo insurance cover?',
      paragraphs: [
        'It pays for physical loss of or damage to the goods while they travel, within the terms of the policy. When cover starts and ends, which stages of the journey it includes and which risks it covers are all set by the policy wording, not by the sale contract, so read the wording before you rely on it.',
        'Cargo insurance is separate from the carrier’s liability. The carrier pays only when it is legally responsible and only up to a legal limit; an insurer pays for the risks the policy covers, whoever caused the loss. That difference is why a carrier’s receipt is not insurance.',
      ],
    },
    {
      heading: 'Why is the carrier’s liability not enough?',
      paragraphs: [
        'Because it is capped, often well below what the goods are worth. Under the Hague-Visby Rules, which the UK enacts in the Schedule to the Carriage of Goods by Sea Act 1971, a sea carrier’s liability is limited to 666.67 units of account per package or unit, or 2 units of account per kilogramme of gross weight, whichever is higher, unless the shipper declared the nature and value of the goods before shipment and that declaration is in the bill of lading.',
        'The unit of account is the IMF’s special drawing right, so the limit in your currency moves with exchange rates. Claims also run against the clock: the carrier is discharged unless suit is brought within one year of delivery, or of the date the goods should have been delivered. Air, road and rail carriage are governed by other conventions, each with its own limit, and many countries apply their own law to sea carriage, so check which regime applies to your contract of carriage.',
      ],
      table: {
        caption:
          'Worked example with an invented shipment under the Hague-Visby limits; SDR not converted to currency',
        head: ['Shipment', 'Per package limit', 'Per kilogramme limit', 'Carrier’s maximum'],
        rows: [
          [
            '1 pallet, 500 kg gross, invented value 20,000 in contract currency',
            '666.67 SDR (1 package)',
            '1,000 SDR (500 kg × 2)',
            '1,000 SDR, the higher of the two',
          ],
          [
            '10 cartons of 8 kg, each listed as a package',
            '6,666.70 SDR (10 × 666.67)',
            '160 SDR (80 kg × 2)',
            '6,666.70 SDR, the higher of the two',
          ],
        ],
      },
    },
    {
      heading: 'Who arranges cargo insurance under each Incoterms rule?',
      paragraphs: [
        'Only CIF and CIP oblige anyone to insure. Under those two rules the seller buys the cover for the buyer’s benefit, even though the risk passes to the buyer when the goods are handed to the carrier or loaded on board. Under every other rule, neither party has to insure, and the party who bears the risk at each stage decides whether to.',
        'Risk follows the delivery point set by the rule, as the ICC’s Incoterms® 2020 rules describe it. Read the table as a guide to who carries the loss if nobody insures.',
      ],
      table: {
        caption: 'Who bears transit risk, and who must insure, under the Incoterms 2020 rules',
        head: ['Rules', 'Risk passes to the buyer', 'Insurance obligation'],
        rows: [
          ['EXW, FCA, FAS, FOB', 'At or near the seller’s end, at the named delivery point', 'None; the buyer usually insures the main carriage'],
          ['CPT, CFR', 'When the goods are handed to the first carrier, or loaded on board', 'None; the buyer bears the transit risk though the seller pays freight'],
          ['CIP, CIF', 'As for CPT and CFR', 'Seller insures for the buyer: (A) cover under CIP, (C) under CIF'],
          ['DAP, DPU, DDP', 'At the named destination', 'None; the seller bears the transit risk'],
        ],
      },
    },
    {
      heading: 'What is the difference between Institute Cargo Clauses (A) and (C)?',
      paragraphs: [
        'The breadth of cover. The Institute Cargo Clauses are standard cargo policy wordings, and (A) gives a higher level of cover than (C). The ICC’s Incoterms® 2020 rules use them as the yardstick: (C) remains the default for CIF, and CIP requires cover complying with (A) or similar clauses.',
        'The parties can agree something else. A buyer on CIF terms can ask for (A) cover in the contract, and a seller on CIP terms can agree a lower level if the buyer accepts it. Write the agreed level into the proforma and the contract, and ask the insurer for the full clause wording, because the exclusions and conditions can matter as much as the headline cover.',
      ],
    },
    {
      heading: 'How much cover should an exporter buy?',
      paragraphs: [
        'Enough to replace the goods and the costs already spent getting them moving, in the currency of the sale. Under CIF and CIP the ICC’s rules text sets out the seller’s insurance obligation in detail; read the rule in the ICC publication and match the policy to it.',
        'For other rules there is no minimum. An exporter on DAP terms bears the risk all the way to the destination, so an uninsured loss is entirely the exporter’s. An exporter on FOB or FCA terms may still want cover for the stretch before delivery, or a policy that protects its interest if the buyer’s insurer does not pay. Your insurer or broker sets the premium and the terms; there is no official rate.',
      ],
    },
    {
      heading: 'How do you arrange cargo insurance for a shipment?',
      paragraphs: [
        'Through an insurance broker, an insurer directly, or the forwarder’s cover, either per shipment or under an annual open policy. Whichever route you take, the details the insurer needs come from your trade documents.',
      ],
      steps: [
        'Check the Incoterms® rule in the contract to see whether you must insure, and at what level.',
        'Decide the insured value and currency from the commercial invoice, adding freight and other costs you want covered.',
        'Give the insurer the goods description, packing, route, mode, dates and the parties, as they appear on the invoice and packing list.',
        'Obtain the policy or certificate before the goods leave, and send it to the buyer if the rule or a letter of credit requires it.',
        'Keep the packing list, photographs of the packed goods and the transport document, which a claim will need.',
        'On arrival, note any damage on the delivery receipt and notify the carrier and the insurer straight away.',
      ],
    },
    {
      heading: 'Does insurance change the customs value of the goods?',
      paragraphs: [
        'It can. The WTO Customs Valuation Agreement lets each member decide whether to include freight and insurance to the place of import in the customs value. The UK, as HMRC explains, includes transport and insurance costs up to the place where the goods enter the UK. In the US, 19 CFR 152.102 excludes international transport and insurance from the price actually paid or payable.',
        'Show the insurance cost on the commercial invoice as its own line when the seller pays it, so the importer’s customs authority can add or leave it out according to its own rules.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is cargo insurance mandatory for exports?',
      a: 'Not by customs law in general. It becomes a contract obligation under the CIF and CIP rules, and a letter of credit or a buyer may require it.',
    },
    {
      q: 'Who pays for insurance under CIF?',
      a: 'The seller buys it, at least at Institute Cargo Clauses (C) level by default, and the buyer benefits from it once the risk has passed.',
    },
    {
      q: 'Does FOB include insurance?',
      a: 'No. Under FOB the risk passes to the buyer when the goods are on board, and neither party is obliged to insure; the buyer usually arranges cover for the voyage.',
    },
    {
      q: 'What is an open cargo policy?',
      a: 'An insurance policy that covers a company’s shipments over a period, usually a year, so each shipment is declared to the insurer instead of being insured one by one.',
    },
    {
      q: 'Can I claim from the carrier and the insurer?',
      a: 'You claim from the insurer under your policy; the insurer may then recover from the carrier within the carrier’s legal limits. Do not let the carrier’s time limit run out.',
    },
  ],
  sources: [
    'icc-incoterms-2020',
    'w1-ita-know-your-incoterms',
    'a1-uk-cogsa-1971',
    'wto-customs-valuation',
    'w3-hmrc-delivery-costs',
    'w3-cbp-19-cfr-152-102',
    'trade-gov-commercial-invoice',
  ],
  primaryTool: '/tools/incoterms',
  tools: ['/tools/incoterms', '/tools/landed-cost-calculator', '/tools/invoice-generator'],
  callout: {
    afterSection: 2,
    tool: '/tools/landed-cost-calculator',
    title: 'Add insurance to your landed cost',
    text: 'Enter the goods value, freight and the insurance premium your insurer quotes, with duty and tax at the rates you enter, and see the total and cost per unit.',
  },
  related: [
    '/blog/cif-vs-fob',
    '/guides/dap-vs-ddp',
    '/blog/fob-vs-ddp',
    '/guides/landed-cost',
    '/blog/incoterms-for-importing-from-china',
  ],
  cover: {
    id: 'ShNfoSk81co',
    src: 'https://images.unsplash.com/photo-1582750272918-db931c2de35f',
    width: 4272,
    height: 2848,
    alt: 'A tanker ploughing through rough Mediterranean waves, the transit risk cargo insurance covers',
    caption: 'A ship in rough seas in the Mediterranean',
    photographer: { name: 'Mauro Shared Pictures', profile: 'https://unsplash.com/@maurosharedpictures' },
    page: 'https://unsplash.com/photos/red-ship-on-sea-waves-during-daytime-ShNfoSk81co',
  },
};

export default article;
