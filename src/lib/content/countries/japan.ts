import type { CountryPage } from '@/lib/content/country';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, 2026-10-07): "shipping to japan from us" 140, KD 13 (US); "export to
 * japan" 20, KD 17 (US). "japan customs" 2,400 is traveller intent and is not counted. Plan:
 * docs/research/content-plan-v3-2026-10-07.md, wave D. Every fact below comes from Japan
 * Customs’ English pages, the ITA Country Commercial Guide for Japan or the IPPC country page.
 * There are no duty or tax rates on this page by design, and no low-value or controlled-goods
 * rows because no dated official source for them was confirmed on the retrieval date.
 */
const country: CountryPage = {
  slug: 'japan',
  name: 'Japan',
  iso2: 'JP',
  customsUnion: null,
  demand: [
    {
      keyword: 'shipping to japan from us',
      market: 'US',
      volume: 140,
      kd: 13,
      dataFile: '02-labs-keyword-overview-us-countries.json',
    },
    {
      keyword: 'export to japan',
      market: 'US',
      volume: 20,
      kd: 17,
      dataFile: '02-labs-keyword-overview-us-countries.json',
    },
  ],
  metaTitle: 'Japan export documents: invoice and form C-5020',
  description:
    'The documents a shipment to Japan needs: the import declaration on form C-5020, the invoice, packing list and bill of lading behind it, and the agent a non-resident importer appoints.',
  answer:
    'A shipment to Japan needs a commercial invoice, a packing list and a bill of lading or air waybill, which support the importer’s declaration on Customs form C-5020. Origin evidence is needed only to claim a WTO or preferential rate, and some goods need a licence or permit under other laws.',
  lede: 'What the exporter supplies and what is filed in Japan, with the official source for each line, mainly Japan Customs’ English pages and the U.S. International Trade Administration’s guide. It states no duty or tax rates; the importer’s customs broker decides what a particular shipment needs.',
  customsAuthority: {
    name: 'Japan Customs, Ministry of Finance',
    url: 'https://www.customs.go.jp/english/index.htm',
    sourceId: 'd5-japan-customs-import',
  },
  documents: [
    {
      document: 'Import declaration (Customs form C-5020)',
      status: 'required',
      condition:
        'Filed with the Director-General of Customs, in principle by the importer and usually by a customs broker acting for it, stating the quantity and value of the goods. Goods are released on an import permit once examination and payment are complete.',
      sourceId: 'd5-japan-customs-import',
    },
    {
      document: 'Commercial invoice',
      status: 'required',
      condition:
        'Listed by Japan Customs as a supporting document of the declaration; the ITA advises making it as descriptive as possible for each item in the shipment.',
      sourceId: 'trade-gov-ccg-jp',
      tool: '/tools/invoice-generator',
    },
    {
      document: 'Bill of lading or air waybill',
      status: 'required',
      condition:
        'The transport document supporting the declaration; the ITA lists an original, signed bill of lading for sea freight or an air waybill for air.',
      sourceId: 'd5-japan-customs-import',
    },
    {
      document: 'Packing list',
      status: 'typical',
      condition:
        'Required where necessary by Japan Customs; the ITA expects it to give the exact contents and measurements of each container and the gross and net weight of each package, in metric units.',
      sourceId: 'trade-gov-ccg-jp',
      tool: '/tools/packing-list-generator',
    },
    {
      document: 'Origin evidence for a WTO or preferential rate',
      status: 'conditional',
      condition:
        'Needed only when the importer claims a WTO or preferential duty rate. The ITA notes that U.S. shipments are routinely assessed at WTO or temporary rates without it.',
      sourceId: 'trade-gov-ccg-jp',
    },
    {
      document: 'Licence, permit or certificate under other laws',
      status: 'conditional',
      condition:
        'For restricted goods, such as items under quarantine, narcotics or foreign exchange laws; customs needs proof the permit was obtained before it grants the import permit (Customs Law, Article 70).',
      sourceId: 'd5-japan-customs-import',
    },
  ],
  invoiceRequirements: [
    {
      text: 'Describe each item as fully as possible. The ITA’s guide says the commercial invoice for Japan should be as descriptive as possible for each item in the shipment.',
      sourceId: 'trade-gov-ccg-jp',
    },
    {
      text: 'State the quantity and the value of each line clearly, because the import declaration must show both and is built from the invoice.',
      sourceId: 'd5-japan-customs-import',
    },
    {
      text: 'Show freight and insurance to the Japanese port, or give them to the broker separately, because Japan’s customs value adds transport costs up to arrival at the port and insurance to the price paid.',
      sourceId: 'd5-japan-customs-valuation',
    },
    {
      text: 'Give weights in metric units on the invoice and packing list. The ITA notes that Japanese Measurement Law requires metric values for weights and measures.',
      sourceId: 'trade-gov-ccg-jp',
    },
  ],
  importerIdentifiers: [
    {
      name: 'Customs Procedure Agent (for a non-resident importer)',
      whoNeedsIt:
        'A company or person living outside Japan that wants to act as importer. It designates an agent with an address in Japan and notifies the customs office in advance on Customs form C No. 7500; brokerage work still needs a licensed customs broker.',
      sourceId: 'd5-japan-customs-procedure-agent',
    },
  ],
  valuationBasis: { basis: 'CIF', sourceId: 'd5-japan-customs-valuation' },
  incotermsNotes: [
    {
      text: 'A U.S. seller quoting DDP must be able to act as importer. Japan Customs requires a person living abroad who files import declarations to designate a Customs Procedure Agent in Japan and notify the customs office before the procedure, so set that up, or sell DAP and let the Japanese buyer import.',
      sourceId: 'd5-japan-customs-procedure-agent',
    },
    {
      text: 'The declaration is generally made after the goods enter a Hozei (bonded) area, so an EXW, FCA or FOB sale still ends with the buyer’s broker declaring the goods at the Japanese port, using the documents you supplied.',
      sourceId: 'd5-japan-customs-import',
    },
    {
      text: 'Even on an FOB sale, the customs value includes the freight to the Japanese port and the insurance. Tell the buyer the freight and insurance costs, or invoice CIF, so the broker does not have to estimate them.',
      sourceId: 'd5-japan-customs-valuation',
    },
  ],
  controlledGoods: null,
  packaging: { ispm15: true, sourceId: 'd5-ippc-japan-ispm15' },
  lowValueThreshold: null,
  sections: [
    {
      heading: 'How does import clearance work in Japan?',
      paragraphs: [
        'Japan Customs sums it up in one rule: anyone importing goods declares them to the Director-General of Customs and obtains an import permit. The declaration goes on form C-5020, prepared in triplicate, and states the quantity and value of the goods and the other particulars the law requires. The importer is the declarant in principle, though in practice a licensed customs broker usually files on the importer’s behalf.',
        'Timing follows the goods. The declaration is generally made once the cargo has entered a Hozei area, Japan’s bonded zones at ports and airports; for certain goods approved by the Director-General it can be made while they are still aboard the ship. After any examination and payment of the customs duty and excise tax due, the permit is issued and the goods can leave.',
      ],
    },
    {
      heading: 'What does Japan Customs want on the invoice?',
      paragraphs: [
        'Japan Customs lists the invoice first among the documents behind the declaration, and asks for the others, the bill of lading or air waybill, packing lists, freight accounts and insurance documents, where they are needed to assess the goods. The ITA’s advice is to make the invoice as descriptive as possible for each item, and to make the packing list show what is in each container, its measurements and each package’s gross and net weight.',
        'Write every weight and measure in metric units. The ITA points to the Japanese Measurement Law, which requires metric values, so a packing list in pounds and inches is a list the broker has to convert before it can be used.',
      ],
    },
    {
      heading: 'How is the customs value worked out for Japan?',
      paragraphs: [
        'On a CIF basis. Japan Customs explains that its valuation rules, set in the Customs Tariff Law and based on the WTO Customs Valuation Agreement, start from the transaction value and add transportation-related expenses, including the fare until arrival at the port and insurance. Costs after arrival, and duties and taxes in Japan, are not part of it.',
        'For an exporter the consequence is practical: if you sell FOB, the broker still needs the ocean or air freight and the insurance to complete the value. TradeDocs states no rates here; the broker works out the charges from the invoice and those figures.',
      ],
    },
    {
      heading: 'Can a U.S. company be the importer in Japan?',
      paragraphs: [
        'Yes, through a Customs Procedure Agent. Japan Customs requires a person living abroad who handles customs procedures such as import declarations to designate an agent in Japan and notify the customs office in advance, on form C No. 7500 with supporting documents such as the contract with the agent and proof that both parties exist. The agent must have an address in Japan, and takes care of declarations, inspections, duty payment, documents and refunds.',
        'If the agent is not a licensed customs broker, the brokerage work itself still goes to a licensed broker. Selling DAP avoids the question: the Japanese buyer, already established, imports with its own broker.',
      ],
    },
    {
      heading: 'Does wood packaging need ISPM 15 treatment for Japan?',
      paragraphs: [
        'Yes. The IPPC lists Japan as implementing ISPM 15 for imported wood packaging material, with details from its Ministry of Agriculture, Forestry and Fisheries. Use pallets, crates and dunnage that are treated and marked under the standard, or switch to plastic, metal or processed wood packaging that falls outside it.',
      ],
    },
  ],
  faq: [
    {
      q: 'Which documents do I need to ship to Japan?',
      a: 'A commercial invoice, a packing list and a bill of lading or air waybill, which support the importer’s declaration on form C-5020. Origin evidence is needed only to claim a WTO or preferential rate, and restricted goods need the relevant permit.',
    },
    {
      q: 'Who files the import declaration in Japan?',
      a: 'The importer, in principle, but a licensed customs broker usually files it on the importer’s behalf, generally after the goods have entered a Hozei (bonded) area.',
    },
    {
      q: 'Is Japan’s customs value CIF or FOB?',
      a: 'CIF in effect: Japan Customs adds the transport costs up to arrival at the port and insurance to the transaction value, so freight and insurance figures are needed even on an FOB sale.',
    },
    {
      q: 'Can a foreign company import into Japan without a local entity?',
      a: 'Yes, by designating a Customs Procedure Agent with an address in Japan and notifying the customs office in advance on form C No. 7500. Brokerage work still needs a licensed customs broker.',
    },
  ],
  sources: [
    'd5-japan-customs-import',
    'trade-gov-ccg-jp',
    'd5-japan-customs-valuation',
    'd5-japan-customs-procedure-agent',
    'd5-ippc-japan-ispm15',
    'b6-ippc-ispm-15',
  ],
  regulated: true,
  review: null,
  tool: '/tools/invoice-generator',
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default country;
