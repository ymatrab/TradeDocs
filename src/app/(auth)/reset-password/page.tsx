import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthForm } from '../auth-form';
import { requestPasswordReset } from '../actions';

export const metadata: Metadata = { title: 'Reset your password' };

export default function ResetPasswordPage() {
  return (
    <>
      <h1 style={{ fontSize: 28 }}>Reset your password</h1>
      <p className="muted">We will send a link that lets you choose a new one.</p>
      <AuthForm
        action={requestPasswordReset}
        submitLabel="Send the reset link"
        pendingLabel="Sending…"
        includePassword={false}
      />
      <p className="muted" style={{ marginTop: 24, marginBottom: 0, fontSize: 14 }}>
        <Link className="text-link" href="/sign-in">
          Back to sign in
        </Link>
      </p>
    </>
  );
}
