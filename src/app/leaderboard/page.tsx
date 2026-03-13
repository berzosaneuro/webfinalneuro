'use client'

import { useState, useEffect } from 'react'
import Container from '@/components/Container'
import FadeInSection from '@/components/FadeInSection'
import { useUser } from '@/context/UserContext'
import { Trophy, Flame, Eye, TrendingUp, Medal, Loader2 } from 'lucide-react'

type LeaderEntry = {
  rank: number
  level: string
  score: number
  streak: number
  badge: string
  isYou?: boolean
}

const levels = [
  'Dormido', 'Inquieto', 'Curioso', 'Buscador', 'Aprendiz',
  'Practicante', 'Observador', 'Consciente', 'Despiert@', 'Maestr@',
]

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <Trophy className="w-5 h-5 text-emerald-400" />
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />
  if (rank === 3) return <Medal className="w-5 h-5 text-cyan-400" />
  return <span className="text-text-muted text-sm font-mono w-5 text-center">{rank}</span>
}

export default function LeaderboardPage() {
  const [tab, setTab] = useState<'global' | 'semanal'>('global')
  const [leaderboard, setLeaderboard] = useState<LeaderEntry[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useUser()

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (user?.email) params.set('email', user.email)
    params.set('mode', tab)
    fetch(`/api/leaderboard?${params}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setLeaderboard(Array.isArray(data) ? data : []))
      .catch(() => setLeaderboard([]))
      .finally(() => setLoading(false))
  }, [tab, user?.email])

  const you = leaderboard.find(e => e.isYou)

  return (
    <div className="relative overflow-hidden">
      <div className="orb w-64 h-64 bg-violet-600 top-10 -left-20" />

      <section className="pt-8 md:pt-16 pb-4">
        <Container>
          <h1 className="font-heading text-3xl font-bold text-white mb-1 animate-fade-in">Tabla de Consciencia</h1>
          <p className="text-text-secondary text-sm animate-fade-in-up">Anónimo. Sin ego. Solo niveles.</p>
        </Container>
      </section>

      {/* Your position */}
      {you && (
        <section className="pb-5">
          <Container>
            <div className="glass rounded-2xl p-4 flex items-center gap-3 border border-accent-blue/20">
              <div className="w-10 h-10 rounded-xl bg-accent-blue/15 flex items-center justify-center">
                <Eye className="w-5 h-5 text-accent-blue" />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">Tu posición: #{you.rank}</p>
                <p className="text-text-muted text-xs">{you.level} · NeuroScore: {you.score}</p>
              </div>
              <div className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-orange-400 text-sm font-bold">{you.streak}</span>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Tabs */}
      <section className="pb-5">
        <Container>
          <div className="flex gap-2">
            {(['global', 'semanal'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95 ${
                  tab === t ? 'bg-accent-blue text-white' : 'bg-white/5 text-text-secondary'
                }`}
              >
                {t === 'global' ? 'Global' : 'Esta semana'}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Levels guide */}
      <section className="pb-5">
        <Container>
          <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {levels.map((l, i) => (
              <div key={l} className="shrink-0 flex flex-col items-center gap-1 px-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold ${
                  i < 3 ? 'bg-red-500/15 text-red-400' :
                  i < 6 ? 'bg-cyan-500/15 text-cyan-400' :
                  i < 8 ? 'bg-emerald-500/15 text-emerald-400' :
                  'bg-accent-blue/15 text-accent-blue'
                }`}>
                  {i + 1}
                </div>
                <span className="text-text-muted text-[8px]">{l}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Leaderboard */}
      <section className="pb-12">
        <Container>
          <FadeInSection>
            {loading ? (
              <div className="flex items-center justify-center py-16 gap-2">
                <Loader2 className="w-6 h-6 text-accent-blue animate-spin" />
                <span className="text-text-muted text-sm">Cargando ranking...</span>
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="glass rounded-2xl p-8 text-center">
                <Trophy className="w-12 h-12 text-text-muted mx-auto mb-3" />
                <p className="text-text-secondary text-sm mb-1">Aún no hay datos</p>
                <p className="text-text-muted text-xs">Completa el NeuroScore para aparecer en el ranking</p>
              </div>
            ) : (
            <div className="space-y-2">
              {leaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className={`glass rounded-2xl p-4 flex items-center gap-3 ${
                    entry.isYou ? 'border border-accent-blue/30 bg-accent-blue/5' : ''
                  } ${entry.rank <= 3 ? 'py-5' : ''}`}
                >
                  <div className="w-8 flex items-center justify-center shrink-0">
                    <RankBadge rank={entry.rank} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-medium ${entry.isYou ? 'text-accent-blue' : 'text-white'}`}>
                        {entry.isYou ? 'Tú' : entry.level}
                      </p>
                      <span className="text-text-muted text-[10px] px-1.5 py-0.5 bg-white/5 rounded">{entry.badge}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-orange-400" />
                      <span className="text-text-secondary text-xs">{entry.streak}d</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-white text-sm font-bold">{entry.score}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </FadeInSection>
        </Container>
      </section>
    </div>
  )
}
