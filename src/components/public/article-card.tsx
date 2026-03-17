import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Clock, Star, Eye, FolderKanban, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { PublicArticle } from '@/types/public'

/**
 * Public Article Card Component
 *
 * Design Philosophy: Effortel-inspired premium card with hover overlay
 * - 16:10 aspect ratio for cinematic image display
 * - Hover: translateY(-4px) + glow shadow + overlay reveal
 * - Premium easing: cubic-bezier(0.16, 1, 0.3, 1)
 *
 * Phase 11.4: Micro-interactions Polish
 */

interface PublicArticleCardProps {
  article: PublicArticle
}

export function PublicArticleCard({ article }: PublicArticleCardProps) {
  const publishedDate = article.published_at
    ? formatDistanceToNow(new Date(article.published_at), {
        addSuffix: true,
        locale: zhCN,
      })
    : ''

  return (
    <Link href={`/article/${article.slug}`} className="group/card block h-full">
      <Card
        className={cn(
          'relative h-full overflow-hidden',
          'border border-[rgba(255,255,255,0.08)]',
          'bg-bg-card',
          // Hover transform + shadow
          'transition-all duration-[300ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
          'hover:-translate-y-1',
          'hover:shadow-[0_12px_40px_rgba(0,0,0,0.4),0_0_30px_rgba(139,92,246,0.15)]',
          'hover:border-accent-primary/30'
        )}
      >
        {/* Tags Section */}
        <div className="flex flex-wrap gap-1.5 p-4 pb-0">
          {article.vibe_platform && (
            <Badge
              variant="secondary"
              className="text-xs bg-transparent border border-[rgba(255,255,255,0.15)] text-fg-secondary"
            >
              {article.vibe_platform}
            </Badge>
          )}
          {article.vibe_duration_minutes && (
            <Badge
              variant="outline"
              className="text-xs gap-1 bg-transparent border border-[rgba(255,255,255,0.15)] text-fg-secondary"
            >
              <Clock className="h-3 w-3" />
              {article.vibe_duration_minutes} min
            </Badge>
          )}
          {article.vibe_model && (
            <Badge
              variant="outline"
              className="text-xs bg-transparent border border-[rgba(255,255,255,0.15)] text-fg-secondary"
            >
              {article.vibe_model}
            </Badge>
          )}
        </div>

        {/* Image Section with Hover Overlay */}
        <div className="relative aspect-[16/10] overflow-hidden bg-bg-elevated">
          {article.cover_image ? (
            <img
              src={article.cover_image}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover/card:scale-105"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{
                background: article.projects?.color
                  ? `linear-gradient(135deg, ${article.projects.color}20, ${article.projects.color}40)`
                  : 'linear-gradient(135deg, hsl(var(--muted)), hsl(var(--muted-foreground)/10))',
              }}
            >
              <FolderKanban
                className="h-12 w-12 text-muted-foreground/30"
                style={{
                  color: article.projects?.color || undefined,
                }}
              />
            </div>
          )}

          {/* Project Badge */}
          {article.projects && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-bg-surface/80 px-2 py-1 text-xs backdrop-blur-sm">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: article.projects.color || '#6366f1' }}
              />
              <span className="font-medium">{article.projects.name}</span>
            </div>
          )}

          {/* Hover Overlay with Arrow (Checkpoint 11.4.2) */}
          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center',
              'bg-gradient-to-br from-accent-primary/80 to-accent-secondary/80',
              'opacity-0 transition-opacity duration-300',
              'group-hover/card:opacity-100'
            )}
          >
            <div
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-full',
                'bg-white/20 backdrop-blur-sm',
                'translate-y-4 opacity-0',
                'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                'group-hover/card:translate-y-0 group-hover/card:opacity-100'
              )}
            >
              <ArrowRight className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>

        {/* Description Section */}
        <CardContent className="p-4">
          <h3
            className={cn(
              'mb-2 line-clamp-2 text-lg font-semibold leading-tight',
              'transition-colors duration-150',
              'group-hover/card:text-accent-primary'
            )}
          >
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="mb-3 line-clamp-2 text-sm text-fg-secondary">
              {article.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between text-xs text-fg-muted">
            <div className="flex items-center gap-2">
              {article.profiles.avatar_url && (
                <img
                  src={article.profiles.avatar_url}
                  alt={article.profiles.display_name || article.profiles.username}
                  className="h-5 w-5 rounded-full"
                />
              )}
              <span className="font-medium text-fg-primary">
                {article.profiles.display_name || article.profiles.username}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5" />
                <span>{article.stars_count}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                <span>{article.views_count}</span>
              </div>
              <span>{publishedDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}