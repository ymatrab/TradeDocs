import { deflateSync, inflateSync } from 'node:zlib';

/**
 * PNG and JPEG images, read without any dependency and prepared for embedding in a PDF.
 *
 * Only what an organization's logo or signature needs: a JPEG is embedded as it is
 * (DCTDecode), so its bytes in the PDF are the uploaded bytes; a PNG is decoded to 8-bit
 * samples and re-compressed with FlateDecode, its transparency carried as a soft mask
 * (SMask) so a logo on a transparent background prints without a white box.
 *
 * Everything that is not understood is refused with a message a person can act on, never
 * guessed at: an image that prints wrongly on a customs document is worse than none.
 */

/** The longest side accepted, in pixels. Bounds the memory a decode can take. */
export const MAX_IMAGE_SIDE = 2000;

export type ImageFormat = 'png' | 'jpeg';

export class ImageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImageError';
  }
}

export type PdfImage = {
  width: number;
  height: number;
  colorSpace: 'DeviceGray' | 'DeviceRGB';
  filter: 'DCTDecode' | 'FlateDecode';
  /** The image stream as it goes into the PDF, already encoded for `filter`. */
  data: Uint8Array;
  /** An 8-bit, Flate-compressed alpha channel, present only when a pixel is not opaque. */
  alpha?: Uint8Array;
};

const CORRUPT = 'That file could not be read as an image. Save it again as a PNG or JPEG.';
const TOO_LARGE = `Use an image of at most ${MAX_IMAGE_SIDE} × ${MAX_IMAGE_SIDE} pixels.`;

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] as const;

/** The format the bytes really are, by their signature. The file name and type are not asked. */
export function detectImageFormat(bytes: Uint8Array): ImageFormat | null {
  if (bytes.length >= 8 && PNG_SIGNATURE.every((value, index) => bytes[index] === value)) {
    return 'png';
  }
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'jpeg';
  }
  return null;
}

function reader(bytes: Uint8Array) {
  const at = (index: number): number => {
    const value = bytes[index];
    if (value === undefined) throw new ImageError(CORRUPT);
    return value;
  };
  return {
    at,
    u16: (index: number): number => (at(index) << 8) | at(index + 1),
    u32: (index: number): number =>
      ((at(index) << 24) >>> 0) + (at(index + 1) << 16) + (at(index + 2) << 8) + at(index + 3),
  };
}

function checkSize(width: number, height: number): void {
  if (width < 1 || height < 1) throw new ImageError(CORRUPT);
  if (width > MAX_IMAGE_SIDE || height > MAX_IMAGE_SIDE) throw new ImageError(TOO_LARGE);
}

// --- JPEG ---------------------------------------------------------------------------------

type JpegInfo = { width: number; height: number; components: number };

/** Reads the frame header (SOF) for the dimensions and colour components. */
function readJpeg(bytes: Uint8Array): JpegInfo {
  const { at, u16 } = reader(bytes);
  let offset = 2;
  while (offset + 4 <= bytes.length) {
    if (at(offset) !== 0xff) throw new ImageError(CORRUPT);
    let marker = at(offset + 1);
    // Any number of 0xFF fill bytes may precede a marker.
    while (marker === 0xff) {
      offset += 1;
      marker = at(offset + 1);
    }
    offset += 2;
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd8)) continue; // no length
    if (marker === 0xd9 || marker === 0xda) break; // end of image, or scan before any frame
    const length = u16(offset);
    if (length < 2 || offset + length > bytes.length) throw new ImageError(CORRUPT);
    const frame = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);
    if (frame) {
      // Baseline, extended and progressive Huffman JPEGs are what every PDF reader decodes.
      if (marker !== 0xc0 && marker !== 0xc1 && marker !== 0xc2) {
        throw new ImageError(
          'That JPEG uses an uncommon encoding. Save it again as a standard JPEG or as a PNG.',
        );
      }
      if (at(offset + 2) !== 8) {
        throw new ImageError('Use an 8-bit JPEG, or save the image as a PNG.');
      }
      const height = u16(offset + 3);
      const width = u16(offset + 5);
      const components = at(offset + 7);
      checkSize(width, height);
      if (components === 4) {
        throw new ImageError('That JPEG is in CMYK. Save it again in RGB, or as a PNG.');
      }
      if (components !== 1 && components !== 3) throw new ImageError(CORRUPT);
      return { width, height, components };
    }
    offset += length;
  }
  throw new ImageError(CORRUPT);
}

// --- PNG ----------------------------------------------------------------------------------

type PngHeader = {
  width: number;
  height: number;
  bitDepth: number;
  colorType: number;
  interlace: number;
};

type PngChunks = {
  header: PngHeader;
  palette: Uint8Array | null;
  transparency: Uint8Array | null;
  data: Uint8Array;
};

const CHANNELS: Record<number, number> = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 };
const DEPTHS: Record<number, readonly number[]> = {
  0: [1, 2, 4, 8, 16],
  2: [8, 16],
  3: [1, 2, 4, 8],
  4: [8, 16],
  6: [8, 16],
};

