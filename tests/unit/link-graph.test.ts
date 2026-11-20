import { describe, expect, it } from 'vitest';
import { LISTED_COUNTRIES } from '@/lib/content/countries';
import { GLOSSARY, LISTED_GLOSSARY } from '@/lib/content/glossary';
import { GUIDES } from '@/lib/content/guides';
import {
  MAX_BACKLINKS,
  MAX_COUNTRY_MENTIONS,
  MAX_RULE_MENTIONS,
  MAX_TERM_MENTIONS,
  articleMentions,
  articlesMentioning,
} from '@/lib/content/link-graph';
import { resolvePageLink } from '@/lib/content/page-links';
import { POSTS } from '@/lib/content/posts';
import { MAX_RELATED, relatedLinks, topicTokens } from '@/lib/content/related';
import { INCOTERMS } from '@/lib/trade/incoterms';

const ARTICLES = [
  ...GUIDES.map((article) => ({ article, kind: 'guides' as const })),
  ...POSTS.map((article) => ({ article, kind: 'blog' as const })),
];

const mentions = ARTICLES.map(({ article, kind }) => ({
  path: `/${kind}/${article.slug}`,
  links: articleMentions(article, kind),
}));

describe('internal link graph (2026-11-20 audit)', () => {
  it('keeps every mentions block short, unique and pointing at real pages', () => {
    for (const { path, links } of mentions) {
      const hrefs = links.map((link) => link.href);
      expect(new Set(hrefs).size, path).toBe(hrefs.length);
      expect(hrefs.filter((href) => href.startsWith('/tools/incoterms/')).length, path).toBeLessThanOrEqual(
        MAX_RULE_MENTIONS,
      );
      expect(hrefs.filter((href) => href.startsWith('/export-documents/')).length, path).toBeLessThanOrEqual(
        MAX_COUNTRY_MENTIONS,
      );
      expect(hrefs.filter((href) => href.startsWith('/glossary/')).length, path).toBeLessThanOrEqual(
        MAX_TERM_MENTIONS,
      );
      for (const href of hrefs) {
        if (href.startsWith('/tools/incoterms/')) continue;
        expect(resolvePageLink(href), `${path} → ${href}`).toBeDefined();
      }
    }
  });

  it('links every listed glossary term, Incoterms rule and country page from content', () => {
    const linked = new Set(mentions.flatMap(({ links }) => links.map((link) => link.href)));
    // A term linked from another term's "Related" block is reached from content too.
    for (const term of GLOSSARY) {
      for (const reference of term.related) {
        const link = resolvePageLink(reference);
        if (link && link.href !== `/glossary/${term.slug}`) linked.add(link.href);
      }
    }
    const expected = [
      ...LISTED_GLOSSARY.map((term) => `/glossary/${term.slug}`),
      ...INCOTERMS.map((rule) => `/tools/incoterms/${rule.code.toLowerCase()}`),
      ...LISTED_COUNTRIES.map((country) => `/export-documents/${country.slug}`),
    ];
    const orphans = expected.filter((href) => !linked.has(href));
    expect(orphans).toEqual([]);
  });

  it('links every guide and post from at least one other page', () => {
    const linked = new Set<string>();
    for (const { article, kind } of ARTICLES) {
      for (const link of relatedLinks(article, kind)) linked.add(link.href);
    }
    for (const href of [
      ...LISTED_GLOSSARY.map((term) => `/glossary/${term.slug}`),
      ...INCOTERMS.map((rule) => `/tools/incoterms/${rule.code.toLowerCase()}`),
    ]) {
      for (const link of articlesMentioning(href)) linked.add(link.href);
    }
    for (const term of GLOSSARY) {
      for (const reference of term.related) {
        const link = resolvePageLink(reference);
        if (link) linked.add(link.href);
      }
    }
    const orphans = ARTICLES.map(({ article, kind }) => `/${kind}/${article.slug}`).filter(
      (path) => !linked.has(path),
    );
    expect(orphans).toEqual([]);
  });

  it('puts hand-picked related articles first and tops up to six', () => {
    for (const { article, kind } of ARTICLES) {
      const hrefs = relatedLinks(article, kind).map((link) => link.href);
      expect(hrefs.length, article.slug).toBeLessThanOrEqual(MAX_RELATED);
      expect(hrefs, article.slug).not.toContain(`/${kind}/${article.slug}`);
      const picked = (article.related ?? []).slice(0, MAX_RELATED);
      expect(hrefs.slice(0, picked.length), article.slug).toEqual(picked);
    }
  });

  it('reads topic words from the slug and title, without stop words or plurals', () => {
    const tokens = topicTokens({ slug: 'fca-vs-fob', title: 'FCA vs FOB: which rules fit?' });
    expect([...tokens].sort()).toEqual(['fca', 'fit', 'fob', 'rule']);
  });

  it('lists at most six articles on a term or rule page, comparisons first on a rule page', () => {
    for (const rule of INCOTERMS) {
      const code = rule.code.toLowerCase();
      const links = articlesMentioning(`/tools/incoterms/${code}`);
      expect(links.length, code).toBeLessThanOrEqual(MAX_BACKLINKS);
      const isComparison = links.map((link) => /-vs-/.test(link.href) && link.href.split(/[/-]/).includes(code));
      const firstOther = isComparison.indexOf(false);
      if (firstOther !== -1) expect(isComparison.slice(firstOther), code).not.toContain(true);
    }
  });
});
