import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-06';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "fob vs exw" 590; "exw vs fob" 320, KD 1.
 * Plan: docs/research/content-plan-v2-2026-10-06.md, batch 1.
 */
const article: ContentArticle = {
  slug: 'exw-vs-fob',
  title: 'EXW vs FOB: who clears the goods for export?',
  metaTitle: 'EXW vs FOB: export clearance in Incoterms 2020',
  description:
    'Under EXW the buyer clears the goods for export; under FOB the seller does. What that means for loading, export filings and US routed exports, compared rule by rule.',
  lede: 'EXW looks like the easy option for a seller: the buyer collects and handles everything. On paper it is. In practice the export formalities still happen in your country, with your goods and often your name on the filing, while the rule says the buyer is responsible for them.',
  answer:
    'Under EXW (Ex Works) the seller makes the goods available at its premises and the buyer loads them, clears them for export and pays all transport. Under FOB (Free on Board) the seller clears the goods for export and loads them on board the buyer’s vessel at the named port, where risk passes to the buyer.',
  keyFacts: [
    'EXW and FOB are two of the eleven Incoterms® 2020 rules published by the International Chamber of Commerce (ICC).',
    'HMRC’s guidance on Incoterms says that under EXW the seller does not need to load the goods or clear them for export.',
    'Under FOB the seller delivers on board the vessel nominated by the buyer at the named port of shipment, and risk passes once the goods are on board.',
    'EXW can be used for any mode of transport; FOB is one of the four ICC rules for sea and inland waterway transport only.',
    'Under 15 CFR 30.3, the US Foreign Trade Regulations say trade terms do not determine the parties to an export transaction.',
  ],
  definitions: [
    {
      term: 'EXW (Ex Works)',
      meaning:
        'The seller places the goods at the buyer’s disposal at its premises or another named place, not loaded and not cleared for export.',
    },
    {
      term: 'FOB (Free on Board)',
      meaning:
        'The seller clears the goods for export and delivers them on board the buyer’s vessel at the named port of shipment.',
    },
    {
      term: 'Export clearance',
      meaning:
        'The formalities the exporting country requires before goods leave, such as an export declaration or licence.',
    },
    {
      term: 'Routed export transaction',
      meaning:
        'A US export in which the foreign buyer authorises a US agent to arrange the export and file the Electronic Export Information.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is the main difference between EXW and FOB?',
      paragraphs: [
        'The main difference is who deals with the export. HMRC’s customs valuation guidance describes Ex Works as the seller placing the goods at the buyer’s disposal at its premises or another named place, without loading them on any collecting vehicle and without clearing them for export. Under FOB the seller clears the goods for export, takes them to the port and delivers them on board the vessel the buyer has nominated.',
        'The second difference is where risk passes. Under EXW the buyer carries the risk from the moment the goods are made available, often before they leave your loading bay. Under FOB the seller carries it through inland transport and port handling until the goods are on board.',
        'The third is transport. The International Trade Administration lists EXW among the seven Incoterms® 2020 rules for any mode of transport and FOB among the four for sea and inland waterway only. An air or courier shipment cannot be FOB under the ICC rules.',
      ],
    },
    {
      heading: 'How do EXW and FOB compare, task by task?',
      paragraphs: [
        'The table follows the goods from your warehouse to the ship. Everything below the delivery line belongs to the buyer under both rules.',
      ],
      table: {
        caption: 'EXW and FOB compared under the Incoterms® 2020 rules',
        head: ['Task', 'EXW (Ex Works)', 'FOB (Free on Board)'],
        rows: [
          ['Transport modes', 'Any', 'Sea and inland waterway only'],
          ['Named place', 'Seller’s premises or another named place', 'Port of shipment'],
          ['Loading at the seller’s premises', 'Buyer', 'Seller'],
          ['Export clearance', 'Buyer', 'Seller'],
          ['Inland transport to the port', 'Buyer', 'Seller'],
          ['Loading on board the vessel', 'Buyer', 'Seller'],
          ['Risk passes', 'When the goods are made available', 'When the goods are on board'],
          ['Main carriage and import clearance', 'Buyer', 'Buyer'],
        ],
      },
    },
    {
      heading: 'Why can EXW be awkward for a seller?',
      paragraphs: [
        'EXW is awkward because export formalities are tied to the exporting country, and the buyer is usually abroad. The rule makes the buyer responsible for clearance, but the customs authority and the export control rules sit where you are. A foreign buyer normally has to appoint a forwarder or agent in your country to do it, and that agent will need information only you hold.',
        'Loading is the other friction point. Under EXW the seller has no duty to load the buyer’s truck. If your staff load it anyway, as warehouses usually do, the loading happens at a moment when the goods are already at the buyer’s risk. If something is dropped, the contract and the facts may point in different directions.',
        'Finally, an EXW price says nothing about export paperwork. You may still be asked to supply the commercial invoice, the packing list and the product data an export filing needs. Agree in the contract what you will provide and by when.',
      ],
    },
    {
      heading: 'Who files the export information for a US EXW sale?',
      paragraphs: [
        'In the US, the Foreign Trade Regulations decide that question, not the Incoterms® rule. Under 15 CFR 30.3, trade terms have no regulatory basis for deciding the type of export transaction or its parties. A sale can be EXW in the contract and still a standard export in which the US seller, as the US principal party in interest (USPPI), files or has its agent file the Electronic Export Information.',
        'An EXW sale is often handled as a routed export transaction, where the foreign buyer authorises a US agent to prepare and file the filing. Even then, 15 CFR 30.3 requires the USPPI to give that agent complete, accurate and timely export information and to keep documentation supporting it. The International Trade Administration notes that Electronic Export Information is filed in the Automated Export System when a Schedule B line is valued over $2,500 or another mandatory requirement applies.',
        'So choosing EXW does not remove you from the export. It changes who files, and it leaves you responsible for the data you hand over.',
      ],
    },
    {
      heading: 'When is FOB the better choice than EXW?',
      paragraphs: [
        'FOB fits when you can manage export clearance and delivery to the port, and the goods are bulk or break-bulk cargo that you can see loaded onto the ship. You control the formalities in your own country and the risk passes at a clear physical point.',
        'For container cargo, FOB has its own problem: the container is usually handed over at a terminal days before loading, and you carry the risk in between. Our article on FCA vs FOB explains why FCA often fits containers better. For a seller who wants to stay close to EXW but keep export clearance in its own hands, the article on EXW vs FCA covers FCA at the seller’s premises.',
      ],
    },
    {
      heading: 'How do you choose between EXW and FOB?',
      paragraphs: ['Answer these in order before you quote.'],
      steps: [
        'Check the transport mode. If the goods travel by air, road, rail or courier, FOB is not available; consider FCA instead.',
        'Decide who will handle export clearance. If you want it in your hands, rule out EXW.',
        'Decide who will load at your premises. If your staff will load the buyer’s vehicle, a rule that makes loading the seller’s task matches what actually happens.',
        'For a US export, agree in writing whether the shipment is a standard or a routed export transaction and who files the Electronic Export Information.',
        'Write the rule, the named place and the version on the quotation, proforma and commercial invoice, for example “FOB Houston, Incoterms® 2020”.',
      ],
    },
  ],
  faq: [
    {
      q: 'Does the seller load the goods under EXW?',
      a: 'Not under the rule. HMRC’s guidance on Incoterms says the seller does not need to load the goods on any collecting vehicle. If you load anyway, agree in the contract who bears the risk of that loading.',
    },
    {
      q: 'Is EXW cheaper than FOB for the buyer?',
      a: 'The EXW price is usually lower because it covers less, but the buyer then pays for loading, export clearance, inland transport and port charges itself. Compare the total cost to the same point, not the headline price.',
    },
    {
      q: 'Can FOB be used for a courier or air shipment?',
      a: 'Not under the Incoterms® 2020 rules. FOB is a sea and inland waterway rule; for air, road or courier shipments the closest rule is FCA at a named place.',
    },
    {
      q: 'Who is the exporter under EXW?',
      a: 'The Incoterms® rule does not decide it. In the US, 15 CFR 30.3 sets out the parties to the export, and the US seller is usually the USPPI even when the sale is EXW.',
    },
    {
      q: 'What goes on the commercial invoice for an EXW sale?',
      a: 'The terms of sale written as in the contract, such as “EXW Leeds, seller’s warehouse, Incoterms® 2020”, along with the parties, goods, quantities and values the importing country requires.',
    },
  ],
  sources: [
    'icc-incoterms-2020',
    'w1-hmrc-incoterms',
    'w1-ita-know-your-incoterms',
    'w1-ecfr-15-cfr-30-3',
    'trade-gov-export-documents',
  ],
  primaryTool: '/tools/incoterms',
  tools: ['/tools/incoterms', '/tools/invoice-generator', '/tools/packing-list-generator'],
  callout: {
    afterSection: 1,
    tool: '/tools/invoice-generator',
    title: 'Put the agreed rule on the invoice',
    text: 'The commercial invoice generator has fields for the Incoterms® rule and its named place, so the invoice says what the contract says.',
  },
  related: ['/blog/exw-vs-fca', '/blog/fca-vs-fob', '/blog/export-documents-checklist'],
  cover: {
    id: 'RPmrx0y92QM',
    src: 'https://images.unsplash.com/photo-1720346502526-40de0f880108',
    width: 5846,
    height: 3898,
    alt: 'Forklift parked in front of a truck, the loading step that EXW leaves to the buyer and FOB gives the seller',
    caption: 'A forklift parked in front of a truck',
    photographer: { name: 'Fabio Romano', profile: 'https://unsplash.com/@faburomano' },
    page: 'https://unsplash.com/photos/a-forklift-is-parked-in-front-of-a-truck-RPmrx0y92QM',
  },
};

export default article;
