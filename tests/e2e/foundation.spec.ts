import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('foundation is accessible, reloadable and responsive', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
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
