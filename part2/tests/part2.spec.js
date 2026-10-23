import { test, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';

// Every mutation test except the explicitly named persistence test uses isolated
// in-memory HTTP fixtures. It cannot delete or replace learner database entries.
test.beforeEach(async ({ page }) => {
  page.on('pageerror', error => { throw error; });
});

async function directory(page, resource = 'persons') {
  const state = { entries: [
    { id: '1', name: 'Ada Lovelace', number: '111-demo' },
    { id: '2', name: 'Arto Hellas', number: '222-demo' },
  ], writes: [], fail: false };
  await page.route(`http://127.0.0.1:3001/${resource}**`, async route => {
    const request = route.request();
    const method = request.method();
    if (method === 'OPTIONS') return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS', 'access-control-allow-headers': 'content-type' } });
    const send = (status, body) => route.fulfill({ status, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) });
    if (method === 'GET') return state.fail ? send(503, {}) : send(200, state.entries);
    const id = new URL(request.url()).pathname.split('/')[2];
    state.writes.push({ method, id, data: method === 'DELETE' ? null : request.postDataJSON() });
    if (state.fail) return send(503, {});
    if (method === 'POST') {
      const created = { ...request.postDataJSON(), id: randomUUID() };
      state.entries.push(created);
      return send(201, created);
    }
    const existing = state.entries.find(person => person.id === id);
    if (!existing) return send(404, {});
    if (method === 'PUT') {
      const saved = { ...request.postDataJSON(), id };
      state.entries = state.entries.map(person => person.id === id ? saved : person);
      return send(200, saved);
    }
    state.entries = state.entries.filter(person => person.id !== id);
    return send(200, {});
  });
  return state;
}

async function fillPerson(page, name, number) {
  await page.getByLabel('Name', { exact: true }).fill(name);
  await page.getByLabel('Number', { exact: true }).fill(number);
}
const save = page => page.getByRole('button', { name: 'Add / update', exact: true }).click();

test('courseinfo renders every course with stable data and reduce totals', async ({ page }) => {
  await page.goto('/courseinfo/');
  const first = page.getByRole('region', { name: 'Half Stack application development', exact: true });
  const second = page.getByRole('region', { name: 'Node.js', exact: true });
  await expect(first.getByRole('listitem')).toHaveCount(4);
  await expect(first.getByText('Total of 42 exercises')).toBeVisible();
  await expect(second.getByRole('listitem')).toHaveCount(2);
  await expect(second.getByText('Total of 10 exercises')).toBeVisible();
});

test('phonebook loads, filters without case sensitivity and creates once without page navigation', async ({ page }) => {
  const state = await directory(page);
  await page.goto('/phonebook/');
  await expect(page.getByRole('button', { name: 'Delete Ada Lovelace' })).toBeVisible();
  await page.getByLabel('Filter by name').fill('aDA');
  await expect(page.getByRole('button', { name: 'Delete Arto Hellas' })).toHaveCount(0);
  await page.getByLabel('Filter by name').fill('');
  await fillPerson(page, 'New Demo', '333-demo');
  const navigation = [];
  page.on('framenavigated', frame => { if (frame === page.mainFrame()) navigation.push(frame.url()); });
  await save(page);
  await expect(page.getByRole('status')).toHaveText('Added New Demo');
  expect(state.writes).toHaveLength(1);
  expect(state.writes[0]).toMatchObject({ method: 'POST', data: { name: 'New Demo', number: '333-demo' } });
  expect(navigation).toEqual([]);
  await expect(page.getByLabel('Name', { exact: true })).toHaveValue('');
  await page.reload();
  await expect(page.getByRole('button', { name: 'Delete New Demo' })).toBeVisible();
});

test('duplicate warning and declined replacement do not create or change data', async ({ page }) => {
  const state = await directory(page);
  await page.goto('/phonebook/');
  await expect(page.getByRole('button', { name: 'Delete Ada Lovelace' })).toBeVisible();
  await fillPerson(page, '  ADA LOVELACE  ', '111-demo');
  page.once('dialog', dialog => { expect(dialog.type()).toBe('alert'); return dialog.dismiss(); });
  await save(page);
  expect(state.writes).toHaveLength(0);
  await fillPerson(page, 'Ada Lovelace', 'updated-demo');
  page.once('dialog', dialog => { expect(dialog.type()).toBe('confirm'); return dialog.dismiss(); });
  await save(page);
  expect(state.writes).toHaveLength(0);
});

test('accepted replacement uses PUT, retains ID and does not add a duplicate', async ({ page }) => {
  const state = await directory(page);
  await page.goto('/phonebook/');
  await expect(page.getByRole('button', { name: 'Delete Ada Lovelace' })).toBeVisible();
  await fillPerson(page, 'ada lovelace', 'updated-demo');
  page.once('dialog', dialog => dialog.accept());
  await save(page);
  await expect(page.getByRole('status')).toHaveText('Updated Ada Lovelace');
  expect(state.writes[0]).toMatchObject({ method: 'PUT', id: '1' });
  expect(state.entries).toHaveLength(2);
  await expect(page.getByRole('listitem').filter({ has: page.getByRole('button', { name: 'Delete Ada Lovelace' }) })).toContainText('updated-demo');
});

