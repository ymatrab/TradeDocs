import type { SourceFields } from '@/lib/trade/sources';

/**
 * Sources first cited by the wave B guides freight-forwarder-vs-customs-broker, customs-value,
 * types-of-bill-of-lading, chargeable-weight and isf-10-2. Each URL was opened on 2026-10-07
 * and the cited sentence checked.
 */
const RETRIEVED = '2026-10-07';
const PENDING = 'pending owner review';

export default {
  'b5-usc-46-40102': {
    authority: 'U.S. Code (46 U.S.C. § 40102, Shipping Act definitions), via Cornell LII',
    title: '46 U.S. Code § 40102 — Definitions',
    url: 'https://www.law.cornell.edu/uscode/text/46/40102',
    jurisdiction: 'United States (ocean shipping in foreign commerce)',
    supports:
      'the ocean freight forwarder as a person in the US that dispatches shipments via a common carrier, books space on behalf of shippers and processes the documentation; the NVOCC as a common carrier that does not operate the vessels and is a shipper in its relationship with an ocean common carrier; and an ocean transportation intermediary being either of the two',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b5-cfr-46-515-2': {
    authority: 'Federal Maritime Commission (46 CFR 515.2), via Cornell LII',
    title: '46 CFR § 515.2 — Definitions',
    url: 'https://www.law.cornell.edu/cfr/text/46/515.2',
    jurisdiction: 'United States (ocean transportation intermediaries)',
    supports:
      'the freight forwarding services an ocean freight forwarder may provide, including booking space, preparing export documents and the EEI, processing bills of lading and arranging cargo insurance, and the NVOCC services, including issuing bills of lading',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b5-cfr-46-515-3': {
    authority: 'Federal Maritime Commission (46 CFR 515.3), via Cornell LII',
    title: '46 CFR § 515.3 — License; when required',
    url: 'https://www.law.cornell.edu/cfr/text/46/515.3',
    jurisdiction: 'United States (ocean transportation intermediaries)',
    supports:
      'no person in the United States acting as an ocean transportation intermediary without a valid licence issued by the Federal Maritime Commission',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b5-fmc-oti': {
    authority: 'Federal Maritime Commission (FMC)',
    title: 'Ocean Transportation Intermediaries',
    url: 'https://www.fmc.gov/resources-services/ocean-transportation-intermediaries/',
    jurisdiction: 'United States (ocean transportation intermediaries)',
    supports:
      'OTIs being ocean freight forwarders or NVOCCs regulated under the Shipping Act of 1984, the forwarder’s licence and proof of financial responsibility, and the NVOCC issuing its own house bill of lading while being a shipper in its relationship with the vessel-operating carrier',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b5-cbp-customs-brokers': {
    authority: 'U.S. Customs and Border Protection (CBP)',
    title: 'Customs Brokers',
    url: 'https://www.cbp.gov/trade/programs-administration/customs-brokers',
    jurisdiction: 'United States (imports)',
    supports:
      'customs brokers being licensed under 19 U.S.C. 1641 and 19 CFR Part 111 to conduct customs business on behalf of other persons',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b5-cfr-19-111-1': {
    authority: 'U.S. Customs and Border Protection (19 CFR 111.1), via Cornell LII',
    title: '19 CFR § 111.1 — Definitions',
    url: 'https://www.law.cornell.edu/cfr/text/19/111.1',
    jurisdiction: 'United States (customs brokers)',
    supports:
      'customs business as transactions with CBP on entry, admissibility, classification, valuation and payment of duties, and preparing documents to be filed with CBP; and a freight forwarder as a person dispatching shipments in foreign commerce and handling their formalities on behalf of others',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b5-cfr-19-111-2': {
    authority: 'U.S. Customs and Border Protection (19 CFR 111.2), via Cornell LII',
    title: '19 CFR § 111.2 — License and permit required',
    url: 'https://www.law.cornell.edu/cfr/text/19/111.2',
    jurisdiction: 'United States (customs brokers)',
    supports:
      'a licence being required to transact customs business as a broker, and an importer acting solely on its own account not needing one',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b5-cfr-19-111-36': {
    authority: 'U.S. Customs and Border Protection (19 CFR 111.36), via Cornell LII',
    title: '19 CFR § 111.36 — Relations with unlicensed persons',
    url: 'https://www.law.cornell.edu/cfr/text/19/111.36',
    jurisdiction: 'United States (customs brokers)',
    supports:
      'a broker being allowed to compensate a freight forwarder for referring brokerage business, on condition that the importer is told in advance the name of the broker the forwarder selected',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b5-cfr-19-141-46': {
    authority: 'U.S. Customs and Border Protection (19 CFR 141.46), via Cornell LII',
    title: '19 CFR § 141.46 — Power of attorney retained by customhouse broker',
    url: 'https://www.law.cornell.edu/cfr/text/19/141.46',
    jurisdiction: 'United States (imports)',
    supports:
      'a broker having to obtain a valid power of attorney before transacting customs business in the name of its principal, and keeping it rather than filing it with CBP',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b5-wco-valuation': {
    authority: 'World Customs Organization (WCO)',
    title: 'Valuation — overview',
    url: 'https://www.wcoomd.org/en/topics/valuation/overview.aspx',
    jurisdiction: 'International (WTO Valuation Agreement)',
    supports:
      'the customs value being the taxable basis for ad valorem duties and also used for trade statistics, tariff preferences and national taxes, and the WTO Valuation Agreement being the Agreement on Implementation of Article VII of the GATT 1994',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b5-hmrc-customs-value': {
    authority: 'HM Revenue & Customs (GOV.UK)',
    title: 'Working out the customs value of your imported goods',
    url: 'https://www.gov.uk/guidance/how-to-value-your-imports-for-customs-duty-and-trade-statistics',
    jurisdiction: 'United Kingdom (imports)',
    supports:
      'the UK customs value being used for Customs Duty, import VAT and trade statistics, worked out with valuation Methods 1 to 6, and the Advance Valuation Ruling',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b5-ucc-7-104': {
    authority: 'Legal Information Institute, Cornell Law School (Uniform Commercial Code)',
    title: 'UCC § 7-104 — Negotiable and nonnegotiable document of title',
    url: 'https://www.law.cornell.edu/ucc/7/7-104',
    jurisdiction: 'United States (state commercial law, uniform text)',
    supports:
      'a document of title being negotiable if the goods are to be delivered to bearer or to the order of a named person, and nonnegotiable otherwise or when it carries a conspicuous nonnegotiable legend',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b5-hague-visby-art-3': {
    authority: 'UK Parliament, via legislation.gov.uk',
    title: 'Carriage of Goods by Sea Act 1971, Schedule (the Hague-Visby Rules), Article III',
    url: 'https://www.legislation.gov.uk/ukpga/1971/19/schedule',
    jurisdiction: 'United Kingdom (sea carriage under bills of lading)',
    supports:
      'the carrier issuing, on the shipper’s demand, a bill showing the marks, the number of packages or weight and the apparent order and condition of the goods, and a “shipped” bill once the goods are loaded',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b5-dcsa-ebl': {
    authority: 'Digital Container Shipping Association (DCSA)',
    title: 'Electronic Bill of Lading (eBL) standard',
    url: 'https://dcsa.org/standards/ebill-of-lading',
    jurisdiction: 'Carrier industry standards body (ocean container shipping)',
    supports:
      'original bills of lading being couriered to the importer to present at collection of the goods, and the electronic telex release for original bills and paperless sea waybills as the current alternatives',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b5-cfr-19-149-1': {
    authority: 'U.S. Customs and Border Protection (19 CFR 149.1), via Cornell LII',
    title: '19 CFR § 149.1 — Definitions',
    url: 'https://www.law.cornell.edu/cfr/text/19/149.1',
    jurisdiction: 'United States (imports by vessel)',
    supports:
      'the ISF Importer as the party causing goods to arrive by vessel, being the owner, purchaser, consignee or agent such as a licensed customs broker, and the carrier or NVOCC for cargo remaining on board',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b5-cfr-19-149-2': {
    authority: 'U.S. Customs and Border Protection (19 CFR 149.2), via Cornell LII',
    title: '19 CFR § 149.2 — Importer security filing: requirement, time of transmission, update',
    url: 'https://www.law.cornell.edu/cfr/text/19/149.2',
    jurisdiction: 'United States (imports by vessel)',
    supports:
      'the ISF filed electronically in English for vessel cargo; eight elements no later than 24 hours before lading at the foreign port; stuffing location and consolidator no later than 24 hours before US arrival; best-available data for four elements; and the duty to update or withdraw the filing',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b5-cfr-19-149-3': {
    authority: 'U.S. Customs and Border Protection (19 CFR 149.3), via Cornell LII',
    title: '19 CFR § 149.3 — Data elements',
    url: 'https://www.law.cornell.edu/cfr/text/19/149.3',
    jurisdiction: 'United States (imports by vessel)',
    supports:
      'the ten ISF data elements for goods to be entered, given per six-digit HTSUS line at the house bill level, and the five elements for FROB, IE and T&E shipments',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b5-cfr-19-149-5': {
    authority: 'U.S. Customs and Border Protection (19 CFR 149.5), via Cornell LII',
    title: '19 CFR § 149.5 — Eligibility to file an Importer Security Filing, authorized agents',
    url: 'https://www.law.cornell.edu/cfr/text/19/149.5',
    jurisdiction: 'United States (imports by vessel)',
    supports:
      'the ISF Importer needing a bond (such as a basic importation and entry bond or an ISF bond), the agent being able to post its bond, and agents keeping powers of attorney',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b5-cfr-19-113-62': {
    authority: 'U.S. Customs and Border Protection (19 CFR 113.62), via Cornell LII',
    title: '19 CFR § 113.62 — Basic importation and entry bond conditions',
    url: 'https://www.law.cornell.edu/cfr/text/19/113.62',
    jurisdiction: 'United States (imports)',
    supports:
      'the bond condition to comply with the Importer Security Filing requirements of part 149, with liquidated damages of $5,000 for each violation',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b5-cfr-19-4-7c': {
    authority: 'U.S. Customs and Border Protection (19 CFR 4.7c), via Cornell LII',
    title: '19 CFR § 4.7c — Vessel stow plan',
    url: 'https://www.law.cornell.edu/cfr/text/19/4.7c',
    jurisdiction: 'United States (imports by vessel)',
    supports:
      'the incoming carrier submitting a vessel stow plan no later than 48 hours after the vessel departs the last foreign port',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b5-cfr-19-4-7d': {
    authority: 'U.S. Customs and Border Protection (19 CFR 4.7d), via Cornell LII',
    title: '19 CFR § 4.7d — Container status messages',
    url: 'https://www.law.cornell.edu/cfr/text/19/4.7d',
    jurisdiction: 'United States (imports by vessel)',
    supports:
      'the incoming carrier submitting container status messages for containers arriving by vessel, where it creates or collects them in its equipment tracking system',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
