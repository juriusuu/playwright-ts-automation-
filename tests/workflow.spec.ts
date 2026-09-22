import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CheckOutPage } from '../pages/CheckOutPage'; 
import { AddToCart  } from '../pages/AddToCart'; 
import { CartPage } from '../pages/CartPage';         
import { ENV } from '../config/env.config'; // 1. IMPORT YOUR CONFIG FILE

test('Full SauceDemo Purchase Flow with Full POM', async ({ page }) => {
  // Initialize Page Objects
  const loginPage = new LoginPage(page);
  const checkoutPage = new CheckOutPage(page); 
  const productsPage = new AddToCart(page);         
  const cartPage = new CartPage(page);                 

  // 1. Login (Updated to use configuration variables)
  await loginPage.navigate();
  await loginPage.login(ENV.user.users.standard, ENV.user.password);

  // 2. Add All 6 Items to Cart
  await productsPage.addAllItemsToCart(6);
  await productsPage.goToCart();

  // 3. Navigate to Checkout
  await cartPage.proceedToCheckout();
  
  // 4. Fill Information (Updated to use configuration text values)
  await checkoutPage.fillShippingDetails(
    ENV.checkout.firstName, 
    ENV.checkout.lastName, 
    ENV.checkout.postalCode
  );

  // 5. Review & Finish Order
  await checkoutPage.completeOrder();

  // 6. Verify Checkout is Complete
  await checkoutPage.verifyOrderSuccess();

  // 7. Reset and Logout
  await checkoutPage.returnToProducts();
  await productsPage.logout();
});