import { expect, Page } from '@playwright/test'

/**
 * Page Object Model for Article Editor page
 */
export class ArticleEditorPage {
  readonly page: Page
  readonly titleInput: ReturnType<Page['locator']>
  readonly editor: ReturnType<Page['locator']>
  readonly saveButton: ReturnType<Page['locator']>
  readonly publishButton: ReturnType<Page['locator']>
  readonly projectSelect: ReturnType<Page['locator']>

  constructor(page: Page) {
    this.page = page
    this.titleInput = page.locator('input[name="title"]')
    this.editor = page.locator('.ProseMirror')
    this.saveButton = page.locator('button:has-text("Save")')
    this.publishButton = page.locator('button:has-text("Publish")')
    this.projectSelect = page.locator('select[name="projectId"]')
  }

  async gotoNew() {
    await this.page.goto('/dashboard/articles/new')
  }

  async gotoEdit(articleId: string) {
    await this.page.goto(`/dashboard/articles/${articleId}/edit`)
  }

  async fillArticle(title: string, content: string, projectId?: string) {
    await this.titleInput.fill(title)

    // Click editor to focus, then type content
    await this.editor.click()
    await this.editor.fill(content)

    if (projectId) {
      await this.projectSelect.selectOption(projectId)
    }
  }

  async save() {
    await this.saveButton.click()
    // Wait for save confirmation
    await expect(this.page.locator('text=Saved')).toBeVisible({ timeout: 10000 })
  }

  async publish() {
    await this.publishButton.click()
    // Wait for publish modal
    await expect(this.page.locator('text=Publish Article')).toBeVisible()
  }
}