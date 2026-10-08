import type { SourceFields } from '@/lib/trade/sources';

/**
 * Sources first cited by the wave B guides ispm-15-wood-packaging, how-to-export-from-the-uk and
 * transit-declarations-t1-ncts. Each URL was opened on 2026-10-07 and the cited sentence checked.
 */
export default {
  'b6-ippc-ispm-15': {
    authority: 'International Plant Protection Convention (IPPC), FAO',
    title: 'ISPM 15: Regulation of wood packaging material in international trade',
    url: 'https://www.ippc.int/en/publications/640/',
    jurisdiction: 'International (phytosanitary standard)',
    supports:
      'ISPM 15 describing phytosanitary measures for wood packaging material made from raw wood, including dunnage and excluding wood processed so that it is free from pests, such as plywood',
    retrieved: '2026-10-07',
    reviewer: 'pending owner review',
  },
  'b6-gov-uk-wpm': {
    authority: 'Forestry Commission and Defra (GOV.UK)',
    title: 'Wood packaging material for import and export',
    url: 'https://www.gov.uk/guidance/wood-packaging-material-for-import-and-export',
    jurisdiction: 'United Kingdom (plant health)',
    supports:
      'what counts as wood packaging material, the exclusions (plywood, raw wood 6mm thick or less), debarking tolerances, heat treatment at 56°C for 30 minutes, dielectric heating at 60°C for one minute, fumigation with methyl bromide or sulphuryl fluoride, the mark replacing certificates, the two-letter country code, and producers needing UKWPMMP membership and Forestry Commission registration',
    retrieved: '2026-10-07',
    reviewer: 'pending owner review',
  },
  'b6-gov-uk-wood-packaging-goods': {
    authority: 'Forestry Commission and Defra (GOV.UK)',
    title: 'Wood packaging goods for import and export',
    url: 'https://www.gov.uk/wood-packaging-import-export',
    jurisdiction: 'United Kingdom (plant health)',
    supports:
      'non-compliant packaging being rejected or destroyed, exporters checking whether the destination accepts ISPM 15, specifying packaging requirements in contracts, reuse of undamaged packaging, and re-treatment and re-marking after repair or remanufacture',
    retrieved: '2026-10-07',
    reviewer: 'pending owner review',
  },
  'b6-gov-uk-export-goods': {
    authority: 'HM Revenue & Customs and Department for Business and Trade (GOV.UK)',
    title: 'Export goods from the UK: step by step',
    url: 'https://www.gov.uk/export-goods',
    jurisdiction: 'United Kingdom (export)',
    supports:
      'the official export sequence: checking destination rules and licences, a GB EORI number, deciding who makes the declaration, classifying with a commodity code, the invoice travelling with the goods at the selling price with freight and insurance listed separately, possible VAT zero rating, and keeping commercial invoices and customs paperwork',
    retrieved: '2026-10-07',
    reviewer: 'pending owner review',
  },
  'b6-gov-uk-full-export-declaration': {
    authority: 'HM Revenue & Customs (GOV.UK)',
    title: 'Making a full export declaration',
    url: 'https://www.gov.uk/guidance/making-a-full-export-declaration',
    jurisdiction: 'United Kingdom (export)',
    supports:
      'clearance before goods leave the UK, the minimum lodging times by road, sea, air and rail, the data the declaration needs (procedure code, commodity code, DUCR), and the departure message that makes the declaration evidence of export',
    retrieved: '2026-10-07',
    reviewer: 'pending owner review',
  },
  'b6-gov-uk-transit-check': {
    authority: 'HM Revenue & Customs (GOV.UK)',
    title:
      'Check if you can use transit to move goods to the EU and Common Transit Convention countries',
    url: 'https://www.gov.uk/guidance/check-if-you-can-use-transit-to-move-goods-to-the-eu-and-common-transit-countries',
    jurisdiction: 'United Kingdom (transit)',
    supports:
      'what transit is, delaying full declarations and duties until the movement ends, the Common Transit Convention member list, and TIR for road routes outside it',
    retrieved: '2026-10-07',
    reviewer: 'pending owner review',
  },
  'b6-gov-uk-transit-set-up': {
    authority: 'HM Revenue & Customs (GOV.UK)',
    title: 'Set up your business to move goods out of the UK using transit',
    url: 'https://www.gov.uk/guidance/set-up-your-business-to-move-goods-out-of-the-uk-using-transit',
    jurisdiction: 'United Kingdom (transit)',
    supports:
      'the set-up steps: an EORI number, a transit guarantee, NCTS access, Customs Declaration Service access and optional authorised consignor or consignee status',
    retrieved: '2026-10-07',
    reviewer: 'pending owner review',
  },
  'b6-gov-uk-transit-prepare-gb': {
    authority: 'HM Revenue & Customs (GOV.UK)',
    title: 'Preparing to move your goods out of Great Britain using transit',
    url: 'https://www.gov.uk/guidance/preparing-to-move-your-goods-out-of-great-britain-using-transit',
    jurisdiction: 'United Kingdom (transit)',
    supports:
      'an export declaration normally coming before the transit declaration, movements from Great Britain almost always having T1 status, and the data the NCTS declaration needs (EORI, status, local reference number, guarantee reference, offices, MRN, a time limit of no more than 14 days)',
    retrieved: '2026-10-07',
    reviewer: 'pending owner review',
  },
  'b6-gov-uk-ncts': {
    authority: 'HM Revenue & Customs (GOV.UK)',
    title: 'Use the New Computerised Transit System',
    url: 'https://www.gov.uk/guidance/using-the-new-computerised-transit-system-to-move-goods-across-the-eu-and-efta-countries',
    jurisdiction: 'United Kingdom (transit)',
    supports:
      'NCTS as the online system for UK transit declarations, what you need before using it, the Transit Accompanying Document with its MRN barcode, T2L not being submitted through NCTS, TIR legs in the EU being declared to NCTS, and the MRN issued on acceptance',
    retrieved: '2026-10-07',
    reviewer: 'pending owner review',
  },
  'b6-ec-customs-transit': {
    authority: 'European Commission, Taxation and Customs Union',
    title: 'Customs transit',
    url: 'https://taxation-customs.ec.europa.eu/customs/customs-procedures-import-and-export/customs-transit_en',
    jurisdiction: 'European Union (transit)',
    supports:
      'transit suspending import duties and taxes until destination, Union transit versus common transit, the countries in common transit and their joining dates (the UK since 1 January 2021), and the Transit Manual',
    retrieved: '2026-10-07',
    reviewer: 'pending owner review',
  },
} satisfies Record<string, SourceFields>;
