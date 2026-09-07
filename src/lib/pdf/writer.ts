/**
 * A minimal PDF writer.
 *
 * Trade documents are text, rules and tables on a fixed page, which PDF's base-14 fonts
 * render without embedding anything. Writing this directly keeps the product free of a
 * rendering dependency and its cold-start cost, and keeps the output byte-stable so the same
 * snapshot always produces the same file.
 *
 * Limitation, stated rather than hidden: base-14 Helvetica is encoded with WinAnsi, which
 * covers Latin-1 only. Characters outside it are transliterated where there is an obvious
 * equivalent and replaced with '?' otherwise. Embedding a Unicode face is the upgrade path
 * when non-Latin scripts have to appear on a document.
 */

export const PAGE_WIDTH = 595.28; // A4 at 72dpi
export const PAGE_HEIGHT = 841.89;

export type FontName = 'regular' | 'bold';

// Advance widths per 1000 units for ASCII 32..126.
const HELVETICA = [
  278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556,
  556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556, 1015, 667, 667, 722, 722, 667,
  611, 778, 722, 278, 500, 667, 556, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667,
  667, 611, 278, 278, 278, 469, 556, 333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500,
  222, 833, 556, 556, 556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334, 584,
];
const HELVETICA_BOLD = [
  278, 333, 474, 556, 556, 889, 722, 238, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556,
  556, 556, 556, 556, 556, 556, 556, 333, 333, 584, 584, 584, 611, 975, 722, 722, 722, 722, 667,
  611, 778, 722, 278, 556, 722, 611, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667,
  667, 611, 333, 278, 333, 584, 556, 333, 556, 611, 556, 611, 556, 333, 611, 611, 278, 278, 556,
  278, 889, 611, 611, 611, 611, 389, 556, 333, 611, 556, 778, 556, 556, 500, 389, 280, 389, 584,
];

const transliterations: Record<string, string> = {
  '‘': "'",
  '’': "'",
  '“': '"',
  '”': '"',
  '–': '-',
  '—': '-',
  '…': '...',
  ' ': ' ',
  '−': '-',
};

/** Reduces a string to what WinAnsi can represent, without emitting broken glyphs. */
export function toWinAnsi(value: string): string {
  let out = '';
  for (const character of value.normalize('NFC')) {
    const replacement = transliterations[character];
    if (replacement !== undefined) {
      out += replacement;
      continue;
    }
    const code = character.codePointAt(0) ?? 63;
    out += code >= 32 && code <= 255 ? character : '?';
  }
  return out;
}

export function measure(text: string, size: number, font: FontName = 'regular'): number {
  const widths = font === 'bold' ? HELVETICA_BOLD : HELVETICA;
  let total = 0;
  for (const character of toWinAnsi(text)) {
    const code = character.charCodeAt(0);
    const width = code >= 32 && code <= 126 ? widths[code - 32] : 556;
    total += width ?? 556;
  }
  return (total * size) / 1000;
}

/** Breaks text to a width at word boundaries, keeping a word that cannot fit on its own line. */
export function wrap(
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
      if (measure(candidate, size, font) <= width || !line) {
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

function escapeText(value: string): string {
  let out = '';
  for (const character of toWinAnsi(value)) {
    const code = character.charCodeAt(0);
    if (character === '(' || character === ')' || character === '\\') out += `\\${character}`;
    else if (code < 32 || code > 126) out += `\\${code.toString(8).padStart(3, '0')}`;
    else out += character;
  }
  return out;
}

export class Page {
  private readonly operations: string[] = [];

  text(
    value: string,
    x: number,
    y: number,
    options: { size?: number; font?: FontName; align?: 'left' | 'right' | 'center' } = {},
  ): void {
    if (!value) return;
    const { size = 9, font = 'regular', align = 'left' } = options;
    const resource = font === 'bold' ? '/F2' : '/F1';
    const width = measure(value, size, font);
    const start = align === 'right' ? x - width : align === 'center' ? x - width / 2 : x;
    this.operations.push(
      `BT ${resource} ${size} Tf 1 0 0 1 ${start.toFixed(2)} ${y.toFixed(2)} Tm (${escapeText(value)}) Tj ET`,
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

/** Assembles pages into a PDF file with a correct cross-reference table. */
export function renderPdf(pages: readonly Page[]): Uint8Array {
  const encoder = new TextEncoder();
  const objects: string[] = [];
  const pageCount = pages.length;
  // 1 catalog, 2 page tree, then a content stream and a page object per page, then two fonts.
  const contentIds = pages.map((_, index) => 3 + index * 2);
  const pageIds = pages.map((_, index) => 4 + index * 2);
  const fontRegularId = 3 + pageCount * 2;
  const fontBoldId = fontRegularId + 1;

  objects.push(`<< /Type /Catalog /Pages 2 0 R >>`);
  objects.push(
    `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageCount} >>`,
  );

  pages.forEach((page, index) => {
    const stream = page.build();
    objects.push(`<< /Length ${encoder.encode(stream).length} >>\nstream\n${stream}\nendstream`);
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH.toFixed(2)} ${PAGE_HEIGHT.toFixed(2)}] ` +
        `/Resources << /Font << /F1 ${fontRegularId} 0 R /F2 ${fontBoldId} 0 R >> >> ` +
        `/Contents ${contentIds[index]} 0 R >>`,
    );
  });

  objects.push(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>`);
  objects.push(
    `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>`,
  );

  let body = '%PDF-1.4\n';
  const offsets: number[] = [];
  objects.forEach((object, index) => {
    offsets.push(encoder.encode(body).length);
    body += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = encoder.encode(body).length;
  body += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets) body += `${offset.toString().padStart(10, '0')} 00000 n \n`;
  body += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return encoder.encode(body);
}
