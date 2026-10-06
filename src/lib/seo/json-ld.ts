import {
  UNSPLASH_LICENSE,
  heightAt,
  unsplashImage,
  type UnsplashPhoto,
} from '@/lib/content/images';
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

export type ArticleFacts = {
  path: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  image?: UnsplashPhoto;
};

/** The width of the rendition named in structured data: wide enough for any rich result. */
const SCHEMA_IMAGE_WIDTH = 1920;

/**
 * A credited Unsplash photo. The licence and credit are stated because the page states
 * them, and `acquireLicensePage` is the photo's own page, where the Unsplash licence is
 * granted.
 */
export function imageObjectSchema(photo: UnsplashPhoto): JsonLdObject {
  const url = unsplashImage(photo, { width: SCHEMA_IMAGE_WIDTH, format: 'jpg' });
  return {
    '@type': 'ImageObject',
    url,
    contentUrl: url,
    width: SCHEMA_IMAGE_WIDTH,
    height: heightAt(photo, SCHEMA_IMAGE_WIDTH),
    caption: photo.caption,
    description: photo.alt,
    creditText: `${photo.photographer.name} on Unsplash`,
    creator: { '@type': 'Person', name: photo.photographer.name, url: photo.photographer.profile },
    copyrightNotice: photo.photographer.name,
    license: UNSPLASH_LICENSE,
    acquireLicensePage: photo.page,
  };
}

function organizationRef(base: string): JsonLdObject {
  return {
    '@type': 'Organization',
    '@id': `${base}/#organization`,
    name: SITE_NAME,
    url: absolute(base, '/'),
  };
}

/**
 * A guide or blog post. The author is the organization: articles carry a team byline, and
 * naming a person who did not write them would be an invented author.
 */
export function articleSchema(base: string, article: ArticleFacts): JsonLdObject {
  const url = absolute(base, article.path);
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    url,
    mainEntityOfPage: url,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    inLanguage: 'en',
    // Named in full, not only by @id: the Organization node is emitted on the home page, so
    // an article read on its own still says who wrote and published it.
    author: organizationRef(base),
    publisher: organizationRef(base),
    ...(article.image ? { image: imageObjectSchema(article.image) } : {}),
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
