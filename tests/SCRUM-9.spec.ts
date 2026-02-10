
import { test, expect } from '@playwright/test';

test('SCRUM-9 - [NEGATIVE] Login fails with invalid password', async ({ page }) => {
  test.info().annotations.push({
    type: 'qase',
    description: 'SCRUM-9'
  });

  
  await page.goto('/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'wrong_password');
  await page.click('#login-button');

  await expect(page.locator('[data-test="error"]')).toBeVisible();
  await expect(page).toHaveURL(/login/);
  
});
