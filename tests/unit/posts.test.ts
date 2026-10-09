import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { expectNoGatedPhrase } from './gated-content';
import sitemap from '@/app/sitemap';
import { countWords, orderArticles, type ContentArticle } from '@/lib/content/article';
import { COUNTRIES } from '@/lib/content/countries';
import { GLOSSARY } from '@/lib/content/glossary';
import { GUIDES } from '@/lib/content/guides';
import { MAX_RELATED, findArticleByPath, relatedLinks } from '@/lib/content/related';
import { ARTICLE_SOURCE_FILES } from '@/lib/content/sources';
import { articlePlainText } from '@/lib/content/plain-text';
import {
  BLOG_HUB_COVER,
  BLOG_UPDATED,
  POSTS,
  POST_DISCLAIMER,
  findPost,
  postWordCount,
} from '@/lib/content/posts';
import { PUBLIC_TOOLS, SITEMAP_PAGES } from '@/lib/seo/site';
import { CORE_SOURCE_IDS, SOURCES, mergeSourceFiles, type SourceFields } from '@/lib/trade/sources';

const UNSPLASH_RAW = /^https:\/\/images\.unsplash\.com\/photo-[\w-]+$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const toolPaths = new Set(PUBLIC_TOOLS.map((tool) => tool.path));

/** The answer-engine structure every guide and post carries (task: GEO/AEO round). */
function expectAnswerStructure(article: ContentArticle) {
  const words = countWords(article.answer);
  expect(words, `${article.slug}: short answer words`).toBeGreaterThanOrEqual(40);
  expect(words, `${article.slug}: short answer words`).toBeLessThanOrEqual(60);
  expect(article.keyFacts.length, article.slug).toBeGreaterThanOrEqual(3);
  expect(article.definitions.length, article.slug).toBeGreaterThan(0);
  expect(article.faq.length, article.slug).toBeGreaterThanOrEqual(3);
  // Most headings are the question a reader would type.
  const questions = article.sections.filter((section) => section.heading.endsWith('?'));
  expect(questions.length / article.sections.length, article.slug).toBeGreaterThanOrEqual(0.75);
  // At least one step list or comparison table, the shapes answer engines lift.
  expect(
    article.sections.some((section) => section.steps || section.table),
    article.slug,
  ).toBe(true);
  // The conversion path: an in-context tool and a mid-article callout that both exist.
  expect(toolPaths.has(article.primaryTool), `${article.slug}: ${article.primaryTool}`).toBe(true);
  expect(toolPaths.has(article.callout.tool), `${article.slug}: ${article.callout.tool}`).toBe(
    true,
  );
  expect(article.callout.afterSection).toBeGreaterThanOrEqual(0);
  expect(article.callout.afterSection).toBeLessThan(article.sections.length - 1);
  // FAQ questions are unique, since FAQPage is built from the same array.
  const questionsAsked = article.faq.map((entry) => entry.q);
  expect(new Set(questionsAsked).size, article.slug).toBe(questionsAsked.length);
}

