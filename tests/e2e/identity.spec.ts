import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Service-mode suite. It runs only where a database is configured; the foundation gate
// starts no database and skips this file.
test.skip(process.env.APPLICATION_MODE !== 'service', 'Identity requires a configured database.');

const run = Date.now();
let sequence = 0;
function newEmail(): string {
  sequence += 1;
  return `e2e-${run}-${sequence}@example.test`;
}
// Unique per run: sign-up refuses passwords found in known breaches (HIBP).
const password = `Td-e2e-${run}-harbour-ledger`;

async function signUp(page: Page, email: string): Promise<void> {
  await page.goto('/sign-up');
  await page.getByLabel('Email address').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Create account' }).click();
  await page.waitForURL('**/app');
}

async function signIn(page: Page, email: string, secret = password): Promise<void> {
  await page.goto('/sign-in');
  await page.getByLabel('Email address').fill(email);
  await page.getByLabel('Password').fill(secret);
  await page.getByRole('button', { name: 'Sign in' }).click();
}

async function createOrganization(page: Page, name: string): Promise<string> {
  await page.getByLabel('Organization name').fill(name);
  await page.getByRole('button', { name: 'Create organization' }).click();
  await page.waitForURL(/\/app\/[0-9a-f-]{36}\/members$/);
  const id = new URL(page.url()).pathname.split('/')[2];
  expect(id).toBeTruthy();
  return id as string;
}

/** Creates an invitation on the members page and returns the hand-off link it shows. */
async function invite(page: Page, email: string, role?: 'Administrator' | 'Member') {
  await page.getByLabel('Email address').fill(email);
  if (role) await page.getByLabel('Role', { exact: true }).selectOption({ label: role });
  await page.getByRole('button', { name: 'Create invitation' }).click();
  const link = page.getByTestId('invitation-link');
  await expect(link).toBeVisible();
  return ((await link.textContent()) ?? '').trim();
}

/**
 * The newest link of a kind in the local stack's test mailbox (Mailpit, or Inbucket on older
 * Supabase CLIs). Only CI's disposable stack has one; tests that need it skip without it.
 */
async function emailLink(request: APIRequestContext, to: string, kind: string): Promise<string> {
  const base = process.env.E2E_MAILBOX_URL as string;
  const pattern = new RegExp(`https?://[^"'\\s<>]+/auth/confirm\\?[^"'\\s<>]*type=${kind}`);
  for (let attempt = 0; attempt < 30; attempt += 1) {
    let body = '';
    const search = await request.get(
      `${base}/api/v1/search?query=${encodeURIComponent(`to:"${to}"`)}`,
    );
    if (search.ok()) {
      const found = (await search.json()) as { messages?: { ID: string }[] };
      const id = found.messages?.[0]?.ID;
      if (id) {
        const message = (await (await request.get(`${base}/api/v1/message/${id}`)).json()) as {
          HTML?: string;
          Text?: string;
        };
        body = `${message.HTML ?? ''} ${message.Text ?? ''}`;
      }
    } else {
      const mailbox = to.split('@')[0] as string;
      const list = await request.get(`${base}/api/v1/mailbox/${mailbox}`);
      if (list.ok()) {
        const items = (await list.json()) as { id: string }[];
        const last = items.at(-1);
        if (last) {
          const message = (await (
            await request.get(`${base}/api/v1/mailbox/${mailbox}/${last.id}`)
          ).json()) as { body?: { html?: string; text?: string } };
          body = `${message.body?.html ?? ''} ${message.body?.text ?? ''}`;
        }
      }
    }
    const match = body.replaceAll('&amp;', '&').match(pattern);
    if (match) return match[0];
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`No ${kind} email arrived for the test address.`);
}

test('a new account can sign up, create an organization and own it', async ({ page }) => {
  await signUp(page, newEmail());
  await expect(page.getByRole('heading', { name: 'Organizations', level: 1 })).toBeVisible();
  await createOrganization(page, 'Meridian Components');
  await expect(page.getByRole('heading', { name: 'Meridian Components', level: 1 })).toBeVisible();
  await expect(page.getByRole('region', { name: /People in/ })).toContainText('Owner');
});

test('a password below the minimum is refused with a specific reason', async ({ page }) => {
  await page.goto('/sign-up');
  await page.getByLabel('Email address').fill(newEmail());
  await page.getByLabel('Password').fill('short');
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page.getByText('Use at least 12 characters.')).toBeVisible();
  await expect(page).toHaveURL(/\/sign-up$/);
});

