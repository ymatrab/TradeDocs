import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "how to find hs code" 140, KD 60;
 * "hs code example" 40.
 * Plan: docs/research/content-plan-v2-2026-10-06.md, batch 1.
 */
const article: ContentArticle = {
  slug: 'how-to-find-hs-code',
  title: 'How to find the HS code for your product',
  metaTitle: 'How to find an HS code: the official lookups',
  description:
    'Find an HS code with the official tools: the WCO system, the US HTS and Schedule B searches, the UK Trade Tariff, and when to ask customs for a binding ruling.',
  lede: 'Every commercial invoice line needs a commodity code, and the code decides the duty rate, the statistics and sometimes whether a licence applies. This post shows where the official codes live, how to work down to the right line, and what to do when two headings both seem to fit.',
  answer:
    'To find an HS code, describe what the product is made of, what it does and how it is packed, then search the official tariff: the HTS for US imports, Schedule B for US exports, the Trade Tariff for the UK. Confirm the six HS digits, then the national ones, and ask customs for a binding ruling if unsure.',
  keyFacts: [
    'The WCO’s Harmonized System groups goods into more than 5,000 commodity groups, each identified by a six-digit code.',
    'Over 200 countries and economies use the Harmonized System as the basis of their customs tariffs, according to the WCO.',
    'HMRC notes that only the first six digits are used worldwide; the digits after them and product decisions are particular to each country.',
    'Under 15 CFR 30.6, US export filings report the 10-digit Schedule B number, or the 10-digit HTSUSA number except where its headnotes say otherwise.',
    'Under 19 CFR Part 177, CBP issues written binding rulings for prospective imports; oral advice from CBP staff is not binding.',
  ],
  definitions: [
    {
      term: 'HS (Harmonized System)',
      meaning:
        'The WCO’s international six-digit nomenclature for classifying goods, used as the base of national tariffs.',
    },
    {
      term: 'HTS (Harmonized Tariff Schedule of the United States)',
      meaning:
        'The US import tariff, which extends the HS to 10 digits and sets the duty rates.',
    },
    {
      term: 'Schedule B',
      meaning:
        'The US Census Bureau’s 10-digit export classification, used when reporting exports.',
    },
    {
      term: 'Binding ruling',
      meaning:
        'A written decision from a customs authority on how it will classify a described product before it is imported.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is an HS code, and why does each country show a different number?',
      paragraphs: [
        'An HS code is the six-digit number the World Customs Organization’s Harmonized System gives to a group of goods. The WCO describes the system as more than 5,000 commodity groups arranged in a legal and logical structure, with rules that make classification uniform. Over 200 countries and economies build their customs tariffs on it, and the WCO updates it every five to six years.',
        'Each country then adds its own digits to the six. The United States uses 10 digits in the HTS for imports and 10 digits in Schedule B for exports. The UK’s Trade Tariff carries its own longer commodity codes. HMRC’s guidance puts the consequence plainly: only the first six digits are used worldwide, and product-specific decisions belong to each country. A code your supplier gives you may be right at six digits and wrong after that for your market.',
        'That is why the right question is never “what is the HS code for this product” in the abstract. It is “what is the code for this product in this country’s tariff, on this date”.',
      ],
    },
    {
      heading: 'Which official tool should you use?',
      paragraphs: [
        'Use the tool published by the country whose rules apply to the filing you are making. Unofficial lookups and lists copy codes that may be out of date or from another country’s tariff. The table names the official source for the most common cases.',
      ],
      table: {
        caption: 'Official classification lookups by purpose',
        head: ['You need a code for', 'Official tool', 'Published by'],
        rows: [
          [
            'Understanding the six-digit HS structure and its notes',
            'HS nomenclature and Explanatory Notes',
            'World Customs Organization',
          ],
          ['Importing into the United States', 'HTS search', 'US International Trade Commission'],
          [
            'Reporting a US export (EEI in AES)',
            'Schedule B Commodity Search Tool',
            'US Census Bureau',
          ],
          ['Importing into or exporting from the UK', 'Trade Tariff tool', 'HMRC, on GOV.UK'],
          [
            'Seeing how US customs classified similar goods',
            'Customs Rulings Online Search System (CROSS)',
            'US Customs and Border Protection',
          ],
          [
            'Another destination',
            'That country’s published customs tariff',
            'The importing country’s customs authority',
          ],
        ],
      },
    },
    {
      heading: 'How do you work down to the right code?',
      paragraphs: [
        'Classification is a narrowing process: you start at the broad section and chapter and work down to the national line. Each tool presents the same tree; the steps below are the order to follow in any of them.',
      ],
      steps: [
        'Write a full description of the goods before you search: what they are, what they are made of and in what proportion, what they do, and how they are packed for sale. CBP’s tips for new importers list the same facts customs asks for: origin, manufacturer, composition, intended use and price.',
        'Search the official tool with plain commercial terms and with the material or function, not with brand names. Note every chapter the results point to.',
        'Read the section and chapter notes of each candidate chapter. They include and exclude goods, and they decide many cases before the headings do.',
        'Choose the four-digit heading whose wording describes the goods, then the six-digit subheading. Where the WCO’s Explanatory Notes cover the heading, read them; they are the official interpretation of the HS.',
        'Move to the national digits in the importing country’s tariff and pick the line that matches. Check the unit of quantity the line asks for, because the invoice must report it.',
        'Record the code, the tariff edition or date you used, and why you chose it. Your file is your evidence if the code is ever questioned.',
      ],
    },
    {
      heading: 'What if two headings both seem to fit?',
      paragraphs: [
        'When the notes and headings do not settle it, look at how customs has already decided similar goods, then ask for a decision of your own. In the US, CBP points importers to CROSS, its searchable database of published rulings. A ruling on a product like yours shows the reasoning CBP applied, though it binds only for the goods it describes.',
        'For certainty before you ship, request a binding ruling. Under 19 CFR Part 177, CBP gives full consideration to written requests about a specifically described prospective transaction. It does not issue rulings on oral requests, and the regulation states that oral advice from its staff is not binding. For other destinations, ask the importing country’s customs authority whether it offers advance rulings.',
        'If classification is hard for your goods, a licensed customs broker can classify them for you. HMRC’s guidance also points to getting someone to deal with customs for you. You remain responsible for what is declared either way.',
      ],
    },
    {
      heading: 'Which code goes on the commercial invoice and the export filing?',
      paragraphs: [
        'The commercial invoice usually carries the code for each line, and the buyer’s customs broker uses it to enter the goods. Ask your buyer which code they want shown, because the import classification is theirs to make under their country’s tariff. Many exporters show the six-digit HS subheading, which both sides share, and let the importer add the national digits.',
        'For a US export, the filing has its own rule. Under 15 CFR 30.6, Electronic Export Information reports the 10-digit Schedule B number, or the 10-digit HTSUSA number in its place except where the HTSUSA headnotes say otherwise. The same section requires a commodity description detailed enough to verify the number; a correct code does not excuse a vague description. The International Trade Administration notes that EEI is filed when a single Schedule B line is worth over $2,500 or another filing requirement, such as an export licence, applies.',
        'Keep the description, the code and the quantity unit identical on the invoice, the packing list and the export filing. The International Trade Administration warns that discrepancies or omissions in documents can delay the shipment, hold up payment or even lead to seizure.',
      ],
    },
    {
      heading: 'Why does this post not give example codes?',
      paragraphs: [
        'Because a code is a legal classification of a specific product in a specific tariff, and a list of “examples” invites readers to copy a number that may be wrong for their goods, their country or the current tariff edition. A one-word difference in material or function can move goods to a different chapter. Duty rates, licences and trade-agreement treatment all follow from the code, so the cost of a borrowed number lands on you.',
        'The official tools above are free, current and authoritative for their country. Use them, keep your notes, and ask for a ruling when the answer matters.',
      ],
    },
  ],
  faq: [
    {
      q: 'How many digits does an HS code have?',
      a: 'Six at the international level. Countries add digits for their own tariffs and statistics: the US uses 10 digits in both the HTS (imports) and Schedule B (exports), and the UK Trade Tariff uses its own longer commodity codes.',
    },
    {
      q: 'Can I use my supplier’s HS code?',
      a: 'Treat it as a starting point, not an answer. HMRC notes that only the first six digits are shared worldwide and that product decisions are particular to each country, so check the code against the importing country’s tariff before you rely on it.',
    },
    {
      q: 'Is a Schedule B number the same as an HTS code?',
      a: 'They share the first six HS digits but are separate schedules: HTS for US imports, Schedule B for US exports. Under 15 CFR 30.6 an exporter may report the 10-digit HTSUSA number instead of Schedule B, except where the HTSUSA headnotes say otherwise.',
    },
    {
      q: 'Who is responsible if the code is wrong?',
      a: 'The party making the declaration. The importer of record answers for the import classification and the exporter for the export filing, even when a broker or forwarder prepares the paperwork. Keep a record of how you chose the code.',
    },
    {
      q: 'How often do HS codes change?',
      a: 'The WCO updates the Harmonized System every five to six years, and national tariffs change more often. The US Census Bureau publishes lists of obsolete Schedule B codes during the year, so recheck your codes when a new edition takes effect.',
    },
  ],
  sources: [
    'w4-wco-hs',
    'w4-gov-uk-commodity-codes',
    'w4-usitc-hts-search',
    'w4-census-schedule-b',
    'w4-ecfr-15-cfr-30-6',
    'w4-cbp-importer-tips',
    'w4-ecfr-19-cfr-177-1',
    'trade-gov-export-documents',
    'w4-trade-gov-export-transaction',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: ['/tools/invoice-generator', '/tools/packing-list-generator', '/tools/landed-cost-calculator'],
  callout: {
    afterSection: 2,
    tool: '/tools/invoice-generator',
    title: 'Put the code on every invoice line',
    text: 'Once you have the code, the commercial invoice generator keeps it with the description, quantity and unit on each line, so the invoice and the packing list say the same thing.',
  },
  related: [
    '/blog/commercial-invoice-requirements',
    '/blog/export-documents-checklist',
    '/blog/how-to-ship-internationally-small-business',
    '/blog/packing-list-for-shipping',
  ],
  cover: {
    id: 'cpwP43LnGRk',
    src: 'https://images.unsplash.com/photo-1781899710894-f9ecfea088f3',
    width: 5079,
    height: 3233,
    alt: 'Cardboard parcels beside a label printer, waiting to be described and labelled for shipment',
    caption: 'Parcels and a thermal label printer at a logistics station',
    photographer: { name: 'Karori Production', profile: 'https://unsplash.com/@tomonogi' },
    page: 'https://unsplash.com/photos/brown-shipping-boxes-next-to-a-small-label-printer-cpwP43LnGRk',
  },
};

export default article;
