'use client'

import { useMemo, useState } from 'react'

import type { Annotation, AnnotationColor, AnnotationVisibility } from '@/types/annotation'

interface AnnotationSidebarProps {
  annotations: Annotation[]
  currentUserId: string
  onAnnotationClick: (annotation: Annotation) => void
}

const COLOR_STYLES: Record<AnnotationColor, string> = {
  default: 'bg-muted',
  yellow: 'bg-yellow-200 dark:bg-yellow-800',
  green: 'bg-green-200 dark:bg-green-800',
  blue: 'bg-blue-200 dark:bg-blue-800',
  pink: 'bg-pink-200 dark:bg-pink-800',
}

const VISIBILITY_ICONS: Record<AnnotationVisibility, string> = {
  public: 'Globe',
  private: 'Lock',
  followers: 'Users',
}

/**
 * Annotation Sidebar - The Gallery of Intellectual Presence
 *
 * Every annotation is a mark that the reader was here.
 * This sidebar displays their journey through the article,
 * creating a personal museum of thoughts and insights.
 *
 * Soul Mission: "I've been here. I've grown here. This is my intellectual home."
 */
export function AnnotationSidebar({
  annotations,
  currentUserId,
  onAnnotationClick,
}: AnnotationSidebarProps) {
  const [userFilter, setUserFilter] = useState<string>('all')
  const [visibilityFilter, setVisibilityFilter] = useState<string>('all')

  // Get unique users from annotations
  const uniqueUsers = useMemo(() => {
    const users = new Map<string, string>()
    annotations.forEach((ann) => {
      if (!users.has(ann.userId)) {
        users.set(
          ann.userId,
          ann.userId === currentUserId ? 'You' : `User ${ann.userId.slice(0, 4)}`
        )
      }
    })
    return users
  }, [annotations, currentUserId])

  // Filter annotations
  const filteredAnnotations = useMemo(() => {
    return annotations.filter((ann) => {
      if (userFilter !== 'all' && ann.userId !== userFilter) return false
      if (visibilityFilter !== 'all' && ann.visibility !== visibilityFilter) return false
      return true
    })
  }, [annotations, userFilter, visibilityFilter])

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <aside
      role="complementary"
      aria-label="Annotations"
      className="bg-surface flex h-full w-80 flex-col overflow-hidden border-l border-border"
    >
      {/* Header */}
      <div className="border-b border-border p-4">
        <h2 className="text-lg font-semibold text-foreground">Annotations</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {annotations.length} annotation{annotations.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Filters */}
      {annotations.length > 0 && (
        <div className="space-y-3 border-b border-border p-4">
          {/* User Filter */}
          <div>
            <label htmlFor="user-filter" className="sr-only">
              Filter by user
            </label>
            <select
              id="user-filter"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              aria-label="Filter by user"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="all">All users</option>
              {Array.from(uniqueUsers.entries()).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Visibility Filter */}
          <div>
            <label htmlFor="visibility-filter" className="sr-only">
              Filter by visibility
            </label>
            <select
              id="visibility-filter"
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value)}
              aria-label="Filter by visibility"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="all">All visibility</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="followers">Followers</option>
            </select>
          </div>
        </div>
      )}

      {/* Annotation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredAnnotations.length === 0 ? (
          <div className="p-4 text-center">
            {annotations.length === 0 ? (
              <>
                <p className="text-muted-foreground">No annotations yet</p>
                <p className="mt-1 text-sm text-muted-foreground/70">
                  Select text in the article to add your first annotation
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">No annotations match your filters</p>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filteredAnnotations.map((annotation) => (
              <li key={annotation.id}>
                <button
                  type="button"
                  onClick={() => onAnnotationClick(annotation)}
                  className="w-full p-4 text-left transition-colors hover:bg-muted/50"
                >
                  {/* Header: Color indicator + Content preview */}
                  <div className="flex items-start gap-3">
                    {/* Color Indicator */}
                    <div
                      data-testid={`color-indicator-${annotation.id}`}
                      className={`h-full min-h-[40px] w-1 rounded-full ${COLOR_STYLES[annotation.color]}`}
                    />

                    <div className="min-w-0 flex-1">
                      {/* Selected text preview */}
                      <p className="truncate text-sm italic text-muted-foreground">
                        &ldquo;{annotation.text}&rdquo;
                      </p>

                      {/* Comment */}
                      <p className="mt-1 line-clamp-2 text-foreground">{annotation.content}</p>

                      {/* Footer: Meta info */}
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        {/* Visibility */}
                        <span title={annotation.visibility}>
                          {annotation.visibility === 'public' && (
                            <svg
                              className="inline-block h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <title>public</title>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          )}
                          {annotation.visibility === 'private' && (
                            <svg
                              className="inline-block h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <title>private</title>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                              />
                            </svg>
                          )}
                          {annotation.visibility === 'followers' && (
                            <svg
                              className="inline-block h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <title>followers</title>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                              />
                            </svg>
                          )}
                        </span>

                        {/* Ownership */}
                        {annotation.userId === currentUserId && (
                          <span className="rounded bg-accent/20 px-1.5 py-0.5 text-[10px] font-medium text-accent">
                            Yours
                          </span>
                        )}

                        {/* Discussion count */}
                        {annotation.discussion && annotation.discussion.length > 0 && (
                          <span className="rounded bg-muted px-1.5 py-0.5 text-muted-foreground">
                            {annotation.discussion.length}
                          </span>
                        )}

                        {/* Date */}
                        <span className="ml-auto">{formatDate(annotation.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  )
}
