import { createHash } from 'node:crypto';
import { inflateSync } from 'node:zlib';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  detectImageFormat,
  embedImage,
  fitWithin,
  ImageError,
  MAX_IMAGE_SIDE,
  readImageInfo,
} from '@/lib/pdf/image';
import { createFontSet } from '@/lib/pdf/fonts';
import { Page, PAGE_HEIGHT, renderPdf } from '@/lib/pdf/writer';
import {
  brandingAssetsOf,
  BrandingUnavailableError,
  documentImages,
  documentLayout,
  LOGO_BOX,
  RENDERER_VERSION,
  renderTradeDocument,
  SIGNATURE_BOX,
  withoutBranding,
} from '@/lib/pdf/trade-document';
import {
  brandingObjectPath,
  parseBrandingObjectPath,
  validateBrandingImage,
} from '@/lib/branding/assets';
import { featurePlans, FEATURES, paidOnlyFeatures, paidOnlySummary } from '@/lib/billing/plans';
import { MAX_BRANDING_BYTES, MAX_BRANDING_SIDE } from '@/lib/limits';
import { hasEntitlement } from '@/lib/billing/server';
import { staleReasons } from '@/lib/trade/staleness';
import { jpeg, png, redBluePng } from '../fixtures/images';

const ORG = '11111111-1111-4111-8111-111111111111';

const entitlement = vi.hoisted(() => ({
  result: { data: null as unknown, error: null as unknown },
  throws: false,
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => {
    if (entitlement.throws) throw new Error('no database');
    const chain = {
      select: () => chain,
      eq: () => chain,
      maybeSingle: async () => entitlement.result,
    };
    return { from: () => chain };
  },
}));

function sha(bytes: Uint8Array): string {
  return createHash('sha256').update(bytes).digest('hex');
}

function asText(bytes: Uint8Array): string {
  return new TextDecoder('latin1').decode(bytes);
}

// --- Image reading ------------------------------------------------------------------------

