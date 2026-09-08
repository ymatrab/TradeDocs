/**
 * A minimal ZIP writer.
 *
 * Written out for the same reason the PDF writer was: a document set is the product's
 * deliverable, and its bytes should be produced by code in this repository rather than by
 * a transitive dependency that could change what an archive contains between releases.
 *
 * Entries are stored, not deflated. PDFs are already compressed, so deflating them buys
 * almost nothing and would add a compressor to audit; a stored archive opens in every
 * tool and its checksums stay easy to reason about.
 */

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    table[index] = value >>> 0;
  }
  return table;
})();

export function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    // The mask yields 0..255 and the table holds 256 entries, so the read always lands.
    // The compiler cannot see that, and `?? 0` is the unreachable branch it insists on.
    crc = (CRC_TABLE[(crc ^ byte) & 0xff] ?? 0) ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export type ZipEntry = { name: string; data: Uint8Array; modified?: Date };

/** MS-DOS date and time, which is what the format stores. */
function dosStamp(date: Date): { time: number; date: number } {
  return {
    time:
      (Math.floor(date.getSeconds() / 2) & 0x1f) |
      ((date.getMinutes() & 0x3f) << 5) |
      ((date.getHours() & 0x1f) << 11),
    // The epoch is 1980; anything earlier cannot be represented, so it is clamped.
    date:
      (date.getDate() & 0x1f) |
      (((date.getMonth() + 1) & 0x0f) << 5) |
      ((Math.max(0, date.getFullYear() - 1980) & 0x7f) << 9),
  };
}

class ByteWriter {
  private parts: Uint8Array[] = [];
  length = 0;

  push(bytes: Uint8Array): void {
    this.parts.push(bytes);
    this.length += bytes.length;
  }

  u16(value: number): void {
    this.push(new Uint8Array([value & 0xff, (value >>> 8) & 0xff]));
  }

  u32(value: number): void {
    this.push(
      new Uint8Array([
        value & 0xff,
        (value >>> 8) & 0xff,
        (value >>> 16) & 0xff,
        (value >>> 24) & 0xff,
      ]),
    );
  }

  concat(): Uint8Array {
    const result = new Uint8Array(this.length);
    let offset = 0;
    for (const part of this.parts) {
      result.set(part, offset);
      offset += part.length;
    }
    return result;
  }
}

/**
 * Builds a ZIP archive from entries already in memory.
 *
 * A document set is a handful of PDFs, so holding it in memory is honest; a streaming
 * writer would be the right answer only for archives large enough that this route should
 * refuse them outright instead.
 */
export function createZip(entries: readonly ZipEntry[]): Uint8Array {
  const encoder = new TextEncoder();
  const body = new ByteWriter();
  const directory = new ByteWriter();

  for (const entry of entries) {
    const name = encoder.encode(entry.name);
    const checksum = crc32(entry.data);
    const stamp = dosStamp(entry.modified ?? new Date());
    const offset = body.length;

    body.u32(0x04034b50); // local file header
    body.u16(20); // version needed
    body.u16(0x0800); // flags: names are UTF-8
    body.u16(0); // stored
    body.u16(stamp.time);
    body.u16(stamp.date);
    body.u32(checksum);
    body.u32(entry.data.length);
    body.u32(entry.data.length);
    body.u16(name.length);
    body.u16(0); // no extra field
    body.push(name);
    body.push(entry.data);

    directory.u32(0x02014b50); // central directory header
    directory.u16(20); // version made by
    directory.u16(20); // version needed
    directory.u16(0x0800);
    directory.u16(0);
    directory.u16(stamp.time);
    directory.u16(stamp.date);
    directory.u32(checksum);
    directory.u32(entry.data.length);
    directory.u32(entry.data.length);
    directory.u16(name.length);
    directory.u16(0); // extra
    directory.u16(0); // comment
    directory.u16(0); // disk
    directory.u16(0); // internal attributes
    directory.u32(0); // external attributes
    directory.u32(offset);
    directory.push(name);
  }

  const end = new ByteWriter();
  end.u32(0x06054b50); // end of central directory
  end.u16(0); // this disk
  end.u16(0); // disk with the directory
  end.u16(entries.length);
  end.u16(entries.length);
  end.u32(directory.length);
  end.u32(body.length);
  end.u16(0); // comment length

  const archive = new Uint8Array(body.length + directory.length + end.length);
  archive.set(body.concat(), 0);
  archive.set(directory.concat(), body.length);
  archive.set(end.concat(), body.length + directory.length);
  return archive;
}

/**
 * Replaces anything that would make a file name awkward or unsafe once extracted.
 * Document numbers are already tame, but a name is a name and this route must not be the
 * one that writes a path separator into an archive.
 */
export function safeFileName(value: string, fallback = 'document'): string {
  const cleaned = value
    .normalize('NFKD')
    .replace(/[^\w.\- ]+/g, '-')
    .replace(/\s+/g, ' ')
    .replace(/^[.\-\s]+|[.\-\s]+$/g, '')
    .slice(0, 80);
  return cleaned || fallback;
}
