import type { ArticleFaq, ArticleTable } from '@/lib/content/article';
import { countWords } from '@/lib/content/article';
import type { SourceId } from '@/lib/trade/sources';

/**
 * The shape of a glossary term page (docs/research/content-plan-v3-2026-10-07.md, "Template
 * spec: glossary term pages"). One file per term in lib/content/glossary, rendered by
 * /glossary/[term] and listed on /glossary.
 *
 * Every field is visible on the page. The short definition comes first and is reused on the
 * hub, in the DefinedTerm structured data and in llms.txt, so all three say the same thing.
 * Facts come from records in lib/trade/sources; examples use invented parties and say so; no
 * term page states a duty rate, threshold or fee.
 */

/** The measured search row that justifies the page (the plan's appendix). */
export type TermDemand = {
  keyword: string;
  market: 'US' | 'UK';
  /** Monthly searches; a page needs 200 or more (wave E: 100). */
  volume: number;
  /** Keyword difficulty, or null where DataForSEO reported none. */
  kd: number | null;
  /** The saved response the row comes from, in docs/research/dataforseo-2026-10-07/. */
  dataFile: string;
};

export type TermExample = {
  /** Says the parties are invented. */
  caption: string;
  paragraphs: readonly string[];
  table?: ArticleTable;
};

export type ConfusedWith = { term: string; difference: string };

export type GlossaryTerm = {
  /** Kebab-case, equal to the file name. */
  slug: string;
  /** Display name and H1, e.g. "Verified gross mass (VGM)". */
  term: string;
  abbreviation?: string;
  /** Other phrasings, shown on the hub and matched by its search. */
  aliases: readonly string[];
  demand: TermDemand;
  /** The <title>; the layout appends " · TradeDocs". */
  metaTitle: string;
  description: string;
  /** 25–50 words, answer-first. */
  shortDefinition: string;
  /** The expanded meaning, 120–250 words. */
  definition: readonly string[];
  /** Where the term appears on an invoice, packing list, delivery note or transport document. */
  onYourDocuments: readonly string[];
  example: TermExample;
  confusedWith?: readonly ConfusedWith[];
  /** 2–5 glossary slugs or site paths (`/guides/...`, `/blog/...`, `/tools/...`). */
  related: readonly string[];
  /** The one tool call to action, a path from PUBLIC_TOOLS. */
  tool: string;
  /** One sentence on why that tool helps with this term. */
  toolPitch: string;
  /** 1–3 real questions; they feed FAQPage structured data. */
  faq: readonly ArticleFaq[];
  sources: readonly SourceId[];
  /**
   * Duties, licences, controls, tax and customs procedures. A regulated term explains the
   * mechanism only (no rates); it is listed at launch and reviewed afterwards (D-015).
   */
  regulated: boolean;
  /** A named reviewer's check, recorded after launch. Not an approval. */
  review: { reviewer: string; date: string } | null;
  published: string;
  updated: string;
  reviewed: string;
};

export const GLOSSARY_DISCLAIMER =
  'This definition explains general practice to help you read your documents. It is not ' +
  'legal, customs or tax advice, and the rules of the countries involved, your contract and ' +
  'your carrier’s terms take precedence over anything here.';

/**
 * Whether a term is indexed, listed in the sitemap and hub and offered to llms.txt. Per D-015
 * and the owner's 2026-10-08 decision, sourced terms are published at launch, regulated ones
 * included, and reviewed afterwards; the `review` record, when present, shows who checked it.
 */
export function isTermListed(term: GlossaryTerm): boolean {
  return term.sources.length > 0;
}

/** Body words the spec counts: definition, on your documents, example and FAQ. */
export function termWordCount(term: GlossaryTerm): number {
  const text = [
    ...term.definition,
    ...term.onYourDocuments,
    term.example.caption,
    ...term.example.paragraphs,
    ...(term.example.table ? term.example.table.rows.flat() : []),
    ...term.faq.flatMap((entry) => [entry.q, entry.a]),
  ].join(' ');
  return countWords(text);
}

/** A hub entry for a term whose meaning another page already owns. */
export type GlossaryHubEntry = {
  term: string;
  aliases?: readonly string[];
  /** Two lines at most. */
  definition: string;
  /** The page that owns the term. */
  href: string;
};
