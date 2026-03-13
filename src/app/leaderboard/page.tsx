'use client'

import { useState } from 'react'
import Container from '@/components/Container'
import FadeInSection from '@/components/FadeInSection'
import { Trophy, Flame, Eye, Crown, TrendingUp, Medal, Shield } from 'lucide-react'

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

const leaderboard: LeaderEntry[] = [
  { rank: 1, level: 'Maestr@', score: 97, streak: 180, badge: 'Nivel 10' },
  { rank: 2, level: 'Despiert@', score: 94, streak: 142, badge: 'Nivel 9' },
  { rank: 3, level: 'Despiert@', score: 91, streak: 98, badge: 'Nivel 9' },
  { rank: 4, level: 'Consciente', score: 88, streak: 87, badge: 'Nivel 8' },
  { rank: 5, level: 'Consciente', score: 85, streak: 76, badge: 'Nivel 8' },
  { rank: 6, level: 'Observador', score: 82, streak: 65, badge: 'Nivel 7' },
  { rank: 7, level: 'Observador', score: 79, streak: 54, badge: 'Nivel 7' },
  { rank: 8, level: 'Practicante', score: 74, streak: 43, badge: 'Nivel 6' },
  { rank: 9, level: 'Practicante', score: 71, streak: 38, badge: 'Nivel 6' },
  { rank: 10, level: 'Aprendiz', score: 67, streak: 28, badge: 'Nivel 5' },
  { rank: 47, level: 'Curioso', score: 34, streak: 5, badge: 'Nivel 3', isYou: true },
]

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <Trophy className="w-5 h-5 text-emerald-400" />
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />
  if (rank === 3) return <Medal className="w-5 h-5 text-cyan-400" />
  return <span className="text-text-muted text-sm font-mono w-5 text-center">{rank}</span>
}

export default function LeaderboardPage() {
  const [tab, setTab] = useState<'global' | 'semanal'>('global')

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
          </FadeInSection>
        </Container>
      </section>
    </div>
  )
}
