import { describe, expect, it } from 'vitest';
import { isPlatformAdmin, parseAdminAllowlist } from '@/lib/admin/allowlist';
import { parseServerEnv } from '@/lib/config/schema';
import { CONTACT_LIMITS, HONEYPOT_FIELD, parseContact } from '@/lib/contact/schema';
import { helpEntries } from '@/lib/content/faq';
import { notificationRecipient } from '@/lib/email/contact-notification';
import { resolveChatProvider } from '@/lib/help/chat';
import { searchHelp } from '@/lib/help/search';
import { isPrivatePath } from '@/lib/http/indexing';
import { TO_BE_PROVIDED, isLegalApproved, readLegalIdentity, shown } from '@/lib/legal/identity';
import { LEGAL_PAGES, SITEMAP_PAGES, legalSitemapPages } from '@/lib/seo/site';

const confirmed = '2026-10-01T00:00:00Z';

describe('platform admin allowlist', () => {
  const list = 'Owner@Example.com, ops@example.com\nnot-an-address, ,';

  it('parses addresses case-insensitively and drops malformed entries', () => {
    expect([...parseAdminAllowlist(list)]).toEqual(['owner@example.com', 'ops@example.com']);
    expect(parseAdminAllowlist(undefined).size).toBe(0);
    expect(parseAdminAllowlist('   ').size).toBe(0);
  });

  const owner = { email: 'owner@example.com', email_confirmed_at: confirmed };

  it('admits only a confirmed account whose address is listed exactly', () => {
    expect(isPlatformAdmin(owner, list)).toBe(true);
    expect(isPlatformAdmin({ ...owner, email: 'OWNER@example.com' }, list)).toBe(true);
  });

  it('fails closed', () => {
    // No list, an empty list, no user, an unconfirmed address.
    expect(isPlatformAdmin(owner, undefined)).toBe(false);
    expect(isPlatformAdmin(owner, '')).toBe(false);
    expect(isPlatformAdmin(null, list)).toBe(false);
    expect(isPlatformAdmin({ ...owner, email_confirmed_at: null }, list)).toBe(false);
    // Never a suffix, domain or substring match.
    for (const email of ['x.owner@example.com', 'owner@example.com.evil.test', 'ops@example']) {
      expect(isPlatformAdmin({ ...owner, email }, list)).toBe(false);
    }
    expect(isPlatformAdmin({ ...owner, email: 'a@b.co' }, '@b.co')).toBe(false);
  });
});

describe('contact form validation', () => {
  const valid = {
    name: '  Dana Synthetic ',
    email: ' Dana@Example.TEST ',
    topic: 'question',
    message: 'A synthetic question about the packing list.',
  };

  it('accepts and normalises a real message', () => {
    const result = parseContact(valid);
    expect(result.kind).toBe('valid');
    if (result.kind !== 'valid') return;
    expect(result.data.name).toBe('Dana Synthetic');
    expect(result.data.email).toBe('dana@example.test');
  });

  it('answers a filled honeypot as a trap, whatever else is sent', () => {
    expect(parseContact({ ...valid, [HONEYPOT_FIELD]: 'https://spam.example' }).kind).toBe('trap');
    expect(parseContact({ [HONEYPOT_FIELD]: 'x' }).kind).toBe('trap');
    // An empty or whitespace honeypot is a person.
    expect(parseContact({ ...valid, [HONEYPOT_FIELD]: '   ' }).kind).toBe('valid');
  });

  it('reports each invalid field by name', () => {
    const result = parseContact({ name: '', email: 'nope', topic: 'billing', message: 'short' });
    expect(result.kind).toBe('invalid');
    if (result.kind !== 'invalid') return;
    expect(Object.keys(result.fields).sort()).toEqual(['email', 'message', 'name', 'topic']);
  });

  it('enforces the length bounds the table also enforces', () => {
    const long = (n: number) => 'x'.repeat(n);
    const { message, name } = CONTACT_LIMITS;
    expect(parseContact({ ...valid, message: long(message.max) }).kind).toBe('valid');
    expect(parseContact({ ...valid, message: long(message.max + 1) }).kind).toBe('invalid');
    expect(parseContact({ ...valid, message: long(message.min - 1) }).kind).toBe('invalid');
    expect(parseContact({ ...valid, name: long(name.max + 1) }).kind).toBe('invalid');
    expect(parseContact({ ...valid, email: `${long(250)}@example.test` }).kind).toBe('invalid');
  });

  it('refuses a name that could inject an email header', () => {
    expect(parseContact({ ...valid, name: 'Dana\r\nBcc: x@example.test' }).kind).toBe('invalid');
  });

  it('ignores values of the wrong type', () => {
    expect(parseContact({ ...valid, message: 42 }).kind).toBe('invalid');
  });
});

