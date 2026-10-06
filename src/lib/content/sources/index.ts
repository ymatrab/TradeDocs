import type { SourceFields } from '@/lib/trade/sources';
import brokerageFeesAndDutiesOnCourierShipments from './brokerage-fees-and-duties-on-courier-shipments';
import cifVsFob from './cif-vs-fob';
import commercialInvoiceForCanada from './commercial-invoice-for-canada';
import eeiAesFilingItn from './eei-aes-filing-itn';
import grossWeightVsNetWeight from './gross-weight-vs-net-weight';

/**
 * Sources added by individual articles, merged into SOURCES in lib/trade/sources.
 *
 * A writer whose article needs a source that is not in the registry yet adds a file
 * `sources/<article-slug>.ts` (template in docs/content/WRITING_BRIEF.md), then one import and
 * one line in ARTICLE_SOURCE_FILES below, both alphabetical by slug. The keys of that file
 * become valid SourceIds, so the article can list them in `sources` and the type check catches
 * a typo. An id may be defined once only, here or in the core registry; a repeat stops the
 * build. Files here use `import type` only, so the registry has no import cycle at runtime.
 */

export const ARTICLE_SOURCE_FILES = [
  // One line per file, alphabetical by article slug.
  brokerageFeesAndDutiesOnCourierShipments,
  cifVsFob,
  commercialInvoiceForCanada,
  eeiAesFilingItn,
  grossWeightVsNetWeight,
] as const satisfies readonly Readonly<Record<string, SourceFields>>[];

type KeysOf<T> = T extends unknown ? keyof T : never;

/** Every id defined by a per-article source file. */
export type ArticleSourceId = Extract<KeysOf<(typeof ARTICLE_SOURCE_FILES)[number]>, string>;
