import { createHash } from 'node:crypto';
import { describe, expect, it, vi } from 'vitest';
import { parseServerEnv, type EnvironmentInput } from '@/lib/config/schema';
import { isBanned } from '@/lib/admin/users';
import {
  invitationLink,
  invitationRecipient,
  sendInvitationEmail,
  type InvitationMessage,
} from '@/lib/email/invitation';
import { bearerMatches, cronSecret } from '@/lib/security/job-auth';
import { isBreachedPassword, newPasswordSchema } from '@/lib/security/password';
import { safeNextPath } from '@/lib/security/redirect';
import { verifyChallenge } from '@/lib/security/turnstile';
import {
  callbackUrl,
  emailLinkType,
  expiredLandingFor,
  landingFor,
} from '@/lib/supabase/auth-links';

const base: EnvironmentInput = { APP_ENV: 'test', APP_URL: 'http://127.0.0.1:3000' };
const env = (extra: EnvironmentInput = {}) => parseServerEnv({ ...base, ...extra });

/** A fetch double that records what was sent and answers with the given response. */
function fetchReturning(response: Response | Error) {
  return vi.fn<typeof fetch>(async () => {
    if (response instanceof Error) throw response;
    return response;
  });
}

describe('password rules', () => {
  it('needs at least 12 characters and at most 72 bytes', () => {
    expect(newPasswordSchema.safeParse('a'.repeat(11)).success).toBe(false);
    expect(newPasswordSchema.safeParse('a'.repeat(12)).success).toBe(true);
    expect(newPasswordSchema.safeParse('a'.repeat(72)).success).toBe(true);
    expect(newPasswordSchema.safeParse('a'.repeat(73)).success).toBe(false);
    // Bytes, not characters: bcrypt reads 72 bytes, and "é" is two of them.
    expect(newPasswordSchema.safeParse('é'.repeat(37)).success).toBe(false);
  });
});

describe('breached-password check', () => {
  const candidate = 'synthetic-candidate-passphrase';
  const digest = createHash('sha1').update(candidate).digest('hex').toUpperCase();

  it('sends only the five-character prefix and recognises a listed suffix', async () => {
    const fetcher = fetchReturning(
      new Response(`0000000000000000000000000000000000A:0\r\n${digest.slice(5)}:42\r\n`),
    );
    await expect(isBreachedPassword(candidate, fetcher)).resolves.toBe(true);
    const url = String(fetcher.mock.calls[0]?.[0]);
    expect(url).toBe(`https://api.pwnedpasswords.com/range/${digest.slice(0, 5)}`);
    expect(url).not.toContain(digest.slice(5));
  });

  it('ignores padding entries, which carry a count of zero', async () => {
    const fetcher = fetchReturning(new Response(`${digest.slice(5)}:0\r\n`));
    await expect(isBreachedPassword(candidate, fetcher)).resolves.toBe(false);
  });

  it('reports unknown (null) rather than refusing when the service is down', async () => {
    await expect(isBreachedPassword(candidate, fetchReturning(new Error('down')))).resolves.toBe(
      null,
    );
    await expect(
      isBreachedPassword(candidate, fetchReturning(new Response('', { status: 503 }))),
    ).resolves.toBe(null);
  });
});

