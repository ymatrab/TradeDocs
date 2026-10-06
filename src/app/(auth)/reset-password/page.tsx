import type { Metadata } from 'next';
import Link from 'next/link';
import { Callout } from '@/components/primitives/feedback';
import { AuthForm } from '../auth-form';
import { requestPasswordReset } from '../actions';
import { paramFrom, type AuthSearchParams } from '../page-config';

export const metadata: Metadata = { title: 'Reset your password' };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: AuthSearchParams;
}) {
  const expired = (await paramFrom(searchParams, 'link')) === 'expired';
  return (
    <>
      <h1 style={{ fontSize: 28 }}>Reset your password</h1>
      <p className="muted">We will send a link that lets you choose a new one.</p>
      {expired ? (
        <div style={{ marginBottom: 20 }}>
          <Callout tone="warning" title="That reset link can’t be used">
            It has expired or was already used. Each link works once. Ask for a new one below.
          </Callout>
        </div>
      ) : null}
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
        {' · '}
        <Link className="text-link" href="/magic-link">
          Email me a link instead
        </Link>
      </p>
    </>
  );
}
