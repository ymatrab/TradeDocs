import type { ContentArticle } from '@/lib/content/article';
import { LISTED_COUNTRIES } from '@/lib/content/countries';
import { LISTED_GLOSSARY } from '@/lib/content/glossary';
import { GUIDES } from '@/lib/content/guides';
import { POSTS } from '@/lib/content/posts';
import type { RelatedLink } from '@/lib/content/related';
import { INCOTERMS } from '@/lib/trade/incoterms';

/**
 * Contextual links between the reference pages and the articles that use them.
 *
 * Glossary terms, Incoterms® rule pages and country pages were linked from their hub alone
 * (2026-11-20 audit). Each article now lists the terms, rules and countries it actually
 * mentions, and each term and rule page lists the articles that mention it, so every reference
 * page is reached from the content around it. Matching is on visible text only.
 */

/** Caps per article, so the block stays a short reference list. */
export const MAX_RULE_MENTIONS = 4;
export const MAX_COUNTRY_MENTIONS = 2;
export const MAX_TERM_MENTIONS = 6;
/** Articles listed on one glossary term or Incoterms® rule page. */
export const MAX_BACKLINKS = 6;

type Target = RelatedLink & { patterns: readonly RegExp[] };

function escape(text: string): string {
  return text.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** A whole-word pattern; abbreviations and proper names keep their case. */
function wordPattern(text: string, caseSensitive: boolean): RegExp {
  return new RegExp(`(?<![\\w-])${escape(text)}(?![\\w-])`, caseSensitive ? 'u' : 'iu');
}

/** Aliases that are search phrasings ("what is exporting") rather than names. */
const QUERY_ALIAS = /\b(what|how|meaning|definition|means)\b/i;

function glossaryTargets(): Target[] {
  return LISTED_GLOSSARY.map((term) => {
    const name = term.term.replace(/\s*\(.*\)\s*$/, '').trim();
    const patterns: RegExp[] = [];
    if (name.length >= 3) patterns.push(wordPattern(name, name === name.toUpperCase()));
    if (term.abbreviation && term.abbreviation.length >= 3) {
      patterns.push(wordPattern(term.abbreviation, true));
    }
    for (const alias of term.aliases) {
      if (alias.includes(' ') && !QUERY_ALIAS.test(alias)) patterns.push(wordPattern(alias, false));
    }
    return {
      href: `/glossary/${term.slug}`,
      title: term.term,
      description: term.shortDefinition,
      patterns,
    };
  });
}

function ruleTargets(): Target[] {
  return INCOTERMS.map((rule) => ({
    href: `/tools/incoterms/${rule.code.toLowerCase()}`,
    title: `${rule.code} (${rule.name})`,
    description: rule.riskPasses,
    patterns: [wordPattern(rule.code, true)],
  }));
}

/** Other names a country goes by in the articles. */
const COUNTRY_ALIASES: Readonly<Record<string, readonly string[]>> = {
  'united-states': ['US', 'USA', 'U.S.'],
  'south-korea': ['Korea'],
};

function countryTargets(): Target[] {
  return LISTED_COUNTRIES.map((country) => ({
    href: `/export-documents/${country.slug}`,
    title: `Export documents for ${country.name}`,
    description: country.description,
    patterns: [country.name, ...(COUNTRY_ALIASES[country.slug] ?? [])].map((name) =>
      wordPattern(name, true),
    ),
  }));
}

/** The visible text of an article, without its title. */
function bodyText(article: ContentArticle): string {
  return [
    article.lede,
    article.answer,
    ...article.keyFacts,
    ...article.definitions.flatMap((entry) => [entry.term, entry.meaning]),
    ...article.sections.flatMap((section) => [
      section.heading,
      ...section.paragraphs,
      ...(section.list ?? []),
      ...(section.steps ?? []),
      ...(section.table ? [section.table.caption, ...section.table.head] : []),
      ...(section.table ? section.table.rows.flat() : []),
    ]),
    ...article.faq.flatMap((entry) => [entry.q, entry.a]),
  ].join('\n');
}

type Entry = { path: string; article: ContentArticle; title: string; body: string };

type Graph = {
  articles: readonly Entry[];
  mentions: ReadonlyMap<string, readonly RelatedLink[]>;
  backlinks: ReadonlyMap<string, readonly RelatedLink[]>;
};

let graph: Graph | undefined;

function matches(target: Target, text: string): boolean {
  return target.patterns.some((pattern) => pattern.test(text));
}

/**
 * Picks up to `cap` targets: those named in the title first, then the rarest across the
 * archive, so a term most articles mention does not crowd out the one only a few explain.
 */
function pick(
  targets: readonly Target[],
  entry: Entry,
  frequency: ReadonlyMap<string, number>,
  cap: number,
): Target[] {
  return targets
    .filter(
      (target) => target.href !== entry.path && matches(target, `${entry.title}\n${entry.body}`),
    )
    .map((target) => ({ target, inTitle: matches(target, entry.title) }))
    .sort(
      (a, b) =>
        Number(b.inTitle) - Number(a.inTitle) ||
        (frequency.get(a.target.href) ?? 0) - (frequency.get(b.target.href) ?? 0) ||
        a.target.href.localeCompare(b.target.href),
    )
    .slice(0, cap)
    .map(({ target }) => target);
}

function build(): Graph {
  const articles: Entry[] = [
    ...GUIDES.map((article) => ({ path: `/guides/${article.slug}`, article })),
    ...POSTS.map((article) => ({ path: `/blog/${article.slug}`, article })),
  ].map(({ path, article }) => ({ path, article, title: article.title, body: bodyText(article) }));

  const groups: [readonly Target[], number][] = [
    [ruleTargets(), MAX_RULE_MENTIONS],
    [countryTargets(), MAX_COUNTRY_MENTIONS],
    [glossaryTargets(), MAX_TERM_MENTIONS],
  ];

  const frequency = new Map<string, number>();
  for (const [targets] of groups) {
    for (const target of targets) {
      const count = articles.filter((entry) => matches(target, `${entry.title}\n${entry.body}`));
      frequency.set(target.href, count.length);
    }
  }

  const mentions = new Map<string, RelatedLink[]>();
  const backlinks = new Map<string, RelatedLink[]>();
  for (const entry of articles) {
    const picked = groups.flatMap(([targets, cap]) => pick(targets, entry, frequency, cap));
    mentions.set(
      entry.path,
      picked.map(({ href, title, description }) => ({ href, title, description })),
    );
    for (const target of picked) {
      const list = backlinks.get(target.href) ?? [];
      list.push({
        href: entry.path,
        title: entry.article.title,
        description: entry.article.description,
      });
      backlinks.set(target.href, list);
    }
  }

  graph = { articles, mentions, backlinks };
  return graph;
}

/** The glossary terms, Incoterms® rules and countries an article mentions, as links. */
export function articleMentions(article: ContentArticle, kind: 'blog' | 'guides'): RelatedLink[] {
  return [...((graph ?? build()).mentions.get(`/${kind}/${article.slug}`) ?? [])];
}

/**
 * The articles that link to a reference page (`/glossary/teu`, `/tools/incoterms/fca`) from
 * their "Terms in this article" block, title matches first, at most MAX_BACKLINKS.
 */
export function articlesMentioning(href: string): RelatedLink[] {
  const all = (graph ?? build()).backlinks.get(href) ?? [];
  const code = /^\/tools\/incoterms\/([a-z]+)$/.exec(href)?.[1];
  // On a rule page, the head-to-head comparisons ("fca-vs-fob") lead.
  const ranked = code
    ? [...all].sort(
        (a, b) =>
          Number(isComparisonOf(b.href, code)) - Number(isComparisonOf(a.href, code)) ||
          a.href.localeCompare(b.href),
      )
    : all;
  return ranked.slice(0, MAX_BACKLINKS);
}

function isComparisonOf(path: string, code: string): boolean {
  const slug = path.split('/').pop() ?? '';
  return slug.includes('-vs-') && slug.split('-').includes(code);
}
