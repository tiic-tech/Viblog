import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { PublicProfile, PublicArticle, PaginationInfo } from '@/types/public'

export async function GET(request: Request, { params }: { params: Promise<{ username: string }> }) {
  try {
    const { username } = await params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') || '12', 10), 50)

    const supabase = await createClient()

    // Fetch profile by username
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(
        `
        id,
        username,
        display_name,
        avatar_url,
        bio,
        website_url,
        github_username,
        twitter_username,
        created_at
      `
      )
      .eq('username', username)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Count articles
    const { count: articlesCount } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', profile.id)
      .eq('status', 'published')
      .eq('visibility', 'public')

    // Calculate total stars received
    const { data: starsData } = await supabase
      .from('articles')
      .select('stars_count')
      .eq('user_id', profile.id)
      .eq('status', 'published')
      .eq('visibility', 'public')

    type StarsQueryResult = { stars_count: number | null }

    const totalStars = (starsData || []).reduce(
      (sum: number, article: StarsQueryResult) => sum + (article.stars_count || 0),
      0
    )

    const publicProfile: PublicProfile = {
      id: profile.id,
      username: profile.username,
      display_name: profile.display_name,
      avatar_url: profile.avatar_url,
      bio: profile.bio,
      website_url: profile.website_url,
      github_username: profile.github_username,
      twitter_username: profile.twitter_username,
      created_at: profile.created_at,
      stats: {
        articles_count: articlesCount || 0,
        stars_received: totalStars,
      },
    }

    // Build articles query with count
    const offset = (page - 1) * limit

    const {
      data: articles,
      error: articlesError,
      count,
    } = await supabase
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
        vibe_model,
        stars_count,
        views_count,
        published_at,
        projects!articles_project_id_fkey (
          id,
          name,
          color
        )
      `,
        { count: 'exact' }
      )
      .eq('user_id', profile.id)
      .eq('status', 'published')
      .eq('visibility', 'public')
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (articlesError) {
      return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
    }

    const formattedArticles: PublicArticle[] = (articles || []).map((article: any) => {
      const project = Array.isArray(article.projects) ? article.projects[0] : article.projects

      return {
        id: article.id,
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        cover_image: article.cover_image,
        vibe_platform: article.vibe_platform,
        vibe_duration_minutes: article.vibe_duration_minutes,
        vibe_model: article.vibe_model,
        stars_count: article.stars_count,
        views_count: article.views_count,
        published_at: article.published_at || '',
        profiles: {
          username: profile.username,
          display_name: profile.display_name,
          avatar_url: profile.avatar_url,
        },
        projects: project || null,
      }
    })

    const pagination: PaginationInfo = {
      page,
      limit,
      total: count || 0,
      hasMore: offset + limit < (count || 0),
    }

    return NextResponse.json({
      profile: publicProfile,
      articles: formattedArticles,
      pagination,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
