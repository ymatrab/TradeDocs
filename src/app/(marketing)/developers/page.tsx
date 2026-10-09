import type { Metadata } from 'next';
import Link from 'next/link';
import { Callout } from '@/components/primitives/feedback';
import { DataTable } from '@/components/primitives/table';
import { API_DOCUMENT_KINDS } from '@/lib/api/schemas';
import { API_POLICIES, apiConfig } from '@/lib/api/server';
import { featurePlans, PLAN_NAMES } from '@/lib/billing/plans';
import { regulatedDocumentsEnabled } from '@/lib/config/server';
import { getPublicBaseUrl } from '@/lib/http/base-url';
import { documentKindLabel } from '@/lib/labels';
import { API_MAX_LINES, API_PAGE_SIZE, MAX_ACTIVE_API_KEYS } from '@/lib/limits';
import { openGraphFor } from '@/lib/seo/social';
import { isRegulatedDocumentKind } from '@/lib/trade/regulated';

// The examples name this deployment's own origin, and whether regulated kinds are on is read
// from its environment, so the page is resolved per request.
export const dynamic = 'force-dynamic';

const METADATA: Metadata = {
  title: 'TradeDocs REST API v1 — shipments, documents and PDFs',
  description:
    'Reference for the TradeDocs REST API: authenticate with an organization API key, list and create shipments, generate export documents and download their PDFs.',
  alternates: { canonical: '/developers' },
  openGraph: openGraphFor(
    'TradeDocs REST API v1',
    'Shipments, document generation and PDFs over HTTPS with an organization API key.',
    '/developers',
  ),
};

/** Indexed only while the API can answer; otherwise the reference says it is not open yet. */
export function generateMetadata(): Metadata {
  return apiConfig() === null
    ? { ...METADATA, robots: { index: false, follow: true } }
    : METADATA;
}

/** A placeholder in the documented key format; it is not, and never was, a real key. */
const PLACEHOLDER_KEY = 'tdk_YOUR_API_KEY';

function Example({ label, children }: { label: string; children: string }) {
  return (
    <pre className="code-block" tabIndex={0} aria-label={label}>
      <code>{children}</code>
    </pre>
  );
}

const ERRORS: { status: number; code: string; meaning: string }[] = [
  { status: 400, code: 'INVALID_QUERY', meaning: 'limit or cursor is malformed.' },
  { status: 400, code: 'INVALID_JSON', meaning: 'The body is not valid JSON.' },
  {
    status: 400,
    code: 'INVALID_IDEMPOTENCY_KEY',
    meaning: 'The Idempotency-Key header has characters other than letters, digits and . _ : -',
  },
  { status: 401, code: 'MISSING_API_KEY', meaning: 'No Authorization header was sent.' },
  {
    status: 401,
    code: 'INVALID_API_KEY',
    meaning:
      'The key is unknown or revoked, or the person who created it is no longer an owner or administrator.',
  },
  { status: 403, code: 'PLAN_REQUIRED', meaning: 'The organization is not on the Team plan.' },
  {
    status: 403,
    code: 'FEATURE_UNAVAILABLE',
    meaning: 'That document kind is not available yet (see Document kinds).',
  },
  {
    status: 404,
    code: 'NOT_FOUND',
    meaning: 'No such shipment or document in the key’s organization.',
  },
  { status: 409, code: 'CONFLICT', meaning: 'A shipment with that reference already exists.' },
  {
    status: 409,
    code: 'IDEMPOTENCY_CONFLICT',
    meaning: 'The Idempotency-Key was already used with a different request.',
  },
  { status: 413, code: 'BODY_TOO_LARGE', meaning: 'The body is over the size limit.' },
  { status: 415, code: 'UNSUPPORTED_MEDIA_TYPE', meaning: 'Send Content-Type: application/json.' },
  {
    status: 422,
    code: 'VALIDATION_FAILED',
    meaning: 'A field is invalid; details lists each field and why.',
  },
  {
    status: 422,
    code: 'NO_LINES',
    meaning: 'The shipment has no lines, so no document can be generated from it.',
  },
  {
    status: 429,
    code: 'RATE_LIMITED',
    meaning: 'Too many requests; wait for the Retry-After seconds.',
  },
  {
    status: 503,
    code: 'API_UNAVAILABLE, SERVICE_UNAVAILABLE, BRANDING_UNAVAILABLE',
    meaning: 'Temporarily unavailable; retry after Retry-After.',
  },
];

