import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "export packing" 90 (UK 140).
 * Angle (v2 #42): packing for sea, air and road; what the packing list records. The ITA's
 * former export packing page returned 404 on 2026-10-08; its "Shipping Options" page is cited
 * instead (c5-trade-gov-shipping-options).
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave C (carried from v2 #42).
 */
const article: ContentArticle = {
  slug: 'export-packing',
  title: 'Export packing: how to pack goods for an international shipment',
  metaTitle: 'Export packing: packing goods for sea and air',
  description:
    'How export packing differs from domestic packing, what sea, air and road each ask of it, the wood packaging and marking rules, and what the packing list records.',
  lede: 'A domestic parcel goes from your bench to one van and one doorstep. An export shipment may be handled at a warehouse, a port or airport, a ship or aircraft, a customs examination shed and the buyer’s dock, each with different equipment. Export packing is the packing that survives all of that, carries the marks every handler reads, and matches the packing list that describes it.',
  answer:
    'Export packing is packaging, marking and loading built for an international journey: stronger cartons, pallets or crates, protection against moisture, theft and rough handling, and marks every handler can read. Sea freight adds container loading rules and a verified gross mass; air rewards compact packing; wood packaging must meet ISPM 15.',
  keyFacts: [
    'The ITA says an export shipment should be packed so it arrives in good condition, labelled so it is handled properly, and insured against damage, loss, pilferage or delay.',
    'The IMO/ILO/UNECE CTU Code says the packing of a container should be planned in advance and the permitted payload never exceeded.',
    'Under SOLAS regulation VI/2, the shipper must provide a verified gross mass for a packed container before it is loaded.',
    'ISPM 15 covers wood packaging made from raw wood, including dunnage, and excludes processed wood such as plywood.',
    'Under 19 CFR 134.11, goods of foreign origin imported into the US, or their containers, must be marked with the English name of the country of origin.',
  ],
  definitions: [
    {
      term: 'Export packing',
      meaning:
        'Packaging chosen for an international journey with several handlings and modes, rather than for one domestic delivery.',
    },
    {
      term: 'Cargo transport unit (CTU)',
      meaning:
        'The CTU Code’s term for a container, swap body, vehicle or other unit that cargo is packed into for transport.',
    },
    {
      term: 'Dunnage',
      meaning:
        'Loose material such as timber, airbags or boards used to brace and protect cargo inside a container or vehicle.',
    },
    {
      term: 'Shipping marks',
      meaning:
        'The marks and numbers printed on each package so it can be identified and matched to the packing list.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is export packing?',
      paragraphs: [
        'It is the packaging and preparation that gets goods across a border intact and identifiable. The ITA’s guidance on shipping puts the aims simply: the shipment should be packed correctly so it arrives in good condition, labelled correctly so it is handled properly and reaches the right place, and insured against damage, loss, pilferage or delay.',
        'That usually means more than a domestic shipment needs: double-wall cartons or crates, goods fixed so they cannot move inside the package, protection against condensation on a long sea leg, and packages consolidated on pallets so they are handled by forklift rather than by hand. A freight forwarder, the ITA notes, may recommend packing methods for the goods and the route.',
      ],
    },
    {
      heading: 'How do sea, air and road packing differ?',
      paragraphs: [
        'Each mode stresses the packing differently, and each has its own rules on top. The table summarises what changes.',
      ],
      table: {
        caption: 'What each mode asks of export packing',
        head: ['Mode', 'What it asks of the packing', 'Rule or charge to know'],
        rows: [
          [
            'Sea, full container',
            'Packages braced inside the container so the load cannot shift; heavy goods low and not on light goods; moisture protection',
            'CTU Code packing guidance; verified gross mass under SOLAS before loading',
          ],
          [
            'Sea, part load (LCL)',
            'Pallets or crates strong enough to be stacked with other shippers’ cargo and moved several times',
            'Charged on cubic metres against weight, so bulky packing costs space',
          ],
          [
            'Air',
            'Compact, light, well-cushioned packages; no wasted volume',
            'Charged on chargeable weight, the greater of actual and volumetric weight (IATA: cm³ ÷ 6,000)',
          ],
          [
            'Road',
            'Palletised, stretch-wrapped loads that survive forklift handling and transfers between vehicles',
            'Carrier’s own tariff and loading conditions; check them when you book',
          ],
        ],
      },
    },
    {
      heading: 'How should you load a container?',
      paragraphs: [
        'By plan, not by eye. The IMO/ILO/UNECE Code of Practice for Packing of Cargo Transport Units (the CTU Code) is non-mandatory guidance, but it is the reference forwarders and carriers use. It asks for the packing to be planned in advance, the permitted payload never to be exceeded, and heavy goods never to be stowed on light ones.',
        'It also gives rules of thumb for weight distribution: the centre of gravity near the middle of the container’s length and width and below half its height, and, as a guide, no more than 60% of the cargo mass in half the container’s length. Void spaces should be filled, and the CTU Code says the sum of void spaces in any horizontal direction should not exceed 15 cm.',
        'When the container is packed, SOLAS regulation VI/2 makes the shipper responsible for its verified gross mass, obtained either by weighing the packed container or by weighing every package, pallet, item of dunnage and securing material under a certified method and adding the container’s tare.',
      ],
    },
    {
      heading: 'What rules apply to wooden pallets and crates?',
      paragraphs: [
        'ISPM 15, the international standard for wood packaging material. It covers wood packaging made from raw wood, including dunnage, and excludes processed wood such as plywood. Compliant wood is treated and carries the IPPC mark, which in the UK replaces any certificate.',
        'GOV.UK lists the approved treatments for the UK, including heat treatment to 56°C for 30 minutes, and requires the mark to show the two-letter country code. Ask your pallet or crate supplier for marked wood, and check the importing country’s rules before you reuse old pallets. The ISPM 15 guide covers the mark in detail.',
      ],
    },
    {
      heading: 'How should export packages be marked?',
      paragraphs: [
        'Clearly, on more than one side, and consistently with the documents. The ITA lists the markings export cartons commonly carry: the shipper’s mark, the country of origin, the weight in pounds and kilograms, the number of packages and case size, handling and cautionary marks, the port of entry and any hazardous materials labels. It notes that the buyer usually specifies the marks.',
        'Country of origin marking is a legal requirement in many importing countries. For the US, 19 CFR 134.11 requires every article of foreign origin, or its container, to be marked legibly, indelibly and permanently with the English name of the country of origin. The shipping marks post explains how to number packages so each one can be traced.',
      ],
    },
    {
      heading: 'What does the packing list record about the packing?',
      paragraphs: [
        'Everything a handler or officer needs to identify a package without opening it. The ITA describes the packing list as itemising the contents of each package with weights and measurements, used by forwarders to work out weights and freight costs and by customs to check a specific package. Follow these steps when the goods are packed:',
      ],
      steps: [
        'Number every package and mark it, using the same marks and numbers range you will put on the documents.',
        'Record the package type for each one: carton, crate, pallet, drum or bag.',
        'Measure the outside dimensions after packing, including the pallet, and weigh each package or each identical group.',
        'Record which goods and what quantity are inside each package.',
        'Total the packages, net weight, gross weight and volume, and check the totals against the commercial invoice.',
        'For a container, add the packing list’s gross weights to the container tare only as part of a certified weighing method, or weigh the packed container.',
      ],
    },
    {
      heading: 'How does TradeDocs record the packing?',
      paragraphs: [
        'The free packing list generator prints the parties, the lines, the package counts and the net and gross weights you enter, plus the marks and numbers, as a PDF. Nothing is stored, so download it before you close the page.',
        'In the TradeDocs workspace, the shipment’s packing panel records each package or group of identical packages with its kind, count, dimensions in centimetres, net and gross weight and marks, and lets you allocate each line’s quantity to the packages it travels in. It reports any line whose packed quantity differs from its invoiced quantity, and the packing list and commercial invoice are generated from that same shipment record.',
      ],
    },
  ],
  faq: [
    {
      q: 'Do I need wooden crates for export?',
      a: 'Not always. Many goods travel in strong cartons on pallets. Crates suit heavy, fragile or high-value items. Whatever wood you use, check that it meets ISPM 15 or use materials it excludes, such as plywood.',
    },
    {
      q: 'Can I reuse domestic cartons for an export shipment?',
      a: 'Only if they are strong enough for repeated handling, stacking and a long journey. Worn or single-wall cartons are more likely to collapse in a stack or a container, so most exporters use new double-wall cartons.',
    },
    {
      q: 'Who is responsible for the packing?',
      a: 'Usually the seller, who packs the goods before they leave, but the sale contract decides. Agree the packing standard with the buyer and say in the contract who pays for any special packing, crating or marking.',
    },
    {
      q: 'Should the gross weight on the packing list include the pallet?',
      a: 'Yes. Gross weight is the weight of the package as handed to the carrier, so a palletised load’s gross weight includes the pallet, wrapping and any dunnage packed with it.',
    },
    {
      q: 'Does packing affect customs?',
      a: 'It can. Customs may examine packages and match them to the packing list, so clear marks and an accurate list of contents per package make an examination quicker.',
    },
  ],
  sources: [
    'c5-trade-gov-shipping-options',
    'b3-imo-ctu-code',
    'w4-imo-solas-vgm',
    'w4-ippc-ispm-15',
    'b6-gov-uk-wpm',
    'w2-ita-labeling',
    'a1-cornell-19-cfr-134-11',
    'a2-trade-gov-packing-list',
    'b1-iata-air-cargo-tariffs',
    'maersk-fcl-lcl',
  ],
  primaryTool: '/tools/packing-list-generator',
  tools: ['/tools/packing-list-generator', '/tools/cbm-calculator', '/tools/pallet-calculator'],
  callout: {
    afterSection: 2,
    tool: '/tools/cbm-calculator',
    title: 'Measure the packed shipment',
    text: 'Enter each package’s outside dimensions and count in the CBM calculator to get the total volume and see how it fits a 20ft or 40ft container.',
  },
  related: [
    '/guides/ispm-15-wood-packaging',
    '/blog/shipping-marks',
    '/blog/packing-list-for-shipping',
    '/blog/container-load-plan',
    '/blog/how-to-ship-a-pallet-internationally',
    '/guides/pallet-sizes',
  ],
  cover: {
    id: 'mFUIel9hWos',
    src: 'https://images.unsplash.com/photo-1685119166946-d4050647b0e3',
    width: 3911,
    height: 2606,
    alt: 'A warehouse floor filled with stacked boxes and bagged goods waiting to be packed and shipped',
    caption: 'Boxes and bagged goods stacked in a warehouse',
    photographer: { name: 'Duc LE', profile: 'https://unsplash.com/@dm_le' },
    page: 'https://unsplash.com/photos/a-warehouse-filled-with-lots-of-boxes-and-bags-mFUIel9hWos',
  },
};

export default article;
