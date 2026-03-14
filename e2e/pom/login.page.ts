import { expect, Page } from '@playwright/test'

/**
 * Page Object Model for Login page
 */
export class LoginPage {
  readonly page: Page
  readonly emailInput: ReturnType<Page['locator']>
  readonly passwordInput: ReturnType<Page['locator']>
  readonly submitButton: ReturnType<Page['locator']>
  readonly errorMessage: ReturnType<Page['locator']>
  readonly registerLink: ReturnType<Page['locator']>

  constructor(page: Page) {
    this.page = page
    this.emailInput = page.locator('input[name="email"]')
    this.passwordInput = page.locator('input[name="password"]')
    this.submitButton = page.locator('button[type="submit"]')
    this.errorMessage = page.locator('[data-testid="error-message"]')
    this.registerLink = page.locator('a[href="/register"]')
  }

  async goto() {
    await this.page.goto('/login')
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.submitButton.click()
  }

  async expectLoginError() {
    await expect(this.errorMessage).toBeVisible()
  }

  async expectRedirectToDashboard() {
    await expect(this.page).toHaveURL(/\/(dashboard|onboarding)/)
  }
}