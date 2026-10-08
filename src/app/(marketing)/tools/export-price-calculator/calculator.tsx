'use client';

import { useState } from 'react';
import type Decimal from 'decimal.js';
import { Panel } from '@/components/primitives/feedback';
import { Field, Input, Select } from '@/components/primitives/form';
import { DataTable } from '@/components/primitives/table';
import { BoxGrid, FieldBox } from '@/components/document/field-box';
import { decimal, money } from '@/lib/format';
import { currencyMinorUnits } from '@/lib/money';
import { MAX_RATE_PERCENT, parseAmount, parseRate } from '@/lib/trade/landed-cost';
import {
  EXPORT_DUTY_BASES,
  EXPORT_PRICE_RULES,
  EXPORT_PRICE_TERMS,
  EXPORT_TAX_BASES,
  exportPrice,
  type ExportDutyBasis,
  type ExportPriceTerm,
  type ExportTaxBasis,
} from '@/lib/trade/export-price';

const columns = {
  display: 'grid',
  gap: 14,
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
} as const;

type AmountField =
  | 'exw'
  | 'inland'
  | 'clearance'
  | 'loading'
  | 'freight'
  | 'insurance'
  | 'destination'
  | 'units';
type RateField = 'duty' | 'tax';

const AMOUNT_ERROR = 'Enter a number such as 1250.50, or leave it blank.';
const RATE_ERROR = `Enter a percentage between 0 and ${MAX_RATE_PERCENT}, such as 4.5.`;

/**
 * The export price ladder, live as it is typed.
 *
 * Every cost and rate is the visitor's: the page has no freight, insurance, duty or tax
 * figures of its own and never suggests one, because a default would look like a quote.
 * Blank fields count as zero so a partial ladder is still useful; a field that cannot be
 * read is flagged rather than silently treated as nothing. Nothing typed here leaves the
 * browser.
 */
