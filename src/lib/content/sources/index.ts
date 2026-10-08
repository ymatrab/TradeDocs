import type { SourceFields } from '@/lib/trade/sources';
import brokerageFeesAndDutiesOnCourierShipments from './brokerage-fees-and-duties-on-courier-shipments';
import cifVsFob from './cif-vs-fob';
import commercialInvoiceForCanada from './commercial-invoice-for-canada';
import consignor from './consignor';
import dunnage from './dunnage';
import eeiAesFilingItn from './eei-aes-filing-itn';
import grossWeightVsNetWeight from './gross-weight-vs-net-weight';
import india from './india';
import mexico from './mexico';
import teu from './teu';
import waybill from './waybill';
import cbpForm7501 from './cbp-form-7501';
import commercialInvoiceExample from './commercial-invoice-example';
import eccnEar99ExportLicence from './eccn-ear99-export-licence';
import whatIsAProformaInvoice from './what-is-a-proforma-invoice';
import howToMeasureABoxForShipping from './how-to-measure-a-box-for-shipping';
import freightForwarderVsCustomsBroker from './freight-forwarder-vs-customs-broker';
import howManyCbmFitInAContainer from './how-many-cbm-fit-in-a-container';
import ispm15WoodPackaging from './ispm-15-wood-packaging';
import skidVsPallet from './skid-vs-pallet';
import taricAndCnCodes from './taric-and-cn-codes';
import ttPayment from './tt-payment';
import nvocc from './nvocc';
import fcaVsDap from './fca-vs-dap';
import zeroRatingExportsVatUk from './zero-rating-exports-vat-uk';
import commercialInvoiceDeclarationStatement from './commercial-invoice-declaration-statement';

/**
 * Sources added by individual articles, merged into SOURCES in lib/trade/sources.
 *
 * A writer whose page (a post, guide, glossary term or country page) needs a source that is
 * not in the registry yet adds a file `sources/<page-slug>.ts` (template in
 * docs/content/WRITING_BRIEF.md), then one import and one line in ARTICLE_SOURCE_FILES below,
 * both alphabetical by slug. The keys of that file become valid SourceIds, so the page can
 * list them in `sources` and the type check catches a typo. An id may be defined once only, here or in the core registry; a repeat stops the
 * build. Files here use `import type` only, so the registry has no import cycle at runtime.
 */

export const ARTICLE_SOURCE_FILES = [
  // One line per file, alphabetical by article slug.
  brokerageFeesAndDutiesOnCourierShipments,
  cifVsFob,
  commercialInvoiceForCanada,
  consignor,
  dunnage,
  eeiAesFilingItn,
  grossWeightVsNetWeight,
  india,
  mexico,
  teu,
  waybill,
  cbpForm7501,
  commercialInvoiceExample,
  eccnEar99ExportLicence,
  whatIsAProformaInvoice,
  howToMeasureABoxForShipping,
  freightForwarderVsCustomsBroker,
  howManyCbmFitInAContainer,
  ispm15WoodPackaging,
  skidVsPallet,
  taricAndCnCodes,
  ttPayment,
  nvocc,
  fcaVsDap,
  zeroRatingExportsVatUk,
  commercialInvoiceDeclarationStatement,
] as const satisfies readonly Readonly<Record<string, SourceFields>>[];

type KeysOf<T> = T extends unknown ? keyof T : never;

/** Every id defined by a per-article source file. */
export type ArticleSourceId = Extract<KeysOf<(typeof ARTICLE_SOURCE_FILES)[number]>, string>;
