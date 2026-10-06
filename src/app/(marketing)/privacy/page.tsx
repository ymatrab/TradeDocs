import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage, LegalSection } from '@/components/legal/legal-page';
import { DataTable } from '@/components/primitives/table';
import { shown } from '@/lib/legal/identity';
import { getLegalIdentity, legalMetadata } from '@/lib/legal/server';

// Reads the approval state and the business identity from the deployment's environment.
export const dynamic = 'force-dynamic';

export function generateMetadata(): Metadata {
  return legalMetadata(
    '/privacy',
    'Privacy policy',
    'What personal data TradeDocs handles, why, who processes it for us, how long it is kept and how to use your rights.',
  );
}

/**
 * Drafted from what the code does (D-009), not from a template. Each statement below points
 * at behaviour that exists: Supabase Auth and Postgres hold accounts and workspace data,
 * Vercel serves the site, Resend sends email when configured, guide covers are hotlinked from
 * Unsplash, the free generators store nothing, quotas key on an HMAC of the address, and
 * account deletion is a 30-day revocable request. Change the text when the behaviour changes.
 */
export default function PrivacyPage() {
  const identity = getLegalIdentity();
  const business = shown(identity.entityName);

  return (
    <LegalPage
      title="Privacy policy"
      lede="What we collect when you use TradeDocs, why, who helps us run it, how long we keep it and what you can ask us to do."
      identity={identity}
    >
      <LegalSection id="controller" number={1} title="Who is responsible">
        <p>
          {business} ({shown(identity.country)}) runs TradeDocs and is the controller for the
          personal data described here: your account, the contact form and the records that keep the
          service secure. Write to{' '}
          {identity.contactEmail ? (
            <a className="text-link" href={`mailto:${identity.contactEmail}`}>
              {identity.contactEmail}
            </a>
          ) : (
            <Link className="text-link" href="/contact">
              the contact form
            </Link>
          )}{' '}
          about anything in this policy.
        </p>
        <p>
          Inside a workspace you also record other people: your customers’ and suppliers’ contact
          names, addresses, emails and phone numbers. For those records your organization decides
          what is entered and why, so it is the controller and we process them on its behalf, only
          to run the service for it.
        </p>
      </LegalSection>

      <LegalSection id="data" number={2} title="What we collect and why">
        <DataTable caption="Personal data, purpose and lawful basis" density="compact">
          <thead>
            <tr>
              <th scope="col">Data</th>
              <th scope="col">Why</th>
              <th scope="col">Lawful basis</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                Account: email address, password (stored only as a one-way hash by our
                authentication provider), sign-in times and session tokens
              </td>
              <td>To create your account, sign you in and keep it yours</td>
              <td>Contract</td>
            </tr>
            <tr>
              <td>
                Workspace: organizations, members and roles, companies, products, shipments and the
                documents generated from them
              </td>
              <td>To provide the service you signed up for</td>
              <td>
                Contract (and, for your contacts’ details, on your organization’s instructions)
              </td>
            </tr>
            <tr>
              <td>Invitations: the invited email address and a digest of the invitation link</td>
              <td>To let an owner or admin add a colleague</td>
              <td>Contract; legitimate interests of the inviting organization</td>
            </tr>
            <tr>
              <td>
                Activity record: who did what in a workspace and when (for example, generating a
                document or inviting a member)
              </td>
              <td>Security, accountability to your organization, investigating misuse</td>
              <td>Legitimate interests</td>
            </tr>
            <tr>
              <td>Contact form: your name, email address, topic and message</td>
              <td>To answer you</td>
              <td>Legitimate interests; steps you ask for before a contract</td>
            </tr>
            <tr>
              <td>
                Request quotas: a keyed one-way digest of your network address, never the address
                itself
              </td>
              <td>To stop the free tools and forms being flooded</td>
              <td>Legitimate interests</td>
            </tr>
          </tbody>
        </DataTable>
        <p>
          <strong>The free tools store nothing.</strong> The calculators run in your browser. The
          invoice, proforma and packing list generators send what you typed once, to render the PDF,
          and keep no copy: there is no record of the parties, goods or prices afterwards.
        </p>
        <p>
          We do not use analytics, advertising or tracking services, we do not sell personal data
          and we do not use it to profile you. No automated decision with legal or similar effect is
          made about you.
        </p>
      </LegalSection>

      <LegalSection id="processors" number={3} title="Who processes data for us">
        <ul>
          <li>
            <strong>Supabase</strong> hosts the database and the sign-in service: accounts,
            workspace data, the activity record, contact messages and request quotas. Data region:{' '}
            {shown(identity.dataRegion)}.
          </li>
          <li>
            <strong>Vercel</strong> hosts and serves the website and application, and processes the
            technical details of each request (network address, browser, the page asked for) to
            deliver it.
          </li>
          <li>
            <strong>Resend</strong> delivers email when it is configured: sign-up confirmation,
            sign-in links and password resets, and a copy of contact-form messages to our inbox.
          </li>
          <li>
            <strong>Unsplash</strong> serves the photos on the homepage, guides and blog. Your
            browser fetches them from Unsplash’s image servers directly, so Unsplash receives your
            network address and browser details when you open those pages.
          </li>
          <li>
            <strong>Stripe</strong> will process payments once paid plans open. It is not used
            today, and no payment data is collected until then.
          </li>
        </ul>
        <p>
          The site’s fonts are served from our own host, so no font service sees your visit. Each
          provider acts under its own terms and data processing commitments; we pass it only what
          its job needs.
        </p>
      </LegalSection>

      <LegalSection id="transfers" number={4} title="International transfers">
        <p>
          Some of these providers, or their sub-processors, operate outside the UK and the European
          Economic Area. Where personal data leaves them, we rely on the safeguards the provider
          offers, such as standard contractual clauses or an adequacy decision. The mechanism used
          for each provider is {shown(null)} and will be listed here before this policy is approved.
        </p>
      </LegalSection>

      <LegalSection id="retention" number={5} title="How long we keep it">
        <ul>
          <li>Account and workspace data: for as long as the account or organization exists.</li>
          <li>
            Deleting your account: from Account in the workspace, confirmed with your password. The
            request waits 30 days, during which you can withdraw it; the account and the personal
            data attached to it are removed shortly after those 30 days end. Organizations you own
            are not removed with you; hand ownership over first.
          </li>
          <li>
            Activity record: kept with the organization it belongs to. When an account is removed,
            entries it made stay but no longer point to the person.
          </li>
          <li>Request quota counters: deleted once they are more than two days old.</li>
          <li>Free tool submissions: not kept at all.</li>
          <li>Contact messages: until your enquiry is resolved, then for {shown(null)}.</li>
        </ul>
      </LegalSection>

      <LegalSection id="rights" number={6} title="Your rights">
        <p>
          Under the UK GDPR and the EU GDPR you can ask us for a copy of your personal data, to
          correct it, to delete it, to restrict or object to how we use it, and to receive it in a
          portable form. Where we rely on legitimate interests you can object at any time. Choose
          “Privacy or a data request” on the{' '}
          <Link className="text-link" href="/contact">
            contact form
          </Link>{' '}
          and we will answer within one month.
        </p>
        <p>
          For data your organization entered about other people, contact that organization first; we
          will help it respond. You can also complain to a data protection authority, such as the
          Information Commissioner’s Office in the UK or the authority where you live or work in the
          EU.
        </p>
      </LegalSection>

      <LegalSection id="security" number={7} title="How it is protected">
        <p>
          Every request travels over HTTPS. Each workspace record belongs to one organization, and
          the database itself refuses access from any other, whichever route a request takes.
          Passwords are never stored in readable form, privileged keys stay on the server, and
          private trade data is kept out of logs.
        </p>
      </LegalSection>

      <LegalSection id="children" number={8} title="Children">
        <p>TradeDocs is a business tool and is not meant for anyone under 16.</p>
      </LegalSection>

      <LegalSection id="changes" number={9} title="Changes to this policy">
        <p>
          When what we collect or who processes it changes, this page changes with it and the date
          at the top moves. Material changes are announced to account holders before they apply.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
