import { test, expect } from './fixtures'

/**
 * SplitPaneEditor E2E Tests
 *
 * These tests verify the SplitPaneEditor component in a real browser environment.
 * jsdom cannot simulate:
 * - SSR hydration mismatches
 * - Real DOM manipulation with Tiptap
 * - Split pane resize interactions
 * - Scroll synchronization
 *
 * Run with: E2E_RUN_AUTH_TESTS=1 pnpm test:e2e
 *
 * Note: These tests require authentication to access /dashboard/articles/new
 */

test.describe('SplitPaneEditor (requires E2E_RUN_AUTH_TESTS=1)', () => {
  test.skip(({ page }) => !process.env.E2E_RUN_AUTH_TESTS, 'Set E2E_RUN_AUTH_TESTS=1')

  test.describe.configure({ mode: 'parallel' })

  test('should render without SSR hydration errors', async ({ authenticatedPage }) => {
    // Listen for console errors
    const consoleErrors: string[] = []
    authenticatedPage.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    // Navigate to a page that uses the editor
    await authenticatedPage.goto('/dashboard/articles/new')

    // Wait for editor to be visible
    await expect(authenticatedPage.locator('[data-testid="editor-pane"]')).toBeVisible({ timeout: 10000 })

    // Check for hydration errors
    const hydrationErrors = consoleErrors.filter(
      (err) =>
        err.includes('hydration') ||
        err.includes('Hydration') ||
        err.includes('did not match')
    )

    expect(hydrationErrors).toHaveLength(0)
  })

  test('should display split pane layout', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/articles/new')

    // Both panes should be visible
    const editorPane = authenticatedPage.locator('[data-testid="editor-pane"]')
    const previewPane = authenticatedPage.locator('[data-testid="preview-pane"]')

    await expect(editorPane).toBeVisible({ timeout: 10000 })
    await expect(previewPane).toBeVisible()

    // Editor should have toolbar
    await expect(editorPane.locator('.sticky')).toBeVisible()

    // Preview should have content area
    await expect(previewPane.locator('.preview-content')).toBeVisible()
  })

  test('should toggle preview visibility', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/articles/new')

    const editorPane = authenticatedPage.locator('[data-testid="editor-pane"]')
    const previewPane = authenticatedPage.locator('[data-testid="preview-pane"]')
    const toggleButton = editorPane.locator('button[aria-label="Toggle preview"]')

    // Wait for editor
    await expect(editorPane).toBeVisible({ timeout: 10000 })

    // Preview should be visible initially
    await expect(previewPane).toBeVisible()

    // Click toggle button
    await toggleButton.click()

    // Preview should be hidden
    await expect(previewPane).not.toBeVisible()

    // Click again to show
    await toggleButton.click()

    // Preview should be visible again
    await expect(previewPane).toBeVisible()
  })

  test('should sync content between editor and preview', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/articles/new')

    const editorPane = authenticatedPage.locator('[data-testid="editor-pane"]')
    const previewPane = authenticatedPage.locator('[data-testid="preview-pane"]')
    const editor = editorPane.locator('.ProseMirror')

    // Wait for editor
    await expect(editor).toBeVisible({ timeout: 10000 })

    // Type in editor
    await editor.click()
    await editor.fill('Hello World')

    // Preview should show the content
    const previewContent = previewPane.locator('.preview-content')
    await expect(previewContent).toContainText('Hello World')
  })

  test('should apply bold formatting', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/articles/new')

    const editorPane = authenticatedPage.locator('[data-testid="editor-pane"]')
    const previewPane = authenticatedPage.locator('[data-testid="preview-pane"]')
    const editor = editorPane.locator('.ProseMirror')
    const boldButton = editorPane.locator('button').first() // Bold is first in toolbar

    // Wait for editor
    await expect(editor).toBeVisible({ timeout: 10000 })

    // Type text
    await editor.click()
    await editor.fill('Bold text')

    // Select all text
    await authenticatedPage.keyboard.down('Control')
    await authenticatedPage.keyboard.press('a')
    await authenticatedPage.keyboard.up('Control')

    // Click bold button
    await boldButton.click()

    // Preview should show bold text
    const previewContent = previewPane.locator('.preview-content')
    await expect(previewContent.locator('strong, b')).toBeVisible()
  })

  test('should have resizable divider', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/articles/new')

    const container = authenticatedPage.locator('.split-pane-container')
    const divider = container.locator('[role="separator"]')

    // Wait for editor
    await expect(container).toBeVisible({ timeout: 10000 })

    // Divider should be visible and have resize cursor
    await expect(divider).toBeVisible()
    await expect(divider).toHaveCSS('cursor', 'col-resize')
  })
})

test.describe('SplitPaneEditor - Tiptap Integration (requires E2E_RUN_AUTH_TESTS=1)', () => {
  test.skip(({ page }) => !process.env.E2E_RUN_AUTH_TESTS, 'Set E2E_RUN_AUTH_TESTS=1')

  test('should support markdown shortcuts', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/articles/new')

    const editor = authenticatedPage.locator('.ProseMirror')
    await expect(editor).toBeVisible({ timeout: 10000 })

    // Type heading shortcut
    await editor.click()
    await editor.fill('# Heading 1')

    // Should convert to heading
    const previewContent = authenticatedPage.locator('.preview-content')
    await expect(previewContent.locator('h1')).toBeVisible()
  })

  test('should support list creation', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/articles/new')

    const editor = authenticatedPage.locator('.ProseMirror')
    await expect(editor).toBeVisible({ timeout: 10000 })

    // Click bullet list button
    const bulletListButton = authenticatedPage.locator('button:has([class*="list"])').first()
    await bulletListButton.click()

    // Type list item
    await editor.click()
    await editor.fill('List item')

    // Preview should show list
    const previewContent = authenticatedPage.locator('.preview-content')
    await expect(previewContent.locator('ul, ol')).toBeVisible()
  })

  test('should support undo/redo', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/articles/new')

    const editor = authenticatedPage.locator('.ProseMirror')
    await expect(editor).toBeVisible({ timeout: 10000 })

    // Type text
    await editor.click()
    await editor.fill('Original text')

    // Undo button should be enabled
    const undoButton = authenticatedPage.locator('button:has([class*="undo"])').first()
    await expect(undoButton).toBeEnabled()

    // Click undo
    await undoButton.click()

    // Editor should be empty or have placeholder
    const content = await editor.textContent()
    expect(content?.trim()).toBeFalsy()
  })
})