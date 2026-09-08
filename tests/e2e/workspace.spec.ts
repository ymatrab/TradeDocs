import { expect, test, type Page } from '@playwright/test';

// Service-mode suite: the reusable workspace is the part that needs a database.
test.skip(process.env.APPLICATION_MODE !== 'service', 'The workspace requires a database.');

const run = Date.now();
let sequence = 0;
function newEmail(): string {
  sequence += 1;
  return `e2e-workspace-${run}-${sequence}@example.test`;
}
const password = 'correct-horse-battery-staple';

async function signUp(page: Page): Promise<void> {
  await page.goto('/sign-up');
  await page.getByLabel('Email address').fill(newEmail());
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

async function startOrganization(page: Page, name: string): Promise<string> {
  await signUp(page);
  return createOrganization(page, name);
}

async function createShipment(page: Page, org: string, reference: string): Promise<void> {
  await page.goto(`/app/${org}/shipments`);
  await page.getByLabel('Shipment reference').fill(reference);
  await page.getByRole('button', { name: 'Create shipment' }).click();
  await page.waitForURL(/\/shipments\/[0-9a-f-]{36}$/);
}

test('a catalog is imported from a spreadsheet and reused on a shipment', async ({ page }) => {
  const org = await startOrganization(page, 'Aldbury Trading');

  // The file an exporter already has: their own column names, a quoted description
  // containing a comma, and a European decimal.
  await page.goto(`/app/${org}/products/import`);
  await page
    .getByLabel('Or paste the rows')
    .fill(
      'Item Code;Product Name;Tariff Code;Country of Origin;UOM;Unit Price;Net Weight\n' +
        'A-100;"Cotton tea towel, 50 x 70 cm";630260;IN;pcs;2,40;0,12\n' +
        'B-220;Ceramic mug 350 ml;691200;PT;pcs;3,10;0,31\n',
    );
  await page.getByRole('button', { name: 'Import catalog' }).click();
  await expect(page.getByText('Imported 2 new products')).toBeVisible();

  // The comma inside the quoted description stayed part of the description, and the
  // European decimal was read as a decimal rather than as a thousands separator.
  await page.goto(`/app/${org}/products`);
  await expect(page.getByRole('link', { name: 'Cotton tea towel, 50 x 70 cm' })).toBeVisible();
  const catalog = page.getByRole('region', { name: /Products in this catalog/ });
  await expect(catalog).toContainText('2.40');
  await expect(catalog).toContainText('630260');

  // Re-importing the same codes corrects them rather than creating duplicates.
  await page.goto(`/app/${org}/products/import`);
  await page
    .getByLabel('Or paste the rows')
    .fill('Item Code;Product Name;Unit Price\nA-100;Cotton tea towel, revised;2,55\n');
  await page.getByRole('button', { name: 'Import catalog' }).click();
  await expect(page.getByText('Imported 0 new products and updated 1')).toBeVisible();

  // The catalog reaches a shipment as a quantity rather than a form.
  await createShipment(page, org, 'SHP-CATALOG-1');
  const picker = page.getByRole('form', { name: 'Add from the catalog' });
  await picker.getByLabel('Find a product').fill('mug');
  await picker.getByRole('button', { name: /Ceramic mug/ }).click();
  await picker.getByLabel('Quantity to add').fill('500');
  await page.getByRole('button', { name: 'Add from catalog' }).click();
  await expect(page.getByText('Line added from the catalog.')).toBeVisible();

  const lines = page.getByRole('region', { name: /Goods on this shipment/ });
  await expect(lines).toContainText('Ceramic mug 350 ml');
  await expect(lines).toContainText('691200');
});

test('a line keeps the values it captured when the catalog changes afterwards', async ({
  page,
}) => {
  const org = await startOrganization(page, 'Brandon Exports');

  await page.goto(`/app/${org}/products/new`);
  await page.getByLabel('Description').fill('Galvanised bracket');
  await page.getByLabel('Unit price').fill('4.00');
  await page.getByRole('button', { name: 'Add product' }).click();
  await page.waitForURL(/\/products\/[0-9a-f-]{36}$/);
  const productUrl = page.url();

  await createShipment(page, org, 'SHP-PROVENANCE-1');
  const picker = page.getByRole('form', { name: 'Add from the catalog' });
  await picker.getByLabel('Find a product').fill('bracket');
  await picker.getByRole('button', { name: /Galvanised bracket/ }).click();
  await picker.getByLabel('Quantity to add').fill('10');
  await page.getByRole('button', { name: 'Add from catalog' }).click();
  await expect(page.getByText('Line added from the catalog.')).toBeVisible();
  const shipmentUrl = page.url();

  // The price moves in the catalog.
  await page.goto(productUrl);
  await page.getByLabel('Unit price').fill('9.99');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByText('Lines already added to a shipment keep their own values.')).toBeVisible();

  // The line that was already added does not move with it. This is the whole point of
  // copying rather than linking: an invoice cannot be rewritten by a later price change.
  await page.goto(shipmentUrl);
  const lines = page.getByRole('region', { name: /Goods on this shipment/ });
  await expect(lines).toContainText('4.0000');
  await expect(lines).not.toContainText('9.9900');
});

