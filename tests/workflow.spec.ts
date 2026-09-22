import { test, expect } from '@playwright/test';

test('Full SauceDemo Purchase Flow', async ({ page }) => {
  // 1. Login
  await page.goto('https://www.saucedemo.com/');
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="password"]').press('Enter');

  // 2. Add All 6 Items to Cart
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
  await page.locator('[data-test="add-to-cart-test\\.allthethings\\(\\)-t-shirt-\\(red\\)"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();

  // 3. Checkout Journey
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="checkout"]').click();
  
  // 4. Fill Information
 await page.locator('[data-test="firstName"]').click(); // Force focus first
  await page.locator('[data-test="firstName"]').fill('Test');
  
  await page.locator('[data-test="lastName"]').click();
  await page.locator('[data-test="lastName"]').fill('Script');
  
  await page.locator('[data-test="postalCode"]').click();
  await page.locator('[data-test="postalCode"]').fill('123124');
  
  await page.locator('[data-test="continue"]').click();

  // 5. Review & Finish Order
  await page.locator('[data-test="finish"]').click();

  // 6. Verify Checkout is Complete
  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');

  // 7. Reset and Logout
  await page.locator('[data-test="back-to-products"]').click();
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.locator('[data-test="logout-sidebar-link"]').click();
});