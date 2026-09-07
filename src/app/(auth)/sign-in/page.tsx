import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthForm } from '../auth-form';
import { signIn } from '../actions';

export const metadata: Metadata = { title: 'Sign in' };

export default function SignInPage() {
  return (
    <>
      <h1 style={{ fontSize: 28 }}>Sign in</h1>
      <p className="muted">Continue to your shipment workspace.</p>
      <AuthForm action={signIn} submitLabel="Sign in" pendingLabel="Signing in…" />
      <p className="muted" style={{ marginTop: 24, marginBottom: 0, fontSize: 14 }}>
        <Link className="text-link" href="/reset-password">
          Forgot your password?
        </Link>
        {' · '}
        <Link className="text-link" href="/magic-link">
          Email me a link instead
        </Link>
        {' · '}
        <Link className="text-link" href="/sign-up">
          Create an account
        </Link>
      </p>
    </>
  );
}
