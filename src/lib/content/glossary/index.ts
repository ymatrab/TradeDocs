import {
  isTermListed,
  type GlossaryHubEntry,
  type GlossaryTerm,
} from '@/lib/content/glossary-term';

/**
 * The glossary, as data.
 *
 * One module renders /glossary, every /glossary/<slug> page, the sitemap entries, llms.txt
 * and the DefinedTerm structured data, so a term cannot be listed in one place and missing
 * from another. Each term page has measured demand (docs/research/content-plan-v3-2026-10-07.md,
 * "Glossary") and points at the one tool that does the work.
 *
 * Each term lives in its own file, `glossary/<slug>.ts`, so writers working in parallel never
 * edit the same lines. To add one: write the file to the template spec in the plan, then add
 * one import and one ENTRIES line below, both alphabetical by slug.
 */

import cbm from './cbm';
import consignor from './consignor';
import dunnage from './dunnage';
import feu from './feu';
import teu from './teu';
import verifiedGrossMass from './verified-gross-mass';
import waybill from './waybill';
import exporting from './exporting';
import freightAllKinds from './freight-all-kinds';
import importing from './importing';
import nvocc from './nvocc';
import proofOfDelivery from './proof-of-delivery';
import shippingManifest from './shipping-manifest';
import transshipment from './transshipment';
import advanceShippingNotice from './advance-shipping-notice';
import antiDumpingDuty from './anti-dumping-duty';
import billOfExchange from './bill-of-exchange';
import containerSealNumber from './container-seal-number';
import countervailingDuty from './countervailing-duty';
import customsDeclaration from './customs-declaration';
import masterCarton from './master-carton';
import tariffRateQuota from './tariff-rate-quota';
import usppi from './usppi';
import breakBulk from './break-bulk';
import containerFreightStation from './container-freight-station';
import countryOfOrigin from './country-of-origin';
import dutyDefermentAccount from './duty-deferment-account';
import exciseDuty from './excise-duty';
import generalAverage from './general-average';
import gvms from './gvms';
import ics2 from './ics2';
import importLicense from './import-license';
import inBondShipment from './in-bond-shipment';
import reExport from './re-export';
import routedExportTransaction from './routed-export-transaction';
import singleAdministrativeDocument from './single-administrative-document';
import standbyLetterOfCredit from './standby-letter-of-credit';
import ultimateConsignee from './ultimate-consignee';

const ENTRIES: readonly GlossaryTerm[] = [
  // One line per term, alphabetical by slug.
  cbm,
  consignor,
  dunnage,
  feu,
  teu,
  verifiedGrossMass,
  waybill,
  exporting,
  freightAllKinds,
  importing,
  nvocc,
  proofOfDelivery,
  shippingManifest,
  transshipment,
  advanceShippingNotice,
  antiDumpingDuty,
  billOfExchange,
  containerSealNumber,
  countervailingDuty,
  customsDeclaration,
  masterCarton,
  tariffRateQuota,
  usppi,
  breakBulk,
  containerFreightStation,
  countryOfOrigin,
  dutyDefermentAccount,
  exciseDuty,
  generalAverage,
  gvms,
  ics2,
  importLicense,
  inBondShipment,
  reExport,
  routedExportTransaction,
  singleAdministrativeDocument,
  standbyLetterOfCredit,
  ultimateConsignee,
];

/** Every term page, alphabetical by display name. */
export const GLOSSARY: readonly GlossaryTerm[] = [...ENTRIES].sort((a, b) =>
  a.term.localeCompare(b.term, 'en'),
);

/** Terms that may be indexed and listed (regulated terms wait for a review record). */
export const LISTED_GLOSSARY: readonly GlossaryTerm[] = GLOSSARY.filter(isTermListed);

export function findTerm(slug: string): GlossaryTerm | undefined {
  return GLOSSARY.find((entry) => entry.slug === slug);
}

/** The hub changes whenever a listed term does, so it carries the newest term's date. */
export const GLOSSARY_UPDATED = LISTED_GLOSSARY.reduce(
  (latest, entry) => (entry.updated > latest ? entry.updated : latest),
  '2026-10-07',
);

export const GLOSSARY_HUB = {
  title: 'Shipping and trade terms glossary',
  metaTitle: 'Shipping terms glossary: trade terms explained',
  description:
    'Shipping and trade terms in plain language: TEU, FEU, CBM, VGM, dunnage, waybill, consignor and the document terms around them, each sourced and linked to a free tool.',
  lede: 'The words on freight quotes, transport documents and packing lists, defined in a sentence or two. Terms with a page of their own open the full explanation, with where the term appears on your documents and a worked example. The rest link to the guide or tool that already explains them.',
  /** The DefinedTermSet's name in structured data. */
  setName: 'TradeDocs shipping and trade terms glossary',
} as const;

