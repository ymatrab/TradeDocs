import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "shipping container weight" 720;
 * "pallet weight limit" 90.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave B.
 * Definitions from the CSC as amended by MSC.355(92); per-type figures from the Maersk sheet
 * already registered (maersk-dry-containers, the same figures as guides/shipping-container-sizes);
 * the road limit from 23 CFR 658.17; VGM from the IMO. Pounds converted at the NIST factor.
 * The loading example uses invented cargo.
 */
const article: ContentArticle = {
  slug: 'shipping-container-weight-limits',
  title: 'Shipping container weight limits: tare, payload and gross',
  metaTitle: 'Shipping container weight limits by size',
  description:
    'Tare, maximum payload and maximum gross weight for 20ft, 40ft and high cube containers, where the limit is printed, and why the road can set a lower one than the box.',
  lede: 'A container has three weights: what it weighs empty, what it can carry and what the two may add up to. The box sets the ceiling, the road and the ship add rules of their own, and the shipper’s declared weight has to be right before the container is loaded.',
  answer:
    'On Maersk’s steel equipment sheet, a 20ft dry container has a maximum gross weight of 30,480 kg and a maximum payload of 28,200 kg; a 40ft has 32,500 kg and 28,800 kg. The exact limit is printed on each container’s CSC Safety Approval Plate, and road rules can allow less.',
  keyFacts: [
    'Under the International Convention for Safe Containers, as amended by IMO Resolution MSC.355(92), maximum operating gross mass is the most the container and its cargo may weigh together.',
    'The same convention defines maximum permissible payload as the maximum operating gross mass minus the tare, the empty container’s mass.',
    'Every container’s CSC Safety Approval Plate shows its maximum operating gross mass in kilograms and pounds, and all other gross mass markings must agree with it.',
    'Maersk lists its 20ft steel dry container at 2,280 kg tare, 30,480 kg maximum gross and 28,200 kg maximum payload.',
    'Under 23 CFR 658.17, the US federal limit on Interstate highways is 80,000 lb gross vehicle weight, truck and chassis included.',
  ],
  definitions: [
    {
      term: 'Tare weight',
      meaning: 'The mass of the empty container, including any permanently fixed equipment.',
    },
    {
      term: 'Maximum payload',
      meaning:
        'The most cargo the container is rated to carry: its maximum gross mass minus its tare.',
    },
    {
      term: 'Maximum gross mass',
      meaning:
        'The container and its cargo together at their rated limit, also called the rating or R.',
    },
    {
      term: 'Verified gross mass (VGM)',
      meaning:
        'The weighed total of a packed container that the shipper must declare before it is loaded on a ship.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'How much weight can a shipping container hold?',
      paragraphs: [
        'As much as its maximum payload, which is its rated maximum gross mass minus its own tare. The figures differ by container type and by the individual box, so use a carrier’s sheet to plan and the container’s plate to confirm. Maersk’s steel dry equipment sheet gives the figures below; pounds are converted at the NIST factor of 0.453 592 4 kg to the pound.',
      ],
      table: {
        caption:
          'Dry container weights on Maersk’s equipment sheet, with pounds converted at the NIST factor',
        head: ['Container', 'Tare', 'Maximum gross', 'Maximum payload'],
        rows: [
          ['20ft standard', '2,280 kg', '30,480 kg (67,197 lb)', '28,200 kg (62,170 lb)'],
          ['40ft standard', '3,700 kg', '32,500 kg (71,650 lb)', '28,800 kg (63,493 lb)'],
          ['40ft high cube', '3,880 kg', '32,500 kg (71,650 lb)', '28,620 kg (63,096 lb)'],
          ['45ft high cube', '4,900 kg', '32,500 kg (71,650 lb)', '27,600 kg (60,848 lb)'],
        ],
      },
    },
    {
      heading: 'What do tare, payload and gross weight mean on a container?',
      paragraphs: [
        'They are defined in the International Convention for Safe Containers (CSC), as amended by the IMO’s Resolution MSC.355(92). Maximum operating gross mass, also called the rating or R, is the maximum allowable sum of the mass of the container and its cargo. Tare is the mass of the empty container, including permanently fixed equipment. Maximum permissible payload, P, is the difference between the two.',
        'So payload is not a separate rating. It is what is left of the gross limit once the box itself is counted, which is why two containers of the same size can carry slightly different payloads: their tare differs.',
      ],
    },
    {
      heading: 'Where is a container’s weight limit shown?',
      paragraphs: [
        'On its CSC Safety Approval Plate, which every container approved under the convention carries. The convention requires the plate to show the maximum operating gross mass in kilograms and pounds, and as amended by MSC.355(92) it requires every other maximum gross mass marking on the container to be consistent with the plate.',
        'Check the plate on the container you are actually given. Carriers’ sheets describe their typical equipment; the plate describes this box.',
      ],
    },
    {
      heading: 'Does a 40ft container carry twice the weight of a 20ft?',
      paragraphs: [
        'No. It carries about twice the volume but only slightly more weight. On Maersk’s sheet the 40ft standard has a maximum payload of 28,800 kg against 28,200 kg for the 20ft, just 600 kg more, while it holds about 67 m³ against 33 m³.',
        'For dense cargo such as tiles, metal parts or bagged minerals, a 20ft container can reach its weight limit before it is full, and a 40ft would add space you cannot use. For light, bulky cargo the opposite holds, and the high cube’s extra height helps more than the extra payload.',
      ],
    },
    {
      heading: 'Can the road limit be lower than the container limit?',
      paragraphs: [
        'Yes, and it can decide the practical payload. Under 23 CFR 658.17, the US federal limit on the Interstate system is 80,000 lb gross vehicle weight, with 20,000 lb on a single axle and 34,000 lb on tandem axles, and the bridge formula can lower it further. That 80,000 lb, about 36,287 kg, has to cover the tractor, the chassis, the container and the cargo together.',
        'Other countries set their own limits, and some routes or chassis allow less again. Ask your forwarder or haulier what payload is practical from your door to the port, and at the destination, before you plan a container to its rated maximum.',
      ],
    },
    {
      heading: 'How do you plan a load within the limit?',
      paragraphs: [
        'Start from your packing list and work out whether volume or weight runs out first. Here is the order to follow, with an invented example after it.',
      ],
      steps: [
        'Total the gross weight of every package, pallets and packing included, from the packing list.',
        'Total the cubic metres of the packages.',
        'Compare the weight with the container’s maximum payload and the practical road payload your haulier gives you, and use the lower.',
        'Compare the volume with the container’s capacity, leaving room for the way packages actually stack.',
        'Spread the weight evenly along the floor, heavy goods low, and secure the load.',
        'Weigh the packed container, or weigh every package and add the tare, to declare its verified gross mass.',
      ],
      table: {
        caption: 'Worked example with invented cargo: 20 pallets of floor tiles',
        head: ['Check', 'Figure'],
        rows: [
          ['20 pallets × 1,250 kg gross (invented)', '25,000 kg'],
          ['20ft maximum payload on Maersk’s sheet', '28,200 kg: within the box limit'],
          ['Practical road payload from your haulier (invented)', '22,000 kg: over by 3,000 kg'],
          ['Result', 'Load 17 pallets (21,250 kg), or plan a second container'],
        ],
      },
    },
    {
      heading: 'What is the verified gross mass rule?',
      paragraphs: [
        'It is the SOLAS requirement, in force since 1 July 2016, that the shipper provides the verified gross mass of every packed container before it is loaded on a ship. The IMO allows two methods: weigh the packed container, or weigh all the packages and cargo, including pallets, dunnage and securing material, by a method the State of packing has certified, and add the container’s tare.',
        'The IMO calls VGM a prerequisite for loading, and the master keeps the final say over whether to accept a container. A VGM above the container’s maximum gross mass is a container that should never have been packed, so check the plate before the weight is declared, not after.',
      ],
    },
  ],
  faq: [
    {
      q: 'What is the maximum weight for a 20ft container?',
      a: 'Maersk lists 30,480 kg maximum gross and 28,200 kg maximum payload for its 20ft steel dry container. The plate on each container gives its own figure.',
    },
    {
      q: 'What is the maximum weight for a 40ft high cube?',
      a: 'Maersk lists 32,500 kg maximum gross and 28,620 kg maximum payload for its 40ft high cube. Road limits can allow less.',
    },
    {
      q: 'How much does an empty shipping container weigh?',
      a: 'Its tare. Maersk lists 2,280 kg for its 20ft and 3,700 kg for its 40ft steel dry containers; the exact figure is marked on each box.',
    },
    {
      q: 'What is the weight limit of a pallet?',
      a: 'Its safe working load. EPAL gives 1,500 kg for the euro pallet and 1,250 kg for the EPAL 2. Other pallets carry the maker’s rating.',
    },
    {
      q: 'Does the container weight include the pallets?',
      a: 'Yes. Pallets, dunnage and securing material count towards the gross mass, and the IMO’s VGM rules include them.',
    },
  ],
  sources: [
    'b1-csc-msc-355-92',
    'maersk-dry-containers',
    'b1-cfr-23-658-17',
    'w4-imo-solas-vgm',
    'w4-epal-euro-pallet',
    'w4-epal-2-pallet',
    'nist-si-mass',
    'a2-trade-gov-packing-list',
  ],
  primaryTool: '/tools/container-loading-calculator',
  tools: [
    '/tools/container-loading-calculator',
    '/tools/pallet-calculator',
    '/tools/packing-list-generator',
    '/tools/unit-converter',
  ],
  callout: {
    afterSection: 3,
    tool: '/tools/container-loading-calculator',
    title: 'Check volume and weight before you book',
    text: 'Enter your cartons or pallets to see how many fit a 20ft, 40ft or high cube by volume and by weight, and how many containers you need.',
  },
  related: [
    '/guides/shipping-container-sizes',
    '/blog/how-many-pallets-fit-in-a-container',
    '/blog/how-much-does-a-pallet-weigh',
    '/guides/gross-weight-vs-net-weight',
    '/guides/lcl-vs-fcl',
    '/blog/skid-vs-pallet',
  ],
  cover: {
    id: 'U-ik8ez-z2M',
    src: 'https://images.unsplash.com/photo-1784913104909-889905d83694',
    width: 5792,
    height: 3861,
    alt: 'A red shipping container lifted by a large crane, its gross weight within the rated limit',
    caption: 'A red shipping container lifted by a crane',
    photographer: { name: 'Julia Taubitz', profile: 'https://unsplash.com/@justmejuliee' },
    page: 'https://unsplash.com/photos/a-red-shipping-container-lifted-by-a-large-crane-U-ik8ez-z2M',
  },
};

export default article;
