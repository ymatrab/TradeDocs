import { helpEntries } from '@/lib/content/faq';

/**
 * The help panel's index: every public question and answer, fetched once when a visitor
 * first opens the panel, so the answers are not shipped in every page's script. The content
 * is public and identical for everyone; the search itself runs in the browser.
 */
export const dynamic = 'force-static';

export function GET(): Response {
  return Response.json(
    { entries: helpEntries() },
    { headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' } },
  );
}
