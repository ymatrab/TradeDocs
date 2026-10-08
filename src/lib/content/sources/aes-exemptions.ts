import type { SourceFields } from '@/lib/trade/sources';

/**
 * Sources first cited by the wave D articles aes-exemptions, uk-export-licence,
 * letter-of-credit-documents, phytosanitary-certificate, export-health-certificate and
 * shipping-to-northern-ireland. Each URL was opened on 2026-10-08 and the cited sentence checked.
 */
const RETRIEVED = '2026-10-08';
const PENDING = 'pending owner review';

export default {
  'd4-ecfr-15-30-2': {
    authority: 'U.S. Census Bureau, Foreign Trade Regulations (15 CFR 30.2), via eCFR',
    title: '15 CFR § 30.2 — General requirements for filing Electronic Export Information',
    url: 'https://www.ecfr.gov/current/title-15/subtitle-B/chapter-I/part-30/subpart-A/section-30.2',
    jurisdiction: 'United States (export reporting)',
    supports:
      'the shipments for which EEI must be filed regardless of value and notwithstanding the subpart D exemptions (BIS, DDTC, DEA, NRC and other agency licences, ITAR items, rough diamonds, used self-propelled vehicles), and the four filing methods',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd4-ecfr-15-30-35': {
    authority: 'U.S. Census Bureau, Foreign Trade Regulations (15 CFR 30.35), via eCFR',
    title: '15 CFR § 30.35 — Procedure for shipments exempt from filing requirements',
    url: 'https://www.ecfr.gov/current/title-15/subtitle-B/chapter-I/part-30/subpart-D/section-30.35',
    jurisdiction: 'United States (export reporting)',
    supports:
      'the exemption legend on the first page of the bill of lading, air waybill or other commercial loading document and on the carrier’s outbound manifest, citing the section that provides the exemption',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd4-ecfr-15-30-36': {
    authority: 'U.S. Census Bureau, Foreign Trade Regulations (15 CFR 30.36), via eCFR',
    title: '15 CFR § 30.36 — Exemption for shipments destined to Canada',
    url: 'https://www.ecfr.gov/current/title-15/subtitle-B/chapter-I/part-30/subpart-D/section-30.36',
    jurisdiction: 'United States (export reporting)',
    supports:
      'the exemption for shipments whose country of ultimate destination is Canada, and its exceptions for goods stored in Canada for third countries or moving through Canada to a third destination',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd4-ecfr-15-30-37': {
    authority: 'U.S. Census Bureau, Foreign Trade Regulations (15 CFR 30.37), via eCFR',
    title: '15 CFR § 30.37 — Miscellaneous exemptions',
    url: 'https://www.ecfr.gov/current/title-15/subtitle-B/chapter-I/part-30/subpart-D/section-30.37',
    jurisdiction: 'United States (export reporting)',
    supports:
      'the $2,500 per Schedule B or HTSUSA line exemption and how lines are aggregated, tools of trade, unlicensed technology and software, temporary exports returned within one year, goods imported under a temporary import bond, baggage and personal effects, and the Census Bureau’s authority to require reporting of normally exempt shipments',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd4-ecfr-15-30-appendix-b': {
    authority:
      'U.S. Census Bureau, Foreign Trade Regulations (15 CFR part 30, appendix B), via eCFR',
    title: 'Appendix B to Part 30 — AES Filing Citation, Exemption and Exclusion Legends',
    url: 'https://www.ecfr.gov/current/title-15/subtitle-B/chapter-I/part-30/appendix-Appendix%20B%20to%20Part%2030',
    jurisdiction: 'United States (export reporting)',
    supports:
      'the format of the proof of filing citation (AES plus ITN) and of the NOEEI exemption legends for Canada, low-value lines, the miscellaneous exemptions and the government exemptions',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
