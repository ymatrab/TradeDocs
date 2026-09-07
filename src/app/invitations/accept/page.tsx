import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getUser, isDatabaseConfigured } from '@/lib/supabase/server';
import { AcceptForm } from './accept-form';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Accept an invitation' };

export default async function AcceptInvitationPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  if (!isDatabaseConfigured()) notFound();
  const { token } = await searchParams;
  const user = await getUser();

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
              Sign in with the address the invitation was sent to, then open the link again. An
              invitation only works for the address it names.
            </p>
            <Link className="btn" href="/sign-in">
              Sign in
            </Link>
          </>
        ) : (
          <AcceptForm token={token} />
        )}
      </article>
    </main>
  );
}
