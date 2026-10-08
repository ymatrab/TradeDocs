import type { UnsplashPhoto } from '@/lib/content/images';
import { articleWordCount, orderArticles, type ContentArticle } from '@/lib/content/article';

/**
 * The blog, as data.
 *
 * One module renders the /blog hub, every post, the sitemap entries, llms.txt, the RSS feed
 * and the Article structured data. Posts share the guides' shape and rules
 * (lib/content/article): sourced facts only, a team byline, invented parties in examples
 * labelled as such, and the not-advice note on every page.
 *
 * Each post lives in its own file, `posts/<slug>.ts`, so writers working in parallel never
 * edit the same lines. To add one: write the file (docs/content/WRITING_BRIEF.md), then add
 * one import and one ENTRIES line below, both in alphabetical order by slug. The exported
 * order is newest `published` first; ties keep the ENTRIES order.
 *
 * Demand for each post is recorded in its file and in docs/research/content-plan-v2-2026-10-06.md.
 * "Incodocs alternative" was not written: the 2026-10-05 plan measured 0 searches and defers it
 * until a sales need exists and the competitor's live pages can be cited with a retrieval date.
 */

// The first round, in its original order. New posts go below, alphabetically.
import commercialInvoiceRequirements from './commercial-invoice-requirements';
import proformaInvoiceExample from './proforma-invoice-example';
import exportDocumentsChecklist from './export-documents-checklist';
import packingListForShipping from './packing-list-for-shipping';
import fcaVsFob from './fca-vs-fob';
import brokerageFeesAndDutiesOnCourierShipments from './brokerage-fees-and-duties-on-courier-shipments';
import cifVsFob from './cif-vs-fob';
import commercialInvoiceForCanada from './commercial-invoice-for-canada';
import commercialInvoiceForSamples from './commercial-invoice-for-samples';
import commercialInvoiceUpsFedexDhl from './commercial-invoice-ups-fedex-dhl';
import ddpVsDdu from './ddp-vs-ddu';
import dutyVsTariff from './duty-vs-tariff';
import exwVsFca from './exw-vs-fca';
import exwVsFob from './exw-vs-fob';
import fobPrice from './fob-price';
import fobShippingPointVsFobDestination from './fob-shipping-point-vs-fob-destination';
import fobVsDdp from './fob-vs-ddp';
import howLongDoesCustomsClearanceTake from './how-long-does-customs-clearance-take';
import howManyPalletsFitInAContainer from './how-many-pallets-fit-in-a-container';
import howToCalculateImportDuty from './how-to-calculate-import-duty';
import howToFindHsCode from './how-to-find-hs-code';
import howToShipInternationallySmallBusiness from './how-to-ship-internationally-small-business';
import incotermsForImportingFromChina from './incoterms-for-importing-from-china';
import shippersLetterOfInstruction from './shippers-letter-of-instruction';
import shippingMarks from './shipping-marks';
import cbpForm7501 from './cbp-form-7501';
import commercialInvoiceAndPackingListMustMatch from './commercial-invoice-and-packing-list-must-match';
import commercialInvoiceExample from './commercial-invoice-example';
import customsStatusMessagesExplained from './customs-status-messages-explained';
import deliveryNoteVsPackingList from './delivery-note-vs-packing-list';
import howToFillOutACommercialInvoice from './how-to-fill-out-a-commercial-invoice';
import howToMakeAPackingListFromYourInvoice from './how-to-make-a-packing-list-from-your-invoice';
import howToReadTheHarmonizedTariffSchedule from './how-to-read-the-harmonized-tariff-schedule';
import packingListExample from './packing-list-example';
import scheduleBNumber from './schedule-b-number';
import howMuchDoesAPalletWeigh from './how-much-does-a-pallet-weigh';
import howToMeasureABoxForShipping from './how-to-measure-a-box-for-shipping';
import standardBoxSizesForShipping from './standard-box-sizes-for-shipping';
import cargoInsuranceForExporters from './cargo-insurance-for-exporters';
import importingFromChinaDocuments from './importing-from-china-documents';
import cn22VsCn23 from './cn22-vs-cn23';
import containerLoadPlan from './container-load-plan';
import declaredValueForCustoms from './declared-value-for-customs';
import deliveryNoteFromPackingList from './delivery-note-from-packing-list';
import freightPrepaidVsFreightCollect from './freight-prepaid-vs-freight-collect';
import howManyCbmFitInAContainer from './how-many-cbm-fit-in-a-container';
import howToCalculateShippingCost from './how-to-calculate-shipping-cost';
import howToMakeAProformaInvoice from './how-to-make-a-proforma-invoice';
import howToShipAPalletInternationally from './how-to-ship-a-pallet-internationally';
import mawbVsHawb from './mawb-vs-hawb';
import paperlessCommercialInvoice from './paperless-commercial-invoice';
import piAndPo from './pi-and-po';
import postponedVatAccounting from './postponed-vat-accounting';
import proformaInvoiceForCustoms from './proforma-invoice-for-customs';
import proformaToCommercialInvoice from './proforma-to-commercial-invoice';
import shippingContainerWeightLimits from './shipping-container-weight-limits';
import skidVsPallet from './skid-vs-pallet';
import taricAndCnCodes from './taric-and-cn-codes';
import ttPayment from './tt-payment';
import ukImportDuty from './uk-import-duty';
import whatIsCustomsClearance from './what-is-customs-clearance';
import cifVsCip from './cif-vs-cip';
import exwVsDdp from './exw-vs-ddp';
import fcaVsDap from './fca-vs-dap';
import fobVsDap from './fob-vs-dap';
import proformaInvoiceVsQuotation from './proforma-invoice-vs-quotation';
import shippingInvoiceVsCommercialInvoice from './shipping-invoice-vs-commercial-invoice';
import shippingToTheUkAndEuDocuments from './shipping-to-the-uk-and-eu-documents';
import ukExportDeclaration from './uk-export-declaration';
import zeroRatingExportsVatUk from './zero-rating-exports-vat-uk';
import addLogoAndSignatureToExportDocuments from './add-logo-and-signature-to-export-documents';
import airFreightVsSeaFreight from './air-freight-vs-sea-freight';
import commercialInvoiceDeclarationStatement from './commercial-invoice-declaration-statement';
import exportPacking from './export-packing';
import reuseShipmentDataForRepeatOrders from './reuse-shipment-data-for-repeat-orders';
import exportComplianceChecklist from './export-compliance-checklist';
import howToStartAnImportExportBusiness from './how-to-start-an-import-export-business';
import letterOfIndemnity from './letter-of-indemnity';
import partialShipments from './partial-shipments';
import preShipmentInspection from './pre-shipment-inspection';
import cbpCustomsExam from './cbp-customs-exam';
import cbpForm3461 from './cbp-form-3461';
import customsBond from './customs-bond';
import whoPaysImportDuties from './who-pays-import-duties';

