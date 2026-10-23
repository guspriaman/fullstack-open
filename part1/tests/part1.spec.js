import { test, expect } from '@playwright/test';

const errors = new WeakMap();
test.beforeEach(async ({ page }) => {
  errors.set(page, []);
  page.on('pageerror', error => errors.get(page).push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.get(page).push(message.text()); });
});
test.afterEach(async ({ page }) => { expect(errors.get(page)).toEqual([]); });

test('courseinfo renders nested data and the correct total', async ({ page }) => {
  await page.goto('/courseinfo/');
  await expect(page.getByRole('heading', { name: 'Half Stack application development' })).toBeVisible();
  await expect(page.getByText('Fundamentals of React 10', { exact: true })).toBeVisible();
  await expect(page.getByText('Using props to pass data 7', { exact: true })).toBeVisible();
  await expect(page.getByText('State of a component 14', { exact: true })).toBeVisible();
  await expect(page.getByText('Number of exercises 31', { exact: true })).toBeVisible();
});

test('unicafe handles empty feedback, negative average and reload', async ({ page }) => {
  await page.goto('/unicafe/');
  await expect(page.getByText('No feedback given')).toBeVisible();
  await expect(page.getByRole('table')).toHaveCount(0);
  await page.getByRole('button', { name: 'bad', exact: true }).click();
  await expect(page.getByRole('row', { name: 'average -1.00', exact: true })).toBeVisible();
  await expect(page.getByRole('row', { name: 'positive 0.0 %', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText('No feedback given')).toBeVisible();
});

test('unicafe derives all statistics from separate counters', async ({ page }) => {
  await page.goto('/unicafe/');
  await page.getByRole('button', { name: 'good', exact: true }).click({ clickCount: 2 });
  await page.getByRole('button', { name: 'neutral', exact: true }).click();
  await page.getByRole('button', { name: 'bad', exact: true }).click();
  for (const name of ['good 2', 'neutral 1', 'bad 1', 'all 4', 'average 0.25', 'positive 50.0 %']) {
    await expect(page.getByRole('row', { name, exact: true })).toBeVisible();
  }
});

test('anecdotes retains independent votes and shows the largest vote count', async ({ page }) => {
  // Deterministic test input for the random selection, confined to this isolated context.
  await page.addInitScript(() => { Math.random = () => 0.3; });
  await page.goto('/anecdotes/');
  const selected = page.getByRole('region', { name: 'Selected anecdote' });
  const winner = page.getByRole('region', { name: 'Most voted anecdote' });
  const first = await selected.locator('.quote').innerText();
  await page.getByRole('button', { name: 'vote', exact: true }).click({ clickCount: 2 });
  await expect(selected.getByText('has 2 votes', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'next anecdote' }).click();
  await expect(selected.locator('.quote')).not.toHaveText(first);
  await expect(selected.getByText('has 0 votes', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'vote', exact: true }).click();
  await expect(selected.getByText('has 1 votes', { exact: true })).toBeVisible();
  await expect(winner.locator('.quote')).toHaveText(first);
  await expect(winner.getByText('has 2 votes', { exact: true })).toBeVisible();
});

test('cart shares state between product cards and totals without API calls', async ({ page }, testInfo) => {
  const apiRequests = [];
  page.on('request', request => { if (new URL(request.url()).pathname.startsWith('/api/')) apiRequests.push(request.url()); });
  await page.goto('/brewtica-lab/');
  await page.getByRole('button', { name: 'Tambah Kopi Demo' }).click();
  await page.getByRole('button', { name: 'Tambah Teh Demo' }).click({ clickCount: 2 });
  const cart = page.getByRole('region', { name: 'Keranjang React' });
  await expect(cart.getByText('Kopi Demo × 1', { exact: true })).toBeVisible();
  await expect(cart.getByText('Teh Demo × 2', { exact: true })).toBeVisible();
  await expect(cart.locator('.number')).toContainText('61.000');
  await page.screenshot({ path: testInfo.outputPath('react-cart.png'), fullPage: true });
  await page.getByRole('button', { name: 'Kurangi Teh Demo' }).click();
  await expect(cart.locator('.number')).toContainText('43.000');
  await page.getByRole('button', { name: 'Kurangi Teh Demo' }).click();
  await expect(page.getByRole('button', { name: 'Kurangi Teh Demo' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Kurangi Kopi Demo' }).click();
  await expect(cart.getByText('Keranjang masih kosong.')).toBeVisible();
  expect(apiRequests).toEqual([]);
});

test('cart respects stock limits and resets its in-memory state on reload', async ({ page }) => {
  await page.goto('/brewtica-lab/');
  const coffee = page.getByRole('button', { name: 'Tambah Kopi Demo' });
  for (let i = 0; i < 5; i++) await coffee.click();
  await expect(coffee).toBeDisabled();
  await page.getByRole('button', { name: 'Kurangi Kopi Demo' }).click();
  await expect(coffee).toBeEnabled();
  await page.reload();
  await expect(page.getByText('Keranjang masih kosong.')).toBeVisible();
});

test('all pages fit the viewport and expose a main heading', async ({ page }) => {
  for (const route of ['/', '/courseinfo/', '/unicafe/', '/anecdotes/', '/brewtica-lab/']) {
    await page.goto(route);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow, route).toBe(false);
  }
});
