import { test as base, expect, Page } from '@playwright/test'

/**
 * Authentication state for tests
 */
interface AuthFixtures {
  /**
   * Page with authenticated user session
   */
  authenticatedPage: Page

  /**
   * Test user credentials
   */
  testUser: {
    username: string
    email: string
    password: string
    id: string
  }
}

/**
 * Generate unique test username
 */
export function generateTestUsername(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(7)
  return `testuser_${timestamp}_${random}`
}

/**
 * Generate unique test email
 */
export function generateTestEmail(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(7)
  return `test-${timestamp}-${random}@viblog.test`
}

/**
 * Test user password
 */
export const TEST_PASSWORD = 'TestPassword123!'

/**
 * Extended test with authentication fixtures
 *
 * Note: Authentication tests are separated to avoid Supabase rate limits.
 * Run with E2E_RUN_AUTH_TESTS=1 to enable authenticated tests.
 */
export const test = base.extend<AuthFixtures>({
  testUser: async ({}, use) => {
    const user = {
      username: generateTestUsername(),
      email: generateTestEmail(),
      password: TEST_PASSWORD,
      id: '',
    }
    await use(user)
  },

  authenticatedPage: async ({ page, testUser }, use) => {
    // Only run auth tests when explicitly enabled
    if (!process.env.E2E_RUN_AUTH_TESTS) {
      // Skip by not calling use - test will fail with clear message
      throw new Error('Set E2E_RUN_AUTH_TESTS=1 to run authenticated tests')
    }

    // Register the user
    await page.goto('/register')
    await page.fill('input[name="username"]', testUser.username)
    await page.fill('input[name="email"]', testUser.email)
    await page.fill('input[name="password"]', testUser.password)
    await page.fill('input[name="confirmPassword"]', testUser.password)
    await page.click('button[type="submit"]')

    // Wait for redirect to dashboard or onboarding
    await page.waitForURL(/\/(dashboard|onboarding)/, { timeout: 30000 })

    await use(page)
  },
})

export { expect }