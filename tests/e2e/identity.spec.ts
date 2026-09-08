import { expect, test, type Page } from '@playwright/test';
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
const password = 'correct-horse-battery-staple';

async function signUp(page: Page, email: string): Promise<void> {
  await page.goto('/sign-up');
  await page.getByLabel('Email address').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Create account' }).click();
  await page.waitForURL('**/app');
}

async function createOrganization(page: Page, name: string): Promise<string> {
  await page.getByLabel('Organization name').fill(name);
  await page.getByRole('button', { name: 'Create organization' }).click();
  await page.waitForURL(/\/app\/[0-9a-f-]{36}\/members$/);
  const id = new URL(page.url()).pathname.split('/')[2];
  expect(id).toBeTruthy();
  return id as string;
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
  await page.goto('/sign-in');
  await page.getByLabel('Email address').fill('definitely-not-registered@example.test');
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(
    page.getByText('That email and password combination does not match an account.'),
  ).toBeVisible();
});

test('a signed-out visitor is sent to sign in rather than shown the workspace', async ({
  page,
}) => {
  await page.goto('/app');
  await expect(page).toHaveURL(/\/sign-in$/);
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

test('an invitation admits its recipient once and then cannot be replayed', async ({ browser }) => {
  const owner = await browser.newContext();
  const ownerPage = await owner.newPage();
  await signUp(ownerPage, newEmail());
  await createOrganization(ownerPage, 'Harbourline Freight');

  const guestEmail = newEmail();
  await ownerPage.getByLabel('Email address').fill(guestEmail);
  await ownerPage.getByRole('button', { name: 'Create invitation' }).click();

  const link = ownerPage.getByText('/invitations/accept?token=');
  await expect(link).toBeVisible();
  const acceptPath = ((await link.textContent()) ?? '').trim();

  const guest = await browser.newContext();
  const guestPage = await guest.newPage();
  await signUp(guestPage, guestEmail);
  await guestPage.goto(acceptPath);
  await guestPage.getByRole('button', { name: 'Accept invitation' }).click();
  await guestPage.waitForURL(/\/members$/);
  await expect(guestPage.getByRole('heading', { name: 'Harbourline Freight' })).toBeVisible();

  // A second redemption of the same token must fail.
  await guestPage.goto(acceptPath);
  await guestPage.getByRole('button', { name: 'Accept invitation' }).click();
  await expect(guestPage.getByText('This invitation is no longer valid.')).toBeVisible();

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
  await expect(page.getByText('Document generated.')).toBeVisible();

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
  await expect(page.getByText('Documents generated before now are marked stale.')).toBeVisible();
  // Scoped to the documents table: 'Stale' also appears in the command palette's suggestions.
  await expect(
    page.getByRole('region', { name: /Documents generated/ }).getByText('Stale'),
  ).toBeVisible();
});
