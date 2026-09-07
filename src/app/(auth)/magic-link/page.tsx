import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthForm } from '../auth-form';
import { sendMagicLink } from '../actions';

export const metadata: Metadata = { title: 'Email a sign-in link' };

export default function MagicLinkPage() {
  return (
    <>
      <h1 style={{ fontSize: 28 }}>Email a sign-in link</h1>
      <p className="muted">We will send a single-use link to your address.</p>
      <AuthForm
        action={sendMagicLink}
        submitLabel="Send the link"
        pendingLabel="Sending…"
        includePassword={false}
      />
      <p className="muted" style={{ marginTop: 24, marginBottom: 0, fontSize: 14 }}>
        <Link className="text-link" href="/sign-in">
          Use a password instead
        </Link>
      </p>
    </>
  );
}
