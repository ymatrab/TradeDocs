/**
 * TrueType reading and subsetting, enough to embed a font in a PDF.
 *
 * Documents carry party names the base-14 PDF fonts cannot represent, so the renderer
 * embeds a real font instead. Only the glyphs a document actually uses are written into it:
 * the source face is roughly 600 kB, while a typical invoice embeds a few kilobytes.
 *
 * Glyph identifiers are preserved rather than renumbered, so the PDF can declare an identity
 * mapping and no glyph can be attributed to the wrong character.
 */

type Table = { offset: number; length: number };

export type Glyph = { id: number; advance: number };

export class TrueTypeFont {
  private readonly view: DataView;
  private readonly tables = new Map<string, Table>();
  private readonly cmap = new Map<number, number>();
  private readonly advances: number[] = [];

  readonly unitsPerEm: number;
  readonly numGlyphs: number;
  readonly ascent: number;
  readonly descent: number;
  readonly capHeight: number;
  readonly bbox: [number, number, number, number];
  private readonly locaOffsets: number[] = [];

  constructor(readonly data: Uint8Array) {
    this.view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    const tableCount = this.view.getUint16(4);
    for (let index = 0; index < tableCount; index += 1) {
      const entry = 12 + index * 16;
      const tag = String.fromCharCode(...data.subarray(entry, entry + 4));
      this.tables.set(tag, {
        offset: this.view.getUint32(entry + 8),
        length: this.view.getUint32(entry + 12),
      });
    }

    const head = this.required('head');
    this.unitsPerEm = this.view.getUint16(head.offset + 18);
    const indexToLocFormat = this.view.getInt16(head.offset + 50);
    this.bbox = [
      this.view.getInt16(head.offset + 36),
      this.view.getInt16(head.offset + 38),
      this.view.getInt16(head.offset + 40),
      this.view.getInt16(head.offset + 42),
    ];

    const maxp = this.required('maxp');
    this.numGlyphs = this.view.getUint16(maxp.offset + 4);

    const hhea = this.required('hhea');
    this.ascent = this.view.getInt16(hhea.offset + 4);
    this.descent = this.view.getInt16(hhea.offset + 6);
    const numberOfHMetrics = this.view.getUint16(hhea.offset + 34);

    const os2 = this.tables.get('OS/2');
    this.capHeight = os2 && os2.length >= 90 ? this.view.getInt16(os2.offset + 88) : this.ascent;

    const hmtx = this.required('hmtx');
    let advance = 0;
    for (let glyph = 0; glyph < this.numGlyphs; glyph += 1) {
      if (glyph < numberOfHMetrics) advance = this.view.getUint16(hmtx.offset + glyph * 4);
      this.advances.push(advance);
    }

    const loca = this.required('loca');
    for (let index = 0; index <= this.numGlyphs; index += 1) {
      this.locaOffsets.push(
        indexToLocFormat === 0
          ? this.view.getUint16(loca.offset + index * 2) * 2
          : this.view.getUint32(loca.offset + index * 4),
      );
    }

    this.readCmap();
  }

  private required(tag: string): Table {
    const table = this.tables.get(tag);
    if (!table) throw new Error(`The font is missing its ${tag} table.`);
    return table;
  }

