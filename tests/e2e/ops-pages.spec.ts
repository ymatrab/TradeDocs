import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Legal, help, contact and admin surfaces on a deployment without a database and without
 * legal approval (the CI server sets neither), which is the state previews run in.
 */

async function noViolations(page: import('@playwright/test').Page) {
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(result.violations).toEqual([]);
}

for (const path of ['/privacy', '/terms', '/cookies']) {
  test(`${path} is a visible, unindexed draft until approved`, async ({ page }) => {
    await page.goto(path);
    const banner = page.getByRole('heading', { name: 'Draft — pending owner approval' });
    await expect(banner).toBeVisible();
    await expect(page.getByText('to be provided').first()).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await noViolations(page);
  });
}

test('draft legal pages are not offered to crawlers', async ({ request }) => {
  const sitemap = await (await request.get('/sitemap.xml')).text();
  const llms = await (await request.get('/llms.txt')).text();
  for (const path of ['/privacy', '/terms', '/cookies']) {
    expect(sitemap).not.toContain(`${path}</loc>`);
    expect(llms).not.toContain(`${path})`);
  }
  expect(sitemap).toContain('/help</loc>');
  expect(sitemap).toContain('/contact</loc>');
  expect(sitemap).not.toContain('/admin');
});

test('the help panel opens, searches, closes on Escape and returns focus', async ({ page }) => {
  await page.goto('/tools');
  const launcher = page.getByRole('button', { name: 'Help', exact: true });
  await launcher.click();
  const panel = page.getByRole('dialog', { name: 'How can we help?' });
  await expect(panel).toBeVisible();
  await panel.getByRole('searchbox').fill('delete account');
  await expect(panel.getByText('How do I delete my account?')).toBeVisible();
  await expect(panel.getByRole('link', { name: 'Contact us' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(launcher).toBeFocused();
});

test('the help centre searches every answer without touching the URL', async ({ page }) => {
  await page.goto('/help');
  await page.getByRole('searchbox').fill('cubic feet');
  await expect(page.getByRole('status').filter({ hasText: /answers?$/ })).toBeVisible();
  expect(page.url()).not.toContain('cubic');
  await expect(page.getByRole('link', { name: 'Contact us' }).first()).toBeVisible();
  await noViolations(page);
});

test('contact says plainly when the form is not connected', async ({ page }) => {
  await page.goto('/contact');
  const notice = page.getByRole('heading', { name: 'The form is not connected here' });
  await expect(notice).toBeVisible();
  await expect(page.getByRole('button', { name: 'Send the message' })).toBeDisabled();
  await noViolations(page);
});

test('the admin panel admits nobody without a database and allowlist', async ({ page }) => {
  await page.goto('/admin');
  const notice = page.getByRole('heading', { name: 'Admin needs the production database' });
  await expect(notice).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});

test('sign-up links the terms and privacy policy, or says accounts are closed', async ({
  page,
}) => {
  await page.goto('/sign-up');
  const closed = page.getByRole('heading', { name: 'Accounts aren’t open.' });
  if (await closed.isVisible()) {
    await expect(page.getByRole('link', { name: 'Contact us' })).toBeVisible();
  } else {
    await expect(page.getByRole('link', { name: 'Terms of use' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Privacy policy' })).toBeVisible();
  }
});
