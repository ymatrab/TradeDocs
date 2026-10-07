import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { createFontSet } from '@/lib/pdf/fonts';
import { renderTradeDocument } from '@/lib/pdf/trade-document';
import { png } from '../fixtures/images';

/**
 * Writes a branded sample invoice to review-artifacts/ so the owner can look at the
 * Pro branding without an entitled account. The parties and images are invented: the logo is
 * a drawn mark (dark block with a yellow bar), the signature a drawn stroke.
 */
const sha = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');

function logoPng(): Uint8Array {
  const width = 240;
  const height = 60;
  const rows: number[][] = [];
  for (let y = 0; y < height; y += 1) {
    const row: number[] = [];
    for (let x = 0; x < width; x += 1) {
      const block = x < 60;
      const bar = x >= 72 && y >= 22 && y < 38;
      if (block) row.push(20, 61, 58, 255);
      else if (bar) row.push(246, 201, 69, 255);
      else row.push(0, 0, 0, 0);
    }
    rows.push(row);
  }
  return png({ width, height, colorType: 6, rows });
}

function signaturePng(): Uint8Array {
  const width = 200;
  const height = 60;
  const rows: number[][] = [];
  for (let y = 0; y < height; y += 1) {
    const row: number[] = [];
    for (let x = 0; x < width; x += 1) {
      const curve = 30 + Math.round(16 * Math.sin(x / 14));
      const ink = Math.abs(y - curve) <= 1;
      row.push(...(ink ? [20, 34, 31, 255] : [0, 0, 0, 0]));
    }
    rows.push(row);
  }
  return png({ width, height, colorType: 6, rows });
}

describe('branded sample for review', () => {
  it('renders a schema 5 commercial invoice with a logo and signature', () => {
    const logo = logoPng();
    const signature = signaturePng();
    const asset = (bytes: Uint8Array, width: number, height: number) => ({
      object_path: `org/00000000-0000-4000-8000-000000000001/assets/${sha(bytes)}.png`,
      sha256: sha(bytes),
      format: 'png',
      width,
      height,
    });
    const snapshot = {
      schema_version: 5,
      money_places: 2,
      kind: 'commercial_invoice',
      number: 'CI-2026-0042',
      generated_at: '2026-10-07T10:00:00.000Z',
      supersedes: null,
      issuer: { signatory_name: 'Ana Example', signatory_title: 'Export Manager' },
      shipment: { reference: 'SHP-2026-0042', currency: 'USD', revision: 1 },
      exporter: { name: 'Example Exports Ltd (invented)', country_code: 'GB' },
      consignee: { name: 'Example Imports Inc. (invented)', country_code: 'US' },
      notify: null,
      items: [1, 2, 3].map((position) => ({
        position,
        description: `Stainless steel bearing housing, model ${position}`,
        quantity: 100 * position,
        unit: 'pcs',
        unit_price: 4.5,
        line_total: 450 * position,
      })),
      totals: {
        quantity: 600,
        net_weight_kg: null,
        gross_weight_kg: null,
        packages: 0,
        value: 2700,
      },
      branding: { logo: asset(logo, 240, 60), signature: asset(signature, 200, 60) },
    };
    const images = new Map([
      [sha(logo), logo],
      [sha(signature), signature],
    ]);
    const pdf = renderTradeDocument(snapshot, createFontSet(), images);
    expect(pdf.byteLength).toBeGreaterThan(1000);
    mkdirSync('review-artifacts', { recursive: true });
    writeFileSync('review-artifacts/branded-commercial-invoice.pdf', pdf);
  });
});