export type Post = ContentArticle;

export const POST_DISCLAIMER =
  'This article explains general practice to help you ask the right questions. It is not legal, ' +
  'customs or tax advice, and the rules of the countries involved, your contract and your ' +
  'carrier’s terms take precedence over anything here. Worked examples use invented parties.';

const ENTRIES: readonly Post[] = [
  // The first round, in its original order.
  commercialInvoiceRequirements,
  proformaInvoiceExample,
  exportDocumentsChecklist,
  packingListForShipping,
  fcaVsFob,
  // New posts, one line each, alphabetical by slug.
  brokerageFeesAndDutiesOnCourierShipments,
  cifVsFob,
  commercialInvoiceForCanada,
  commercialInvoiceForSamples,
  commercialInvoiceUpsFedexDhl,
  ddpVsDdu,
  dutyVsTariff,
  exwVsFca,
  exwVsFob,
  fobPrice,
  fobShippingPointVsFobDestination,
  fobVsDdp,
  howLongDoesCustomsClearanceTake,
  howManyPalletsFitInAContainer,
  howToCalculateImportDuty,
  howToFindHsCode,
  howToShipInternationallySmallBusiness,
  incotermsForImportingFromChina,
  shippersLetterOfInstruction,
  shippingMarks,
  cbpForm7501,
  commercialInvoiceAndPackingListMustMatch,
  commercialInvoiceExample,
  customsStatusMessagesExplained,
  deliveryNoteVsPackingList,
  howToFillOutACommercialInvoice,
  howToMakeAPackingListFromYourInvoice,
  howToReadTheHarmonizedTariffSchedule,
  packingListExample,
  scheduleBNumber,
  howMuchDoesAPalletWeigh,
  howToMeasureABoxForShipping,
  standardBoxSizesForShipping,
  cargoInsuranceForExporters,
  importingFromChinaDocuments,
  cn22VsCn23,
  containerLoadPlan,
  declaredValueForCustoms,
  deliveryNoteFromPackingList,
  freightPrepaidVsFreightCollect,
  howManyCbmFitInAContainer,
  howToCalculateShippingCost,
  howToMakeAProformaInvoice,
  howToShipAPalletInternationally,
  mawbVsHawb,
  paperlessCommercialInvoice,
  piAndPo,
  postponedVatAccounting,
  proformaInvoiceForCustoms,
  proformaToCommercialInvoice,
  shippingContainerWeightLimits,
  skidVsPallet,
  taricAndCnCodes,
  ttPayment,
  ukImportDuty,
  whatIsCustomsClearance,
  cifVsCip,
  exwVsDdp,
  fcaVsDap,
  fobVsDap,
  proformaInvoiceVsQuotation,
  shippingInvoiceVsCommercialInvoice,
  shippingToTheUkAndEuDocuments,
  ukExportDeclaration,
  zeroRatingExportsVatUk,
  addLogoAndSignatureToExportDocuments,
  airFreightVsSeaFreight,
  commercialInvoiceDeclarationStatement,
  exportPacking,
  reuseShipmentDataForRepeatOrders,
  exportComplianceChecklist,
  howToStartAnImportExportBusiness,
  letterOfIndemnity,
  partialShipments,
  preShipmentInspection,
  cbpCustomsExam,
  cbpForm3461,
  customsBond,
  whoPaysImportDuties,
];

export const POSTS: readonly Post[] = orderArticles(ENTRIES);

/** The /blog hub's cover. */
export const BLOG_HUB_COVER: UnsplashPhoto = {
  id: 'sI2eENXdoBI',
  src: 'https://images.unsplash.com/photo-1691591765923-3bd6f12f4209',
  width: 6000,
  height: 3375,
  alt: 'Large container ship on the water with a port crane behind it',
  caption: 'A large cargo ship in the water with a crane in the background',
  photographer: { name: 'Elijah Mears', profile: 'https://unsplash.com/@elijahjmears' },
  page: 'https://unsplash.com/photos/a-large-cargo-ship-in-the-water-with-a-large-crane-in-the-background-sI2eENXdoBI',
};

/** The newest post's date, for the hub's sitemap entry and the feed. */
export const BLOG_UPDATED = POSTS.reduce(
  (latest, post) => (post.updated > latest ? post.updated : latest),
  '',
);

export function findPost(slug: string): Post | undefined {
  return POSTS.find((post) => post.slug === slug);
}

/** Visible words in a post, for the content checks. */
export function postWordCount(post: Post): number {
  return articleWordCount(post);
}
