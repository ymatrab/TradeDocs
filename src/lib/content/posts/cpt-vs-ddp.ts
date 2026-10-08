import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-09';

/**
 * Demand (DataForSEO, Google US, 2026-10-08, file 12): "cpt vs ddp" 50; a competitor's combined
 * comparison ranks 4, so a standalone page earns the query.
 * Plan: docs/research/content-plan-v4-2026-10-08.md, wave E, group 2 (comparison).
 */
const article: ContentArticle = {
  slug: 'cpt-vs-ddp',
  title: 'CPT vs DDP: you pay the freight under both, so who carries the risk?',
  metaTitle: 'CPT vs DDP: freight, risk and import duty',
  description:
    'Under CPT and DDP the seller pays the carriage to the destination, but CPT passes risk at the first carrier and leaves import clearance to the buyer. The difference, side by side.',
  lede: 'CPT and DDP look alike on a freight invoice: in both cases you book the transport and pay it to the buyer’s country. They split apart on two questions the freight bill does not answer, which are whose loss it is when goods go missing on the way and who deals with customs on arrival.',
  answer:
    'Under CPT (Carriage Paid To) the seller pays the carriage to the named destination, but risk passes to the buyer when the goods are handed to the first carrier, and the buyer clears them for import. Under DDP (Delivered Duty Paid) the seller also carries the risk to the destination, clears the goods for import and pays the duties.',
  keyFacts: [
    'CPT and DDP are two of the eleven Incoterms® 2020 rules published by the International Chamber of Commerce (ICC).',
    'The International Trade Administration lists CPT and DDP among the seven Incoterms® 2020 rules for any mode of transport.',
    'HMRC describes CPT as the seller handing the goods to a carrier and paying the transport to the named destination.',
    'Under DDP, according to HMRC, the seller bears all costs and risks to the named destination and clears the goods for export and import.',
    'Neither CPT nor DDP obliges either party to insure the goods; CIP is the related rule in which the seller must buy cover.',
  ],
  definitions: [
    {
      term: 'CPT (Carriage Paid To)',
      meaning:
        'The seller delivers by handing the goods to the carrier it contracted, and pays the carriage to the named destination.',
    },
    {
      term: 'DDP (Delivered Duty Paid)',
      meaning:
        'The seller delivers the goods cleared for import, ready for unloading, at the named destination, with duties and taxes paid.',
    },
    {
      term: 'First carrier',
      meaning:
        'The first transport operator to take charge of the goods when several carry them in turn, for example a haulier before an airline.',
    },
    {
      term: 'CIP (Carriage and Insurance Paid To)',
      meaning: 'CPT plus cargo insurance that the seller must buy for the buyer’s benefit.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is the difference between CPT and DDP?',
      paragraphs: [
        'Both rules make you, the seller, book and pay the transport to a place in the buyer’s country. Under CPT your risk ends at the start of that journey and the buyer handles the import. Under DDP your risk runs to the end of it, and the import is yours too.',
        'Both are any-mode rules in the ICC’s Incoterms® 2020 set, so they work for air freight, road, rail, containers by sea and journeys that combine several of them.',
      ],
      table: {
        caption: 'CPT and DDP compared under Incoterms® 2020',
        head: ['', 'CPT (Carriage Paid To)', 'DDP (Delivered Duty Paid)'],
        rows: [
          ['Who books the main carriage', 'Seller', 'Seller'],
          ['Named place', 'The destination the carriage is paid to', 'The destination where delivery happens'],
          ['Risk passes', 'On handover to the first carrier, at origin', 'At the named destination, ready for unloading'],
          ['Export clearance', 'Seller', 'Seller'],
          ['Import clearance', 'Buyer', 'Seller'],
          ['Import duties and taxes', 'Buyer', 'Seller'],
          ['Insurance', 'Not required of either party', 'Not required of either party'],
          ['Points to agree', 'Two: delivery place and destination', 'One: the destination'],
        ],
      },
    },
    {
      heading: 'Where does risk pass under CPT, and why so early?',
      paragraphs: [
        'Under CPT risk passes when you hand the goods to the carrier, in your own country, even though you go on paying for their transport. The rule separates the place where you stop carrying risk from the place your freight payment reaches.',
        'That makes CPT one of the rules with two critical points. The named place after “CPT” is the destination, such as “CPT Nairobi airport”. The place where you deliver, and where risk passes, is wherever the first carrier takes the goods. When a haulier collects from your premises and hands the goods to an airline at a hub, the ICC’s rules place delivery with that first haulier unless the contract names a later point.',
        'If the buyer wants risk to pass later, at the port or airport of departure for example, say so in the contract and on the documents. Leaving it out means the buyer carries the risk on the truck you booked, and a buyer who does not realise that may be uninsured for it.',
      ],
    },
    {
      heading: 'Who should insure the goods under CPT and DDP?',
      paragraphs: [
        'The party carrying the risk usually insures, because neither rule makes insurance compulsory. Under CPT that is the buyer, for almost the whole journey; under DDP it is you, all the way to the destination.',
        'The awkward case is CPT. You chose the carrier and hold the contract with it, but the buyer bears the loss if the goods are damaged. Tell the buyer, on the quotation, that the transit is at its risk and that it should arrange cover from the handover. If the buyer would rather you insured, the rule it wants is CIP, under which the ICC’s Incoterms® 2020 rules require cover meeting Institute Cargo Clauses (A) or similar. The article on cargo insurance for exporters explains the clauses.',
      ],
    },
    {
      heading: 'What does DDP add on top of a CPT price?',
      paragraphs: [
        'DDP adds the cost of the far end of the journey and the work that comes with it. Starting from a CPT price you already have, add these, in this order:',
      ],
      steps: [
        'Insurance for the whole journey, if you want cover for the risk you now carry.',
        'Destination handling at the port or airport, if your carriage contract does not include it.',
        'The customs broker’s fee in the importing country, for making the import declaration on your behalf.',
        'The import duty and taxes, worked out from the commodity code and the importing country’s official tariff, not estimated.',
        'Delivery from the port or airport to the buyer’s address, if the CPT destination was the airport and DDP names the buyer’s door.',
        'A margin for delay: storage and demurrage while a held shipment is cleared are yours to pay under DDP.',
      ],
    },
    {
      heading: 'Which rule fits air, road and courier shipments?',
      paragraphs: [
        'Both work for any mode, so pick by how much of the destination you want to handle. CPT suits air and road sales where you have a good freight rate and the buyer has a broker at the other end. It is the usual replacement for CFR when the goods are not loaded on board a ship, for example air cargo handed to a forwarder at an airport.',
        'DDP shows up most on sample shipments and small consignments sent by express carrier, where the buyer expects the parcel to arrive with nothing to pay. Asking the carrier to bill the duty to your account is a billing arrangement with that carrier; it does not by itself make the sale DDP. The sale contract and the invoice should still name the rule.',
      ],
    },
    {
      heading: 'What should the invoice and transport documents say?',
      paragraphs: [
        'Write the rule, the named destination and the version on the quotation, the proforma and the commercial invoice, for example “CPT Nairobi, Jomo Kenyatta International Airport, Incoterms® 2020”, an illustration rather than a real sale. Under DDP the named place is usually the buyer’s address. The International Trade Administration notes that the version should be identified on the export documents.',
        'Under CPT, list the goods and the carriage you paid as separate lines, so the buyer’s broker can see what the price includes. Under DDP, itemise freight, insurance and the duty you paid instead of quoting one total. HMRC notes that the Incoterm does not restrict the customs valuation method, and the broker needs the breakdown to declare the value.',
      ],
    },
    {
      heading: 'How do you choose between CPT and DDP?',
      paragraphs: [
        'Ask whether you can clear the goods in the buyer’s country, then whether you want the transit risk. If the answer to the first question is no, DDP is off the table. If you can, price both and let the buyer choose: CPT is the lower figure and the simpler promise, DDP the landed price the buyer may prefer.',
      ],
    },
  ],
  faq: [
    {
      q: 'Does CPT include import duty?',
      a: 'No. Under CPT the buyer clears the goods for import and pays the duties and taxes. If the seller is to pay them, the rule is DDP.',
    },
    {
      q: 'Is CPT the same as freight prepaid?',
      a: 'Close, but not the same. Freight prepaid describes who pays the carrier; CPT also sets where risk passes and who clears customs. A CPT shipment is usually freight prepaid, because the seller contracts the carriage.',
    },
    {
      q: 'Can CPT be used for sea freight?',
      a: 'Yes. CPT is an any-mode rule and works for containers handed to a carrier at a depot or terminal. For goods loaded on board at the port of shipment, CFR is the sea-only counterpart.',
    },
    {
      q: 'What is the difference between CPT and CIP?',
      a: 'One line: insurance. Under CIP the seller must buy cargo insurance for the buyer’s benefit; under CPT nobody has to. Delivery, risk and the payment of carriage are the same under both.',
    },
    {
      q: 'Who unloads the goods under DDP?',
      a: 'The buyer. Under DDP the seller delivers the goods on the arriving vehicle, ready for unloading at the named place.',
    },
  ],
  sources: [
    'e2-icc-incoterms-2020',
    'e2-ita-know-your-incoterms',
    'e2-hmrc-incoterms',
  ],
  primaryTool: '/tools/incoterms',
  tools: [
    '/tools/incoterms',
    '/tools/export-price-calculator',
    '/tools/landed-cost-calculator',
    '/tools/invoice-generator',
  ],
  callout: {
    afterSection: 1,
    tool: '/tools/incoterms',
    title: 'Check where risk passes under every rule',
    text: 'The Incoterms® 2020 guide charts all eleven rules, with the point where risk passes, who pays the carriage and who clears customs, and a page for each.',
  },
  related: [
    '/blog/fca-vs-ddp',
    '/blog/cif-vs-ddp',
    '/blog/cif-vs-cip',
    '/blog/incoterms-for-air-freight',
    '/blog/cargo-insurance-for-exporters',
    '/guides/dap-vs-ddp',
  ],
  cover: {
    id: 'D1H7jEwlWMU',
    src: 'https://images.unsplash.com/photo-1767868280782-fc108d087050',
    width: 7587,
    height: 5152,
    alt: 'Air cargo containers loaded inside an open aircraft hold, the kind of carriage a CPT seller pays for',
    caption: 'Cargo containers inside an aircraft hold',
    photographer: { name: 'Sevcan Alkan', profile: 'https://unsplash.com/@sevcanalkan' },
    page: 'https://unsplash.com/photos/cargo-containers-inside-an-open-airplane-D1H7jEwlWMU',
  },
};

export default article;
