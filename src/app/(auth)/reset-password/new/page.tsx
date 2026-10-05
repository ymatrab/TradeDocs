import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthForm } from '../../auth-form';
import { updatePassword } from '../../actions';

export const metadata: Metadata = { title: 'Choose a new password' };

/**
 * Where a reset link lands. The callback has already exchanged the link for a session, so
 * the form asks only for the new password; updatePassword refuses it if that session has
 * expired.
 */
export default function NewPasswordPage() {
  return (
    <>
      <h1 style={{ fontSize: 28 }}>Choose a new password</h1>
      <p className="muted">Once saved, you sign in with this password from now on.</p>
      <AuthForm
        action={updatePassword}
        submitLabel="Save the new password"
        pendingLabel="Saving…"
        includeEmail={false}
        passwordLabel="New password"
        passwordHint="At least 12 characters. A long phrase is easier to remember and harder to guess."
        autoCompletePassword="new-password"
      />
      <p className="muted" style={{ marginTop: 24, marginBottom: 0, fontSize: 14 }}>
        Link expired?{' '}
        <Link className="text-link" href="/reset-password">
          Request a new one
        </Link>
      </p>
    </>
  );
}
