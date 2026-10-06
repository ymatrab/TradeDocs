import type { ReactNode } from 'react';
import Link from 'next/link';
import { Callout } from '@/components/primitives/feedback';
import { isLegalApproved, shown, type LegalIdentity } from '@/lib/legal/identity';

/**
 * The frame every legal page shares: the title, the approval state and the identity of the
 * business the text speaks for. Until the owner approves the text (D-009) the draft banner
 * is part of the page itself, so no copy of it can be read as final.
 */
export function LegalPage({
  title,
  lede,
  identity,
  children,
}: {
  title: string;
  lede: string;
  identity: LegalIdentity;
  children: ReactNode;
}) {
  const approved = isLegalApproved(identity);
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Legal</p>
        <h1>{title}</h1>
        <p className="lede">{lede}</p>
      </section>

      <section className="section legal-doc">
        {approved ? (
          <p className="caption legal-stamp">Effective {identity.approvedAt}</p>
        ) : (
          <Callout tone="warning" title="Draft — pending owner approval" level={2}>
            This text describes what TradeDocs does today, but the business behind it has not
            approved it yet. Details marked “{shown(null)}” are still missing. It is not final and
            is not a statement of legal compliance.
          </Callout>
        )}

        <dl className="legal-identity" aria-label="Who this applies to">
          <div>
            <dt className="caption">Business</dt>
            <dd>{shown(identity.entityName)}</dd>
          </div>
          <div>
            <dt className="caption">Country</dt>
            <dd>{shown(identity.country)}</dd>
          </div>
          <div>
            <dt className="caption">Address</dt>
            <dd>{shown(identity.address)}</dd>
          </div>
          <div>
            <dt className="caption">Contact</dt>
            <dd>
              {identity.contactEmail ? (
                <a className="text-link" href={`mailto:${identity.contactEmail}`}>
                  {identity.contactEmail}
                </a>
              ) : (
                <>
                  {shown(null)} ·{' '}
                  <Link className="text-link" href="/contact">
                    use the contact form
                  </Link>
                </>
              )}
            </dd>
          </div>
        </dl>

        {children}

        <p className="muted legal-foot">
          Plain-language summary of how the service works. It is not legal advice. Related:{' '}
          <Link className="text-link" href="/privacy">
            Privacy
          </Link>
          {' · '}
          <Link className="text-link" href="/terms">
            Terms
          </Link>
          {' · '}
          <Link className="text-link" href="/cookies">
            Cookies
          </Link>
          {' · '}
          <Link className="text-link" href="/contact">
            Contact
          </Link>
        </p>
      </section>
    </>
  );
}

/** A numbered heading and its body, so sections can be cited ("section 4"). */
export function LegalSection({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="legal-section" aria-labelledby={`${id}-title`} id={id}>
      <h2 id={`${id}-title`}>
        <span className="legal-number">{number}.</span> {title}
      </h2>
      {children}
    </section>
  );
}