describe('legal approval state (D-009)', () => {
  const now = new Date('2026-10-06T12:00:00Z');
  const complete = {
    LEGAL_ENTITY_NAME: 'Synthetic Trading Ltd',
    LEGAL_ENTITY_COUNTRY: 'United Kingdom',
    LEGAL_CONTACT_EMAIL: 'Legal@Example.test',
    LEGAL_APPROVED_AT: '2026-10-05',
  };

  it('is approved only with a past date and a complete identity', () => {
    const identity = readLegalIdentity(complete, now);
    expect(isLegalApproved(identity)).toBe(true);
    expect(identity.contactEmail).toBe('legal@example.test');
  });

  it('stays a draft when anything is missing or invalid', () => {
    const drafts = [
      {},
      { ...complete, LEGAL_APPROVED_AT: undefined },
      { ...complete, LEGAL_APPROVED_AT: '' },
      { ...complete, LEGAL_APPROVED_AT: 'yes' },
      { ...complete, LEGAL_APPROVED_AT: '2026-02-30' },
      { ...complete, LEGAL_APPROVED_AT: '2026-12-01' },
      { ...complete, LEGAL_ENTITY_NAME: '  ' },
      { ...complete, LEGAL_ENTITY_COUNTRY: undefined },
      { ...complete, LEGAL_CONTACT_EMAIL: 'not an address' },
      { ...complete, LEGAL_ENTITY_NAME: 'Line\nBreak Ltd' },
    ];
    for (const input of drafts) expect(isLegalApproved(readLegalIdentity(input, now))).toBe(false);
  });

  it('shows a visible placeholder, never an invented value', () => {
    const identity = readLegalIdentity({}, now);
    expect(shown(identity.entityName)).toBe(TO_BE_PROVIDED);
    expect(shown(identity.governingLaw)).toBe(TO_BE_PROVIDED);
    expect(shown('Synthetic Trading Ltd')).toBe('Synthetic Trading Ltd');
  });

  it('keeps draft legal pages out of the sitemap and dates approved ones by approval', () => {
    expect(legalSitemapPages(null)).toEqual([]);
    const approved = legalSitemapPages('2026-10-05');
    expect(approved.map((page) => page.path)).toEqual(LEGAL_PAGES.map((page) => page.path));
    for (const page of approved) expect(page.lastModified).toBe('2026-10-05');
    const always = SITEMAP_PAGES.map((page) => page.path);
    for (const page of LEGAL_PAGES) expect(always).not.toContain(page.path);
    expect(always).toEqual(expect.arrayContaining(['/help', '/contact']));
  });
});

describe('help centre data and search', () => {
  const entries = helpEntries();

  it('collects the answers from across the site once each, with unique ids', () => {
    expect(entries.length).toBeGreaterThan(30);
    expect(new Set(entries.map((entry) => entry.id)).size).toBe(entries.length);
    expect(new Set(entries.map((entry) => entry.q.toLowerCase())).size).toBe(entries.length);
    const sources = new Set(entries.map((entry) => entry.source.href));
    const expected = ['/help', '/tools/invoice-generator', '/tools/incoterms'];
    for (const path of expected) expect(sources).toContain(path);
    for (const entry of entries) expect(isPrivatePath(entry.source.href)).toBe(false);
  });

  it('finds an answer by words in any order and ranks question matches first', () => {
    const results = searchHelp(entries, 'account delete');
    expect(results[0]?.q).toBe('How do I delete my account?');
    expect(searchHelp(entries, 'cbm cubic feet').length).toBeGreaterThan(0);
  });

  it('returns nothing for an empty or unmatched query', () => {
    expect(searchHelp(entries, '')).toEqual([]);
    expect(searchHelp(entries, ' ? ')).toEqual([]);
    expect(searchHelp(entries, 'zzqxv')).toEqual([]);
  });

  it('has no chat vendor until one is approved', () => {
    expect(resolveChatProvider(undefined)).toBe('none');
    expect(resolveChatProvider('intercom')).toBe('none');
    expect(resolveChatProvider(' NONE ')).toBe('none');
  });
});

describe('contact notification recipient', () => {
  const base = {
    APP_ENV: 'test',
    RESEND_API_KEY: 'synthetic-email-test-key',
    EMAIL_FROM: 'a@example.test',
  };

  it('sends nothing without Resend, a sender or a contact address', () => {
    const bare = parseServerEnv({ APP_ENV: 'test' });
    expect(notificationRecipient(bare, 'legal@example.test')).toEqual({ skip: 'not_configured' });
    expect(notificationRecipient(parseServerEnv(base), null)).toEqual({ skip: 'not_configured' });
  });

  it('outside production mails only the sandbox recipient', () => {
    expect(notificationRecipient(parseServerEnv(base), 'legal@example.test')).toEqual({
      skip: 'no_sandbox_recipient',
    });
    expect(
      notificationRecipient(
        parseServerEnv({ ...base, EMAIL_SANDBOX_RECIPIENT: 'sandbox@example.test' }),
        'legal@example.test',
      ),
    ).toEqual({ to: 'sandbox@example.test' });
  });

  it('marks the admin path private', () => {
    expect(isPrivatePath('/admin')).toBe(true);
    expect(isPrivatePath('/admin/messages')).toBe(true);
    expect(isPrivatePath('/administer')).toBe(false);
  });
});
