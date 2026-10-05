'use client';

import { useState } from 'react';
import type Decimal from 'decimal.js';
import { Panel } from '@/components/primitives/feedback';
import { Field, Input, Select } from '@/components/primitives/form';
import { DataTable } from '@/components/primitives/table';
import { BoxGrid, FieldBox } from '@/components/document/field-box';
import { decimal, money } from '@/lib/format';
import { currencyMinorUnits } from '@/lib/money';
import {
  DUTY_BASES,
  MAX_RATE_PERCENT,
  TAX_BASES,
  landedCost,
  parseAmount,
  parseRate,
  type DutyBasis,
  type TaxBasis,
} from '@/lib/trade/landed-cost';

const columns = {
  display: 'grid',
  gap: 14,
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
} as const;

type AmountField = 'goods' | 'freight' | 'insurance' | 'other' | 'units';
type RateField = 'duty' | 'tax';

const AMOUNT_ERROR = 'Enter a number such as 1250.50, or leave it blank.';
const RATE_ERROR = `Enter a percentage between 0 and ${MAX_RATE_PERCENT}, such as 4.5.`;

/**
 * Landed cost, live as it is typed.
 *
 * Every rate is the visitor's: the page never suggests a duty or tax figure, because a
 * wrong default would look like an answer. Blank fields count as zero so a partial
 * estimate is still useful, but a field that cannot be read is flagged rather than
 * silently treated as nothing. Nothing typed here leaves the browser.
 */
export function LandedCostCalculator() {
  const [currency, setCurrency] = useState('USD');
  const [amounts, setAmounts] = useState<Record<AmountField, string>>({
    goods: '',
    freight: '',
    insurance: '',
    other: '',
    units: '',
  });
  const [rates, setRates] = useState<Record<RateField, string>>({ duty: '', tax: '' });
  const [dutyBasis, setDutyBasis] = useState<DutyBasis>('cif');
  const [taxBasis, setTaxBasis] = useState<TaxBasis>('value_plus_duty');

  const code = /^[A-Z]{3}$/.test(currency) ? currency : 'USD';
  const places = currencyMinorUnits(code);

  const amountInvalid = (field: AmountField) =>
    amounts[field].trim() !== '' && parseAmount(amounts[field]) === null;
  const rateInvalid = (field: RateField) =>
    rates[field].trim() !== '' && parseRate(rates[field]) === null;

  const value = (field: AmountField) => parseAmount(amounts[field]) ?? 0;
  const rate = (field: RateField) => parseRate(rates[field]) ?? 0;

  const result = landedCost({
    goodsValue: value('goods'),
    freight: value('freight'),
    insurance: value('insurance'),
    otherCosts: value('other'),
    dutyRatePercent: rate('duty'),
    taxRatePercent: rate('tax'),
    dutyBasis,
    taxBasis,
    units: parseAmount(amounts.units),
    places,
  });

  const stated = result.total.greaterThan(0);
  const show = (amount: Decimal) =>
    stated ? money(amount.toFixed(places), code) : '—';

  const amountField = (field: AmountField, id: string, label: string, hint?: string) => (
    <Field
      id={id}
      label={label}
      hint={hint}
      requirement={field === 'goods' ? undefined : 'Optional'}
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

  const lines = [
    { label: 'Goods value', amount: result.goodsValue },
    { label: 'Freight', amount: result.freight },
    { label: 'Insurance', amount: result.insurance },
    { label: `Duty at ${decimal(rate('duty').toString(), 2)}%`, amount: result.duty },
    { label: `Taxes and fees at ${decimal(rate('tax').toString(), 2)}%`, amount: result.tax },
    { label: 'Other costs', amount: result.otherCosts },
  ];

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <Panel title="Your consignment">
        <div style={{ display: 'grid', gap: 20 }}>
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
            {amountField('goods', 'goods-value', 'Goods value', 'What you pay the supplier.')}
            {amountField('freight', 'freight', 'Freight to destination')}
            {amountField('insurance', 'insurance', 'Insurance')}
          </div>
          <div style={columns}>
            {rateField(
              'duty',
              'duty-rate',
              'Duty rate (%)',
              'From your broker or the importing country’s tariff.',
            )}
            <Field id="duty-basis" label="Duty charged on">
              {({ id }) => (
                <Select
                  id={id}
                  value={dutyBasis}
                  onChange={(event) => setDutyBasis(event.target.value as DutyBasis)}
                >
                  {Object.entries(DUTY_BASES).map(([key, label]) => (
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
              'Import taxes and fees (%)',
              'Import VAT, GST or similar, at the rate that applies.',
            )}
            <Field id="tax-basis" label="Taxes charged on">
              {({ id }) => (
                <Select
                  id={id}
                  value={taxBasis}
                  onChange={(event) => setTaxBasis(event.target.value as TaxBasis)}
                >
                  {Object.entries(TAX_BASES).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          </div>
          <div style={columns}>
            {amountField(
              'other',
              'other-costs',
              'Other costs',
              'Broker fees, port charges, inland delivery.',
            )}
            {amountField('units', 'units', 'Units in the consignment', 'For a cost per unit.')}
          </div>
        </div>
      </Panel>

      <BoxGrid label="Landed cost">
        <FieldBox ordinal="1" caption="Landed cost">
          <span className="data">{show(result.total)}</span>
        </FieldBox>
        <FieldBox ordinal="2" caption="Per unit">
          <span className="data">
            {stated && result.perUnit ? `${decimal(result.perUnit.toFixed(4), 4)} ${code}` : '—'}
          </span>
        </FieldBox>
        <FieldBox ordinal="3" caption="Added to the goods value">
          <span className="data">{show(result.addedCost)}</span>
        </FieldBox>
        <FieldBox ordinal="4" caption="Customs value used for duty">
          <span className="data">{show(result.customsValue)}</span>
        </FieldBox>
      </BoxGrid>

      {stated ? (
        <Panel title="How the estimate adds up">
          <div style={{ display: 'grid', gap: 12 }}>
            <DataTable caption="Landed cost estimate, line by line">
              <thead>
                <tr>
                  <th scope="col">Line</th>
                  <th scope="col" className="numeric">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => (
                  <tr key={line.label}>
                    <td>{line.label}</td>
                    <td className="numeric">{money(line.amount.toFixed(places), code)}</td>
                  </tr>
                ))}
                <tr>
                  <th scope="row">Landed cost</th>
                  <td className="numeric">{money(result.total.toFixed(places), code)}</td>
                </tr>
              </tbody>
            </DataTable>
            <p className="muted" style={{ marginBottom: 0 }}>
              An estimate from the figures and rates you entered. Duty is worked out on{' '}
              {DUTY_BASES[dutyBasis].toLowerCase()}; taxes on {TAX_BASES[taxBasis].toLowerCase()}.
              The amounts customs actually assesses depend on the classification, origin and
              valuation it accepts.
            </p>
          </div>
        </Panel>
      ) : null}
    </div>
  );
}