/**
 * Terms a guide, post or tool already owns: a short definition here and a link to the owner,
 * so the glossary is complete without a thin page per term. Every href is tested to exist.
 */
export const GLOSSARY_HUB_ENTRIES: readonly GlossaryHubEntry[] = [
  {
    term: 'Bill of lading',
    aliases: ['B/L', 'BOL'],
    definition:
      'The carrier’s receipt for goods shipped and the evidence of the contract of carriage; a negotiable one is also a document of title.',
    href: '/guides/what-is-a-bill-of-lading',
  },
  {
    term: 'Commercial invoice',
    definition:
      'The seller’s bill for the goods, and the document customs assess duties and taxes from.',
    href: '/tools/invoice-generator',
  },
  {
    term: 'Consignee',
    definition:
      'The party the carrier delivers the goods to, named on the transport document; usually the buyer.',
    href: '/guides/shipper-consignee-notify-party',
  },
  {
    term: 'DAP and DDP',
    aliases: ['delivered at place', 'delivered duty paid'],
    definition:
      'Two Incoterms® rules for delivery at the destination; under DDP the seller also clears the goods for import and pays the duties.',
    href: '/guides/dap-vs-ddp',
  },
  {
    term: 'Delivery note',
    definition:
      'A document that travels with the goods listing what is delivered, without prices; the receiver checks the goods against it.',
    href: '/tools/delivery-note-generator',
  },
  {
    term: 'Duty and tariff',
    aliases: ['customs duty'],
    definition:
      'A tariff is the schedule of rates; the duty is the amount actually charged on an import under it.',
    href: '/blog/duty-vs-tariff',
  },
  {
    term: 'EEI and ITN',
    aliases: ['electronic export information', 'internal transaction number', 'AES'],
    definition:
      'U.S. export filing in the Automated Export System, and the confirmation number it returns.',
    href: '/guides/eei-aes-filing-itn',
  },
  {
    term: 'EORI number',
    definition:
      'The identifier a business uses for customs in the UK and the EU, quoted on its customs declarations.',
    href: '/guides/eori-number',
  },
  {
    term: 'Gross, net and tare weight',
    definition:
      'Net is the goods alone, tare is the packaging, and gross is the two together; the packing list carries all three per package.',
    href: '/guides/gross-weight-vs-net-weight',
  },
  {
    term: 'HS code, HTS and Schedule B',
    aliases: ['harmonized system', 'commodity code', 'tariff code'],
    definition:
      'The six-digit Harmonized System code and the longer national codes built on it for imports (HTS) and U.S. exports (Schedule B).',
    href: '/guides/hs-vs-hts-vs-schedule-b',
  },
  {
    term: 'Incoterms® rules',
    aliases: ['FOB', 'CIF', 'EXW', 'FCA'],
    definition:
      'The ICC’s eleven three-letter rules for who delivers, insures and clears goods, and where risk passes from seller to buyer.',
    href: '/tools/incoterms',
  },
  {
    term: 'Landed cost',
    definition:
      'The full cost of goods delivered to the buyer’s door: price, freight, insurance, duties, taxes and fees.',
    href: '/guides/landed-cost',
  },
  {
    term: 'LCL and FCL',
    aliases: ['less than container load', 'full container load'],
    definition:
      'Sharing a container with other shippers’ cargo (LCL, charged on volume) or booking a whole one (FCL).',
    href: '/guides/lcl-vs-fcl',
  },
  {
    term: 'Notify party',
    definition:
      'The party the carrier tells when the goods arrive, often the buyer’s customs broker; it does not own the goods.',
    href: '/guides/shipper-consignee-notify-party',
  },
  {
    term: 'Packing list',
    definition:
      'The list of packages in a shipment with their contents, weights, dimensions and marks, used by forwarders and customs.',
    href: '/tools/packing-list-generator',
  },
  {
    term: 'Pallet and euro pallet',
    definition:
      'The platform cargo is built on: 48 × 40 in is common in the US, 1,200 × 800 mm (EPAL 1) in Europe.',
    href: '/guides/pallet-sizes',
  },
  {
    term: 'Proforma invoice',
    definition:
      'An advance invoice that states the terms of a sale before shipment, used for quotations, payment and import licences.',
    href: '/tools/proforma-invoice-generator',
  },
  {
    term: 'Shipping marks',
    aliases: ['marks and numbers'],
    definition:
      'The marks and numbers on each package that tie it to the packing list and the transport documents.',
    href: '/blog/shipping-marks',
  },
];
