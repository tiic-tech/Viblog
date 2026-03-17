import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Clock,
  Cpu,
  Zap,
  Calendar,
  Eye,
  Star,
  Folder,
  Sparkles,
  Timer,
  ArrowRight,
  FileText,
} from 'lucide-react'
import type { ArticleDetail, RelatedArticle } from '@/types/public'

interface ArticleHeaderProps {
  article: ArticleDetail
  relatedArticles?: RelatedArticle[]
}

export default function ArticleHeader({ article, relatedArticles }: ArticleHeaderProps) {
  const {
    profiles,
    projects,
    published_at,
    vibe_platform,
    vibe_duration_minutes,
    vibe_model,
    views_count,
    stars_count,
  } = article

  const authorName = profiles.display_name || profiles.username
  const authorInitials = authorName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const formattedDate = published_at
    ? new Date(published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return null
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  // Generate session narrative
  const sessionNarrative = () => {
    const parts: string[] = []
    if (vibe_duration_minutes) {
      parts.push(`a ${formatDuration(vibe_duration_minutes)} session`)
    }
    if (vibe_model) {
      parts.push(`with ${vibe_model}`)
    }
    if (vibe_platform) {
      parts.push(`on ${vibe_platform}`)
    }
    return parts.length > 0 ? `This article was crafted in ${parts.join(' ')}.` : null
  }

  return (
    <header className="space-y-6">
      {/* Title */}
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{article.title}</h1>

      {/* Excerpt */}
      {article.excerpt && (
        <p className="text-lg leading-relaxed text-muted-foreground">{article.excerpt}</p>
      )}

      {/* Vibe Journey Badges */}
      <div className="flex flex-wrap items-center gap-2">
        {vibe_platform && (
          <Badge
            variant="secondary"
            className="bg-accent-primary/15 hover:bg-accent-primary/25 gap-1.5 text-accent-primary"
          >
            <Zap className="h-3.5 w-3.5" />
            {vibe_platform}
          </Badge>
        )}
        {vibe_duration_minutes && (
          <Badge
            variant="outline"
            className="border-accent-secondary/30 gap-1.5 text-accent-secondary"
          >
            <Timer className="h-3.5 w-3.5" />
            {formatDuration(vibe_duration_minutes)}
          </Badge>
        )}
        {vibe_model && (
          <Badge
            variant="outline"
            className="border-accent-tertiary/30 gap-1.5 text-accent-tertiary"
          >
            <Cpu className="h-3.5 w-3.5" />
            {vibe_model}
          </Badge>
        )}
      </div>

      {/* Author Journey Card */}
      <div className="bg-bg-elevated/50 rounded-xl border border-border-subtle p-5">
        {/* Author Identity */}
        <div className="flex items-start justify-between gap-4">
          <Link
            href={`/u/${profiles.username}`}
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <Avatar className="border-accent-primary/20 h-12 w-12 border-2">
              <AvatarImage src={profiles.avatar_url || undefined} alt={authorName} />
              <AvatarFallback className="bg-accent-primary/10 font-medium text-accent-primary">
                {authorInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-fg-primary">{authorName}</div>
              <div className="text-sm text-fg-muted">@{profiles.username}</div>
            </div>
          </Link>

          {/* Quick Stats */}
          <div className="flex items-center gap-4 text-sm text-fg-muted">
            {formattedDate && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              <span>{views_count.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 text-accent-primary" />
              <span>{stars_count.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Author Bio */}
        {profiles.bio && (
          <p className="mt-4 text-sm leading-relaxed text-fg-secondary">{profiles.bio}</p>
        )}

        {/* Session Narrative */}
        {sessionNarrative() && (
          <div className="bg-accent-primary/5 mt-4 flex items-start gap-2 rounded-lg px-3 py-2">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent-primary" />
            <p className="text-sm italic text-fg-secondary">{sessionNarrative()}</p>
          </div>
        )}

        {/* Project Context */}
        {projects && (
          <div className="mt-4 flex items-center gap-2 border-t border-border-subtle pt-3">
            <Folder className="h-4 w-4 text-fg-muted" />
            <Link
              href={`/dashboard/projects/${projects.id}`}
              className="text-sm font-medium transition-colors hover:text-accent-primary"
              style={{ color: projects.color || undefined }}
            >
              {projects.name}
            </Link>
            {projects.description && (
              <>
                <span className="text-fg-dim">-</span>
                <span className="max-w-[200px] truncate text-sm text-fg-muted">
                  {projects.description}
                </span>
              </>
            )}
          </div>
        )}

        {/* Author's Other Works */}
        {relatedArticles && relatedArticles.length > 0 && (
          <div className="mt-4 border-t border-border-subtle pt-3">
            <h4 className="mb-2 text-sm font-medium text-fg-secondary">More from {authorName}</h4>
            <ul className="space-y-1.5">
              {relatedArticles.slice(0, 3).map((relatedArticle) => (
                <li key={relatedArticle.id}>
                  <Link
                    href={`/article/${relatedArticle.slug}`}
                    className="group flex items-center gap-2 text-sm text-fg-muted transition-colors hover:text-accent-primary"
                  >
                    <FileText className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate transition-colors group-hover:text-accent-primary">
                      {relatedArticle.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            {relatedArticles.length > 3 && (
              <Link
                href={`/u/${profiles.username}`}
                className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-accent-primary transition-opacity hover:opacity-80"
              >
                View all {relatedArticles.length} articles
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
