import type { CountryPage } from '@/lib/content/country';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "export to china" 260, KD 21; "exporting to
 * china" 260, KD 5; "china customs" 390, KD 52; "ccc certification" 590 (mention only).
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave B. Every fact below comes from the
 * source named beside it: the Customs Law as published by GACC and the ITA China guide. There
 * are no duty or tax rates on this page by design, and no wood packaging rule, because no GACC
 * page stating it could be opened on the retrieval date.
 */
const country: CountryPage = {
  slug: 'china',
  name: 'China',
  iso2: 'CN',
  customsUnion: null,
  demand: [
    {
      keyword: 'china customs',
      market: 'US',
      volume: 390,
      kd: 52,
      dataFile: '05-labs-keyword-overview-us-posts-countries-2.json',
    },
    {
      keyword: 'export to china',
      market: 'US',
      volume: 260,
      kd: 21,
      dataFile: '02-labs-keyword-overview-us-countries.json',
    },
    {
      keyword: 'exporting to china',
      market: 'US',
      volume: 260,
      kd: 5,
      dataFile: '02-labs-keyword-overview-us-countries.json',
    },
  ],
  metaTitle: 'China export documents: declaration and invoice',
  description:
    'The documents a shipment to China needs: the customs declaration by a registered importer, the invoice, packing list, bill of lading and contract, and when CCC applies.',
  answer:
    'A shipment to China is cleared on a customs declaration made by a Chinese importer registered with customs, or by its customs clearing agent. It is supported by the invoice, packing list, bill of lading, sales contract and insurance policy, plus any import licence, inspection certificate, CCC registration or food facility registration the goods need.',
  lede: 'What the exporter supplies and what the Chinese importer declares, with the official source for each line: the Customs Law of the People’s Republic of China as published by the General Administration of Customs, and the U.S. government’s China guide. It covers paperwork only. It states no duty or tax rates, and the importer’s customs clearing agent decides what a particular shipment needs.',
  customsAuthority: {
    name: 'General Administration of Customs of the People’s Republic of China (GACC)',
    url: 'https://english.customs.gov.cn/',
    sourceId: 'b7-gacc-customs-law',
  },
  documents: [
    {
      document: 'Customs declaration',
      status: 'required',
      condition:
        'Made by the importer itself or by a customs clearing agent it entrusts, in paper form and by electronic means.',
      sourceId: 'b7-gacc-customs-law',
    },
    {
      document: 'Invoice',
      status: 'required',
      condition: 'One of the standard documents the Chinese importer passes to customs; its values are the basis of the declared customs value.',
      sourceId: 'trade-gov-ccg-cn',
      tool: '/tools/invoice-generator',
    },
    {
      document: 'Packing list (shipping list)',
      status: 'required',
      condition: 'A standard document for Chinese customs alongside the invoice.',
      sourceId: 'trade-gov-ccg-cn',
      tool: '/tools/packing-list-generator',
    },
    {
      document: 'Bill of lading',
      status: 'required',
      condition: 'The transport document, among the standard documents for clearance.',
      sourceId: 'trade-gov-ccg-cn',
    },
    {
      document: 'Sales contract',
      status: 'typical',
      condition: 'Listed among the standard documents; requirements vary by product.',
      sourceId: 'trade-gov-ccg-cn',
    },
    {
      document: 'Insurance policy',
      status: 'typical',
      condition: 'Listed among the standard documents; requirements vary by product.',
      sourceId: 'trade-gov-ccg-cn',
    },
    {
      document: 'Import licence, quota certificate or inspection certificate',
      status: 'conditional',
      condition:
        'Where the goods are subject to them. Goods under state import restrictions are not released without the licensing documents.',
      sourceId: 'b7-gacc-customs-law',
    },
    {
      document: 'CCC registration and mark',
      status: 'conditional',
      condition:
        'For products on the China Compulsory Certification list, which cannot enter China until registration is obtained and the mark is applied.',
      sourceId: 'b7-trade-gov-cn-standards',
    },
    {
      document: 'GACC registration of the overseas food facility',
      status: 'conditional',
      condition:
        'For food and agricultural products: the foreign facility registers with GACC before shipping, by itself or through its competent authority depending on the product.',
      sourceId: 'trade-gov-ccg-cn',
    },
  ],
  invoiceRequirements: [
    {
      text: 'China values imports on the transaction value, including the cost of transport, related charges and insurance up to unloading at the point of entry, so show freight and insurance on the invoice where you pay them.',
      sourceId: 'b7-gacc-customs-law',
    },
    {
      text: 'The importer must make an accurate declaration, and a declaration accepted by customs cannot be amended or withdrawn without a valid reason and customs approval, so the invoice and packing list need to be right before they are passed on.',
      sourceId: 'b7-gacc-customs-law',
    },
    {
      text: 'Products sold in China must be marked in Chinese, and registered food producers print their Chinese registration number on the packaging; keep the invoice description consistent with those labels.',
      sourceId: 'b7-trade-gov-cn-labeling',
    },
  ],
  importerIdentifiers: [
    {
      name: 'Customs registration of the importer (consignee)',
      whoNeedsIt:
        'The Chinese importer. An enterprise not registered with customs is not allowed to make customs declarations; consignees register with their local customs.',
      sourceId: 'b7-gacc-consignee-registration',
    },
    {
      name: 'Registered customs clearing agent',
      whoNeedsIt:
        'Any agent that declares on the importer’s behalf. Customs clearing agents must also be registered with customs and may not declare beyond their approved scope.',
      sourceId: 'b7-gacc-customs-law',
    },
  ],
  valuationBasis: { basis: 'CIF', sourceId: 'b7-gacc-customs-law' },
  incotermsNotes: [
    {
      text: 'Only importers and agents registered with Chinese customs may declare goods, so a DDP sale needs a party in China registered to import them. A seller without one sells on DAP or an earlier rule and lets the buyer import.',
      sourceId: 'b7-gacc-customs-law',
    },
    {
      text: 'The importer has 14 days from the declaration of the arrival of the means of transport to declare the goods. Send the documents ahead of the ship or flight so that time is not lost waiting for them.',
      sourceId: 'b7-gacc-customs-law',
    },
    {
      text: 'In practice the Chinese importer, whether an agent, distributor, joint-venture partner or foreign-invested enterprise, gathers the documents and gives them to the customs clearing agent.',
      sourceId: 'trade-gov-ccg-cn',
    },
  ],
  controlledGoods: null,
  packaging: null,
  lowValueThreshold: null,
  sections: [
    {
      heading: 'Who declares the goods at Chinese customs?',
      paragraphs: [
        'The importer, or a customs clearing agent it entrusts. Under the Customs Law both have to be registered with customs to declare, and an unregistered enterprise cannot do it at all. The exporter’s part is to supply documents the importer can declare from without changes, because once customs accepts a declaration it can be amended or withdrawn only for a valid reason and with customs approval.',
        'The ITA’s China guide describes the usual flow: the Chinese importer, whether a distributor, an agent, a joint-venture partner or a foreign-invested enterprise, collects the documents from the seller and hands them to the clearing agent.',
      ],
    },
    {
      heading: 'What should the commercial invoice for China show?',
      paragraphs: [
        'Everything a customs value is built from. China values imports on the transaction value and adds the cost of transport, related charges and insurance up to unloading at the point of entry, which is a CIF basis. If you sell FOB, the importer adds freight and insurance; if you sell CIF or CIP, state them on the invoice so the figure is easy to check.',
        'Beyond that, give the full names and addresses of both parties, a description precise enough to classify each line, quantities and units, unit and total values in the currency of the sale, the Incoterms® rule and the origin of the goods. Ask the importer’s agent whether it wants Chinese descriptions alongside the English, and keep the descriptions consistent with the Chinese labels on the products.',
      ],
    },
    {
      heading: 'When does CCC certification apply?',
      paragraphs: [
        'Only to products on the China Compulsory Certification list. The CCC mark is China’s national safety and quality mark, administered under the State Administration for Market Regulation, and a listed product cannot enter China until it has been registered and the mark is applied to each unit. Whether your product is on the list is a question for the official catalogue and your buyer, not for this page.',
      ],
    },
    {
      heading: 'What should I ask my Chinese buyer before shipping?',
      paragraphs: [
        'Five questions cover most first shipments: is the buyer registered with customs as an importer, and who is its customs clearing agent; does the product need an import licence, quota or inspection certificate; is it on the CCC list; for food or agricultural products, is your facility registered with GACC; and which Incoterms® rule are you selling on, so it is clear who declares the goods and pays at import.',
        'Record the answers against the buyer. The next shipment then starts from the same facts, and the invoice, packing list and contract agree because they come from one record.',
      ],
    },
    {
      heading: 'Where do duty and tax figures come from?',
      paragraphs: [
        'From the importer’s clearing agent. Chinese import charges depend on the classification, the origin and any agreement claimed, and they change. TradeDocs states no rates here, because a stale figure in a quotation does more harm than none.',
      ],
    },
  ],
  faq: [
    {
      q: 'Who can clear goods through Chinese customs?',
      a: 'An importer registered with Chinese customs, either itself or through a registered customs clearing agent it entrusts. An enterprise that is not registered with customs is not allowed to make customs declarations.',
    },
    {
      q: 'Is China’s customs value CIF or FOB?',
      a: 'CIF. Under Article 55 of the Customs Law, the customs value of imports includes the value of the goods plus transport, related charges and insurance up to unloading at the point of entry into China.',
    },
    {
      q: 'Do all products need CCC certification?',
      a: 'No, only products on the China Compulsory Certification list. A listed product cannot enter China until CCC registration is obtained and the mark is physically applied.',
    },
    {
      q: 'How long does the importer have to declare the goods?',
      a: 'Fourteen days from the declaration of the arrival of the means of transport, under Article 24 of the Customs Law. Sending the documents early keeps that window free for the declaration itself.',
    },
  ],
  sources: [
    'b7-gacc-customs-law',
    'trade-gov-ccg-cn',
    'b7-gacc-consignee-registration',
    'b7-trade-gov-cn-standards',
    'b7-trade-gov-cn-labeling',
  ],
  regulated: true,
  review: null,
  tool: '/tools/invoice-generator',
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default country;
