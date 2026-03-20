import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { dualAuthenticate } from '@/lib/auth/dual-auth'

/**
 * Get the appropriate Supabase client based on authentication method.
 */
function getSupabaseClient(authMethod: 'session' | 'mcp_api') {
  if (authMethod === 'mcp_api') {
    return createServiceRoleClient()
  }
  return createClient()
}

/**
 * Generate a URL-friendly slug from title
 */
function generateSlug(title: string): string {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80) // Limit length

  const timestamp = Date.now().toString(36)
  return `${baseSlug}-${timestamp}`
}

/**
 * Convert Markdown to HTML (basic conversion)
 */
function markdownToHtml(markdown: string): string {
  return (
    markdown
      // Headers
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Code blocks
      .replace(/```(\w+)?\n([\s\S]+?)```/g, '<pre><code class="language-$1">$2</code></pre>')
      // Inline code
      .replace(/`(.+?)`/g, '<code>$1</code>')
      // Links
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
      // Lists
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
      // Blockquotes
      .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p>')
      // Line breaks
      .replace(/\n/g, '<br>')
      // Wrap in paragraph
      .replace(/^/, '<p>')
      .replace(/$/, '</p>')
      // Clean up empty paragraphs
      .replace(/<p><\/p>/g, '')
      .replace(/<p>(<h[1-6]>)/g, '$1')
      .replace(/(<\/h[1-6]>)<\/p>/g, '$1')
      .replace(/<p>(<pre>)/g, '$1')
      .replace(/(<\/pre>)<\/p>/g, '$1')
      .replace(/<p>(<ul>)/g, '$1')
      .replace(/(<\/ul>)<\/p>/g, '$1')
      .replace(/<p>(<blockquote>)/g, '$1')
      .replace(/(<\/blockquote>)<\/p>/g, '$1')
  )
}

/**
 * POST /api/vibe-sessions/publish-article
 * Publish an article from session data
 */
export async function POST(request: Request) {
  try {
    const authResult = await dualAuthenticate(request)
    if (!authResult.success) {
      return authResult.error
    }
    const { userId, authMethod } = authResult.data

    const supabase = await getSupabaseClient(authMethod)

    const body = await request.json()

    // Validate required fields
    const {
      session_id,
      title,
      content,
      excerpt,
      visibility = 'private',
      cover_image,
      project_id,
    } = body

    if (!session_id || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: session_id, title, content' },
        { status: 400 }
      )
    }

    // Validate visibility
    const validVisibility = ['public', 'private', 'unlisted']
    if (!validVisibility.includes(visibility)) {
      return NextResponse.json(
        { error: `Invalid visibility. Must be one of: ${validVisibility.join(', ')}` },
        { status: 400 }
      )
    }

    // Verify session ownership
    const { data: session, error: sessionError } = await supabase
      .from('vibe_sessions')
      .select('id, platform, model')
      .eq('id', session_id)
      .eq('user_id', userId)
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Session not found or access denied' }, { status: 404 })
    }

    // Generate slug
    const slug = generateSlug(title)

    // Convert content to HTML if it's Markdown
    const htmlContent = content.startsWith('<') ? content : markdownToHtml(content)

    // publish_article always publishes the article (status: published)
    // visibility controls who can see it
    const status = 'published'
    const publishedAt = new Date().toISOString()

    // Create article
    const { data: article, error: articleError } = await supabase
      .from('articles')
      .insert({
        user_id: userId,
        title,
        slug,
        content: htmlContent,
        excerpt: excerpt || title.slice(0, 150),
        cover_image: cover_image || null,
        project_id: project_id || null,
        status,
        visibility,
        published_at: publishedAt,
        vibe_platform: session.platform,
        vibe_model: session.model,
      })
      .select('id, title, slug, status, visibility, published_at')
      .single()

    if (articleError) {
      console.error('Failed to create article:', articleError)
      return NextResponse.json(
        { error: `Failed to create article: ${articleError.message}` },
        { status: 500 }
      )
    }

    // Update session status to indicate it's been published
    await supabase.from('vibe_sessions').update({ status: 'completed' }).eq('id', session_id)

    // Construct article URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://viblog.tiic.tech'
    const articleUrl = `${baseUrl}/articles/${article.slug}`

    return NextResponse.json({
      success: true,
      article: {
        id: article.id,
        title: article.title,
        slug: article.slug,
        status: article.status,
        visibility: article.visibility,
        published_at: article.published_at,
        url: articleUrl,
      },
    })
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error('Publish article error:', errorMessage)
    return NextResponse.json(
      { error: `Failed to publish article: ${errorMessage}` },
      { status: 500 }
    )
  }
}
