import type { CountryPage } from '@/lib/content/country';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "mexico customs" 1,900, KD 5; "shipping to
 * mexico" 590; "shipping from us to mexico" 480; "pedimento" 720; "carta porte" 320.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave A. Every fact below comes from the
 * source named beside it; there are no duty or tax rates on this page by design.
 */
const country: CountryPage = {
  slug: 'mexico',
  name: 'Mexico',
  iso2: 'MX',
  customsUnion: null,
  demand: [
    {
      keyword: 'mexico customs',
      market: 'US',
      volume: 1_900,
      kd: 5,
      dataFile: '05-labs-keyword-overview-us-posts-countries-2.json',
    },
    {
      keyword: 'shipping to mexico',
      market: 'US',
      volume: 590,
      kd: 7,
      dataFile: '05-labs-keyword-overview-us-posts-countries-2.json',
    },
    {
      keyword: 'pedimento',
      market: 'US',
      volume: 720,
      kd: null,
      dataFile: '04-labs-keyword-overview-us-questions.json',
    },
  ],
  metaTitle: 'Mexico export documents: pedimento and invoice',
  description:
    'The documents a shipment to Mexico needs: the pedimento, a commercial invoice in Spanish, the bill of lading, the importer registry and Carta Porte, from official sources.',
  answer:
    'A shipment to Mexico is cleared on a pedimento de importación, the customs declaration filed by the importer’s customs broker. It must be backed by a commercial invoice in Spanish, the bill of lading and proof that the goods meet Mexican product rules. The importer must be registered in the Padrón de Importadores.',
  lede: 'What the exporter supplies and what the Mexican importer files, document by document, with the official source for each line. It covers the paperwork only: it states no duty or tax rates, and your buyer’s customs broker has the last word on what a particular shipment needs.',
  customsAuthority: {
    name: 'Agencia Nacional de Aduanas de México (ANAM)',
    url: 'https://www.anam.gob.mx/',
    sourceId: 'anam-mexico',
  },
  documents: [
    {
      document: 'Pedimento de importación (customs declaration)',
      status: 'required',
      condition:
        'The basic Mexican import document, filed for customs clearance on the importer’s side, normally by its customs broker.',
      sourceId: 'trade-gov-ccg-mx',
    },
    {
      document: 'Commercial invoice, in Spanish',
      status: 'required',
      condition:
        'Accompanies the pedimento. Prepare it in Spanish, or agree a bilingual layout with the buyer’s broker.',
      sourceId: 'trade-gov-ccg-mx',
      tool: '/tools/invoice-generator',
    },
    {
      document: 'Bill of lading',
      status: 'required',
      condition: 'Accompanies the pedimento as the transport document for the shipment.',
      sourceId: 'trade-gov-ccg-mx',
    },
    {
      document: 'Proof of compliance with Mexican product safety regulations',
      status: 'conditional',
      condition: 'Where the goods fall under a Mexican product safety regulation.',
      sourceId: 'trade-gov-ccg-mx',
    },
    {
      document: 'Guarantee of payment of additional duties',
      status: 'conditional',
      condition: 'Only where the goods are treated as undervalued, if applicable.',
      sourceId: 'trade-gov-ccg-mx',
    },
    {
      document: 'Complemento Carta Porte (bill of lading complement)',
      status: 'required',
      condition:
        'An obligation on Mexican importers since 1 August 2023. Ask your buyer which shipment details they need from you to complete it.',
      sourceId: 'trade-gov-ccg-mx',
    },
    {
      document: 'Packing list',
      status: 'typical',
      condition:
        'Itemises the packages, weights and dimensions; the forwarder and the broker work from it alongside the invoice.',
      sourceId: 'trade-gov-packing-list',
      tool: '/tools/packing-list-generator',
    },
  ],
  invoiceRequirements: [
    {
      text: 'The commercial invoice that accompanies the pedimento is in Spanish.',
      sourceId: 'trade-gov-ccg-mx',
    },
  ],
  importerIdentifiers: [
    {
      name: 'RFC (Registro Federal de Contribuyentes)',
      whoNeedsIt:
        'The Mexican importer. Being registered and active in the RFC is a condition of joining the importer registry.',
      sourceId: 'sat-padron-importadores',
    },
    {
      name: 'Padrón de Importadores (importer registry)',
      whoNeedsIt:
        'Every person or company that imports goods into Mexico. The registry is kept by the Secretariat of Finance and Public Credit (SHCP).',
      sourceId: 'trade-gov-ccg-mx',
    },
    {
      name: 'Sector registry (Padrón de Importadores de Sectores Específicos)',
      whoNeedsIt:
        'Importers of goods in specific sectors, such as textiles, apparel and footwear, which cannot be imported by a company not registered for them.',
      sourceId: 'trade-gov-ccg-mx',
    },
  ],
  valuationBasis: null,
  incotermsNotes: [
    {
      text: 'Goods are cleared through Mexican customs by a Mexican customs broker or by the importer’s authorised legal representative, and having a customs agent or representative is a condition of registering as an importer.',
      sourceId: 'sat-padron-importadores',
    },
    {
      text: 'Because every importer must be listed in the Padrón de Importadores, a DDP sale needs a party in Mexico that is registered to import the goods. Settle who that is before agreeing DDP; under DAP or an earlier rule the buyer imports.',
      sourceId: 'trade-gov-ccg-mx',
    },
  ],
  controlledGoods: null,
  packaging: null,
  lowValueThreshold: null,
  sections: [
    {
      heading: 'Who does what at Mexican customs?',
      paragraphs: [
        'The work splits in two. The exporter supplies the commercial documents: the commercial invoice, the packing list and the transport document. The Mexican importer, through its customs broker or legal representative, files the pedimento with ANAM, the national customs agency, and pays what is due. The pedimento is built from your invoice, so the descriptions, quantities and values on your documents are what the broker declares.',
        'That makes the buyer’s broker the person to ask before the first shipment. They know which product rules apply to your goods, whether the buyer is registered in a sector registry, and what they need on the invoice to file without delay.',
      ],
    },
    {
      heading: 'What should the commercial invoice to Mexico show?',
      paragraphs: [
        'The ITA’s country guide says the invoice that accompanies the pedimento is in Spanish. A bilingual invoice, English and Spanish on the same page, is one way to meet that and keep your own records in English; agree the layout with the broker first.',
        'Beyond the language, the invoice should carry what any commercial invoice carries: the seller and buyer with full addresses, a description precise enough to classify each line, quantities and units, unit and total values in the currency of the sale, the Incoterms® rule and the country of origin of the goods. Ask the broker whether it wants the buyer’s RFC printed on the invoice, and whether it needs any extra detail for goods under a product safety rule.',
      ],
    },
    {
      heading: 'What should I ask my Mexican buyer before shipping?',
      paragraphs: [
        'Five questions settle most first shipments: who their customs broker is and how to reach them; whether they are registered in the Padrón de Importadores and, for textiles, apparel, footwear and other listed sectors, in the sector registry; whether a Mexican product safety regulation covers the goods and what proof they need from you; which details they need for the Carta Porte; and which Incoterms® rule you are selling on, so it is clear who imports.',
        'Write the answers into the shipment record. The next shipment to the same buyer then starts from the same facts, and the invoice, packing list and bill of lading agree because they come from one record.',
      ],
    },
    {
      heading: 'Where do duty rates and thresholds come from?',
      paragraphs: [
        'Not from this page. Duty, VAT and any other charges on an import into Mexico depend on the tariff classification, the origin of the goods and the trade agreement claimed, and the importer’s broker works them out. TradeDocs states no rates here because they change and because a wrong figure in a quotation is worse than none.',
      ],
    },
  ],
  faq: [
    {
      q: 'What is a pedimento?',
      a: 'The pedimento de importación is Mexico’s customs declaration for imports, the basic document for clearance. The importer’s customs broker or legal representative files it, supported by your commercial invoice, the bill of lading and any product compliance documents.',
    },
    {
      q: 'Does a commercial invoice for Mexico have to be in Spanish?',
      a: 'The ITA’s Mexico country guide lists a commercial invoice in Spanish among the documents that accompany the pedimento. A bilingual English and Spanish invoice is one way to meet that; confirm the layout with the buyer’s broker.',
    },
    {
      q: 'What is the Carta Porte?',
      a: 'The Complemento Carta Porte is a bill of lading complement that Mexican importers must comply with since 1 August 2023. The importer’s side completes it; ask your buyer which shipment details they need from you.',
    },
    {
      q: 'Can I sell DDP to Mexico?',
      a: 'Only if a party in Mexico is registered to import the goods, because every importer must be listed in the Padrón de Importadores, with an active RFC and a customs agent or representative. Otherwise, sell on DAP or an earlier rule so the buyer imports.',
    },
  ],
  sources: ['anam-mexico', 'trade-gov-ccg-mx', 'sat-padron-importadores', 'trade-gov-packing-list'],
  regulated: true,
  review: null,
  tool: '/tools/invoice-generator',
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default country;
