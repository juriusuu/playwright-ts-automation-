import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly checkoutButton: Locator;
  readonly cartBadge: Locator;
  readonly cartItems: Locator;
  readonly continueShoppingButton: Locator;

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
  async assertCartCount(expected: number): Promise<void> {
    await expect(this.cartBadge).toHaveText(String(expected));
  }

  async assertCartItems(expected: number): Promise<void> {
    await expect(this.cartItems).toHaveCount(expected);
  }
}
