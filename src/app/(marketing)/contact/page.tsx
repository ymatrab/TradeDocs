import type { Metadata } from 'next';
import Link from 'next/link';
import { shown } from '@/lib/legal/identity';
import { getLegalIdentity } from '@/lib/legal/server';
import { openGraphFor } from '@/lib/seo/social';
import { hasServiceRole } from '@/lib/supabase/admin';
import { ContactForm } from './contact-form';

// Whether the form is connected depends on the deployment's database configuration.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Ask a question, report a problem or make a privacy request. Messages go to the team that runs TradeDocs.',
  alternates: { canonical: '/contact' },
  openGraph: openGraphFor(
    'Contact TradeDocs',
    'Ask a question, report a problem or make a privacy request.',
    '/contact',
  ),
};

export default function ContactPage() {
  const identity = getLegalIdentity();
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Contact</p>
        <h1>Talk to the people who run TradeDocs</h1>
        <p className="lede">
          A question, something that is not working, or a request about your data: send it here and
          a person reads it. For quick answers, try the{' '}
          <Link className="text-link" href="/help">
            help centre
          </Link>{' '}
          first.
        </p>
      </section>

      <section className="section contact-layout">
        <div className="contact-form-col">
          <ContactForm available={hasServiceRole()} />
        </div>
        <aside className="contact-aside" aria-label="Other ways to reach us">
          <p className="caption">By email</p>
          <p>
            {identity.contactEmail ? (
              <a className="text-link" href={`mailto:${identity.contactEmail}`}>
                {identity.contactEmail}
              </a>
            ) : (
              <span className="muted">Address {shown(null)}</span>
            )}
          </p>
          <p className="caption">Before you write</p>
          <p className="muted">
            TradeDocs prepares documents; it cannot clear goods, advise on tariffs or speak to
            customs for you. Please leave passwords and payment details out of your message.
          </p>
          <p className="caption">Your data</p>
          <p className="muted">
            The{' '}
            <Link className="text-link" href="/privacy">
              privacy policy
            </Link>{' '}
            says what we keep and for how long.
          </p>
        </aside>
      </section>
    </>
  );
}
