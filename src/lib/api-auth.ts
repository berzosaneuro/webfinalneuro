import { NextResponse } from 'next/server'
import { getUserSessionFromHeaders } from '@/lib/server-auth'

export async function requireAdminOr401(request: Request): Promise<NextResponse | null> {
  const user = await getUserSessionFromHeaders(request.headers)
  if (user?.role === 'master') return null
  return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
}

export async function requireUserOr401(request: Request): Promise<{
  error: NextResponse | null
  email: string
  nombre: string
}> {
  const session = await getUserSessionFromHeaders(request.headers)
  if (!session) {
    return {
      error: NextResponse.json({ error: 'Sesión requerida' }, { status: 401 }),
      email: '',
      nombre: '',
    }
  }
  return { error: null, email: session.email, nombre: session.nombre }
}
