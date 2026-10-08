import type { SourceFields } from '@/lib/trade/sources';

/**
 * Sources first cited by wave E group 4: the glossary terms etd, unit-load-device, devanning,
 * port-of-loading-and-discharge and arrival-notice. Each URL was opened on the retrieval date
 * and checked against the claim in `supports`. None of them is cited for a duty rate or fee.
 * UNECE's own pages refused automated retrieval, so the UN/LOCODE structure is cited from the
 * EU maritime agency's data model and the UN/EDIFACT message from a public directory mirror.
 */
const RETRIEVED = '2026-10-09';
const PENDING = 'pending owner review';

export default {
  'e4-ftr-30-4-timing': {
    authority: 'U.S. Census Bureau, Foreign Trade Regulations (15 CFR 30.4), via Cornell LII',
    title:
      '15 CFR § 30.4 — Electronic Export Information filing procedures, deadlines, and certification statements',
    url: 'https://www.law.cornell.edu/cfr/text/15/30.4',
    jurisdiction: 'United States (export reporting)',
    supports:
      'EEI for vessel cargo filed twenty-four hours before the cargo is loaded on the vessel at the U.S. port of lading, and for air cargo no later than two hours before the scheduled departure time of the aircraft',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e4-cfr-19-149-2-isf': {
    authority: 'U.S. Customs and Border Protection (19 CFR 149.2), via Cornell LII',
    title: '19 CFR § 149.2 — Importer security filing; general requirement',
    url: 'https://www.law.cornell.edu/cfr/text/19/149.2',
    jurisdiction: 'United States (ocean imports)',
    supports:
      'the Importer Security Filing submitted no later than 24 hours before the cargo is laden aboard the vessel at the foreign port',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e4-iata-uld-ops': {
    authority: 'International Air Transport Association (IATA)',
    title: 'Unit Load Devices (ULD)',
    url: 'https://www.iata.org/en/programs/cargo/cargo-operations/unit-load-devices/',
    jurisdiction: 'International (air cargo)',
    supports:
      'a ULD as either an aircraft pallet and pallet net combination or an aircraft container; ULDs as removable aircraft parts subject to civil aviation authority requirements that must be structurally capable of restraining the load in flight; the IATA ULD Regulations covering technical and operational standards',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e4-iata-uldr': {
    authority: 'International Air Transport Association (IATA)',
    title: 'ULD Regulations (ULDR)',
    url: 'https://www.iata.org/en/publications/manuals/uld-regulations',
    jurisdiction: 'International (air cargo)',
    supports:
      'the ULD as an aircraft container or an aircraft pallet with a pallet net for grouping and restraining cargo, mail and baggage; the ULDR covering the IATA ULD ID Code, registered ULD type codes, pallet and net compatibility and marking of the ULD ID Code',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e4-imo-ctu-code': {
    authority: 'International Maritime Organization (IMO), with ILO and UNECE',
    title: 'IMO/ILO/UNECE Code of Practice for Packing of Cargo Transport Units (CTU Code)',
    url: 'https://www.imo.org/en/OurWork/Safety/Pages/CTU-Code.aspx',
    jurisdiction: 'International (non-mandatory code of practice)',
    supports:
      'the CTU Code applying throughout the intermodal transport chain and giving guidance not only to those who pack and secure cargo but also to those who receive and unpack the units',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e4-cfr-19-118-1-ces': {
    authority: 'U.S. Customs and Border Protection (19 CFR 118.1), via Cornell LII',
    title: '19 CFR § 118.1 — Definition (centralized examination station)',
    url: 'https://www.law.cornell.edu/cfr/text/19/118.1',
    jurisdiction: 'United States (imports)',
    supports:
      'a centralized examination station as a privately operated facility, not in the charge of a Customs officer, at which merchandise is made available to Customs officers for physical examination',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e4-cfr-19-4-7a-ports': {
    authority: 'U.S. Customs and Border Protection (19 CFR 4.7a), via Cornell LII',
    title: '19 CFR § 4.7a — Inward manifest; information required; alternative forms',
    url: 'https://www.law.cornell.edu/cfr/text/19/4.7a',
    jurisdiction: 'United States (ocean imports)',
    supports:
      'the inward cargo declaration listing cargo by U.S. port of discharge and in bill of lading number sequence, and reporting the foreign port where the cargo is laden on board and the first foreign port where the carrier takes possession of the cargo',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e4-ftr-30-6-ports': {
    authority: 'U.S. Census Bureau, Foreign Trade Regulations (15 CFR 30.6), via Cornell LII',
    title: '15 CFR § 30.6 — Electronic Export Information data elements (ports)',
    url: 'https://www.law.cornell.edu/cfr/text/15/30.6',
    jurisdiction: 'United States (export reporting)',
    supports:
      'the port of export as the CBP seaport or airport where the goods are loaded on the carrier taking them out of the United States, reported from Schedule D; and the foreign port of unlading as the foreign port where the goods are removed from the exporting conveyance, which need not be in the country of ultimate destination, reported for vessel exports from Schedule K',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e4-emsa-unlocode': {
    authority:
      'European Maritime Safety Agency (EMSA), CISE data model, describing UNECE UN/LOCODE',
    title: 'PortLocation: LocationCode attribute',
    url: 'https://emsa.europa.eu/cise-documentation/cise-data-model-1.5.3/model/info/PortLocation_LocationCode.html',
    jurisdiction: 'International (UN/LOCODE, as used in EU maritime data)',
    supports:
      'the UN/LOCODE five-character code element for a port or location: two letters for the country from ISO 3166 and three characters for the location within the country, for example NOOSL for Oslo',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e4-unedifact-iftman': {
    authority: 'UN/CEFACT, UN/EDIFACT directory D.17B (via the edifactory.de directory mirror)',
    title: 'IFTMAN — Arrival notice message',
    url: 'https://www.edifactory.de/edifact/directory/D17B/message/IFTMAN',
    jurisdiction: 'International (trade data interchange standard)',
    supports:
      'the arrival notice as a message from the party providing forwarding or transport services to the party indicated in the contract, giving notice and details of the arrival of the consignment',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e4-cfr-19-4-37-general-order': {
    authority: 'U.S. Customs and Border Protection (19 CFR 4.37), via Cornell LII',
    title: '19 CFR § 4.37 — General order merchandise',
    url: 'https://www.law.cornell.edu/cfr/text/19/4.37',
    jurisdiction: 'United States (ocean imports)',
    supports:
      'unentered cargo remaining at the place of unlading until the fifteenth calendar day after landing, after which the carrier must notify Customs and a bonded warehouse and relinquish custody of the merchandise to a General Order warehouse',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