/**
 * The public API reference (D-025). It describes exactly what src/app/api/v1 does; the
 * limits, plan and document kinds are read from the modules the API itself enforces, so the
 * page cannot drift from the code.
 */
export default function DevelopersPage() {
  const base = `${getPublicBaseUrl()}/api/v1`;
  const plans = featurePlans('api').map((plan) => PLAN_NAMES[plan]);
  const regulatedOn = regulatedDocumentsEnabled();
  const perKey = API_POLICIES.perKey;
  const writes = API_POLICIES.writesPerKey;
  const available = apiConfig() !== null;

  return (
    <>
      <section className="hero">
        <p className="eyebrow">Developers</p>
        <h1>TradeDocs REST API, version 1</h1>
        {available ? null : (
          <Callout tone="warning" title="The API is not open on this deployment yet" level={2}>
            This is the reference for the API as built. Requests answer 503 until it is switched
            on, and no API keys can be created before then.
          </Callout>
        )}
        <p className="lede">
          Create shipments from your own systems, generate commercial invoices, packing lists and
          the other documents from them, and download the PDFs, over HTTPS with an organization API
          key. The API is part of the {plans.join(' and ')} plan.
        </p>
      </section>

      <section className="section" aria-labelledby="overview">
        <h2 id="overview">Overview</h2>
        <ul>
          <li>
            Base URL: <span className="data">{base}</span>. Everything is JSON except the PDF
            download.
          </li>
          <li>
            A key belongs to one organization and only ever sees that organization’s shipments and
            documents. Another organization’s ids answer 404.
          </li>
          <li>
            Documents are generated exactly as in the app: numbered, locked to the shipment revision
            they came from, and replacing the previous final document of the same kind. They are
            documents you prepare; TradeDocs does not issue or certify them on behalf of any
            authority.
          </li>
          <li>
            Version 1 does not change or delete shipments, add lines to an existing shipment, void
            documents or send webhooks. Do those in the app.
          </li>
        </ul>
      </section>

      <section className="section" aria-labelledby="authentication">
        <h2 id="authentication">Authentication</h2>
        <p>
          An owner or administrator creates keys in the organization’s{' '}
          <strong>Settings → API keys</strong>. The key is shown once; TradeDocs keeps only a hash
          of it, so a lost key cannot be recovered: revoke it and create another. Up to{' '}
          {MAX_ACTIVE_API_KEYS} keys can be active at once. A key acts with the rights of the person
          who created it and stops working if they leave the organization or stop being an owner or
          administrator, or if the organization leaves the Team plan.
        </p>
        <p>Send the key as a bearer token on every request:</p>
        <Example label="Authorization header example">{`curl ${base}/shipments \\
  -H "Authorization: Bearer ${PLACEHOLDER_KEY}"`}</Example>
        <p>Keep keys on your server. Never put one in a web page, a mobile app or a repository.</p>
      </section>

      <section className="section" aria-labelledby="conventions">
        <h2 id="conventions">Conventions</h2>
        <h3>Rate limits</h3>
        <p>
          {perKey.limit} requests per minute per key, of which at most {writes.limit} may be POSTs.
          Over the limit the API answers 429 with Retry-After. Responses carry RateLimit-Limit and
          RateLimit-Remaining.
        </p>
        <h3>Pagination</h3>
        <p>
          Lists return <span className="data">{'{ "data": [...], "next_cursor": "…" }'}</span>,
          newest first. Pass <span className="data">?limit=</span> (1 to {API_PAGE_SIZE.max},
          default {API_PAGE_SIZE.default}) and, for the next page,{' '}
          <span className="data">?cursor=</span> with the previous{' '}
          <span className="data">next_cursor</span>. The last page has{' '}
          <span className="data">next_cursor: null</span>.
        </p>
        <h3>Idempotency</h3>
        <p>
          Every POST accepts an <span className="data">Idempotency-Key</span> header (1 to 255
          letters, digits and <span className="data">. _ : -</span>). Repeating a request with the
          same key and body within 24 hours returns the first response with status 200 and{' '}
          <span className="data">Idempotent-Replayed: true</span>, without creating anything again.
          The same key with a different body is a 409. Use one, such as a UUID, whenever you might
          retry.
        </p>
        <h3>Numbers</h3>
        <p>
          Quantities, prices and weights are returned as decimal strings, such as{' '}
          <span className="data">&quot;12.500&quot;</span>, so no digit is lost. Send them as
          strings (preferred) or JSON numbers.
        </p>
        <h3>Errors</h3>
        <p>Every error has the same shape:</p>
        <Example label="Error response example">{`{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Check the submitted fields and try again.",
    "details": [{ "field": "items.0.quantity", "message": "Enter the quantity." }]
  }
}`}</Example>
        <DataTable caption="Error codes" density="compact">
          <thead>
            <tr>
              <th scope="col">Status</th>
              <th scope="col">Code</th>
              <th scope="col">Meaning</th>
            </tr>
          </thead>
          <tbody>
            {ERRORS.map((row) => (
              <tr key={`${row.status}-${row.code}`}>
                <td className="data">{row.status}</td>
                <td className="data">{row.code}</td>
                <td>{row.meaning}</td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </section>

      <section className="section" aria-labelledby="endpoints">
        <h2 id="endpoints">Endpoints</h2>

        <h3 id="list-shipments">List shipments</h3>
        <p>
          <span className="data">GET /api/v1/shipments</span>: the organization’s shipments, newest
          first, without lines.
        </p>
        <Example label="List shipments example">{`curl "${base}/shipments?limit=25" \\
  -H "Authorization: Bearer ${PLACEHOLDER_KEY}"`}</Example>

        <h3 id="create-shipment">Create a shipment</h3>
        <p>
          <span className="data">POST /api/v1/shipments</span> answers 201 with the shipment and its
          lines. Only <span className="data">reference</span> (up to 60 characters, unique in the
          organization) is required. Optional: <span className="data">currency</span> (ISO 4217; the
          organization’s default otherwise), <span className="data">incoterm</span> with{' '}
          <span className="data">incoterm_place</span>,{' '}
          <span className="data">port_of_loading</span>,{' '}
          <span className="data">port_of_discharge</span>,{' '}
          <span className="data">country_of_origin</span>,{' '}
          <span className="data">country_of_destination</span> (two-letter codes),{' '}
          <span className="data">shipped_on</span>,{' '}
          <span className="data">proforma_valid_until</span> (YYYY-MM-DD),{' '}
          <span className="data">buyer_reference</span>,{' '}
          <span className="data">marks_and_numbers</span>, the party ids{' '}
          <span className="data">exporter_id</span>, <span className="data">consignee_id</span>,{' '}
          <span className="data">notify_id</span> (companies in your directory), and up to{' '}
          {API_MAX_LINES} <span className="data">items</span>, each with{' '}
          <span className="data">description</span> and <span className="data">quantity</span> and
          optionally <span className="data">unit</span> (default pcs),{' '}
          <span className="data">unit_price</span>, <span className="data">hs_code</span>,{' '}
          <span className="data">country_of_origin</span>,{' '}
          <span className="data">net_weight_kg</span>, <span className="data">gross_weight_kg</span>{' '}
          and <span className="data">package_count</span>. Unknown fields are refused.
        </p>
        <Example label="Create a shipment example">{`curl ${base}/shipments \\
  -X POST \\
  -H "Authorization: Bearer ${PLACEHOLDER_KEY}" \\
  -H "Content-Type: application/json" \\
  -H "Idempotency-Key: $(uuidgen)" \\
  -d '{
    "reference": "PO-10042",
    "currency": "EUR",
    "incoterm": "FCA",
    "incoterm_place": "Rotterdam",
    "country_of_destination": "US",
    "items": [
      { "description": "Stainless steel valves", "hs_code": "848180",
        "quantity": "120", "unit": "pcs", "unit_price": "14.50",
        "net_weight_kg": "96.000", "gross_weight_kg": "104.500" }
    ]
  }'`}</Example>

        <h3 id="get-shipment">Get a shipment</h3>
        <p>
          <span className="data">GET /api/v1/shipments/{'{id}'}</span>: one shipment with its lines.
        </p>
        <Example label="Get a shipment example">{`curl ${base}/shipments/SHIPMENT_ID \\
  -H "Authorization: Bearer ${PLACEHOLDER_KEY}"`}</Example>

        <h3 id="list-documents">List a shipment’s documents</h3>
        <p>
          <span className="data">GET /api/v1/shipments/{'{id}'}/documents</span>: every document
          generated from the shipment, newest first, with its number, kind, status (final,
          superseded or void) and the shipment revision it came from.
        </p>
        <Example label="List documents example">{`curl ${base}/shipments/SHIPMENT_ID/documents \\
  -H "Authorization: Bearer ${PLACEHOLDER_KEY}"`}</Example>

        <h3 id="generate-document">Generate a document</h3>
        <p>
          <span className="data">POST /api/v1/shipments/{'{id}'}/documents</span> with{' '}
          <span className="data">{'{ "kind": "…" }'}</span> answers 201 with the new document. The
          shipment needs at least one line.
        </p>
        <Example label="Generate a document example">{`curl ${base}/shipments/SHIPMENT_ID/documents \\
  -X POST \\
  -H "Authorization: Bearer ${PLACEHOLDER_KEY}" \\
  -H "Content-Type: application/json" \\
  -H "Idempotency-Key: $(uuidgen)" \\
  -d '{ "kind": "commercial_invoice" }'`}</Example>

        <h3 id="download-pdf">Download a document’s PDF</h3>
        <p>
          <span className="data">GET /api/v1/documents/{'{id}'}/pdf</span> streams the PDF
          (application/pdf), drawn from the snapshot recorded when the document was generated, so it
          shows the document as it was issued.
        </p>
        <Example label="Download a PDF example">{`curl ${base}/documents/DOCUMENT_ID/pdf \\
  -H "Authorization: Bearer ${PLACEHOLDER_KEY}" \\
  -o invoice.pdf`}</Example>
      </section>

      <section className="section" aria-labelledby="kinds">
        <h2 id="kinds">Document kinds</h2>
        <DataTable caption="Document kinds the API accepts" density="compact">
          <thead>
            <tr>
              <th scope="col">kind</th>
              <th scope="col">Document</th>
              <th scope="col">Available</th>
            </tr>
          </thead>
          <tbody>
            {API_DOCUMENT_KINDS.map((kind) => {
              // A regulated kind is never generated through the API: with its review gate on
              // it is generated in the workspace only (D-025).
              const regulated = isRegulatedDocumentKind(kind);
              return (
                <tr key={kind}>
                  <td className="data">{kind}</td>
                  <td>{documentKindLabel(kind)}</td>
                  <td>
                    {!regulated
                      ? 'Yes'
                      : regulatedOn
                        ? 'In the workspace only (403 FEATURE_UNAVAILABLE)'
                        : 'Not yet: pending legal and regulatory review (403 FEATURE_UNAVAILABLE)'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </DataTable>
      </section>

      <section className="section" aria-labelledby="help">
        <h2 id="help">Questions</h2>
        <p>
          See{' '}
          <Link className="text-link" href="/pricing">
            pricing
          </Link>{' '}
          for the plans, or{' '}
          <Link className="text-link" href="/contact">
            contact us
          </Link>{' '}
          about the API.
        </p>
      </section>
    </>
  );
}
