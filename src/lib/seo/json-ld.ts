import { SITE_DESCRIPTION, SITE_NAME, type PublicTool } from '@/lib/seo/site';

/**
 * Schema.org builders. Pure: every function takes the canonical origin, so the same data
 * renders against production, a preview or a test without reading the environment.
 *
 * Only facts the page itself shows. No ratings, reviews or counts: TradeDocs has none to
 * report, and structured data that disagrees with the visible page is spam.
 */

export type JsonLdObject = Record<string, unknown>;

/** JSON safe to place inside a script element: `<` can never close it. */
export function jsonLdScript(data: JsonLdObject | JsonLdObject[]): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

function absolute(base: string, path: string): string {
  return `${base}${path}`;
}

export function organizationSchema(base: string): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${base}/#organization`,
    name: SITE_NAME,
    url: absolute(base, '/'),
    logo: absolute(base, '/icon.svg'),
  };
}

export function websiteSchema(base: string): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${base}/#website`,
    name: SITE_NAME,
    url: absolute(base, '/'),
    description: SITE_DESCRIPTION,
    inLanguage: 'en',
    publisher: { '@id': `${base}/#organization` },
  };
}

/** A free browser tool. The zero-price offer states that it is free, nothing more. */
export function softwareApplicationSchema(base: string, tool: PublicTool): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.summary,
    url: absolute(base, tool.path),
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any (runs in a web browser)',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@id': `${base}/#organization` },
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbSchema(base: string, crumbs: readonly Crumb[]): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absolute(base, crumb.path),
    })),
  };
}

export type QuestionAndAnswer = { q: string; a: string };

/** Only for questions the page renders in full; pass the same array the page maps over. */
export function faqPageSchema(entries: readonly QuestionAndAnswer[]): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map((entry) => ({
      '@type': 'Question',
      name: entry.q,
      acceptedAnswer: { '@type': 'Answer', text: entry.a },
    })),
  };
}
