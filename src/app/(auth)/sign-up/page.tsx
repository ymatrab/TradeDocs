import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthForm } from '../auth-form';
import { signUp } from '../actions';
import { challengeSiteKey, nextFrom, withNext, type AuthSearchParams } from '../page-config';

export const metadata: Metadata = { title: 'Create an account' };

export default async function SignUpPage({ searchParams }: { searchParams: AuthSearchParams }) {
  const next = await nextFrom(searchParams);
  return (
    <>
      <h1 style={{ fontSize: 28 }}>Create an account</h1>
      <p className="muted">You will set up or join an organization next.</p>
      <AuthForm
        action={signUp}
        submitLabel="Create account"
        pendingLabel="Creating account…"
        passwordHint="At least 12 characters. Length protects an account better than punctuation does. Passwords found in known breaches are refused."
        autoCompletePassword="new-password"
        next={next}
        challenge="always"
        siteKey={challengeSiteKey()}
        turnstileAction="sign_up"
      />
      <p className="muted" style={{ marginTop: 16, marginBottom: 0, fontSize: 14 }}>
        By creating an account you agree to the{' '}
        <Link className="text-link" href="/terms">
          Terms of use
        </Link>{' '}
        and confirm you have read the{' '}
        <Link className="text-link" href="/privacy">
          Privacy policy
        </Link>
        .
      </p>
      <p className="muted" style={{ marginTop: 24, marginBottom: 0, fontSize: 14 }}>
        Already have an account?{' '}
        <Link className="text-link" href={withNext('/sign-in', next)}>
          Sign in
        </Link>
      </p>
    </>
  );
}
