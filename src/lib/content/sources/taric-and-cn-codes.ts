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
  'b3-wco-upu-postal-ead-guidelines': {
    authority: 'Universal Postal Union (UPU) and World Customs Organization (WCO)',
    title:
      'WCO–UPU Guidelines on the Exchange of Electronic Advance Data and Data Quality (2025, PDF)',
    url: 'https://www.upu.int/UPU/media/upu/files/postalSolutions/programmesAndServices/postalSupplyChain/customs/wcoPublicationsAndActivities/WcoUpuGuidelinesEadAndDataQuality2025En.pdf',
    jurisdiction: 'International (UPU Acts, postal items)',
    supports:
      'CN 22 for letter-post items with contents under 300 SDR and CN 23 for parcels and letter-post items over 300 SDR, the CP 72 set in place of a CN 23 for parcels, the fields of each form and their status, detailed descriptions, the six-digit HS code for commercial items from 1 September 2025 where the destination requires it, attaching an invoice for commercial items, the SDR (XDR) and the ITMATT message as the electronic equivalent of the forms',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b3-usps-imm-123': {
    authority: 'United States Postal Service (USPS)',
    title: 'International Mail Manual, 123: Customs forms',
    url: 'https://pe.usps.com/text/imm/immc1_009.htm',
    jurisdiction: 'United States (outbound international mail)',
    supports:
      'PS Form 2976 as the CN 22 and PS Form 2976-A as the CP 72, the forms required by mail class (Priority Mail International on 2976-A; First-Class Package International Service limited to $400), electronic transmission of customs data, a detailed description with quantity, net weight and value per item, a six-digit HS code per item unless the country listing says otherwise, and the mailer determining whether the destination needs a commercial invoice',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b3-gov-uk-method-1-transaction-value': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'Valuing imported goods using Method 1 (transaction value)',
    url: 'https://www.gov.uk/guidance/valuing-imported-goods-using-method-1-transaction-value',
    jurisdiction: 'United Kingdom (import)',
    supports:
      'transaction value as the price paid or payable for goods sold for export to the UK, the costs of transport, insurance, loading and handling to the UK border, commissions and some royalties being added, the seller’s invoice serving as evidence, and customs asking for more information and giving a written decision when it doubts a declared value',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b3-cfr-19-152-103': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 152.103, via Cornell LII',
    title: '19 CFR § 152.103 — Transaction value',
    url: 'https://www.law.cornell.edu/cfr/text/19/152.103',
    jurisdiction: 'United States (import)',
    supports:
      'the price actually paid or payable as the basis of transaction value, and the regulation’s example in which ocean freight and insurance (C.I.F. charges) are excluded from transaction value',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b3-dhl-express-terms-us': {
    authority: 'DHL Express',
    title: 'Terms and Conditions of Carriage (United States)',
    url: 'https://mydhl.express.dhl/us/en/legal/terms-and-conditions.html',
    jurisdiction: 'Carrier practice (DHL Express, United States site)',
    supports:
      'every shipment travelling on a limited liability basis, liability for air shipments limited by the Montreal or Warsaw Convention or otherwise to the lower of market or declared value or 26 SDR per kilogram, and a shipper who finds the limits insufficient making a special declaration of value and requesting Shipment Value Protection for an additional charge, or arranging its own insurance',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b3-imo-ctu-code': {
    authority: 'International Maritime Organization (IMO), with the ILO and UNECE',
    title:
      'MSC.1/Circ.1497: IMO/ILO/UNECE Code of Practice for Packing of Cargo Transport Units (CTU Code) (PDF)',
    url: 'https://wwwcdn.imo.org/localresources/en/OurWork/Safety/Documents/1497.pdf',
    jurisdiction: 'International (non-mandatory code of practice)',
    supports:
      'planning the packing in advance, not exceeding the permitted payload, complying with limits on concentrated loads and centre-of-gravity eccentricity, not stowing heavy goods on light goods, the centre of gravity near mid-length and mid-width and below half the height, the rule of thumb of 60% of the cargo mass in 50% of the container length, filling void spaces, the sum of void spaces in any horizontal direction not exceeding 15 cm, and the consignor describing the goods and the mass of the payload',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
