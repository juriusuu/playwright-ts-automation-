import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly checkoutButton: Locator;
  readonly cartBadge: Locator;
  readonly cartItems: Locator;
  readonly continueShoppingButton: Locator;

    private static readonly productSelectors: Record<string, string> = {
    backpack: "backpack",
    bikeLight: "bike-light",
    boltTShirt: "bolt-t-shirt",
    fleeceJacket: "fleece-jacket",
    onesie: "onesie",
    redTShirt: "test.allthethings()-t-shirt-(red)"
  };

  

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartItems = page.locator('.cart_item');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  // ✅ Actions
  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  // ✅ Assertions
  // async assertCartCount(expected: number): Promise<void> {
  //   await expect(this.cartBadge).toHaveText(String(expected));
  // }

  async assertCartCount(expected: number): Promise<void> {
  if (expected === 0) {
    await expect(this.cartBadge).toHaveCount(0); // ✅ badge disappears
  } else {
    await expect(this.cartBadge).toHaveText(String(expected));
  }
}

  async assertCartItems(expected: number): Promise<void> {
    await expect(this.cartItems).toHaveCount(expected);
  }



  async removeItemFromCart(productKey: keyof typeof CartPage.productSelectors): Promise<void> {
    const selector = CartPage.productSelectors[productKey];
    const removeButton = this.page.locator(`[data-test="remove-sauce-labs-${selector}"]`);
    await removeButton.click();
  }

}

  // // ✅ Action: Remove item from cart by product name
  // async removeItemFromCart(productName: string): Promise<void> {
  //   const removeButton = this.page.locator(`.cart_item:has-text("${productName}") button`);
  //   await removeButton.click();
  // }



  // ✅ Action: Remove item from cart by product key
// async removeItemFromCart(productKey: string): Promise<void> {
//   // Example: productKey = "backpack" → matches data-test="remove-sauce-labs-backpack"
//   const removeButton = this.page.locator(`[data-test="remove-sauce-labs-${productKey}"]`);
//   await removeButton.click();
// }