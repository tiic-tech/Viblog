import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card className={className}>
      <CardContent className="py-12 text-center">
        <Icon className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        {action && (
          <div className="mt-4">
            {action.href ? (
              <Link href={action.href}>
                <Button>{action.label}</Button>
              </Link>
            ) : action.onClick ? (
              <Button onClick={action.onClick}>{action.label}</Button>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Pre-built empty states for common use cases
import {
  FileText,
  FolderKanban,
  Search,
  Inbox,
  User,
} from 'lucide-react'

export function NoArticlesEmpty({ showAction = true }: { showAction?: boolean }) {
  return (
    <EmptyState
      icon={FileText}
      title="No articles yet"
      description="Write your first article to share your vibe coding experience."
      action={
        showAction
          ? { label: 'Write Article', href: '/dashboard/articles/new' }
          : undefined
      }
    />
  )
}

export function NoProjectsEmpty({ showAction = true }: { showAction?: boolean }) {
  return (
    <EmptyState
      icon={FolderKanban}
      title="No projects yet"
      description="Create your first project to start organizing your articles."
      action={
        showAction
          ? { label: 'Create Project', href: '/dashboard/projects/new' }
          : undefined
      }
    />
  )
}

export function NoSearchResultsEmpty({ query }: { query?: string }) {
  return (
    <EmptyState
      icon={Search}
      title="No results found"
      description={
        query
          ? `No articles found matching "${query}"`
          : 'Try adjusting your search or filters.'
      }
    />
  )
}

export function NoActivityEmpty() {
  return (
    <EmptyState
      icon={Inbox}
      title="No activity yet"
      description="Create a project or write an article to see your timeline."
    />
  )
}

export function NoUserArticlesEmpty() {
  return (
    <EmptyState
      icon={User}
      title="No published articles"
      description="This user hasn't published any articles yet."
    />
  )
}