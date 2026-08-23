import { NextResponse } from 'next/server'
import { getAuthUser, type AuthUser } from '@/lib/server-auth'

/** Requires role === 'master'. Returns null if authorized, 401 response otherwise. */
export async function requireMasterOr401(): Promise<NextResponse | null> {
  const user = await getAuthUser()
  if (user?.role === 'master') return null
  return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
}

/** Requires role === 'admin' OR 'master'. Returns null if authorized, 401 response otherwise. */
export async function requireAdminOr401(): Promise<NextResponse | null> {
  const user = await getAuthUser()
  if (user?.role === 'admin' || user?.role === 'master') return null
  return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
}

/** Requires any authenticated user. Returns user info or 401. */
export async function requireUserOr401(): Promise<{
  error: NextResponse | null
  user: AuthUser | null
  email: string
  nombre: string
}> {
  const user = await getAuthUser()
  if (!user) {
    return {
      error: NextResponse.json({ error: 'Sesión requerida' }, { status: 401 }),
      user: null,
      email: '',
      nombre: '',
    }
  }
  return { error: null, user, email: user.email, nombre: user.nombre }
}