describe('blog posts', () => {
  it('have unique slugs that do not collide with guides, and resolve by slug', () => {
    const slugs = POSTS.map((post) => post.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    const guideSlugs = new Set(GUIDES.map((guide) => guide.slug));
    for (const slug of slugs) {
      expect(findPost(slug)?.slug).toBe(slug);
      expect(guideSlugs.has(slug), slug).toBe(false);
    }
    expect(findPost('not-a-post')).toBeUndefined();
  });

  it('are substantive: between 1,200 and 1,800 visible words each', () => {
    for (const post of POSTS) {
      const words = postWordCount(post);
      expect(words, post.slug).toBeGreaterThanOrEqual(1200);
      expect(words, post.slug).toBeLessThanOrEqual(1800);
    }
  });

  it('keep the rendered title within 60 characters, site suffix included', () => {
    // The root layout's title template appends " · TradeDocs".
    for (const post of POSTS) {
      expect(`${post.metaTitle} · TradeDocs`.length, post.slug).toBeLessThanOrEqual(60);
      expect(post.description.length, post.slug).toBeLessThanOrEqual(200);
    }
  });

  it('cite registered sources with a retrieval date and link only to tools that exist', () => {
    for (const post of POSTS) {
      expect(post.sources.length, post.slug).toBeGreaterThan(0);
      for (const id of post.sources) {
        const record = SOURCES[id];
        expect(record, `${post.slug}: ${id}`).toBeDefined();
        expect(record.retrieved).toMatch(ISO_DATE);
        expect(record.url).toMatch(/^https:\/\//);
      }
      for (const path of post.tools) {
        expect(toolPaths.has(path), `${post.slug}: ${path}`).toBe(true);
      }
    }
  });

  it('carry the team byline, valid dates and a credited Unsplash cover', () => {
    for (const post of POSTS) {
      expect(post.byline).toBe('TradeDocs team');
      for (const date of [post.published, post.updated, post.reviewed]) {
        expect(date).toMatch(ISO_DATE);
      }
      expect(post.updated >= post.published).toBe(true);
      expect(post.cover.src, post.slug).toMatch(UNSPLASH_RAW);
      expect(post.cover.alt.length, post.slug).toBeGreaterThan(20);
      expect(post.cover.alt.length, post.slug).toBeLessThanOrEqual(125);
      expect(post.cover.photographer.profile).toMatch(/^https:\/\/unsplash\.com\/@/);
      expect(post.cover.page).toContain(post.cover.id);
    }
    expect(BLOG_HUB_COVER.src).toMatch(UNSPLASH_RAW);
  });

  it('each use a different cover photo', () => {
    const ids = [...POSTS, ...GUIDES].map((article) => article.cover.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('carry the answer-first structure, like the guides', () => {
    for (const post of POSTS) expectAnswerStructure(post);
    for (const guide of GUIDES) expectAnswerStructure(guide);
  });

  it('label worked examples as invented', () => {
    for (const post of POSTS) {
      for (const section of post.sections) {
        if (/example/i.test(section.table?.caption ?? '')) {
          expect(section.table?.caption, post.slug).toMatch(/invented/i);
        }
      }
    }
    expect(POST_DISCLAIMER).toMatch(/not legal, customs or tax advice/);
  });

  it('are in the sitemap with their own date and cover, alongside the hub', () => {
    const paths = new Map(SITEMAP_PAGES.map((page) => [page.path, page.lastModified]));
    expect(paths.get('/blog')).toBe(BLOG_UPDATED);
    for (const post of POSTS) expect(paths.get(`/blog/${post.slug}`)).toBe(post.updated);

    const entries = sitemap();
    const imagesFor = (suffix: string) =>
      entries.find((entry) => entry.url.endsWith(suffix))?.images ?? [];
    expect(imagesFor('/blog')).toEqual([BLOG_HUB_COVER.src]);
    for (const post of POSTS) expect(imagesFor(`/blog/${post.slug}`)).toEqual([post.cover.src]);
  });

  it('stay off the certificate of origin while it is gated', () => {
    for (const post of POSTS) {
      expectNoGatedPhrase(JSON.stringify(post), post.slug);
    }
  });

  it('render to plain text with the answer, FAQ and sources for llms-full.txt', () => {
    const [post] = POSTS;
    const text = articlePlainText(post!, 'https://example.test/blog/x', POST_DISCLAIMER);
    expect(text).toContain(`# ${post!.title}`);
    expect(text).toContain(`Short answer: ${post!.answer}`);
    for (const entry of post!.faq) expect(text).toContain(`Q: ${entry.q}`);
    for (const id of post!.sources) expect(text).toContain(SOURCES[id].url);
  });
});

/** The `.ts` files in a content folder, minus its index, as slugs. */
function articleFiles(folder: string): string[] {
  return readdirSync(join(process.cwd(), 'src/lib/content', folder))
    .filter((name) => name.endsWith('.ts') && name !== 'index.ts')
    .map((name) => name.replace(/\.ts$/, ''))
    .sort();
}

describe('one file per article (parallel writing)', () => {
  it('lists every post and guide file in its index, each named after its slug', () => {
    // A file missing from the index would never be rendered, linked or put in the sitemap.
    expect(articleFiles('posts')).toEqual(POSTS.map((post) => post.slug).sort());
    expect(articleFiles('guides')).toEqual(GUIDES.map((guide) => guide.slug).sort());
  });

  it('orders articles newest first and keeps the index order on the same day', () => {
    const at = (slug: string, published: string) => ({ ...POSTS[0]!, slug, published });
    const entries = [at('b', '2026-10-06'), at('a', '2026-10-06'), at('c', '2026-11-01')];
    expect(orderArticles(entries).map((article) => article.slug)).toEqual(['c', 'b', 'a']);
  });

  it('merges per-page source files, named after a page, without repeating an id', () => {
    const slugs = new Set([
      ...[...POSTS, ...GUIDES].map((article) => article.slug),
      ...GLOSSARY.map((term) => term.slug),
      ...COUNTRIES.map((country) => country.slug),
    ]);
    for (const slug of articleFiles('sources')) expect(slugs.has(slug), slug).toBe(true);
    expect(articleFiles('sources')).toHaveLength(ARTICLE_SOURCE_FILES.length);

    const added = ARTICLE_SOURCE_FILES.flatMap((file) => Object.keys(file));
    expect(new Set(added).size).toBe(added.length);
    expect(Object.keys(SOURCES)).toHaveLength(CORE_SOURCE_IDS.length + added.length);
    for (const id of added) {
      const record = SOURCES[id as keyof typeof SOURCES];
      expect(record.id).toBe(id);
      expect(record.url, id).toMatch(/^https:\/\//);
      expect(record.retrieved, id).toMatch(ISO_DATE);
      expect(record.reviewer, id).not.toBe('');
    }
  });

  it('link related articles that exist, never themselves, at most six', () => {
    const articles = [
      ...POSTS.map((article) => ({ article, kind: 'blog' as const })),
      ...GUIDES.map((article) => ({ article, kind: 'guides' as const })),
    ];
    for (const { article, kind } of articles) {
      const own = `/${kind}/${article.slug}`;
      const paths = article.related ?? [];
      expect(paths.length, article.slug).toBeLessThanOrEqual(MAX_RELATED);
      for (const path of paths) {
        expect(findArticleByPath(path), `${article.slug}: ${path}`).toBeDefined();
        expect(path, article.slug).not.toBe(own);
      }
      const links = relatedLinks(article, kind);
      expect(links.length, article.slug).toBeLessThanOrEqual(MAX_RELATED);
      expect(
        links.map((link) => link.href),
        article.slug,
      ).not.toContain(own);
    }
    expect(findArticleByPath('/blog/not-a-post')).toBeUndefined();
    expect(findArticleByPath('/tools/cbm-calculator')).toBeUndefined();
  });

  it('refuses a source id defined twice', () => {
    const record = SOURCES['icc-incoterms-2020'];
    const fields: SourceFields = { ...record };
    const core = { 'icc-incoterms-2020': record };
    const twice = /defined more than once/;
    expect(() => mergeSourceFiles(core, [{ 'icc-incoterms-2020': fields }])).toThrow(twice);
    const repeated = [{ 'x-source': fields }, { 'x-source': fields }];
    expect(() => mergeSourceFiles({}, repeated)).toThrow(twice);
    expect(mergeSourceFiles({}, [{ 'x-source': fields }])['x-source']?.id).toBe('x-source');
  });
});
