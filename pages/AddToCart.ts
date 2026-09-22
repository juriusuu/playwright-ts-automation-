import { Page, Locator } from '@playwright/test';

export class AddToCart {
  readonly page: Page;
  readonly addToCartButton: Locator;
  readonly shoppingCartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = page.getByRole('button', { name: 'Add to cart' });
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  // Step 2 Action
  async addAllItemsToCart(count: number = 6): Promise<void> {
    for (let i = 0; i < count; i++) {
      await this.addToCartButton.first().click();
    }
  }

  // Transition Action
  async goToCart(): Promise<void> {
    await this.shoppingCartLink.click();
  }
}