import type { Metadata } from 'next';
import Link from 'next/link';
import { Callout } from '@/components/primitives/feedback';

export const metadata: Metadata = { title: 'Password updated' };

/** The end of a reset: the new password is saved and this browser is signed in with it. */
export default function PasswordUpdatedPage() {
  return (
    <>
      <h1 style={{ fontSize: 28 }}>Password updated</h1>
      <Callout tone="success" title="You’re signed in">
        Your new password is saved and every other session has been signed out.
      </Callout>
      <div className="cta-row" style={{ marginTop: 24 }}>
        <Link className="btn" href="/app">
          Continue to your workspace
        </Link>
      </div>
    </>
  );
}