describe('image formats are decided by the bytes', () => {
  it('recognises PNG and JPEG signatures and nothing else', () => {
    expect(detectImageFormat(redBluePng())).toBe('png');
    expect(detectImageFormat(jpeg())).toBe('jpeg');
    expect(detectImageFormat(new TextEncoder().encode('GIF89a......'))).toBeNull();
    expect(detectImageFormat(new TextEncoder().encode('<svg/>'))).toBeNull();
    expect(() => readImageInfo(new TextEncoder().encode('not an image'))).toThrow(ImageError);
  });

  it('reads a JPEG frame header after APP segments and fill bytes', () => {
    expect(readImageInfo(jpeg({ width: 640, height: 200 }))).toEqual({
      format: 'jpeg',
      width: 640,
      height: 200,
    });
    expect(readImageInfo(jpeg({ marker: 0xc2 })).format).toBe('jpeg'); // progressive
  });

  it('embeds a JPEG as its own bytes, with the colour space its components say', () => {
    const bytes = jpeg({ components: 1 });
    const image = embedImage(bytes);
    expect(image.filter).toBe('DCTDecode');
    expect(image.colorSpace).toBe('DeviceGray');
    expect(image.data).toBe(bytes);
    expect(embedImage(jpeg()).colorSpace).toBe('DeviceRGB');
  });

  it('refuses JPEGs a PDF reader may not draw, saying what to do', () => {
    expect(() => embedImage(jpeg({ components: 4 }))).toThrow(/CMYK/);
    expect(() => embedImage(jpeg({ precision: 12 }))).toThrow(/8-bit/);
    expect(() => embedImage(jpeg({ marker: 0xc9 }))).toThrow(/uncommon encoding/);
  });

  it('decodes an RGB PNG to its pixels, without a mask when it is opaque', () => {
    const image = embedImage(redBluePng());
    expect(image).toMatchObject({ width: 2, height: 1, colorSpace: 'DeviceRGB' });
    expect(image.filter).toBe('FlateDecode');
    expect([...inflateSync(image.data)]).toEqual([255, 0, 0, 0, 0, 255]);
    expect(image.alpha).toBeUndefined();
  });

  it('carries transparency as a soft mask', () => {
    const image = embedImage(
      png({ width: 2, height: 1, colorType: 6, rows: [[10, 20, 30, 255, 40, 50, 60, 0]] }),
    );
    expect([...inflateSync(image.data)]).toEqual([10, 20, 30, 40, 50, 60]);
    expect([...inflateSync(image.alpha ?? new Uint8Array())]).toEqual([255, 0]);
  });

  it('leaves out the mask of an RGBA PNG whose every pixel is opaque', () => {
    const image = embedImage(png({ width: 1, height: 1, colorType: 6, rows: [[1, 2, 3, 255]] }));
    expect(image.alpha).toBeUndefined();
  });

  it('expands a palette PNG, with per-entry transparency', () => {
    const image = embedImage(
      png({
        width: 2,
        height: 1,
        colorType: 3,
        rows: [[0, 1]],
        palette: [255, 255, 255, 0, 0, 128],
        transparency: [0],
      }),
    );
    expect([...inflateSync(image.data)]).toEqual([255, 255, 255, 0, 0, 128]);
    expect([...inflateSync(image.alpha ?? new Uint8Array())]).toEqual([0, 255]);
  });

  it('scales low bit depths up and takes the high byte of 16-bit samples', () => {
    // 1-bit gray: pixels 1, 0, 1 packed into one byte (0b1010_0000).
    const oneBit = png({ width: 3, height: 1, colorType: 0, bitDepth: 1, rows: [[0xa0]] });
    const gray = embedImage(oneBit);
    expect(gray.colorSpace).toBe('DeviceGray');
    expect([...inflateSync(gray.data)]).toEqual([255, 0, 255]);
    const rows = [[0x12, 0x34, 0xab, 0xcd, 0, 1]];
    const deep = embedImage(png({ width: 1, height: 1, colorType: 2, bitDepth: 16, rows }));
    expect([...inflateSync(deep.data)]).toEqual([0x12, 0xab, 0]);
  });

  it('honours a gray transparency key', () => {
    const image = embedImage(
      png({ width: 2, height: 1, colorType: 0, rows: [[7, 9]], transparency: [0, 7] }),
    );
    expect([...inflateSync(image.alpha ?? new Uint8Array())]).toEqual([0, 255]);
  });

  it('reverses every PNG row filter', () => {
    const rows = [
      [10, 20, 30, 40],
      [11, 25, 33, 47],
      [200, 3, 90, 255],
      [0, 255, 128, 64],
      [5, 6, 7, 8],
    ];
    const image = embedImage(
      png({ width: 4, height: 5, colorType: 0, rows, filters: [0, 1, 2, 3, 4] }),
    );
    expect([...inflateSync(image.data)]).toEqual(rows.flat());
  });

  it('refuses an interlaced PNG, saying what to do', () => {
    expect(() =>
      embedImage(png({ width: 1, height: 1, colorType: 2, rows: [[0, 0, 0]], interlace: 1 })),
    ).toThrow(/without interlacing/);
  });

  it(`refuses an image wider or taller than ${MAX_IMAGE_SIDE} pixels before decoding it`, () => {
    const wide = png({ width: MAX_IMAGE_SIDE + 1, height: 1, colorType: 0, rows: [[0]] });
    expect(() => readImageInfo(wide)).toThrow(/2000 × 2000/);
    expect(() => embedImage(jpeg({ height: MAX_IMAGE_SIDE + 1 }))).toThrow(/2000 × 2000/);
    expect(MAX_BRANDING_SIDE).toBe(MAX_IMAGE_SIDE);
  });

  it('refuses a truncated PNG', () => {
    const whole = redBluePng();
    expect(() => embedImage(whole.subarray(0, whole.length - 20))).toThrow(ImageError);
  });

  it('fits an image in a box without distorting it', () => {
    expect(fitWithin({ width: 600, height: 100 }, LOGO_BOX)).toEqual({ width: 150, height: 25 });
    expect(fitWithin({ width: 100, height: 100 }, LOGO_BOX)).toEqual({ width: 40, height: 40 });
  });
});

// --- Upload validation --------------------------------------------------------------------

