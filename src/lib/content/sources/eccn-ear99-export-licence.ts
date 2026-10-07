import type { SourceFields } from '@/lib/trade/sources';

const RETRIEVED = '2026-10-07';
const PENDING = 'pending owner review';

/**
 * Sources first cited by the wave A guides eccn-ear99-export-licence, importer-of-record,
 * uk-commodity-codes and demurrage-and-detention. Each URL was opened on 2026-10-07 and the
 * cited sentence checked.
 */
export default {
  'a5-bis-license-needed': {
    authority: 'Bureau of Industry and Security (BIS), U.S. Department of Commerce',
    title: 'Do I need a license?',
    url: 'https://www.bis.gov/licensing/do-i-need-license',
    jurisdiction: 'United States (export controls, EAR)',
    supports:
      'the licence check as a review of what the item is, where it goes, who receives it and its end use, then classification, country guidance, end-use and end-user controls, licence exceptions and applying through SNAP-R',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a5-bis-country-guidance': {
    authority: 'Bureau of Industry and Security (BIS), U.S. Department of Commerce',
    title: 'Country guidance',
    url: 'https://www.bis.gov/licensing/country-guidance',
    jurisdiction: 'United States (export controls, EAR)',
    supports:
      'the Commerce Country Chart showing whether a licence is required from the reason for control and the destination, and that it does not apply to Cuba, Iran, North Korea and Syria, which parts 742 and 746 of the EAR cover',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a5-ear-758-6': {
    authority:
      'Bureau of Industry and Security, Export Administration Regulations (15 CFR 758.6), via Cornell LII',
    title:
      '15 CFR § 758.6 — Destination control statement and other information furnished to consignees',
    url: 'https://www.law.cornell.edu/cfr/text/15/758.6',
    jurisdiction: 'United States (export controls, EAR)',
    supports:
      'the destination control statement required on the commercial invoice when items on the Commerce Control List are shipped, other than EAR99 items, and the ECCNs that must also be shown for certain items',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a5-usc-19-1484': {
    authority: 'U.S. Code, Title 19, § 1484, via Cornell LII',
    title: '19 U.S. Code § 1484 — Entry of merchandise',
    url: 'https://www.law.cornell.edu/uscode/text/19/1484',
    jurisdiction: 'United States (imports)',
    supports:
      'the importer of record as the owner or purchaser of the merchandise or a designated licensed customs broker, making entry using reasonable care and filing the declared value, classification and rate of duty',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a5-cfr-19-141-1': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 141.1, via Cornell LII',
    title: '19 CFR § 141.1 — Liability of importer for duties',
    url: 'https://www.law.cornell.edu/cfr/text/19/141.1',
    jurisdiction: 'United States (imports)',
    supports:
      'duty liability as a personal debt of the importer to the United States, not discharged by paying a broker who fails to pay CBP, and a bond not relieving the importer of liability',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a5-cfr-19-141-18': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 141.18, via Cornell LII',
    title: '19 CFR § 141.18 — Entry by nonresident corporation',
    url: 'https://www.law.cornell.edu/cfr/text/19/141.18',
    jurisdiction: 'United States (imports)',
    supports:
      'a nonresident corporation making entry needing a resident agent authorised to accept service of process and a bond on CBP Form 301 with a resident corporate surety',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a5-cfr-19-142-4': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 142.4, via Cornell LII',
    title: '19 CFR § 142.4 — Bond requirements at the time of entry',
    url: 'https://www.law.cornell.edu/cfr/text/19/142.4',
    jurisdiction: 'United States (imports)',
    supports:
      'merchandise not being released at entry unless a single entry or continuous bond on CBP Form 301 has been filed, with a limited waiver for some entries up to $2,500',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a5-gov-uk-psr-commodity-codes': {
    authority: 'HM Revenue & Customs (GOV.UK)',
    title:
      'Checking the origin of your goods using product specific rules when trading between the UK and EU',
    url: 'https://www.gov.uk/guidance/using-the-harmonised-system-and-product-specific-rules-for-trade-between-the-uk-and-eu',
    jurisdiction: 'United Kingdom',
    supports:
      'classifying goods to a 10-digit commodity code when importing into the UK and an 8-digit code when exporting, and the chapter (2-digit), heading (4-digit) and subheading (6-digit) levels',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a5-gov-uk-cds-commodity-codes': {
    authority: 'HM Revenue & Customs (GOV.UK)',
    title: 'Using commodity codes and related additional codes in the Customs Declaration Service',
    url: 'https://www.gov.uk/guidance/using-commodity-codes-and-related-additional-codes-in-the-customs-declaration-service',
    jurisdiction: 'United Kingdom',
    supports:
      'data element 6/14 carrying the first 8 digits of the commodity code used for imports and exports, and data element 6/15 carrying digits 9 and 10, which can affect duty and measures',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a5-gov-uk-atar': {
    authority: 'HM Revenue & Customs (GOV.UK)',
    title: 'Apply for an Advance Tariff Ruling',
    url: 'https://www.gov.uk/guidance/apply-for-an-advance-tariff-ruling',
    jurisdiction: 'United Kingdom (Great Britain)',
    supports:
      'the Advance Tariff Ruling as a legally binding decision on the commodity code for importing into or exporting from Great Britain, one application per type of goods, no retrospective decisions, and a response in 30 to 120 days',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a5-gov-uk-classification-help': {
    authority: 'HM Revenue & Customs (GOV.UK)',
    title: 'Ask HMRC for help classifying your goods',
    url: 'https://www.gov.uk/guidance/ask-hmrc-for-advice-on-classifying-your-goods',
    jurisdiction: 'United Kingdom',
    supports:
      'the HMRC Tariff Classification Service giving non-legally binding advice by email, one email per product, usually within 5 working days',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a5-fmc-detention-demurrage': {
    authority: 'Federal Maritime Commission (FMC)',
    title: 'Detention and Demurrage',
    url: 'https://www.fmc.gov/detention-and-demurrage/',
    jurisdiction: 'United States (ocean shipping)',
    supports:
      'detention as a charge for extended use of intermodal equipment and demurrage as accruing when a container exceeds free time on a marine terminal',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a5-cfr-46-541-3': {
    authority: 'Federal Maritime Commission, 46 CFR 541.3, via Cornell LII',
    title: '46 CFR § 541.3 — Definitions',
    url: 'https://www.law.cornell.edu/cfr/text/46/541.3',
    jurisdiction: 'United States (ocean shipping)',
    supports:
      'demurrage or detention as charges, including per diem, assessed by ocean carriers, marine terminal operators or NVOCCs for the use of terminal space or containers, and the billing and billed party definitions',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a5-cfr-46-541-5': {
    authority: 'Federal Maritime Commission, 46 CFR 541.5, via Cornell LII',
    title: '46 CFR § 541.5 — Failure to include required information',
    url: 'https://www.law.cornell.edu/cfr/text/46/541.5',
    jurisdiction: 'United States (ocean shipping)',
    supports:
      'a demurrage or detention invoice missing any of the required minimum information eliminating the billed party’s obligation to pay the charge',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a5-cfr-46-541-6': {
    authority: 'Federal Maritime Commission, 46 CFR 541.6, via Cornell LII',
    title: '46 CFR § 541.6 — Contents of invoice',
    url: 'https://www.law.cornell.edu/cfr/text/46/541.6',
    jurisdiction: 'United States (ocean shipping)',
    supports:
      'the minimum contents of a demurrage or detention invoice: bill of lading and container numbers, port of discharge, allowed free time and its start and end, the dates charged, contact details and the dispute process',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a5-cfr-46-541-7': {
    authority: 'Federal Maritime Commission, 46 CFR 541.7, via Cornell LII',
    title: '46 CFR § 541.7 — Issuance of demurrage and detention invoices',
    url: 'https://www.law.cornell.edu/cfr/text/46/541.7',
    jurisdiction: 'United States (ocean shipping)',
    supports:
      'invoices issued within 30 calendar days from the date the charge was last incurred, and the billed party not being required to pay a charge invoiced late',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a5-cfr-46-541-8': {
    authority: 'Federal Maritime Commission, 46 CFR 541.8, via Cornell LII',
    title: '46 CFR § 541.8 — Requests for fee mitigation, refund, or waiver',
    url: 'https://www.law.cornell.edu/cfr/text/46/541.8',
    jurisdiction: 'United States (ocean shipping)',
    supports:
      'the billed party having at least 30 calendar days from the invoice date to request mitigation, refund or waiver, and the billing party attempting to resolve it within 30 calendar days',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
