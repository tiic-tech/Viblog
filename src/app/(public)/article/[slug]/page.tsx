import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import ArticleHeader from '@/components/public/article-header'
import ArticleContent from '@/components/public/article-content'
import ArticleActions from '@/components/public/article-actions'
import RelatedArticles from '@/components/public/related-articles'
import type { ArticleDetail, RelatedArticle } from '@/types/public'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

// Generate SEO metadata
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/public/articles/${slug}`
    )

    if (!response.ok) {
      return { title: 'Article Not Found' }
    }

    const { article } = await response.json()
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
  } catch {
    return { title: 'Article' }
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params

  let article: ArticleDetail
  let relatedArticles: RelatedArticle[]

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/public/articles/${slug}`,
      { cache: 'no-store' }
    )

    if (!response.ok) {
      notFound()
    }

    const data = await response.json()
    article = data.article
    relatedArticles = data.related
  } catch {
    notFound()
  }

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
