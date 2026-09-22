import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
  private readonly page: Page;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;

  constructor(page: Page) {
    this.page = page;
    // Define the elements belonging to the login screen
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
  }

  // Action: Navigate to the landing portal
  async navigate() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  // Action: Fill details and execute submission
  async login(user: string, pass: string) {
    await this.usernameInput.fill(user);
    await this.passwordInput.fill(pass);
    await this.passwordInput.press('Enter');
  }
}