test('an unknown password reports nothing about whether the account exists', async ({ page }) => {
  await signIn(page, 'definitely-not-registered@example.test');
  await expect(
    page.getByText('That email and password combination does not match an account.'),
  ).toBeVisible();
});

test('signing up with an address that already has an account reveals nothing', async ({
  page,
}) => {
  const email = newEmail();
  await signUp(page, email);
  await page.context().clearCookies();
  await page.goto('/sign-up');
  await page.getByLabel('Email address').fill(email);
  await page.getByLabel('Password').fill(`${password}-other`);
  await page.getByRole('button', { name: 'Create account' }).click();
  // The same "check your inbox" a new address gets, with a resend on a cooldown.
  await expect(page.getByRole('heading', { name: 'Check your inbox' })).toBeVisible();
  await expect(
    page.getByRole('button', { name: /Resend the link \(available in/ }),
  ).toBeDisabled();
});

test('a signed-out visitor is sent to sign in rather than shown the workspace', async ({
  page,
}) => {
  await page.goto('/app');
  await expect(page).toHaveURL(/\/sign-in$/);
});

test('signing in returns the visitor to the page they asked for', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const email = newEmail();
  await signUp(page, email);
  await context.clearCookies();

  await page.goto('/app/account');
  await expect(page).toHaveURL(/\/sign-in\?next=%2Fapp%2Faccount$/);
  await page.getByLabel('Email address').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('**/app/account');

  // An off-site or unlisted destination falls back to the workspace.
  await context.clearCookies();
  await page.goto('/sign-in?next=%2F%2Fattacker.invalid');
  await page.getByLabel('Email address').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL(/127\.0\.0\.1:3000\/app$/);
  await context.close();
});

test('one tenant cannot open another tenant’s organization', async ({ browser }) => {
  const owner = await browser.newContext();
  const ownerPage = await owner.newPage();
  await signUp(ownerPage, newEmail());
  const orgId = await createOrganization(ownerPage, 'Nordwind Handels');

  const outsider = await browser.newContext();
  const outsiderPage = await outsider.newPage();
  await signUp(outsiderPage, newEmail());

  // The row policy returns nothing, so the page reports a missing resource. It must not
  // disclose that the organization exists, and must never render its members.
  await outsiderPage.goto(`/app/${orgId}/members`);
  await expect(outsiderPage.getByRole('heading', { level: 1 })).toContainText('isn’t here');
  await expect(outsiderPage.getByText('Nordwind Handels')).toHaveCount(0);

  await owner.close();
  await outsider.close();
});

test('without email delivery an invitation is handed over as a link, honestly labelled', async ({
  browser,
}) => {
  // CI has no Resend key, so this proves the fallback; the emailed path is unit tested.
  const owner = await browser.newContext();
  const ownerPage = await owner.newPage();
  await signUp(ownerPage, newEmail());
  await createOrganization(ownerPage, 'Harbourline Freight');

  const guestEmail = newEmail();
  const acceptLink = await invite(ownerPage, guestEmail);
  await expect(ownerPage.getByText('Send this link yourself')).toBeVisible();
  await expect(
    ownerPage.getByText('Email delivery is not set up on this deployment'),
  ).toBeVisible();
  expect(acceptLink).toMatch(/\/invitations\/accept\?token=[a-f0-9]{64}$/);

  const guest = await browser.newContext();
  const guestPage = await guest.newPage();
  await signUp(guestPage, guestEmail);
  await guestPage.goto(acceptLink);
  await guestPage.getByRole('button', { name: 'Accept invitation' }).click();
  await guestPage.waitForURL(/\/members$/);
  await expect(guestPage.getByRole('heading', { name: 'Harbourline Freight' })).toBeVisible();

  // A second redemption of the same token must fail.
  await guestPage.goto(acceptLink);
  await guestPage.getByRole('button', { name: 'Accept invitation' }).click();
  await expect(guestPage.getByText('This invitation is no longer valid.')).toBeVisible();

  await owner.close();
  await guest.close();
});

