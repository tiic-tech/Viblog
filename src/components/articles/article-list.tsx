'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FileText, MoreVertical, Loader2, Eye, EyeOff, Lock, Globe } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { format } from 'date-fns'

interface Project {
  id: string
  name: string
  color: string | null
}

interface Article {
  id: string
  title: string
  slug: string
  content: string | null
  cover_image: string | null
  status: 'draft' | 'published'
  visibility: 'public' | 'private' | 'unlisted'
  vibe_platform: string | null
  vibe_duration_minutes: number | null
  vibe_model: string | null
  created_at: string
  updated_at: string
  published_at: string | null
  projects: Project | null
}

interface ArticleListProps {
  articles: Article[]
}

const visibilityIcons = {
  public: Globe,
  private: Lock,
  unlisted: EyeOff,
}

const statusColors = {
  draft: 'bg-yellow-500',
  published: 'bg-green-500',
}

export function ArticleList({ articles }: ArticleListProps) {
  const router = useRouter()
  const [deleteArticleId, setDeleteArticleId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteArticleId) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/articles/${deleteArticleId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete article')
      }

      setDeleteArticleId(null)
      router.refresh()
    } catch (error) {
      console.error('Delete error:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  if (articles.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No articles yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Write your first article to share your vibe coding experience.
          </p>
          <Link href="/dashboard/articles/new" className="mt-4 inline-block">
            <Button>Write Article</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => {
          const VisibilityIcon = visibilityIcons[article.visibility]
          return (
            <Card key={article.id} className="group">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${statusColors[article.status]}`} />
                  <div className="flex items-center gap-2">
                    <h3 className="line-clamp-1 font-semibold">{article.title}</h3>
                    <VisibilityIcon className="h-3 w-3 text-muted-foreground" />
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/articles/${article.id}/edit`}>Edit</Link>
                    </DropdownMenuItem>
                    {article.status === 'draft' && (
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/articles/${article.id}/publish`}>Publish</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="cursor-pointer text-destructive"
                      onSelect={() => setDeleteArticleId(article.id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                {article.projects && (
                  <div className="mb-2 flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: article.projects.color || '#6366f1' }}
                    />
                    <span className="text-xs text-muted-foreground">{article.projects.name}</span>
                  </div>
                )}
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {article.content
                    ? article.content.replace(/<[^>]*>/g, '').slice(0, 100)
                    : 'No content'}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {article.status === 'draft'
                      ? 'Draft'
                      : `Published ${article.published_at ? format(new Date(article.published_at), 'MMM d') : ''}`}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Updated {format(new Date(article.updated_at), 'MMM d, yyyy')}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <AlertDialog open={!!deleteArticleId} onOpenChange={() => setDeleteArticleId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this article? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="hover:bg-destructive/90 bg-destructive text-destructive-foreground"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
