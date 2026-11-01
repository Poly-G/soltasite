import { test, expect } from '@playwright/test';

const routes = ['/', '/start', '/privacy', '/terms', '/accessibility', '/examples/maya', '/examples/devon', '/preview/materials'];

for (const width of [1440, 390, 375]) {
  test(`routes render without horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const failures: string[] = [];
    page.on('pageerror', (error) => failures.push(error.message));
    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status(), route).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('h1')).toBeVisible();
      const dimensions = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
      expect(dimensions.scroll, route).toBeLessThanOrEqual(dimensions.width);
      expect(await page.locator('img').evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0)), route).toBeTruthy();
    }
    expect(failures).toEqual([]);
  });
}

test('FAQ expands on phone, galleries and fictional reel dialogs work', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const faq = page.locator('details.faq').first();
  await expect(faq).not.toHaveAttribute('open');
  await faq.locator('summary').click();
  await expect(faq).toHaveAttribute('open');
  await expect(faq.locator('.p')).toBeVisible();
  for (const route of ['/examples/maya', '/examples/devon']) {
    await page.goto(route);
    const more = page.getByRole('button', { name: /view all|show all/i }).first();
    await more.click();
    await expect(page.getByRole('button', { name: /show fewer|show less|less/i })).toBeVisible();
    const reel = page.getByRole('button', { name: /play.*reel|watch.*reel/i }).first();
    await reel.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
  }
});

test('paid materials cannot be opened without access and APIs fail closed when unconfigured', async ({ page, request }) => {
  await page.goto('/thanks');
  await expect(page).toHaveURL(/\/start$/);
  for (const route of ['/api/checkout', '/api/materials', '/api/uploads']) {
    const response = await request.post(route, { data: {}, headers: { Origin: 'https://soltasite.com' } });
    expect(response.status()).toBe(503);
    expect((await response.json()).ok).not.toBe(true);
  }
});

test('materials draft preserves checkbox state and preview never submits', async ({ page }) => {
  let writes = 0;
  page.on('request', request => { if (request.method() === 'POST' && /\/api\/(uploads|materials)/.test(request.url())) writes++; });
  await page.goto('/preview/materials');
  await expect(page.locator('#materials')).toHaveAttribute('data-materials-ready', 'true');
  await page.getByLabel('Your name, as it should appear on the site').fill('Preview Actor');
  const parent = page.getByRole('checkbox', { name: /parent filling/i });
  await parent.check();
  await parent.uncheck();
  await page.reload();
  await expect(page.locator('#materials')).toHaveAttribute('data-materials-ready', 'true');
  await expect(page.getByLabel('Your name, as it should appear on the site')).toHaveValue('Preview Actor');
  await expect(parent).not.toBeChecked();
  await page.getByLabel("I'm looking for one", { exact: true }).check();
  await expect(page.getByLabel("Rep's name and agency")).toBeDisabled();
  await page.locator('input[name="color"][value="custom"]').check();
  await expect(page.getByLabel('Custom color', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: /send it|preview/i }).last().click();
  await expect(page.getByText('Preview only. Nothing was uploaded or submitted.', { exact: true })).toBeVisible();
  expect(writes).toBe(0);
});

test('marketing content remains visible without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'See what yours could look like.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Be ready the next time casting looks you up.' })).toBeVisible();
  await context.close();
});
