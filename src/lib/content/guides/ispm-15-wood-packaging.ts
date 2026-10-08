import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "heat treated pallets" 1,900; "ispm 15" 1,000,
 * KD 47; "ispm 15 stamp" 390, KD 32; "ispm 15 pallets" 170; UK "ispm 15" 480.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave B.
 * Treatment figures and exclusions come from the UK plant health guidance (GOV.UK); scope from
 * the IPPC's ISPM 15 page. Treatment codes inside the mark are not described because no source
 * opened for this round states them.
 */
const article: ContentArticle = {
  slug: 'ispm-15-wood-packaging',
  title: 'Heat treated pallets: ISPM 15 wood packaging rules explained',
  metaTitle: 'Heat treated pallets: ISPM 15 rules explained',
  description:
    'What ISPM 15 requires of pallets, crates and dunnage: which wood it covers, how heat treatment works, what the mark shows, and what happens to packaging that fails.',
  lede: 'Ship goods on a wooden pallet or in a timber crate and the wood is checked as well as the goods. ISPM 15 is the international standard behind that check, and a heat treated pallet with a legible mark is the usual way to meet it.',
  answer:
    'Heat treated pallets are wooden pallets treated under the ISPM 15 standard, with the whole profile of the wood, core included, held at 56°C for at least 30 continuous minutes, then marked by an authorised producer. The mark, often called the ISPM 15 stamp, identifies the country, the producer and the treatment, and travels on the wood itself.',
  keyFacts: [
    'ISPM 15 is the IPPC standard for wood packaging material made from raw wood in international trade, and it includes dunnage.',
    'The IPPC’s ISPM 15 excludes wood packaging processed so that it is free from pests, such as plywood.',
    'UK guidance sets ISPM 15 heat treatment at 56°C for at least 30 continuous minutes throughout the wood, core included.',
    'Under UK guidance, a legible ISPM 15 mark replaces a phytosanitary or treatment certificate for the packaging.',
    'GOV.UK says ISPM 15 packaging that is repaired or remanufactured must be re-treated and re-marked.',
  ],
  definitions: [
    {
      term: 'ISPM 15',
      meaning:
        'International Standard for Phytosanitary Measures No. 15, the IPPC rule for regulating wood packaging in international trade.',
    },
    {
      term: 'Wood packaging material (WPM)',
      meaning:
        'Pallets, crates, cases, drums, pallet collars and dunnage made of solid wood and used to carry or protect goods.',
    },
    {
      term: 'Dunnage',
      meaning: 'Loose wood used to wedge, brace or support cargo and its packaging.',
    },
    {
      term: 'ISPM 15 mark',
      meaning:
        'The mark applied by an authorised producer to show the packaging was treated to the standard; often called the stamp.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is ISPM 15?',
      paragraphs: [
        'ISPM 15 is the international standard that reduces the risk of tree pests travelling in wooden packaging. The IPPC, the plant protection convention hosted by the FAO, describes it as covering the phytosanitary measures for wood packaging material made from raw wood moving in international trade.',
        'The standard applies to the packaging, not to your goods. A shipment of machine parts on a softwood pallet is checked under ISPM 15 because of the pallet. Countries apply the standard at their own border, so the importing country decides whether and how it checks.',
      ],
    },
    {
      heading: 'Which wood packaging does ISPM 15 cover?',
      paragraphs: [
        'It covers solid wood used to carry, support or protect goods, and dunnage is included. The IPPC excludes wood processed so that it is free from pests, giving plywood as the example. UK guidance lists the common items on each side of the line.',
      ],
      table: {
        caption: 'Wood packaging in and out of ISPM 15, as listed in UK plant health guidance',
        head: ['Covered by ISPM 15', 'Not covered'],
        rows: [
          [
            'Pallets, box pallets, pallet collars and load boards',
            'Plywood and other processed, non-solid wood',
          ],
          ['Packing cases, boxes and crates', 'Raw wood 6mm thick or less'],
          ['Drums and similar containers', 'Barrels for wines and spirits'],
          [
            'Dunnage used to protect or secure goods',
            'Gift boxes of processed wood; sawdust, shavings or cardboard used as packing',
          ],
        ],
      },
    },
    {
      heading: 'How are ISPM 15 pallets treated?',
      paragraphs: [
        'They are debarked and then heat treated or fumigated. Under UK guidance, heat treatment means the entire profile of the wood, including its core, reaches 56°C for at least 30 continuous minutes. Dielectric heating, such as microwaving, is also allowed for pieces under 20cm across their smallest dimension, at a minimum of 60°C for one continuous minute.',
        'Fumigation uses methyl bromide or sulphuryl fluoride, with the bark removed first because bark can reduce how well the treatment works. Small pieces of bark may remain on debarked wood if each is under 3cm wide, or wider but under 50cm² in surface area.',
      ],
    },
    {
      heading: 'What does the ISPM 15 stamp show?',
      paragraphs: [
        'It shows that the packaging has been treated, and who treated it. UK guidance says every mark carries the two-letter ISO country code assigned by the national plant protection organisation, and identifies the producer and the treatment used.',
        'The mark is the proof. Under the same guidance, packaging with a legible mark needs no phytosanitary or treatment certificate, and a certificate cannot be used instead of the mark. A smudged or painted-over mark is a common reason to question a pallet, so keep it visible when you wrap the load.',
      ],
    },
    {
      heading: 'Who can produce and mark ISPM 15 packaging?',
      paragraphs: [
        'Only authorised producers can apply the mark; the national plant protection organisation of each country runs the scheme. In the UK, GOV.UK says a producer must be a member of the UK Wood Packaging Material Marking Programme, with assessments of its facility every six months, and registered with the Forestry Commission as a professional operator.',
        'For you as a shipper, that means buying marked pallets and crates from a supplier in the scheme rather than building your own from untreated timber. Ask the supplier, your packer or your forwarder to confirm the packaging is ISPM 15 compliant before goods are loaded.',
      ],
    },
    {
      heading: 'What happens if wood packaging fails inspection?',
      paragraphs: [
        'The packaging can be rejected or destroyed, and the goods have to travel another way. GOV.UK lists the costs an importer may face: repackaging, treating and marking the wood, destroying it, or returning the packaging and possibly the goods.',
        'Because those costs land on someone, UK guidance suggests importers write the packaging requirement into the contract with the exporter. If you sell to buyers who do that, expect the clause in their purchase order.',
      ],
    },
    {
      heading: 'How do you ship goods on compliant pallets?',
      paragraphs: [
        'Treat the packaging as part of the shipment plan, settled before the goods are packed.',
      ],
      steps: [
        'Check whether the importing country applies ISPM 15 and any extra rules, through its plant protection organisation or embassy.',
        'Buy pallets, crates and dunnage marked by an authorised producer, or use non-wood or processed-wood packaging.',
        'Check every piece carries a legible mark, including any dunnage added at loading.',
        'Record the packaging type for each package on the packing list, so the description matches what arrives.',
        'Do not repair or rebuild a marked pallet yourself; repaired packaging needs re-treating and re-marking.',
        'Reuse only undamaged, uninfested packaging, and only to countries that accept ISPM 15.',
      ],
    },
  ],
  faq: [
    {
      q: 'Do plastic or metal pallets need ISPM 15?',
      a: 'No. ISPM 15 covers wood packaging made from raw wood. Plastic, metal and processed wood such as plywood fall outside it, though the importing country may have other packaging rules.',
    },
    {
      q: 'Do I need a phytosanitary certificate for heat treated pallets?',
      a: 'Not for the packaging, according to UK guidance: the legible ISPM 15 mark is the certification. Your goods may still need their own certificate if they are plants or plant products.',
    },
    {
      q: 'Can I reuse an ISPM 15 pallet I received?',
      a: 'GOV.UK says undamaged and uninfested packaging can be reused for countries that accept ISPM 15. Once it is repaired or remanufactured, it must be re-treated and re-marked.',
    },
    {
      q: 'Does dunnage need an ISPM 15 mark?',
      a: 'Yes, in most cases. ISPM 15 includes dunnage, and UK guidance requires debarked dunnage to be heat treated or fumigated, with narrow exceptions for dunnage matching a timber consignment.',
    },
    {
      q: 'Does ISPM 15 apply between Great Britain and the EU?',
      a: 'Yes. UK guidance says solid wood packaging moving between Great Britain and other countries, EU member states and Switzerland included, must meet ISPM 15. Northern Ireland has separate rules.',
    },
  ],
  sources: ['b6-ippc-ispm-15', 'b6-gov-uk-wpm', 'b6-gov-uk-wood-packaging-goods'],
  primaryTool: '/tools/packing-list-generator',
  callout: {
    afterSection: 3,
    tool: '/tools/packing-list-generator',
    title: 'Show the packaging on the packing list',
    text: 'The packing list generator records the package type, count, dimensions and gross weight for each line, so the pallets and crates you declare match what the inspector sees.',
  },
  tools: ['/tools/packing-list-generator', '/tools/cbm-calculator', '/tools/invoice-generator'],
  related: [
    '/guides/pallet-sizes',
    '/blog/how-much-does-a-pallet-weigh',
    '/blog/packing-list-for-shipping',
    '/blog/how-many-pallets-fit-in-a-container',
    '/guides/how-to-export-from-the-uk',
  ],
  cover: {
    id: '5r_euejwyA0',
    src: 'https://images.unsplash.com/photo-1738965742812-bc1f957c01e9',
    width: 8246,
    height: 6185,
    alt: 'Stack of wooden pallets, the kind of wood packaging ISPM 15 treatment and marking applies to',
    caption: 'Wooden pallets stacked side by side',
    photographer: { name: 'Haberdoedas', profile: 'https://unsplash.com/@haberdoedas' },
    page: 'https://unsplash.com/photos/a-stack-of-wooden-pallets-sitting-next-to-each-other-5r_euejwyA0',
  },
};

export default article;
