import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CheckoutPage } from '../pages/CheckOutPage'; // 1. Import your new Page Object
import { AddToCart  } from '../pages/AddToCart'; // 1. ADDED IMPORT
import { CartPage } from '../pages/CartPage';         // 2. ADDED IMPORT

test('Full SauceDemo Purchase Flow with Full POM', async ({ page }) => {
  // Initialize Page Objects
  const loginPage = new LoginPage(page);
  const checkoutPage = new CheckoutPage(page); // 2. Instantiate it
   const productsPage = new AddToCart(page);         // 3. ADDED INSTANCE
  const cartPage = new CartPage(page);                 // 4. ADDED INSTANCE

  // 1. Login
  await loginPage.navigate();
  await loginPage.login('standard_user', 'secret_sauce');

   // 2. Add All 6 Items to Cart (Now handled cleanly by ProductsPage POM)
  await productsPage.addAllItemsToCart(6);
  await productsPage.goToCart();

  // 3. Navigate to Checkout (Now handled cleanly by CartPage POM)
  await cartPage.proceedToCheckout();
  
  // 4. Fill Information (Now completely handled by POM!)
  await checkoutPage.fillShippingDetails('Test', 'Script', '123124');

  // 5. Review & Finish Order
  await checkoutPage.completeOrder();

  // 6. Verify Checkout is Complete
  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');

  // 7. Reset and Logout
  await page.locator('[data-test="back-to-products"]').click();
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.locator('[data-test="logout-sidebar-link"]').click();
});