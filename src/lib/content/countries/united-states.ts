import type { CountryPage } from '@/lib/content/country';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google UK, 2026-10-07): "shipping to usa from uk" 880, KD 4.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave B. The seller's view of a U.S.
 * import, written for a UK or other foreign exporter; the importer's view is the guide
 * /guides/how-to-import-into-the-us. Every fact below comes from CBP's regulations and pages,
 * the USDA wood packaging rule or GOV.UK. There is no ITA country commercial guide for the
 * United States, so the page cites CBP and eCFR sources instead. No duty or tax rates and no
 * de minimis figures, by design.
 */
const country: CountryPage = {
  slug: 'united-states',
  name: 'United States',
  iso2: 'US',
  customsUnion: null,
  demand: [
    {
      keyword: 'shipping to usa from uk',
      market: 'UK',
      volume: 880,
      kd: 4,
      dataFile: '06-labs-keyword-overview-uk-candidates.json',
    },
  ],
  metaTitle: 'US export documents: invoice, entry and ISF',
  description:
    'What a UK or other foreign seller supplies for a U.S. import: a commercial invoice to CBP’s rules, a packing list, the ISF data for sea freight and origin marking.',
  answer:
    'A shipment to the United States is cleared on an entry the importer of record or its customs broker files with CBP. You supply a commercial invoice in English with the details 19 CFR 141.86 lists, a packing list, the transport document and, for sea freight, the data the importer needs for its Importer Security Filing.',
  lede: 'The seller’s side of a U.S. import, for an exporter in the UK or elsewhere: what CBP expects your documents to show and what your American buyer files. Each line carries its official source. It states no duty or tax rates, and the importer’s customs broker has the last word on a particular shipment.',
  customsAuthority: {
    name: 'U.S. Customs and Border Protection (CBP)',
    url: 'https://www.cbp.gov/',
    sourceId: 'b7-cbp-basic-import-export',
  },
  documents: [
    {
      document: 'Entry (CBP Form 3461 or its electronic equivalent)',
      status: 'required',
      condition:
        'Filed by the importer of record or its licensed customs broker, with evidence of the right to make entry and the other documents CBP or other agencies require.',
      sourceId: 'a3-ecfr-19-cfr-142-3',
    },
    {
      document: 'Commercial invoice, in English',
      status: 'required',
      condition:
        'Part of the entry documents; it must carry the information 19 CFR 141.86 lists, or come with an accurate English translation.',
      sourceId: 'a2-cornell-19-cfr-141-86',
      tool: '/tools/invoice-generator',
    },
    {
      document: 'Packing list',
      status: 'conditional',
      condition: 'Included with the entry where appropriate, so CBP can see what each package contains.',
      sourceId: 'a3-ecfr-19-cfr-142-3',
      tool: '/tools/packing-list-generator',
    },
    {
      document: 'Importer Security Filing (ISF) data',
      status: 'conditional',
      condition:
        'For cargo arriving by vessel: the ISF importer submits it no later than 24 hours before the cargo is laden aboard the vessel at the foreign port, so it needs your details early.',
      sourceId: 'a1-cornell-19-cfr-149-2',
    },
    {
      document: 'Country of origin marking on the goods',
      status: 'required',
      condition:
        'Every article of foreign origin, or its container, marked legibly, indelibly and permanently with the English name of the country of origin, unless an exception applies.',
      sourceId: 'a1-cornell-19-cfr-134-11',
    },
    {
      document: 'UK export declaration',
      status: 'required',
      condition:
        'On the UK side, an export declaration clears the goods out of UK customs, made by you or by someone you hire, using a GB EORI number.',
      sourceId: 'b7-gov-uk-export-goods',
    },
  ],
  invoiceRequirements: [
    {
      text: 'The invoice and all attachments must be in English, or come with an accurate English translation detailed enough to examine the goods and assess duties.',
      sourceId: 'a2-cornell-19-cfr-141-86',
    },
    {
      text: 'It names the port of entry and gives a detailed description of the goods, with the marks and numbers of the packages and the quantities in the weights and measures of the country of export or of the United States.',
      sourceId: 'a2-cornell-19-cfr-141-86',
    },
    {
      text: 'It states the purchase price of each item in the currency of the sale, itemises the charges on the goods by name and amount, and identifies the country of origin.',
      sourceId: 'us-cbp-invoice-contents',
    },
    {
      text: 'It states in adequate detail what merchandise each individual package contains, which is why a matching packing list matters.',
      sourceId: 'a2-cornell-19-cfr-141-86',
    },
  ],
  importerIdentifiers: [
    {
      name: 'Importer number',
      whoNeedsIt:
        'The importer of record. CBP entry forms ask for its IRS business registration number, or a Social Security number, or a CBP-assigned number requested on CBP Form 5106.',
      sourceId: 'a4-cbp-importer-tips',
    },
    {
      name: 'Resident agent and bond for a nonresident importer',
      whoNeedsIt:
        'A foreign company acting as importer of record, for example on a DDP sale. It needs a resident agent authorised to accept service of process and a bond with a resident corporate surety.',
      sourceId: 'a5-cfr-19-141-18',
    },
    {
      name: 'EORI number starting with GB',
      whoNeedsIt: 'The UK exporter, to export goods from England, Wales or Scotland.',
      sourceId: 'b7-gov-uk-export-goods',
    },
  ],
  valuationBasis: { basis: 'FOB', sourceId: 'w2-cornell-19-usc-1401a' },
  incotermsNotes: [
    {
      text: 'The importer of record is the owner or purchaser of the goods, or a licensed customs broker it designates, and must use reasonable care to declare value, classification and rate of duty. Under DAP or an earlier rule that is normally your U.S. buyer.',
      sourceId: 'a5-usc-19-1484',
    },
    {
      text: 'On a DDP sale you take that role yourself. As a nonresident corporation you then need a resident agent for service of process and a bond with a resident corporate surety before you can make entry.',
      sourceId: 'a5-cfr-19-141-18',
    },
    {
      text: 'Whoever is importer of record stays ultimately responsible for the entry documentation and all duties, taxes and fees, even when a licensed broker files the entry.',
      sourceId: 'w2-cbp-importer-tips',
    },
  ],
  controlledGoods: null,
  packaging: { ispm15: true, sourceId: 'b7-cfr-7-319-40-3' },
  lowValueThreshold: null,
  sections: [
    {
      heading: 'Who files what when you ship to the United States?',
      paragraphs: [
        'Two declarations bracket the journey. In the UK you, or an agent you hire, make the export declaration with a GB EORI number. In the United States the importer of record, usually your buyer and usually through a licensed customs broker, files the entry with CBP from the documents you send: the commercial invoice, the packing list and the transport document.',
        'For sea freight there is a third filing that runs ahead of both. The Importer Security Filing has to reach CBP no later than 24 hours before the container is loaded at the foreign port, so your buyer’s broker will ask for the shipment details while it is still being booked.',
      ],
    },
    {
      heading: 'What must the commercial invoice for the US show?',
      paragraphs: [
        'U.S. rules are specific. Under 19 CFR 141.86 the invoice states the port of entry, when, where and between whom the goods were sold, a detailed description with the marks and numbers of the packages, quantities, the purchase price of each item in the currency of the sale, every charge on the goods itemised by name and amount, and the country of origin. It must be in English or carry an accurate translation.',
        'One rule surprises UK sellers: the invoice must say what each individual package contains. A packing list that matches the invoice line for line, carton by carton, is the simplest way to meet it.',
        'Values follow the U.S. transaction value, which is the price actually paid or payable without international freight and insurance. If you sell CIF or DDP, show freight and insurance separately so the broker can take them out.',
      ],
    },
    {
      heading: 'Do the goods themselves need marking?',
      paragraphs: [
        'Usually, yes. Every article of foreign origin, or its container, must be marked legibly, indelibly and permanently with the English name of its country of origin, subject to listed exceptions. Agree with the buyer whether the mark goes on the product, the retail pack or the outer carton before the goods are packed.',
        'Wooden packaging has its own rule. U.S. plant health regulations require regulated wood packaging material to be treated under an approved method and to carry the IPPC mark on each article, and unmarked pallets or crates can be ordered re-exported at the port of arrival.',
      ],
    },
    {
      heading: 'What should I ask my US buyer before shipping?',
      paragraphs: [
        'Settle four things first: who is importer of record and which customs broker files for them; whether the shipment goes by sea, so you know to send the ISF details early; how the goods and cartons should be marked with the country of origin; and which Incoterms® rule the sale uses, because on DDP the import obligations become yours.',
      ],
    },
    {
      heading: 'Where do duty and tariff figures come from?',
      paragraphs: [
        'From the Harmonized Tariff Schedule and the importer’s broker. U.S. duty depends on classification and origin, and the rates change. TradeDocs states no rates here, and the landed cost calculator works from the figures you enter rather than a lookup.',
      ],
    },
  ],
  faq: [
    {
      q: 'Does a commercial invoice for the US have to be in English?',
      a: 'Yes, or it must come with an accurate English translation. Under 19 CFR 141.86 the invoice and all attachments must be in English, with enough detail for CBP to examine the goods and assess duties.',
    },
    {
      q: 'Can a UK company be importer of record in the US?',
      a: 'Yes. A nonresident corporation can make entry if it has a resident agent authorised to accept service of process and a bond with a resident corporate surety, and it then takes on the importer of record’s responsibilities.',
    },
    {
      q: 'What is the ISF and who files it?',
      a: 'The Importer Security Filing is advance data on vessel cargo bound for the United States. The ISF importer, usually the buyer or its broker, submits it no later than 24 hours before the cargo is laden aboard the vessel at the foreign port.',
    },
    {
      q: 'Do I need an EORI number to ship to the US from the UK?',
      a: 'Yes. You need an EORI number that starts with GB to export goods from England, Wales or Scotland, whether you make the export declaration yourself or hire someone to do it.',
    },
  ],
  sources: [
    'b7-cbp-basic-import-export',
    'a3-ecfr-19-cfr-142-3',
    'a2-cornell-19-cfr-141-86',
    'us-cbp-invoice-contents',
    'a1-cornell-19-cfr-149-2',
    'a1-cornell-19-cfr-134-11',
    'a4-cbp-importer-tips',
    'w2-cbp-importer-tips',
    'a5-usc-19-1484',
    'a5-cfr-19-141-18',
    'w2-cornell-19-usc-1401a',
    'b7-cfr-7-319-40-3',
    'b7-gov-uk-export-goods',
  ],
  regulated: true,
  review: null,
  tool: '/tools/invoice-generator',
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default country;
