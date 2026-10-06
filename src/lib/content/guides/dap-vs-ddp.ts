import { BYLINE, type ContentArticle } from '@/lib/content/article';

const CONTENT_ROUND = '2026-10-05';
const GEO_ROUND = '2026-10-06';

/**
 * Demand (DataForSEO, Google US, 2026-10-05): "dap vs ddp" 1,900.
 */
const article: ContentArticle = {
  slug: 'dap-vs-ddp',
  title: 'DAP vs DDP: who clears the goods into the destination country?',
  metaTitle: 'DAP vs DDP in Incoterms 2020: the difference',
  description:
    'DAP and DDP both deliver to the buyer’s named place. The difference is import clearance, duties and taxes. What each rule puts on the seller and the buyer, with the traps in each.',
  lede: 'Two delivered rules that look almost the same on a quotation. The seller carries the goods all the way to the buyer under both. The difference is who deals with customs on arrival, and who pays what customs asks for.',
  answer:
    'Under DAP (Delivered at Place) the seller delivers to the named destination and the buyer clears the goods for import and pays the import duties and taxes. Under DDP (Delivered Duty Paid) the seller does that too: it clears the goods for import and pays the duties and taxes, so the buyer pays only the agreed price.',
  keyFacts: [
    'DAP and DDP are both delivered rules in the Incoterms® 2020 set, published by the ICC.',
    'Under DAP the buyer clears the goods for import and pays import duty and taxes.',
    'Under DDP the seller clears the goods for import and pays import duty and taxes.',
    'Under both rules the buyer unloads; DPU is the only Incoterms® rule that puts unloading on the seller.',
    'Neither DAP nor DDP obliges either party to insure the goods.',
  ],
  definitions: [
    {
      term: 'DAP (Delivered at Place)',
      meaning:
        'The seller delivers to the named place, ready for unloading; the buyer clears import.',
    },
    {
      term: 'DDP (Delivered Duty Paid)',
      meaning:
        'As DAP, but the seller also clears the goods for import and pays the duties and taxes.',
    },
    {
      term: 'Import clearance',
      meaning:
        'Lodging the import declaration and paying what customs assesses, so the goods are released.',
    },
  ],
  published: CONTENT_ROUND,
  updated: GEO_ROUND,
  reviewed: GEO_ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What do DAP and DDP have in common?',
      paragraphs: [
        'Both are delivered rules in the Incoterms® 2020 set, and both work for any mode of transport. The seller contracts and pays for carriage to the named destination and clears the goods for export. Risk stays with the seller for the whole journey and passes at the named place, when the goods are put at the buyer’s disposal on the arriving vehicle, ready for unloading.',
        'In both, the buyer unloads. Neither rule obliges anyone to insure, although the seller carries the risk until delivery, so insuring is usually in its own interest. If the seller is meant to unload, the rule you want is DPU, which is the only Incoterms® rule that puts unloading on the seller.',
      ],
      table: {
        caption: 'DAP and DDP compared',
        head: ['Obligation', 'DAP', 'DDP'],
        rows: [
          ['Carriage to the named place', 'Seller', 'Seller'],
          ['Export clearance', 'Seller', 'Seller'],
          [
            'Risk passes',
            'At the named place, ready for unloading',
            'At the named place, ready for unloading, cleared for import',
          ],
          ['Unloading at destination', 'Buyer', 'Buyer'],
          ['Import clearance', 'Buyer', 'Seller'],
          ['Import duty and taxes', 'Buyer', 'Seller'],
          ['Insurance', 'Not required of either party', 'Not required of either party'],
        ],
      },
    },
    {
      heading: 'What is the difference between DAP and DDP?',
      paragraphs: [
        'Import clearance. Under DAP the buyer lodges the import declaration in its own country and pays whatever duty and import taxes are due. Under DDP the seller takes on both, in a country where it may have no establishment, which makes DDP the maximum obligation a seller can accept under the eleven rules.',
        'That shifts more than a fee. The party clearing the goods has to be able to act as the importer, or appoint someone who can, has to know the classification and value the goods will be declared at, and carries the cost if the duty turns out higher than expected.',
      ],
    },
    {
      heading: 'What can go wrong under DDP?',
      paragraphs: [
        'The usual failure is a seller quoting DDP before checking that it can import into the destination at all. Some countries let a foreign company act as importer only through a registration or a local representative, and some do not allow it for certain goods. Settle how the import will be lodged, and by whom, before the price is agreed.',
        'The second is tax. The duties and taxes due on import normally include import VAT or its local equivalent. Under DDP the seller pays it, and whether a foreign seller can recover that tax depends on the destination country’s rules. If it cannot, the tax becomes a cost the seller did not price in. Some contracts use DDP with an agreed exclusion, such as VAT unpaid; if you do, write the exclusion into the contract rather than relying on the three letters.',
      ],
    },
    {
      heading: 'What can go wrong under DAP?',
      paragraphs: [
        'Under DAP the trap is on the buyer’s side. If the buyer does not clear the goods for import, or is late doing it, and the goods are held at a port or terminal as a result, the extra risk and costs of the hold-up fall on the buyer, demurrage and storage included. A buyer agreeing DAP should have its broker lined up before the goods arrive.',
        'The other common problem is naming a destination the goods cannot reach until they are cleared, such as a buyer’s site inland when the goods will stop at the border for clearance. Agree what happens while they wait, or name the place where clearance actually happens.',
      ],
    },
    {
      heading: 'How should the named place be written?',
      paragraphs: [
        'Both rules deliver at a named place, and risk passes there, so the place carries more weight than the three letters. “DAP Germany” tells neither party where the seller’s responsibility ends; “DAP Hamburg, buyer’s warehouse” with its street address does. Name a point the carrier can actually reach, and agree who pays any charges at that point, such as a terminal handling fee, before the goods arrive. The more precise the place, the fewer costs fall into the gap between the two parties.',
      ],
    },
    {
      heading: 'Should I quote DAP or DDP?',
      paragraphs: [
        'DAP is the safer default for most exporters: the seller controls the journey it can control, and the buyer, who knows its own customs, clears the goods. DDP makes sense when the seller can genuinely import at the destination, through its own registration or an agent, and when the buyer needs one landed price with nothing more to pay, as with samples or sales to customers who cannot clear goods themselves.',
        'Whichever you choose, quote the rule with its place and its version, such as “DAP Oslo, buyer’s site, Incoterms® 2020”, and put the same wording on the commercial invoice. If you quote DDP, estimate the duty and taxes before you set the price; a landed cost estimate with the rates your broker gives you shows how much of the price customs will take.',
      ],
    },
  ],
  faq: [
    {
      q: 'What is the difference between DAP and DDP?',
      a: 'Import clearance. Under DAP the buyer clears the goods for import and pays the duty and import taxes; under DDP the seller does both. Delivery, risk and unloading are otherwise the same.',
    },
    {
      q: 'Who pays import VAT under DDP?',
      a: 'The seller, as part of the duties and taxes due on import, unless the contract excludes it. Whether the seller can recover that VAT depends on the destination country’s rules.',
    },
    {
      q: 'Who unloads the goods under DAP and DDP?',
      a: 'The buyer, under both. The seller delivers the goods ready for unloading. DPU is the rule that obliges the seller to unload.',
    },
    {
      q: 'Is DDP better for the buyer?',
      a: 'It is simpler for the buyer, who pays one agreed price. It only works if the seller can import into the buyer’s country, and the seller will price the duty, taxes and that effort into the quotation.',
    },
  ],
  sources: ['icc-incoterms-2020', 'trade-gov-commercial-invoice'],
  primaryTool: '/tools/landed-cost-calculator',
  callout: {
    afterSection: 2,
    tool: '/tools/landed-cost-calculator',
    title: 'Quoting DDP? Estimate the duty first',
    text: 'Enter the goods value, freight, insurance and the duty and tax rates your broker gives you, and the landed cost calculator shows the total and the cost per unit.',
  },
  tools: ['/tools/incoterms', '/tools/landed-cost-calculator', '/tools/invoice-generator'],
  cover: {
    id: 'crHhZlES310',
    src: 'https://images.unsplash.com/photo-1601467995997-ac1ae9a8fff4',
    width: 5900,
    height: 3933,
    alt: 'White delivery truck parked at a building at the end of a delivered shipment',
    caption: 'White delivery truck parked at a building',
    photographer: { name: 'Maxim Tolchinskiy', profile: 'https://unsplash.com/@shaikhulud' },
    page: 'https://unsplash.com/photos/crHhZlES310',
  },
};

export default article;
