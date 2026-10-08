import { describe, expect, it } from 'vitest';
import { FEATURES } from '@/lib/billing/plans';
import { findGuide } from '@/lib/content/guides';
import { findPost } from '@/lib/content/posts';
import { USE_CASES } from '@/lib/content/use-cases';
import { PUBLIC_TOOLS, SITEMAP_PAGES } from '@/lib/seo/site';

const toolPaths = new Set(PUBLIC_TOOLS.map((tool) => tool.path));
const sitemap = new Map(SITEMAP_PAGES.map((page) => [page.path, page.lastModified]));

/** Whether a link on a use-case page points at a page that exists. */
function exists(href: string): boolean {
  if (href === '/guides' || href === '/tools/incoterms') return true;
  if (href.startsWith('/tools/')) return toolPaths.has(href);
  if (href.startsWith('/guides/')) return findGuide(href.slice('/guides/'.length)) !== undefined;
  if (href.startsWith('/blog/')) return findPost(href.slice('/blog/'.length)) !== undefined;
  return false;
}

describe('use-case pages', () => {
  it('are the three the content plan names, each in the sitemap with its date', () => {
    expect(USE_CASES.map((useCase) => useCase.slug)).toEqual([
      'exporters',
      'freight-forwarders',
      'trade-consultants',
    ]);
    for (const useCase of USE_CASES) {
      expect(sitemap.get(`/for/${useCase.slug}`)).toBe(useCase.updated);
    }
  });

  it('link only to pages that exist', () => {
    for (const useCase of USE_CASES) {
      for (const link of [...useCase.tools, ...useCase.reading]) {
        expect(exists(link.href), `${useCase.slug} links to ${link.href}`).toBe(true);
      }
    }
  });

  it('name only free workspace features from the plan module, never a paid-only one', () => {
    for (const useCase of USE_CASES) {
      for (const key of useCase.features) {
        const feature = FEATURES.find((entry) => entry.key === key);
        expect(feature, `${useCase.slug} names ${key}`).toBeDefined();
        expect(feature?.plans).toContain('free');
      }
    }
  });

  it('keep the forwarder page to document preparation and show no price', () => {
    const forwarders = USE_CASES.find((useCase) => useCase.slug === 'freight-forwarders');
    expect(forwarders?.lede).toContain('does not book freight');
    expect(forwarders?.boundaries.join(' ')).toContain('not a forwarding TMS');
    for (const useCase of USE_CASES) {
      expect(JSON.stringify(useCase)).not.toMatch(/[$€£]\s?\d/);
    }
  });
});
