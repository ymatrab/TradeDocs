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
