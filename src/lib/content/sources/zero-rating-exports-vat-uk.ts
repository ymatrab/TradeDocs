import type { SourceFields } from '@/lib/trade/sources';

/**
 * Sources for wave C writer 4 (wc-4): zero-rating-exports-vat-uk, uk-export-declaration,
 * shipping-to-the-uk-and-eu-documents, ioss and ata-carnet. Every page opened 2026-10-08.
 */
export default {
  'c4-hmrc-vat-notice-703': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'VAT on goods exported from the UK (VAT Notice 703)',
    url: 'https://www.gov.uk/guidance/vat-on-goods-exported-from-the-uk-notice-703',
    jurisdiction: 'United Kingdom (VAT on exports)',
    supports:
      'zero rating of exports, direct and indirect exports, the 3-month and 6-month time limits, official and commercial evidence of export, chain sales, postal and courier evidence and the 6-year record rule (page last updated 4 March 2026)',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'c4-gov-uk-full-export-declaration': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'Making a full export declaration',
    url: 'https://www.gov.uk/guidance/making-a-full-export-declaration',
    jurisdiction: 'United Kingdom (export)',
    supports:
      'who submits an export declaration, the data it needs, the DUCR, arrived declarations, minimum lodging times, departure messages, C1602 and amendments (page last updated 13 May 2025)',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'c4-gov-uk-export-customs-declaration': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'Make an export declaration and get your goods through customs',
    url: 'https://www.gov.uk/export-customs-declaration',
    jurisdiction: 'United Kingdom (export)',
    supports:
      'the GB EORI requirement, systems and software, hiring an agent, and what the transporter needs at the border, including the master reference number and invoice',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'c4-gov-uk-cds-access': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'Get access to the Customs Declaration Service',
    url: 'https://www.gov.uk/guidance/get-access-to-the-customs-declaration-service',
    jurisdiction: 'United Kingdom (customs)',
    supports:
      'subscribing to the Customs Declaration Service to submit export declarations with software, one subscription covering imports and exports, and what you need to subscribe (page last updated 6 July 2026)',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'c4-gov-uk-simplified-export-declarations': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'Using simplified declarations for exports',
    url: 'https://www.gov.uk/guidance/using-simplified-declarations-for-exports',
    jurisdiction: 'United Kingdom (export)',
    supports:
      'the simplified declaration procedure, supplementary declaration deadlines, authorisation by form C&E48, and entry in the declarant’s records (page last updated 6 February 2025)',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'c4-gov-uk-appoint-customs-agent': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'Appoint someone to deal with customs on your behalf',
    url: 'https://www.gov.uk/guidance/appoint-someone-to-deal-with-customs-on-your-behalf',
    jurisdiction: 'United Kingdom (customs)',
    supports:
      'written instructions to a customs representative, direct or indirect representation, and the trader’s continuing due diligence for declarations (page last updated 6 February 2025)',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'c4-gov-uk-export-goods': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'Export goods from the UK: step by step',
    url: 'https://www.gov.uk/export-goods',
    jurisdiction: 'United Kingdom (export)',
    supports:
      'the order of steps for exporting from Great Britain, including deciding who makes export declarations, classifying goods and preparing the invoice',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'c4-gov-uk-import-goods': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'Import goods into the UK: step by step',
    url: 'https://www.gov.uk/import-goods-into-uk',
    jurisdiction: 'United Kingdom (import)',
    supports:
      'the importer’s GB EORI number, checking the seller can export, the commodity code, customs value, who makes the import declaration, and keeping invoices and customs records',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'c4-gov-uk-overseas-goods-sold-to-uk-customers': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'VAT and overseas goods sold directly to customers in the UK',
    url: 'https://www.gov.uk/guidance/vat-and-overseas-goods-sold-directly-to-customers-in-the-uk',
    jurisdiction: 'United Kingdom (VAT)',
    supports:
      'UK supply VAT charged at the point of sale on consignments of £135 or less sold to Great Britain, the reverse charge for business buyers with a UK VAT number, and normal import rules above £135 (page last updated 13 May 2022)',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'c4-gov-uk-goods-sent-from-abroad': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'Tax and customs for goods sent from abroad',
    url: 'https://www.gov.uk/goods-sent-from-abroad/tax-and-duty',
    jurisdiction: 'United Kingdom (import)',
    supports:
      'no Customs Duty on non-excise goods worth £135 or less sent to Great Britain, and VAT collected by the delivery company on goods worth more than £135',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'c4-ec-eori': {
    authority: 'European Commission, Taxation and Customs Union',
    title: 'Economic Operators Registration and Identification number (EORI)',
    url: 'https://taxation-customs.ec.europa.eu/customs/customs-procedures-import-and-export/customs-operations/economic-operators-registration-and-identification-number-eori_en',
    jurisdiction: 'European Union (customs)',
    supports:
      'who needs an EU EORI number, including operators not established in the EU that lodge customs declarations, and which EU country assigns it',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'c4-ec-low-value-consignments': {
    authority: 'European Commission, Taxation and Customs Union',
    title: 'Customs formalities for low value consignments',
    url: 'https://taxation-customs.ec.europa.eu/customs/customs-procedures-import-and-export/customs-operations/customs-formalities-low-value-consignments_en',
    jurisdiction: 'European Union (customs and VAT on imports)',
    supports:
      'the end of the EUR 22 VAT exemption on 1 July 2021, a customs declaration for all goods entering the EU, and IOSS and the special arrangements as ways to collect VAT on consignments up to EUR 150',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'c4-ec-oss-schemes': {
    authority: 'European Commission, Taxation and Customs Union (VAT One Stop Shop portal)',
    title: 'One Stop Shop: the special schemes, including the import scheme (IOSS)',
    url: 'https://vat-one-stop-shop.ec.europa.eu/one-stop-shop_en',
    jurisdiction: 'European Union (VAT)',
    supports:
      'the import scheme’s scope (distance sales of imported goods in consignments up to EUR 150, excise goods excluded), the intermediary rule for sellers outside the EU, registration in one Member State, and a separate IOSS number for each seller an intermediary represents',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'c4-ec-oss-declare-and-pay': {
    authority: 'European Commission, Taxation and Customs Union (VAT One Stop Shop portal)',
    title: 'Declare and pay in the OSS',
    url: 'https://vat-one-stop-shop.ec.europa.eu/one-stop-shop/declare-and-pay-oss_en',
    jurisdiction: 'European Union (VAT)',
    supports:
      'the import scheme’s monthly tax period, the return and payment deadline at the end of the following month, nil returns and returns in euro',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'c4-ec-oss-records': {
    authority: 'European Commission, Taxation and Customs Union (VAT One Stop Shop portal)',
    title: 'Record keeping and audits in the OSS',
    url: 'https://vat-one-stop-shop.ec.europa.eu/one-stop-shop/record-keeping-and-audits-oss_en',
    jurisdiction: 'European Union (VAT)',
    supports:
      'keeping scheme records for 10 years from the end of the year of the transaction, and no general invoicing obligation under the import scheme',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'c4-ec-lvc-guidance': {
    authority: 'European Commission, Directorate-General for Taxation and Customs Union',
    title: 'Guidance on import and export of low value consignments (VAT e-commerce)',
    url: 'https://vat-one-stop-shop.ec.europa.eu/system/files/2022-01/guidance_on_import_and_export_of_low_value_consignments_en.pdf',
    jurisdiction: 'European Union (customs and VAT on imports)',
    supports:
      'the IOSS VAT identification number being provided in the customs declaration and checked electronically (section 3.1.3)',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'c4-ec-eur3-duty-low-value-parcels': {
    authority: 'European Commission',
    title: 'Ensuring fairness and safety: €3 customs duty for low-value parcels (29 June 2026)',
    url: 'https://commission.europa.eu/news-and-media/news/ensuring-fairness-and-safety-eur3-customs-duty-low-value-parcels-2026-06-29_en',
    jurisdiction: 'European Union (customs)',
    supports:
      'a temporary €3 customs duty from 1 July 2026 on low-value parcels worth up to €150 imported from outside the EU, charged per item by tariff classification and declared and paid by the seller or importer',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
} satisfies Record<string, SourceFields>;
