import type { CountryPage } from '@/lib/content/country';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, 2026-10-07): "shipping to australia from us" 390, KD 14 (Google US);
 * "australia customs" 390, KD 27 (Google US); "shipping to australia from uk" 390, KD 12
 * (Google UK); "australia import tax" 110.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave B. Every fact below comes from the
 * source named beside it, mainly the Australian Border Force; there are no duty or tax rates or
 * value thresholds on this page by design. Biosecurity and timber packaging are left out:
 * the Department of Agriculture's pages could not be opened on the retrieval date.
 */
const country: CountryPage = {
  slug: 'australia',
  name: 'Australia',
  iso2: 'AU',
  customsUnion: null,
  demand: [
    {
      keyword: 'shipping to australia from us',
      market: 'US',
      volume: 390,
      kd: 14,
      dataFile: '02-labs-keyword-overview-us-countries.json',
    },
    {
      keyword: 'australia customs',
      market: 'US',
      volume: 390,
      kd: 27,
      dataFile: '05-labs-keyword-overview-us-posts-countries-2.json',
    },
    {
      keyword: 'shipping to australia from uk',
      market: 'UK',
      volume: 390,
      kd: 12,
      dataFile: '06-labs-keyword-overview-uk-candidates.json',
    },
  ],
  metaTitle: 'Australia export documents: invoice and N10',
  description:
    'The documents a shipment to Australia needs: the importer’s declaration in the Integrated Cargo System, your commercial invoice, the bill of lading or air waybill, and any permits.',
  answer:
    'A shipment to Australia is cleared by the Australian importer, or its licensed customs broker, on an Import Declaration or Self-Assessed Clearance declaration lodged with the Australian Border Force. It is supported by your commercial invoice, the bill of lading or air waybill, a packing list, and a permit if the goods are restricted.',
  lede: 'What the exporter supplies and what the Australian importer lodges, line by line, with the official source for each: the Australian Border Force and the U.S. government’s Australia guide. It covers paperwork only. It states no duty or tax rates and no value thresholds, and the importer’s customs broker decides what a particular shipment needs.',
  customsAuthority: {
    name: 'Australian Border Force (ABF)',
    url: 'https://www.abf.gov.au/',
    sourceId: 'b7-abf-import-declarations',
  },
  documents: [
    {
      document: 'Import Declaration (N10) or Self-Assessed Clearance declaration',
      status: 'required',
      condition:
        'Lodged by the importer or its licensed customs broker in the Integrated Cargo System, or at an ABF counter, to clear the goods into home consumption. Which one applies depends on the consignment.',
      sourceId: 'b7-abf-import-declarations',
    },
    {
      document: 'Commercial invoice',
      status: 'required',
      condition:
        'No special form is required; a normal commercial invoice is accepted. Much of the customs value is taken from it.',
      sourceId: 'trade-gov-ccg-au',
      tool: '/tools/invoice-generator',
    },
    {
      document: 'Bill of lading or air waybill',
      status: 'required',
      condition: 'The transport document, part of the minimum documentation for customs clearance.',
      sourceId: 'trade-gov-ccg-au',
    },
    {
      document: 'Packing list',
      status: 'typical',
      condition:
        'Itemises each package with weights and measurements; the forwarder uses it for freight and customs can use it to check a particular package.',
      sourceId: 'a2-trade-gov-packing-list',
      tool: '/tools/packing-list-generator',
    },
    {
      document: 'Permit from the responsible agency',
      status: 'conditional',
      condition:
        'For prohibited or restricted goods: the importer must get permission from the relevant government department or agency and give the ABF proof of it.',
      sourceId: 'b7-abf-import-declarations',
    },
  ],
  invoiceRequirements: [
    {
      text: 'Australian customs does not require a special invoice form: normal commercial invoices, bills of lading and receipts are accepted.',
      sourceId: 'trade-gov-ccg-au',
    },
    {
      text: 'The documents should show the invoice terms, such as FOB or CIF, the seller’s name and address, the currency of the invoice and the country of origin of the goods.',
      sourceId: 'trade-gov-ccg-au',
    },
    {
      text: 'The ABF generally starts from the FOB value, excluding overseas transport and insurance, and adjusts it according to the invoice terms, so on a CIF or delivered sale show freight and insurance as separate amounts.',
      sourceId: 'b7-abf-customs-value',
    },
  ],
  importerIdentifiers: [
    {
      name: 'ABN (Australian Business Number)',
      whoNeedsIt:
        'The importer. Its details, such as its ABN, go on the declaration that clears the goods.',
      sourceId: 'b7-abf-import-declarations',
    },
    {
      name: 'Licensed customs broker',
      whoNeedsIt:
        'Optional, but the ABF encourages first-time and infrequent importers to use one. Brokers lodge declarations on the importer’s behalf.',
      sourceId: 'b7-abf-import-declarations',
    },
  ],
  valuationBasis: { basis: 'FOB', sourceId: 'b7-abf-customs-value' },
  incotermsNotes: [
    {
      text: 'The Australian Border Force has sole jurisdiction to clear imports, and local importers are responsible for formal clearance. Under DDP the seller takes on that role, so it needs a party able to act as importer in Australia; under DAP or an earlier rule the buyer imports.',
      sourceId: 'trade-gov-ccg-au',
    },
    {
      text: 'Customs itself does not require import licences, but importers may need permits from other agencies to clear the goods. Ask the buyer to confirm before shipping whether any permit applies.',
      sourceId: 'trade-gov-ccg-au',
    },
    {
      text: 'After a declaration is made, the importer must keep all relevant documents for five years, so the buyer will want a clean final copy of your invoice and packing list.',
      sourceId: 'b7-abf-import-declarations',
    },
  ],
  controlledGoods: null,
  packaging: null,
  lowValueThreshold: null,
  sections: [
    {
      heading: 'Who lodges what with the Australian Border Force?',
      paragraphs: [
        'The importer, or a licensed customs broker acting for it, lodges the declaration. The ABF describes an Import Declaration as a statement about the goods, the importer, how the goods are transported, and their tariff classification and customs value, made in the Integrated Cargo System or on paper at an ABF counter. Duties, taxes and charges due have to be paid before the goods are released.',
        'Your job as the seller is to give the importer documents that declaration can be built from: an invoice that values and describes each line, a transport document, and a packing list that matches the invoice carton for carton.',
      ],
    },
    {
      heading: 'What should the commercial invoice for Australia show?',
      paragraphs: [
        'Australia is relaxed about form and strict about content. There is no prescribed layout, but the documents should show the terms of sale, the seller’s name and address, the invoice currency and the country of origin. Add the full buyer details, a description precise enough to classify, quantities, and unit and total values.',
        'Valuation is where the terms matter. The ABF generally works from the FOB value of the goods, which leaves out overseas transport and insurance, and then includes or excludes other charges depending on the invoice terms. If you sell CIF or deliver to the door, itemise freight and insurance on the invoice so the importer’s broker can take them out cleanly.',
      ],
    },
    {
      heading: 'What should I ask my Australian buyer before shipping?',
      paragraphs: [
        'Four questions settle most first shipments: will the buyer clear the goods itself or through a licensed customs broker, and who is it; does the product need a permit from any government agency; which declaration the broker expects to lodge; and which Incoterms® rule the sale is on, so it is clear who imports.',
        'If your goods travel in wooden crates or on wooden pallets, also ask what the buyer’s broker needs to know about the timber: the ABF’s declaration process provides for referring goods to the Department of Agriculture, Fisheries and Forestry (DAFF) where there are quarantine considerations.',
        'Keep the answers with the buyer’s record. The importer has to retain the declaration documents for five years, so sending one final, consistent set of invoice, packing list and transport document saves both sides a correction later.',
      ],
    },
    {
      heading: 'Where do duty, GST and thresholds come from?',
      paragraphs: [
        'From the ABF and the importer’s broker, at the time of import. Whether duty applies depends on the tariff classification, the origin and any concession, and the value lines and charges change. TradeDocs states no rates or thresholds here so that an old figure never ends up in your quotation.',
      ],
    },
  ],
  faq: [
    {
      q: 'Does Australia require a special commercial invoice?',
      a: 'No. Australian customs accepts a normal commercial invoice. It should show the terms of sale (such as FOB or CIF), the seller’s name and address, the invoice currency and the country of origin of the goods.',
    },
    {
      q: 'Is Australian customs value FOB or CIF?',
      a: 'FOB, generally. The Australian Border Force usually starts from the free on board value, excluding overseas transport and insurance, and adjusts for the invoice terms under the Customs Act 1901.',
    },
    {
      q: 'Does the buyer need a customs broker?',
      a: 'Not by law. The importer can lodge its own declaration, but the ABF encourages first-time and infrequent importers to use a licensed customs broker.',
    },
    {
      q: 'Can I sell DDP to Australia?',
      a: 'Only with a party in Australia able to act as importer, because local importers are responsible for formal clearance with the Australian Border Force. Otherwise sell on DAP or an earlier rule and let the buyer import.',
    },
  ],
  sources: ['b7-abf-import-declarations', 'trade-gov-ccg-au', 'b7-abf-customs-value', 'a2-trade-gov-packing-list'],
  regulated: true,
  review: null,
  tool: '/tools/invoice-generator',
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default country;