test('delete cancellation preserves fixture; confirmation removes only selected fixture', async ({ page }) => {
  const state = await directory(page);
  await page.goto('/phonebook/');
  page.once('dialog', dialog => dialog.dismiss());
  await page.getByRole('button', { name: 'Delete Ada Lovelace' }).click();
  expect(state.writes).toHaveLength(0);
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Delete Ada Lovelace' }).click();
  await expect(page.getByRole('button', { name: 'Delete Ada Lovelace' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Delete Arto Hellas' })).toBeVisible();
  expect(state.writes[0]).toMatchObject({ method: 'DELETE', id: '1' });
});

test('two browser views recover when a contact is removed before another view updates it', async ({ page, context }) => {
  // Shared mock state across pages models a server. The real database is untouched.
  let entries = [{ id: '1', name: 'Stale Demo', number: '111-demo' }];
  await context.route('http://127.0.0.1:3001/persons**', async route => {
    const method = route.request().method();
    const headers = { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET,PUT,DELETE,OPTIONS', 'access-control-allow-headers': 'content-type' };
    if (method === 'OPTIONS') return route.fulfill({ status: 204, headers });
    if (method === 'GET') return route.fulfill({ status: 200, headers, json: entries });
    if (method === 'DELETE') { entries = []; return route.fulfill({ status: 200, headers, json: {} }); }
    return route.fulfill({ status: 404, headers, json: {} });
  });
  const second = await context.newPage();
  await page.goto('/phonebook/'); await second.goto('/phonebook/');
  await expect(second.getByRole('button', { name: 'Delete Stale Demo' })).toBeVisible();
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Delete Stale Demo' }).click();
  await expect(page.getByRole('button', { name: 'Delete Stale Demo' })).toHaveCount(0);
  await fillPerson(second, 'Stale Demo', 'new-demo');
  second.once('dialog', dialog => dialog.accept());
  await save(second);
  await expect(second.getByRole('alert')).toContainText('already removed from the server');
  await expect(second.getByRole('button', { name: 'Delete Stale Demo' })).toHaveCount(0);
  await second.close();
});

test('failed save preserves form input and does not display false success', async ({ page }) => {
  const state = await directory(page);
  await page.goto('/phonebook/');
  await expect(page.getByRole('button', { name: 'Delete Ada Lovelace' })).toBeVisible();
  state.fail = true;
  await fillPerson(page, 'Retry Demo', '444-demo');
  await save(page);
  await expect(page.getByRole('alert')).toContainText('operation failed');
  await expect(page.getByLabel('Name', { exact: true })).toHaveValue('Retry Demo');
  await expect(page.getByRole('button', { name: 'Delete Retry Demo' })).toHaveCount(0);
  state.fail = false;
  await save(page);
  await expect(page.getByRole('status')).toHaveText('Added Retry Demo');
});

test('initial server failure can be retried and save is disabled until loaded', async ({ page }) => {
  const state = await directory(page);
  state.fail = true;
  await page.goto('/phonebook/');
  await expect(page.getByRole('alert')).toContainText('Cannot load contacts');
  await expect(page.getByRole('button', { name: 'Add / update' })).toBeDisabled();
  state.fail = false;
  await page.getByRole('button', { name: 'Retry loading' }).click();
  await expect(page.getByRole('button', { name: 'Delete Ada Lovelace' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add / update' })).toBeEnabled();
});

test('success notification expires after a few seconds', async ({ page }) => {
  await directory(page);
  await page.goto('/phonebook/');
  await expect(page.getByRole('button', { name: 'Delete Ada Lovelace' })).toBeVisible();
  await fillPerson(page, 'Notification Demo', 'notify-demo');
  await save(page);
  await expect(page.getByRole('status')).toHaveText('Added Notification Demo');
  await expect(page.getByRole('status')).toHaveCount(0, { timeout: 7000 });
});

test('Brewtica lab uses separate contacts resource', async ({ page }) => {
  const state = await directory(page, 'contacts');
  await page.goto('/brewtica-lab/');
  await expect(page.getByRole('heading', { name: 'Buku pemasok kedai' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Delete Ada Lovelace' })).toBeVisible();
  await fillPerson(page, 'Pemasok Test', 'DEMO-TEST');
  await save(page);
  await expect(page.getByRole('status')).toHaveText('Added Pemasok Test');
  expect(state.writes[0].method).toBe('POST');
});

const country = (name, code, capital = 'Demo Capital', lat = 60) => ({
  name: { common: name }, cca3: code, capital: [capital], area: 12345,
  languages: { demo: 'Demo language' }, capitalInfo: { latlng: [lat, 24] },
  flags: { png: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="60"><rect width="100" height="60" fill="navy"/></svg>', alt: `Flag of ${name}` },
});
const sampleCountries = [country('Finland', 'FIN', 'Helsinki'), country('France', 'FRA', 'Paris', 49), ...Array.from({ length: 11 }, (_, index) => country(`Demo Republic ${index}`, `D${index}`))];
async function countryApi(page, options = {}) {
  const state = { weatherRequests: [], failCountries: !!options.failCountries, failWeather: !!options.failWeather };
  await page.route('https://studies.cs.helsinki.fi/restcountries/api/all', route => route.fulfill({ status: state.failCountries ? 503 : 200, json: state.failCountries ? {} : sampleCountries }));
  await page.route('https://api.open-meteo.com/v1/forecast?**', async route => {
    state.weatherRequests.push(route.request().url());
    return route.fulfill({ status: state.failWeather ? 503 : 200, json: state.failWeather ? {} : { current: { temperature_2m: 12, wind_speed_10m: 9, weather_code: 3, time: '2026-10-23T12:00' }, current_units: { temperature_2m: '°C', wind_speed_10m: 'km/h' }, timezone: 'Europe/Helsinki' } });
  });
  return state;
}

test('countries handles empty search, too many, no result, and one result with weather', async ({ page }) => {
  const state = await countryApi(page);
  await page.goto('/countries/');
  await expect(page.getByText('Type a country name to begin.')).toBeVisible();
  expect(state.weatherRequests).toHaveLength(0);
  await page.getByLabel('Find countries').fill('Republic');
  await expect(page.getByText('Too many matches, specify another filter.')).toBeVisible();
  await page.getByLabel('Find countries').fill('does-not-exist');
  await expect(page.getByText('No matching countries.')).toBeVisible();
  await page.getByLabel('Find countries').fill('fINLand');
  await expect(page.getByRole('heading', { name: 'Finland', exact: true })).toBeVisible();
  await expect(page.getByText('Capital: Helsinki')).toBeVisible();
  await expect(page.getByText('Demo language')).toBeVisible();
  await expect(page.getByRole('img', { name: 'Flag of Finland' })).toBeVisible();
  await expect(page.getByText('Temperature 12 °C')).toBeVisible();
  expect(new URL(state.weatherRequests[0]).searchParams.get('latitude')).toBe('60');
  expect(new URL(state.weatherRequests[0]).searchParams.get('wind_speed_unit')).toBeNull();
});

test('country Show button selects details and editing the query resets selection', async ({ page }) => {
  await countryApi(page);
  await page.goto('/countries/');
  await page.getByLabel('Find countries').fill('f');
  await page.getByRole('button', { name: 'Show France', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'France', exact: true })).toBeVisible();
  await page.getByLabel('Find countries').fill('Finland');
  await expect(page.getByRole('heading', { name: 'Finland', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'France', exact: true })).toHaveCount(0);
});

test('countries and weather errors have working retries', async ({ page }) => {
  const state = await countryApi(page, { failCountries: true, failWeather: true });
  await page.goto('/countries/');
  await expect(page.getByRole('alert')).toContainText('Cannot load countries');
  state.failCountries = false;
  await page.getByRole('button', { name: 'Retry countries' }).click();
  await page.getByLabel('Find countries').fill('Finland');
  await expect(page.getByRole('alert')).toContainText('Weather is unavailable');
  state.failWeather = false;
  await page.getByRole('button', { name: 'Retry weather' }).click();
  await expect(page.getByText('Temperature 12 °C')).toBeVisible();
});

test('missing capital coordinates are handled without a wrong weather location', async ({ page }) => {
  const state = await countryApi(page);
  await page.route('https://studies.cs.helsinki.fi/restcountries/api/all', route => route.fulfill({ json: [{ ...country('No Coordinates', 'NOC'), capitalInfo: {} }] }));
  await page.goto('/countries/');
  await page.getByLabel('Find countries').fill('No Coordinates');
  await expect(page.getByText('Capital coordinates unavailable; weather is not requested.')).toBeVisible();
  expect(state.weatherRequests).toHaveLength(0);
});

test('every page fits the viewport', async ({ page }) => {
  await directory(page); await directory(page, 'contacts'); await countryApi(page);
  for (const url of ['/', '/courseinfo/', '/phonebook/', '/countries/', '/brewtica-lab/']) {
    await page.goto(url);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});

test('real json-server persists a new isolated demo contact across browser reload', async ({ page, request }) => {
  // Creates one uniquely named demo row and preserves it. No reset or deletion.
  const name = `Persistence Demo ${randomUUID()}`;
  await page.goto('/brewtica-lab/');
  await expect(page.getByRole('button', { name: 'Add / update' })).toBeEnabled();
  await fillPerson(page, name, 'DEMO-PERSISTENCE');
  const responsePromise = page.waitForResponse(response => response.url() === 'http://127.0.0.1:3001/contacts' && response.request().method() === 'POST');
  await save(page);
  const response = await responsePromise;
  expect(response.status()).toBe(201);
  const saved = await response.json();
  expect(saved.id).toBeTruthy();
  expect(await (await request.get(`http://127.0.0.1:3001/contacts/${saved.id}`)).json()).toMatchObject({ name, number: 'DEMO-PERSISTENCE' });
  await page.reload();
  await expect(page.getByRole('button', { name: `Delete ${name}`, exact: true })).toBeVisible();
});
