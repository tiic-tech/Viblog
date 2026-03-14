import { expect, Page } from '@playwright/test'

/**
 * Page Object Model for Register page
 */
export class RegisterPage {
  readonly page: Page
  readonly emailInput: ReturnType<Page['locator']>
  readonly passwordInput: ReturnType<Page['locator']>
  readonly confirmPasswordInput: ReturnType<Page['locator']>
  readonly submitButton: ReturnType<Page['locator']>
  readonly errorMessage: ReturnType<Page['locator']>
  readonly loginLink: ReturnType<Page['locator']>

  constructor(page: Page) {
    this.page = page
    this.emailInput = page.locator('input[name="email"]')
    this.passwordInput = page.locator('input[name="password"]')
    this.confirmPasswordInput = page.locator('input[name="confirmPassword"]')
    this.submitButton = page.locator('button[type="submit"]')
    this.errorMessage = page.locator('[data-testid="error-message"]')
    this.loginLink = page.locator('a[href="/login"]')
  }

  async goto() {
    await this.page.goto('/register')
  }

  async register(email: string, password: string) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.confirmPasswordInput.fill(password)
    await this.submitButton.click()
  }

  async expectRegisterError() {
    await expect(this.errorMessage).toBeVisible()
  }

  async expectRedirectToOnboarding() {
    await expect(this.page).toHaveURL(/\/onboarding/)
  }
}