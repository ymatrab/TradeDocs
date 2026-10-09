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

test('the container loading calculator bounds a load by volume and weight', async ({ page }) => {
  await page.goto('/tools/container-loading-calculator');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Container loading calculator');
  await expect(page.getByRole('heading', { name: 'An estimate, not a stow plan' })).toBeVisible();

  await page.getByLabel('Length').fill('60');
  await page.getByLabel('Width').fill('40');
  await page.getByLabel('Height').fill('40');
  await page.getByLabel('Gross weight of one unit').fill('15');
  await page.getByLabel('Units to ship').fill('1000');

  // 0.096 m³ each: 33 / 0.096 = 343 in a 20ft box by volume, against 1,880 by weight, so
  // 1,000 cartons need three.
  const table = page.getByRole('table', { name: /Most units that fit each container/ });
  const row = table.getByRole('row', { name: /20' standard/ });
  await expect(row).toContainText('343');
  await expect(row).toContainText('1,880');
  await expect(row).toContainText('volume');
  await expect(row).toContainText('3');

  // A load heavier than the payload allows is limited by weight.
  await page.getByLabel('Gross weight of one unit').fill('500');
  await expect(row).toContainText('weight');
});

test('the unit converter fills the other field both ways', async ({ page }) => {
  await page.goto('/tools/unit-converter');

  await page.getByLabel('Cubic metres (m³, CBM)').fill('2');
  await expect(page.getByLabel('Cubic feet (ft³)')).toHaveValue('70.6293');

  await page.getByLabel('Pounds (lb)').fill('100');
  await expect(page.getByLabel('Kilograms (kg)')).toHaveValue('45.3592');

  await page.getByLabel('Kilograms (kg)').fill('abc');
  await expect(page.getByText('Enter a positive number, such as 12.5.')).toBeVisible();
});

test('the delivery note generator opens on a delivery note and downloads it', async ({ page }) => {
  await page.goto('/tools/delivery-note-generator');
  await expect(page.getByLabel('Type')).toHaveValue('delivery_note');
  // A delivery note prints no prices, so the invoice-only terms are not offered.
  await expect(page.getByLabel('Buyer reference or PO number')).toHaveCount(0);

  await page.getByLabel('Document number').fill('DN-TEST-1');
  await page
    .getByRole('region', { name: 'Issued by' })
    .getByLabel('Company name')
    .fill('Finch Ltd');
  await page
    .getByRole('region', { name: 'Addressed to' })
    .getByLabel('Company name')
    .fill('Gadwall BV');
  await page.getByLabel('Description of goods').fill('Stoneware bowl');

  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download the PDF' }).click();
  expect((await download).suggestedFilename()).toBe('DN-TEST-1.pdf');
});

test('a proforma takes a validity date, buyer reference and payment terms', async ({ page }) => {
  await page.goto('/tools/proforma-invoice-generator');

  await page.getByLabel('Document number').fill('PI-TEST-1');
  await page.getByLabel('Buyer reference or PO number').fill('PO-4471');
  await page.getByLabel('Valid until').fill('2026-11-30');
  await page.getByLabel('Payment terms').fill('30% deposit, balance against copy of B/L');
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
  expect((await download).suggestedFilename()).toBe('PI-TEST-1.pdf');

  // On a commercial invoice the validity date is not offered; the buyer reference is.
  await page.getByLabel('Type').selectOption('commercial_invoice');
  await expect(page.getByLabel('Valid until')).toHaveCount(0);
  await expect(page.getByLabel('Buyer reference or PO number')).toHaveValue('PO-4471');
});

test('the CBM to cubic feet converter shows one volume in every unit', async ({ page }) => {
  await page.goto('/tools/cbm-to-cubic-feet');
  await page.getByLabel('Volume', { exact: true }).fill('2.5');
  const results = page.getByRole('region', { name: /in every unit/ });
  await expect(results.getByRole('row', { name: /Cubic feet/ })).toContainText('88.2867');
  await expect(results.getByRole('row', { name: /Litres/ })).toContainText('2500');

  await page.getByLabel('In', { exact: true }).selectOption('ft3');
  await page.getByLabel('Volume', { exact: true }).fill('100');
  await expect(results.getByRole('row', { name: /Cubic metres/ })).toContainText('2.831685');

  await page.getByLabel('Volume', { exact: true }).fill('abc');
  await expect(page.getByText('Enter a positive number, such as 2.5.')).toBeVisible();
});

test('the pallet calculator counts cartons per layer and per pallet', async ({ page }) => {
  await page.goto('/tools/pallet-calculator');
  // The EPAL 1 euro pallet is preset: 1,200 × 800 × 144 mm, 25 kg, 1,500 kg load.
  await expect(page.getByLabel('Deck length (mm)')).toHaveValue('1200');
  await page.getByLabel('Maximum loaded height (mm)').fill('1800');
  await page.getByLabel('Length (cm)').fill('40');
  await page.getByLabel('Width (cm)').fill('30');
  await page.getByLabel('Height (cm)').fill('30');
  await page.getByLabel('Gross weight per carton (kg)').fill('12');
  const result = page.getByRole('region', { name: 'Cartons per pallet', exact: true });
  await expect(result).toContainText('8 (4 × 2)');
  await expect(result).toContainText('40');
  await expect(result).toContainText('505');
  const caveat = page.getByText(/before overhang, crushing strength and carrier limits/);
  await expect(caveat).toBeVisible();

  await page.getByLabel('Maximum loaded height (mm)').fill('300');
  await expect(page.getByText(/Not even one layer fits/)).toBeVisible();
});

test('the export price calculator builds FOB, CIF and DDP from the costs entered', async ({
  page,
}) => {
  await page.goto('/tools/export-price-calculator');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Export price calculator');
  await expect(page.getByRole('heading', { name: 'An estimate, not a quote' })).toBeVisible();

  await page.getByLabel('Ex-works (EXW) price').fill('10000');
  await page.getByLabel('Inland transport').fill('300');
  await page.getByLabel('Export clearance').fill('150');
  await page.getByLabel('Origin loading and terminal charges').fill('250');
  await page.getByLabel('Main freight').fill('1800');
  await page.getByLabel('Cargo insurance').fill('41.25');
  await page.getByLabel('Units in the consignment').fill('500');
  await page.getByLabel('Destination charges').fill('400');
  await page.getByLabel('Import duty rate (%)').fill('5');
  await page.getByLabel('Import taxes (%)').fill('20');

  const prices = page.getByRole('region', { name: 'Export price', exact: true });
  await expect(prices).toContainText('10,700.00 USD');
  await expect(prices).toContainText('12,500.00 USD');
  await expect(prices).toContainText('12,541.25 USD');
  // Duty 5% of CIF = 627.06; tax 20% of CIF + duty = 2,633.66.
  await expect(prices).toContainText('16,201.97 USD');
  const table = page.getByRole('table', { name: /Export price by Incoterms rule/ });
  await expect(table.getByRole('row', { name: /CIF \/ CIP/ })).toContainText('25.0825 USD');

  // A field that cannot be read is flagged, not silently counted as zero.
  await page.getByLabel('Main freight').fill('abc');
  await expect(page.getByText('Enter a number such as 1250.50, or leave it blank.')).toBeVisible();

  // The result is carried by hand: the link goes to the proforma generator, nothing else.
  const proforma = page.getByRole('link', { name: 'Open the proforma invoice generator' });
  await expect(proforma).toHaveAttribute('href', '/tools/proforma-invoice-generator');
});

test('glossary and country pages render and are listed once sourced (D-015)', async ({ page }) => {
  await page.goto('/glossary');
  await page.getByRole('searchbox', { name: 'Search the glossary' }).fill('vgm');
  await expect(page.getByText('Verified gross mass (VGM)').first()).toBeVisible();

  await page.goto('/glossary/teu');
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(blocks.join(' ')).toContain('"DefinedTerm"');
  expect(blocks.join(' ')).toContain('"inDefinedTermSet"');

  await page.goto('/export-documents/india');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Export documents for India');
  const sitemap = await (await page.request.get('/sitemap.xml')).text();
  expect(sitemap).toContain('/glossary/teu</loc>');
  expect(sitemap).toContain('/export-documents/india</loc>');
  expect((await page.goto('/glossary/not-a-term'))?.status()).toBe(404);
});

test('the new tool pages are registered everywhere a tool is listed', async ({ page }) => {
  const paths = [
    '/tools/container-loading-calculator',
    '/tools/unit-converter',
    '/tools/delivery-note-generator',
    '/tools/cbm-to-cubic-feet',
    '/tools/pallet-calculator',
    '/tools/export-price-calculator',
    '/tools/hs-code-lookup',
  ];
  await page.goto('/tools');
  for (const path of paths) await expect(page.locator(`main a[href="${path}"]`)).toHaveCount(1);

  const sitemap = await (await page.request.get('/sitemap.xml')).text();
  const llms = await (await page.request.get('/llms.txt')).text();
  for (const path of paths) {
    expect(sitemap).toContain(`${path}</loc>`);
    expect(llms).toContain(path);
    await page.goto(path);
    const types = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
      .then((blocks) => blocks.join(' '));
    expect(types).toContain('"SoftwareApplication"');
    expect(types).toContain('"FAQPage"');
  }
});

test('the public tool pages meet the accessibility bar the rest of the product does', async ({
  page,
}) => {
  // These pages are the first thing a stranger sees, and they are dense with form
  // controls. Holding them to the same standard as the workspace is the whole point of
  // having a standard.
  for (const route of [
    '/tools',
    '/tools/cbm-calculator',
    '/tools/incoterms/fob',
    '/tools/container-loading-calculator',
    '/tools/unit-converter',
    '/tools/delivery-note-generator',
    '/tools/cbm-to-cubic-feet',
    '/tools/pallet-calculator',
    '/tools/export-price-calculator',
    '/tools/hs-code-lookup',
    '/glossary',
    '/glossary/verified-gross-mass',
    '/export-documents',
    '/export-documents/mexico',
  ]) {
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

test('the HS code lookup shows official lines and says it is not a classification', async ({
  page,
}) => {
  await page.goto('/tools/hs-code-lookup');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('HS code lookup');
  await expect(page.getByRole('heading', { name: 'A lookup, not a classification' })).toBeVisible();

  // Validation runs before anything is sent.
  await page.getByLabel('Goods description or code').fill('a');
  await page.getByRole('button', { name: 'Search the US and UK tariffs' }).click();
  await expect(page.getByText('Enter at least two characters.')).toBeVisible();

  // The browser's call to our API is answered here, so no official service is contacted
  // from CI; the server side is covered by the unit tests with recorded responses.
  await page.route(/\/api\/tools\/hs-lookup\?/, (route) =>
    route.fulfill({
      json: {
        query: 'copper wire',
        us: {
          status: 'ok',
          searchUrl: 'https://hts.usitc.gov/search?query=copper+wire',
          results: [
            {
              code: '7408.11.30.00',
              description: 'With a maximum cross-sectional dimension over 9.5 mm',
              context: 'Copper wire › Of which the maximum cross-sectional dimension exceeds 6 mm',
              url: 'https://hts.usitc.gov/search?query=7408.11.30.00',
            },
          ],
        },
        uk: {
          status: 'unavailable',
          searchUrl: 'https://www.trade-tariff.service.gov.uk/search?q=copper+wire',
        },
      },
    }),
  );
  await page.getByLabel('Goods description or code').fill('copper wire');
  await page.getByRole('button', { name: 'Search the US and UK tariffs' }).click();

  const us = page.getByRole('region', {
    name: 'United States — Harmonized Tariff Schedule',
    exact: true,
  });
  await expect(us.getByRole('row', { name: /7408\.11\.30\.00/ })).toBeVisible();
  await expect(us.getByRole('link', { name: /Open 7408\.11\.30\.00/ })).toHaveAttribute(
    'href',
    'https://hts.usitc.gov/search?query=7408.11.30.00',
  );
  const uk = page.getByRole('region', { name: 'United Kingdom — UK Trade Tariff', exact: true });
  await expect(uk.getByText('The official service did not answer')).toBeVisible();
  // No rate column, ever.
  await expect(us.getByRole('columnheader')).toHaveText(['Code', 'Description', 'Official page']);

  const violations = (
    await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
  ).violations;
  expect(violations, 'HS code lookup results have accessibility violations').toEqual([]);
});

test('the HS code lookup works at phone width', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/tools/hs-code-lookup');
  await expect(page.getByLabel('Goods description or code')).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test('denied-party screening is honest about being unavailable without a CSL key', async ({
  page,
}) => {
  // CI deploys without CSL_API_KEY, so this is the state every visitor sees until the owner
  // registers the key (D-025). A deployment that has the key is checked for the form instead.
  await page.goto('/tools/denied-party-screening');
  const configured = (await page.getByText('Not available yet', { exact: true }).count()) === 0;
  if (configured) {
    await expect(page.getByLabel('Company or person name')).toBeVisible();
    await page.goto('/tools');
    await expect(page.locator('main a[href="/tools/denied-party-screening"]')).toHaveCount(1);
    return;
  }
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Denied party screening');
  await expect(
    page.getByRole('heading', { name: 'A screening aid, not a compliance determination' }),
  ).toBeVisible();
  await expect(page.getByText('Screening is not available here yet')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open the official CSL search' })).toHaveAttribute(
    'href',
    'https://www.trade.gov/data-visualization/csl-search',
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);

  // Not listed anywhere as available.
  await page.goto('/tools');
  await expect(page.locator('main a[href="/tools/denied-party-screening"]')).toHaveCount(0);
  const sitemap = await (await page.request.get('/sitemap.xml')).text();
  const llms = await (await page.request.get('/llms.txt')).text();
  expect(sitemap).not.toContain('/tools/denied-party-screening');
  expect(llms).not.toContain('/tools/denied-party-screening');

  // The endpoint refuses rather than pretending.
  const response = await page.request.post('/api/tools/denied-party', {
    data: { name: 'Example Trading' },
  });
  expect(response.status()).toBe(503);
  expect(await response.json()).toMatchObject({ code: 'not_configured' });

  await page.goto('/tools/denied-party-screening');
  const violations = (
    await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
  ).violations;
  expect(violations, 'denied-party screening has accessibility violations').toEqual([]);
});
