import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  reporter: [
    ['list'],
    ['playwright-qase-reporter', {
      apiToken: process.env.QASE_API_TOKEN,
      projectCode: process.env.QASE_PROJECT_CODE,
      run: {
        complete: true,
      },
    }],
  ],
});

console.log('QASE_API_TOKEN:', !!process.env.QASE_API_TOKEN);
console.log('QASE_PROJECT_CODE:', process.env.QASE_PROJECT_CODE);

