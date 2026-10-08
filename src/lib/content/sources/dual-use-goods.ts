import type { SourceFields } from '@/lib/trade/sources';

/**
 * Sources first cited by wave E group 6, the regulated glossary terms dual-use-goods,
 * import-quota, most-favoured-nation-tariff, inward-processing and temporary-admission. Each URL
 * was opened on the retrieval date and checked against the claim in `supports`. None of them is
 * cited for a duty rate, and none is used to classify goods.
 */
const RETRIEVED = '2026-10-08';
const PENDING = 'pending owner review';

export default {
  'e6-ec-dual-use-exporting': {
    authority: 'European Commission, Directorate-General for Trade',
    title: 'Exporting dual-use items',
    url: 'https://policy.trade.ec.europa.eu/help-exporters-and-importers/exporting-dual-use-items_en',
    jurisdiction: 'European Union (export controls)',
    supports:
      'dual-use items as goods, software and technology that can be used for both civilian and military applications; Regulation (EU) 2021/821 as the EU export control regime with a common EU list in Annex I, updated by delegated regulations; licences granted by national competent authorities; and the EU general export authorisations, national general authorisations, global licences and individual licences',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e6-eu-reg-2021-821': {
    authority: 'European Parliament and Council, via EUR-Lex',
    title:
      'Regulation (EU) 2021/821 setting up a Union regime for the control of exports, brokering, technical assistance, transit and transfer of dual-use items (recast)',
    url: 'https://eur-lex.europa.eu/eli/reg/2021/821/oj/eng',
    jurisdiction: 'European Union (export controls)',
    supports:
      'Article 2(1) defining dual-use items as items, including software and technology, which can be used for both civil and military purposes; Article 3 requiring an authorisation to export items listed in Annex I; Article 4 requiring an authorisation for non-listed items when the competent authority informs the exporter of a sensitive end use, and the exporter’s duty to notify when it is aware of one; and Article 12 on the competent authority of the Member State where the exporter is resident or established granting individual and global authorisations',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e6-ear-730-3': {
    authority:
      'Bureau of Industry and Security, Export Administration Regulations (15 CFR 730.3), via Cornell LII',
    title: '15 CFR § 730.3 — “Dual use” exports',
    url: 'https://www.law.cornell.edu/cfr/text/15/730.3',
    jurisdiction: 'United States (export controls, EAR)',
    supports:
      'a dual-use item as one with civil applications as well as terrorism and military or weapons of mass destruction related applications, and the EAR not being limited to dual-use items: it also covers purely civilian items and some items used only for military purposes that the ITAR does not control',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e6-wto-quantitative-restrictions': {
    authority: 'World Trade Organization (WTO), Market access',
    title: 'Quantitative restrictions',
    url: 'https://www.wto.org/english/tratop_e/markacc_e/qr_e.htm',
    jurisdiction: 'International (WTO members)',
    supports:
      'GATT 1994 Article XI as the main provision on quantitative restrictions, covering prohibitions or restrictions other than duties, taxes or other charges made effective through quotas, import or export licences or other measures; its general elimination of them; the specific circumstances in which they are allowed (Articles XI:2, XII, XX and XXI, and waivers); and members notifying the restrictions they maintain',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e6-wto-principles-mfn': {
    authority: 'World Trade Organization (WTO), Understanding the WTO',
    title: 'Principles of the trading system',
    url: 'https://www.wto.org/english/thewto_e/whatis_e/tif_e/fact2_e.htm',
    jurisdiction: 'International (WTO members)',
    supports:
      'most-favoured-nation treatment meaning that a member granting one trading partner a special favour, such as a lower customs duty rate, must do the same for all other WTO members; MFN as the first article of the GATT; the exceptions allowed under strict conditions for free trade agreements, special market access for developing countries and barriers against products considered to be traded unfairly; and national treatment applying only once goods have entered the market',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e6-wto-tariffs': {
    authority: 'World Trade Organization (WTO), Trade topics',
    title: 'Tariffs',
    url: 'https://www.wto.org/english/tratop_e/tariffs_e/tariffs_e.htm',
    jurisdiction: 'International (WTO members)',
    supports:
      'customs duties on merchandise imports being called tariffs; members listing their commitments to cut and bind tariffs in goods schedules; and tariff data being of two types, bound rates (the ceilings in members’ schedules) and applied rates (the rates members currently charge, which can be lower)',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e6-gov-uk-inward-processing-apply': {
    authority: 'HM Revenue & Customs, GOV.UK',
    title: 'Apply to delay or pay less duty on goods you import to process or repair',
    url: 'https://www.gov.uk/guidance/apply-to-delay-or-pay-less-duty-on-goods-you-import-to-process-or-repair',
    jurisdiction: 'United Kingdom (customs special procedures)',
    supports:
      'authorised inward processing meaning no Customs Duty or import VAT on goods imported from outside the UK and re-exported, duty and VAT possibly due if processed goods stay in the UK; applicants being established in the UK with an EORI number and a good compliance history and checking whether a guarantee or import licence is needed; the application details (commodity codes, valuation method on release to free circulation, quantities, the process, processing time, processed products and rate of yield, records); authorisation periods of up to 3 years for sensitive goods and 5 years for others; and the economic conditions test',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e6-gov-uk-inward-processing-using': {
    authority: 'HM Revenue & Customs, GOV.UK',
    title: 'Using inward processing to process or repair your goods',
    url: 'https://www.gov.uk/guidance/using-inward-processing-to-process-or-repair-your-goods',
    jurisdiction: 'United Kingdom (customs special procedures)',
    supports:
      'what a holder can do while goods are under inward processing, including using equivalent goods, aircraft construction and repair and temporarily exporting goods for further processing, and the separate guidance on moving processed goods into free circulation or re-exporting them',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e6-gov-uk-ta-definition': {
    authority: 'HM Revenue & Customs, Customs technical handbook, GOV.UK',
    title: 'Special procedure: temporary admission — Definition of Temporary Admission',
    url: 'https://www.gov.uk/guidance/temporary-admission-customs-technical-handbook/definition-of-temporary-admission',
    jurisdiction: 'United Kingdom (customs special procedures)',
    supports:
      'temporary admission as a customs special procedure allowing goods to be imported into the UK temporarily for a specific use with relief from import duty and VAT when its conditions are met, such as professional equipment, sporting goods, means of transport and items for auction, exhibition or demonstration, and goods under it having to be put to a specific use, not altered except for maintenance, and re-exported within a set period',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e6-gov-uk-ta-import-temporarily': {
    authority: 'HM Revenue & Customs, GOV.UK',
    title: 'Import goods to the UK temporarily',
    url: 'https://www.gov.uk/guidance/import-goods-to-the-uk-or-eu-temporarily',
    jurisdiction: 'United Kingdom (customs special procedures)',
    supports:
      'a temporary admission authorisation letting imported goods stay in the UK, in most cases for up to 24 months, before re-export without paying import duty or VAT; the need to apply for authorisation; shorter or longer limits for some goods set out in a table; and moving goods within or between authorisations',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'e6-gov-uk-ta-relief': {
    authority: 'HM Revenue & Customs, GOV.UK',
    title: 'Check if you can get import duty relief on goods using Temporary Admission',
    url: 'https://www.gov.uk/guidance/check-if-you-can-get-import-duty-relief-on-goods-using-temporary-admission',
    jurisdiction: 'United Kingdom (customs special procedures)',
    supports:
      'claiming relief with a full customs declaration unless otherwise stated, prior authorisation from HMRC applied for at least 30 days before import where needed, some goods declared orally or by conduct, processing and repairs not being permitted under temporary admission while maintenance is allowed, and the categories of goods eligible for relief such as goods for exhibitions or sale, educational and scientific equipment and containers',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
