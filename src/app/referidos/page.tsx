'use client'

import { useState, useEffect } from 'react'
import Container from '@/components/Container'
import FadeInSection from '@/components/FadeInSection'
import { Gift, Copy, Check, Users, Crown, Share2, ChevronRight } from 'lucide-react'

export default function ReferidosPage() {
  const [copied, setCopied] = useState(false)
  const [code, setCode] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('neuro_referral_code')
    if (saved) {
      setCode(saved)
    } else {
      const newCode = 'NEURO-' + Math.random().toString(36).substring(2, 8).toUpperCase()
      localStorage.setItem('neuro_referral_code', newCode)
      setCode(newCode)
    }
  }, [])

  const referralLink = `https://berzosaneuro.com/r/${code}`

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Berzosa Neuro',
        text: 'Menos ruido en la cabeza, más claridad. Pruébalo gratis:',
        url: referralLink,
      }).catch(() => {})
    } else {
      copyLink()
    }
  }

  const stats = { invited: 3, active: 2, monthsFree: 2 }

  const rewards = [
    { friends: 1, reward: '1 mes Premium gratis', icon: Crown },
    { friends: 3, reward: '3 meses Premium gratis', icon: Crown },
    { friends: 5, reward: 'Acceso Masterclass exclusiva', icon: Gift },
    { friends: 10, reward: 'Premium de por vida', icon: Crown },
  ]

  return (
    <div className="relative overflow-hidden">
      <div className="orb w-64 h-64 bg-emerald-600 top-10 -right-20" />

      <section className="pt-8 md:pt-16 pb-4">
        <Container>
          <h1 className="font-heading text-3xl font-bold text-white mb-1 animate-fade-in">Programa de Referidos</h1>
          <p className="text-text-secondary text-sm animate-fade-in-up">Invita amigos. Gana Premium gratis.</p>
        </Container>
      </section>

      {/* Stats */}
      <section className="pb-5">
        <Container>
          <div className="grid grid-cols-3 gap-3">
            <div className="glass rounded-2xl p-4 text-center">
              <Users className="w-5 h-5 text-accent-blue mx-auto mb-1" />
              <span className="text-white font-bold text-lg">{stats.invited}</span>
              <p className="text-text-muted text-[10px]">Invitados</p>
            </div>
            <div className="glass rounded-2xl p-4 text-center">
              <Check className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <span className="text-white font-bold text-lg">{stats.active}</span>
              <p className="text-text-muted text-[10px]">Activos</p>
            </div>
            <div className="glass rounded-2xl p-4 text-center">
              <Crown className="w-5 h-5 text-violet-400 mx-auto mb-1" />
              <span className="text-white font-bold text-lg">{stats.monthsFree}</span>
              <p className="text-text-muted text-[10px]">Meses gratis</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Share card */}
      <section className="pb-6">
        <Container>
          <FadeInSection>
            <div className="glass rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent-blue/15 flex items-center justify-center">
                  <Gift className="w-6 h-6 text-accent-blue" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-white">Tu enlace personal</h2>
                  <p className="text-text-muted text-xs">Compártelo y gana recompensas</p>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-3 flex items-center gap-2 mb-4">
                <span className="text-text-secondary text-xs flex-1 truncate font-mono">{referralLink}</span>
                <button
                  onClick={copyLink}
                  className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-accent-blue/15 text-accent-blue active:scale-90 transition-transform"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={copyLink}
                  className="py-3 bg-white/5 rounded-xl text-white text-sm font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'Copiado' : 'Copiar'}
                </button>
                <button
                  onClick={shareLink}
                  className="py-3 bg-accent-blue rounded-xl text-white text-sm font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <Share2 className="w-4 h-4" />
                  Compartir
                </button>
              </div>
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Rewards ladder */}
      <section className="pb-6">
        <Container>
          <FadeInSection>
            <h2 className="font-heading font-semibold text-white text-lg mb-4">Recompensas</h2>
            <div className="space-y-3">
              {rewards.map((r, i) => {
                const unlocked = stats.active >= r.friends
                return (
                  <div
                    key={i}
                    className={`glass rounded-2xl p-4 flex items-center gap-3 ${unlocked ? '' : 'opacity-50'}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      unlocked ? 'bg-violet-500/15' : 'bg-white/5'
                    }`}>
                      <r.icon className={`w-5 h-5 ${unlocked ? 'text-violet-400' : 'text-text-muted'}`} />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${unlocked ? 'text-white' : 'text-text-secondary'}`}>{r.reward}</p>
                      <p className="text-text-muted text-xs">{r.friends} amigo{r.friends > 1 ? 's' : ''} activo{r.friends > 1 ? 's' : ''}</p>
                    </div>
                    {unlocked && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </div>
                )
              })}
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* How it works */}
      <section className="pb-12">
        <Container>
          <FadeInSection>
            <h2 className="font-heading font-semibold text-white text-lg mb-4">Cómo funciona</h2>
            <div className="glass rounded-2xl p-5 space-y-4">
              {[
                { step: '1', text: 'Comparte tu enlace personal con amigos' },
                { step: '2', text: 'Tu amigo se registra y empieza gratis' },
                { step: '3', text: 'Cuando se activa, tú recibes 1 mes Premium gratis' },
                { step: '4', text: 'Acumula amigos y desbloquea más recompensas' },
              ].map((s) => (
                <div key={s.step} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center text-accent-blue font-bold text-sm shrink-0">
                    {s.step}
                  </div>
                  <span className="text-text-secondary text-sm">{s.text}</span>
                </div>
              ))}
            </div>
          </FadeInSection>
        </Container>
      </section>
    </div>
  )
}
