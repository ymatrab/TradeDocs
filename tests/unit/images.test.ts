import { describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';
import { GUIDES, GUIDES_HUB_COVER } from '@/lib/content/guides';
import { HOME_PHOTOS } from '@/lib/content/home';
import {
  COVER_WIDTHS,
  unsplashImage,
  unsplashReferral,
  unsplashShareImage,
  unsplashSrcSet,
  unsplashSrcSetAt,
} from '@/lib/content/images';
import { buildContentSecurityPolicy } from '@/lib/security/headers';
import { articleSchema, imageObjectSchema } from '@/lib/seo/json-ld';

const [guide] = GUIDES;
const photo = guide!.cover;

describe('Unsplash covers (D-016)', () => {
  it('are hotlinked from images.unsplash.com and resized by its own parameters', () => {
    const url = new URL(unsplashImage(photo, { width: 960, height: 480 }));
    expect(url.origin).toBe('https://images.unsplash.com');
    expect(url.pathname).toBe(new URL(photo.src).pathname);
    expect(Object.fromEntries(url.searchParams)).toEqual({
      w: '960',
      h: '480',
      q: '75',
      fm: 'webp',
      fit: 'crop',
      auto: 'format',
    });
  });

  it('offer every srcset width, each cropped to 2:1', () => {
    const entries = unsplashSrcSet(photo).split(', ');
    expect(entries).toHaveLength(COVER_WIDTHS.length);
    COVER_WIDTHS.forEach((width, index) => {
      const [href, descriptor] = entries[index]!.split(' ');
      expect(descriptor).toBe(`${width}w`);
      expect(new URL(href!).searchParams.get('h')).toBe(String(width / 2));
    });
  });

  it('credit the photographer and Unsplash with the registered referral', () => {
    const link = new URL(unsplashReferral(photo.photographer.profile));
    expect(link.searchParams.get('utm_source')).toBe('paydocs');
    expect(link.searchParams.get('utm_medium')).toBe('referral');
    expect(unsplashReferral('https://unsplash.com/')).toBe(
      'https://unsplash.com/?utm_source=paydocs&utm_medium=referral',
    );
  });

  it('share a 1200 × 630 JPEG on social cards', () => {
    const share = unsplashShareImage(photo);
    expect(share).toMatchObject({ width: 1200, height: 630, alt: photo.alt });
    const url = new URL(share.url);
    expect(url.searchParams.get('fm')).toBe('jpg');
    expect(url.searchParams.get('h')).toBe('630');
  });
});

describe('image structured data', () => {
  it('describes the photo, its credit and its licence', () => {
    const image = imageObjectSchema(photo);
    expect(image).toMatchObject({
      '@type': 'ImageObject',
      width: 1920,
      height: Math.round((1920 * photo.height) / photo.width),
      caption: photo.caption,
      creditText: `${photo.photographer.name} on Unsplash`,
      creator: {
        '@type': 'Person',
        name: photo.photographer.name,
        url: photo.photographer.profile,
      },
      license: 'https://unsplash.com/license',
      acquireLicensePage: photo.page,
    });
    expect(String(image.url)).toMatch(/^https:\/\/images\.unsplash\.com\/photo-.+fm=jpg/);
    expect(image.contentUrl).toBe(image.url);
  });

  it('is attached to an article only when it has a cover', () => {
    const facts = {
      path: `/guides/${guide!.slug}`,
      headline: guide!.title,
      description: guide!.description,
      datePublished: guide!.published,
      dateModified: guide!.updated,
    };
    expect(articleSchema('https://example.test', facts)).not.toHaveProperty('image');
    expect(articleSchema('https://example.test', { ...facts, image: photo }).image).toEqual(
      imageObjectSchema(photo),
    );
  });
});

describe('image delivery', () => {
  it('allows Unsplash in img-src and nowhere else', () => {
    const csp = buildContentSecurityPolicy({ nonce: 'abcdefghijklmnopqrstuv' });
    const directives = csp.split('; ');
    expect(directives).toContain("img-src 'self' data: blob: https://images.unsplash.com");
    const others = directives.filter((directive) => !directive.startsWith('img-src'));
    expect(others.join('; ')).not.toContain('unsplash');
  });

  it('crops a section photo to the requested ratio at every width', () => {
    const set = unsplashSrcSetAt(HOME_PHOTOS.warehouse, 4 / 3, [480, 960]);
    const entries = set.split(', ').map((entry) => entry.split(' '));
    expect(entries.map(([, width]) => width)).toEqual(['480w', '960w']);
    for (const [url, width] of entries) {
      const params = new URL(url!).searchParams;
      expect(params.get('w')).toBe(width!.replace('w', ''));
      expect(params.get('h')).toBe(String(Math.round(Number(params.get('w')) / (4 / 3))));
      expect(params.get('fit')).toBe('crop');
    }
  });

  it('credits every homepage photo to a photographer with an Unsplash page', () => {
    for (const entry of Object.values(HOME_PHOTOS)) {
      expect(entry.src).toMatch(/^https:\/\/images\.unsplash\.com\/photo-[\w-]+$/);
      expect(entry.photographer.profile).toMatch(/^https:\/\/unsplash\.com\/@/);
      expect(entry.page).toContain(entry.id);
      expect(entry.alt.length).toBeGreaterThan(20);
    }
  });

  it('lists each guide cover and the hub cover in the image sitemap', () => {
    const entries = sitemap();
    const imagesFor = (suffix: string) =>
      entries.find((entry) => entry.url.endsWith(suffix))?.images ?? [];
    expect(imagesFor('/guides')).toEqual([GUIDES_HUB_COVER.src]);
    for (const entry of GUIDES) {
      expect(imagesFor(`/guides/${entry.slug}`)).toEqual([entry.cover.src]);
    }
    expect(imagesFor('/tools')).toEqual([]);
    expect(imagesFor('/')).toEqual(Object.values(HOME_PHOTOS).map((entry) => entry.src));
  });
});
