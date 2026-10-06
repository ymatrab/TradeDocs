import type { Metadata } from 'next';
import Link from 'next/link';
import { ErrorState } from '@/components/primitives/feedback';
import { getUser } from '@/lib/supabase/server';
import { AuthForm } from '../../auth-form';
import { updatePassword } from '../../actions';

export const metadata: Metadata = { title: 'Choose a new password' };

/**
 * Where a reset link lands. /auth/confirm or /auth/callback has already turned the link into
 * a session, so the form asks only for the new password. Without that session (the link was
 * opened twice, or expired before it was used) there is nothing to update, and the page says
 * so instead of showing a form that cannot succeed.
 */
export default async function NewPasswordPage() {
  const user = await getUser();
  if (!user) {
    return (
      <>
        <h1 style={{ fontSize: 28 }}>Choose a new password</h1>
        <ErrorState
          title="This reset link can’t be used"
          description="It has expired or was already used. Each link works once, so ask for a new one."
          action={
            <Link className="btn" href="/reset-password">
              Request a new link
            </Link>
          }
        />
      </>
    );
  }
  return (
    <>
      <h1 style={{ fontSize: 28 }}>Choose a new password</h1>
      <p className="muted">
        For <span className="data">{user.email}</span>. Once saved, you sign in with this password,
        and every other session is signed out.
      </p>
      <AuthForm
        action={updatePassword}
        submitLabel="Save the new password"
        pendingLabel="Saving…"
        includeEmail={false}
        passwordLabel="New password"
        passwordHint="At least 12 characters. A long phrase is easier to remember and harder to guess."
        autoCompletePassword="new-password"
      />
    </>
  );
}
