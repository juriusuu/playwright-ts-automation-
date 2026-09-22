import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage'; // Imports your new class object

test('Full SauceDemo Purchase Flow with POM & Dynamic Loop', async ({ page }) => {
  // 1. Initialize the Page Object and Login
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login('standard_user', 'secret_sauce');

  // 2. Add All 6 Items to Cart (Using the First-Button Loop Trick)
  for (let i = 0; i < 6; i++) {
    await page.getByRole('button', { name: 'Add to cart' }).first().click();
  }

  // 3. Checkout Journey
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="checkout"]').click();
  
  // 4. Fill Information (With WebKit specific focus clicks)
  await page.locator('[data-test="firstName"]').click();
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