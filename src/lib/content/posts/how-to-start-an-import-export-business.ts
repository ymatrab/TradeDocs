import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "import export business" 1,000, KD 25;
 * "how to start import export business" 140.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave C.
 */
const article: ContentArticle = {
  slug: 'how-to-start-an-import-export-business',
  title: 'How to start an import export business: the first steps',
  metaTitle: 'Import export business: how to start one',
  description:
    'The registrations, licence checks, payment terms and shipping documents a new import export business sets up before its first order, with the US agencies that set the rules.',
  lede: 'Starting an import export business is mostly paperwork done in the right order: a legal entity, tax and customs numbers, a check of which agencies regulate your goods, terms the buyer signs up to, and a set of shipping documents that agree with each other. This post walks through each step with the official source for it.',
  answer:
    'To start an import export business, form a legal entity, get an EIN (and an EORI number if you trade with the UK), check whether your goods need a licence or permit, research the market, agree Incoterms® and payment terms, and set up the commercial invoice, packing list and export filing each shipment needs.',
  keyFacts: [
    'CBP does not require an importer to hold a licence, but other federal agencies may require a permit or licence depending on the commodity.',
    'CBP entry forms ask for an importer number, which can be the business’s IRS registration number (EIN).',
    'The SBA says applying for an EIN is free.',
    'The Bureau of Industry and Security decides whether an export needs a licence from what the item is, where it goes, who receives it and its end use.',
    'Under the Foreign Trade Regulations, EEI is filed in AES when a Schedule B line is worth over $2,500 or another filing requirement applies.',
  ],
  definitions: [
    {
      term: 'Importer of record',
      meaning:
        'The party responsible to customs for the import entry, its accuracy and the duties, taxes and fees owed.',
    },
    {
      term: 'EIN',
      meaning:
        'The Employer Identification Number, a business’s US federal tax ID, issued by the IRS.',
    },
    {
      term: 'USPPI',
      meaning:
        'The US Principal Party in Interest, the party that receives the main benefit of an export and is responsible for its EEI filing.',
    },
    {
      term: 'EORI number',
      meaning:
        'The identification number a business uses to move goods into or out of the UK or the EU.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What does an import export business take on?',
      paragraphs: [
        'It takes on legal responsibility at the border, not only a buying and selling margin. On the import side, CBP says the importer of record is ultimately responsible for the correctness of the entry documentation and for paying all applicable duties, taxes and fees, even when a customs broker files the entry. On the export side, the International Trade Administration warns that you remain responsible for the accuracy of documents a freight forwarder prepares for you.',
        'Most new businesses start on one side. A US company that sources goods abroad and sells them at home is an importer; one that sells US goods to foreign buyers is an exporter. Many do both, and each direction has its own registrations and filings.',
        'Decide early which you are, because it decides which agency you deal with first: CBP for imports, the Census Bureau’s export filing rules and the Bureau of Industry and Security for exports.',
      ],
    },
    {
      heading: 'Which business structure and registrations do you need?',
      paragraphs: [
        'Form the entity first, then get the numbers that hang off it. The Small Business Administration sets out the trade-off: a sole proprietor can be held personally liable for the business’s debts, an LLC protects owners from personal liability in most instances, and a corporation gives the strongest protection but pays income tax on its own profits. Trade carries liabilities such as duty bills and cargo claims, so the choice matters more than in many small businesses.',
        'Next, the EIN. The SBA describes it as the business’s federal tax ID number, needed to pay federal taxes, hire employees, open a bank account and apply for licences and permits, and notes that applying is free. CBP entry forms ask for an importer number, which can be that IRS business registration number; without one, CBP accepts a social security number or can assign a number.',
        'If you will move goods into or out of the UK, check HMRC’s guidance on the EORI number, which explains who needs one and what to do if your business is not established in the UK. The EU runs its own EORI system for goods entering or leaving the EU.',
      ],
    },
    {
      heading: 'Do you need an import or export licence?',
      paragraphs: [
        'Usually not for the business itself, but often for particular goods. CBP states that it does not require an importer to have a licence or permit, while other agencies may, depending on the commodity. The SBA lists examples of federal permits: the Department of Agriculture for animals, animal products and plants, the Fish and Wildlife Service for wildlife and wildlife products, the Alcohol and Tobacco Tax and Trade Bureau for importing alcohol, and ATF for firearms, ammunition and explosives. It adds that states regulate a broader range of activities than the federal government.',
        'For exports, the Bureau of Industry and Security frames the licence question around four things: what the item is, where it is going, who will receive it and what they will use it for. Most commercial goods fall under EAR99, which BIS says needs a licence only for restricted end users, end uses or destinations. The guide ECCN, EAR99 and export licences explains the classification step.',
        'Screen every buyer as well. The ITA’s Consolidated Screening List combines the Commerce, State and Treasury lists of parties under US export restrictions in one search.',
      ],
    },
    {
      heading: 'How do you choose products and markets?',
      paragraphs: [
        'Start from a product you can describe and classify precisely, and a market you have researched rather than guessed. Every import and export uses a commodity code built on the Harmonized System, which the World Customs Organization says more than 200 countries and economies use for their tariffs and trade statistics, so check the official tariff for each product before you price it. The post How to find the HS code for your product shows where to look; TradeDocs does not suggest codes.',
        'Free public help exists for the market side. The ITA’s U.S. Commercial Service offers services for companies new to exporting and market research by country and industry. The SBA points to U.S. Export Assistance Centers and to Small Business Development Centers, whose advisors offer free consulting and low-cost training.',
      ],
    },
    {
      heading: 'How do you agree terms and get paid?',
      paragraphs: [
        'Put three things in writing before any goods move: the Incoterms® rule with its named place, the payment method, and the price in a stated currency. The ICC’s Incoterms® 2020 rules set where costs and risk pass from seller to buyer, which decides who pays freight, insurance and import duties.',
        'The ITA lists five payment methods (cash in advance, letter of credit, documentary collection, open account and consignment), each moving risk between exporter and importer. A first order with a new buyer often uses cash in advance or a letter of credit; the guide Export payment terms compares them. If you need working capital, the SBA’s export finance programmes give lenders up to a 90% guaranty on export loans.',
        'A proforma invoice is the usual way to put the offer on paper. The ITA describes it as a quote in invoice format that the buyer may need to apply for an import licence, open a letter of credit or arrange payment.',
      ],
    },
    {
      heading: 'Which documents does every shipment need?',
      paragraphs: [
        'Plan for the same core set on every order, plus whatever the goods or the destination add. The ITA advises asking the buyer or a freight forwarder what the importing country requires before the goods leave.',
      ],
      table: {
        caption: 'The core documents for a typical commercial shipment',
        head: ['Document', 'Who prepares it', 'What it is for'],
        rows: [
          [
            'Proforma invoice',
            'Seller',
            'The offer: goods, price, Incoterms® rule and payment terms',
          ],
          [
            'Commercial invoice',
            'Seller',
            'The bill for the goods, used by customs to determine duties',
          ],
          [
            'Packing list',
            'Seller',
            'Cartons, weights and dimensions, used to check contents and freight',
          ],
          [
            'Transport document',
            'Carrier or forwarder',
            'Bill of lading, air waybill or courier waybill',
          ],
          [
            'EEI filing (US exports)',
            'USPPI or its agent',
            'Export data in AES when a Schedule B line is over $2,500 or a licence applies',
          ],
          [
            'Import entry',
            'Importer of record or its broker',
            'The customs declaration in the destination country',
          ],
        ],
      },
    },
    {
      heading: 'What does a setup checklist look like?',
      paragraphs: [
        'Work through it once before the first order, then keep it for each new product.',
      ],
      steps: [
        'Choose the business structure and register the entity.',
        'Apply for an EIN from the IRS, and an EORI number if you will trade with the UK or the EU.',
        'Check each product for federal and state licence or permit requirements, and for export controls with BIS.',
        'Find the commodity code for each product in the official tariff of the importing country.',
        'Screen the buyer against the Consolidated Screening List.',
        'Agree the Incoterms® rule, named place, currency and payment method, and send a proforma invoice.',
        'Choose a freight forwarder or courier, and a customs broker for imports if you will use one.',
        'Prepare the commercial invoice and packing list from the same lines, and confirm who files EEI.',
        'Keep the documents: the Foreign Trade Regulations and the EAR both require export records to be kept for five years.',
      ],
    },
  ],
  faq: [
    {
      q: 'Do I need a customs broker to import goods?',
      a: 'CBP does not require one, but many importers use a broker. CBP licenses customs brokers, who are not CBP employees, and the importer of record stays responsible for the entry and for the duties owed either way.',
    },
    {
      q: 'Can I import with a social security number instead of an EIN?',
      a: 'CBP says a business that is not registered with the IRS can give a social security number as its importer number, or ask CBP to assign one. Most businesses use their EIN, which the SBA notes is free to apply for.',
    },
    {
      q: 'Who files the export information for a US shipment?',
      a: 'Under 15 CFR 30.3, the USPPI or its authorised agent files the EEI, and the filer must be in the United States. Many forwarders file as agent; agree who files before the pickup.',
    },
    {
      q: 'How long should an import export business keep its records?',
      a: 'For US exports, the Foreign Trade Regulations require shipment documents to be kept for five years from the date of export, and 15 CFR 762.6 sets five years for records the EAR requires. Import records have their own CBP rules.',
    },
    {
      q: 'Where can a new exporter get free help?',
      a: 'The ITA’s U.S. Commercial Service has services for new exporters and market research by country. The SBA points to U.S. Export Assistance Centers and Small Business Development Centers, which offer free consulting.',
    },
  ],
  sources: [
    'w3-cbp-importer-tips',
    'a4-cbp-importer-tips',
    'w4-trade-gov-export-transaction',
    'c1-sba-business-structure',
    'c1-sba-tax-id',
    'c1-sba-licenses-permits',
    'c1-sba-export-products',
    'c1-ita-export-solutions',
    'w5-gov-uk-eori',
    'w5-ec-eori',
    'w5-wco-hs',
    'a5-bis-license-needed',
    'w5-bis-classify',
    'w5-ita-csl',
    'icc-incoterms-2020',
    'a4-trade-gov-methods-of-payment',
    'trade-gov-proforma-invoice',
    'trade-gov-commercial-invoice',
    'trade-gov-packing-list',
    'trade-gov-export-documents',
    'w5-ftr-30-3',
    'w5-ftr-30-10',
    'c1-ear-762-6',
  ],
  primaryTool: '/tools/proforma-invoice-generator',
  tools: [
    '/tools/proforma-invoice-generator',
    '/tools/invoice-generator',
    '/tools/packing-list-generator',
    '/tools/incoterms',
  ],
  callout: {
    afterSection: 4,
    tool: '/tools/proforma-invoice-generator',
    title: 'Send your first quote as a proforma invoice',
    text: 'Enter the buyer, the goods, the Incoterms® rule and the payment terms once, download the proforma, and turn it into the commercial invoice when the order is confirmed.',
  },
  related: [
    '/blog/how-to-ship-internationally-small-business',
    '/guides/how-to-export-from-the-us',
    '/guides/how-to-import-into-the-us',
    '/blog/export-documents-checklist',
    '/guides/eccn-ear99-export-licence',
    '/guides/export-payment-terms',
  ],
  cover: {
    id: 'MGaFENpDCsw',
    src: 'https://images.unsplash.com/photo-1449247666642-264389f5f5b1',
    width: 3500,
    height: 2338,
    alt: 'A small business owner holding a sealed cardboard box at a packing table, ready for its first shipment',
    caption: 'A packed order ready to ship',
    photographer: { name: 'Bench Accounting', profile: 'https://unsplash.com/@benchaccounting' },
    page: 'https://unsplash.com/photos/person-holding-cardboard-box-on-table-MGaFENpDCsw',
  },
};

export default article;
