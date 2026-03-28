'use client'

import { useState, useEffect } from 'react'
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer'
import CertificadoDocument from './CertificadoDocument'
import { useUser } from '@/context/UserContext'
import { Download, Lock, Trophy, CreditCard, Award, CheckCircle } from 'lucide-react'

type CertProgress = {
  startDate: string | null
  completedDays: number[]
}

function loadCertProgress(): CertProgress {
  try {
    const raw = localStorage.getItem('neuro_cert_progress')
    if (raw) return JSON.parse(raw)
  } catch {}
  return { startDate: null, completedDays: [] }
}

const TOTAL_DAYS = 84

const PREMIUM_PERKS = [
  'Certificado con sello notarial',
  'Acreditación ICF (Coaching)',
  'Directorio oficial internacional',
  'Badge verificable en LinkedIn',
]

export default function CertificadoDashboard() {
  const { user } = useUser()
  const [progress, setProgress] = useState<CertProgress>({ startDate: null, completedDays: [] })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setProgress(loadCertProgress())
  }, [])

  if (!mounted) return null

  const daysCompleted = progress.completedDays.length
  const isUnlocked = daysCompleted >= TOTAL_DAYS
  const pct = Math.min(100, Math.round((daysCompleted / TOTAL_DAYS) * 100))

  const nombre = user?.nombre || 'Tu Nombre'
  const email = user?.email || 'user@berzosaneuro.com'
  const completionDate =
    isUnlocked && progress.completedDays.length > 0
      ? new Date(Math.max(...progress.completedDays)).toISOString()
      : new Date().toISOString()

  const certDoc = (
    <CertificadoDocument
      nombre={nombre}
      email={email}
      completionDate={completionDate}
    />
  )

  return (
    <div className="space-y-5">
      {/* Progress card */}
      <div className="glass rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/15 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6 text-violet-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-bold text-white">Tu Certificado N.E.U.R.O.</h3>
            <p className="text-text-muted text-xs">
              {isUnlocked
                ? '¡Certificación completada!'
                : `${daysCompleted} de ${TOTAL_DAYS} días completados`}
            </p>
          </div>
          {isUnlocked && <Trophy className="w-5 h-5 text-yellow-400 shrink-0" />}
        </div>

        {!isUnlocked && (
          <>
            <div className="w-full bg-white/5 rounded-full h-2 mb-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-accent-blue transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-text-muted text-xs text-right">
              {pct}% — Día {daysCompleted}/{TOTAL_DAYS}
            </p>
          </>
        )}
      </div>

      {/* PDF Preview — always visible */}
      <div className="glass rounded-3xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5">
          <p className="text-white text-sm font-semibold">Vista previa del certificado</p>
          <p className="text-text-muted text-xs">
            {isUnlocked
              ? 'Listo para descargar con tu nombre'
              : 'Se mostrará con tu nombre real al completar el programa'}
          </p>
        </div>

        <div className="relative block">
          <PDFViewer width="100%" height={360} showToolbar={false} style={{ border: 'none' }}>
            {certDoc}
          </PDFViewer>

          {!isUnlocked && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark-primary/50 backdrop-blur-[2px]">
              <Lock className="w-8 h-8 text-violet-400 mb-2" />
              <p className="text-white font-semibold text-sm">Se desbloquea en el Día 84</p>
              <p className="text-text-muted text-xs mt-1 text-center px-8">
                Completa las 12 semanas del programa para obtener y descargar tu certificado oficial
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Download button */}
      {isUnlocked ? (
        <PDFDownloadLink
          document={certDoc}
          fileName={`certificado-neuro-${nombre.toLowerCase().replace(/\s+/g, '-')}.pdf`}
          className="block"
        >
          {({ loading }) => (
            <button
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg"
            >
              <Download className="w-5 h-5" />
              {loading ? 'Preparando PDF...' : 'Descargar Certificado PDF'}
            </button>
          )}
        </PDFDownloadLink>
      ) : (
        <button
          disabled
          className="w-full py-4 bg-white/5 text-text-muted rounded-2xl font-semibold flex items-center justify-center gap-2 cursor-not-allowed"
        >
          <Lock className="w-5 h-5" />
          Descargar — requiere completar el Día 84
        </button>
      )}

      {/* Moderator role info (only when unlocked) */}
      {isUnlocked && (
        <div className="glass rounded-2xl p-4 border border-violet-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Rol Moderador activado</p>
              <p className="text-text-muted text-xs">
                Tu insignia de guía certificado está activa en el IA Coach
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mock payment — Próximamente */}
      <div className="glass rounded-3xl p-6 border border-white/5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5 text-text-muted" />
          </div>
          <div>
            <p className="text-white text-sm font-semibold flex items-center gap-2">
              Certificación Premium Acreditada
              <span className="text-[10px] bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full font-medium">
                Próximamente
              </span>
            </p>
            <p className="text-text-muted text-xs">Certificación internacional con acreditación oficial</p>
          </div>
        </div>

        <div className="space-y-2.5 mb-5 opacity-60">
          {PREMIUM_PERKS.map((item) => (
            <div key={item} className="flex items-center gap-2 text-text-muted text-xs">
              <Lock className="w-3.5 h-3.5 shrink-0" />
              {item}
            </div>
          ))}
        </div>

        <div className="text-center mb-4">
          <span className="text-2xl font-bold text-white opacity-40">297 &euro;</span>
          <p className="text-text-muted text-xs opacity-40">Pago único — disponible próximamente</p>
        </div>

        <button
          disabled
          className="w-full py-3 rounded-2xl bg-white/5 text-text-muted text-sm font-medium cursor-not-allowed"
        >
          Disponible próximamente
        </button>
      </div>
    </div>
  )
}
