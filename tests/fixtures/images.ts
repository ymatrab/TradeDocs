import { crc32, deflateSync } from 'node:zlib';

/**
 * Tiny synthetic PNG and JPEG files, built byte by byte so each test states exactly what it
 * feeds the image reader. Nothing here is a real photograph or logo.
 */

function u32(value: number): number[] {
  return [(value >>> 24) & 0xff, (value >>> 16) & 0xff, (value >>> 8) & 0xff, value & 0xff];
}

function chunk(type: string, data: Uint8Array | number[]): number[] {
  const body = [...type].map((character) => character.charCodeAt(0));
  const bytes = Uint8Array.from([...body, ...data]);
  return [...u32(data.length), ...bytes, ...u32(crc32(bytes))];
}

export type PngOptions = {
  width: number;
  height: number;
  /** 0 gray, 2 RGB, 3 palette, 4 gray + alpha, 6 RGBA. */
  colorType: number;
  bitDepth?: number;
  /** Unfiltered scanlines, one array of bytes per row (already packed for bit depth). */
  rows: number[][];
  /** The filter type each row is encoded with (default 0, none). */
  filters?: number[];
  palette?: number[];
  transparency?: number[];
  interlace?: number;
};

function paeth(left: number, up: number, upLeft: number): number {
  const estimate = left + up - upLeft;
  const a = Math.abs(estimate - left);
  const b = Math.abs(estimate - up);
  const c = Math.abs(estimate - upLeft);
  if (a <= b && a <= c) return left;
  return b <= c ? up : upLeft;
}

/** Applies a PNG filter to a row, the way an encoder would. */
function filterRow(row: number[], previous: number[] | null, filter: number, bpp: number) {
  return row.map((value, index) => {
    const left = index >= bpp ? (row[index - bpp] ?? 0) : 0;
    const up = previous ? (previous[index] ?? 0) : 0;
    const upLeft = previous && index >= bpp ? (previous[index - bpp] ?? 0) : 0;
    const predicted =
      filter === 1
        ? left
        : filter === 2
          ? up
          : filter === 3
            ? (left + up) >> 1
            : filter === 4
              ? paeth(left, up, upLeft)
              : 0;
    return (value - predicted) & 0xff;
  });
}

const CHANNELS: Record<number, number> = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 };

export function png(options: PngOptions): Uint8Array {
  const depth = options.bitDepth ?? 8;
  const bpp = Math.max(1, Math.ceil(((CHANNELS[options.colorType] ?? 1) * depth) / 8));
  const raw: number[] = [];
  options.rows.forEach((row, index) => {
    const filter = options.filters?.[index] ?? 0;
    const previous = index > 0 ? (options.rows[index - 1] ?? null) : null;
    raw.push(filter, ...filterRow(row, previous, filter, bpp));
  });
  const header = [
    ...u32(options.width),
    ...u32(options.height),
    depth,
    options.colorType,
    0,
    0,
    options.interlace ?? 0,
  ];
  return Uint8Array.from([
    0x89,
    0x50,
    0x4e,
    0x47,
    0x0d,
    0x0a,
    0x1a,
    0x0a,
    ...chunk('IHDR', header),
    ...(options.palette ? chunk('PLTE', options.palette) : []),
    ...(options.transparency ? chunk('tRNS', options.transparency) : []),
    ...chunk('IDAT', deflateSync(Uint8Array.from(raw))),
    ...chunk('IEND', []),
  ]);
}

/** A 2 × 1 opaque RGB PNG: one red pixel, one blue. */
export function redBluePng(): Uint8Array {
  return png({ width: 2, height: 1, colorType: 2, rows: [[255, 0, 0, 0, 0, 255]] });
}

/** A JPEG's header segments only: SOI, an APP0, then a frame header (SOF) and EOI. */
export type JpegOptions = {
  width?: number;
  height?: number;
  components?: number;
  /** The frame marker: 0xC0 baseline, 0xC2 progressive, 0xC9 arithmetic. */
  marker?: number;
  precision?: number;
};

export function jpeg(options: JpegOptions = {}): Uint8Array {
  const { width = 300, height = 120, components = 3, marker = 0xc0, precision = 8 } = options;
  const app0 = [0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 1, 1, 0, 0, 1, 0, 1, 0, 0];
  const frame = [
    0xff,
    marker,
    0x00,
    8 + components * 3,
    precision,
    (height >> 8) & 0xff,
    height & 0xff,
    (width >> 8) & 0xff,
    width & 0xff,
    components,
    ...Array.from({ length: components }, (_, index) => [index + 1, 0x11, 0]).flat(),
  ];
  // A fill byte before the frame marker, which a reader must skip.
  return Uint8Array.from([0xff, 0xd8, ...app0, 0xff, ...frame, 0xff, 0xd9]);
}
