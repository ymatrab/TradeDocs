import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeftRight,
  BookOpen,
  Box,
  Boxes,
  Calculator,
  Coins,
  FileText,
  Handshake,
  Layers,
  Package,
  Ruler,
  Scale,
  Search,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from 'lucide-react';
import { ToolsHubJsonLd } from '@/components/seo/json-ld';
import { GUIDES } from '@/lib/content/guides';
import { cslApiKey } from '@/lib/screening/config';
import { listedTools } from '@/lib/seo/site';
import { openGraphFor } from '@/lib/seo/social';

export const metadata: Metadata = {
  title: 'Free trade tools — document generators and shipping calculators',
  description:
    'Free tools for people who ship: commercial invoice, proforma invoice, packing list and delivery note generators, CBM, dimensional weight, container loading, pallet, landed cost and export price calculators, CBM and kg converters, an HS code lookup and a guide to all eleven Incoterms 2020 rules.',
  alternates: { canonical: '/tools' },
  openGraph: openGraphFor(
    'Free trade tools: document generators, calculators and Incoterms',
    'Commercial invoice, proforma and packing list generators, CBM, dimensional weight and landed cost calculators, and a guide to all eleven Incoterms 2020 rules.',
    '/tools',
  ),
};

/** The icon beside each tool. The names and summaries come from the shared tool list. */
const ICONS: Record<string, LucideIcon> = {
  '/tools/invoice-generator': FileText,
  '/tools/proforma-invoice-generator': FileText,
  '/tools/packing-list-generator': Boxes,
  '/tools/delivery-note-generator': Truck,
  '/tools/cbm-calculator': Box,
  '/tools/chargeable-weight': Scale,
  '/tools/container-loading-calculator': Package,
  '/tools/unit-converter': ArrowLeftRight,
  '/tools/cbm-to-cubic-feet': Ruler,
  '/tools/pallet-calculator': Layers,
  '/tools/landed-cost-calculator': Calculator,
  '/tools/export-price-calculator': Coins,
  '/tools/hs-code-lookup': Search,
  '/tools/denied-party-screening': ShieldCheck,
  '/tools/incoterms': Handshake,
};

export default function ToolsPage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Free, no account needed</p>
        <h1>Trade tools</h1>
        <p className="lede">
          The documents, calculations and references that come up before a shipment is booked. The
          calculators run in your browser; the generators send your details once to render the PDF.
          Nothing you type about a consignment is stored.
        </p>
      </section>

      <section className="section">
        <div className="form-grid">
          {listedTools(cslApiKey() !== null).map((tool) => {
            const Icon = ICONS[tool.path] ?? FileText;
            return (
              <Link key={tool.path} href={tool.path} className="form-cell">
                <Icon size={22} aria-hidden="true" className="icon" />
                <h2>{tool.name}</h2>
                <p>{tool.summary}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="section" aria-labelledby="guides-title">
        <h2 id="guides-title">Guides</h2>
        <div className="form-grid">
          {GUIDES.slice(0, 6).map((guide) => (
            <Link key={guide.slug} href={`/guides/${guide.slug}`} className="form-cell">
              <BookOpen size={22} aria-hidden="true" className="icon" />
              <h3>{guide.title}</h3>
              <p>{guide.description}</p>
            </Link>
          ))}
        </div>
        <p>
          <Link className="text-link" href="/guides">
            All {GUIDES.length} guides
          </Link>{' '}
          ·{' '}
          <Link className="text-link" href="/blog">
            The blog
          </Link>{' '}
          ·{' '}
          <Link className="text-link" href="/glossary">
            Glossary of shipping terms
          </Link>
        </p>
      </section>

      <section className="section">
        <h2>Why these are free</h2>
        <p className="measure">
          They are the questions people search for on the way to a bigger problem: a set of trade
          documents that has to agree with itself. If the calculators are useful on their own, good.
          If they show you that we know the work, better.
        </p>
      </section>
      <ToolsHubJsonLd />
    </>
  );
}