describe('branding upload validation', () => {
  it('accepts a PNG and names it by its hash', () => {
    const bytes = redBluePng();
    const result = validateBrandingImage(bytes);
    expect(result).toEqual({
      ok: true,
      value: {
        format: 'png',
        width: 2,
        height: 1,
        sha256: sha(bytes),
        byteSize: bytes.byteLength,
        contentType: 'image/png',
      },
    });
    expect(brandingObjectPath(ORG, sha(bytes), 'png')).toBe(`org/${ORG}/assets/${sha(bytes)}.png`);
    expect(brandingObjectPath(ORG, sha(bytes), 'jpeg')).toMatch(/\.jpg$/);
  });

  it('refuses an empty file, an oversize file and anything that is not PNG or JPEG', () => {
    expect(validateBrandingImage(new Uint8Array())).toMatchObject({ ok: false });
    const oversize = new Uint8Array(MAX_BRANDING_BYTES + 1);
    oversize.set(redBluePng());
    expect(validateBrandingImage(oversize)).toEqual({
      ok: false,
      error: 'Use an image of 1 MB or smaller.',
    });
    // A GIF renamed .png, or SVG markup sent as image/png, is still not a PNG.
    expect(validateBrandingImage(new TextEncoder().encode('GIF89a\x01\x00\x01\x00'))).toEqual({
      ok: false,
      error: 'Use a PNG or JPEG image.',
    });
  });

  it('refuses a file that only starts like a PNG', () => {
    const fake = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3]);
    expect(validateBrandingImage(fake)).toMatchObject({ ok: false });
  });

  it('builds object names only from a lowercase organization id and a hash', () => {
    expect(() => brandingObjectPath('../other', 'a'.repeat(64), 'png')).toThrow();
    expect(() => brandingObjectPath(ORG, 'not-a-hash', 'png')).toThrow();
    expect(parseBrandingObjectPath(`org/${ORG}/assets/${'a'.repeat(64)}.png`)).toEqual({
      orgId: ORG,
      sha256: 'a'.repeat(64),
    });
    expect(parseBrandingObjectPath(`org/${ORG}/assets/../${'a'.repeat(64)}.png`)).toBeNull();
    expect(parseBrandingObjectPath(`org/${ORG}/logo.png`)).toBeNull();
  });
});

// --- The paid gate ------------------------------------------------------------------------

describe('PDF branding is a Pro and Team feature, gated fail closed', () => {
  beforeEach(() => {
    entitlement.result = { data: null, error: null };
    entitlement.throws = false;
  });

  const current = {
    org_id: ORG,
    plan: 'pro',
    status: 'active',
    paid_through: new Date(Date.now() + 86_400_000).toISOString(),
    cancel_at_period_end: false,
    revoked_at: null,
    revoke_reason: null,
    updated_at: new Date().toISOString(),
  };

  it('belongs to Pro and Team only, and is the paid-only feature they list', () => {
    expect(featurePlans('pdf_branding')).toEqual(['pro', 'team']);
    expect(paidOnlyFeatures('pro').map((feature) => feature.key)).toEqual(['pdf_branding']);
    expect(paidOnlyFeatures('team').map((feature) => feature.key)).toEqual(['pdf_branding', 'api']);
    expect(paidOnlySummary()).toBe('PDF branding and the REST API');
    expect(FEATURES.find((feature) => feature.key === 'pdf_branding')?.label).toBe(
      'PDF branding: your logo and signature',
    );
  });

  it('grants a current paid plan', async () => {
    entitlement.result = { data: current, error: null };
    await expect(hasEntitlement(ORG, 'pdf_branding')).resolves.toBe(true);
  });

  it('refuses without an entitlement row', async () => {
    await expect(hasEntitlement(ORG, 'pdf_branding')).resolves.toBe(false);
  });

  it('refuses when the lookup fails', async () => {
    entitlement.result = { data: null, error: { message: 'relation does not exist' } };
    await expect(hasEntitlement(ORG, 'pdf_branding')).resolves.toBe(false);
  });

  it('refuses when there is no database or session', async () => {
    entitlement.throws = true;
    await expect(hasEntitlement(ORG, 'pdf_branding')).resolves.toBe(false);
  });

  it('refuses a lapsed or revoked plan', async () => {
    entitlement.result = {
      data: { ...current, status: 'cancelled', paid_through: '2020-01-01T00:00:00Z' },
      error: null,
    };
    await expect(hasEntitlement(ORG, 'pdf_branding')).resolves.toBe(false);
    const revokedAt = new Date().toISOString();
    const revoked = { status: 'revoked', revoked_at: revokedAt, revoke_reason: 'refund' };
    entitlement.result = { data: { ...current, ...revoked }, error: null };
    await expect(hasEntitlement(ORG, 'pdf_branding')).resolves.toBe(false);
  });
});

