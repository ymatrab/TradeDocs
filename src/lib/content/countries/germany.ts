import type { CountryPage } from '@/lib/content/country';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, 2026-10-07): "shipping to germany from us" 210, KD 11 (US); "germany
 * customs" 210, KD 28 (US); "zoll germany" 140 (US); "shipping to germany from uk" 140 (UK).
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave C. Germany is in the EU customs
 * union, so the import rules are the Union Customs Code's, applied by German Customs (Zoll);
 * every fact below comes from zoll.de's English pages or the ITA Country Commercial Guide's EU
 * chapter, to which the Germany chapter refers. There are no duty or tax rates on this page by
 * design, and no valuation, wood-packaging or low-value rows because no current official source
 * for them was confirmed on the retrieval date.
 */
const country: CountryPage = {
  slug: 'germany',
  name: 'Germany',
  iso2: 'DE',
  customsUnion: 'EU',
  demand: [
    {
      keyword: 'shipping to germany from us',
      market: 'US',
      volume: 210,
      kd: 11,
      dataFile: '02-labs-keyword-overview-us-countries.json',
    },
    {
      keyword: 'germany customs',
      market: 'US',
      volume: 210,
      kd: 28,
      dataFile: '05-labs-keyword-overview-us-posts-countries-2.json',
    },
    {
      keyword: 'zoll germany',
      market: 'US',
      volume: 140,
      kd: 21,
      dataFile: '05-labs-keyword-overview-us-posts-countries-2.json',
    },
  ],
  metaTitle: 'Germany export documents: EORI, customs declaration, Zoll',
  description:
    'The documents a shipment to Germany needs: the entry summary declaration, the customs declaration for release for free circulation, the importer’s EORI number and the invoice and packing list behind them, from German Customs (Zoll) sources.',
  answer:
    'A shipment to Germany needs an entry summary declaration before it reaches the EU, then a customs declaration releasing the goods for free circulation under the declarant’s EORI number. The commercial invoice and packing list supply the values, descriptions and weights both filings use.',
  lede: 'What the exporter supplies and what is filed in Germany, with the official source for each line, mainly the English pages of German Customs (Zoll). Germany applies the EU’s customs rules, so most of this holds across the Union; it states no duty or tax rates, and the importer’s customs broker decides what a particular shipment needs.',
  customsAuthority: {
    name: 'German Customs (Zoll), Generalzolldirektion',
    url: 'https://www.zoll.de/EN/Home/home_node.html',
    sourceId: 'c6-zoll-release-free-circulation',
  },
  documents: [
    {
      document: 'Entry summary declaration (ESumA)',
      status: 'required',
      condition:
        'Lodged before the goods are moved into the EU customs territory, electronically through ATLAS-EAS at the first customs office of entry, for security and safety risk analysis.',
      sourceId: 'c6-zoll-entry-summary',
    },
    {
      document: 'Customs declaration for release for free circulation',
      status: 'required',
      condition:
        'Places goods from a third country under the procedure that lets them be freely disposed of in the EU. The Single Administrative Document format covers both customs duties and VAT.',
      sourceId: 'c6-zoll-release-free-circulation',
    },
    {
      document: 'Commercial invoice',
      status: 'typical',
      condition:
        'The document customs relies on to assess duties and taxes, and the main support for the declaration’s value and description.',
      sourceId: 'trade-gov-commercial-invoice',
      tool: '/tools/invoice-generator',
    },
    {
      document: 'Packing list',
      status: 'typical',
      condition:
        'Itemises the contents, weights and measurements of each package; forwarders and customs use it to check the shipment.',
      sourceId: 'trade-gov-packing-list',
      tool: '/tools/packing-list-generator',
    },
  ],
  invoiceRequirements: [
    {
      text: 'Describe the goods precisely enough to be classified: the level of duty on goods from outside the EU depends on the product’s TARIC code, the code assigned under the EU’s integrated tariff.',
      sourceId: 'c6-zoll-normal-clearance',
    },
    {
      text: 'Show the price actually paid or payable and how it was reached. German Customs calls that price the central question of customs valuation, and always examines the transaction value method before any other.',
      sourceId: 'c6-zoll-customs-value',
    },
    {
      text: 'Give the importer’s EORI number with its name and address where the buyer supplies it, because the number must be quoted when the customs declaration and the entry summary declaration are lodged.',
      sourceId: 'c6-zoll-eori',
    },
  ],
  importerIdentifiers: [
    {
      name: 'EORI number (Economic Operators’ Registration and Identification number)',
      whoNeedsIt:
        'Any operator lodging customs declarations or entry and exit summary declarations in the EU. In Germany it is requested free of charge from the Central Customs Authority, through the Customs Portal, which becomes mandatory from 1 October 2026.',
      sourceId: 'c6-zoll-eori',
    },
    {
      name: 'EORI number for a non-EU company',
      whoNeedsIt:
        'A U.S. or other non-EU company that clears goods itself. It requests the number from the customs authority of the first Member State it exports to and can then use it across the EU.',
      sourceId: 'trade-gov-ccg-eu',
    },
  ],
  valuationBasis: null,
  incotermsNotes: [
    {
      text: 'To declare goods for release for free circulation, a person must be established in the EU customs territory or be represented by someone established there; occasional declarations are an exception the clearing office decides on. A DDP seller without an EU entity therefore needs a representative in the EU, or should sell on DAP and let the buyer import.',
      sourceId: 'c6-zoll-release-free-circulation',
    },
    {
      text: 'Release for free circulation normally assumes the import charges, customs duty, import VAT and any excise duty, have been paid. Under DDP those charges fall on the seller, so agree in writing who acts as declarant before quoting.',
      sourceId: 'c6-zoll-release-free-circulation',
    },
  ],
  controlledGoods: null,
  packaging: null,
  lowValueThreshold: null,
  sections: [
    {
      heading: 'Who files what at German customs?',
      paragraphs: [
        'Two filings bracket the arrival. Before the goods enter the EU, an entry summary declaration, the ESumA, is lodged electronically through ATLAS-EAS at the first customs office of entry so customs can run a security and safety risk analysis. German Customs distinguishes it from the summary declaration for temporary storage, which only notifies customs that the goods are there.',
        'Then the goods are declared for a customs procedure. For goods that will stay and be sold in Germany that procedure is release for free circulation, after which they have Union status and can be disposed of freely. The ITA’s guide describes the Single Administrative Document as the EU importer’s declaration, covering customs duties and VAT and valid in all Member States, filed by the importer or an agent acting for it.',
      ],
    },
    {
      heading: 'Why does the EORI number matter so much?',
      paragraphs: [
        'Because nothing is cleared without one. German Customs calls the EORI number a prerequisite for customs clearance in the EU and says it must be quoted to identify operators, in particular on customs declarations and entry and exit summary declarations. It replaced the old German customs number, and it is not the same as a VAT identification number or a tax number.',
        'For a German buyer the number comes from the Central Customs Authority, free of charge; Zoll warns that there is no need to pay a third-party provider. From 1 October 2026 the request goes through the Customs Portal, with the paper form series accepted only in exceptional cases. A U.S. exporter that clears goods in its own name requests an EORI in the first Member State it exports to.',
      ],
    },
    {
      heading: 'Can I ship DDP to a German customer?',
      paragraphs: [
        'Only with a way to be the declarant. German Customs requires the person declaring goods for free circulation to be established in the EU or to be represented by someone established there, and the procedure assumes the duty and import VAT are paid. A seller outside the EU can meet that through a representative established in the EU, such as a customs broker, together with its own EORI number.',
        'If that is not in place, DAP is the cleaner rule: you deliver, the German buyer clears the goods with its own EORI and pays the import charges, and both sides know who holds the declaration.',
      ],
    },
    {
      heading: 'What should I ask my German buyer before shipping?',
      paragraphs: [
        'Settle four points first: the buyer’s EORI number and the exact name and address it is registered under; who acts as declarant and through which broker; the Incoterms® rule, and with it who pays duty and import VAT; and whether the goods face any import restriction, which Zoll lists under its import restrictions pages.',
        'Then check the invoice description against how the broker will classify the goods, since the TARIC code decides the duty and a vague description slows the declaration.',
      ],
    },
    {
      heading: 'How is duty on goods entering Germany worked out?',
      paragraphs: [
        'German Customs explains that duty is payable in principle on goods from outside the EU, at a level set by the product’s TARIC code, with the customs value as the basis for ad valorem duties. It does not depend on anything German alone, because the tariff is the EU’s common customs tariff. TradeDocs states no rates here; the importer’s broker works out the charges from the invoice you supply.',
      ],
    },
  ],
  faq: [
    {
      q: 'Does the German importer need an EORI number?',
      a: 'Yes. German Customs says the EORI number is a prerequisite for customs clearance in the EU and must be quoted on customs declarations. German businesses request it free of charge from the Central Customs Authority.',
    },
    {
      q: 'What is ATLAS-EAS?',
      a: 'The German Customs system through which the entry summary declaration is lodged electronically, at the first customs office of entry, before goods are moved into the EU.',
    },
    {
      q: 'Can a U.S. company clear goods into Germany in its own name?',
      a: 'Only if it is established in the EU or represented by someone who is, apart from occasional declarations the customs office accepts. It also needs an EORI number, requested in the first Member State it exports to.',
    },
    {
      q: 'Is the commercial invoice for Germany different from other EU countries?',
      a: 'Germany applies the EU’s customs rules and common customs tariff, so a German broker looks for what brokers across the EU need: descriptions precise enough for the TARIC code, the price actually paid, the parties with the importer’s EORI, and the Incoterms® rule.',
    },
  ],
  sources: [
    'c6-zoll-release-free-circulation',
    'trade-gov-ccg-de',
    'trade-gov-ccg-eu',
    'c6-zoll-eori',
    'c6-zoll-entry-summary',
    'c6-zoll-normal-clearance',
    'c6-zoll-customs-value',
    'trade-gov-commercial-invoice',
  ],
  regulated: true,
  review: null,
  tool: '/tools/invoice-generator',
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default country;
