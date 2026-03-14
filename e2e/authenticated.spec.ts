import { test, expect } from './fixtures'

/**
 * Authenticated E2E Tests
 *
 * These tests require actual user authentication.
 * Run with: E2E_RUN_AUTH_TESTS=1 pnpm test:e2e
 *
 * Note: Supabase has rate limits on email sending.
 * Use sparingly or configure a test user.
 */
test.describe('Authenticated Flows (requires E2E_RUN_AUTH_TESTS=1)', () => {
  test.skip(({ page }) => !process.env.E2E_RUN_AUTH_TESTS, 'Set E2E_RUN_AUTH_TESTS=1')

  test('should register and create article', async ({ authenticatedPage }) => {
    // Navigate to new article page
    await authenticatedPage.goto('/dashboard/articles/new')

    // Fill article form
    const title = `Test Article ${Date.now()}`
    await authenticatedPage.locator('input[name="title"]').fill(title)

    const editor = authenticatedPage.locator('.ProseMirror')
    await editor.click()
    await editor.fill('Test content')

    // Save
    await authenticatedPage.click('button:has-text("Save")')

    // Should redirect to edit page
    await expect(authenticatedPage).toHaveURL(/\/dashboard\/articles\/[\w-]+/, { timeout: 15000 })
  })
})