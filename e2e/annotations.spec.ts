import { test, expect } from './fixtures'

/**
 * Annotation System E2E Tests
 *
 * These tests verify the annotation tooltip and related functionality
 * in a real browser environment. jsdom cannot simulate:
 * - Browser clearing selection on mousedown (race condition)
 * - Real window.getSelection() behavior
 * - Tooltip positioning based on selection rect
 *
 * Run with: pnpm test:e2e
 *
 * NOTE: These tests require:
 * 1. Public articles exist in the database
 * 2. Annotation features are enabled
 *
 * Tests will skip if conditions are not met.
 */

test.describe('Annotation Tooltip', () => {
  test.describe.configure({ mode: 'parallel' })

  // Helper to find a public article page
  async function navigateToPublicArticle(page: import('@playwright/test').Page) {
    // Try to find an existing public article
    await page.goto('/')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Look for article links
    const articleLink = page.locator('a[href^="/article/"]').first()
    const hasArticle = await articleLink.isVisible({ timeout: 5000 }).catch(() => false)

    if (hasArticle) {
      await articleLink.click()
      await page.waitForLoadState('networkidle')
      return true
    }

    return false
  }

  test('should show tooltip on text selection', async ({ page }) => {
    const found = await navigateToPublicArticle(page)

    // Skip if no public articles
    test.skip(!found, 'No public articles available for testing')

    // Find article content using the correct test id
    const articleContent = page.locator('[data-testid="article-content-container"]').first()
    const hasContent = await articleContent.isVisible({ timeout: 10000 }).catch(() => false)
    test.skip(!hasContent, 'Article content not available for testing')

    // Find text content within the article
    const text = articleContent.locator('.prose-immersive p, p').first()
    const hasText = await text.isVisible({ timeout: 5000 }).catch(() => false)
    test.skip(!hasText, 'No selectable text in article')

    // Triple click to select paragraph (more reliable)
    await text.click({ clickCount: 3 })

    // Wait for tooltip to appear
    const tooltip = page.locator('[data-annotation-tooltip="true"]')
    await expect(tooltip).toBeVisible({ timeout: 5000 })

    // Tooltip should have action buttons
    await expect(tooltip.locator('button:has-text("Highlight")')).toBeVisible()
    await expect(tooltip.locator('button:has-text("Comment")')).toBeVisible()
    await expect(tooltip.locator('button:has-text("Share")')).toBeVisible()
  })

  test('should preserve selection when clicking highlight (race condition test)', async ({
    page,
  }) => {
    const found = await navigateToPublicArticle(page)
    test.skip(!found, 'No public articles available for testing')

    const articleContent = page.locator('[data-testid="article-content-container"]').first()
    const hasContent = await articleContent.isVisible({ timeout: 10000 }).catch(() => false)
    test.skip(!hasContent, 'Article content not available for testing')

    const text = articleContent.locator('.prose-immersive p, p').first()
    const hasText = await text.isVisible({ timeout: 5000 }).catch(() => false)
    test.skip(!hasText, 'No selectable text in article')

    // Select text
    await text.click({ clickCount: 3 })

    // Get selected text before clicking button
    const selectedTextBefore = await page.evaluate(() => {
      const selection = window.getSelection()
      return selection?.toString() || ''
    })

    // Verify selection exists
    expect(selectedTextBefore.length).toBeGreaterThan(0)

    // Wait for tooltip
    const tooltip = page.locator('[data-annotation-tooltip="true"]')
    await expect(tooltip).toBeVisible({ timeout: 5000 })

    // Click highlight button
    const highlightButton = tooltip.locator('button:has-text("Highlight")')

    // Listen for highlight action (could be API call or visual change)
    const highlightPromise = page
      .waitForResponse(
        (resp) => resp.url().includes('highlight') || resp.url().includes('annotation'),
        { timeout: 10000 }
      )
      .catch(() => null) // May not make API call in test mode

    await highlightButton.click()

    // Wait for either highlight response or visual change
    await highlightPromise

    // Selection should have been processed (tooltip should close)
    await expect(tooltip).not.toBeVisible({ timeout: 3000 })
  })

  test('should open comment modal on comment click', async ({ page }) => {
    const found = await navigateToPublicArticle(page)
    test.skip(!found, 'No public articles available for testing')

    const articleContent = page.locator('[data-testid="article-content-container"]').first()
    const hasContent = await articleContent.isVisible({ timeout: 10000 }).catch(() => false)
    test.skip(!hasContent, 'Article content not available for testing')

    const text = articleContent.locator('.prose-immersive p, p').first()
    const hasText = await text.isVisible({ timeout: 5000 }).catch(() => false)
    test.skip(!hasText, 'No selectable text in article')

    // Select text
    await text.click({ clickCount: 3 })

    // Wait for tooltip
    const tooltip = page.locator('[data-annotation-tooltip="true"]')
    await expect(tooltip).toBeVisible({ timeout: 5000 })

    // Click comment button
    const commentButton = tooltip.locator('button:has-text("Comment")')
    await commentButton.click()

    // Comment modal should appear
    const commentModal = page.locator('[role="dialog"], [data-comment-modal="true"]')
    await expect(commentModal).toBeVisible({ timeout: 5000 })

    // Modal should have textarea and submit button
    await expect(commentModal.locator('textarea')).toBeVisible()
    await expect(commentModal.locator('button[type="submit"]')).toBeVisible()
  })

  test('should close tooltip on Escape key', async ({ page }) => {
    const found = await navigateToPublicArticle(page)
    test.skip(!found, 'No public articles available for testing')

    const articleContent = page.locator('[data-testid="article-content-container"]').first()
    const hasContent = await articleContent.isVisible({ timeout: 10000 }).catch(() => false)
    test.skip(!hasContent, 'Article content not available for testing')

    const text = articleContent.locator('.prose-immersive p, p').first()
    const hasText = await text.isVisible({ timeout: 5000 }).catch(() => false)
    test.skip(!hasText, 'No selectable text in article')

    // Select text
    await text.click({ clickCount: 3 })

    // Wait for tooltip
    const tooltip = page.locator('[data-annotation-tooltip="true"]')
    await expect(tooltip).toBeVisible({ timeout: 5000 })

    // Press Escape
    await page.keyboard.press('Escape')

    // Tooltip should close
    await expect(tooltip).not.toBeVisible({ timeout: 3000 })
  })

  test('should close tooltip on close button click', async ({ page }) => {
    const found = await navigateToPublicArticle(page)
    test.skip(!found, 'No public articles available for testing')

    const articleContent = page.locator('[data-testid="article-content-container"]').first()
    const hasContent = await articleContent.isVisible({ timeout: 10000 }).catch(() => false)
    test.skip(!hasContent, 'Article content not available for testing')

    const text = articleContent.locator('.prose-immersive p, p').first()
    const hasText = await text.isVisible({ timeout: 5000 }).catch(() => false)
    test.skip(!hasText, 'No selectable text in article')

    // Select text
    await text.click({ clickCount: 3 })

    // Wait for tooltip
    const tooltip = page.locator('[data-annotation-tooltip="true"]')
    await expect(tooltip).toBeVisible({ timeout: 5000 })

    // Click close button
    const closeButton = tooltip.locator('button[aria-label="Close"]')
    await closeButton.click()

    // Tooltip should close
    await expect(tooltip).not.toBeVisible({ timeout: 3000 })
  })

  test('should support keyboard shortcuts', async ({ page }) => {
    const found = await navigateToPublicArticle(page)
    test.skip(!found, 'No public articles available for testing')

    const articleContent = page.locator('[data-testid="article-content-container"]').first()
    const hasContent = await articleContent.isVisible({ timeout: 10000 }).catch(() => false)
    test.skip(!hasContent, 'Article content not available for testing')

    const text = articleContent.locator('.prose-immersive p, p').first()
    const hasText = await text.isVisible({ timeout: 5000 }).catch(() => false)
    test.skip(!hasText, 'No selectable text in article')

    // Select text
    await text.click({ clickCount: 3 })

    // Wait for tooltip
    const tooltip = page.locator('[data-annotation-tooltip="true"]')
    await expect(tooltip).toBeVisible({ timeout: 5000 })

    // Focus the tooltip
    await tooltip.click()

    // Press 'h' for highlight
    await page.keyboard.press('h')

    // Tooltip should close after action
    await expect(tooltip).not.toBeVisible({ timeout: 3000 })
  })
})

