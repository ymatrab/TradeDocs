import { TrueTypeFont } from './truetype';

/**
 * A minimal PDF writer with an embedded Unicode font.
 *
 * Trade documents carry party names, addresses and goods descriptions in whatever script the
 * parties use, so the base-14 fonts are not enough: they are Latin-1 only and would silently
 * mangle a Polish or Ukrainian consignee. The renderer embeds a real face instead and writes
 * text as glyph identifiers, subsetting the font to the glyphs a document actually uses.
 */

export const PAGE_WIDTH = 595.28; // A4 at 72dpi
export const PAGE_HEIGHT = 841.89;

export type FontName = 'regular' | 'bold';

const REPLACEMENT = 0xfffd;

/** The two faces a document uses, and the glyphs each has been asked for. */
export class FontSet {
  private readonly used: Record<FontName, Map<number, number>> = {
    regular: new Map(),
    bold: new Map(),
  };

  constructor(
    readonly regular: TrueTypeFont,
    readonly bold: TrueTypeFont,
  ) {}

  face(name: FontName): TrueTypeFont {
    return name === 'bold' ? this.bold : this.regular;
  }

  /**
   * Maps text to glyphs, recording what the subset must contain. A character the face cannot
   * represent becomes the replacement glyph rather than a wrong one.
   */
  encode(text: string, name: FontName): { glyphs: number[]; width: number } {
    const face = this.face(name);
    const glyphs: number[] = [];
    let width = 0;
    for (const character of text.normalize('NFC')) {
      const codePoint = character.codePointAt(0) ?? REPLACEMENT;
      const resolved = face.has(codePoint) ? codePoint : REPLACEMENT;
      const glyph = face.glyphFor(resolved);
      glyphs.push(glyph.id);
      width += face.widthOf(glyph.id);
      this.used[name].set(glyph.id, resolved);
    }
    return { glyphs, width };
  }

  measure(text: string, size: number, name: FontName = 'regular'): number {
    return (this.encode(text, name).width * size) / 1000;
  }

  usedGlyphs(name: FontName): Map<number, number> {
    return this.used[name];
  }
}

/** Breaks text to a width at word boundaries, keeping a word that cannot fit on its own line. */
export function wrap(
  fonts: FontSet,
  text: string,
  width: number,
  size: number,
  font: FontName = 'regular',
): string[] {
  const lines: string[] = [];
  for (const paragraph of text.split('\n')) {
    let line = '';
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const candidate = line ? `${line} ${word}` : word;
      if (fonts.measure(candidate, size, font) <= width || !line) {
        line = candidate;
      } else {
        lines.push(line);
        line = word;
      }
    }
    lines.push(line);
  }
  return lines.length > 0 ? lines : [''];
}

export class Page {
  private readonly operations: string[] = [];

  constructor(private readonly fonts: FontSet) {}

  text(
    value: string,
    x: number,
    y: number,
    options: { size?: number; font?: FontName; align?: 'left' | 'right' | 'center' } = {},
  ): void {
    if (!value) return;
    const { size = 9, font = 'regular', align = 'left' } = options;
    const { glyphs, width: rawWidth } = this.fonts.encode(value, font);
    const width = (rawWidth * size) / 1000;
    const start = align === 'right' ? x - width : align === 'center' ? x - width / 2 : x;
    const hex = glyphs.map((glyph) => glyph.toString(16).padStart(4, '0')).join('');
    const resource = font === 'bold' ? '/F2' : '/F1';
    this.operations.push(
      `BT ${resource} ${size} Tf 1 0 0 1 ${start.toFixed(2)} ${y.toFixed(2)} Tm <${hex}> Tj ET`,
    );
  }

  line(x1: number, y1: number, x2: number, y2: number, weight = 0.5, grey = 0.72): void {
    this.operations.push(
      `q ${grey} G ${weight} w ${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S Q`,
    );
  }

  rect(x: number, y: number, width: number, height: number, grey = 0.94): void {
    this.operations.push(
      `q ${grey} g ${x.toFixed(2)} ${y.toFixed(2)} ${width.toFixed(2)} ${height.toFixed(2)} re f Q`,
    );
  }

  build(): string {
    return this.operations.join('\n');
  }
}

