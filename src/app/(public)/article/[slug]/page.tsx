import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ArticleHeader from '@/components/public/article-header'
import ArticleContent from '@/components/public/article-content'
import ArticleActions from '@/components/public/article-actions'
import RelatedArticles from '@/components/public/related-articles'
import type { ArticleDetail, RelatedArticle } from '@/types/public'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

async function getArticle(slug: string) {
  const supabase = await createClient()

  const { data: article, error } = await supabase
    .from('articles')
    .select(
      `
      id,
      title,
      slug,
      excerpt,
      content,
      cover_image,
      vibe_platform,
      vibe_duration_minutes,
      vibe_model,
      vibe_prompt,
      vibe_ai_response,
      is_premium,
      price,
      stars_count,
      views_count,
      published_at,
      user_id,
      profiles!articles_user_id_fkey (
        id,
        username,
        display_name,
        avatar_url,
        bio
      ),
      projects!articles_project_id_fkey (
        id,
        name,
        color,
        description
      )
    `
    )
    .eq('slug', slug)
    .eq('status', 'published')
    .eq('visibility', 'public')
    .single()

  if (error || !article) {
    return null
  }

  // Increment views count
  await supabase
    .from('articles')
    .update({ views_count: (article.views_count || 0) + 1 })
    .eq('id', article.id)

  // Handle Supabase's array return for relationships
  const profile = Array.isArray(article.profiles) ? article.profiles[0] : article.profiles
  const project = Array.isArray(article.projects) ? article.projects[0] : article.projects

  const articleDetail: ArticleDetail = {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    cover_image: article.cover_image,
    vibe_platform: article.vibe_platform,
    vibe_duration_minutes: article.vibe_duration_minutes,
    vibe_model: article.vibe_model,
    vibe_prompt: article.vibe_prompt,
    vibe_ai_response: article.vibe_ai_response,
    is_premium: article.is_premium,
    price: article.price,
    stars_count: article.stars_count,
    views_count: (article.views_count || 0) + 1,
    published_at: article.published_at || '',
    profiles: profile || {
      id: '',
      username: 'unknown',
      display_name: null,
      avatar_url: null,
      bio: null,
    },
    projects: project || null,
  }

  // Fetch related articles
  const { data: relatedData } = await supabase
    .from('articles')
    .select(
      `
      id,
      title,
      slug,
      excerpt,
      cover_image,
      vibe_platform,
      vibe_duration_minutes,
      stars_count,
      views_count,
      published_at,
      profiles!articles_user_id_fkey (
        username,
        display_name,
        avatar_url
      )
    `
    )
    .eq('user_id', article.user_id)
    .eq('status', 'published')
    .eq('visibility', 'public')
    .neq('id', article.id)
    .order('published_at', { ascending: false })
    .limit(3)

  const relatedArticles: RelatedArticle[] = (relatedData || []).map((item) => {
    const relatedProfile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles
    return {
      id: item.id,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      cover_image: item.cover_image,
      vibe_platform: item.vibe_platform,
      vibe_duration_minutes: item.vibe_duration_minutes,
      stars_count: item.stars_count,
      views_count: item.views_count,
      published_at: item.published_at || '',
      profiles: {
        username: relatedProfile?.username || 'unknown',
        display_name: relatedProfile?.display_name || null,
        avatar_url: relatedProfile?.avatar_url || null,
      },
    }
  })

  return { article: articleDetail, related: relatedArticles }
}

// Generate SEO metadata
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const data = await getArticle(slug)

  if (!data) {
    return { title: 'Article Not Found' }
  }

  const { article } = data
  const authorName = article.profiles.display_name || article.profiles.username

  return {
    title: article.title,
    description: article.excerpt || `An article by ${authorName}`,
    authors: [{ name: authorName }],
    openGraph: {
      title: article.title,
      description: article.excerpt || `An article by ${authorName}`,
      type: 'article',
      publishedTime: article.published_at,
      authors: [authorName],
      images: article.cover_image ? [{ url: article.cover_image }] : [],
    },
    twitter: {
      card: article.cover_image ? 'summary_large_image' : 'summary',
      title: article.title,
      description: article.excerpt || `An article by ${authorName}`,
      images: article.cover_image ? [article.cover_image] : [],
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const data = await getArticle(slug)

  if (!data) {
    notFound()
  }

  const { article, related: relatedArticles } = data

  return (
    <article className="container py-8">
      {/* Cover Image */}
      {article.cover_image && (
        <div className="mb-8 aspect-video max-h-96 w-full overflow-hidden rounded-lg">
          <img
            src={article.cover_image}
            alt={article.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Header */}
      <ArticleHeader article={article} />

      {/* Actions */}
      <div className="my-6">
        <ArticleActions articleId={article.id} initialStarsCount={article.stars_count} />
      </div>

      {/* Premium Notice */}
      {article.is_premium && (
        <div className="my-6 rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
          <p className="text-sm font-medium">
            Premium Content
            {article.price && ` - $${(article.price / 100).toFixed(2)}`}
          </p>
          <p className="text-sm text-muted-foreground">
            This article is available for premium subscribers.
          </p>
        </div>
      )}

      {/* Content */}
      <div className="my-8">
        <ArticleContent content={article.content} />
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="mt-12 border-t pt-8">
          <RelatedArticles articles={relatedArticles} />
        </div>
      )}
    </article>
  )
}