test.describe('Annotation Sidebar', () => {
  test('should display annotations in sidebar', async ({ page }) => {
    // Navigate to an article with annotations
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const articleLink = page.locator('a[href^="/article/"]').first()
    const hasArticle = await articleLink.isVisible({ timeout: 5000 }).catch(() => false)

    test.skip(!hasArticle, 'No public articles available for testing')

    await articleLink.click()
    await page.waitForLoadState('networkidle')

    // Look for annotation sidebar
    const sidebar = page.locator('[data-annotation-sidebar], .annotation-sidebar')

    // If sidebar exists, verify it shows annotations
    if (await sidebar.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Sidebar should have list of annotations
      const annotations = sidebar.locator('[data-annotation-item], .annotation-item')
      const count = await annotations.count()

      // If there are annotations, verify structure
      if (count > 0) {
        const firstAnnotation = annotations.first()
        await expect(
          firstAnnotation.locator('.highlighted-text, [data-highlighted-text]')
        ).toBeVisible()
      }
    }
  })
})

test.describe('Text Selection Hook', () => {
  test('should detect text selection correctly', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Create a simple test page dynamically
    await page.evaluate(() => {
      const testDiv = document.createElement('div')
      testDiv.id = 'selection-test'
      testDiv.innerHTML = '<p>Select this text for testing</p>'
      testDiv.style.padding = '20px'
      testDiv.style.margin = '20px'
      document.body.appendChild(testDiv)
    })

    const testElement = page.locator('#selection-test p')

    // Select text programmatically
    await testElement.selectText()

    // Verify selection
    const selectedText = await page.evaluate(() => {
      const selection = window.getSelection()
      return selection?.toString() || ''
    })

    expect(selectedText).toContain('Select this text')
  })

  test('should clear selection programmatically', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.evaluate(() => {
      const testDiv = document.createElement('div')
      testDiv.id = 'selection-test'
      testDiv.innerHTML = '<p>Select this text for testing</p>'
      document.body.appendChild(testDiv)
    })

    const testElement = page.locator('#selection-test p')
    await testElement.selectText()

    // Verify selection exists
    let selectedText = await page.evaluate(() => window.getSelection()?.toString() || '')
    expect(selectedText.length).toBeGreaterThan(0)

    // Clear selection
    await page.evaluate(() => window.getSelection()?.removeAllRanges())

    // Verify selection is cleared
    selectedText = await page.evaluate(() => window.getSelection()?.toString() || '')
    expect(selectedText).toBe('')
  })
})
