import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "how to get a freight quote" 10, KD 17; conversion
 * role. The head term "freight quote" (12,100) is service intent and is not targeted.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave D (v2 #54: what a forwarder needs to
 * quote: dimensions, weights, Incoterms® rule).
 */
const article: ContentArticle = {
  slug: 'freight-quote-checklist',
  title: 'How to get a freight quote: the checklist a forwarder needs',
  metaTitle: 'How to get a freight quote: a checklist',
  description:
    'The details a freight forwarder needs before it can quote: places, Incoterms rule, packages, dimensions, weights, goods and dates. A checklist, and how to compare the quotes you get back.',
  lede: 'A forwarder can only quote what you tell it. Send “one pallet to Germany” and you get a guess, followed by a different bill once the goods are measured at the warehouse. Send the right ten facts and you get a price you can put on a proforma invoice with some confidence.',
  answer:
    'To get an accurate freight quote, send the forwarder the pickup and delivery addresses, the Incoterms® rule and named place, the number and type of packages, each package’s dimensions and gross weight, a plain description of the goods, whether anything is hazardous, the ready date and the services you need, such as export clearance or insurance.',
  keyFacts: [
    'The International Trade Administration says freight forwarders can help exporters prepare price quotations by advising on freight costs, port charges, consular fees, special documentation and insurance.',
    'The International Trade Administration notes that forwarders use the packing list to determine weights and freight costs.',
    'Air freight is charged on chargeable weight, and IATA’s general volumetric rule is 6,000 cm³ per kilogram.',
    'Under SOLAS regulation VI/2, as described by the IMO, the shipper must provide the verified gross mass of a packed container before it is loaded.',
    'The Incoterms® rule in the sale contract decides which legs and charges the quote should cover.',
  ],
  definitions: [
    {
      term: 'Freight forwarder',
      meaning:
        'A company that arranges transport for your goods, books space with carriers and often handles the export paperwork.',
    },
    {
      term: 'Gross weight',
      meaning: 'The weight of the goods with all their packaging, per package and in total.',
    },
    {
      term: 'Chargeable weight',
      meaning:
        'The weight the carrier bills on: the actual weight or the volumetric weight, whichever is greater.',
    },
    {
      term: 'All-in quote',
      meaning:
        'A quote that lists every charge, from origin through freight to destination, rather than the base rate alone.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What does a forwarder need to give you a freight quote?',
      paragraphs: [
        'Ten facts cover most shipments. The forwarder uses them to choose the mode and route, size the space, work out the weight it will be billed on and decide which charges at each end belong in the price. The International Trade Administration describes forwarders as able to help with exactly this, advising on freight costs, port charges, documentation and insurance when you prepare a price quotation.',
      ],
      steps: [
        'Pickup address, with any restrictions such as no loading dock or limited hours.',
        'Delivery address, or the port or airport if the quote stops there.',
        'The Incoterms® rule and named place you have agreed or plan to quote.',
        'Number and type of packages: cartons, pallets, crates.',
        'Dimensions of each package in centimetres or inches, including the pallet.',
        'Gross weight of each package and in total.',
        'A plain description of the goods and their value, for insurance and customs.',
        'Whether any item is hazardous, temperature-sensitive or oversized.',
        'The date the goods will be ready, and any deadline at the other end.',
        'The services you need: export clearance, insurance, import clearance, delivery.',
      ],
    },
    {
      heading: 'Why do dimensions and weights matter so much?',
      paragraphs: [
        'Because they set the price. Air freight and express are billed on chargeable weight, the greater of the actual weight and the volumetric weight, and IATA’s general rule for air cargo is 6,000 cm³ per kilogram. A light, bulky carton can cost far more than its scale weight suggests. Sea freight quotes depend on the volume and weight you declare as well, so the same care applies.',
        'Measure every package as it will ship, after packing, with the pallet if there is one, and round up. Weigh it the same way. A quote built on estimates is replaced by the measured figures at the warehouse, and the invoice follows the measured figures.',
        'For a full container by sea, the shipper also has to declare the verified gross mass before loading. The IMO explains that under SOLAS regulation VI/2 this is the shipper’s responsibility and a condition for the container being loaded. Ask the forwarder how it wants the figure and by when.',
      ],
    },
    {
      heading: 'Why should the quote request name the Incoterms® rule?',
      paragraphs: [
        'The rule decides which parts of the journey you are paying for, so it decides what the forwarder should quote. Under FCA at your premises, the buyer usually pays the main carriage and you may need only export clearance. Under CIP or CFR you pay the freight to the destination. Under DAP you pay delivery to the buyer’s door, and under DDP import duties and taxes as well.',
        'If you have not agreed the rule yet, ask for a quote broken into legs: pickup and origin charges, the main freight, and destination charges and delivery. You can then build a price for whichever rule the buyer prefers. Write the version too, “Incoterms® 2020”, as the International Trade Administration recommends identifying the version on export documents.',
      ],
    },
    {
      heading: 'How should you describe the goods in a quote request?',
      paragraphs: [
        'In plain words, accurately, as they will appear on the commercial invoice. The forwarder needs to know what the goods are to check whether they are restricted or need special handling, to insure them and to prepare for customs. A vague description in the request tends to become a delay at booking.',
        'Say if the goods contain batteries, liquids, gases, magnets or anything else that could be classed as dangerous goods, and include the safety data sheet if you have one. Hazardous goods need their own paperwork and packing and are not accepted on every service.',
        'Do not guess a tariff code for the forwarder. If you already know the HS code for your product, include it; if not, say so, and use the official lookup for the export or import country.',
      ],
    },
    {
      heading: 'What documents speed up a freight quote?',
      paragraphs: [
        'A packing list is the fastest single thing you can send. The International Trade Administration says forwarders use the packing list to determine weights and freight costs, and it already holds the packages, their dimensions and their weights in one place. A proforma invoice adds the parties, the goods, their value and the Incoterms® rule.',
        'Sending both means the forwarder quotes from the same figures that will travel with the shipment. When the goods leave, the commercial invoice and the final packing list should match what you quoted on.',
      ],
    },
    {
      heading: 'How do you compare freight quotes from different forwarders?',
      paragraphs: [
        'Compare like with like. Asking more than one forwarder is worth the time, but two quotes are only comparable if they cover the same legs, the same services and the same validity period.',
      ],
      table: {
        caption: 'What to check on each quote before comparing',
        head: ['Check', 'Why it matters'],
        rows: [
          ['Legs covered: origin, main freight, destination', 'A quote to the port is not comparable with one to the door'],
          ['Surcharges included or listed separately', 'Fuel, currency and terminal charges can change the total'],
          ['Basis: chargeable weight, volume or per container', 'Check it matches your measured figures'],
          ['Services: export clearance, insurance, import clearance', 'Missing services become extra invoices'],
          ['Validity date and sailing or flight date', 'Rates and surcharges can change after the quote expires'],
          ['Forwarder’s own handling and documentation fees', 'These belong in your price to the buyer'],
        ],
      },
    },
    {
      heading: 'What should you do once you accept a quote?',
      paragraphs: [
        'Confirm the booking in writing with the same details you quoted on, and put the freight and other costs you carry into the price you send the buyer. The International Trade Administration notes that the forwarder’s own fees are a cost that belongs in the price charged to the customer.',
        'Keep the quote with the shipment file. If the final invoice differs, the quote, the packing list and the booking confirmation are what you compare it against.',
      ],
    },
  ],
  faq: [
    {
      q: 'How long does it take to get a freight quote?',
      a: 'It depends on the forwarder, the mode and how complete your request is. A request with all ten facts can usually be quoted without a round of questions, which is the delay you control.',
    },
    {
      q: 'Can I get a freight quote without exact dimensions?',
      a: 'You can get an estimate, but the carrier bills on the measured figures, so the final invoice may differ. Measure and weigh the packed goods before you rely on a quote for a price to the buyer.',
    },
    {
      q: 'Is a freight quote binding?',
      a: 'A quote usually holds only for its stated validity period and for the details you gave. Changes to weight, dimensions, dates or services, and published surcharge changes, can alter the final charge.',
    },
    {
      q: 'Should I ask for a door-to-door quote?',
      a: 'If your Incoterms® rule puts the whole journey on you, as DAP and DDP do, yes. Otherwise ask for the legs your rule covers, broken down so you can see each charge.',
    },
    {
      q: 'Do I need a packing list before I ask for a quote?',
      a: 'Not strictly, but it helps. A packing list gathers the packages, dimensions and weights the forwarder needs, and forwarders use it to work out weights and freight costs.',
    },
  ],
  sources: [
    'd3-trade-gov-shipping-options',
    'trade-gov-packing-list',
    'iata-volumetric',
    'w4-imo-solas-vgm',
    'c3-ita-know-your-incoterms',
    'icc-incoterms-2020',
  ],
  primaryTool: '/tools/packing-list-generator',
  tools: [
    '/tools/packing-list-generator',
    '/tools/chargeable-weight',
    '/tools/cbm-calculator',
    '/tools/proforma-invoice-generator',
  ],
  callout: {
    afterSection: 1,
    tool: '/tools/packing-list-generator',
    title: 'Send the forwarder a packing list',
    text: 'The packing list generator lists each package with its dimensions and net and gross weights, and downloads as a PDF you can attach to the quote request. No account, nothing stored.',
  },
  related: [
    '/blog/how-to-calculate-shipping-cost',
    '/guides/freight-forwarder-vs-customs-broker',
    '/blog/packing-list-for-shipping',
    '/blog/how-to-measure-a-box-for-shipping',
    '/guides/chargeable-weight',
    '/blog/ocean-freight-surcharges',
  ],
  cover: {
    id: 'wTtBtw80erg',
    src: 'https://images.unsplash.com/photo-1716698286313-9a2349d41110',
    width: 5748,
    height: 3832,
    alt: 'Hand holding a tape measure, the first step before asking a forwarder for a freight quote',
    caption: 'A tape measure in hand',
    photographer: { name: 'josh A. D.', profile: 'https://unsplash.com/@mista_j' },
    page: 'https://unsplash.com/photos/a-person-holding-a-tape-measure-in-their-hand-wTtBtw80erg',
  },
};

export default article;
