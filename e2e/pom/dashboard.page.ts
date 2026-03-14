import { expect, Page } from '@playwright/test'

/**
 * Page Object Model for Dashboard page
 */
export class DashboardPage {
  readonly page: Page
  readonly sidebar: ReturnType<Page['locator']>
  readonly projectsLink: ReturnType<Page['locator']>
  readonly articlesLink: ReturnType<Page['locator']>
  readonly timelineLink: ReturnType<Page['locator']>
  readonly userMenu: ReturnType<Page['locator']>
  readonly logoutButton: ReturnType<Page['locator']>

  constructor(page: Page) {
    this.page = page
    this.sidebar = page.locator('nav')
    this.projectsLink = page.locator('a[href="/dashboard/projects"]')
    this.articlesLink = page.locator('a[href="/dashboard/articles"]')
    this.timelineLink = page.locator('a[href="/dashboard/timeline"]')
    this.userMenu = page.locator('[data-testid="user-menu"]')
    this.logoutButton = page.locator('button:has-text("Logout")')
  }

  async goto() {
    await this.page.goto('/dashboard')
  }

  async navigateToProjects() {
    await this.projectsLink.click()
    await expect(this.page).toHaveURL(/\/dashboard\/projects/)
  }

  async navigateToArticles() {
    await this.articlesLink.click()
    await expect(this.page).toHaveURL(/\/dashboard\/articles/)
  }

  async navigateToTimeline() {
    await this.timelineLink.click()
    await expect(this.page).toHaveURL(/\/dashboard\/timeline/)
  }

  async logout() {
    await this.userMenu.click()
    await this.logoutButton.click()
    await expect(this.page).toHaveURL(/\/(login|\/)/)
  }
}