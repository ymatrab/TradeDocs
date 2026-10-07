import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "air waybill" 5,400, KD 10; "what is an air
 * waybill" 880, KD 6; UK "air waybill" 4,400.
 * Plan: docs/research/content-plan-v2-2026-10-06.md #17, carried into v3 wave A.
 * TradeDocs explains the air waybill; it does not issue one. MAWB vs HAWB has its own planned post.
 */
const article: ContentArticle = {
  slug: 'air-waybill',
  title: 'What is an air waybill? The air cargo contract explained',
  metaTitle: 'What is an air waybill (AWB)? A plain guide',
  description:
    'The air waybill is the contract of carriage for air cargo and a receipt, but not a document of title. What it shows, who makes it out, the e-AWB, and how weight is charged.',
  lede: 'Every air cargo shipment travels under an air waybill. It looks like the air version of a bill of lading, and it does two of the same jobs, but the third one, control of the goods, is missing, and that changes how you get paid.',
  answer:
    'An air waybill (AWB) is the document for cargo carried by air. IATA describes it as the contract of carriage between the shipper and the airline, and under the Montreal Convention it is evidence of that contract and of the carrier’s acceptance of the cargo. Unlike an order bill of lading, it is not negotiable.',
  keyFacts: [
    'IATA describes the air waybill as the contract of carriage between the shipper and the carrier (airline).',
    'Under Article 7 of the Montreal Convention, the consignor makes out the air waybill in three original parts.',
    'Under Article 11 of the Montreal Convention, the air waybill is prima facie evidence of the contract and of the acceptance of the cargo.',
    'The International Trade Administration states that air waybills are not negotiable, unlike order bills of lading used for vessel shipments.',
    'IATA’s Multilateral e-AWB Agreement (Resolution 672) removes the requirement for a paper air waybill between parties that join it.',
  ],
  definitions: [
    {
      term: 'Air waybill (AWB)',
      meaning:
        'The air cargo document that evidences the contract of carriage and the carrier’s receipt of the goods.',
    },
    {
      term: 'Consignor',
      meaning:
        'The party that hands the cargo to the carrier and makes out the air waybill; usually the shipper.',
    },
    {
      term: 'e-AWB',
      meaning:
        'An electronic air waybill that replaces the paper document under IATA Resolution 672.',
    },
    {
      term: 'Chargeable weight',
      meaning:
        'The greater of the actual weight and the volumetric weight, which air freight is billed on.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What does an air waybill do?',
      paragraphs: [
        'It does two jobs. IATA calls the air waybill the contract of carriage between the shipper and the airline, and Article 11 of the Montreal Convention makes it prima facie evidence of the conclusion of that contract, of the carrier’s acceptance of the cargo and of the conditions of carriage. The International Trade Administration adds that an air waybill accompanies goods shipped by an international air carrier.',
        'Article 4 of the Convention says an air waybill shall be delivered for cargo, but any other means that preserves a record of the carriage may replace it. That is the legal basis for the electronic air waybill.',
      ],
    },
    {
      heading: 'Is an air waybill a document of title?',
      paragraphs: [
        'No. The ITA says air waybills are shipper-specific and not negotiable, as opposed to the “order” bills of lading used for vessel shipments. The consignee named on the air waybill is the party the airline delivers to; holding a copy does not give anyone else the right to the goods.',
        'That matters for payment. With an order bill of lading, a seller can keep control of sea cargo until the buyer pays for the documents. With air cargo, the goods can reach the named consignee before you are paid, so the payment terms, or the choice of consignee, has to protect you instead.',
      ],
    },
    {
      heading: 'What information is on an air waybill?',
      paragraphs: [
        'The Montreal Convention sets a short legal minimum in Article 5: the places of departure and destination, an agreed stopping place in another state if both places are in a single state party, and the weight of the consignment. Beyond that minimum, expect to give your forwarder the facts your other documents already hold.',
      ],
      list: [
        'Shipper and consignee names and addresses, as on the commercial invoice.',
        'Number of pieces and their marks, as on the packing list.',
        'Actual gross weight and the dimensions of each piece.',
        'A description of the goods that matches the invoice.',
        'Any declared value for carriage, and handling instructions.',
      ],
    },
    {
      heading: 'Who issues the air waybill?',
      paragraphs: [
        'Legally, the consignor. Article 7 of the Montreal Convention says the consignor makes out the air waybill in three original parts. The first is marked for the carrier and signed by the consignor; the second is marked for the consignee and signed by both; the third is signed by the carrier and handed to the consignor once the cargo has been accepted. The signatures may be printed or stamped.',
        'Whoever keys the data, it comes from you. Under IATA’s e-AWB agreement it is forwarders and airlines that exchange the air waybill electronically, so the details you put in your booking become the air waybill. Send the same names, piece count, weights and description that are on your invoice and packing list.',
      ],
    },
    {
      heading: 'What is an e-AWB?',
      paragraphs: [
        'It is the air waybill without the paper. IATA’s Multilateral e-AWB Agreement, Resolution 672, removes the requirement for a paper air waybill: forwarders and airlines sign the agreement once with IATA and can then exchange electronic air waybills with every other party to it. For you as shipper, little changes, except that the data you give the forwarder becomes the air waybill directly, so errors travel faster.',
      ],
    },
    {
      heading: 'How does the weight on the air waybill affect the price?',
      paragraphs: [
        'Air freight is billed on chargeable weight, the greater of actual and volumetric weight. IATA’s general rule converts volume at 6,000 cubic centimetres per kilogram, so light, bulky cartons are charged as if they were heavier. Express carriers often use a different divisor, such as DHL Express dividing by 5,000, so check the carrier’s own rule.',
      ],
      table: {
        caption:
          'Worked example with invented cartons and figures, using the IATA 6,000 cm³ per kg rule',
        head: ['', 'Per carton', 'Three cartons'],
        rows: [
          ['Dimensions', '60 × 50 × 40 cm', '—'],
          ['Volume', '120,000 cm³', '360,000 cm³'],
          ['Volumetric weight (volume ÷ 6,000)', '20 kg', '60 kg'],
          ['Actual gross weight', '12 kg', '36 kg'],
          ['Chargeable weight (the greater)', '20 kg', '60 kg'],
        ],
      },
    },
    {
      heading: 'What happens if goods are lost or damaged in the air?',
      paragraphs: [
        'The carrier is liable within limits. Article 22 of the Montreal Convention caps the carrier’s liability for destruction, loss, damage or delay of cargo at a sum of Special Drawing Rights per kilogram, unless the consignor made a special declaration of interest in delivery when handing over the package and paid any supplementary sum. The weight on the air waybill is therefore the figure a claim is measured from, which is one more reason to get it right.',
      ],
    },
  ],
  faq: [
    {
      q: 'What is the difference between an air waybill and a bill of lading?',
      a: 'Both are evidence of the contract of carriage and a receipt for the goods. A bill of lading for sea cargo can be negotiable and act as a document of title; an air waybill is not negotiable.',
    },
    {
      q: 'How many originals of an air waybill are there?',
      a: 'Three, under Article 7 of the Montreal Convention: one marked for the carrier, one marked for the consignee, and one the carrier signs and hands to the consignor after accepting the cargo.',
    },
    {
      q: 'What weight should I give for the air waybill?',
      a: 'The actual gross weight of the consignment, which Article 5 requires the air waybill to show, plus each piece’s dimensions so the volumetric weight can be worked out. Take both from your packing list.',
    },
    {
      q: 'Does the air waybill replace the commercial invoice?',
      a: 'No. The air waybill covers carriage. Customs at destination still needs the commercial invoice, and usually the packing list, to clear the goods.',
    },
  ],
  sources: [
    'a4-iata-e-awb',
    'a4-montreal-convention',
    'trade-gov-export-documents',
    'iata-volumetric',
    'dhl-express-volumetric',
    'trade-gov-commercial-invoice',
  ],
  primaryTool: '/tools/chargeable-weight',
  callout: {
    afterSection: 3,
    tool: '/tools/chargeable-weight',
    title: 'Check the weight your air waybill will be charged on',
    text: 'Enter carton dimensions and actual weight, and the chargeable weight calculator shows volumetric against actual for air and express, and which one you will be billed on.',
  },
  tools: ['/tools/chargeable-weight', '/tools/packing-list-generator', '/tools/invoice-generator'],
  related: [
    '/guides/what-is-a-bill-of-lading',
    '/guides/shipper-consignee-notify-party',
    '/guides/gross-weight-vs-net-weight',
    '/blog/packing-list-for-shipping',
    '/blog/export-documents-checklist',
  ],
  cover: {
    id: 'kjBMLHxvHSk',
    src: 'https://images.unsplash.com/photo-1750783306461-9c40dd99e1ae',
    width: 4669,
    height: 4000,
    alt: 'Ground crew loading cargo into an aircraft on the airport apron before an air freight flight',
    caption: 'An aircraft being loaded on the tarmac',
    photographer: { name: 'Zero Vo', profile: 'https://unsplash.com/@z3ro' },
    page: 'https://unsplash.com/photos/an-airplane-is-being-loaded-on-the-tarmac-kjBMLHxvHSk',
  },
};

export default article;
