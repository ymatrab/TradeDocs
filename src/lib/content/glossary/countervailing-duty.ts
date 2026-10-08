import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'countervailing-duty',
  term: 'Countervailing duty (CVD)',
  abbreviation: 'CVD',
  aliases: ['CVD', 'anti-subsidy duty', 'countervailing measure', 'AD/CVD'],
  demand: {
    keyword: 'countervailing duty',
    market: 'US',
    volume: 720,
    kd: 15,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'Countervailing duty (CVD): how anti-subsidy duties work',
  description:
    'What a countervailing duty is, how an investigation decides whether one is imposed, who collects it in the United States, and what it means for your invoice and landed cost.',
  shortDefinition:
    'A countervailing duty (CVD) is an extra import duty an importing country charges on goods found, after an investigation, to benefit from subsidies in the exporting country and to be injuring its domestic industry. It is meant to offset the subsidy.',
  definition: [
    'Countervailing duties come from the WTO Agreement on Subsidies and Countervailing Measures. The WTO explains that a country hurt by another’s subsidies can either use dispute settlement to seek the subsidy’s withdrawal, or launch its own investigation and ultimately charge extra duty, known as countervailing duty, on subsidized imports found to be hurting domestic producers.',
    'Only some subsidies count. The agreement applies its disciplines to specific subsidies, those available only to an enterprise, an industry or a group of them, and divides them into prohibited subsidies, such as those tied to export targets, and actionable ones that must be shown to have an adverse effect. Countervailing duty, the WTO notes, is the parallel of anti-dumping duty: it can be charged only after a detailed investigation, with rules on calculating the subsidy, judging injury and the duration of the measure, normally five years. A subsidized exporter may instead agree to raise its export price.',
    'In the United States the work is split. The Department of Commerce investigates the subsidy, the U.S. International Trade Commission decides whether the domestic industry is materially injured, and CBP collects the duties, starting with cash deposits after affirmative preliminary determinations.',
  ],
  onYourDocuments: [
    'There is no CVD field on a commercial invoice. A countervailing duty order covers a defined product from a named country, so an importer’s broker needs an exact description of the goods, the manufacturer’s and exporter’s names, and the country of origin to decide whether an order applies.',
    'On a U.S. import CBP collects the duty through the entry, and its AD/CVD pages link the case information and the list of orders in effect that brokers check. Ask the buyer or its broker before you quote, because an order can change the landed cost of a sale even though nothing on your invoice changes.',
  ],
  example: {
    caption: 'Worked example with invented parties; no real case or rate is shown',
    paragraphs: [
      'Harborview Supply (invented) plans to import a steel product from a country whose producers are the subject of a countervailing duty order. Its broker checks the product description and the producer named on the supplier’s invoice against the order’s scope and finds the goods are covered. Harborview includes the cash deposit in its landed cost before accepting the supplier’s quote.',
    ],
  },
  confusedWith: [
    {
      term: 'Anti-dumping duty',
      difference:
        'An anti-dumping duty offsets an export price below normal value. A countervailing duty offsets a government subsidy. The investigations run in parallel and the same goods can face both.',
    },
    {
      term: 'Safeguard measure',
      difference:
        'A safeguard restricts imports temporarily when a surge seriously injures a domestic industry, whether or not anything unfair has happened. A CVD requires a subsidy.',
    },
  ],
  related: ['/blog/duty-vs-tariff', '/blog/how-to-calculate-import-duty', '/guides/landed-cost', 'importing'],
  tool: '/tools/landed-cost-calculator',
  toolPitch:
    'The landed cost calculator lets you add a duty rate your broker confirms and see what it does to the total cost of a shipment.',
  faq: [
    {
      q: 'Who pays a countervailing duty?',
      a: 'The importer of record pays it to the importing country’s customs authority when the goods are entered. In the United States CBP collects it, once the Department of Commerce has found a subsidy.',
    },
    {
      q: 'How long does a countervailing duty last?',
      a: 'The WTO agreement sets rules on how long countervailing measures last, normally five years. The importing country’s authorities decide whether a particular measure is reviewed or ends.',
    },
  ],
  sources: ['c6-wto-trade-remedies', 'c6-trade-gov-adcvd-faq', 'c6-cbp-adcvd'],
  regulated: true,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