test('parties are chosen once and packing is reconciled against the lines', async ({ page }) => {
  const org = await startOrganization(page, 'Corvid Freight');

  await page.goto(`/app/${org}/companies/new`);
  await page.getByLabel('Trading name').fill('Corvid Freight Ltd');
  await page.getByLabel('City').fill('Bristol');
  await page.getByLabel('Country').fill('GB');
  await page.getByRole('button', { name: 'Add company' }).click();
  await page.waitForURL(/\/companies\/[0-9a-f-]{36}$/);

  await page.goto(`/app/${org}/companies/new`);
  await page.getByLabel('Kind').selectOption('customer');
  await page.getByLabel('Trading name').fill('Helsing Import BV');
  await page.getByLabel('City').fill('Rotterdam');
  await page.getByLabel('Country').fill('NL');
  await page.getByRole('button', { name: 'Add company' }).click();
  await page.waitForURL(/\/companies\/[0-9a-f-]{36}$/);

  await createShipment(page, org, 'SHP-PACKING-1');

  await page.getByLabel('Exporter').selectOption({ label: 'Corvid Freight Ltd (Bristol, GB)' });
  await page.getByRole('button', { name: 'Set exporter' }).click();
  await expect(page.getByText('Party updated.')).toBeVisible();
  await page.getByLabel('Consignee').selectOption({ label: 'Helsing Import BV (Rotterdam, NL)' });
  await page.getByRole('button', { name: 'Set consignee' }).click();
  await expect(page.getByText('Party updated.')).toBeVisible();

  const oneOff = page.getByRole('form', { name: 'Add a one-off line' });
  await oneOff.getByLabel('Description of goods').fill('Enamel sign');
  await oneOff.getByLabel('Quantity').fill('100');
  await oneOff.getByLabel('Unit price').fill('7.25');
  await page.getByRole('button', { name: 'Add line' }).click();
  await expect(page.getByText('Line added.')).toBeVisible();

  const packing = page.getByRole('form', { name: 'Add a package' });
  await packing.getByLabel('How many').fill('4');
  await packing.getByLabel('Length (cm)').fill('60');
  await packing.getByLabel('Width (cm)').fill('40');
  await packing.getByLabel('Height (cm)').fill('50');
  await packing.getByLabel('Package gross weight (kg)').fill('96');
  await page.getByRole('button', { name: 'Add package' }).click();
  await expect(page.getByText('Package added.')).toBeVisible();

  // 4 cartons of 0.12 m³ each.
  const packages = page.getByRole('region', { name: /Packages on this shipment/ });
  await expect(packages).toContainText('0.480');

  // Nothing is allocated yet, so the packing and the lines disagree and say so.
  await expect(page.getByText('The packing does not match the lines')).toBeVisible();
  await expect(page.getByText('Enamel sign: 0 of 100 pcs allocated')).toBeVisible();

  // Allocating part of the line is still a mismatch, and the figure is named.
  const allocate = page.getByRole('form', { name: 'Allocate goods to a package' });
  await allocate.getByLabel('Quantity in this package').fill('60');
  await page.getByRole('button', { name: 'Allocate' }).click();
  await expect(page.getByText('Enamel sign: 60 of 100 pcs allocated')).toBeVisible();

  // Allocating the rest reconciles it. The allocation replaces rather than adds, which is
  // what makes correcting a mistake possible without deleting first.
  await allocate.getByLabel('Quantity in this package').fill('100');
  await page.getByRole('button', { name: 'Allocate' }).click();
  await expect(page.getByText('Packing reconciles')).toBeVisible();
});

