import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Pricing as a visitor sees it on a deployment where payments are closed, which is every CI
 * and preview deployment: no price anywhere, every paid plan "Not available yet" with nothing
 * to buy, and the webhook route absent.
 */

test('pricing shows every plan, states no price and offers nothing to buy', async ({ page }) => {
  await page.goto('/pricing');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Free while early.');
  for (const name of ['Free (while early)', 'Pro', 'Team']) {
    await expect(page.getByRole('heading', { level: 3, name, exact: true })).toBeVisible();
  }
  await expect(page.getByText('Not available yet').first()).toBeVisible();
  await expect(page.getByRole('link', { name: /upgrade/i })).toHaveCount(0);
  await expect(page.locator('main')).not.toContainText(/[$€£]\s?\d/);
  await expect(page.getByRole('region', { name: 'Features by plan' })).toBeVisible();
});

test('pricing structured data matches the visible questions', async ({ page }) => {
  await page.goto('/pricing');
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const items = blocks.flatMap((text) => JSON.parse(text) as { '@type': string }[]);
  const faq = items.find((item) => item['@type'] === 'FAQPage') as
    | { mainEntity: { name: string }[] }
    | undefined;
  expect(faq?.mainEntity.length).toBeGreaterThan(0);
  for (const question of faq?.mainEntity ?? []) {
    await expect(page.locator('summary', { hasText: question.name })).toHaveCount(1);
  }
});

test('pricing is accessible and fits a phone', async ({ page }) => {
  await page.goto('/pricing');
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

test('pricing is in the sitemap and llms.txt', async ({ request }) => {
  expect(await (await request.get('/sitemap.xml')).text()).toContain('/pricing</loc>');
  const llms = await (await request.get('/llms.txt')).text();
  expect(llms).toContain('/pricing');
  expect(llms).toContain('Pro: not available yet');
});

test('the Stripe webhook does not exist while payments are closed', async ({ request }) => {
  const response = await request.post('/api/billing/stripe/webhook', { data: '{}' });
  expect(response.status()).toBe(404);
});
