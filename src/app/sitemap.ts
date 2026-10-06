import type { MetadataRoute } from 'next';
import { getPublicBaseUrl } from '@/lib/http/base-url';
import { GUIDES_HUB_COVER, findGuide } from '@/lib/content/guides';
import type { UnsplashPhoto } from '@/lib/content/images';
import { isLegalApproved } from '@/lib/legal/identity';
import { getLegalIdentity } from '@/lib/legal/server';
import { SITEMAP_PAGES, legalSitemapPages } from '@/lib/seo/site';

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
 * content last changed rather than the time of the request. A page with a cover photo
 * lists it as an image entry.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getPublicBaseUrl();
  // Draft legal pages stay out until the owner approves them (D-009).
  const legal = getLegalIdentity();
  const pages = [
    ...SITEMAP_PAGES,
    ...legalSitemapPages(isLegalApproved(legal) ? legal.approvedAt : null),
  ];
  return pages.map((page) => {
    const image = coverFor(page.path);
    return {
      url: `${base}${page.path}`,
      lastModified: page.lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      // The original's URL carries no query string, so no `&` needs escaping in the XML.
      ...(image ? { images: [image.src] } : {}),
    };
  });
}

/** The cover a page shows, so the image sitemap lists exactly what the page renders. */
function coverFor(path: string): UnsplashPhoto | undefined {
  if (path === '/guides') return GUIDES_HUB_COVER;
  const slug = path.startsWith('/guides/') ? path.slice('/guides/'.length) : undefined;
  return slug ? findGuide(slug)?.cover : undefined;
}
