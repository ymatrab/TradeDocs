import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthForm } from '../auth-form';
import { sendMagicLink } from '../actions';
import { nextFrom, withNext, type AuthSearchParams } from '../page-config';

export const metadata: Metadata = { title: 'Email a sign-in link' };

export default async function MagicLinkPage({ searchParams }: { searchParams: AuthSearchParams }) {
  const next = await nextFrom(searchParams);
  return (
    <>
      <h1 style={{ fontSize: 28 }}>Email a sign-in link</h1>
      <p className="muted">We will send a single-use link to your address.</p>
      <AuthForm
        action={sendMagicLink}
        submitLabel="Send the link"
        pendingLabel="Sending…"
        includePassword={false}
        next={next}
      />
      <p className="muted" style={{ marginTop: 24, marginBottom: 0, fontSize: 14 }}>
        <Link className="text-link" href={withNext('/sign-in', next)}>
          Use a password instead
        </Link>
        {' · '}
        <Link className="text-link" href={withNext('/sign-up', next)}>
          Create an account
        </Link>
      </p>
    </>
  );
}
