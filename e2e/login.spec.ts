import { test, expect } from './fixtures'

test.describe('Login Flow', () => {
  test('should show login form', async ({ page }) => {
    await page.goto('/login')

    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[name="email"]', 'nonexistent@example.com')
    await page.fill('input[name="password"]', 'WrongPassword123!')
    await page.click('button[type="submit"]')

    // Should show error message
    await expect(page.locator('.text-destructive')).toBeVisible({ timeout: 10000 })
  })

  test('should have link to register page', async ({ page }) => {
    await page.goto('/login')

    const registerLink = page.locator('a[href="/register"]')
    await expect(registerLink).toBeVisible()
  })

  test('should have link to forgot password', async ({ page }) => {
    await page.goto('/login')

    const forgotLink = page.locator('a[href="/forgot-password"]')
    await expect(forgotLink).toBeVisible()
  })
})