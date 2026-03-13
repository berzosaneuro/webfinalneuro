import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { posts as fallbackPosts } from '@/data/posts'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  const supabase = getSupabase()
  if (supabase) {
    try {
      if (slug) {
        const { data } = await supabase.from('biblioteca_posts').select('*').eq('slug', slug).single()
        if (data) return NextResponse.json(toPost(data))
      } else {
        const { data } = await supabase.from('biblioteca_posts').select('*').order('date', { ascending: false })
        if (data && data.length > 0) return NextResponse.json(data.map(toPost))
      }
    } catch {}
  }

  if (slug) {
    const p = fallbackPosts.find(x => x.slug === slug)
    return NextResponse.json(p ?? null)
  }
  return NextResponse.json(fallbackPosts)
}

function toPost(row: { slug: string; title: string; date: string; summary: string; content: string; exercise: string; free?: boolean }) {
  return {
    slug: row.slug,
    title: row.title,
    date: row.date || '',
    summary: row.summary || '',
    content: row.content || '',
    exercise: row.exercise || '',
    free: !!row.free,
  }
}
