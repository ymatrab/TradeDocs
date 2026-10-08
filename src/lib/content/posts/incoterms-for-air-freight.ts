import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "incoterms for air freight" 70, KD 5.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave D (v2 #39: why FCA, CPT, CIP and the
 * D rules fit air; FOB does not).
 */
const article: ContentArticle = {
  slug: 'incoterms-for-air-freight',
  title: 'Incoterms® for air freight: which rules work, and why FOB does not',
  metaTitle: 'Incoterms for air freight: which rules to use',
  description:
    'Seven Incoterms 2020 rules work for air freight and four do not. Why FCA, CPT, CIP and the D rules fit air cargo, what to name as the place, and what to write on the invoice.',
  lede: 'Air shipments are often quoted “FOB airport” out of habit from sea freight. Under the Incoterms® 2020 rules that wording does not work: FOB, CFR, CIF and FAS are written for goods loaded on board a ship. Air freight has its own set of rules that fit how cargo actually moves through an airport.',
  answer:
    'For air freight, use one of the seven Incoterms® 2020 rules for any mode of transport: EXW, FCA, CPT, CIP, DAP, DPU or DDP. The four sea rules (FAS, FOB, CFR and CIF) assume loading on board a vessel. FCA is the usual replacement for FOB, and CPT or CIP for CFR or CIF.',
  keyFacts: [
    'The ICC’s Incoterms® 2020 rules contain seven rules for any mode of transport and four for sea and inland waterway transport only.',
    'The US International Trade Administration lists EXW, FCA, CPT, CIP, DAP, DPU and DDP as the rules for any mode of transport.',
    'FOB, CFR, CIF and FAS are sea and inland waterway rules, and the ICC describes CIF as reserved for maritime trade.',
    'Under Incoterms® 2020, CIP requires insurance cover compliant with Institute Cargo Clauses (A), a higher level than the default under CIF.',
    'IATA describes the air waybill as the document that forms the contract of carriage between the shipper and the airline.',
  ],
  definitions: [
    {
      term: 'FCA (Free Carrier)',
      meaning:
        'The seller hands the goods, cleared for export, to the buyer’s carrier or forwarder at a named place.',
    },
    {
      term: 'CPT (Carriage Paid To)',
      meaning:
        'The seller hands the goods to the carrier and pays the carriage to a named destination; risk passes at the handover.',
    },
    {
      term: 'CIP (Carriage and Insurance Paid To)',
      meaning: 'CPT plus insurance that the seller buys for the buyer’s benefit.',
    },
    {
      term: 'Air waybill (AWB)',
      meaning: 'The transport document for air cargo, issued by or for the airline.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'Which Incoterms® rules can be used for air freight?',
      paragraphs: [
        'Any of the seven rules the ICC groups as suitable for any mode or modes of transport: EXW, FCA, CPT, CIP, DAP, DPU and DDP. They work for air because they describe delivery as a handover to a carrier or an arrival at a place, not as goods crossing a ship’s rail or sitting on board a vessel.',
        'The other four, FAS, FOB, CFR and CIF, are written for sea and inland waterway transport. Their delivery point is alongside or on board a ship at a port, so on an air shipment the rule points at a moment that never happens. The ICC reserves CIF for maritime trade in so many words.',
      ],
      table: {
        caption: 'Incoterms® 2020 rules and air freight',
        head: ['Rule', 'Works for air?', 'Where the seller’s delivery ends'],
        rows: [
          ['EXW', 'Yes', 'Goods made available at the seller’s premises, not loaded'],
          ['FCA', 'Yes', 'Handover to the buyer’s carrier or forwarder at the named place'],
          ['CPT', 'Yes', 'Handover to the carrier the seller books, carriage paid to the destination'],
          ['CIP', 'Yes', 'As CPT, plus insurance bought by the seller'],
          ['DAP', 'Yes', 'Arrival at the named place, ready for unloading'],
          ['DPU', 'Yes', 'Arrival at the named place, unloaded'],
          ['DDP', 'Yes', 'Arrival at the named place, cleared for import'],
          ['FAS, FOB, CFR, CIF', 'No', 'Alongside or on board a vessel at a port'],
        ],
      },
    },
    {
      heading: 'Why does FOB not work for air freight?',
      paragraphs: [
        'FOB delivers when the goods are on board the vessel at the named port of shipment, and risk passes at that moment. An airport is not a port of shipment and an aircraft is not a vessel, so the rule has no clear delivery point. If cargo is damaged in the airline’s warehouse before the flight, an “FOB airport” contract gives no clean answer to who carried the risk.',
        'Air cargo is usually handed to a forwarder or a ground handler, sometimes days before it is loaded on an aircraft. FCA matches that: the seller delivers when it hands the goods to the buyer’s carrier at a named place, such as the forwarder’s warehouse or the airline’s cargo terminal, and risk passes there.',
        'Some traders still write “FOB airport” and mean FCA. If you inherit that wording, replace it with FCA and the named place, so the contract and the Incoterms® 2020 rules agree.',
      ],
    },
    {
      heading: 'Which rule should replace FOB, CFR or CIF on an air shipment?',
      paragraphs: [
        'Each sea rule has an any-mode counterpart that keeps the same split of cost and risk while moving the delivery point to the handover to the carrier.',
      ],
      list: [
        'In place of FOB, use FCA: the buyer books and pays the air freight, and the seller delivers to the buyer’s carrier at the named place.',
        'In place of CFR, use CPT: the seller books and pays the air freight to the destination, and risk passes when the goods are handed to the first carrier.',
        'In place of CIF, use CIP: as CPT, with insurance the seller buys. Under Incoterms® 2020, CIP calls for cover compliant with Institute Cargo Clauses (A), wider than the default under CIF, so check the premium before you quote.',
        'If you deliver to the buyer’s door, DAP, DPU or DDP work for air exactly as for any other mode.',
      ],
    },
    {
      heading: 'What should the named place be for an air shipment?',
      paragraphs: [
        'Name the place where the handover or arrival really happens, because it is where risk passes. For an air shipment, that is usually one of the following, and the examples use invented places.',
      ],
      list: [
        'FCA at your premises: “FCA Manchester, seller’s warehouse, 3 Example Lane, Incoterms® 2020”. You load the buyer’s collecting vehicle.',
        'FCA at the forwarder: “FCA Heathrow, forwarder’s cargo shed, Incoterms® 2020”. You deliver ready for unloading.',
        'CPT or CIP: “CPT Singapore Changi Airport, Incoterms® 2020”. You pay the air freight to Changi; risk passed when you handed the goods to the carrier.',
        'DAP: “DAP Toronto, buyer’s premises, 12 Example Avenue, Incoterms® 2020”. You pay the on-carriage from the destination airport too.',
      ],
    },
    {
      heading: 'How do the Incoterms® rules fit with the air waybill and the freight bill?',
      paragraphs: [
        'The Incoterms® rule sits in the sale contract between seller and buyer. The air waybill is a separate contract, between the shipper and the airline; IATA describes it as the document that constitutes that contract of carriage. The rule tells you who should book the flight and pay for it; the air waybill records who did.',
        'Air freight is billed on chargeable weight, the greater of the actual weight and the volumetric weight. IATA’s general rule for air cargo is 6,000 cm³ per kilogram; express carriers publish their own divisors, so check the one on your quote. Under CPT, CIP and the D rules that freight bill is the seller’s, so measure the cartons before you quote; under EXW and FCA it is the buyer’s.',
        'If you book air freight through a forwarder, the International Trade Administration notes that forwarders are licensed by IATA to handle air freight and can help prepare price quotations. Tell the forwarder the Incoterms® rule at booking, so it knows whom to bill.',
      ],
    },
    {
      heading: 'What should the commercial invoice say for air freight?',
      paragraphs: [
        'Write the rule, the named place and the version in the terms of sale on the proforma and on the commercial invoice, exactly as in the contract. Customs in the importing country reads that line to understand what the invoice price includes.',
        'Under CPT and CIP the price includes the air freight, and under CIP the insurance too. Show freight and insurance as separate lines where you know them, because some countries value imports without international freight and others with it. The landed cost calculator lets the buyer add the freight, insurance, duty and taxes at the rates it enters.',
      ],
      steps: [
        'Agree the rule and the named place with the buyer before you book.',
        'Measure and weigh each carton, and work out the chargeable weight.',
        'Get the air freight quote if the rule makes freight your cost.',
        'Write the rule, place and version on the proforma and the commercial invoice.',
        'Give the forwarder the same rule at booking, so the air waybill and the freight bill go to the right party.',
      ],
    },
  ],
  faq: [
    {
      q: 'Can you use FOB for air freight?',
      a: 'Not under the Incoterms® 2020 rules. FOB is a sea and inland waterway rule that delivers on board a vessel. For air freight the equivalent is FCA, with the forwarder’s premises or the airline’s cargo terminal as the named place.',
    },
    {
      q: 'Is CIF valid for air shipments?',
      a: 'No. The ICC reserves CIF for maritime trade. For air freight with the seller paying carriage and insurance, use CIP and name the destination airport or place.',
    },
    {
      q: 'What is the most common Incoterm for air freight?',
      a: 'There is no published count to point to, but FCA is the rule that fits the usual air export, where the seller hands the goods to a forwarder or carrier at a named place and the buyer pays the flight.',
    },
    {
      q: 'Does EXW work for air freight?',
      a: 'Yes, EXW is an any-mode rule. It leaves loading and export clearance to the buyer, which can be awkward for an export, so many sellers quote FCA at their own premises instead.',
    },
    {
      q: 'Who pays the air waybill fee under FCA?',
      a: 'Under FCA the buyer contracts and pays for the main carriage, so the carrier’s charges for the air waybill normally go on the buyer’s freight bill. Confirm with the forwarder which charges it bills to each party.',
    },
  ],
  sources: [
    'c3-icc-incoterms-2020',
    'c3-ita-know-your-incoterms',
    'c3-hmrc-incoterms',
    'iata-air-waybill',
    'iata-volumetric',
    'd3-trade-gov-shipping-options',
  ],
  primaryTool: '/tools/incoterms',
  tools: ['/tools/incoterms', '/tools/chargeable-weight', '/tools/export-price-calculator'],
  callout: {
    afterSection: 2,
    tool: '/tools/chargeable-weight',
    title: 'Work out the weight you will be billed on',
    text: 'The dimensional weight calculator compares actual and volumetric weight for air freight and express, and shows which one the carrier charges.',
  },
  related: [
    '/blog/fca-vs-fob',
    '/blog/air-freight-vs-sea-freight',
    '/guides/air-waybill',
    '/guides/chargeable-weight',
    '/blog/cif-vs-cip',
    '/blog/mawb-vs-hawb',
  ],
  cover: {
    id: '5qiq1l2ekP4',
    src: 'https://images.unsplash.com/photo-1789465779019-2e568d45a730',
    width: 6000,
    height: 4000,
    alt: 'Singapore Airlines cargo aircraft on the tarmac, the kind of shipment the any-mode Incoterms rules cover',
    caption: 'Cargo aircraft on the tarmac',
    photographer: { name: 'bobert richards', profile: 'https://unsplash.com/@ilovehawks2' },
    page: 'https://unsplash.com/photos/singapore-airlines-cargo-plane-on-tarmac-5qiq1l2ekP4',
  },
};

export default article;
