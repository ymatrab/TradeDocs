import Link from 'next/link';
import { ArrowRight, Check, Clock, Minus } from 'lucide-react';
import { LinkButton } from '@/components/primitives/button';
import { SectionPhoto } from '@/components/content/section-photo';
import { Line } from '@/components/shell/line';
import { RevealSection } from '@/components/shell/reveal';
import type { primaryAction } from '@/components/shell/public';
import { GUIDES } from '@/lib/content/guides';
import { HOME_PHOTOS } from '@/lib/content/home';
import { documentKindLabels } from '@/lib/labels';
import { SOURCES, type SourceId } from '@/lib/trade/sources';

type Action = ReturnType<typeof primaryAction>;

/*
 * The homepage sections added for search and conversion (owner ask, 2026-10-06). Each one
 * answers a question a buyer types, links to the page that answers it in full, and ends on
 * the capability-aware primary offer. Every product claim here is true of the code: the
 * three free generators exist, the delivery note is workspace-only, the certificate of
 * origin is not offered, and a person can hold several organizations.
 */

/** The three documents a visitor can make free today, each with the page that makes it. */
const templates = [
  {
    kind: 'commercial_invoice',
    plate: 'TD · CI',
    heading: 'Commercial invoice template, filled in once',
    answer:
      'The seller’s bill for goods sold and shipped, and the document customs in the importing country assesses duties and taxes from.',
    tool: { href: '/tools/invoice-generator', label: 'Commercial invoice generator' },
    guide: { href: '/guides/proforma-vs-commercial-invoice', label: 'What goes on it' },
  },
  {
    kind: 'proforma_invoice',
    plate: 'TD · PI',
    heading: 'Proforma invoice, before the sale',
    answer:
      'A quotation in invoice form, so the buyer can arrange payment, open a letter of credit or apply for an import licence.',
    tool: { href: '/tools/proforma-invoice-generator', label: 'Proforma invoice generator' },
    guide: { href: '/guides/proforma-vs-commercial-invoice', label: 'Proforma vs commercial' },
  },
  {
    kind: 'packing_list',
    plate: 'TD · PL',
    heading: 'Packing list that matches the invoice',
    answer:
      'What is in each package, with net and gross weights. Forwarders price the freight from it and customs checks the packages against it.',
    tool: { href: '/tools/packing-list-generator', label: 'Packing list generator' },
    guide: { href: '/guides/lcl-vs-fcl', label: 'LCL or FCL?' },
  },
] as const;

const TEMPLATE_SOURCES: readonly SourceId[] = [
  'trade-gov-commercial-invoice',
  'trade-gov-proforma-invoice',
  'trade-gov-packing-list',
];

