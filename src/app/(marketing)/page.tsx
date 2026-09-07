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

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="inner">
          <div>
            <p className="section-label">Shipment workspace</p>
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

          <div className="doc-stack" aria-hidden="true">
            <div className="doc-sheet accent">
              <div className="doc-sheet-head">
                <span className="doc-sheet-title">Commercial invoice</span>
                <span className="data" style={{ fontSize: 12 }}>
                  CI-2026-0184
                </span>
              </div>
              <div className="doc-line tied">
                <span className="label">Total quantity</span>
                <span className="value">1,280 pcs</span>
              </div>
              <div className="doc-line tied">
                <span className="label">Net weight</span>
                <span className="value">4,476.50 kg</span>
              </div>
              <div className="doc-line">
                <span className="label">Invoice value</span>
                <span className="value">20,740.75 EUR</span>
              </div>
            </div>
            <div className="doc-sheet">
              <div className="doc-sheet-head">
                <span className="doc-sheet-title">Packing list</span>
                <span className="data" style={{ fontSize: 12 }}>
                  PL-2026-0184
                </span>
              </div>
              <div className="doc-line tied">
                <span className="label">Total quantity</span>
                <span className="value">1,280 pcs</span>
              </div>
              <div className="doc-line tied">
                <span className="label">Net weight</span>
                <span className="value">4,476.50 kg</span>
              </div>
            </div>
            <div className="doc-sheet">
              <div className="doc-sheet-head">
                <span className="doc-sheet-title">Delivery note</span>
                <span className="data" style={{ fontSize: 12 }}>
                  DN-2026-0184
                </span>
              </div>
              <div className="doc-line tied">
                <span className="label">Total quantity</span>
                <span className="value">1,280 pcs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section dark">
        <div className="inner">
          <p className="section-label">The problem</p>
          <h2 style={{ maxWidth: '20ch', fontSize: 'clamp(26px, 3.4vw, 40px)' }}>
            One number typed twice is one number that will eventually differ.
          </h2>
          <p className="muted measure" style={{ marginTop: 16, fontSize: 17 }}>
            Most trade paperwork is assembled by copying figures between spreadsheets. The invoice
            says 1,280 pieces and the packing list says 1,180, and nobody notices until the goods
            are held, the bank refuses the presentation, or the buyer disputes the total. The
            correction costs far more than the typo.
          </p>
        </div>
      </section>

      <section className="section" id="how">
        <div className="inner">
          <p className="section-label">How it works</p>
          <h2 style={{ marginBottom: 32 }}>Three steps, and the arithmetic stops being yours.</h2>
          <div className="grid-3">
            <div className="step">
              <span className="n">STEP 01</span>
              <h3>Record your parties and products</h3>
              <p>
                Your company, your customers and the goods you ship, entered once and reused. Change
                an address and every future document uses it.
              </p>
            </div>
            <div className="step">
              <span className="n">STEP 02</span>
              <h3>Build the shipment</h3>
              <p>
                Pick the buyer, add line items with quantities, weights and values, and set the
                incoterm and route. Totals are calculated, not typed.
              </p>
            </div>
            <div className="step">
              <span className="n">STEP 03</span>
              <h3>Generate the document set</h3>
              <p>
                Every document is rendered from the same shipment revision, so they cannot disagree.
                Download them as PDFs and send them on.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section tinted">
        <div className="inner">
          <p className="section-label">What you get</p>
          <h2 style={{ marginBottom: 32 }}>The documents a shipment actually needs.</h2>
          <div className="grid-3">
            {documents.map((document) => (
              <article className="doc-card" key={document.name}>
                <document.icon size={22} aria-hidden="true" className="icon" />
                <h3>{document.name}</h3>
                <p>{document.detail}</p>
              </article>
            ))}
          </div>
          <p className="muted" style={{ marginTop: 24, fontSize: 14, maxWidth: '70ch' }}>
            TradeDocs prepares these documents. It is not a customs broker, carrier, chamber of
            commerce or issuing authority, and it does not provide negotiable transport documents.
          </p>
        </div>
      </section>

      <section className="section" id="pricing">
        <div className="inner">
          <p className="section-label">Pricing</p>
          <h2 style={{ marginBottom: 32 }}>Free while TradeDocs is early.</h2>
          <div className="price-card">
            <p className="caption" style={{ marginBottom: 8 }}>
              Everything, no limits
            </p>
            <p className="price-amount">£0</p>
            <p className="muted" style={{ marginTop: 8, marginBottom: 0 }}>
              While the product is young, it is free to use. Paid plans will arrive later, with
              notice, and accounts created now keep working.
            </p>
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
            <div style={{ marginTop: 28 }}>
              <LinkButton href="/sign-up" tone="accent" block>
                Create a free account <ArrowRight size={17} aria-hidden="true" />
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      <section className="section tinted faq">
        <div className="inner" style={{ maxWidth: 860 }}>
          <p className="section-label">Questions</p>
          <h2 style={{ marginBottom: 8 }}>Before you sign up.</h2>
          {questions.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section dark">
        <div className="inner" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(26px, 3.4vw, 40px)', maxWidth: '24ch', margin: '0 auto' }}>
            Stop reconciling your own paperwork.
          </h2>
          <div className="cta-row" style={{ justifyContent: 'center' }}>
            <LinkButton href="/sign-up" tone="accent" className="large">
              Create a free account <ArrowRight size={18} aria-hidden="true" />
            </LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
