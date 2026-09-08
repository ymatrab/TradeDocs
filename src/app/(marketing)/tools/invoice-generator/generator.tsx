'use client';

import { useState } from 'react';
import { Download, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/primitives/button';
import { Field, Input, Select } from '@/components/primitives/form';
import { Callout, Panel } from '@/components/primitives/feedback';
import { decimal } from '@/lib/format';

type Line = {
  key: number;
  description: string;
  hs_code: string;
  country_of_origin: string;
  quantity: string;
  unit: string;
  unit_price: string;
  net_weight_kg: string;
  package_count: string;
};

type Party = {
  name: string;
  address_line1: string;
  city: string;
  postal_code: string;
  country_code: string;
  tax_number: string;
};

const emptyParty: Party = {
  name: '',
  address_line1: '',
  city: '',
  postal_code: '',
  country_code: '',
  tax_number: '',
};

function emptyLine(key: number): Line {
  return {
    key,
    description: '',
    hs_code: '',
    country_of_origin: '',
    quantity: '1',
    unit: 'pcs',
    unit_price: '0',
    net_weight_kg: '',
    package_count: '',
  };
}

const KINDS = {
  commercial_invoice: 'Commercial invoice',
  proforma_invoice: 'Proforma invoice',
  packing_list: 'Packing list',
} as const;

const INCOTERMS = ['', 'EXW', 'FCA', 'FAS', 'FOB', 'CFR', 'CIF', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP'];

const columns = {
  display: 'grid',
  gap: 14,
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
} as const;

function number(value: string): number {
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * A working document, without an account.
 *
 * The form is filled in here and rendered by the same engine the product uses, so what a
 * visitor downloads is genuinely the output — not a watermarked sample that misrepresents
 * it. What they do not get is the part an account is for: the values are gone the moment
 * the page is closed, and the second shipment starts from an empty form again.
 */
export function DocumentGenerator() {
  const [kind, setKind] = useState<keyof typeof KINDS>('commercial_invoice');
  const [documentNumber, setDocumentNumber] = useState('');
  const [currency, setCurrency] = useState('EUR');
  const [incoterm, setIncoterm] = useState('');
  const [incotermPlace, setIncotermPlace] = useState('');
  const [seller, setSeller] = useState<Party>(emptyParty);
  const [buyer, setBuyer] = useState<Party>(emptyParty);
  const [lines, setLines] = useState<Line[]>([emptyLine(1)]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = lines.reduce(
    (sum, item) => sum + number(item.quantity) * number(item.unit_price),
    0,
  );

  const updateLine = (key: number, field: keyof Line, value: string) =>
    setLines(lines.map((row) => (row.key === key ? { ...row, [field]: value } : row)));

  const partyFields = (
    label: string,
    value: Party,
    onChange: (next: Party) => void,
    prefix: string,
  ) => (
    <Panel title={label}>
      <div style={{ display: 'grid', gap: 14 }}>
        <div style={columns}>
          <Field id={`${prefix}-name`} label="Company name">
            {({ id }) => (
              <Input
                id={id}
                value={value.name}
                maxLength={300}
                onChange={(event) => onChange({ ...value, name: event.target.value })}
              />
            )}
          </Field>
          <Field id={`${prefix}-tax`} label="Tax number" requirement="Optional">
            {({ id }) => (
              <Input
                id={id}
                value={value.tax_number}
                maxLength={100}
                className="input data"
                onChange={(event) => onChange({ ...value, tax_number: event.target.value })}
              />
            )}
          </Field>
        </div>
        <div style={columns}>
          <Field id={`${prefix}-address`} label="Address">
            {({ id }) => (
              <Input
                id={id}
                value={value.address_line1}
                maxLength={200}
                autoComplete="off"
                onChange={(event) => onChange({ ...value, address_line1: event.target.value })}
              />
            )}
          </Field>
          <Field id={`${prefix}-city`} label="City">
            {({ id }) => (
              <Input
                id={id}
                value={value.city}
                maxLength={120}
                onChange={(event) => onChange({ ...value, city: event.target.value })}
              />
            )}
          </Field>
          <Field id={`${prefix}-postal`} label="Postal code" requirement="Optional">
            {({ id }) => (
              <Input
                id={id}
                value={value.postal_code}
                maxLength={40}
                className="input data"
                onChange={(event) => onChange({ ...value, postal_code: event.target.value })}
              />
            )}
          </Field>
          <Field id={`${prefix}-country`} label="Country" hint="Two-letter code.">
            {({ id, describedBy }) => (
              <Input
                id={id}
                value={value.country_code}
                maxLength={2}
                className="input data"
                aria-describedby={describedBy}
                style={{ textTransform: 'uppercase' }}
                onChange={(event) =>
                  onChange({ ...value, country_code: event.target.value.toUpperCase() })
                }
              />
            )}
          </Field>
        </div>
      </div>
    </Panel>
  );

  const submit = async () => {
    setError(null);

    if (!documentNumber.trim()) return setError('Give the document a number.');
    if (!seller.name.trim()) return setError('Enter who is issuing the document.');
    if (!buyer.name.trim()) return setError('Enter who the document is addressed to.');
    if (!lines.some((row) => row.description.trim())) {
      return setError('Describe at least one line of goods.');
    }

    setPending(true);
    try {
      const response = await fetch('/api/tools/document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind,
          number: documentNumber,
          currency,
          incoterm,
          incoterm_place: incotermPlace,
          port_of_loading: '',
          port_of_discharge: '',
          marks_and_numbers: '',
          reference: '',
          seller,
          buyer,
          lines: lines
            .filter((row) => row.description.trim())
            .map((row) => ({
              description: row.description,
              hs_code: row.hs_code,
              country_of_origin: row.country_of_origin,
              quantity: number(row.quantity),
              unit: row.unit || 'pcs',
              unit_price: number(row.unit_price),
              net_weight_kg: row.net_weight_kg ? number(row.net_weight_kg) : undefined,
              package_count: row.package_count ? Math.trunc(number(row.package_count)) : undefined,
            })),
        }),
      });

      if (!response.ok) {
        const problem = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(problem?.error ?? 'That document could not be produced.');
        return;
      }

      // The response is the file itself; handing it to the browser as an object URL keeps
      // the visitor on the page rather than navigating away from their half-filled form.
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${documentNumber.trim() || 'document'}.pdf`;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError('That document could not be produced. Check your connection and try again.');
    } finally {
      setPending(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <Panel title="Document">
        <div style={columns}>
          <Field id="kind" label="Type">
            {({ id }) => (
              <Select
                id={id}
                value={kind}
                onChange={(event) => setKind(event.target.value as keyof typeof KINDS)}
              >
                {Object.entries(KINDS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <Field id="number" label="Document number">
            {({ id }) => (
              <Input
                id={id}
                value={documentNumber}
                maxLength={60}
                className="input data"
                placeholder="INV-2026-001"
                onChange={(event) => setDocumentNumber(event.target.value)}
              />
            )}
          </Field>
          <Field id="currency" label="Currency">
            {({ id }) => (
              <Input
                id={id}
                value={currency}
                maxLength={3}
                className="input data"
                style={{ textTransform: 'uppercase' }}
                onChange={(event) => setCurrency(event.target.value.toUpperCase())}
              />
            )}
          </Field>
          <Field id="incoterm" label="Incoterm 2020" requirement="Optional">
            {({ id }) => (
              <Select id={id} value={incoterm} onChange={(event) => setIncoterm(event.target.value)}>
                {INCOTERMS.map((term) => (
                  <option key={term || 'none'} value={term}>
                    {term || 'Not stated'}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <Field id="incoterm-place" label="Named place" requirement="Optional">
            {({ id }) => (
              <Input
                id={id}
                value={incotermPlace}
                maxLength={160}
                placeholder="Rotterdam"
                onChange={(event) => setIncotermPlace(event.target.value)}
              />
            )}
          </Field>
        </div>
      </Panel>

      {partyFields('Issued by', seller, setSeller, 'seller')}
      {partyFields('Addressed to', buyer, setBuyer, 'buyer')}

      <Panel title="Goods">
        <div style={{ display: 'grid', gap: 20 }}>
          {lines.map((row, index) => (
            <div key={row.key} style={{ display: 'grid', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <h3 className="caption" style={{ margin: 0 }}>
                  Line {index + 1}
                </h3>
                {lines.length > 1 ? (
                  <Button
                    type="button"
                    tone="quiet"
                    compact
                    onClick={() => setLines(lines.filter((entry) => entry.key !== row.key))}
                  >
                    <Trash2 size={15} aria-hidden="true" />
                    <span className="sr-only">Remove line {index + 1}</span>
                  </Button>
                ) : null}
              </div>
              <Field id={`description-${row.key}`} label="Description of goods">
                {({ id }) => (
                  <Input
                    id={id}
                    value={row.description}
                    maxLength={500}
                    onChange={(event) => updateLine(row.key, 'description', event.target.value)}
                  />
                )}
              </Field>
              <div style={columns}>
                <Field id={`hs-${row.key}`} label="HS code" requirement="Optional">
                  {({ id }) => (
                    <Input
                      id={id}
                      value={row.hs_code}
                      maxLength={10}
                      inputMode="numeric"
                      className="input data"
                      onChange={(event) => updateLine(row.key, 'hs_code', event.target.value)}
                    />
                  )}
                </Field>
                <Field id={`origin-${row.key}`} label="Origin" requirement="Optional">
                  {({ id }) => (
                    <Input
                      id={id}
                      value={row.country_of_origin}
                      maxLength={2}
                      className="input data"
                      style={{ textTransform: 'uppercase' }}
                      onChange={(event) =>
                        updateLine(row.key, 'country_of_origin', event.target.value.toUpperCase())
                      }
                    />
                  )}
                </Field>
                <Field id={`quantity-${row.key}`} label="Quantity">
                  {({ id }) => (
                    <Input
                      id={id}
                      value={row.quantity}
                      inputMode="decimal"
                      className="input data numeric"
                      onChange={(event) => updateLine(row.key, 'quantity', event.target.value)}
                    />
                  )}
                </Field>
                <Field id={`unit-${row.key}`} label="Unit">
                  {({ id }) => (
                    <Input
                      id={id}
                      value={row.unit}
                      maxLength={12}
                      onChange={(event) => updateLine(row.key, 'unit', event.target.value)}
                    />
                  )}
                </Field>
                <Field id={`price-${row.key}`} label="Unit price">
                  {({ id }) => (
                    <Input
                      id={id}
                      value={row.unit_price}
                      inputMode="decimal"
                      className="input data numeric"
                      onChange={(event) => updateLine(row.key, 'unit_price', event.target.value)}
                    />
                  )}
                </Field>
                <Field id={`net-${row.key}`} label="Net weight (kg)" requirement="Optional">
                  {({ id }) => (
                    <Input
                      id={id}
                      value={row.net_weight_kg}
                      inputMode="decimal"
                      className="input data numeric"
                      onChange={(event) => updateLine(row.key, 'net_weight_kg', event.target.value)}
                    />
                  )}
                </Field>
                <Field id={`packages-${row.key}`} label="Packages" requirement="Optional">
                  {({ id }) => (
                    <Input
                      id={id}
                      value={row.package_count}
                      inputMode="numeric"
                      className="input data numeric"
                      onChange={(event) => updateLine(row.key, 'package_count', event.target.value)}
                    />
                  )}
                </Field>
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <Button
              type="button"
              tone="secondary"
              compact
              disabled={lines.length >= 20}
              onClick={() =>
                setLines([
                  ...lines,
                  emptyLine(lines.reduce((high, row) => Math.max(high, row.key), 0) + 1),
                ])
              }
            >
              <Plus size={15} aria-hidden="true" />
              Add a line
            </Button>
            <span className="muted">
              Total {decimal(total)} {currency}
              {lines.length >= 20 ? ' · twenty lines is the limit without an account' : ''}
            </span>
          </div>
        </div>
      </Panel>

      {error ? (
        <Callout tone="danger" title="That did not work" live>
          {error}
        </Callout>
      ) : null}

      <div className="cta-row">
        <Button type="button" onClick={submit} pending={pending} pendingLabel="Producing the PDF…">
          <Download size={16} aria-hidden="true" />
          Download the PDF
        </Button>
      </div>
    </div>
  );
}
