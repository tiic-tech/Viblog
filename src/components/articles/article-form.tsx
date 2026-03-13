'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArticleEditor } from './article-editor'
import { Save, Loader2 } from 'lucide-react'

const articleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  content: z.string(),
  cover_image: z.string().url('Invalid URL').optional().or(z.literal('')),
  project_id: z.string().optional().or(z.literal('')),
  platform: z.string().optional().or(z.literal('')),
  duration: z.number().min(1).max(480).optional().or(z.nan()),
  model: z.string().max(100).optional().or(z.literal('')),
  original_prompt: z.string().optional().or(z.literal('')),
})

type ArticleFormData = z.infer<typeof articleSchema>

interface Project {
  id: string
  name: string
  color: string | null
}

interface ArticleFormProps {
  article?: {
    id: string
    title: string
    content: string | null
    cover_image: string | null
    project_id: string | null
    vibe_platform: string | null
    vibe_duration_minutes: number | null
    vibe_model: string | null
    vibe_prompt: string | null
  }
}

export function ArticleForm({ article }: ArticleFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [content, setContent] = useState(article?.content || '')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: article?.title || '',
      content: article?.content || '',
      cover_image: article?.cover_image || '',
      project_id: article?.project_id || '',
      platform: article?.vibe_platform || '',
      duration: article?.vibe_duration_minutes || undefined,
      model: article?.vibe_model || '',
      original_prompt: article?.vibe_prompt || '',
    },
  })

  const title = watch('title')

  // Fetch projects for dropdown
  useEffect(() => {
    const fetchProjects = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('projects').select('id, name, color').order('name')
      setProjects(data || [])
    }
    fetchProjects()
  }, [])

  // Auto-save every 30 seconds
  const saveDraft = useCallback(async () => {
    if (!title && !content) return

    setSaving(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      if (article) {
        const { error: updateError } = await supabase
          .from('articles')
          .update({
            title: title || 'Untitled',
            content,
          })
          .eq('id', article.id)

        if (updateError) throw updateError
      }

      setLastSaved(new Date())
    } catch (err) {
      console.error('Auto-save error:', err)
    } finally {
      setSaving(false)
    }
  }, [article, title, content])

  useEffect(() => {
    const interval = setInterval(saveDraft, 30000)
    return () => clearInterval(interval)
  }, [saveDraft])

  const onSubmit = async (data: ArticleFormData) => {
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError('You must be logged in')
        return
      }

      const articleData = {
        title: data.title,
        content: content,
        cover_image: data.cover_image || null,
        project_id: data.project_id || null,
        vibe_platform: data.platform || null,
        vibe_duration_minutes: data.duration || null,
        vibe_model: data.model || null,
        vibe_prompt: data.original_prompt || null,
      }

      if (article) {
        const { error: updateError } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', article.id)

        if (updateError) {
          setError(updateError.message)
          return
        }
      } else {
        const slug =
          data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '') +
          '-' +
          Date.now().toString(36)

        const { error: insertError } = await supabase.from('articles').insert({
          user_id: user.id,
          title: data.title,
          slug,
          content: content,
          cover_image: data.cover_image || null,
          project_id: data.project_id || null,
          vibe_platform: data.platform || null,
          vibe_duration_minutes: data.duration || null,
          vibe_model: data.model || null,
          vibe_prompt: data.original_prompt || null,
          status: 'draft',
        })

        if (insertError) {
          setError(insertError.message)
          return
        }
      }

      router.push('/dashboard/articles')
      router.refresh()
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>{article ? 'Edit Article' : 'New Article'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register('title')}
              disabled={loading}
              placeholder="Enter article title"
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Content</Label>
            <ArticleEditor content={content} onChange={setContent} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover_image">Cover Image URL</Label>
            <Input
              id="cover_image"
              {...register('cover_image')}
              disabled={loading}
              placeholder="https://example.com/image.png"
            />
            {errors.cover_image && (
              <p className="text-sm text-destructive">{errors.cover_image.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Vibe Coding Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project_id">Project</Label>
            <select
              id="project_id"
              {...register('project_id')}
              disabled={loading}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">No project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <select
                id="platform"
                {...register('platform')}
                disabled={loading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select platform</option>
                <option value="claude-code">Claude Code</option>
                <option value="cursor">Cursor</option>
                <option value="codex">Codex</option>
                <option value="trae">Trae</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                {...register('duration', { valueAsNumber: true })}
                disabled={loading}
                placeholder="30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              {...register('model')}
              disabled={loading}
              placeholder="e.g., Claude Sonnet, GPT-4"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="original_prompt">Original Prompt (optional)</Label>
            <textarea
              id="original_prompt"
              {...register('original_prompt')}
              disabled={loading}
              className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Paste your original prompt here..."
            />
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {saving && (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          )}
          {lastSaved && !saving && (
            <>
              <Save className="h-4 w-4" />
              Last saved: {lastSaved.toLocaleTimeString()}
            </>
          )}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Draft'}
          </Button>
        </div>
      </div>
    </form>
  )
}
