import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthForm } from '../auth-form';
import { signUp } from '../actions';

export const metadata: Metadata = { title: 'Create an account' };

export default function SignUpPage() {
  return (
    <>
      <h1 style={{ fontSize: 28 }}>Create an account</h1>
      <p className="muted">You will set up or join an organization next.</p>
      <AuthForm
        action={signUp}
        submitLabel="Create account"
        pendingLabel="Creating account…"
        passwordHint="At least 12 characters. Length protects an account better than punctuation does."
        autoCompletePassword="new-password"
      />
      <p className="muted" style={{ marginTop: 24, marginBottom: 0, fontSize: 14 }}>
        Already have an account?{' '}
        <Link className="text-link" href="/sign-in">
          Sign in
        </Link>
      </p>
    </>
  );
}
