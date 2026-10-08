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
  'd4-gov-uk-strategic-export-controls': {
    authority: 'Export Control Joint Unit (ECJU), Department for Business and Trade, GOV.UK',
    title: 'UK strategic export controls',
    url: 'https://www.gov.uk/guidance/uk-strategic-export-controls',
    jurisdiction: 'United Kingdom (export controls)',
    supports:
      'military and dual-use items on the consolidated list needing an ECJU licence, exporting controlled items without a licence being a criminal offence, end-use controls and concerns about the end-user, sanctions licences, the OGEL and goods checker tools and SPIRE advisory services, the legal basis (Export Control Act 2002, Export Control Order 2008), Northern Ireland applying Regulation (EU) 2021/821, and the penalties for breaches',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd4-gov-uk-dual-use-controls': {
    authority: 'Export Control Joint Unit (ECJU), Department for Business and Trade, GOV.UK',
    title:
      'Export controls: dual-use items, software and technology, goods for torture and radioactive sources',
    url: 'https://www.gov.uk/guidance/export-controls-dual-use-items-software-and-technology-goods-for-torture-and-radioactive-sources',
    jurisdiction: 'United Kingdom (export controls)',
    supports:
      'applying for a SIEL through the GOV.UK “Apply to export controlled goods” service, registering for open licences on SPIRE, and Northern Ireland dual-use rules (licence needed from Northern Ireland to outside the EU, none to the EU or Great Britain)',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd4-gov-uk-siel': {
    authority: 'Export Control Joint Unit (ECJU), Department for Business and Trade, GOV.UK',
    title: 'Standard individual export licences (SIELs)',
    url: 'https://www.gov.uk/guidance/standard-individual-export-licences-siels',
    jurisdiction: 'United Kingdom (export controls)',
    supports:
      'a SIEL covering a stated quantity of specified items to a named consignee or end-user, its usual validity (two years permanent, one year temporary), the online application service and the cases still made on SPIRE, the technical specification and end-user and stockist undertaking, and ECJU’s processing targets in working days',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd4-gov-uk-lite-notice': {
    authority: 'Export Control Joint Unit (ECJU), Department for Business and Trade, GOV.UK',
    title:
      'Notice to exporters 2024/25: launch of the ‘Apply for a SIEL’ service (LITE) public beta',
    url: 'https://www.gov.uk/government/publications/notice-to-exporters-202425-launch-of-the-apply-for-a-siel-service-lite-public-beta',
    jurisdiction: 'United Kingdom (export controls)',
    supports:
      'ECJU launching the ‘Apply for a SIEL’ service (LITE) for standard individual export licence applications, published 17 September 2024',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd4-gov-uk-ogels': {
    authority: 'Export Control Joint Unit (ECJU), Department for Business and Trade, GOV.UK',
    title: 'Open general export licences (OGELs)',
    url: 'https://www.gov.uk/government/collections/open-general-export-licences-ogels',
    jurisdiction: 'United Kingdom (export controls)',
    supports:
      'OGELs as pre-published licences for specified items and destinations, registering on SPIRE before use, keeping records, annual returns, quoting the SPIRE reference on shipping documents, and compliance visits',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd4-gov-uk-oiel': {
    authority: 'Export Control Joint Unit (ECJU), Department for Business and Trade, GOV.UK',
    title: 'Open individual export licence (OIEL)',
    url: 'https://www.gov.uk/guidance/open-individual-export-licence-oiel',
    jurisdiction: 'United Kingdom (export controls)',
    supports:
      'an OIEL covering several consignments of specific goods to named destinations for one exporter, applying on SPIRE, its usual validity of three to five years, and ECJU’s aim of deciding within three to six months',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd4-gov-uk-export-goods-licences': {
    authority: 'HM Government, GOV.UK',
    title: 'Export goods from the UK: step by step',
    url: 'https://www.gov.uk/export-goods',
    jurisdiction: 'United Kingdom (export)',
    supports:
      'the categories of goods that need licences or certificates to export (animals and animal products, plants and plant products, drugs and medicines, chemicals, waste, art and antiques, firearms, military and dual-use items), and buyers possibly needing licences or certificates to receive goods',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd4-icc-isbp-discrepancies': {
    authority: 'International Chamber of Commerce (ICC Academy)',
    title: 'ISBP Insights: Avoiding common LC discrepancies (21 April 2026)',
    url: 'https://academy.iccwbo.org/trade-finance/article/isbp-insights-avoiding-common-lc-discrepancies/',
    jurisdiction: 'International (ICC rules, applied when incorporated into the credit)',
    supports:
      'the common discrepancies in invoices, transport and insurance documents, inconsistencies between documents, late presentation, presenting within 21 calendar days of shipment and before expiry, reissuing rather than correcting documents, reviewing the credit’s additional conditions, the invoice being held to more specific standards than other documents, and ISBP 821 not modifying UCP 600',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd4-gov-uk-export-plants': {
    authority: 'Department for Environment, Food & Rural Affairs (Defra) and APHA, GOV.UK',
    title: 'Export or move plants and plant products from Great Britain and Northern Ireland',
    url: 'https://www.gov.uk/guidance/export-or-move-plants-and-plant-products-from-great-britain-and-northern-ireland',
    jurisdiction: 'United Kingdom (plant health, export)',
    supports:
      'checking the importing country’s requirements through the IPPC or the UK plant health authority, the goods that may need a phytosanitary certificate and their inspection before certification, APHA, SASA, DAERA and the Forestry Commission as certifying bodies, professional operator registration, the phytosanitary certificate for re-export, and GB to Northern Ireland movements (NI plant health label, CHED-PP)',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd4-gov-uk-apply-plant-export-certificates': {
    authority: 'Department for Environment, Food & Rural Affairs (Defra) and APHA, GOV.UK',
    title: 'Apply for plant export certificates and inspections',
    url: 'https://www.gov.uk/guidance/apply-for-plant-export-certificates-and-inspections',
    jurisdiction: 'United Kingdom (England and Wales, plant health)',
    supports:
      'the APHA online service for phytosanitary certificates and re-export certificates in England and Wales, checking with the importing country’s IPPC contact first, fees being charged, separate processes for Scotland, Northern Ireland and wood products',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd4-aphis-export-certification': {
    authority: 'USDA Animal and Plant Health Inspection Service (APHIS)',
    title: 'Plant and Plant Product Export Certificates',
    url: 'https://www.aphis.usda.gov/plant-exports/certification',
    jurisdiction: 'United States (plant health, export)',
    supports:
      'what a phytosanitary certificate attests (inspected, considered free from certain pests, conforming to the importing country’s rules), the re-export certificate for foreign-origin goods, PCIT for applications through an authorized certification official, and PExD for importing-country requirements',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd4-ippc-ephyto': {
    authority: 'International Plant Protection Convention (IPPC), FAO',
    title: 'ePhyto',
    url: 'https://www.ippc.int/en/ephyto/',
    jurisdiction: 'International (plant health)',
    supports:
      'the ePhyto as the electronic equivalent of the paper phytosanitary certificate produced under ISPM 12, the ePhyto Hub exchanging certificates between national plant protection organizations, and the generic national system',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd4-gov-uk-get-ehc': {
    authority: 'Animal and Plant Health Agency (APHA) and Defra, GOV.UK',
    title: 'Get an export health certificate',
    url: 'https://www.gov.uk/guidance/get-an-export-health-certificate',
    jurisdiction: 'United Kingdom (animal and animal product exports)',
    supports:
      'an EHC as the official document confirming an export meets the destination’s health requirements, live animals and animal products from Great Britain to the EU, non-EU countries and Northern Ireland, transit EHCs, separate EHCs per product type, certification by an APHA-authorised official veterinarian or local authority inspector, applying through EHC Online, the certifier receiving the EHC 7 working days before export, destination competent authorities setting conditions and granting waivers, and Northern Ireland exports needing an EHC for non-EU countries only',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd4-gov-uk-find-ehc': {
    authority: 'Animal and Plant Health Agency (APHA), GOV.UK',
    title: 'Find an export health certificate',
    url: 'https://www.gov.uk/export-health-certificates',
    jurisdiction: 'United Kingdom (animal and animal product exports)',
    supports:
      'the APHA finder listing EHCs by destination country, commodity type and status, each with a numbered reference, holding the latest versions, and the need to nominate an official vet or local authority inspector to sign',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd4-gov-uk-trading-ni': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'Trading and moving goods in and out of Northern Ireland',
    url: 'https://www.gov.uk/guidance/trading-and-moving-goods-in-and-out-of-northern-ireland',
    jurisdiction: 'United Kingdom (Northern Ireland, Windsor Framework)',
    supports:
      'the Windsor Framework agreed in February 2023, EU VAT rules continuing to apply to goods in Northern Ireland, the free Trader Support Service, XI EORI numbers, no import declarations for qualifying Northern Ireland goods moved to Great Britain, no declarations for goods moving directly from Northern Ireland to the EU, and the SPS steps (export health certificate, CHED through DAERA TRACES NT, declaration)',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd4-gov-uk-internal-market-movements': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'Internal Market Movements from Great Britain to Northern Ireland',
    url: 'https://www.gov.uk/guidance/internal-market-movements-from-great-britain-to-northern-ireland',
    jurisdiction: 'United Kingdom (Northern Ireland, Windsor Framework)',
    supports:
      'UKIMS authorisation before using the simplified processes, the conditions for declaring goods not at risk, Standard and Category 1 and 2 goods, Internal Market Movement Information as a simplified dataset with a Trader Goods Profile, the full customs process for movements that do not qualify, B2B and consumer parcels, NIRMS agri-food goods, and at-risk goods being charged the EU rate of duty',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