test('a revoked or resent invitation link stops working', async ({ browser }) => {
  const owner = await browser.newContext();
  const ownerPage = await owner.newPage();
  await signUp(ownerPage, newEmail());
  await createOrganization(ownerPage, 'Quayside Logistics');

  const guestEmail = newEmail();
  const firstLink = await invite(ownerPage, guestEmail);
  const pending = ownerPage.getByRole('region', { name: 'Invitations awaiting acceptance' });
  await expect(pending).toContainText(guestEmail);

  // Resending issues a new link and retires the old one.
  await pending.getByRole('button', { name: `Resend the invitation to ${guestEmail}` }).click();
  const secondLink = ((await pending.getByTestId('invitation-link').textContent()) ?? '').trim();
  expect(secondLink).not.toBe(firstLink);

  const guest = await browser.newContext();
  const guestPage = await guest.newPage();
  await signUp(guestPage, guestEmail);
  await guestPage.goto(firstLink);
  await guestPage.getByRole('button', { name: 'Accept invitation' }).click();
  await expect(guestPage.getByText('This invitation is no longer valid.')).toBeVisible();

  // Revoking retires the current link too.
  await ownerPage.reload();
  await pending.getByRole('button', { name: 'Revoke' }).click();
  await ownerPage
    .getByRole('dialog')
    .getByRole('button', { name: 'Revoke the invitation' })
    .click();
  await expect(ownerPage.getByText('No invitations are waiting.')).toBeVisible();

  await guestPage.goto(secondLink);
  await guestPage.getByRole('button', { name: 'Accept invitation' }).click();
  await expect(guestPage.getByText('This invitation is no longer valid.')).toBeVisible();

  await owner.close();
  await guest.close();
});

test('an owner can promote a member, and an administrator cannot remove the owner', async ({
  browser,
}) => {
  const owner = await browser.newContext();
  const ownerPage = await owner.newPage();
  await signUp(ownerPage, newEmail());
  const orgId = await createOrganization(ownerPage, 'Tidewater Trading');

  const guestEmail = newEmail();
  const link = await invite(ownerPage, guestEmail);
  const guest = await browser.newContext();
  const guestPage = await guest.newPage();
  await signUp(guestPage, guestEmail);
  await guestPage.goto(link);
  await guestPage.getByRole('button', { name: 'Accept invitation' }).click();
  await guestPage.waitForURL(/\/members$/);
  // A plain member sees no invitation form.
  await expect(guestPage.getByRole('button', { name: 'Create invitation' })).toHaveCount(0);

  await ownerPage.goto(`/app/${orgId}/members`);
  const roleSelect = ownerPage.getByLabel(/^Role for /).last();
  await roleSelect.selectOption({ label: 'Administrator' });
  await ownerPage.getByRole('button', { name: 'Save' }).last().click();
  await expect(ownerPage.getByText('Role updated.')).toBeVisible();

  // The promoted administrator can now invite, but has no control to remove the owner.
  await guestPage.reload();
  await expect(guestPage.getByRole('button', { name: 'Create invitation' })).toBeVisible();
  const people = guestPage.getByRole('region', { name: /People in/ });
  await expect(people.getByRole('button', { name: 'Remove' })).toHaveCount(0);

  await owner.close();
  await guest.close();
});

test('the last owner cannot leave the organization', async ({ page }) => {
  await signUp(page, newEmail());
  await createOrganization(page, 'Solent Exporters');
  // Leaving is destructive, so the button opens a confirmation rather than acting.
  await page.getByRole('button', { name: 'Leave', exact: true }).click();
  const confirmation = page.getByRole('dialog');
  await expect(confirmation).toBeVisible();
  await confirmation.getByRole('button', { name: 'Leave the organization' }).click();
  // The refusal is reported inside the confirmation, which stays open.
  await expect(confirmation).toBeVisible();
  await expect(
    confirmation.getByText('An organization must keep at least one owner.'),
  ).toBeVisible();
});

test('reloading the members page keeps the session', async ({ page }) => {
  await signUp(page, newEmail());
  await createOrganization(page, 'Tallow Bay Trading');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Tallow Bay Trading', level: 1 })).toBeVisible();
});

