/**
 * Unsplash photos, as data (D-016).
 *
 * The Unsplash API guidelines require the photo to be hotlinked from images.unsplash.com
 * (so the view is counted) and credited to the photographer and Unsplash with links. That
 * is why these are not re-hosted or passed through next/image: the URL the browser loads
 * is the Unsplash URL, resized by its own imgix parameters. The download event for each
 * photo was tracked when it was chosen.
 *
 * A plain module, so server components, the sitemap and the structured data all read the
 * same values.
 */

export type UnsplashPhoto = {
  /** The Unsplash photo id. */
  id: string;
  /** The raw images.unsplash.com URL, without query parameters. */
  src: string;
  /** The original's pixel size; the rendered image keeps its aspect ratio. */
  width: number;
  height: number;
  /** Describes what the photo shows, in the page's own terms. */
  alt: string;
  /** A one-line caption for structured data. */
  caption: string;
  photographer: { name: string; profile: string };
  /** The photo's page on unsplash.com, which is also where its licence is granted. */
  page: string;
};

/** The application name registered with Unsplash, used on every attribution link. */
export const UNSPLASH_APP = 'paydocs';
export const UNSPLASH_HOME = 'https://unsplash.com/';
export const UNSPLASH_LICENSE = 'https://unsplash.com/license';

/** Widths offered in `srcset`; the cover never renders wider than the shell. */
export const COVER_WIDTHS = [640, 960, 1280, 1920] as const;

/** Adds the referral parameters Unsplash asks for to an attribution link. */
export function unsplashReferral(url: string): string {
  const link = new URL(url);
  link.searchParams.set('utm_source', UNSPLASH_APP);
  link.searchParams.set('utm_medium', 'referral');
  return link.toString();
}

type ImgixOptions = { width: number; height?: number; format?: 'webp' | 'jpg' };

/** One resized rendition, cropped to the requested box by Unsplash's imgix service. */
export function unsplashImage(
  photo: UnsplashPhoto,
  { width, height, format = 'webp' }: ImgixOptions,
): string {
  const url = new URL(photo.src);
  url.searchParams.set('w', String(width));
  if (height !== undefined) url.searchParams.set('h', String(height));
  url.searchParams.set('q', '75');
  url.searchParams.set('fm', format);
  url.searchParams.set('fit', 'crop');
  // auto=format lets a browser that accepts AVIF get it; webp is the stated fallback.
  if (format === 'webp') url.searchParams.set('auto', 'format');
  return url.toString();
}

/** The height that keeps the original aspect ratio at a given width. */
export function heightAt(photo: UnsplashPhoto, width: number): number {
  return Math.round((width * photo.height) / photo.width);
}

/**
 * Covers are cropped to 2:1 by Unsplash itself, so a phone does not download the sky of a
 * 3:2 original only for CSS to hide it.
 */
export const COVER_RATIO = 2;

export function coverHeight(width: number): number {
  return Math.round(width / COVER_RATIO);
}

export function unsplashSrcSet(photo: UnsplashPhoto): string {
  const entries = COVER_WIDTHS.map((width) => {
    const url = unsplashImage(photo, { width, height: coverHeight(width) });
    return `${url} ${width}w`;
  });
  return entries.join(', ');
}

/** The Open Graph and Twitter card rendition: 1200 × 630 JPEG, which every network reads. */
export function unsplashShareImage(photo: UnsplashPhoto): {
  url: string;
  width: number;
  height: number;
  alt: string;
} {
  return {
    url: unsplashImage(photo, { width: 1200, height: 630, format: 'jpg' }),
    width: 1200,
    height: 630,
    alt: photo.alt,
  };
}
