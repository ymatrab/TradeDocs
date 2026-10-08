import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "air freight vs sea freight" 70; "sea vs air" 70.
 * Angle (v2 #35): chargeable weight vs CBM pricing; transit and cost trade-offs, no invented
 * rates. The 1 t/m³ sea LCL ratio has no primary source and is labelled a convention
 * (CONTENT.md). No transit times or prices: no carrier page could be cited on 2026-10-08.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave C (carried from v2 #35).
 */
const article: ContentArticle = {
  slug: 'air-freight-vs-sea-freight',
  title: 'Air freight vs sea freight: how each is priced and documented',
  metaTitle: 'Air freight vs sea freight: price and paperwork',
  description:
    'How air and sea freight are charged, chargeable weight against cubic metres, what each mode’s transport document and rules ask of you, and how to compare two quotes.',
  lede: 'Air is faster and sea is cheaper per kilogram: everyone knows that much. What decides a real shipment is how each mode turns your boxes into a bill, what paperwork each one needs, and what happens if the goods are lost. Those differences come straight from your packing list, so you can compare the two before you ask for a quote.',
  answer:
    'Air freight is charged on chargeable weight: the greater of actual weight and volumetric weight, which IATA’s general rule sets at 6,000 cm³ per kilogram. Sea freight is charged per container (FCL) or, for part loads (LCL), on cubic metres compared with weight. Air suits light, urgent or valuable goods; sea suits heavy, bulky or less urgent cargo.',
  keyFacts: [
    'IATA describes air cargo charges as based on volumetric or actual weight, whichever is higher, with the general rule of dividing cubic centimetres by 6,000.',
    'Maersk describes LCL as paying for the container space your cargo uses, measured in cubic metres.',
    'Under SOLAS regulation VI/2, the shipper must provide a verified gross mass for a packed container before it is loaded on a ship.',
    'IATA describes the air waybill as the contract of carriage between the shipper and the airline.',
    'The Hague-Visby Rules limit a sea carrier’s liability to 666.67 units of account per package or 2 per kilogram, whichever is higher, unless a value is declared.',
  ],
  definitions: [
    {
      term: 'Chargeable weight',
      meaning:
        'The weight an air carrier bills on: the greater of the actual gross weight and the volumetric weight.',
    },
    {
      term: 'Volumetric weight',
      meaning:
        'Volume converted into a notional weight with the carrier’s divisor, so light, bulky cargo pays for the space it takes.',
    },
    {
      term: 'W/M (weight or measure)',
      meaning:
        'A sea LCL basis that compares cubic metres with tonnes and charges on the greater figure.',
    },
    {
      term: 'Verified gross mass (VGM)',
      meaning:
        'The weighed gross mass of a packed container, which the shipper provides under SOLAS before loading.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is the difference between air freight and sea freight?',
      paragraphs: [
        'The mode of transport, and with it the way you pay, the documents you sign and the rules that apply if something goes wrong. Air freight moves goods on passenger aircraft holds or freighters, booked by weight. Sea freight moves them in containers or as break-bulk on ships, booked by the container or by the space and weight a part load takes up.',
        'The commercial terms change with the mode too. In the ICC’s Incoterms® 2020 rules, FAS, FOB, CFR and CIF are for sea and inland waterway transport only, while FCA, CPT, CIP, DAP, DPU and DDP work for any mode, including air. A buyer who asks for FOB on an air shipment usually means FCA at the airport or the seller’s premises.',
      ],
    },
    {
      heading: 'How is air freight charged?',
      paragraphs: [
        'On chargeable weight. IATA explains that air carriers charge on the volumetric or actual weight, whichever is higher, and that the general rule converts volume to weight by dividing cubic centimetres by 6,000. One cubic metre therefore counts as about 167 kg.',
        'IATA also notes that each carrier, or the industry, sets its own tariffs, that the rate a forwarder pays can differ, and that tariffs leave out services such as customs clearance, pick-up and delivery. Fuel, security, dangerous goods and handling charges are added on top. Express services can use a different divisor; DHL Express, for example, divides by 5,000. Check the one in your quote.',
      ],
    },
    {
      heading: 'How is sea freight charged?',
      paragraphs: [
        'By the container for a full load (FCL) and by space and weight for a part load (LCL). Maersk describes LCL as paying only for the container space your cargo uses, measured in cubic metres. In practice LCL is commonly quoted on weight or measure: the forwarder compares your cubic metres with your weight in tonnes and charges on the greater. Treating one tonne as one cubic metre is a common industry convention, not a published standard, so check your forwarder’s tariff.',
        'A full container costs the same however full you pack it, up to its payload limit. That is why a part load that nearly fills a container is often worth quoting as FCL as well. The LCL vs FCL guide covers the break-even in more detail.',
      ],
    },
    {
      heading: 'How do the two compare on the same shipment?',
      paragraphs: [
        'Run one packing list through both rules. The table uses invented figures: 10 cartons, 2.0 m³ in total, 300 kg gross. No rates are shown, because the rate per kilogram or per cubic metre is what the quote gives you.',
      ],
      table: {
        caption: 'Worked example with invented figures: one shipment, two pricing bases',
        head: ['Figure', 'Air freight', 'Sea freight, LCL'],
        rows: [
          ['Actual gross weight', '300 kg', '300 kg (0.3 t)'],
          ['Volume', '2.0 m³', '2.0 m³'],
          ['Volume as weight', '2,000,000 cm³ ÷ 6,000 = 333.3 kg', '2.0 m³ at 1 t/m³ = 2.0 t'],
          ['Billed on', '333.3 kg (volumetric is higher)', '2.0 revenue tonnes (volume is higher)'],
          ['What you multiply', 'Rate per kg × 333.3', 'Rate per W/M unit × 2.0, plus minimums'],
        ],
      },
    },
    {
      heading: 'Which documents does each mode use?',
      paragraphs: [
        'A different transport document, and for sea a weight declaration of its own. IATA describes the air waybill as the document that is the contract of carriage between the shipper and the airline. At sea the carrier issues a bill of lading or, where nobody needs to transfer title in transit, a sea waybill, which DCSA describes as non-negotiable and needing no original for release.',
        'For a packed container, SOLAS regulation VI/2 makes the shipper responsible for a verified gross mass before loading, obtained by weighing the packed container or by weighing every package and adding the container’s tare under a certified method. US imports by vessel also need an Importer Security Filing, which CBP applies to cargo arriving by vessel.',
        'The commercial invoice and the packing list are the same for both modes. The packing list’s weights and dimensions are what both chargeable weight and W/M are worked out from, so getting them right is the first step whichever mode you pick.',
      ],
    },
    {
      heading: 'What else should decide between air and sea?',
      paragraphs: [
        'Weigh the goods themselves, not only the price. These questions usually settle it:',
      ],
      list: [
        'Density: if volumetric weight is far above actual weight, air bills you for space, and sea may be much cheaper per unit.',
        'Urgency: the cost of stock arriving late, or of holding more stock to cover a longer journey.',
        'Value: high-value, low-weight goods carry air freight more easily as a share of their price.',
        'Liability: the Montreal Convention limits an air carrier’s liability per kilogram, and the Hague-Visby Rules limit a sea carrier’s to 666.67 units of account per package or 2 per kilogram, so consider cargo insurance either way.',
        'Restrictions: IATA lists dangerous goods among the extra charges in air cargo, and each mode has its own rules for them, so declare them when you ask for a quote.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is sea freight always cheaper than air freight?',
      a: 'Usually per kilogram, but not always per shipment. Small, light consignments can cost more by sea once minimum charges and handling at both ends are added. Compare full quotes, door to door, for the same Incoterms® rule.',
    },
    {
      q: 'What divisor does air freight use?',
      a: 'IATA’s general rule is 6,000 cubic centimetres per kilogram. Express couriers commonly use a smaller divisor, which makes volumetric weight higher, so read the one in your quote.',
    },
    {
      q: 'Can I use FOB for an air shipment?',
      a: 'The ICC’s Incoterms® 2020 rules reserve FOB for sea and inland waterway transport. For air, FCA with a named place, such as the airport or your premises, is the rule built for it.',
    },
    {
      q: 'Do I need a different packing list for air and sea?',
      a: 'No. The same packing list works for both, with the gross weight and the dimensions of every package. Those are the figures the carrier or forwarder bills on.',
    },
    {
      q: 'What is sea-air freight?',
      a: 'A combined service in which goods travel part of the way by ship and the rest by air, trading some speed for cost. Ask your forwarder which document covers each leg.',
    },
  ],
  sources: [
    'b1-iata-air-cargo-tariffs',
    'dhl-express-volumetric',
    'maersk-fcl-lcl',
    'icc-incoterms-2020',
    'iata-air-waybill',
    'dcsa-sea-waybill',
    'w4-imo-solas-vgm',
    'a1-cbp-isf',
    'a4-montreal-convention',
    'a1-uk-cogsa-1971',
  ],
  primaryTool: '/tools/chargeable-weight',
  tools: ['/tools/chargeable-weight', '/tools/cbm-calculator', '/tools/packing-list-generator'],
  callout: {
    afterSection: 3,
    tool: '/tools/chargeable-weight',
    title: 'Price your boxes both ways',
    text: 'Enter your carton sizes, count and weight in the chargeable weight calculator and switch between the air and sea LCL rules to see which figure each one bills on.',
  },
  related: [
    '/guides/chargeable-weight',
    '/guides/lcl-vs-fcl',
    '/blog/how-to-calculate-shipping-cost',
    '/guides/air-waybill',
    '/blog/cargo-insurance-for-exporters',
    '/blog/mawb-vs-hawb',
  ],
  cover: {
    id: 'S-dj2lY6Rws',
    src: 'https://images.unsplash.com/photo-1651863158187-383e5a65248b',
    width: 5172,
    height: 3448,
    alt: 'An aircraft on the apron being prepared for departure, with ground equipment beside it',
    caption: 'An aircraft being prepared on the apron',
    photographer: {
      name: 'Maheshkumar Painam',
      profile: 'https://unsplash.com/@maheshkumar_painam',
    },
    page: 'https://unsplash.com/photos/an-airplane-is-being-prepared-for-a-flight-S-dj2lY6Rws',
  },
};

export default article;
