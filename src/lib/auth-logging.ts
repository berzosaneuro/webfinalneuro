/**
 * Registro estructurado de errores de Supabase Auth (API routes).
 * Formato: console.error("AUTH ERROR:", { context, message, status, name })
 */
export function logAuthError(context: string, error: unknown): void {
  const e = error as { message?: string; status?: number; name?: string }
  console.error('AUTH ERROR:', {
    context,
    message: e?.message,
    status: e?.status,
    name: e?.name,
  })
}

type AuthErrLike = { message: string; status?: number; name?: string; code?: string } | null

/** Payload seguro para JSON (sin session/JWT en logs). */
export function supabaseErrorFields(error: AuthErrLike): {
  supabaseError: string | null
  supabaseCode: string | null
} {
  if (!error) return { supabaseError: null, supabaseCode: null }
  const e = error as { message: string; code?: string }
  return { supabaseError: e.message, supabaseCode: e.code ?? null }
}

type SignInData = { user?: { id: string; email?: string } | null; session?: unknown } | null

/**
 * Vercel logs: resultado de signIn (sin credenciales ni tokens).
 * Formato alineado con diagnóstico: LOGIN RESULT: { data (resumido), error }
 */
export function logLoginResult(email: string, data: SignInData, error: AuthErrLike): void {
  const u = data?.user
  console.log('LOGIN RESULT:', {
    data: u
      ? { user: { id: u.id, email: u.email }, hasSession: Boolean(data?.session) }
      : { user: null, hasSession: Boolean(data?.session) },
    error: error
      ? { message: error.message, status: error.status, name: error.name, code: (error as { code?: string }).code }
      : null,
  })
}

export function logSignupResult(
  email: string,
  data: { user?: { id: string; email?: string } | null; session?: unknown } | null,
  error: AuthErrLike,
): void {
  const u = data?.user
  console.log('SIGNUP RESULT:', {
    data: u
      ? { user: { id: u.id, email: u.email }, hasSession: Boolean(data?.session) }
      : { user: null, hasSession: Boolean(data?.session) },
    error: error
      ? { message: error.message, status: error.status, name: error.name, code: (error as { code?: string }).code }
      : null,
  })
}
