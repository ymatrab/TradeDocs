import type { SourceFields } from '@/lib/trade/sources';

/**
 * Sources first cited by the wave B posts skid-vs-pallet, what-is-customs-clearance,
 * how-to-calculate-shipping-cost, mawb-vs-hawb, shipping-container-weight-limits and
 * freight-prepaid-vs-freight-collect (one file for the batch, ids `b1-`). Each URL was opened
 * on the retrieval date and checked against the claim in `supports`.
 */
const RETRIEVED = '2026-10-08';
const PENDING = 'pending owner review';

export default {
  'b1-fedex-freight-pallets-skids': {
    authority: 'FedEx Freight',
    title: 'Pallets and skids: the difference (packing guide)',
    url: 'https://www.fedexfreight.com/en-us/fragments/pallets-skids-difference',
    jurisdiction: 'United States (carrier practice, LTL freight)',
    supports:
      'the terms pallet and skid often being used interchangeably, and the difference that a pallet has bottom deck boards and a skid does not',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b1-cfr-7-319-40-1': {
    authority: 'USDA APHIS, 7 CFR 319.40-1, via Cornell LII',
    title: '7 CFR § 319.40-1 — Definitions (logs, lumber and other wood articles)',
    url: 'https://www.law.cornell.edu/cfr/text/7/319.40-1',
    jurisdiction: 'United States (import)',
    supports:
      'regulated wood packaging material being wood packaging used with cargo to prevent damage, including dunnage, crating, pallets, packing blocks, drums, cases and skids, and excluding manufactured wood, loose wood packing and pieces under 6 mm thick',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b1-cfr-7-319-40-3': {
    authority: 'USDA APHIS, 7 CFR 319.40-3, via Cornell LII',
    title: '7 CFR § 319.40-3 — General permits; articles that may be imported without a specific permit',
    url: 'https://www.law.cornell.edu/cfr/text/7/319.40-3',
    jurisdiction: 'United States (import)',
    supports:
      'regulated wood packaging material entering the US having to be treated and carry a legible, permanent mark under the IPPC standard (symbol, country code, producer number and treatment code such as HT or MB), and an inspector being able to order the immediate re-export of unmarked material',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b1-wco-rkc-definitions': {
    authority: 'World Customs Organization (WCO), Revised Kyoto Convention',
    title: 'Revised Kyoto Convention, General Annex, Chapter 2: Definitions',
    url: 'https://www.wcoomd.org/en/topics/facilitation/instrument-and-tools/conventions/pf_revised_kyoto_conv/kyoto_new/gach2.aspx',
    jurisdiction: 'International (customs procedures)',
    supports:
      'clearance as the accomplishment of the customs formalities needed for goods to enter home use, be exported or be placed under another customs procedure; release as customs placing goods undergoing clearance at the disposal of the persons concerned; and the definitions of goods declaration, declarant and customs formalities',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b1-gov-uk-import-step-by-step': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'Import goods into the UK: step by step',
    url: 'https://www.gov.uk/import-goods-into-uk',
    jurisdiction: 'United Kingdom (import)',
    supports:
      'the UK import steps: an EORI number, deciding who makes customs declarations, the commodity code and customs value, licences and certificates, making the import declaration to clear the goods, and keeping invoices and records; and most importing businesses using a transporter or customs agent',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b1-iata-air-cargo-tariffs': {
    authority: 'International Air Transport Association (IATA)',
    title: 'Air cargo tariffs and rules: what you need to know',
    url: 'https://www.iata.org/en/publications/newsletters/iata-knowledge-hub/air-cargo-tariffs-and-rules-what-you-need-to-know/',
    jurisdiction: 'International (air cargo)',
    supports:
      'air carriers charging by volumetric or actual weight, whichever is higher; the general rule of dividing the volume in cubic centimetres by 6,000; tariffs being set by each carrier or at industry level, with the rate a forwarder pays able to differ; tariffs excluding services such as customs clearance, pick-up and delivery; and accessorial fees such as fuel, security, dangerous goods and handling charges',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b1-cbp-ams-air-features': {
    authority: 'U.S. Customs and Border Protection (CBP)',
    title: 'AMS Air Features',
    url: 'https://www.cbp.gov/trade/acs/ams/air-features',
    jurisdiction: 'United States (air cargo manifest)',
    supports:
      'the incoming air carrier transmitting the master air waybill for consolidated shipments and the house air waybills unless another party sends them, split consolidations needing house-level detail, deconsolidators or bonded ABI filer-forwarders transmitting house shipment information independently of the master, and the air waybill number serving as the in-bond control number',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b1-cfr-19-122-48a': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 122.48a, via Cornell LII',
    title: '19 CFR § 122.48a — Electronic information for air cargo required in advance of arrival',
    url: 'https://www.law.cornell.edu/cfr/text/19/122.48a',
    jurisdiction: 'United States (import, air)',
    supports:
      'the master air waybill data (air waybill number, flight, airports, quantity, weight, description, shipper and consignee) and the house air waybill data (master and house numbers, origin, description, quantity, weight, shipper and consignee); other eligible parties transmitting house data; and the data being due no later than four hours before arrival, or at departure from nearby foreign areas',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b1-eeas-ics2-air': {
    authority: 'European Union (EEAS delegation, reporting a European Commission notice)',
    title:
      'ICS2: European Commission invites air cargo operators to adhere to ICS2 filing requirements when sending goods to the EU (10 December 2024)',
    url: 'https://www.eeas.europa.eu/delegations/china/ics2-european-commission-invites-air-cargo-operators-adhere-ics2-filing-requirements-when-sending_en',
    jurisdiction: 'European Union (import, air)',
    supports:
      'ENS filers providing complete data at master and lowest house level, separate goods items for different HS codes, descriptions such as “unknown” being unacceptable, and the consignor and consignee in the lowest house air waybill having to be the real parties, not the carrier, forwarder, consolidator or customs agent',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b1-csc-msc-355-92': {
    authority:
      'International Maritime Organization, Resolution MSC.355(92) amending the International Convention for Safe Containers (CSC), as published in the Dutch Treaty Series (Tractatenblad 2014, 145)',
    title: 'Amendments to the International Convention for Safe Containers (CSC), 1972',
    url: 'https://zoek.officielebekendmakingen.nl/trb-2014-145.html',
    jurisdiction: 'International (container safety)',
    supports:
      'maximum operating gross mass (rating, R) as the maximum allowable sum of the mass of the container and its cargo, tare as the empty container’s mass, maximum permissible payload (P) as the difference, the Safety Approval Plate showing the maximum operating gross mass in kg and lb, and all gross mass markings having to be consistent with the plate',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b1-cfr-23-658-17': {
    authority: 'Federal Highway Administration, 23 CFR 658.17, via Cornell LII',
    title: '23 CFR § 658.17 — Weight',
    url: 'https://www.law.cornell.edu/cfr/text/23/658.17',
    jurisdiction: 'United States (Interstate highways)',
    supports:
      'a maximum gross vehicle weight of 80,000 pounds, 20,000 pounds on a single axle and 34,000 pounds on tandem axles, subject to the bridge formula',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b1-dcsa-charges-payment-term': {
    authority: 'Digital Container Shipping Association (DCSA), information model 2024 Q4',
    title: 'Charges Payment Term',
    url: 'https://models.dcsa.org/2024Q4/EARoot/EA5/EA2/EA3/EA1/EA2351.htm',
    jurisdiction: 'International (ocean carrier data standard)',
    supports:
      'the payment term indicating whether charges are prepaid (PRE) or collect (COL): prepaid charges being the responsibility of the shipper or an invoice payer on its behalf, collect charges the responsibility of the consignee or an invoice payer on its behalf',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b1-dcsa-charge': {
    authority: 'Digital Container Shipping Association (DCSA), information model 2024 Q4',
    title: 'Charge',
    url: 'https://models.dcsa.org/2024Q4/EARoot/EA5/EA2/EA3/EA1/EA2350.htm',
    jurisdiction: 'International (ocean carrier data standard)',
    supports:
      'a charge being the monetary value of freight and other service charges for a booking, each with its own payment term code of prepaid (PRE) or collect (COL)',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
