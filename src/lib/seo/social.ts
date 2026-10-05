import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/seo/site';

/** The card rendered by app/opengraph-image.tsx; relative, resolved against metadataBase. */
export const SHARE_IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: 'TradeDocs: enter a shipment once, get the whole document set',
} as const;

/**
 * Open Graph for one public page.
 *
 * A page that declares `openGraph` replaces the root's object rather than merging into it,
 * so the shared fields, including the image, are repeated here instead of relying on
 * inheritance. `url` is relative and resolved against `metadataBase`, so it always names
 * the canonical host. Twitter reads these through the root's `summary_large_image` card.
 */
export function openGraphFor(
  title: string,
  description: string,
  /** Omitted at the root, so a page without its own Open Graph never claims to be `/`. */
  path?: string,
): NonNullable<Metadata['openGraph']> {
  return {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en',
    title,
    description,
    ...(path ? { url: path } : {}),
    images: [SHARE_IMAGE],
  };
}
