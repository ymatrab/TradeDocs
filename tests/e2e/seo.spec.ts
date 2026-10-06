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

test('the homepage FAQ data matches its visible questions and its photos are credited', async ({
  page,
}) => {
  await page.goto('/');
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const items = blocks.flatMap((text) => JSON.parse(text) as { '@type': string }[]);
  const faq = items.find((item) => item['@type'] === 'FAQPage') as
    { mainEntity: { name: string }[] } | undefined;
  expect(faq?.mainEntity.length).toBeGreaterThan(5);
  for (const question of faq?.mainEntity ?? []) {
    await expect(page.locator('summary', { hasText: question.name })).toHaveCount(1);
  }

  const photos = page.locator('.section-photo img');
  await expect(photos).toHaveCount(4);
  for (const photo of await photos.all()) {
    await expect(photo).toHaveAttribute('src', /^https:\/\/images\.unsplash\.com\/photo-/);
    await expect(photo).toHaveAttribute('loading', 'lazy');
  }
  for (const link of await page.locator('.section-photo figcaption a').all()) {
    await expect(link).toHaveAttribute('href', /utm_source=paydocs&utm_medium=referral/);
  }
});

test('a blog post answers first and its structured data matches the page', async ({ page }) => {
  await page.goto('/blog/commercial-invoice-requirements');
  await expect(page.getByRole('heading', { level: 2, name: 'Short answer' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'Key facts' })).toBeVisible();

  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const items = blocks.flatMap((text) => JSON.parse(text) as { '@type': string }[]);
  const types = items.map((item) => item['@type']);
  expect(types).toEqual(expect.arrayContaining(['BreadcrumbList', 'Article', 'FAQPage']));
  const article = items.find((item) => item['@type'] === 'Article') as
    { image?: { '@type': string }; author?: { name?: string } } | undefined;
  expect(article?.image?.['@type']).toBe('ImageObject');
  expect(article?.author?.name).toBe('TradeDocs');

  const faq = items.find((item) => item['@type'] === 'FAQPage') as
    { mainEntity: { name: string }[] } | undefined;
  for (const question of faq?.mainEntity ?? []) {
    await expect(page.locator('summary', { hasText: question.name })).toHaveCount(1);
  }
});

test('the blog feed and the full-text file list the posts', async ({ request }) => {
  const feed = await request.get('/blog/rss.xml');
  expect(feed.status()).toBe(200);
  expect(feed.headers()['content-type']).toContain('application/rss+xml');
  const xml = await feed.text();
  expect(xml).toContain('<rss version="2.0"');
  expect(xml).toContain('/blog/fca-vs-fob</link>');

  const llms = await (await request.get('/llms.txt')).text();
  expect(llms).toContain('## Blog');
  expect(llms).toContain('/blog/export-documents-checklist');

  const full = await request.get('/llms-full.txt');
  expect(full.status()).toBe(200);
  const text = await full.text();
  expect(text).toContain('Short answer:');
  expect(text).not.toContain('Certificate of origin');
});
