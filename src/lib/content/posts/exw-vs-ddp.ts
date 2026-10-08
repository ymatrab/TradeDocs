import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "exw vs ddp" 110; "ddp vs exw" 90.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave C (v2 #27: the two extremes compared
 * on one table).
 */
const article: ContentArticle = {
  slug: 'exw-vs-ddp',
  title: 'EXW vs DDP: the two extremes of the Incoterms® rules',
  metaTitle: 'EXW vs DDP: the difference in Incoterms 2020',
  description:
    'EXW puts almost every task on the buyer; DDP puts almost every task on the seller. Loading, clearance, freight, duties and risk under each rule, on one table.',
  lede: 'EXW and DDP sit at the two ends of the Incoterms® rules. Under one, the buyer collects the goods from your premises and does everything else. Under the other, you deliver to the buyer’s door with the import duties already paid. Most trade happens somewhere in between, for good reasons.',
  answer:
    'Under EXW (Ex Works) the seller makes the goods available at its own premises, not loaded and not cleared for export, and the buyer does everything else. Under DDP (Delivered Duty Paid) the seller delivers to the buyer’s named place, clears the goods for export and import, and pays the import duties and taxes.',
  keyFacts: [
    'EXW and DDP are two of the eleven Incoterms® 2020 rules published by the International Chamber of Commerce (ICC).',
    'Both EXW and DDP can be used for any mode of transport, according to the International Trade Administration.',
    'Under EXW the seller does not load the goods or clear them for export, according to HMRC’s summary of the rules.',
    'Under DDP the seller clears the goods for export and import and pays the duties for both, according to HMRC.',
    'HMRC states that the Incoterm used does not restrict the customs valuation method; DDP goods can be valued on transaction value.',
  ],
  definitions: [
    {
      term: 'EXW (Ex Works)',
      meaning:
        'The seller places the goods at the buyer’s disposal at its premises or another named place, not loaded and not cleared for export.',
    },
    {
      term: 'DDP (Delivered Duty Paid)',
      meaning:
        'The seller delivers the goods cleared for import, ready for unloading at the named destination, with duties and taxes paid.',
    },
    {
      term: 'Export clearance',
      meaning:
        'The export declaration and any licence the country of export requires before the goods leave.',
    },
    {
      term: 'Importer of record',
      meaning:
        'The party responsible to the importing country’s customs for the entry and the duties owed.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What do EXW and DDP mean?',
      paragraphs: [
        'Both are rules in the ICC’s Incoterms® 2020 set, and both can be used for any mode of transport. They mark the two ends of the range of obligations a seller can take on.',
        'EXW, Ex Works, means the seller places the goods at the buyer’s disposal at its premises or another named place. HMRC’s summary of the rules notes that the seller does not load the goods on the collecting vehicle and does not clear them for export. From that moment the buyer bears the costs and risks.',
        'DDP, Delivered Duty Paid, means the seller delivers the goods cleared for import, ready for unloading at the named destination, and bears all the costs and risks of getting them there. HMRC’s summary states that the seller must clear the goods for export and import, pay the duties for both and complete all customs formalities.',
      ],
    },
    {
      heading: 'How do EXW and DDP compare?',
      paragraphs: ['Every line of the table falls the opposite way, except unloading at the end.'],
      table: {
        caption: 'EXW and DDP compared under Incoterms® 2020',
        head: ['', 'EXW (Ex Works)', 'DDP (Delivered Duty Paid)'],
        rows: [
          ['Transport modes', 'Any', 'Any'],
          [
            'Named place',
            'Seller’s premises or another place in its country',
            'Destination in the buyer’s country',
          ],
          ['Loading at origin', 'Buyer', 'Seller'],
          ['Export clearance', 'Buyer', 'Seller'],
          ['Main carriage', 'Buyer contracts and pays', 'Seller contracts and pays'],
          ['Risk passes', 'When goods are at the buyer’s disposal', 'On arrival, cleared for import'],
          ['Import clearance', 'Buyer', 'Seller'],
          ['Import duties and taxes', 'Buyer', 'Seller'],
          ['Unloading at destination', 'Buyer', 'Buyer'],
          ['Insurance', 'Not required of either party', 'Not required of either party'],
        ],
      },
    },
    {
      heading: 'Why is EXW risky for an exporter?',
      paragraphs: [
        'EXW looks simple, but the buyer, who may be abroad, becomes responsible for an export from your country. The seller often still has to help: in the US, the Foreign Trade Regulations at 15 CFR 30.3 set out a routed export transaction, in which the foreign buyer’s agent files the export information but the US seller must still give that agent the details it needs.',
        'Loading is the other trap. Under EXW the buyer’s carrier loads the goods at your premises, yet in practice your forklift and staff often do it. If something is damaged during that loading, the rule puts the risk on the buyer, which can lead to a dispute about who caused it.',
        'If you would load the goods and clear them for export anyway, FCA at your premises describes what actually happens. The EXW vs FCA article walks through that switch.',
      ],
    },
    {
      heading: 'Why is DDP risky for an exporter?',
      paragraphs: [
        'DDP makes you responsible for an import in a country where you may have no presence. You, or a customs broker acting for you, must clear the goods and pay the duties and taxes the importing country assesses.',
        'Taxes are the part sellers underestimate. Import VAT or sales tax is often charged on top of duty, and recovering it may require a local registration. In the UK, for example, GOV.UK states that a business based outside the UK that supplies goods in the UK must register for VAT whatever its turnover. Check the importing country’s rules before you quote DDP.',
        'Your price also has to absorb every cost to the buyer’s door, including duty you cannot know exactly until the goods are classified and valued at entry. The landed cost calculator helps you estimate those amounts before you commit to a price.',
      ],
    },
    {
      heading: 'How does each rule change the invoice?',
      paragraphs: [
        'An EXW invoice shows the price of the goods at your premises. A DDP invoice shows a price that also covers export clearance, freight, insurance if you buy it, import clearance and the duties and taxes.',
        'HMRC notes that the Incoterm does not restrict the valuation method, and that goods delivered duty paid can still be valued on transaction value. Customs then works out the dutiable amount from the costs you show. In the US, 19 U.S.C. § 1401a excludes international freight and insurance from the price actually paid, and 19 CFR 141.86 asks the invoice to itemise charges such as freight and insurance. Listing freight, insurance and duties as separate lines on a DDP invoice keeps the declared value clear.',
      ],
    },
    {
      heading: 'When should you choose EXW or DDP?',
      paragraphs: [
        'Choose by who can actually perform each task, not by who wants the simplest quotation. A short decision path:',
      ],
      steps: [
        'If the buyer has a forwarder in your country that will collect, clear for export and ship, EXW can work; if you will load or clear, quote FCA instead.',
        'If the buyer wants a delivered price but can handle import clearance, quote DAP rather than DDP.',
        'Quote DDP only when you, or a broker acting for you, can act as importer in the destination country and you know the duties and taxes due.',
        'Write the rule, the named place and “Incoterms® 2020” on the quotation, proforma and commercial invoice, for example “EXW Leeds, seller’s warehouse, Incoterms® 2020” (an invented example).',
      ],
    },
  ],
  faq: [
    {
      q: 'Is EXW cheaper than DDP?',
      a: 'The EXW price is lower because it covers less, but the total cost of getting the goods to the buyer is not removed; the buyer pays it instead. Compare quotes on the total landed cost, not the invoice price alone.',
    },
    {
      q: 'Who is the importer under DDP?',
      a: 'The seller takes on import clearance under DDP, so it, or a broker acting for it, must be able to act as importer in the destination country. Whether a foreign seller can do that depends on that country’s customs rules.',
    },
    {
      q: 'What is between EXW and DDP?',
      a: 'Nine other Incoterms® 2020 rules. FCA moves export clearance and loading at your premises to the seller; DAP delivers to the buyer’s door but leaves import clearance and duties with the buyer.',
    },
    {
      q: 'Does DDP include VAT?',
      a: 'Under DDP the seller pays the import duties and taxes, which normally include import VAT or sales tax. The parties can agree otherwise in the contract, and should write any exception next to the rule.',
    },
  ],
  sources: [
    'c3-icc-incoterms-2020',
    'c3-hmrc-incoterms',
    'c3-ita-know-your-incoterms',
    'c3-usc-19-1401a',
    'c3-cornell-19-cfr-141-86',
    'w1-ecfr-15-cfr-30-3',
    'w1-gov-uk-register-for-vat',
  ],
  primaryTool: '/tools/incoterms',
  tools: ['/tools/incoterms', '/tools/landed-cost-calculator', '/tools/invoice-generator'],
  callout: {
    afterSection: 3,
    tool: '/tools/landed-cost-calculator',
    title: 'Estimate the cost of a DDP quote',
    text: 'Add freight, insurance, duty and import tax to your goods value and see the landed total before you commit to a delivered-duty-paid price.',
  },
  related: [
    '/blog/exw-vs-fca',
    '/guides/dap-vs-ddp',
    '/blog/ddp-vs-ddu',
    '/blog/exw-vs-fob',
    '/blog/fob-vs-ddp',
    '/guides/importer-of-record',
  ],
  cover: {
    id: 'C87x5s-oPUY',
    src: 'https://images.unsplash.com/photo-1784462373256-bf6c1f27f00f',
    width: 7258,
    height: 4839,
    alt: 'Wooden crates stacked in a warehouse by an open door, ready for collection under EXW',
    caption: 'Stacked wooden crates in a warehouse with an open doorway',
    photographer: { name: 'Mat', profile: 'https://unsplash.com/@mathelot' },
    page: 'https://unsplash.com/photos/stacked-wooden-crates-in-a-warehouse-with-an-open-doorway-C87x5s-oPUY',
  },
};

export default article;