test('a document set downloads as a ZIP of current revisions with a manifest', async ({ page }) => {
  const org = await startOrganization(page, 'Dunlin Shipping');
  await createShipment(page, org, 'SHP-SET-1');

  const oneOff = page.getByRole('form', { name: 'Add a one-off line' });
  await oneOff.getByLabel('Description of goods').fill('Powder-coated hinge');
  await oneOff.getByLabel('Quantity').fill('2400');
  await oneOff.getByLabel('Unit price').fill('0.85');
  await page.getByRole('button', { name: 'Add line' }).click();
  await expect(page.getByText('Line added.')).toBeVisible();

  // Nothing to bundle before a document exists.
  const setUrl = `/api/shipments/${new URL(page.url()).pathname.split('/').pop()}/documents.zip`;
  expect((await page.request.get(setUrl)).status()).toBe(409);

  for (const kind of ['Commercial invoice', 'Packing list']) {
    await page.getByLabel('Document type').selectOption({ label: kind });
    await page.getByRole('button', { name: 'Generate document' }).click();
    await expect(page.getByText('Document generated.')).toBeVisible();
  }

  const archive = await page.request.get(setUrl);
  expect(archive.status()).toBe(200);
  expect(archive.headers()['content-type']).toContain('application/zip');
  const body = await archive.body();
  // Local file header, then the manifest's name somewhere in the central directory.
  expect(body.subarray(0, 4).toString('latin1')).toBe('PK');
  expect(body.toString('latin1')).toContain('manifest.txt');
  expect(body.toString('latin1')).toContain('.pdf');

  // Once the shipment moves on, every document is stale and the set refuses rather than
  // bundling a revision that no longer describes the goods.
  await page.getByLabel('Port of loading').fill('Felixstowe');
  await page.getByRole('button', { name: 'Save shipment' }).click();
  await expect(page.getByText('Documents generated before now are marked stale.')).toBeVisible();
  expect((await page.request.get(setUrl)).status()).toBe(409);
});

test('an archived product leaves the picker but its documents stay readable', async ({ page }) => {
  const org = await startOrganization(page, 'Eider Components');

  await page.goto(`/app/${org}/products/new`);
  await page.getByLabel('Description').fill('Brass ferrule');
  await page.getByLabel('Unit price').fill('1.20');
  await page.getByRole('button', { name: 'Add product' }).click();
  await page.waitForURL(/\/products\/[0-9a-f-]{36}$/);

  await page.getByRole('button', { name: 'Archive this product' }).click();
  await expect(page.getByText('It stays out of the picker')).toBeVisible();

  await page.goto(`/app/${org}/products`);
  await expect(page.getByText('The catalog is empty')).toBeVisible();
  await page.goto(`/app/${org}/products?show=archived`);
  await expect(page.getByRole('link', { name: 'Brass ferrule' })).toBeVisible();

  await createShipment(page, org, 'SHP-ARCHIVED-1');
  await expect(page.getByText('Your catalog is empty.')).toBeVisible();
});