test('a password reset runs end to end and its link works once', async ({ browser }) => {
  test.skip(!process.env.E2E_MAILBOX_URL, 'Needs the disposable stack’s test mailbox.');
  const email = newEmail();
  const setup = await browser.newContext();
  await signUp(await setup.newPage(), email);
  await setup.close();

  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('/reset-password');
  await page.getByLabel('Email address').fill(email);
  await page.getByRole('button', { name: 'Send the reset link' }).click();
  await expect(
    page.getByText('If that address has an account, a reset link is on its way.'),
  ).toBeVisible();

  const link = await emailLink(page.request, email, 'recovery');
  await page.goto(link);
  await page.waitForURL('**/reset-password/new');
  const replacement = `${password}-renewed`;
  await page.getByLabel('New password').fill(replacement);
  await page.getByRole('button', { name: 'Save the new password' }).click();
  await page.waitForURL('**/reset-password/done');
  await expect(page.getByRole('heading', { name: 'Password updated' })).toBeVisible();
  await page.getByRole('link', { name: 'Continue to your workspace' }).click();
  await page.waitForURL('**/app');

  // The same link a second time is refused, and says how to get a new one.
  await context.clearCookies();
  await page.goto(link);
  await page.waitForURL(/\/reset-password\?link=expired$/);
  await expect(page.getByText('That reset link can’t be used')).toBeVisible();

  // The old password no longer works; the new one does.
  await signIn(page, email);
  await expect(
    page.getByText('That email and password combination does not match an account.'),
  ).toBeVisible();
  await signIn(page, email, replacement);
  await page.waitForURL('**/app');
  await context.close();
});

test('changing the password needs the current one and keeps this session', async ({ page }) => {
  const email = newEmail();
  await signUp(page, email);
  await page.goto('/app/account');
  const form = page.getByRole('region', { name: 'Password' });
  await form.getByLabel('Current password').fill('not-the-password-at-all');
  await form.getByLabel('New password').fill(`${password}-changed`);
  await form.getByRole('button', { name: 'Change password' }).click();
  await expect(form.getByText('That password is not correct.')).toBeVisible();

  await form.getByLabel('Current password').fill(password);
  await form.getByLabel('New password').fill(`${password}-changed`);
  await form.getByRole('button', { name: 'Change password' }).click();
  await expect(form.getByText('Password changed.')).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Account', level: 1 })).toBeVisible();
});

test('account deletion is queued and can be withdrawn', async ({ page }) => {
  await signUp(page, newEmail());
  await page.goto('/app/account');
  // A sensitive action asks for the password again, even inside a live session.
  await page.getByRole('button', { name: 'Delete my account' }).click();

  // Submitting nothing is stopped by the browser, so no request is queued. The action
  // rejects an empty password server-side too, for a caller that skips the form.
  await page.getByRole('button', { name: 'Schedule deletion' }).click();
  await expect(page.getByText('Deletion is scheduled.')).toHaveCount(0);

  await page.getByLabel('Confirm with your password').fill('wrong-password-entirely');
  await page.getByRole('button', { name: 'Schedule deletion' }).click();
  // A rejected password leaves the confirmation open, with the message on the field
  // that has to change rather than on a page the user has been thrown back to.
  const confirmation = page.getByRole('dialog');
  await expect(confirmation).toBeVisible();
  await expect(confirmation.getByText('That password is not correct.')).toBeVisible();

  await page.getByLabel('Confirm with your password').fill(password);
  await page.getByRole('button', { name: 'Schedule deletion' }).click();
  await expect(confirmation).not.toBeVisible();
  await expect(page.getByText('Deletion is scheduled.')).toBeVisible();
  await page.getByRole('button', { name: 'Withdraw the deletion request' }).click();
  await expect(page.getByText('Deletion withdrawn.')).toBeVisible();
});

