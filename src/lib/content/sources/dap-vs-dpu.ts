import type { SourceFields } from '@/lib/trade/sources';

const RETRIEVED = '2026-10-08';
const PENDING = 'pending owner review';

/**
 * Sources first cited by the wave D Incoterms and freight batch: dap-vs-dpu, fob-vs-cfr,
 * incoterms-for-air-freight, ocean-freight-surcharges and freight-quote-checklist. Each URL was
 * opened and the claim checked on the retrieval date. Carrier surcharge pages that did not load
 * (Hapag-Lloyd, DHL glossary) are not cited.
 */
export default {
  'd3-cfr-46-520-3': {
    authority: 'Legal Information Institute, Cornell Law School (Code of Federal Regulations)',
    title: '46 CFR § 520.3: Publication responsibilities',
    url: 'https://www.law.cornell.edu/cfr/text/46/520.3',
    jurisdiction: 'United States (ocean transportation in the US foreign trades)',
    supports:
      'common carriers and conferences keeping open for public inspection, in automated tariff systems, tariffs showing all their rates, charges, classifications, rules and practices, and being able to use publishers to do so',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd3-cfr-46-520-8': {
    authority: 'Legal Information Institute, Cornell Law School (Code of Federal Regulations)',
    title: '46 CFR § 520.8: Effective dates',
    url: 'https://www.law.cornell.edu/cfr/text/46/520.8',
    jurisdiction: 'United States (ocean transportation in the US foreign trades)',
    supports:
      'a new or changed rate or charge that increases a shipper’s cost not taking effect earlier than thirty calendar days after publication, and a change that decreases cost being able to take effect on publication',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd3-fmc-voccs': {
    authority: 'Federal Maritime Commission (FMC)',
    title: 'Vessel-Operating Common Carriers',
    url: 'https://www.fmc.gov/resources-services/vessel-operating-common-carriers',
    jurisdiction: 'United States (ocean transportation in the US foreign trades)',
    supports:
      'all VOCCs having to publish a tariff open for public inspection showing all rates, charges, classifications, rules and practices, and having to give the public free access to their tariff publication system',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd3-wko-seafreight-terms': {
    authority: 'Austrian Federal Economic Chamber (WKO), Fachverband Spedition und Logistik',
    title: 'Seafreight terms',
    url: 'https://wko.at/oe/transport-verkehr/spedition-logistik/seafreight-terms',
    jurisdiction: 'International (freight forwarding trade glossary)',
    supports:
      'BAF as the bunker adjustment factor balancing changing fuel costs, CAF as the currency adjustment factor, THC as the terminal handling charge for handling the container, the congestion surcharge for waiting time in ports, and demurrage and detention as separate container charges',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd3-trade-gov-shipping-options': {
    authority: 'International Trade Administration, U.S. Department of Commerce',
    title: 'Shipping Options',
    url: 'https://www.trade.gov/shipping-options',
    jurisdiction: 'United States (export guidance)',
    supports:
      'freight forwarders helping exporters prepare price quotations by advising on freight costs, port charges, consular fees, special documentation and insurance; their handling fees belonging in the price charged to the customer; their reserving space on a vessel, aircraft, train or truck; and their licensing by IATA for air freight and by the FMC for ocean freight',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