  /** Prefers a full-range subtable so characters beyond the BMP still resolve. */
  private readCmap(): void {
    const cmap = this.required('cmap');
    const subtableCount = this.view.getUint16(cmap.offset + 2);
    let best = -1;
    let bestScore = -1;
    for (let index = 0; index < subtableCount; index += 1) {
      const record = cmap.offset + 4 + index * 8;
      const platform = this.view.getUint16(record);
      const encoding = this.view.getUint16(record + 2);
      const offset = cmap.offset + this.view.getUint32(record + 4);
      const format = this.view.getUint16(offset);
      const score =
        platform === 3 && encoding === 10 && format === 12
          ? 3
          : platform === 3 && encoding === 1 && format === 4
            ? 2
            : format === 4 || format === 12
              ? 1
              : 0;
      if (score > bestScore) {
        bestScore = score;
        best = offset;
      }
    }
    if (best < 0) throw new Error('The font has no usable character map.');

    const format = this.view.getUint16(best);
    if (format === 12) {
      const groups = this.view.getUint32(best + 12);
      for (let index = 0; index < groups; index += 1) {
        const group = best + 16 + index * 12;
        const start = this.view.getUint32(group);
        const end = this.view.getUint32(group + 4);
        const startGlyph = this.view.getUint32(group + 8);
        for (let code = start; code <= end; code += 1) {
          this.cmap.set(code, startGlyph + (code - start));
        }
      }
      return;
    }

    const segCount = this.view.getUint16(best + 6) / 2;
    const endCodes = best + 14;
    const startCodes = endCodes + segCount * 2 + 2;
    const idDeltas = startCodes + segCount * 2;
    const idRangeOffsets = idDeltas + segCount * 2;
    for (let segment = 0; segment < segCount; segment += 1) {
      const end = this.view.getUint16(endCodes + segment * 2);
      const start = this.view.getUint16(startCodes + segment * 2);
      const delta = this.view.getInt16(idDeltas + segment * 2);
      const rangeOffset = this.view.getUint16(idRangeOffsets + segment * 2);
      if (start === 0xffff) continue;
      for (let code = start; code <= end && code !== 0x10000; code += 1) {
        let glyph: number;
        if (rangeOffset === 0) {
          glyph = (code + delta) & 0xffff;
        } else {
          const address = idRangeOffsets + segment * 2 + rangeOffset + (code - start) * 2;
          if (address + 1 >= this.data.byteLength) continue;
          const raw = this.view.getUint16(address);
          glyph = raw === 0 ? 0 : (raw + delta) & 0xffff;
        }
        if (glyph !== 0) this.cmap.set(code, glyph);
      }
    }
  }

  /** Returns the glyph for a code point, or glyph 0 when the face cannot represent it. */
  glyphFor(codePoint: number): Glyph {
    const id = this.cmap.get(codePoint) ?? 0;
    return { id, advance: this.advances[id] ?? 0 };
  }

  has(codePoint: number): boolean {
    return this.cmap.has(codePoint);
  }

  /** Advance width in 1000-unit text space, which is what PDF expects. */
  widthOf(glyphId: number): number {
    return ((this.advances[glyphId] ?? 0) * 1000) / this.unitsPerEm;
  }

  private glyphData(glyphId: number): Uint8Array {
    const glyf = this.required('glyf');
    const start = this.locaOffsets[glyphId] ?? 0;
    const end = this.locaOffsets[glyphId + 1] ?? start;
    if (end <= start) return new Uint8Array(0);
    return this.data.subarray(glyf.offset + start, glyf.offset + end);
  }

  /** A composite glyph draws other glyphs, which must travel with it into the subset. */
  private addComponents(glyphId: number, into: Set<number>): void {
    const glyph = this.glyphData(glyphId);
    if (glyph.byteLength < 10) return;
    const view = new DataView(glyph.buffer, glyph.byteOffset, glyph.byteLength);
    if (view.getInt16(0) >= 0) return;

    let cursor = 10;
    for (;;) {
      if (cursor + 4 > glyph.byteLength) return;
      const flags = view.getUint16(cursor);
      const component = view.getUint16(cursor + 2);
      if (!into.has(component)) {
        into.add(component);
        this.addComponents(component, into);
      }
      cursor += 4;
      cursor += flags & 1 ? 4 : 2; // ARG_1_AND_2_ARE_WORDS
      if (flags & 8)
        cursor += 2; // WE_HAVE_A_SCALE
      else if (flags & 0x40)
        cursor += 4; // X_AND_Y_SCALE
      else if (flags & 0x80) cursor += 8; // TWO_BY_TWO
      if (!(flags & 0x20)) return; // MORE_COMPONENTS
    }
  }