test('a platform admin finds an account by email, without the address in any URL', async ({
  browser,
}) => {
  const adminEmail = process.env.PLATFORM_ADMIN_EMAILS;
  test.skip(!adminEmail, 'Needs PLATFORM_ADMIN_EMAILS (set by the CI database job).');

  const target = await browser.newContext();
  const targetPage = await target.newPage();
  const targetEmail = newEmail();
  await signUp(targetPage, targetEmail);
  await createOrganization(targetPage, 'Admin Search Exports');
  await target.close();

  // A fixed password, so a retry signs in to the admin account the first attempt created.
  const adminPassword = 'Td-e2e-admin-quayside-ledger-2026';
  const admin = await browser.newContext();
  const adminPage = await admin.newPage();
  await adminPage.goto('/sign-up');
  await adminPage.getByLabel('Email address').fill(adminEmail as string);
  await adminPage.getByLabel('Password').fill(adminPassword);
  await adminPage.getByRole('button', { name: 'Create account' }).click();
  // A first run lands in the workspace; a retry finds the account and gets "check your inbox".
  await Promise.race([
    adminPage.waitForURL('**/app').catch(() => undefined),
    adminPage
      .getByRole('heading', { name: 'Check your inbox' })
      .waitFor()
      .catch(() => undefined),
  ]);
  if (!adminPage.url().endsWith('/app')) {
    await signIn(adminPage, adminEmail as string, adminPassword);
    await adminPage.waitForURL('**/app');
  }

  await adminPage.goto('/admin/users');
  await adminPage.getByLabel('Email address').fill(targetEmail);
  await adminPage.getByRole('button', { name: 'Search', exact: true }).click();
  const result = adminPage.getByRole('link', { name: targetEmail });
  await expect(result).toBeVisible();
  expect(adminPage.url()).not.toContain('@');
  expect(adminPage.url()).not.toContain(encodeURIComponent('@'));

  await result.click();
  await adminPage.waitForURL(/\/admin\/users\/[0-9a-f-]{36}$/);
  await expect(adminPage.getByText('Admin Search Exports')).toBeVisible();
  await expect(
    adminPage.getByRole('region', { name: 'Organizations', exact: true }),
  ).toContainText('Owner');

  // Disabling sign-in takes effect at once, and is reversible.
  await adminPage.getByRole('button', { name: 'Disable sign-in' }).click();
  await adminPage.getByRole('dialog').getByRole('button', { name: 'Disable sign-in' }).click();
  await expect(adminPage.getByText('Sign-in disabled and every open session ended.')).toBeVisible();

  const retry = await browser.newContext();
  const retryPage = await retry.newPage();
  await signIn(retryPage, targetEmail);
  await expect(retryPage.getByText('Sign-in is turned off for this account.')).toBeVisible();

  await adminPage.getByRole('button', { name: 'Enable sign-in' }).click();
  await expect(adminPage.getByText('Sign-in enabled.')).toBeVisible();
  await signIn(retryPage, targetEmail);
  await retryPage.waitForURL('**/app');

  await retry.close();
  await admin.close();
});

test('a non-admin gets a 404 from the admin panel', async ({ page }) => {
  await signUp(page, newEmail());
  const response = await page.goto('/admin/users');
  expect(response?.status()).toBe(404);
});

test('the identity screens pass axe at a mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await signUp(page, newEmail());
  await createOrganization(page, 'Kestrel Shipping');
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});

test('a shipment produces a downloadable document set', async ({ page }) => {
  await signUp(page, newEmail());
  const org = await createOrganization(page, 'Kestrel Shipping');

  await page.goto(`/app/${org}/shipments`);
  await page.getByLabel('Shipment reference').fill('SHP-2026-0001');
  await page.getByRole('button', { name: 'Create shipment' }).click();
  await page.waitForURL(/\/shipments\/[0-9a-f-]{36}$/);

  // A document cannot be produced from an empty shipment.
  await page.getByRole('button', { name: 'Generate document' }).click();
  await expect(page.getByText('Add at least one line before generating a document.')).toBeVisible();

  // The screen now carries several forms that each take a quantity and a weight, so the
  // one being driven is named rather than guessed at by label alone.
  const oneOff = page.getByRole('form', { name: 'Add a one-off line' });
  await oneOff.getByLabel('Description of goods').fill('Industrial bearing housing, cast iron');
  await oneOff.getByLabel('Quantity').fill('1200');
  await oneOff.getByLabel('Unit price').fill('15.50');
  await oneOff.getByLabel('Net weight (kg)').fill('4380');
  await page.getByRole('button', { name: 'Add line' }).click();
  await expect(page.getByText('Line added.')).toBeVisible();

  await page.getByRole('button', { name: 'Generate document' }).click();
  await expect(page.getByText(/Document [A-Z]{2}-[0-9]{4}-[0-9]{4} generated\./)).toBeVisible();

  // The generated document is a real PDF served under the caller's own access.
  const row = page.getByRole('region', { name: /Documents generated/ });
  const href = await row.getByRole('link', { name: /PDF/ }).first().getAttribute('href');
  expect(href).toMatch(/^\/api\/documents\//);
  const response = await page.request.get(href as string);
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/pdf');
  const body = await response.body();
  expect(body.subarray(0, 8).toString('latin1')).toBe('%PDF-1.4');

  // Editing the shipment leaves the sent document intact but visibly stale.
  await page.getByLabel('Port of loading').fill('Rotterdam');
  await page.getByRole('button', { name: 'Save shipment' }).click();
  await expect(
    page.getByText('Documents generated before a change are marked stale.'),
  ).toBeVisible();
  // Scoped to the documents table: 'Stale' also appears in the command palette's suggestions.
  await expect(
    page.getByRole('region', { name: /Documents generated/ }).getByText('Stale'),
  ).toBeVisible();
});
