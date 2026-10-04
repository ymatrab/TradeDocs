import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Boxes, Building2, Check, Clock, Users } from 'lucide-react';
import { LinkButton } from '@/components/primitives/button';
import { primaryAction } from '@/components/shell/public';
import { RevealSection } from '@/components/shell/reveal';
import { documentKindLabels, type DocumentKind } from '@/lib/labels';
import { isDatabaseConfigured } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Trade documents that agree with each other',
  description:
    'Enter a shipment once and prepare a commercial invoice, proforma invoice, packing list and delivery note that carry the same figures.',
  alternates: { canonical: '/' },
};

/**
 * The document types a visitor can produce today. The certificate of origin exists in the
 * schema but is awaiting legal review, so it is deliberately absent here, and every count
 * on the page is derived from this list rather than typed.
 */
const documents: { kind: DocumentKind; plate: string; detail: string }[] = [
  {
    kind: 'commercial_invoice',
    plate: 'TD · CI',
    detail: 'Parties, goods, values, incoterm and totals, in the layout buyers and banks expect.',
  },
  {
    kind: 'proforma_invoice',
    plate: 'TD · PI',
    detail: 'The quotation a buyer needs before they pay or open a letter of credit.',
  },
  {
    kind: 'packing_list',
    plate: 'TD · PL',
    detail: 'Packages, weights and dimensions from the same shipment, never retyped.',
  },
  {
    kind: 'delivery_note',
    plate: 'TD · DN',
    detail: 'What is being handed over, matched line for line to the invoice.',
  },
];

/** Every document prints a total quantity, so it is the one figure the stack may share. */
const SHARED_QUANTITY = '1,280.000';
const stackTones = ['is-tape', '', 'is-paper', ''] as const;

const steps = [
  {
    title: 'Save your parties and products',
    detail:
      'Your company, your customers and the goods you ship, entered once and reused. Change an address and every future document uses it.',
    listLabel: 'Fields you fill in',
    fields: ['Company name', 'Country', 'HS code'],
  },
  {
    title: 'Build the shipment',
    detail:
      'Pick the buyer, add lines from your catalog with quantities, and set the incoterm and route. Totals are calculated, not typed.',
    listLabel: 'Fields you fill in',
    fields: ['Shipment reference', 'Port of loading', 'Quantity'],
  },
  {
    title: 'Generate the set',
    detail:
      'Every document is rendered from the same shipment revision. Download each PDF, or the whole set as one ZIP with checksums.',
    listLabel: 'What you download',
    fields: ['Commercial invoice PDF', 'Packing list PDF', 'The whole set as ZIP'],
  },
];

const saved = [
  {
    icon: Building2,
    title: 'Company directory',
    detail:
      'Your own company, customers and suppliers with their addresses. Archive the ones you no longer ship to.',
  },
  {
    icon: Boxes,
    title: 'Product catalog',
    detail:
      'Descriptions, HS codes and units, imported from the spreadsheet you already keep. Editing a product never rewrites a line already shipped.',
  },
  {
    icon: Users,
    title: 'Your team',
    detail:
      'Invite teammates by link, as owners, admins or members. Every record stays inside your organization.',
  },
];

const tools = [
  {
    href: '/tools/invoice-generator',
    tag: 'Tool · Invoice',
    name: 'Commercial invoice generator',
    detail: 'Fill in an invoice, proforma or packing list and download the PDF.',
    cta: 'Open generator',
  },
  {
    href: '/tools/cbm-calculator',
    tag: 'Tool · CBM',
    name: 'CBM calculator',
    detail: 'Cubic metres from carton sizes, checked against standard containers.',
    cta: 'Open calculator',
  },
  {
    href: '/tools/chargeable-weight',
    tag: 'Tool · Weight',
    name: 'Chargeable weight calculator',
    detail: 'Volumetric against actual weight, and which one you will be billed on.',
    cta: 'Open calculator',
  },
  {
    href: '/tools/incoterms',
    tag: 'Tool · Incoterms',
    name: 'Incoterms 2020 guide',
    detail: 'All eleven rules: who pays, who insures, where risk passes.',
    cta: 'Open guide',
  },
];

/** "Commercial invoice, proforma invoice, packing list and delivery note", from the data. */
function listOfDocuments(): string {
  const names = documents.map((document, index) => {
    const label: string = documentKindLabels[document.kind];
    return index === 0 ? label : label.toLowerCase();
  });
  const last = names.pop() ?? '';
  return names.length > 0 ? `${names.join(', ')} and ${last}` : last;
}

const included = [
  `${listOfDocuments()}, as PDFs`,
  'Shipments, companies and products saved to your organization',
  'Teammates invited by link, with owner, admin and member roles',
  'A shipment’s current documents as one ZIP with a checksum manifest',
];

