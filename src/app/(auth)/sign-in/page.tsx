import type { Metadata } from 'next';
import Link from 'next/link';
import { Callout } from '@/components/primitives/feedback';
import { AuthForm } from '../auth-form';
import { signIn } from '../actions';
import {
  challengeSiteKey,
  nextFrom,
  paramFrom,
  withNext,
  type AuthSearchParams,
} from '../page-config';

export const metadata: Metadata = { title: 'Sign in' };

export default async function SignInPage({ searchParams }: { searchParams: AuthSearchParams }) {
  const next = await nextFrom(searchParams);
  const link = await paramFrom(searchParams, 'link');
  const signedOut = await paramFrom(searchParams, 'signed-out');

  return (
    <>
      <h1 style={{ fontSize: 28 }}>Sign in</h1>
      <p className="muted">Continue to your shipment workspace.</p>
      {link === 'expired' ? (
        <div style={{ marginBottom: 20 }}>
          <Callout tone="warning" title="That link can’t be used">
            It has expired or was already used. If you just confirmed your address, sign in
            below. Otherwise, ask for a new sign-in link.
          </Callout>
        </div>
      ) : null}
      {signedOut === 'everywhere' ? (
        <div style={{ marginBottom: 20 }}>
          <Callout tone="success" title="Signed out everywhere">
            Every session on every device has ended.
          </Callout>
        </div>
      ) : null}
      <AuthForm
        action={signIn}
        submitLabel="Sign in"
        pendingLabel="Signing in…"
        next={next}
        challenge="on-request"
        siteKey={challengeSiteKey()}
        turnstileAction="sign_in"
      />
      <p className="muted" style={{ marginTop: 24, marginBottom: 0, fontSize: 14 }}>
        <Link className="text-link" href="/reset-password">
          Forgot your password?
        </Link>
        {' · '}
        <Link className="text-link" href={withNext('/magic-link', next)}>
          Email me a link instead
        </Link>
        {' · '}
        <Link className="text-link" href={withNext('/sign-up', next)}>
          Create an account
        </Link>
      </p>
    </>
  );
}
