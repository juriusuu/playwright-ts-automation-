import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CheckOutPage } from '../pages/CheckOutPage'; 
import { AddToCart } from '../pages/AddToCart'; 
import { CartPage } from '../pages/CartPage';         
import { ENV } from '../config/env.config'; // <-- Your configuration file
import { backup } from 'node:sqlite';

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
    await checkoutPage.fillShippingDetailsisGuarded(
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

// =========================================================================
// 6. NEGATIVE TESTS
// =========================================================================
// ❌ Negative Test: Checkout fails without postal code
test('@negative Checkout fails without postal code', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const checkoutPage = new CheckOutPage(page);
  const productsPage = new AddToCart(page);
  const cartPage = new CartPage(page);

  // Login with Standard User
  await loginPage.navigate();
  await loginPage.login(ENV.user.users.standard, ENV.user.password);

  // Add 1 item to cart
  await productsPage.addAllItemsToCart(1);
  await productsPage.goToCart();
  await cartPage.proceedToCheckout();

  // Leave postal code empty → expect error
  await checkoutPage.fillShippingDetails(ENV.checkout.firstName, ENV.checkout.lastName, '');
  const errorContainer = page.locator('[data-test="error"]');
  await expect(errorContainer).toHaveText('Error: Postal Code is required');
});


// =========================================================================
// 7. BOUNDARY TESTS
// =========================================================================
// 🔎 Boundary Test: Add and remove items from cart
test('@boundary Add and remove items from cart', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productsPage = new AddToCart(page);
  const cartPage = new CartPage(page);

  // Login
  await loginPage.navigate();
  await loginPage.login(ENV.user.users.standard, ENV.user.password);

  // Add 1 item → assert badge count
  await productsPage.addAllItemsToCart(1);
  await cartPage.assertCartCount(1);

  // Remove item → assert cart empty
  await cartPage.removeItemFromCart("backpack");
  await cartPage.assertCartCount(0);
});

// =========================================================================
// 8. UI TESTS
// =========================================================================

// 🎨 UI Test: Visual regression on Cart Page
// test('@ui Visual Regression - Cart Page', async ({ page }) => {
//   const loginPage = new LoginPage(page);
//   const productsPage = new AddToCart(page);

//   // Login with Visual User
//   await loginPage.navigate();
//   await loginPage.login(ENV.user.users.visual, ENV.user.password);

//   // Add 2 items → go to cart
//   await productsPage.addAllItemsToCart(2);
//   await productsPage.goToCart();

//   // Screenshot comparison
//   await page.waitForLoadState('networkidle');
//   await expect(page).toHaveScreenshot('cart-visual.png', { maxDiffPixelRatio: 0.05 });
// });
// 🎨 UI Test: Visual regression on Cart Page (Standard User)
test('@ui Visual Regression - Cart Page (Standard User)', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productsPage = new AddToCart(page);

  await loginPage.navigate();
  await loginPage.login(ENV.user.users.standard, ENV.user.password);

  await productsPage.addAllItemsToCart(2);
  await productsPage.goToCart();

  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('cart-standard.png', { maxDiffPixelRatio: 0.05 });
});

// 🎨 UI Test: Visual regression on Cart Page (Visual User)
test('@ui Visual Regression - Cart Page (Visual User)', async ({ page }) => {
  test.fail(); // ✅ mark as defect profile
  const loginPage = new LoginPage(page);
  const productsPage = new AddToCart(page);

  await loginPage.navigate();
  await loginPage.login(ENV.user.users.visual, ENV.user.password);

  await productsPage.addAllItemsToCart(2);
  await productsPage.goToCart();

  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('cart-visual.png', { maxDiffPixelRatio: 0.05 });
});

// 🎨 UI Test: Visual regression on Cart Page (Problem User)
test('@ui Visual Regression - Cart Page (Problem User)', async ({ page }) => {
  test.fail(); // ✅ expected defect
  const loginPage = new LoginPage(page);
  const productsPage = new AddToCart(page);

  await loginPage.navigate();
  await loginPage.login(ENV.user.users.problem, ENV.user.password);

  await productsPage.addAllItemsToCart(2);
  await productsPage.goToCart();

  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('cart-problem.png', { maxDiffPixelRatio: 0.05 });
});
// ====

// =========================================================================
// 9. UAT TESTS
// =========================================================================

