import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: 2,
  reporter: [['list'], ['html', { open: 'never' }], ['json', { outputFile: 'test-results/results.json' }]],
  use: { baseURL: 'http://127.0.0.1:4177', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: [
    { command: `"${process.execPath}" node_modules/vite/bin/vite.js --host 127.0.0.1 --port 4177 --strictPort`, url: 'http://127.0.0.1:4177', reuseExistingServer: !process.env.CI },
    { command: `"${process.execPath}" server.mjs`, url: 'http://127.0.0.1:3001/persons', reuseExistingServer: !process.env.CI },
  ],
});
