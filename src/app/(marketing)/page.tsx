import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  Package,
  Stamp,
} from 'lucide-react';
import { LinkButton } from '@/components/primitives/button';

export const metadata: Metadata = {
  title: 'Trade documents that agree with each other',
  description:
    'Capture a shipment once and produce a commercial invoice, packing list, delivery note, proforma and certificate of origin that carry the same figures.',
};

/**
 * The page is laid out as the thing it sells.
 *
 * Trade paperwork is a grid of numbered, bordered boxes, each captioned in its corner,
 * and the box numbers are an address system rather than a running order: box 6 is not
 * step six, it is where marks and numbers go. The sections below are numbered on the
 * same principle. It costs nothing, it is true to the subject, and it is the one layout
 * that no other product in this category can honestly borrow.
 */

const documents = [
  {
    icon: FileText,
    name: 'Commercial invoice',
    detail: 'Parties, goods, values, incoterm and totals, in the layout buyers and banks expect.',
  },
  {
    icon: Package,
    name: 'Packing list',
    detail: 'Cartons, weights and dimensions derived from the same shipment, never retyped.',
  },
  {
    icon: FileSpreadsheet,
    name: 'Delivery note',
    detail: 'What is being handed over, matched line for line to the invoice.',
  },
  {
    icon: FileCheck2,
    name: 'Proforma invoice',
    detail: 'The quotation your buyer needs before they open a letter of credit.',
  },
  {
    icon: Stamp,
    name: 'Certificate of origin',
    detail: 'Prepared for submission to the issuing authority, clearly labelled as preparation.',
  },
];

const steps = [
  {
    n: '1',
    title: 'Record your parties and products',
    detail:
      'Your company, your customers and the goods you ship, entered once and reused. Change an address and every future document uses it.',
  },
  {
    n: '2',
    title: 'Build the shipment',
    detail:
      'Pick the buyer, add line items with quantities, weights and values, and set the incoterm and route. Totals are calculated, not typed.',
  },
  {
    n: '3',
    title: 'Generate the document set',
    detail:
      'Every document is rendered from the same shipment revision, so they cannot disagree. Download them as PDFs and send them on.',
  },
];

const tools = [
  {
    icon: FileText,
    href: '/tools/invoice-generator',
    name: 'Commercial invoice generator',
    detail: 'Fill it in, download the PDF. No account and no watermark.',
  },
  {
    icon: Package,
    href: '/tools/cbm-calculator',
    name: 'CBM calculator',
    detail: 'Cubic metres from carton sizes, checked against a container.',
  },
  {
    icon: Stamp,
    href: '/tools/incoterms',
    name: 'Incoterms 2020 guide',
    detail: 'All eleven rules: who pays, who insures, where risk passes.',
  },
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
    a: 'Nothing today. TradeDocs is free while it is early, and paid plans will arrive later with clear notice. Accounts created now keep working.',
  },
];