const notYet = [
  'Certificate of origin: awaiting legal review, not offered yet',
  'Invitations by email: for now you pass the link on yourself',
  'Paid plans: none yet, and they will come with notice',
];

const questions = [
  {
    q: 'Does TradeDocs issue or certify my documents?',
    a: 'No. TradeDocs prepares documents from the data you enter. Issuing, endorsing, certifying and clearing are done by carriers, chambers of commerce and customs authorities. Every document says so on its face, and that labelling cannot be removed.',
  },
  {
    q: 'What happens when a shipment changes after I have generated documents?',
    a: 'A generated document is locked to the shipment revision it came from, so it never changes underneath you. If the shipment moves on, the earlier document is marked stale and you decide whether to re-issue it. Nothing is rewritten silently.',
  },
  {
    q: 'Do I have to enter my company details for every shipment?',
    a: 'No. Companies, customers, addresses and products are stored once and reused. That reuse is the point: retyping is where the invoice and the packing list start to disagree.',
  },
  {
    q: 'Is my shipment data visible to anyone else?',
    a: 'No. Every record belongs to your organization, and access is enforced by the database itself rather than by the interface. A request for another organization’s data returns nothing, whichever route it arrives on.',
  },
  {
    q: 'What does it cost?',
    a: 'Nothing today. TradeDocs is free while it is early, and paid plans will arrive later with clear notice.',
  },
];

/** A numeral that counts up once seen. The real number is the text beside it. */
function Stat({ value, label }: { value: number; label: string }) {
  return (
    <p className="stat">
      <span className="stat-figure">
        <span className="count" aria-hidden="true" style={{ '--n': value } as CSSProperties} />
        <span className="sr-only">{value}</span>
      </span>
      <span className="stat-label">{label}</span>
    </p>
  );
}

/** The pixel edge's columns, uncovered in a scattered rather than a sweeping order. */
const pixelOrder = [3, 9, 0, 13, 6, 11, 1, 15, 8, 4, 12, 2, 10, 14, 5, 7];

