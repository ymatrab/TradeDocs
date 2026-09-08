import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * The public surfaces, which are the point of not requiring an account. No database is
 * involved, so these run on the foundation gate too — the one deployment configuration
 * where the rest of the suite has nothing to talk to.
 */

test('the public tools work without an account and store nothing', async ({ page }) => {
  await page.goto('/tools/cbm-calculator');

  await page.getByLabel('Length').fill('40');
  await page.getByLabel('Width').fill('30');
  await page.getByLabel('Height').fill('20');
  await page.getByLabel('How many').fill('50');

  // 0.024 m³ each, fifty of them.
  const volume = page.getByRole('region', { name: 'Volume' });
  await expect(volume).toContainText('1.200 m³');
  await expect(volume).toContainText('0.0240 m³');

  await page.goto('/tools/chargeable-weight');
  await page.getByLabel('Length').fill('100');
  await page.getByLabel('Width').fill('100');
  await page.getByLabel('Height').fill('100');
  await page.getByLabel('How many').fill('1');
  await page.getByLabel('Actual gross weight').fill('50');

  // One cubic metre at 50 kg is billed on volume under the IATA divisor.
  await expect(page.getByText('You will be billed on volume, not weight')).toBeVisible();
  await expect(page.getByRole('region', { name: 'Chargeable weight' })).toContainText('166.67 kg');
});

test('the free generator produces a real PDF for a visitor with no account', async ({ page }) => {
  await page.goto('/tools/invoice-generator');

  await page.getByLabel('Document number').fill('INV-TEST-1');
  await page
    .getByRole('region', { name: 'Issued by' })
    .getByLabel('Company name')
    .fill('Finch Ltd');
  await page
    .getByRole('region', { name: 'Addressed to' })
    .getByLabel('Company name')
    .fill('Gadwall BV');
  await page.getByLabel('Description of goods').fill('Stoneware bowl');
  await page.getByLabel('Unit price').fill('6.40');

  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download the PDF' }).click();
  const file = await download;
  expect(file.suggestedFilename()).toBe('INV-TEST-1.pdf');
});

test('the public tool pages meet the accessibility bar the rest of the product does', async ({
  page,
}) => {
  // These pages are the first thing a stranger sees, and they are dense with form
  // controls. Holding them to the same standard as the workspace is the whole point of
  // having a standard.
  for (const route of ['/tools', '/tools/cbm-calculator', '/tools/incoterms/fob']) {
    await page.goto(route);
    const violations = (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
    ).violations;
    expect(violations, `${route} has accessibility violations`).toEqual([]);
  }
});

test('an unknown Incoterm code is a missing page rather than an empty one', async ({ page }) => {
  expect((await page.goto('/tools/incoterms/dat'))?.status()).toBe(404);
});
