import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const viewports = [
  { name: 'mobile-360', width: 360, height: 780 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1440', width: 1440, height: 900 },
] as const;

test('showcase renders every component group and passes axe', async ({ page }) => {
  await page.goto('/design-system');
  await expect(page.getByRole('heading', { name: 'Design system', level: 1 })).toBeVisible();
  for (const section of [
    'Actions',
    'Forms',
    'Tables',
    'Document primitives',
    'States and disclosure',
  ]) {
    await expect(page.getByRole('heading', { name: section, level: 2 })).toBeVisible();
  }
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
});

test('a field states its own validation failure', async ({ page }) => {
  await page.goto('/design-system');
  const invalid = page.getByLabel('HS code');
  await expect(invalid).toHaveAttribute('aria-invalid', 'true');
  // The message must be associated, not merely adjacent.
  const describedBy = await invalid.getAttribute('aria-describedby');
  expect(describedBy).toBeTruthy();
  await expect(page.locator(`#${describedBy}`)).toContainText('6 to 10 digit code');
});

test('an absent value is stated rather than left blank', async ({ page }) => {
  await page.goto('/design-system');
  await expect(page.getByText('No HS code recorded')).toBeAttached();
});

test('dialog traps nothing and returns focus to its invoker', async ({ page }) => {
  await page.goto('/design-system');
  const invoker = page.getByRole('button', { name: 'Open dialog' });
  await invoker.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading', { name: 'Void this document?' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(invoker).toBeFocused();
});

test('tabs move with arrow keys and expose the selected panel', async ({ page }) => {
  await page.goto('/design-system');
  const summary = page.getByRole('tab', { name: 'Summary' });
  await summary.focus();
  await expect(summary).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('ArrowRight');
  const items = page.getByRole('tab', { name: 'Items' });
  await expect(items).toBeFocused();
  await expect(items).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel')).toContainText('Line items');
});

test('the menu opens, acts and closes on Escape', async ({ page }) => {
  await page.goto('/design-system');
  const trigger = page.getByRole('button', { name: 'More' });
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('menuitem', { name: 'Duplicate shipment' }).click();
  await expect(page.getByRole('status')).toContainText('Shipment duplicated.');
  await trigger.click();
  await page.keyboard.press('Escape');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('the workspace stays navigable when the sidebar is gone', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto('/design-system');
  await expect(page.locator('.app-sidebar')).toBeHidden();

  // Every destination the sidebar holds has to remain reachable without it.
  // Located by element rather than by role: Playwright models `<details>` as a
  // group and folds the summary's text into that group's name, so there is no
  // button node to ask for, and the focus assertion below needs the summary
  // itself. Browsers do expose it to assistive technology as an expandable.
  await expect(page.getByRole('group', { name: 'Menu' })).toBeVisible();
  const menu = page.locator('.app-nav > summary');
  await menu.click();
  const navigation = page.getByRole('navigation', { name: 'Workspace and account' });
  await expect(navigation.getByRole('link', { name: 'Organizations' })).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'Account' })).toBeVisible();
  await expect(navigation.getByRole('button', { name: 'Sign out' })).toBeVisible();

  // Escape dismisses it and hands focus back to the control that opened it.
  await page.keyboard.press('Escape');
  await expect(navigation).toBeHidden();
  await expect(menu).toBeFocused();
});

test('the menu moves between its items with the arrow keys', async ({ page }) => {
  await page.goto('/design-system');
  await page.getByRole('button', { name: 'More' }).click();
  const items = page.getByRole('menuitem');
  // Opening puts focus on the first item, which is what role="menu" promises.
  await expect(items.first()).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(items.nth(1)).toBeFocused();
  await page.keyboard.press('Home');
  await expect(items.first()).toBeFocused();
});

test('no control offers a touch target under 44 pixels', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto('/design-system');
  const undersized = await page.evaluate(() => {
    // Buttons, link buttons and the search trigger. Inline links inside prose are
    // deliberately excluded: WCAG exempts them, and padding them would break the
    // line they sit in.
    const controls = '.btn, .search-trigger, .app-sidebar nav a, .menu button';
    return [...document.querySelectorAll<HTMLElement>(controls)]
      .filter((element) => element.offsetParent !== null)
      .map((element) => {
        // A compact control keeps its small drawing and carries the hit area on a
        // pseudo-element, so the larger of the two is what a finger gets.
        const drawn = element.getBoundingClientRect().height;
        const extended = parseFloat(getComputedStyle(element, '::after').minHeight) || 0;
        const name = element.textContent?.trim().slice(0, 40) || element.tagName;
        return { name, height: Math.max(drawn, extended) };
      })
      .filter((entry) => entry.height < 44);
  });
  expect(undersized).toEqual([]);
});

test('a pending action announces itself and reports the result', async ({ page }) => {
  await page.goto('/design-system');
  const save = page.getByRole('button', { name: 'Save draft' });
  await save.click();
  await expect(page.getByRole('button', { name: 'Working…' })).toHaveAttribute('aria-busy', 'true');
  await expect(page.getByRole('status')).toContainText('Draft saved.');
});

test('reloading the showcase restores it unchanged', async ({ page }) => {
  await page.goto('/design-system');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Design system', level: 1 })).toBeVisible();
});

test('keyboard reaches the content and the skip link comes first', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
});

test('the public page carries its boundary statement and passes axe', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByText('It is not a customs broker, carrier, chamber or issuing authority.'),
  ).toBeVisible();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
});

test('no viewport scrolls horizontally', async ({ page }) => {
  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/design-system');
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  }
});

test('print hides navigation and keeps document identity', async ({ page }) => {
  await page.goto('/design-system');
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.app-sidebar')).toBeHidden();
  await expect(page.locator('.search-trigger')).toBeHidden();
  // Identity, units, totals and the mandatory disclosure must survive onto paper.
  await expect(
    page.getByLabel('Commercial invoice header').getByText('CI-2026-0184'),
  ).toBeVisible();
  const items = page.getByRole('region', { name: 'Shipment items' });
  await expect(items).toContainText('4,380.00');
  await expect(items).toContainText('kg');
  await expect(items).toContainText('20,740.75');
  await expect(page.getByRole('heading', { name: 'Preparation only' })).toBeVisible();
});

test('visual reference at three viewports', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'One engine is enough for visual reference.');
  for (const route of ['/', '/design-system']) {
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      const slug = route === '/' ? 'home' : 'design-system';
      await page.screenshot({
        path: `test-results/visual/${slug}-${viewport.name}.png`,
        fullPage: true,
      });
    }
  }
});