// --- The PDF writer -----------------------------------------------------------------------

describe('images in the PDF writer', () => {
  it('writes an image once with its soft mask and names it in the page resources', () => {
    const fonts = createFontSet();
    const image = embedImage(
      png({ width: 2, height: 1, colorType: 6, rows: [[10, 20, 30, 255, 40, 50, 60, 0]] }),
    );
    const first = new Page(fonts);
    const second = new Page(fonts);
    first.image(image, 42, 700, 20, 10);
    second.image(image, 42, 700, 20, 10);
    const text = asText(renderPdf([first, second], fonts));
    expect(text.match(/\/Subtype \/Image/g)).toHaveLength(2); // the image and its mask
    expect(text).toMatch(/\/SMask \d+ 0 R/);
    expect(text.match(/\/XObject << \/Im0 \d+ 0 R >>/g)).toHaveLength(2);
    expect(text).toContain('q 20.00 0 0 10.00 42.00 700.00 cm /Im0 Do Q');
  });

  it('adds nothing to a document without images', () => {
    const fonts = createFontSet();
    const page = new Page(fonts);
    page.text('Plain', 42, 700);
    const text = asText(renderPdf([page], fonts));
    expect(text).not.toContain('/XObject');
    expect(text).not.toContain('/Subtype /Image');
  });
});

// --- The renderer ---------------------------------------------------------------------------

const logoBytes = png({
  width: 4,
  height: 1,
  colorType: 6,
  rows: [[0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 0, 0, 0, 0, 255]],
});
const signatureBytes = redBluePng();

function asset(bytes: Uint8Array, width: number, height: number) {
  return {
    object_path: `org/${ORG}/assets/${sha(bytes)}.png`,
    sha256: sha(bytes),
    format: 'png',
    width,
    height,
  };
}

function snapshotOf(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    schema_version: 4,
    money_places: 2,
    kind: 'commercial_invoice',
    number: 'CI-2026-0001',
    generated_at: '2026-10-07T10:00:00.000Z',
    supersedes: null,
    issuer: { signatory_name: 'Ana Example', signatory_title: 'Director' },
    shipment: { reference: 'SHP-1', currency: 'EUR', revision: 1 },
    exporter: { name: 'Example Exports Ltd', country_code: 'GB' },
    consignee: { name: 'Example Imports GmbH', country_code: 'DE' },
    notify: null,
    items: [
      {
        position: 1,
        description: 'Widget',
        quantity: 10,
        unit: 'pcs',
        unit_price: 2.5,
        line_total: 25,
      },
    ],
    totals: { quantity: 10, net_weight_kg: null, gross_weight_kg: null, packages: 0, value: 25 },
    ...overrides,
  };
}

const branded = snapshotOf({
  schema_version: 5,
  branding: { logo: asset(logoBytes, 4, 1), signature: asset(signatureBytes, 2, 1) },
});
const images = new Map([
  [sha(logoBytes), logoBytes],
  [sha(signatureBytes), signatureBytes],
]);

