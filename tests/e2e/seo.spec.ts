import { expect, test } from '@playwright/test';

/**
 * Search surfaces as a crawler sees them. CI never runs as the indexable production
 * service, so these hold on every deployment: private pages always say noindex, the
 * sitemap and llms.txt carry only public pages, and structured data parses and matches
 * what the page shows.
 */

test('private pages always answer noindex', async ({ request }) => {
  const response = await request.get('/sign-in');
  expect(response.headers()['x-robots-tag']).toBe('noindex, nofollow');
});

test('the sitemap lists public pages only, each with a fixed date', async ({ request }) => {
  const body = await (await request.get('/sitemap.xml')).text();
  expect(body).toContain('/tools/cbm-calculator</loc>');
  expect(body).toContain('/tools/incoterms/fob</loc>');
  expect(body).not.toMatch(/\/(app|auth|sign-in|sign-up|invitations|design-system)\b/);
  expect(body).toContain('<lastmod>2026-10-05');
});

test('llms.txt describes the public site and its boundary', async ({ request }) => {
  const response = await request.get('/llms.txt');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('text/plain');
  const body = await response.text();
  expect(body).toContain('It is not a customs broker');
  expect(body).toContain('/tools/chargeable-weight');
  expect(body).not.toContain('Certificate of origin');
});

test('tool structured data parses and matches the visible FAQ', async ({ page }) => {
  await page.goto('/tools/chargeable-weight');
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const items = blocks.flatMap((text) => JSON.parse(text) as { '@type': string }[]);
  const types = items.map((item) => item['@type']);
  expect(types).toEqual(expect.arrayContaining(['BreadcrumbList', 'SoftwareApplication']));

  const faq = items.find((item) => item['@type'] === 'FAQPage') as
    { mainEntity: { name: string }[] } | undefined;
  expect(faq).toBeDefined();
  for (const question of faq?.mainEntity ?? []) {
    await expect(page.locator('summary', { hasText: question.name })).toHaveCount(1);
  }
});

test('a guide cover is hotlinked from Unsplash, sized and credited', async ({ page }) => {
  await page.goto('/guides/lcl-vs-fcl');
  const cover = page.locator('.cover-figure img');
  await expect(cover).toHaveAttribute('src', /^https:\/\/images\.unsplash\.com\/photo-/);
  await expect(cover).toHaveAttribute('width', '1280');
  await expect(cover).toHaveAttribute('height', '640');
  await expect(cover).toHaveAttribute('fetchpriority', 'high');
  const credits = page.locator('.cover-figure figcaption a');
  await expect(credits).toHaveCount(2);
  for (const link of await credits.all()) {
    await expect(link).toHaveAttribute('href', /utm_source=paydocs&utm_medium=referral/);
  }
});
