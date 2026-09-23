import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CheckOutPage } from '../pages/CheckOutPage'; 
import { AddToCart } from '../pages/AddToCart'; 
import { CartPage } from '../pages/CartPage';         
import { ENV } from '../config/env.config'; // <-- Your configuration file

// =========================================================================
// 1. SUCCESSFUL PROFILES LOOP (Standard, Performance Glitch, Visual)
// =========================================================================
const successfulUsers = [
  { label: 'Standard User', username: ENV.user.users.standard },
  { label: 'Performance Glitch User', username: ENV.user.users.performance },
  { label: 'Visual User', username: ENV.user.users.visual }
];

for (const profile of successfulUsers) {
  test(`Full SauceDemo Purchase Flow - ${profile.label}`, async ({ page }) => {
    // Initialize Page Objects
    const loginPage = new LoginPage(page);
    const checkoutPage = new CheckOutPage(page); 
    const productsPage = new AddToCart(page);         
    const cartPage = new CartPage(page);                 

    // 1. Login
    await loginPage.navigate();
    await loginPage.login(profile.username, ENV.user.password);
    await expect(page).toHaveURL(ENV.urls.inventoryUrl);

    // 2. Add All 6 Items
    await productsPage.addAllItemsToCart(6);
    await productsPage.goToCart();
    await cartPage.assertCartCount(6);

    // 3. Checkout
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingDetails(
      ENV.checkout.firstName, 
      ENV.checkout.lastName, 
      ENV.checkout.postalCode
    );

    // 4. Complete Order
    await checkoutPage.completeOrder();
    await checkoutPage.verifyOrderSuccess();

    // 5. Reset & Logout
    await checkoutPage.returnToProducts();
    await productsPage.logout();
    await expect(page).toHaveURL(ENV.urls.baseUrl);
  });
}

// =========================================================================
// 2. BLOCKED FLOW (Locked Out User)
// =========================================================================
test('SauceDemo Flow Block Check - Locked Out User', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.login(ENV.user.users.locked, ENV.user.password);

  const errorContainer = page.locator('[data-test="error"]');
  await expect(errorContainer).toHaveText(ENV.user.expectedMessages.lockedOut);
});

// =========================================================================
// 3. KNOWN BUG PROFILES (Problem & Error Users)
// =========================================================================
test('SauceDemo Purchase Flow Defect Profiling - Problem User', async ({ page }) => {
  test.fail(); // Expect failure, keeps pipeline green

  const loginPage = new LoginPage(page);
  const checkoutPage = new CheckOutPage(page); 
  const productsPage = new AddToCart(page);         
  const cartPage = new CartPage(page);                 

  await loginPage.navigate();
  await loginPage.login(ENV.user.users.problem, ENV.user.password);

  await productsPage.addAllItemsToCart(6); 
  await productsPage.goToCart();
  await cartPage.proceedToCheckout();
  await checkoutPage.fillShippingDetails(
    ENV.checkout.firstName, 
    ENV.checkout.lastName, 
    ENV.checkout.postalCode
  );
});

test('SauceDemo Purchase Flow Defect Profiling - Error User', async ({ page }) => {
  test.fail(); // Expect failure, keeps pipeline green

  const loginPage = new LoginPage(page);
  const checkoutPage = new CheckOutPage(page); 
  const productsPage = new AddToCart(page);         
  const cartPage = new CartPage(page);                 

  await loginPage.navigate();
  await loginPage.login(ENV.user.users.error, ENV.user.password);

  await productsPage.addAllItemsToCart(6);
  await productsPage.goToCart();
  await cartPage.proceedToCheckout();
  await checkoutPage.fillShippingDetails(
    ENV.checkout.firstName, 
    ENV.checkout.lastName, 
    ENV.checkout.postalCode
  );

});  // ✅ close Error User test here

// =========================================================================
// 4. SMOKE TEST
// =========================================================================
test('Smoke Test - Login and Logout', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productsPage = new AddToCart(page);

  await loginPage.navigate();
  await loginPage.login(ENV.user.users.standard, ENV.user.password);
  await expect(page).toHaveURL(ENV.urls.inventoryUrl);

  await productsPage.logout();
  await expect(page).toHaveURL(ENV.urls.baseUrl);
});

// =========================================================================
// 5. VISUAL REGRESSION TEST
// =========================================================================
test('Visual Regression - Inventory Page', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.login(ENV.user.users.visual, ENV.user.password);
  await expect(page).toHaveURL(ENV.urls.inventoryUrl);

  await page.waitForLoadState('networkidle');

  await expect(page).toHaveScreenshot('inventory-visual.png', {
    maxDiffPixelRatio: 0.05,
  });
});