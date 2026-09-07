import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { TrueTypeFont } from './truetype';
import { FontSet } from './writer';

/**
 * Loads the embedded document faces once per process. Parsing is the expensive part, so the
 * parsed faces are shared while each render keeps its own record of which glyphs it used.
 */
let parsed: { regular: TrueTypeFont; bold: TrueTypeFont } | null = null;

function load(): { regular: TrueTypeFont; bold: TrueTypeFont } {
  if (!parsed) {
    const directory = join(process.cwd(), 'src', 'lib', 'pdf', 'fonts');
    // Copied into plain arrays: a Node Buffer shares its pooled backing store, and the
    // subsetter writes into the buffers it is handed.
    const read = (name: string) => new Uint8Array(readFileSync(join(directory, name)));
    parsed = {
      regular: new TrueTypeFont(read('NotoSans-Regular.ttf')),
      bold: new TrueTypeFont(read('NotoSans-Bold.ttf')),
    };
  }
  return parsed;
}

export function createFontSet(): FontSet {
  const { regular, bold } = load();
  return new FontSet(regular, bold);
}