export function TemplatesSection({ action }: { action: Action }) {
  return (
    <RevealSection className="section" id="documents" aria-labelledby="templates-title">
      <div className="photo-split">
        <div className="photo-split-text">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <p className="eyebrow">Commercial invoice generator</p>
            <h2 id="templates-title">
              <Line>Commercial invoice, proforma and packing list from one record.</Line>
            </h2>
            <p>
              A template is a blank page you retype for every shipment. TradeDocs fills all three
              documents from the same parties, goods and terms, so the quantities on the packing
              list are the quantities on the invoice.
            </p>
          </div>
          <ol className="doc-list">
            {templates.map((item) => (
              <li key={item.kind}>
                <span className="tag on-tape">{item.plate}</span>
                <div>
                  <h3>{item.heading}</h3>
                  <p>{item.answer}</p>
                  <p className="doc-list-links">
                    <Link className="text-link" href={item.tool.href}>
                      {item.tool.label}
                    </Link>
                    <span aria-hidden="true">·</span>
                    <Link className="text-link" href={item.guide.href}>
                      {item.guide.label}
                    </Link>
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <SectionPhoto photo={HOME_PHOTOS.desk} />
      </div>
      <div className="section-foot">
        <LinkButton href={action.href} className="large">
          {action.label} <ArrowRight size={18} aria-hidden="true" />
        </LinkButton>
        <p className="note">
          In the workspace the {documentKindLabels.delivery_note.toLowerCase()} comes from the same
          record. Descriptions follow the U.S. International Trade Administration’s export guidance:{' '}
          {TEMPLATE_SOURCES.map((id, index) => (
            <span key={id}>
              {index > 0 ? ', ' : null}
              <a className="text-link" href={SOURCES[id].url}>
                {SOURCES[id].title.replace('Export Documentation: ', '')}
              </a>
            </span>
          ))}
          .
        </p>
      </div>
    </RevealSection>
  );
}

/** A full-bleed hull band halfway down, for the visitor who is already convinced. */
export function CtaBand({ action }: { action: Action }) {
  return (
    <RevealSection className="section dark cta-band" aria-labelledby="band-title">
      <div className="photo-split reverse">
        <div className="photo-split-text">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <p className="eyebrow">From quote to delivery</p>
            <h2 id="band-title" className="display">
              <Line index={0}>Pack it once.</Line>{' '}
              <Line index={1}>
                List it <mark className="tape">once</mark>.
              </Line>
            </h2>
            <p>
              Save the shipment and the proforma, the commercial invoice, the packing list and the
              delivery note all come from it. Change a quantity and every document prepared after
              the change carries it.
            </p>
          </div>
          <div className="cta-row">
            <LinkButton href={action.href} className="large tape">
              {action.label} <ArrowRight size={18} aria-hidden="true" />
            </LinkButton>
            <LinkButton href="/pricing" tone="secondary" className="large">
              See pricing
            </LinkButton>
          </div>
        </div>
        <SectionPhoto photo={HOME_PHOTOS.warehouse} />
      </div>
    </RevealSection>
  );
}

const audiences = [
  {
    tag: 'Exporters',
    title: 'Exporters and manufacturers',
    detail:
      'Every shipment’s invoice, packing list and delivery note from your own company directory and product catalog, with HS codes and units saved once.',
    links: [
      { href: '/for/exporters', label: 'TradeDocs for exporters' },
      { href: '/tools/invoice-generator', label: 'Commercial invoice generator' },
      { href: '/tools/incoterms', label: 'Incoterms® 2020 guide' },
    ],
  },
  {
    tag: 'Importers',
    title: 'Importers and buyers',
    detail:
      'Work out what goods cost once delivered before you order, and read the Incoterms® rule your supplier quotes. TradeDocs does not file customs entries.',
    links: [
      { href: '/tools/landed-cost-calculator', label: 'Landed cost calculator' },
      { href: '/guides/dap-vs-ddp', label: 'DAP vs DDP' },
    ],
  },
  {
    tag: 'Forwarders',
    title: 'Freight forwarders and agents',
    detail:
      'Measure a consignment in cubic metres and chargeable weight before you quote, and point shippers to a packing list they can fill in themselves. It is not a booking or tracking system.',
    links: [
      { href: '/for/freight-forwarders', label: 'TradeDocs for forwarders' },
      { href: '/tools/cbm-calculator', label: 'CBM calculator' },
      { href: '/tools/chargeable-weight', label: 'Dimensional weight calculator' },
      { href: '/tools/container-loading-calculator', label: 'Container loading calculator' },
    ],
  },
  {
    tag: 'Consultants',
    title: 'Trade consultants and back offices',
    detail:
      'Keep each client in its own organization, with its own companies, products and teammates. You prepare the documents; the advice stays yours.',
    links: [
      { href: '/for/trade-consultants', label: 'TradeDocs for consultants' },
      { href: '/tools/proforma-invoice-generator', label: 'Proforma invoice generator' },
      { href: '/guides', label: 'Trade guides' },
    ],
  },
] as const;

export function AudienceSection({ action }: { action: Action }) {
  return (
    <RevealSection className="section" id="who" aria-labelledby="who-title">
      <div className="photo-split">
        <div className="photo-split-text">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <p className="eyebrow">Who it’s for</p>
            <h2 id="who-title">
              <Line>For the people who prepare the paperwork.</Line>
            </h2>
            <p>
              TradeDocs is built for whoever types the shipment up: the exporter’s own team, or the
              consultant doing it for them. Importers and forwarders use the free tools.
            </p>
          </div>
        </div>
        <SectionPhoto photo={HOME_PHOTOS.port} ratio={3 / 2} />
      </div>
      <div className="cards four audience">
        {audiences.map((item) => (
          <article className="card wipe" key={item.tag}>
            <span className="tag">{item.tag}</span>
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
            <ul className="card-links" aria-label={`Start with, for ${item.tag.toLowerCase()}`}>
              {item.links.map((link) => (
                <li key={link.href}>
                  <Link className="text-link" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <div className="section-foot">
        <LinkButton href={action.href} className="large">
          {action.label} <ArrowRight size={18} aria-hidden="true" />
        </LinkButton>
      </div>
    </RevealSection>
  );
}

type Coverage = 'prepares' | 'not-yet' | 'outside';

/**
 * The documents a shipment commonly involves, and which of them TradeDocs prepares. The
 * "who" column is a description of the trade's roles, not of any rule; the note says the
 * actual set depends on the goods, the route and the countries.
 */
const checklist: {
  name: string;
  purpose: string;
  who: string;
  coverage: Coverage;
  status: string;
  href?: string;
}[] = [
  {
    name: documentKindLabels.proforma_invoice,
    purpose: 'The quotation before the sale, for payment, a letter of credit or a licence.',
    who: 'Seller',
    coverage: 'prepares',
    status: 'Free generator and workspace',
    href: '/tools/proforma-invoice-generator',
  },
  {
    name: documentKindLabels.commercial_invoice,
    purpose: 'Bills the goods; customs values the shipment from it.',
    who: 'Seller',
    coverage: 'prepares',
    status: 'Free generator and workspace',
    href: '/tools/invoice-generator',
  },
  {
    name: documentKindLabels.packing_list,
    purpose: 'Packages, quantities and weights, matched to the invoice.',
    who: 'Seller',
    coverage: 'prepares',
    status: 'Free generator and workspace',
    href: '/tools/packing-list-generator',
  },
  {
    name: documentKindLabels.delivery_note,
    purpose: 'What is handed over, line for line.',
    who: 'Seller',
    coverage: 'prepares',
    status: 'Workspace',
  },
  {
    name: 'Certificate of origin',
    purpose: 'States where the goods were produced, where a buyer or route asks for it.',
    who: 'Exporter, certified by a chamber or authority',
    coverage: 'not-yet',
    status: 'Not offered: awaiting legal review',
  },
  {
    name: 'Bill of lading or air waybill',
    purpose: 'The transport document for the goods carried.',
    who: 'Carrier or forwarder',
    coverage: 'outside',
    status: 'Not prepared by TradeDocs',
  },
  {
    name: 'Export or import declaration',
    purpose: 'The customs filing for the goods leaving or entering.',
    who: 'Exporter, importer or their customs broker',
    coverage: 'outside',
    status: 'Not filed by TradeDocs',
  },
];

const coverageIcon = { prepares: Check, 'not-yet': Clock, outside: Minus } as const;

export function ChecklistSection({ action }: { action: Action }) {
  return (
    <RevealSection className="section sunken" id="checklist" aria-labelledby="checklist-title">
      <div className="photo-split">
        <div className="photo-split-text">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <p className="eyebrow">Export document checklist</p>
            <h2 id="checklist-title">
              <Line>What a shipment usually needs, and what TradeDocs prepares.</Line>
            </h2>
            <p>
              Most export shipments travel with a commercial invoice and a packing list, often after
              a proforma invoice. Transport and customs documents come from the carrier and the
              customs filing, not from TradeDocs.
            </p>
          </div>
        </div>
        <SectionPhoto photo={HOME_PHOTOS.truck} ratio={3 / 2} />
      </div>
      <ol className="checklist" aria-label="Export documents and who prepares them">
        {checklist.map((row) => {
          const Icon = coverageIcon[row.coverage];
          return (
            <li key={row.name} className={`checklist-row ${row.coverage}`}>
              <Icon size={18} aria-hidden="true" className="checklist-icon" />
              <div className="checklist-name">
                <h3>
                  {row.href ? (
                    <Link className="text-link" href={row.href}>
                      {row.name}
                    </Link>
                  ) : (
                    row.name
                  )}
                </h3>
                <p>{row.purpose}</p>
              </div>
              <p className="checklist-who">
                <span className="caption">Usually from</span>
                {row.who}
              </p>
              <p className="checklist-status">
                <span className="caption">TradeDocs</span>
                {row.status}
              </p>
            </li>
          );
        })}
      </ol>
      <p className="note measure">
        A general orientation, not legal or customs advice. The documents a shipment needs depend on
        the goods, the route and the countries involved; confirm them with your buyer, your
        forwarder or the customs authority.
      </p>
      <div className="section-foot">
        <LinkButton href={action.href} className="large">
          {action.label} <ArrowRight size={18} aria-hidden="true" />
        </LinkButton>
      </div>
    </RevealSection>
  );
}

/** Links into the reading, generated from the guides themselves so none is left out. */
export function ReadingLinks() {
  return (
    <div className="reading">
      <div className="reading-head">
        <h3 id="reading-title">Read before you ship</h3>
        <p className="reading-all">
          <Link className="text-link" href="/guides">
            All guides
          </Link>
          <span aria-hidden="true">·</span>
          <Link className="text-link" href="/blog">
            Blog
          </Link>
        </p>
      </div>
      <ul className="reading-list">
        {GUIDES.map((guide) => (
          <li key={guide.slug}>
            <Link className="card lift" href={`/guides/${guide.slug}`}>
              <span className="tag">Guide</span>
              <span className="reading-title">{guide.title}</span>
              <span className="card-cta">
                Read <ArrowRight size={15} aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