function bytes(value: string): Uint8Array {
  return new TextEncoder().encode(value);
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

/** Lets a reader search and copy text out of the document rather than seeing glyph numbers. */
function toUnicodeCMap(used: Map<number, number>): string {
  const entries = [...used.entries()].filter(([, codePoint]) => codePoint !== 0);
  const lines = entries.map(
    ([glyph, codePoint]) =>
      `<${glyph.toString(16).padStart(4, '0')}> <${codePoint
        .toString(16)
        .padStart(4, '0')
        .toUpperCase()}>`,
  );
  const chunks: string[] = [];
  for (let index = 0; index < lines.length; index += 100) {
    const slice = lines.slice(index, index + 100);
    chunks.push(`${slice.length} beginbfchar\n${slice.join('\n')}\nendbfchar`);
  }
  return [
    '/CIDInit /ProcSet findresource begin',
    '12 dict begin',
    'begincmap',
    '/CIDSystemInfo << /Registry (Adobe) /Ordering (UCS) /Supplement 0 >> def',
    '/CMapName /Adobe-Identity-UCS def',
    '/CMapType 2 def',
    '1 begincodespacerange',
    '<0000> <FFFF>',
    'endcodespacerange',
    ...chunks,
    'endcmap',
    'CMapName currentdict /CMap defineresource pop',
    'end',
    'end',
  ].join('\n');
}

function widthArray(face: TrueTypeFont, used: Map<number, number>): string {
  const ids = [...used.keys()].sort((a, b) => a - b);
  const runs: string[] = [];
  let index = 0;
  while (index < ids.length) {
    const start = ids[index] as number;
    const widths: string[] = [];
    let previous = start - 1;
    while (index < ids.length && (ids[index] as number) === previous + 1) {
      widths.push(face.widthOf(ids[index] as number).toFixed(0));
      previous = ids[index] as number;
      index += 1;
    }
    runs.push(`${start} [${widths.join(' ')}]`);
  }
  return runs.join(' ');
}

/** Assembles pages and the embedded font subsets into a PDF file. */
export function renderPdf(pages: readonly Page[], fonts: FontSet): Uint8Array {
  const objects: { body: string; stream?: Uint8Array }[] = [];
  const add = (body: string, stream?: Uint8Array): number => {
    objects.push({ body, stream });
    return objects.length; // object numbers are 1-based
  };

  const catalogId = add('');
  const pagesId = add('');

  const fontIds: Record<FontName, number> = { regular: 0, bold: 0 };
  for (const name of ['regular', 'bold'] as const) {
    const face = fonts.face(name);
    const used = fonts.usedGlyphs(name);
    // A face a document never used still needs an object, because the page resources name it.
    const subset = face.subset(used.keys());
    const fileId = add(`<< /Length ${subset.byteLength} /Length1 ${subset.byteLength} >>`, subset);
    const unicode = bytes(toUnicodeCMap(used));
    const unicodeId = add(`<< /Length ${unicode.byteLength} >>`, unicode);
    const scale = 1000 / face.unitsPerEm;
    const descriptorId = add(
      `<< /Type /FontDescriptor /FontName /NotoSans${name === 'bold' ? '-Bold' : ''} ` +
        `/Flags 4 /FontBBox [${face.bbox.map((value) => Math.round(value * scale)).join(' ')}] ` +
        `/ItalicAngle 0 /Ascent ${Math.round(face.ascent * scale)} ` +
        `/Descent ${Math.round(face.descent * scale)} /CapHeight ${Math.round(face.capHeight * scale)} ` +
        `/StemV ${name === 'bold' ? 140 : 80} /FontFile2 ${fileId} 0 R >>`,
    );
    const descendantId = add(
      `<< /Type /Font /Subtype /CIDFontType2 /BaseFont /NotoSans${name === 'bold' ? '-Bold' : ''} ` +
        `/CIDSystemInfo << /Registry (Adobe) /Ordering (Identity) /Supplement 0 >> ` +
        `/FontDescriptor ${descriptorId} 0 R /DW 1000 /W [${widthArray(face, used)}] ` +
        `/CIDToGIDMap /Identity >>`,
    );
    fontIds[name] = add(
      `<< /Type /Font /Subtype /Type0 /BaseFont /NotoSans${name === 'bold' ? '-Bold' : ''} ` +
        `/Encoding /Identity-H /DescendantFonts [${descendantId} 0 R] /ToUnicode ${unicodeId} 0 R >>`,
    );
  }

  const pageIds: number[] = [];
  for (const page of pages) {
    const stream = bytes(page.build());
    const contentId = add(`<< /Length ${stream.byteLength} >>`, stream);
    pageIds.push(
      add(
        `<< /Type /Page /Parent ${pagesId} 0 R ` +
          `/MediaBox [0 0 ${PAGE_WIDTH.toFixed(2)} ${PAGE_HEIGHT.toFixed(2)}] ` +
          `/Resources << /Font << /F1 ${fontIds.regular} 0 R /F2 ${fontIds.bold} 0 R >> >> ` +
          `/Contents ${contentId} 0 R >>`,
      ),
    );
  }

  objects[catalogId - 1] = { body: `<< /Type /Catalog /Pages ${pagesId} 0 R >>` };
  objects[pagesId - 1] = {
    body: `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`,
  };

  const chunks: Uint8Array[] = [bytes('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n')];
  let length = chunks[0]?.byteLength ?? 0;
  const offsets: number[] = [];

  objects.forEach((object, index) => {
    offsets.push(length);
    const head = bytes(`${index + 1} 0 obj\n${object.body}\n`);
    chunks.push(head);
    length += head.byteLength;
    if (object.stream) {
      const open = bytes('stream\n');
      const close = bytes('\nendstream\n');
      chunks.push(open, object.stream, close);
      length += open.byteLength + object.stream.byteLength + close.byteLength;
    }
    const tail = bytes('endobj\n');
    chunks.push(tail);
    length += tail.byteLength;
  });

  const xrefOffset = length;
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets) xref += `${offset.toString().padStart(10, '0')} 00000 n \n`;
  xref += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  chunks.push(bytes(xref));

  return concat(chunks);
}
