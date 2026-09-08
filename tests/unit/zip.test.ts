import { describe, expect, it } from 'vitest';
import { createZip, crc32, safeFileName } from '@/lib/zip';

const bytes = (text: string) => new TextEncoder().encode(text);

/** Reads a little-endian unsigned integer, the way the format stores every field. */
function readUint(archive: Uint8Array, offset: number, width: number): number {
  let value = 0;
  for (let index = width - 1; index >= 0; index -= 1) {
    value = value * 256 + archive[offset + index];
  }
  return value;
}

describe('crc32', () => {
  it('matches the published check value for "123456789"', () => {
    expect(crc32(bytes('123456789'))).toBe(0xcbf43926);
  });

  it('is zero for no bytes at all', () => {
    expect(crc32(new Uint8Array())).toBe(0);
  });
});

describe('zip archives', () => {
  it('writes a local header, the stored bytes and an end record', () => {
    const archive = createZip([{ name: 'a.txt', data: bytes('hello') }]);

    expect(readUint(archive, 0, 4)).toBe(0x04034b50);
    // Stored, not deflated: compressed and uncompressed sizes agree.
    expect(readUint(archive, 18, 4)).toBe(5);
    expect(readUint(archive, 22, 4)).toBe(5);
    expect(archive.subarray(archive.length - 22, archive.length - 18)).toEqual(
      new Uint8Array([0x50, 0x4b, 0x05, 0x06]),
    );
  });

  it('records every entry once in the central directory', () => {
    const archive = createZip([
      { name: 'one.pdf', data: bytes('first') },
      { name: 'two.pdf', data: bytes('second') },
      { name: 'manifest.txt', data: bytes('checksums') },
    ]);

    const end = archive.length - 22;
    expect(readUint(archive, end + 8, 2)).toBe(3);
    expect(readUint(archive, end + 10, 2)).toBe(3);
  });

  it('points the central directory at the offset each entry actually starts on', () => {
    const archive = createZip([
      { name: 'one.pdf', data: bytes('first') },
      { name: 'two.pdf', data: bytes('second') },
    ]);

    const end = archive.length - 22;
    const directoryOffset = readUint(archive, end + 16, 4);
    // The second central header sits after the first, whose name is 7 bytes long.
    const secondHeader = directoryOffset + 46 + 7;
    const secondEntryOffset = readUint(archive, secondHeader + 42, 4);
    expect(readUint(archive, secondEntryOffset, 4)).toBe(0x04034b50);
    expect(readUint(archive, secondEntryOffset + 18, 4)).toBe(6);
  });

  it('stores the checksum a reader will verify the bytes against', () => {
    const payload = bytes('a document');
    const archive = createZip([{ name: 'a.pdf', data: payload }]);
    expect(readUint(archive, 14, 4)).toBe(crc32(payload));
  });

  it('marks names as UTF-8 so an accented file name survives extraction', () => {
    const archive = createZip([{ name: 'facturé.pdf', data: bytes('x') }]);
    expect(readUint(archive, 6, 2) & 0x0800).toBe(0x0800);
  });

  it('produces an archive with only an end record when there is nothing to add', () => {
    expect(createZip([])).toHaveLength(22);
  });
});

describe('file naming', () => {
  it('refuses to write a path separator into an archive', () => {
    expect(safeFileName('../../etc/passwd')).not.toContain('/');
    expect(safeFileName('a\\b')).not.toContain('\\');
  });

  it('keeps the shape of an ordinary document number', () => {
    expect(safeFileName('CI-2026-0001')).toBe('CI-2026-0001');
  });

  it('falls back rather than returning a name of nothing', () => {
    expect(safeFileName('...', 'document')).toBe('document');
    expect(safeFileName('')).toBe('document');
  });
});
