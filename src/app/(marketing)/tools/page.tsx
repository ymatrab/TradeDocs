import type { Metadata } from 'next';
import Link from 'next/link';
import { Box, FileText, Scale, Handshake } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free trade tools — CBM, chargeable weight and Incoterms',
  description:
    'Calculators and references for people who ship: cubic metres, volumetric versus actual weight, and a plain-language guide to all eleven Incoterms 2020 rules.',
  alternates: { canonical: '/tools' },
};

const tools = [
  {
    icon: FileText,
    href: '/tools/invoice-generator',
    name: 'Commercial invoice generator',
    detail:
      'Fill in a commercial invoice, proforma or packing list and download the PDF. No account, no watermark, nothing stored.',
  },
  {
    icon: Box,
    href: '/tools/cbm-calculator',
    name: 'CBM calculator',
    detail:
      'Cubic metres from carton dimensions, in any unit, with a check against 20ft, 40ft and high-cube containers.',
  },
  {
    icon: Scale,
    href: '/tools/chargeable-weight',
    name: 'Chargeable weight calculator',
    detail:
      'Volumetric against actual weight for air, express, road groupage and sea LCL — and which one you will be billed on.',
  },
  {
    icon: Handshake,
    href: '/tools/incoterms',
    name: 'Incoterms 2020 guide',
    detail:
      'All eleven rules in plain language: where risk passes, who pays what, who clears customs, and the traps in each.',
  },
];

export default function ToolsPage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Free, no account needed</p>
        <h1>Trade tools</h1>
        <p className="lede">
          The calculations and references that come up before a shipment is booked. Each one runs in
          your browser: nothing you type about a consignment is sent to us or stored.
        </p>
      </section>

      <section className="section">
        <div className="form-grid">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="form-cell">
              <tool.icon size={22} aria-hidden="true" className="icon" />
              <h2>{tool.name}</h2>
              <p>{tool.detail}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Why these are free</h2>
        <p className="measure">
          They are the questions people search for on the way to a bigger problem: a set of trade
          documents that has to agree with itself. If the calculators are useful on their own, good.
          If they show you that we know the work, better.
        </p>
      </section>
    </>
  );
}
