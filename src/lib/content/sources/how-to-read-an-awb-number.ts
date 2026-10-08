import type { SourceFields } from '@/lib/trade/sources';

const RETRIEVED = '2026-10-09';

/**
 * Sources for wave E, group 1 (content-plan-v4-2026-10-08.md): how-to-read-an-awb-number,
 * container-number-format, bill-of-lading-number, air-waybill-vs-bill-of-lading and
 * packing-list-vs-bill-of-lading. One file for the five posts, ids prefixed `e1-`.
 */
export default {
  'e1-cfr-19-122-48a-awb-number': {
    authority: 'U.S. Customs and Border Protection (19 CFR 122.48a), via Cornell LII',
    title: '19 CFR § 122.48a — Electronic information for air cargo required in advance of arrival',
    url: 'https://www.law.cornell.edu/cfr/text/19/122.48a',
    jurisdiction: 'United States (air cargo arriving)',
    supports:
      'the air waybill number and the master air waybill number being the IATA standard 11-digit number, and the house air waybill number being up to 12 alphanumeric characters whose letters may not be dropped when transmitted',
    retrieved: RETRIEVED,
    reviewer: 'pending owner review',
  },
  'e1-iata-dg-autocheck-awb': {
    authority: 'International Air Transport Association (IATA)',
    title: 'DG AutoCheck help: Air Waybill number validation',
    url: 'https://dgautocheck.iata.org/help/AirWaybillnumbervalidation.html',
    jurisdiction: 'International air cargo (industry practice)',
    supports:
      'an IATA standard air waybill number being 11 digits written 000-00000000, with the 11th digit a check digit calculated as an unweighted modulus 7',
    retrieved: RETRIEVED,
    reviewer: 'pending owner review',
  },
  'e1-abf-awb-check-digit': {
    authority: 'Australian Border Force (Integrated Cargo System software developers guide)',
    title: 'Check digit algorithms: Air Waybill number validation',
    url: 'https://www.abf.gov.au/sdg-subsite/Pages/Check-Digit-Algorithms/Air-Waybill-Number-Validation.aspx',
    jurisdiction: 'Australia (cargo reporting); describes the IATA number structure',
    supports:
      'the air waybill number being the issuing carrier’s three-digit IATA airline code, a seven-digit serial number and a check digit, the check digit being the remainder when the serial number is divided by 7, with a worked example',
    retrieved: RETRIEVED,
    reviewer: 'pending owner review',
  },
  'e1-bic-check-digit': {
    authority: 'Bureau International des Containers (BIC)',
    title: 'Check digit calculator',
    url: 'https://www.bic-code.org/check-digit-calculator/',
    jurisdiction: 'International container identification (ISO 6346)',
    supports:
      'a container number being a three-letter owner prefix, a one-letter equipment category identifier (U for freight containers, J for detachable container-related equipment, Z for trailers and chassis), a six-digit serial number and a check digit calculated from the prefix and serial that validates recording and transmission, recalculated when a container is re-marked with another code',
    retrieved: RETRIEVED,
    reviewer: 'pending owner review',
  },
  'e1-bic-codes': {
    authority: 'Bureau International des Containers (BIC)',
    title: 'BIC Codes (container prefixes)',
    url: 'https://www.bic-code.org/bic-codes/',
    jurisdiction: 'International container identification (ISO 6346)',
    supports:
      'the BIC code, also known as the ISO 6346 container prefix, being a three-letter owner or operator code plus a fourth equipment letter, six serial digits and a check digit; the register being originated by BIC, adopted by ISO in 1972 and maintained by BIC; only registered codes being usable as a unique identity marking in international documents; and ISO 6346 also covering size and type codes',
    retrieved: RETRIEVED,
    reviewer: 'pending owner review',
  },
  'e1-cfr-19-4-7a': {
    authority: 'U.S. Customs and Border Protection (19 CFR 4.7a), via Cornell LII',
    title: '19 CFR § 4.7a — Inward manifest; information required; alternative forms',
    url: 'https://www.law.cornell.edu/cfr/text/19/4.7a',
    jurisdiction: 'United States (imports by vessel)',
    supports:
      'every bill of lading, whether issued by a carrier, freight forwarder or other issuer, carrying a unique identifier of up to 16 characters that starts with the issuer’s four-character SCAC and is not reused for 3 years; the cargo declaration stating the master or house bill numbers, the quantity of the lowest external packaging unit (containers and pallets not acceptable), the weight, a precise description (generic descriptions not acceptable), container numbers and seal numbers',
    retrieved: RETRIEVED,
    reviewer: 'pending owner review',
  },
  'e1-nmfta-scac': {
    authority: 'National Motor Freight Traffic Association (NMFTA)',
    title: 'Standard Carrier Alpha Code (SCAC)',
    url: 'https://scac.nmfta.org/',
    jurisdiction: 'United States and North America (carrier identification)',
    supports:
      'the SCAC being the freight industry’s universal carrier identifier, issued and governed exclusively by the NMFTA',
    retrieved: RETRIEVED,
    reviewer: 'pending owner review',
  },
} satisfies Record<string, SourceFields>;
