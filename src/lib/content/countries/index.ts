import { isCountryListed, type CountryPage } from '@/lib/content/country';

/**
 * The "export documents by country" pages, as data.
 *
 * One module renders /export-documents, every /export-documents/<slug> page, and the sitemap
 * and llms.txt entries once a page is reviewed. Each page has measured demand and at least
 * five sourced country-specific facts (docs/research/content-plan-v3-2026-10-07.md); a
 * country that cannot meet that is not published.
 *
 * Each country lives in its own file, `countries/<slug>.ts`. To add one: write the file to the
 * template spec in the plan, then add one import and one ENTRIES line below, alphabetical.
 */

import india from './india';
import mexico from './mexico';
import australia from './australia';
import brazil from './brazil';
import china from './china';
import unitedStates from './united-states';
import germany from './germany';
import southKorea from './south-korea';
import ireland from './ireland';
import japan from './japan';

const ENTRIES: readonly CountryPage[] = [
  // One line per country, alphabetical by slug.
  india,
  mexico,
  australia,
  brazil,
  china,
  unitedStates,
  germany,
  southKorea,
  ireland,
  japan,
];

/** Every country page, alphabetical by name. */
export const COUNTRIES: readonly CountryPage[] = [...ENTRIES].sort((a, b) =>
  a.name.localeCompare(b.name, 'en'),
);

/** Reviewed pages: the only ones indexed, in the sitemap and offered to llms.txt. */
export const LISTED_COUNTRIES: readonly CountryPage[] = COUNTRIES.filter(isCountryListed);

export function findCountry(slug: string): CountryPage | undefined {
  return COUNTRIES.find((entry) => entry.slug === slug);
}

export const COUNTRIES_HUB = {
  title: 'Export documents by country',
  metaTitle: 'Export documents by country: what each needs',
  description:
    'Which documents a shipment needs for each destination, what the commercial invoice must show and who files what, from official customs sources. No duty rates.',
  lede: 'Each page lists the documents a shipment to that country needs, what the importer files, and what to ask your buyer before the first shipment, with the official source beside every line. They cover paperwork only and state no duty or tax rates.',
} as const;

/** Country guidance that lives in a blog post rather than a country page. */
export const COUNTRY_POSTS: readonly { name: string; href: string }[] = [
  { name: 'Canada', href: '/blog/commercial-invoice-for-canada' },
];

/** The newest date among the hub's own content and the listed pages. */
export const COUNTRIES_UPDATED = LISTED_COUNTRIES.reduce(
  (latest, entry) => (entry.updated > latest ? entry.updated : latest),
  '2026-10-07',
);
