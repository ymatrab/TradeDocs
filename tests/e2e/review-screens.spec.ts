import { test } from '@playwright/test';

/**
 * Full-page captures of the public pages for design review. The owner reviews the visual
 * system from these while preview deployments are unavailable; they assert nothing.
 * Reduced motion renders every section in its final state rather than mid-entrance.
 */
const pages = [
  ['home', '/'],
  ['tools', '/tools'],
  ['cbm', '/tools/cbm-calculator'],
  ['invoice-generator', '/tools/invoice-generator'],
  ['incoterms-fob', '/tools/incoterms/fob'],
  ['sign-in', '/sign-in'],
  ['proforma-generator', '/tools/proforma-invoice-generator'],
  ['packing-list-generator', '/tools/packing-list-generator'],
  ['landed-cost', '/tools/landed-cost-calculator'],
  ['guides', '/guides'],
  ['guide-lcl-fcl', '/guides/lcl-vs-fcl'],
  ['pricing', '/pricing'],
  ['blog', '/blog'],
  ['post-commercial-invoice', '/blog/commercial-invoice-requirements'],
] as const;

test.describe('review screens', () => {
  for (const [name, path] of pages) {
    test(`captures ${name}`, async ({ page }, info) => {
      test.skip(!['chromium', 'mobile'].includes(info.project.name), 'One capture per viewport.');
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      // Chromium cannot capture past 32,767 px, which a long page on a phone exceeds.
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      const width = page.viewportSize()?.width ?? 1280;
      await page.screenshot({
        path: `test-results/review/${info.project.name}-${name}.png`,
        fullPage: true,
        scale: 'css',
        clip: { x: 0, y: 0, width, height: Math.min(height, 16000) },
      });
    });
  }
});
