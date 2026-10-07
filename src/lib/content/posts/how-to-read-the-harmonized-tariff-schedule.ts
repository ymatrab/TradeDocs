import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "harmonized tariff schedule" 6,600, KD 35.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave A (v2 #52).
 */
const article: ContentArticle = {
  slug: 'how-to-read-the-harmonized-tariff-schedule',
  title: 'How to read the Harmonized Tariff Schedule of the United States',
  metaTitle: 'Harmonized Tariff Schedule: how to read a line',
  description:
    'Read an HTS line column by column: heading, statistical suffix, description, unit of quantity, and the General, Special and Column 2 rates, plus the notes that decide which applies.',
  lede: 'The Harmonized Tariff Schedule of the United States is where US import duty rates live, and it is free to search. Finding a line is the easy part; reading it correctly is where people go wrong. This post walks through the columns of an HTS line, the notes that control them, and what to take from it into a landed cost estimate.',
  answer:
    'Read an HTS line left to right: the 8-digit subheading and 2-digit statistical suffix identify the goods, the article description and unit of quantity define them, and the rate columns give General (normal trade relations), Special (trade programs) and Column 2 rates. Section and chapter notes decide which line applies.',
  keyFacts: [
    'The US International Trade Commission publishes the HTS; the edition in force on 7 October 2026 is Revision 20 (2026).',
    'Under HTS General Note 3, rate column 1 has General and Special subcolumns, and column 2 applies to products of Belarus, Cuba, North Korea and Russia.',
    'Under the HTS General Statistical Notes, the 10-digit statistical reporting number combines the 8-digit subheading with a 2-digit statistical suffix.',
    'The HTS General Rules of Interpretation state that titles are for reference only; classification follows the headings and the section and chapter notes.',
    'CBP states that it makes the final determination of the duty rate when goods are entered.',
  ],
  definitions: [
    {
      term: 'Heading and subheading',
      meaning:
        'A heading is a four-digit HS provision; subheadings are the indented provisions under it, down to the 8-digit US tariff line.',
    },
    {
      term: 'Statistical suffix',
      meaning:
        'The last two digits of a 10-digit HTS number, used for US trade statistics and outside the legal text of the tariff.',
    },
    {
      term: 'Ad valorem, specific and compound rates',
      meaning:
        'A percentage of value, an amount per unit such as per kilogram, or a combination of the two.',
    },
    {
      term: 'Special program indicator',
      meaning:
        'The symbol in parentheses after a Special rate, naming the trade agreement or preference program it belongs to.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is the Harmonized Tariff Schedule?',
      paragraphs: [
        'The Harmonized Tariff Schedule of the United States, or HTS, is the US import tariff: the list of every kind of goods with the duty rate that applies when it enters the country. The US International Trade Commission publishes it and keeps it current through numbered revisions; the notes quoted in this post are from Revision 20 (2026). The Foreign Trade Regulations describe the HTSUSA as developed by the USITC for classifying imports.',
        'The HTS is built on the World Customs Organization’s Harmonized System, so the first six digits match the international code. The US adds two digits to make an 8-digit tariff line, which carries the rate, and two statistical digits for reporting. CBP applies the schedule at the border, and its guidance states that CBP makes the final determination of the rate when goods are entered.',
      ],
    },
    {
      heading: 'How is the HTS organised?',
      paragraphs: [
        'From broad to narrow: sections, chapters, four-digit headings, six-digit subheadings, 8-digit US subheadings and 10-digit statistical lines. Each level narrows the goods, and indentation in the article description shows which line sits under which.',
        'Around the lines sit the texts that control them. The General Notes explain the rate columns and the trade programs. The General Rules of Interpretation say how to classify. Each section and chapter has notes that include or exclude goods. Chapter 98 holds special US provisions, such as goods returned after repair or assembly abroad, and chapter 99 holds temporary modifications to the rates.',
      ],
    },
    {
      heading: 'What do the columns on an HTS line mean?',
      paragraphs: [
        'Every line has the same columns. The table describes them in the order they appear, and the worked example after it shows how a reader uses them.',
      ],
      table: {
        caption: 'The columns of an HTS line and what each tells you',
        head: ['Column', 'What it shows', 'What to check'],
        rows: [
          [
            'Heading/Subheading',
            'The 4-, 6- or 8-digit number of the provision',
            'That you are on an 8-digit line, which carries a rate',
          ],
          [
            'Stat. suffix',
            'Two digits that complete the 10-digit statistical number',
            'The suffix whose description fits; it is reported but carries no rate of its own',
          ],
          [
            'Article description',
            'The words defining the goods, indented under their parent lines',
            'Read every parent line above it; the indent is part of the description',
          ],
          [
            'Unit of quantity',
            'The unit the quantity is reported in, such as kg or number',
            'That your invoice and packing list give quantities you can convert to it',
          ],
          [
            'General',
            'The normal trade relations rate for column 1 countries',
            'Whether it is free, a percentage, an amount per unit, or both',
          ],
          [
            'Special',
            'Lower rates under trade programs, each followed by its program symbols',
            'Whether your goods meet every legal requirement of that program',
          ],
          [
            'Column 2',
            'The rate for products of the countries listed in General Note 3(b)',
            'Only relevant if the goods originate in one of those countries',
          ],
        ],
      },
    },
    {
      heading: 'How do you read a rate on a worked example?',
      paragraphs: [
        'Take an invented line whose General rate is 4% ad valorem and whose Special column shows Free followed by one program symbol. For goods from a column 1 country that do not qualify for the program, the General rate applies: 4% of the customs value. If the goods meet every requirement of the program, the Special rate applies instead. General Note 3 says that where goods qualify under more than one program, the lowest rate applies.',
        'The arithmetic is simple once the rate is right. The figures below are invented placeholders; replace them with your own line, your own value and the rate in the current HTS.',
      ],
      table: {
        caption: 'Worked example with an invented tariff line, invented rates and invented values',
        head: ['Item', 'Invented figure', 'How it is used'],
        rows: [
          ['Customs value of the goods', '$10,000', 'The base for an ad valorem rate'],
          ['General rate (column 1)', '4%', '$10,000 × 4% = $400 duty'],
          [
            'Special rate, if the program’s rules are met',
            'Free',
            '$0 duty, with the claim documented',
          ],
          [
            'Specific rate on a different invented line',
            '5 cents per kg on 800 kg',
            '800 × $0.05 = $40 duty',
          ],
        ],
      },
    },
    {
      heading: 'Which notes decide whether a line applies?',
      paragraphs: [
        'The rules, not the search box. The General Rules of Interpretation state that titles of sections and chapters are for reference only, and that classification is determined by the terms of the headings and any section or chapter notes. A search result that looks right can be excluded by a chapter note you have not read.',
        'When goods seem to fit two headings, the rules give an order: the heading with the most specific description is preferred, and mixtures, composite goods and retail sets are classified by the material or component that gives them their essential character. Subheadings are compared only with other subheadings at the same level.',
        'This post explains how to read the schedule; it does not classify any product. For a decision you can rely on, CBP issues binding rulings under 19 CFR Part 177, and its CROSS database shows rulings on similar goods.',
      ],
    },
    {
      heading: 'Is the rate on the line the whole duty?',
      paragraphs: [
        'Not always. General Note 3 provides that goods subject to temporary modification under chapter 99 take the chapter 99 rates for the period it indicates, so a line can carry additional or different duty that does not show in its own rate columns. Check chapter 99 as well as the line itself.',
        'Antidumping and countervailing duties are separate again. CBP’s Form 7501 instructions have their own columns for those case numbers and rates, set by the Department of Commerce. Fees such as the merchandise processing fee are also added at entry. For a landed cost estimate, list each charge separately so you can see what changes when a rate does.',
      ],
    },
    {
      heading: 'How do you take an HTS rate into a landed cost estimate?',
      paragraphs: [
        'Record the rate with its source and date, then apply it to the right base. The steps below keep the estimate traceable.',
      ],
      steps: [
        'Write a full description of the goods and confirm the 10-digit line with your customs broker or a binding ruling.',
        'Note the General, Special and Column 2 rates on the 8-digit line, and the unit of quantity.',
        'Decide which column applies from the country of origin and whether the goods qualify for a program.',
        'Check chapter 99 for any temporary modification in force on your entry date.',
        'Apply an ad valorem rate to the customs value and a specific rate to the quantity in the stated unit.',
        'Enter the duty, fees, freight and insurance in a landed cost calculation, and keep the HTS revision you used.',
      ],
    },
  ],
  faq: [
    {
      q: 'Where can I search the Harmonized Tariff Schedule?',
      a: 'On the US International Trade Commission’s HTS search, which is free and official. The USITC also publishes the General Notes and the General Rules of Interpretation as files for each revision.',
    },
    {
      q: 'What is the difference between an 8-digit and a 10-digit HTS number?',
      a: 'The 8-digit subheading is the tariff line that carries the duty rate. The HTS General Statistical Notes add a 2-digit statistical suffix to make the 10-digit number reported on the entry.',
    },
    {
      q: 'What does “Free” in the Special column mean?',
      a: 'That goods qualifying under the program symbols shown enter duty-free. General Note 3 says the Special rate applies only when all the legal requirements of the program have been met.',
    },
    {
      q: 'Which countries pay Column 2 rates?',
      a: 'General Note 3(b) in Revision 20 (2026) lists Belarus, Cuba, North Korea and Russia. The list can change, so check the General Notes of the current revision.',
    },
    {
      q: 'Does the USITC decide my product’s classification?',
      a: 'No. The USITC publishes the schedule; CBP applies it and makes the final determination at entry. For certainty before importing, request a binding ruling from CBP under 19 CFR Part 177.',
    },
  ],
  sources: [
    'a3-usitc-hts-general-notes',
    'a3-usitc-hts-gri',
    'a3-usitc-hts-stat-notes',
    'w4-usitc-hts-search',
    'w5-ftr-30-1',
    'w3-cbp-duty-rates',
    'w4-cbp-importer-tips',
    'w4-ecfr-19-cfr-177-1',
    'a3-cbp-form-7501',
  ],
  primaryTool: '/tools/landed-cost-calculator',
  tools: ['/tools/landed-cost-calculator', '/tools/invoice-generator', '/tools/incoterms'],
  callout: {
    afterSection: 3,
    tool: '/tools/landed-cost-calculator',
    title: 'Put the rate into a landed cost',
    text: 'Enter the goods value, freight, insurance and the duty rate you read from the HTS, and the landed cost calculator shows the total and the cost per unit.',
  },
  related: [
    '/blog/how-to-calculate-import-duty',
    '/blog/duty-vs-tariff',
    '/blog/how-to-find-hs-code',
    '/guides/hs-vs-hts-vs-schedule-b',
    '/guides/landed-cost',
  ],
  cover: {
    id: 'PUd6C90Isp0',
    src: 'https://images.unsplash.com/photo-1631557776808-91908aba7ca0',
    width: 4240,
    height: 2384,
    alt: 'A pen resting on a pile of printed pages, ready for working through a long reference schedule',
    caption: 'A pen on a stack of printed papers',
    photographer: { name: '2H Media', profile: 'https://unsplash.com/@2hmedia' },
    page: 'https://unsplash.com/photos/a-pen-sitting-on-top-of-a-pile-of-papers-PUd6C90Isp0',
  },
};

export default article;