/** The caption and ordinal every box on the sheet carries, as a real form would. */
function BoxHead({ ordinal, caption }: { ordinal: string; caption: string }) {
  return (
    <div className="form-box-head">
      <span className="form-ordinal">{ordinal}</span>
      <span className="form-caption">{caption}</span>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="inner">
          <div>
            <p className="form-meta">
              <span>Shipment workspace</span>
              <span className="form-meta-end">Five document types</span>
            </p>
            <h1>
              Trade documents that <span className="accent">agree</span> with each other.
            </h1>
            <p className="lede">
              Enter a shipment once. TradeDocs produces the invoice, the packing list and everything
              else from that single record — so the quantities, weights and values match on every
              page you send.
            </p>
            <div className="cta-row">
              <LinkButton href="/sign-up" tone="accent" className="large">
                Create a free account <ArrowRight size={18} aria-hidden="true" />
              </LinkButton>
              <Link className="text-link" href="#how">
                See how it works
              </Link>
            </div>
            <p className="assurance">Free while TradeDocs is early. No card required.</p>
          </div>

          {/*
            The claim, drawn rather than asserted. One figure entered against a shipment,
            then the same figure at the box number it carries on each document. Those
            numbers are fixed by the forms, so the illustration is the product rather than
            a picture of it. Hidden from assistive technology because the headline and lede
            already make the point in words, and hearing one weight four times is noise.
          */}
          <figure className="tie" aria-hidden="true">
            <div className="tie-head">
              <span className="tie-title">Shipment</span>
              <span className="data" style={{ fontSize: 12 }}>
                TDX-2026-0184
              </span>
            </div>
            <div className="tie-source">
              <span className="caption">Net weight · entered once</span>
              <p className="tie-figure">4,476.50 kg</p>
            </div>
            <p className="caption tie-legend">Appears as</p>
            <ul className="tie-rows">
              {[
                { box: '9', document: 'Commercial invoice' },
                { box: '6', document: 'Packing list' },
                { box: '4', document: 'Delivery note' },
              ].map((entry) => (
                <li className="tie-row" key={entry.document}>
                  <span className="tie-ordinal">{entry.box}</span>
                  <span className="tie-doc">{entry.document}</span>
                  <span className="tie-value">4,476.50 kg</span>
                </li>
              ))}
            </ul>
          </figure>
        </div>
      </section>

      {/* The sheet. Boxes share one rule with their neighbours, the way a printed form does. */}
      <div className="sheet">
        <div className="form">
          <section className="form-box w7">
            <BoxHead ordinal="01" caption="The problem" />
            <h2>One number typed twice is one number that will eventually differ.</h2>
            <p className="measure">
              Most trade paperwork is assembled by copying figures between spreadsheets. The invoice
              says 1,280 pieces and the packing list says 1,180, and nobody notices while the
              documents are still on your desk.
            </p>
          </section>

          <section className="form-box w5">
            <BoxHead ordinal="02" caption="What it costs" />
            <h2>The correction costs far more than the typo.</h2>
            <p>
              Goods held at the border. A bank refusing the presentation. A buyer disputing the
              total. Each one is days of somebody’s week, spent on a discrepancy that was never a
              decision.
            </p>
          </section>

          <section className="form-box" id="how">
            <BoxHead ordinal="03" caption="Method" />
            <h2>Three steps, and the arithmetic stops being yours.</h2>
            <div className="form-grid">
              {steps.map((step) => (
                <div className="form-cell" key={step.n}>
                  <span className="form-ordinal">{step.n}</span>
                  <h3>{step.title}</h3>
                  <p>{step.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="form-box">
            <BoxHead ordinal="04" caption="What is prepared" />
            <h2>The documents a shipment actually needs.</h2>
            <div className="form-grid">
              {documents.map((document) => (
                <div className="form-cell" key={document.name}>
                  <document.icon size={22} aria-hidden="true" className="icon" />
                  <h3>{document.name}</h3>
                  <p>{document.detail}</p>
                </div>
              ))}
            </div>
            <p className="muted note">
              TradeDocs prepares these documents. It is not a customs broker, carrier, chamber of
              commerce or issuing authority, and it does not provide negotiable transport documents.
            </p>
          </section>

          <section className="form-box w7">
            <BoxHead ordinal="05" caption="Free tools" />
            <h2>Useful before you sign up.</h2>
            <p className="measure">
              The calculations that come up on the way to a shipment, free and without an account.
              Each one runs in your browser; nothing you type is sent to us.
            </p>
            <div className="form-grid tools">
              {tools.map((tool) => (
                <Link className="form-cell" href={tool.href} key={tool.href}>
                  <tool.icon size={20} aria-hidden="true" className="icon" />
                  <h3>{tool.name}</h3>
                  <p>{tool.detail}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="form-box w5" id="pricing">
            <BoxHead ordinal="06" caption="Price" />
            <p className="price-amount">£0</p>
            <h2 className="price-heading">Free while TradeDocs is early.</h2>
            <p>Paid plans will arrive later, with notice, and accounts created now keep working.</p>
            <ul className="checklist">
              {[
                'All five document types',
                'Unlimited shipments and documents',
                'Your whole team, with roles and invitations',
                'Reusable companies, customers and products',
              ].map((item) => (
                <li key={item}>
                  <Check size={17} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 24 }}>
              <LinkButton href="/sign-up" tone="accent" block>
                Create a free account <ArrowRight size={17} aria-hidden="true" />
              </LinkButton>
            </div>
          </section>

          <section className="form-box faq">
            <BoxHead ordinal="07" caption="Questions" />
            <h2>Before you sign up.</h2>
            {questions.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </section>
        </div>
      </div>

      <section className="section dark closing">
        <div className="inner">
          <h2>Stop reconciling your own paperwork.</h2>
          <div className="cta-row">
            <LinkButton href="/sign-up" tone="accent" className="large">
              Create a free account <ArrowRight size={18} aria-hidden="true" />
            </LinkButton>
          </div>
          {/*
            The one sentence this product is obliged to carry on every surface, made the
            thing the page is remembered by. A stamp is what a document gets when an
            authority has touched it. TradeDocs is not an authority, so its stamp says
            exactly that, and the constraint becomes the identity instead of fighting it.
          */}
          <p className="stamp">Prepared · not issued</p>
        </div>
      </section>
    </>
  );
}