describe('Turnstile verification', () => {
  const keys = {
    TURNSTILE_SITE_KEY: 'synthetic-site-key',
    TURNSTILE_SECRET_KEY: 'synthetic-turnstile-secret',
  };

  it('is skipped only when no key is configured', async () => {
    const fetcher = fetchReturning(new Response('{}'));
    await expect(verifyChallenge(env(), null, 'sign_up', null, fetcher)).resolves.toEqual({
      ok: true,
      verified: false,
    });
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('fails closed when a key exists but the secret does not', async () => {
    const result = await verifyChallenge(
      env({ TURNSTILE_SITE_KEY: 'synthetic-site-key' }),
      'token',
      'sign_up',
      null,
      fetchReturning(new Response('{}')),
    );
    expect(result).toEqual({ ok: false, reason: 'misconfigured' });
  });

  it('refuses a missing token without calling Cloudflare', async () => {
    const fetcher = fetchReturning(new Response('{}'));
    const result = await verifyChallenge(env(keys), '', 'contact', null, fetcher);
    expect(result).toEqual({ ok: false, reason: 'missing_token' });
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('accepts a valid token and sends secret, token and attested address', async () => {
    const fetcher = fetchReturning(
      Response.json({ success: true, action: 'sign_in', 'error-codes': [] }),
    );
    const result = await verifyChallenge(env(keys), 'token-1', 'sign_in', '203.0.113.9', fetcher);
    expect(result).toEqual({ ok: true, verified: true });
    const body = new URLSearchParams(String(fetcher.mock.calls[0]?.[1]?.body));
    expect(body.get('secret')).toBe('synthetic-turnstile-secret');
    expect(body.get('response')).toBe('token-1');
    expect(body.get('remoteip')).toBe('203.0.113.9');
  });

  it('refuses a token minted for another action, a forged token and an outage', async () => {
    const other = await verifyChallenge(
      env(keys),
      't',
      'sign_up',
      null,
      fetchReturning(Response.json({ success: true, action: 'contact' })),
    );
    expect(other).toEqual({ ok: false, reason: 'invalid_token' });
    const forged = await verifyChallenge(
      env(keys),
      't',
      'sign_up',
      null,
      fetchReturning(Response.json({ success: false, 'error-codes': ['invalid-input-response'] })),
    );
    expect(forged).toEqual({ ok: false, reason: 'invalid_token' });
    const badSecret = await verifyChallenge(
      env(keys),
      't',
      'sign_up',
      null,
      fetchReturning(Response.json({ success: false, 'error-codes': ['invalid-input-secret'] })),
    );
    expect(badSecret).toEqual({ ok: false, reason: 'misconfigured' });
    const outage = await verifyChallenge(
      env(keys),
      't',
      'sign_up',
      null,
      fetchReturning(new Error('unreachable')),
    );
    expect(outage).toEqual({ ok: false, reason: 'unavailable' });
  });
});

describe('post-sign-in destinations', () => {
  it.each([
    ['/app/1b2c/shipments', '/app/1b2c/shipments'],
    ['/app', '/app'],
    ['/admin/users', '/admin/users'],
    ['/invitations/accept?token=abc', '/invitations/accept?token=abc'],
    ['/reset-password/new', '/reset-password/new'],
  ])('keeps the signed-in page %s', (input, expected) => {
    expect(safeNextPath(input)).toBe(expected);
  });

  it.each([
    '//attacker.invalid',
    'https://attacker.invalid/app',
    '/auth/sign-out',
    '/api/internal/purge-accounts',
    '/application',
    '/administrator',
    '/%2F%2Fattacker.invalid',
    '',
    null,
  ])('falls back to /app for %s', (input) => {
    expect(safeNextPath(input)).toBe('/app');
  });
});

describe('email links', () => {
  it('builds the callback with a destination only when it is not the default', () => {
    expect(callbackUrl(env())).toBe('http://127.0.0.1:3000/auth/callback');
    expect(callbackUrl(env(), '/reset-password/new')).toBe(
      'http://127.0.0.1:3000/auth/callback?next=%2Freset-password%2Fnew',
    );
  });

  it('accepts only known link types and lands each where it belongs', () => {
    expect(emailLinkType('recovery')).toBe('recovery');
    expect(emailLinkType('sms')).toBeNull();
    expect(emailLinkType(null)).toBeNull();
    expect(landingFor('recovery')).toBe('/reset-password/new');
    expect(landingFor('email')).toBe('/app');
    expect(expiredLandingFor('recovery', null)).toBe('/reset-password?link=expired');
    expect(expiredLandingFor(null, '/reset-password/new')).toBe('/reset-password?link=expired');
    expect(expiredLandingFor('email', null)).toBe('/sign-in?link=expired');
  });
});

describe('purge job authentication', () => {
  // Built rather than written out, so it reads as test data and not as a credential.
  const secret = ['synthetic', 'value', 'x'.repeat(24)].join('-');

  it('treats a missing or short secret as not configured', () => {
    expect(cronSecret(undefined)).toBeNull();
    expect(cronSecret('too-short')).toBeNull();
    expect(cronSecret(`  ${secret}  `)).toBe(secret);
  });

  it('accepts only the exact bearer token', () => {
    expect(bearerMatches(`Bearer ${secret}`, secret)).toBe(true);
    expect(bearerMatches(`Bearer ${secret}x`, secret)).toBe(false);
    expect(bearerMatches(secret, secret)).toBe(false);
    expect(bearerMatches(null, secret)).toBe(false);
  });
});

describe('invitation email', () => {
  const message: InvitationMessage = {
    invitationId: '7d1f5b8e-9a2c-4c1e-8f0a-1b2c3d4e5f60',
    attempt: 'created',
    invitee: 'invitee@example.test',
    organization: 'Harbourline Freight',
    role: 'member',
    link: invitationLink('https://app.example.com', 'a'.repeat(64)),
    expiresAt: '2026-10-13T10:00:00Z',
  };
  const email = { RESEND_API_KEY: 'synthetic-email-test-key', EMAIL_FROM: 'TradeDocs <a@b.test>' };

  it('is not sent without Resend, and never to a real inbox outside production', () => {
    expect(invitationRecipient(env(), message.invitee)).toEqual({ skip: 'not_configured' });
    expect(invitationRecipient(env(email), message.invitee)).toEqual({
      skip: 'no_sandbox_recipient',
    });
    const sandboxed = env({ ...email, EMAIL_SANDBOX_RECIPIENT: 'sandbox@example.test' });
    expect(invitationRecipient(sandboxed, 'x@y.z')).toEqual({
      to: 'sandbox@example.test',
      kind: 'sandbox',
    });
  });

  it('builds an absolute single-use link', () => {
    const token = 'a'.repeat(64);
    expect(message.link).toBe(`https://app.example.com/invitations/accept?token=${token}`);
  });

  it('posts to Resend with an idempotency key and reports failures by reason', async () => {
    const configured = env({ ...email, EMAIL_SANDBOX_RECIPIENT: 'sandbox@example.test' });
    const ok = fetchReturning(new Response('{}', { status: 200 }));
    await expect(sendInvitationEmail(configured, message, ok)).resolves.toEqual({
      status: 'sent',
      to: 'sandbox',
    });
    const init = ok.mock.calls[0]?.[1];
    expect(new Headers(init?.headers).get('Idempotency-Key')).toBe(
      `invitation-${message.invitationId}-created`,
    );
    expect(String(init?.body)).toContain(message.link);

    const refused = fetchReturning(new Response('{}', { status: 422 }));
    await expect(sendInvitationEmail(configured, message, refused)).resolves.toEqual({
      status: 'failed',
      reason: 'resend_http_422',
    });
  });
});

describe('admin ban state', () => {
  it('counts a ban only while it is in force', () => {
    const now = Date.parse('2026-10-06T00:00:00Z');
    expect(isBanned(null, now)).toBe(false);
    expect(isBanned('2026-10-05T00:00:00Z', now)).toBe(false);
    expect(isBanned('2126-10-06T00:00:00Z', now)).toBe(true);
  });
});
