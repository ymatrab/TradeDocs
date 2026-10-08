import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'country-of-origin',
  term: 'Country of origin',
  abbreviation: 'COO',
  aliases: ['origin', 'country of manufacture', 'made in', 'non-preferential origin'],
  demand: {
    keyword: 'country of origin',
    market: 'US',
    volume: 12_100,
    kd: 9,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'Country of origin meaning on trade documents',
  description:
    'What country of origin means in customs, how substantial transformation decides it, why it can differ from the country you ship from, and where it goes on the commercial invoice.',
  shortDefinition:
    'The country of origin is the country where goods were made, grown or produced, or, when several countries were involved, where they last underwent a substantial transformation into a new article. It is not necessarily the country they are shipped from.',
  definition: [
    'Origin is the goods’ economic nationality. The World Trade Organization calls rules of origin the criteria used to define where a product was made, and explains why they matter: quotas, preferential tariffs, anti-dumping and countervailing duties, trade statistics and “made in” labels all depend on it.',
    'Goods made entirely in one country take that country’s origin. When materials from several countries are combined, the question becomes where the last substantial transformation happened. U.S. Customs puts it this way in 19 CFR 134.1: the country of origin is the country of manufacture, production or growth, and work done in a second country makes that country the origin only if it substantially transforms the article. Repacking or relabelling alone generally does not, because the article stays what it was.',
    'There are two sets of rules. Non-preferential origin applies to every import, for marking, statistics and trade remedies. Preferential origin applies only under a trade agreement, whose own rules decide whether goods qualify for a reduced duty. Ireland’s Revenue adds the practical warning that origin may differ from the country you import from.',
  ],
  onYourDocuments: [
    'The commercial invoice should state the country of origin, ideally for each line, because a shipment can mix goods from several countries. Write the country where the goods were made, not the country of the seller or the port of loading.',
    'The same origin should appear wherever it is printed: the invoice, the import declaration your buyer’s broker files, and the marking on the goods or their outer container, which the destination may require. A mismatch between them is one of the questions customs ask first. Evidence for preferential origin is a separate matter that follows the trade agreement’s own rules.',
  ],
  example: {
    caption: 'Worked example with invented parties',
    paragraphs: [
      'Prairie Outfitters (invented) of Minnesota sells two products to a shop in Canada. Its wool blankets are woven and finished in Minnesota, so their origin is the United States. Its headlamps are bought complete from a factory in Vietnam and only repacked in Minneapolis, so their origin stays Vietnam.',
      'Prairie’s invoice lists the blankets with origin “United States” and the headlamps with origin “Vietnam”, though both ship from the same U.S. warehouse.',
    ],
  },
  confusedWith: [
    {
      term: 'Country of export',
      difference:
        'The country of export is where the shipment leaves from. The country of origin is where the goods were made, and the two differ whenever goods are re-exported unchanged.',
    },
  ],
  related: [
    '/blog/commercial-invoice-requirements',
    '/blog/how-to-fill-out-a-commercial-invoice',
    '/blog/commercial-invoice-and-packing-list-must-match',
    'anti-dumping-duty',
    '/blog/shipping-marks',
  ],
  tool: '/tools/invoice-generator',
  toolPitch:
    'The commercial invoice generator takes a country of origin on every line and never fills it in from the sender’s address, so mixed-origin shipments are declared correctly.',
  faq: [
    {
      q: 'Is the country of origin where the goods are shipped from?',
      a: 'Not necessarily. It is where the goods were made or last substantially transformed. Goods bought abroad and shipped on unchanged keep their original country of origin.',
    },
    {
      q: 'Does repackaging change the country of origin?',
      a: 'Generally not. Under the substantial transformation test, origin moves only when the work done turns the goods into a new article; repacking or relabelling alone normally leaves it where it was.',
    },
  ],
  sources: [
    'd5-wto-licensing-and-origin',
    'b7-cfr-19-134-1',
    'a1-cornell-19-cfr-134-11',
    'd5-revenue-new-to-customs',
  ],
  regulated: true,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
