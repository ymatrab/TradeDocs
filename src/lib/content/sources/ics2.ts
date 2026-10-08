import type { SourceFields } from '@/lib/trade/sources';

/**
 * Sources first cited by wave D batch 5: the glossary terms ics2, standby-letter-of-credit,
 * excise-duty, gvms, break-bulk, container-freight-station, import-license, re-export,
 * routed-export-transaction, country-of-origin, in-bond-shipment, duty-deferment-account,
 * general-average, single-administrative-document and ultimate-consignee, and the country pages
 * japan and ireland. Each URL was opened on the retrieval date and checked against the claim in
 * `supports`. None of them is cited for a duty or tax rate, and regulated terms describe the
 * mechanism only.
 */
const RETRIEVED = '2026-10-08';
const PENDING = 'pending owner review';

export default {
  'd5-ec-ics2': {
    authority: 'European Commission, Directorate-General for Taxation and Customs Union',
    title: 'Import Control System 2 (ICS2)',
    url: 'https://taxation-customs.ec.europa.eu/customs-4/customs-security/import-control-system-2-ics2-0_en',
    jurisdiction: 'European Union (import security and safety)',
    supports:
      'ICS2 as the EU advance cargo information system supporting risk analysis; economic operators bringing goods to or through the EU declaring safety and security data in an entry summary declaration (ENS) before the goods arrive; a minimum data set before loading for air cargo; an arrival notification at the first customs office of entry; goods presented to customs on arrival; and a valid ENS required for consignments entering the EU from 1 June 2026',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd5-icc-isp98': {
    authority: 'International Chamber of Commerce (ICC), ICC Digital Library',
    title:
      'International Standby Practices (ISP98) that govern the operation of standby letters of credit',
    url: 'https://library.iccwbo.org/content/tfb/RULES/tfb-isp98-rules.htm',
    jurisdiction: 'International (ICC rules, applied when a standby is made subject to them)',
    supports:
      'ISP98 being intended for standby letters of credit, including performance, financial and direct pay standbys; an undertaking becoming subject to the rules by express reference, and able to modify or exclude them; and a standby being an irrevocable, independent, documentary and binding undertaking whose issuer’s obligation depends on the documents presented, not on the underlying transaction',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd5-wco-rkc-duties-and-taxes': {
    authority: 'World Customs Organization (WCO), Revised Kyoto Convention',
    title: 'Revised Kyoto Convention, General Annex, Chapter 2: Definitions',
    url: 'https://www.wcoomd.org/en/topics/facilitation/instrument-and-tools/conventions/pf_revised_kyoto_conv/kyoto_new/gach2.aspx',
    jurisdiction: 'International (customs procedures)',
    supports:
      'import duties and taxes defined as customs duties and all other duties, taxes or charges collected on or in connection with the importation of goods; customs duties as the duties laid down in the customs tariff; and the declarant as the person who makes a goods declaration or in whose name it is made',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd5-hmrc-excise-notice-196': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'Registration and approval of excise goods held in duty suspension (Excise Notice 196)',
    url: 'https://www.gov.uk/guidance/registration-and-approval-of-excise-goods-held-in-duty-suspension-excise-notice-196',
    jurisdiction: 'United Kingdom (excise)',
    supports:
      'excise goods covering alcohol, tobacco products, vaping products and motor and heating fuels; excise goods stored in an approved warehouse without excise duty being paid, duty becoming payable when goods are released or lost; the authorised warehousekeeper; and the registered consignor dispatching imported excise goods under duty suspension (page last updated 1 October 2026)',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd5-hmrc-hmag70300': {
    authority: 'HM Revenue & Customs (HMRC), internal manual on GOV.UK',
    title:
      'HMAG70300 — Importing excise goods: declaring excise goods to a customs and excise procedure',
    url: 'https://www.gov.uk/hmrc-internal-manuals/holding-and-movements-assurance-guidance/hmag70300',
    jurisdiction: 'United Kingdom (Great Britain, excise imports)',
    supports:
      'excise goods imported into Great Britain being declared to free circulation and home use with customs duty, import VAT and excise duty paid, to a customs special procedure with all three suspended, or to free circulation with excise duty suspension; the procedure being shown by a customs procedure code on the declaration; and the duty-suspended movement to an excise warehouse normally started by a registered consignor and recorded on EMCS',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd5-gov-uk-gmr': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'Create a goods movement reference',
    url: 'https://www.gov.uk/guidance/get-a-goods-movement-reference',
    jurisdiction: 'United Kingdom (goods moving through GVMS locations)',
    supports:
      'the Goods Vehicle Movement Service (GVMS) as the online service used, after registering, to create a goods movement reference (GMR) for goods moving through locations that use it; the GMR linking the vehicle registration, trailer or container numbers with declaration references such as MRNs, DUCRs, EORI numbers and carnet references; a reference being needed for all goods in the vehicle, trailer or container; and the GMR being presented at the departure port, where the carrier uses it to decide whether the vehicle can board',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd5-cfr-19-4-7-break-bulk': {
    authority: 'U.S. Customs and Border Protection (19 CFR 4.7(b)(4)), via Cornell LII',
    title: '19 CFR § 4.7 — Inward foreign manifest; bulk and break bulk cargo',
    url: 'https://www.law.cornell.edu/cfr/text/19/4.7',
    jurisdiction: 'United States (vessel arrivals)',
    supports:
      'break bulk cargo defined as cargo that is not containerized but is otherwise packaged or bundled; bulk cargo defined as homogeneous cargo stowed loose in the hold and not enclosed in any container such as a box, bale, bag or cask; and carriers of bulk cargo, and break bulk carriers granted an exemption on written request, filing the electronic cargo declaration 24 hours before arrival in the United States instead of 24 hours before loading',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd5-cfr-19-19-40': {
    authority: 'U.S. Customs and Border Protection (19 CFR 19.40), via Cornell LII',
    title: '19 CFR § 19.40 — Establishment, relocation or alteration of container stations',
    url: 'https://www.law.cornell.edu/cfr/text/19/19.40',
    jurisdiction: 'United States (imports)',
    supports:
      'a container station being established at a port or other area under a port director’s jurisdiction, independent of the importing carrier, on application and the port director’s approval, with a bond on Customs Form 301',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd5-cfr-19-19-41': {
    authority: 'U.S. Customs and Border Protection (19 CFR 19.41), via Cornell LII',
    title: '19 CFR § 19.41 — Movement of containerized cargo to a container station',
    url: 'https://www.law.cornell.edu/cfr/text/19/19.41',
    jurisdiction: 'United States (imports)',
    supports:
      'containerized cargo being moved from the place of unlading, or delivered by a bonded carrier after in-bond transportation, to a designated container station, before entry is filed or permitted, for the purpose of stripping the container and releasing the cargo for delivery, with loose cargo belonging to the shipment allowed to move with the container',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd5-wto-import-licensing': {
    authority: 'World Trade Organization (WTO)',
    title: 'Import licensing: technical information',
    url: 'https://www.wto.org/english/tratop_e/implic_e/implic_info_e.htm',
    jurisdiction: 'International (WTO members)',
    supports:
      'import licensing defined as administrative procedures requiring an application or other documentation, other than that required for customs purposes, as a prior condition for importation; the Agreement on Import Licensing Procedures binding all WTO members since 1 January 1995; automatic licensing granted in all cases, used to collect statistical information, and approved within 10 working days; non-automatic licensing used to administer restrictions such as quantitative restrictions; publication of procedures and product lists; and licensed imports not refused for minor variations in value, quantity or weight',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd5-wto-licensing-and-origin': {
    authority: 'World Trade Organization (WTO), Understanding the WTO',
    title: 'Non-tariff barriers: red tape, etc',
    url: 'https://www.wto.org/english/thewto_e/whatis_e/tif_e/agrm9_e.htm',
    jurisdiction: 'International (WTO members)',
    supports:
      'import licensing procedures having to be simple, transparent and predictable, with some licences issued automatically and others not; rules of origin as the criteria used to define where a product was made, used for quotas, preferential tariffs, anti-dumping and countervailing duties, trade statistics and “made in” labels; the Rules of Origin Agreement requiring transparent, consistent rules based on a positive standard; and the work programme toward one set of non-preferential rules, with free trade agreements allowed their own rules',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd5-ear-734-14': {
    authority:
      'Bureau of Industry and Security, Export Administration Regulations (15 CFR 734.14), via Cornell LII',
    title: '15 CFR § 734.14 — Reexport',
    url: 'https://www.law.cornell.edu/cfr/text/15/734.14',
    jurisdiction: 'United States (export controls, EAR)',
    supports:
      'reexport defined under the EAR as an actual shipment or transmission of an item subject to the EAR from one foreign country to another foreign country; a release of technology or source code to a foreign person abroad being a deemed reexport to that person’s most recent country of citizenship or permanent residency; and a shipment through a country on the way to a destination being deemed a reexport to that destination',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd5-cfr-19-18-1': {
    authority: 'U.S. Customs and Border Protection (19 CFR 18.1), via Cornell LII',
    title: '19 CFR § 18.1 — In-bond application and entry; general rules',
    url: 'https://www.law.cornell.edu/cfr/text/19/18.1',
    jurisdiction: 'United States (imports and goods in transit)',
    supports:
      'the in-bond application, a transportation entry and manifest, being filed through a CBP-approved EDI system by the carrier, the bonded carrier or a person with a sufficient interest in the goods, before the goods leave the port of origin; movement authorization coming from CBP; a custodial bond; delivery to the destination or export port generally within 30 days; arrival reported within two business days with the FIRMS code; and late or unreported arrival being an irregular delivery',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd5-cfr-19-18-20': {
    authority: 'U.S. Customs and Border Protection (19 CFR 18.20), via Cornell LII',
    title: '19 CFR § 18.20 — Transportation and exportation entries: general rules',
    url: 'https://www.law.cornell.edu/cfr/text/19/18.20',
    jurisdiction: 'United States (goods in transit)',
    supports:
      'transportation and exportation (T&E) entries under 19 U.S.C. 1553, filed through a CBP-approved EDI system, for goods that enter at one U.S. port and are exported from another; export within 15 calendar days of arrival at the port of exportation unless CBP extends it; and arrival and exportation reported within two business days',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd5-gov-uk-duty-deferment': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title:
      'Apply for an account to defer duty payments when you import or release goods into Great Britain',
    url: 'https://www.gov.uk/guidance/apply-for-an-account-to-defer-duty-payments-when-you-import-or-release-goods-into-great-britain',
    jurisdiction: 'United Kingdom (Great Britain, import charges)',
    supports:
      'a duty deferment account letting the importer, or someone representing it, make one payment a month by Direct Debit instead of paying for each consignment; the account covering customs duty, excise duties and import VAT (not import VAT accounted for through postponed VAT accounting); a guarantee from a UK-regulated financial institution unless a guarantee waiver is approved, with waivers only for businesses established in the UK; the deferment approval number (DAN) issued on approval and needed for the Direct Debit Instruction; and authority to use the DAN being set up on the Customs Declaration Service (page last updated 31 March 2025)',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd5-cmi-yar': {
    authority: 'Comité Maritime International (CMI)',
    title: 'York-Antwerp Rules (YAR)',
    url: 'https://comitemaritime.org/work/york-antwerp-rules/',
    jurisdiction: 'International (maritime contracts that incorporate the Rules)',
    supports:
      'the York-Antwerp Rules 2016, approved at the CMI conference in New York in May 2016, being the version the CMI recommends, with a technical change to the interest provision in Rule XXI made in Antwerp in October 2022; and earlier versions, including 1994 and 2004, remaining in use in commercial contracts and in general average cases',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd5-cmi-yar-2016-text': {
    authority: 'Comité Maritime International (CMI)',
    title: 'York-Antwerp Rules 2016 (English version)',
    url: 'https://comitemaritime.org/wp-content/uploads/2023/01/YAR-2016-English-Version.pdf',
    jurisdiction: 'International (maritime contracts that incorporate the Rules)',
    supports:
      'Rule A: a general average act existing only when an extraordinary sacrifice or expenditure is intentionally and reasonably made or incurred for the common safety, to preserve the property in a common maritime adventure from peril, and general average sacrifices and expenditures being borne by the different contributing interests; and the average adjustment being made on the values at the time and place the adventure ends',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd5-ec-sad-form': {
    authority: 'European Commission, Directorate-General for Taxation and Customs Union',
    title: 'The single administrative document (SAD): presentation and use of the form',
    url: 'https://taxation-customs.ec.europa.eu/system/files/2016-09/presentation_and_use_of_the_form_en.pdf',
    jurisdiction: 'European Union (customs declarations)',
    supports:
      'the SAD as a set of eight copies with separate functions, retained by the country of export or transit, used for statistics, returned to the exporter, used at the transit destination, and retained by or returned in the country of destination; combinations of copies for export (1, 2 and 3), transit (1, 4 and 5) and import (6, 7 and 8); the copies defined in Annex 9 of Delegated Regulation (EU) 2016/341; and the form following the United Nations layout key',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd5-japan-customs-import': {
    authority: 'Japan Customs, Ministry of Finance',
    title: 'Import Procedures',
    url: 'https://www.customs.go.jp/english/summary/import.htm',
    jurisdiction: 'Japan',
    supports:
      'any person importing goods declaring them to the Director-General of Customs and obtaining an import permit after examination and payment of customs duty and excise tax; the importer as declarant in principle, with customs brokers usually filing for importers; the declaration generally made after the goods enter a Hozei (bonded) area, on form C-5020 stating quantity and value; supporting documents including the invoice, bill of lading or air waybill, origin documents where a WTO or preferential rate is claimed, packing lists, freight and insurance documents where necessary, and licences or certificates required under other laws (Customs Law Article 70)',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd5-japan-customs-valuation': {
    authority: 'Japan Customs, Ministry of Finance',
    title: 'Details of Japan Customs Valuation System',
    url: 'https://www.customs.go.jp/english/summary/value_details.htm',
    jurisdiction: 'Japan',
    supports:
      'the customs value being the transaction value plus transportation-related expenses, including the fare until arrival at the port, insurance and similar costs (Customs Tariff Law, Article 4, paragraph 1), under rules based on the WTO Customs Valuation Agreement',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd5-japan-customs-procedure-agent': {
    authority: 'Japan Customs, Ministry of Finance (Customs Answer 9601)',
    title: 'Customs Clearance Procedures for Persons Living Abroad (Customs Procedure Agent)',
    url: 'https://www.customs.go.jp/english/c-answer_e/sonota/9601_e.htm',
    jurisdiction: 'Japan',
    supports:
      'a person living abroad who handles customs procedures such as import declarations designating a Customs Procedure Agent in Japan and notifying the customs office in advance on Customs Form C No. 7500, in two copies with supporting documents; the agent handling declarations, inspections, duty payment, documents and refunds; the agent needing an address in Japan; and brokerage work needing a licensed customs broker',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd5-ippc-japan-ispm15': {
    authority: 'International Plant Protection Convention (IPPC), country page for Japan',
    title: 'Implementation of ISPM No.15 JAPAN',
    url: 'https://www.ippc.int/en/countries/japan/implementationispm/2013/02/implementation-of-ispm-no15-japan/',
    jurisdiction: 'Japan (plant health)',
    supports:
      'Japan being listed as implementing ISPM 15 for imported and exported wood packaging material, with a link to the Ministry of Agriculture, Forestry and Fisheries for details (entry dated 4 March 2010)',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'trade-gov-ccg-jp': {
    authority: 'International Trade Administration, Country Commercial Guide',
    title: 'Japan — Import Requirements and Documentation',
    url: 'https://www.trade.gov/country-commercial-guides/japan-import-requirements-and-documentation',
    jurisdiction: 'Japan',
    supports:
      'the commercial invoice, packing list and original signed bill of lading or air waybill, and the import declaration (Customs Form C-5020); the invoice being as descriptive as possible for each item; the packing list giving the contents and measurements of each container and the gross and net weight of each package in metric units under the Japanese Measurement Law; origin documents needed only for preferential or WTO rates; and separate import licences for goods such as hazardous materials, animals, plants and quota items (page last published 2025-11-18)',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd5-revenue-new-to-customs': {
    authority: 'Office of the Revenue Commissioners (Revenue), Ireland',
    title: 'New to customs',
    url: 'https://www.revenue.ie/en/customs/businesses/importing-exporting/new-customs/index.aspx',
    jurisdiction: 'Ireland (European Union customs territory)',
    supports:
      'traders moving goods to, from or through a non-EU country registering for customs by obtaining an EORI number; customs declarations lodged electronically with Revenue by the trader or an agent; the commodity code determining import duties; the customs value as the invoice price plus the cost of transport and insurance; the country of origin normally provided by the supplier and possibly different from the country of dispatch; AIS used for import declarations and AES for export declarations; supporting documents such as the commercial invoice, bill of lading or air waybill, packing list, veterinary or plant health certificates or licences depending on the goods; a Trader Account Number assigned on EORI registration; and deferred payment letting a trader pay a month’s import charges on the 15th of the following month',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd5-revenue-ais': {
    authority: 'Office of the Revenue Commissioners (Revenue), Ireland',
    title: 'What is the Automated Import System (AIS)?',
    url: 'https://www.revenue.ie/en/customs/businesses/electronic-systems/ais/what-is-ais/index.aspx',
    jurisdiction: 'Ireland (European Union customs territory)',
    supports:
      'AIS as Revenue’s national electronic import system, handling the validation, processing, duty accounting and clearance of customs declarations for businesses importing goods from outside the EU (page published 9 April 2026)',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd5-revenue-eori': {
    authority: 'Office of the Revenue Commissioners (Revenue), Ireland',
    title: 'Economic Operators’ Registration and Identification System (EORI)',
    url: 'https://www.revenue.ie/en/customs/businesses/electronic-systems/eori-system.aspx',
    jurisdiction: 'Ireland (European Union customs territory)',
    supports:
      'traders importing or exporting goods into or out of the EU needing an EORI number valid across the EU; Irish EORI registration through the Revenue Online Service (ROS) with a mandatory Eircode; some EORI numbers aligned with the VAT number with an IE prefix; and Revenue being able to cancel an EORI held by an operator not established in the EU when it is unused for six months and Ireland is not the first Member State of declaration',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'trade-gov-ccg-ie': {
    authority: 'International Trade Administration, Country Commercial Guide',
    title: 'Ireland — Import Requirements and Documentation',
    url: 'https://www.trade.gov/country-commercial-guides/ireland-import-requirements-and-documentation',
    jurisdiction: 'Ireland',
    supports:
      'one copy each of the bill of lading or air waybill and the commercial invoice for customs clearance; bills of lading naming the notify party, with the consignee needing the original to take possession; no special invoice format, with the shipment date and place, buyer and seller, weights, price and payment and delivery terms recommended and the invoice signed by a responsible official of the shipper; U.S. companies using an EORI number requested in the first Member State they export to; the Single Administrative Document covering customs duties and VAT, usually filed by the importer of record or an agent; and non-binding advance rulings from the Revenue Commissioners (page last published 2026-02-02)',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
