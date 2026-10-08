import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * The /for/<role> pages. They make product claims, so these check the ones that must hold
 * on every deployment: the offer follows whether accounts are open, the forwarder page says
 * what it is not, no price is shown, and each page is registered where public pages are.
 */

const pages = [
  ['/for/exporters', 'Your export paperwork, from one shipment record.'],
  ['/for/freight-forwarders', 'Client document preparation, not a forwarding system.'],
  ['/for/trade-consultants', 'Prepare each client’s documents in its own workspace.'],
] as const;

test('each use-case page renders with its canonical, structured data and honest offer', async ({
  page,
}) => {
  for (const [path, heading] of pages) {
    const response = await page.goto(path);
    expect(response?.status(), `${path} should answer`).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', new RegExp(`${path}$`));

    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const types = blocks.flatMap((text) => JSON.parse(text) as { '@type': string }[]);
    expect(types.map((item) => item['@type'])).toEqual(
      expect.arrayContaining(['BreadcrumbList', 'FAQPage']),
    );

    // The primary offer follows the live capability: sign-up only where accounts are open.
    const main = page.locator('main');
    const signUp = main.getByRole('link', { name: /Create a free account/ });
    if ((await signUp.count()) === 0) {
      const offer = main.getByRole('link', { name: /Use the free invoice generator/ }).first();
      await expect(offer).toHaveAttribute('href', '/tools/invoice-generator');
      const note = main.getByText(/Accounts are not open on this deployment yet/).first();
      await expect(note).toBeVisible();
    }

    // No price is shown on these pages, whatever the pricing flag says.
    await expect(main).not.toContainText(/[$€]\s?\d/);
  }

  await page.goto('/for/freight-forwarders');
  await expect(page.locator('main')).toContainText('It is not a forwarding TMS');
  expect((await page.goto('/for/importers'))?.status()).toBe(404);
});

test('the use-case pages are listed in the sitemap, llms.txt and the footer', async ({ page }) => {
  const sitemap = await (await page.request.get('/sitemap.xml')).text();
  const llms = await (await page.request.get('/llms.txt')).text();
  await page.goto('/');
  for (const [path] of pages) {
    expect(sitemap).toContain(`${path}</loc>`);
    expect(llms).toContain(path);
    await expect(page.locator(`footer a[href="${path}"]`)).toHaveCount(1);
  }
});

test('the use-case pages meet the accessibility bar', async ({ page }) => {
  for (const [path] of pages) {
    await page.goto(path);
    const violations = (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
    ).violations;
    expect(violations, `${path} has accessibility violations`).toEqual([]);
  }
});
