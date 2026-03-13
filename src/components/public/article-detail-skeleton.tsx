'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function ArticleDetailSkeleton() {
  return (
    <article className="container py-8">
      {/* Cover Image Skeleton */}
      <div className="mb-8 aspect-video max-h-96 w-full overflow-hidden rounded-lg">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Header Skeleton */}
      <div className="space-y-4 mb-6">
        <Skeleton className="h-9 w-3/4" />
        <div className="flex flex-wrap items-center gap-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </div>

      {/* Actions Skeleton */}
      <div className="flex items-center gap-4 my-6">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-24" />
      </div>

      {/* Content Skeleton */}
      <div className="space-y-4 my-8">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </article>
  )
}