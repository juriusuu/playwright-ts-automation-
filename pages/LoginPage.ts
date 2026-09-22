import { type Page, type Locator } from '@playwright/test';
import { ENV } from '../config/env.config'; // 1. IMPORT YOUR CONFIG FILE

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

  // Action: Navigate to the landing portal using configuration data
  async navigate() {
    await this.page.goto(ENV.urls.baseUrl); // 2. REPLACED HARDCODED URL
  }

  // Action: Fill details and execute submission
  async login(user: string, pass: string) {
    await this.usernameInput.fill(user);
    await this.passwordInput.fill(pass);
    await this.passwordInput.press('Enter');
  }
}