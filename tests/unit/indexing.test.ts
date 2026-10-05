import { describe, expect, it } from 'vitest';
import {
  canonicalHostRedirect,
  isCustomDomainUrl,
  isPrivatePath,
  robotsHeaderFor,
  type CanonicalHostInput,
} from '@/lib/http/indexing';
import { breadcrumbSchema, faqPageSchema, jsonLdScript } from '@/lib/seo/json-ld';
import { PUBLIC_DOCUMENT_KINDS, SITEMAP_PAGES } from '@/lib/seo/site';

const production: CanonicalHostInput = {
  requestHost: 'tradedocs.vercel.app',
  appUrl: 'https://tradedocs.example',
  vercelEnv: 'production',
  productionAlias: 'tradedocs.vercel.app',
  pathname: '/tools/cbm-calculator',
  search: '?unit=cm',
};

describe('canonical host redirect', () => {
  it('sends the vercel.app production alias to APP_URL with path and query', () => {
    expect(canonicalHostRedirect(production)).toBe(
      'https://tradedocs.example/tools/cbm-calculator?unit=cm',
    );
  });

  it('strips a trailing slash from APP_URL', () => {
    const target = canonicalHostRedirect({
      ...production,
      appUrl: 'https://tradedocs.example/',
      search: '',
    });
    expect(target).toBe('https://tradedocs.example/tools/cbm-calculator');
  });

  it('never redirects a preview deployment', () => {
    const target = canonicalHostRedirect({
      ...production,
      vercelEnv: 'preview',
      requestHost: 'tradedocs-git-branch-team.vercel.app',
    });
    expect(target).toBeNull();
  });

  it('does nothing until APP_URL is a custom domain', () => {
    const vercelAppUrl = 'https://tradedocs.vercel.app';
    expect(canonicalHostRedirect({ ...production, appUrl: undefined })).toBeNull();
    expect(canonicalHostRedirect({ ...production, appUrl: vercelAppUrl })).toBeNull();
  });

  it('serves the canonical host itself', () => {
    expect(canonicalHostRedirect({ ...production, requestHost: 'tradedocs.example' })).toBeNull();
    expect(canonicalHostRedirect({ ...production, requestHost: 'TradeDocs.Example' })).toBeNull();
  });

  it('leaves unrelated hosts alone', () => {
    expect(canonicalHostRedirect({ ...production, requestHost: 'other.example' })).toBeNull();
    expect(canonicalHostRedirect({ ...production, requestHost: null })).toBeNull();
  });

  it('redirects when the production alias is reported with a scheme', () => {
    const target = canonicalHostRedirect({
      ...production,
      requestHost: 'www.tradedocs.example',
      productionAlias: 'https://www.tradedocs.example',
      search: '',
    });
    expect(target).toBe('https://tradedocs.example/tools/cbm-calculator');
  });
});

describe('robots header', () => {
  it('closes everything on a deployment that is not indexable', () => {
    expect(robotsHeaderFor({ indexable: false, pathname: '/' })).toBe('noindex, nofollow');
    expect(robotsHeaderFor({ indexable: false, pathname: '/tools' })).toBe('noindex, nofollow');
  });

  it('opens public pages on an indexable deployment', () => {
    expect(robotsHeaderFor({ indexable: true, pathname: '/' })).toBeNull();
    expect(robotsHeaderFor({ indexable: true, pathname: '/tools/incoterms/fob' })).toBeNull();
  });

  it.each([
    '/app',
    '/app/acme/shipments',
    '/auth/callback',
    '/sign-in',
    '/sign-up',
    '/magic-link',
    '/reset-password/new',
    '/invitations/accept',
    '/design-system',
    '/api/health',
  ])('keeps %s closed even when indexable', (pathname) => {
    expect(isPrivatePath(pathname)).toBe(true);
    expect(robotsHeaderFor({ indexable: true, pathname })).toBe('noindex, nofollow');
  });

  it('does not treat a lookalike prefix as private', () => {
    expect(isPrivatePath('/applications')).toBe(false);
    expect(isPrivatePath('/apiary')).toBe(false);
  });
});

describe('custom domain', () => {
  it.each([
    ['https://tradedocs.example', true],
    ['https://www.tradedocs.example/', true],
    ['https://tradedocs.vercel.app', false],
    ['http://127.0.0.1:3000', false],
    ['http://localhost:3000', false],
    ['not a url', false],
    [undefined, false],
  ])('%s → %s', (url, expected) => {
    expect(isCustomDomainUrl(url)).toBe(expected);
  });
});

describe('JSON-LD serialisation', () => {
  it('escapes markup so a value cannot close the script element', () => {
    const output = jsonLdScript({ name: '</script><script>alert(1)</script>' });
    expect(output).not.toContain('<');
    expect(JSON.parse(output)).toEqual({ name: '</script><script>alert(1)</script>' });
  });
});

describe('structured data builders', () => {
  it('numbers breadcrumbs from one against absolute URLs', () => {
    const crumbs = breadcrumbSchema('https://tradedocs.example', [
      { name: 'Home', path: '/' },
      { name: 'Free tools', path: '/tools' },
    ]);
    expect(crumbs.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://tradedocs.example/' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Free tools',
        item: 'https://tradedocs.example/tools',
      },
    ]);
  });

  it('carries every visible question into FAQPage unchanged', () => {
    const faq = [{ q: 'What is CBM?', a: 'Cubic metres.' }];
    expect(faqPageSchema(faq).mainEntity).toEqual([
      {
        '@type': 'Question',
        name: 'What is CBM?',
        acceptedAnswer: { '@type': 'Answer', text: 'Cubic metres.' },
      },
    ]);
  });
});

describe('public surface data', () => {
  it('never offers the certificate of origin (D-008)', () => {
    expect(PUBLIC_DOCUMENT_KINDS).not.toContain('certificate_of_origin');
    expect(PUBLIC_DOCUMENT_KINDS).toHaveLength(4);
  });

  it('lists only public paths, once each, with fixed dates', () => {
    const paths = SITEMAP_PAGES.map((page) => page.path);
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths.filter(isPrivatePath)).toEqual([]);
    for (const page of SITEMAP_PAGES) expect(page.lastModified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
