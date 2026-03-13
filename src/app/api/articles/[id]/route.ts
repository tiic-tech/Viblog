import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: article, error } = await supabase
    .from('articles')
    .select('*, projects(id, name, color)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json({ article })
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const {
    title,
    content,
    cover_image,
    project_id,
    platform,
    duration,
    model,
    original_prompt,
    ai_response_summary,
  } = body

  const updateData: Record<string, unknown> = {}

  if (title) {
    updateData.title = title
    updateData.slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') +
      '-' +
      Date.now().toString(36)
  }
  if (content !== undefined) updateData.content = content
  if (cover_image !== undefined) updateData.cover_image = cover_image || null
  if (project_id !== undefined) updateData.project_id = project_id || null
  if (platform !== undefined) updateData.vibe_platform = platform || null
  if (duration !== undefined) updateData.vibe_duration_minutes = duration || null
  if (model !== undefined) updateData.vibe_model = model || null
  if (original_prompt !== undefined) updateData.vibe_prompt = original_prompt || null
  if (ai_response_summary !== undefined) updateData.vibe_ai_response = ai_response_summary || null

  const { data: article, error } = await supabase
    .from('articles')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ article })
}

export async function DELETE(request: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase.from('articles').delete().eq('id', id).eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
