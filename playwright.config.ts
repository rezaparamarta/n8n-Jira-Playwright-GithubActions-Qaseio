import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: 'https://example.com', // nanti bisa ganti
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
