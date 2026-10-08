import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';
import { countWords } from '@/lib/content/article';
import {
  COUNTRIES,
  COUNTRIES_HUB,
  COUNTRY_POSTS,
  LISTED_COUNTRIES,
  findCountry,
} from '@/lib/content/countries';
import {
  COUNTRY_DISCLAIMER,
  countrySentences,
  countryWordCount,
  sourcedFactCount,
} from '@/lib/content/country';
import {
  GLOSSARY,
  GLOSSARY_HUB,
  GLOSSARY_HUB_ENTRIES,
  GLOSSARY_UPDATED,
  LISTED_GLOSSARY,
  findTerm,
} from '@/lib/content/glossary';
import { GLOSSARY_DISCLAIMER, isTermListed, termWordCount } from '@/lib/content/glossary-term';
import { resolvePageLink } from '@/lib/content/page-links';
import { countryPlainText, termPlainText } from '@/lib/content/plain-text';
import { definedTermSchema, definedTermSetSchema } from '@/lib/seo/json-ld';
import { PUBLIC_TOOLS, SITEMAP_PAGES } from '@/lib/seo/site';
import { SOURCES } from '@/lib/trade/sources';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const DATA_DIR = join(process.cwd(), 'docs/research/dataforseo-2026-10-07');
const toolPaths = new Set(PUBLIC_TOOLS.map((tool) => tool.path));
const sitemapPaths = new Map(SITEMAP_PAGES.map((page) => [page.path, page.lastModified]));

function files(folder: string): string[] {
  return readdirSync(join(process.cwd(), 'src/lib/content', folder))
    .filter((name) => name.endsWith('.ts') && name !== 'index.ts')
    .map((name) => name.replace(/\.ts$/, ''))
    .sort();
}