  /**
   * Builds a font containing only the requested glyphs. Identifiers are preserved, so the
   * table stays the original length while the outline data shrinks to what is used.
   */
  subset(glyphIds: Iterable<number>): Uint8Array {
    const wanted = new Set<number>([0]);
    for (const id of glyphIds) {
      if (id >= 0 && id < this.numGlyphs) {
        wanted.add(id);
        this.addComponents(id, wanted);
      }
    }

    const parts: Uint8Array[] = [];
    const loca = new Uint8Array((this.numGlyphs + 1) * 4);
    const locaView = new DataView(loca.buffer);
    let offset = 0;
    for (let glyph = 0; glyph < this.numGlyphs; glyph += 1) {
      locaView.setUint32(glyph * 4, offset);
      if (wanted.has(glyph)) {
        const data = this.glyphData(glyph);
        // Glyph records are aligned to two bytes.
        const padded = data.byteLength % 2 === 0 ? data : concat([data, new Uint8Array(1)]);
        parts.push(padded);
        offset += padded.byteLength;
      }
    }
    locaView.setUint32(this.numGlyphs * 4, offset);
    const glyf = concat(parts);

    const head = new Uint8Array(this.slice('head'));
    // The rebuilt loca is always in long format.
    new DataView(head.buffer).setInt16(50, 1);

    return buildSfnt([
      ['head', head],
      ['hhea', this.slice('hhea')],
      ['maxp', this.slice('maxp')],
      ['hmtx', this.slice('hmtx')],
      ['loca', loca],
      ['glyf', glyf],
    ]);
  }

  private slice(tag: string): Uint8Array {
    const table = this.required(tag);
    return this.data.slice(table.offset, table.offset + table.length);
  }
}

function concat(parts: readonly Uint8Array[]): Uint8Array {
  const total = parts.reduce((sum, part) => sum + part.byteLength, 0);
  const out = new Uint8Array(total);
  let cursor = 0;
  for (const part of parts) {
    out.set(part, cursor);
    cursor += part.byteLength;
  }
  return out;
}

function checksum(data: Uint8Array): number {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  let sum = 0;
  for (let index = 0; index + 4 <= data.byteLength; index += 4) {
    sum = (sum + view.getUint32(index)) >>> 0;
  }
  const remainder = data.byteLength % 4;
  if (remainder) {
    let tail = 0;
    for (let index = 0; index < 4; index += 1) {
      tail =
        (tail << 8) | (index < remainder ? (data[data.byteLength - remainder + index] ?? 0) : 0);
    }
    sum = (sum + tail) >>> 0;
  }
  return sum;
}

function buildSfnt(tables: readonly [string, Uint8Array][]): Uint8Array {
  const sorted = [...tables].sort((a, b) => (a[0] < b[0] ? -1 : 1));
  const count = sorted.length;
  const searchRange = 2 ** Math.floor(Math.log2(count)) * 16;
  const header = new Uint8Array(12 + count * 16);
  const view = new DataView(header.buffer);
  view.setUint32(0, 0x00010000);
  view.setUint16(4, count);
  view.setUint16(6, searchRange);
  view.setUint16(8, Math.floor(Math.log2(count)));
  view.setUint16(10, count * 16 - searchRange);

  let offset = header.byteLength;
  const bodies: Uint8Array[] = [];
  sorted.forEach(([tag, data], index) => {
    const entry = 12 + index * 16;
    for (let character = 0; character < 4; character += 1) {
      header[entry + character] = tag.charCodeAt(character);
    }
    view.setUint32(entry + 4, checksum(data));
    view.setUint32(entry + 8, offset);
    view.setUint32(entry + 12, data.byteLength);
    const padding = (4 - (data.byteLength % 4)) % 4;
    bodies.push(padding ? concat([data, new Uint8Array(padding)]) : data);
    offset += data.byteLength + padding;
  });

  return concat([header, ...bodies]);
}
