import { type Page, type Locator, expect } from '@playwright/test';

export class CheckOutPage {
  private readonly page: Page;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly finishButton: Locator;
  private readonly completeHeader: Locator;
  private readonly backToProductsButton: Locator;
  private readonly summaryInfo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.completeHeader = page.locator('.complete-header');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
    this.summaryInfo = page.locator('.summary_info');
  }

  // ✅ Action: Fill out the shipping form
  async fillShippingDetails(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  // ✅ Assertion: Verify summary page is visible before finishing
  async assertSummaryVisible(): Promise<void> {
    await expect(this.summaryInfo).toBeVisible();
  }

  // ✅ Action: Complete the purchase order
  async completeOrder(): Promise<void> {
    await this.finishButton.click();
  }

  // ✅ Assertion: Verify Checkout is Complete
  async verifyOrderSuccess(): Promise<void> {
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }

  // ✅ Action: Reset and return back to products catalog
  async returnToProducts(): Promise<void> {
    await this.backToProductsButton.click();
  }
}
