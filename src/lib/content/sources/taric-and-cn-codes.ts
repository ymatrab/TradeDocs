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
} satisfies Record<string, SourceFields>;
