import { describe, expect, it } from 'vitest';
import { detectDelimiter, parseCatalog, parseDelimited, readDecimal, toCsv } from '@/lib/csv';

describe('delimited parsing', () => {
  it('keeps a comma that belongs to a description rather than splitting on it', () => {
    const rows = parseDelimited('a,"Cotton towel, 50 x 70 cm",c');
    expect(rows).toEqual([['a', 'Cotton towel, 50 x 70 cm', 'c']]);
  });

  it('reads a doubled quote as one literal quote', () => {
    const rows = parseDelimited('"Mug, 350 ml ""Harbour"" print",2');
    expect(rows[0][0]).toBe('Mug, 350 ml "Harbour" print');
  });

  it('treats a newline inside quotes as part of the field', () => {
    const rows = parseDelimited('"line one\nline two",x');
    expect(rows).toHaveLength(1);
    expect(rows[0][0]).toBe('line one\nline two');
  });

  it('counts a CRLF as one row break and drops a trailing newline', () => {
    expect(parseDelimited('a,b\r\nc,d\r\n')).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ]);
  });

  it('strips the byte order mark Excel writes, so the first heading still matches', () => {
    const rows = parseDelimited('﻿description,price');
    expect(rows[0][0]).toBe('description');
  });

  it('preserves empty cells so later columns do not shift left', () => {
    expect(parseDelimited('a,,c')).toEqual([['a', '', 'c']]);
  });
});

describe('delimiter detection', () => {
  it('picks the semicolon a comma-decimal locale exports with', () => {
    expect(detectDelimiter('description;price\nTowel;2,40')).toBe(';');
  });

  it('picks the tab of a spreadsheet paste', () => {
    expect(detectDelimiter('description\tprice')).toBe('\t');
  });

  it('falls back to a comma for a single-column file', () => {
    expect(detectDelimiter('description')).toBe(',');
  });
});

describe('decimal reading', () => {
  it('reads both separator conventions by their last separator', () => {
    expect(readDecimal('1.234,56')).toBe('1234.56');
    expect(readDecimal('1,234.56')).toBe('1234.56');
  });

  it('reads a plain thousands group without a decimal part', () => {
    expect(readDecimal('1,234')).toBe('1234');
  });

  it('ignores a currency symbol and surrounding space', () => {
    expect(readDecimal(' € 2.40 ')).toBe('2.40');
  });

  it('reports text that is not a number rather than guessing at zero', () => {
    expect(readDecimal('on request')).toBeNull();
    expect(readDecimal('')).toBeNull();
    expect(readDecimal(undefined)).toBeNull();
  });
});

describe('catalog reading', () => {
  it('matches the headings an exporter is likely to already have', () => {
    const { rows, missingDescription } = parseCatalog(
      'Item Code,Product Name,Tariff Code,Country of Origin,UOM,Unit Price\n' +
        'A-100,Cotton tea towel,630260,IN,pcs,2.40',
    );
    expect(missingDescription).toBe(false);
    expect(rows[0]).toEqual({
      sku: 'A-100',
      description: 'Cotton tea towel',
      hs_code: '630260',
      country_of_origin: 'IN',
      unit: 'pcs',
      unit_price: '2.40',
    });
  });

  it('reports a file with no description column instead of importing empty products', () => {
    const result = parseCatalog('code,price\nA-100,2.40');
    expect(result.missingDescription).toBe(true);
    expect(result.rows).toEqual([]);
  });

  it('names the columns it did not use rather than dropping them silently', () => {
    const { ignored } = parseCatalog('description,warehouse bay,price\nTowel,B12,2.40');
    expect(ignored).toContain('warehouse bay');
  });

  it('skips rows with no description, which is what a trailing blank line is', () => {
    const { rows } = parseCatalog('description,price\nTowel,2.40\n,1.00\n');
    expect(rows).toHaveLength(1);
  });

  it('reads a semicolon file without treating the row as one column', () => {
    const { rows } = parseCatalog('description;unit price\nTowel;2,40');
    expect(rows[0].description).toBe('Towel');
    expect(rows[0].unit_price).toBe('2,40');
  });
});

describe('csv writing', () => {
  it('quotes only the cells that would otherwise break the row', () => {
    expect(toCsv(['a', 'b'], [['plain', 'has, comma']])).toBe('a,b\r\nplain,"has, comma"');
  });

  it('escapes a quote by doubling it, so the file reads back unchanged', () => {
    const written = toCsv(['a'], [['say "hi"']]);
    expect(parseDelimited(written)[1][0]).toBe('say "hi"');
  });
});
