import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage, LegalSection } from '@/components/legal/legal-page';
import { DataTable } from '@/components/primitives/table';
import { getLegalIdentity, legalMetadata } from '@/lib/legal/server';

// Reads the approval state and the business identity from the deployment's environment.
export const dynamic = 'force-dynamic';

export function generateMetadata(): Metadata {
  return legalMetadata(
    '/cookies',
    'Cookie policy',
    'The only cookies TradeDocs sets are the ones that keep you signed in. No analytics, advertising or tracking cookies.',
  );
}

/**
 * Drafted from the code (D-009): the only cookies are the Supabase session cookies the
 * proxy and the server client write when someone signs in, and nothing in the client uses
 * localStorage, sessionStorage or IndexedDB. A new cookie or storage key changes this page.
 */
export default function CookiesPage() {
  const identity = getLegalIdentity();

  return (
    <LegalPage
      title="Cookie policy"
      lede="TradeDocs sets only the cookies that keep you signed in. There is nothing to accept or decline."
      identity={identity}
    >
      <LegalSection id="cookies" number={1} title="Cookies we set">
        <DataTable caption="Cookies set by TradeDocs" density="compact">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Purpose</th>
              <th scope="col">When and how long</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span className="data">sb-…-auth-token</span> (may be split into numbered parts)
              </td>
              <td>Keeps you signed in and lets the server check who you are on each request</td>
              <td>Set when you sign in; removed when you sign out</td>
            </tr>
            <tr>
              <td>
                <span className="data">sb-…-auth-token-code-verifier</span>
              </td>
              <td>Proves that an emailed sign-in or reset link was requested from your browser</td>
              <td>Set when you ask for such a link; used once</td>
            </tr>
          </tbody>
        </DataTable>
        <p>
          Both are strictly necessary for an account to work, which is why no consent banner asks
          about them. Visitors who never sign in, including everyone using the free tools, get no
          cookies from us at all.
        </p>
      </LegalSection>

      <LegalSection id="none" number={2} title="What we do not use">
        <p>
          No analytics, advertising, social media or tracking cookies, and no browser storage such
          as localStorage. If that ever changes, this page changes first and anything that is not
          strictly necessary will wait for your consent.
        </p>
      </LegalSection>

      <LegalSection id="third-party" number={3} title="Other services">
        <p>
          Photos on the homepage, guides and blog load from Unsplash’s image servers. We set no
          cookie for them; what Unsplash records is described in its own privacy policy. The{' '}
          <Link className="text-link" href="/privacy">
            privacy policy
          </Link>{' '}
          lists every service that handles data for TradeDocs.
        </p>
      </LegalSection>

      <LegalSection id="control" number={4} title="Your control">
        <p>
          You can delete cookies in your browser at any time. Deleting the session cookie signs you
          out; nothing else changes.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