// 👥 UAT Test: User removes item before checkout
test('@uat User removes item before checkout', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const checkoutPage = new CheckOutPage(page);
  const productsPage = new AddToCart(page);
  const cartPage = new CartPage(page);

  await loginPage.navigate();
  await loginPage.login(ENV.user.users.standard, ENV.user.password);

  await productsPage.addAllItemsToCart(2);
  await productsPage.goToCart();

  // ✅ Remove one item by name
  await cartPage.removeItemFromCart("bikeLight");
  await cartPage.assertCartCount(1);

  await cartPage.proceedToCheckout();
  await checkoutPage.fillShippingDetailsisGuarded(
    ENV.checkout.firstName,
    ENV.checkout.lastName,
    ENV.checkout.postalCode
  );
  await checkoutPage.completeOrder();
  await checkoutPage.verifyOrderSuccess();
});


// =========================================================================
// 10. PERFORMANCE TESTS
// =========================================================================
// ⚡ Performance Test: Checkout duration for Performance Glitch User
// test('@performance Checkout duration for Performance Glitch User', async ({ page }) => {
//   const loginPage = new LoginPage(page);
//   const checkoutPage = new CheckOutPage(page);
//   const productsPage = new AddToCart(page);
//   const cartPage = new CartPage(page);

//   // Login with Performance Glitch User
//   await loginPage.navigate();
//   await loginPage.login(ENV.user.users.performance, ENV.user.password);

//   // Add 3 items → proceed to checkout
//   await productsPage.addAllItemsToCart(3);
//   await productsPage.goToCart();
//   await cartPage.proceedToCheckout();

//   // Measure checkout duration
//   const start = Date.now();
//   await checkoutPage.fillShippingDetailsisGuarded(
//     ENV.checkout.firstName, ENV.checkout.lastName, ENV.checkout.postalCode
//   );
//   await checkoutPage.completeOrder();
//   const duration = Date.now() - start;

//   // Assert checkout completes under threshold (e.g., 5s)
//   expect(duration).toBeLessThan(1000);
// });


// test('@performance Checkout duration for Performance Glitch User', async ({ page }) => {
//   const loginPage = new LoginPage(page);
//   const checkoutPage = new CheckOutPage(page);
//   const productsPage = new AddToCart(page);
//   const cartPage = new CartPage(page);

//   // Measure the full journey (login → add items → checkout)
//   const start = Date.now();

//   // Login with Performance Glitch User
//   await loginPage.navigate();
//   await loginPage.login(ENV.user.users.performance, ENV.user.password);

//   // Add 3 items → proceed to checkout
//   await productsPage.addAllItemsToCart(3);
//   await productsPage.goToCart();
//   await cartPage.proceedToCheckout();

//   // Fill shipping details and complete order
//   await checkoutPage.fillShippingDetailsisGuarded(
//     ENV.checkout.firstName,
//     ENV.checkout.lastName,
//     ENV.checkout.postalCode
//   );
//   await checkoutPage.completeOrder();

//   // Stop timer
//   const duration = Date.now() - start;
//   console.log(`Checkout duration: ${duration}ms`);

//   // Assert threshold (set realistically to catch glitch)
//   expect(duration).toBeLessThan(5000);
// });

test('@performance Compare Standard vs Glitch User', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const checkoutPage = new CheckOutPage(page);
  const productsPage = new AddToCart(page);
  const cartPage = new CartPage(page);

  async function measureCheckout(user: string) {
    const start = Date.now();
    await loginPage.navigate();
    await loginPage.login(user, ENV.user.password);
    await productsPage.addAllItemsToCart(3);
    await productsPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingDetailsisGuarded(
      ENV.checkout.firstName,
      ENV.checkout.lastName,
      ENV.checkout.postalCode
    );
    await checkoutPage.completeOrder();
    return Date.now() - start;
  }

  const standardDuration = await measureCheckout(ENV.user.users.standard);
  const glitchDuration = await measureCheckout(ENV.user.users.performance);

  console.log(`Standard user checkout: ${standardDuration}ms`);
  console.log(`Performance glitch user checkout: ${glitchDuration}ms`);

  expect(standardDuration).toBeLessThan(2000);   // ✅ baseline fast
  expect(glitchDuration).toBeLessThan(5000);    // ⚡ will likely fail
});