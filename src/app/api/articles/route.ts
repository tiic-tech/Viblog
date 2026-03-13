import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: articles, error } = await supabase
    .from('articles')
    .select('*, projects(id, name, color)')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ articles })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { title, content, cover_image, project_id, platform, duration, model, original_prompt } =
    body

  const slug =
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') +
    '-' +
    Date.now().toString(36)

  const { data: article, error } = await supabase
    .from('articles')
    .insert({
      user_id: user.id,
      title,
      slug,
      content: content || '',
      cover_image: cover_image || null,
      project_id: project_id || null,
      vibe_platform: platform || null,
      vibe_duration_minutes: duration || null,
      vibe_model: model || null,
      vibe_prompt: original_prompt || null,
      status: 'draft',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ article })
}
