import { test, expect } from './fixtures'

test.describe('Registration Flow', () => {
  test('should show registration form with all fields', async ({ page }) => {
    await page.goto('/register')

    // Verify form elements exist
    await expect(page.locator('input[name="username"]')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('should show error for password mismatch', async ({ page }) => {
    await page.goto('/register')

    await page.fill('input[name="username"]', 'testuser')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'Password123!')
    await page.fill('input[name="confirmPassword"]', 'DifferentPassword123!')
    await page.click('button[type="submit"]')

    // Should show validation error
    await expect(page.locator('text=/password.*match/i')).toBeVisible()
  })

  test('should show error for weak password', async ({ page }) => {
    await page.goto('/register')

    await page.fill('input[name="username"]', 'testuser')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', '123')
    await page.fill('input[name="confirmPassword"]', '123')
    await page.click('button[type="submit"]')

    // Should show validation error for password (min 8 characters)
    await expect(page.locator('.text-destructive')).toBeVisible()
  })

  test('should show error for short username', async ({ page }) => {
    await page.goto('/register')

    await page.fill('input[name="username"]', 'ab') // Only 2 chars
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'Password123!')
    await page.fill('input[name="confirmPassword"]', 'Password123!')
    await page.click('button[type="submit"]')

    // Should show validation error for username (min 3 characters)
    await expect(page.locator('.text-destructive')).toBeVisible()
  })
})