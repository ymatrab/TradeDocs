import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "taric" 1,900, KD 8; "cn code" 140, KD 23.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave B (v2 #53).
 */
const article: ContentArticle = {
  slug: 'taric-and-cn-codes',
  title: 'TARIC and CN codes: how the EU extends the HS code',
  metaTitle: 'TARIC and CN codes: the EU tariff explained',
  description:
    'What TARIC and the Combined Nomenclature are, how the 6-digit HS code becomes an 8-digit CN code and a 10-digit TARIC code, and how to look one up for an EU shipment.',
  lede: 'Sell to a buyer in the European Union and their customs broker will talk about CN codes and TARIC. Both grow out of the same six-digit HS code you may already print on your invoice. This post explains what each one is, who keeps it, how the digits stack up and how to check a code yourself in the European Commission’s free TARIC tool.',
  answer:
    'TARIC is the European Union’s integrated tariff database, kept by the European Commission. It builds on the Combined Nomenclature, the EU’s eight-digit goods code, which itself extends the six-digit Harmonized System. TARIC adds further digits and codes for EU measures such as suspensions, quotas and anti-dumping duties, giving a code of at least 10 digits.',
  keyFacts: [
    'The European Commission describes TARIC as a multilingual database integrating all measures relating to EU customs tariff, commercial and agricultural legislation.',
    'Each Combined Nomenclature subheading has an eight-digit code, a description and a duty rate, according to the European Commission.',
    'The Commission’s binding tariff information guidance states that TARIC builds on the CN and has at least 10 and up to 24 digits.',
    'Annex I to Council Regulation (EEC) No 2658/87, the Combined Nomenclature, is republished every year as a regulation in the EU’s Official Journal.',
    'A binding tariff information (BTI) decision is binding on all EU member states and on its holder, and is valid for 3 years, according to the Commission.',
  ],
  definitions: [
    {
      term: 'HS code',
      meaning:
        'The six-digit code of the World Customs Organization’s Harmonized System, the shared base of national tariffs.',
    },
    {
      term: 'CN code (Combined Nomenclature)',
      meaning:
        'The EU’s eight-digit goods code: the six HS digits plus two digits of EU detail, used to classify goods declared to EU customs.',
    },
    {
      term: 'TARIC code',
      meaning:
        'The CN code plus further digits, and where needed additional codes, that identify which EU measures apply to the goods.',
    },
    {
      term: 'BTI (binding tariff information)',
      meaning:
        'A written classification decision issued by an EU member state’s customs on request, binding on the holder and on customs.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is TARIC?',
      paragraphs: [
        'TARIC is the integrated tariff of the European Union: a multilingual database that the European Commission keeps so every EU country applies the same measures to the same goods. The Commission lists what it brings together, including third-country duties, autonomous tariff suspensions, tariff quotas, anti-dumping duties and import or export prohibitions.',
        'TARIC is a working tool, not a law in itself. The Commission’s customs tariff page calls it a kind of working tariff that is not actually a piece of legislation; the measures it shows come from the regulations behind them, starting with Council Regulation (EEC) No 2658/87. TARIC data is transmitted daily to the national customs administrations of EU countries, so the database reflects changes quickly.',
      ],
    },
    {
      heading: 'What is a CN code?',
      paragraphs: [
        'A CN code is the eight-digit code of the Combined Nomenclature, the EU’s goods classification for its customs tariff and trade statistics. The Commission describes it as a further development of the World Customs Organization’s Harmonized System, and states that each CN subheading has an eight-digit code followed by a description and a duty rate.',
        'The CN is the legal tariff. It is Annex I to Council Regulation (EEC) No 2658/87, and the Commission explains that this annex is updated and republished every year as a stand-alone regulation in the Official Journal. Updates follow changes agreed at the WCO for the HS, changes agreed at the WTO for duty rates, and EU policy or statistical needs. A code that was right last year may have moved, so check the edition in force on the date of the shipment.',
      ],
    },
    {
      heading: 'How do HS, CN and TARIC codes fit together?',
      paragraphs: [
        'Each one keeps the digits of the one before it and adds detail. The Commission’s binding tariff information guidance sets out the layers: the HS is a six-digit code managed by the WCO, the CN adds two digits for an eight-digit code, and TARIC builds further on the CN with at least 10 digits. The TARIC consultation tool also uses four-character additional codes for measures that need more detail than the digits allow.',
      ],
      table: {
        caption: 'The three layers of an EU goods code, by who keeps them',
        head: ['Layer', 'Digits', 'What it adds', 'Kept by'],
        rows: [
          [
            'HS code',
            '6',
            'The international heading and subheading',
            'World Customs Organization',
          ],
          [
            'CN code',
            '8',
            'EU subheadings, with a description and duty rate',
            'European Commission (Council Regulation 2658/87)',
          ],
          [
            'TARIC code',
            '10 or more',
            'Further subdivisions for EU measures such as quotas and suspensions',
            'European Commission (TARIC database)',
          ],
        ],
      },
    },
    {
      heading: 'Which code should go on an invoice for an EU buyer?',
      paragraphs: [
        'Ask the buyer or their customs broker which level they want. The import declaration is made in the EU, so the EU side chooses the code and answers for it. Many buyers want the six-digit HS code on your invoice and add the EU digits themselves; others ask for the full CN or TARIC code they have already settled on. Print what they confirm, and keep the description detailed enough that a customs officer can check the code against the goods.',
        'Do not copy a supplier’s or a competitor’s code. HMRC’s guidance on commodity codes makes the general point that only the first six digits are used worldwide and that product-specific decisions are particular to each country. A national code from your own tariff, such as a US HTS or Schedule B number, will usually differ from the EU code after the sixth digit.',
      ],
    },
    {
      heading: 'How do you look up a code in TARIC?',
      paragraphs: [
        'Use the European Commission’s TARIC consultation tool, which is free and lets you search measures by goods code, by country of origin or destination and by date. It does not classify goods for you; it shows the measures attached to a code you have already found.',
      ],
      steps: [
        'Write a plain description of the goods: what they are, what they are made of, what they do and how they are presented. Leave out brand names and part numbers.',
        'Find the six-digit HS subheading first. If the TARIC tool does not recognise a longer code, it suggests entering the first six digits and browsing the nomenclature from there.',
        'Browse down to the eight-digit CN subheading and read the section and chapter notes above it, which can include or exclude goods.',
        'Choose the country of origin of the goods and the date the goods will be declared. Measures can apply to some origins only, and the tool warns that data for a future date may be incomplete.',
        'Read the measures listed for the code: duties, suspensions, quotas, anti-dumping duties, prohibitions and any additional codes they need.',
        'Send the result to your buyer or their broker to confirm, and record the code, the date and the origin you used.',
      ],
    },
    {
      heading: 'What is binding tariff information, and when is it worth having?',
      paragraphs: [
        'A BTI decision is a written classification ruling from an EU member state’s customs, issued on request. The Commission’s quick guide states that it gives the holder legal certainty about the classification of the goods, binds all member states and the holder, is valid throughout the EU and lasts 3 years. Because it binds the holder, it must be declared in the customs declaration when it is used.',
        'It is most useful when a product sits between two headings with different treatment, or when the same goods will be imported for years. The Commission’s guide says customs checks that the application carries the applicant’s EORI number and concerns one type of goods. The Commission also runs a public version of the EBTI database, where valid decisions can be consulted without their confidential details. Reading decisions for similar goods can show how customs reasons, but a decision issued to someone else does not bind customs for your goods.',
      ],
    },
    {
      heading: 'Is the UK Trade Tariff the same as TARIC?',
      paragraphs: [
        'No. Goods entering the United Kingdom are classified in the UK’s own tariff, and HMRC’s guidance points importers and exporters to its Trade Tariff tool to find the commodity code. The shared ground is the first six digits; the digits after them, and the measures attached, are set in each tariff separately. If you ship to both the UK and the EU, check each code in the tariff of the country receiving the goods.',
      ],
    },
  ],
  faq: [
    {
      q: 'How many digits does a TARIC code have?',
      a: 'At least 10, according to the European Commission’s binding tariff information guidance, and up to 24 where additional codes are used. The first eight digits are the CN code, and the first six of those are the HS code.',
    },
    {
      q: 'Is a CN code the same as an HS code?',
      a: 'No. A CN code keeps the six HS digits and adds two EU digits, so it has eight. The Commission describes the CN as a further development of the WCO’s Harmonized System.',
    },
    {
      q: 'Does TARIC show the VAT due on imported goods?',
      a: 'TARIC is built around tariff, commercial and agricultural measures. For import VAT, check the destination country’s tax authority or ask the buyer’s customs broker.',
    },
    {
      q: 'Can I use the CN code from last year’s invoice?',
      a: 'Only after checking it. The Combined Nomenclature is republished every year as a regulation in the Official Journal, so codes can split, merge or move between editions.',
    },
    {
      q: 'Who decides the TARIC code for my goods?',
      a: 'The code is declared on the EU import declaration, so the importer and its customs representative answer for it. A BTI decision from an EU customs authority is the way to get a classification that binds customs.',
    },
  ],
  sources: [
    'b3-ec-taric',
    'b3-ec-combined-nomenclature',
    'b3-ec-customs-tariff',
    'b3-ec-tariff-classification',
    'b3-ec-bti-quick-info',
    'b3-ec-taric-consultation',
    'w5-wco-hs',
    'w4-gov-uk-commodity-codes',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: [
    '/tools/invoice-generator',
    '/tools/landed-cost-calculator',
    '/tools/proforma-invoice-generator',
  ],
  callout: {
    afterSection: 3,
    tool: '/tools/invoice-generator',
    title: 'Put the confirmed code on every line',
    text: 'The commercial invoice generator prints a commodity code beside the description, quantity and value of each line, so the code your EU buyer confirmed travels with the goods.',
  },
  related: [
    '/blog/how-to-find-hs-code',
    '/guides/uk-commodity-codes',
    '/guides/hs-vs-hts-vs-schedule-b',
    '/blog/how-to-calculate-import-duty',
    '/guides/eori-number',
  ],
  cover: {
    id: 'BxihMxFAvZs',
    src: 'https://images.unsplash.com/photo-1782233541827-987d32e6198d',
    width: 4403,
    height: 2935,
    alt: 'Road border crossing into the European Union with the French and EU flags flying beside it',
    caption: 'A road border crossing with the French and EU flags, below mountains',
    photographer: { name: 'Laura Chouette', profile: 'https://unsplash.com/@laurachouette' },
    page: 'https://unsplash.com/photos/border-crossing-with-french-and-eu-flags-near-mountains-BxihMxFAvZs',
  },
};

export default article;
