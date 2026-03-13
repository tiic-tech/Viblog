import Link from 'next/link'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, ExternalLink } from 'lucide-react'

interface RecentArticlesProps {
  articles: Array<{
    id: string
    title: string
    slug: string
    status: string
    created_at: string
    projects: { name: string }[] | null
  }>
}

export function RecentArticles({ articles }: RecentArticlesProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Articles</CardTitle>
        <Link href="/dashboard/articles/new">
          <Button size="sm">
            <Plus className="mr-1 h-4 w-4" />
            New Article
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {articles.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No articles yet.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Start documenting your vibe coding journey!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <div
                key={article.id}
                className="hover:bg-muted/50 flex items-center justify-between rounded-lg border border-border p-3 transition-colors"
              >
                <div className="space-y-1">
                  <p className="font-medium">{article.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        article.status === 'published'
                          ? 'bg-success/10 text-success'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {article.status}
                    </span>
                    {article.projects?.[0]?.name && <span>{article.projects[0].name}</span>}
                    <span>{format(new Date(article.created_at), 'MMM d, yyyy')}</span>
                  </div>
                </div>
                <Link
                  href={`/dashboard/articles/${article.id}/edit`}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
