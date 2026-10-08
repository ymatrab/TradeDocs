import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'break-bulk',
  term: 'Break bulk cargo',
  aliases: ['breakbulk', 'break-bulk', 'breakbulk cargo', 'general cargo'],
  demand: {
    keyword: 'break bulk',
    market: 'US',
    volume: 590,
    kd: 47,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'Break bulk cargo: meaning and how it ships',
  description:
    'What break bulk cargo is, how it differs from bulk and containerized cargo, what the packing list must show for each piece, and when break bulk makes sense for an exporter.',
  shortDefinition:
    'Break bulk cargo is freight that is not shipped in a container but is still packaged or bundled, such as crates, bales, steel coils, machinery on skids or bundles of pipe. Each piece is lifted and stowed individually rather than poured or pumped.',
  definition: [
    'Shipping divides cargo three ways. Containerized cargo travels sealed in a standard box. Bulk cargo is loose: U.S. Customs and Border Protection’s manifest rule in 19 CFR 4.7 defines it as homogeneous cargo stowed loose in the hold and not enclosed in any container such as a box, bale, bag or cask, like grain, coal or oil. Break bulk sits between the two, and the same rule defines it as cargo that is not containerized but is otherwise packaged or bundled.',
    'The category matters most for goods too big, heavy or awkward for a container: a transformer, a yacht hull, structural steel, project cargo for a plant. They go on deck or in the hold of a general cargo vessel and are secured piece by piece, often with timber dunnage, which falls under the ISPM 15 rules for wood packaging.',
    'It matters for filing too. Most ocean cargo bound for the United States needs its electronic cargo declaration 24 hours before loading abroad; bulk cargo, and break bulk carriers that obtain an exemption, file 24 hours before arrival instead.',
  ],
  onYourDocuments: [
    'Because every piece is handled on its own, the packing list carries more weight than usual. Give each piece its own line with its marks and number, the packaging (crate, skid, bundle, unpacked), its dimensions and its gross weight, and flag any piece that needs special lifting points.',
    'On the bill of lading break bulk is described by package count and type, not by container and seal number, so the number of pieces there must match the packing list and the commercial invoice exactly.',
  ],
  example: {
    caption: 'Worked example with invented parties',
    paragraphs: [
      'Ironbridge Fabrication (invented) of Houston sells a pressure vessel 14 metres long, plus six crates of fittings, to a refinery in Chile. The vessel will not fit a container, so the forwarder books it as break bulk on a general cargo ship.',
      'Ironbridge’s packing list shows seven pieces: the vessel on two steel saddles, with its weight and lifting points, and each crate with its own marks, size and weight. The bill of lading reads “7 pieces”, matching the list.',
    ],
  },
  confusedWith: [
    {
      term: 'Bulk cargo',
      difference:
        'Bulk cargo is loose and uniform, loaded by pouring, pumping or chute. Break bulk is packaged or bundled and loaded piece by piece.',
    },
  ],
  related: ['dunnage', '/guides/lcl-vs-fcl', '/blog/export-packing', '/blog/shipping-marks'],
  tool: '/tools/packing-list-generator',
  toolPitch:
    'The packing list generator gives every piece its own line with marks, dimensions and gross weight, which is what a break bulk booking and stowage plan are built on.',
  faq: [
    {
      q: 'What is the difference between bulk and break bulk cargo?',
      a: 'Bulk cargo is loose and homogeneous, like grain or ore, and stowed directly in the hold. Break bulk is not containerized but is packaged or bundled, like crates, coils or machinery, and each piece is handled separately.',
    },
    {
      q: 'Is break bulk the same as project cargo?',
      a: 'Project cargo is usually shipped break bulk, because it is oversized or heavy, but break bulk also covers ordinary crated or bundled goods that simply travel outside a container.',
    },
  ],
  sources: ['d5-cfr-19-4-7-break-bulk', 'w4-ippc-ispm-15'],
  regulated: false,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
