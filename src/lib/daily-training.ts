/**
 * Entrenamiento Mental Diario (Método N.E.U.R.O.)
 * Ejercicios diarios de metacognición. Almacenamiento en localStorage.
 */

export const STORAGE_KEY = 'neuro_training_daily'
export const NEUROSCORE_POINTS = 10

export type DailyTrainingData = {
  completions: Record<string, boolean>
  streak: number
}

const EXERCISES: { title: string; text: string }[] = [
  { title: 'Observa un pensamiento sin reaccionar', text: 'Hoy, cuando aparezca un pensamiento, obsérvalo solo. No lo sigas. No lo juzgues. Di mentalmente "pensamiento" y deja que pase.' },
  { title: 'Tres respiraciones conscientes ante el estrés', text: 'Hoy, en algún momento de tensión, haz tres respiraciones profundas. Inhala 4 segundos, exhala 6. Eso activa tu corteza prefrontal.' },
  { title: 'Detecta un pensamiento automático', text: 'Hoy, identifica un pensamiento que aparezca sin que lo invites. Solo nómbralo: "automático". Eso ya es metacognición.' },
  { title: 'Observa una emoción sin etiquetarla', text: 'Hoy, cuando sientas una emoción intensa, obsérvala en el cuerpo sin ponerle nombre. Solo nota dónde está y cómo se mueve.' },
  { title: 'Pausa antes de reaccionar', text: 'Hoy, en un momento en que quieras reaccionar de golpe, haz una pausa de 5 segundos. Respira. Luego decide si actúas o no.' },
  { title: 'Un minuto de presencia', text: 'Hoy, durante 1 minuto, dirige la atención solo a tu respiración. Cada vez que te vayas, vuelve. Sin juzgar.' },
  { title: 'Escucha sin preparar respuesta', text: 'Hoy, en una conversación, escucha de verdad. Sin preparar tu respuesta mientras el otro habla. Solo recibe.' },
  { title: 'Nombra una emoción', text: 'Hoy, cuando notes una emoción fuerte, nómbrala en voz baja: "hay ansiedad" o "hay frustración". El etiquetado baja la intensidad.' },
  { title: 'Nota el cuerpo', text: 'Hoy, en cualquier momento, haz una pausa y siente tu cuerpo. Pies, manos, hombros. 30 segundos de escaneo rápido.' },
  { title: 'El observador', text: 'Hoy, imagina que eres un cielo y tus pensamientos son nubes. Observa una nube pasar sin subirte a ella.' },
]

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

function daySeed(dateStr: string): number {
  const [y, m, d] = dateStr.split('-').map(Number)
  return y * 10000 + m * 100 + d
}

/** Obtiene el ejercicio del día (determinístico por fecha) */
export function getTodayExercise(): { title: string; text: string } {
  const today = getToday()
  const seed = daySeed(today)
  const index = seed % EXERCISES.length
  return EXERCISES[index]
}

/** Carga datos de localStorage */
export function loadDailyTraining(): DailyTrainingData {
  if (typeof window === 'undefined') return { completions: {}, streak: 0 }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { completions: {}, streak: 0 }
}

/** Guarda datos en localStorage */
export function saveDailyTraining(data: DailyTrainingData): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

/** ¿Completado hoy? */
export function isCompletedToday(): boolean {
  const data = loadDailyTraining()
  const today = getToday()
  return !!data.completions[today]
}

/** Calcula la racha actual */
export function calculateStreak(completions: Record<string, boolean>): number {
  const dates = Object.keys(completions).filter((d) => completions[d]).sort().reverse()
  if (dates.length === 0) return 0
  const today = getToday()
  let streak = 0
  const d = new Date()
  for (let i = 0; i < 365; i++) {
    const dateStr = d.toISOString().split('T')[0]
    if (dates.includes(dateStr)) streak++
    else if (dateStr !== today) break
    d.setDate(d.getDate() - 1)
  }
  return streak
}