export default function Home() {
  const accountsOpen = isDatabaseConfigured();
  const action = primaryAction(accountsOpen);

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="inner">
          <div>
            <p className="eyebrow">One shipment. Every document.</p>
            <h1 id="hero-title">
              Enter a shipment once. Get the whole <mark className="tape">document set</mark>.
            </h1>
            <p className="lede">
              Record the parties, goods and terms one time. TradeDocs prepares the commercial
              invoice, proforma invoice, packing list and delivery note from that one record, so a
              figure you entered once reads the same on every page that carries it.
            </p>
            <div className="cta-row">
              <LinkButton href={action.href} className="large tape">
                {action.label} <ArrowRight size={18} aria-hidden="true" />
              </LinkButton>
              <LinkButton href="/tools" tone="secondary" className="large">
                {accountsOpen ? 'Try a free tool' : 'See all free tools'}
              </LinkButton>
            </div>
            <p className="assurance">
              {accountsOpen
                ? 'Free while early · No card required · Every page marked prepared, not issued'
                : 'Free while early · The tools need no account · Every page marked prepared, not issued'}
            </p>
          </div>

          {/*
            The claim, drawn rather than asserted: one entry, then the documents it prepares,
            stacked edge-on like containers. The only figure shown is the total quantity,
            because it is the one total every one of these documents prints.
          */}
          <figure
            className="stack"
            role="img"
            aria-label={`${documents.length} documents prepared from one shipment, each showing the same total quantity`}
          >
            <p className="stack-source">Shipment TDX-2026-0184 · entered once</p>
            {documents.map((document, index) => (
              <div
                className={['stack-block', stackTones[index]].filter(Boolean).join(' ')}
                key={document.kind}
              >
                <span className="stack-name">{documentKindLabels[document.kind]}</span>
                <span className="stack-figure">
                  Total qty
                  <b>{SHARED_QUANTITY}</b>
                </span>
                <span className="stack-plate">
                  {document.plate} · {String(index + 1).padStart(4, '0')}
                </span>
              </div>
            ))}
          </figure>
        </div>
      </section>

      <RevealSection className="section" id="how" aria-labelledby="how-title">
        <div className="section-head">
          <p className="eyebrow">Enter once</p>
          <h2 id="how-title">Three steps, and the arithmetic stops being yours.</h2>
        </div>
        <div className="cards">
          {steps.map((step, index) => (
            <article className="card wipe" key={step.title}>
              <span className="tag">Step {String(index + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.detail}</p>
              <ul className="fields" aria-label={step.listLabel}>
                {step.fields.map((field) => (
                  <li key={field}>{field}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </RevealSection>

      <RevealSection className="section" aria-labelledby="set-title">
        <div className="section-head split">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <p className="eyebrow">The consistent set</p>
            <h2 id="set-title" className="display">
              <mark className="tape">Same numbers</mark>, every page.
            </h2>
            <p>
              Each document is a snapshot of one shipment revision. Change the shipment later and
              the earlier documents are marked stale, never quietly rewritten.
            </p>
          </div>
          <Stat value={documents.length} label="Document types from 1 entry" />
        </div>
        <div className="cards four">
          {documents.map((document) => (
            <article className="card wipe" key={document.kind}>
              <span className="tag on-tape">{document.plate}</span>
              <h3>{documentKindLabels[document.kind]}</h3>
              <p>{document.detail}</p>
            </article>
          ))}
        </div>
        <p className="note">
          A certificate of origin template is awaiting legal review and is not offered yet.
        </p>
      </RevealSection>

      <RevealSection className="section sunken" aria-labelledby="saved-title">
        <div className="section-head">
          <p className="eyebrow">Saved once</p>
          <h2 id="saved-title">Companies, products and people, kept for the next shipment.</h2>
        </div>
        <div className="cards">
          {saved.map((item) => (
            <article className="card wipe" key={item.title}>
              <span className="plate-icon">
                <item.icon size={22} aria-hidden="true" />
              </span>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </RevealSection>

      <RevealSection className="section" aria-labelledby="tools-title">
        <div className="section-head split">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <p className="eyebrow">Free tools</p>
            <h2 id="tools-title">Useful before you have an account.</h2>
            <p>
              The calculators run in your browser. The invoice generator sends your details once to
              render the PDF and stores nothing.
            </p>
          </div>
          <Stat value={tools.length} label="Free tools, no account" />
        </div>
        <div className="cards four">
          {tools.map((tool) => (
            <Link className="card wipe" href={tool.href} key={tool.href}>
              <span className="tag">{tool.tag}</span>
              <h3>{tool.name}</h3>
              <p>{tool.detail}</p>
              <span className="card-foot">
                <span className="caption">Free, no account</span>
                <span className="card-cta">
                  {tool.cta} <ArrowRight size={15} aria-hidden="true" />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </RevealSection>

      <RevealSection className="section dark" id="pricing" aria-labelledby="status-title">
        <div className="pixel-edge" aria-hidden="true">
          {pixelOrder.map((order, column) => (
            <span key={column} style={{ '--i': order } as CSSProperties} />
          ))}
        </div>
        <div className="section-head">
          <p className="eyebrow">Honest status</p>
          <h2 id="status-title" className="display">
            Free while <mark className="tape">early</mark>.
          </h2>
          <p>
            There is no price yet. Paid plans will come later, with notice.
            {accountsOpen
              ? null
              : ' Accounts are not open on this deployment yet; the free tools work now.'}
          </p>
        </div>
        <div className="status-grid">
          <article className="card">
            <span className="tag">Included now</span>
            <ul className="ledger">
              {included.map((item) => (
                <li key={item}>
                  <Check size={17} aria-hidden="true" className="yes" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
          <article className="card">
            <span className="tag">Not yet</span>
            <ul className="ledger">
              {notYet.map((item) => (
                <li key={item}>
                  <Clock size={17} aria-hidden="true" className="not-yet" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
        <div className="boundary">
          <p>
            TradeDocs prepares documents from the data you enter. Carriers, chambers of commerce and
            customs authorities issue, certify and clear them, and TradeDocs never presents itself
            as one of them.
          </p>
          <LinkButton href={action.href} className="tape">
            {action.label} <ArrowRight size={17} aria-hidden="true" />
          </LinkButton>
        </div>
      </RevealSection>

      <section className="section" aria-labelledby="faq-title">
        <div className="section-head">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-title">Before you start.</h2>
        </div>
        <div className="faq">
          {questions.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <RevealSection className="section sunken closing" aria-labelledby="closing-title">
        <div className="inner">
          <p className="eyebrow">Next shipment</p>
          <h2 id="closing-title" className="display" style={{ marginTop: 24 }}>
            Stop <mark className="tape">reconciling</mark> paperwork.
          </h2>
          <div className="cta-row">
            <LinkButton href={action.href} className="large">
              {action.label} <ArrowRight size={18} aria-hidden="true" />
            </LinkButton>
            <LinkButton href="/tools" tone="secondary" className="large">
              {accountsOpen ? 'Try a free tool' : 'See all free tools'}
            </LinkButton>
          </div>
          {/*
            A stamp is what a document gets when an authority has touched it. TradeDocs is not
            an authority, so its stamp says exactly that.
          */}
          <p className="stamp">Prepared · not issued</p>
        </div>
      </RevealSection>
    </>
  );
}