function readPngChunks(bytes: Uint8Array): PngChunks {
  const { at, u32 } = reader(bytes);
  let offset = 8;
  let header: PngHeader | null = null;
  let palette: Uint8Array | null = null;
  let transparency: Uint8Array | null = null;
  const data: Uint8Array[] = [];
  let ended = false;

  while (offset + 8 <= bytes.length) {
    const length = u32(offset);
    const type = String.fromCharCode(
      at(offset + 4),
      at(offset + 5),
      at(offset + 6),
      at(offset + 7),
    );
    const start = offset + 8;
    const end = start + length;
    if (end + 4 > bytes.length) throw new ImageError(CORRUPT);
    const body = bytes.subarray(start, end);

    if (type === 'IHDR') {
      if (length !== 13) throw new ImageError(CORRUPT);
      const width = u32(start);
      const height = u32(start + 4);
      checkSize(width, height);
      header = {
        width,
        height,
        bitDepth: at(start + 8),
        colorType: at(start + 9),
        interlace: at(start + 12),
      };
      if (at(start + 10) !== 0 || at(start + 11) !== 0) throw new ImageError(CORRUPT);
    } else if (!header) {
      throw new ImageError(CORRUPT); // IHDR must come first
    } else if (type === 'PLTE') {
      palette = body;
    } else if (type === 'tRNS') {
      transparency = body;
    } else if (type === 'IDAT') {
      data.push(body);
    } else if (type === 'IEND') {
      ended = true;
      break;
    }
    offset = end + 4; // the CRC; the compressed data carries its own checksum
  }

  if (!header || !ended || data.length === 0) throw new ImageError(CORRUPT);
  const total = data.reduce((sum, part) => sum + part.byteLength, 0);
  const joined = new Uint8Array(total);
  let cursor = 0;
  for (const part of data) {
    joined.set(part, cursor);
    cursor += part.byteLength;
  }
  return { header, palette, transparency, data: joined };
}

function paeth(left: number, up: number, upLeft: number): number {
  const estimate = left + up - upLeft;
  const toLeft = Math.abs(estimate - left);
  const toUp = Math.abs(estimate - up);
  const toUpLeft = Math.abs(estimate - upLeft);
  if (toLeft <= toUp && toLeft <= toUpLeft) return left;
  if (toUp <= toUpLeft) return up;
  return upLeft;
}

/** Reverses the per-row PNG filters, in place, returning the rows without filter bytes. */
function unfilter(raw: Uint8Array, rows: number, rowBytes: number, bpp: number): Uint8Array {
  const out = new Uint8Array(rows * rowBytes);
  for (let row = 0; row < rows; row += 1) {
    const filter = raw[row * (rowBytes + 1)];
    const source = row * (rowBytes + 1) + 1;
    const target = row * rowBytes;
    const previous = target - rowBytes;
    for (let index = 0; index < rowBytes; index += 1) {
      const value = raw[source + index] ?? 0;
      const left = index >= bpp ? (out[target + index - bpp] ?? 0) : 0;
      const up = row > 0 ? (out[previous + index] ?? 0) : 0;
      const upLeft = row > 0 && index >= bpp ? (out[previous + index - bpp] ?? 0) : 0;
      let decoded: number;
      switch (filter) {
        case 0:
          decoded = value;
          break;
        case 1:
          decoded = value + left;
          break;
        case 2:
          decoded = value + up;
          break;
        case 3:
          decoded = value + ((left + up) >> 1);
          break;
        case 4:
          decoded = value + paeth(left, up, upLeft);
          break;
        default:
          throw new ImageError(CORRUPT);
      }
      out[target + index] = decoded & 0xff;
    }
  }
  return out;
}

