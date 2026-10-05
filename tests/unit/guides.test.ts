import { describe, expect, it } from 'vitest';
import { GUIDES, findGuide, guideWordCount } from '@/lib/content/guides';
import { PUBLIC_TOOLS, SITEMAP_PAGES } from '@/lib/seo/site';
import { SOURCES } from '@/lib/trade/sources';

const UNSPLASH_RAW = /^https:\/\/images\.unsplash\.com\/photo-[\w-]+$/;

describe('guides', () => {
  it('have unique slugs and resolve by slug', () => {
    const slugs = GUIDES.map((guide) => guide.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(findGuide(slug)?.slug).toBe(slug);
    expect(findGuide('not-a-guide')).toBeUndefined();
  });

  it('are substantive: between 900 and 1,500 visible words each', () => {
    for (const guide of GUIDES) {
      const words = guideWordCount(guide);
      expect(words, guide.slug).toBeGreaterThanOrEqual(900);
      expect(words, guide.slug).toBeLessThanOrEqual(1500);
    }
  });

  it('keep the rendered title within 60 characters, site suffix included', () => {
    // The root layout's title template appends " · TradeDocs".
    for (const guide of GUIDES) {
      expect(`${guide.metaTitle} · TradeDocs`.length, guide.slug).toBeLessThanOrEqual(60);
    }
  });

  it('cite registered sources and link only to tools that exist', () => {
    const tools = new Set(PUBLIC_TOOLS.map((tool) => tool.path));
    for (const guide of GUIDES) {
      expect(guide.sources.length, guide.slug).toBeGreaterThan(0);
      for (const id of guide.sources) expect(SOURCES[id], `${guide.slug}: ${id}`).toBeDefined();
      for (const path of guide.tools) expect(tools.has(path), `${guide.slug}: ${path}`).toBe(true);
    }
  });

  it('carry the team byline, valid dates and a credited Unsplash cover', () => {
    for (const guide of GUIDES) {
      expect(guide.byline).toBe('TradeDocs team');
      for (const date of [guide.published, guide.updated, guide.reviewed]) {
        expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
      expect(guide.updated >= guide.published).toBe(true);
      expect(guide.cover.src, guide.slug).toMatch(UNSPLASH_RAW);
      expect(guide.cover.alt.length, guide.slug).toBeGreaterThan(20);
      expect(guide.cover.photographer.profile).toMatch(/^https:\/\/unsplash\.com\/@/);
      expect(guide.cover.page).toContain(guide.cover.id);
      expect(guide.faq.length).toBeGreaterThan(0);
    }
  });

  it('are in the sitemap with their own date, alongside the hub', () => {
    const paths = new Map(SITEMAP_PAGES.map((page) => [page.path, page.lastModified]));
    expect(paths.has('/guides')).toBe(true);
    for (const guide of GUIDES) {
      expect(paths.get(`/guides/${guide.slug}`)).toBe(guide.updated);
    }
  });

  it('stay off the certificate of origin while it is gated', () => {
    for (const guide of GUIDES) {
      expect(JSON.stringify(guide)).not.toMatch(/certificate of origin/i);
    }
  });
});
