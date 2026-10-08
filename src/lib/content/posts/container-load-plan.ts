import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "container load plan" 70, KD 7; "container
 * loading calculator" 260 (owned by the tool page).
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave B (v2 #41).
 */
const article: ContentArticle = {
  slug: 'container-load-plan',
  title: 'Container load plan: how to plan cartons and pallets into a box',
  metaTitle: 'Container load plan: how to make one',
  description:
    'What a container load plan is, the IMO CTU Code rules it has to respect (payload, weight spread, centre of gravity, void spaces) and how to build one from your packing list.',
  lede: 'A container load plan is the drawing or table that says what goes where in a container before anyone starts loading. It turns the packing list into positions on the floor, checks the weight and the balance, and gives the loading crew a sequence to follow. This post explains what a plan contains, the safety rules behind it and how to build one from your own shipping data.',
  answer:
    'A container load plan sets out where each carton, pallet or package goes inside a container, in what order it is loaded and what the total weight is. It is built from the packing list and checked against the container’s payload and the IMO CTU Code’s rules on weight spread, centre of gravity and securing.',
  keyFacts: [
    'The IMO/ILO/UNECE CTU Code says packers should plan the packing in advance as far as practical.',
    'Under the CTU Code, the permitted payload of a cargo transport unit must not be exceeded and heavy goods should not be stowed on top of light goods.',
    'The CTU Code’s rule of thumb for containers is that 60% of the cargo’s total mass sits within 50% of the container’s length.',
    'The CTU Code says the sum of void spaces in any horizontal direction should not exceed 15 cm where cargo is held by blocking.',
    'Under SOLAS regulation VI/2, a packed container needs a verified gross mass from the shipper before it is loaded on a ship, according to the IMO.',
  ],
  definitions: [
    {
      term: 'Container load plan',
      meaning:
        'A plan, often a drawing with a table, showing the position, order and weight of every package in a container.',
    },
    {
      term: 'CTU Code',
      meaning:
        'The IMO/ILO/UNECE Code of Practice for Packing of Cargo Transport Units, a non-mandatory guide to packing and securing containers.',
    },
    {
      term: 'Payload',
      meaning:
        'The maximum cargo weight a container may carry, shown on its plate; the gross weight less the tare.',
    },
    {
      term: 'Void space',
      meaning:
        'An empty gap between packages, or between cargo and the container wall, that lets cargo move.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is a container load plan?',
      paragraphs: [
        'It is the packer’s plan for a single container: which packages go in, where each one sits, in what order they are loaded and what they weigh in total. It usually has two parts, a floor plan drawn as seen from above and a table listing each block of cargo with its count, dimensions and weight.',
        'A load plan is a working document rather than a customs one. It is used by the warehouse that stuffs the container, by the forwarder who books it and by the team that unloads it at the other end. Its numbers come from the packing list, so the two should always agree.',
      ],
    },
    {
      heading: 'Why do you need a load plan before loading?',
      paragraphs: [
        'Because a container that is overweight, badly balanced or loose is a safety problem, and it is far easier to fix on paper. The IMO/ILO/UNECE Code of Practice for Packing of Cargo Transport Units, known as the CTU Code, says packers should ensure that the packing is planned in advance as far as practical, that the maximum permitted payload is not exceeded, and that the limits for concentrated loads and for the eccentricity of the centre of gravity are respected.',
        'The plan also tells you whether the cargo fits at all. Working out the floor positions before the truck arrives shows whether you need a 40-foot container instead of a 20-foot one, whether pallets can be stacked, and whether a second container is cheaper than forcing the cargo into one.',
      ],
    },
    {
      heading: 'What rules does a load plan have to respect?',
      paragraphs: [
        'The CTU Code sets out the main ones. It is a non-mandatory code of practice that does not replace national or international rules, so check the rules for each leg of the route as well.',
      ],
      list: [
        'Payload: do not exceed the container’s permitted payload or the maximum gross mass allowed for road and rail transport on the route.',
        'Weight spread: distribute heavy cargo over the floor and do not concentrate it on a small area; a heavy package with a small footprint needs its load spread onto the container’s floor beams.',
        'Centre of gravity: keep it near the middle of the length and width, and below half the height of the cargo space. As a rule of thumb, 60% of the cargo’s mass should sit within 50% of the container’s length.',
        'Stacking: do not stow heavy goods on top of light goods, and follow the handling marks on each package.',
        'Securing: fill void spaces where needed, and use blocking or lashing so cargo cannot slide or tip. Where cargo is held by blocking, the sum of void spaces in any horizontal direction should not exceed 15 cm.',
      ],
    },
    {
      heading: 'What information goes into a container load plan?',
      paragraphs: [
        'Everything the loading crew needs without opening a single carton. Most of it already sits on your packing list, which is why the two documents are made together.',
      ],
      steps: [
        'List each type of package from the packing list: carton or pallet, outer dimensions in centimetres, gross weight and count.',
        'Note anything that limits placement: maximum stacking height, “this side up”, fragile goods, goods that must stay apart and packages with an off-centre centre of gravity.',
        'Choose the container type and take its inside dimensions and payload from the carrier’s equipment specification or the plate on the container.',
        'Lay out the floor in rows from the front wall to the doors, putting the heaviest packages low and spread across the floor.',
        'Add up the weight in the front half and the rear half of the container and compare it with the 60% in 50% rule of thumb.',
        'Mark where dunnage, airbags or blocking fill the gaps, and give the loading sequence row by row.',
        'Record the container number, the seal number and the total gross mass, and keep the plan with the packing list.',
      ],
    },
    {
      heading: 'How do you check the weight balance?',
      paragraphs: [
        'Split the floor into halves along its length and add up the cargo weight in each. The CTU Code’s rule of thumb is that 60% of the cargo’s total mass should sit within 50% of the container’s length, which keeps the centre of gravity close to the middle for lifting. The worked example below uses invented cargo and figures to show the check.',
      ],
      table: {
        caption: 'Worked example with invented cargo and figures: weight balance of one container',
        head: ['Zone', 'Cargo (invented)', 'Weight', 'Share of cargo'],
        rows: [
          ['Front half', '8 pallets of machine parts, 2 pallets of fittings', '6,400 kg', '53%'],
          ['Rear half', '10 pallets of boxed tools', '5,600 kg', '47%'],
          ['Whole container', '20 pallets', '12,000 kg', '100%'],
          [
            'Check',
            'Largest half holds no more than 60% of the cargo',
            '53% in the front half',
            'Within the rule of thumb',
          ],
        ],
      },
    },
    {
      heading: 'How does the load plan relate to the packing list and the VGM?',
      paragraphs: [
        'The packing list says what is shipped; the load plan says where it goes; the verified gross mass says what the packed container weighs. The CTU Code makes the consignor responsible for describing the goods correctly, including the mass of the total payload, so the load plan’s totals should match the packing list exactly.',
        'For sea freight, the IMO explains that SOLAS regulation VI/2 makes the shipper responsible for the verified gross mass of a packed container, obtained either by weighing the packed container or by weighing all packages, pallets, dunnage and securing material and adding the container’s tare. The load plan’s weights help with the second method, but the VGM must still be obtained by one of the methods the regulation allows.',
      ],
    },
    {
      heading: 'Can a calculator make the load plan for you?',
      paragraphs: [
        'It can do the arithmetic, not the judgement. A floor-fit calculator works out how many cartons or pallets of a given size fit on the floor of a 20-foot, 40-foot or high cube container, which tells you quickly whether the cargo fits and how many containers you need. It cannot see that a pallet is fragile, that two products must be kept apart or that the doors have to open on a certain row first. Use the count as the starting point and draw the plan around your real cargo.',
      ],
    },
  ],
  faq: [
    {
      q: 'Who makes the container load plan?',
      a: 'Usually the packer: the exporter’s warehouse, or the forwarder or consolidator that stuffs the container. The CTU Code places packing duties on the packer and makes the consignor responsible for describing the goods and their mass.',
    },
    {
      q: 'Is a container load plan a customs document?',
      a: 'No. Customs relies on the commercial invoice, the packing list and the declaration. The load plan is an operational document for the people loading, carrying and unloading the container.',
    },
    {
      q: 'Where do I find a container’s payload?',
      a: 'On the plate on the container doors and in the carrier’s equipment specification. Payloads differ between carriers and between individual containers of the same size, so check the one you are given.',
    },
    {
      q: 'Do I need a load plan for an LCL shipment?',
      a: 'Not usually from you. In a shared container the consolidator plans the load across all shippers. Give it accurate dimensions, weights and handling marks for your packages.',
    },
    {
      q: 'What fills the gaps in a container?',
      a: 'Dunnage, airbags, empty pallets or timber blocking. The CTU Code warns against fillers that deform or shrink permanently, such as rags or weak foam.',
    },
  ],
  sources: ['b3-imo-ctu-code', 'w4-imo-solas-vgm', 'maersk-dry-containers'],
  primaryTool: '/tools/container-loading-calculator',
  tools: [
    '/tools/container-loading-calculator',
    '/tools/packing-list-generator',
    '/tools/cbm-calculator',
    '/tools/pallet-calculator',
  ],
  callout: {
    afterSection: 3,
    tool: '/tools/container-loading-calculator',
    title: 'Check the floor fit before you draw the plan',
    text: 'The container loading calculator counts how many pallets or cartons of your size fit on the floor of a 20-foot, 40-foot or high cube container, before stacking and weight limits.',
  },
  related: [
    '/blog/how-many-pallets-fit-in-a-container',
    '/guides/shipping-container-sizes',
    '/blog/packing-list-for-shipping',
    '/guides/lcl-vs-fcl',
    '/guides/pallet-sizes',
  ],
  cover: {
    id: 'mjhvx4CO6G8',
    src: 'https://images.unsplash.com/photo-1632517706646-ed11355d0392',
    width: 4208,
    height: 3063,
    alt: 'Shipping containers stacked at a terminal in Rotterdam during container loading',
    caption: 'Containers being loaded and stacked at a terminal in Rotterdam',
    photographer: { name: 'Bernd Dittrich', profile: 'https://unsplash.com/@hdbernd' },
    page: 'https://unsplash.com/photos/cargo-containers-are-stacked-on-top-of-each-other-mjhvx4CO6G8',
  },
};

export default article;
