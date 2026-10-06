import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-06';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "hts code" 22,200, KD 10; "hs code vs hts code" 390;
 * "what is hts code" 1,900; "hs code meaning" 720; "schedule b vs hts" 110.
 * Plan: docs/research/content-plan-v2-2026-10-06.md, batch 1.
 */
const article: ContentArticle = {
  slug: 'hs-vs-hts-vs-schedule-b',
  title: 'HS code vs HTS code vs Schedule B: which number do you need?',
  metaTitle: 'HS code vs HTS code vs Schedule B explained',
  description:
    'The six-digit HS code, the 10-digit HTS for US imports and the 10-digit Schedule B for US exports: how they relate, who runs each one and which goes on your paperwork.',
  lede: 'Three names for what looks like the same number. They share the same first six digits, but each one has its own owner, its own purpose and its own place in the paperwork, and using the wrong one on an export filing is a common first-shipment mistake.',
  answer:
    'An HS code is the six-digit international product code maintained by the World Customs Organization. The United States extends it to 10 digits twice: the HTS (Harmonized Tariff Schedule) classifies imports and sets duty rates, and Schedule B classifies exports for statistics. For the same product, the first six digits match.',
  keyFacts: [
    'The WCO’s Harmonized System identifies more than 5,000 commodity groups, each with a six-digit code.',
    'More than 200 countries and economies use the HS as the basis for their customs tariffs, according to the WCO.',
    'The HTSUSA is developed by the U.S. International Trade Commission as the basis for classifying imported products.',
    'Schedule B numbers are 10-digit export classification codes administered by the U.S. Census Bureau (15 CFR 30.1).',
    'An ECCN is an export control number, which BIS says is entirely unrelated to Schedule B and HTS codes.',
  ],
  definitions: [
    {
      term: 'HS (Harmonized System)',
      meaning:
        'The WCO’s international product nomenclature, with six-digit codes shared by the countries that use it.',
    },
    {
      term: 'HTS (Harmonized Tariff Schedule of the United States)',
      meaning:
        'The US import tariff: 10-digit codes with their duty rates, maintained by the USITC.',
    },
    {
      term: 'Schedule B',
      meaning:
        'The US export classification: 10-digit codes the Census Bureau uses for export statistics and filings.',
    },
    {
      term: 'Subheading',
      meaning: 'The six-digit HS level, which stays the same across countries that use the HS.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is an HS code?',
      paragraphs: [
        'An HS code is the six-digit number the Harmonized System gives a type of product. The World Customs Organization maintains the system through the Harmonized System Committee and, according to the WCO, more than 200 countries and economies use it as the basis for their customs tariffs and trade statistics.',
        'The ITA explains that countries may add digits after the first six for their own, finer classification. The six-digit subheading is the shared part, which is why a buyer abroad can recognise a product from the start of your code even though their own tariff number is longer. Behind each code sit the HS rules of classification, which the WCO says exist to make classification uniform.',
      ],
    },
    {
      heading: 'What is an HTS code?',
      paragraphs: [
        'An HTS code is the 10-digit number the United States uses to classify goods coming in. The Foreign Trade Regulations describe the HTSUSA as a listing of goods and their duty rates, developed by the U.S. International Trade Commission, as the basis for classifying imported products.',
        'The first six digits are the HS subheading; the four after them are US detail, which is where the duty rate and the statistical breakdown live. Other countries extend the HS in their own way, so the import code your buyer uses abroad will usually share your first six digits and differ after that.',
      ],
    },
    {
      heading: 'What is a Schedule B number?',
      paragraphs: [
        'A Schedule B number is the 10-digit code the United States uses to classify goods going out. The Census Bureau administers it, and 15 CFR 30.1 defines it as the statistical classification of commodities exported from the United States. It carries no duty rate: it describes what left the country, for the export record.',
        'The ITA notes that the Schedule B number is what you need when exporting: to report shipments in the Automated Export System when a line is worth more than $2,500 or needs a licence, and to complete shipping documents such as the commercial invoice.',
      ],
    },
    {
      heading: 'How do HS, HTS and Schedule B compare?',
      paragraphs: [
        'The three codes line up at six digits and part ways after that. A full 10-digit Schedule B number and HTS number may not be the same for a given product, the ITA says, but the six-digit HS subheading will be.',
      ],
      table: {
        caption: 'HS, HTS and Schedule B compared',
        head: ['', 'HS code', 'HTS code', 'Schedule B'],
        rows: [
          ['Digits', '6', '10', '10'],
          [
            'Maintained by',
            'World Customs Organization',
            'U.S. International Trade Commission',
            'U.S. Census Bureau',
          ],
          [
            'Used for',
            'All countries using the HS',
            'Goods imported into the US',
            'Goods exported from the US',
          ],
          ['Carries a duty rate', 'No', 'Yes', 'No'],
          [
            'Where you look it up',
            'The importing country’s tariff',
            'The USITC’s HTS search',
            'The Census Bureau’s Schedule B search',
          ],
        ],
      },
    },
    {
      heading: 'Which code goes on the export paperwork?',
      paragraphs: [
        'For a US export filing, the Schedule B number is the one the ITA points exporters to. The Foreign Trade Regulations also refer to “Schedule B numbers or HTSUSA commodity classification codes” when they set the $2,500 line exemption in 15 CFR 30.37, so the regulation contemplates both; if you want to report an HTS number instead, confirm with your filer or the Census Bureau first.',
        'On the commercial invoice, show the code the parties and the destination’s customs will read. Many exporters give the six-digit HS subheading, which every HS country recognises, and the buyer’s customs broker classifies the goods under its own tariff on arrival. If your buyer asks for their country’s full import code, ask them to confirm it, because the classification on import is theirs to declare.',
      ],
      steps: [
        'Describe the product precisely: what it is, what it is made of and what it is for.',
        'Search the Census Bureau’s Schedule B tool for a 10-digit export number.',
        'Note the first six digits; that is the HS subheading the rest of the world shares.',
        'Ask the buyer which import code their customs expects, and put the agreed code on the invoice.',
        'Keep a record of how you reached the number, with the date, in case it is questioned later.',
      ],
    },
    {
      heading: 'Is an ECCN the same as an HS code?',
      paragraphs: [
        'No. An Export Control Classification Number answers a different question: whether the export needs a licence. BIS describes the ECCN as a five-character code on the Commerce Control List and says it is distinct from and entirely unrelated to either a Schedule B number or an HTS code. Items subject to the EAR that match no ECCN are designated EAR99. You need both numbers for a US export, from two different searches.',
      ],
    },
    {
      heading: 'Who decides the right code for my product?',
      paragraphs: [
        'You do, as the party filing, using the official tools; TradeDocs does not suggest codes. The Census Bureau’s Schedule B search and the USITC’s HTS search are the starting points, and the ITA points to the Customs Rulings Online Search System (CROSS) for products that are hard to classify. A wrong code can mean a wrong duty rate for your buyer and a wrong export record for you, so treat classification as a decision you can explain.',
      ],
    },
  ],
  faq: [
    {
      q: 'Are the first six digits always the same in every country?',
      a: 'The six-digit subheading is the shared international level, and the ITA notes that countries may add longer codes after it. The digits after the sixth are national and can differ from country to country.',
    },
    {
      q: 'Does the US charge duty based on the Schedule B number?',
      a: 'No. Schedule B is an export statistics classification and carries no duty rate. Duty is charged by the importing country on its own import classification.',
    },
    {
      q: 'How often does the Harmonized System change?',
      a: 'The WCO updates the HS nomenclature every five to six years, so a code you used in the past may have moved. Check the current Schedule B and HTS before every new product line.',
    },
    {
      q: 'Can I leave the code off a commercial invoice?',
      a: 'That depends on the importing country’s rules and on what your buyer’s broker needs, so ask before you ship. The ITA lists the commercial invoice among the documents the Schedule B number helps you complete.',
    },
    {
      q: 'Where do I find a Schedule B number?',
      a: 'In the Census Bureau’s free Schedule B search tool, which also offers training material and contact details for classification help.',
    },
  ],
  sources: [
    'w5-wco-hs',
    'w5-ita-hs-codes',
    'w5-ftr-30-1',
    'w5-census-schedule-b',
    'w5-ftr-30-37',
    'w5-bis-classify',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: [
    '/tools/invoice-generator',
    '/tools/proforma-invoice-generator',
    '/tools/landed-cost-calculator',
  ],
  callout: {
    afterSection: 4,
    tool: '/tools/invoice-generator',
    title: 'Put the agreed code on every line',
    text: 'The invoice generator has an HS code field on each line of goods, next to the description and the country of origin, so the code you looked up travels with the shipment.',
  },
  related: [
    '/guides/how-to-export-from-the-us',
    '/guides/eei-aes-filing-itn',
    '/blog/commercial-invoice-requirements',
    '/blog/export-documents-checklist',
  ],
  cover: {
    id: 'J4kK8b9Fgj8',
    src: 'https://images.unsplash.com/photo-1527176930608-09cb256ab504',
    width: 4288,
    height: 2848,
    alt: 'Open reference book with a white page marker, like a tariff schedule being looked up',
    caption: 'Open book with a white page marker',
    photographer: { name: 'Olia Gozha', profile: 'https://unsplash.com/@olia' },
    page: 'https://unsplash.com/photos/white-book-marker-on-book-page-J4kK8b9Fgj8',
  },
};

export default article;
