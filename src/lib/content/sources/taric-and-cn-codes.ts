import type { SourceFields } from '@/lib/trade/sources';

const RETRIEVED = '2026-10-08';
const PENDING = 'pending owner review';

/**
 * Sources first cited by the wave B posts taric-and-cn-codes, proforma-invoice-for-customs,
 * cn22-vs-cn23, declared-value-for-customs and container-load-plan. Each URL was opened on
 * 2026-10-08 and the cited sentence checked.
 */
export default {
  'b3-ec-taric': {
    authority: 'European Commission, Taxation and Customs Union',
    title: 'EU customs tariff (TARIC)',
    url: 'https://taxation-customs.ec.europa.eu/customs-4/calculation-customs-duties/customs-tariff/eu-customs-tariff-taric_en',
    jurisdiction: 'European Union',
    supports:
      'TARIC as a multilingual database integrating EU tariff measures (third-country duties, tariff suspensions, quotas, anti-dumping duties, import and export prohibitions), its legal basis in Council Regulation (EEC) No 2658/87 and its daily transmission to EU countries',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b3-ec-combined-nomenclature': {
    authority: 'European Commission, Taxation and Customs Union',
    title: 'Combined Nomenclature',
    url: 'https://taxation-customs.ec.europa.eu/customs-4/calculation-customs-duties/customs-tariff/combined-nomenclature_en',
    jurisdiction: 'European Union',
    supports:
      'the CN as an eight-digit code with a description and a duty rate, built on the WCO Harmonized System, used to classify most goods declared to customs in the EU, and republished every year as a regulation in the Official Journal',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b3-ec-customs-tariff': {
    authority: 'European Commission, Taxation and Customs Union',
    title: 'Customs tariff',
    url: 'https://taxation-customs.ec.europa.eu/customs-4/calculation-customs-duties/customs-tariff_en',
    jurisdiction: 'European Union',
    supports:
      'the Common Customs Tariff applying to goods imported from non-EU countries, and TARIC being a working tariff that is not itself a piece of legislation',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b3-ec-tariff-classification': {
    authority: 'European Commission, Taxation and Customs Union',
    title: 'Tariff classification of goods',
    url: 'https://taxation-customs.ec.europa.eu/customs/common-customs-tariff-cct/tariff-classification-goods_en',
    jurisdiction: 'European Union',
    supports:
      'tariff classification as determining a CN subheading or further subdivision, the CN as the EU’s eight-digit coding system, and the public EBTI database of binding tariff information decisions',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b3-ec-bti-quick-info': {
    authority: 'European Commission, Taxation and Customs Union',
    title: 'Binding Tariff Information: quick info (PDF)',
    url: 'https://taxation-customs.ec.europa.eu/system/files/2019-03/04_taxud_ucc_binding_tariff_information_quick_info_en.pdf',
    jurisdiction: 'European Union',
    supports:
      'the HS as a six-digit code managed by the WCO, each CN subheading having an eight-digit code, TARIC having at least 10 and up to 24 digits, and a BTI decision being issued by a member state on request, binding on all member states and the holder, valid for 3 years and declared in the customs declaration',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b3-ec-taric-consultation': {
    authority: 'European Commission, Taxation and Customs Union',
    title: 'TARIC consultation: search by goods code and geographical area',
    url: 'https://ec.europa.eu/taxation_customs/dds2/taric/taric_consultation.jsp?Lang=en',
    jurisdiction: 'European Union',
    supports:
      'searching TARIC measures by goods code, origin or destination and reference date, the advice to try the first six digits and browse when a code is not found, four-character additional codes, and the warning that data for a future date may be incomplete',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b3-cfr-19-141-83': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 141.83, via Cornell LII',
    title: '19 CFR § 141.83 — Type of invoice required',
    url: 'https://www.law.cornell.edu/cfr/text/19/141.83',
    jurisdiction: 'United States (import)',
    supports:
      'paragraph (d): no commercial invoice being required for listed classes of goods, including goods not intended for sale, goods returned after repair abroad and goods for US government agencies; the importer presenting any invoice or bill it has, and otherwise filing a pro forma invoice under 141.85 with information adequate to examine the goods and determine duties',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b3-cfr-19-141-91': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 141.91, via Cornell LII',
    title: '19 CFR § 141.91 — Invoice not available',
    url: 'https://www.law.cornell.edu/cfr/text/19/141.91',
    jurisdiction: 'United States (import)',
    supports:
      'entry without the required invoice only where CBP is satisfied the failure is beyond the importer’s control, with a written declaration, a pro forma invoice under 141.85 if no seller’s invoice exists, a bond on CBP Form 301, and the invoice produced within 120 days of the entry summary (50 days where it is needed only for statistics)',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b3-gov-uk-export-goods': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'Export goods from the UK: step by step',
    url: 'https://www.gov.uk/export-goods',
    jurisdiction: 'United Kingdom (export)',
    supports:
      'using the selling price on the invoice, or the market value of the goods if they are not being sold, listing freight and export insurance included in the price separately, the invoice travelling with the goods, and keeping commercial invoices and customs paperwork',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b3-gov-uk-free-of-charge-goods': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'Customs valuation: free of charge goods',
    url: 'https://www.gov.uk/guidance/customs-valuation/free-charge-goods',
    jurisdiction: 'United Kingdom (import)',
    supports:
      'gifts, samples and promotional items supplied free of charge not being sales, Method 1 (transaction value) not applying to them, and their value usually being found under Method 6',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b3-gov-uk-vat-records': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'Charge, reclaim and record VAT: keeping VAT records',
    url: 'https://www.gov.uk/charge-reclaim-record-vat/keeping-vat-records',
    jurisdiction: 'United Kingdom (VAT)',
    supports:
      'VAT not being reclaimable on an invalid invoice, a pro-forma invoice, a statement or a delivery note',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
