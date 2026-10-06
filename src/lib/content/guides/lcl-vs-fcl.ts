import { BYLINE, type ContentArticle } from '@/lib/content/article';

const CONTENT_ROUND = '2026-10-05';
const GEO_ROUND = '2026-10-06';

/**
 * Demand (DataForSEO, Google US, 2026-10-05): "less than container load" 22,200.
 */
const article: ContentArticle = {
  slug: 'lcl-vs-fcl',
  title: 'LCL vs FCL: share a container or book your own?',
  metaTitle: 'LCL vs FCL shipping: shared or full container',
  description:
    'What less than container load (LCL) and full container load (FCL) mean, how each is charged, where the break-even sits and what changes on your packing list.',
  lede: 'Two ways to ship by sea in a container. One sells you space by the cubic metre, the other sells you the box. Which one is cheaper depends on your volume, and which one is safer depends on your cargo.',
  answer:
    'LCL (less than container load) means your cargo shares a container with other shippers’ goods and you pay for the space you use, measured in cubic metres. FCL (full container load) means you book the whole container for your cargo alone, even if it is not full, and pay a price per container.',
  keyFacts: [
    'LCL (less than container load) is charged on the space your cargo uses, usually per cubic metre or on weight or measure.',
    'FCL (full container load) is charged per container, whether or not the container is full.',
    'There is no fixed break-even volume; compare an LCL and an FCL quotation for the same cargo.',
    'LCL cargo is consolidated and deconsolidated at container freight stations, so it is handled more often.',
    'For container cargo, FCA in the Incoterms® 2020 rules usually describes the handover better than FOB.',
  ],
  definitions: [
    {
      term: 'LCL (less than container load)',
      meaning: 'Sea freight in a container shared with other shippers’ consignments.',
    },
    {
      term: 'FCL (full container load)',
      meaning: 'Sea freight in a container booked for one shipper’s cargo alone.',
    },
    {
      term: 'CBM',
      meaning: 'Cubic metres, the volume LCL freight is measured and quoted in.',
    },
    {
      term: 'W/M (weight or measure)',
      meaning:
        'Charging on whichever is greater, the weight in tonnes or the volume in cubic metres.',
    },
  ],
  published: CONTENT_ROUND,
  updated: GEO_ROUND,
  reviewed: GEO_ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'How does LCL shipping work?',
      paragraphs: [
        'You hand your cartons or pallets to a forwarder or carrier, usually at a container freight station near the port. They consolidate your consignment with others going the same way, load the shared container, ship it, and at destination deconsolidate it: the container is unpacked and each shipper’s goods are released separately.',
        'Because you are buying part of a box, the price is built from the space your cargo takes up. Maersk, for example, describes LCL as paying only for the container space you use, measured in CBM. In practice LCL is commonly quoted on weight or measure (W/M): the forwarder compares your cubic metres with your weight in tonnes and charges on whichever is greater, so dense cargo pays on weight and light, bulky cargo pays on volume. One tonne to one cubic metre is a common industry convention rather than a published standard; check your forwarder’s tariff.',
        'On top of the ocean rate, an LCL quotation usually carries handling charges at both ends for the consolidation and the unpacking. Read the quotation for those lines; they are part of the cost even though they are not freight.',
      ],
    },
    {
      heading: 'How does FCL shipping work?',
      paragraphs: [
        'You book an entire container. It is delivered to your premises or you deliver to it, it is loaded with your cargo only, sealed, and travels as one unit until it is opened at destination. Maersk describes FCL as a container fully booked and loaded by one shipper, even if it is not 100% full.',
        'The price is per container, not per cubic metre, so the cost of each extra carton inside the box is close to nothing until the container is full or reaches its maximum payload. That is why the unit cost falls sharply as you fill it.',
      ],
      table: {
        caption: 'Typical internal volume of standard dry containers',
        head: ['Container', 'Typical internal volume', 'What it means for planning'],
        rows: [
          ['20ft standard', 'about 33 m³', 'Usable volume is lower once cartons are stowed'],
          ['40ft standard', 'about 67 m³', 'Roughly double a 20ft for a lower price per m³'],
          ['40ft high cube', 'about 76 m³', 'Extra height suits light, stackable cartons'],
        ],
      },
    },
    {
      heading: 'When is FCL cheaper than LCL?',
      paragraphs: [
        'There is no fixed number of cubic metres at which FCL becomes cheaper. It depends on the lane, the season, the forwarder and the handling charges on the LCL side. What is fixed is the shape of the comparison: an LCL quotation rises with every cubic metre, an FCL quotation is flat until the box is full.',
        'The reliable method is to get both quotations for the same cargo. If the two are close, the factors below usually decide it.',
      ],
      steps: [
        'Work out the total CBM and gross weight from the carton dimensions and count you will actually ship.',
        'Find the smallest container the cargo fits in, leaving room for how cartons really stow.',
        'Ask for an LCL quotation on that volume and weight, with the origin and destination handling lines shown.',
        'Ask for an FCL quotation for that container on the same lane and dates.',
        'Compare the totals, then weigh transit time, handling and the value of the goods.',
      ],
    },
    {
      heading: 'Is LCL slower or riskier than FCL?',
      paragraphs: [
        'An LCL consignment is handled more often. It is received and stowed at the origin station, unpacked at the destination station and released from there, and it may wait at origin until the consolidator has enough cargo for the container to sail. Maersk notes that FCL suits high-volume, high-value or time-sensitive shipments that need fewer handovers and lower risk.',
        'Shared containers have a second consequence: the container is cleared and released as a unit before it is unpacked. A question about someone else’s consignment in the same box can slow the release of yours. With FCL, your container’s timing depends on your own paperwork.',
      ],
      list: [
        'Choose LCL for small or irregular volumes, samples and trial orders, and when paying for an empty half-container would cost more than the extra handling.',
        'Choose FCL when the volume is close to a container, when the goods are fragile or high-value, when the delivery date matters, or when you want the container sealed from your door to the buyer’s.',
      ],
    },
    {
      heading: 'What changes on the packing list and invoice?',
      paragraphs: [
        'In LCL your packages travel alongside other people’s, so the packing list and the marks on each carton are what keeps your consignment together. Every package should be identifiable and its weight and dimensions stated, and the totals on the packing list should agree with the commercial invoice and with what the forwarder measures at the station. Differences found at the station are re-measured and re-billed.',
        'In FCL the container number and seal number become part of the shipment record, and the packing list is still what customs and the receiver check the contents against.',
        'The Incoterms® rule needs a precise place in both cases. For containers, FCA at the seller’s premises or at the container freight station describes what actually happens better than FOB, because the seller hands over the goods before they reach the ship.',
      ],
    },
  ],
  faq: [
    {
      q: 'What does LCL stand for in shipping?',
      a: 'Less than container load: sea freight where your cargo shares a container with other shippers’ goods and you pay for the space it takes up, usually per cubic metre or on weight or measure.',
    },
    {
      q: 'How is LCL freight calculated?',
      a: 'From your cubic metres, compared with your weight. LCL is commonly charged on weight or measure (W/M), treating one cubic metre as one tonne and billing on the greater, plus handling charges at origin and destination. That ratio is a common industry convention; check your forwarder’s tariff.',
    },
    {
      q: 'Is FCL always cheaper per cubic metre?',
      a: 'Only once the container is reasonably full. An FCL price is per container, so a half-empty box can cost more than the same volume shipped LCL. Compare two quotations for your actual volume.',
    },
    {
      q: 'Which Incoterm suits LCL shipments?',
      a: 'Usually FCA, naming the forwarder’s container freight station or the seller’s premises, because that is where the seller actually hands the goods over. FOB assumes the seller controls the goods until they are on board, which is not the case for cargo surrendered at a station.',
    },
  ],
  sources: ['maersk-fcl-lcl', 'maersk-dry-containers', 'icc-incoterms-2020'],
  primaryTool: '/tools/cbm-calculator',
  callout: {
    afterSection: 1,
    tool: '/tools/cbm-calculator',
    title: 'Work out your cubic metres first',
    text: 'Both quotations start from your CBM. Enter the carton dimensions and count, and the CBM calculator gives the total and checks it against 20ft, 40ft and high-cube containers.',
  },
  tools: ['/tools/cbm-calculator', '/tools/chargeable-weight', '/tools/packing-list-generator'],
  cover: {
    id: '2JNNpq4nGls',
    src: 'https://images.unsplash.com/photo-1670121180583-39ab653a071c',
    width: 6000,
    height: 4000,
    alt: 'Container ship loaded with full container loads at a port terminal in Vietnam',
    caption: 'Container ship at Hai Phong International Container Terminal, Vietnam',
    photographer: { name: 'Nathan Cima', profile: 'https://unsplash.com/@nathan_cima' },
    page: 'https://unsplash.com/photos/a-large-ship-in-the-water-2JNNpq4nGls',
  },
};

export default article;
