import Link from 'next/link'
import Container from '@/components/Container'
import Button from '@/components/Button'
import Card from '@/components/Card'
import {
  Brain,
  ChevronRight,
  Check,
  Crown,
  Wind,
  ArrowRight,
  Zap,
} from 'lucide-react'

const neuroCompact = [
  { letter: 'N', label: 'Neutraliza' },
  { letter: 'E', label: 'Entrena' },
  { letter: 'U', label: 'Ubícate' },
  { letter: 'R', label: 'Regula' },
  { letter: 'O', label: 'Observa' },
]

export default function EmpiezaPage() {
  return (
    <div className="relative overflow-hidden bg-dark-primary pb-24 md:pb-10">
      <div className="orb w-56 h-56 bg-accent-blue -top-8 -left-14 opacity-90" />

      {/* Hero — above the fold, un solo CTA principal */}
      <section className="relative pt-5 pb-5 md:pt-9 md:pb-7">
        <Container>
          <div className="max-w-[22rem] sm:max-w-lg">
            <p className="text-accent-blue text-[10px] font-bold tracking-[0.12em] uppercase mb-2">
              Berzosa Neuro · experiencia real, sin postureo
            </p>
            <h1 className="font-heading text-[1.65rem] sm:text-4xl font-black tracking-tight text-white leading-[1.12]">
              Por fuera aguantas. Por dentro no paras.
              <span className="block mt-1 text-text-primary">
                Imagina cerrar el día sin esa película mental en bucle.
              </span>
            </h1>
            <p className="text-text-secondary text-sm mt-3 leading-snug">
              No vengo de un laboratorio: pasé por esto y armé un camino claro. Sin tarjeta · acceso al instante.
            </p>
            <Button
              href="/registro"
              className="mt-5 w-full sm:w-auto !py-3.5 !px-6 !rounded-xl !font-bold !text-sm shadow-[0_0_22px_rgba(124,58,237,0.4)]"
            >
              Empieza gratis ahora <ChevronRight className="w-4 h-4 ml-1 inline" />
            </Button>
          </div>
        </Container>
      </section>

      {/* Problema — un solo bloque corto */}
      <section className="relative py-3 md:py-5">
        <Container>
          <Card className="!rounded-2xl !p-4 sm:!p-5">
            <div className="flex gap-3 items-start">
              <div className="w-9 h-9 rounded-xl bg-rose-500/15 flex items-center justify-center shrink-0">
                <Wind className="w-4 h-4 text-rose-400" />
              </div>
              <div className="min-w-0">
                <h2 className="font-heading font-bold text-white text-sm sm:text-base">
                  Scrolleas, respondes &quot;bien&quot;… y por dentro llevas semanas a fuego lento.
                </h2>
                <p className="text-text-secondary text-xs sm:text-sm mt-1.5 leading-snug">
                  Yo también lo disimulé un tiempo. Si te reconoces aquí, no estás solo.
                </p>
              </div>
            </div>
          </Card>
        </Container>
      </section>

      {/* Solución — N.E.U.R.O. muy compacto */}
      <section className="relative py-3 md:py-5">
        <Container>
          <div className="flex items-center gap-2 mb-2.5">
            <Zap className="w-4 h-4 text-accent-blue shrink-0" />
            <h2 className="font-heading font-bold text-white text-sm sm:text-base">
              No es &quot;piensa positivo&quot;: son 5 pasos que fui probando hasta que hubo orden.
            </h2>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {neuroCompact.map((step) => (
              <span
                key={step.letter}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent-blue/10 border border-accent-blue/20 text-[11px] sm:text-xs text-text-primary"
              >
                <span className="font-heading font-black text-accent-blue">{step.letter}</span>
                {step.label}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* Pricing — Premium primero, marco de valor + urgencia suave */}
      <section className="relative py-3 md:py-6">
        <Container>
          <p className="text-center text-amber-400/95 text-[11px] font-semibold tracking-wide uppercase mb-3">
            Plazas limitadas al abrir Premium · quien entra antes, antes transforma el hábito
          </p>

          <div className="max-w-md mx-auto flex flex-col gap-3">
            {/* Premium destacado */}
            <div className="relative rounded-2xl p-4 sm:p-5 border border-[#0066FF]/45 bg-dark-surface ring-1 ring-[#0066FF]/25 order-1">
              <div className="absolute -top-2.5 left-4 px-2.5 py-0.5 bg-[#0066FF] text-white text-[10px] font-bold rounded-full uppercase tracking-wide">
                El que más eligen
              </div>
              <div className="flex items-center justify-between gap-2 mt-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#0066FF]/12 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-[#60a5fa]" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-white text-base leading-tight">Premium</h3>
                    <p className="text-text-muted text-[11px]">Menos que un café al día · mucho más retorno</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-2xl sm:text-3xl font-black text-white">4,99 €</span>
                  <span className="text-text-muted text-xs block">/mes</span>
                </div>
              </div>
              <ul className="space-y-1.5 text-xs sm:text-sm mb-4">
                {[
                  'Sientes que por fin hay un hilo: 21 días que no te dejan colgado a la semana',
                  'Cuando todo se acelera, tienes una voz que te recuerda el siguiente paso',
                  'Cada día ves que no estás en el mismo sitio: tu registro lo cuenta claro',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span className="text-text-primary leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/planes"
                className="flex w-full py-3 rounded-xl font-bold text-xs sm:text-sm items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                style={{
                  background: 'rgba(0,102,255,0.14)',
                  border: '1px solid rgba(0,102,255,0.3)',
                  color: '#93c5fd',
                }}
              >
                Quiero reservar Premium <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Gratis — secundario */}
            <div className="rounded-2xl p-4 border border-dark-border bg-dark-surface/40 order-2">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-accent-blue" />
                  <span className="font-heading font-bold text-white text-sm">Gratis</span>
                </div>
                <span className="text-white font-black text-sm">0 €</span>
              </div>
              <p className="text-text-muted text-[11px] leading-snug mb-3">
                Sin tarjeta · Prueba el test y meditaciones gratis antes de decidir.
              </p>
              <Link
                href="/registro"
                className="block w-full py-2.5 rounded-xl text-center text-xs font-bold text-accent-blue bg-accent-blue/10 border border-accent-blue/25 active:scale-[0.98] transition-transform"
              >
                Probar gratis primero
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA final — compacto */}
      <section className="relative py-2 md:py-4">
        <Container>
          <div
            className="rounded-2xl p-4 sm:p-5 text-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(16,185,129,0.1))' }}
          >
            <div className="absolute inset-0 border border-accent-blue/20 rounded-2xl pointer-events-none" />
            <p className="relative font-heading font-bold text-white text-sm sm:text-base mb-1">
              Empieza hoy o sigues igual mañana.
            </p>
            <p className="relative text-text-secondary text-xs mb-4 leading-snug">
              Sin tarjeta · Empieza en 30 segundos · Acceso inmediato a lo gratis
            </p>
            <Button
              href="/registro"
              className="relative !py-3 !px-6 !rounded-xl !text-sm !font-bold w-full sm:w-auto"
            >
              Quiero dejar de sobrepensar <ChevronRight className="w-4 h-4 ml-1 inline" />
            </Button>
          </div>
        </Container>
      </section>

      {/* CTA fijo móvil — siempre visible para el pulgar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden tab-bar pt-2.5 px-0">
        <Container>
          <Link
            href="/registro"
            className="flex w-full items-center justify-center gap-2 py-3.5 rounded-xl bg-accent-blue text-white text-sm font-bold shadow-[0_0_24px_rgba(124,58,237,0.45)] active:scale-[0.98] transition-transform"
          >
            Empieza en 30 segundos — gratis
            <ChevronRight className="w-4 h-4" />
          </Link>
        </Container>
      </div>
    </div>
  )
}
