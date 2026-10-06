import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage, LegalSection } from '@/components/legal/legal-page';
import { BOUNDARY_STATEMENT } from '@/components/shell/public';
import { shown } from '@/lib/legal/identity';
import { getLegalIdentity, legalMetadata } from '@/lib/legal/server';

// Reads the approval state and the business identity from the deployment's environment.
export const dynamic = 'force-dynamic';

export function generateMetadata(): Metadata {
  return legalMetadata(
    '/terms',
    'Terms of use',
    'The terms for using TradeDocs: what the service is and is not, your account and content, acceptable use, price, liability and ending the agreement.',
  );
}

/** Drafted from how the product behaves today (D-009); the owner approves the final text. */
export default function TermsPage() {
  const identity = getLegalIdentity();
  const business = shown(identity.entityName);

  return (
    <LegalPage
      title="Terms of use"
      lede="The agreement between you and the business that runs TradeDocs, in plain language."
      identity={identity}
    >
      <LegalSection id="agreement" number={1} title="The agreement">
        <p>
          These terms are between you and {business} ({shown(identity.country)}). Using the
          website, the free tools or an account means you accept them. If you use TradeDocs for an
          organization, you confirm you may accept them on its behalf.
        </p>
      </LegalSection>

      <LegalSection id="service" number={2} title="What TradeDocs is, and is not">
        <p>
          {BOUNDARY_STATEMENT} It prepares commercial invoices, proforma invoices, packing lists and
          delivery notes from the data you enter. It does not issue, endorse, certify or clear any
          document, and nothing in it is legal, customs, tax or compliance advice.
        </p>
        <p>
          You are responsible for checking every document before you rely on it or send it, and for
          the accuracy of what it declares. Calculators and references (CBM, dimensional weight,
          landed cost, Incoterms®) are aids: they work from the figures and rates you supply and do
          not look up tariffs or rules for you.
        </p>
      </LegalSection>

      <LegalSection id="accounts" number={3} title="Your account">
        <ul>
          <li>Give a real email address you control and keep your password to yourself.</li>
          <li>
            Tell us promptly if you think someone else has access; “Sign out on all devices” in
            Account ends every session.
          </li>
          <li>
            Organization owners and admins decide who joins their workspace and with which role.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="content" number={4} title="Your content">
        <p>
          What you enter, and the documents made from it, remain yours. You let us store, process
          and display it only to run the service for you. You confirm you may share any personal
          data you enter about other people, such as your customers’ contact details, and the{' '}
          <Link className="text-link" href="/privacy">
            privacy policy
          </Link>{' '}
          explains how we handle it.
        </p>
      </LegalSection>

      <LegalSection id="use" number={5} title="Acceptable use">
        <p>Do not use TradeDocs to:</p>
        <ul>
          <li>prepare false, misleading or fraudulent documents, or break any law or sanction;</li>
          <li>
            reach another organization’s data or probe, overload or bypass security or quotas;
          </li>
          <li>scrape the site or resell the service without our written agreement.</li>
        </ul>
        <p>
          We may limit or suspend access that breaks these rules, and will say why where we can.
        </p>
      </LegalSection>

      <LegalSection id="price" number={6} title="Price">
        <p>
          TradeDocs is free while it is early. If paid plans are introduced, they will be announced
          with notice before anything is charged, and nothing is charged without your agreement.
        </p>
      </LegalSection>

      <LegalSection id="availability" number={7} title="Availability and changes">
        <p>
          We work to keep TradeDocs available and correct, but it is provided as it is, without a
          guaranteed level of service. Features may change; when a change removes something you
          rely on, we will give reasonable notice where we can.
        </p>
      </LegalSection>

      <LegalSection id="liability" number={8} title="Liability">
        <p>
          To the extent the law allows, we are not liable for losses arising from the content of
          documents you prepare, from customs, carrier or authority decisions, or for indirect or
          consequential loss. Nothing in these terms limits liability that cannot be limited by law,
          or your statutory rights as a consumer where they apply. The overall limit of our
          liability is {shown(null)}.
        </p>
      </LegalSection>

      <LegalSection id="ending" number={9} title="Ending the agreement">
        <p>
          You can stop at any time and delete your account from Account in the workspace; the
          request waits 30 days and can be withdrawn in that time. We may end or suspend an account
          that seriously or repeatedly breaks these terms.
        </p>
      </LegalSection>

      <LegalSection id="law" number={10} title="Governing law">
        <p>
          These terms are governed by {shown(identity.governingLaw)}. Questions or complaints: use
          the{' '}
          <Link className="text-link" href="/contact">
            contact form
          </Link>{' '}
          first and we will try to resolve them directly.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
