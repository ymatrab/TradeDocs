import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  hkdfSync,
  randomBytes,
  timingSafeEqual,
} from 'node:crypto';

/**
 * The cryptography of accounting connections, on node:crypto alone (no dependency).
 *
 * One 32-byte INTEGRATION_TOKEN_KEY is the root. HKDF-SHA-256 derives two independent keys
 * from it, so the key that seals tokens is never the key that signs OAuth state:
 *   - seal:  AES-256-GCM, a fresh 96-bit IV per value, the 128-bit tag checked on open, and
 *            additional authenticated data naming the organization, provider and token kind,
 *            so a ciphertext copied to another row or column does not open.
 *   - state: HMAC-SHA-256 over a versioned JSON payload, compared in constant time.
 *
 * Pure apart from randomness: nothing here reads the environment or does I/O.
 */

const SEAL_VERSION = 'v1';
const STATE_VERSION = 's1';

/** A 32-byte key written as base64 (44 characters) or hex (64), or null when it is neither. */
export function parseTokenKey(raw: string | undefined): Buffer | null {
  const value = raw?.trim();
  if (!value) return null;
  let key: Buffer | null = null;
  if (/^[0-9a-fA-F]{64}$/.test(value)) key = Buffer.from(value, 'hex');
  else if (/^[A-Za-z0-9+/_-]{43}=?$/.test(value)) {
    key = Buffer.from(value.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
  }
  if (!key || key.length !== 32) return null;
  const decoded: Buffer = key;
  // A key of one repeated byte (such as all zeros) is a placeholder, not a secret.
  if (decoded.every((byte) => byte === decoded[0])) return null;
  return decoded;
}

function derive(root: Buffer, purpose: 'seal' | 'state'): Buffer {
  return Buffer.from(hkdfSync('sha256', root, Buffer.alloc(0), `tradedocs/integrations/${purpose}`, 32));
}

function b64url(buffer: Buffer): string {
  return buffer.toString('base64url');
}

/** Seals a token. `context` is bound into the ciphertext (for example "org:provider:refresh"). */
export function sealToken(root: Buffer, plaintext: string, context: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', derive(root, 'seal'), iv);
  cipher.setAAD(Buffer.from(context, 'utf8'));
  const body = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  return [SEAL_VERSION, b64url(iv), b64url(cipher.getAuthTag()), b64url(body)].join('.');
}

/** Opens a sealed token, or null when it was altered, sealed for another context or key. */
export function openToken(root: Buffer, sealed: string, context: string): string | null {
  const parts = sealed.split('.');
  if (parts.length !== 4 || parts[0] !== SEAL_VERSION) return null;
  try {
    const iv = Buffer.from(parts[1] as string, 'base64url');
    const tag = Buffer.from(parts[2] as string, 'base64url');
    const body = Buffer.from(parts[3] as string, 'base64url');
    if (iv.length !== 12 || tag.length !== 16) return null;
    const decipher = createDecipheriv('aes-256-gcm', derive(root, 'seal'), iv);
    decipher.setAAD(Buffer.from(context, 'utf8'));
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(body), decipher.final()]).toString('utf8');
  } catch {
    return null;
  }
}

export function tokenContext(org: string, provider: string, kind: 'access' | 'refresh' | 'verifier') {
  return `${org}:${provider}:${kind}`;
}

// --- OAuth state ------------------------------------------------------------------------

export type StatePayload = {
  /** Random nonce; its SHA-256 keys the single-use server row. */
  n: string;
  /** Organization id. */
  o: string;
  /** Provider id. */
  p: string;
  /** The user who started the flow; the callback must be the same signed-in user. */
  u: string;
  /** Expiry, epoch seconds. */
  e: number;
};

/** Ten minutes: long enough to sign in at the provider, short enough to be useless later. */
export const STATE_TTL_SECONDS = 600;

export function newNonce(): string {
  return b64url(randomBytes(32));
}

export function nonceHash(nonce: string): string {
  return createHash('sha256').update(nonce, 'utf8').digest('hex');
}

function stateMac(root: Buffer, body: string): Buffer {
  return createHmac('sha256', derive(root, 'state')).update(`${STATE_VERSION}.${body}`).digest();
}

export function signState(root: Buffer, payload: StatePayload): string {
  const body = b64url(Buffer.from(JSON.stringify(payload), 'utf8'));
  return `${STATE_VERSION}.${body}.${b64url(stateMac(root, body))}`;
}

export type StateCheck =
  | { ok: true; payload: StatePayload }
  | { ok: false; reason: 'malformed' | 'signature' | 'expired' };

/** Verifies the signature first, then the shape, then the expiry. */
export function verifyState(root: Buffer, token: string, now: Date): StateCheck {
  if (token.length > 2000) return { ok: false, reason: 'malformed' };
  const parts = token.split('.');
  if (parts.length !== 3 || parts[0] !== STATE_VERSION) return { ok: false, reason: 'malformed' };
  const body = parts[1] as string;
  let presented: Buffer;
  try {
    presented = Buffer.from(parts[2] as string, 'base64url');
  } catch {
    return { ok: false, reason: 'malformed' };
  }
  const expected = stateMac(root, body);
  if (presented.length !== expected.length || !timingSafeEqual(presented, expected)) {
    return { ok: false, reason: 'signature' };
  }
  let payload: unknown;
  try {
    payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  } catch {
    return { ok: false, reason: 'malformed' };
  }
  if (!isStatePayload(payload)) return { ok: false, reason: 'malformed' };
  if (now.getTime() >= payload.e * 1000) return { ok: false, reason: 'expired' };
  return { ok: true, payload };
}

function isStatePayload(value: unknown): value is StatePayload {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.n === 'string' &&
    v.n.length >= 32 &&
    v.n.length <= 100 &&
    typeof v.o === 'string' &&
    typeof v.p === 'string' &&
    typeof v.u === 'string' &&
    typeof v.e === 'number' &&
    Number.isFinite(v.e)
  );
}

// --- PKCE (RFC 7636) --------------------------------------------------------------------

export function pkcePair(): { verifier: string; challenge: string } {
  // 48 random bytes give a 64-character verifier (RFC 7636 allows 43 to 128).
  const verifier = b64url(randomBytes(48));
  return { verifier, challenge: pkceChallenge(verifier) };
}

export function pkceChallenge(verifier: string): string {
  return b64url(createHash('sha256').update(verifier, 'ascii').digest());
}
