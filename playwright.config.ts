import { defineConfig } from '@playwright/test';

export default defineConfig({
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
