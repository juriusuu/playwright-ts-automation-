import { type Page, type Locator } from '@playwright/test';

export class AddToCart {
  private readonly page: Page;
  private readonly addToCartButton: Locator;
  private readonly shoppingCartLink: Locator;
  private readonly menuButton: Locator;
  private readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = page.getByRole('button', { name: 'Add to cart' });
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
  }

  async addAllItemsToCart(count: number = 6) {
    for (let i = 0; i < count; i++) {
      await this.addToCartButton.first().click();
    }
  }

  async goToCart() {
    await this.shoppingCartLink.click();
  }

  // This handles the logout part of Step 7
  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }
}