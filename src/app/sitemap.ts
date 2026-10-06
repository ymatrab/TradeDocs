import type { MetadataRoute } from 'next';
import { getPublicBaseUrl } from '@/lib/http/base-url';
import { GUIDES_HUB_COVER, findGuide } from '@/lib/content/guides';
import { HOME_PHOTOS } from '@/lib/content/home';
import { BLOG_HUB_COVER, findPost } from '@/lib/content/posts';
import type { UnsplashPhoto } from '@/lib/content/images';
import { SITEMAP_PAGES } from '@/lib/seo/site';

// Reads the deployment environment, so it must be resolved per request rather than
// frozen into the build output.
export const dynamic = 'force-dynamic';

/**
 * Only public, indexable routes.
 *
 * Everything under /app is tenant data and everything under /auth is a credential flow;
 * neither belongs in a sitemap, and listing them would advertise the shape of the private
 * surface for nothing. The list is built from the same data the pages render, so a rule
 * added to the Incoterms reference cannot be left out, and each entry carries the date its
 * content last changed rather than the time of the request. A page with photos lists each
 * as an image entry.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getPublicBaseUrl();
  return SITEMAP_PAGES.map((page) => {
    const images = photosFor(page.path);
    return {
      url: `${base}${page.path}`,
      lastModified: page.lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      // The original's URL carries no query string, so no `&` needs escaping in the XML.
      ...(images.length > 0 ? { images: images.map((photo) => photo.src) } : {}),
    };
  });
}

/** The photos a page shows, so the image sitemap lists exactly what the page renders. */
function photosFor(path: string): UnsplashPhoto[] {
  if (path === '/') return Object.values(HOME_PHOTOS);
  if (path === '/guides') return [GUIDES_HUB_COVER];
  if (path === '/blog') return [BLOG_HUB_COVER];
  const cover = path.startsWith('/guides/')
    ? findGuide(path.slice('/guides/'.length))?.cover
    : path.startsWith('/blog/')
      ? findPost(path.slice('/blog/'.length))?.cover
      : undefined;
  return cover ? [cover] : [];
}
