import Decimal from 'decimal.js';
import { z } from 'zod';
import { readDecimal } from '@/lib/csv';

/**
 * Field rules shared by every form that writes trade data, so a line typed by hand and a
 * line imported from a file are held to the same rules, and the message a person reads
 * matches the constraint the database would otherwise reject with a generic error.
 */

export const INCOTERMS = [
  'EXW',
  'FCA',
  'FAS',
  'FOB',
  'CFR',
  'CIF',
  'CPT',
  'CIP',
  'DAP',
  'DPU',
  'DDP',
] as const;

export type Incoterm = (typeof INCOTERMS)[number];

/** Largest figure the numeric(14, 4) and numeric(14, 3) columns accept, with headroom. */
const MAX_FIGURE = 10_000_000_000;

function places(value: string): number {
  return value.split('.')[1]?.length ?? 0;
}

/**
 * A decimal as typed ("1.234,56", "1,234.56", "12"), returned as an exact decimal string,
 * or null when blank. Never a float: the database receives the digits the user typed.
 */
export function decimalField(options: {
  label: string;
  places: number;
  required?: boolean;
  positive?: boolean;
}) {
  const { label, required = false, positive = false } = options;
  return z
    .string()
    .trim()
    .transform((value, context) => {
      if (value === '') {
        if (required) {
          context.addIssue({ code: 'custom', message: `Enter the ${label}.` });
          return z.NEVER;
        }
        return null;
      }
      const normalized = readDecimal(value);
      if (normalized === null) {
        context.addIssue({ code: 'custom', message: `Enter the ${label} as a number.` });
        return z.NEVER;
      }
      const amount = new Decimal(normalized);
      if (positive ? amount.lessThanOrEqualTo(0) : amount.isNegative()) {
        context.addIssue({
          code: 'custom',
          message: positive
            ? `The ${label} must be greater than zero.`
            : `The ${label} cannot be negative.`,
        });
        return z.NEVER;
      }
      if (amount.greaterThanOrEqualTo(MAX_FIGURE)) {
        context.addIssue({ code: 'custom', message: `The ${label} is too large.` });
        return z.NEVER;
      }
      if (places(normalized) > options.places) {
        context.addIssue({
          code: 'custom',
          message: `Use at most ${options.places} decimal ${options.places === 1 ? 'place' : 'places'} for the ${label}.`,
        });
        return z.NEVER;
      }
      return amount.toFixed();
    });
}

export const countryField = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^([A-Z]{2})?$/, 'Use a two-letter country code, such as DE.')
  .transform((value) => value || null);

export const hsCodeField = z
  .string()
  .trim()
  .transform((value) => value.replace(/[\s.]/g, ''))
  .refine((value) => /^([0-9]{6,10})?$/.test(value), 'An HS code is 6 to 10 digits.')
  .transform((value) => value || null);

export const currencyField = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{3}$/, 'Use a three-letter currency code, such as EUR.');

/** YYYY-MM-DD that is a real calendar day; empty means not stated. */
export const calendarDateField = z
  .string()
  .trim()
  .refine((value) => {
    if (value === '') return true;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const parsed = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  }, 'Enter a date as YYYY-MM-DD.')
  .transform((value) => value || null);

/** Gross is the net plus packaging, so it can never be the smaller figure. */
export function grossBelowNet(net: string | null, gross: string | null): boolean {
  return net !== null && gross !== null && new Decimal(gross).lessThan(net);
}

/**
 * The ISO 6346 check digit of a container number's first ten characters: each letter has a
 * value from 10 upwards that skips multiples of 11, each character is weighted by 2 to the
 * power of its position, and the sum modulo 11 (10 counting as 0) is the digit.
 */
export function containerCheckDigit(firstTen: string): number {
  let sum = 0;
  for (let index = 0; index < firstTen.length; index += 1) {
    const character = firstTen.charAt(index);
    let value: number;
    if (/[0-9]/.test(character)) {
      value = Number(character);
    } else {
      // A=10, then one more per letter, stepping over 11, 22 and 33: K=21, U=32, V=34.
      const base = 10 + character.charCodeAt(0) - 65;
      value = base + Math.floor((base - 1) / 10);
    }
    sum += value * 2 ** index;
  }
  return (sum % 11) % 10;
}

/** An ISO 6346 container number, such as CSQU3054383; empty means not stated. */
export const containerNumberField = z
  .string()
  .trim()
  .toUpperCase()
  .transform((value) => value.replace(/[\s-]/g, ''))
  .refine(
    (value) => value === '' || /^[A-Z]{3}[UJZ][0-9]{7}$/.test(value),
    'Use four letters and seven digits, such as CSQU3054383.',
  )
  .refine(
    (value) => value === '' || containerCheckDigit(value.slice(0, 10)) === Number(value.charAt(10)),
    'That container number’s check digit does not match. Check it against the container.',
  )
  .transform((value) => value || null);
