'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Article Card Skeleton - Premium Loading State
 *
 * Matches article-card.tsx structure:
 * - 16:10 aspect ratio for cinematic image display
 * - Premium shimmer effect for loading
 * - Same border and card styling
 */
export function ArticleCardSkeleton() {
  return (
    <Card className="relative h-full overflow-hidden border border-[rgba(255,255,255,0.08)] bg-bg-card">
      {/* Tags Section */}
      <div className="flex flex-wrap gap-1.5 p-4 pb-0">
        <Skeleton variant="shimmer" className="h-5 w-16 rounded-sm" />
        <Skeleton variant="shimmer" className="h-5 w-12 rounded-sm" />
        <Skeleton variant="shimmer" className="h-5 w-14 rounded-sm" />
      </div>

      {/* Image Section - 16:10 aspect ratio matches article-card */}
      <div className="relative aspect-[16/10] overflow-hidden bg-bg-elevated">
        <Skeleton variant="shimmer" className="h-full w-full" />
      </div>

      {/* Content Section */}
      <CardContent className="p-4">
        {/* Title */}
        <Skeleton variant="shimmer" className="mb-2 h-6 w-3/4" />

        {/* Excerpt */}
        <Skeleton variant="shimmer" className="mb-1 h-4 w-full" />
        <Skeleton variant="shimmer" className="mb-3 h-4 w-2/3" />

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Author */}
          <div className="flex items-center gap-2">
            <Skeleton variant="shimmer" className="h-5 w-5 rounded-full" />
            <Skeleton variant="shimmer" className="h-4 w-20" />
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3">
            <Skeleton variant="shimmer" className="h-4 w-8" />
            <Skeleton variant="shimmer" className="h-4 w-8" />
            <Skeleton variant="shimmer" className="h-4 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Feed Skeleton Grid
 *
 * Displays 6 article card skeletons in a responsive grid
 * Matches the layout of the actual article feed
 */
export function FeedSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  )
}
