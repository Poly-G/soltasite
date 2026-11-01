import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://127.0.0.1:3027',
    reducedMotion: 'reduce',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
      args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    } : undefined,
  },
  webServer: process.env.E2E_BASE_URL ? undefined : {
    command: 'npm run build && npm run start -- --port 3027',
    url: 'http://127.0.0.1:3027',
    reuseExistingServer: !process.env.CI,
    env: { SOLTASITE_DESIGN_PREVIEW: 'true', SOLTASITE_COMMERCE_ENABLED: 'false' },
    timeout: 120000,
  },
});
