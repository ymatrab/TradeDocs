/**
 * Number presentation for the interface.
 *
 * Fixed to en-GB rather than the viewer's locale on purpose. A trade document is read by
 * a buyer, a bank and a customs broker in three different countries, and a figure that
 * renders as 1,234.50 on screen and 1.234,50 in the PDF is a discrepancy someone has to
 * resolve. The PDF renderer uses the same locale for the same reason.
 */

const LOCALE = 'en-GB';

export function decimal(value: number | string | null | undefined, places = 2): string {
  if (value === null || value === undefined || value === '') return '—';
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '—';
  return amount.toLocaleString(LOCALE, {
    minimumFractionDigits: places,
    maximumFractionDigits: places,
  });
}

/** Quantities keep up to three places but drop trailing zeroes: 12 rather than 12.000. */
export function quantity(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '—';
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '—';
  return amount.toLocaleString(LOCALE, { maximumFractionDigits: 3 });
}

/** The currency stays a code beside the figure; a symbol is ambiguous across borders. */
export function money(value: number | string | null | undefined, currency: string): string {
  return `${decimal(value)} ${currency}`;
}

export function shortDate(value: string | null | undefined): string {
  if (!value) return '—';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '—';
  return parsed.toLocaleDateString(LOCALE, { year: 'numeric', month: 'short', day: 'numeric' });
}
