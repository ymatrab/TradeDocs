import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getUser, isDatabaseConfigured } from '@/lib/supabase/server';
import { AcceptForm } from './accept-form';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Accept an invitation',
  robots: { index: false, follow: false, nocache: true },
};

/** Tokens are 64 hex characters; anything else cannot be an invitation. */
const TOKEN = /^[a-f0-9]{64}$/;

export default async function AcceptInvitationPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  if (!isDatabaseConfigured()) notFound();
  const { token: raw } = await searchParams;
  const token = typeof raw === 'string' && TOKEN.test(raw) ? raw : null;
  const user = await getUser();
  // After signing in or creating the account, the person lands back here with the token.
  const back = token
    ? encodeURIComponent(`/invitations/accept?token=${token}`)
    : encodeURIComponent('/app');

  return (
    <main id="main-content" className="foundation">
      <article>
        <p className="eyebrow">Invitation</p>
        <h1 style={{ fontSize: 28 }}>Join an organization</h1>
        {!token ? (
          <p className="muted">
            This link is incomplete. Ask whoever invited you to send it again.
          </p>
        ) : !user ? (
          <>
            <p className="muted">
              Sign in with the address the invitation was sent to, or create an account with it.
              An invitation only works for the address it names, and only once.
            </p>
            <div className="cta-row" style={{ marginTop: 0 }}>
              <Link className="btn" href={`/sign-in?next=${back}`}>
                Sign in
              </Link>
              <Link className="btn secondary" href={`/sign-up?next=${back}`}>
                Create an account
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="muted">
              Signed in as <span className="data">{user.email}</span>.
            </p>
            <AcceptForm token={token} />
          </>
        )}
      </article>
    </main>
  );
}