function expectSources(owner: string, ids: readonly string[]) {
  for (const id of ids) {
    const record = SOURCES[id as keyof typeof SOURCES];
    expect(record, `${owner}: ${id}`).toBeDefined();
    expect(record.url, `${owner}: ${id}`).toMatch(/^https:\/\//);
    expect(record.retrieved, `${owner}: ${id}`).toMatch(ISO_DATE);
    expect(record.reviewer, `${owner}: ${id}`).not.toBe('');
  }
}

describe('glossary terms', () => {
  it('have one file each, listed in the index and named after the slug', () => {
    expect(files('glossary')).toEqual(GLOSSARY.map((term) => term.slug).sort());
    const slugs = GLOSSARY.map((term) => term.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(findTerm(slug)?.slug).toBe(slug);
    expect(findTerm('not-a-term')).toBeUndefined();
  });

  it('rest on measured demand of 200 searches a month or more, from a saved file', () => {
    for (const term of GLOSSARY) {
      expect(term.demand.volume, term.slug).toBeGreaterThanOrEqual(200);
      expect(existsSync(join(DATA_DIR, term.demand.dataFile)), term.slug).toBe(true);
    }
  });

  it('keep to the template lengths', () => {
    for (const term of GLOSSARY) {
      const short = countWords(term.shortDefinition);
      expect(short, `${term.slug}: short definition`).toBeGreaterThanOrEqual(25);
      expect(short, `${term.slug}: short definition`).toBeLessThanOrEqual(50);
      const definition = countWords(term.definition.join(' '));
      expect(definition, `${term.slug}: definition`).toBeGreaterThanOrEqual(120);
      expect(definition, `${term.slug}: definition`).toBeLessThanOrEqual(250);
      const body = termWordCount(term);
      expect(body, `${term.slug}: body`).toBeGreaterThanOrEqual(350);
      expect(body, `${term.slug}: body`).toBeLessThanOrEqual(700);
    }
  });

  it('keep the rendered title within 60 characters, site suffix included', () => {
    for (const term of [...GLOSSARY, { slug: 'hub', metaTitle: GLOSSARY_HUB.metaTitle }]) {
      expect(`${term.metaTitle} · TradeDocs`.length, term.slug).toBeLessThanOrEqual(60);
    }
    for (const term of GLOSSARY) expect(term.description.length).toBeLessThanOrEqual(200);
  });

  it('cite registered sources, link one real tool and 2–5 pages that exist', () => {
    for (const term of GLOSSARY) {
      expect(term.sources.length, term.slug).toBeGreaterThan(0);
      expectSources(term.slug, term.sources);
      expect(toolPaths.has(term.tool), `${term.slug}: ${term.tool}`).toBe(true);
      expect(term.related.length, term.slug).toBeGreaterThanOrEqual(2);
      expect(term.related.length, term.slug).toBeLessThanOrEqual(5);
      for (const reference of term.related) {
        expect(resolvePageLink(reference), `${term.slug}: ${reference}`).toBeDefined();
        expect(reference, term.slug).not.toBe(term.slug);
      }
    }
  });

  it('carry 1–3 unique questions, an invented example and valid dates', () => {
    for (const term of GLOSSARY) {
      expect(term.faq.length, term.slug).toBeGreaterThanOrEqual(1);
      expect(term.faq.length, term.slug).toBeLessThanOrEqual(3);
      const questions = term.faq.map((entry) => entry.q);
      expect(new Set(questions).size, term.slug).toBe(questions.length);
      expect(term.example.caption, term.slug).toMatch(/invented/i);
      for (const date of [term.published, term.updated, term.reviewed]) {
        expect(date).toMatch(ISO_DATE);
      }
      expect(term.updated >= term.published, term.slug).toBe(true);
    }
  });

  it('state no rates and stay off the certificate of origin', () => {
    for (const term of GLOSSARY) {
      const text = JSON.stringify(term);
      expect(text, term.slug).not.toMatch(/certificate of origin/i);
      expect(text, term.slug).not.toMatch(/\d\s?%/);
    }
    expect(GLOSSARY_DISCLAIMER).toMatch(/not legal, customs or tax advice/);
  });

  it('list the hub and every unregulated or reviewed term in the sitemap, and nothing else', () => {
    expect(sitemapPaths.get('/glossary')).toBe(GLOSSARY_UPDATED);
    for (const term of GLOSSARY) {
      const path = `/glossary/${term.slug}`;
      if (isTermListed(term)) expect(sitemapPaths.get(path), term.slug).toBe(term.updated);
      else expect(sitemapPaths.has(path), term.slug).toBe(false);
    }
    expect(LISTED_GLOSSARY.every(isTermListed)).toBe(true);
    const regulated = { ...GLOSSARY[0]!, regulated: true, review: null };
    expect(isTermListed(regulated)).toBe(false);
    const reviewed = { ...regulated, review: { reviewer: 'A. Person', date: '2026-10-08' } };
    expect(isTermListed(reviewed)).toBe(true);
    expect(sitemap().some((entry) => entry.url.endsWith('/glossary'))).toBe(true);
  });

  it('link hub-only entries to pages that exist', () => {
    const terms = new Set(GLOSSARY.map((term) => term.term.toLowerCase()));
    for (const entry of GLOSSARY_HUB_ENTRIES) {
      expect(resolvePageLink(entry.href), entry.term).toBeDefined();
      expect(terms.has(entry.term.toLowerCase()), entry.term).toBe(false);
      expect(countWords(entry.definition), entry.term).toBeLessThanOrEqual(35);
    }
  });

  it('marks each term up as a DefinedTerm inside the hub set', () => {
    const base = 'https://example.test';
    const [term] = GLOSSARY;
    const node = definedTermSchema(
      base,
      { path: `/glossary/${term!.slug}`, name: term!.term, description: term!.shortDefinition },
      '/glossary',
    );
    const set = definedTermSetSchema(
      base,
      { path: '/glossary', name: GLOSSARY_HUB.setName, description: GLOSSARY_HUB.description },
      [],
    );
    expect(node['@type']).toBe('DefinedTerm');
    expect((node.inDefinedTermSet as { '@id': string })['@id']).toBe(set['@id']);
    expect(node.description).toBe(term!.shortDefinition);
  });

  it('render to plain text with the definition, questions and sources', () => {
    const [term] = GLOSSARY;
    const text = termPlainText(term!, 'https://example.test/glossary/x', GLOSSARY_DISCLAIMER);
    expect(text).toContain(`Definition: ${term!.shortDefinition}`);
    for (const entry of term!.faq) expect(text).toContain(`Q: ${entry.q}`);
    for (const id of term!.sources) expect(text).toContain(SOURCES[id].url);
  });
});

describe('country pages', () => {
  it('have one file each, listed in the index and named after the slug', () => {
    expect(files('countries')).toEqual(COUNTRIES.map((country) => country.slug).sort());
    for (const country of COUNTRIES) expect(findCountry(country.slug)?.slug).toBe(country.slug);
  });

  it('rest on at least 150 searches a month across their phrasings', () => {
    for (const country of COUNTRIES) {
      const total = country.demand.reduce((sum, row) => sum + row.volume, 0);
      expect(total, country.slug).toBeGreaterThanOrEqual(150);
      for (const row of country.demand) {
        expect(existsSync(join(DATA_DIR, row.dataFile)), `${country.slug}: ${row.keyword}`).toBe(
          true,
        );
      }
    }
  });

  it('answer first, run 900–1,600 words and carry at least five sourced facts', () => {
    for (const country of COUNTRIES) {
      const answer = countWords(country.answer);
      expect(answer, country.slug).toBeGreaterThanOrEqual(40);
      expect(answer, country.slug).toBeLessThanOrEqual(60);
      const words = countryWordCount(country);
      expect(words, country.slug).toBeGreaterThanOrEqual(900);
      expect(words, country.slug).toBeLessThanOrEqual(1600);
      expect(sourcedFactCount(country), country.slug).toBeGreaterThanOrEqual(5);
      expect(country.documents.length, country.slug).toBeGreaterThanOrEqual(4);
      expect(country.faq.length, country.slug).toBeGreaterThanOrEqual(3);
      expect(country.faq.length, country.slug).toBeLessThanOrEqual(5);
      expect(`${country.metaTitle} · TradeDocs`.length, country.slug).toBeLessThanOrEqual(60);
      expect(country.description.length, country.slug).toBeLessThanOrEqual(200);
    }
    expect(`${COUNTRIES_HUB.metaTitle} · TradeDocs`.length).toBeLessThanOrEqual(60);
  });

  it('cite the customs authority, the ITA country guide and every row’s source', () => {
    for (const country of COUNTRIES) {
      expect(country.sources.length, country.slug).toBeGreaterThanOrEqual(3);
      expectSources(country.slug, country.sources);
      expect(country.sources, country.slug).toContain(country.customsAuthority.sourceId);
      // Each foreign market cites its ITA Country Commercial Guide; the United States has no
      // guide about itself, so its page rests on CBP and the other US agencies it cites.
      if (country.slug !== 'united-states') {
        expect(
          country.sources.some((id) => id.startsWith('trade-gov-ccg-')),
          country.slug,
        ).toBe(true);
      }
      const rowSources = [
        ...country.documents.map((row) => row.sourceId),
        ...country.invoiceRequirements.map((row) => row.sourceId),
        ...country.importerIdentifiers.map((row) => row.sourceId),
        ...country.incotermsNotes.map((row) => row.sourceId),
        ...(country.controlledGoods ? [country.controlledGoods.sourceId] : []),
        ...(country.valuationBasis ? [country.valuationBasis.sourceId] : []),
        ...(country.packaging ? [country.packaging.sourceId] : []),
        ...(country.lowValueThreshold ? [country.lowValueThreshold.sourceId] : []),
      ];
      for (const id of rowSources) expect(country.sources, `${country.slug}: ${id}`).toContain(id);
      for (const row of country.documents) {
        if (row.tool) expect(toolPaths.has(row.tool), `${country.slug}: ${row.tool}`).toBe(true);
      }
      expect(toolPaths.has(country.tool), country.slug).toBe(true);
    }
  });

  it('are distinct: no more than 30% of sentences shared with another country', () => {
    for (const country of COUNTRIES) {
      const own = countrySentences(country);
      for (const other of COUNTRIES) {
        if (other.slug === country.slug) continue;
        const theirs = new Set(countrySentences(other));
        const shared = own.filter((sentence) => theirs.has(sentence)).length;
        expect(shared / own.length, `${country.slug} vs ${other.slug}`).toBeLessThanOrEqual(0.3);
      }
    }
  });

  it('state no duty or tax rates and stay off the certificate of origin', () => {
    for (const country of COUNTRIES) {
      const text = JSON.stringify(country);
      expect(text, country.slug).not.toMatch(/certificate of origin/i);
      expect(text, country.slug).not.toMatch(/\d\s?%/);
    }
    expect(COUNTRY_DISCLAIMER).toMatch(/not legal, customs or tax advice/);
  });

  // D-015: sourced fact pages are published at launch and reviewed afterwards.
  it('are listed in the sitemap once sourced, with or without a review record', () => {
    for (const country of COUNTRIES) {
      expect(country.regulated).toBe(true);
      const listed = LISTED_COUNTRIES.includes(country);
      expect(listed, country.slug).toBe(country.sources.length > 0);
      expect(sitemapPaths.has(`/export-documents/${country.slug}`), country.slug).toBe(listed);
    }
    expect(sitemapPaths.has('/export-documents')).toBe(LISTED_COUNTRIES.length > 0);
    for (const post of COUNTRY_POSTS) expect(resolvePageLink(post.href), post.href).toBeDefined();
  });

  it('render to plain text with every fact’s source', () => {
    const [country] = COUNTRIES;
    const text = countryPlainText(country!, 'https://example.test/x', COUNTRY_DISCLAIMER);
    expect(text).toContain(`Short answer: ${country!.answer}`);
    for (const row of country!.documents) expect(text).toContain(row.document);
    for (const id of country!.sources) expect(text).toContain(SOURCES[id].url);
  });
});