describe('renderer dispatch: schema 5 branding, older documents unchanged', () => {
  it('identifies itself as renderer 7', () => {
    expect(RENDERER_VERSION).toBe('tradedocs-pdf/7');
  });

  it('renders a schema 4 document byte for byte the same, whatever images are offered', () => {
    const plain = renderTradeDocument(snapshotOf(), createFontSet());
    expect(renderTradeDocument(snapshotOf(), createFontSet(), images)).toEqual(plain);
    // Branding on a schema 4 snapshot is not part of that schema and is ignored.
    const smuggled = snapshotOf({ branding: branded.branding });
    expect(renderTradeDocument(smuggled, createFontSet(), images)).toEqual(plain);
    expect(brandingAssetsOf(smuggled)).toEqual([]);
    expect(asText(plain)).not.toContain('/XObject');
  });

  it('lays a schema 5 document without branding out exactly as schema 4', () => {
    const plain = documentLayout(snapshotOf(), createFontSet());
    expect(documentLayout(snapshotOf({ schema_version: 5 }), createFontSet())).toEqual(plain);
    expect(documentLayout(withoutBranding(branded), createFontSet())).toEqual(plain);
  });

  it('draws the logo top left on every page, inside its box, keeping its shape', () => {
    const many = {
      ...branded,
      items: Array.from({ length: 60 }, (_, index) => ({
        position: index + 1,
        description: `Widget ${index + 1}`,
        quantity: 1,
        unit: 'pcs',
        unit_price: 1,
        line_total: 1,
      })),
    };
    const pages = documentImages(many, images, createFontSet());
    expect(pages.length).toBeGreaterThan(1);
    for (const page of pages) {
      const logo = page[0];
      expect(logo?.x).toBe(42);
      expect(logo?.width).toBeLessThanOrEqual(LOGO_BOX.width);
      expect(logo?.height).toBeLessThanOrEqual(LOGO_BOX.height);
      expect((logo?.width ?? 0) / (logo?.height ?? 1)).toBeCloseTo(4);
      expect((logo?.y ?? 0) + (logo?.height ?? 0)).toBeLessThanOrEqual(PAGE_HEIGHT);
    }
    // The title moves below the logo rather than under it.
    const [firstPage] = documentLayout(many, createFontSet(), images);
    const title = firstPage?.find((run) => run.text === 'COMMERCIAL INVOICE');
    const logo = pages[0]?.[0];
    expect(title?.y ?? 0).toBeLessThan(logo?.y ?? 0);
  });

  it('draws the signature above the signatory line', () => {
    const pages = documentImages(branded, images, createFontSet());
    // Drawn after the logo, fitted to the signature box: 2 × 1 pixels become 100 × 50 points.
    const signature = (pages.at(-1) ?? []).at(-1);
    expect(signature).toMatchObject({ x: 42, width: 100, height: SIGNATURE_BOX.height });
    const [layout] = documentLayout(branded, createFontSet(), images).slice(-1);
    const name = layout?.find((run) => run.text === 'Ana Example, Director');
    expect(name?.y ?? Infinity).toBeLessThan(signature?.y ?? 0);
  });

  it('embeds the images in the PDF', () => {
    const text = asText(renderTradeDocument(branded, createFontSet(), images));
    expect(text).toContain('/Subtype /Image');
    expect(text).toMatch(/\/XObject << \/Im0 \d+ 0 R/);
  });

  it('refuses to render a branded document without the exact images it recorded', () => {
    expect(() => renderTradeDocument(branded, createFontSet())).toThrow(BrandingUnavailableError);
    const swapped = new Map([
      [sha(logoBytes), signatureBytes],
      [sha(signatureBytes), signatureBytes],
    ]);
    expect(() => renderTradeDocument(branded, createFontSet(), swapped)).toThrow(
      BrandingUnavailableError,
    );
  });

  it('lists the images a branded snapshot needs', () => {
    expect(brandingAssetsOf(branded).map((entry) => entry.sha256)).toEqual([
      sha(logoBytes),
      sha(signatureBytes),
    ]);
    expect(brandingAssetsOf(snapshotOf())).toEqual([]);
  });
});

describe('staleness of branded documents', () => {
  it('marks a branded document stale when its logo changes or would be dropped', () => {
    const relogo = { ...branded, branding: { logo: asset(signatureBytes, 2, 1) } };
    expect(staleReasons(branded, relogo)).toContain('branding');
    expect(staleReasons(branded, snapshotOf())).toContain('branding');
    expect(staleReasons(branded, branded)).not.toContain('branding');
  });

  it('never blames branding on a document issued before schema 5', () => {
    expect(staleReasons(snapshotOf(), branded)).not.toContain('branding');
  });
});
