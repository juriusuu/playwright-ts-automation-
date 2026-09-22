import { type Page, type Locator, expect } from '@playwright/test';
import { ENV } from '../config/env.config';

export class LoginPage {
  private readonly page: Page;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  // ✅ Action: Navigate to login page
  async navigate(): Promise<void> {
    await this.page.goto(ENV.urls.baseUrl);
  }

  // ✅ Action: Perform login
  async login(user: string, pass: string): Promise<void> {
    await this.usernameInput.fill(user);
    await this.passwordInput.fill(pass);
    await this.loginButton.click();
  }

  // ✅ Assertion: Verify login success (redirect to inventory)
  async assertLoginSuccess(): Promise<void> {
    await expect(this.page).toHaveURL(ENV.urls.inventoryUrl);
  }

  // ✅ Assertion: Verify login error message
  async assertLoginError(expectedMessage: string): Promise<void> {
    await expect(this.errorMessage).toHaveText(expectedMessage);
  }
}
