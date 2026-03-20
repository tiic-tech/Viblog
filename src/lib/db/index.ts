/**
 * Database module exports
 */

export {
  sql,
  checkConnection,
  closeConnection,
  // Sessions
  getSessions,
  getSession,
  createSession,
  updateSession,
  deleteSession,
  // Fragments
  getSessionFragments,
  createFragment,
  // Articles
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  // Projects
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  // Settings
  getSetting,
  setSetting,
  // LLM Config
  getLlmConfigs,
  getPrimaryLlmConfig,
  createLlmConfig,
  deleteLlmConfig,
  // Types
  type VibeSession,
  type SessionFragment,
  type Project,
  type Article,
  type ArticleParagraph,
  type LlmConfig,
  type UserSetting,
  type MetricsCache,
} from './client'