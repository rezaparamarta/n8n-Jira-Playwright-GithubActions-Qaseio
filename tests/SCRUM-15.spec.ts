import { test, expect } from '@playwright/test';

test('SCRUM-15 - [NEGATIVE] Login fails with invalid password', async ({ page }) => {
  test.info().annotations.push({
    type: 'qase',
    description: 'NLFWIP-1',
  });

  await page.goto('https://www.saucedemo.com/');

  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'wrong_password');
  await page.click('#login-button');

  const errorMessage = page.locator('[data-test="error"]');

  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toHaveText(
    'Epic sadface: Username and password do not match any user in this service'
  );
});