export function ExportPriceCalculator() {
  const [currency, setCurrency] = useState('USD');
  const [amounts, setAmounts] = useState<Record<AmountField, string>>({
    exw: '',
    inland: '',
    clearance: '',
    loading: '',
    freight: '',
    insurance: '',
    destination: '',
    units: '',
  });
  const [rates, setRates] = useState<Record<RateField, string>>({ duty: '', tax: '' });
  const [dutyBasis, setDutyBasis] = useState<ExportDutyBasis>('cif');
  const [taxBasis, setTaxBasis] = useState<ExportTaxBasis>('value_plus_duty');

  const code = /^[A-Z]{3}$/.test(currency) ? currency : 'USD';
  const places = currencyMinorUnits(code);

  const amountInvalid = (field: AmountField) =>
    amounts[field].trim() !== '' && parseAmount(amounts[field]) === null;
  const rateInvalid = (field: RateField) =>
    rates[field].trim() !== '' && parseRate(rates[field]) === null;

  const value = (field: AmountField) => parseAmount(amounts[field]) ?? 0;
  const rate = (field: RateField) => parseRate(rates[field]) ?? 0;

  const result = exportPrice({
    exwValue: value('exw'),
    inlandTransport: value('inland'),
    exportClearance: value('clearance'),
    loading: value('loading'),
    mainFreight: value('freight'),
    insurance: value('insurance'),
    destinationCharges: value('destination'),
    dutyRatePercent: rate('duty'),
    taxRatePercent: rate('tax'),
    dutyBasis,
    taxBasis,
    units: parseAmount(amounts.units),
    places,
  });

  const stated = result.prices.ddp.greaterThan(0);
  const show = (amount: Decimal) => (stated ? money(amount.toFixed(places), code) : '—');
  const unit = (term: ExportPriceTerm) =>
    stated && result.perUnit ? `${decimal(result.perUnit[term].toFixed(4), 4)} ${code}` : '—';

  const percent = (field: RateField) => decimal(rate(field).toString(), 2);

  /** What each rung adds to the one below it, for the line-by-line table. */
  const adds: Record<ExportPriceTerm, string> = {
    exw: 'The goods at your premises',
    fob: 'Inland transport, export clearance, origin loading and terminal charges',
    cfr: 'Main freight to the destination',
    cif: 'Cargo insurance',
    ddp: `Destination charges, duty at ${percent('duty')}% and import taxes at ${percent('tax')}%`,
  };

  const amountField = (field: AmountField, id: string, label: string, hint?: string) => (
    <Field
      id={id}
      label={label}
      hint={hint}
      requirement={field === 'exw' ? undefined : 'Optional'}
      error={amountInvalid(field) ? AMOUNT_ERROR : undefined}
    >
      {({ id: inputId, describedBy, invalid }) => (
        <Input
          id={inputId}
          inputMode="decimal"
          value={amounts[field]}
          invalid={invalid}
          aria-describedby={describedBy}
          className="input data numeric"
          onChange={(event) => setAmounts({ ...amounts, [field]: event.target.value })}
        />
      )}
    </Field>
  );

  const rateField = (field: RateField, id: string, label: string, hint: string) => (
    <Field
      id={id}
      label={label}
      hint={hint}
      requirement="Optional"
      error={rateInvalid(field) ? RATE_ERROR : undefined}
    >
      {({ id: inputId, describedBy, invalid }) => (
        <Input
          id={inputId}
          inputMode="decimal"
          value={rates[field]}
          invalid={invalid}
          aria-describedby={describedBy}
          className="input data numeric"
          onChange={(event) => setRates({ ...rates, [field]: event.target.value })}
        />
      )}
    </Field>
  );

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <Panel title="Your costs to the port">
        <div style={columns}>
          <Field id="currency" label="Currency" hint="Three-letter code, such as USD or EUR.">
            {({ id, describedBy }) => (
              <Input
                id={id}
                value={currency}
                maxLength={3}
                aria-describedby={describedBy}
                className="input data"
                style={{ textTransform: 'uppercase' }}
                onChange={(event) => setCurrency(event.target.value.toUpperCase())}
              />
            )}
          </Field>
          {amountField(
            'exw',
            'exw-value',
            'Ex-works (EXW) price',
            'The goods at your premises, with your margin.',
          )}
          {amountField(
            'inland',
            'inland-transport',
            'Inland transport',
            'From your premises to the carrier or port of loading.',
          )}
          {amountField(
            'clearance',
            'export-clearance',
            'Export clearance',
            'Broker and filing fees.',
          )}
          {amountField(
            'loading',
            'origin-loading',
            'Origin loading and terminal charges',
            'Terminal handling and loading on board.',
          )}
        </div>
      </Panel>

      <Panel title="Carriage and insurance">
        <div style={columns}>
          {amountField(
            'freight',
            'main-freight',
            'Main freight',
            'Your forwarder’s or carrier’s quote to the destination.',
          )}
          {amountField(
            'insurance',
            'cargo-insurance',
            'Cargo insurance',
            'The premium your insurer quotes.',
          )}
          {amountField('units', 'units', 'Units in the consignment', 'For a price per unit.')}
        </div>
      </Panel>

      <Panel title="For the DDP estimate">
        <div style={columns}>
          {amountField(
            'destination',
            'destination-charges',
            'Destination charges',
            'Unloading, destination terminal and delivery to the buyer.',
          )}
          {rateField(
            'duty',
            'duty-rate',
            'Import duty rate (%)',
            'From the importing country’s tariff or a broker.',
          )}
          <Field id="duty-basis" label="Duty charged on">
            {({ id }) => (
              <Select
                id={id}
                value={dutyBasis}
                onChange={(event) => setDutyBasis(event.target.value as ExportDutyBasis)}
              >
                {Object.entries(EXPORT_DUTY_BASES).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          {rateField(
            'tax',
            'tax-rate',
            'Import taxes (%)',
            'Import VAT, GST or similar, at the rate that applies.',
          )}
          <Field id="tax-basis" label="Taxes charged on">
            {({ id }) => (
              <Select
                id={id}
                value={taxBasis}
                onChange={(event) => setTaxBasis(event.target.value as ExportTaxBasis)}
              >
                {Object.entries(EXPORT_TAX_BASES).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </Select>
            )}
          </Field>
        </div>
      </Panel>

      <BoxGrid label="Export price">
        <FieldBox ordinal="1" caption="FCA / FOB price">
          <span className="data">{show(result.prices.fob)}</span>
        </FieldBox>
        <FieldBox ordinal="2" caption="CFR / CPT price">
          <span className="data">{show(result.prices.cfr)}</span>
        </FieldBox>
        <FieldBox ordinal="3" caption="CIF / CIP price">
          <span className="data">{show(result.prices.cif)}</span>
        </FieldBox>
        <FieldBox ordinal="4" caption="DDP estimate">
          <span className="data">{show(result.prices.ddp)}</span>
        </FieldBox>
      </BoxGrid>

      {stated ? (
        <Panel title="The price under each rule">
          <div style={{ display: 'grid', gap: 12 }}>
            <DataTable caption="Export price by Incoterms rule, an estimate, not a quote">
              <thead>
                <tr>
                  <th scope="col">Rule</th>
                  <th scope="col">Adds to the rule before</th>
                  <th scope="col" className="numeric">
                    Price
                  </th>
                  <th scope="col" className="numeric">
                    Per unit
                  </th>
                </tr>
              </thead>
              <tbody>
                {EXPORT_PRICE_TERMS.map((term) => (
                  <tr key={term}>
                    <th scope="row">{EXPORT_PRICE_RULES[term]}</th>
                    <td>{adds[term]}</td>
                    <td className="numeric">{money(result.prices[term].toFixed(places), code)}</td>
                    <td className="numeric">{unit(term)}</td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
            <p className="muted" style={{ marginBottom: 0 }}>
              An estimate from the costs and rates you entered, not a quote. In the DDP estimate,
              duty of {show(result.duty)} is worked out on{' '}
              {EXPORT_DUTY_BASES[dutyBasis].toLowerCase()} and taxes of {show(result.tax)} on{' '}
              {EXPORT_TAX_BASES[taxBasis].toLowerCase()}. What customs actually assesses depends on
              the classification, origin and valuation it accepts.
            </p>
          </div>
        </Panel>
      ) : null}
    </div>
  );
}