function decodePng(bytes: Uint8Array): PdfImage {
  const { header, palette, transparency, data } = readPngChunks(bytes);
  const { width, height, bitDepth, colorType, interlace } = header;
  const channels = CHANNELS[colorType];
  if (channels === undefined || !DEPTHS[colorType]?.includes(bitDepth)) {
    throw new ImageError(CORRUPT);
  }
  if (interlace !== 0) {
    throw new ImageError(
      'Interlaced PNGs are not supported. Save the image again without interlacing.',
    );
  }
  if (colorType === 3 && !palette) throw new ImageError(CORRUPT);

  const rowBytes = Math.ceil((width * channels * bitDepth) / 8);
  const bpp = Math.max(1, Math.ceil((channels * bitDepth) / 8));
  const expected = height * (rowBytes + 1);
  let raw: Uint8Array;
  try {
    raw = new Uint8Array(inflateSync(data, { maxOutputLength: expected }));
  } catch {
    throw new ImageError(CORRUPT);
  }
  if (raw.byteLength < expected) throw new ImageError(CORRUPT);
  const rows = unfilter(raw, height, rowBytes, bpp);

  const maxValue = (1 << bitDepth) - 1;
  /** The raw value of sample `index` (0-based across the row) of row `row`. */
  const sample = (row: number, index: number): number => {
    const base = row * rowBytes;
    if (bitDepth === 8) return rows[base + index] ?? 0;
    if (bitDepth === 16) {
      return ((rows[base + index * 2] ?? 0) << 8) | (rows[base + index * 2 + 1] ?? 0);
    }
    const bit = index * bitDepth;
    const byte = rows[base + (bit >> 3)] ?? 0;
    return (byte >> (8 - bitDepth - (bit & 7))) & maxValue;
  };
  const to8 = (value: number): number =>
    bitDepth === 16 ? value >> 8 : bitDepth === 8 ? value : Math.round((value * 255) / maxValue);

  const color = colorType === 0 || colorType === 4 ? 1 : 3;
  const pixels = width * height;
  const colorData = new Uint8Array(pixels * color);
  const alphaData = new Uint8Array(pixels);
  let translucent = false;

  const keyed = (offset: number): number | null => {
    if (!transparency || transparency.byteLength < offset + 2) return null;
    return ((transparency[offset] ?? 0) << 8) | (transparency[offset + 1] ?? 0);
  };
  const grayKey = colorType === 0 ? keyed(0) : null;
  const rgbKey =
    colorType === 2 && transparency && transparency.byteLength >= 6
      ? [keyed(0), keyed(2), keyed(4)]
      : null;

  for (let row = 0; row < height; row += 1) {
    for (let column = 0; column < width; column += 1) {
      const pixel = row * width + column;
      const first = column * channels;
      let alpha = 255;
      if (colorType === 3) {
        const entry = sample(row, first);
        if (!palette || entry * 3 + 2 >= palette.byteLength) throw new ImageError(CORRUPT);
        colorData[pixel * 3] = palette[entry * 3] ?? 0;
        colorData[pixel * 3 + 1] = palette[entry * 3 + 1] ?? 0;
        colorData[pixel * 3 + 2] = palette[entry * 3 + 2] ?? 0;
        if (transparency && entry < transparency.byteLength) alpha = transparency[entry] ?? 255;
      } else if (color === 1) {
        const gray = sample(row, first);
        colorData[pixel] = to8(gray);
        if (colorType === 4) alpha = to8(sample(row, first + 1));
        else if (grayKey !== null && gray === grayKey) alpha = 0;
      } else {
        const red = sample(row, first);
        const green = sample(row, first + 1);
        const blue = sample(row, first + 2);
        colorData[pixel * 3] = to8(red);
        colorData[pixel * 3 + 1] = to8(green);
        colorData[pixel * 3 + 2] = to8(blue);
        if (colorType === 6) alpha = to8(sample(row, first + 3));
        else if (rgbKey && red === rgbKey[0] && green === rgbKey[1] && blue === rgbKey[2]) {
          alpha = 0;
        }
      }
      alphaData[pixel] = alpha;
      if (alpha !== 255) translucent = true;
    }
  }

  // A fixed level, so the same image always compresses to the same bytes.
  return {
    width,
    height,
    colorSpace: color === 1 ? 'DeviceGray' : 'DeviceRGB',
    filter: 'FlateDecode',
    data: new Uint8Array(deflateSync(colorData, { level: 6 })),
    alpha: translucent ? new Uint8Array(deflateSync(alphaData, { level: 6 })) : undefined,
  };
}

// --- Public -------------------------------------------------------------------------------

export type ImageInfo = { format: ImageFormat; width: number; height: number };

/** The format and pixel size, from the header alone. Throws ImageError. */
export function readImageInfo(bytes: Uint8Array): ImageInfo {
  const format = detectImageFormat(bytes);
  if (format === 'jpeg') {
    const { width, height } = readJpeg(bytes);
    return { format, width, height };
  }
  if (format === 'png') {
    const { header } = readPngChunks(bytes);
    return { format, width: header.width, height: header.height };
  }
  throw new ImageError('Use a PNG or JPEG image.');
}

/** The image, decoded as far as needed and ready for the PDF writer. Throws ImageError. */
export function embedImage(bytes: Uint8Array): PdfImage {
  const format = detectImageFormat(bytes);
  if (format === 'jpeg') {
    const { width, height, components } = readJpeg(bytes);
    return {
      width,
      height,
      colorSpace: components === 1 ? 'DeviceGray' : 'DeviceRGB',
      filter: 'DCTDecode',
      data: bytes,
    };
  }
  if (format === 'png') return decodePng(bytes);
  throw new ImageError('Use a PNG or JPEG image.');
}

/** The largest size that fits a box without distorting the image. */
export function fitWithin(
  image: { width: number; height: number },
  box: { width: number; height: number },
): { width: number; height: number } {
  const scale = Math.min(box.width / image.width, box.height / image.height);
  return { width: image.width * scale, height: image.height * scale };
}
