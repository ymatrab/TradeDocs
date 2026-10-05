import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Boxes, Building2, Check, Clock, Users } from 'lucide-react';
import { LinkButton } from '@/components/primitives/button';
import { BoxGrid, FieldBox } from '@/components/document/field-box';
import { Line } from '@/components/shell/line';
import { primaryAction } from '@/components/shell/public';
import { RevealSection } from '@/components/shell/reveal';
import { HomeJsonLd } from '@/components/seo/json-ld';
import { PUBLIC_TOOLS } from '@/lib/seo/site';
import { openGraphFor } from '@/lib/seo/social';
import { documentKindLabels, partyRoleLabels, type DocumentKind } from '@/lib/labels';
import { INCOTERMS } from '@/lib/trade/incoterms';
import { isDatabaseConfigured } from '@/lib/supabase/server';
import { ToolBench, type BenchIncoterm, type BenchTool } from './tool-bench';

export const metadata: Metadata = {
  title: 'Trade documents that agree with each other',
  description:
    'Enter a shipment once and prepare a commercial invoice, proforma invoice, packing list and delivery note that carry the same figures.',
  alternates: { canonical: '/' },
  openGraph: openGraphFor(
    'TradeDocs: trade documents that agree with each other',
    'Enter a shipment once and prepare a commercial invoice, proforma invoice, packing list and delivery note that carry the same figures.',
    '/',
  ),
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

/** Every document prints a total quantity, so it is the one figure they may be shown sharing. */
const SHARED_QUANTITY = '1,280.000';

/**
 * An example record, labelled as one wherever it is drawn. The captions are the workspace's
 * own field names; there are no box numbers because the PDFs print none.
 */
const EXAMPLE_REFERENCE = 'TDX-2026-0184';
const exampleRecord = [
  { caption: partyRoleLabels.exporter_id, value: 'Example Exports Ltd' },
  { caption: partyRoleLabels.consignee_id, value: 'Example Imports GmbH' },
  { caption: 'Incoterm 2020', value: 'FOB · Shanghai' },
  { caption: 'Port of loading', value: 'Shanghai, CN' },
  { caption: 'Port of discharge', value: 'Hamburg, DE' },
] as const;

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

const tools: BenchTool[] = [
  {
    id: 'cbm',
    href: '/tools/cbm-calculator',
    mark: 'CBM',
    name: 'CBM calculator',
    detail: 'Cubic metres from carton sizes, checked against standard containers.',
  },
  {
    id: 'weight',
    href: '/tools/chargeable-weight',
    mark: 'KG',
    name: 'Dimensional weight calculator',
    detail: 'Volumetric against actual weight, and which one you will be billed on.',
  },
  {
    id: 'incoterms',
    href: '/tools/incoterms',
    mark: 'INCO',
    name: 'Incoterms® 2020 guide',
    detail: 'All eleven rules: who pays, who insures, where risk passes.',
  },
  {
    id: 'invoice',
    href: '/tools/invoice-generator',
    mark: 'INV',
    name: 'Commercial invoice generator',
    detail: 'Fill in an invoice, proforma or packing list and download the PDF.',
  },
];

/** Only what the bench's one field shows, so the full guide text stays off the client. */
const benchIncoterms: BenchIncoterm[] = INCOTERMS.map((rule) => ({
  code: rule.code,
  name: rule.name,
  riskPasses: rule.riskPasses,
}));

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
  // Every timeline name the record section declares, so a card can follow the next one.
  const docTimelines = documents.map((_, index) => `--doc-${index}`).join(', ');

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="inner">
          <div>
            <p className="eyebrow">One shipment. Every document.</p>
            <h1 id="hero-title">
              <Line index={0}>Enter a shipment once.</Line>{' '}
              <Line index={1}>
                Get the whole <mark className="tape">document set</mark>.
              </Line>
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
            The claim, drawn with the product's own parts: an example shipment record in the
            workspace's field boxes, and beneath it the documents prepared from it. The total
            quantity is the one figure every one of those documents prints, so it is the one
            the marker ties together.
          */}
          <figure className="frame" aria-labelledby="frame-caption">
            <figcaption id="frame-caption" className="frame-head">
              <span>Example shipment · {EXAMPLE_REFERENCE}</span>
              <span>Entered once</span>
            </figcaption>
            <BoxGrid label="Example shipment record">
              {exampleRecord.map((field) => (
                <FieldBox key={field.caption} caption={field.caption} value={field.value} />
              ))}
              <FieldBox caption="Total quantity">
                <mark className="tape data" style={{ '--i': 0 } as CSSProperties}>
                  {SHARED_QUANTITY}
                </mark>
              </FieldBox>
            </BoxGrid>
            <ul className="frame-rail" aria-label="Documents prepared from this record">
              {documents.map((document, index) => (
                <li key={document.kind} style={{ '--i': index } as CSSProperties}>
                  <span className="frame-plate">{document.plate}</span>
                  <span className="sr-only">
                    {documentKindLabels[document.kind]}, total quantity
                  </span>
                  <mark className="tape data" style={{ '--i': index + 1 } as CSSProperties}>
                    {SHARED_QUANTITY}
                  </mark>
                </li>
              ))}
            </ul>
          </figure>
        </div>
      </section>

      <RevealSection className="section" id="how" aria-labelledby="how-title">
        <div className="section-head">
          <p className="eyebrow">Enter once</p>
          <h2 id="how-title">
            <Line>Three steps, and the arithmetic stops being yours.</Line>
          </h2>
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
              <Line index={0}>
                <mark className="tape">Same numbers</mark>,
              </Line>{' '}
              <Line index={1}>every page.</Line>
            </h2>
            <p>
              Each document is a snapshot of one shipment revision. Change the shipment later and
              the earlier documents are marked stale, never quietly rewritten.
            </p>
          </div>
          <Stat value={documents.length} label="Document types from 1 entry" />
        </div>

        {/*
          One record, pinned, and the documents prepared from it stacking beside it as the
          page scrolls. Each card marks the same total the record marks. On a phone the cards
          become a row the visitor swipes through instead.
        */}
        <div className="record-flow">
          <div className="record-pin">
            <div className="record-card">
              <p className="record-head">
                <span className="caption">One record</span>
                <span className="data">{EXAMPLE_REFERENCE}</span>
              </p>
              <dl className="record-list">
                {exampleRecord.slice(0, 3).map((field) => (
                  <div key={field.caption}>
                    <dt className="caption">{field.caption}</dt>
                    <dd>{field.value}</dd>
                  </div>
                ))}
                <div>
                  <dt className="caption">Total quantity</dt>
                  <dd>
                    <mark className="tape data on-hull">{SHARED_QUANTITY}</mark>
                  </dd>
                </div>
              </dl>
              <p className="record-foot">Example record · prepares {documents.length} documents</p>
            </div>
          </div>
          <div
            className="doc-scroller"
            role="region"
            aria-label="Documents prepared from the record"
            tabIndex={0}
          >
            <ol className="doc-stack" style={{ '--scope': docTimelines } as CSSProperties}>
              {documents.map((document, index) => (
                <li
                  className="doc"
                  key={document.kind}
                  style={
                    {
                      '--i': index,
                      '--self': `--doc-${index}`,
                      '--next': `--doc-${index + 1}`,
                    } as CSSProperties
                  }
                >
                  <article className="card doc-card">
                    <span className="doc-card-head">
                      <span className="tag on-tape">{document.plate}</span>
                      <span className="caption">{String(index + 1).padStart(4, '0')}</span>
                    </span>
                    <h3>{documentKindLabels[document.kind]}</h3>
                    <p>{document.detail}</p>
                    <p className="doc-total">
                      <span className="caption">Total quantity</span>
                      <mark className="tape data">{SHARED_QUANTITY}</mark>
                    </p>
                  </article>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <p className="note">
          A certificate of origin template is awaiting legal review and is not offered yet.
        </p>
      </RevealSection>

      <RevealSection className="section sunken" aria-labelledby="saved-title">
        <div className="section-head">
          <p className="eyebrow">Saved once</p>
          <h2 id="saved-title">
            <Line>Companies, products and people, kept for the next shipment.</Line>
          </h2>
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
            <h2 id="tools-title">
              <Line>Useful before you have an account.</Line>
            </h2>
            <p>
              The calculators run in your browser. The document generators send your details once to
              render the PDF and store nothing.
            </p>
          </div>
          <Stat value={PUBLIC_TOOLS.length} label="Free tools, no account" />
        </div>
        <ToolBench tools={tools} incoterms={benchIncoterms} />
        <div className="bench-foot">
          <LinkButton href="/tools" className="large">
            See all free tools <ArrowRight size={18} aria-hidden="true" />
          </LinkButton>
          <span className="caption">Free, no account · The figures above are worked examples</span>
        </div>
        <p className="measure">
          The document generators need no account: a{' '}
          <Link className="text-link" href="/tools/invoice-generator">
            commercial invoice
          </Link>
          , a{' '}
          <Link className="text-link" href="/tools/proforma-invoice-generator">
            proforma invoice
          </Link>{' '}
          and a{' '}
          <Link className="text-link" href="/tools/packing-list-generator">
            packing list
          </Link>
          , each downloaded as a PDF.
        </p>
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
            <Line index={0}>Free while</Line>{' '}
            <Line index={1}>
              <mark className="tape">early</mark>.
            </Line>
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
          <h2 id="faq-title">
            <Line>Before you start.</Line>
          </h2>
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
          <h2 id="closing-title" className="display">
            <Line index={0}>
              Stop <mark className="tape">reconciling</mark>
            </Line>{' '}
            <Line index={1}>paperwork.</Line>
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
      <HomeJsonLd faq={questions} />
    </>
  );
}
