import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('foundation is accessible, reloadable and responsive', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});

test('missing routes have a useful recovery path', async ({ page }) => {
  const response = await page.goto('/not-a-tradedocs-route');
  expect(response?.status()).toBe(404);
  await page.getByRole('link', { name: 'Return to TradeDocs' }).click();
  await expect(page).toHaveURL('/');
});

test('health discloses no configuration and is never cached', async ({ request }) => {
  const response = await request.get('/api/health');
  expect(response.status()).toBe(200);
  expect(response.headers()['cache-control']).toContain('no-store');
  expect(await response.json()).toEqual({ status: 'ok' });
});

test('the workspace is absent from a foundation deployment rather than broken', async ({
  page,
}) => {
  // Without a database there is no workspace to serve. It must report a missing route, not
  // a server error, which would suggest something had failed instead of being out of scope.
  // Nothing public links to either of these, so a 404 is the honest answer.
  for (const route of ['/app', '/invitations/accept']) {
    const response = await page.goto(route);
    expect(response?.status(), `${route} should be absent, not failing`).toBe(404);
  }
});

test('a signup link answers honestly instead of looking broken', async ({ page }) => {
  // Every marketing page carries a "Create a free account" button pointing here. On a
  // deployment with no database a 404 reads as a broken link rather than as a product
  // that is not open yet, so these routes answer and explain.
  for (const route of ['/sign-up', '/sign-in']) {
    const response = await page.goto(route);
    expect(response?.status(), `${route} should answer, not 404`).toBe(200);
    await expect(page.getByRole('heading', { name: 'Accounts aren’t open.' })).toBeVisible();
  }

  // The offer it makes instead has to actually work.
  await page.getByRole('link', { name: 'Use the free tools' }).click();
  await expect(page).toHaveURL('/tools');
});
