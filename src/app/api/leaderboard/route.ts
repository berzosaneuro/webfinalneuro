import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

const LEVELS = [
  'Dormido', 'Inquieto', 'Curioso', 'Buscador', 'Aprendiz',
  'Practicante', 'Observador', 'Consciente', 'Despiert@', 'Maestr@',
]

function scoreToLevel(avgScore: number): number {
  if (avgScore <= 20) return 1
  if (avgScore <= 35) return 2
  if (avgScore <= 50) return 3
  if (avgScore <= 60) return 4
  if (avgScore <= 70) return 5
  if (avgScore <= 80) return 6
  if (avgScore <= 85) return 7
  if (avgScore <= 90) return 8
  if (avgScore <= 95) return 9
  return 10
}

function calcStreak(entries: { date: string; score: number }[]): number {
  if (entries.length === 0) return 0
  const byDate = new Map(entries.map(e => [e.date, e.score]))
  const today = new Date()
  let streak = 0
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const score = byDate.get(dateStr) ?? 0
    if (score > 0) streak++
    else if (i > 0) break
  }
  return streak
}

export async function GET(request: Request) {
  const supabase = getSupabase()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })

  const { searchParams } = new URL(request.url)
  const currentEmail = searchParams.get('email') || ''
  const mode = searchParams.get('mode') || 'global'

  const { data: rows, error } = await supabase
    .from('neuroscore_entries')
    .select('user_email, date, score')
    .order('date', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Error al cargar ranking' }, { status: 500 })
  }

  const byUser = new Map<string, { date: string; score: number }[]>()
  for (const r of rows || []) {
    if (!r.user_email) continue
    const list = byUser.get(r.user_email) || []
    list.push({ date: r.date, score: r.score ?? 0 })
    byUser.set(r.user_email, list)
  }

  const today = new Date().toISOString().split('T')[0]
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const weekStart = oneWeekAgo.toISOString().split('T')[0]

  const aggregated: { email: string; avgScore: number; streak: number; level: number }[] = []

  for (const [email, entries] of Array.from(byUser.entries())) {
    const relevant = mode === 'semanal'
      ? entries.filter(e => e.date >= weekStart && e.date <= today)
      : entries.slice(0, 90) // últimos ~3 meses para promedio global

    if (relevant.length === 0) continue

    const avgScore = relevant.reduce((s, e) => s + e.score, 0) / relevant.length
    const streak = calcStreak(entries)
    const level = scoreToLevel(avgScore)

    aggregated.push({ email, avgScore: Math.round(avgScore), streak, level })
  }

  aggregated.sort((a, b) => {
    if (b.avgScore !== a.avgScore) return b.avgScore - a.avgScore
    return b.streak - a.streak
  })

  const result = aggregated.slice(0, 50).map((a, i) => ({
    rank: i + 1,
    level: LEVELS[a.level - 1] ?? 'Curioso',
    score: a.avgScore,
    streak: a.streak,
    badge: `Nivel ${a.level}`,
    isYou: a.email === currentEmail,
  }))

  return NextResponse.json(result)
}
