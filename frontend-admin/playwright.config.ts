import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  reporter: 'line',
  use: {
    baseURL: 'http://localhost:5176',
  },
  projects: [
    {
      name: 'chromium-no-cors',
      use: {
        ...devices['Desktop Chrome'],
        launchPersistentContext: '/tmp/playwright-dev-profile',
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process',
          ],
        },
      },
    },
  ],
});
