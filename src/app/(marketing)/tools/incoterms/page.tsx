import type { Metadata } from 'next';
import Link from 'next/link';
import { LinkButton } from '@/components/primitives/button';
import { Callout } from '@/components/primitives/feedback';
import { DataTable } from '@/components/primitives/table';
import { INCOTERMS, INCOTERMS_DISCLAIMER } from '@/lib/trade/incoterms';

export const metadata: Metadata = {
  title: 'Incoterms 2020 explained — all eleven rules',
  description:
    'Where risk passes, who pays for carriage, who clears customs and who insures, for every Incoterms 2020 rule. Plain language, with the trap in each one named.',
  alternates: { canonical: '/tools/incoterms' },
};

const faq = [
  {
    q: 'What changed between Incoterms 2010 and 2020?',
    a: 'DAT became DPU, widening it from a terminal to any place where the seller unloads. CIP insurance rose to all-risks cover, while CIF stayed at minimum cover. FCA gained an option obliging the carrier to issue an on-board bill of lading, which letters of credit often demand.',
  },
  {
    q: 'Which Incoterm should I use for containers?',
    a: 'FCA, CPT or CIP, depending on how far you want to carry the cost. The four maritime rules — FAS, FOB, CFR and CIF — assume the seller controls the goods until they are alongside or on board, which is not what happens when a container is surrendered to a terminal days ahead of loading.',
  },
  {
    q: 'What is the difference between CIF and CIP?',
    a: 'CIF is sea only and requires minimum insurance cover; CIP works for any transport mode and, since the 2020 revision, requires all-risks cover. Risk passes at origin under both, even though the seller pays carriage to the destination.',
  },
  {
    q: 'Do Incoterms say who owns the goods?',
    a: 'No. They allocate cost, risk and the obligations around delivery, export and import. Title, payment terms and the law that governs the contract are all separate matters your sales contract has to settle on its own.',
  },
];

export default function IncotermsPage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Free reference</p>
        <h1>Incoterms 2020, explained</h1>
        <p className="lede">
          Eleven rules that decide who pays for what, who carries the risk, and who deals with
          customs. Here is each one in a sentence, with the mistake it most often causes.
        </p>
      </section>

      <section className="section">
        <DataTable caption="The eleven Incoterms 2020 rules compared">
          <thead>
            <tr>
              <th scope="col">Rule</th>
              <th scope="col">Mode</th>
              <th scope="col">Risk passes</th>
              <th scope="col">Export</th>
              <th scope="col">Import</th>
            </tr>
          </thead>
          <tbody>
            {INCOTERMS.map((term) => (
              <tr key={term.code}>
                <td>
                  <Link className="text-link" href={`/tools/incoterms/${term.code.toLowerCase()}`}>
                    <span className="data">{term.code}</span> — {term.name}
                  </Link>
                </td>
                <td>{term.mode === 'sea' ? 'Sea and inland waterway' : 'Any mode'}</td>
                <td>{term.riskPasses}</td>
                <td>{term.exportClearance === 'seller' ? 'Seller' : 'Buyer'}</td>
                <td>{term.importClearance === 'seller' ? 'Seller' : 'Buyer'}</td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </section>

      <section className="section">
        <h2>Questions people ask</h2>
        <div className="faq">
          {faq.map((entry) => (
            <details key={entry.q}>
              <summary>{entry.q}</summary>
              <p>{entry.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section">
        <Callout tone="legal" title="What this page is">
          {INCOTERMS_DISCLAIMER}
        </Callout>
      </section>

      <section className="section">
        <h2>On the document itself</h2>
        <p className="measure">
          The rule you agree has to appear on the invoice, with the named place beside it — “FCA
          Rotterdam” means something; “FCA” alone does not. TradeDocs carries the term and its place
          on every document generated from a shipment, so the set cannot state two different
          answers.
        </p>
        <div className="cta-row">
          <LinkButton href="/sign-up">Create a free account</LinkButton>
          <Link className="text-link" href="/tools">
            All trade tools
          </Link>
        </div>
      </section>
    </>
  );
}
