import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "mawb" 720; "hawb" 720; "mawb vs hawb" 50.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave B.
 * The two-level structure and its data come from CBP (AMS Air, 19 CFR 122.48a) and the EU's
 * ICS2 notice; the air waybill as contract of carriage from IATA and the Montreal Convention.
 * The consolidation example uses invented parties and numbers.
 */
const article: ContentArticle = {
  slug: 'mawb-vs-hawb',
  title: 'MAWB vs HAWB: master and house air waybills explained',
  metaTitle: 'MAWB vs HAWB: master and house air waybills',
  description:
    'The master air waybill covers a forwarder’s whole consolidation with the airline; each house air waybill covers one shipper’s goods. Which one you get, and what must match.',
  lede: 'Book air freight through a forwarder and you may receive an air waybill that is not the airline’s. That is normal: most consolidated air cargo travels on two layers of waybill, and the one with your name on it is the house air waybill.',
  answer:
    'A master air waybill (MAWB) is the airline’s air waybill for a whole consolidated consignment, with the forwarder or consolidator dealing with the airline. A house air waybill (HAWB) is the forwarder’s waybill for one shipper’s goods inside it. Customs in the US and EU take data from both levels, so both must match your invoice.',
  keyFacts: [
    'IATA describes the air waybill as the contract of carriage between the shipper and the airline, and its e-AWB agreement (Resolution 672) removes the need for a paper one.',
    'CBP’s AMS Air rules require the incoming air carrier to send the master air waybill for a consolidation, and the house air waybills unless another approved party sends them.',
    'Under 19 CFR 122.48a, house air waybill data for US-bound air cargo includes the master and house numbers, the cargo description, quantity, weight, shipper and consignee.',
    'Under 19 CFR 122.48a, CBP must receive the cargo data no later than four hours before arrival, or by departure from nearby foreign areas.',
    'The EU’s ICS2 rules require the consignor and consignee in the lowest house air waybill to be the real parties, not the carrier, forwarder, consolidator or customs agent.',
  ],
  definitions: [
    {
      term: 'Consolidation',
      meaning:
        'A forwarder’s combined consignment of several shippers’ goods, tendered to an airline as one shipment.',
    },
    {
      term: 'Master air waybill (MAWB)',
      meaning:
        'The airline’s air waybill for the consolidated consignment, with an airline prefix in its number.',
    },
    {
      term: 'House air waybill (HAWB)',
      meaning:
        'The forwarder’s own waybill for one shipper’s goods within a consolidation, naming the actual shipper and consignee.',
    },
    {
      term: 'Deconsolidator',
      meaning:
        'The party at destination that breaks the consolidation down into its house shipments for customs and delivery.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is the difference between a MAWB and a HAWB?',
      paragraphs: [
        'The level they work at. The master air waybill is the airline’s document for the whole consolidated consignment: the airline carries one shipment, and the forwarder or consolidator is the party it deals with. The house air waybill is the forwarder’s document for one shipper’s goods inside that consignment, and it names the actual shipper and consignee.',
        'CBP’s air manifest rules and the EU’s ICS2 rules are both built on these two levels. CBP asks the incoming air carrier for the master air waybill information for a consolidated shipment and for every associated house air waybill unless another party sends it; the EU asks for complete data at both master and lowest house level.',
      ],
      table: {
        caption: 'MAWB and HAWB compared',
        head: ['', 'Master air waybill (MAWB)', 'House air waybill (HAWB)'],
        rows: [
          ['Covers', 'The whole consolidated consignment', 'One shipper’s goods within it'],
          [
            'Contract of carriage between',
            'The consolidator and the airline',
            'The shipper and the forwarder',
          ],
          [
            'Shipper and consignee shown',
            'Usually the forwarder and its destination agent',
            'The actual shipper and the actual consignee',
          ],
          ['Number', 'Airline prefix and serial number', 'The forwarder’s own reference'],
          ['Goods description', 'The consolidation as a whole', 'Your goods, as on your invoice'],
        ],
      },
    },
    {
      heading: 'What is a master air waybill?',
      paragraphs: [
        'It is the air waybill the airline works from. IATA describes the air waybill as the contract of carriage between the shipper and the airline, and on a consolidation the shipper in that contract is the consolidator. Its number starts with the airline’s numeric prefix, and CBP notes that the air waybill number can serve as the in-bond control number for cargo moving on to another US port.',
        'The master carries the totals the airline needs to load and bill the flight: the pieces, the weight and the airports. Under 19 CFR 122.48a, the master-level data sent to CBP includes the air waybill number, the flight, the airports of origin and arrival, the quantity, weight and description, and the shipper and consignee.',
      ],
    },
    {
      heading: 'What is a house air waybill?',
      paragraphs: [
        'It is the waybill the forwarder issues to you for your goods. It names you, or your customer, as the shipper and the buyer as the consignee, and it carries your piece count, weight and description. It also carries the master number, so each house can be traced to the flight that carried it.',
        'Customs reads it closely. Under 19 CFR 122.48a, house-level data for US-bound air cargo includes the master and house numbers, the airport of origin, the cargo description, the quantity, the weight and the shipper and consignee names and addresses. The EU’s ICS2 rules say the consignor and consignee in the lowest house air waybill must be the real parties, different from the carrier, forwarder, consolidator or customs agent, and that descriptions such as “unknown” are not acceptable.',
      ],
    },
    {
      heading: 'How does a consolidation work?',
      paragraphs: [
        'The forwarder collects several shippers’ goods heading the same way, books them with an airline as one consignment and splits them again at destination. Here is the sequence, with invented parties.',
      ],
      steps: [
        'Three exporters book air freight with the same forwarder, and the forwarder issues each one a house air waybill.',
        'The forwarder tenders all three shipments to the airline as one consignment, and the airline’s master air waybill covers the total.',
        'Before arrival, the airline sends the master data to customs, and the house data is sent by the airline or by another approved party such as the deconsolidator or the importer’s broker.',
        'At destination, the forwarder’s agent receives the consignment under the master and breaks it down into the house shipments.',
        'Each importer, or its broker, clears its own house shipment and collects the goods.',
      ],
      table: {
        caption: 'Worked example with invented parties and numbers',
        head: ['Document', 'Shipper', 'Consignee', 'Pieces / weight'],
        rows: [
          ['MAWB 000-00000000 (invented)', 'Forwarder A', 'Agent B at destination', '18 / 410 kg'],
          ['HAWB A-101', 'Exporter 1', 'Buyer 1', '6 / 120 kg'],
          ['HAWB A-102', 'Exporter 2', 'Buyer 2', '10 / 250 kg'],
          ['HAWB A-103', 'Exporter 3', 'Buyer 3', '2 / 40 kg'],
        ],
      },
    },
    {
      heading: 'Which air waybill do you get as the shipper?',
      paragraphs: [
        'Usually the house air waybill, if you book through a forwarder that consolidates. If you book directly with an airline, or your forwarder ships your goods on their own, you get the airline’s air waybill with no house layer.',
        'Ask for both numbers. The house number is what you send your buyer and what the forwarder uses for your shipment; the master number lets you or your buyer track the flight with the airline and is the number a customs broker may ask for at destination.',
      ],
    },
    {
      heading: 'What must match between the HAWB and your documents?',
      paragraphs: [
        'Everything customs compares. The house air waybill is typed from your booking, and the entry is typed from your commercial invoice and packing list, so a mismatch between them is a question at the border.',
      ],
      list: [
        'Shipper and consignee names and addresses, the same as on the invoice.',
        'The number of pieces and the gross weight, the same as on the packing list.',
        'A plain description of the goods, not “consolidated cargo” or a part number alone.',
        'The airport of departure and destination, consistent with the Incoterms® place on the invoice.',
        'The dimensions, since the chargeable weight is worked out from them.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is a house air waybill a legal document?',
      a: 'Yes. It records the contract between you and the forwarder, and customs uses its data. Check the forwarder’s terms printed on it, which govern that contract.',
    },
    {
      q: 'Can I track a shipment with the HAWB number?',
      a: 'With the forwarder, yes. Airline tracking uses the master number, which starts with the airline’s numeric prefix, so ask the forwarder for it.',
    },
    {
      q: 'Is an air waybill a document of title?',
      a: 'No. Under the Montreal Convention it is evidence of the contract and of the cargo’s acceptance, not a paper that transfers the goods like a negotiable bill of lading. The guide to air waybills explains more.',
    },
    {
      q: 'Does every air shipment have a HAWB?',
      a: 'No. Only consolidated shipments do. A shipment booked directly with the airline travels on the airline’s air waybill alone.',
    },
    {
      q: 'Who sends the house data to US customs?',
      a: 'The incoming air carrier, unless another eligible party sends it, such as a deconsolidator or the importer’s customs broker, as CBP’s AMS Air rules allow.',
    },
  ],
  sources: [
    'a4-iata-e-awb',
    'a4-montreal-convention',
    'b1-cbp-ams-air-features',
    'b1-cfr-19-122-48a',
    'b1-eeas-ics2-air',
    'iata-volumetric',
  ],
  primaryTool: '/tools/chargeable-weight',
  tools: ['/tools/chargeable-weight', '/tools/packing-list-generator', '/tools/invoice-generator'],
  callout: {
    afterSection: 3,
    tool: '/tools/packing-list-generator',
    title: 'Give the forwarder figures that match',
    text: 'List every piece with its dimensions, net and gross weight, and download a packing list PDF the forwarder can copy onto the house air waybill.',
  },
  related: [
    '/guides/air-waybill',
    '/blog/how-to-calculate-shipping-cost',
    '/guides/what-is-a-bill-of-lading',
    '/guides/shipper-consignee-notify-party',
    '/blog/how-to-measure-a-box-for-shipping',
  ],
  cover: {
    id: 'XtqboezYdBQ',
    src: 'https://images.unsplash.com/photo-1698594691277-62dba3f51eda',
    width: 3871,
    height: 2903,
    alt: 'A large jet aircraft on an airport apron, the flight a master air waybill covers',
    caption: 'A jet aircraft on the airport tarmac',
    photographer: { name: 'Toni Pomar', profile: 'https://unsplash.com/@t3k' },
    page: 'https://unsplash.com/photos/a-large-jetliner-sitting-on-top-of-an-airport-tarmac-XtqboezYdBQ',
  },
};

export default article;
