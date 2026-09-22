import { type Page, type Locator } from '@playwright/test';

export class CheckoutPage {
  private readonly page: Page;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly finishButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Define all checkout screen elements
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
  }

  // Action: Fill out the shipping form and continue
  async fillShippingDetails(firstName: string, lastName: string, postalCode: string) {
    // Keep your WebKit-safe focus clicks here!
    await this.firstNameInput.click();
    await this.firstNameInput.fill(firstName);
    
    await this.lastNameInput.click();
    await this.lastNameInput.fill(lastName);
    
    await this.postalCodeInput.click();
    await this.postalCodeInput.fill(postalCode);
    
    await this.continueButton.click();
  }

  // Action: Complete the purchase order
  async completeOrder() {
    await this.finishButton.click();
  }
}