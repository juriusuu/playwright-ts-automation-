# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workflow.spec.ts >> @performance Compare Standard vs Glitch User
- Location: tests\workflow.spec.ts:361:5

# Error details

```
Error: expect(received).toBeLessThan(expected)

Expected: < 5000
Received:   5691
```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - generic [ref=f1e4]:
    - banner [ref=f1e5]:
      - generic [ref=f1e6]:
        - generic [ref=f1e7]:
          - button "Open Menu" [ref=f1e8] [cursor=pointer]
          - img "Open Menu" [ref=f1e9]
        - generic [ref=f1e10]: Swag Labs
        - button "Cart, empty" [ref=f1e13]
      - generic [ref=f1e14]: "Checkout: Complete!"
    - main [ref=f1e16]:
      - img "Pony Express" [ref=f1e17]
      - heading "Thank you for your order!" [level=2] [ref=f1e18]
      - generic [ref=f1e19]: Your order has been dispatched, and will arrive just as fast as the pony can get there!
      - generic [ref=f1e20]:
        - button "Back Home" [ref=f1e21] [cursor=pointer]
        - button "Generate PDF order" [ref=f1e22] [cursor=pointer]
  - contentinfo [ref=f1e23]:
    - list [ref=f1e24]:
      - listitem [ref=f1e25]:
        - link "X" [ref=f1e26] [cursor=pointer]:
          - /url: https://x.com/saucelabs
      - listitem [ref=f1e27]:
        - link "Facebook" [ref=f1e28] [cursor=pointer]:
          - /url: https://www.facebook.com/saucelabs
      - listitem [ref=f1e29]:
        - link "LinkedIn" [ref=f1e30] [cursor=pointer]:
          - /url: https://www.linkedin.com/company/sauce-labs/
    - generic [ref=f1e31]: © 2026 Sauce Labs. All Rights Reserved. Terms of Service | Privacy Policy
```

# Test source

```ts
  290 |   await checkoutPage.completeOrder();
  291 |   await checkoutPage.verifyOrderSuccess();
  292 | });
  293 | 
  294 | 
  295 | // =========================================================================
  296 | // 10. PERFORMANCE TESTS
  297 | // =========================================================================
  298 | // ⚡ Performance Test: Checkout duration for Performance Glitch User
  299 | // test('@performance Checkout duration for Performance Glitch User', async ({ page }) => {
  300 | //   const loginPage = new LoginPage(page);
  301 | //   const checkoutPage = new CheckOutPage(page);
  302 | //   const productsPage = new AddToCart(page);
  303 | //   const cartPage = new CartPage(page);
  304 | 
  305 | //   // Login with Performance Glitch User
  306 | //   await loginPage.navigate();
  307 | //   await loginPage.login(ENV.user.users.performance, ENV.user.password);
  308 | 
  309 | //   // Add 3 items → proceed to checkout
  310 | //   await productsPage.addAllItemsToCart(3);
  311 | //   await productsPage.goToCart();
  312 | //   await cartPage.proceedToCheckout();
  313 | 
  314 | //   // Measure checkout duration
  315 | //   const start = Date.now();
  316 | //   await checkoutPage.fillShippingDetailsisGuarded(
  317 | //     ENV.checkout.firstName, ENV.checkout.lastName, ENV.checkout.postalCode
  318 | //   );
  319 | //   await checkoutPage.completeOrder();
  320 | //   const duration = Date.now() - start;
  321 | 
  322 | //   // Assert checkout completes under threshold (e.g., 5s)
  323 | //   expect(duration).toBeLessThan(1000);
  324 | // });
  325 | 
  326 | 
  327 | // test('@performance Checkout duration for Performance Glitch User', async ({ page }) => {
  328 | //   const loginPage = new LoginPage(page);
  329 | //   const checkoutPage = new CheckOutPage(page);
  330 | //   const productsPage = new AddToCart(page);
  331 | //   const cartPage = new CartPage(page);
  332 | 
  333 | //   // Measure the full journey (login → add items → checkout)
  334 | //   const start = Date.now();
  335 | 
  336 | //   // Login with Performance Glitch User
  337 | //   await loginPage.navigate();
  338 | //   await loginPage.login(ENV.user.users.performance, ENV.user.password);
  339 | 
  340 | //   // Add 3 items → proceed to checkout
  341 | //   await productsPage.addAllItemsToCart(3);
  342 | //   await productsPage.goToCart();
  343 | //   await cartPage.proceedToCheckout();
  344 | 
  345 | //   // Fill shipping details and complete order
  346 | //   await checkoutPage.fillShippingDetailsisGuarded(
  347 | //     ENV.checkout.firstName,
  348 | //     ENV.checkout.lastName,
  349 | //     ENV.checkout.postalCode
  350 | //   );
  351 | //   await checkoutPage.completeOrder();
  352 | 
  353 | //   // Stop timer
  354 | //   const duration = Date.now() - start;
  355 | //   console.log(`Checkout duration: ${duration}ms`);
  356 | 
  357 | //   // Assert threshold (set realistically to catch glitch)
  358 | //   expect(duration).toBeLessThan(5000);
  359 | // });
  360 | 
  361 | test('@performance Compare Standard vs Glitch User', async ({ page }) => {
  362 |   const loginPage = new LoginPage(page);
  363 |   const checkoutPage = new CheckOutPage(page);
  364 |   const productsPage = new AddToCart(page);
  365 |   const cartPage = new CartPage(page);
  366 | 
  367 |   async function measureCheckout(user: string) {
  368 |     const start = Date.now();
  369 |     await loginPage.navigate();
  370 |     await loginPage.login(user, ENV.user.password);
  371 |     await productsPage.addAllItemsToCart(3);
  372 |     await productsPage.goToCart();
  373 |     await cartPage.proceedToCheckout();
  374 |     await checkoutPage.fillShippingDetailsisGuarded(
  375 |       ENV.checkout.firstName,
  376 |       ENV.checkout.lastName,
  377 |       ENV.checkout.postalCode
  378 |     );
  379 |     await checkoutPage.completeOrder();
  380 |     return Date.now() - start;
  381 |   }
  382 | 
  383 |   const standardDuration = await measureCheckout(ENV.user.users.standard);
  384 |   const glitchDuration = await measureCheckout(ENV.user.users.performance);
  385 | 
  386 |   console.log(`Standard user checkout: ${standardDuration}ms`);
  387 |   console.log(`Performance glitch user checkout: ${glitchDuration}ms`);
  388 | 
  389 |   expect(standardDuration).toBeLessThan(2000);   // ✅ baseline fast
> 390 |   expect(glitchDuration).toBeLessThan(5000);    // ⚡ will likely fail
      |                          ^ Error: expect(received).toBeLessThan(expected)
  391 | });
```