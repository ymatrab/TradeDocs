import { expect, test, type Page } from '@playwright/test';

/**
 * E-signature (D-025) without a provider connected, which is every CI environment: no
 * DROPBOX_SIGN_API_KEY is ever set here, so nothing may claim the feature, the callback must
 * not exist, and the signed-copy link must refuse anyone who is not entitled to it.
 */

const NOT_A_REQUEST = '00000000-0000-4000-8000-000000000000';

test('the Dropbox Sign callback does not exist without a provider key', async ({ request }) => {
  const response = await request.post('/api/esign/dropbox-sign/callback', {
    multipart: {
      json: JSON.stringify({
        event: { event_time: '1700000000', event_type: 'callback_test', event_hash: '0'.repeat(64) },
      }),
    },
  });
  expect(response.status()).toBe(404);
  expect(await response.text()).not.toContain('Hello API Event Received');
});

test('a signed copy cannot be fetched without a session', async ({ request }) => {
  const response = await request.get(`/api/esign/${NOT_A_REQUEST}/signed`, { maxRedirects: 0 });
  // 401 with a database; 503 on a deployment that has none. Never a redirect to a file.
  expect([401, 503]).toContain(response.status());
  expect(response.headers()['location']).toBeUndefined();
});

test('a malformed signed-copy id is not found', async ({ request }) => {
  const response = await request.get('/api/esign/not-a-uuid/signed', { maxRedirects: 0 });
  expect(response.status()).toBe(404);
});

// --- With accounts and a database ----------------------------------------------------------

const run = Date.now();
let sequence = 0;
const password = `Td-e2e-${run}-esign-quay`;

async function startOrganization(page: Page, name: string): Promise<string> {
  sequence += 1;
  await page.goto('/sign-up');
  await page.getByLabel('Email address').fill(`e2e-esign-${run}-${sequence}@example.test`);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Create account' }).click();
  await page.waitForURL('**/app');
  await page.getByLabel('Organization name').fill(name);
  await page.getByRole('button', { name: 'Create organization' }).click();
  await page.waitForURL(/\/app\/[0-9a-f-]{36}\/members$/);
  return new URL(page.url()).pathname.split('/')[2] as string;
}

async function generateInvoice(page: Page, org: string): Promise<string> {
  await page.goto(`/app/${org}/shipments`);
  await page.getByLabel('Shipment reference').fill(`SHP-ESIGN-${sequence}`);
  await page.getByRole('button', { name: 'Create shipment' }).click();
  await page.waitForURL(/\/shipments\/[0-9a-f-]{36}$/);
  const oneOff = page.getByRole('form', { name: 'Add a one-off line' });
  await oneOff.getByLabel('Description of goods').fill('Walnut board');
  await oneOff.getByLabel('Quantity').fill('3');
  await oneOff.getByLabel('Unit price').fill('12.00');
  await page.getByRole('button', { name: 'Add line' }).click();
  await expect(page.getByText('Line added.')).toBeVisible();
  await page.getByLabel('Document type').selectOption({ label: 'Commercial invoice' });
  await page.getByRole('button', { name: 'Generate document' }).click();
  await expect(page.getByText(/Document CI-[0-9]{4}-0001 generated\./)).toBeVisible();

  await page.goto(`/app/${org}/documents`);
  const href = await page.getByRole('link', { name: /PDF of CI-/ }).first().getAttribute('href');
  const id = href?.split('/').pop();
  expect(id).toMatch(/^[0-9a-f-]{36}$/);
  return id as string;
}

test.describe('in the workspace', () => {
  test.skip(process.env.APPLICATION_MODE !== 'service', 'The workspace requires a database.');

  test('e-signature says it is not available yet and is not offered', async ({ page }) => {
    const org = await startOrganization(page, 'Esign Unavailable Ltd');
    const documentId = await generateInvoice(page, org);

    // The documents list offers no e-signature while no provider is connected.
    await expect(page.getByRole('link', { name: /^E-sign/ })).toHaveCount(0);

    await page.goto(`/app/${org}/documents/${documentId}/signature`);
    await expect(page.getByRole('heading', { name: 'E-signature not available yet' })).toBeVisible();
    // No send form and no provider claim when the feature is off.
    await expect(page.getByRole('button', { name: /Send (test request|for signature)/ })).toHaveCount(0);
    await expect(page.getByText('Signature provided by Dropbox Sign')).toHaveCount(0);
    await expect(page.getByText('No signature requests for this document yet.')).toBeVisible();

    // Signed in, a request id that is not this organization's is simply not found.
    const response = await page.request.get(`/api/esign/${NOT_A_REQUEST}/signed`, {
      maxRedirects: 0,
    });
    expect(response.status()).toBe(404);
  });

  test('another organization cannot open a document’s signature page', async ({ browser }) => {
    const owner = await browser.newPage();
    const org = await startOrganization(owner, 'Esign Owner Ltd');
    const documentId = await generateInvoice(owner, org);

    const outsiderContext = await browser.newContext();
    const outsider = await outsiderContext.newPage();
    await startOrganization(outsider, 'Esign Outsider Ltd');
    const response = await outsider.goto(`/app/${org}/documents/${documentId}/signature`);
    expect(response?.status()).toBe(404);
    await outsiderContext.close();
    await owner.close();
  });

  test('works at phone width', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const org = await startOrganization(page, 'Esign Mobile Ltd');
    const documentId = await generateInvoice(page, org);
    await page.goto(`/app/${org}/documents/${documentId}/signature`);
    await expect(page.getByRole('heading', { name: 'E-signature not available yet' })).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });
});
