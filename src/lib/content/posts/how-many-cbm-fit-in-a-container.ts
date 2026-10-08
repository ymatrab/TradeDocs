import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "how many cbm in a 40ft container" 320, KD 9;
 * "how many cbm in a 20ft container" 170; "20ft container cbm" 210.
 * Container figures: Maersk's dry equipment sheet (maersk-dry-containers), as already used by
 * CONTAINERS in src/lib/trade/calculations.ts. The layout counts in the worked example are our
 * own arithmetic on those inside dimensions, with an invented carton.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave B.
 */
const article: ContentArticle = {
  slug: 'how-many-cbm-fit-in-a-container',
  title: 'How many CBM fit in a 20ft and a 40ft container?',
  metaTitle: 'How many CBM in a 40ft and 20ft container',
  description:
    'The cubic metres inside a 20ft, 40ft and high-cube container, from a carrier’s own sheet, and why the cargo you can actually load is less.',
  lede: 'Freight quotes, supplier emails and forum answers give a container’s capacity as a single number of cubic metres. That number is the inside of an empty steel box. Your cartons are rectangles that have to fit its length, width, height and door, so the volume you load is always lower. Here are the figures and the way to work out your own.',
  answer:
    'On Maersk’s dry equipment sheet, a 20ft standard container holds about 33 m³, a 40ft standard about 67 m³, a 40ft high cube about 76 m³ and a 45ft high cube about 85 m³. That is internal volume. Cartons rarely fill it, so plan on loading noticeably less and check the payload too.',
  keyFacts: [
    'Maersk lists its 20ft dry container at about 33 m³ inside, with a maximum payload of 28,200 kg.',
    'Maersk lists its 40ft dry container at about 67 m³ and its 40ft high cube at about 76 m³.',
    'Maersk’s 40ft standard and high cube are both 12,032 mm long and 2,350 mm wide inside; the high cube is 2,697 mm high against 2,393 mm.',
    'NIST gives one cubic foot as 0.028 316 85 m³, so 67 m³ is about 2,366 cubic feet.',
    'Under SOLAS regulation VI/2, a packed export container needs a verified gross mass before it is loaded on the ship.',
  ],
  definitions: [
    {
      term: 'CBM',
      meaning:
        'Cubic metre (m³): length × width × height in metres, the unit sea freight is measured in.',
    },
    {
      term: 'Internal volume',
      meaning: 'The space inside an empty container, the figure carriers publish as its capacity.',
    },
    {
      term: 'Maximum payload',
      meaning:
        'The most cargo weight a container is rated to carry: its maximum gross weight less its tare.',
    },
    {
      term: 'High cube',
      meaning:
        'A container about one foot taller than the standard box, with the same length and width.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'How many cubic metres does each container hold?',
      paragraphs: [
        'A 40ft standard container holds about 67 m³ and a 20ft about 33 m³ of internal volume, according to Maersk’s published sheet for its steel dry containers. The high cube adds height only, which takes the 40ft from 67 to about 76 m³. These are one carrier’s figures for its own fleet; boxes from other carriers and lessors differ by a few centimetres, so use the figures of the line you book with when you are close to the limit.',
      ],
      table: {
        caption:
          'Dry container capacity on Maersk’s equipment sheet, with cubic feet converted at the NIST factor',
        head: ['Container', 'Inside (L × W × H, mm)', 'Volume', 'Cubic feet', 'Max payload'],
        rows: [
          ['20ft standard', '5,896 × 2,350 × 2,393', '33 m³', 'about 1,165 ft³', '28,200 kg'],
          ['40ft standard', '12,032 × 2,350 × 2,393', '67 m³', 'about 2,366 ft³', '28,800 kg'],
          ['40ft high cube', '12,032 × 2,350 × 2,697', '76 m³', 'about 2,684 ft³', '28,620 kg'],
          ['45ft high cube', '13,556 × 2,352 × 2,698', '85 m³', 'about 3,002 ft³', '27,600 kg'],
        ],
      },
    },
    {
      heading: 'Why can you not load the full 33 or 67 m³?',
      paragraphs: [
        'Because the published volume is the empty box, and your cargo comes in fixed shapes. A carton 60 cm long fits 20 times into the 12,032 mm length of a 40ft container, with 32 mm left over; across the 2,350 mm width, a 40 cm side fits five times with 350 mm left over. Those leftover strips along every wall and under the roof are volume you pay for and cannot use.',
        'Other limits take more. The door opening is lower than the inside height: Maersk lists 2,274 mm for the 40ft standard door against 2,393 mm inside, so a tall item that fits the box may not pass the door. Cartons that cannot bear weight cannot be stacked to the roof. Pallets add their own deck height and leave gaps between them. Bracing, dunnage and airbags take space to stop the load from shifting. The CTU Code, the IMO, ILO and UNECE code of practice for packing cargo transport units, sets out how cargo should be loaded and secured, and securing a load properly always takes some of the volume.',
      ],
    },
    {
      heading: 'When does weight fill a container before volume?',
      paragraphs: [
        'Whenever the goods are dense. A 40ft container gives you roughly twice the floor of a 20ft but, on Maersk’s sheet, only 600 kg more payload: 28,800 kg against 28,200 kg. Heavy goods such as tiles, metal parts or bagged minerals reach the payload long before they fill the space, which is why they often travel in 20ft boxes.',
        'A quick test: divide the payload by the volume. A 20ft container’s 28,200 kg over 33 m³ is about 855 kg per cubic metre; a 40ft’s 28,800 kg over 67 m³ is about 430 kg per cubic metre. If your cargo weighs more per cubic metre than that figure, the container will be full by weight first. Road and rail weight limits on the inland legs can lower the practical payload further, so ask your forwarder what applies on your route.',
      ],
    },
    {
      heading: 'How do you work out how many cartons fit?',
      paragraphs: [
        'Work it out twice, once by volume and once by layout, and use the smaller number. The volume figure is a ceiling; the layout count, made from the inside dimensions, is closer to what will go in.',
      ],
      steps: [
        'Measure one packed carton in centimetres, length × width × height, at its widest points, and weigh it.',
        'Work out its volume in cubic metres: multiply the three sides in metres.',
        'Divide the container’s volume by the carton volume, and its payload by the carton weight. The smaller result is the upper bound.',
        'Divide the inside length, width and height by the carton’s sides and round each result down. Multiply the three whole numbers to get a layout count.',
        'Try the other orientations the carton allows, such as turning it 90 degrees on the floor, and keep the highest count that respects “this side up”.',
        'Check the door: the height of the stack must pass the door opening.',
        'Leave room for securing, and confirm the plan with whoever stuffs the container.',
      ],
    },
    {
      heading: 'What does a worked example look like?',
      paragraphs: [
        'Take an invented carton of 60 × 40 × 40 cm weighing 18 kg. Its volume is 0.096 m³. By volume alone, a 40ft container’s 67 m³ would take 697 of them, and by weight its 28,800 kg would take 1,600, so volume is the limit. The layout tells a different story.',
        'Lengthwise, 60 cm into 12,032 mm gives 20 cartons; across, 40 cm into 2,350 mm gives five; upwards, 40 cm into 2,393 mm gives five. That is 20 × 5 × 5 = 500 cartons, or 48 m³, about 72% of the published volume. Turning the cartons 90 degrees gives 30 × 3 × 5 = 450, so the first layout wins. The same arithmetic on the high cube’s 2,697 mm height gives six layers and 600 cartons.',
      ],
      table: {
        caption:
          'Worked example with an invented 60 × 40 × 40 cm carton of 18 kg, using Maersk inside dimensions',
        head: ['Container', 'Fit by volume', 'Fit by layout', 'Volume loaded'],
        rows: [
          ['20ft standard', '343', '9 × 5 × 5 = 225', '21.6 m³ of 33'],
          ['40ft standard', '697', '20 × 5 × 5 = 500', '48.0 m³ of 67'],
          ['40ft high cube', '791', '20 × 5 × 6 = 600', '57.6 m³ of 76'],
        ],
      },
    },
    {
      heading: 'How much cargo is worth a full container rather than LCL?',
      paragraphs: [
        'There is no fixed cubic-metre threshold; it depends on the rates you are quoted. Maersk explains that LCL is charged on the cubic metres your cargo uses, while FCL is a price for the whole box, so compare the LCL quote for your volume with the FCL quote for a 20ft. Once your real load, worked out by layout rather than by the 33 m³ headline, comes close to what a 20ft takes, ask for both. Our LCL vs FCL guide covers the other differences, such as handling at the consolidation warehouse.',
      ],
    },
    {
      heading: 'Which documents need the volume and weight?',
      paragraphs: [
        'The packing list carries the dimensions, the weights per package and the total cubic metres, and the forwarder uses it to plan the container. The commercial invoice states the gross and net weights too, and both must agree. Separately, under the IMO’s SOLAS rules the shipper must provide a verified gross mass for the packed container, either by weighing it loaded or by weighing every package, pallet and securing material and adding the container’s tare. Get the weights right on the packing list and that figure is far easier to produce.',
      ],
    },
  ],
  faq: [
    {
      q: 'How many cubic feet are in a 40ft container?',
      a: 'About 2,366 cubic feet, converting Maersk’s 67 m³ at the NIST factor of 0.028 316 85 m³ per cubic foot. A 40ft high cube at 76 m³ is about 2,684 cubic feet.',
    },
    {
      q: 'Is a 40ft container exactly twice a 20ft?',
      a: 'In volume it is slightly more than twice: 67 m³ against 33 m³ on Maersk’s sheet. In payload it is barely more, so heavy cargo gains little from the bigger box.',
    },
    {
      q: 'How many CBM fit in a 45ft container?',
      a: 'Maersk lists its 45ft high cube at about 85 m³ inside, with a maximum payload of 27,600 kg. Not every route and trucking leg accepts 45ft boxes, so check with your carrier.',
    },
    {
      q: 'Does the CBM figure include the space above a pallet?',
      a: 'The published figure is the whole inside of the box. Whether you can use the space above a pallet depends on whether the pallets can be stacked and on the door height.',
    },
    {
      q: 'Is a container loading calculator exact?',
      a: 'No. A calculator that divides volume and payload gives an upper bound. Real stowage depends on carton orientation, stacking strength and securing, so treat any count as an estimate and confirm it before booking.',
    },
  ],
  sources: [
    'maersk-dry-containers',
    'nist-si-volume',
    'b2-imo-ctu-code',
    'w4-imo-solas-vgm',
    'maersk-fcl-lcl',
  ],
  primaryTool: '/tools/container-loading-calculator',
  tools: [
    '/tools/container-loading-calculator',
    '/tools/cbm-calculator',
    '/tools/cbm-to-cubic-feet',
    '/tools/pallet-calculator',
  ],
  callout: {
    afterSection: 3,
    tool: '/tools/container-loading-calculator',
    title: 'Get the upper bound for your cartons',
    text: 'Enter one carton’s dimensions and weight to see how many fit a 20ft, 40ft or high cube by volume and by payload, then lower the usable share to allow for gaps.',
  },
  related: [
    '/guides/shipping-container-sizes',
    '/blog/how-many-pallets-fit-in-a-container',
    '/guides/lcl-vs-fcl',
    '/blog/how-to-measure-a-box-for-shipping',
    '/blog/standard-box-sizes-for-shipping',
    '/guides/gross-weight-vs-net-weight',
  ],
  cover: {
    id: 'Myx04QnYtqE',
    src: 'https://images.unsplash.com/photo-1761839257874-e56dfa2260cb',
    width: 4240,
    height: 2832,
    alt: 'A worker stacking bales inside a shipping container, filling it layer by layer from the floor up',
    caption: 'Loading a shipping container by hand',
    photographer: { name: 'Land O’Lakes, Inc.', profile: 'https://unsplash.com/@landolakesinc' },
    page: 'https://unsplash.com/photos/man-loading-hay-bales-into-a-shipping-container-Myx04QnYtqE',
  },
};

export default article;
