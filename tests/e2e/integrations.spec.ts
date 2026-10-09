import { expect, test, type Page } from '@playwright/test';

/**
 * QuickBooks Online and Xero (D-025). CI registers no developer app, so both providers must
 * read "Not connected — not available yet" with no button that could start a broken flow, and
 * the OAuth callback must refuse anything it cannot verify without touching a provider.
 */

test.describe('the OAuth callback refuses what it cannot verify', () => {
  test('an unknown provider is not found', async ({ request }) => {
    const response = await request.get('/api/integrations/sage/callback?code=x&state=y', {
      maxRedirects: 0,
    });
    expect(response.status()).toBe(404);
  });

  for (const provider of ['quickbooks', 'xero']) {
    test(`a ${provider} callback with a forged state changes nothing`, async ({ request }) => {
      const response = await request.get(
        `/api/integrations/${provider}/callback?code=forged&state=s1.e30.AAAA&realmId=1`,
        { maxRedirects: 0 },
      );
      expect(response.status()).toBe(303);
      const location = new URL(response.headers().location ?? '', 'http://placeholder');
      // Unconfigured here, so the flow ends before any state, session or provider is read.
      expect(location.pathname).toBe('/app');
      expect(location.searchParams.get('result')).toMatch(/^(unavailable|invalid)$/);
      expect(location.search).not.toContain('forged');
      expect(response.headers()['cache-control']).toContain('no-store');
    });
  }
});

test.describe('the integrations page', () => {
  test.skip(process.env.APPLICATION_MODE !== 'service', 'The workspace requires a database.');

  const run = Date.now();
  let sequence = 0;
  const password = `Td-e2e-${run}-ledger-quay`;

  async function signUp(page: Page): Promise<void> {
    sequence += 1;
    await page.goto('/sign-up');
    await page
      .getByLabel('Email address')
      .fill(`e2e-integrations-${run}-${sequence}-${test.info().project.name}@example.test`);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Create account' }).click();
    await page.waitForURL('**/app');
  }

  async function createOrganization(page: Page, name: string): Promise<string> {
    await page.getByLabel('Organization name').fill(name);
    await page.getByRole('button', { name: 'Create organization' }).click();
    await page.waitForURL(/\/app\/[0-9a-f-]{36}\/members$/);
    return new URL(page.url()).pathname.split('/')[2] as string;
  }

  test('shows both providers as not available, with no connect button', async ({ page }) => {
    await signUp(page);
    const org = await createOrganization(page, 'Ledger Quay Exports');

    await page.goto(`/app/${org}/settings`);
    await page.getByRole('link', { name: 'Open integrations' }).click();
    await page.waitForURL(`**/app/${org}/settings/integrations`);

    for (const name of ['QuickBooks Online', 'Xero']) {
      const panel = page.getByRole('region', { name });
      await expect(panel.getByText('Not connected — not available yet')).toBeVisible();
      await expect(panel.getByRole('button')).toHaveCount(0);
    }
    await expect(page.getByRole('button', { name: /Connect/ })).toHaveCount(0);
  });

  test('is not shown to someone outside the organization', async ({ browser }) => {
    const owner = await browser.newContext();
    const ownerPage = await owner.newPage();
    await signUp(ownerPage);
    const org = await createOrganization(ownerPage, 'Harbour Ledger Ltd');

    const outsider = await browser.newContext();
    const outsiderPage = await outsider.newPage();
    await signUp(outsiderPage);
    await outsiderPage.goto(`/app/${org}/settings/integrations`);
    await expect(outsiderPage.getByRole('heading', { level: 1 })).toContainText('isn’t here');
    await expect(outsiderPage.getByText('Harbour Ledger Ltd')).toHaveCount(0);
    await owner.close();
    await outsider.close();
  });

  test('sends a visitor who is not signed in to sign in', async ({ page }) => {
    await page.goto('/app/11111111-1111-4111-8111-111111111111/settings/integrations');
    await expect(page).toHaveURL(/sign-in/);
  });
});
