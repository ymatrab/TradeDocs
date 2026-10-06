import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-06';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "exw vs fca" 390; "fca vs exw" 260.
 * Plan: docs/research/content-plan-v2-2026-10-06.md, batch 1.
 */
const article: ContentArticle = {
  slug: 'exw-vs-fca',
  title: 'EXW vs FCA: the same pickup, a different seller’s job',
  metaTitle: 'EXW vs FCA: the difference in Incoterms 2020',
  description:
    'EXW and FCA can both hand goods over at your premises. Under FCA you load the buyer’s vehicle and clear the goods for export. How the two rules compare, and how to switch.',
  lede: 'If the buyer’s truck collects from your warehouse, you can quote EXW or FCA and the truck will look the same. What changes is who loads it, who handles the export formalities and when the risk moves. FCA at your own premises keeps the pickup and puts those two jobs where they usually happen anyway.',
  answer:
    'Under EXW the seller makes the goods available at its premises, unloaded and not cleared for export, and the buyer does the rest. Under FCA named at the seller’s premises, the seller also loads the goods onto the buyer’s vehicle and clears them for export, and risk passes once they are loaded. Both rules suit any mode.',
  keyFacts: [
    'EXW and FCA are both Incoterms® 2020 rules for any mode of transport, according to the International Trade Administration.',
    'HMRC’s guidance says that under EXW the seller does not need to load the goods or clear them for export.',
    'Under FCA the seller delivers the goods to the carrier or another person nominated by the buyer at the seller’s premises or another named place.',
    'Under FCA the seller clears the goods for export, and loads them when the named place is its own premises.',
    'Incoterms® 2020 added an FCA option for the buyer’s carrier to issue an on-board bill of lading to the seller.',
  ],
  definitions: [
    {
      term: 'EXW (Ex Works)',
      meaning:
        'The seller places the goods at the buyer’s disposal at the named place, without loading them and without export clearance.',
    },
    {
      term: 'FCA (Free Carrier)',
      meaning:
        'The seller hands the goods, cleared for export, to the buyer’s carrier at the named place.',
    },
    {
      term: 'Seller’s premises',
      meaning:
        'The seller’s own factory, warehouse or yard; naming it as the FCA place makes loading the seller’s task.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is the difference between EXW and FCA?',
      paragraphs: [
        'The difference is two jobs: loading and export clearance. HMRC’s customs valuation guidance describes EXW as the seller placing the goods at the buyer’s disposal at its premises or another named place, without loading them on the collecting vehicle and without clearing them for export. Under FCA, the seller delivers the goods to the carrier or another person the buyer nominates, at the seller’s premises or another named place, and clears them for export.',
        'Where FCA is named at the seller’s premises, delivery happens when the goods are loaded on the buyer’s vehicle. Where it is named elsewhere, such as a forwarder’s depot, the seller delivers on its own vehicle, ready for unloading. Under EXW the seller never loads, wherever the place is.',
        'In both rules the buyer contracts and pays for the main carriage, clears the goods for import and pays the import duties. Neither rule obliges either party to insure.',
      ],
    },
    {
      heading: 'How do EXW and FCA at the seller’s premises compare?',
      paragraphs: ['With the same named place, the two rules differ on three lines out of eight.'],
      table: {
        caption: 'EXW and FCA named at the seller’s premises, under the Incoterms® 2020 rules',
        head: ['', 'EXW (Ex Works)', 'FCA (Free Carrier), seller’s premises'],
        rows: [
          ['Transport modes', 'Any', 'Any'],
          ['Named place', 'Seller’s premises', 'Seller’s premises'],
          ['Loading onto the buyer’s vehicle', 'Buyer', 'Seller'],
          ['Export clearance', 'Buyer', 'Seller'],
          [
            'Risk passes',
            'When the goods are made available, unloaded',
            'When the goods are loaded',
          ],
          ['Main carriage', 'Buyer', 'Buyer'],
          ['Import clearance and duties', 'Buyer', 'Buyer'],
          ['Insurance', 'Not required of either party', 'Not required of either party'],
        ],
      },
    },
    {
      heading: 'Why do sellers move from EXW to FCA?',
      paragraphs: [
        'Sellers move because EXW describes a handover that rarely happens. Most warehouses load the collecting truck with their own forklifts and staff. Under EXW that loading is outside the seller’s obligations, so it happens while the goods are already at the buyer’s risk, with the seller’s equipment. FCA at the seller’s premises makes the loading the seller’s job and moves the risk once it is done, which matches the facts.',
        'Export clearance is the second reason. The formalities take place in the seller’s country, and a buyer abroad has to appoint someone there to handle them under EXW. In the US, 15 CFR 30.3 says trade terms do not decide who the parties to an export are, so a US seller is usually still the US principal party in interest and must give the filer accurate export information. Under FCA the clearance is formally the seller’s task, which lines the contract up with the work the seller already does.',
        'The third reason is the bill of lading. Under Incoterms® 2020 the FCA parties can agree that the buyer will instruct its carrier to issue an on-board bill of lading to the seller, which helps when a letter of credit asks for one. EXW has no equivalent.',
      ],
    },
    {
      heading: 'When does EXW still make sense?',
      paragraphs: [
        'EXW can make sense when the buyer genuinely takes over at your gate and is equipped to handle export formalities in your country, for example a buyer with its own established entity or agent there. It can also suit a domestic sale where no export clearance applies, or a sale where the buyer insists on loading with its own crew.',
        'Even then, write down who loads and who bears the risk during loading, and agree what export data you will supply. EXW lowers the seller’s duties under the contract; it does not remove the export regulations of the country the goods leave.',
      ],
    },
    {
      heading: 'How do you switch a quotation from EXW to FCA?',
      paragraphs: [
        'Change the wording, then check the price and every document that repeats the term.',
      ],
      steps: [
        'Replace the term with FCA, your premises and the version, for example “FCA Dayton, seller’s warehouse, 400 Example Drive, Incoterms® 2020”.',
        'Add the cost of loading and export clearance to the price if the EXW price did not include them.',
        'Confirm with the buyer’s forwarder who files the export information and what data you will send.',
        'If the buyer pays by letter of credit, agree the Incoterms® 2020 on-board bill of lading option in the contract.',
        'Update the proforma invoice, the commercial invoice and the packing list so all three name the same rule and place.',
      ],
    },
    {
      heading: 'What should the invoice say under EXW or FCA?',
      paragraphs: [
        'The terms-of-sale line should repeat the contract exactly: the rule, the named place and the version. Customs in the importing country reads the line to understand what the invoice price covers, and the International Trade Administration describes the commercial invoice as the document customs uses to assess duties.',
        'Under both rules the invoice price normally excludes the main freight, because the buyer pays it. Where the importing country values goods including freight and insurance to the border, the importer adds those costs at entry. A precise rule on the invoice avoids questions about charges that look missing.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is FCA more expensive for the seller than EXW?',
      a: 'It usually costs the seller more, because loading and export clearance become its tasks. Those costs can be built into the FCA price, so the buyer pays them through the price instead of separately.',
    },
    {
      q: 'Who pays freight under EXW and FCA?',
      a: 'The buyer, under both rules. The seller pays only the costs up to delivery at the named place.',
    },
    {
      q: 'Can FCA be used for a courier collection?',
      a: 'Yes. FCA works for any mode of transport, so a courier pickup from your premises can be FCA named at your premises, with the courier as the buyer’s carrier.',
    },
    {
      q: 'Does the seller load the truck under FCA at a depot?',
      a: 'No. When the FCA place is somewhere other than the seller’s premises, the seller delivers on its own vehicle, ready for unloading, and the buyer’s side unloads.',
    },
    {
      q: 'Can I write “FCA factory” without an address?',
      a: 'You can, but a precise place avoids disputes. The point within the named place is where risk passes, so give the town and the site.',
    },
  ],
  sources: [
    'icc-incoterms-2020',
    'w1-hmrc-incoterms',
    'w1-ita-know-your-incoterms',
    'w1-ecfr-15-cfr-30-3',
    'trade-gov-commercial-invoice',
  ],
  primaryTool: '/tools/incoterms',
  tools: ['/tools/incoterms', '/tools/invoice-generator', '/tools/proforma-invoice-generator'],
  callout: {
    afterSection: 2,
    tool: '/tools/proforma-invoice-generator',
    title: 'Quote the new term on a proforma',
    text: 'The proforma invoice generator lets you state the Incoterms® rule and named place, so the buyer sees the FCA handover before the order is confirmed.',
  },
  related: ['/blog/exw-vs-fob', '/blog/fca-vs-fob', '/blog/proforma-invoice-example'],
  cover: {
    id: 'SJGC3NNOqU4',
    src: 'https://images.unsplash.com/photo-1780367261654-45395777b560',
    width: 9000,
    height: 5999,
    alt: 'Row of loading docks on a commercial building, where FCA at the seller’s premises makes loading the seller’s task',
    caption: 'A row of loading docks on a commercial building',
    photographer: { name: 'Matthew Jackson', profile: 'https://unsplash.com/@levijackson' },
    page: 'https://unsplash.com/photos/a-row-of-loading-docks-on-a-commercial-building-SJGC3NNOqU4',
  },
};

export default article;
