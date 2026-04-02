/**
 * Personalización de UI por email (solo datos; sin React).
 * Para otro usuario/tema: EMAIL_TO_THEME + THEME_MESSAGES y bloques data-theme en CSS.
 */

export type PersonalizedThemeId = 'love'

/** Clave localStorage: si coincide con LOVE_THEME_HINT_VALUE, el layout aplica `data-theme="love"` antes del primer paint (solo cliente). */
export const LOVE_THEME_HINT_STORAGE_KEY = 'neuro_love_theme_hint'
export const LOVE_THEME_HINT_VALUE = '1'

const EMAIL_TO_THEME: Record<string, PersonalizedThemeId> = {
  'silvitabella87@gmail.com': 'love',
}

/** Notitas muy cortas, naturales y cariñosas (tipo mensajito). */
const LOVE_MESSAGES_CORE: readonly string[] = [
  'hola bonita 💖',
  'me gusta verte por aquí 🥺',
  'hoy estás especialmente guapa ✨',
  'no olvides sonreír 💕',
  'me encantas, así sin más',
  'pensando en ti un ratito',
  'tú sigue, que yo miro con orgullo',
  'un beso en la frente (imaginario)',
  'estás haciendo bien las cosas',
  'cómo vas, preciosa?',
  'te mando un abrazo suavecito',
  'gracias por existir en mi día',
  'eres mi favorita, ¿sabías?',
  'respira… ya está, eso es todo',
  'me alegra que estés aquí',
  'guapa incluso en pijama (lo sé)',
  'te quiero tal cual',
  'hoy te toca ser gentil contigo',
  'un te quiero en miniatura 💗',
  'sigue así, va bien de verdad',
  'mi niña bonita del wifi',
  'cuídate un poquito, ¿vale?',
  'estoy orgulloso de ti, en serio',
  'sonríe que se te nota la luz',
  'tú puedes, y yo te apoyo',
  'pequeño recuerdo: te adoro',
]

const LOVE_VALENTINES: readonly string[] = [
  'feliz san valentín, amor mío 💖',
  'hoy el mundo es más rosa contigo',
]

const LOVE_CHRISTMAS_EVE: readonly string[] = [
  'nochebuena contigo en el corazón 🕯️',
]

const LOVE_CHRISTMAS: readonly string[] = [
  'feliz navidad, bonita 🎀',
]

const LOVE_NEW_YEAR: readonly string[] = [
  'feliz año nuevo, mi amor ✨ aquí sigo yo',
]

/** Mitad de mes, mensaje ligero (no intrusivo). */
const LOVE_MID_MONTH: readonly string[] = [
  'mitad de mes y sigues siendo la mejor 💕',
]

function shuffleInPlace<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function timeOfDayExtras(now: Date): string[] {
  const h = now.getHours()
  if (h >= 5 && h < 12) {
    return [
      'buenos días, preciosa ☀️',
      'que tengas una mañana suavecita',
    ]
  }
  if (h >= 12 && h < 18) {
    return [
      'buenas tardes, bonita 💕',
      '¿agüita? te mando un besito también',
    ]
  }
  if (h >= 18 && h < 23) {
    return [
      'ya casi noche… descansa cuando puedas',
      'te pienso en modo cozy 🌙',
    ]
  }
  return [
    'duerme rico si puedes, te quiero 💖',
    'madrugada: un abrazo en silencio',
  ]
}

function calendarExtras(now: Date): string[] {
  const m = now.getMonth() + 1
  const d = now.getDate()
  const out: string[] = []
  if (m === 2 && d === 14) out.push(...LOVE_VALENTINES)
  if (m === 12 && d === 24) out.push(...LOVE_CHRISTMAS_EVE)
  if (m === 12 && d === 25) out.push(...LOVE_CHRISTMAS)
  if (m === 1 && d === 1) out.push(...LOVE_NEW_YEAR)
  if (d === 15 && m !== 2) out.push(...LOVE_MID_MONTH)
  return out
}

/** Bandera opcional para CSS (html[data-love-day="…"]). */
export function getLoveCalendarFlag(now: Date): string | null {
  const m = now.getMonth() + 1
  const d = now.getDate()
  if (m === 2 && d === 14) return 'valentines'
  if (m === 12 && d === 24) return 'christmas-eve'
  if (m === 12 && d === 25) return 'christmas'
  if (m === 1 && d === 1) return 'new-year'
  return null
}

/**
 * Pool de mensajes para modo amor: núcleo + hora + fechas, sin duplicados, orden aleatorio.
 * Llamar de nuevo cada X minutos para “vida” y cambios de franja horaria.
 */
export function buildLoveModeMessagePool(now: Date): string[] {
  const merged = [
    ...LOVE_MESSAGES_CORE,
    ...timeOfDayExtras(now),
    ...calendarExtras(now),
  ]
  const seen = new Set<string>()
  const unique: string[] = []
  for (const msg of merged) {
    if (!seen.has(msg)) {
      seen.add(msg)
      unique.push(msg)
    }
  }
  return shuffleInPlace(unique)
}

/** Fallback mínimo si algo falla al construir el pool */
export const THEME_MESSAGES: Record<PersonalizedThemeId, readonly string[]> = {
  love: LOVE_MESSAGES_CORE,
}

export function normalizeUserEmail(email: string | undefined | null): string {
  return (email ?? '').trim().toLowerCase()
}

export function resolvePersonalizedTheme(email: string | undefined | null): PersonalizedThemeId | null {
  const key = normalizeUserEmail(email)
  if (!key) return null
  return EMAIL_TO_THEME[key] ?? null
}

export function getMessagesForTheme(themeId: PersonalizedThemeId | null): readonly string[] {
  if (!themeId) return []
  return THEME_MESSAGES[themeId] ?? []
}

export function isLoveTheme(themeId: PersonalizedThemeId | null): boolean {
  return themeId === 'love'
}

/** Limpia hint + atributos de documento al cerrar sesión (solo navegador). */
export function clearLoveThemeHintAndDocument(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(LOVE_THEME_HINT_STORAGE_KEY)
  } catch {
    /* ignore */
  }
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (root.dataset.theme === 'love') {
    delete root.dataset.theme
  }
  delete root.dataset.loveDay
}

/** Mensaje único de la sorpresa (toques en el toast). */
export const LOVE_SURPRISE_MESSAGE =
  'ji ji… sabía que pincharías aquí 🥺💕 me encantas.'
