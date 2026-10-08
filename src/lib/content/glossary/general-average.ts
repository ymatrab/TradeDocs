import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'general-average',
  term: 'General average',
  abbreviation: 'GA',
  aliases: ['general average declaration', 'York-Antwerp Rules', 'GA contribution'],
  demand: {
    keyword: 'general average',
    market: 'US',
    volume: 210,
    kd: 9,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'General average: meaning for cargo owners',
  description:
    'What general average is, how the York-Antwerp Rules share a sacrifice made to save a voyage, why cargo owners must contribute even when their goods are undamaged, and how insurance fits in.',
  shortDefinition:
    'General average is the maritime principle that when a sacrifice or expense is deliberately made to save a ship and its cargo from a common danger, everyone with property on the voyage shares the cost in proportion to the value saved.',
  definition: [
    'Picture a ship on fire at sea. The crew floods a hold to save the vessel, and the cargo in that hold is ruined; or the ship is towed to a port of refuge at great cost. Those losses were incurred for everyone’s benefit, so the law of the sea spreads them across the ship, the cargo and the freight rather than leaving them on whoever happened to suffer them.',
    'The rules most contracts use are the York-Antwerp Rules, maintained by the Comité Maritime International (CMI). The CMI recommends the 2016 version, approved in New York that year, and notes that earlier versions such as 1994 and 2004 are still written into commercial contracts. Rule A of the 2016 text describes a general average act as an extraordinary sacrifice or expenditure intentionally and reasonably made or incurred for the common safety, to preserve the property in a common maritime adventure from peril, and says the resulting losses are borne by the contributing interests.',
    'The Rules apply because the bill of lading or charter party incorporates them. An average adjuster then works out each party’s share on the values at the end of the voyage.',
  ],
  onYourDocuments: [
    'General average is not on your invoice; it lives in the carrier’s bill of lading terms, which usually state which York-Antwerp Rules apply. What your documents do provide is value: the commercial invoice is the starting evidence of the cargo’s value, on which its contribution is assessed.',
    'When general average is declared, the shipowner or adjuster asks each cargo interest for security for its contribution. The CMI publishes standard forms for it, a cargo bond and a cargo guarantee, approved by the International Union of Marine Insurance; the guarantee is the part a cargo insurer can give, which is why the Incoterms® rule, by deciding who insures, matters here.',
  ],
  example: {
    caption: 'Worked example with invented parties',
    paragraphs: [
      'Sunbelt Ceramics (invented) ships tiles from Savannah to Lisbon on CIF terms. Mid-ocean, the vessel’s engine room catches fire and the master calls for salvage tugs. The carrier declares general average, and the adjuster asks each cargo owner for security before release in Lisbon.',
      'Sunbelt’s tiles are undamaged, but they were saved too, so they must contribute. Sunbelt insured the cargo, as CIF requires, so it signs the bond, its insurer gives the guarantee, and the buyer collects the tiles.',
    ],
  },
  confusedWith: [
    {
      term: 'Particular average',
      difference:
        'Particular average is accidental loss or damage that falls on the owner of the property affected, such as cargo soaked by a leak. General average is a deliberate sacrifice for the common safety, shared by all.',
    },
  ],
  related: [
    '/blog/cargo-insurance-for-exporters',
    '/guides/what-is-a-bill-of-lading',
    '/blog/cif-vs-cip',
    '/blog/letter-of-indemnity',
  ],
  tool: '/tools/incoterms',
  toolPitch:
    'The Incoterms® rules tool shows who must insure the goods under each rule, which decides who provides security when general average is declared.',
  faq: [
    {
      q: 'Why do I have to pay general average if my cargo was not damaged?',
      a: 'Because the sacrifice or expense saved your cargo along with the ship. Under the York-Antwerp Rules everyone whose property was preserved contributes in proportion to its value, whether or not it was damaged.',
    },
    {
      q: 'Does cargo insurance cover general average?',
      a: 'It depends on the policy, so ask your insurer before you ship. A cargo guarantee on the CMI form, approved by the marine insurers’ union, is one standard way the security is given, and your Incoterms® rule decides who arranges the insurance.',
    },
  ],
  sources: ['d5-cmi-yar', 'd5-cmi-yar-2016-text', 'd5-cmi-ga-security'],
  regulated: false,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
