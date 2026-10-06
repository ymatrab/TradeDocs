import type { UnsplashPhoto } from '@/lib/content/images';
import {
  articleWordCount,
  orderArticles,
  type ArticleFaq,
  type ArticleSection,
  type ArticleTable,
  type ContentArticle,
} from '@/lib/content/article';

/**
 * The guides, as data.
 *
 * One module renders the hub, every guide page, the sitemap entries, llms.txt and the
 * Article structured data, so a guide cannot be listed in one place and missing from
 * another. Each guide answers one question with measured search demand (see
 * docs/research/content-plan-v2-2026-10-06.md) and points at the tool that does the work.
 * Guides and blog posts share one shape and its rules (lib/content/article).
 *
 * Each guide lives in its own file, `guides/<slug>.ts`, so writers working in parallel never
 * edit the same lines. To add one: write the file (docs/content/WRITING_BRIEF.md), then add
 * one import and one ENTRIES line below, both in alphabetical order by slug. The exported
 * order is newest `published` first; ties keep the ENTRIES order.
 */

// The first round, in its original order. New guides go below, alphabetically.
import lclVsFcl from './lcl-vs-fcl';
import dapVsDdp from './dap-vs-ddp';
import proformaVsCommercialInvoice from './proforma-vs-commercial-invoice';
import eeiAesFilingItn from './eei-aes-filing-itn';
import eoriNumber from './eori-number';
import grossWeightVsNetWeight from './gross-weight-vs-net-weight';
import howToExportFromTheUs from './how-to-export-from-the-us';
import hsVsHtsVsScheduleB from './hs-vs-hts-vs-schedule-b';
import landedCost from './landed-cost';
import palletSizes from './pallet-sizes';
import shipperConsigneeNotifyParty from './shipper-consignee-notify-party';
import shippingContainerSizes from './shipping-container-sizes';
import whatIsABillOfLading from './what-is-a-bill-of-lading';

export type GuideTable = ArticleTable;
export type GuideSection = ArticleSection;
export type GuideFaq = ArticleFaq;
export type Guide = ContentArticle;

export const GUIDE_DISCLAIMER =
  'This guide explains general practice to help you ask the right questions. It is not legal, ' +
  'customs or tax advice, and the rules of the countries involved, your contract and your ' +
  'carrier’s terms take precedence over anything here.';

const ENTRIES: readonly Guide[] = [
  // The first round, in its original order.
  lclVsFcl,
  dapVsDdp,
  proformaVsCommercialInvoice,
  // New guides, one line each, alphabetical by slug.
  eeiAesFilingItn,
  eoriNumber,
  grossWeightVsNetWeight,
  howToExportFromTheUs,
  hsVsHtsVsScheduleB,
  landedCost,
  palletSizes,
  shipperConsigneeNotifyParty,
  shippingContainerSizes,
  whatIsABillOfLading,
];

export const GUIDES: readonly Guide[] = orderArticles(ENTRIES);

/** The /guides hub's cover. */
export const GUIDES_HUB_COVER: UnsplashPhoto = {
  id: 'b4lmjXJi9e4',
  src: 'https://images.unsplash.com/photo-1782398138711-72c37bce4b38',
  width: 7094,
  height: 4532,
  alt: 'Aerial view of a busy port with stacked shipping containers waiting to be loaded',
  caption: 'Aerial view of a busy port with shipping containers',
  photographer: { name: 'Cosmin Andrei Buzamat', profile: 'https://unsplash.com/@cos592' },
  page: 'https://unsplash.com/photos/b4lmjXJi9e4',
};

export function findGuide(slug: string): Guide | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}

/** Visible words in a guide, for the content checks; the FAQ is counted because it is shown. */
export function guideWordCount(guide: Guide): number {
  return articleWordCount(guide);
}
