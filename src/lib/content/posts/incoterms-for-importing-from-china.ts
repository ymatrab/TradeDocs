import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "ddp shipping from china" 210, KD 2;
 * "fob china" 170; "exw china" 30.
 * Plan: docs/research/content-plan-v2-2026-10-06.md, batch 1.
 */
const article: ContentArticle = {
  slug: 'incoterms-for-importing-from-china',
  title: 'Incoterms for importing from China: EXW, FOB or DDP?',
  metaTitle: 'Incoterms for China imports: EXW, FOB or DDP',
  description:
    'Which Incoterms® 2020 rule to accept from a Chinese supplier, what each one leaves you to arrange, and who is the importer of record when the quote says DDP.',
  lede: 'A supplier in China will usually offer you one of three prices: EXW at the factory, FOB at a Chinese port, or DDP delivered to your door. They look like three prices for the same goods. They are three different sets of jobs, and the cheapest-looking one can leave you with the hardest of them.',
  answer:
    'For most importers buying from China, FOB at the Chinese port, or FCA for container cargo, is the practical choice: the supplier handles Chinese export clearance and you control freight and US import clearance. EXW leaves export clearance in China to you. DDP hands import clearance and duty to the supplier, so ask who will be importer of record.',
  keyFacts: [
    'The Incoterms® 2020 rules are published by the International Chamber of Commerce (ICC) and apply only when the contract names them.',
    'Under the ICC’s EXW rule, the buyer handles export clearance in the seller’s country and loading at the seller’s premises.',
    'Under FOB and FCA, the seller clears the goods for export; the buyer arranges the main carriage and import clearance.',
    'Under DDP, the seller clears the goods for import and pays the import duties and taxes at destination.',
    'CBP states that the importer of record is ultimately responsible for the correctness of the entry and for all duties, taxes and fees.',
  ],
  definitions: [
    {
      term: 'Importer of record',
      meaning:
        'The party named on the US customs entry, responsible to CBP for the declaration and the duties owed.',
    },
    {
      term: 'Export clearance',
      meaning:
        'The formalities that let goods leave the country of export, handled in the seller’s country.',
    },
    {
      term: 'Freight forwarder',
      meaning:
        'A company that books transport and handles the paperwork for a shipment on its client’s behalf.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'Which Incoterms rules do Chinese suppliers usually quote?',
      paragraphs: [
        'Sellers can quote under any of the eleven Incoterms® 2020 rules, but three cover most first conversations: EXW (Ex Works) at the factory, FOB (Free on Board) at a named port such as Shenzhen, Ningbo or Shanghai, and DDP (Delivered Duty Paid) at your address. CIF and FCA come up too.',
        'The rule decides who books and pays each leg, who clears customs on each side, and where the risk of loss passes from the supplier to you. It does not decide the price on its own, which is why two quotes under different rules cannot be compared until you add the costs each one leaves to you.',
      ],
    },
    {
      heading: 'How do EXW, FOB, CIF and DDP compare for an importer?',
      paragraphs: [
        'The table sets out what each rule leaves you to arrange when you import into the United States from a Chinese supplier.',
      ],
      table: {
        caption: 'What each Incoterms® 2020 rule leaves to a US importer buying from China',
        head: ['', 'EXW factory', 'FOB Chinese port', 'CIF US port', 'DDP your address'],
        rows: [
          ['Chinese export clearance', 'You', 'Supplier', 'Supplier', 'Supplier'],
          ['Truck to the Chinese port', 'You', 'Supplier', 'Supplier', 'Supplier'],
          ['Ocean freight', 'You', 'You', 'Supplier', 'Supplier'],
          ['Insurance for the voyage', 'Your choice', 'Your choice', 'Supplier (minimum cover)', 'Not required of either party'],
          ['Risk passes', 'At the factory', 'On board in China', 'On board in China', 'At your address'],
          ['US import clearance and duty', 'You', 'You', 'You', 'Supplier'],
          ['Importer of record', 'You', 'You', 'You', 'Supplier or its agent'],
        ],
      },
    },
    {
      heading: 'Why is EXW from China harder than it looks?',
      paragraphs: [
        'Under the ICC’s EXW rule, the seller only makes the goods available at its premises. You, the buyer, are responsible for loading, for the truck to the port and for export clearance in China. Unless you have an entity in China, that means relying on a forwarder there that can make the export formalities for you; check this before you accept the term.',
        'If your forwarder can do that and quotes the inland leg, EXW can work and gives you full control. If not, the supplier often ends up doing the export clearance anyway, outside the rule, and you lose the clarity the rule was meant to give. Many importers ask for FCA at the factory instead: the supplier clears for export and loads your forwarder’s truck, and the risk passes at the same place.',
      ],
    },
    {
      heading: 'Why do importers usually buy FOB China?',
      paragraphs: [
        'Because it splits the jobs along the border. The supplier handles everything in China, including export clearance and loading at the port. You choose the forwarder, the ocean freight and the US customs broker, so you can compare freight rates and keep control of the arrival.',
        'Two points make an FOB purchase work. First, name the port: “FOB Ningbo, Incoterms® 2020”, never “FOB China” or “FOB factory”. Second, if the goods travel in a container that the supplier hands to a terminal days before loading, FCA at that terminal or the supplier’s premises fits the handover better, because under FOB the supplier keeps the risk until the goods are on board. The difference is set out in FCA vs FOB.',
      ],
    },
    {
      heading: 'Who is the importer of record when you buy DDP from China?',
      paragraphs: [
        'Under the ICC’s DDP rule, the seller clears the goods for import and pays the import duties and taxes. In the United States, the party that makes the customs entry is the importer of record, and CBP states that the importer of record is ultimately responsible for the correctness of the entry documentation and for all applicable duties, taxes and fees.',
        'So a DDP quote raises a question you should ask in writing: who will be named as importer of record, and which licensed customs broker will file the entry? If the answer is the supplier or a company acting for it, that party is the one answering to CBP for the value and classification. You still receive the goods, and an inaccurate entry can still delay or stop your shipment.',
        'Treat a DDP price that is far below FOB plus freight and duty as a warning. The value on the entry should be the real transaction value, the main basis of customs value under the WTO Customs Valuation Agreement. Never accept an arrangement that depends on declaring a lower value or describing the goods vaguely; ask to see the commercial invoice that will be used for the entry.',
      ],
    },
    {
      heading: 'How do you choose a rule for your next order from China?',
      paragraphs: ['A short decision path for an importer buying from a Chinese supplier:'],
      steps: [
        'If you have a forwarder that can handle the pickup and export formalities in China, EXW or FCA at the factory gives you the most control.',
        'If not, ask for FOB at a named Chinese port for loose or bulk cargo, or FCA at the terminal or the supplier’s premises for containers.',
        'Get freight quotes from your own forwarder and add duty, taxes and broker fees to compare the FOB price with any CIF or DDP offer.',
        'If you accept DDP, get the name of the importer of record and the customs broker in writing before you pay.',
        'Write the same rule, named place and “Incoterms® 2020” on the proforma, the commercial invoice and the purchase order.',
      ],
    },
    {
      heading: 'What should the supplier’s documents say?',
      paragraphs: [
        'The rule you agreed belongs on the proforma invoice and the commercial invoice exactly as in the contract, with the named place and the version. A mismatch between the quotation and the invoice is how disputes about who pays a port charge begin.',
        'Under FOB or FCA, you will also need the commercial invoice and packing list in time for your broker to prepare the US entry. Ask the supplier for drafts before the goods are loaded, and check the description, quantities, unit prices and country of origin against your order.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is FOB or DDP cheaper when buying from China?',
      a: 'Compare like with like: add your own freight, insurance, duty, taxes and broker fees to the FOB price. A DDP price includes those costs, and the supplier’s margin on them.',
    },
    {
      q: 'Does “FOB China” mean anything?',
      a: 'Not as a complete term. FOB needs a named port of shipment, such as “FOB Shenzhen, Incoterms® 2020”. Without it, nobody knows where delivery and risk pass.',
    },
    {
      q: 'Can I be the importer of record on a DDP shipment?',
      a: 'If you clear the goods yourself, the term is no longer working as DDP. Agree a different rule, such as DAP, if you want to handle import clearance and pay the duty.',
    },
    {
      q: 'Who arranges insurance when I buy FOB from China?',
      a: 'Neither party is obliged to under the FOB rule. The risk is yours once the goods are on board, so most buyers decide whether to insure the voyage with their forwarder.',
    },
    {
      q: 'Do I need a customs broker for goods from China?',
      a: 'Not always, but CBP notes that many first-time importers use a licensed customs broker. The importer of record stays responsible for the entry either way.',
    },
  ],
  sources: ['icc-incoterms-2020', 'w2-cbp-importer-tips', 'wto-customs-valuation'],
  primaryTool: '/tools/incoterms',
  tools: ['/tools/incoterms', '/tools/landed-cost-calculator', '/tools/cbm-calculator'],
  callout: {
    afterSection: 1,
    tool: '/tools/landed-cost-calculator',
    title: 'Compare an FOB quote with a DDP quote',
    text: 'Add freight, insurance, duty and fees to the FOB price in the landed cost calculator, then set the total beside the DDP offer.',
  },
  related: [
    '/blog/fca-vs-fob',
    '/guides/dap-vs-ddp',
    '/blog/fob-price',
    '/guides/lcl-vs-fcl',
    '/blog/export-documents-checklist',
  ],
  cover: {
    id: 'hIOnJ4jDlZ0',
    src: 'https://images.unsplash.com/photo-1762687598311-0d329f74d5b4',
    width: 4928,
    height: 3264,
    alt: 'Cargo ship on the river in front of the Shanghai skyline, a view of goods leaving China',
    caption: 'A ship on the river below the Shanghai skyline',
    photographer: { name: 'Ricky Richard', profile: 'https://unsplash.com/@zhurichard' },
    page: 'https://unsplash.com/photos/shanghai-skyline-with-a-ship-on-the-river-hIOnJ4jDlZ0',
  },
};

export default article;
