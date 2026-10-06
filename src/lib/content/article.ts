import type { UnsplashPhoto } from '@/lib/content/images';
import type { SourceId } from '@/lib/trade/sources';

/**
 * The shape shared by guides and blog posts, so both render through one component and
 * one set of structured-data builders.
 *
 * Every field is visible on the page. The structure is what answer engines quote: a short
 * answer first (40–60 words), a key-facts list, the terms defined, question-style headings,
 * steps as an ordered list, comparisons as tables, and an FAQ that feeds FAQPage JSON-LD
 * from the same array the page renders.
 *
 * Rules every entry follows: facts about customs, carriers or the Incoterms® rules come
 * from a record in lib/trade/sources and are listed in `sources`; there are no invented
 * figures, customers or authors (the byline is the team); worked examples use invented
 * parties and say so; and every page carries the not-advice note. `reviewed` is the date
 * the text was last checked against its sources, which is not an approval.
 */

export type ArticleTable = {
  caption: string;
  head: readonly string[];
  rows: readonly (readonly string[])[];
};

export type ArticleSection = {
  /** Phrased as the question people search for, where one exists. */
  heading: string;
  paragraphs: readonly string[];
  /** An unordered list, shown after the paragraphs. */
  list?: readonly string[];
  /** An ordered list of steps, shown after the paragraphs. */
  steps?: readonly string[];
  table?: ArticleTable;
};

export type ArticleFaq = { q: string; a: string };

export type ArticleDefinition = { term: string; meaning: string };

/** The mid-article pointer to a tool, placed after the section at `afterSection` (0-based). */
export type ArticleCallout = {
  afterSection: number;
  /** A path from PUBLIC_TOOLS. */
  tool: string;
  title: string;
  text: string;
};

export type ContentArticle = {
  slug: string;
  /** The page's H1. */
  title: string;
  /** The <title>, phrased the way people search for it; the layout appends " · TradeDocs". */
  metaTitle: string;
  description: string;
  lede: string;
  /** The short answer, 40–60 words, shown first so the question is answered before the detail. */
  answer: string;
  /** Quotable one-line facts, each true on its own. */
  keyFacts: readonly string[];
  definitions: readonly ArticleDefinition[];
  published: string;
  updated: string;
  reviewed: string;
  byline: string;
  sections: readonly ArticleSection[];
  faq: readonly ArticleFaq[];
  sources: readonly SourceId[];
  /** The tool this page's reader most likely needs next; the in-context call to action. */
  primaryTool: string;
  /** Paths from PUBLIC_TOOLS that do what the article describes. */
  tools: readonly string[];
  callout: ArticleCallout;
  /** A credited Unsplash photo, hotlinked (D-016). */
  cover: UnsplashPhoto;
};

export const BYLINE = 'TradeDocs team';

export function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

/** Visible words in an article, for the content checks; the FAQ is counted because it is shown. */
export function articleWordCount(article: ContentArticle): number {
  const text = [
    article.lede,
    article.answer,
    ...article.keyFacts,
    ...article.definitions.flatMap((entry) => [entry.term, entry.meaning]),
    ...article.sections.flatMap((section) => [
      section.heading,
      ...section.paragraphs,
      ...(section.list ?? []),
      ...(section.steps ?? []),
      ...(section.table ? section.table.rows.flat() : []),
    ]),
    article.callout.title,
    article.callout.text,
    ...article.faq.flatMap((entry) => [entry.q, entry.a]),
  ].join(' ');
  return countWords(text);
}
