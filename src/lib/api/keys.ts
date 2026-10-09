import 'server-only';

import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

/**
 * Organization API keys (D-025).
 *
 * A key is `tdk_` followed by 48 base62 characters (about 285 bits of randomness). It is
 * shown once, when it is created, and never stored: the database keeps only
 * HMAC-SHA-256(API_KEY_PEPPER, key) as hex, plus the first 12 characters as a visible
 * prefix so people can tell their keys apart. A database leak alone therefore yields no
 * usable key, and changing the pepper turns every key off at once (RUNBOOK.md, "API keys").
 *
 * The pepper is read per feature, outside the strict configuration schema: a missing or
 * short value switches the API and key creation off (503), never the deployment.
 */

export const API_KEY_PREFIX = 'tdk_';
const SECRET_LENGTH = 48;
export const VISIBLE_PREFIX_LENGTH = API_KEY_PREFIX.length + 8;
const KEY_PATTERN = /^tdk_[A-Za-z0-9]{48}$/;
const BASE62 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/** The configured pepper, or null when it is missing or shorter than 32 characters. */
export function apiKeyPepper(raw: string | undefined = process.env.API_KEY_PEPPER): string | null {
  const value = raw?.trim();
  return value && value.length >= 32 ? value : null;
}

/** Uniform base62 characters by rejection sampling, so no character is more likely. */
function randomBase62(length: number, random: (size: number) => Uint8Array): string {
  let out = '';
  while (out.length < length) {
    for (const byte of random(length * 2)) {
      // 248 = 4 × 62: bytes at or above it would bias the first characters.
      if (byte < 248) out += BASE62.charAt(byte % 62);
      if (out.length === length) break;
    }
  }
  return out;
}

export type NewApiKey = { key: string; prefix: string; hash: string };

/** A fresh key, its visible prefix and its hash under the pepper. */
export function generateApiKey(
  pepper: string,
  random: (size: number) => Uint8Array = (size) => randomBytes(size),
): NewApiKey {
  const key = API_KEY_PREFIX + randomBase62(SECRET_LENGTH, random);
  return { key, prefix: key.slice(0, VISIBLE_PREFIX_LENGTH), hash: hashApiKey(key, pepper) };
}

export function isWellFormedApiKey(value: string): boolean {
  return KEY_PATTERN.test(value);
}

/** HMAC-SHA-256 of the key under the pepper, as 64 lowercase hex digits. */
export function hashApiKey(key: string, pepper: string): string {
  return createHmac('sha256', pepper).update(key, 'utf8').digest('hex');
}

/** Constant-time check of a presented key against a stored hash. */
export function apiKeyMatches(key: string, storedHash: string, pepper: string): boolean {
  if (!/^[0-9a-f]{64}$/.test(storedHash)) return false;
  const presented = Buffer.from(hashApiKey(key, pepper), 'hex');
  return timingSafeEqual(presented, Buffer.from(storedHash, 'hex'));
}

export type BearerResult =
  { kind: 'missing' } | { kind: 'malformed' } | { kind: 'key'; key: string };

/** Reads `Authorization: Bearer tdk_…`. The scheme is case-insensitive, as RFC 7235 says. */
export function readBearer(header: string | null): BearerResult {
  if (header === null || header.trim() === '') return { kind: 'missing' };
  const match = /^Bearer[ ]+(\S+)[ ]*$/i.exec(header);
  if (!match?.[1]) return { kind: 'malformed' };
  return isWellFormedApiKey(match[1]) ? { kind: 'key', key: match[1] } : { kind: 'malformed' };
}
