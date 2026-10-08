import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-09';

const term: GlossaryTerm = {
  slug: 'etd',
  term: 'ETD (estimated time of departure)',
  abbreviation: 'ETD',
  aliases: ['estimated time of departure', 'ETD shipping', 'ETD meaning'],
  demand: {
    keyword: 'etd meaning',
    market: 'US',
    volume: 2_900,
    kd: 9,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'ETD meaning in shipping: estimated departure',
  description:
    'What ETD means on a booking or shipping schedule, why it moves, which export deadlines count back from departure, and how ETD differs from ETA and the cargo cut-off.',
  shortDefinition:
    'ETD, or estimated time of departure, is the date and time a carrier expects a vessel, aircraft or truck to leave the port or terminal of loading. It is a forecast that changes with the schedule, not a promise.',
  definition: [
    'In shipping, ETD is the carrier’s current forecast for when the transport leaves its place of loading. A shipping line publishes it on the sailing schedule and the booking confirmation; an airline or forwarder gives it for the flight; a haulier gives it for the truck. Once the vessel or aircraft has actually left, the forecast is replaced by the actual time of departure, often written ATD.',
    'ETD moves. Port congestion, weather, a late previous call or a change of vessel can push it back, and the carrier will reissue the schedule. That matters because several steps are timed from departure or loading rather than from the date on your invoice. Under the U.S. Foreign Trade Regulations, Electronic Export Information for air cargo is due no later than two hours before the scheduled departure of the aircraft, and for vessel cargo twenty-four hours before loading at the U.S. port. On the import side, CBP wants the Importer Security Filing no later than 24 hours before the cargo is laden aboard the vessel at the foreign port.',
    'The ETD is also not the last moment to deliver goods. The terminal or warehouse sets an earlier cargo cut-off, and the documentation cut-off is earlier again.',
  ],
  onYourDocuments: [
    'ETD rarely appears on a commercial invoice or packing list. You see it on the carrier’s booking confirmation and sailing schedule, in the forwarder’s quotation and shipping instructions, and in tracking updates. Some exporters add an expected shipment date to a proforma invoice so the buyer can plan payment, but that is a commercial estimate, not the carrier’s ETD.',
    'Treat the bill of lading or air waybill as the record of what happened: the on-board or flight date there is what a letter of credit and most contracts look at, not the ETD you were quoted.',
  ],
  example: {
    caption: 'Worked example with an invented exporter and schedule',
    paragraphs: [
      'Larchfield Ceramics (invented) books a 20ft container from Savannah to Rotterdam. The booking confirmation gives an ETD of Thursday 18:00 and a cargo cut-off of Tuesday 12:00. Larchfield’s forwarder files the EEI on Monday, comfortably more than twenty-four hours before loading.',
      'On Wednesday the carrier moves the ETD to Saturday because the vessel is running late. The goods are already at the terminal, so nothing changes for Larchfield except the date it gives its buyer, and the bill of lading later shows the actual on-board date.',
    ],
  },
  confusedWith: [
    {
      term: 'ETA (estimated time of arrival)',
      difference:
        'ETA is the forecast for reaching the port of discharge or destination. ETD is the forecast for leaving the port of loading; a delay to the ETD usually pushes the ETA too.',
    },
    {
      term: 'Cargo cut-off',
      difference:
        'The cut-off is the latest time the terminal accepts your goods or documents for that departure. It comes before the ETD, often by a day or more for sea freight.',
    },
  ],
  related: [
    'port-of-loading-and-discharge',
    'arrival-notice',
    '/guides/eei-aes-filing-itn',
    '/guides/isf-10-2',
    '/blog/freight-quote-checklist',
  ],
  tool: '/tools/packing-list-generator',
  toolPitch:
    'The packing list generator gives the forwarder the carton counts, weights and marks it needs before the cut-off for your ETD.',
  faq: [
    {
      q: 'What does ETD mean in shipping?',
      a: 'Estimated time of departure: when the carrier expects the vessel, aircraft or truck to leave the port or terminal of loading. It is updated as the schedule changes and replaced by the actual departure time once the transport leaves.',
    },
    {
      q: 'What is the difference between ETD and ETA?',
      a: 'ETD is the expected time of leaving the origin port; ETA is the expected time of arriving at the destination port. Both are forecasts from the carrier and both can change.',
    },
  ],
  sources: ['e4-ftr-30-4-timing', 'e4-cfr-19-149-2-isf'],
  regulated: false,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
